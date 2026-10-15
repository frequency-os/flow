---
name: frequency-supabase
description: "Безпека хмари Frequency (Supabase): правила доступу RLS до таблиці user_data, ключі (публічний vs секретний), тихі пастки політик — UPDATE без SELECT, upsert без трьох дозволів, відсутній WITH CHECK, SECURITY DEFINER, user_metadata. Використовуй, коли торкаєшся 02-storage.js у частині sb.from(...), входу, видалення акаунта, нової таблиці чи сховища файлів у хмарі, SQL у Supabase; коли кажуть «RLS», «політики», «хмара бачить чужі дані», «чи захищена база», «аудит бази»."
---

# Supabase: хто що може читати й писати

Чекліст узято з офіційного скіла [supabase/agent-skills](https://github.com/supabase/agent-skills)
(MIT, коміт `c9be0e931b`, ліцензія — `LICENSE-supabase-agent-skills.txt` поруч),
перекладено й звужено до того, як Supabase живе у Frequency. Частини про Next.js,
Supabase CLI, MCP і швидкодію Postgres не взято — у нас їх нема.

## Як у нас влаштовано

- **Одна таблиця `user_data`**: рядок = (`user_id`, `key`, `value`, `updated_at`),
  унікальність `user_id,key`. Пише й читає лише `src/scripts/core/02-storage.js`
  через `sb.from('user_data')`: `select`, `upsert(… onConflict:'user_id,key')`, `delete`.
- **Клієнт** `supabase.min.js` у `src/vendor/` — версія зафіксована (CLAUDE.md).
- **Ключ у коді** — публічний (`sb_publishable_…`). Це нормально: він і мусить бути
  на сайті. Секретний ключ (`service_role` / `sb_secret_…`) — **ніколи** в `src/`,
  `dist/`, `worker/` чи git; gitleaks (крок 9 `npm run check`) на це вартує.
- **SQL політик у репо нема** — вони живуть у самій базі (панель Supabase).
  Claude до бази доступу не має: перевірку запускає Ярослав і кидає вивід.

## Головне: `.eq('user_id', …)` — це прохання, а не замок

Код фільтрує «лише мої рядки», але публічний ключ є в кожного, хто відкрив сайт.
Без RLS будь-хто з ним може попросити **всі** рядки всіх людей. Замок — це
**RLS (Row Level Security)** у базі: правило «рядок видно й можна міняти, лише
якщо `user_id` = той, хто увійшов».

## Чекліст (тихі пастки — помилки не буде, буде діра або «нічого не сталось»)

1. **RLS увімкнено** на `user_data` (і на кожній новій таблиці в схемі `public`).
2. **Політика на кожну дію**, яку робить код: `select`, `insert`, `update`, `delete`.
   Кожна — `to authenticated` **і** умова власника:
   `using ( (select auth.uid()) = user_id )`.
   Лише `to authenticated` без умови = «будь-хто, хто увійшов, бачить усіх».
3. **UPDATE мовчки не працює без політики SELECT** — 0 змінених рядків, без помилки.
4. **`upsert` потребує трьох дозволів: INSERT + SELECT + UPDATE.** Бракує одного —
   нові рядки пишуться, а оновлення мовчки ні. Схоже на «синк губить зміни».
5. **UPDATE (і INSERT) — з `with check ( (select auth.uid()) = user_id )`.**
   Без нього можна переписати `user_id` рядка на чужий — підкинути дані іншій людині.
6. **`auth.role()` — застаріле**, ламається при анонімному вході. Писати `to authenticated`.
7. **`SECURITY DEFINER` функції обходять RLS.** Не додавати його, щоб «прибрати
   помилку доступу». Функція з ним у `public` доступна кожному.
8. **Представлення (view) обходять RLS** — лише `with (security_invoker = true)`.
9. **`user_metadata` не можна брати для рішень про доступ** — людина може його
   змінити. У нас він лише для імені й аватарки (`29-more-screen.js`,
   `41-journal.js`, `05-spaces.js`) — так і має лишатись.
10. **Видалення акаунта не скасовує вже видані токени входу.** Перед видаленням —
    вийти/відкликати сесії (важливо для App Store: «видалити акаунт»).
11. **Сховище файлів (Storage)**, якщо з'явиться: заміна файлу теж потребує
    INSERT + SELECT + UPDATE.

## Як перевірити (лише читання — у SQL Editor панелі Supabase, запускає Ярослав)

```sql
-- 1) Чи ввімкнено RLS на таблиці
select relname, relrowsecurity as rls_on, relforcerowsecurity as rls_forced
from pg_class where relname = 'user_data';

-- 2) Які політики є: дія, ролі, умова, with check
select policyname, cmd, roles, qual, with_check
from pg_policies where tablename = 'user_data' order by cmd;
```

Звірити з еталоном нижче: має бути `rls_on = true` і політики на SELECT, INSERT,
UPDATE, DELETE з умовою власника; в UPDATE і INSERT заповнене `with_check`.

**Живий тест «чужий рядок»** (найчесніший): увійти на сайті тестовим акаунтом,
відкрити консоль і **прямо попросити чужі рядки**. Клієнт у `02-storage.js`
закритий (`let sb` усередині функції), тож створюємо свій — він підхопить ту саму
сесію входу; адресу й публічний ключ взяти з `SB_URL` / `SB_KEY` у `02-storage.js`:

```js
const c = supabase.createClient('<SB_URL>', '<SB_KEY>');
const me = (await c.auth.getUser()).data.user.id;
(await c.from('user_data').select('user_id,key').neq('user_id', me).limit(5)).data
```

Має прийти `[]`. Будь-який рядок із чужим `user_id` = діра в RLS.

**Автотест (головний доказ):** `npm run test:rls` — входить двома тестовими
акаунтами (`tools/bin/rls-test.env`, git не бачить) і пробує 13 речей: B читає,
змінює, видаляє, вставляє від імені A, upsert на ключ A, переписує свій рядок на
A; без входу — читання й запис. Код 0 = «замок тримає». Перший прогін
16.10.2026: 13/13. Ганяти після будь-якої зміни політик чи таблиць.

## Еталон політик (для звірки, не запускати без рішення)

```sql
alter table public.user_data enable row level security;

create policy "own rows: select" on public.user_data for select
  to authenticated using ( (select auth.uid()) = user_id );
create policy "own rows: insert" on public.user_data for insert
  to authenticated with check ( (select auth.uid()) = user_id );
create policy "own rows: update" on public.user_data for update
  to authenticated using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );
create policy "own rows: delete" on public.user_data for delete
  to authenticated using ( (select auth.uid()) = user_id );
```

## Історія змін (`private.history`)

Тригер `user_data_keep_history` (`tools/sql/01-history.sql`) перед кожною зміною
чи видаленням рядка `user_data` кладе стару версію в закриту схему `private`:
20 останніх версій ключа + остання версія кожного дня, щонайменше 30 днів;
фото — лише видалення, 1 версія. Однакові перезаписи не пишуться. Помилка
історії не зупиняє запис. З сайту історію не видно.

- **Щось зникло / перезаписалось** → `tools/sql/history-restore.sql`: блоки А–В
  (лише читання) показують версії; блок Г повертає — лише після рішення
  Ярослава і закривши Frequency на всіх пристроях.
- **Видалення акаунта / прохання стерти все** → блок Д (історія людини), інакше
  копії лежать до 30 днів (так і написано в чернетці політики приватності).
- **Прибрати тригер** → `tools/sql/01-history-undo.sql` (таблиця лишається).
- Перевірено 16.10.2026 на PGlite 0.5.10 (22/22): ліміти, фото, 30 днів, поломка
  історії не ламає запис, роль `authenticated` не читає `private`, RLS, Г, відкат.

## Правила для Claude

- **Політики в базі не міняти самому.** Будь-який SQL, що змінює базу, — задум,
  «так» Ярослава, і лише потім Ярослав запускає. Перед цим — знімок даних.
- Нова таблиця / новий ключ у хмарі → спершу цей чекліст, потім
  `/frequency-migration` і рецензент `data-safety-reviewer`.
- Знайшов діру → не латати в коді (`.eq` не захищає), а описати Ярославу, яку
  політику бракує, з SQL для звірки.
