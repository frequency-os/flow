/* Малює іконку застосунку: той самий знак, що й у бічній панелі —
   хвиля на фіолетовому градієнті. Рендерить через Electron і зберігає PNG. */
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const SIZE = 1024;
const OUT  = path.join(__dirname, '..', 'desktop', 'resources', 'icon.png');

// Пропорції як у macOS: знак займає ~80% полотна, решта — поля.
const HTML = `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;width:${SIZE}px;height:${SIZE}px;background:transparent}
  .sq{position:absolute;left:10.4%;top:10.4%;width:79.2%;height:79.2%;
      border-radius:22.4%;
      background:linear-gradient(135deg,#6a7dff,#a06bff);
      box-shadow:0 ${SIZE*0.018}px ${SIZE*0.045}px rgba(0,0,0,.28);
      display:flex;align-items:center;justify-content:center}
  svg{width:62%;height:62%}
</style>
<div class="sq">
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 12c2.3 0 2.3-6.8 4.6-6.8s2.3 13.6 4.6 13.6 2.3-13.6 4.6-13.6 2.3 6.8 4.6 6.8 2.3-3.7 4.6-3.7"/>
  </svg>
</div>`;

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: SIZE, height: SIZE, show: false, frame: false, transparent: true,
    webPreferences: { offscreen: true }
  });
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(HTML));
  await new Promise(r => setTimeout(r, 700));
  const img = await win.capturePage();
  fs.writeFileSync(OUT, img.toPNG());
  console.log('✅ ' + OUT + ' (' + img.getSize().width + 'px)');
  app.quit();
});
