// Сторож «тестовий місяць» (12–16.10.2026): невидимий Electron 375×812, мережа вимкнена, своє чисте сховище.
// Проживає стислий місяць тими самими функціями, що й кнопки (сфери-папки, місії через редактор,
// гроші через шторку «− Витрата / ＋ Дохід», «Зроблено» по днях з підміненим годинником) і перевіряє
// ІНВАРІАНТИ — правила, які мусять бути правдою завжди. Кожен — проти конкретної помилки з прогону 12.10:
//   I1  Огляд рахує ті самі «дні в русі», що й Журнал                  (було «за місяць жодного дня»)
//   I2  витрати місяця: Журнал = Гаманець = ручний підрахунок           (було 700 ₴ проти 12 802 ₴)
//   I3  папка бачить гроші й справи своєї місії                        (було Гроші «—», Час «—»)
//   I4  вибір папки з вікна місії лежить ПОВЕРХ нього                   (відкривався під вікном)
//   I5  авто-кроків «День закрито» нема; відсоток звички — ритм         (100% за перший день)
//   I6  число мети рухає відсоток; «+1 за дохід» рахує продажі          (0% при 260 з 1000)
//   I7  витрата з порожнього конверта лишається в його категорії         (губилась у «Інше»)
//   I8  «Перевірка суми» перепитує неймовірну суму                       (18 001 800 ₴ мовчки)
//   I9  емодзі папки — один цілий знак; поле порожнє і не ріже прапорець («🇬📁»)
//   I10 майстер «Старт гри» після ручної місії лишається на кроці 4      (вилітав)
//   I11 запізнення віхи: «+N днів» лише коли дату «взято» справді знаємо
//   I12 Огляд перемальовується після «Зроблено» деінде
// Запуск з кореня: npm run test:month (спершу npm run build). Код: 0 — чисто, 1 — порушення, 2 — тайм-аут.
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, session } = require('electron');

const target = process.argv.slice(2).find(a => /\.html$/.test(a)) || path.join(__dirname, '..', 'dist', 'index.html');
const WAIT = 6000;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errors = [];

if (app.dock) app.dock.hide();
app.disableHardwareAcceleration();
app.on('window-all-closed', () => {});

/* ── усе нижче виконується В СТОРІНЦІ (серіалізується через toString) ── */
async function pageMain() {
  const W = ms => new Promise(r => setTimeout(r, ms));
  // поля, якого в цій версії нема, просто пропускаємо — тоді впаде саме той інваріант, що від нього залежить
  const set = (el, v) => { if (!el) return; el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
  const checks = [];
  const ok = (id, cond, msg) => checks.push({ id, ok: !!cond, msg });
  const step = async (id, fn) => { try { await fn(); } catch (e) { checks.push({ id, ok: false, msg: 'виняток: ' + (e && e.message || e) }); } };
  const lastOv = () => [...document.querySelectorAll('.jn-ov')].pop();
  const closeAll = () => { document.querySelectorAll('.jn-ov,.asheet,.fmenu-sheet,.imodal,#aiOv').forEach(e => e.remove()); };

  // годинник: фіксований полудень потрібного дня
  const RD = Date; let OFF = 0;
  class FD extends RD { constructor(...a) { if (a.length === 0) super(RD.now() + OFF); else super(...a); } static now() { return RD.now() + OFF; } }
  FD.UTC = RD.UTC; FD.parse = RD.parse; window.Date = FD;
  const setDay = ds => { OFF = new RD(ds + 'T12:00:00') - new RD(); };
  setDay('2026-11-02');

  // старт без прикладів
  for (let i = 0; i < 8; i++) { const sk = [...document.querySelectorAll('button')].find(b => /^Пропустити$/.test(b.textContent.trim()) && b.getBoundingClientRect().width > 0); if (!sk) break; sk.click(); await W(300); }
  try { goHome(); } catch (_) {} await W(300);
  { const b = document.querySelector('.st-clean'); if (b) { b.click(); await W(500); } }

  // папки — через ту саму шторку, що «＋ Нова папка» (I9: емодзі цілим знаком)
  let emoField = null;
  const mkFolder = async (name, emoji) => { createFolder(); await W(300); const ov = document.querySelector('.imodal');
    const e = ov.querySelector('.im-emoji'); if (e && !emoField) emoField = { val: e.value, max: e.maxLength };   // яке поле бачить людина ДО введення
    set(ov.querySelector('.im-input'), name); if (e) set(e, emoji); ov.querySelector('.im-ok').click(); await W(250); };
  await mkFolder('Англійська', '🇬🇧'); await mkFolder('Особистий бренд', '✨'); await mkFolder('Shopify', '🛍');
  const fk = n => Object.keys(folders).find(k => folders[k] && folders[k].name === n);
  ok('I9b', emoField && emoField.val === '' && (emoField.max < 0 || emoField.max >= 8), 'поле емодзі нової папки порожнє (було «📁») і не ріже прапорець (maxlength ' + (emoField && emoField.max) + ')');
  ok('I9', folders[fk('Англійська')] && folders[fk('Англійська')].emoji === '🇬🇧', 'емодзі папки «Англійська» = ' + JSON.stringify(folders[fk('Англійська')] && folders[fk('Англійська')].emoji));

  // лист і герой
  goalsData.letter = { text: 'Через рік я говорю англійською B2 і маю 1000 підписників.', date: '2027-10-12', wishId: '' };
  { const h = jnHero(); h.name = 'Тест'; h.started = true; } saveGoals();

  // місії — через редактор; I4 — вибір папки поверх вікна місії
  try { goJournal({ tab: 'day' }); } catch (_) {} await W(300);
  let layerOk = true;
  const mission = async o => {
    jnEditor(null); await W(350); const ov = lastOv(); const q = s => ov.querySelector(s);
    set(q('#jnName'), o.name); set(q('#jnFrom'), o.from); set(q('#jnTo'), o.to);
    for (const lv of o.levels || []) { q('[data-lvadd]').click(); await W(50); set([...ov.querySelectorAll('[data-lvt]')].pop(), lv[0]); set([...ov.querySelectorAll('[data-lvd]')].pop(), lv[1]); }
    for (const dw of o.dows) q(`#jnDows [data-v="${dw}"]`).click();
    set(q('#jnTime'), o.time); set(q('#jnMin'), o.min); set(q('#jnStart'), '2026-11-01'); set(q('#jnEnd'), '2026-12-31');
    if (o.numSrc) set(q('#jnNumSrc'), o.numSrc);
    q('[data-jnfold]').click(); await W(250);
    const sh = document.getElementById('goalFolderSheet'), row = sh && [...sh.querySelectorAll('[data-gfk]')].find(b => b.textContent.includes(o.folder));
    if (!row) { layerOk = false; } else { const r = row.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!hit || !sh.contains(hit)) layerOk = false; row.click(); }
    await W(120); q('[data-jnsave]').click(); await W(400);
  };
  await mission({ name: 'Англійська', from: 'A2', to: 'B2', dows: [1, 3, 5], time: '19:00', min: 60, folder: 'Англійська' });
  await mission({ name: 'Бренд', from: '260', to: '1000', dows: [2, 4], time: '08:00', min: 30, folder: 'Особистий бренд' });
  await mission({ name: 'Shopify', from: '0', to: '10', numSrc: 'in_month', levels: [['Магазин відкрито', '2026-11-05']], dows: [6], time: '11:00', min: 120, folder: 'Shopify' });
  ok('I4', layerOk, 'вибір папки з вікна місії — рядок папки під пальцем (elementFromPoint) належить шторці вибору');
  const G = n => (goalsData.goals || []).find(g => g && g.name === n);
  ok('I3a', G('Бренд') && G('Бренд').folderKey === fk('Особистий бренд'), 'місію «Бренд» привʼязано до папки з редактора');

  // гроші: зарплата, конверти, витрати через шторку
  const op = async (type, amt, label, o = {}) => { wlOpSheet(type, ''); await W(220); const ov = lastOv(); const q = s => ov.querySelector(s);
    set(q('#wlAmt'), amt); set(q('#wlLbl'), label);
    if (o.env) { const b = [...ov.querySelectorAll('[data-wlenvp]')].find(b => b.textContent.includes(o.env)); if (b) b.click(); await W(30); }
    if (o.src) { const b = ov.querySelector(`[data-wlsrc="${o.src}"]`); if (b) b.click(); await W(30); }
    if (o.mis) { const b = [...ov.querySelectorAll('[data-wlg]')].find(b => b.textContent.includes(o.mis)); if (b) b.click(); await W(30); }
    q('[data-wlok]').click(); await W(300); closeAll(); };
  await op('in', 30000, 'Зарплата', { src: 'main' });
  envelopes.push({ id: 'env_t_food', name: 'Продукти', emoji: '🛒', color: '#5b8def', goal: 3000, saved: 0, ops: [], kind: 'витрати' });
  envelopes.push({ id: 'env_t_rent', name: 'Житло', emoji: '🏠', color: '#5b8def', goal: 9000, saved: 0, ops: [], kind: 'витрати' });
  saveEnvelopes();
  envAddOp(envelopes.find(e => e.id === 'env_t_food'), 'in', 1000, 'З картки: Гаманець', 'wallet'); saveEnvelopes();

  // дні 2–10 листопада: «Зроблено» всім справам англійської й Shopify, бренду — через раз
  const days = []; for (let d = 2; d <= 10; d++) days.push('2026-11-' + String(d).padStart(2, '0'));
  let flip = false;
  for (const ds of days) { setDay(ds);
    for (const b of jnDayBlocks(ds)) { const g = jnBlockGoal(b), name = ((goalsData.goals || []).find(x => String(x.id) === g) || {}).name;
      if (name === 'Бренд') { flip = !flip; if (!flip) continue; } jnToggleBlock(b); }
    if (ds === '2026-11-03') await op('out', 200, 'Продукти', { env: 'Продукти' });
    if (ds === '2026-11-04') await op('out', 1200, 'Ремонт крана', { env: 'Житло' });   // конверт порожній
    if (ds === '2026-11-06') { await op('out', 500, 'Реклама', { mis: 'Бренд' }); await op('in', 1800, 'Продаж 1', { src: 'extra', mis: 'Shopify' }); }
    if (ds === '2026-11-08') await op('in', 2400, 'Продаж 2', { src: 'extra', mis: 'Shopify' });
  }
  setDay('2026-11-10');

  await step('I1', async () => {
    const hm = heroMonthDays(); let exp = 0; for (let d = 1; d <= 10; d++) if (dayInMotion('2026-11-' + String(d).padStart(2, '0'))) exp++;
    ok('I1', exp > 0 && hm.filled === exp, 'Огляд за місяць ' + hm.filled + ' днів, Журнал «у русі» ' + exp);
    const wk = heroWeekDays(); ok('I1b', !wk.days.some(d => d.future && d.on), 'майбутні дні тижня не рахуються як «у русі»'); });

  await step('I2', async () => {
    const hand = finOps.filter(o => o && String(o.date || '').slice(0, 7) === '2026-11' && o.type === 'out' && !o._tr && !(o.envId && !o.envSpend) && !String(o.id || '').startsWith('start_')).reduce((s, o) => s + (+o.amount || 0), 0);
    const w = wlAgg(wlMonthOps('2026-11')).out, m = monthAgg('2026-11').out, html = moMoneyHTML('2026-11');
    ok('I2', w === hand && m === hand && html.indexOf(money(hand)) >= 0, 'витрати листопада: руками ' + hand + ', Гаманець ' + w + ', Фінанси ' + m + ', Журнал ' + (html.indexOf(money(hand)) >= 0 ? 'так само' : 'ІНАКШЕ'));
    ok('I2b', wlAgg(wlDayOps('2026-11-02')).out === 0, 'поповнення конверта в день зарплати не рахується як витрата'); });

  await step('I3', async () => {
    const d = pgHubData(fk('Особистий бренд'));
    ok('I3', d.money === -500, 'папка бренду бачить гроші місії: ' + d.money + ' (очікую −500)');
    setDay('2026-11-09'); const bl = plBlocksDisplay('2026-11-09').filter(b => inFolderBlock(b, fk('Англійська')));   // пн — день англійської (пн/ср/пт)
    setDay('2026-11-10');
    ok('I3b', bl.length > 0, 'справа англійської (пн 09.11) належить папці «Англійська»'); });

  await step('I5', async () => {
    const auto = (goalsData.goals || []).reduce((s, g) => s + (g.steps || []).filter(x => x && x.auto).length, 0);
    ok('I5', auto === 0, 'авто-кроків «День закрито»: ' + auto);
    const e = G('Англійська'), r = jnRhythm(e);
    ok('I5b', r.plan > 1 && jnPct(e) === Math.round(r.done / r.plan * 100), 'англійська = ритм ' + r.done + '/' + r.plan + ' → ' + jnPct(e) + '%'); });

  await step('I6', async () => {
    ok('I6', jnPct(G('Shopify')) === 20 && /2 з 10/.test(jnPathTxt(G('Shopify'))), 'Shopify «+1 за дохід»: ' + jnPathTxt(G('Shopify')) + ' · ' + jnPct(G('Shopify')) + '%');
    jnNumSheet(G('Бренд')); await W(250); const ov = lastOv(); set(ov.querySelector('#jnNumV'), '500'); ov.querySelector('[data-jnnok]').click(); await W(250);
    const want = Math.round((500 - 260) / (1000 - 260) * 100);
    ok('I6b', jnPct(G('Бренд')) === want, 'бренд 260 → 500 з 1000: ' + jnPct(G('Бренд')) + '% (очікую ' + want + '%)'); });

  await step('I7', async () => {
    const o = finOps.find(x => x && x.label === 'Ремонт крана');
    const cat = wlMonthCats('2026-11').find(c => c.label === 'Житло');
    ok('I7', o && o.env === 'Житло' && !o.envId && cat && cat.sum >= 1200, 'витрата з порожнього «Житла»: env=' + (o && o.env) + ', категорія ' + (cat ? cat.sum : '—')); closeAll(); });

  await step('I8', async () => {
    const big = flBigSum(18001800, 'in', () => {}, () => {}); closeAll(); const small = flBigSum(1800, 'in', () => {}, () => {}); closeAll();
    ok('I8', big === true && small === false, 'перепитує 18 001 800 (' + big + ') і не чіпає 1 800 (' + small + ')'); });

  await step('I10', async () => {
    jnStart(4); await W(350); lastOv().querySelector('[data-jsadd]').click(); await W(400);
    const ov = lastOv(); set(ov.querySelector('#jnName'), 'Спорт'); ov.querySelector('[data-jnsave]').click(); await W(800);
    const w = lastOv(); ok('I10', w && /Крок 4\/5/.test(w.textContent) && /Спорт/.test(w.textContent), 'після ручної місії майстер на кроці 4 і бачить її'); closeAll(); });

  await step('I11', async () => {
    const s = G('Shopify'), m = jnLevels(s)[0];
    setDay('2026-11-08'); jnMsSetDone(m, true); saveGoals();
    ok('I11', moLateDays(m) === 3, 'віха 05.11 взята 08.11 → +' + moLateDays(m) + ' (очікую 3)');
    m.doneAt = ''; saveGoals(); setDay('2026-11-10'); jnEditor(s); await W(350); lastOv().querySelector('[data-jnsave]').click(); await W(350);
    const m2 = jnLevels(G('Shopify'))[0]; ok('I11b', !m2.doneAt && moLateDays(m2) === 0, 'стара взята віха без дати після «Зберегти» лишилась без дати'); });

  await step('I12', async () => {
    setDay('2026-11-11'); const before = heroWeekDays().filled; const b = jnDayBlocks('2026-11-11').find(x => !x.done);
    if (b) { jnToggleBlock(b); } goHome(); await W(300);
    const lab = (document.getElementById('heroLab') || {}).textContent || '';
    ok('I12', !b || new RegExp(String(before + 1) + '/7').test(lab), 'Огляд після «Зроблено»: «' + lab.trim() + '» (було ' + before + '/7)'); });

  return checks;
}

app.whenReady().then(async () => {
  const timer = setTimeout(() => { console.log('❌ тайм-аут 150 с'); app.exit(2); }, 150000);
  const part = 'month-' + process.pid;   // без persist: — лише в памʼяті
  const ses = session.fromPartition(part);
  ses.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (_d, cb) => cb({ cancel: true }));   // мережі нема
  const win = new BrowserWindow({ show: false, width: 375, height: 812, webPreferences: { partition: part, contextIsolation: true } });
  win.webContents.on('console-message', (e) => {
    if (e.level === 'error' && !/Failed to load resource|net::ERR_|fetch|NetworkError|supabase|ServiceWorker|sw\.js/i.test(e.message))
      errors.push(e.message.slice(0, 200));
  });
  let checks = [];
  try {
    await win.loadFile(target); await sleep(WAIT);
    checks = await win.webContents.executeJavaScript('(' + pageMain.toString() + ')()', true);
  } catch (e) { checks = [{ id: 'старт', ok: false, msg: 'виняток: ' + (e && e.stack || e) }]; }
  clearTimeout(timer);
  checks.forEach(c => console.log((c.ok ? '   ✓ ' : '   ✗ ') + c.id + '  ' + c.msg));
  errors.slice(0, 10).forEach(m => console.log('   ⚠ консоль: ' + m));
  const bad = checks.filter(c => !c.ok).length + (errors.length ? 1 : 0);
  console.log(bad ? '\n❌ Тестовий місяць: порушень ' + bad : '\n✅ Тестовий місяць: усі ' + checks.length + ' інваріантів тримаються');
  win.destroy();
  app.exit(bad ? 1 : 0);
});
