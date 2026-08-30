/* ═══════════════════════════════════════════════════════════════
   Flow AI Worker — проксі між застосунком і Anthropic + голос
   ═══════════════════════════════════════════════════════════════
   Живе в Cloudflare Workers. Застосунок ніколи не звертається до
   Anthropic напряму: ключ лежить тут і в браузер не потрапляє.

   Три адреси:
     POST /            — розмова з моделлю (з інструментами, стрімом)
     POST /transcribe  — голос у текст (Whisper через Workers AI)
     POST /tts         — текст у голос

   Оновлено 30.08.2026. Що змінилось проти попередньої версії —
   у worker/README.md.
   ═══════════════════════════════════════════════════════════════ */

/* ── Моделі ──────────────────────────────────────────────────────
   Застосунок сам обирає модель під задачу (див. aiPickModel).
   Тут ми лише перевіряємо, що назва дозволена, і підміняємо
   застарілі назви на актуальні — щоб не правити застосунок.      */

const MODEL_ALIAS = {
  // Sonnet 4.6 → Sonnet 5: новіша модель, і водночас ДЕШЕВША
  // ($2/$10 за млн замість $3/$15). Міняти застосунок не треба.
  "claude-sonnet-4-6": "claude-sonnet-5",
};

const MODELS = {
  // thinking: 'adaptive' — модель сама вирішує, скільки думати.
  //           null — модель цього не вміє (старіше покоління).
  // effort   — чи приймає output_config.effort
  // maxOut   — стеля відповіді
  "claude-opus-5":    { thinking: "adaptive", effort: true,  maxOut: 64000 },
  "claude-sonnet-5":  { thinking: "adaptive", effort: true,  maxOut: 64000 },
  "claude-haiku-4-5": { thinking: null,       effort: false, maxOut: 8192  },
};
const MODEL_DEFAULT = "claude-sonnet-5";

const EFFORTS = ["low", "medium", "high", "xhigh", "max"];

/* ── Голос ────────────────────────────────────────────────────── */
const TTS_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const TTS_CHROME = "143.0.3650.75";
const TTS_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0";
const TTS_VOICES = ["uk-UA-OstapNeural", "uk-UA-PolinaNeural", "en-US-AvaMultilingualNeural", "ru-RU-DmitryNeural"];

/* Скільки чекати на модель, перш ніж здатися. Довгі агентні ходи
   з думанням бувають повільні, але вічно висіти теж не можна. */
const UPSTREAM_TIMEOUT_MS = 180000;

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, x-flow-key",
    };
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "content-type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "POST only" }, 405);

    /* ── Захист від чужих ──────────────────────────────────────────
       Адреса воркера відкрита всьому інтернету, а платиш за виклики
       ти. Якщо у змінних оточення заданий FLOW_SECRET — вимагаємо
       його в заголовку. Якщо не заданий — працюємо як раніше, щоб
       нічого не зламалось у день оновлення.                        */
    if (env.FLOW_SECRET) {
      const given = request.headers.get("x-flow-key") || "";
      if (given !== env.FLOW_SECRET) {
        return json({ error: "Невірний або відсутній ключ доступу (x-flow-key)" }, 401);
      }
    }

    const url = new URL(request.url);

    /* ═══ ГОЛОС → ТЕКСТ ═══ */
    if (url.pathname === "/transcribe") {
      try {
        if (!env.AI) return json({ text: "", error: "Workers AI binding (AI) не підключений" }, 500);
        let bytes;
        const ct = request.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const body = await request.json();
          const b64 = body.audio_b64 || "";
          if (!b64) return json({ text: "", error: "Порожнє аудіо" }, 400);
          const bin = atob(b64);
          bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        } else {
          const buf = await request.arrayBuffer();
          bytes = new Uint8Array(buf);
        }
        if (!bytes || bytes.length < 800) return json({ text: "", error: "Порожнє аудіо" }, 400);
        const b64in = base64FromBytes(bytes);
        let out;
        try {
          out = await env.AI.run("@cf/openai/whisper-large-v3-turbo", { audio: b64in, language: "uk" });
        } catch (_) {
          out = await env.AI.run("@cf/openai/whisper", { audio: [...bytes] });
        }
        const text = String((out && (out.text || out.transcription)) || "").trim();
        return json({ text });
      } catch (e) {
        return json({ text: "", error: String((e && e.message) || e) }, 500);
      }
    }

    /* ═══ ТЕКСТ → ГОЛОС ═══ */
    if (url.pathname === "/tts") {
      try {
        const body = await request.json();
        const text = String(body.text || "").trim().slice(0, 800);
        if (!text) return json({ error: "порожній text" }, 400);
        const voice = TTS_VOICES.includes(body.voice) ? body.voice : "uk-UA-OstapNeural";
        const rate = /^[+-]\d{1,3}%$/.test(body.rate || "") ? body.rate : "+6%";
        const mp3 = await edgeTTS(text, voice, rate);
        if (!mp3 || mp3.byteLength < 400) return json({ error: "порожнє аудіо від TTS" }, 502);
        return new Response(mp3, {
          status: 200,
          headers: { ...cors, "content-type": "audio/mpeg", "cache-control": "no-store" },
        });
      } catch (e) {
        return json({ error: String((e && e.message) || e) }, 502);
      }
    }

    /* ═══ РОЗМОВА З МОДЕЛЛЮ ═══ */
    try {
      if (!env.ANTHROPIC_API_KEY) {
        return json({ error: "На воркері не заданий ANTHROPIC_API_KEY" }, 500);
      }

      const body = await request.json();
      const wantStream = !!body.stream;

      /* Модель: підміняємо застарілу назву, перевіряємо дозвіл */
      let model = String(body.model || "");
      if (MODEL_ALIAS[model]) model = MODEL_ALIAS[model];
      if (!MODELS[model]) model = MODEL_DEFAULT;
      const caps = MODELS[model];

      /* Стеля відповіді. Раніше тут стояло жорстке 4096 — через це
         довгі плани й розбори обривались на півслові. Тепер стеля
         залежить від моделі, а великі значення дозволені лише зі
         стрімом: без нього запит просто не встигне за таймаут. */
      const asked = +body.max_tokens || 2048;
      const ceiling = wantStream ? caps.maxOut : Math.min(caps.maxOut, 8192);
      const maxTok = Math.min(Math.max(asked, 256), ceiling);

      const payload = {
        model,
        max_tokens: maxTok,
        messages: Array.isArray(body.messages) ? body.messages : [],
      };

      /* ── Кешування підказки ──────────────────────────────────────
         Системна підказка й опис 14 інструментів однакові з ходу в
         хід, але досі летіли в модель щоразу заново. Позначаємо їх
         як кешовані: повторне читання коштує близько десятої частини
         ціни. В агентному циклі, де ходів буває 3-5, це помітно.    */
      if (body.system) {
        payload.system = [{
          type: "text",
          text: String(body.system),
          cache_control: { type: "ephemeral" },
        }];
      }

      if (Array.isArray(body.tools) && body.tools.length) {
        const tools = body.tools.map((t) => ({ ...t }));
        // кеш-межа ставиться на ОСТАННІЙ інструмент — так у кеш
        // потрапляє весь їх перелік разом
        tools[tools.length - 1] = {
          ...tools[tools.length - 1],
          cache_control: { type: "ephemeral" },
        };
        payload.tools = tools;
      }
      if (body.tool_choice) payload.tool_choice = body.tool_choice;

      /* ── Думання ─────────────────────────────────────────────────
         Найбільша зміна. Модель сама вирішує, скільки міркувати над
         задачею. Саме це відрізняє «склав список» від «побачив
         закономірність» — тобто рівно те, що потрібно для пошуку
         патернів у щоденнику й для складання плану дня.

         Вмикаємо лише там, де модель це вміє. Застосунок повертає
         блоки думання назад у розмову (conv.push з усім content),
         тому агентний цикл від цього не ламається.                 */
      if (caps.thinking === "adaptive" && body.thinking !== false) {
        payload.thinking = { type: "adaptive" };
      }

      /* Глибина роботи. Застосунок може попросити свою; за
         замовчуванням не задаємо нічого — це те саме, що 'high'. */
      if (caps.effort && EFFORTS.includes(body.effort)) {
        payload.output_config = { effort: body.effort };
      }

      if (wantStream) payload.stream = true;

      /* ── Запит до Anthropic ── */
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), UPSTREAM_TIMEOUT_MS);
      let r;
      try {
        r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(payload),
          signal: ctl.signal,
        });
      } catch (e) {
        clearTimeout(timer);
        if (e && e.name === "AbortError") {
          return json({ error: "Модель не відповіла за " + Math.round(UPSTREAM_TIMEOUT_MS / 1000) + " с" }, 504);
        }
        throw e;
      }
      clearTimeout(timer);

      if (wantStream && r.ok && r.body) {
        return new Response(r.body, {
          status: r.status,
          headers: { ...cors, "content-type": "text/event-stream", "cache-control": "no-cache" },
        });
      }

      const data = await r.json();

      /* ── Зрозуміла помилка ───────────────────────────────────────
         Раніше застосунок показував голе «HTTP 400» — і шукати
         причину не було де. Тепер віддаємо те, що сказала Anthropic:
         скінчились кошти, невідома модель, задовгий запит тощо.     */
      if (!r.ok) {
        const msg = (data && data.error && data.error.message) || ("HTTP " + r.status);
        return json({ error: msg, type: (data && data.error && data.error.type) || null, model }, r.status);
      }

      return json(data, r.status);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 500);
    }
  },
};

function base64FromBytes(bytes) {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

async function ttsGec() {
  const sec = BigInt(Math.floor(Date.now() / 1000) + 11644473600);
  let ticks = sec * 10000000n;
  ticks -= ticks % 3000000000n;
  const data = new TextEncoder().encode(ticks.toString() + TTS_TOKEN);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function ttsUuid() {
  return crypto.randomUUID().replace(/-/g, "");
}

function xmlEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function edgeTTS(text, voice, rate) {
  const gec = await ttsGec();
  const wsUrl = "https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1"
    + "?TrustedClientToken=" + TTS_TOKEN
    + "&Sec-MS-GEC=" + gec
    + "&Sec-MS-GEC-Version=1-" + TTS_CHROME
    + "&ConnectionId=" + ttsUuid();

  const resp = await fetch(wsUrl, {
    headers: {
      "Upgrade": "websocket",
      "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
      "User-Agent": TTS_UA,
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
    },
  });
  const ws = resp.webSocket;
  if (!ws) throw new Error("TTS: WebSocket upgrade не вдався (HTTP " + resp.status + ")");
  ws.accept();

  const ts = new Date().toString();
  const cfg = "X-Timestamp:" + ts + "\r\n"
    + "Content-Type:application/json; charset=utf-8\r\n"
    + "Path:speech.config\r\n\r\n"
    + JSON.stringify({ context: { synthesis: { audio: {
        metadataoptions: { sentenceBoundaryEnabled: "false", wordBoundaryEnabled: "false" },
        outputFormat: "audio-24khz-48kbitrate-mono-mp3" } } } });
  const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='uk-UA'>"
    + "<voice name='" + voice + "'>"
    + "<prosody pitch='+0Hz' rate='" + rate + "' volume='+0%'>" + xmlEsc(text) + "</prosody>"
    + "</voice></speak>";
  const req = "X-RequestId:" + ttsUuid() + "\r\n"
    + "Content-Type:application/ssml+xml\r\n"
    + "X-Timestamp:" + ts + "Z\r\n"
    + "Path:ssml\r\n\r\n" + ssml;

  return await new Promise((resolve, reject) => {
    const parts = [];
    let done = false;
    const finish = (err) => {
      if (done) return; done = true;
      clearTimeout(guard);
      try { ws.close(); } catch (_) {}
      if (err) { reject(err); return; }
      /* Раніше тут порожній набір шматків повертався як успіх:
         застосунок отримував валідний нульовий файл і програвав
         тишу. Знайти таке в житті майже неможливо — тому кажемо
         прямо, що аудіо не прийшло. */
      if (!parts.length) { reject(new Error("TTS: аудіо не надійшло")); return; }
      let len = 0; parts.forEach((p) => len += p.length);
      const out = new Uint8Array(len); let o = 0;
      parts.forEach((p) => { out.set(p, o); o += p.length; });
      resolve(out.buffer);
    };
    const guard = setTimeout(() => finish(new Error("TTS: таймаут 20с")), 20000);

    ws.addEventListener("message", (ev) => {
      try {
        if (typeof ev.data === "string") {
          if (ev.data.includes("Path:turn.end")) finish(null);
          return;
        }
        const buf = new Uint8Array(ev.data);
        if (buf.length < 4) return;
        const hlen = (buf[0] << 8) | buf[1];
        if (hlen + 2 > buf.length) return;
        const head = new TextDecoder().decode(buf.subarray(2, 2 + hlen));
        if (head.includes("Path:audio")) parts.push(buf.subarray(2 + hlen));
      } catch (e) { finish(e); }
    });
    ws.addEventListener("close", () => finish(null));
    ws.addEventListener("error", () => finish(new Error("TTS: помилка зʼєднання")));

    ws.send(cfg);
    ws.send(req);
  });
}
