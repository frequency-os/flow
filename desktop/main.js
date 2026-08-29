/* ═══════════ Frequency · обгортка для Mac (Electron) ═══════════
   Цей файл НЕ містить логіки застосунку. Він лише відкриває вікно
   і показує в ньому dist/index.html — той самий файл, що й у браузері.
   Уся програма живе в src/ → dist/. Тут тільки «рама навколо картини». */

const { app, BrowserWindow, shell, protocol, net, screen, ipcMain } = require('electron');
const path = require('node:path');
const fs   = require('node:fs');
const { pathToFileURL } = require('node:url');

const DIST  = path.join(__dirname, '..', 'dist');
const START = 'app://frequency/index.html';

/* Чому не просто file:// ?
   Chromium забороняє IndexedDB для сторінок, відкритих як file://.
   А саме в IndexedDB лежать книги (flow_books) і документи (flow_docs) —
   тобто читалка й сховище агенції просто не працювали б.
   Тому реєструємо власну схему app://, яка для браузера виглядає
   як нормальний сайт: зі сталим походженням і повним доступом до сховища.
   Стале походження також означає, що localStorage переживе оновлення застосунку. */
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true }
}]);

/* ── памʼять про розмір і місце вікна ── */
const stateFile = () => path.join(app.getPath('userData'), 'window-state.json');

function loadState(){
  try{
    const s = JSON.parse(fs.readFileSync(stateFile(), 'utf8'));
    // не відновлюємо вікно за межами екрана (буває після відключення монітора)
    const area = screen.getDisplayMatching(s).workArea;
    if (s.x < area.x - 50 || s.x > area.x + area.width - 50) { delete s.x; delete s.y; }
    return s;
  }catch(_){ return {}; }
}

function saveState(win){
  try{
    if (win.isDestroyed() || win.isMinimized() || win.isFullScreen()) return;
    fs.writeFileSync(stateFile(), JSON.stringify({ ...win.getNormalBounds() }));
  }catch(_){}
}

let mainWindow = null;

/* ── повернення з входу через Google ──
   Вхід відбувається у справжньому браузері (так вимагає сам Google:
   свою сторінку входу він у вікні застосунку показувати забороняє).
   Після входу браузер відкриває frequency://auth#... , macOS впізнає
   цю схему і передає посилання сюди. Звідси віддаємо його сторінці.

   Посилання може прийти РАНІШЕ, ніж сторінка встигне намалюватись
   (застосунок був закритий і його щойно розбудив клік у браузері),
   тому тримаємо його в pendingAuthUrl, доки сторінка не скаже «готова». */
let pendingAuthUrl = null;
let authReady = false;

function deliverAuth(url){
  if(!url) return;
  if(authReady && mainWindow && !mainWindow.isDestroyed()){
    mainWindow.webContents.send('flow-auth-callback', url);
    if(mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  } else {
    pendingAuthUrl = url;
  }
}

ipcMain.on('flow-auth-ready', () => {
  authReady = true;
  if(pendingAuthUrl){ const u = pendingAuthUrl; pendingAuthUrl = null; deliverAuth(u); }
});

function createWindow(){
  const s = loadState();
  const win = new BrowserWindow({
    width:  s.width  || 1180,
    height: s.height || 840,
    x: s.x, y: s.y,
    minWidth: 380,
    minHeight: 560,
    show: false,                       // не блимаємо білим — покажемо, коли намалюється
    backgroundColor: '#0c0e14',        // той самий --bg, що в застосунку
    titleBarStyle: 'hiddenInset',      // світлофор поверх темного інтерфейсу
    trafficLightPosition: { x: 14, y: 18 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,          // сторінка не має доступу до нутрощів Electron
      nodeIntegration: false,
      sandbox: true,
      spellcheck: true
    }
  });

  win.once('ready-to-show', () => win.show());

  let t = null;
  const remember = () => { clearTimeout(t); t = setTimeout(() => saveState(win), 400); };
  win.on('resize', remember);
  win.on('move', remember);
  win.on('close', () => saveState(win));

  /* Посилання назовні (YouTube, банк, довідка) відкриваємо у справжньому
     браузері, а не всередині застосунку: там у людини вже є її сесії,
     паролі й розширення. Всередині лишається тільки сам застосунок. */
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('app://')) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); }
  });

  win.loadURL(START);
  mainWindow = win;
  return win;
}

/* Другий запуск застосунку не потрібен: якщо людина клікає посилання
   з браузера, має прокинутись те вікно, що вже відкрите, а не з'явитись друге. */
if(!app.requestSingleInstanceLock()){
  app.quit();
} else {
  app.on('second-instance', (_e, argv) => {
    const link = argv.find(a => a.startsWith('frequency://'));
    if(link) deliverAuth(link);
    else if(mainWindow && !mainWindow.isDestroyed()){
      if(mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// macOS передає посилання саме так.
app.on('open-url', (event, url) => {
  event.preventDefault();
  deliverAuth(url);
});

app.whenReady().then(() => {
  /* Віддаємо файли з dist/ під схемою app://.
     Шлях перевіряємо: за межі dist/ вийти не можна. */
  protocol.handle('app', async (request) => {
    let rel;
    try { rel = decodeURIComponent(new URL(request.url).pathname); }
    catch(_){ return new Response('bad url', { status: 400 }); }
    if (rel === '/' || rel === '') rel = '/index.html';

    const file = path.normalize(path.join(DIST, rel));
    if (file !== DIST && !file.startsWith(DIST + path.sep)) {
      return new Response('forbidden', { status: 403 });
    }
    try {
      return await net.fetch(pathToFileURL(file).toString());
    } catch(_) {
      return new Response('not found: ' + rel, { status: 404 });
    }
  });

  // Кажемо системі: посилання frequency://... відкривати цим застосунком.
  app.setAsDefaultProtocolClient('frequency');

  createWindow();

  // На Mac клік по іконці в Dock при закритих вікнах відкриває вікно знову.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// На Mac застосунок за традицією лишається живим після закриття вікна.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
