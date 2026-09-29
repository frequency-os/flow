#!/usr/bin/env node
// Перевіряє синтаксис зібраної програми так, як це робить браузер.
//
// Чому окремо від jscheck.sh: той розбирає код як ТІЛО ФУНКЦІЇ (new Function),
// тому пропускає `return` на верхньому рівні файла — а браузер на цьому
// падає, і весь core (одним <script>) не запускається: білий екран.
// Тут кожен <script> з dist/index.html компілюється як справжній скрипт
// (vm.Script), по черзі, в одному спільному «вікні» — як на сторінці.
// Так ловимо ще й конфлікти імен між різними <script>: однаковий
// `let`/`const`/`class` в core і в іншому блоці браузер не пробачає.
//
// Запуск: node tools/scriptcheck.js [dist/index.html]. Код виходу 1 — є проблеми.
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
const file = process.argv[2] || path.join(ROOT, 'dist', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const rel = path.relative(ROOT, file) || file;

// Дістаємо <script> так, як їх бачить розбирач HTML: коментарі <!-- --> і
// вміст <style> пропускаємо (скрипт усередині них не виконується).
function scripts(src) {
  const out = [], low = src.toLowerCase();
  let i = 0;
  while (i < src.length) {
    const c = low.indexOf('<!--', i), s = low.indexOf('<script', i), st = low.indexOf('<style', i);
    const next = Math.min(...[c, s, st].map(x => x < 0 ? Infinity : x));
    if (next === Infinity) break;
    if (next === c) { const e = low.indexOf('-->', c + 4); i = e < 0 ? src.length : e + 3; continue; }
    if (next === st) { const e = low.indexOf('</style', st); i = e < 0 ? src.length : e + 7; continue; }
    const open = low.indexOf('>', s);
    const attrs = src.slice(s + 7, open);
    const end = low.indexOf('</script', open);
    const body = src.slice(open + 1, end < 0 ? src.length : end);
    const line = src.slice(0, open + 1).split('\n').length; // рядок, де починається код
    out.push({ attrs, body, line });
    i = end < 0 ? src.length : end + 8;
  }
  return out;
}

// Підказка, у якому файлі src/ шукати: той самий рядок тексту.
function srcFiles(dir, acc = []) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) srcFiles(p, acc);
    else if (n.endsWith('.js')) acc.push(p);
  }
  return acc;
}
let _files;
function hint(test) {
  _files = _files || srcFiles(path.join(ROOT, 'src', 'scripts')).map(p => ({ p, lines: fs.readFileSync(p, 'utf8').split('\n') }));
  const hits = [];
  for (const f of _files) f.lines.forEach((l, n) => { if (test(l)) hits.push(path.relative(ROOT, f.p) + ':' + (n + 1)); });
  return hits.length ? '\n        шукай у: ' + hits.slice(0, 4).join(', ') + (hits.length > 4 ? ' …' : '') : '';
}

const lines = html.split('\n');
const ctx = vm.createContext({});
// У браузері ці імена на window «приварені» (не можна перевизначити):
// `let top` чи `const location` на верхньому рівні там — SyntaxError.
vm.runInContext(`for (const n of ['window','document','location','top'])
  Object.defineProperty(globalThis, n, { value: {}, writable: false, enumerable: false, configurable: false });`, ctx);

const blocks = scripts(html);
let bad = 0, checked = 0;
blocks.forEach((b, k) => {
  if (/\bsrc\s*=/.test(b.attrs)) return;                         // зовнішній файл — не наш код
  const type = (b.attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
  if (type && !/^(text\/javascript|application\/javascript)$/i.test(type)) return; // JSON, шаблони тощо
  checked++;
  const name = `<script> №${k + 1} (${rel}:${b.line})`;
  const opts = { filename: rel, lineOffset: b.line - 1 };
  try {
    new vm.Script(b.body, opts);                                 // 1) чи розбирається як скрипт
    // 2) оголошення в спільному вікні: `throw 0` на початку — щоб код НЕ виконувався,
    //    а браузерна перевірка імен (let/const/class між блоками) — відбулась.
    new vm.Script('throw 0;' + b.body, opts).runInContext(ctx);
  } catch (e) {
    if (e === 0) return;                                         // усе гаразд: дійшли до throw 0
    bad++;
    const at = +((String(e.stack).split('\n')[0].match(/:(\d+)$/) || [])[1]);
    let where = '';
    const dup = /Identifier '([^']+)' has already been declared/.exec(e.message);
    if (dup) {
      const re = new RegExp('^\\s*(let|const|class|var|function\\*?|async\\s+function)\\s+' + dup[1].replace(/\$/g, '\\$') + '\\b');
      where = hint(l => re.test(l));
    } else if (at && lines[at - 1] && lines[at - 1].trim().length > 3) {
      const t = lines[at - 1];
      where = `\n        рядок ${at}: ${t.trim().slice(0, 120)}` + hint(l => l === t);
    }
    console.log(`   ❌ ${name} — ${e.name}: ${e.message}${where}`);
  }
});

if (!bad) console.log(`   ✅ усі ${checked} <script> розбираються браузерним способом і не конфліктують іменами`);
process.exit(bad ? 1 : 0);
