/* Місток між застосунком і Electron.
   Сторінка НЕ отримує доступу до нутрощів системи — тільки до цих
   кількох функцій. Так влаштована безпека Electron: код сторінки
   живе окремо і не може, наприклад, читати твої файли. */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('flowDesktop', {
  os: process.platform,                  // 'darwin' (Mac) | 'win32' | 'linux'
  electron: process.versions.electron,

  // Адреса, на яку Google має повернути людину після входу.
  // Це не сайт, а «внутрішнє посилання» застосунку: коли браузер
  // його відкриє, macOS передасть його сюди, у Frequency.
  authRedirect: 'frequency://auth',

  // Відкрити сторінку входу Google: where = 'safari' | 'default' (див. main.js, flow-open-auth).
  openAuth(url, where){ return ipcRenderer.invoke('flow-open-auth', { url: String(url||''), where: where === 'safari' ? 'safari' : 'default' }); },

  // Підписатись на повернення з входу.
  onAuthCallback(cb){
    ipcRenderer.on('flow-auth-callback', (_e, url) => { try{ cb(url); }catch(_){} });
    ipcRenderer.send('flow-auth-ready');  // якщо посилання прийшло раніше — віддай його зараз
  }
});
