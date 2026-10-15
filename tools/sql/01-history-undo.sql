-- ════════════════════════════════════════════════════════════════════════════
-- Frequency · ПРИБРАТИ історію змін (відкат 01-history.sql)
--
-- Знімає тригер і функцію — база перестає збирати нові версії.
-- public.user_data не чіпається.
-- Таблицю private.history НАВМИСНО лишаємо: у ній можуть бути потрібні копії.
-- АЛЕ: разом із тригером зникає й автоприбирання — копії лежатимуть безстроково.
-- Коли вони вже не потрібні: або стерти таблицю зовсім (розкоментувати рядок
-- нижче — назавжди!), або раз прибрати старе:
--   delete from private.history where saved_at < now() - interval '30 days';
-- ════════════════════════════════════════════════════════════════════════════

drop trigger if exists user_data_keep_history on public.user_data;
drop function if exists private.keep_history();

-- drop table if exists private.history;   -- ← НАЗАВЖДИ стирає всі збережені версії

select count(*) as trigger_left
  from pg_trigger
 where tgrelid = 'public.user_data'::regclass and tgname = 'user_data_keep_history';
