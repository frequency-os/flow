# Бібліотека промптів і скілів Frequency

Готові тексти, які можна вставити в чат з Claude, щоб він працював над
Frequency за нашими правилами з першого повідомлення, а не з третього.

## Навіщо

- **Менше пояснювати щоразу.** Мета, межі й доказ уже вписані в шаблон.
- **Однаковий результат.** Аудит, міграція чи публікація щоразу йдуть тими
  самими кроками, а не з пам'яті окремої сесії.
- **Правила CLAUDE.md стають діями.** «Спершу задум», «не казати готово без
  доказу» і «перевір у браузері на 375×812» тут розписані покроково.

Репо публічне. Тут лише «як працювати і як перевіряти». Конкретні знахідки
аудитів, адреси сервісів, ключі й особисті дані сюди не пишемо ніколи.

## Як користуватись

1. **Нова задача.** Відкрий [`00-yak-stavyty-zadachu.md`](00-yak-stavyty-zadachu.md),
   заповни шаблон і встав у чат. Claude сам визначить тип задачі
   (розвідка / точкова правка / нова система) і запропонує задум.
2. **Типова робота.** Візьми потрібний файл із [`workflows/`](workflows/) і
   встав його першим повідомленням, дописавши свою задачу вгорі.
3. **Аудит.** Візьми файл із [`audits/`](audits/). Кожен — готовий промпт:
   що перевірити, у якому форматі звітувати і як перевірити самі знахідки.
4. **Скіли** у [`.claude/skills/`](../.claude/skills/) Claude підхоплює сам,
   коли бачить знайомі слова («задеплой», «баг з телефона», «міграція»…).
   Їх можна викликати й руками: `/frequency-verify`, `/frequency-deploy` тощо.
5. **Субагенти** у [`.claude/agents/`](../.claude/agents/) — окремі рецензенти.
   Попроси: «прожени data-safety-reviewer по моєму диффу».

## Зміст

### Постановка задачі
- [`00-yak-stavyty-zadachu.md`](00-yak-stavyty-zadachu.md) — шаблон і 3 приклади

### Аудити (`audits/`)
| Файл | Що перевіряє |
|---|---|
| [`bezpeka.md`](audits/bezpeka.md) | Екранування, ворота запису AI, вхід, чужий HTML |
| [`dani-i-synk.md`](audits/dani-i-synk.md) | Сховище, хмара, міграції, бекап, «порожньо ≠ не відповіло» |
| [`shvydkodiia.md`](audits/shvydkodiia.md) | Гарячі шляхи на iPhone: записи, рендер, таймери, вага збірки |
| [`ai-agent.md`](audits/ai-agent.md) | Інструменти агента, шторки, ліміт, мова, підказки |
| [`ux-dostupnist.md`](audits/ux-dostupnist.md) | Двері й «назад», тап-зони, safe-area, клавіатура, доступність |
| [`app-store.md`](audits/app-store.md) | Що побачить рецензент Apple: згоди, видалення, заглушки |
| [`arkhitektura.md`](audits/arkhitektura.md) | Глобальні імена, дублі хелперів, каскад CSS, порожні catch |
| [`relizy.md`](audits/relizy.md) | Шлях від правки до телефона: перевірки, деплой, відкат |
| [`robota-z-claude.md`](audits/robota-z-claude.md) | Як сесії дотримуються правил: пам'ять, паралельність, докази |

### Робочі процеси (`workflows/`)
| Файл | Коли |
|---|---|
| [`nova-funktsiia.md`](workflows/nova-funktsiia.md) | Нова можливість, якої ще нема |
| [`tochkova-pravka.md`](workflows/tochkova-pravka.md) | Зміна в наявній системі з CODEMAP |
| [`bah-z-telefona.md`](workflows/bah-z-telefona.md) | Скрін чи опис бага з iPhone |
| [`mihratsiia-danykh.md`](workflows/mihratsiia-danykh.md) | Код, що при старті змінює збережені дані |
| [`publikatsiia.md`](workflows/publikatsiia.md) | «Задеплой», «на телефон» |
| [`novyi-instrument-ahenta.md`](workflows/novyi-instrument-ahenta.md) | Нова дія для агента Флоу |
| [`novyi-ekran.md`](workflows/novyi-ekran.md) | Новий екран, секція чи CSS-файл |
| [`nichna-zmina.md`](workflows/nichna-zmina.md) | Кілька виправлень паралельно, поки ти спиш |

### Скіли (`.claude/skills/`)
`frequency-verify`, `frequency-migration`, `frequency-deploy`,
`frequency-agent-tool`, `frequency-new-screen`, `frequency-phone-bug`,
`frequency-audit` — короткі покрокові версії процесів вище.

### Субагенти (`.claude/agents/`)
`data-safety-reviewer`, `ui-verifier`, `security-reviewer`.

## Як додати новий промпт

- Назва файлу — латиницею, зміст — українською.
- Кожен промпт закінчується розділом «Як доведеш, що вийшло» з командою
  чи діями в браузері. Без нього промпт не приймаємо.
- Якщо новий процес повторюється частіше разу на тиждень — зроби з нього
  скіл у `.claude/skills/<назва>/SKILL.md` і дай посилання сюди.
