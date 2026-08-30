/* ═══════════ ДИКТУВАННЯ В БУДЬ-ЯКИЙ БЛОК ═══════════
   Кнопка 🎙 у панелі редактора: тапнув — говориш, тапнув ще раз —
   сказане зʼявляється текстом у тому блоці, де стояв курсор.

   Раніше диктувати можна було ЛИШЕ у блоці «Щоденник» (data-jemic).
   Тут та сама механіка, але для звичайних блоків: текст, заголовки,
   завдання, пункти списку — усе, що редагується.

   Запис іде в браузері, розпізнавання — у воркері (Whisper).
   Спільна функція window.__flowTranscribe вже існує, тому тут
   лише запис і вставка. */
(function () {
  'use strict';

  var btn = null, rec = null, stream = null;
  var lastEl = null;          // куди вставляти: останній блок, де стояв курсор
  var lastRange = null;       // і точне місце в ньому

  function toast(m) { try { (window.__flowToast || function () {})(m); } catch (_) {} }

  /* Запамʼятовуємо блок, у якому людина щойно писала. Робимо це ДО
     натискання кнопки: сам клік по кнопці забирає фокус, і без цього
     ми б не знали, куди вставляти. */
  document.addEventListener('focusin', function (e) {
    var el = e.target && e.target.closest && e.target.closest('#pgEditor [data-edit]');
    if (el) lastEl = el;
  });
  document.addEventListener('selectionchange', function () {
    try {
      var sel = document.getSelection();
      if (!sel || !sel.rangeCount) return;
      var node = sel.getRangeAt(0).startContainer;
      var el = (node.nodeType === 1 ? node : node.parentElement);
      if (el && el.closest && el.closest('#pgEditor [data-edit]')) {
        lastEl = el.closest('#pgEditor [data-edit]');
        lastRange = sel.getRangeAt(0).cloneRange();
      }
    } catch (_) {}
  });

  function setLive(on) {
    if (btn) btn.classList.toggle('live', !!on);
  }

  /* Вставка розпізнаного. Головне тут — надіслати подію input:
     редактор зберігає блоки саме по ній, інакше текст зникне
     після перемальовування сторінки. */
  function insert(text) {
    var el = lastEl;
    if (!el || !document.body.contains(el)) {
      toast('🎙 Спершу постав курсор у блок');
      return;
    }
    el.focus();

    /* Пробіл перед вставкою. Без нього продиктоване приклеювалось
       до попереднього слова: «платформипродиктована фраза». */
    var before = el.textContent || '';
    var needSpace = before.length > 0 && !/[\s(«"'-]$/.test(before) && !/^[\s.,!?;:)»]/.test(text);
    if (needSpace) text = ' ' + text;

    var ok = false;
    try {
      // відновлюємо місце курсора, якщо воно було в цьому ж блоці
      if (lastRange && el.contains(lastRange.startContainer)) {
        var sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(lastRange);
      }
      ok = document.execCommand('insertText', false, text);
    } catch (_) {}
    if (!ok) {
      // запасний шлях: дописуємо в кінець
      el.textContent = (el.textContent || '') + (el.textContent ? ' ' : '') + text;
    }
    el.classList.remove('pg-empty');
    el.dispatchEvent(new InputEvent('input', { bubbles: true }));
    lastRange = null;
  }

  async function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast('⚠️ Мікрофон недоступний на цьому пристрої');
      return;
    }
    if (typeof window.__flowTranscribe !== 'function') {
      toast('⚠️ Розпізнавання недоступне — перевір AI-проксі');
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (_) {
      toast('⚠️ Немає доступу до мікрофона');
      return;
    }
    var mime = (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/mp4')) ? 'audio/mp4'
      : ((MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm')) ? 'audio/webm' : '');
    rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    var chunks = [];
    rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
    rec.onstop = async function () {
      try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (_) {}
      var blob = new Blob(chunks, { type: mime || 'audio/mp4' });
      rec = null; stream = null; setLive(false);
      if (blob.size < 1200) { toast('🎙 Закоротко — говори трохи довше'); return; }
      var txt = await window.__flowTranscribe(blob);
      if (txt) insert(txt);
    };
    rec.start();
    setLive(true);
    toast('🎙 Говори — тапни ще раз, щоб зупинити');
  }

  function stop() { try { if (rec) rec.stop(); } catch (_) {} }

  function toggle() { if (rec) stop(); else start(); }

  function wire() {
    btn = document.getElementById('pgMicBtn');
    if (!btn || btn.__wired) return;
    btn.__wired = 1;
    btn.addEventListener('mousedown', function (e) { e.preventDefault(); });  // не забирати фокус з блока
    btn.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();

  // сторінка згорнулась — не тримаємо мікрофон увімкненим
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
})();
