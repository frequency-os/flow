#!/usr/bin/env node
// Живий тест RLS: чи справді один акаунт НЕ бачить і НЕ змінює дані іншого
// у хмарі Supabase (таблиця user_data). Перевіряє саму базу, а не наш код:
// фільтр .eq('user_id', …) у 02-storage.js — це прохання, а RLS — замок.
//
// Запуск: node tools/test-rls.mjs        Код 0 — замок тримає; 1 — є діра.
//
// Потрібні 2 ТЕСТОВІ акаунти (email + пароль), створені в панелі Supabase
// (Authentication → Users → Add user, «Auto Confirm User»). Їхні дані — у
// tools/bin/rls-test.env (git не бачить tools/bin/), рядки:
//   RLS_A_EMAIL=…  RLS_A_PASS=…  RLS_B_EMAIL=…  RLS_B_PASS=…
// Адреса й публічний ключ бази беруться з src/scripts/core/02-storage.js.
// Скрипт пише лише тестові рядки rls_test:… і сам їх прибирає.
// Паролі й токени ніколи не друкуються.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const storage = readFileSync(join(ROOT, 'src/scripts/core/02-storage.js'), 'utf8');
const SB_URL = (storage.match(/const SB_URL = '([^']+)'/) || [])[1];
const SB_KEY = (storage.match(/const SB_KEY = '([^']+)'/) || [])[1];
if (!SB_URL || !SB_KEY) { console.log('❌ не знайшов SB_URL/SB_KEY у 02-storage.js'); process.exit(1); }

const envFile = join(ROOT, 'tools/bin/rls-test.env');
const env = {};
if (existsSync(envFile)) {
  for (const ln of readFileSync(envFile, 'utf8').split('\n')) {
    const m = ln.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
}
const need = ['RLS_A_EMAIL', 'RLS_A_PASS', 'RLS_B_EMAIL', 'RLS_B_PASS'].filter(k => !env[k]);
if (need.length) { console.log(`❌ у tools/bin/rls-test.env бракує: ${need.join(', ')}`); process.exit(1); }

let pass = 0, fail = 0;
const check = (name, ok, extra = '') => {
  ok ? pass++ : fail++;
  console.log(`${ok ? '✅' : '❌'} ${name}${!ok && extra ? ' — ' + extra : ''}`);
};

// ── Запити: вхід (GoTrue) і таблиця (PostgREST), так само як supabase-js ──
async function signIn(email, password) {
  const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error(`вхід ${email.split('@')[0]}@… не вдався: ${r.status} ${j.error_description || j.msg || ''}`);
  return { token: j.access_token, id: j.user.id };
}
async function rest(who, method, query, body, extraHeaders = {}) {
  const headers = { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation', ...extraHeaders };
  if (who) headers.Authorization = `Bearer ${who.token}`;
  const r = await fetch(`${SB_URL}/rest/v1/user_data${query}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  let data = null; try { data = JSON.parse(text); } catch (_) {}
  return { status: r.status, ok: r.ok, data, rows: Array.isArray(data) ? data : [] };
}
const enc = encodeURIComponent;
const denied = (res) => !res.ok || res.rows.length === 0;   // відмова або 0 рядків

const KEY = `rls_test:${Date.now().toString(36)}`;
let A, B;
try {
  A = await signIn(env.RLS_A_EMAIL, env.RLS_A_PASS);
  B = await signIn(env.RLS_B_EMAIL, env.RLS_B_PASS);
} catch (e) { console.log('❌ ' + e.message); process.exit(1); }
check('обидва тестові акаунти увійшли і це різні люди', A.id && B.id && A.id !== B.id);

const onA = `?user_id=eq.${A.id}&key=eq.${enc(KEY)}`;
const readA = async () => (await rest(A, 'GET', onA + '&select=value')).rows[0]?.value;

try {
  // 0) A пише свій рядок — контроль, що тест узагалі робочий
  const w = await rest(A, 'POST', '', { user_id: A.id, key: KEY, value: { secret: 'A' }, updated_at: new Date().toISOString() });
  check('A записує свій рядок (контроль)', w.ok && w.rows.length === 1, `${w.status} ${JSON.stringify(w.data)}`);
  check('A бачить свій рядок (контроль)', (await readA())?.secret === 'A');

  // 1) B читає рядок A прямо
  const r1 = await rest(B, 'GET', onA + '&select=key');
  check('B НЕ бачить рядок A за його user_id', r1.ok && r1.rows.length === 0, `${r1.status} ${r1.rows.length} рядків`);

  // 2) B читає всю таблицю без фільтра — лише своє
  const r2 = await rest(B, 'GET', '?select=user_id&limit=1000');
  const foreign = r2.rows.filter(x => x.user_id !== B.id).length;
  check('B без фільтра бачить лише свої рядки', r2.ok && foreign === 0, `${foreign} чужих`);

  // 3) B змінює рядок A
  const r3 = await rest(B, 'PATCH', onA, { value: { secret: 'зламано B' } });
  check('B НЕ може змінити рядок A', denied(r3) && (await readA())?.secret === 'A', `${r3.status} ${r3.rows.length}`);

  // 4) B видаляє рядок A
  const r4 = await rest(B, 'DELETE', onA);
  check('B НЕ може видалити рядок A', denied(r4) && (await readA())?.secret === 'A', `${r4.status} ${r4.rows.length}`);

  // 5) B вставляє рядок від імені A
  const k5 = KEY + ':від-B';
  const r5 = await rest(B, 'POST', '', { user_id: A.id, key: k5, value: { by: 'B' } });
  check('B НЕ може вставити рядок від імені A', !r5.ok, `${r5.status}`);
  if (r5.ok) await rest(A, 'DELETE', `?user_id=eq.${A.id}&key=eq.${enc(k5)}`);

  // 6) B робить upsert на ключ A (як синк: on_conflict=user_id,key)
  const r6 = await rest(B, 'POST', '?on_conflict=user_id,key', { user_id: A.id, key: KEY, value: { secret: 'upsert B' } },
    { Prefer: 'return=representation,resolution=merge-duplicates' });
  check('B НЕ може перезаписати рядок A через upsert', !r6.ok && (await readA())?.secret === 'A', `${r6.status}`);

  // 7) B переписує СВІЙ рядок на A (підкинути дані чужій людині)
  const kB = KEY + ':B';
  await rest(B, 'POST', '', { user_id: B.id, key: kB, value: { own: 'B' } });
  const r7 = await rest(B, 'PATCH', `?user_id=eq.${B.id}&key=eq.${enc(kB)}`, { user_id: A.id });
  const leaked = (await rest(A, 'GET', `?user_id=eq.${A.id}&key=eq.${enc(kB)}&select=key`)).rows.length;
  check('B НЕ може переписати свій рядок на A', !r7.ok && leaked === 0, `${r7.status}, у A з'явилось: ${leaked}`);
  await rest(B, 'DELETE', `?user_id=eq.${B.id}&key=eq.${enc(kB)}`);

  // 8) Без входу (лише публічний ключ сайту)
  const r8 = await rest(null, 'GET', '?select=user_id&limit=5');
  check('без входу таблиця порожня', r8.rows.length === 0, `${r8.status} ${r8.rows.length} рядків`);
  const r9 = await rest(null, 'POST', '', { user_id: A.id, key: KEY + ':anon', value: 1 });
  check('без входу записати не можна', !r9.ok, `${r9.status}`);
} finally {
  // Прибирання: A стирає свій тестовий рядок (і про всяк випадок — усе rls_test:… обох)
  await rest(A, 'DELETE', `?user_id=eq.${A.id}&key=like.${enc('rls_test:*')}`);
  await rest(B, 'DELETE', `?user_id=eq.${B.id}&key=like.${enc('rls_test:*')}`);
  const left = (await rest(A, 'GET', `?user_id=eq.${A.id}&key=like.${enc('rls_test:*')}&select=key`)).rows.length
             + (await rest(B, 'GET', `?user_id=eq.${B.id}&key=like.${enc('rls_test:*')}&select=key`)).rows.length;
  check('тестові рядки прибрано', left === 0, `лишилось ${left}`);
}

console.log(`\nПройдено: ${pass}, провалено: ${fail}` + (fail ? ' — У RLS Є ДІРА або тест зламано, дивись ❌ вище' : ' — замок тримає'));
process.exit(fail ? 1 : 0);
