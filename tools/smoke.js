// Димовий тест Frequency: відкриває зібраний dist/index.html у невидимому вікні
// Electron 375×812, чекає старту, проходить головні екрани і збирає помилки.
// Навіщо: check.sh бачить лише синтаксис, а помилку під час запуску (напр.,
// функцію викликали раніше, ніж оголосили) видно тільки в живій сторінці.
// Запуск з кореня: npm run smoke   (або electron tools/smoke.js /abs/шлях/index.html)
// Код виходу: 0 — чисто, 1 — є помилки, 2 — сторінка не відповіла за 60 с.
const path = require('path');
const { app, BrowserWindow } = require('electron');
const target = process.argv.slice(2).find(a => /\.html$/.test(a))
  || path.join(__dirname, '..', 'dist', 'index.html');
const SCREENS = ['goHome','goPlanner','goFinance','goSpend','goDebts','goDiary','goGoals','goValues',
  'goWishes','goVision','goPatterns','goWork','goMore','goProjects','goMyYear','goUpgrade','goHome'];
// шум, що не є поломкою коду: мережа (прогін офлайн), SW на file://
const NOISE = /Failed to load resource|net::ERR_|ServiceWorker|service worker|sw\.js|supabase|fetch|NetworkError|Load failed|favicon/i;
const errors = [], noise = [];
if (app.dock) app.dock.hide();
app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 375, height: 812,
    // окремий тимчасовий розділ — справжні дані застосунку тест не бачить і не чіпає
    webPreferences: { partition: 'smoke-' + process.pid, contextIsolation: true } });
  // Лише об'єкт події: позиційні аргументи (level, message, line, sourceId)
  // Electron оголосив застарілими і друкує про це попередження.
  win.webContents.on('console-message', (e) => {
    if (e.level !== 'error') return;
    const where = (e.sourceId || '') + ':' + (e.lineNumber || '');
    (NOISE.test(e.message) ? noise : errors).push(e.message.slice(0, 300) + '  @' + where.split('/').pop());
  });
  win.webContents.on('render-process-gone', (_e, d) => errors.push('renderer gone: ' + d.reason));
  const timer = setTimeout(() => { console.log('❌ тайм-аут 60 с'); app.exit(2); }, 60000);
  try { await win.loadFile(target); } catch (e) { errors.push('loadFile: ' + e.message); }
  await new Promise(r => setTimeout(r, 4500));
  let res = { steps: [], crash: false };
  try {
    res = await win.webContents.executeJavaScript(`(async()=>{
      const steps=[]; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
      const visible=()=>[...document.querySelectorAll('[id^="scr-"]')].filter(s=>s.offsetParent!==null).map(s=>s.id).join(',');
      for(const f of ${JSON.stringify(SCREENS)}){
        if(typeof window[f]!=='function'){ steps.push({f,skip:1}); continue; }
        try{ await window[f](); await sleep(350); steps.push({f,ok:1,scr:visible()}); }
        catch(e){ steps.push({f,err:String(e&&e.stack||e).slice(0,300)}); }
      }
      const cs=document.getElementById('crashScreen')||document.querySelector('.crash-screen,#crash');
      return {steps, crash: !!(cs&&cs.offsetParent!==null), bodyLen: document.body.innerText.length};
    })()`);
  } catch (e) { errors.push('executeJavaScript: ' + e.message); }
  clearTimeout(timer);
  const stepErr = res.steps.filter(s => s.err);
  console.log('Екрани: ' + res.steps.map(s => s.skip ? '·' + s.f + '(нема)' : s.err ? '✗' + s.f : '✓' + s.f).join(' '));
  stepErr.forEach(s => console.log('   ✗ ' + s.f + ': ' + s.err));
  if (res.crash) console.log('   ✗ показано аварійний екран');
  if (res.bodyLen < 50) errors.push('сторінка майже порожня (' + res.bodyLen + ' симв.)');
  console.log('Помилок у консолі: ' + errors.length + (noise.length ? ` (+${noise.length} мережевого шуму, не рахую)` : ''));
  errors.slice(0, 25).forEach(m => console.log('   ✗ ' + m));
  const bad = errors.length + stepErr.length + (res.crash ? 1 : 0);
  console.log(bad ? `\n❌ Димовий тест: проблем ${bad}` : '\n✅ Димовий тест: чисто');
  app.exit(bad ? 1 : 0);
});
