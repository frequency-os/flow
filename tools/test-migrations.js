// Тест разових міграцій Frequency (реєстр MIGRATIONS_ONCE у 27-canvas.js).
// Відкриває зібраний dist/index.html у невидимому Electron і проганяє три сценарії:
//   A) «старий пристрій, без входу»: засіваємо localStorage даними до всіх
//      міграцій → старт → ще один load() у тій самій сторінці → перезапуск.
//      Міграції мусять спрацювати РАЗ: після першого старту дані перенесені,
//      а повтори не пишуть у сховище нічого (жодна мітка _v не змінилась).
//   B) «новий пристрій, хмара мовчить»: є сесія, мережі нема, локально порожньо.
//      Жодного запису flowapp_* і жодного прапорця — інакше порожнеча зі свіжою
//      міткою поїде в хмару і затре справжні дані.
//   C) «старий пристрій з даними, хмара мовчить»: те саме, але локально лежать
//      дані до міграцій. Міграції чекають: дані й прапорці не змінюються.
//      Потім «хмара ожила» — відкладені міграції доїжджають самі, без перезапуску.
// Запуск з кореня: npm run test:migrations  (спершу npm run build)
// Код виходу: 0 — усе гаразд, 1 — є порушення, 2 — тайм-аут.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { app, BrowserWindow, session } = require('electron');

const target = process.argv.slice(2).find(a => /\.html$/.test(a))
  || path.join(__dirname, '..', 'dist', 'index.html');
// ключ сесії supabase-js: sb-<проєкт>-auth-token (проєкт — із SB_URL у 02-storage.js)
const SB_TOKEN_KEY = 'sb-mogtitbgvrhzyhxmzvhs-auth-token';
// прапорці реєстру (ті самі імена, що в 27-canvas.js — міняти їх не можна)
const FLAGS = ['space_purge_v1', 'legacy_widgets_purge_v1', 'flowapp_wallet_migrated_v1',
  'flowapp_seedfolders_removed_v1', 'flowapp_agency_purged_v1', 'flowapp_space_removed_v1',
  'flowapp_inbox_chat_v1'];
const WAIT = 6500;   // старт + відкладені кроки (фото в IndexedDB, повтор load() після сесії)

const T0 = Date.now() - 86400000;   // «учора» — щоб перезапис було видно за міткою _v
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// так само, як wrap() у 02-storage.js: {_v, d:"<JSON-рядок>"}
const W = v => JSON.stringify({ _v: T0, d: JSON.stringify(v) });
// типові дані користувача ДО всіх міграцій
const LEGACY = {
  flowapp_folders_cfg: W({
    work: { c: '#5b8def', emoji: '💼', name: 'Робота' },
    f_proj: { custom: true, name: 'Проєкт', emoji: '🎯', c: '#34c77b', photo: PNG },
    f_agsk_seed: { custom: true, name: 'Агенція', emoji: '🏢' },
    f_agsk_c: { custom: true, name: 'Клієнт', parent: 'f_agsk_seed' },
    pat: { custom: true, name: 'Патерни', emoji: '🧠' },
    f_vision_seed: { custom: true, name: 'Візія', emoji: '🔭' },
    f_inbox: { custom: true, name: 'Вхідні', emoji: '📥' },
    f_space_1: { custom: true, name: 'Простір', emoji: '🧩' },
  }),
  flowapp_folders_order: W(['f_inbox', 'work', 'f_proj', 'f_agsk_seed', 'f_agsk_c', 'pat', 'f_vision_seed', 'f_space_1']),
  flowapp_board: W({
    f_proj: [{ id: 1, type: 'note', text: 'нотатка' }, { id: 2, type: 'kanban', title: 'старий віджет' }],
    f_inbox: [{ id: 3, type: 'note', text: 'вхідна' }],
    f_inbox__sp_t1: [{ id: 4, type: 'note', text: 'у темі' }],
    f_agsk_seed: [{ id: 5, type: 'note', text: 'агенція' }],
    pat: [{ id: 6, type: 'note', text: 'патерни' }],
    f_space_1: [{ id: 7, type: 'note', text: 'простір' }],
  }),
  flowapp_envelopes: W([{ id: 'env_agsk_tax', name: 'Податки', ops: [] }, { id: 'e1', name: 'Мрія', ops: [] }]),
  flowapp_debts: W([{ id: 11, name: 'Петро', amount: 100, date: '2026-08-01', note: '' }]),
  flowapp_fin_ops: W([
    { id: 'o1', type: 'in', amount: 100, card: 'c_eur', date: '2026-08-02', label: 'Зарплата' },
    { id: 'o2', type: 'out', amount: 50, card: 'c_uah', date: '2026-08-03', label: 'Їжа' }]),
  flowapp_income_cards: W([{ id: 'c_eur', cur: 'EUR', name: 'Євро' }, { id: 'c_uah', cur: 'UAH', name: 'Гривня' }]),
  flowapp_fx_cfg: W({ rates: { EUR: 48 } }),
  flowapp_spend: W([{ id: 111, amount: 20, label: 'кава', date: '2026-08-10', cat: 'food' }]),
  flowapp_wishes_board: W([{ id: 'w1', img: PNG, cap: 'мрія' }]),
};
// сесія, яку supabase-js прийме без мережі (термін ще не сплив)
function fakeSession() {
  const now = Math.floor(Date.now() / 1000);
  return JSON.stringify({ access_token: 'test.access.token', token_type: 'bearer', expires_in: 3600,
    expires_at: now + 3600, refresh_token: 'test-refresh',
    user: { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated',
      email: 'migrations@example.test', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' } });
}

const problems = [];
const bad = (scn, msg) => problems.push(scn + ': ' + msg);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errors = [];

if (app.dock) app.dock.hide();
app.disableHardwareAcceleration();
// між сценаріями вікон на мить немає — без цього Electron сам закривається з кодом 0
app.on('window-all-closed', () => {});

// порожня сторінка того самого походження (file://), щоб засіяти сховище ДО старту застосунку
const blank = path.join(os.tmpdir(), 'flow-mig-blank-' + process.pid + '.html');
fs.writeFileSync(blank, '<!doctype html><title>seed</title>');

async function makeWin(name, offline) {
  const part = 'mig-' + name + '-' + process.pid;   // без persist: — лише в памʼяті
  const ses = session.fromPartition(part);
  // «хмара мовчить»: будь-який запит у мережу обривається (file:// ходить як завжди)
  if (offline) ses.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (_d, cb) => cb({ cancel: true }));
  const win = new BrowserWindow({ show: false, width: 375, height: 812,
    webPreferences: { partition: part, contextIsolation: true } });
  win.webContents.on('console-message', (e) => {
    if (e.level === 'error' && !/Failed to load resource|net::ERR_|fetch|NetworkError|supabase|ServiceWorker|sw\.js/i.test(e.message))
      errors.push(name + ': ' + e.message.slice(0, 200));
  });
  return win;
}
async function seed(win, data) {
  await win.loadFile(blank);
  await win.webContents.executeJavaScript('(d=>{ localStorage.clear(); for(const k in d) localStorage.setItem(k,d[k]); return localStorage.length; })(' + JSON.stringify(data) + ')');
}
async function start(win) { await win.loadFile(target); await sleep(WAIT); }
const snap = win => win.webContents.executeJavaScript(
  '(()=>{ const o={}; Object.keys(localStorage).sort().forEach(k=>o[k]=localStorage.getItem(k)); return o; })()');
const js = (win, code) => win.webContents.executeJavaScript(code);
function diff(a, b) {   // які ключі зʼявились, зникли або змінились (разом із міткою _v)
  const out = [];
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => {
    if (!(k in a)) out.push('+' + k); else if (!(k in b)) out.push('-' + k); else if (a[k] !== b[k]) out.push('~' + k);
  });
  return out;
}
// «сховище» = ключі flowapp_* (їх несе в хмару window.storage) + прапорці реєстру
const isStore = x => /^[+~-]flowapp_/.test(x) || FLAGS.includes(x.slice(1));
const dataOf = (s, k) => { try { return JSON.parse(JSON.parse(s['flowapp_' + k]).d); } catch (_) { return null; } };

async function scenarioA() {
  const S = 'A (без входу)';
  const win = await makeWin('a', false);
  await seed(win, Object.assign({ flowtheme: 'dark' }, LEGACY));
  await start(win);
  const s1 = await snap(win);
  // 1) міграції справді відпрацювали
  FLAGS.concat('theme_flat_default_v1').forEach(f => { if (!s1[f]) bad(S, 'не виставлено прапорець ' + f); });
  const cfg = dataOf(s1, 'folders_cfg') || {};
  ['f_agsk_seed', 'f_agsk_c', 'pat', 'f_vision_seed', 'f_inbox', 'f_space_1'].forEach(k => { if (cfg[k]) bad(S, 'папка ' + k + ' лишилась'); });
  if (!cfg.f_proj) bad(S, 'зникла власна папка f_proj');
  else if (String(cfg.f_proj.photo || '').slice(0, 4) !== 'idb:') bad(S, 'фото папки не переїхало в PhotoDB');
  const board = dataOf(s1, 'board') || {};
  const inbox = board.chat_inbox || [];
  if (inbox.length !== 2) bad(S, 'у чаті «Вхідні» ' + inbox.length + ' записів замість 2');
  if ((board.f_proj || []).some(b => b.type === 'kanban')) bad(S, 'старий віджет kanban лишився');
  ['f_agsk_seed', 'pat', 'f_space_1', 'f_inbox', 'f_inbox__sp_t1'].forEach(k => { if (board[k]) bad(S, 'дошка ' + k + ' лишилась'); });
  const chats = dataOf(s1, 'chats_v1') || [];
  if (!chats.some(c => c.id === 'inbox')) bad(S, 'нема чату «Вхідні»');
  const ops = dataOf(s1, 'fin_ops') || [];
  if (ops.some(o => !o.envSpend && o.card !== 'wallet')) bad(S, 'операції не в гаманці');
  const o1 = ops.find(o => o.id === 'o1');
  if (!o1 || o1.amount !== 4800) bad(S, 'EUR-операцію не переведено за курсом (' + (o1 && o1.amount) + ')');
  if (!ops.some(o => o.id === 'sp_111')) bad(S, 'стару витрату не перенесено в книгу');
  const env = dataOf(s1, 'envelopes');
  const envArr = Array.isArray(env) ? env : (env && env.d) || [];
  if (envArr.some(e => /^env_agsk_/.test(e.id))) bad(S, 'конверт агенції лишився');
  const debts = dataOf(s1, 'debts');
  const dArr = Array.isArray(debts) ? debts : (debts && debts.d) || [];
  if (!dArr.length || !dArr[0].ops) bad(S, 'борги не переведено на ops');
  const wishes = dataOf(s1, 'wishes_board') || [];
  if (!wishes[0] || String(wishes[0].img).slice(0, 4) !== 'idb:') bad(S, 'фото бажання не переїхало в PhotoDB');
  const rep1 = await js(win, 'window.__migReport||null');
  // ARCH-10: кожен ключ сховища, що зʼявився після старту, має бути в реєстрі FLOW_KEYS
  // (крім службових flowapp___* і прапорців міграцій)
  const reg = await js(win, '(window.FLOW_KEYS||[]).slice()');
  const alien = Object.keys(s1).filter(k => /^flowapp_/.test(k) && !/^flowapp___/.test(k)
    && !FLAGS.includes(k) && !reg.includes(k.slice('flowapp_'.length)));
  if (alien.length) bad(S, 'ключі сховища поза FLOW_KEYS: ' + alien.join(', '));
  // 2) повторний load() у тій самій сторінці (так буває при фокусі й кожні 2 хв)
  await js(win, '(async()=>{ if(typeof window.__load==="function") await window.__load(); })()');
  await sleep(1500);
  const s2 = await snap(win);
  const d12 = diff(s1, s2).filter(isStore);
  if (d12.length) bad(S, 'повторний load() переписав: ' + d12.join(', '));
  // 3) перезапуск застосунку
  await start(win);
  const s3 = await snap(win);
  const all13 = diff(s1, s3), d13 = all13.filter(isStore);
  if (d13.length) bad(S, 'перезапуск переписав: ' + d13.join(', '));
  // сирі ключі без префікса — не сховище (не їдуть у хмару); показуємо, але не валимо тест.
  // Відомий випадок — дзеркала prefCatchup у 33-home-widgets.js (B3, окрема міграція ключів)
  const raw13 = all13.filter(x => !isStore(x));
  if (raw13.length) console.log('   · A: змінились сирі ключі поза сховищем (B3): ' + raw13.join(', '));
  console.log('A (без входу): звіт міграцій =', JSON.stringify(rep1), '· змін при повторі:', d12.length, '· при перезапуску:', d13.length);
  win.destroy();
}

async function scenarioSilent(name, S, seedData, revive) {
  const win = await makeWin(name, true);
  await seed(win, seedData);
  const before = await snap(win);
  await win.loadFile(target);
  // supabase-js кілька разів повторює запит, тож «хмара не відповіла» стає відомо не одразу
  for (let i = 0; i < 30; i++) { if (await js(win, 'window.__sbCloudOk===false')) break; await sleep(1000); }
  // ще один load() уже при відомо мовчазній хмарі — так буває при фокусі чи кроці раз на 2 хв;
  // чекаємо його до кінця (точкові запити теж повторюються)
  await js(win, '(async()=>{ if(typeof window.__load==="function") await window.__load().catch(()=>{}); })()');
  await sleep(1500);
  const st = await js(win, '({user:!!(window.sbUser&&window.sbUser()), cloudOk:window.__sbCloudOk, ready:window.__sbReady, rep:window.__migReport||null})');
  if (!st.user) bad(S, 'сценарій не відтворено: сесію не підхоплено');
  if (st.cloudOk !== false) bad(S, 'сценарій не відтворено: хмара не «мовчить» (__sbCloudOk=' + st.cloudOk + ')');
  const after = await snap(win);
  const d = diff(before, after).filter(isStore);
  if (d.length) bad(S, 'записано у сховище: ' + d.join(', '));
  console.log(S + ': сесія=' + st.user + ' хмара=' + st.cloudOk + ' · звіт =', JSON.stringify(st.rep), '· записів:', d.length);
  if (revive) {
    // «хмара ожила»: довіра зʼявилась — відкладені міграції мусять доїхати самі
    // (через подію 'flowsbready' → load()), без перезапуску застосунку
    await js(win, 'window.sbDataTrusted=()=>true; document.dispatchEvent(new CustomEvent("flowsbready")); 1');
    let rep = null;
    for (let i = 0; i < 40; i++) { rep = await js(win, 'window.__migReport||null'); if (rep && rep.trusted) break; await sleep(1000); }
    await sleep(1500);
    const s2 = await snap(win);
    const miss = FLAGS.filter(f => !s2[f]);
    if (!rep || !rep.trusted) bad(S, 'після відновлення довіри міграції так і не запустились');
    else if (miss.length) bad(S, 'після відновлення довіри не виставлено: ' + miss.join(', '));
    if ((dataOf(s2, 'folders_cfg') || {}).f_inbox) bad(S, 'після відновлення довіри папка f_inbox лишилась');
    console.log(S + ' → довіра відновилась: звіт =', JSON.stringify(rep && { trusted: rep.trusted, ran: rep.ran.length, failed: rep.failed }));
  }
  win.destroy();
}

app.whenReady().then(async () => {
  const timer = setTimeout(() => { console.log('❌ тайм-аут 120 с'); app.exit(2); }, 120000);
  // сценарії незалежні (кожен у своєму розділі памʼяті) — ганяємо паралельно, щоб вкластись у час
  const guard = (S, p) => p.catch(e => bad(S, 'виняток: ' + (e && e.stack || e)));
  await Promise.all([
    guard('A', scenarioA()),
    guard('B', scenarioSilent('b', 'B (новий пристрій, хмара мовчить)', { [SB_TOKEN_KEY]: fakeSession() })),
    // «старий» пристрій уже пройшов перехід теми 01.09 — вона поза реєстром (див. 05-spaces.js)
    guard('C', scenarioSilent('c', 'C (дані є, хмара мовчить)',
      Object.assign({ [SB_TOKEN_KEY]: fakeSession(), flowtheme: 'desk-dark', theme_flat_default_v1: '1' }, LEGACY), true)),
  ]);
  clearTimeout(timer);
  try { fs.unlinkSync(blank); } catch (_) {}
  errors.slice(0, 15).forEach(m => console.log('   ⚠ консоль: ' + m));
  problems.forEach(p => console.log('   ✗ ' + p));
  console.log(problems.length ? '\n❌ Міграції: проблем ' + problems.length : '\n✅ Міграції: чисто');
  app.exit(problems.length ? 1 : 0);
});
