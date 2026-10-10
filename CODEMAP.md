# CODEMAP — карта коду

> **Цей файл створює скрипт. Руками не правити** — зміни зітруться.
> Перебудувати: `npm run map`. Чи не відстала карта — скаже `./tools/check.sh`.
>
> Карта веде в `src/`, а не в `dist/index.html`: `dist` перезбирається
> щоразу, тому номери рядків у ньому старіють одразу.
>
> **Навіщо:** щоб не тягнути в контекст AI-сесії весь код. Спершу карта —
> потім читати лише потрібний файл.

## Огляд

| Метрика | Значення |
|---|---|
| Файлів JS | 86 |
| Рядків JS | 33729 |
| Файлів CSS | 47 |
| Рядків CSS | 10471 |
| Сутностей верхнього рівня | 2286 |
| Ключів сховища (FLOW_KEYS) | 78 |

## Файли JS

| Файл | Рядків | Сутностей |
|---|---|---|
| `desktop/main.js` | 232 | 13 |
| `desktop/preload.js` | 21 | 0 |
| `src/scripts/01-crash-screen.js` | 111 | 14 |
| `src/scripts/03-quota-banner.js` | 14 | 2 |
| `src/scripts/21-newyear-countdown.js` | 127 | 11 |
| `src/scripts/40-pets-3d.js` | 297 | 0 |
| `src/scripts/41-theme-layer.js` | 153 | 0 |
| `src/scripts/42-voice-island.js` | 855 | 0 |
| `src/scripts/43-planner.js` | 137 | 0 |
| `src/scripts/44-week.js` | 325 | 0 |
| `src/scripts/45-month.js` | 662 | 0 |
| `src/scripts/46-mx.js` | 220 | 0 |
| `src/scripts/core/01-base.js` | 410 | 39 |
| `src/scripts/core/02-storage.js` | 2142 | 177 |
| `src/scripts/core/03-platform.js` | 60 | 14 |
| `src/scripts/core/04-folders-nav.js` | 423 | 57 |
| `src/scripts/core/05-spaces.js` | 698 | 61 |
| `src/scripts/core/06-wishes.js` | 1460 | 111 |
| `src/scripts/core/07-values.js` | 202 | 18 |
| `src/scripts/core/08-finance.js` | 788 | 101 |
| `src/scripts/core/09-goals.js` | 706 | 30 |
| `src/scripts/core/10-planner.js` | 923 | 49 |
| `src/scripts/core/11-ai-flow.js` | 327 | 35 |
| `src/scripts/core/12-ai-agent.js` | 1840 | 94 |
| `src/scripts/core/13-pets.js` | 227 | 13 |
| `src/scripts/core/14-react.js` | 337 | 43 |
| `src/scripts/core/15-flow-spot.js` | 2066 | 97 |
| `src/scripts/core/16-dashboard.js` | 1049 | 55 |
| `src/scripts/core/17-folder-render.js` | 16 | 2 |
| `src/scripts/core/18-debts.js` | 199 | 18 |
| `src/scripts/core/19-spending.js` | 136 | 14 |
| `src/scripts/core/20-work.js` | 521 | 51 |
| `src/scripts/core/21-patterns.js` | 191 | 21 |
| `src/scripts/core/22-diary.js` | 536 | 54 |
| `src/scripts/core/23-board.js` | 322 | 29 |
| `src/scripts/core/24-reminders.js` | 191 | 16 |
| `src/scripts/core/25-reader.js` | 566 | 40 |
| `src/scripts/core/26-blocks-render.js` | 1453 | 16 |
| `src/scripts/core/27-canvas.js` | 593 | 27 |
| `src/scripts/core/28-vision.js` | 528 | 42 |
| `src/scripts/core/29-more-screen.js` | 588 | 32 |
| `src/scripts/core/30-upgrade.js` | 296 | 30 |
| `src/scripts/core/31-my-year.js` | 200 | 21 |
| `src/scripts/core/32-global-search.js` | 152 | 13 |
| `src/scripts/core/34-shortcuts.js` | 54 | 5 |
| `src/scripts/core/35-channel.js` | 691 | 65 |
| `src/scripts/core/36-chats.js` | 423 | 45 |
| `src/scripts/core/37-ai-privacy.js` | 203 | 20 |
| `src/scripts/core/38-world.js` | 107 | 5 |
| `src/scripts/core/39-spheres.js` | 238 | 20 |
| `src/scripts/core/40-year-letter.js` | 292 | 30 |
| `src/scripts/core/41-journal.js` | 754 | 64 |
| `src/scripts/core/42-day.js` | 314 | 35 |
| `src/scripts/core/43-month.js` | 244 | 32 |
| `src/scripts/core/44-prizes.js` | 171 | 24 |
| `src/scripts/core/45-year.js` | 145 | 21 |
| `src/scripts/core/46-wallet.js` | 403 | 36 |
| `src/scripts/core/47-rules.js` | 340 | 29 |
| `src/scripts/core/48-hero.js` | 316 | 36 |
| `src/scripts/core/48-widgets.js` | 200 | 20 |
| `src/scripts/core/49-finlit.js` | 132 | 17 |
| `src/scripts/core/50-quickadd.js` | 65 | 5 |
| `src/scripts/core/51-money-reset.js` | 74 | 7 |
| `src/scripts/page-editor/01-palette.js` | 183 | 17 |
| `src/scripts/page-editor/02-block-styles.js` | 893 | 49 |
| `src/scripts/page-editor/03-premium-pack.js` | 638 | 34 |
| `src/scripts/page-editor/04-w-journal.js` | 107 | 9 |
| `src/scripts/page-editor/05-w-decisions.js` | 112 | 4 |
| `src/scripts/page-editor/06-w-project.js` | 100 | 6 |
| `src/scripts/page-editor/07-w-habits.js` | 69 | 4 |
| `src/scripts/page-editor/08-w-projects-hub.js` | 973 | 44 |
| `src/scripts/page-editor/09-journal-sheet.js` | 488 | 37 |
| `src/scripts/page-editor/10-mic.js` | 155 | 10 |
| `src/vendor/jszip.min.js` _(мініфікований вендор)_ | 13 | — |
| `src/vendor/pdf.min.js` _(мініфікований вендор)_ | 22 | — |
| `src/vendor/supabase.min.js` _(мініфікований вендор)_ | 11 | — |
| `src/web/hero-assets.js` _(мініфікований вендор)_ | 22 | — |
| `src/web/hero-outfits.js` _(мініфікований вендор)_ | 20 | — |
| `src/web/misto-assets.js` _(мініфікований вендор)_ | 43 | — |
| `src/web/sw.js` | 109 | 9 |
| `tools/make-icon.js` | 40 | 5 |
| `tools/scriptcheck.js` | 98 | 12 |
| `tools/smoke.js` | 61 | 5 |
| `tools/test-migrations.js` | 374 | 34 |
| `worker/flow-ai-worker.js` | 581 | 20 |
| `worker/test-worker.mjs` | 151 | 11 |

## Файли CSS

| Файл | Рядків | Селекторів |
|---|---|---|
| `src/styles/00-fonts.css` | 68 | 0 |
| `src/styles/03-patterns.css` | 71 | 0 |
| `src/styles/04-diary.css` | 110 | 0 |
| `src/styles/10-fd26.css` | 29 | 0 |
| `src/styles/12-theme-nightfire.css` | 419 | 6 |
| `src/styles/13-planner.css` | 82 | 0 |
| `src/styles/14-week.css` | 157 | 0 |
| `src/styles/15-month.css` | 227 | 2 |
| `src/styles/16-mx.css` | 242 | 2 |
| `src/styles/17-horizon.css` | 369 | 1 |
| `src/styles/18-standalone.css` | 43 | 1 |
| `src/styles/19-themes-flat.css` | 408 | 3 |
| `src/styles/20-depth.css` | 129 | 8 |
| `src/styles/21-hero-week.css` | 133 | 2 |
| `src/styles/22-more-screen.css` | 181 | 0 |
| `src/styles/23-doc-readable.css` | 138 | 4 |
| `src/styles/core/01-tokens-base.css` | 349 | 9 |
| `src/styles/core/02-page-editor.css` | 1241 | 9 |
| `src/styles/core/03-folders-projects.css` | 695 | 0 |
| `src/styles/core/04-menus.css` | 89 | 0 |
| `src/styles/core/05-values-wishes.css` | 186 | 0 |
| `src/styles/core/06-goals.css` | 228 | 0 |
| `src/styles/core/07-finance.css` | 597 | 0 |
| `src/styles/core/08-work.css` | 202 | 0 |
| `src/styles/core/09-board-canvas.css` | 193 | 3 |
| `src/styles/core/10-reader-blocks.css` | 461 | 4 |
| `src/styles/core/11-spaces-desktop.css` | 181 | 0 |
| `src/styles/core/12-pets-more-planner.css` | 1228 | 0 |
| `src/styles/core/13-search-capture.css` | 84 | 0 |
| `src/styles/core/15-vision.css` | 172 | 0 |
| `src/styles/core/16-upgrade.css` | 54 | 0 |
| `src/styles/core/17-my-year.css` | 64 | 0 |
| `src/styles/core/18-channel.css` | 178 | 0 |
| `src/styles/core/19-chats.css` | 91 | 0 |
| `src/styles/core/20-world.css` | 20 | 0 |
| `src/styles/core/21-spheres.css` | 82 | 0 |
| `src/styles/core/22-year-letter.css` | 70 | 0 |
| `src/styles/core/23-ritual-steps.css` | 65 | 0 |
| `src/styles/core/24-home-gallery.css` | 215 | 0 |
| `src/styles/core/25-journal.css` | 301 | 0 |
| `src/styles/core/26-day.css` | 129 | 0 |
| `src/styles/core/27-month.css` | 115 | 0 |
| `src/styles/core/28-prizes.css` | 43 | 0 |
| `src/styles/core/29-year.css` | 84 | 0 |
| `src/styles/core/30-wallet.css` | 112 | 0 |
| `src/styles/core/31-rules.css` | 76 | 0 |
| `src/styles/core/32-widgets.css` | 60 | 0 |

## Ключі сховища — FLOW_KEYS (78)

`src/scripts/core/01-base.js`

`0` · `active_space_map_v2` · `ai_chat` · `ai_endpoint` · `ai_memory` · `ai_pet`

`ai_privacy_v1` · `ai_prompts` · `ai_voice` · `blockusage` · `board` · `chats_v1`

`collage_board` · `custom_avatar_v1` · `customboards` · `debts` · `diary_books_v1` · `diary_entries_v1`

`diary_insights_v1` · `envelopes` · `fin_curs` · `fin_ops` · `fin_projects` · `fin_recurring`

`flowPgCovers` · `flowcardskin` · `flowprotheme` · `flowtheme` · `folder_widgets` · `folderopts`

`folders_cfg` · `folders_deleted_v1` · `folders_order` · `folderview` · `forcedesktop` · `forcemobile`

`fx_cfg` · `fx_mode` · `fx_say` · `goals_data` · `hero_look` · `home_glass_on`

`homeov` · `hometab` · `homewidgets` · `i18n_content_cache` · `income_cards` · `lang_pref`

`main_cur` · `patterns_chains` · `patterns_score` · `patterns_transform` · `pet_hidden` · `pet_pos`

`pet_sleep` · `readerCfg` · `ritual_board` · `sidebarcol` · `spacecanvas` · `spacecanvaszoom`

`spacefull` · `spaces_map_v2` · `spaceview` · `spacewide` · `spend` · `switcher_style`

`ui_mode` · `upgrade_profile_v1` · `values_state` · `vision_v1` · `wish_active_days_v1` · `wish_price`

`wishes_board` · `work_blocks` · `work_cfg` · `work_extras` · `work_sessions` · `world_game`

## Сутності по файлах

Посилання виду `файл:рядок` — клікабельні.

### `desktop/main.js` — 13 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `path` | значення | `desktop/main.js:7` |
| `fs` | значення | `desktop/main.js:8` |
| `DIST` | значення | `desktop/main.js:12` |
| `START` | значення | `desktop/main.js:13` |
| `stateFile` | функція | `desktop/main.js:28` |
| `loadState` | функція | `desktop/main.js:30` |
| `saveState` | функція | `desktop/main.js:40` |
| `mainWindow` | значення | `desktop/main.js:47` |
| `pendingAuthUrl` | значення | `desktop/main.js:58` |
| `authReady` | значення | `desktop/main.js:59` |
| `deliverAuth` | функція | `desktop/main.js:61` |
| `createWindow` | функція | `desktop/main.js:77` |
| `watchSources` | функція | `desktop/main.js:154` |

### `desktop/preload.js` — порожньо на верхньому рівні

### `src/scripts/01-crash-screen.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `BUILD` | значення | `src/scripts/01-crash-screen.js:9` |
| `KEY` | значення | `src/scripts/01-crash-screen.js:18` |
| `read` | функція | `src/scripts/01-crash-screen.js:19` |
| `add` | функція | `src/scripts/01-crash-screen.js:22` |
| `pad` | функція | `src/scripts/01-crash-screen.js:32` |
| `when` | функція | `src/scripts/01-crash-screen.js:33` |
| `text` | функція | `src/scripts/01-crash-screen.js:35` |
| `window.flowErrLog` | обʼєкт | `src/scripts/01-crash-screen.js:43` |
| `box` | значення | `src/scripts/01-crash-screen.js:48` |
| `show` | функція | `src/scripts/01-crash-screen.js:49` |
| `devOn` | функція | `src/scripts/01-crash-screen.js:77` |
| `QUIET` | значення | `src/scripts/01-crash-screen.js:83` |
| `quiet` | функція | `src/scripts/01-crash-screen.js:84` |
| `report` | функція | `src/scripts/01-crash-screen.js:100` |

### `src/scripts/03-quota-banner.js` — 2 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `window.__quotaHit` | значення | `src/scripts/03-quota-banner.js:2` |
| `window.showQuotaBanner` | функція | `src/scripts/03-quota-banner.js:6` |

### `src/scripts/21-newyear-countdown.js` — 11 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MONTHS` | масив | `src/scripts/21-newyear-countdown.js:3` |
| `midnight` | функція | `src/scripts/21-newyear-countdown.js:4` |
| `targetDate` | функція | `src/scripts/21-newyear-countdown.js:5` |
| `daysInYear` | функція | `src/scripts/21-newyear-countdown.js:6` |
| `tickWidget` | функція | `src/scripts/21-newyear-countdown.js:9` |
| `curView` | значення | `src/scripts/21-newyear-countdown.js:24` |
| `tickHero` | функція | `src/scripts/21-newyear-countdown.js:25` |
| `renderView` | функція | `src/scripts/21-newyear-countdown.js:45` |
| `refreshScreen` | функція | `src/scripts/21-newyear-countdown.js:100` |
| `window.__nycRefresh` | значення | `src/scripts/21-newyear-countdown.js:101` |
| `window.goNYC` | функція | `src/scripts/21-newyear-countdown.js:122` |

### `src/scripts/40-pets-3d.js` — порожньо на верхньому рівні

### `src/scripts/41-theme-layer.js` — порожньо на верхньому рівні

### `src/scripts/42-voice-island.js` — порожньо на верхньому рівні

### `src/scripts/43-planner.js` — порожньо на верхньому рівні

### `src/scripts/44-week.js` — порожньо на верхньому рівні

### `src/scripts/45-month.js` — порожньо на верхньому рівні

### `src/scripts/46-mx.js` — порожньо на верхньому рівні

### `src/scripts/core/01-base.js` — 39 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `visInterval` | функція | `src/scripts/core/01-base.js:52` |
| `window.visInterval` | значення | `src/scripts/core/01-base.js:62` |
| `ymdLocal` | функція | `src/scripts/core/01-base.js:67` |
| `ymLocal` | функція | `src/scripts/core/01-base.js:69` |
| `window.ymdLocal` | значення | `src/scripts/core/01-base.js:70` |
| `esc` | функція | `src/scripts/core/01-base.js:75` |
| `fmt` | функція | `src/scripts/core/01-base.js:76` |
| `pluralUk` | функція | `src/scripts/core/01-base.js:81` |
| `window.pluralUk` | значення | `src/scripts/core/01-base.js:88` |
| `safeEmoji` | функція | `src/scripts/core/01-base.js:95` |
| `window.safeEmoji` | значення | `src/scripts/core/01-base.js:100` |
| `safeColor` | функція | `src/scripts/core/01-base.js:106` |
| `window.safeColor` | значення | `src/scripts/core/01-base.js:111` |
| `window.FLOW_KEYS` | масив | `src/scripts/core/01-base.js:120` |
| `window.FLOW_RAW_KEYS` | масив | `src/scripts/core/01-base.js:178` |
| `getLang` | функція | `src/scripts/core/01-base.js:195` |
| `setLang` | функція | `src/scripts/core/01-base.js:196` |
| `window.__flowLang` | значення | `src/scripts/core/01-base.js:197` |
| `window.flowLang` | значення | `src/scripts/core/01-base.js:198` |
| `window.flowSetLang` | значення | `src/scripts/core/01-base.js:199` |
| `I18N_DICT` | обʼєкт | `src/scripts/core/01-base.js:204` |
| `I18N_WORDS` | масив | `src/scripts/core/01-base.js:256` |
| `wordLevelTranslate` | функція | `src/scripts/core/01-base.js:284` |
| `I18N_NO_TOUCH` | обʼєкт | `src/scripts/core/01-base.js:299` |
| `translateNode` | функція | `src/scripts/core/01-base.js:302` |
| `i18nApply` | функція | `src/scripts/core/01-base.js:325` |
| `window.i18nApply` | значення | `src/scripts/core/01-base.js:329` |
| `i18nBlocked` | функція | `src/scripts/core/01-base.js:333` |
| `raf` | значення | `src/scripts/core/01-base.js:343` |
| `flush` | функція | `src/scripts/core/01-base.js:344` |
| `mo` | функція | `src/scripts/core/01-base.js:351` |
| `contentTranslateOn` | функція | `src/scripts/core/01-base.js:372` |
| `window.flowContentTranslateOn` | значення | `src/scripts/core/01-base.js:375` |
| `hash` | функція | `src/scripts/core/01-base.js:376` |
| `cacheGet` | функція | `src/scripts/core/01-base.js:377` |
| `window.flowTranslateContent` | функція | `src/scripts/core/01-base.js:382` |
| `window.__flowErrors` | масив | `src/scripts/core/01-base.js:398` |
| `push` | функція | `src/scripts/core/01-base.js:399` |
| `window.flowErrors` | функція | `src/scripts/core/01-base.js:408` |

### `src/scripts/core/02-storage.js` — 177 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FLAG` | значення | `src/scripts/core/02-storage.js:11` |
| `LP` | значення | `src/scripts/core/02-storage.js:24` |
| `window.__flowSync` | обʼєкт | `src/scripts/core/02-storage.js:25` |
| `setSync` | функція | `src/scripts/core/02-storage.js:27` |
| `wrap` | функція | `src/scripts/core/02-storage.js:34` |
| `unwrap` | функція | `src/scripts/core/02-storage.js:38` |
| `SCHEMAS` | обʼєкт | `src/scripts/core/02-storage.js:54` |
| `MIGRATIONS` | обʼєкт | `src/scripts/core/02-storage.js:64` |
| `readSv` | функція | `src/scripts/core/02-storage.js:80` |
| `migrateParsed` | функція | `src/scripts/core/02-storage.js:87` |
| `stampSv` | функція | `src/scripts/core/02-storage.js:102` |
| `unstampSv` | функція | `src/scripts/core/02-storage.js:115` |
| `lcGet` | функція | `src/scripts/core/02-storage.js:123` |
| `isQuotaErr` | функція | `src/scripts/core/02-storage.js:125` |
| `purgeDisposable` | функція | `src/scripts/core/02-storage.js:130` |
| `lcSet` | функція | `src/scripts/core/02-storage.js:146` |
| `lcDel` | функція | `src/scripts/core/02-storage.js:169` |
| `NP` | значення | `src/scripts/core/02-storage.js:185` |
| `npTimers` | обʼєкт | `src/scripts/core/02-storage.js:193` |
| `npFails` | значення | `src/scripts/core/02-storage.js:194` |
| `npReady` | функція | `src/scripts/core/02-storage.js:198` |
| `npWrite` | функція | `src/scripts/core/02-storage.js:200` |
| `npDel` | функція | `src/scripts/core/02-storage.js:218` |
| `NP_WIPED` | значення | `src/scripts/core/02-storage.js:232` |
| `npWipeAll` | функція | `src/scripts/core/02-storage.js:233` |
| `npHydrate` | функція | `src/scripts/core/02-storage.js:253` |
| `npSeed` | функція | `src/scripts/core/02-storage.js:289` |
| `window.storage` | обʼєкт | `src/scripts/core/02-storage.js:306` |
| `SB_URL` | значення | `src/scripts/core/02-storage.js:401` |
| `SB_KEY` | значення | `src/scripts/core/02-storage.js:402` |
| `sb` | значення | `src/scripts/core/02-storage.js:403` |
| `sbBatchCache` | значення | `src/scripts/core/02-storage.js:404` |
| `sbBatchTs` | обʼєкт | `src/scripts/core/02-storage.js:405` |
| `window.__sbReady` | значення | `src/scripts/core/02-storage.js:406` |
| `OWNER_KEY` | значення | `src/scripts/core/02-storage.js:425` |
| `sbOwnerRead` | функція | `src/scripts/core/02-storage.js:426` |
| `sbPastUsers` | функція | `src/scripts/core/02-storage.js:431` |
| `sbForeign` | значення | `src/scripts/core/02-storage.js:437` |
| `sbTabOwner` | значення | `src/scripts/core/02-storage.js:438` |
| `sbReloading` | значення | `src/scripts/core/02-storage.js:439` |
| `sbReloadTab` | функція | `src/scripts/core/02-storage.js:440` |
| `sbSetUser` | функція | `src/scripts/core/02-storage.js:445` |
| `sbOutboxMine` | функція | `src/scripts/core/02-storage.js:481` |
| `loadSupabaseLib` | функція | `src/scripts/core/02-storage.js:492` |
| `sbReadyEvt` | функція | `src/scripts/core/02-storage.js:512` |
| `sbInit` | функція | `src/scripts/core/02-storage.js:513` |
| `window.sbUser` | функція | `src/scripts/core/02-storage.js:569` |
| `sbFromCloud` | функція | `src/scripts/core/02-storage.js:579` |
| `sbToCloud` | функція | `src/scripts/core/02-storage.js:580` |
| `window.sbAccessToken` | функція | `src/scripts/core/02-storage.js:588` |
| `sbPrefetchAll` | функція | `src/scripts/core/02-storage.js:597` |
| `sbLocalVersion` | функція | `src/scripts/core/02-storage.js:612` |
| `window.sbPrefetchAll` | значення | `src/scripts/core/02-storage.js:620` |
| `window.sbCloudFresher` | функція | `src/scripts/core/02-storage.js:626` |
| `window.sbCacheLocal` | функція | `src/scripts/core/02-storage.js:640` |
| `window.sbDataTrusted` | функція | `src/scripts/core/02-storage.js:655` |
| `keyRead` | обʼєкт | `src/scripts/core/02-storage.js:671` |
| `keyMark` | обʼєкт | `src/scripts/core/02-storage.js:672` |
| `keyRecon` | обʼєкт | `src/scripts/core/02-storage.js:673` |
| `keyPending` | обʼєкт | `src/scripts/core/02-storage.js:674` |
| `sbLastGot` | обʼєкт | `src/scripts/core/02-storage.js:675` |
| `autoDepth` | значення | `src/scripts/core/02-storage.js:676` |
| `sbReconciled` | функція | `src/scripts/core/02-storage.js:677` |
| `window.storeMarkRead` | функція | `src/scripts/core/02-storage.js:679` |
| `window.storeKeyReady` | функція | `src/scripts/core/02-storage.js:699` |
| `window.storeAutoBegin` | функція | `src/scripts/core/02-storage.js:709` |
| `window.storeAuto` | функція | `src/scripts/core/02-storage.js:713` |
| `sbWriteMeta` | функція | `src/scripts/core/02-storage.js:730` |
| `sbMergeHeld` | функція | `src/scripts/core/02-storage.js:755` |
| `HK_PREFIX` | значення | `src/scripts/core/02-storage.js:791` |
| `sbKeepHeld` | функція | `src/scripts/core/02-storage.js:792` |
| `sbReconcile` | функція | `src/scripts/core/02-storage.js:813` |
| `sbCommitReconciled` | функція | `src/scripts/core/02-storage.js:834` |
| `sbSigningIn` | значення | `src/scripts/core/02-storage.js:855` |
| `window.sbSignInGoogle` | функція | `src/scripts/core/02-storage.js:856` |
| `window.sbSignOut` | функція | `src/scripts/core/02-storage.js:933` |
| `origGet` | значення | `src/scripts/core/02-storage.js:971` |
| `origSet` | значення | `src/scripts/core/02-storage.js:972` |
| `origDelete` | значення | `src/scripts/core/02-storage.js:973` |
| `origList` | значення | `src/scripts/core/02-storage.js:974` |
| `sbGet` | функція | `src/scripts/core/02-storage.js:976` |
| `sbWriteQueue` | обʼєкт | `src/scripts/core/02-storage.js:1021` |
| `sbWriteTimer` | значення | `src/scripts/core/02-storage.js:1022` |
| `sbInFlight` | обʼєкт | `src/scripts/core/02-storage.js:1028` |
| `sbFlushSeq` | значення | `src/scripts/core/02-storage.js:1034` |
| `sbDoneSeq` | обʼєкт | `src/scripts/core/02-storage.js:1035` |
| `sbOutboxSave` | функція | `src/scripts/core/02-storage.js:1038` |
| `sbOutboxTimer` | значення | `src/scripts/core/02-storage.js:1062` |
| `sbOutboxKeys` | обʼєкт | `src/scripts/core/02-storage.js:1063` |
| `sbHiding` | значення | `src/scripts/core/02-storage.js:1064` |
| `sbOutboxSaveSoon` | функція | `src/scripts/core/02-storage.js:1065` |
| `sbOutboxLoad` | функція | `src/scripts/core/02-storage.js:1069` |
| `sbSyncPending` | функція | `src/scripts/core/02-storage.js:1076` |
| `sbScheduleWrite` | функція | `src/scripts/core/02-storage.js:1077` |
| `sbFlushWrites` | функція | `src/scripts/core/02-storage.js:1085` |
| `window.sbFlushWrites` | значення | `src/scripts/core/02-storage.js:1148` |
| `window.sbDropQueue` | функція | `src/scripts/core/02-storage.js:1150` |
| `sbOnHide` | функція | `src/scripts/core/02-storage.js:1157` |
| `sbPullChanged` | функція | `src/scripts/core/02-storage.js:1192` |
| `sbLastPull` | значення | `src/scripts/core/02-storage.js:1214` |
| `sbPullFresh` | функція | `src/scripts/core/02-storage.js:1215` |
| `sbPullAndLoad` | функція | `src/scripts/core/02-storage.js:1233` |
| `window.sbPullFresh` | значення | `src/scripts/core/02-storage.js:1256` |
| `window.sbPullAndLoad` | значення | `src/scripts/core/02-storage.js:1257` |
| `PH_KEY` | значення | `src/scripts/core/02-storage.js:1273` |
| `PH_PENDING` | значення | `src/scripts/core/02-storage.js:1274` |
| `phPendingGet` | функція | `src/scripts/core/02-storage.js:1275` |
| `phPendingSet` | функція | `src/scripts/core/02-storage.js:1276` |
| `phPendingAdd` | функція | `src/scripts/core/02-storage.js:1277` |
| `phPendingDrop` | функція | `src/scripts/core/02-storage.js:1278` |
| `PH_TS` | значення | `src/scripts/core/02-storage.js:1283` |
| `phTsGet` | функція | `src/scripts/core/02-storage.js:1284` |
| `phTsSet` | функція | `src/scripts/core/02-storage.js:1285` |
| `phTsDrop` | функція | `src/scripts/core/02-storage.js:1286` |
| `window.sbPhotoPush` | функція | `src/scripts/core/02-storage.js:1288` |
| `window.sbPhotoFetch` | функція | `src/scripts/core/02-storage.js:1304` |
| `window.sbPhotoList` | функція | `src/scripts/core/02-storage.js:1321` |
| `window.sbPhotoDel` | функція | `src/scripts/core/02-storage.js:1336` |
| `phSyncBusy` | значення | `src/scripts/core/02-storage.js:1346` |
| `sbPhotoSync` | функція | `src/scripts/core/02-storage.js:1347` |
| `window.sbPhotoSync` | значення | `src/scripts/core/02-storage.js:1377` |
| `window.sbWipeAll` | функція | `src/scripts/core/02-storage.js:1382` |
| `prefSet` | функція | `src/scripts/core/02-storage.js:1451` |
| `prefCatchup` | функція | `src/scripts/core/02-storage.js:1455` |
| `UIMODE_KEY` | значення | `src/scripts/core/02-storage.js:1468` |
| `window.uiMode` | значення | `src/scripts/core/02-storage.js:1469` |
| `applyUiMode` | функція | `src/scripts/core/02-storage.js:1470` |
| `setUiMode` | функція | `src/scripts/core/02-storage.js:1471` |
| `window.setUiMode` | значення | `src/scripts/core/02-storage.js:1479` |
| `LP` | значення | `src/scripts/core/02-storage.js:1486` |
| `FORMAT` | значення | `src/scripts/core/02-storage.js:1487` |
| `APP` | значення | `src/scripts/core/02-storage.js:1488` |
| `ZIP_JSON` | значення | `src/scripts/core/02-storage.js:1489` |
| `isSvc` | функція | `src/scripts/core/02-storage.js:1495` |
| `RAW_DATA` | масив | `src/scripts/core/02-storage.js:1499` |
| `JSON_KEYS` | масив | `src/scripts/core/02-storage.js:1501` |
| `collect` | функція | `src/scripts/core/02-storage.js:1505` |
| `collectRaw` | функція | `src/scripts/core/02-storage.js:1522` |
| `stats` | функція | `src/scripts/core/02-storage.js:1529` |
| `phBytes` | функція | `src/scripts/core/02-storage.js:1535` |
| `signedIn` | функція | `src/scripts/core/02-storage.js:1536` |
| `photoStats` | функція | `src/scripts/core/02-storage.js:1542` |
| `gatherPhotos` | функція | `src/scripts/core/02-storage.js:1563` |
| `makeEnvelope` | функція | `src/scripts/core/02-storage.js:1590` |
| `loadZip` | функція | `src/scripts/core/02-storage.js:1603` |
| `PH_EXT` | обʼєкт | `src/scripts/core/02-storage.js:1608` |
| `dataUrlParts` | функція | `src/scripts/core/02-storage.js:1609` |
| `makeFile` | функція | `src/scripts/core/02-storage.js:1622` |
| `saveBlob` | функція | `src/scripts/core/02-storage.js:1672` |
| `saveFile` | функція | `src/scripts/core/02-storage.js:1717` |
| `photosGap` | функція | `src/scripts/core/02-storage.js:1724` |
| `tapStillFresh` | функція | `src/scripts/core/02-storage.js:1735` |
| `exportToFile` | функція | `src/scripts/core/02-storage.js:1744` |
| `snapshot` | функція | `src/scripts/core/02-storage.js:1759` |
| `restoreSnapshot` | функція | `src/scripts/core/02-storage.js:1762` |
| `unwrapVal` | функція | `src/scripts/core/02-storage.js:1767` |
| `valOf` | функція | `src/scripts/core/02-storage.js:1772` |
| `checkEnvelope` | функція | `src/scripts/core/02-storage.js:1781` |
| `plural` | функція | `src/scripts/core/02-storage.js:1799` |
| `summarize` | функція | `src/scripts/core/02-storage.js:1804` |
| `readFile` | функція | `src/scripts/core/02-storage.js:1827` |
| `inspectFile` | функція | `src/scripts/core/02-storage.js:1837` |
| `applyEnvelope` | функція | `src/scripts/core/02-storage.js:1866` |
| `pushRestored` | функція | `src/scripts/core/02-storage.js:1890` |
| `applyInspected` | функція | `src/scripts/core/02-storage.js:1916` |
| `importFromFile` | функція | `src/scripts/core/02-storage.js:1934` |
| `window.flowBackup` | обʼєкт | `src/scripts/core/02-storage.js:1940` |
| `window.flowFactoryReset` | функція | `src/scripts/core/02-storage.js:1957` |
| `window.PhotoDB` | значення | `src/scripts/core/02-storage.js:2039` |
| `window.__photoCache` | значення | `src/scripts/core/02-storage.js:2077` |
| `__phPending` | обʼєкт | `src/scripts/core/02-storage.js:2083` |
| `__photoPoke` | функція | `src/scripts/core/02-storage.js:2084` |
| `window.photoSrc` | функція | `src/scripts/core/02-storage.js:2092` |
| `window.photoIsRef` | функція | `src/scripts/core/02-storage.js:2116` |
| `window.photoWarm` | функція | `src/scripts/core/02-storage.js:2117` |
| `window.photoPut` | функція | `src/scripts/core/02-storage.js:2123` |
| `window.photoDel` | функція | `src/scripts/core/02-storage.js:2132` |

### `src/scripts/core/03-platform.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CAP` | значення | `src/scripts/core/03-platform.js:9` |
| `isNative` | значення | `src/scripts/core/03-platform.js:10` |
| `window.FLOW_NATIVE` | значення | `src/scripts/core/03-platform.js:11` |
| `kind` | значення | `src/scripts/core/03-platform.js:14` |
| `haptic` | функція | `src/scripts/core/03-platform.js:20` |
| `user` | функція | `src/scripts/core/03-platform.js:23` |
| `setBgColor` | функція | `src/scripts/core/03-platform.js:26` |
| `openLink` | функція | `src/scripts/core/03-platform.js:29` |
| `diag` | функція | `src/scripts/core/03-platform.js:35` |
| `lockSwipe` | функція | `src/scripts/core/03-platform.js:39` |
| `expand` | функція | `src/scripts/core/03-platform.js:40` |
| `popup` | функція | `src/scripts/core/03-platform.js:43` |
| `window.platform` | обʼєкт | `src/scripts/core/03-platform.js:47` |
| `window.micDenyMsg` | функція | `src/scripts/core/03-platform.js:53` |

### `src/scripts/core/04-folders-nav.js` — 57 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `folders` | обʼєкт | `src/scripts/core/04-folders-nav.js:2` |
| `order` | масив | `src/scripts/core/04-folders-nav.js:6` |
| `currentFolderKey` | значення | `src/scripts/core/04-folders-nav.js:7` |
| `CUSTOM_AV_KEY` | значення | `src/scripts/core/04-folders-nav.js:10` |
| `customAvatar` | значення | `src/scripts/core/04-folders-nav.js:11` |
| `saveCustomAvatar` | функція | `src/scripts/core/04-folders-nav.js:12` |
| `FKEY` | значення | `src/scripts/core/04-folders-nav.js:13` |
| `FOLDER_COLORS` | масив | `src/scripts/core/04-folders-nav.js:14` |
| `FOLDER_EMOJIS` | масив | `src/scripts/core/04-folders-nav.js:15` |
| `FOLDER_ICONS` | масив | `src/scripts/core/04-folders-nav.js:20` |
| `EMOJI_ICON` | обʼєкт | `src/scripts/core/04-folders-nav.js:24` |
| `folderIconFor` | функція | `src/scripts/core/04-folders-nav.js:61` |
| `folderIcon` | функція | `src/scripts/core/04-folders-nav.js:69` |
| `ICON_ALL` | масив | `src/scripts/core/04-folders-nav.js:72` |
| `folderVisible` | функція | `src/scripts/core/04-folders-nav.js:85` |
| `foldersLoaded` | значення | `src/scripts/core/04-folders-nav.js:100` |
| `markFoldersLoaded` | функція | `src/scripts/core/04-folders-nav.js:101` |
| `foldersLookFactory` | функція | `src/scripts/core/04-folders-nav.js:103` |
| `storedFolderCount` | функція | `src/scripts/core/04-folders-nav.js:108` |
| `saveFolders` | функція | `src/scripts/core/04-folders-nav.js:117` |
| `FDELKEY` | значення | `src/scripts/core/04-folders-nav.js:159` |
| `FDEL_MAX` | значення | `src/scripts/core/04-folders-nav.js:160` |
| `tombsNorm` | функція | `src/scripts/core/04-folders-nav.js:161` |
| `tombsMerge` | функція | `src/scripts/core/04-folders-nav.js:170` |
| `tombsSame` | функція | `src/scripts/core/04-folders-nav.js:175` |
| `folderTombs` | обʼєкт | `src/scripts/core/04-folders-nav.js:179` |
| `folderTombed` | функція | `src/scripts/core/04-folders-nav.js:182` |
| `saveFolderTombs` | функція | `src/scripts/core/04-folders-nav.js:183` |
| `window.folderTombsReset` | функція | `src/scripts/core/04-folders-nav.js:185` |
| `folderPurge` | функція | `src/scripts/core/04-folders-nav.js:196` |
| `folderDelete` | функція | `src/scripts/core/04-folders-nav.js:243` |
| `mergeFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:261` |
| `applyFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:270` |
| `leaveTombedFolder` | функція | `src/scripts/core/04-folders-nav.js:298` |
| `folderWidgets` | обʼєкт | `src/scripts/core/04-folders-nav.js:317` |
| `FWKEY` | значення | `src/scripts/core/04-folders-nav.js:318` |
| `saveFolderWidgets` | функція | `src/scripts/core/04-folders-nav.js:319` |
| `orderedFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:321` |
| `PROJECT_STATUSES` | масив | `src/scripts/core/04-folders-nav.js:327` |
| `projStatusMeta` | функція | `src/scripts/core/04-folders-nav.js:331` |
| `folderProgress` | функція | `src/scripts/core/04-folders-nav.js:333` |
| `dueLabel` | функція | `src/scripts/core/04-folders-nav.js:345` |
| `projFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:354` |
| `folderNextStep` | функція | `src/scripts/core/04-folders-nav.js:356` |
| `completeFolderNextStep` | функція | `src/scripts/core/04-folders-nav.js:367` |
| `childFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:376` |
| `topFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:379` |
| `isDescendantFolder` | функція | `src/scripts/core/04-folders-nav.js:383` |
| `moveFolderTo` | функція | `src/scripts/core/04-folders-nav.js:391` |
| `goHome` | функція | `src/scripts/core/04-folders-nav.js:401` |
| `goFolder` | функція | `src/scripts/core/04-folders-nav.js:402` |
| `goDebts` | функція | `src/scripts/core/04-folders-nav.js:417` |
| `goFinance` | функція | `src/scripts/core/04-folders-nav.js:418` |
| `goEnvelopes` | функція | `src/scripts/core/04-folders-nav.js:419` |
| `goSpend` | функція | `src/scripts/core/04-folders-nav.js:420` |
| `workOrigin` | значення | `src/scripts/core/04-folders-nav.js:421` |
| `goWork` | функція | `src/scripts/core/04-folders-nav.js:422` |

### `src/scripts/core/05-spaces.js` — 61 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `spacesMap` | обʼєкт | `src/scripts/core/05-spaces.js:10` |
| `SPMKEY` | значення | `src/scripts/core/05-spaces.js:11` |
| `saveSpacesMeta` | функція | `src/scripts/core/05-spaces.js:18` |
| `curCtx` | функція | `src/scripts/core/05-spaces.js:21` |
| `ctxBaseKey` | функція | `src/scripts/core/05-spaces.js:25` |
| `ctxDefaultMeta` | функція | `src/scripts/core/05-spaces.js:26` |
| `spacesFor` | функція | `src/scripts/core/05-spaces.js:32` |
| `activeSpaceFor` | функція | `src/scripts/core/05-spaces.js:37` |
| `spaceByIdIn` | функція | `src/scripts/core/05-spaces.js:38` |
| `keyForSpaceIn` | функція | `src/scripts/core/05-spaces.js:39` |
| `spaceCountIn` | функція | `src/scripts/core/05-spaces.js:40` |
| `switchSpace` | функція | `src/scripts/core/05-spaces.js:43` |
| `goSpaceFor` | функція | `src/scripts/core/05-spaces.js:54` |
| `spaceFromFolder` | значення | `src/scripts/core/05-spaces.js:73` |
| `show` | функція | `src/scripts/core/05-spaces.js:76` |
| `dsbFillUser` | функція | `src/scripts/core/05-spaces.js:129` |
| `window.dsbFillUser` | значення | `src/scripts/core/05-spaces.js:152` |
| `dsbProfileSheet` | функція | `src/scripts/core/05-spaces.js:153` |
| `STG_COL` | обʼєкт | `src/scripts/core/05-spaces.js:189` |
| `STG_IC` | обʼєкт | `src/scripts/core/05-spaces.js:191` |
| `stgSvg` | функція | `src/scripts/core/05-spaces.js:219` |
| `stgIco` | функція | `src/scripts/core/05-spaces.js:223` |
| `renderSettingsCard` | функція | `src/scripts/core/05-spaces.js:238` |
| `window.renderSettingsCard` | значення | `src/scripts/core/05-spaces.js:328` |
| `openSettings` | функція | `src/scripts/core/05-spaces.js:333` |
| `window.openSettingsSheet` | значення | `src/scripts/core/05-spaces.js:340` |
| `sidebarCollapsed` | значення | `src/scripts/core/05-spaces.js:375` |
| `applyChrome` | функція | `src/scripts/core/05-spaces.js:380` |
| `homeWidgets` | значення | `src/scripts/core/05-spaces.js:396` |
| `applyHomeWidgets` | функція | `src/scripts/core/05-spaces.js:399` |
| `THEME_SETS` | обʼєкт | `src/scripts/core/05-spaces.js:419` |
| `THEME_META` | обʼєкт | `src/scripts/core/05-spaces.js:425` |
| `THEME_KEYS` | значення | `src/scripts/core/05-spaces.js:434` |
| `isTheme` | функція | `src/scripts/core/05-spaces.js:435` |
| `themeSetOf` | функція | `src/scripts/core/05-spaces.js:437` |
| `themeIsDark` | функція | `src/scripts/core/05-spaces.js:441` |
| `theme` | значення | `src/scripts/core/05-spaces.js:442` |
| `applyTheme` | функція | `src/scripts/core/05-spaces.js:466` |
| `setTheme` | функція | `src/scripts/core/05-spaces.js:491` |
| `setThemeSet` | функція | `src/scripts/core/05-spaces.js:501` |
| `toggleTheme` | функція | `src/scripts/core/05-spaces.js:505` |
| `proTheme` | значення | `src/scripts/core/05-spaces.js:519` |
| `applyProTheme` | функція | `src/scripts/core/05-spaces.js:521` |
| `toggleProTheme` | функція | `src/scripts/core/05-spaces.js:527` |
| `cardSkin` | значення | `src/scripts/core/05-spaces.js:537` |
| `applyCardSkin` | функція | `src/scripts/core/05-spaces.js:539` |
| `setCardSkin` | функція | `src/scripts/core/05-spaces.js:545` |
| `RR_DEFS` | обʼєкт | `src/scripts/core/05-spaces.js:566` |
| `rrCfg` | функція | `src/scripts/core/05-spaces.js:567` |
| `rrSave` | функція | `src/scripts/core/05-spaces.js:572` |
| `rrCfgSheet` | функція | `src/scripts/core/05-spaces.js:573` |
| `renderRightRail` | функція | `src/scripts/core/05-spaces.js:592` |
| `goGoals` | функція | `src/scripts/core/05-spaces.js:620` |
| `prjHexToRgb` | функція | `src/scripts/core/05-spaces.js:623` |
| `prjTileHTML` | функція | `src/scripts/core/05-spaces.js:631` |
| `renderProjects` | функція | `src/scripts/core/05-spaces.js:639` |
| `goProjects` | функція | `src/scripts/core/05-spaces.js:672` |
| `goPlanner` | функція | `src/scripts/core/05-spaces.js:677` |
| `goValues` | функція | `src/scripts/core/05-spaces.js:682` |
| `goWishes` | функція | `src/scripts/core/05-spaces.js:684` |
| `window.goWishes` | значення | `src/scripts/core/05-spaces.js:685` |

### `src/scripts/core/06-wishes.js` — 111 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `WICONS` | обʼєкт | `src/scripts/core/06-wishes.js:3` |
| `icoHtml` | функція | `src/scripts/core/06-wishes.js:18` |
| `actionSheet` | функція | `src/scripts/core/06-wishes.js:21` |
| `confirmSheet` | функція | `src/scripts/core/06-wishes.js:46` |
| `flowAlert` | функція | `src/scripts/core/06-wishes.js:57` |
| `WISH_KEY` | значення | `src/scripts/core/06-wishes.js:66` |
| `WISH_ACT_KEY` | значення | `src/scripts/core/06-wishes.js:67` |
| `wishes` | масив | `src/scripts/core/06-wishes.js:68` |
| `wishActiveDays` | обʼєкт | `src/scripts/core/06-wishes.js:69` |
| `loadWishes` | функція | `src/scripts/core/06-wishes.js:71` |
| `migrateWishPhotosOnce` | функція | `src/scripts/core/06-wishes.js:81` |
| `saveWishActiveDays` | функція | `src/scripts/core/06-wishes.js:97` |
| `saveWishes` | функція | `src/scripts/core/06-wishes.js:98` |
| `HOMEGLASS_KEY` | значення | `src/scripts/core/06-wishes.js:108` |
| `homeGlass` | значення | `src/scripts/core/06-wishes.js:109` |
| `loadHomeGlass` | функція | `src/scripts/core/06-wishes.js:111` |
| `saveHomeGlass` | функція | `src/scripts/core/06-wishes.js:112` |
| `applyHomeGlass` | функція | `src/scripts/core/06-wishes.js:113` |
| `WPRICE_KEY` | значення | `src/scripts/core/06-wishes.js:116` |
| `wishPrice` | значення | `src/scripts/core/06-wishes.js:117` |
| `loadWishPrice` | функція | `src/scripts/core/06-wishes.js:119` |
| `saveWishPrice` | функція | `src/scripts/core/06-wishes.js:120` |
| `wishPriceHTML` | функція | `src/scripts/core/06-wishes.js:121` |
| `bindWishPrice` | функція | `src/scripts/core/06-wishes.js:128` |
| `WISH_SLIDE_MS` | значення | `src/scripts/core/06-wishes.js:137` |
| `wishSlideTimer` | значення | `src/scripts/core/06-wishes.js:138` |
| `updateSummaryBg` | функція | `src/scripts/core/06-wishes.js:139` |
| `compressImage` | функція | `src/scripts/core/06-wishes.js:205` |
| `pickWishPhoto` | функція | `src/scripts/core/06-wishes.js:226` |
| `replaceWishPhoto` | функція | `src/scripts/core/06-wishes.js:269` |
| `askWishCap` | функція | `src/scripts/core/06-wishes.js:293` |
| `openWishCard` | функція | `src/scripts/core/06-wishes.js:299` |
| `pickProofPhoto` | функція | `src/scripts/core/06-wishes.js:373` |
| `delWish` | функція | `src/scripts/core/06-wishes.js:380` |
| `parseVideo` | функція | `src/scripts/core/06-wishes.js:395` |
| `addWishVideo` | функція | `src/scripts/core/06-wishes.js:413` |
| `setWishCover` | функція | `src/scripts/core/06-wishes.js:438` |
| `openWishVideo` | функція | `src/scripts/core/06-wishes.js:455` |
| `openWishMenu` | функція | `src/scripts/core/06-wishes.js:464` |
| `moveWish` | функція | `src/scripts/core/06-wishes.js:506` |
| `wishToGoal` | функція | `src/scripts/core/06-wishes.js:513` |
| `RIT_KEY` | значення | `src/scripts/core/06-wishes.js:540` |
| `RIT` | обʼєкт | `src/scripts/core/06-wishes.js:541` |
| `RIT_STEPS_KEY` | значення | `src/scripts/core/06-wishes.js:545` |
| `RIT_STEPS` | значення | `src/scripts/core/06-wishes.js:546` |
| `loadRitual` | функція | `src/scripts/core/06-wishes.js:552` |
| `saveRitual` | функція | `src/scripts/core/06-wishes.js:559` |
| `saveRitSteps` | функція | `src/scripts/core/06-wishes.js:560` |
| `__ritLoad` | значення | `src/scripts/core/06-wishes.js:561` |
| `ritualRerender` | функція | `src/scripts/core/06-wishes.js:563` |
| `ritualSheet` | функція | `src/scripts/core/06-wishes.js:570` |
| `ritForWorld` | функція | `src/scripts/core/06-wishes.js:588` |
| `ritDayForWorld` | функція | `src/scripts/core/06-wishes.js:597` |
| `goRitual` | функція | `src/scripts/core/06-wishes.js:614` |
| `ritDay` | функція | `src/scripts/core/06-wishes.js:636` |
| `ritDs` | функція | `src/scripts/core/06-wishes.js:637` |
| `ritStreak` | функція | `src/scripts/core/06-wishes.js:638` |
| `ytId` | функція | `src/scripts/core/06-wishes.js:652` |
| `fmtDur` | функція | `src/scripts/core/06-wishes.js:653` |
| `ritRec` | значення | `src/scripts/core/06-wishes.js:656` |
| `ritStopAll` | функція | `src/scripts/core/06-wishes.js:657` |
| `ritRecord` | функція | `src/scripts/core/06-wishes.js:659` |
| `ritPlay` | функція | `src/scripts/core/06-wishes.js:695` |
| `ritMixPlay` | функція | `src/scripts/core/06-wishes.js:696` |
| `ritFieldMic` | функція | `src/scripts/core/06-wishes.js:705` |
| `ritMixMenu` | функція | `src/scripts/core/06-wishes.js:715` |
| `ritAddLink` | функція | `src/scripts/core/06-wishes.js:723` |
| `ritLinkMenu` | функція | `src/scripts/core/06-wishes.js:733` |
| `RIT_CAT` | обʼєкт | `src/scripts/core/06-wishes.js:746` |
| `RIT_TPL` | масив | `src/scripts/core/06-wishes.js:760` |
| `RIT_TY` | обʼєкт | `src/scripts/core/06-wishes.js:766` |
| `ritCleanStep` | функція | `src/scripts/core/06-wishes.js:768` |
| `ritSteps` | функція | `src/scripts/core/06-wishes.js:778` |
| `RIT_OWN_IC` | обʼєкт | `src/scripts/core/06-wishes.js:782` |
| `ritCat` | функція | `src/scripts/core/06-wishes.js:783` |
| `ritMeta` | функція | `src/scripts/core/06-wishes.js:784` |
| `ritAudioKey` | функція | `src/scripts/core/06-wishes.js:787` |
| `ritStepDone` | функція | `src/scripts/core/06-wishes.js:788` |
| `ritTouch` | функція | `src/scripts/core/06-wishes.js:795` |
| `ritSaveToday` | функція | `src/scripts/core/06-wishes.js:796` |
| `ritTplName` | функція | `src/scripts/core/06-wishes.js:797` |
| `ritStepHTML` | функція | `src/scripts/core/06-wishes.js:803` |
| `ritMixHTML` | функція | `src/scripts/core/06-wishes.js:828` |
| `ritLinksHTML` | функція | `src/scripts/core/06-wishes.js:839` |
| `ritualInnerHTML` | функція | `src/scripts/core/06-wishes.js:852` |
| `ritualBind` | функція | `src/scripts/core/06-wishes.js:878` |
| `ritEditor` | функція | `src/scripts/core/06-wishes.js:938` |
| `RPH_ICON` | значення | `src/scripts/core/06-wishes.js:996` |
| `ritPhotoCardHTML` | функція | `src/scripts/core/06-wishes.js:997` |
| `ritPhotoTap` | функція | `src/scripts/core/06-wishes.js:1011` |
| `ritSavePhoto` | функція | `src/scripts/core/06-wishes.js:1027` |
| `ritPhotoMenu` | функція | `src/scripts/core/06-wishes.js:1038` |
| `rmomTimer` | значення | `src/scripts/core/06-wishes.js:1047` |
| `ritEnterMoment` | функція | `src/scripts/core/06-wishes.js:1050` |
| `ritMixRecTap` | функція | `src/scripts/core/06-wishes.js:1098` |
| `ritMixLongOrRec` | функція | `src/scripts/core/06-wishes.js:1099` |
| `CLG_KEY` | значення | `src/scripts/core/06-wishes.js:1107` |
| `collage` | масив | `src/scripts/core/06-wishes.js:1108` |
| `loadCollage` | функція | `src/scripts/core/06-wishes.js:1110` |
| `saveCollage` | функція | `src/scripts/core/06-wishes.js:1112` |
| `goCollage` | функція | `src/scripts/core/06-wishes.js:1115` |
| `clgPickPhotos` | функція | `src/scripts/core/06-wishes.js:1118` |
| `clgImportWishes` | функція | `src/scripts/core/06-wishes.js:1133` |
| `clgMenu` | функція | `src/scripts/core/06-wishes.js:1144` |
| `renderCollage` | функція | `src/scripts/core/06-wishes.js:1157` |
| `clgWrap` | функція | `src/scripts/core/06-wishes.js:1214` |
| `clgWallpaper` | функція | `src/scripts/core/06-wishes.js:1220` |
| `wdkShow` | значення | `src/scripts/core/06-wishes.js:1294` |
| `wishDateInfo` | функція | `src/scripts/core/06-wishes.js:1295` |
| `renderWishDeck` | функція | `src/scripts/core/06-wishes.js:1314` |
| `renderWishes` | функція | `src/scripts/core/06-wishes.js:1390` |

### `src/scripts/core/07-values.js` — 18 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `VAL_KEY` | значення | `src/scripts/core/07-values.js:2` |
| `VALUES_LIBRARY` | масив | `src/scripts/core/07-values.js:3` |
| `valState` | обʼєкт | `src/scripts/core/07-values.js:13` |
| `valTab` | значення | `src/scripts/core/07-values.js:24` |
| `loadValues` | функція | `src/scripts/core/07-values.js:26` |
| `saveValues` | функція | `src/scripts/core/07-values.js:29` |
| `todayStr` | функція | `src/scripts/core/07-values.js:30` |
| `dmy` | функція | `src/scripts/core/07-values.js:31` |
| `VISION_Q` | масив | `src/scripts/core/07-values.js:33` |
| `ANTI_Q` | масив | `src/scripts/core/07-values.js:40` |
| `DAILY_AM` | масив | `src/scripts/core/07-values.js:45` |
| `DAILY_PM` | масив | `src/scripts/core/07-values.js:49` |
| `renderValues` | функція | `src/scripts/core/07-values.js:54` |
| `renderCompass` | функція | `src/scripts/core/07-values.js:73` |
| `renderEditCards` | функція | `src/scripts/core/07-values.js:122` |
| `renderValVision` | функція | `src/scripts/core/07-values.js:141` |
| `renderAnti` | функція | `src/scripts/core/07-values.js:145` |
| `renderDaily` | функція | `src/scripts/core/07-values.js:150` |

### `src/scripts/core/08-finance.js` — 101 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `envelopes` | масив | `src/scripts/core/08-finance.js:2` |
| `ENVKEY` | значення | `src/scripts/core/08-finance.js:3` |
| `saveEnvelopes` | функція | `src/scripts/core/08-finance.js:4` |
| `envMigrate` | функція | `src/scripts/core/08-finance.js:10` |
| `envSaved` | функція | `src/scripts/core/08-finance.js:18` |
| `envTotalSaved` | функція | `src/scripts/core/08-finance.js:19` |
| `envCur` | функція | `src/scripts/core/08-finance.js:23` |
| `curFree` | функція | `src/scripts/core/08-finance.js:25` |
| `envAddOp` | функція | `src/scripts/core/08-finance.js:27` |
| `envDelOp` | функція | `src/scripts/core/08-finance.js:45` |
| `finOps` | масив | `src/scripts/core/08-finance.js:55` |
| `FINOPKEY` | значення | `src/scripts/core/08-finance.js:56` |
| `saveFinOps` | функція | `src/scripts/core/08-finance.js:57` |
| `window.flowSearchFin` | функція | `src/scripts/core/08-finance.js:59` |
| `recurring` | масив | `src/scripts/core/08-finance.js:61` |
| `RECKEY` | значення | `src/scripts/core/08-finance.js:62` |
| `saveRecurring` | функція | `src/scripts/core/08-finance.js:63` |
| `WALLET_ID` | значення | `src/scripts/core/08-finance.js:71` |
| `cards` | масив | `src/scripts/core/08-finance.js:72` |
| `saveCards` | функція | `src/scripts/core/08-finance.js:73` |
| `walletCard` | функція | `src/scripts/core/08-finance.js:74` |
| `opMain` | функція | `src/scripts/core/08-finance.js:79` |
| `walletOps` | функція | `src/scripts/core/08-finance.js:80` |
| `walletBalance` | функція | `src/scripts/core/08-finance.js:81` |
| `mainCard` | функція | `src/scripts/core/08-finance.js:83` |
| `cardById` | функція | `src/scripts/core/08-finance.js:84` |
| `cardSym` | функція | `src/scripts/core/08-finance.js:85` |
| `cardBalance` | функція | `src/scripts/core/08-finance.js:86` |
| `incomeSummary` | функція | `src/scripts/core/08-finance.js:87` |
| `CUR_LIST` | обʼєкт | `src/scripts/core/08-finance.js:94` |
| `curLocale` | функція | `src/scripts/core/08-finance.js:95` |
| `mainCur` | функція | `src/scripts/core/08-finance.js:97` |
| `curOk` | функція | `src/scripts/core/08-finance.js:102` |
| `curKey` | функція | `src/scripts/core/08-finance.js:104` |
| `curSym` | функція | `src/scripts/core/08-finance.js:105` |
| `money` | функція | `src/scripts/core/08-finance.js:107` |
| `moneyK` | функція | `src/scripts/core/08-finance.js:109` |
| `curLocked` | функція | `src/scripts/core/08-finance.js:116` |
| `setMainCur` | функція | `src/scripts/core/08-finance.js:122` |
| `curPickSheet` | функція | `src/scripts/core/08-finance.js:129` |
| `_projCardId` | функція | `src/scripts/core/08-finance.js:141` |
| `FX_SYM2CODE` | обʼєкт | `src/scripts/core/08-finance.js:148` |
| `FX_DEF` | обʼєкт | `src/scripts/core/08-finance.js:149` |
| `FX_LAST_KEY` | значення | `src/scripts/core/08-finance.js:150` |
| `finCurCode` | функція | `src/scripts/core/08-finance.js:151` |
| `finUahRate` | функція | `src/scripts/core/08-finance.js:153` |
| `finLastRate` | функція | `src/scripts/core/08-finance.js:161` |
| `finRememberRate` | функція | `src/scripts/core/08-finance.js:167` |
| `finAskRate` | функція | `src/scripts/core/08-finance.js:173` |
| `finFx` | функція | `src/scripts/core/08-finance.js:184` |
| `finOpFx` | функція | `src/scripts/core/08-finance.js:191` |
| `ensureCards` | функція | `src/scripts/core/08-finance.js:199` |
| `migRaw` | функція | `src/scripts/core/08-finance.js:231` |
| `migRates` | функція | `src/scripts/core/08-finance.js:240` |
| `migCurByCard` | функція | `src/scripts/core/08-finance.js:245` |
| `walletSumUAH` | функція | `src/scripts/core/08-finance.js:252` |
| `WALLET_MIG_FLAG` | значення | `src/scripts/core/08-finance.js:272` |
| `migrateToWallet` | функція | `src/scripts/core/08-finance.js:277` |
| `recDayOf` | функція | `src/scripts/core/08-finance.js:315` |
| `recAutoPost` | функція | `src/scripts/core/08-finance.js:316` |
| `workCardId` | значення | `src/scripts/core/08-finance.js:339` |
| `workCard` | функція | `src/scripts/core/08-finance.js:340` |
| `_isExpAny` | функція | `src/scripts/core/08-finance.js:344` |
| `_isIncAny` | функція | `src/scripts/core/08-finance.js:345` |
| `_isRealExpense` | функція | `src/scripts/core/08-finance.js:346` |
| `_isRealIncome` | функція | `src/scripts/core/08-finance.js:347` |
| `monthAgg` | функція | `src/scripts/core/08-finance.js:348` |
| `finTab` | значення | `src/scripts/core/08-finance.js:353` |
| `finView` | значення | `src/scripts/core/08-finance.js:354` |
| `finBalance` | функція | `src/scripts/core/08-finance.js:355` |
| `renderFinance` | функція | `src/scripts/core/08-finance.js:357` |
| `MON_UA` | масив | `src/scripts/core/08-finance.js:367` |
| `renderFinDash` | функція | `src/scripts/core/08-finance.js:373` |
| `bindFinDash` | функція | `src/scripts/core/08-finance.js:424` |
| `renderEnvScreen` | функція | `src/scripts/core/08-finance.js:452` |
| `addFinOp` | функція | `src/scripts/core/08-finance.js:498` |
| `addFinOpCard` | функція | `src/scripts/core/08-finance.js:504` |
| `newRecurring` | функція | `src/scripts/core/08-finance.js:515` |
| `newEnvelope` | функція | `src/scripts/core/08-finance.js:531` |
| `envOpenId` | значення | `src/scripts/core/08-finance.js:549` |
| `openEnvSheet` | функція | `src/scripts/core/08-finance.js:550` |
| `closeEnvSheet` | функція | `src/scripts/core/08-finance.js:555` |
| `finProjects` | масив | `src/scripts/core/08-finance.js:563` |
| `FINPROJKEY` | значення | `src/scripts/core/08-finance.js:564` |
| `saveFinProjects` | функція | `src/scripts/core/08-finance.js:565` |
| `kanbanWidgetHtml` | функція | `src/scripts/core/08-finance.js:570` |
| `kbwFind` | функція | `src/scripts/core/08-finance.js:584` |
| `kbwAddCard` | функція | `src/scripts/core/08-finance.js:585` |
| `kbwCardMenu` | функція | `src/scripts/core/08-finance.js:595` |
| `kbwColMenu` | функція | `src/scripts/core/08-finance.js:612` |
| `CTW_COLORS` | масив | `src/scripts/core/08-finance.js:627` |
| `ctwInit` | функція | `src/scripts/core/08-finance.js:628` |
| `contactsWidgetHtml` | функція | `src/scripts/core/08-finance.js:633` |
| `ctwAdd` | функція | `src/scripts/core/08-finance.js:643` |
| `ctwOpenLink` | функція | `src/scripts/core/08-finance.js:653` |
| `ctwMenu` | функція | `src/scripts/core/08-finance.js:659` |
| `clwFmt` | функція | `src/scripts/core/08-finance.js:670` |
| `caselineWidgetHtml` | функція | `src/scripts/core/08-finance.js:675` |
| `clwAdd` | функція | `src/scripts/core/08-finance.js:683` |
| `clwMenu` | функція | `src/scripts/core/08-finance.js:693` |
| `renderEnvSheet` | функція | `src/scripts/core/08-finance.js:702` |

### `src/scripts/core/09-goals.js` — 30 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `goalsData` | обʼєкт | `src/scripts/core/09-goals.js:2` |
| `GKEY` | значення | `src/scripts/core/09-goals.js:4` |
| `saveGoals` | функція | `src/scripts/core/09-goals.js:5` |
| `AI_EP_KEY` | значення | `src/scripts/core/09-goals.js:9` |
| `AI_EP_DEFAULT` | значення | `src/scripts/core/09-goals.js:10` |
| `aiEndpoint` | функція | `src/scripts/core/09-goals.js:11` |
| `aiAuthOff` | значення | `src/scripts/core/09-goals.js:20` |
| `aiFetch` | функція | `src/scripts/core/09-goals.js:21` |
| `aiNetFetch` | функція | `src/scripts/core/09-goals.js:38` |
| `aiFetchOnce` | функція | `src/scripts/core/09-goals.js:41` |
| `aiEpAllowed` | функція | `src/scripts/core/09-goals.js:62` |
| `aiConfig` | функція | `src/scripts/core/09-goals.js:70` |
| `aiProxyUiOn` | функція | `src/scripts/core/09-goals.js:84` |
| `aiSheetClose` | функція | `src/scripts/core/09-goals.js:85` |
| `aiStartSheet` | функція | `src/scripts/core/09-goals.js:86` |
| `aiGenerate` | функція | `src/scripts/core/09-goals.js:131` |
| `aiLocalDraft` | функція | `src/scripts/core/09-goals.js:181` |
| `DOW_SHORT` | масив | `src/scripts/core/09-goals.js:213` |
| `aiPreview` | функція | `src/scripts/core/09-goals.js:214` |
| `aiDraftSentence` | функція | `src/scripts/core/09-goals.js:254` |
| `aiDraftMonths` | функція | `src/scripts/core/09-goals.js:258` |
| `aiApplyDraft` | функція | `src/scripts/core/09-goals.js:264` |
| `renderGoals` | функція | `src/scripts/core/09-goals.js:307` |
| `dgDateStr` | функція | `src/scripts/core/09-goals.js:340` |
| `dgWeekDates` | функція | `src/scripts/core/09-goals.js:341` |
| `dgListFor` | функція | `src/scripts/core/09-goals.js:344` |
| `dgSync` | функція | `src/scripts/core/09-goals.js:346` |
| `dayGoalsBlock` | функція | `src/scripts/core/09-goals.js:367` |
| `pickFolderForGoal` | функція | `src/scripts/core/09-goals.js:419` |
| `renderGoalsTab` | функція | `src/scripts/core/09-goals.js:460` |

### `src/scripts/core/10-planner.js` — 49 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PL_COL` | обʼєкт | `src/scripts/core/10-planner.js:2` |
| `PL_RGB` | обʼєкт | `src/scripts/core/10-planner.js:3` |
| `PL_PRIO` | обʼєкт | `src/scripts/core/10-planner.js:4` |
| `plFocusState` | значення | `src/scripts/core/10-planner.js:6` |
| `plFocusToday` | функція | `src/scripts/core/10-planner.js:7` |
| `plData` | функція | `src/scripts/core/10-planner.js:9` |
| `plTodayStr` | функція | `src/scripts/core/10-planner.js:32` |
| `PL_REPEAT_LABEL` | обʼєкт | `src/scripts/core/10-planner.js:34` |
| `plRecurMatchesDay` | функція | `src/scripts/core/10-planner.js:35` |
| `plMaterializeRecurring` | функція | `src/scripts/core/10-planner.js:49` |
| `plBlocksFor` | функція | `src/scripts/core/10-planner.js:63` |
| `PL_MONTH_NAMES` | масив | `src/scripts/core/10-planner.js:67` |
| `plShiftCalMonth` | функція | `src/scripts/core/10-planner.js:68` |
| `plMonthWeeks` | функція | `src/scripts/core/10-planner.js:74` |
| `plGoalColorFor` | функція | `src/scripts/core/10-planner.js:86` |
| `plMonthCalHTML` | функція | `src/scripts/core/10-planner.js:94` |
| `plTemplateGoalMeta` | функція | `src/scripts/core/10-planner.js:172` |
| `plDowLabel` | функція | `src/scripts/core/10-planner.js:180` |
| `plTemplateListHTML` | функція | `src/scripts/core/10-planner.js:184` |
| `plToggleTemplate` | функція | `src/scripts/core/10-planner.js:204` |
| `plNewTemplateSheet` | функція | `src/scripts/core/10-planner.js:219` |
| `plHM` | функція | `src/scripts/core/10-planner.js:273` |
| `plHMtoDec` | функція | `src/scripts/core/10-planner.js:274` |
| `plDurLabel` | функція | `src/scripts/core/10-planner.js:275` |
| `PL_ICON_CORE` | обʼєкт | `src/scripts/core/10-planner.js:277` |
| `PL_ICONS` | обʼєкт | `src/scripts/core/10-planner.js:310` |
| `plIconStyle` | функція | `src/scripts/core/10-planner.js:318` |
| `plIco` | функція | `src/scripts/core/10-planner.js:320` |
| `plRing` | функція | `src/scripts/core/10-planner.js:327` |
| `goalPctP` | функція | `src/scripts/core/10-planner.js:336` |
| `renderPath` | функція | `src/scripts/core/10-planner.js:341` |
| `pathFlowHtml` | функція | `src/scripts/core/10-planner.js:366` |
| `brdRing` | функція | `src/scripts/core/10-planner.js:417` |
| `pathBridgeHtml` | функція | `src/scripts/core/10-planner.js:424` |
| `plRerender` | функція | `src/scripts/core/10-planner.js:451` |
| `renderPlanner` | функція | `src/scripts/core/10-planner.js:459` |
| `plFmtMMSS` | функція | `src/scripts/core/10-planner.js:691` |
| `plStartFocus` | функція | `src/scripts/core/10-planner.js:692` |
| `plNowIv` | значення | `src/scripts/core/10-planner.js:753` |
| `plFmtHMS` | функція | `src/scripts/core/10-planner.js:754` |
| `plNowInfo` | функція | `src/scripts/core/10-planner.js:756` |
| `plNowCardHTML` | функція | `src/scripts/core/10-planner.js:765` |
| `plNowTick` | функція | `src/scripts/core/10-planner.js:784` |
| `plNowLineHTML` | функція | `src/scripts/core/10-planner.js:797` |
| `plQuickAddHTML` | функція | `src/scripts/core/10-planner.js:799` |
| `plParseQuick` | функція | `src/scripts/core/10-planner.js:805` |
| `plWeekStats` | функція | `src/scripts/core/10-planner.js:831` |
| `plWeekReviewSheet` | функція | `src/scripts/core/10-planner.js:844` |
| `plWeekAI` | функція | `src/scripts/core/10-planner.js:897` |

### `src/scripts/core/11-ai-flow.js` — 35 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `aiChatMsgs` | масив | `src/scripts/core/11-ai-flow.js:3` |
| `aiView` | значення | `src/scripts/core/11-ai-flow.js:4` |
| `aiMem` | масив | `src/scripts/core/11-ai-flow.js:5` |
| `aiPrompts` | масив | `src/scripts/core/11-ai-flow.js:6` |
| `aiPromptsSave` | функція | `src/scripts/core/11-ai-flow.js:7` |
| `aiChatLoading` | значення | `src/scripts/core/11-ai-flow.js:20` |
| `aiSaveWait` | обʼєкт | `src/scripts/core/11-ai-flow.js:21` |
| `aiChatLoad` | функція | `src/scripts/core/11-ai-flow.js:22` |
| `aiChatLoadOnce` | функція | `src/scripts/core/11-ai-flow.js:27` |
| `AI_STORE_TXT` | значення | `src/scripts/core/11-ai-flow.js:68` |
| `aiStoreContent` | функція | `src/scripts/core/11-ai-flow.js:69` |
| `aiChatSave` | функція | `src/scripts/core/11-ai-flow.js:77` |
| `aiMemSave` | функція | `src/scripts/core/11-ai-flow.js:91` |
| `aiMemAdd` | функція | `src/scripts/core/11-ai-flow.js:98` |
| `aiMoodCalc` | функція | `src/scripts/core/11-ai-flow.js:110` |
| `aiMood` | функція | `src/scripts/core/11-ai-flow.js:124` |
| `AI_CORE_SYS` | значення | `src/scripts/core/11-ai-flow.js:135` |
| `AI_PAGES_SYS` | значення | `src/scripts/core/11-ai-flow.js:154` |
| `AI_FLOWOPS_SYS` | значення | `src/scripts/core/11-ai-flow.js:163` |
| `AI_CHAT_SYS` | значення | `src/scripts/core/11-ai-flow.js:174` |
| `aiHttpError` | функція | `src/scripts/core/11-ai-flow.js:179` |
| `aiStreamError` | функція | `src/scripts/core/11-ai-flow.js:192` |
| `aiNetDown` | функція | `src/scripts/core/11-ai-flow.js:203` |
| `aiHumanError` | функція | `src/scripts/core/11-ai-flow.js:207` |
| `aiLangDirective` | функція | `src/scripts/core/11-ai-flow.js:217` |
| `AI_MAX_TOKENS` | значення | `src/scripts/core/11-ai-flow.js:227` |
| `AI_IDLE_MS` | значення | `src/scripts/core/11-ai-flow.js:228` |
| `AI_NOSTREAM_MS` | значення | `src/scripts/core/11-ai-flow.js:233` |
| `AI_CUT_NOTE` | значення | `src/scripts/core/11-ai-flow.js:234` |
| `AI_REFUSAL_NOTE` | значення | `src/scripts/core/11-ai-flow.js:235` |
| `AI_BROKEN_NOTE` | значення | `src/scripts/core/11-ai-flow.js:236` |
| `aiLastStop` | значення | `src/scripts/core/11-ai-flow.js:237` |
| `aiTimeoutError` | функція | `src/scripts/core/11-ai-flow.js:238` |
| `aiIdleGuard` | функція | `src/scripts/core/11-ai-flow.js:247` |
| `aiCall` | функція | `src/scripts/core/11-ai-flow.js:270` |

### `src/scripts/core/12-ai-agent.js` — 94 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `AI_AGENT_KEY` | значення | `src/scripts/core/12-ai-agent.js:6` |
| `aiAgentOn` | функція | `src/scripts/core/12-ai-agent.js:7` |
| `AI_MODELS` | обʼєкт | `src/scripts/core/12-ai-agent.js:13` |
| `AI_PRICES` | обʼєкт | `src/scripts/core/12-ai-agent.js:20` |
| `aiAgentStatus` | значення | `src/scripts/core/12-ai-agent.js:26` |
| `aiAgentSetStatus` | функція | `src/scripts/core/12-ai-agent.js:27` |
| `aiDevOn` | функція | `src/scripts/core/12-ai-agent.js:41` |
| `aiDevEvalOn` | функція | `src/scripts/core/12-ai-agent.js:52` |
| `aiDevToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:57` |
| `devContentTranslateToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:76` |
| `window.devContentTranslateToggleSheet` | значення | `src/scripts/core/12-ai-agent.js:93` |
| `AI_DEV_SYS` | значення | `src/scripts/core/12-ai-agent.js:94` |
| `AI_DEV_EVAL_HINT` | значення | `src/scripts/core/12-ai-agent.js:104` |
| `aiDevSys` | функція | `src/scripts/core/12-ai-agent.js:105` |
| `aiDevCtx` | функція | `src/scripts/core/12-ai-agent.js:106` |
| `DEV_FEATURES` | масив | `src/scripts/core/12-ai-agent.js:119` |
| `aiDevHelpText` | функція | `src/scripts/core/12-ai-agent.js:130` |
| `aiDevConfirm` | функція | `src/scripts/core/12-ai-agent.js:137` |
| `devSnapshot` | функція | `src/scripts/core/12-ai-agent.js:157` |
| `DEV_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:163` |
| `devToolStorage` | функція | `src/scripts/core/12-ai-agent.js:188` |
| `devToolErrors` | функція | `src/scripts/core/12-ai-agent.js:233` |
| `devToolCost` | функція | `src/scripts/core/12-ai-agent.js:238` |
| `devToolSelftest` | функція | `src/scripts/core/12-ai-agent.js:256` |
| `devToolData` | функція | `src/scripts/core/12-ai-agent.js:286` |
| `devToolEval` | функція | `src/scripts/core/12-ai-agent.js:306` |
| `aiPageAsk` | функція | `src/scripts/core/12-ai-agent.js:323` |
| `aiMorningMaybe` | функція | `src/scripts/core/12-ai-agent.js:332` |
| `aiWeeklyMaybe` | функція | `src/scripts/core/12-ai-agent.js:345` |
| `aiAgentStatusFor` | функція | `src/scripts/core/12-ai-agent.js:358` |
| `aiTrace` | значення | `src/scripts/core/12-ai-agent.js:397` |
| `aiPlz` | функція | `src/scripts/core/12-ai-agent.js:398` |
| `AI_TRACE_READ` | обʼєкт | `src/scripts/core/12-ai-agent.js:402` |
| `aiTraceReadMeta` | функція | `src/scripts/core/12-ai-agent.js:410` |
| `aiTraceStart` | функція | `src/scripts/core/12-ai-agent.js:428` |
| `aiTraceStep` | функція | `src/scripts/core/12-ai-agent.js:429` |
| `aiTraceEnd` | функція | `src/scripts/core/12-ai-agent.js:446` |
| `aiTraceRepaint` | функція | `src/scripts/core/12-ai-agent.js:451` |
| `aiTraceFinish` | функція | `src/scripts/core/12-ai-agent.js:457` |
| `FLOW_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:467` |
| `AI_AGENT_ADDON` | значення | `src/scripts/core/12-ai-agent.js:544` |
| `flowToolExec` | функція | `src/scripts/core/12-ai-agent.js:562` |
| `aiMissionLine` | функція | `src/scripts/core/12-ai-agent.js:592` |
| `aiJournalRead` | функція | `src/scripts/core/12-ai-agent.js:615` |
| `flowToolRead` | функція | `src/scripts/core/12-ai-agent.js:643` |
| `aiRemindWhen` | функція | `src/scripts/core/12-ai-agent.js:735` |
| `flowToolPlanner` | функція | `src/scripts/core/12-ai-agent.js:742` |
| `flowToolGoals` | функція | `src/scripts/core/12-ai-agent.js:813` |
| `aiToolConfirm` | функція | `src/scripts/core/12-ai-agent.js:878` |
| `aiFinConfirm` | функція | `src/scripts/core/12-ai-agent.js:897` |
| `flowToolFinance` | функція | `src/scripts/core/12-ai-agent.js:900` |
| `flowToolDiary` | функція | `src/scripts/core/12-ai-agent.js:1049` |
| `flowToolPatterns` | функція | `src/scripts/core/12-ai-agent.js:1099` |
| `flowToolMemory` | функція | `src/scripts/core/12-ai-agent.js:1120` |
| `aiMemGate` | функція | `src/scripts/core/12-ai-agent.js:1146` |
| `flowToolFolders` | функція | `src/scripts/core/12-ai-agent.js:1155` |
| `AI_MAIN_RE` | значення | `src/scripts/core/12-ai-agent.js:1212` |
| `aiPickModel` | функція | `src/scripts/core/12-ai-agent.js:1213` |
| `aiCacheMin` | функція | `src/scripts/core/12-ai-agent.js:1220` |
| `aiTokEst` | функція | `src/scripts/core/12-ai-agent.js:1225` |
| `aiCacheTail` | функція | `src/scripts/core/12-ai-agent.js:1230` |
| `aiUsageAdd` | функція | `src/scripts/core/12-ai-agent.js:1241` |
| `aiCallRaw` | функція | `src/scripts/core/12-ai-agent.js:1254` |
| `aiToolIsWrite` | функція | `src/scripts/core/12-ai-agent.js:1330` |
| `AI_WRITE_LIMIT` | значення | `src/scripts/core/12-ai-agent.js:1339` |
| `aiTurnWrites` | значення | `src/scripts/core/12-ai-agent.js:1340` |
| `aiTurnDone` | масив | `src/scripts/core/12-ai-agent.js:1341` |
| `aiDoneLine` | функція | `src/scripts/core/12-ai-agent.js:1345` |
| `aiToolWriteCost` | функція | `src/scripts/core/12-ai-agent.js:1363` |
| `AI_TOOL_OUT_MAX` | обʼєкт | `src/scripts/core/12-ai-agent.js:1371` |
| `aiToolOut` | функція | `src/scripts/core/12-ai-agent.js:1372` |
| `aiAgentTurn` | функція | `src/scripts/core/12-ai-agent.js:1377` |
| `aiFinMonthNet` | функція | `src/scripts/core/12-ai-agent.js:1447` |
| `aiFinCtx` | функція | `src/scripts/core/12-ai-agent.js:1455` |
| `aiCtx` | функція | `src/scripts/core/12-ai-agent.js:1475` |
| `aiFindGoal` | функція | `src/scripts/core/12-ai-agent.js:1516` |
| `aiParseBlocks` | функція | `src/scripts/core/12-ai-agent.js:1520` |
| `aiOpsCount` | функція | `src/scripts/core/12-ai-agent.js:1551` |
| `aiStreamText` | функція | `src/scripts/core/12-ai-agent.js:1556` |
| `aiOpDs` | функція | `src/scripts/core/12-ai-agent.js:1566` |
| `aiOpMatches` | функція | `src/scripts/core/12-ai-agent.js:1567` |
| `aiOpBlock` | функція | `src/scripts/core/12-ai-agent.js:1577` |
| `aiFindBlockByT` | функція | `src/scripts/core/12-ai-agent.js:1578` |
| `aiOpWarn` | функція | `src/scripts/core/12-ai-agent.js:1580` |
| `aiResolveOps` | функція | `src/scripts/core/12-ai-agent.js:1592` |
| `aiMissText` | функція | `src/scripts/core/12-ai-agent.js:1606` |
| `aiOpRow` | функція | `src/scripts/core/12-ai-agent.js:1613` |
| `aiGateOps` | функція | `src/scripts/core/12-ai-agent.js:1620` |
| `aiFindFolderKey` | функція | `src/scripts/core/12-ai-agent.js:1640` |
| `aiBuildPageBlock` | функція | `src/scripts/core/12-ai-agent.js:1648` |
| `aiApplyPages` | функція | `src/scripts/core/12-ai-agent.js:1667` |
| `aiApplyActions` | функція | `src/scripts/core/12-ai-agent.js:1690` |
| `aiCommit` | функція | `src/scripts/core/12-ai-agent.js:1777` |
| `aiUndo` | функція | `src/scripts/core/12-ai-agent.js:1793` |

### `src/scripts/core/13-pets.js` — 13 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FLOW_PETS` | обʼєкт | `src/scripts/core/13-pets.js:2` |
| `petCur` | функція | `src/scripts/core/13-pets.js:41` |
| `petPersona` | функція | `src/scripts/core/13-pets.js:42` |
| `petSVG` | функція | `src/scripts/core/13-pets.js:43` |
| `petPickerSheet` | функція | `src/scripts/core/13-pets.js:85` |
| `petSleeping` | функція | `src/scripts/core/13-pets.js:167` |
| `petSleepSet` | функція | `src/scripts/core/13-pets.js:168` |
| `window.petWake` | функція | `src/scripts/core/13-pets.js:169` |
| `fcPos` | функція | `src/scripts/core/13-pets.js:170` |
| `fcClamp` | функція | `src/scripts/core/13-pets.js:171` |
| `fcApplyPos` | функція | `src/scripts/core/13-pets.js:176` |
| `fcBindDrag` | функція | `src/scripts/core/13-pets.js:182` |
| `fcBurst` | функція | `src/scripts/core/13-pets.js:220` |

### `src/scripts/core/14-react.js` — 43 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `frMode` | функція | `src/scripts/core/14-react.js:3` |
| `frModeSet` | функція | `src/scripts/core/14-react.js:4` |
| `frSayOn` | функція | `src/scripts/core/14-react.js:5` |
| `frSaySet` | функція | `src/scripts/core/14-react.js:6` |
| `FR_PRESETS` | обʼєкт | `src/scripts/core/14-react.js:7` |
| `__frLast` | значення | `src/scripts/core/14-react.js:18` |
| `flowReactAt` | функція | `src/scripts/core/14-react.js:19` |
| `flowReact` | функція | `src/scripts/core/14-react.js:44` |
| `__frSayT` | значення | `src/scripts/core/14-react.js:79` |
| `flowSay` | функція | `src/scripts/core/14-react.js:80` |
| `window.flowReact` | значення | `src/scripts/core/14-react.js:90` |
| `FC_EMO` | обʼєкт | `src/scripts/core/14-react.js:91` |
| `fcEmote` | функція | `src/scripts/core/14-react.js:92` |
| `fcLifeTimer` | значення | `src/scripts/core/14-react.js:103` |
| `fcLifeStart` | функція | `src/scripts/core/14-react.js:104` |
| `petSVGSleep` | функція | `src/scripts/core/14-react.js:115` |
| `AI_HAM_ACTS` | масив | `src/scripts/core/14-react.js:124` |
| `aiHamAct` | функція | `src/scripts/core/14-react.js:132` |
| `aiHamNextAct` | функція | `src/scripts/core/14-react.js:136` |
| `aiHamCoreHTML` | функція | `src/scripts/core/14-react.js:142` |
| `aiHamSceneHTML` | функція | `src/scripts/core/14-react.js:154` |
| `aiHamRotT` | значення | `src/scripts/core/14-react.js:163` |
| `aiHamRotStart` | функція | `src/scripts/core/14-react.js:164` |
| `aiHamWakeFrom` | функція | `src/scripts/core/14-react.js:174` |
| `aiHamBind` | функція | `src/scripts/core/14-react.js:181` |
| `aiWakeInChat` | функція | `src/scripts/core/14-react.js:187` |
| `petSleepNow` | функція | `src/scripts/core/14-react.js:201` |
| `window.petSleepNow` | значення | `src/scripts/core/14-react.js:213` |
| `fcWakeNow` | функція | `src/scripts/core/14-react.js:214` |
| `window.petWake` | значення | `src/scripts/core/14-react.js:224` |
| `FC_SAY` | обʼєкт | `src/scripts/core/14-react.js:226` |
| `fcSayPick` | функція | `src/scripts/core/14-react.js:244` |
| `fcSayTimer` | значення | `src/scripts/core/14-react.js:257` |
| `fcSayHide` | функція | `src/scripts/core/14-react.js:258` |
| `fcSayShow` | функція | `src/scripts/core/14-react.js:259` |
| `fcSayStart` | функція | `src/scripts/core/14-react.js:291` |
| `flowCapRender` | функція | `src/scripts/core/14-react.js:296` |
| `fcCheckOverlap` | функція | `src/scripts/core/14-react.js:327` |
| `window.fcCheckOverlap` | значення | `src/scripts/core/14-react.js:328` |
| `petHidden` | функція | `src/scripts/core/14-react.js:330` |
| `petHiddenSet` | функція | `src/scripts/core/14-react.js:331` |
| `t` | значення | `src/scripts/core/14-react.js:334` |
| `sched` | функція | `src/scripts/core/14-react.js:335` |

### `src/scripts/core/15-flow-spot.js` — 97 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `spotMsgs` | масив | `src/scripts/core/15-flow-spot.js:2` |
| `spotCtx` | функція | `src/scripts/core/15-flow-spot.js:3` |
| `spotChips` | функція | `src/scripts/core/15-flow-spot.js:17` |
| `spotAddon` | функція | `src/scripts/core/15-flow-spot.js:26` |
| `aiParsePage` | функція | `src/scripts/core/15-flow-spot.js:38` |
| `applyPageBlocks` | функція | `src/scripts/core/15-flow-spot.js:45` |
| `flowSpotEl` | функція | `src/scripts/core/15-flow-spot.js:72` |
| `flowSpotToggle` | функція | `src/scripts/core/15-flow-spot.js:94` |
| `flowSpotOpen` | функція | `src/scripts/core/15-flow-spot.js:95` |
| `flowSpotClose` | функція | `src/scripts/core/15-flow-spot.js:109` |
| `flowSpotSend` | функція | `src/scripts/core/15-flow-spot.js:110` |
| `spotMicToggle` | функція | `src/scripts/core/15-flow-spot.js:159` |
| `window.flowCapRender` | значення | `src/scripts/core/15-flow-spot.js:188` |
| `window.flowSpotOpen` | значення | `src/scripts/core/15-flow-spot.js:189` |
| `aiChatSheet` | функція | `src/scripts/core/15-flow-spot.js:192` |
| `aiClose` | функція | `src/scripts/core/15-flow-spot.js:225` |
| `aiDayPct` | функція | `src/scripts/core/15-flow-spot.js:232` |
| `aiVoiceOn` | значення | `src/scripts/core/15-flow-spot.js:239` |
| `aiSpeakStop` | функція | `src/scripts/core/15-flow-spot.js:241` |
| `aiSpeak` | функція | `src/scripts/core/15-flow-spot.js:242` |
| `aiVoiceToggle` | функція | `src/scripts/core/15-flow-spot.js:282` |
| `aiRenderHead` | функція | `src/scripts/core/15-flow-spot.js:289` |
| `aiMemSheet` | функція | `src/scripts/core/15-flow-spot.js:333` |
| `aiRenderViews` | функція | `src/scripts/core/15-flow-spot.js:355` |
| `aiLogHTML` | функція | `src/scripts/core/15-flow-spot.js:360` |
| `aiTlHTML` | функція | `src/scripts/core/15-flow-spot.js:367` |
| `aiActsHTML` | функція | `src/scripts/core/15-flow-spot.js:390` |
| `aiTraceLiveHTML` | функція | `src/scripts/core/15-flow-spot.js:430` |
| `aiTraceRowHTML` | функція | `src/scripts/core/15-flow-spot.js:436` |
| `AI_SHELF_GO` | обʼєкт | `src/scripts/core/15-flow-spot.js:441` |
| `aiShelfHTML` | функція | `src/scripts/core/15-flow-spot.js:442` |
| `aiTraceKpisHTML` | функція | `src/scripts/core/15-flow-spot.js:452` |
| `aiWireBody` | функція | `src/scripts/core/15-flow-spot.js:467` |
| `aiChipsHTML` | функція | `src/scripts/core/15-flow-spot.js:487` |
| `AI_SVG` | обʼєкт | `src/scripts/core/15-flow-spot.js:493` |
| `AI_ICO` | обʼєкт | `src/scripts/core/15-flow-spot.js:501` |
| `aiIco` | функція | `src/scripts/core/15-flow-spot.js:524` |
| `aiMD` | функція | `src/scripts/core/15-flow-spot.js:529` |
| `aiBusyHTML` | функція | `src/scripts/core/15-flow-spot.js:535` |
| `aiSlashHide` | функція | `src/scripts/core/15-flow-spot.js:543` |
| `aiSlashShow` | функція | `src/scripts/core/15-flow-spot.js:544` |
| `aiAttachRender` | функція | `src/scripts/core/15-flow-spot.js:559` |
| `aiImgShrink` | функція | `src/scripts/core/15-flow-spot.js:571` |
| `aiFileB64` | функція | `src/scripts/core/15-flow-spot.js:588` |
| `aiPickFile` | функція | `src/scripts/core/15-flow-spot.js:596` |
| `aiPlusSheet` | функція | `src/scripts/core/15-flow-spot.js:622` |
| `aiPromptsSheet` | функція | `src/scripts/core/15-flow-spot.js:642` |
| `aiPromptEdit` | функція | `src/scripts/core/15-flow-spot.js:661` |
| `aiEnvKpi` | функція | `src/scripts/core/15-flow-spot.js:678` |
| `aiPlanCardHTML` | функція | `src/scripts/core/15-flow-spot.js:686` |
| `aiRenderBody` | функція | `src/scripts/core/15-flow-spot.js:712` |
| `AI_SKILLS` | обʼєкт | `src/scripts/core/15-flow-spot.js:762` |
| `aiSkillFor` | функція | `src/scripts/core/15-flow-spot.js:774` |
| `aiSumBusy` | значення | `src/scripts/core/15-flow-spot.js:781` |
| `aiMaybeSummarize` | функція | `src/scripts/core/15-flow-spot.js:782` |
| `aiChatSend` | функція | `src/scripts/core/15-flow-spot.js:795` |
| `aiRec` | значення | `src/scripts/core/15-flow-spot.js:915` |
| `aiMicUI` | функція | `src/scripts/core/15-flow-spot.js:916` |
| `aiMicToggle` | функція | `src/scripts/core/15-flow-spot.js:917` |
| `aiTranscribeBlob` | функція | `src/scripts/core/15-flow-spot.js:955` |
| `aiTranscribe` | функція | `src/scripts/core/15-flow-spot.js:978` |
| `window.aiChatSheet` | значення | `src/scripts/core/15-flow-spot.js:982` |
| `plStreak` | функція | `src/scripts/core/15-flow-spot.js:984` |
| `heroWeekDays` | функція | `src/scripts/core/15-flow-spot.js:1003` |
| `heroMonthDays` | функція | `src/scripts/core/15-flow-spot.js:1021` |
| `heroDayWord` | функція | `src/scripts/core/15-flow-spot.js:1032` |
| `renderHeroStreak` | функція | `src/scripts/core/15-flow-spot.js:1038` |
| `plRolloverHTML` | функція | `src/scripts/core/15-flow-spot.js:1061` |
| `plDaySummaryHTML` | функція | `src/scripts/core/15-flow-spot.js:1073` |
| `plAutoSuggestHTML` | функція | `src/scripts/core/15-flow-spot.js:1107` |
| `plWeekCalHTML` | функція | `src/scripts/core/15-flow-spot.js:1149` |
| `plBlocksDisplay` | функція | `src/scripts/core/15-flow-spot.js:1176` |
| `plFolderComplete` | функція | `src/scripts/core/15-flow-spot.js:1190` |
| `DOW_UA` | масив | `src/scripts/core/15-flow-spot.js:1195` |
| `plRuleDowsLabel` | функція | `src/scripts/core/15-flow-spot.js:1196` |
| `plFolderDaySheet` | функція | `src/scripts/core/15-flow-spot.js:1205` |
| `plFolderMonthSheet` | функція | `src/scripts/core/15-flow-spot.js:1262` |
| `PL_MXQ` | масив | `src/scripts/core/15-flow-spot.js:1327` |
| `plMatrixHTML` | функція | `src/scripts/core/15-flow-spot.js:1328` |
| `plMxSchedule` | функція | `src/scripts/core/15-flow-spot.js:1347` |
| `plSlotTask` | функція | `src/scripts/core/15-flow-spot.js:1361` |
| `plBacklogHTML` | функція | `src/scripts/core/15-flow-spot.js:1375` |
| `plInboxHTML` | функція | `src/scripts/core/15-flow-spot.js:1390` |
| `plBlockEnd` | функція | `src/scripts/core/15-flow-spot.js:1405` |
| `plDayHTML` | функція | `src/scripts/core/15-flow-spot.js:1406` |
| `plTaskCard` | функція | `src/scripts/core/15-flow-spot.js:1615` |
| `plAdd` | функція | `src/scripts/core/15-flow-spot.js:1638` |
| `plAddBlockAt` | функція | `src/scripts/core/15-flow-spot.js:1665` |
| `plLinkTag` | функція | `src/scripts/core/15-flow-spot.js:1670` |
| `plScheduleStep` | функція | `src/scripts/core/15-flow-spot.js:1678` |
| `plMicroBlock` | функція | `src/scripts/core/15-flow-spot.js:1695` |
| `plCompleteBlock` | функція | `src/scripts/core/15-flow-spot.js:1708` |
| `plUncompleteEffects` | функція | `src/scripts/core/15-flow-spot.js:1765` |
| `plToast` | функція | `src/scripts/core/15-flow-spot.js:1782` |
| `plBlockSheet` | функція | `src/scripts/core/15-flow-spot.js:1790` |
| `plEditBlock` | функція | `src/scripts/core/15-flow-spot.js:2012` |
| `plRangeSheet` | функція | `src/scripts/core/15-flow-spot.js:2015` |

### `src/scripts/core/16-dashboard.js` — 55 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FV_ORDER` | масив | `src/scripts/core/16-dashboard.js:7` |
| `FV_NAME` | обʼєкт | `src/scripts/core/16-dashboard.js:8` |
| `FV_COVER` | масив | `src/scripts/core/16-dashboard.js:9` |
| `fvNorm` | функція | `src/scripts/core/16-dashboard.js:10` |
| `homeFolderView` | значення | `src/scripts/core/16-dashboard.js:11` |
| `FOPT_DEF` | обʼєкт | `src/scripts/core/16-dashboard.js:16` |
| `foptParse` | функція | `src/scripts/core/16-dashboard.js:17` |
| `folderOpts` | значення | `src/scripts/core/16-dashboard.js:23` |
| `setFolderOpt` | функція | `src/scripts/core/16-dashboard.js:26` |
| `applyFolderViewIcon` | функція | `src/scripts/core/16-dashboard.js:32` |
| `setFolderView` | функція | `src/scripts/core/16-dashboard.js:36` |
| `R` | значення | `src/scripts/core/16-dashboard.js:44` |
| `moveOrderItem` | функція | `src/scripts/core/16-dashboard.js:47` |
| `enableFolderDrag` | функція | `src/scripts/core/16-dashboard.js:54` |
| `FC3_IC` | обʼєкт | `src/scripts/core/16-dashboard.js:174` |
| `fc3Svg` | функція | `src/scripts/core/16-dashboard.js:178` |
| `fc3Meta` | функція | `src/scripts/core/16-dashboard.js:180` |
| `fc3Tile` | функція | `src/scripts/core/16-dashboard.js:188` |
| `fc3GroupRow` | функція | `src/scripts/core/16-dashboard.js:221` |
| `fc3Add` | функція | `src/scripts/core/16-dashboard.js:238` |
| `renderFolderCovers` | функція | `src/scripts/core/16-dashboard.js:244` |
| `renderDashboard` | функція | `src/scripts/core/16-dashboard.js:275` |
| `inputModal` | функція | `src/scripts/core/16-dashboard.js:370` |
| `createFolder` | функція | `src/scripts/core/16-dashboard.js:405` |
| `groupKids` | функція | `src/scripts/core/16-dashboard.js:427` |
| `fgIcon` | функція | `src/scripts/core/16-dashboard.js:430` |
| `fgSub` | функція | `src/scripts/core/16-dashboard.js:433` |
| `fgToast` | функція | `src/scripts/core/16-dashboard.js:440` |
| `fgSheet` | функція | `src/scripts/core/16-dashboard.js:441` |
| `openFolderGroup` | функція | `src/scripts/core/16-dashboard.js:453` |
| `openFolderGroupAdd` | функція | `src/scripts/core/16-dashboard.js:480` |
| `openFolderMerge` | функція | `src/scripts/core/16-dashboard.js:497` |
| `FV_PREV` | обʼєкт | `src/scripts/core/16-dashboard.js:537` |
| `openFolderViewSheet` | функція | `src/scripts/core/16-dashboard.js:544` |
| `pgBarFolder` | функція | `src/scripts/core/16-dashboard.js:588` |
| `pgBarSwitchGroup` | функція | `src/scripts/core/16-dashboard.js:590` |
| `pgBarSync` | функція | `src/scripts/core/16-dashboard.js:595` |
| `pgBarHasCond` | функція | `src/scripts/core/16-dashboard.js:609` |
| `pgBarSwitchSheet` | функція | `src/scripts/core/16-dashboard.js:616` |
| `pgBarMoreSheet` | функція | `src/scripts/core/16-dashboard.js:635` |
| `pgBarInit` | функція | `src/scripts/core/16-dashboard.js:676` |
| `createProjectFolder` | функція | `src/scripts/core/16-dashboard.js:696` |
| `openPhotoCropEditor` | функція | `src/scripts/core/16-dashboard.js:724` |
| `FM_IC` | обʼєкт | `src/scripts/core/16-dashboard.js:796` |
| `fmIc` | функція | `src/scripts/core/16-dashboard.js:815` |
| `fmRow` | функція | `src/scripts/core/16-dashboard.js:816` |
| `FM_TYPE` | обʼєкт | `src/scripts/core/16-dashboard.js:817` |
| `openFolderMenu` | функція | `src/scripts/core/16-dashboard.js:818` |
| `openFolderLook` | функція | `src/scripts/core/16-dashboard.js:876` |
| `openFolderType` | функція | `src/scripts/core/16-dashboard.js:892` |
| `closeFolderMenu` | функція | `src/scripts/core/16-dashboard.js:923` |
| `openFolderIconPicker` | функція | `src/scripts/core/16-dashboard.js:932` |
| `openFolderMovePicker` | функція | `src/scripts/core/16-dashboard.js:965` |
| `folderAction` | функція | `src/scripts/core/16-dashboard.js:981` |
| `pickFolderPhoto` | функція | `src/scripts/core/16-dashboard.js:1019` |

### `src/scripts/core/17-folder-render.js` — 2 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `debtTotals` | функція | `src/scripts/core/17-folder-render.js:5` |
| `debtSummary` | функція | `src/scripts/core/17-folder-render.js:10` |

### `src/scripts/core/18-debts.js` — 18 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CUR` | обʼєкт | `src/scripts/core/18-debts.js:5` |
| `DEBT_KEY` | значення | `src/scripts/core/18-debts.js:6` |
| `debtKind` | значення | `src/scripts/core/18-debts.js:7` |
| `debtSave` | функція | `src/scripts/core/18-debts.js:15` |
| `initials` | функція | `src/scripts/core/18-debts.js:18` |
| `sanitizeRich` | функція | `src/scripts/core/18-debts.js:20` |
| `safeImg` | функція | `src/scripts/core/18-debts.js:41` |
| `balance` | функція | `src/scripts/core/18-debts.js:57` |
| `debtDel` | функція | `src/scripts/core/18-debts.js:70` |
| `debtRender` | функція | `src/scripts/core/18-debts.js:72` |
| `toggleDebtSync` | функція | `src/scripts/core/18-debts.js:111` |
| `curId` | значення | `src/scripts/core/18-debts.js:141` |
| `openModal` | функція | `src/scripts/core/18-debts.js:142` |
| `closeModal` | функція | `src/scripts/core/18-debts.js:145` |
| `renderModal` | функція | `src/scripts/core/18-debts.js:148` |
| `askOp` | функція | `src/scripts/core/18-debts.js:177` |
| `commitOp` | функція | `src/scripts/core/18-debts.js:186` |
| `delOp` | функція | `src/scripts/core/18-debts.js:195` |

### `src/scripts/core/19-spending.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `SKEY` | значення | `src/scripts/core/19-spending.js:2` |
| `spends` | масив | `src/scripts/core/19-spending.js:3` |
| `CATS` | обʼєкт | `src/scripts/core/19-spending.js:5` |
| `CAT_ORDER` | масив | `src/scripts/core/19-spending.js:16` |
| `categorize` | функція | `src/scripts/core/19-spending.js:18` |
| `parseLine` | функція | `src/scripts/core/19-spending.js:27` |
| `saveSpend` | функція | `src/scripts/core/19-spending.js:43` |
| `spendOps` | функція | `src/scripts/core/19-spending.js:49` |
| `migrateSpendsToFin` | функція | `src/scripts/core/19-spending.js:50` |
| `spendTotal` | функція | `src/scripts/core/19-spending.js:64` |
| `delSpend` | функція | `src/scripts/core/19-spending.js:76` |
| `renderSpend` | функція | `src/scripts/core/19-spending.js:78` |
| `exportSpend` | функція | `src/scripts/core/19-spending.js:126` |
| `clearSpend` | функція | `src/scripts/core/19-spending.js:135` |

### `src/scripts/core/20-work.js` — 51 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `workSessions` | масив | `src/scripts/core/20-work.js:2` |
| `workRate` | значення | `src/scripts/core/20-work.js:3` |
| `workCur` | значення | `src/scripts/core/20-work.js:4` |
| `workMonth` | функція | `src/scripts/core/20-work.js:5` |
| `workPayday` | значення | `src/scripts/core/20-work.js:6` |
| `WORKKEY` | значення | `src/scripts/core/20-work.js:7` |
| `saveWork` | функція | `src/scripts/core/20-work.js:8` |
| `workHoursOn` | функція | `src/scripts/core/20-work.js:12` |
| `workSessionsIn` | функція | `src/scripts/core/20-work.js:13` |
| `WK_MONTHS` | масив | `src/scripts/core/20-work.js:15` |
| `renderWorkCal` | функція | `src/scripts/core/20-work.js:16` |
| `wkmDate` | значення | `src/scripts/core/20-work.js:46` |
| `workTapDay` | функція | `src/scripts/core/20-work.js:47` |
| `wkmHoursVal` | функція | `src/scripts/core/20-work.js:58` |
| `wkmRate` | функція | `src/scripts/core/20-work.js:59` |
| `wkmRenderChips` | функція | `src/scripts/core/20-work.js:60` |
| `wkmUpdateMoney` | функція | `src/scripts/core/20-work.js:68` |
| `wkmClose` | функція | `src/scripts/core/20-work.js:73` |
| `wkmSave` | функція | `src/scripts/core/20-work.js:74` |
| `ymOffset` | функція | `src/scripts/core/20-work.js:112` |
| `renderWorkMonthStrip` | функція | `src/scripts/core/20-work.js:118` |
| `renderWorkSalary` | функція | `src/scripts/core/20-work.js:134` |
| `pluralDaysWk` | функція | `src/scripts/core/20-work.js:169` |
| `workPostedSal` | обʼєкт | `src/scripts/core/20-work.js:172` |
| `workExtras` | масив | `src/scripts/core/20-work.js:173` |
| `WKEXTRAKEY` | значення | `src/scripts/core/20-work.js:174` |
| `wkBlocks` | обʼєкт | `src/scripts/core/20-work.js:176` |
| `WKBLKKEY` | значення | `src/scripts/core/20-work.js:177` |
| `saveWkBlocks` | функція | `src/scripts/core/20-work.js:178` |
| `applyWkBlocks` | функція | `src/scripts/core/20-work.js:179` |
| `saveExtras` | функція | `src/scripts/core/20-work.js:190` |
| `EXTRA_META` | обʼєкт | `src/scripts/core/20-work.js:191` |
| `extrasIn` | функція | `src/scripts/core/20-work.js:192` |
| `extrasNet` | функція | `src/scripts/core/20-work.js:193` |
| `extraKind` | значення | `src/scripts/core/20-work.js:194` |
| `addExtra` | функція | `src/scripts/core/20-work.js:195` |
| `extraSave` | функція | `src/scripts/core/20-work.js:210` |
| `delExtra` | функція | `src/scripts/core/20-work.js:226` |
| `renderExtras` | функція | `src/scripts/core/20-work.js:227` |
| `syncSalaryToFin` | функція | `src/scripts/core/20-work.js:246` |
| `transferPlannedToEnvelopes` | функція | `src/scripts/core/20-work.js:283` |
| `workPlannedTotal` | функція | `src/scripts/core/20-work.js:301` |
| `openAllocModal` | функція | `src/scripts/core/20-work.js:305` |
| `allocUpdateSummary` | функція | `src/scripts/core/20-work.js:328` |
| `allocSave` | функція | `src/scripts/core/20-work.js:339` |
| `renderWork` | функція | `src/scripts/core/20-work.js:356` |
| `workShiftMonth` | функція | `src/scripts/core/20-work.js:459` |
| `pushWorkBatch` | функція | `src/scripts/core/20-work.js:467` |
| `pushWorkToFin` | функція | `src/scripts/core/20-work.js:480` |
| `delWork` | функція | `src/scripts/core/20-work.js:498` |
| `clearWorkMonth` | функція | `src/scripts/core/20-work.js:508` |

### `src/scripts/core/21-patterns.js` — 21 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PAT_CKEY` | значення | `src/scripts/core/21-patterns.js:4` |
| `patChains` | масив | `src/scripts/core/21-patterns.js:5` |
| `PAT_PHASES` | масив | `src/scripts/core/21-patterns.js:6` |
| `patSaveChains` | функція | `src/scripts/core/21-patterns.js:12` |
| `patSaveScore` | функція | `src/scripts/core/21-patterns.js:13` |
| `patSaveTrans` | функція | `src/scripts/core/21-patterns.js:14` |
| `patEsc` | функція | `src/scripts/core/21-patterns.js:15` |
| `patFmt` | функція | `src/scripts/core/21-patterns.js:16` |
| `goPatterns` | функція | `src/scripts/core/21-patterns.js:18` |
| `patSetView` | функція | `src/scripts/core/21-patterns.js:23` |
| `patInterceptData` | функція | `src/scripts/core/21-patterns.js:34` |
| `patOpenIntercept` | функція | `src/scripts/core/21-patterns.js:42` |
| `patDecide` | функція | `src/scripts/core/21-patterns.js:57` |
| `patAddChain` | функція | `src/scripts/core/21-patterns.js:69` |
| `patDelChain` | функція | `src/scripts/core/21-patterns.js:80` |
| `patDaysFrom` | функція | `src/scripts/core/21-patterns.js:88` |
| `patAddTrans` | функція | `src/scripts/core/21-patterns.js:95` |
| `patDelTrans` | функція | `src/scripts/core/21-patterns.js:113` |
| `patTCheck` | функція | `src/scripts/core/21-patterns.js:118` |
| `patLast7` | функція | `src/scripts/core/21-patterns.js:126` |
| `renderPatterns` | функція | `src/scripts/core/21-patterns.js:134` |

### `src/scripts/core/22-diary.js` — 54 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `DIARY_KEY` | значення | `src/scripts/core/22-diary.js:2` |
| `DIAINS_KEY` | значення | `src/scripts/core/22-diary.js:3` |
| `DIABOOKS_KEY` | значення | `src/scripts/core/22-diary.js:4` |
| `diaryEntries` | обʼєкт | `src/scripts/core/22-diary.js:5` |
| `diaInsights` | обʼєкт | `src/scripts/core/22-diary.js:6` |
| `diaBooks` | обʼєкт | `src/scripts/core/22-diary.js:7` |
| `diaSelDate` | значення | `src/scripts/core/22-diary.js:8` |
| `diaSaveTimer` | значення | `src/scripts/core/22-diary.js:9` |
| `diaTab` | значення | `src/scripts/core/22-diary.js:10` |
| `diaViewWeek` | значення | `src/scripts/core/22-diary.js:11` |
| `diaCurBook` | значення | `src/scripts/core/22-diary.js:12` |
| `DIA_MONTHS` | масив | `src/scripts/core/22-diary.js:13` |
| `DIA_MOODS` | масив | `src/scripts/core/22-diary.js:14` |
| `diaEsc` | функція | `src/scripts/core/22-diary.js:15` |
| `diaPlural` | функція | `src/scripts/core/22-diary.js:16` |
| `saveDiaryEntries` | функція | `src/scripts/core/22-diary.js:17` |
| `saveDiaInsights` | функція | `src/scripts/core/22-diary.js:21` |
| `saveDiaBooks` | функція | `src/scripts/core/22-diary.js:22` |
| `diaFmtDate` | функція | `src/scripts/core/22-diary.js:23` |
| `diaFmtYmd` | функція | `src/scripts/core/22-diary.js:32` |
| `diaDs` | функція | `src/scripts/core/22-diary.js:34` |
| `diaAddDays` | функція | `src/scripts/core/22-diary.js:35` |
| `diaMonday` | функція | `src/scripts/core/22-diary.js:36` |
| `diaFmtRange` | функція | `src/scripts/core/22-diary.js:38` |
| `diaHasEntry` | функція | `src/scripts/core/22-diary.js:47` |
| `diaStreakCalc` | функція | `src/scripts/core/22-diary.js:48` |
| `diaCalHTML` | функція | `src/scripts/core/22-diary.js:59` |
| `goDiary` | функція | `src/scripts/core/22-diary.js:72` |
| `window.goDiary` | значення | `src/scripts/core/22-diary.js:74` |
| `window.flowSearchDiary` | функція | `src/scripts/core/22-diary.js:76` |
| `diaShowTab` | функція | `src/scripts/core/22-diary.js:84` |
| `diaMoodOf` | функція | `src/scripts/core/22-diary.js:97` |
| `diaSetMood` | функція | `src/scripts/core/22-diary.js:104` |
| `diaRenderStreak` | функція | `src/scripts/core/22-diary.js:112` |
| `renderDiary` | функція | `src/scripts/core/22-diary.js:117` |
| `window.renderDiary` | значення | `src/scripts/core/22-diary.js:193` |
| `diaWeekDss` | функція | `src/scripts/core/22-diary.js:230` |
| `diaWeekAvg` | функція | `src/scripts/core/22-diary.js:231` |
| `renderDiaView` | функція | `src/scripts/core/22-diary.js:232` |
| `diaWeekAnalyze` | функція | `src/scripts/core/22-diary.js:293` |
| `diaMoodBusy` | значення | `src/scripts/core/22-diary.js:327` |
| `diaMoodBatch` | функція | `src/scripts/core/22-diary.js:328` |
| `DIA_BOOK_EMOJIS` | масив | `src/scripts/core/22-diary.js:362` |
| `DIA_BOOK_COLORS` | масив | `src/scripts/core/22-diary.js:363` |
| `diaNewEmoji` | значення | `src/scripts/core/22-diary.js:364` |
| `renderDiaBooks` | функція | `src/scripts/core/22-diary.js:365` |
| `renderDiaBook` | функція | `src/scripts/core/22-diary.js:390` |
| `diaRec` | значення | `src/scripts/core/22-diary.js:457` |
| `diaFmtDur` | функція | `src/scripts/core/22-diary.js:458` |
| `diaPlayAudio` | функція | `src/scripts/core/22-diary.js:459` |
| `diaRecord` | функція | `src/scripts/core/22-diary.js:460` |
| `window.diaRecord` | значення | `src/scripts/core/22-diary.js:491` |
| `diaBookRec` | значення | `src/scripts/core/22-diary.js:495` |
| `diaBookRecord` | функція | `src/scripts/core/22-diary.js:496` |

### `src/scripts/core/23-board.js` — 29 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `BKEY` | значення | `src/scripts/core/23-board.js:2` |
| `boards` | обʼєкт | `src/scripts/core/23-board.js:3` |
| `boardKey` | значення | `src/scripts/core/23-board.js:4` |
| `folderPath` | масив | `src/scripts/core/23-board.js:5` |
| `curBoard` | функція | `src/scripts/core/23-board.js:7` |
| `blocks` | масив | `src/scripts/core/23-board.js:8` |
| `syncBlocks` | функція | `src/scripts/core/23-board.js:9` |
| `resortPinned` | функція | `src/scripts/core/23-board.js:49` |
| `BLOCK_TYPES` | обʼєкт | `src/scripts/core/23-board.js:59` |
| `ICONS` | обʼєкт | `src/scripts/core/23-board.js:112` |
| `blockIcon` | функція | `src/scripts/core/23-board.js:149` |
| `blockSearchText` | функція | `src/scripts/core/23-board.js:158` |
| `collectBlocks` | функція | `src/scripts/core/23-board.js:174` |
| `window.flowSearchBoards` | функція | `src/scripts/core/23-board.js:183` |
| `window.flowOpenBlock` | функція | `src/scripts/core/23-board.js:200` |
| `undoSnapshot` | значення | `src/scripts/core/23-board.js:219` |
| `snapshotForUndo` | функція | `src/scripts/core/23-board.js:220` |
| `flowUndoToast` | функція | `src/scripts/core/23-board.js:233` |
| `window.flowUndoToast` | значення | `src/scripts/core/23-board.js:243` |
| `hideUndo` | функція | `src/scripts/core/23-board.js:244` |
| `doUndo` | функція | `src/scripts/core/23-board.js:245` |
| `INBOX_TITLE` | значення | `src/scripts/core/23-board.js:266` |
| `INBOX_FKEY` | значення | `src/scripts/core/23-board.js:267` |
| `ensureInboxFolder` | функція | `src/scripts/core/23-board.js:268` |
| `openQuickCapture` | функція | `src/scripts/core/23-board.js:281` |
| `closeQuickCapture` | функція | `src/scripts/core/23-board.js:287` |
| `saveQuickCapture` | функція | `src/scripts/core/23-board.js:288` |
| `window.flowQuickCapture` | значення | `src/scripts/core/23-board.js:316` |
| `window.flowOpenInbox` | функція | `src/scripts/core/23-board.js:318` |

### `src/scripts/core/24-reminders.js` — 16 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `setTaskReminder` | функція | `src/scripts/core/24-reminders.js:3` |
| `toLocalInput` | функція | `src/scripts/core/24-reminders.js:18` |
| `remindLabel` | функція | `src/scripts/core/24-reminders.js:22` |
| `parseLocalInput` | функція | `src/scripts/core/24-reminders.js:32` |
| `reminderTimers` | обʼєкт | `src/scripts/core/24-reminders.js:38` |
| `scheduleReminder` | функція | `src/scripts/core/24-reminders.js:39` |
| `fireReminder` | функція | `src/scripts/core/24-reminders.js:47` |
| `rescheduleAllReminders` | функція | `src/scripts/core/24-reminders.js:57` |
| `checkDueReminders` | функція | `src/scripts/core/24-reminders.js:70` |
| `window.flowSetTaskReminder` | значення | `src/scripts/core/24-reminders.js:91` |
| `plScheduleReminder` | функція | `src/scripts/core/24-reminders.js:94` |
| `plFireReminder` | функція | `src/scripts/core/24-reminders.js:103` |
| `plRescheduleReminders` | функція | `src/scripts/core/24-reminders.js:113` |
| `plCheckDueReminders` | функція | `src/scripts/core/24-reminders.js:122` |
| `saveBoard` | функція | `src/scripts/core/24-reminders.js:139` |
| `buildBlock` | функція | `src/scripts/core/24-reminders.js:144` |

### `src/scripts/core/25-reader.js` — 40 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `BookDB` | значення | `src/scripts/core/25-reader.js:6` |
| `loadScriptOnce` | функція | `src/scripts/core/25-reader.js:28` |
| `pickBookFile` | функція | `src/scripts/core/25-reader.js:48` |
| `rdrCfg` | обʼєкт | `src/scripts/core/25-reader.js:74` |
| `RDR_CFG_KEY` | значення | `src/scripts/core/25-reader.js:75` |
| `loadRdrCfg` | функція | `src/scripts/core/25-reader.js:76` |
| `saveRdrCfg` | функція | `src/scripts/core/25-reader.js:79` |
| `applyRdrCfg` | функція | `src/scripts/core/25-reader.js:80` |
| `rdrBook` | значення | `src/scripts/core/25-reader.js:97` |
| `rdrFrom` | значення | `src/scripts/core/25-reader.js:98` |
| `pdfPages` | масив | `src/scripts/core/25-reader.js:99` |
| `rdrChapters` | масив | `src/scripts/core/25-reader.js:100` |
| `rdrRestoreTo` | значення | `src/scripts/core/25-reader.js:101` |
| `setRdrLoading` | функція | `src/scripts/core/25-reader.js:103` |
| `openReader` | функція | `src/scripts/core/25-reader.js:109` |
| `renderTextBook` | функція | `src/scripts/core/25-reader.js:145` |
| `mdToHtml` | функція | `src/scripts/core/25-reader.js:164` |
| `inlineMd` | функція | `src/scripts/core/25-reader.js:183` |
| `renderEpub` | функція | `src/scripts/core/25-reader.js:193` |
| `readZipText` | функція | `src/scripts/core/25-reader.js:233` |
| `normalizeZipPath` | функція | `src/scripts/core/25-reader.js:234` |
| `EPUB_TAGS` | обʼєкт | `src/scripts/core/25-reader.js:246` |
| `EPUB_DROP` | обʼєкт | `src/scripts/core/25-reader.js:251` |
| `sanitizeEpubHtml` | функція | `src/scripts/core/25-reader.js:254` |
| `epubCopyKids` | функція | `src/scripts/core/25-reader.js:260` |
| `epubImgSrc` | функція | `src/scripts/core/25-reader.js:293` |
| `embedEpubImages` | функція | `src/scripts/core/25-reader.js:300` |
| `renderPdf` | функція | `src/scripts/core/25-reader.js:316` |
| `repaintPdfZoom` | функція | `src/scripts/core/25-reader.js:358` |
| `buildToc` | функція | `src/scripts/core/25-reader.js:378` |
| `scrollFraction` | функція | `src/scripts/core/25-reader.js:390` |
| `restoreScroll` | функція | `src/scripts/core/25-reader.js:395` |
| `rdrSaveTimer` | значення | `src/scripts/core/25-reader.js:401` |
| `rdrTotalWords` | значення | `src/scripts/core/25-reader.js:402` |
| `RDR_WPM` | значення | `src/scripts/core/25-reader.js:403` |
| `updateRdrProgressUI` | функція | `src/scripts/core/25-reader.js:404` |
| `initReader` | функція | `src/scripts/core/25-reader.js:443` |
| `openBmSheet` | функція | `src/scripts/core/25-reader.js:513` |
| `renderMarks` | функція | `src/scripts/core/25-reader.js:531` |
| `addBookmark` | функція | `src/scripts/core/25-reader.js:551` |

### `src/scripts/core/26-blocks-render.js` — 16 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `isContainer` | функція | `src/scripts/core/26-blocks-render.js:2` |
| `findBlockDeep` | функція | `src/scripts/core/26-blocks-render.js:3` |
| `findParentArr` | функція | `src/scripts/core/26-blocks-render.js:13` |
| `delBlock` | функція | `src/scripts/core/26-blocks-render.js:22` |
| `getBlock` | функція | `src/scripts/core/26-blocks-render.js:34` |
| `renderBoard` | функція | `src/scripts/core/26-blocks-render.js:39` |
| `defaultSize` | функція | `src/scripts/core/26-blocks-render.js:48` |
| `autoSize` | функція | `src/scripts/core/26-blocks-render.js:53` |
| `szClass` | функція | `src/scripts/core/26-blocks-render.js:67` |
| `headBar` | функція | `src/scripts/core/26-blocks-render.js:73` |
| `BENTO_SKIP` | обʼєкт | `src/scripts/core/26-blocks-render.js:96` |
| `renderTileFull` | функція | `src/scripts/core/26-blocks-render.js:98` |
| `bentoSectionsHtml` | функція | `src/scripts/core/26-blocks-render.js:111` |
| `renderTile` | функція | `src/scripts/core/26-blocks-render.js:141` |
| `focusItem` | функція | `src/scripts/core/26-blocks-render.js:746` |
| `bindTiles` | функція | `src/scripts/core/26-blocks-render.js:755` |

### `src/scripts/core/27-canvas.js` — 27 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `openCardStyle` | функція | `src/scripts/core/27-canvas.js:2` |
| `escAttr` | функція | `src/scripts/core/27-canvas.js:24` |
| `migrate` | функція | `src/scripts/core/27-canvas.js:29` |
| `normalizeBlocks` | функція | `src/scripts/core/27-canvas.js:35` |
| `inboxMigrateOnce` | функція | `src/scripts/core/27-canvas.js:68` |
| `agencyPurgeOnce` | функція | `src/scripts/core/27-canvas.js:109` |
| `migSpacePurge` | функція | `src/scripts/core/27-canvas.js:146` |
| `migLegacyWidgets` | функція | `src/scripts/core/27-canvas.js:177` |
| `migBoardPat` | функція | `src/scripts/core/27-canvas.js:179` |
| `migForceLayoutOff` | функція | `src/scripts/core/27-canvas.js:185` |
| `MIGRATIONS_ONCE` | масив | `src/scripts/core/27-canvas.js:215` |
| `migDeferred` | значення | `src/scripts/core/27-canvas.js:235` |
| `runMigrations` | функція | `src/scripts/core/27-canvas.js:236` |
| `applyFolderCfgRaw` | функція | `src/scripts/core/27-canvas.js:275` |
| `applyFolderOrderRaw` | функція | `src/scripts/core/27-canvas.js:292` |
| `loadInFlight` | значення | `src/scripts/core/27-canvas.js:302` |
| `load` | функція | `src/scripts/core/27-canvas.js:303` |
| `loadOnce` | функція | `src/scripts/core/27-canvas.js:308` |
| `vv` | значення | `src/scripts/core/27-canvas.js:506` |
| `FIELD` | значення | `src/scripts/core/27-canvas.js:507` |
| `isField` | функція | `src/scripts/core/27-canvas.js:509` |
| `kbHeight` | функція | `src/scripts/core/27-canvas.js:512` |
| `syncKb` | функція | `src/scripts/core/27-canvas.js:516` |
| `ensureVisible` | функція | `src/scripts/core/27-canvas.js:523` |
| `VISION_FKEY` | значення | `src/scripts/core/27-canvas.js:559` |
| `migrateFolderPhotosOnce` | функція | `src/scripts/core/27-canvas.js:566` |
| `removeSystemSeedFoldersOnce` | функція | `src/scripts/core/27-canvas.js:584` |

### `src/scripts/core/28-vision.js` — 42 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `VZKEY` | значення | `src/scripts/core/28-vision.js:2` |
| `vzData` | обʼєкт | `src/scripts/core/28-vision.js:3` |
| `vzNorm` | функція | `src/scripts/core/28-vision.js:5` |
| `vzSave` | функція | `src/scripts/core/28-vision.js:34` |
| `vzFin` | функція | `src/scripts/core/28-vision.js:37` |
| `vzDay` | функція | `src/scripts/core/28-vision.js:42` |
| `vzGoalsInfo` | функція | `src/scripts/core/28-vision.js:45` |
| `vzStreak` | функція | `src/scripts/core/28-vision.js:49` |
| `vzFocusCalc` | функція | `src/scripts/core/28-vision.js:57` |
| `vzCoachMsg` | функція | `src/scripts/core/28-vision.js:67` |
| `vzEditStatement` | функція | `src/scripts/core/28-vision.js:80` |
| `vzEditTags` | функція | `src/scripts/core/28-vision.js:83` |
| `vzEditFocus` | функція | `src/scripts/core/28-vision.js:86` |
| `vzAddStep` | функція | `src/scripts/core/28-vision.js:101` |
| `vzStepMenu` | функція | `src/scripts/core/28-vision.js:111` |
| `vzPickFolder` | функція | `src/scripts/core/28-vision.js:129` |
| `VZ_GOAL_COLORS` | масив | `src/scripts/core/28-vision.js:137` |
| `vzAfterGoalCreated` | функція | `src/scripts/core/28-vision.js:138` |
| `vzStepToGoal` | функція | `src/scripts/core/28-vision.js:143` |
| `vzPlanToGoal` | функція | `src/scripts/core/28-vision.js:150` |
| `VZ_TERMS` | масив | `src/scripts/core/28-vision.js:160` |
| `VZ_TERM_LABEL` | обʼєкт | `src/scripts/core/28-vision.js:161` |
| `vzAddPlan` | функція | `src/scripts/core/28-vision.js:162` |
| `vzPlanAddItem` | функція | `src/scripts/core/28-vision.js:169` |
| `vzPlanMenu` | функція | `src/scripts/core/28-vision.js:176` |
| `vzAddFolderLink` | функція | `src/scripts/core/28-vision.js:193` |
| `vzFolderChipMenu` | функція | `src/scripts/core/28-vision.js:201` |
| `vzRzToday` | функція | `src/scripts/core/28-vision.js:210` |
| `vzRzDayFull` | функція | `src/scripts/core/28-vision.js:211` |
| `vzRzToggle` | функція | `src/scripts/core/28-vision.js:213` |
| `vzRzMenu` | функція | `src/scripts/core/28-vision.js:219` |
| `vzKtStats` | функція | `src/scripts/core/28-vision.js:238` |
| `vzKtAnswer` | функція | `src/scripts/core/28-vision.js:245` |
| `vzKtMenu` | функція | `src/scripts/core/28-vision.js:249` |
| `vzFocus` | обʼєкт | `src/scripts/core/28-vision.js:268` |
| `vzQueue` | функція | `src/scripts/core/28-vision.js:269` |
| `vzFocusStop` | функція | `src/scripts/core/28-vision.js:279` |
| `vzFocusDone` | функція | `src/scripts/core/28-vision.js:280` |
| `renderVisionFocus` | функція | `src/scripts/core/28-vision.js:290` |
| `renderVision` | функція | `src/scripts/core/28-vision.js:330` |
| `goVision` | функція | `src/scripts/core/28-vision.js:525` |
| `window.goVision` | значення | `src/scripts/core/28-vision.js:526` |

### `src/scripts/core/29-more-screen.js` — 32 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `TOOLS` | масив | `src/scripts/core/29-more-screen.js:11` |
| `LITE_DOORS` | масив | `src/scripts/core/29-more-screen.js:18` |
| `DEV_ROWS` | масив | `src/scripts/core/29-more-screen.js:23` |
| `inboxWaiting` | функція | `src/scripts/core/29-more-screen.js:29` |
| `ico` | функція | `src/scripts/core/29-more-screen.js:32` |
| `chev` | функція | `src/scripts/core/29-more-screen.js:33` |
| `rowHTML` | функція | `src/scripts/core/29-more-screen.js:34` |
| `renderMore` | функція | `src/scripts/core/29-more-screen.js:39` |
| `MSEC` | масив | `src/scripts/core/29-more-screen.js:64` |
| `moreIsWide` | функція | `src/scripts/core/29-more-screen.js:66` |
| `renderMoreIndex` | функція | `src/scripts/core/29-more-screen.js:67` |
| `moreShowSection` | функція | `src/scripts/core/29-more-screen.js:75` |
| `window.moreShowSection` | значення | `src/scripts/core/29-more-screen.js:84` |
| `openMoreSheet` | функція | `src/scripts/core/29-more-screen.js:86` |
| `goMore` | функція | `src/scripts/core/29-more-screen.js:106` |
| `window.goMore` | значення | `src/scripts/core/29-more-screen.js:113` |
| `escA` | функція | `src/scripts/core/29-more-screen.js:116` |
| `safeImgA` | функція | `src/scripts/core/29-more-screen.js:117` |
| `readAvatarFile` | функція | `src/scripts/core/29-more-screen.js:119` |
| `syncLabel` | функція | `src/scripts/core/29-more-screen.js:140` |
| `flowStorageInfo` | функція | `src/scripts/core/29-more-screen.js:158` |
| `fmtMem` | функція | `src/scripts/core/29-more-screen.js:167` |
| `fillMemRow` | функція | `src/scripts/core/29-more-screen.js:168` |
| `renderAccount` | функція | `src/scripts/core/29-more-screen.js:183` |
| `window.renderAccount` | значення | `src/scripts/core/29-more-screen.js:534` |
| `maskMail` | функція | `src/scripts/core/29-more-screen.js:541` |
| `foreignWipe` | функція | `src/scripts/core/29-more-screen.js:542` |
| `foreignAsk` | функція | `src/scripts/core/29-more-screen.js:557` |
| `window.flowForeignAsk` | значення | `src/scripts/core/29-more-screen.js:567` |
| `hm` | значення | `src/scripts/core/29-more-screen.js:580` |
| `na` | функція | `src/scripts/core/29-more-screen.js:581` |
| `nm` | значення | `src/scripts/core/29-more-screen.js:582` |

### `src/scripts/core/30-upgrade.js` — 30 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `UPKEY` | значення | `src/scripts/core/30-upgrade.js:6` |
| `UP_DEV_HASH` | значення | `src/scripts/core/30-upgrade.js:8` |
| `upDevProbe` | значення | `src/scripts/core/30-upgrade.js:9` |
| `UP_XP_LEVEL` | значення | `src/scripts/core/30-upgrade.js:10` |
| `UP_DEF_SPHERES` | масив | `src/scripts/core/30-upgrade.js:11` |
| `upData` | значення | `src/scripts/core/30-upgrade.js:19` |
| `upEsc` | функція | `src/scripts/core/30-upgrade.js:21` |
| `upNorm` | функція | `src/scripts/core/30-upgrade.js:23` |
| `upLoad` | функція | `src/scripts/core/30-upgrade.js:38` |
| `upSave` | функція | `src/scripts/core/30-upgrade.js:47` |
| `upDevOn` | функція | `src/scripts/core/30-upgrade.js:50` |
| `upSha256` | функція | `src/scripts/core/30-upgrade.js:64` |
| `window.upDevOn` | значення | `src/scripts/core/30-upgrade.js:70` |
| `window.upProfile` | функція | `src/scripts/core/30-upgrade.js:72` |
| `upOverall` | функція | `src/scripts/core/30-upgrade.js:74` |
| `upUserName` | функція | `src/scripts/core/30-upgrade.js:80` |
| `upAvatarHTML` | функція | `src/scripts/core/30-upgrade.js:85` |
| `upSphereCard` | функція | `src/scripts/core/30-upgrade.js:93` |
| `renderUpgrade` | функція | `src/scripts/core/30-upgrade.js:102` |
| `upLastSnapLine` | функція | `src/scripts/core/30-upgrade.js:131` |
| `upEditPath` | функція | `src/scripts/core/30-upgrade.js:141` |
| `upEditSphere` | функція | `src/scripts/core/30-upgrade.js:149` |
| `upCollectDays` | функція | `src/scripts/core/30-upgrade.js:161` |
| `upBuildPrompt` | функція | `src/scripts/core/30-upgrade.js:176` |
| `upParseVerdict` | функція | `src/scripts/core/30-upgrade.js:196` |
| `upSheet` | функція | `src/scripts/core/30-upgrade.js:212` |
| `upApplyVerdict` | функція | `src/scripts/core/30-upgrade.js:226` |
| `upAnalyze` | функція | `src/scripts/core/30-upgrade.js:240` |
| `goUpgrade` | функція | `src/scripts/core/30-upgrade.js:284` |
| `window.goUpgrade` | значення | `src/scripts/core/30-upgrade.js:293` |

### `src/scripts/core/31-my-year.js` — 21 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `myEsc` | функція | `src/scripts/core/31-my-year.js:7` |
| `myGoalKey` | функція | `src/scripts/core/31-my-year.js:8` |
| `myPlanGoals` | функція | `src/scripts/core/31-my-year.js:9` |
| `myQNow` | функція | `src/scripts/core/31-my-year.js:10` |
| `MY_Q_LABEL` | обʼєкт | `src/scripts/core/31-my-year.js:11` |
| `MY_MON` | масив | `src/scripts/core/31-my-year.js:12` |
| `mySpheres` | масив | `src/scripts/core/31-my-year.js:14` |
| `mySphere` | функція | `src/scripts/core/31-my-year.js:16` |
| `myWeekDays` | функція | `src/scripts/core/31-my-year.js:17` |
| `myWeekBlocks` | функція | `src/scripts/core/31-my-year.js:23` |
| `myGoalCard` | функція | `src/scripts/core/31-my-year.js:36` |
| `myGoalRowFuture` | функція | `src/scripts/core/31-my-year.js:49` |
| `renderMyYear` | функція | `src/scripts/core/31-my-year.js:57` |
| `mySheet` | функція | `src/scripts/core/31-my-year.js:110` |
| `mySphereSheet` | функція | `src/scripts/core/31-my-year.js:118` |
| `myGoalSheet` | функція | `src/scripts/core/31-my-year.js:134` |
| `myPickSphere` | функція | `src/scripts/core/31-my-year.js:151` |
| `myPickQuarter` | функція | `src/scripts/core/31-my-year.js:156` |
| `myAddSheet` | функція | `src/scripts/core/31-my-year.js:162` |
| `goMyYear` | функція | `src/scripts/core/31-my-year.js:185` |
| `window.goMyYear` | значення | `src/scripts/core/31-my-year.js:196` |

### `src/scripts/core/32-global-search.js` — 13 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `LIM` | значення | `src/scripts/core/32-global-search.js:6` |
| `gsEsc` | функція | `src/scripts/core/32-global-search.js:7` |
| `gsRe` | функція | `src/scripts/core/32-global-search.js:8` |
| `gsMark` | функція | `src/scripts/core/32-global-search.js:9` |
| `gsSnip` | функція | `src/scripts/core/32-global-search.js:13` |
| `ov` | значення | `src/scripts/core/32-global-search.js:20` |
| `ensureOv` | функція | `src/scripts/core/32-global-search.js:21` |
| `hitHTML` | функція | `src/scripts/core/32-global-search.js:60` |
| `render` | функція | `src/scripts/core/32-global-search.js:70` |
| `open` | функція | `src/scripts/core/32-global-search.js:133` |
| `close` | функція | `src/scripts/core/32-global-search.js:140` |
| `window.flowGlobalSearch` | значення | `src/scripts/core/32-global-search.js:141` |
| `hb` | значення | `src/scripts/core/32-global-search.js:151` |

### `src/scripts/core/34-shortcuts.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MAP` | обʼєкт | `src/scripts/core/34-shortcuts.js:6` |
| `typing` | функція | `src/scripts/core/34-shortcuts.js:14` |
| `ks` | значення | `src/scripts/core/34-shortcuts.js:19` |
| `sheetHTML` | функція | `src/scripts/core/34-shortcuts.js:20` |
| `sheetToggle` | функція | `src/scripts/core/34-shortcuts.js:32` |

### `src/scripts/core/35-channel.js` — 65 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `chKey` | значення | `src/scripts/core/35-channel.js:14` |
| `chTopic` | значення | `src/scripts/core/35-channel.js:15` |
| `chFeedTail` | значення | `src/scripts/core/35-channel.js:16` |
| `chOrigin` | значення | `src/scripts/core/35-channel.js:17` |
| `chMode` | значення | `src/scripts/core/35-channel.js:18` |
| `chRec` | значення | `src/scripts/core/35-channel.js:19` |
| `chLongPressed` | значення | `src/scripts/core/35-channel.js:20` |
| `chAiBusy` | значення | `src/scripts/core/35-channel.js:21` |
| `CH_I` | обʼєкт | `src/scripts/core/35-channel.js:23` |
| `chI` | функція | `src/scripts/core/35-channel.js:47` |
| `chToast` | функція | `src/scripts/core/35-channel.js:48` |
| `chHaptic` | функція | `src/scripts/core/35-channel.js:49` |
| `chChat` | функція | `src/scripts/core/35-channel.js:50` |
| `chBoardKey` | функція | `src/scripts/core/35-channel.js:51` |
| `chTargetBk` | функція | `src/scripts/core/35-channel.js:53` |
| `chFolders` | функція | `src/scripts/core/35-channel.js:55` |
| `chUid` | функція | `src/scripts/core/35-channel.js:57` |
| `chPlain` | функція | `src/scripts/core/35-channel.js:59` |
| `chTxt` | функція | `src/scripts/core/35-channel.js:64` |
| `chTimeOf` | функція | `src/scripts/core/35-channel.js:67` |
| `chDayLabel` | функція | `src/scripts/core/35-channel.js:77` |
| `chHM` | функція | `src/scripts/core/35-channel.js:88` |
| `chItems` | функція | `src/scripts/core/35-channel.js:91` |
| `chPhotos` | функція | `src/scripts/core/35-channel.js:98` |
| `goChat` | функція | `src/scripts/core/35-channel.js:110` |
| `goChannel` | функція | `src/scripts/core/35-channel.js:123` |
| `chBack` | функція | `src/scripts/core/35-channel.js:128` |
| `chScrollBottom` | функція | `src/scripts/core/35-channel.js:139` |
| `chFitFeed` | функція | `src/scripts/core/35-channel.js:145` |
| `renderChannel` | функція | `src/scripts/core/35-channel.js:150` |
| `chCoverApi` | функція | `src/scripts/core/35-channel.js:159` |
| `chSubText` | функція | `src/scripts/core/35-channel.js:161` |
| `chSyncSub` | функція | `src/scripts/core/35-channel.js:168` |
| `renderChCover` | функція | `src/scripts/core/35-channel.js:169` |
| `chCoverSheet` | функція | `src/scripts/core/35-channel.js:192` |
| `chMoreSheet` | функція | `src/scripts/core/35-channel.js:208` |
| `renderChChips` | функція | `src/scripts/core/35-channel.js:214` |
| `chOpenFolder` | функція | `src/scripts/core/35-channel.js:231` |
| `chFolderChipSheet` | функція | `src/scripts/core/35-channel.js:237` |
| `chAttachLongPress` | функція | `src/scripts/core/35-channel.js:247` |
| `renderChFeed` | функція | `src/scripts/core/35-channel.js:257` |
| `chAppendFeed` | функція | `src/scripts/core/35-channel.js:290` |
| `chEagerPhotos` | функція | `src/scripts/core/35-channel.js:308` |
| `chBubble` | функція | `src/scripts/core/35-channel.js:313` |
| `chAiSync` | функція | `src/scripts/core/35-channel.js:360` |
| `chAiCollect` | функція | `src/scripts/core/35-channel.js:377` |
| `chAiSummarize` | функція | `src/scripts/core/35-channel.js:403` |
| `chBindFeed` | функція | `src/scripts/core/35-channel.js:446` |
| `chJumpTo` | функція | `src/scripts/core/35-channel.js:468` |
| `chRecordSheet` | функція | `src/scripts/core/35-channel.js:480` |
| `chEditRecord` | функція | `src/scripts/core/35-channel.js:499` |
| `chCopyToFolder` | функція | `src/scripts/core/35-channel.js:520` |
| `chPickCopyTarget` | функція | `src/scripts/core/35-channel.js:527` |
| `chDeleteRecord` | функція | `src/scripts/core/35-channel.js:536` |
| `chInitComposer` | функція | `src/scripts/core/35-channel.js:545` |
| `chAutoGrow` | функція | `src/scripts/core/35-channel.js:590` |
| `chSyncSend` | функція | `src/scripts/core/35-channel.js:591` |
| `chSetMode` | функція | `src/scripts/core/35-channel.js:597` |
| `chToggleTray` | функція | `src/scripts/core/35-channel.js:603` |
| `chPushBlock` | функція | `src/scripts/core/35-channel.js:609` |
| `chSend` | функція | `src/scripts/core/35-channel.js:616` |
| `chPickFile` | функція | `src/scripts/core/35-channel.js:629` |
| `chShrink` | функція | `src/scripts/core/35-channel.js:635` |
| `chVoice` | функція | `src/scripts/core/35-channel.js:646` |
| `chSheet` | функція | `src/scripts/core/35-channel.js:677` |

### `src/scripts/core/36-chats.js` — 45 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CHATS_KEY` | значення | `src/scripts/core/36-chats.js:14` |
| `INBOX_CHAT` | значення | `src/scripts/core/36-chats.js:15` |
| `CHAT_PALETTE` | масив | `src/scripts/core/36-chats.js:16` |
| `chats` | масив | `src/scripts/core/36-chats.js:17` |
| `HTAB_KEY` | значення | `src/scripts/core/36-chats.js:20` |
| `HTABS` | масив | `src/scripts/core/36-chats.js:21` |
| `homeTab` | значення | `src/scripts/core/36-chats.js:22` |
| `chatBk` | функція | `src/scripts/core/36-chats.js:26` |
| `chatById` | функція | `src/scripts/core/36-chats.js:27` |
| `chatsForFolder` | функція | `src/scripts/core/36-chats.js:28` |
| `chatFolders` | функція | `src/scripts/core/36-chats.js:30` |
| `chatUid` | функція | `src/scripts/core/36-chats.js:31` |
| `normChat` | функція | `src/scripts/core/36-chats.js:32` |
| `saveChats` | функція | `src/scripts/core/36-chats.js:38` |
| `applyChatsRaw` | функція | `src/scripts/core/36-chats.js:41` |
| `chatCreate` | функція | `src/scripts/core/36-chats.js:47` |
| `createChat` | функція | `src/scripts/core/36-chats.js:59` |
| `chatRename` | функція | `src/scripts/core/36-chats.js:68` |
| `chatDelete` | функція | `src/scripts/core/36-chats.js:77` |
| `chatsRefresh` | функція | `src/scripts/core/36-chats.js:91` |
| `ensureInboxChat` | функція | `src/scripts/core/36-chats.js:98` |
| `chatsMigrateInboxOnce` | функція | `src/scripts/core/36-chats.js:114` |
| `chatLinkFolder` | функція | `src/scripts/core/36-chats.js:146` |
| `chatUnlinkFolder` | функція | `src/scripts/core/36-chats.js:156` |
| `linkableFolders` | функція | `src/scripts/core/36-chats.js:161` |
| `chatAddSheet` | функція | `src/scripts/core/36-chats.js:167` |
| `newFolderForChat` | функція | `src/scripts/core/36-chats.js:182` |
| `pickFolderForChat` | функція | `src/scripts/core/36-chats.js:194` |
| `setHomeTab` | функція | `src/scripts/core/36-chats.js:205` |
| `chatsHomeSync` | функція | `src/scripts/core/36-chats.js:214` |
| `chatLast` | функція | `src/scripts/core/36-chats.js:238` |
| `chatPreview` | функція | `src/scripts/core/36-chats.js:244` |
| `chatTimeLabel` | функція | `src/scripts/core/36-chats.js:253` |
| `renderChatList` | функція | `src/scripts/core/36-chats.js:260` |
| `chatMenu` | функція | `src/scripts/core/36-chats.js:288` |
| `openChatSettings` | функція | `src/scripts/core/36-chats.js:292` |
| `window.openChatSettings` | значення | `src/scripts/core/36-chats.js:335` |
| `pgFolderKey` | функція | `src/scripts/core/36-chats.js:338` |
| `renderPgLinks` | функція | `src/scripts/core/36-chats.js:339` |
| `pgHubData` | функція | `src/scripts/core/36-chats.js:357` |
| `pgHubHTML` | функція | `src/scripts/core/36-chats.js:366` |
| `pgHubOpen` | функція | `src/scripts/core/36-chats.js:377` |
| `folderAddSheet` | функція | `src/scripts/core/36-chats.js:386` |
| `pickChatForFolder` | функція | `src/scripts/core/36-chats.js:401` |
| `chatsInit` | функція | `src/scripts/core/36-chats.js:411` |

### `src/scripts/core/37-ai-privacy.js` — 20 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `AI_PRIV_KEY` | значення | `src/scripts/core/37-ai-privacy.js:21` |
| `AI_CONSENT_VER` | значення | `src/scripts/core/37-ai-privacy.js:22` |
| `AI_PRIV_SECTIONS` | масив | `src/scripts/core/37-ai-privacy.js:23` |
| `aiPrivMem` | значення | `src/scripts/core/37-ai-privacy.js:31` |
| `aiPrivNorm` | функція | `src/scripts/core/37-ai-privacy.js:32` |
| `aiPrivGet` | функція | `src/scripts/core/37-ai-privacy.js:37` |
| `aiPrivSet` | функція | `src/scripts/core/37-ai-privacy.js:43` |
| `aiPrivLoad` | функція | `src/scripts/core/37-ai-privacy.js:50` |
| `aiConsentOk` | функція | `src/scripts/core/37-ai-privacy.js:56` |
| `aiAllowed` | функція | `src/scripts/core/37-ai-privacy.js:60` |
| `aiSectionOff` | функція | `src/scripts/core/37-ai-privacy.js:61` |
| `aiSectionOffMsg` | функція | `src/scripts/core/37-ai-privacy.js:62` |
| `aiOffError` | функція | `src/scripts/core/37-ai-privacy.js:68` |
| `aiSectionError` | функція | `src/scripts/core/37-ai-privacy.js:75` |
| `aiQuietHint` | функція | `src/scripts/core/37-ai-privacy.js:84` |
| `aiPrivWhatHTML` | функція | `src/scripts/core/37-ai-privacy.js:96` |
| `aiConsentPending` | значення | `src/scripts/core/37-ai-privacy.js:116` |
| `aiConsentSheet` | функція | `src/scripts/core/37-ai-privacy.js:117` |
| `aiConsentGate` | функція | `src/scripts/core/37-ai-privacy.js:151` |
| `aiPrivacySheet` | функція | `src/scripts/core/37-ai-privacy.js:164` |

### `src/scripts/core/38-world.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `worldShown` | значення | `src/scripts/core/38-world.js:9` |
| `worldOn` | функція | `src/scripts/core/38-world.js:10` |
| `worldApplyNav` | функція | `src/scripts/core/38-world.js:15` |
| `worldBridge` | функція | `src/scripts/core/38-world.js:23` |
| `goWorld` | функція | `src/scripts/core/38-world.js:70` |

### `src/scripts/core/39-spheres.js` — 20 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `SPH_ICONS` | обʼєкт | `src/scripts/core/39-spheres.js:11` |
| `sphIcon` | функція | `src/scripts/core/39-spheres.js:21` |
| `SPH_TPL` | обʼєкт | `src/scripts/core/39-spheres.js:24` |
| `SPH_ORDER` | масив | `src/scripts/core/39-spheres.js:50` |
| `sphOn` | функція | `src/scripts/core/39-spheres.js:52` |
| `sphTpl` | функція | `src/scripts/core/39-spheres.js:54` |
| `sphKeys` | функція | `src/scripts/core/39-spheres.js:55` |
| `sphBlocks` | функція | `src/scripts/core/39-spheres.js:58` |
| `sphStreak` | функція | `src/scripts/core/39-spheres.js:64` |
| `sphWeek` | функція | `src/scripts/core/39-spheres.js:70` |
| `sphStats` | функція | `src/scripts/core/39-spheres.js:78` |
| `sphRenderList` | функція | `src/scripts/core/39-spheres.js:107` |
| `sphHomeSync` | функція | `src/scripts/core/39-spheres.js:130` |
| `sphTemplateSheet` | функція | `src/scripts/core/39-spheres.js:143` |
| `sphNewBlocks` | функція | `src/scripts/core/39-spheres.js:162` |
| `sphCreate` | функція | `src/scripts/core/39-spheres.js:166` |
| `sphConvert` | функція | `src/scripts/core/39-spheres.js:182` |
| `sphRenderHead` | функція | `src/scripts/core/39-spheres.js:195` |
| `sphForWorld` | функція | `src/scripts/core/39-spheres.js:210` |
| `spheresInit` | функція | `src/scripts/core/39-spheres.js:217` |

### `src/scripts/core/40-year-letter.js` — 30 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `YL_MON` | масив | `src/scripts/core/40-year-letter.js:10` |
| `YL_MON_G` | масив | `src/scripts/core/40-year-letter.js:11` |
| `ylMidOpen` | значення | `src/scripts/core/40-year-letter.js:12` |
| `ylLetter` | функція | `src/scripts/core/40-year-letter.js:14` |
| `ylDefaultDate` | функція | `src/scripts/core/40-year-letter.js:19` |
| `ylDate` | функція | `src/scripts/core/40-year-letter.js:20` |
| `ylDateTxt` | функція | `src/scripts/core/40-year-letter.js:21` |
| `ylMonName` | функція | `src/scripts/core/40-year-letter.js:23` |
| `ylYmAdd` | функція | `src/scripts/core/40-year-letter.js:24` |
| `ylGoalMs` | функція | `src/scripts/core/40-year-letter.js:25` |
| `ylColor` | функція | `src/scripts/core/40-year-letter.js:26` |
| `ylLit` | функція | `src/scripts/core/40-year-letter.js:28` |
| `ylSentences` | функція | `src/scripts/core/40-year-letter.js:29` |
| `ylLinked` | функція | `src/scripts/core/40-year-letter.js:31` |
| `ylLetterHtml` | функція | `src/scripts/core/40-year-letter.js:34` |
| `ylWish` | функція | `src/scripts/core/40-year-letter.js:46` |
| `ylWishCover` | функція | `src/scripts/core/40-year-letter.js:47` |
| `ylBlockHtml` | функція | `src/scripts/core/40-year-letter.js:50` |
| `ylRoadHtml` | функція | `src/scripts/core/40-year-letter.js:81` |
| `ylFindMs` | функція | `src/scripts/core/40-year-letter.js:121` |
| `ylPress` | функція | `src/scripts/core/40-year-letter.js:127` |
| `ylBind` | функція | `src/scripts/core/40-year-letter.js:135` |
| `ylAddMs` | функція | `src/scripts/core/40-year-letter.js:160` |
| `ylDraftFromOld` | функція | `src/scripts/core/40-year-letter.js:173` |
| `ylEdit` | функція | `src/scripts/core/40-year-letter.js:177` |
| `ylRead` | функція | `src/scripts/core/40-year-letter.js:218` |
| `ylPace` | функція | `src/scripts/core/40-year-letter.js:255` |
| `ylAskFlow` | функція | `src/scripts/core/40-year-letter.js:260` |
| `ylAiCtx` | функція | `src/scripts/core/40-year-letter.js:266` |
| `ylForWorld` | функція | `src/scripts/core/40-year-letter.js:284` |

### `src/scripts/core/41-journal.js` — 64 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `JN_COLORS` | масив | `src/scripts/core/41-journal.js:14` |
| `JN_DOW` | масив | `src/scripts/core/41-journal.js:15` |
| `JN_DOW_ORDER` | масив | `src/scripts/core/41-journal.js:16` |
| `JN_MON` | масив | `src/scripts/core/41-journal.js:17` |
| `JN_CLASSES` | масив | `src/scripts/core/41-journal.js:18` |
| `JN_XP_LVL` | значення | `src/scripts/core/41-journal.js:19` |
| `jnShowArchive` | значення | `src/scripts/core/41-journal.js:20` |
| `jnEl` | функція | `src/scripts/core/41-journal.js:22` |
| `jnMoney` | функція | `src/scripts/core/41-journal.js:23` |
| `jnHm` | функція | `src/scripts/core/41-journal.js:24` |
| `jnDateTxt` | функція | `src/scripts/core/41-journal.js:25` |
| `jnHero` | функція | `src/scripts/core/41-journal.js:26` |
| `jnRole` | функція | `src/scripts/core/41-journal.js:27` |
| `jnStatus` | функція | `src/scripts/core/41-journal.js:28` |
| `jnLevels` | функція | `src/scripts/core/41-journal.js:29` |
| `jnPct` | функція | `src/scripts/core/41-journal.js:32` |
| `jnDayBlocks` | функція | `src/scripts/core/41-journal.js:39` |
| `jnBlockGoal` | функція | `src/scripts/core/41-journal.js:52` |
| `jnXP` | функція | `src/scripts/core/41-journal.js:55` |
| `jnHeroXP` | функція | `src/scripts/core/41-journal.js:63` |
| `jnFreeHours` | функція | `src/scripts/core/41-journal.js:65` |
| `jnDayLevel` | функція | `src/scripts/core/41-journal.js:73` |
| `jnStreak` | функція | `src/scripts/core/41-journal.js:78` |
| `jnWeek` | функція | `src/scripts/core/41-journal.js:84` |
| `jnMateOn` | функція | `src/scripts/core/41-journal.js:91` |
| `jnMateName` | функція | `src/scripts/core/41-journal.js:92` |
| `jnMateHTML` | функція | `src/scripts/core/41-journal.js:93` |
| `jnAvatar` | функція | `src/scripts/core/41-journal.js:99` |
| `jnName` | функція | `src/scripts/core/41-journal.js:105` |
| `jnSchedTxt` | функція | `src/scripts/core/41-journal.js:111` |
| `jnMissionCard` | функція | `src/scripts/core/41-journal.js:116` |
| `jnFocus` | значення | `src/scripts/core/41-journal.js:133` |
| `jnTab` | значення | `src/scripts/core/41-journal.js:136` |
| `jnMissionPhoto` | функція | `src/scripts/core/41-journal.js:139` |
| `jnGoalById` | функція | `src/scripts/core/41-journal.js:146` |
| `jnBg` | функція | `src/scripts/core/41-journal.js:147` |
| `jnStory` | функція | `src/scripts/core/41-journal.js:151` |
| `jnTodayList` | функція | `src/scripts/core/41-journal.js:158` |
| `jnFocusCard` | функція | `src/scripts/core/41-journal.js:162` |
| `jnTaskRow` | функція | `src/scripts/core/41-journal.js:174` |
| `jnRender` | функція | `src/scripts/core/41-journal.js:181` |
| `jnTop` | функція | `src/scripts/core/41-journal.js:208` |
| `jnFloatRender` | функція | `src/scripts/core/41-journal.js:210` |
| `jnRenderOtherDay` | функція | `src/scripts/core/41-journal.js:224` |
| `jnRenderToday` | функція | `src/scripts/core/41-journal.js:232` |
| `jnToggleBlock` | функція | `src/scripts/core/41-journal.js:312` |
| `jnDone` | функція | `src/scripts/core/41-journal.js:325` |
| `jnUndoSheet` | функція | `src/scripts/core/41-journal.js:330` |
| `jnCelebrate` | функція | `src/scripts/core/41-journal.js:334` |
| `jnStoryView` | функція | `src/scripts/core/41-journal.js:360` |
| `jnEnergySheet` | функція | `src/scripts/core/41-journal.js:391` |
| `jnHeroSheet` | функція | `src/scripts/core/41-journal.js:400` |
| `jnOverlay` | функція | `src/scripts/core/41-journal.js:416` |
| `jnClearFuture` | функція | `src/scripts/core/41-journal.js:429` |
| `jnOtherTpls` | функція | `src/scripts/core/41-journal.js:437` |
| `jnTplDows` | функція | `src/scripts/core/41-journal.js:440` |
| `jnSyncRecur` | функція | `src/scripts/core/41-journal.js:447` |
| `jnEditor` | функція | `src/scripts/core/41-journal.js:468` |
| `jnStartCard` | функція | `src/scripts/core/41-journal.js:600` |
| `jnStart` | функція | `src/scripts/core/41-journal.js:605` |
| `jnSettings` | функція | `src/scripts/core/41-journal.js:687` |
| `jnDaySheet` | функція | `src/scripts/core/41-journal.js:700` |
| `jnAskReview` | функція | `src/scripts/core/41-journal.js:736` |
| `goJournal` | функція | `src/scripts/core/41-journal.js:747` |

### `src/scripts/core/42-day.js` — 35 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `DY_DOW` | масив | `src/scripts/core/42-day.js:8` |
| `DY_MIN_GAP` | значення | `src/scripts/core/42-day.js:9` |
| `dyGoal` | функція | `src/scripts/core/42-day.js:11` |
| `dyColor` | функція | `src/scripts/core/42-day.js:13` |
| `dyAddDays` | функція | `src/scripts/core/42-day.js:14` |
| `dyCursorStart` | функція | `src/scripts/core/42-day.js:16` |
| `dyDayEnd` | функція | `src/scripts/core/42-day.js:22` |
| `dyWeekHTML` | функція | `src/scripts/core/42-day.js:24` |
| `dyRow` | функція | `src/scripts/core/42-day.js:38` |
| `dyGap` | функція | `src/scripts/core/42-day.js:47` |
| `dyRibbonHTML` | функція | `src/scripts/core/42-day.js:53` |
| `dyDayTitle` | функція | `src/scripts/core/42-day.js:71` |
| `dyDayHTML` | функція | `src/scripts/core/42-day.js:75` |
| `dyBind` | функція | `src/scripts/core/42-day.js:86` |
| `dyNewId` | функція | `src/scripts/core/42-day.js:99` |
| `dyDropReminder` | функція | `src/scripts/core/42-day.js:100` |
| `dyRemove` | функція | `src/scripts/core/42-day.js:103` |
| `dyComplete` | функція | `src/scripts/core/42-day.js:115` |
| `dyMoveTo` | функція | `src/scripts/core/42-day.js:124` |
| `dyDayPicker` | функція | `src/scripts/core/42-day.js:138` |
| `dyPickDay` | функція | `src/scripts/core/42-day.js:147` |
| `dyMenu` | функція | `src/scripts/core/42-day.js:150` |
| `dyFreeSlot` | функція | `src/scripts/core/42-day.js:166` |
| `dyFromMissions` | функція | `src/scripts/core/42-day.js:173` |
| `dyWk` | обʼєкт | `src/scripts/core/42-day.js:204` |
| `dyMonday` | функція | `src/scripts/core/42-day.js:205` |
| `dyHrs` | функція | `src/scripts/core/42-day.js:206` |
| `dyNum` | функція | `src/scripts/core/42-day.js:207` |
| `dyWeekRange` | функція | `src/scripts/core/42-day.js:208` |
| `dyWeekHTMLFull` | функція | `src/scripts/core/42-day.js:212` |
| `dyWeekBind` | функція | `src/scripts/core/42-day.js:260` |
| `dyWeekTasks` | функція | `src/scripts/core/42-day.js:277` |
| `dyWeekTasksHTML` | функція | `src/scripts/core/42-day.js:278` |
| `dyTaskToDay` | функція | `src/scripts/core/42-day.js:286` |
| `dyWeekTasksBind` | функція | `src/scripts/core/42-day.js:295` |

### `src/scripts/core/43-month.js` — 32 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `moState` | обʼєкт | `src/scripts/core/43-month.js:7` |
| `MO_NAMES` | масив | `src/scripts/core/43-month.js:8` |
| `MO_SHORT` | масив | `src/scripts/core/43-month.js:9` |
| `MO_Q` | масив | `src/scripts/core/43-month.js:10` |
| `moYm` | функція | `src/scripts/core/43-month.js:12` |
| `moShift` | функція | `src/scripts/core/43-month.js:13` |
| `moDim` | функція | `src/scripts/core/43-month.js:14` |
| `moQ` | функція | `src/scripts/core/43-month.js:15` |
| `moTitle` | функція | `src/scripts/core/43-month.js:16` |
| `moMoney` | функція | `src/scripts/core/43-month.js:17` |
| `moPassed` | функція | `src/scripts/core/43-month.js:19` |
| `moLate` | функція | `src/scripts/core/43-month.js:20` |
| `moMissions` | функція | `src/scripts/core/43-month.js:21` |
| `moQuarters` | функція | `src/scripts/core/43-month.js:24` |
| `moCard` | функція | `src/scripts/core/43-month.js:28` |
| `moMoneyHTML` | функція | `src/scripts/core/43-month.js:41` |
| `moCalHTML` | функція | `src/scripts/core/43-month.js:59` |
| `moMonthHTML` | функція | `src/scripts/core/43-month.js:69` |
| `moBind` | функція | `src/scripts/core/43-month.js:81` |
| `moMoneySheet` | функція | `src/scripts/core/43-month.js:90` |
| `moMissionPage` | функція | `src/scripts/core/43-month.js:108` |
| `moPathTab` | функція | `src/scripts/core/43-month.js:136` |
| `moOwnFolder` | функція | `src/scripts/core/43-month.js:165` |
| `moBoard` | функція | `src/scripts/core/43-month.js:166` |
| `moTracker` | функція | `src/scripts/core/43-month.js:168` |
| `moNotes` | функція | `src/scripts/core/43-month.js:169` |
| `moVision` | функція | `src/scripts/core/43-month.js:170` |
| `moMarked` | функція | `src/scripts/core/43-month.js:171` |
| `moFolderTab` | функція | `src/scripts/core/43-month.js:172` |
| `moChatsTab` | функція | `src/scripts/core/43-month.js:192` |
| `moTextSheet` | функція | `src/scripts/core/43-month.js:200` |
| `moBindMission` | функція | `src/scripts/core/43-month.js:208` |

### `src/scripts/core/44-prizes.js` — 24 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `pzGoals` | функція | `src/scripts/core/44-prizes.js:8` |
| `pzEnv` | функція | `src/scripts/core/44-prizes.js:10` |
| `pzSaved` | функція | `src/scripts/core/44-prizes.js:12` |
| `pzPrice` | функція | `src/scripts/core/44-prizes.js:13` |
| `pzUnlocked` | функція | `src/scripts/core/44-prizes.js:15` |
| `pzLeftLevels` | функція | `src/scripts/core/44-prizes.js:20` |
| `pzReady` | функція | `src/scripts/core/44-prizes.js:21` |
| `pzActive` | функція | `src/scripts/core/44-prizes.js:23` |
| `pzTotal` | функція | `src/scripts/core/44-prizes.js:24` |
| `pzEmoji` | функція | `src/scripts/core/44-prizes.js:25` |
| `pzCur` | функція | `src/scripts/core/44-prizes.js:27` |
| `pzK` | функція | `src/scripts/core/44-prizes.js:28` |
| `pzCond` | функція | `src/scripts/core/44-prizes.js:29` |
| `pzPillHTML` | функція | `src/scripts/core/44-prizes.js:35` |
| `pzStripHTML` | функція | `src/scripts/core/44-prizes.js:36` |
| `pzBind` | функція | `src/scripts/core/44-prizes.js:47` |
| `pzMonthSaved` | функція | `src/scripts/core/44-prizes.js:53` |
| `pzScreen` | функція | `src/scripts/core/44-prizes.js:58` |
| `pzNewPrize` | функція | `src/scripts/core/44-prizes.js:84` |
| `pzJarSheet` | функція | `src/scripts/core/44-prizes.js:91` |
| `pzAmountSheet` | функція | `src/scripts/core/44-prizes.js:99` |
| `pzDeposit` | функція | `src/scripts/core/44-prizes.js:122` |
| `pzWithdraw` | функція | `src/scripts/core/44-prizes.js:135` |
| `pzCelebrate` | функція | `src/scripts/core/44-prizes.js:151` |

### `src/scripts/core/45-year.js` — 21 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `yrState` | обʼєкт | `src/scripts/core/45-year.js:7` |
| `YR_MX_KEY` | значення | `src/scripts/core/45-year.js:8` |
| `yrMxOpen` | функція | `src/scripts/core/45-year.js:9` |
| `yrSetMxOpen` | функція | `src/scripts/core/45-year.js:10` |
| `yrYear` | функція | `src/scripts/core/45-year.js:11` |
| `yrCurQ` | функція | `src/scripts/core/45-year.js:12` |
| `yrWide` | функція | `src/scripts/core/45-year.js:13` |
| `yrMissions` | функція | `src/scripts/core/45-year.js:14` |
| `yrLv` | функція | `src/scripts/core/45-year.js:22` |
| `yrChip` | функція | `src/scripts/core/45-year.js:23` |
| `yrPrize` | функція | `src/scripts/core/45-year.js:27` |
| `yrKpi` | функція | `src/scripts/core/45-year.js:32` |
| `yrHead` | функція | `src/scripts/core/45-year.js:38` |
| `yrTableHTML` | функція | `src/scripts/core/45-year.js:47` |
| `yrPhoneHTML` | функція | `src/scripts/core/45-year.js:62` |
| `yrHTML` | функція | `src/scripts/core/45-year.js:86` |
| `yrFind` | функція | `src/scripts/core/45-year.js:89` |
| `yrMove` | функція | `src/scripts/core/45-year.js:90` |
| `yrLvMenu` | функція | `src/scripts/core/45-year.js:98` |
| `yrAddLevel` | функція | `src/scripts/core/45-year.js:105` |
| `yrBind` | функція | `src/scripts/core/45-year.js:116` |

### `src/scripts/core/46-wallet.js` — 36 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `wlState` | обʼєкт | `src/scripts/core/46-wallet.js:8` |
| `wlYm` | функція | `src/scripts/core/46-wallet.js:9` |
| `wlMonthOps` | функція | `src/scripts/core/46-wallet.js:10` |
| `wlGoal` | функція | `src/scripts/core/46-wallet.js:11` |
| `wlMissions` | функція | `src/scripts/core/46-wallet.js:12` |
| `wlMoney` | функція | `src/scripts/core/46-wallet.js:13` |
| `wlAgg` | функція | `src/scripts/core/46-wallet.js:14` |
| `wlRing` | функція | `src/scripts/core/46-wallet.js:21` |
| `wlOpRow` | функція | `src/scripts/core/46-wallet.js:22` |
| `wlRender` | функція | `src/scripts/core/46-wallet.js:30` |
| `wlOverviewHTML` | функція | `src/scripts/core/46-wallet.js:47` |
| `wlMissionsHTML` | функція | `src/scripts/core/46-wallet.js:77` |
| `wlFoldersHTML` | функція | `src/scripts/core/46-wallet.js:88` |
| `wlFolderSheet` | функція | `src/scripts/core/46-wallet.js:99` |
| `wlBind` | функція | `src/scripts/core/46-wallet.js:112` |
| `WL_SRC` | обʼєкт | `src/scripts/core/46-wallet.js:134` |
| `wlSrc` | функція | `src/scripts/core/46-wallet.js:135` |
| `wlFolderName` | функція | `src/scripts/core/46-wallet.js:136` |
| `wlOpSheet` | функція | `src/scripts/core/46-wallet.js:138` |
| `wlOpMenu` | функція | `src/scripts/core/46-wallet.js:204` |
| `wlLinkedNote` | функція | `src/scripts/core/46-wallet.js:224` |
| `wlMissionSheet` | функція | `src/scripts/core/46-wallet.js:230` |
| `wlQuestCheck` | функція | `src/scripts/core/46-wallet.js:243` |
| `wlCurList` | функція | `src/scripts/core/46-wallet.js:265` |
| `wlCurSave` | функція | `src/scripts/core/46-wallet.js:270` |
| `curBalance` | функція | `src/scripts/core/46-wallet.js:271` |
| `wlTotalApprox` | функція | `src/scripts/core/46-wallet.js:272` |
| `wlCursHTML` | функція | `src/scripts/core/46-wallet.js:274` |
| `wlCurAdd` | функція | `src/scripts/core/46-wallet.js:279` |
| `wlCurSheet` | функція | `src/scripts/core/46-wallet.js:290` |
| `wlExchange` | функція | `src/scripts/core/46-wallet.js:307` |
| `WL_ENV_TPL` | масив | `src/scripts/core/46-wallet.js:353` |
| `WL_ENV_COLORS` | масив | `src/scripts/core/46-wallet.js:359` |
| `wlSpendEnvs` | функція | `src/scripts/core/46-wallet.js:361` |
| `wlEnvPick` | функція | `src/scripts/core/46-wallet.js:363` |
| `wlEnvStarter` | функція | `src/scripts/core/46-wallet.js:364` |

### `src/scripts/core/47-rules.js` — 29 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `RL` | масив | `src/scripts/core/47-rules.js:8` |
| `rlDef` | функція | `src/scripts/core/47-rules.js:17` |
| `rlCfg` | функція | `src/scripts/core/47-rules.js:18` |
| `rlOn` | функція | `src/scripts/core/47-rules.js:20` |
| `rlN` | функція | `src/scripts/core/47-rules.js:21` |
| `rlUnit` | функція | `src/scripts/core/47-rules.js:22` |
| `rlFlow` | функція | `src/scripts/core/47-rules.js:23` |
| `rlMark` | функція | `src/scripts/core/47-rules.js:25` |
| `rlDiscipline` | функція | `src/scripts/core/47-rules.js:32` |
| `rlOffer` | функція | `src/scripts/core/47-rules.js:38` |
| `rlOnBlockDone` | функція | `src/scripts/core/47-rules.js:51` |
| `rlOnOp` | функція | `src/scripts/core/47-rules.js:88` |
| `rlSalarySheet` | функція | `src/scripts/core/47-rules.js:114` |
| `rlEasyCand` | функція | `src/scripts/core/47-rules.js:147` |
| `rlJournalHTML` | функція | `src/scripts/core/47-rules.js:165` |
| `rlJournalBind` | функція | `src/scripts/core/47-rules.js:175` |
| `rlBook` | функція | `src/scripts/core/47-rules.js:192` |
| `rlSalaryTpl` | функція | `src/scripts/core/47-rules.js:224` |
| `rlPlan` | функція | `src/scripts/core/47-rules.js:248` |
| `rlRowCur` | функція | `src/scripts/core/47-rules.js:257` |
| `rlPlanFact` | функція | `src/scripts/core/47-rules.js:258` |
| `rlPrevYm` | функція | `src/scripts/core/47-rules.js:259` |
| `rlRecurring` | функція | `src/scripts/core/47-rules.js:261` |
| `rlForecast` | функція | `src/scripts/core/47-rules.js:262` |
| `rlPlanOpen` | функція | `src/scripts/core/47-rules.js:271` |
| `rlPlanHTML` | функція | `src/scripts/core/47-rules.js:276` |
| `rlPlanBind` | функція | `src/scripts/core/47-rules.js:296` |
| `rlPlanEdit` | функція | `src/scripts/core/47-rules.js:305` |
| `rlPlanRowMenu` | функція | `src/scripts/core/47-rules.js:326` |

### `src/scripts/core/48-hero.js` — 36 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `HERO_CROP` | обʼєкт | `src/scripts/core/48-hero.js:20` |
| `HERO_CHEST` | обʼєкт | `src/scripts/core/48-hero.js:22` |
| `HERO_MOOD_NAME` | масив | `src/scripts/core/48-hero.js:23` |
| `HERO_OUTFITS` | масив | `src/scripts/core/48-hero.js:24` |
| `HERO_FONTS` | обʼєкт | `src/scripts/core/48-hero.js:25` |
| `HERO_COLORS` | масив | `src/scripts/core/48-hero.js:31` |
| `HERO_TECH` | обʼєкт | `src/scripts/core/48-hero.js:32` |
| `HERO_LOOK_DEF` | обʼєкт | `src/scripts/core/48-hero.js:33` |
| `HERO_ICON` | обʼєкт | `src/scripts/core/48-hero.js:37` |
| `HERO_NEED` | обʼєкт | `src/scripts/core/48-hero.js:47` |
| `HERO_PATCHES` | обʼєкт | `src/scripts/core/48-hero.js:52` |
| `HERO_TATS` | обʼєкт | `src/scripts/core/48-hero.js:62` |
| `HERO_PATCH_AT` | обʼєкт | `src/scripts/core/48-hero.js:67` |
| `HERO_TAT_AT` | обʼєкт | `src/scripts/core/48-hero.js:68` |
| `heroLoading` | значення | `src/scripts/core/48-hero.js:69` |
| `heroOf` | функція | `src/scripts/core/48-hero.js:71` |
| `heroReady` | функція | `src/scripts/core/48-hero.js:72` |
| `heroLookAll` | функція | `src/scripts/core/48-hero.js:76` |
| `heroLookNorm` | функція | `src/scripts/core/48-hero.js:79` |
| `heroLook` | функція | `src/scripts/core/48-hero.js:91` |
| `heroRerender` | функція | `src/scripts/core/48-hero.js:93` |
| `heroLoad` | функція | `src/scripts/core/48-hero.js:100` |
| `heroOutfitsLoad` | функція | `src/scripts/core/48-hero.js:117` |
| `heroMood` | функція | `src/scripts/core/48-hero.js:128` |
| `heroChestLines` | функція | `src/scripts/core/48-hero.js:148` |
| `heroChestText` | функція | `src/scripts/core/48-hero.js:155` |
| `heroUnlocks` | функція | `src/scripts/core/48-hero.js:174` |
| `heroItemOpen` | функція | `src/scripts/core/48-hero.js:182` |
| `heroPatchSVG` | функція | `src/scripts/core/48-hero.js:183` |
| `heroTatSVG` | функція | `src/scripts/core/48-hero.js:191` |
| `heroSVG` | функція | `src/scripts/core/48-hero.js:200` |
| `heroWard` | значення | `src/scripts/core/48-hero.js:236` |
| `heroWardRedraw` | функція | `src/scripts/core/48-hero.js:237` |
| `heroWardSave` | функція | `src/scripts/core/48-hero.js:248` |
| `heroWardItem` | функція | `src/scripts/core/48-hero.js:260` |
| `heroWardrobe` | функція | `src/scripts/core/48-hero.js:268` |

### `src/scripts/core/48-widgets.js` — 20 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `WG_TYPES` | обʼєкт | `src/scripts/core/48-widgets.js:9` |
| `wgIs` | функція | `src/scripts/core/48-widgets.js:10` |
| `wgCtxFolder` | функція | `src/scripts/core/48-widgets.js:12` |
| `wgFolderMission` | функція | `src/scripts/core/48-widgets.js:13` |
| `wgMoney` | функція | `src/scripts/core/48-widgets.js:14` |
| `wgK` | функція | `src/scripts/core/48-widgets.js:15` |
| `wgDebtNet` | функція | `src/scripts/core/48-widgets.js:16` |
| `wgApply` | функція | `src/scripts/core/48-widgets.js:19` |
| `wgTile` | функція | `src/scripts/core/48-widgets.js:32` |
| `wgHTML` | функція | `src/scripts/core/48-widgets.js:33` |
| `wgAct` | функція | `src/scripts/core/48-widgets.js:101` |
| `wgFill` | функція | `src/scripts/core/48-widgets.js:121` |
| `wgFillPage` | функція | `src/scripts/core/48-widgets.js:128` |
| `wgWalletHTML` | функція | `src/scripts/core/48-widgets.js:133` |
| `wgHome` | функція | `src/scripts/core/48-widgets.js:135` |
| `wgRefresh` | функція | `src/scripts/core/48-widgets.js:137` |
| `wgMoneyCfg` | функція | `src/scripts/core/48-widgets.js:140` |
| `WG_OLD` | обʼєкт | `src/scripts/core/48-widgets.js:171` |
| `wgOldScan` | функція | `src/scripts/core/48-widgets.js:172` |
| `wgOldCleanup` | функція | `src/scripts/core/48-widgets.js:179` |

### `src/scripts/core/49-finlit.js` — 17 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `flCushionEnv` | функція | `src/scripts/core/49-finlit.js:18` |
| `flMonthAgg` | функція | `src/scripts/core/49-finlit.js:19` |
| `flPrevYm` | функція | `src/scripts/core/49-finlit.js:20` |
| `flSavedIn` | функція | `src/scripts/core/49-finlit.js:22` |
| `flAvgSpend` | функція | `src/scripts/core/49-finlit.js:25` |
| `flOnIncome` | функція | `src/scripts/core/49-finlit.js:28` |
| `flH24` | функція | `src/scripts/core/49-finlit.js:49` |
| `flReviewHTML` | функція | `src/scripts/core/49-finlit.js:67` |
| `flReviewBind` | функція | `src/scripts/core/49-finlit.js:79` |
| `FL_NEEDS` | значення | `src/scripts/core/49-finlit.js:84` |
| `FL_SAVE` | значення | `src/scripts/core/49-finlit.js:85` |
| `fl503020` | функція | `src/scripts/core/49-finlit.js:86` |
| `flApply503020` | функція | `src/scripts/core/49-finlit.js:95` |
| `FL_LESSONS` | масив | `src/scripts/core/49-finlit.js:101` |
| `flCushionHTML` | функція | `src/scripts/core/49-finlit.js:109` |
| `flSchoolHTML` | функція | `src/scripts/core/49-finlit.js:117` |
| `flSchoolBind` | функція | `src/scripts/core/49-finlit.js:122` |

### `src/scripts/core/50-quickadd.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `qaNum` | функція | `src/scripts/core/50-quickadd.js:11` |
| `qaParse` | функція | `src/scripts/core/50-quickadd.js:18` |
| `qaClearUrl` | функція | `src/scripts/core/50-quickadd.js:26` |
| `qaRun` | функція | `src/scripts/core/50-quickadd.js:30` |
| `qaGuide` | функція | `src/scripts/core/50-quickadd.js:50` |

### `src/scripts/core/51-money-reset.js` — 7 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `wkMoneyInfo` | функція | `src/scripts/core/51-money-reset.js:11` |
| `wkExpectedMain` | функція | `src/scripts/core/51-money-reset.js:28` |
| `wkPlanRowHTML` | функція | `src/scripts/core/51-money-reset.js:35` |
| `wkPlanBind` | функція | `src/scripts/core/51-money-reset.js:40` |
| `finResetScan` | функція | `src/scripts/core/51-money-reset.js:43` |
| `finResetReady` | функція | `src/scripts/core/51-money-reset.js:50` |
| `finResetAll` | функція | `src/scripts/core/51-money-reset.js:55` |

### `src/scripts/page-editor/01-palette.js` — 17 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PGS_CATS` | масив | `src/scripts/page-editor/01-palette.js:5` |
| `CATALOG` | масив | `src/scripts/page-editor/01-palette.js:13` |
| `PGS_SYN` | обʼєкт | `src/scripts/page-editor/01-palette.js:53` |
| `PGS_ICONS` | обʼєкт | `src/scripts/page-editor/01-palette.js:83` |
| `pgsIc` | функція | `src/scripts/page-editor/01-palette.js:136` |
| `bridge` | функція | `src/scripts/page-editor/01-palette.js:138` |
| `editor` | значення | `src/scripts/page-editor/01-palette.js:139` |
| `scr` | значення | `src/scripts/page-editor/01-palette.js:140` |
| `uid` | функція | `src/scripts/page-editor/01-palette.js:141` |
| `esc` | функція | `src/scripts/page-editor/01-palette.js:142` |
| `txtOf` | функція | `src/scripts/page-editor/01-palette.js:145` |
| `setTxt` | функція | `src/scripts/page-editor/01-palette.js:146` |
| `locate` | функція | `src/scripts/page-editor/01-palette.js:148` |
| `save` | функція | `src/scripts/page-editor/01-palette.js:156` |
| `moveBlock` | функція | `src/scripts/page-editor/01-palette.js:160` |
| `snapshotArr` | функція | `src/scripts/page-editor/01-palette.js:182` |
| `restoreArr` | функція | `src/scripts/page-editor/01-palette.js:183` |

### `src/scripts/page-editor/02-block-styles.js` — 49 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `equalizeWidths` | функція | `src/scripts/page-editor/02-block-styles.js:1` |
| `PGH_FONTS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:4` |
| `PGH_CLR_VAR` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:8` |
| `headingClr` | функція | `src/scripts/page-editor/02-block-styles.js:9` |
| `headingStyle` | функція | `src/scripts/page-editor/02-block-styles.js:14` |
| `pgShowHidden` | значення | `src/scripts/page-editor/02-block-styles.js:26` |
| `pbarAutoValue` | функція | `src/scripts/page-editor/02-block-styles.js:27` |
| `condMet` | функція | `src/scripts/page-editor/02-block-styles.js:32` |
| `moveBlockSide` | функція | `src/scripts/page-editor/02-block-styles.js:57` |
| `undoMove` | функція | `src/scripts/page-editor/02-block-styles.js:92` |
| `redoMove` | функція | `src/scripts/page-editor/02-block-styles.js:97` |
| `undoStack` | масив | `src/scripts/page-editor/02-block-styles.js:104` |
| `pushOp` | функція | `src/scripts/page-editor/02-block-styles.js:105` |
| `doUndo` | функція | `src/scripts/page-editor/02-block-styles.js:110` |
| `doRedo` | функція | `src/scripts/page-editor/02-block-styles.js:111` |
| `syncUndoBtn` | функція | `src/scripts/page-editor/02-block-styles.js:112` |
| `STATUS_COLORS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:122` |
| `STATUS_ORDER` | масив | `src/scripts/page-editor/02-block-styles.js:123` |
| `dbColType` | функція | `src/scripts/page-editor/02-block-styles.js:124` |
| `dbFmtNum` | функція | `src/scripts/page-editor/02-block-styles.js:125` |
| `inner` | функція | `src/scripts/page-editor/02-block-styles.js:127` |
| `dbEnsure` | функція | `src/scripts/page-editor/02-block-styles.js:426` |
| `dbHTML` | функція | `src/scripts/page-editor/02-block-styles.js:443` |
| `pgSgBusy` | значення | `src/scripts/page-editor/02-block-styles.js:493` |
| `pgSgPlace` | функція | `src/scripts/page-editor/02-block-styles.js:494` |
| `PGLAST` | значення | `src/scripts/page-editor/02-block-styles.js:502` |
| `pgLastGet` | функція | `src/scripts/page-editor/02-block-styles.js:503` |
| `pgLastSet` | функція | `src/scripts/page-editor/02-block-styles.js:504` |
| `PGRECENT` | значення | `src/scripts/page-editor/02-block-styles.js:506` |
| `pgRecentGet` | функція | `src/scripts/page-editor/02-block-styles.js:507` |
| `pgRecentAdd` | функція | `src/scripts/page-editor/02-block-styles.js:508` |
| `renderList` | функція | `src/scripts/page-editor/02-block-styles.js:509` |
| `renderBoardBlock` | функція | `src/scripts/page-editor/02-block-styles.js:528` |
| `renderRowBlock` | функція | `src/scripts/page-editor/02-block-styles.js:547` |
| `renumber` | функція | `src/scripts/page-editor/02-block-styles.js:564` |
| `pgPath` | масив | `src/scripts/page-editor/02-block-styles.js:566` |
| `pgResolve` | функція | `src/scripts/page-editor/02-block-styles.js:567` |
| `pgHeaStrip` | функція | `src/scripts/page-editor/02-block-styles.js:577` |
| `render` | функція | `src/scripts/page-editor/02-block-styles.js:593` |
| `fillWidgetHosts` | функція | `src/scripts/page-editor/02-block-styles.js:651` |
| `window.__pgWidgetsSync` | функція | `src/scripts/page-editor/02-block-styles.js:663` |
| `caretEnd` | функція | `src/scripts/page-editor/02-block-styles.js:669` |
| `slashCtx` | значення | `src/scripts/page-editor/02-block-styles.js:672` |
| `slash` | значення | `src/scripts/page-editor/02-block-styles.js:765` |
| `srail` | значення | `src/scripts/page-editor/02-block-styles.js:767` |
| `pgsCat` | значення | `src/scripts/page-editor/02-block-styles.js:768` |
| `pgsFiltered` | функція | `src/scripts/page-editor/02-block-styles.js:769` |
| `buildRail` | функція | `src/scripts/page-editor/02-block-styles.js:779` |
| `buildSlash` | функція | `src/scripts/page-editor/02-block-styles.js:788` |

### `src/scripts/page-editor/03-premium-pack.js` — 34 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `pgAsk` | функція | `src/scripts/page-editor/03-premium-pack.js:15` |
| `openCondSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:30` |
| `openHeadingStyleSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:83` |
| `unanchorSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:156` |
| `positionSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:161` |
| `pgMenuTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:185` |
| `openSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:186` |
| `pgAddPending` | значення | `src/scripts/page-editor/03-premium-pack.js:195` |
| `dropPendingAdd` | функція | `src/scripts/page-editor/03-premium-pack.js:196` |
| `closeSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:203` |
| `applySlash` | функція | `src/scripts/page-editor/03-premium-pack.js:205` |
| `drag` | значення | `src/scripts/page-editor/03-premium-pack.js:334` |
| `dstart` | функція | `src/scripts/page-editor/03-premium-pack.js:337` |
| `ghostMake` | функція | `src/scripts/page-editor/03-premium-pack.js:347` |
| `ghostMove` | функція | `src/scripts/page-editor/03-premium-pack.js:356` |
| `ghostKill` | функція | `src/scripts/page-editor/03-premium-pack.js:357` |
| `clearMarks` | функція | `src/scripts/page-editor/03-premium-pack.js:358` |
| `dmove` | функція | `src/scripts/page-editor/03-premium-pack.js:359` |
| `dend` | функція | `src/scripts/page-editor/03-premium-pack.js:381` |
| `cancelDrag` | функція | `src/scripts/page-editor/03-premium-pack.js:393` |
| `bmenu` | значення | `src/scripts/page-editor/03-premium-pack.js:472` |
| `openBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:473` |
| `closeBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:510` |
| `THKEY` | значення | `src/scripts/page-editor/03-premium-pack.js:556` |
| `applyTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:557` |
| `pageThemeDefault` | функція | `src/scripts/page-editor/03-premium-pack.js:560` |
| `window.__pgThemeAuto` | функція | `src/scripts/page-editor/03-premium-pack.js:571` |
| `window.__pgThemeIsAuto` | функція | `src/scripts/page-editor/03-premium-pack.js:572` |
| `pgTitle` | значення | `src/scripts/page-editor/03-premium-pack.js:586` |
| `pgTitleCommit` | функція | `src/scripts/page-editor/03-premium-pack.js:589` |
| `addBtn` | значення | `src/scripts/page-editor/03-premium-pack.js:608` |
| `CD_MONTHS` | масив | `src/scripts/page-editor/03-premium-pack.js:617` |
| `cdFmt` | функція | `src/scripts/page-editor/03-premium-pack.js:618` |
| `cdHTML` | функція | `src/scripts/page-editor/03-premium-pack.js:623` |

### `src/scripts/page-editor/04-w-journal.js` — 9 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `JR_WD` | масив | `src/scripts/page-editor/04-w-journal.js:2` |
| `JR_MON` | масив | `src/scripts/page-editor/04-w-journal.js:3` |
| `jrOpen` | обʼєкт | `src/scripts/page-editor/04-w-journal.js:4` |
| `jrEdit` | обʼєкт | `src/scripts/page-editor/04-w-journal.js:5` |
| `jrYmd` | функція | `src/scripts/page-editor/04-w-journal.js:6` |
| `jrParse` | функція | `src/scripts/page-editor/04-w-journal.js:7` |
| `jrStreak` | функція | `src/scripts/page-editor/04-w-journal.js:8` |
| `jrHTML` | функція | `src/scripts/page-editor/04-w-journal.js:14` |
| `jrTdAdd` | обʼєкт | `src/scripts/page-editor/04-w-journal.js:107` |

### `src/scripts/page-editor/05-w-decisions.js` — 4 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `dlNew` | обʼєкт | `src/scripts/page-editor/05-w-decisions.js:2` |
| `dlDaysLeft` | функція | `src/scripts/page-editor/05-w-decisions.js:3` |
| `dlHTML` | функція | `src/scripts/page-editor/05-w-decisions.js:7` |
| `dlExport` | функція | `src/scripts/page-editor/05-w-decisions.js:89` |

### `src/scripts/page-editor/06-w-project.js` — 6 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `ptStepAdd` | обʼєкт | `src/scripts/page-editor/06-w-project.js:2` |
| `PT_WD` | масив | `src/scripts/page-editor/06-w-project.js:3` |
| `ptWeekDays` | функція | `src/scripts/page-editor/06-w-project.js:4` |
| `ptHabStreak` | функція | `src/scripts/page-editor/06-w-project.js:8` |
| `ptProgress` | функція | `src/scripts/page-editor/06-w-project.js:11` |
| `ptHTML` | функція | `src/scripts/page-editor/06-w-project.js:19` |

### `src/scripts/page-editor/07-w-habits.js` — 4 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `hbAdd` | обʼєкт | `src/scripts/page-editor/07-w-habits.js:2` |
| `HB_COLORS` | масив | `src/scripts/page-editor/07-w-habits.js:3` |
| `hbHTML` | функція | `src/scripts/page-editor/07-w-habits.js:4` |
| `hbExport` | функція | `src/scripts/page-editor/07-w-habits.js:52` |

### `src/scripts/page-editor/08-w-projects-hub.js` — 44 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `phOpen` | обʼєкт | `src/scripts/page-editor/08-w-projects-hub.js:2` |
| `pgDelUndo` | функція | `src/scripts/page-editor/08-w-projects-hub.js:6` |
| `PH_COLORS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:22` |
| `phHTML` | функція | `src/scripts/page-editor/08-w-projects-hub.js:23` |
| `phExport` | функція | `src/scripts/page-editor/08-w-projects-hub.js:102` |
| `pgFileIc` | функція | `src/scripts/page-editor/08-w-projects-hub.js:120` |
| `currentPtKey` | функція | `src/scripts/page-editor/08-w-projects-hub.js:128` |
| `ptExport` | функція | `src/scripts/page-editor/08-w-projects-hub.js:129` |
| `jrExport` | функція | `src/scripts/page-editor/08-w-projects-hub.js:150` |
| `cdTick` | функція | `src/scripts/page-editor/08-w-projects-hub.js:176` |
| `CAL_MONTHS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:204` |
| `calWrap` | значення | `src/scripts/page-editor/08-w-projects-hub.js:205` |
| `calId` | значення | `src/scripts/page-editor/08-w-projects-hub.js:216` |
| `calYmd` | функція | `src/scripts/page-editor/08-w-projects-hub.js:217` |
| `openCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:218` |
| `closeCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:226` |
| `buildCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:227` |
| `pgPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:655` |
| `PGPH_SIZES` | масив | `src/scripts/page-editor/08-w-projects-hub.js:680` |
| `pgSzBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:681` |
| `pgSzBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:682` |
| `pgSzSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:710` |
| `pgSzClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:717` |
| `pgPhotoSizeSheet` | функція | `src/scripts/page-editor/08-w-projects-hub.js:718` |
| `pgPhotoMenu` | функція | `src/scripts/page-editor/08-w-projects-hub.js:721` |
| `pgRz` | значення | `src/scripts/page-editor/08-w-projects-hub.js:742` |
| `COVKEY` | значення | `src/scripts/page-editor/08-w-projects-hub.js:764` |
| `covers` | обʼєкт | `src/scripts/page-editor/08-w-projects-hub.js:765` |
| `covSaveT` | значення | `src/scripts/page-editor/08-w-projects-hub.js:773` |
| `saveCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:774` |
| `saveCoversSoon` | функція | `src/scripts/page-editor/08-w-projects-hub.js:783` |
| `flushCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:787` |
| `COV_GRADS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:797` |
| `covEl` | значення | `src/scripts/page-editor/08-w-projects-hub.js:803` |
| `covKey` | функція | `src/scripts/page-editor/08-w-projects-hub.js:818` |
| `covMenuHTML` | функція | `src/scripts/page-editor/08-w-projects-hub.js:819` |
| `renderCover` | функція | `src/scripts/page-editor/08-w-projects-hub.js:826` |
| `covPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:856` |
| `covEdBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:897` |
| `covEdState` | функція | `src/scripts/page-editor/08-w-projects-hub.js:898` |
| `covEdSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:904` |
| `covEdBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:917` |
| `covEdOpen` | функція | `src/scripts/page-editor/08-w-projects-hub.js:971` |
| `covEdClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:972` |

### `src/scripts/page-editor/09-journal-sheet.js` — 37 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `JE_Q` | масив | `src/scripts/page-editor/09-journal-sheet.js:11` |
| `jeQ` | функція | `src/scripts/page-editor/09-journal-sheet.js:20` |
| `JE_TAGS` | масив | `src/scripts/page-editor/09-journal-sheet.js:21` |
| `JE_MONN` | масив | `src/scripts/page-editor/09-journal-sheet.js:23` |
| `jeText` | функція | `src/scripts/page-editor/09-journal-sheet.js:27` |
| `jeRich` | функція | `src/scripts/page-editor/09-journal-sheet.js:40` |
| `jeWords` | функція | `src/scripts/page-editor/09-journal-sheet.js:47` |
| `jeIsoWeek` | функція | `src/scripts/page-editor/09-journal-sheet.js:48` |
| `jeCur` | значення | `src/scripts/page-editor/09-journal-sheet.js:56` |
| `jeSaveT` | значення | `src/scripts/page-editor/09-journal-sheet.js:57` |
| `jeOpen` | функція | `src/scripts/page-editor/09-journal-sheet.js:59` |
| `jeClose` | функція | `src/scripts/page-editor/09-journal-sheet.js:75` |
| `jeShell` | функція | `src/scripts/page-editor/09-journal-sheet.js:82` |
| `jeViewport` | функція | `src/scripts/page-editor/09-journal-sheet.js:138` |
| `jeFlush` | функція | `src/scripts/page-editor/09-journal-sheet.js:148` |
| `jeQueue` | функція | `src/scripts/page-editor/09-journal-sheet.js:160` |
| `jeWrap` | функція | `src/scripts/page-editor/09-journal-sheet.js:163` |
| `jeCheck` | функція | `src/scripts/page-editor/09-journal-sheet.js:172` |
| `jeMonthHTML` | функція | `src/scripts/page-editor/09-journal-sheet.js:181` |
| `jeMon` | функція | `src/scripts/page-editor/09-journal-sheet.js:208` |
| `jeWkKey` | функція | `src/scripts/page-editor/09-journal-sheet.js:209` |
| `jeMoKey` | функція | `src/scripts/page-editor/09-journal-sheet.js:210` |
| `jeEntries` | функція | `src/scripts/page-editor/09-journal-sheet.js:211` |
| `jeG` | функція | `src/scripts/page-editor/09-journal-sheet.js:224` |
| `jeAiOff` | функція | `src/scripts/page-editor/09-journal-sheet.js:226` |
| `jeFacts` | функція | `src/scripts/page-editor/09-journal-sheet.js:227` |
| `jePending` | функція | `src/scripts/page-editor/09-journal-sheet.js:245` |
| `JE_SYS_W` | значення | `src/scripts/page-editor/09-journal-sheet.js:264` |
| `JE_SYS_M` | значення | `src/scripts/page-editor/09-journal-sheet.js:270` |
| `jeBusy` | значення | `src/scripts/page-editor/09-journal-sheet.js:275` |
| `jeGen` | функція | `src/scripts/page-editor/09-journal-sheet.js:279` |
| `jeAuto` | функція | `src/scripts/page-editor/09-journal-sheet.js:322` |
| `jeMd` | функція | `src/scripts/page-editor/09-journal-sheet.js:331` |
| `jeAiHTML` | функція | `src/scripts/page-editor/09-journal-sheet.js:337` |
| `jeRec` | значення | `src/scripts/page-editor/09-journal-sheet.js:422` |
| `jeMic` | функція | `src/scripts/page-editor/09-journal-sheet.js:423` |
| `window.openFlowPage` | функція | `src/scripts/page-editor/09-journal-sheet.js:461` |

### `src/scripts/page-editor/10-mic.js` — 10 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `btn` | значення | `src/scripts/page-editor/10-mic.js:15` |
| `lastEl` | значення | `src/scripts/page-editor/10-mic.js:16` |
| `lastRange` | значення | `src/scripts/page-editor/10-mic.js:17` |
| `toast` | функція | `src/scripts/page-editor/10-mic.js:19` |
| `setLive` | функція | `src/scripts/page-editor/10-mic.js:41` |
| `insert` | функція | `src/scripts/page-editor/10-mic.js:48` |
| `start` | функція | `src/scripts/page-editor/10-mic.js:81` |
| `stop` | функція | `src/scripts/page-editor/10-mic.js:131` |
| `toggle` | функція | `src/scripts/page-editor/10-mic.js:140` |
| `wire` | функція | `src/scripts/page-editor/10-mic.js:142` |

### `src/web/sw.js` — 9 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `VERSION` | значення | `src/web/sw.js:9` |
| `CACHE` | значення | `src/web/sw.js:10` |
| `INDEX` | значення | `src/web/sw.js:13` |
| `PRECACHE` | масив | `src/web/sw.js:14` |
| `NAV_WAIT` | значення | `src/web/sw.js:22` |
| `NAV_ABORT` | значення | `src/web/sw.js:23` |
| `stamp` | функція | `src/web/sw.js:42` |
| `keepIndex` | функція | `src/web/sw.js:47` |
| `navigate` | функція | `src/web/sw.js:54` |

### `tools/make-icon.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `fs` | значення | `tools/make-icon.js:4` |
| `path` | значення | `tools/make-icon.js:5` |
| `SIZE` | значення | `tools/make-icon.js:7` |
| `OUT` | значення | `tools/make-icon.js:8` |
| `HTML` | значення | `tools/make-icon.js:11` |

### `tools/scriptcheck.js` — 12 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `fs` | значення | `tools/scriptcheck.js:13` |
| `ROOT` | значення | `tools/scriptcheck.js:15` |
| `file` | значення | `tools/scriptcheck.js:16` |
| `html` | значення | `tools/scriptcheck.js:17` |
| `rel` | значення | `tools/scriptcheck.js:18` |
| `scripts` | функція | `tools/scriptcheck.js:22` |
| `srcFiles` | функція | `tools/scriptcheck.js:43` |
| `hint` | функція | `tools/scriptcheck.js:52` |
| `lines` | значення | `tools/scriptcheck.js:59` |
| `ctx` | значення | `tools/scriptcheck.js:60` |
| `blocks` | значення | `tools/scriptcheck.js:66` |
| `bad` | значення | `tools/scriptcheck.js:67` |

### `tools/smoke.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `path` | значення | `tools/smoke.js:7` |
| `target` | функція | `tools/smoke.js:9` |
| `SCREENS` | масив | `tools/smoke.js:11` |
| `NOISE` | значення | `tools/smoke.js:14` |
| `errors` | масив | `tools/smoke.js:15` |

### `tools/test-migrations.js` — 34 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `fs` | значення | `tools/test-migrations.js:22` |
| `os` | значення | `tools/test-migrations.js:23` |
| `path` | значення | `tools/test-migrations.js:24` |
| `target` | функція | `tools/test-migrations.js:27` |
| `SB_TOKEN_KEY` | значення | `tools/test-migrations.js:30` |
| `FLAGS` | масив | `tools/test-migrations.js:32` |
| `WAIT` | значення | `tools/test-migrations.js:35` |
| `T0` | значення | `tools/test-migrations.js:37` |
| `PNG` | значення | `tools/test-migrations.js:38` |
| `W` | функція | `tools/test-migrations.js:40` |
| `LEGACY` | обʼєкт | `tools/test-migrations.js:42` |
| `POSTMIG` | значення | `tools/test-migrations.js:78` |
| `fakeSession` | функція | `tools/test-migrations.js:94` |
| `problems` | масив | `tools/test-migrations.js:102` |
| `bad` | функція | `tools/test-migrations.js:103` |
| `sleep` | функція | `tools/test-migrations.js:104` |
| `errors` | масив | `tools/test-migrations.js:105` |
| `blank` | значення | `tools/test-migrations.js:113` |
| `makeWin` | функція | `tools/test-migrations.js:116` |
| `seed` | функція | `tools/test-migrations.js:129` |
| `start` | функція | `tools/test-migrations.js:133` |
| `snap` | функція | `tools/test-migrations.js:134` |
| `js` | функція | `tools/test-migrations.js:136` |
| `diff` | функція | `tools/test-migrations.js:137` |
| `isStore` | функція | `tools/test-migrations.js:147` |
| `dataOf` | функція | `tools/test-migrations.js:148` |
| `scenarioA` | функція | `tools/test-migrations.js:150` |
| `scenarioP` | функція | `tools/test-migrations.js:216` |
| `NP` | обʼєкт | `tools/test-migrations.js:257` |
| `nativePreload` | значення | `tools/test-migrations.js:266` |
| `call` | функція | `tools/test-migrations.js:268` |
| `MARK` | значення | `tools/test-migrations.js:272` |
| `scenarioN` | функція | `tools/test-migrations.js:274` |
| `scenarioSilent` | функція | `tools/test-migrations.js:318` |

### `worker/flow-ai-worker.js` — 20 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MODEL_ALIAS` | обʼєкт | `worker/flow-ai-worker.js:21` |
| `MODELS` | обʼєкт | `worker/flow-ai-worker.js:30` |
| `MODEL_DEFAULT` | значення | `worker/flow-ai-worker.js:39` |
| `EFFORTS` | масив | `worker/flow-ai-worker.js:41` |
| `OPUS_MODELS` | масив | `worker/flow-ai-worker.js:47` |
| `MAX_TOKENS_CAP` | значення | `worker/flow-ai-worker.js:52` |
| `ORIGINS_DEFAULT` | масив | `worker/flow-ai-worker.js:74` |
| `originAllowed` | функція | `worker/flow-ai-worker.js:82` |
| `RATE_WINDOW_MS` | значення | `worker/flow-ai-worker.js:100` |
| `RATE_PER_MIN_DEFAULT` | значення | `worker/flow-ai-worker.js:101` |
| `rateHits` | обʼєкт | `worker/flow-ai-worker.js:102` |
| `rateWait` | функція | `worker/flow-ai-worker.js:104` |
| `AUTH_TTL_MS` | значення | `worker/flow-ai-worker.js:127` |
| `authSeen` | обʼєкт | `worker/flow-ai-worker.js:128` |
| `authProblem` | функція | `worker/flow-ai-worker.js:130` |
| `EL11_VOICE_DEFAULT` | значення | `worker/flow-ai-worker.js:164` |
| `TTS_VOICES` | масив | `worker/flow-ai-worker.js:166` |
| `UPSTREAM_TIMEOUT_MS` | значення | `worker/flow-ai-worker.js:170` |
| `base64FromBytes` | функція | `worker/flow-ai-worker.js:569` |
| `xmlEsc` | функція | `worker/flow-ai-worker.js:578` |

### `worker/test-worker.mjs` — 11 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `file` | значення | `worker/test-worker.mjs:8` |
| `worker` | значення | `worker/test-worker.mjs:9` |
| `sent` | масив | `worker/test-worker.mjs:11` |
| `toAnthropic` | функція | `worker/test-worker.mjs:22` |
| `lastPayload` | функція | `worker/test-worker.mjs:23` |
| `GH` | значення | `worker/test-worker.mjs:25` |
| `ipN` | значення | `worker/test-worker.mjs:26` |
| `call` | функція | `worker/test-worker.mjs:27` |
| `msgs` | масив | `worker/test-worker.mjs:35` |
| `fails` | значення | `worker/test-worker.mjs:37` |
| `check` | функція | `worker/test-worker.mjs:38` |
