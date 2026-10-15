-- ════════════════════════════════════════════════════════════════════════════
-- Frequency · ІСТОРІЯ ЗМІН у хмарі (Supabase)
--
-- Що робить: перед кожною ЗМІНОЮ чи ВИДАЛЕННЯМ рядка в public.user_data база
-- кладе стару версію в private.history. Тихе перекриття («папки губляться»)
-- стає можна побачити й відкотити (див. history-restore.sql).
--
-- Як запускати: Supabase → SQL Editor → New query → вставити ВЕСЬ файл → Run.
-- Можна запускати повторно — нічого не задвоїться.
-- Прибрати: 01-history-undo.sql.
--
-- Гарантії:
--  • public.user_data цей файл НЕ змінює — лише додає копії в іншу таблицю.
--  • Якщо запис історії з будь-якої причини зламається, зміна в user_data
--    однаково пройде (помилку ковтає блок EXCEPTION) — синк не постраждає.
--  • private не відкрита для сайту: ні прочитати, ні записати історію з
--    браузера не можна; лише з панелі Supabase.
--
-- Скільки тримає: звичайні ключі — останні 20 версій кожного + остання версія
-- кожного дня; фото (photo:…) — лише при видаленні, 1 версія (вони великі).
-- Старше 30 днів прибирається, але лише коли хтось пише в базу (pg_cron нема) —
-- тож «щонайменше 30 днів», а в тишу копії лежать довше.
--
-- Приватність: «Стерти все з акаунта» і видалення людини теж лишають копії
-- тут до 30 днів. Стерти їх одразу — блок Д у history-restore.sql.
--
-- ПЕРЕД ПЕРШИМ ЗАПУСКОМ — перевірка лише на читання (Claude дасть запит):
-- унікальний індекс (user_id, key), власник user_data = postgres, схеми private ще нема.
-- ════════════════════════════════════════════════════════════════════════════

-- 1) Закрита схема і таблиця історії
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.history (
  id               bigint generated always as identity primary key,
  row_id           uuid,                    -- id рядка в user_data
  user_id          uuid not null,
  key              text not null,
  value            jsonb,                   -- вміст ДО зміни
  value_updated_at timestamptz,             -- updated_at цієї версії (з телефона)
  op               text not null check (op in ('UPDATE', 'DELETE')),
  saved_at         timestamptz not null default now()   -- коли база її зберегла
);
create index if not exists history_user_key_idx on private.history (user_id, key, id desc);
create index if not exists history_saved_at_idx on private.history (saved_at);

-- RLS без жодної політики = через API не видно нічого (додатковий замок).
alter table private.history enable row level security;
revoke all on private.history from public, anon, authenticated;

-- 2) Функція, яку викликає тригер
-- security definer: виконується з правами власника (postgres), бо сайт
-- (роль authenticated) до private доступу не має — і не повинен мати.
-- search_path = '' і повні імена — щоб її не можна було «підсунути» чужою таблицею.
create or replace function private.keep_history()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  keep int := case when old.key like 'photo:%' then 1 else 20 end;
begin
  begin
    -- синк часто перезаписує те саме — таке не зберігаємо
    if tg_op = 'UPDATE' and old.value is not distinct from new.value then
      return null;
    end if;
    -- фото великі й майже не змінюються: бережемо лише видалення
    if tg_op = 'UPDATE' and old.key like 'photo:%' then
      return null;
    end if;

    insert into private.history (row_id, user_id, key, value, value_updated_at, op)
    values (old.id, old.user_id, old.key, old.value, old.updated_at, tg_op);

    -- лишаємо останні `keep` версій цього ключа цієї людини
    -- ПЛЮС останню версію кожного дня: інакше 20 швидких правок після
    -- «заглушка затерла папки» витіснили б гарну вчорашню версію.
    -- (фото — keep = 1, без денних копій)
    delete from private.history h
     where h.user_id = old.user_id
       and h.key = old.key
       and h.id <= coalesce((
             select h2.id from private.history h2
              where h2.user_id = old.user_id and h2.key = old.key
              order by h2.id desc
              offset keep limit 1), 0)
       and (keep = 1 or exists (
             select 1 from private.history h3
              where h3.user_id = h.user_id and h3.key = h.key
                and h3.saved_at::date = h.saved_at::date
                and h3.id > h.id));

    -- і все, що старше 30 днів, у всіх (індекс по saved_at робить це дешевим)
    delete from private.history h
     where h.saved_at < now() - interval '30 days';
  exception when others then
    raise warning 'Frequency keep_history: %', sqlerrm;   -- історія не вийшла, але запис іде далі
  end;
  return null;   -- для AFTER-тригера значення не важить
end;
$$;

-- Функцію тригера не можна викликати напряму, але про всяк випадок:
revoke all on function private.keep_history() from public, anon, authenticated;

-- 3) Тригер: ПІСЛЯ зміни чи видалення (тож записуємо лише те, що справді сталося)
-- upsert із сайту (insert … on conflict do update) теж його запускає.
drop trigger if exists user_data_keep_history on public.user_data;
create trigger user_data_keep_history
  after update or delete on public.user_data
  for each row execute function private.keep_history();

-- 4) Перевірка: має показати 1 тригер і 0 (або скільки вже є) версій
select
  (select count(*) from pg_trigger
    where tgrelid = 'public.user_data'::regclass and tgname = 'user_data_keep_history') as trigger_installed,
  (select count(*) from private.history) as versions_saved;
