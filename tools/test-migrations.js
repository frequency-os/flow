// Тест разових міграцій Frequency (реєстр MIGRATIONS_ONCE у 27-canvas.js).
// Відкриває зібраний dist/index.html у невидимому Electron і проганяє сценарії:
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
//   P) «старі проєкти»: блоки «Проєкт» і Кабінет (fin_projects) з 09.10.2026 при старті
//      НЕ переносяться і НЕ стираються — лежать як були; прибирає їх лише людина
//      («Ще → Дані → Старі віджети»), і ця кнопка мусить їх бачити.
//   N) «iPhone: Стерти все → перезапуск»: заглушка Capacitor + Preferences (сховище — у
//      головному процесі, як UserDefaults поза WebView). Звичайний старт після чистки
//      localStorage піднімає дані з Preferences (страховка жива), а після скидання —
//      порожньо і в localStorage, і в Preferences.
// Запуск з кореня: npm run test:migrations  (спершу npm run build)
// Код виходу: 0 — усе гаразд, 1 — є порушення, 2 — тайм-аут.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { app, BrowserWindow, session, ipcMain } = require('electron');

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
    f_proj: [{ id: 1, type: 'note', text: 'нотатка' }, { id: 2, type: 'kanban', title: 'старий віджет' },
      { id: 12, type: 'project', title: 'Живий', cur: '₴', ops: [{ id: 'pop_l', t: 'in', amount: 50 }] }],
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
// Пристрій, де старі разові міграції вже пройшли, зі старими проєктами (сценарій P):
//   · блок 8  — звичайний «Проєкт», ніколи не переносився;
//   · блок 10 — «Проєкт» у вкладеній сторінці;
//   · блок 20 — колись перенесений у Кабінет (prj_20), копія в блоці розійшлась з Кабінетом.
// Перенесення в Кабінет прибрано 09.10.2026: при старті все це має лишитись байт у байт.
const POSTMIG = Object.assign({ flowtheme: 'dark', theme_flat_default_v1: '1' },
  Object.fromEntries(FLAGS.map(f => [f, '1'])), {
  flowapp_folders_cfg: W({ f_fin: { custom: true, name: 'Фінанси', emoji: '💰', c: '#22c55e' } }),
  flowapp_folders_order: W(['f_fin']),
  flowapp_board: W({ f_fin: [
    { id: 8, type: 'project', title: 'Монтаж', cur: '€', expected: 0, ops: [{ id: 'pop_1', t: 'in', amount: 300, label: 'аванс', date: '2026-08-05' }] },
    { id: 9, type: 'page', title: 'Сторінка', children: [{ id: 10, type: 'project', title: 'Вкладений', cur: '₴', ops: [] }] },
    { id: 20, type: 'project', title: 'Старий', cur: '₴', projId: 'prj_20', expected: 0, unlocked: true, ops: [
      { id: 'pop_a', t: 'in', amount: 100 }, { id: 'pop_del', t: 'out', amount: 40 }, { id: 'pop_new', t: 'in', amount: 70 }] },
  ] }),
  flowapp_fin_projects: W([{ id: 'prj_20', title: 'Старий', cur: '₴', expected: 500, deadline: '', unlocked: false,
    ops: [{ id: 'pop_a', t: 'in', amount: 100 }], delOps: ['pop_del'] }]),
  flowapp_fin_ops: W([{ id: 'o1', type: 'in', amount: 10, card: 'wallet', date: '2026-08-02', label: 'x' }]),
  flowapp_income_cards: W([{ id: 'wallet', name: 'Гаманець', cur: 'UAH' }]),
});
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

async function makeWin(name, offline, preload) {
  const part = 'mig-' + name + '-' + process.pid;   // без persist: — лише в памʼяті
  const ses = session.fromPartition(part);
  // «хмара мовчить»: будь-який запит у мережу обривається (file:// ходить як завжди)
  if (offline) ses.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (_d, cb) => cb({ cancel: true }));
  const win = new BrowserWindow({ show: false, width: 375, height: 812,
    webPreferences: Object.assign({ partition: part, contextIsolation: true }, preload ? { preload } : {}) });
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
// «сховище» = ключі flowapp_* (їх несе в хмару window.storage) + прапорці реєстру.
// Мітка власника flowapp___owner — не дані: службова, у хмару й бекап не йде,
// ставиться з першою сесією навіть при мовчазній хмарі (див. sbSetUser у 02-storage.js).
const isStore = x => (/^[+~-]flowapp_/.test(x) && x.slice(1) !== 'flowapp___owner') || FLAGS.includes(x.slice(1));
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
  // legacy_widgets вимкнено 03.10.2026: живі блоки (kanban, project…) на новому пристрої не вирізаються
  if (!(board.f_proj || []).some(b => b.type === 'kanban')) bad(S, 'живий блок kanban вирізано з дошки');
  // перенесення «Проєкт» → Кабінет (fin_projects) прибрано 09.10.2026: блок лишається як був,
  // а fin_projects при старті не зʼявляється — старе прибирає лише людина («Ще → Старі віджети»)
  const lp = (board.f_proj || []).find(b => b.type === 'project');
  const lp0 = dataOf(LEGACY, 'board').f_proj.find(b => b.type === 'project');
  if (!lp) bad(S, 'блок «Проєкт» вирізано з дошки на новому пристрої');
  else if (JSON.stringify(lp) !== JSON.stringify(lp0)) bad(S, 'блок «Проєкт» змінено при старті: ' + JSON.stringify(lp));
  if ('flowapp_fin_projects' in s1) bad(S, 'при старті створено fin_projects — перенесення в Кабінет прибрано 09.10');
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

async function scenarioP() {
  const S = 'P (старі проєкти на місці)';
  const win = await makeWin('p', false);
  await seed(win, POSTMIG);
  await start(win);
  const s1 = await snap(win);
  // при старті нічого не переноситься і не стирається: обидва ключі — байт у байт як були
  if (s1.flowapp_fin_projects !== POSTMIG.flowapp_fin_projects) bad(S, 'fin_projects змінено при старті: ' + String(s1.flowapp_fin_projects).slice(0, 200));
  if (s1.flowapp_board !== POSTMIG.flowapp_board) bad(S, 'дошку зі старими блоками «Проєкт» переписано при старті');
  const board = (dataOf(s1, 'board') || {}).f_fin || [];
  const b8 = board.find(x => x.id === 8), b20 = board.find(x => x.id === 20);
  const b10 = ((board.find(x => x.id === 9) || {}).children || [])[0];
  if (!b8 || !b10 || !b20) bad(S, 'блок «Проєкт» зник з дошки');
  else {
    if ('projId' in b8 || 'projId' in b10) bad(S, 'блок «Проєкт» отримав projId — перенесення в Кабінет прибрано 09.10');
    const ids20 = (b20.ops || []).map(o => o.id).join(',');
    if (ids20 !== 'pop_a,pop_del,pop_new') bad(S, 'рухи старого блоку змінено: ' + ids20);
  }
  const fp = dataOf(s1, 'fin_projects') || [];
  if (fp.length !== 1 || !fp[0] || fp[0].id !== 'prj_20' || fp[0].expected !== 500) bad(S, 'Кабінет змінено: ' + JSON.stringify(fp).slice(0, 200));
  // прибирає лише людина: кнопка «Ще → Дані → Старі віджети» (48-widgets.js) мусить усе це бачити
  const old = await js(win, '(typeof wgOldScan==="function") ? wgOldScan() : null');
  if (!old) bad(S, 'немає wgOldScan — нічим прибрати старі віджети');
  else if ((old.by || {}).project !== 3 || old.pj !== 1) bad(S, '«Старі віджети» бачать не все: ' + JSON.stringify(old));
  // повторний load() і перезапуск нічого не переписують
  await js(win, '(async()=>{ if(typeof window.__load==="function") await window.__load(); })()');
  await sleep(1500);
  const s2 = await snap(win);
  const d12 = diff(s1, s2).filter(isStore);
  if (d12.length) bad(S, 'повторний load() переписав: ' + d12.join(', '));
  await start(win);
  const s3 = await snap(win);
  const d13 = diff(s1, s3).filter(isStore);
  if (d13.length) bad(S, 'перезапуск переписав: ' + d13.join(', '));
  console.log(S + ': проєктів у Кабінеті ' + fp.length + ' · старих блоків ' + ((old && old.by && old.by.project) || 0) + ' · змін при повторі: ' + d12.length + ' · при перезапуску: ' + d13.length);
  win.destroy();
}

// ── iPhone: заглушка Capacitor + Preferences ──
// Preferences живе тут, у головному процесі (як UserDefaults поза WebView): переживає
// перезапуск сторінки і не чиститься разом із localStorage — саме так, як на телефоні.
const NP = new Map();
ipcMain.handle('mig-np', (_e, op, o) => {
  if (op === 'get') return { value: NP.has(o.key) ? NP.get(o.key) : null };
  if (op === 'set') { NP.set(o.key, String(o.value)); return null; }
  if (op === 'remove') { NP.delete(o.key); return null; }
  if (op === 'keys') return { keys: [...NP.keys()] };
  if (op === 'clear') { NP.clear(); return null; }
  return null;
});
const nativePreload = path.join(os.tmpdir(), 'flow-mig-native-' + process.pid + '.js');
fs.writeFileSync(nativePreload, `const { contextBridge, ipcRenderer } = require('electron');
const call = (op, o) => ipcRenderer.invoke('mig-np', op, o || {});
contextBridge.exposeInMainWorld('Capacitor', { isNative: true, isNativePlatform: () => true, getPlatform: () => 'ios',
  Plugins: { Preferences: { get: o => call('get', o), set: o => call('set', o), remove: o => call('remove', o),
    keys: () => call('keys'), clear: () => call('clear') } } });`);
const MARK = 'WIPE_TEST_MARKER';

async function scenarioN() {
  const S = 'N (iPhone: Стерти все → перезапуск)';
  const win = await makeWin('n', true, nativePreload);
  const own = () => [...NP.keys()].filter(k => k.indexOf('flowapp_') === 0);
  const inPrefs = () => [...NP.values()].some(v => v.indexOf(MARK) >= 0);
  const inLocal = s => Object.keys(s).some(k => String(s[k]).indexOf(MARK) >= 0);
  await seed(win, POSTMIG);
  await start(win);   // nativeBoot засіває Preferences тим, що лежить локально
  // запис людини: місія в цілях (через сам застосунок → localStorage + Preferences)
  await js(win, '(async()=>{ goalsData.mission=' + JSON.stringify(MARK) + '; saveGoals(); await new Promise(r=>setTimeout(r,1200)); return 1; })()');
  const native = await js(win, '!!window.FLOW_NATIVE');
  if (!native || !inPrefs()) { bad(S, 'сценарій не відтворено: FLOW_NATIVE=' + native + ', маркер у Preferences=' + inPrefs()); win.destroy(); return; }
  // 1) страховка жива: iOS вичистив localStorage — звичайний старт піднімає все з Preferences
  await seed(win, {});
  await start(win);
  const s1 = await snap(win);
  if (!inLocal(s1)) bad(S, 'страховку зламано: після чистки localStorage дані не повернулись з Preferences');
  if (!(dataOf(s1, 'folders_cfg') || {}).f_fin) bad(S, 'страховку зламано: папка f_fin не повернулась з Preferences');
  // 2) «Стерти все» (бекап уже «збережено») → застосунок сам перезапускається
  let atReload = null;
  const reloaded = new Promise(r => {
    win.webContents.once('did-start-loading', () => { atReload = own(); });
    win.webContents.once('did-finish-load', () => r(true));
    setTimeout(() => r(false), 15000);
  });
  const ret = await js(win, 'window.flowFactoryReset({wipeCloud:false, backupConfirmed:true})');
  if (!ret || !ret.ok) bad(S, 'скидання не пройшло: ' + JSON.stringify(ret));
  if (!(await reloaded)) bad(S, 'після скидання застосунок не перезапустився');
  if (atReload && atReload.length) bad(S, 'перезапуск почався, а в Preferences ще лежить: ' + atReload.join(', '));
  await sleep(WAIT);
  const s2 = await snap(win);
  if (inLocal(s2)) bad(S, 'після скидання маркер повернувся в localStorage');
  if (inPrefs()) bad(S, 'після скидання маркер лишився в Preferences');
  if ((dataOf(s2, 'folders_cfg') || {}).f_fin || s2.flowapp_fin_projects || NP.has('flowapp_fin_projects')) bad(S, 'після скидання повернулись старі дані (f_fin / fin_projects)');
  if (s2.__flow_wipe_np__) bad(S, 'мітку скидання не знято на першому старті');
  // 3) ще один звичайний перезапуск: стерте не воскресає і далі
  await start(win);
  const s3 = await snap(win);
  if (inLocal(s3) || inPrefs()) bad(S, 'другий перезапуск повернув стерте');
  console.log(S + ': до скидання в Preferences маркер є · на момент перезапуску flowapp_ у Preferences: ' + (atReload ? atReload.length : '?') +
    ' · після: маркер у localStorage=' + inLocal(s2) + ', у Preferences=' + inPrefs() + ' · ключів Preferences після: ' + own().length);
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
    guard('P', scenarioP()),
    guard('N', scenarioN()),
    guard('D', scenarioSilent('d', 'D (проєкти, хмара мовчить)', Object.assign({ [SB_TOKEN_KEY]: fakeSession() }, POSTMIG))),
    guard('B', scenarioSilent('b', 'B (новий пристрій, хмара мовчить)', { [SB_TOKEN_KEY]: fakeSession() })),
    // «старий» пристрій уже пройшов перехід теми 01.09 — вона поза реєстром (див. 05-spaces.js)
    guard('C', scenarioSilent('c', 'C (дані є, хмара мовчить)',
      Object.assign({ [SB_TOKEN_KEY]: fakeSession(), flowtheme: 'desk-dark', theme_flat_default_v1: '1' }, LEGACY), true)),
  ]);
  clearTimeout(timer);
  try { fs.unlinkSync(blank); } catch (_) {}
  try { fs.unlinkSync(nativePreload); } catch (_) {}
  errors.slice(0, 15).forEach(m => console.log('   ⚠ консоль: ' + m));
  problems.forEach(p => console.log('   ✗ ' + p));
  console.log(problems.length ? '\n❌ Міграції: проблем ' + problems.length : '\n✅ Міграції: чисто');
  app.exit(problems.length ? 1 : 0);
});
