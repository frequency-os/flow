-- ════════════════════════════════════════════════════════════════════════════
-- Frequency · ПЕРЕГЛЯНУТИ І ПОВЕРНУТИ версію з історії
--
-- Запускати по ОДНОМУ блоку (виділити блок → Run), підставивши свої значення.
-- Блоки А–В лише читають. Блок Г змінює дані — тільки після того, як
-- вирішили з Claude, яку саме версію повертаємо.
-- ════════════════════════════════════════════════════════════════════════════

-- А) Скільки версій і скільки місця
select count(*) as versions,
       pg_size_pretty(pg_total_relation_size('private.history')) as size
  from private.history;

-- Б) Останні зміни (лише назви ключів і час — без вмісту)
select h.id, u.email, h.key, h.op, h.saved_at, pg_column_size(h.value) as bytes
  from private.history h
  left join auth.users u on u.id = h.user_id
 order by h.id desc
 limit 30;

-- В) Усі версії одного ключа однієї людини (підстав email і key)
select h.id, h.op, h.saved_at, h.value_updated_at, pg_column_size(h.value) as bytes
  from private.history h
  join auth.users u on u.id = h.user_id
 where u.email = 'ТВІЙ@EMAIL' and h.key = 'folders_cfg'
 order by h.id desc;

-- Г) ПОВЕРНУТИ версію № (id з блоку В). Змінює дані!
--    СПЕРШУ закрити Frequency на ВСІХ пристроях (змахнути з перемикача програм),
--    інакше відкритий застосунок чи незалита правка в кошику (sb_outbox) знову
--    перезапише повернуте. Після — відкрити ОДИН пристрій і перевірити.
--    Поточний вміст перед заміною сам потрапить в історію — тож і це можна відкотити.
--    updated_at = now(), щоб пристрої сприйняли повернуту версію як новішу.
--    Версію з op = 'DELETE' повертати лише свідомо: ключ міг бути прибраний навмисно.
insert into public.user_data (user_id, key, value, updated_at)
select h.user_id, h.key, h.value, now()
  from private.history h
 where h.id = 0   -- ← номер версії
on conflict (user_id, key) do update
  set value = excluded.value, updated_at = excluded.updated_at;

-- Д) СТЕРТИ історію однієї людини (видалення акаунта, «стерти все» на прохання).
--    Назавжди! Підставити email.
-- delete from private.history h
--  using auth.users u
--  where u.id = h.user_id and u.email = 'EMAIL@ЛЮДИНИ';
-- Якщо акаунт уже видалено (email нема) — за user_id:
-- delete from private.history where user_id = '00000000-0000-0000-0000-000000000000';
