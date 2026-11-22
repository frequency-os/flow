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
| Файлів JS | 105 |
| Рядків JS | 39679 |
| Файлів CSS | 56 |
| Рядків CSS | 12407 |
| Сутностей верхнього рівня | 3105 |
| Ключів сховища (FLOW_KEYS) | 84 |

## Файли JS

| Файл | Рядків | Сутностей |
|---|---|---|
| `desktop/main.js` | 258 | 14 |
| `desktop/preload.js` | 24 | 0 |
| `src/scripts/01-crash-screen.js` | 111 | 14 |
| `src/scripts/03-quota-banner.js` | 14 | 2 |
| `src/scripts/21-newyear-countdown.js` | 152 | 14 |
| `src/scripts/40-pets-3d.js` | 297 | 0 |
| `src/scripts/41-theme-layer.js` | 153 | 0 |
| `src/scripts/42-voice-island.js` | 855 | 0 |
| `src/scripts/43-planner.js` | 137 | 0 |
| `src/scripts/45-month.js` | 662 | 0 |
| `src/scripts/46-mx.js` | 220 | 0 |
| `src/scripts/core/01-base.js` | 442 | 39 |
| `src/scripts/core/02-storage.js` | 2173 | 177 |
| `src/scripts/core/03-platform.js` | 61 | 14 |
| `src/scripts/core/04-folders-nav.js` | 449 | 63 |
| `src/scripts/core/05-spaces.js` | 700 | 58 |
| `src/scripts/core/06-wishes.js` | 1508 | 115 |
| `src/scripts/core/07-values.js` | 21 | 4 |
| `src/scripts/core/08-finance.js` | 655 | 84 |
| `src/scripts/core/09-goals.js` | 734 | 31 |
| `src/scripts/core/10-planner.js` | 881 | 43 |
| `src/scripts/core/11-ai-flow.js` | 336 | 36 |
| `src/scripts/core/12-ai-agent.js` | 1860 | 98 |
| `src/scripts/core/13-pets.js` | 226 | 14 |
| `src/scripts/core/14-react.js` | 338 | 43 |
| `src/scripts/core/15-flow-spot.js` | 1697 | 89 |
| `src/scripts/core/16-dashboard.js` | 1513 | 83 |
| `src/scripts/core/17-folder-render.js` | 16 | 2 |
| `src/scripts/core/18-debts.js` | 248 | 19 |
| `src/scripts/core/19-spending.js` | 136 | 14 |
| `src/scripts/core/20-work.js` | 525 | 51 |
| `src/scripts/core/21-patterns.js` | 34 | 6 |
| `src/scripts/core/22-diary.js` | 589 | 62 |
| `src/scripts/core/23-board.js` | 295 | 29 |
| `src/scripts/core/24-reminders.js` | 181 | 16 |
| `src/scripts/core/25-reader.js` | 566 | 40 |
| `src/scripts/core/26-blocks-render.js` | 1207 | 16 |
| `src/scripts/core/27-canvas.js` | 606 | 28 |
| `src/scripts/core/28-vision.js` | 36 | 3 |
| `src/scripts/core/29-more-screen.js` | 629 | 30 |
| `src/scripts/core/30-upgrade.js` | 303 | 30 |
| `src/scripts/core/31-my-year.js` | 200 | 21 |
| `src/scripts/core/32-global-search.js` | 152 | 13 |
| `src/scripts/core/34-shortcuts.js` | 54 | 5 |
| `src/scripts/core/35-channel.js` | 709 | 65 |
| `src/scripts/core/36-chats.js` | 1298 | 149 |
| `src/scripts/core/37-ai-privacy.js` | 202 | 20 |
| `src/scripts/core/38-world.js` | 107 | 5 |
| `src/scripts/core/39-spheres.js` | 233 | 20 |
| `src/scripts/core/40-year-letter.js` | 294 | 30 |
| `src/scripts/core/41-journal.js` | 823 | 71 |
| `src/scripts/core/42-day.js` | 363 | 41 |
| `src/scripts/core/43-month.js` | 274 | 37 |
| `src/scripts/core/44-prizes.js` | 172 | 24 |
| `src/scripts/core/45-year.js` | 143 | 21 |
| `src/scripts/core/46-wallet.js` | 508 | 43 |
| `src/scripts/core/47-rules.js` | 351 | 29 |
| `src/scripts/core/48-hero.js` | 342 | 41 |
| `src/scripts/core/48-widgets.js` | 862 | 85 |
| `src/scripts/core/49-calendar.js` | 310 | 36 |
| `src/scripts/core/49-finlit.js` | 150 | 18 |
| `src/scripts/core/50-quickadd.js` | 65 | 5 |
| `src/scripts/core/51-money-reset.js` | 132 | 15 |
| `src/scripts/core/52-fresh-start.js` | 214 | 29 |
| `src/scripts/core/53-starter.js` | 178 | 22 |
| `src/scripts/core/54-intro.js` | 131 | 13 |
| `src/scripts/core/54-links.js` | 292 | 31 |
| `src/scripts/core/55-focus.js` | 391 | 43 |
| `src/scripts/core/56-run.js` | 347 | 50 |
| `src/scripts/core/57-core.js` | 116 | 14 |
| `src/scripts/core/57-my-plan.js` | 475 | 49 |
| `src/scripts/core/58-moods.js` | 418 | 44 |
| `src/scripts/core/59-core-screen.js` | 173 | 19 |
| `src/scripts/core/60-core-actions.js` | 180 | 14 |
| `src/scripts/core/61-folder-canvas.js` | 150 | 15 |
| `src/scripts/core/62-block-store.js` | 209 | 25 |
| `src/scripts/core/63-widget-sheet.js` | 238 | 22 |
| `src/scripts/core/64-rich-text.js` | 196 | 23 |
| `src/scripts/core/65-plan.js` | 359 | 58 |
| `src/scripts/core/66-year-planner.js` | 135 | 19 |
| `src/scripts/page-editor/01-palette.js` | 190 | 17 |
| `src/scripts/page-editor/02-block-styles.js` | 793 | 55 |
| `src/scripts/page-editor/03-premium-pack.js` | 1165 | 60 |
| `src/scripts/page-editor/04-table.js` | 228 | 26 |
| `src/scripts/page-editor/05-fold.js` | 66 | 8 |
| `src/scripts/page-editor/08-w-projects-hub.js` | 691 | 41 |
| `src/scripts/page-editor/08b-rich-text.js` | 585 | 100 |
| `src/scripts/page-editor/09-open-page.js` | 33 | 1 |
| `src/scripts/page-editor/10-mic.js` | 201 | 13 |
| `src/vendor/jszip.min.js` _(мініфікований вендор)_ | 13 | — |
| `src/vendor/pdf.min.js` _(мініфікований вендор)_ | 22 | — |
| `src/vendor/supabase.min.js` _(мініфікований вендор)_ | 11 | — |
| `src/web/hero-assets.js` _(мініфікований вендор)_ | 51 | — |
| `src/web/hero-outfits.js` _(мініфікований вендор)_ | 34 | — |
| `src/web/misto-assets.js` _(мініфікований вендор)_ | 43 | — |
| `src/web/starter-assets.js` _(мініфікований вендор)_ | 15 | — |
| `src/web/sw.js` | 109 | 9 |
| `tools/make-icon.js` | 40 | 5 |
| `tools/scriptcheck.js` | 98 | 12 |
| `tools/smoke.js` | 61 | 5 |
| `tools/test-migrations.js` | 374 | 34 |
| `tools/test-month.js` | 198 | 7 |
| `tools/test-rls.mjs` | 132 | 16 |
| `worker/flow-ai-worker.js` | 581 | 20 |
| `worker/test-worker.mjs` | 151 | 11 |

## Файли CSS

| Файл | Рядків | Селекторів |
|---|---|---|
| `src/styles/00-fonts.css` | 68 | 0 |
| `src/styles/04-diary.css` | 138 | 0 |
| `src/styles/10-fd26.css` | 29 | 0 |
| `src/styles/12-theme-nightfire.css` | 419 | 6 |
| `src/styles/13-planner.css` | 82 | 0 |
| `src/styles/15-month.css` | 227 | 2 |
| `src/styles/16-mx.css` | 242 | 2 |
| `src/styles/17-horizon.css` | 244 | 1 |
| `src/styles/18-standalone.css` | 43 | 1 |
| `src/styles/19-themes-flat.css` | 408 | 3 |
| `src/styles/20-depth.css` | 129 | 8 |
| `src/styles/21-hero-week.css` | 133 | 2 |
| `src/styles/22-more-screen.css` | 186 | 0 |
| `src/styles/23-doc-readable.css` | 102 | 4 |
| `src/styles/core/01-tokens-base.css` | 350 | 9 |
| `src/styles/core/02-page-editor.css` | 1397 | 9 |
| `src/styles/core/03-folders-projects.css` | 706 | 0 |
| `src/styles/core/04-menus.css` | 89 | 0 |
| `src/styles/core/05-values-wishes.css` | 126 | 0 |
| `src/styles/core/06-goals.css` | 206 | 0 |
| `src/styles/core/07-finance.css` | 590 | 0 |
| `src/styles/core/08-work.css` | 202 | 0 |
| `src/styles/core/09-board-canvas.css` | 188 | 3 |
| `src/styles/core/10-reader-blocks.css` | 448 | 4 |
| `src/styles/core/11-spaces-desktop.css` | 221 | 0 |
| `src/styles/core/12-pets-more-planner.css` | 1224 | 0 |
| `src/styles/core/13-search-capture.css` | 84 | 0 |
| `src/styles/core/16-upgrade.css` | 54 | 0 |
| `src/styles/core/17-my-year.css` | 64 | 0 |
| `src/styles/core/18-channel.css` | 205 | 0 |
| `src/styles/core/19-chats.css` | 406 | 0 |
| `src/styles/core/20-world.css` | 20 | 0 |
| `src/styles/core/21-spheres.css` | 82 | 0 |
| `src/styles/core/22-year-letter.css` | 70 | 0 |
| `src/styles/core/23-ritual-steps.css` | 65 | 0 |
| `src/styles/core/24-home-gallery.css` | 358 | 0 |
| `src/styles/core/25-journal.css` | 316 | 0 |
| `src/styles/core/26-day.css` | 173 | 0 |
| `src/styles/core/27-month.css` | 212 | 0 |
| `src/styles/core/28-prizes.css` | 43 | 0 |
| `src/styles/core/29-year.css` | 82 | 0 |
| `src/styles/core/30-wallet.css` | 161 | 0 |
| `src/styles/core/31-rules.css` | 76 | 0 |
| `src/styles/core/32-widgets.css` | 417 | 0 |
| `src/styles/core/33-starter.css` | 63 | 0 |
| `src/styles/core/34-intro.css` | 106 | 0 |
| `src/styles/core/35-focus.css` | 112 | 0 |
| `src/styles/core/36-run.css` | 57 | 0 |
| `src/styles/core/37-moods.css` | 99 | 0 |
| `src/styles/core/37-my-plan.css` | 161 | 0 |
| `src/styles/core/38-core.css` | 88 | 0 |
| `src/styles/core/39-folder-canvas.css` | 43 | 0 |
| `src/styles/core/40-block-store.css` | 126 | 0 |
| `src/styles/core/41-widget-sheet.css` | 177 | 0 |
| `src/styles/core/42-plan.css` | 196 | 2 |
| `src/styles/core/43-year-planner.css` | 94 | 0 |

## Ключі сховища — FLOW_KEYS (84)

`src/scripts/core/01-base.js`

`0` · `active_space_map_v2` · `ai_chat` · `ai_endpoint` · `ai_memory` · `ai_pet`

`ai_privacy_v1` · `ai_prompts` · `ai_voice` · `blocks_got` · `blockusage` · `board`

`chats_v1` · `collage_board` · `custom_avatar_v1` · `customboards` · `debts` · `diary_books_v1`

`diary_entries_v1` · `diary_insights_v1` · `envelopes` · `fin_curs` · `fin_fs` · `fin_ops`

`fin_projects` · `fin_recurring` · `fin_tomb` · `flowPgCovers` · `flowcardskin` · `flowprotheme`

`flowtheme` · `folder_widgets` · `folderopts` · `folders_cfg` · `folders_deleted_v1` · `folders_order`

`folderview` · `forcedesktop` · `forcemobile` · `fx_cfg` · `fx_mode` · `fx_say`

`goals_data` · `hero_look` · `home_glass_on` · `home_tabs_del` · `home_tabs_v1` · `homeov`

`hometab` · `homewidgets` · `htabs_view` · `i18n_content_cache` · `income_cards` · `lang_pref`

`main_cur` · `patterns_chains` · `patterns_score` · `patterns_transform` · `pet_hidden` · `pet_pos`

`pet_sleep` · `readerCfg` · `ritual_board` · `sidebarcol` · `spacecanvas` · `spacecanvaszoom`

`spacefull` · `spaces_map_v2` · `spaceview` · `spacewide` · `spend` · `switcher_style`

`ui_mode` · `upgrade_profile_v1` · `values_state` · `vision_v1` · `wish_active_days_v1` · `wish_price`

`wishes_board` · `work_blocks` · `work_cfg` · `work_extras` · `work_sessions` · `world_game`

## Сутності по файлах

Посилання виду `файл:рядок` — клікабельні.

### `desktop/main.js` — 14 сутностей

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
| `AUTH_PREFIX` | значення | `desktop/main.js:77` |
| `createWindow` | функція | `desktop/main.js:103` |
| `watchSources` | функція | `desktop/main.js:180` |

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

### `src/scripts/21-newyear-countdown.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MONTHS` | масив | `src/scripts/21-newyear-countdown.js:3` |
| `midnight` | функція | `src/scripts/21-newyear-countdown.js:4` |
| `targetDate` | функція | `src/scripts/21-newyear-countdown.js:5` |
| `daysInYear` | функція | `src/scripts/21-newyear-countdown.js:6` |
| `pointB` | функція | `src/scripts/21-newyear-countdown.js:10` |
| `runEnd` | функція | `src/scripts/21-newyear-countdown.js:22` |
| `tickWidget` | функція | `src/scripts/21-newyear-countdown.js:25` |
| `window.__nycTap` | функція | `src/scripts/21-newyear-countdown.js:42` |
| `curView` | значення | `src/scripts/21-newyear-countdown.js:49` |
| `tickHero` | функція | `src/scripts/21-newyear-countdown.js:50` |
| `renderView` | функція | `src/scripts/21-newyear-countdown.js:70` |
| `refreshScreen` | функція | `src/scripts/21-newyear-countdown.js:125` |
| `window.__nycRefresh` | значення | `src/scripts/21-newyear-countdown.js:126` |
| `window.goNYC` | функція | `src/scripts/21-newyear-countdown.js:147` |

### `src/scripts/40-pets-3d.js` — порожньо на верхньому рівні

### `src/scripts/41-theme-layer.js` — порожньо на верхньому рівні

### `src/scripts/42-voice-island.js` — порожньо на верхньому рівні

### `src/scripts/43-planner.js` — порожньо на верхньому рівні

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
| `window.FLOW_RAW_KEYS` | масив | `src/scripts/core/01-base.js:184` |
| `getLang` | функція | `src/scripts/core/01-base.js:202` |
| `setLang` | функція | `src/scripts/core/01-base.js:203` |
| `window.__flowLang` | значення | `src/scripts/core/01-base.js:204` |
| `window.flowLang` | значення | `src/scripts/core/01-base.js:205` |
| `window.flowSetLang` | значення | `src/scripts/core/01-base.js:206` |
| `I18N_DICT` | обʼєкт | `src/scripts/core/01-base.js:211` |
| `I18N_WORDS` | масив | `src/scripts/core/01-base.js:288` |
| `wordLevelTranslate` | функція | `src/scripts/core/01-base.js:316` |
| `I18N_NO_TOUCH` | обʼєкт | `src/scripts/core/01-base.js:331` |
| `translateNode` | функція | `src/scripts/core/01-base.js:334` |
| `i18nApply` | функція | `src/scripts/core/01-base.js:357` |
| `window.i18nApply` | значення | `src/scripts/core/01-base.js:361` |
| `i18nBlocked` | функція | `src/scripts/core/01-base.js:365` |
| `raf` | значення | `src/scripts/core/01-base.js:375` |
| `flush` | функція | `src/scripts/core/01-base.js:376` |
| `mo` | функція | `src/scripts/core/01-base.js:383` |
| `contentTranslateOn` | функція | `src/scripts/core/01-base.js:404` |
| `window.flowContentTranslateOn` | значення | `src/scripts/core/01-base.js:407` |
| `hash` | функція | `src/scripts/core/01-base.js:408` |
| `cacheGet` | функція | `src/scripts/core/01-base.js:409` |
| `window.flowTranslateContent` | функція | `src/scripts/core/01-base.js:414` |
| `window.__flowErrors` | масив | `src/scripts/core/01-base.js:430` |
| `push` | функція | `src/scripts/core/01-base.js:431` |
| `window.flowErrors` | функція | `src/scripts/core/01-base.js:440` |

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
| `window.sbSignOut` | функція | `src/scripts/core/02-storage.js:955` |
| `origGet` | значення | `src/scripts/core/02-storage.js:993` |
| `origSet` | значення | `src/scripts/core/02-storage.js:994` |
| `origDelete` | значення | `src/scripts/core/02-storage.js:995` |
| `origList` | значення | `src/scripts/core/02-storage.js:996` |
| `sbGet` | функція | `src/scripts/core/02-storage.js:998` |
| `sbWriteQueue` | обʼєкт | `src/scripts/core/02-storage.js:1043` |
| `sbWriteTimer` | значення | `src/scripts/core/02-storage.js:1044` |
| `sbInFlight` | обʼєкт | `src/scripts/core/02-storage.js:1050` |
| `sbFlushSeq` | значення | `src/scripts/core/02-storage.js:1056` |
| `sbDoneSeq` | обʼєкт | `src/scripts/core/02-storage.js:1057` |
| `sbOutboxSave` | функція | `src/scripts/core/02-storage.js:1060` |
| `sbOutboxTimer` | значення | `src/scripts/core/02-storage.js:1084` |
| `sbOutboxKeys` | обʼєкт | `src/scripts/core/02-storage.js:1085` |
| `sbHiding` | значення | `src/scripts/core/02-storage.js:1086` |
| `sbOutboxSaveSoon` | функція | `src/scripts/core/02-storage.js:1087` |
| `sbOutboxLoad` | функція | `src/scripts/core/02-storage.js:1091` |
| `sbSyncPending` | функція | `src/scripts/core/02-storage.js:1098` |
| `sbScheduleWrite` | функція | `src/scripts/core/02-storage.js:1099` |
| `sbFlushWrites` | функція | `src/scripts/core/02-storage.js:1107` |
| `window.sbFlushWrites` | значення | `src/scripts/core/02-storage.js:1170` |
| `window.sbDropQueue` | функція | `src/scripts/core/02-storage.js:1172` |
| `sbOnHide` | функція | `src/scripts/core/02-storage.js:1179` |
| `sbPullChanged` | функція | `src/scripts/core/02-storage.js:1214` |
| `sbLastPull` | значення | `src/scripts/core/02-storage.js:1236` |
| `sbPullFresh` | функція | `src/scripts/core/02-storage.js:1237` |
| `sbPullAndLoad` | функція | `src/scripts/core/02-storage.js:1255` |
| `window.sbPullFresh` | значення | `src/scripts/core/02-storage.js:1278` |
| `window.sbPullAndLoad` | значення | `src/scripts/core/02-storage.js:1279` |
| `PH_KEY` | значення | `src/scripts/core/02-storage.js:1295` |
| `PH_PENDING` | значення | `src/scripts/core/02-storage.js:1296` |
| `phPendingGet` | функція | `src/scripts/core/02-storage.js:1297` |
| `phPendingSet` | функція | `src/scripts/core/02-storage.js:1298` |
| `phPendingAdd` | функція | `src/scripts/core/02-storage.js:1299` |
| `phPendingDrop` | функція | `src/scripts/core/02-storage.js:1300` |
| `PH_TS` | значення | `src/scripts/core/02-storage.js:1305` |
| `phTsGet` | функція | `src/scripts/core/02-storage.js:1306` |
| `phTsSet` | функція | `src/scripts/core/02-storage.js:1307` |
| `phTsDrop` | функція | `src/scripts/core/02-storage.js:1308` |
| `window.sbPhotoPush` | функція | `src/scripts/core/02-storage.js:1310` |
| `window.sbPhotoFetch` | функція | `src/scripts/core/02-storage.js:1326` |
| `window.sbPhotoList` | функція | `src/scripts/core/02-storage.js:1343` |
| `window.sbPhotoDel` | функція | `src/scripts/core/02-storage.js:1358` |
| `phSyncBusy` | значення | `src/scripts/core/02-storage.js:1368` |
| `sbPhotoSync` | функція | `src/scripts/core/02-storage.js:1369` |
| `window.sbPhotoSync` | значення | `src/scripts/core/02-storage.js:1399` |
| `window.sbWipeAll` | функція | `src/scripts/core/02-storage.js:1404` |
| `prefSet` | функція | `src/scripts/core/02-storage.js:1473` |
| `prefCatchup` | функція | `src/scripts/core/02-storage.js:1477` |
| `UIMODE_KEY` | значення | `src/scripts/core/02-storage.js:1490` |
| `window.uiMode` | значення | `src/scripts/core/02-storage.js:1491` |
| `applyUiMode` | функція | `src/scripts/core/02-storage.js:1492` |
| `setUiMode` | функція | `src/scripts/core/02-storage.js:1493` |
| `window.setUiMode` | значення | `src/scripts/core/02-storage.js:1501` |
| `LP` | значення | `src/scripts/core/02-storage.js:1508` |
| `FORMAT` | значення | `src/scripts/core/02-storage.js:1509` |
| `APP` | значення | `src/scripts/core/02-storage.js:1510` |
| `ZIP_JSON` | значення | `src/scripts/core/02-storage.js:1511` |
| `isSvc` | функція | `src/scripts/core/02-storage.js:1517` |
| `RAW_DATA` | масив | `src/scripts/core/02-storage.js:1521` |
| `JSON_KEYS` | масив | `src/scripts/core/02-storage.js:1523` |
| `collect` | функція | `src/scripts/core/02-storage.js:1527` |
| `collectRaw` | функція | `src/scripts/core/02-storage.js:1544` |
| `stats` | функція | `src/scripts/core/02-storage.js:1551` |
| `phBytes` | функція | `src/scripts/core/02-storage.js:1557` |
| `signedIn` | функція | `src/scripts/core/02-storage.js:1558` |
| `photoStats` | функція | `src/scripts/core/02-storage.js:1564` |
| `gatherPhotos` | функція | `src/scripts/core/02-storage.js:1585` |
| `makeEnvelope` | функція | `src/scripts/core/02-storage.js:1612` |
| `loadZip` | функція | `src/scripts/core/02-storage.js:1625` |
| `PH_EXT` | обʼєкт | `src/scripts/core/02-storage.js:1630` |
| `dataUrlParts` | функція | `src/scripts/core/02-storage.js:1631` |
| `makeFile` | функція | `src/scripts/core/02-storage.js:1644` |
| `saveBlob` | функція | `src/scripts/core/02-storage.js:1694` |
| `saveFile` | функція | `src/scripts/core/02-storage.js:1739` |
| `photosGap` | функція | `src/scripts/core/02-storage.js:1746` |
| `tapStillFresh` | функція | `src/scripts/core/02-storage.js:1757` |
| `exportToFile` | функція | `src/scripts/core/02-storage.js:1766` |
| `snapshot` | функція | `src/scripts/core/02-storage.js:1781` |
| `restoreSnapshot` | функція | `src/scripts/core/02-storage.js:1784` |
| `unwrapVal` | функція | `src/scripts/core/02-storage.js:1792` |
| `valOf` | функція | `src/scripts/core/02-storage.js:1797` |
| `checkEnvelope` | функція | `src/scripts/core/02-storage.js:1806` |
| `plural` | функція | `src/scripts/core/02-storage.js:1824` |
| `summarize` | функція | `src/scripts/core/02-storage.js:1829` |
| `readFile` | функція | `src/scripts/core/02-storage.js:1852` |
| `inspectFile` | функція | `src/scripts/core/02-storage.js:1862` |
| `applyEnvelope` | функція | `src/scripts/core/02-storage.js:1891` |
| `pushRestored` | функція | `src/scripts/core/02-storage.js:1917` |
| `applyInspected` | функція | `src/scripts/core/02-storage.js:1946` |
| `importFromFile` | функція | `src/scripts/core/02-storage.js:1964` |
| `window.flowBackup` | обʼєкт | `src/scripts/core/02-storage.js:1970` |
| `window.flowFactoryReset` | функція | `src/scripts/core/02-storage.js:1987` |
| `window.PhotoDB` | значення | `src/scripts/core/02-storage.js:2069` |
| `window.__photoCache` | значення | `src/scripts/core/02-storage.js:2107` |
| `__phPending` | обʼєкт | `src/scripts/core/02-storage.js:2113` |
| `__photoPoke` | функція | `src/scripts/core/02-storage.js:2114` |
| `window.photoSrc` | функція | `src/scripts/core/02-storage.js:2123` |
| `window.photoIsRef` | функція | `src/scripts/core/02-storage.js:2147` |
| `window.photoWarm` | функція | `src/scripts/core/02-storage.js:2148` |
| `window.photoPut` | функція | `src/scripts/core/02-storage.js:2154` |
| `window.photoDel` | функція | `src/scripts/core/02-storage.js:2163` |

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
| `diag` | функція | `src/scripts/core/03-platform.js:36` |
| `lockSwipe` | функція | `src/scripts/core/03-platform.js:40` |
| `expand` | функція | `src/scripts/core/03-platform.js:41` |
| `popup` | функція | `src/scripts/core/03-platform.js:44` |
| `window.platform` | обʼєкт | `src/scripts/core/03-platform.js:48` |
| `window.micDenyMsg` | функція | `src/scripts/core/03-platform.js:54` |

### `src/scripts/core/04-folders-nav.js` — 63 сутностей

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
| `EMOJI_ICON` | обʼєкт | `src/scripts/core/04-folders-nav.js:18` |
| `folderIconFor` | функція | `src/scripts/core/04-folders-nav.js:55` |
| `folderIcon` | функція | `src/scripts/core/04-folders-nav.js:63` |
| `ICON_ALL` | масив | `src/scripts/core/04-folders-nav.js:66` |
| `folderDelPending` | обʼєкт | `src/scripts/core/04-folders-nav.js:82` |
| `FPRIO` | обʼєкт | `src/scripts/core/04-folders-nav.js:84` |
| `FPRIO_ORDER` | масив | `src/scripts/core/04-folders-nav.js:85` |
| `folderPrioOk` | функція | `src/scripts/core/04-folders-nav.js:86` |
| `folderPrio` | функція | `src/scripts/core/04-folders-nav.js:87` |
| `prioDot` | функція | `src/scripts/core/04-folders-nav.js:88` |
| `folderVisible` | функція | `src/scripts/core/04-folders-nav.js:89` |
| `folderDeleteLater` | функція | `src/scripts/core/04-folders-nav.js:90` |
| `folderDeleteCancel` | функція | `src/scripts/core/04-folders-nav.js:100` |
| `foldersLoaded` | значення | `src/scripts/core/04-folders-nav.js:120` |
| `markFoldersLoaded` | функція | `src/scripts/core/04-folders-nav.js:121` |
| `foldersLookFactory` | функція | `src/scripts/core/04-folders-nav.js:123` |
| `storedFolderCount` | функція | `src/scripts/core/04-folders-nav.js:128` |
| `saveFolders` | функція | `src/scripts/core/04-folders-nav.js:137` |
| `FDELKEY` | значення | `src/scripts/core/04-folders-nav.js:189` |
| `FDEL_MAX` | значення | `src/scripts/core/04-folders-nav.js:190` |
| `tombsNorm` | функція | `src/scripts/core/04-folders-nav.js:191` |
| `tombsMerge` | функція | `src/scripts/core/04-folders-nav.js:200` |
| `tombsSame` | функція | `src/scripts/core/04-folders-nav.js:205` |
| `folderTombs` | обʼєкт | `src/scripts/core/04-folders-nav.js:209` |
| `folderTombed` | функція | `src/scripts/core/04-folders-nav.js:212` |
| `saveFolderTombs` | функція | `src/scripts/core/04-folders-nav.js:213` |
| `window.folderTombsReset` | функція | `src/scripts/core/04-folders-nav.js:215` |
| `folderPurge` | функція | `src/scripts/core/04-folders-nav.js:226` |
| `folderDelete` | функція | `src/scripts/core/04-folders-nav.js:273` |
| `mergeFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:291` |
| `applyFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:300` |
| `leaveTombedFolder` | функція | `src/scripts/core/04-folders-nav.js:328` |
| `folderWidgets` | обʼєкт | `src/scripts/core/04-folders-nav.js:347` |
| `FWKEY` | значення | `src/scripts/core/04-folders-nav.js:348` |
| `saveFolderWidgets` | функція | `src/scripts/core/04-folders-nav.js:349` |
| `orderedFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:351` |
| `PROJECT_STATUSES` | масив | `src/scripts/core/04-folders-nav.js:357` |
| `projStatusMeta` | функція | `src/scripts/core/04-folders-nav.js:361` |
| `folderProgress` | функція | `src/scripts/core/04-folders-nav.js:363` |
| `dueLabel` | функція | `src/scripts/core/04-folders-nav.js:375` |
| `projFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:384` |
| `childFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:387` |
| `topFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:390` |
| `isDescendantFolder` | функція | `src/scripts/core/04-folders-nav.js:394` |
| `moveFolderTo` | функція | `src/scripts/core/04-folders-nav.js:402` |
| `goHome` | функція | `src/scripts/core/04-folders-nav.js:416` |
| `goFolder` | функція | `src/scripts/core/04-folders-nav.js:417` |
| `goDebts` | функція | `src/scripts/core/04-folders-nav.js:429` |
| `goFinance` | функція | `src/scripts/core/04-folders-nav.js:430` |
| `goEnvelopes` | функція | `src/scripts/core/04-folders-nav.js:431` |
| `goSpend` | функція | `src/scripts/core/04-folders-nav.js:432` |
| `workOrigin` | значення | `src/scripts/core/04-folders-nav.js:433` |
| `goWork` | функція | `src/scripts/core/04-folders-nav.js:436` |
| `workBack` | функція | `src/scripts/core/04-folders-nav.js:440` |

### `src/scripts/core/05-spaces.js` — 58 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `spacesMap` | обʼєкт | `src/scripts/core/05-spaces.js:9` |
| `SPMKEY` | значення | `src/scripts/core/05-spaces.js:10` |
| `saveSpacesMeta` | функція | `src/scripts/core/05-spaces.js:17` |
| `curCtx` | функція | `src/scripts/core/05-spaces.js:20` |
| `ctxBaseKey` | функція | `src/scripts/core/05-spaces.js:24` |
| `ctxDefaultMeta` | функція | `src/scripts/core/05-spaces.js:25` |
| `spacesFor` | функція | `src/scripts/core/05-spaces.js:31` |
| `activeSpaceFor` | функція | `src/scripts/core/05-spaces.js:36` |
| `keyForSpaceIn` | функція | `src/scripts/core/05-spaces.js:37` |
| `switchSpace` | функція | `src/scripts/core/05-spaces.js:40` |
| `goSpaceFor` | функція | `src/scripts/core/05-spaces.js:51` |
| `spaceFromFolder` | значення | `src/scripts/core/05-spaces.js:76` |
| `show` | функція | `src/scripts/core/05-spaces.js:79` |
| `dsbFillUser` | функція | `src/scripts/core/05-spaces.js:139` |
| `window.dsbFillUser` | значення | `src/scripts/core/05-spaces.js:162` |
| `dsbProfileSheet` | функція | `src/scripts/core/05-spaces.js:163` |
| `STG_COL` | обʼєкт | `src/scripts/core/05-spaces.js:199` |
| `STG_IC` | обʼєкт | `src/scripts/core/05-spaces.js:201` |
| `stgSvg` | функція | `src/scripts/core/05-spaces.js:229` |
| `stgIco` | функція | `src/scripts/core/05-spaces.js:233` |
| `renderSettingsCard` | функція | `src/scripts/core/05-spaces.js:248` |
| `window.renderSettingsCard` | значення | `src/scripts/core/05-spaces.js:335` |
| `openSettings` | функція | `src/scripts/core/05-spaces.js:340` |
| `window.openSettingsSheet` | значення | `src/scripts/core/05-spaces.js:347` |
| `sidebarCollapsed` | значення | `src/scripts/core/05-spaces.js:382` |
| `applyChrome` | функція | `src/scripts/core/05-spaces.js:387` |
| `homeWidgets` | значення | `src/scripts/core/05-spaces.js:403` |
| `applyHomeWidgets` | функція | `src/scripts/core/05-spaces.js:406` |
| `THEME_SETS` | обʼєкт | `src/scripts/core/05-spaces.js:426` |
| `THEME_META` | обʼєкт | `src/scripts/core/05-spaces.js:432` |
| `THEME_KEYS` | значення | `src/scripts/core/05-spaces.js:441` |
| `isTheme` | функція | `src/scripts/core/05-spaces.js:442` |
| `themeSetOf` | функція | `src/scripts/core/05-spaces.js:444` |
| `themeIsDark` | функція | `src/scripts/core/05-spaces.js:448` |
| `theme` | значення | `src/scripts/core/05-spaces.js:449` |
| `applyTheme` | функція | `src/scripts/core/05-spaces.js:473` |
| `setTheme` | функція | `src/scripts/core/05-spaces.js:498` |
| `setThemeSet` | функція | `src/scripts/core/05-spaces.js:508` |
| `toggleTheme` | функція | `src/scripts/core/05-spaces.js:512` |
| `proTheme` | значення | `src/scripts/core/05-spaces.js:526` |
| `applyProTheme` | функція | `src/scripts/core/05-spaces.js:528` |
| `toggleProTheme` | функція | `src/scripts/core/05-spaces.js:534` |
| `cardSkin` | значення | `src/scripts/core/05-spaces.js:544` |
| `applyCardSkin` | функція | `src/scripts/core/05-spaces.js:546` |
| `RR_DEFS` | обʼєкт | `src/scripts/core/05-spaces.js:567` |
| `rrCfg` | функція | `src/scripts/core/05-spaces.js:568` |
| `rrSave` | функція | `src/scripts/core/05-spaces.js:573` |
| `rrCfgSheet` | функція | `src/scripts/core/05-spaces.js:574` |
| `renderRightRail` | функція | `src/scripts/core/05-spaces.js:593` |
| `goGoals` | функція | `src/scripts/core/05-spaces.js:621` |
| `prjHexToRgb` | функція | `src/scripts/core/05-spaces.js:624` |
| `prjTileHTML` | функція | `src/scripts/core/05-spaces.js:632` |
| `renderProjects` | функція | `src/scripts/core/05-spaces.js:640` |
| `goProjects` | функція | `src/scripts/core/05-spaces.js:673` |
| `goPlanner` | функція | `src/scripts/core/05-spaces.js:678` |
| `wishBackFn` | значення | `src/scripts/core/05-spaces.js:686` |
| `goWishes` | функція | `src/scripts/core/05-spaces.js:687` |
| `window.goWishes` | значення | `src/scripts/core/05-spaces.js:691` |

### `src/scripts/core/06-wishes.js` — 115 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `WICONS` | обʼєкт | `src/scripts/core/06-wishes.js:3` |
| `icoHtml` | функція | `src/scripts/core/06-wishes.js:21` |
| `actionSheet` | функція | `src/scripts/core/06-wishes.js:24` |
| `confirmSheet` | функція | `src/scripts/core/06-wishes.js:49` |
| `flowAlert` | функція | `src/scripts/core/06-wishes.js:60` |
| `WISH_KEY` | значення | `src/scripts/core/06-wishes.js:69` |
| `WISH_ACT_KEY` | значення | `src/scripts/core/06-wishes.js:70` |
| `wishes` | масив | `src/scripts/core/06-wishes.js:71` |
| `wishActiveDays` | обʼєкт | `src/scripts/core/06-wishes.js:72` |
| `loadWishes` | функція | `src/scripts/core/06-wishes.js:74` |
| `migrateWishPhotosOnce` | функція | `src/scripts/core/06-wishes.js:84` |
| `saveWishActiveDays` | функція | `src/scripts/core/06-wishes.js:100` |
| `saveWishes` | функція | `src/scripts/core/06-wishes.js:101` |
| `HOMEGLASS_KEY` | значення | `src/scripts/core/06-wishes.js:111` |
| `homeGlass` | значення | `src/scripts/core/06-wishes.js:112` |
| `loadHomeGlass` | функція | `src/scripts/core/06-wishes.js:114` |
| `applyHomeGlass` | функція | `src/scripts/core/06-wishes.js:115` |
| `WPRICE_KEY` | значення | `src/scripts/core/06-wishes.js:118` |
| `wishPrice` | значення | `src/scripts/core/06-wishes.js:119` |
| `loadWishPrice` | функція | `src/scripts/core/06-wishes.js:121` |
| `saveWishPrice` | функція | `src/scripts/core/06-wishes.js:122` |
| `wishPriceHTML` | функція | `src/scripts/core/06-wishes.js:123` |
| `bindWishPrice` | функція | `src/scripts/core/06-wishes.js:130` |
| `WISH_SLIDE_MS` | значення | `src/scripts/core/06-wishes.js:139` |
| `wishSlideTimer` | значення | `src/scripts/core/06-wishes.js:140` |
| `updateSummaryBg` | функція | `src/scripts/core/06-wishes.js:141` |
| `compressImage` | функція | `src/scripts/core/06-wishes.js:209` |
| `pickWishPhoto` | функція | `src/scripts/core/06-wishes.js:230` |
| `replaceWishPhoto` | функція | `src/scripts/core/06-wishes.js:273` |
| `askWishCap` | функція | `src/scripts/core/06-wishes.js:297` |
| `openWishCard` | функція | `src/scripts/core/06-wishes.js:303` |
| `pickProofPhoto` | функція | `src/scripts/core/06-wishes.js:377` |
| `delWish` | функція | `src/scripts/core/06-wishes.js:384` |
| `parseVideo` | функція | `src/scripts/core/06-wishes.js:399` |
| `addWishVideo` | функція | `src/scripts/core/06-wishes.js:417` |
| `setWishCover` | функція | `src/scripts/core/06-wishes.js:442` |
| `openWishVideo` | функція | `src/scripts/core/06-wishes.js:459` |
| `openWishMenu` | функція | `src/scripts/core/06-wishes.js:468` |
| `moveWish` | функція | `src/scripts/core/06-wishes.js:510` |
| `wishToGoal` | функція | `src/scripts/core/06-wishes.js:518` |
| `RIT_KEY` | значення | `src/scripts/core/06-wishes.js:546` |
| `RIT` | обʼєкт | `src/scripts/core/06-wishes.js:547` |
| `RIT_STEPS_KEY` | значення | `src/scripts/core/06-wishes.js:551` |
| `RIT_STEPS` | значення | `src/scripts/core/06-wishes.js:552` |
| `loadRitual` | функція | `src/scripts/core/06-wishes.js:558` |
| `saveRitual` | функція | `src/scripts/core/06-wishes.js:565` |
| `saveRitSteps` | функція | `src/scripts/core/06-wishes.js:566` |
| `__ritLoad` | значення | `src/scripts/core/06-wishes.js:567` |
| `ritualRerender` | функція | `src/scripts/core/06-wishes.js:569` |
| `ritualSheet` | функція | `src/scripts/core/06-wishes.js:578` |
| `ritForWorld` | функція | `src/scripts/core/06-wishes.js:596` |
| `ritForWorldM` | функція | `src/scripts/core/06-wishes.js:597` |
| `ritDayForWorld` | функція | `src/scripts/core/06-wishes.js:606` |
| `ritDayForWorldM` | функція | `src/scripts/core/06-wishes.js:607` |
| `goRitual` | функція | `src/scripts/core/06-wishes.js:624` |
| `ritCtx` | значення | `src/scripts/core/06-wishes.js:649` |
| `ritWithCtx` | функція | `src/scripts/core/06-wishes.js:650` |
| `ritDaysObj` | функція | `src/scripts/core/06-wishes.js:653` |
| `ritDay` | функція | `src/scripts/core/06-wishes.js:658` |
| `ritDs` | функція | `src/scripts/core/06-wishes.js:659` |
| `ritStreak` | функція | `src/scripts/core/06-wishes.js:660` |
| `ytId` | функція | `src/scripts/core/06-wishes.js:675` |
| `fmtDur` | функція | `src/scripts/core/06-wishes.js:676` |
| `ritRec` | значення | `src/scripts/core/06-wishes.js:679` |
| `ritStopAll` | функція | `src/scripts/core/06-wishes.js:680` |
| `ritRecord` | функція | `src/scripts/core/06-wishes.js:682` |
| `ritPlay` | функція | `src/scripts/core/06-wishes.js:719` |
| `ritMixPlay` | функція | `src/scripts/core/06-wishes.js:720` |
| `ritFieldMic` | функція | `src/scripts/core/06-wishes.js:729` |
| `ritMixMenu` | функція | `src/scripts/core/06-wishes.js:739` |
| `ritAddLink` | функція | `src/scripts/core/06-wishes.js:747` |
| `ritLinkMenu` | функція | `src/scripts/core/06-wishes.js:757` |
| `RIT_CAT` | обʼєкт | `src/scripts/core/06-wishes.js:770` |
| `RIT_TPL` | масив | `src/scripts/core/06-wishes.js:784` |
| `RIT_TY` | обʼєкт | `src/scripts/core/06-wishes.js:790` |
| `ritCleanStep` | функція | `src/scripts/core/06-wishes.js:792` |
| `RIT_MORNING_ONLY` | масив | `src/scripts/core/06-wishes.js:803` |
| `ritSteps` | функція | `src/scripts/core/06-wishes.js:804` |
| `RIT_OWN_IC` | обʼєкт | `src/scripts/core/06-wishes.js:810` |
| `ritCat` | функція | `src/scripts/core/06-wishes.js:811` |
| `ritMeta` | функція | `src/scripts/core/06-wishes.js:812` |
| `ritAudioKey` | функція | `src/scripts/core/06-wishes.js:815` |
| `ritStepDone` | функція | `src/scripts/core/06-wishes.js:816` |
| `ritTouch` | функція | `src/scripts/core/06-wishes.js:823` |
| `ritSaveToday` | функція | `src/scripts/core/06-wishes.js:824` |
| `ritTplName` | функція | `src/scripts/core/06-wishes.js:829` |
| `ritStepHTML` | функція | `src/scripts/core/06-wishes.js:836` |
| `ritMixHTML` | функція | `src/scripts/core/06-wishes.js:861` |
| `ritLinksHTML` | функція | `src/scripts/core/06-wishes.js:872` |
| `ritualInnerHTML` | функція | `src/scripts/core/06-wishes.js:885` |
| `ritualBind` | функція | `src/scripts/core/06-wishes.js:911` |
| `ritEditor` | функція | `src/scripts/core/06-wishes.js:977` |
| `RPH_ICON` | значення | `src/scripts/core/06-wishes.js:1043` |
| `ritPhotoCardHTML` | функція | `src/scripts/core/06-wishes.js:1044` |
| `ritPhotoTap` | функція | `src/scripts/core/06-wishes.js:1058` |
| `ritSavePhoto` | функція | `src/scripts/core/06-wishes.js:1074` |
| `ritPhotoMenu` | функція | `src/scripts/core/06-wishes.js:1087` |
| `rmomTimer` | значення | `src/scripts/core/06-wishes.js:1096` |
| `ritEnterMoment` | функція | `src/scripts/core/06-wishes.js:1099` |
| `ritMixRecTap` | функція | `src/scripts/core/06-wishes.js:1147` |
| `ritMixLongOrRec` | функція | `src/scripts/core/06-wishes.js:1148` |
| `CLG_KEY` | значення | `src/scripts/core/06-wishes.js:1156` |
| `collage` | масив | `src/scripts/core/06-wishes.js:1157` |
| `loadCollage` | функція | `src/scripts/core/06-wishes.js:1159` |
| `saveCollage` | функція | `src/scripts/core/06-wishes.js:1161` |
| `goCollage` | функція | `src/scripts/core/06-wishes.js:1164` |
| `clgPickPhotos` | функція | `src/scripts/core/06-wishes.js:1167` |
| `clgImportWishes` | функція | `src/scripts/core/06-wishes.js:1182` |
| `clgMenu` | функція | `src/scripts/core/06-wishes.js:1193` |
| `renderCollage` | функція | `src/scripts/core/06-wishes.js:1206` |
| `clgWrap` | функція | `src/scripts/core/06-wishes.js:1263` |
| `clgWallpaper` | функція | `src/scripts/core/06-wishes.js:1269` |
| `wishDateInfo` | функція | `src/scripts/core/06-wishes.js:1343` |
| `renderWishDeck` | функція | `src/scripts/core/06-wishes.js:1362` |
| `renderWishes` | функція | `src/scripts/core/06-wishes.js:1438` |

### `src/scripts/core/07-values.js` — 4 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `VAL_KEY` | значення | `src/scripts/core/07-values.js:5` |
| `valState` | обʼєкт | `src/scripts/core/07-values.js:6` |
| `loadValues` | функція | `src/scripts/core/07-values.js:18` |
| `todayStr` | функція | `src/scripts/core/07-values.js:21` |

### `src/scripts/core/08-finance.js` — 84 сутностей

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
| `envDelOp` | функція | `src/scripts/core/08-finance.js:46` |
| `finOps` | масив | `src/scripts/core/08-finance.js:56` |
| `FINOPKEY` | значення | `src/scripts/core/08-finance.js:57` |
| `saveFinOps` | функція | `src/scripts/core/08-finance.js:58` |
| `window.flowSearchFin` | функція | `src/scripts/core/08-finance.js:60` |
| `recurring` | масив | `src/scripts/core/08-finance.js:62` |
| `RECKEY` | значення | `src/scripts/core/08-finance.js:63` |
| `saveRecurring` | функція | `src/scripts/core/08-finance.js:64` |
| `WALLET_ID` | значення | `src/scripts/core/08-finance.js:72` |
| `cards` | масив | `src/scripts/core/08-finance.js:73` |
| `saveCards` | функція | `src/scripts/core/08-finance.js:74` |
| `walletCard` | функція | `src/scripts/core/08-finance.js:75` |
| `opMain` | функція | `src/scripts/core/08-finance.js:80` |
| `walletOps` | функція | `src/scripts/core/08-finance.js:81` |
| `walletBalance` | функція | `src/scripts/core/08-finance.js:82` |
| `mainCard` | функція | `src/scripts/core/08-finance.js:84` |
| `cardById` | функція | `src/scripts/core/08-finance.js:85` |
| `cardSym` | функція | `src/scripts/core/08-finance.js:86` |
| `cardBalance` | функція | `src/scripts/core/08-finance.js:87` |
| `incomeSummary` | функція | `src/scripts/core/08-finance.js:88` |
| `CUR_LIST` | обʼєкт | `src/scripts/core/08-finance.js:95` |
| `curLocale` | функція | `src/scripts/core/08-finance.js:96` |
| `mainCur` | функція | `src/scripts/core/08-finance.js:98` |
| `curOk` | функція | `src/scripts/core/08-finance.js:103` |
| `curKey` | функція | `src/scripts/core/08-finance.js:105` |
| `curSym` | функція | `src/scripts/core/08-finance.js:106` |
| `money` | функція | `src/scripts/core/08-finance.js:108` |
| `moneyK` | функція | `src/scripts/core/08-finance.js:110` |
| `curLocked` | функція | `src/scripts/core/08-finance.js:117` |
| `setMainCur` | функція | `src/scripts/core/08-finance.js:123` |
| `curPickSheet` | функція | `src/scripts/core/08-finance.js:130` |
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
| `monthAgg` | функція | `src/scripts/core/08-finance.js:349` |
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
| `renderEnvSheet` | функція | `src/scripts/core/08-finance.js:569` |

### `src/scripts/core/09-goals.js` — 31 сутностей

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
| `DOW_SHORT` | масив | `src/scripts/core/09-goals.js:233` |
| `aiPreview` | функція | `src/scripts/core/09-goals.js:234` |
| `aiDraftSentence` | функція | `src/scripts/core/09-goals.js:274` |
| `aiDraftMonths` | функція | `src/scripts/core/09-goals.js:278` |
| `aiDraftFolder` | функція | `src/scripts/core/09-goals.js:285` |
| `aiApplyDraft` | функція | `src/scripts/core/09-goals.js:286` |
| `renderGoals` | функція | `src/scripts/core/09-goals.js:333` |
| `dgDateStr` | функція | `src/scripts/core/09-goals.js:365` |
| `dgWeekDates` | функція | `src/scripts/core/09-goals.js:366` |
| `dgListFor` | функція | `src/scripts/core/09-goals.js:369` |
| `dgSync` | функція | `src/scripts/core/09-goals.js:371` |
| `dayGoalsBlock` | функція | `src/scripts/core/09-goals.js:391` |
| `pickFolderForGoal` | функція | `src/scripts/core/09-goals.js:443` |
| `renderGoalsTab` | функція | `src/scripts/core/09-goals.js:485` |

### `src/scripts/core/10-planner.js` — 43 сутностей

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
| `renderPlanner` | функція | `src/scripts/core/10-planner.js:461` |
| `plFmtMMSS` | функція | `src/scripts/core/10-planner.js:692` |
| `plStartFocus` | функція | `src/scripts/core/10-planner.js:693` |
| `plNowInfo` | функція | `src/scripts/core/10-planner.js:754` |
| `plParseQuick` | функція | `src/scripts/core/10-planner.js:763` |
| `plWeekStats` | функція | `src/scripts/core/10-planner.js:789` |
| `plWeekReviewSheet` | функція | `src/scripts/core/10-planner.js:802` |
| `plWeekAI` | функція | `src/scripts/core/10-planner.js:855` |

### `src/scripts/core/11-ai-flow.js` — 36 сутностей

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
| `aiQuoteData` | функція | `src/scripts/core/11-ai-flow.js:156` |
| `AI_PAGES_SYS` | значення | `src/scripts/core/11-ai-flow.js:163` |
| `AI_FLOWOPS_SYS` | значення | `src/scripts/core/11-ai-flow.js:172` |
| `AI_CHAT_SYS` | значення | `src/scripts/core/11-ai-flow.js:183` |
| `aiHttpError` | функція | `src/scripts/core/11-ai-flow.js:188` |
| `aiStreamError` | функція | `src/scripts/core/11-ai-flow.js:201` |
| `aiNetDown` | функція | `src/scripts/core/11-ai-flow.js:212` |
| `aiHumanError` | функція | `src/scripts/core/11-ai-flow.js:216` |
| `aiLangDirective` | функція | `src/scripts/core/11-ai-flow.js:226` |
| `AI_MAX_TOKENS` | значення | `src/scripts/core/11-ai-flow.js:236` |
| `AI_IDLE_MS` | значення | `src/scripts/core/11-ai-flow.js:237` |
| `AI_NOSTREAM_MS` | значення | `src/scripts/core/11-ai-flow.js:242` |
| `AI_CUT_NOTE` | значення | `src/scripts/core/11-ai-flow.js:243` |
| `AI_REFUSAL_NOTE` | значення | `src/scripts/core/11-ai-flow.js:244` |
| `AI_BROKEN_NOTE` | значення | `src/scripts/core/11-ai-flow.js:245` |
| `aiLastStop` | значення | `src/scripts/core/11-ai-flow.js:246` |
| `aiTimeoutError` | функція | `src/scripts/core/11-ai-flow.js:247` |
| `aiIdleGuard` | функція | `src/scripts/core/11-ai-flow.js:256` |
| `aiCall` | функція | `src/scripts/core/11-ai-flow.js:279` |

### `src/scripts/core/12-ai-agent.js` — 98 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `AI_AGENT_KEY` | значення | `src/scripts/core/12-ai-agent.js:6` |
| `aiAgentOn` | функція | `src/scripts/core/12-ai-agent.js:7` |
| `AI_MODELS` | обʼєкт | `src/scripts/core/12-ai-agent.js:13` |
| `AI_PRICES` | обʼєкт | `src/scripts/core/12-ai-agent.js:20` |
| `aiAgentStatus` | значення | `src/scripts/core/12-ai-agent.js:26` |
| `aiAgentSetStatus` | функція | `src/scripts/core/12-ai-agent.js:27` |
| `aiDevOwner` | функція | `src/scripts/core/12-ai-agent.js:42` |
| `aiDevOn` | функція | `src/scripts/core/12-ai-agent.js:48` |
| `aiDevToolsOn` | функція | `src/scripts/core/12-ai-agent.js:56` |
| `AI_DEV_DENY` | значення | `src/scripts/core/12-ai-agent.js:57` |
| `aiDevToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:58` |
| `devContentTranslateToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:78` |
| `window.devContentTranslateToggleSheet` | значення | `src/scripts/core/12-ai-agent.js:95` |
| `AI_DEV_SYS` | значення | `src/scripts/core/12-ai-agent.js:96` |
| `AI_DEV_EVAL_HINT` | значення | `src/scripts/core/12-ai-agent.js:104` |
| `aiDevSys` | функція | `src/scripts/core/12-ai-agent.js:105` |
| `aiDevCtx` | функція | `src/scripts/core/12-ai-agent.js:106` |
| `DEV_FEATURES` | масив | `src/scripts/core/12-ai-agent.js:119` |
| `aiDevHelpText` | функція | `src/scripts/core/12-ai-agent.js:130` |
| `aiDevConfirm` | функція | `src/scripts/core/12-ai-agent.js:137` |
| `devSnapshot` | функція | `src/scripts/core/12-ai-agent.js:157` |
| `DEV_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:163` |
| `DEV_HIDDEN_KEY` | значення | `src/scripts/core/12-ai-agent.js:190` |
| `devMaskMail` | функція | `src/scripts/core/12-ai-agent.js:191` |
| `devToolStorage` | функція | `src/scripts/core/12-ai-agent.js:192` |
| `devToolErrors` | функція | `src/scripts/core/12-ai-agent.js:239` |
| `devToolCost` | функція | `src/scripts/core/12-ai-agent.js:244` |
| `devToolSelftest` | функція | `src/scripts/core/12-ai-agent.js:262` |
| `devToolData` | функція | `src/scripts/core/12-ai-agent.js:292` |
| `devToolEval` | функція | `src/scripts/core/12-ai-agent.js:313` |
| `aiPageAsk` | функція | `src/scripts/core/12-ai-agent.js:330` |
| `aiMorningMaybe` | функція | `src/scripts/core/12-ai-agent.js:339` |
| `aiWeeklyMaybe` | функція | `src/scripts/core/12-ai-agent.js:355` |
| `aiAgentStatusFor` | функція | `src/scripts/core/12-ai-agent.js:368` |
| `aiTrace` | значення | `src/scripts/core/12-ai-agent.js:407` |
| `aiPlz` | функція | `src/scripts/core/12-ai-agent.js:408` |
| `AI_TRACE_READ` | обʼєкт | `src/scripts/core/12-ai-agent.js:412` |
| `aiTraceReadMeta` | функція | `src/scripts/core/12-ai-agent.js:420` |
| `aiTraceStart` | функція | `src/scripts/core/12-ai-agent.js:438` |
| `aiTraceStep` | функція | `src/scripts/core/12-ai-agent.js:439` |
| `aiTraceEnd` | функція | `src/scripts/core/12-ai-agent.js:456` |
| `aiTraceRepaint` | функція | `src/scripts/core/12-ai-agent.js:461` |
| `aiTraceFinish` | функція | `src/scripts/core/12-ai-agent.js:467` |
| `FLOW_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:477` |
| `AI_AGENT_ADDON` | значення | `src/scripts/core/12-ai-agent.js:554` |
| `flowToolExec` | функція | `src/scripts/core/12-ai-agent.js:572` |
| `aiMissionLine` | функція | `src/scripts/core/12-ai-agent.js:599` |
| `aiJournalRead` | функція | `src/scripts/core/12-ai-agent.js:622` |
| `flowToolRead` | функція | `src/scripts/core/12-ai-agent.js:650` |
| `aiRemindWhen` | функція | `src/scripts/core/12-ai-agent.js:755` |
| `flowToolPlanner` | функція | `src/scripts/core/12-ai-agent.js:762` |
| `flowToolGoals` | функція | `src/scripts/core/12-ai-agent.js:833` |
| `aiToolConfirm` | функція | `src/scripts/core/12-ai-agent.js:898` |
| `aiFinConfirm` | функція | `src/scripts/core/12-ai-agent.js:917` |
| `flowToolFinance` | функція | `src/scripts/core/12-ai-agent.js:920` |
| `flowToolDiary` | функція | `src/scripts/core/12-ai-agent.js:1069` |
| `flowToolPatterns` | функція | `src/scripts/core/12-ai-agent.js:1119` |
| `flowToolMemory` | функція | `src/scripts/core/12-ai-agent.js:1140` |
| `aiMemGate` | функція | `src/scripts/core/12-ai-agent.js:1166` |
| `flowToolFolders` | функція | `src/scripts/core/12-ai-agent.js:1175` |
| `AI_MAIN_RE` | значення | `src/scripts/core/12-ai-agent.js:1232` |
| `aiPickModel` | функція | `src/scripts/core/12-ai-agent.js:1233` |
| `aiCacheMin` | функція | `src/scripts/core/12-ai-agent.js:1240` |
| `aiTokEst` | функція | `src/scripts/core/12-ai-agent.js:1245` |
| `aiCacheTail` | функція | `src/scripts/core/12-ai-agent.js:1250` |
| `aiUsageAdd` | функція | `src/scripts/core/12-ai-agent.js:1261` |
| `aiCallRaw` | функція | `src/scripts/core/12-ai-agent.js:1274` |
| `aiToolIsWrite` | функція | `src/scripts/core/12-ai-agent.js:1350` |
| `AI_WRITE_LIMIT` | значення | `src/scripts/core/12-ai-agent.js:1359` |
| `aiTurnWrites` | значення | `src/scripts/core/12-ai-agent.js:1360` |
| `aiTurnDone` | масив | `src/scripts/core/12-ai-agent.js:1361` |
| `aiDoneLine` | функція | `src/scripts/core/12-ai-agent.js:1365` |
| `aiToolWriteCost` | функція | `src/scripts/core/12-ai-agent.js:1383` |
| `AI_TOOL_OUT_MAX` | обʼєкт | `src/scripts/core/12-ai-agent.js:1391` |
| `aiToolOut` | функція | `src/scripts/core/12-ai-agent.js:1392` |
| `aiAgentTurn` | функція | `src/scripts/core/12-ai-agent.js:1397` |
| `aiFinMonthNet` | функція | `src/scripts/core/12-ai-agent.js:1467` |
| `aiFinCtx` | функція | `src/scripts/core/12-ai-agent.js:1475` |
| `aiCtx` | функція | `src/scripts/core/12-ai-agent.js:1495` |
| `aiFindGoal` | функція | `src/scripts/core/12-ai-agent.js:1537` |
| `aiParseBlocks` | функція | `src/scripts/core/12-ai-agent.js:1541` |
| `aiOpsCount` | функція | `src/scripts/core/12-ai-agent.js:1572` |
| `aiStreamText` | функція | `src/scripts/core/12-ai-agent.js:1577` |
| `aiOpDs` | функція | `src/scripts/core/12-ai-agent.js:1587` |
| `aiOpMatches` | функція | `src/scripts/core/12-ai-agent.js:1588` |
| `aiOpBlock` | функція | `src/scripts/core/12-ai-agent.js:1598` |
| `aiFindBlockByT` | функція | `src/scripts/core/12-ai-agent.js:1599` |
| `aiOpWarn` | функція | `src/scripts/core/12-ai-agent.js:1601` |
| `aiResolveOps` | функція | `src/scripts/core/12-ai-agent.js:1613` |
| `aiMissText` | функція | `src/scripts/core/12-ai-agent.js:1627` |
| `aiOpRow` | функція | `src/scripts/core/12-ai-agent.js:1634` |
| `aiGateOps` | функція | `src/scripts/core/12-ai-agent.js:1641` |
| `aiFindFolderKey` | функція | `src/scripts/core/12-ai-agent.js:1661` |
| `aiBuildPageBlock` | функція | `src/scripts/core/12-ai-agent.js:1669` |
| `aiApplyPages` | функція | `src/scripts/core/12-ai-agent.js:1687` |
| `aiApplyActions` | функція | `src/scripts/core/12-ai-agent.js:1710` |
| `aiCommit` | функція | `src/scripts/core/12-ai-agent.js:1797` |
| `aiUndo` | функція | `src/scripts/core/12-ai-agent.js:1813` |

### `src/scripts/core/13-pets.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FLOW_PETS` | обʼєкт | `src/scripts/core/13-pets.js:2` |
| `PETS_LEGACY_HIDDEN` | значення | `src/scripts/core/13-pets.js:51` |
| `petCur` | функція | `src/scripts/core/13-pets.js:52` |
| `petPersona` | функція | `src/scripts/core/13-pets.js:56` |
| `petSVG` | функція | `src/scripts/core/13-pets.js:57` |
| `petPickerSheet` | функція | `src/scripts/core/13-pets.js:99` |
| `petSleeping` | функція | `src/scripts/core/13-pets.js:166` |
| `petSleepSet` | функція | `src/scripts/core/13-pets.js:167` |
| `window.petWake` | функція | `src/scripts/core/13-pets.js:168` |
| `fcPos` | функція | `src/scripts/core/13-pets.js:169` |
| `fcClamp` | функція | `src/scripts/core/13-pets.js:170` |
| `fcApplyPos` | функція | `src/scripts/core/13-pets.js:175` |
| `fcBindDrag` | функція | `src/scripts/core/13-pets.js:181` |
| `fcBurst` | функція | `src/scripts/core/13-pets.js:219` |

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
| `__frSayT` | значення | `src/scripts/core/14-react.js:80` |
| `flowSay` | функція | `src/scripts/core/14-react.js:81` |
| `window.flowReact` | значення | `src/scripts/core/14-react.js:91` |
| `FC_EMO` | обʼєкт | `src/scripts/core/14-react.js:92` |
| `fcEmote` | функція | `src/scripts/core/14-react.js:93` |
| `fcLifeTimer` | значення | `src/scripts/core/14-react.js:104` |
| `fcLifeStart` | функція | `src/scripts/core/14-react.js:105` |
| `petSVGSleep` | функція | `src/scripts/core/14-react.js:116` |
| `AI_HAM_ACTS` | масив | `src/scripts/core/14-react.js:125` |
| `aiHamAct` | функція | `src/scripts/core/14-react.js:133` |
| `aiHamNextAct` | функція | `src/scripts/core/14-react.js:137` |
| `aiHamCoreHTML` | функція | `src/scripts/core/14-react.js:143` |
| `aiHamSceneHTML` | функція | `src/scripts/core/14-react.js:155` |
| `aiHamRotT` | значення | `src/scripts/core/14-react.js:164` |
| `aiHamRotStart` | функція | `src/scripts/core/14-react.js:165` |
| `aiHamWakeFrom` | функція | `src/scripts/core/14-react.js:175` |
| `aiHamBind` | функція | `src/scripts/core/14-react.js:182` |
| `aiWakeInChat` | функція | `src/scripts/core/14-react.js:188` |
| `petSleepNow` | функція | `src/scripts/core/14-react.js:202` |
| `window.petSleepNow` | значення | `src/scripts/core/14-react.js:214` |
| `fcWakeNow` | функція | `src/scripts/core/14-react.js:215` |
| `window.petWake` | значення | `src/scripts/core/14-react.js:225` |
| `FC_SAY` | обʼєкт | `src/scripts/core/14-react.js:227` |
| `fcSayPick` | функція | `src/scripts/core/14-react.js:245` |
| `fcSayTimer` | значення | `src/scripts/core/14-react.js:258` |
| `fcSayHide` | функція | `src/scripts/core/14-react.js:259` |
| `fcSayShow` | функція | `src/scripts/core/14-react.js:260` |
| `fcSayStart` | функція | `src/scripts/core/14-react.js:292` |
| `flowCapRender` | функція | `src/scripts/core/14-react.js:297` |
| `fcCheckOverlap` | функція | `src/scripts/core/14-react.js:328` |
| `window.fcCheckOverlap` | значення | `src/scripts/core/14-react.js:329` |
| `petHidden` | функція | `src/scripts/core/14-react.js:331` |
| `petHiddenSet` | функція | `src/scripts/core/14-react.js:332` |
| `t` | значення | `src/scripts/core/14-react.js:335` |
| `sched` | функція | `src/scripts/core/14-react.js:336` |

### `src/scripts/core/15-flow-spot.js` — 89 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `spotMsgs` | масив | `src/scripts/core/15-flow-spot.js:2` |
| `spotCtx` | функція | `src/scripts/core/15-flow-spot.js:3` |
| `spotChips` | функція | `src/scripts/core/15-flow-spot.js:16` |
| `spotAddon` | функція | `src/scripts/core/15-flow-spot.js:24` |
| `aiParsePage` | функція | `src/scripts/core/15-flow-spot.js:36` |
| `applyPageBlocks` | функція | `src/scripts/core/15-flow-spot.js:43` |
| `flowSpotEl` | функція | `src/scripts/core/15-flow-spot.js:70` |
| `flowSpotToggle` | функція | `src/scripts/core/15-flow-spot.js:92` |
| `flowSpotOpen` | функція | `src/scripts/core/15-flow-spot.js:93` |
| `flowSpotClose` | функція | `src/scripts/core/15-flow-spot.js:108` |
| `flowSpotSend` | функція | `src/scripts/core/15-flow-spot.js:109` |
| `spotMicToggle` | функція | `src/scripts/core/15-flow-spot.js:158` |
| `window.flowCapRender` | значення | `src/scripts/core/15-flow-spot.js:187` |
| `window.flowSpotOpen` | значення | `src/scripts/core/15-flow-spot.js:188` |
| `aiChatSheet` | функція | `src/scripts/core/15-flow-spot.js:191` |
| `aiClose` | функція | `src/scripts/core/15-flow-spot.js:224` |
| `aiDayPct` | функція | `src/scripts/core/15-flow-spot.js:231` |
| `aiVoiceOn` | значення | `src/scripts/core/15-flow-spot.js:238` |
| `aiSpeakStop` | функція | `src/scripts/core/15-flow-spot.js:240` |
| `aiSpeak` | функція | `src/scripts/core/15-flow-spot.js:241` |
| `aiVoiceToggle` | функція | `src/scripts/core/15-flow-spot.js:281` |
| `aiRenderHead` | функція | `src/scripts/core/15-flow-spot.js:288` |
| `aiMemSheet` | функція | `src/scripts/core/15-flow-spot.js:335` |
| `aiRenderViews` | функція | `src/scripts/core/15-flow-spot.js:357` |
| `aiLogHTML` | функція | `src/scripts/core/15-flow-spot.js:362` |
| `aiTlHTML` | функція | `src/scripts/core/15-flow-spot.js:369` |
| `aiActsHTML` | функція | `src/scripts/core/15-flow-spot.js:392` |
| `aiTraceLiveHTML` | функція | `src/scripts/core/15-flow-spot.js:432` |
| `aiTraceRowHTML` | функція | `src/scripts/core/15-flow-spot.js:438` |
| `AI_SHELF_GO` | обʼєкт | `src/scripts/core/15-flow-spot.js:443` |
| `aiShelfHTML` | функція | `src/scripts/core/15-flow-spot.js:444` |
| `aiTraceKpisHTML` | функція | `src/scripts/core/15-flow-spot.js:454` |
| `aiWireBody` | функція | `src/scripts/core/15-flow-spot.js:469` |
| `aiChipsHTML` | функція | `src/scripts/core/15-flow-spot.js:489` |
| `AI_SVG` | обʼєкт | `src/scripts/core/15-flow-spot.js:495` |
| `AI_ICO` | обʼєкт | `src/scripts/core/15-flow-spot.js:503` |
| `aiIco` | функція | `src/scripts/core/15-flow-spot.js:526` |
| `aiMD` | функція | `src/scripts/core/15-flow-spot.js:531` |
| `aiBusyHTML` | функція | `src/scripts/core/15-flow-spot.js:537` |
| `aiSlashHide` | функція | `src/scripts/core/15-flow-spot.js:545` |
| `aiSlashShow` | функція | `src/scripts/core/15-flow-spot.js:546` |
| `aiAttachRender` | функція | `src/scripts/core/15-flow-spot.js:561` |
| `aiImgShrink` | функція | `src/scripts/core/15-flow-spot.js:573` |
| `aiFileB64` | функція | `src/scripts/core/15-flow-spot.js:590` |
| `aiPickFile` | функція | `src/scripts/core/15-flow-spot.js:598` |
| `aiPlusSheet` | функція | `src/scripts/core/15-flow-spot.js:624` |
| `aiPromptsSheet` | функція | `src/scripts/core/15-flow-spot.js:644` |
| `aiPromptEdit` | функція | `src/scripts/core/15-flow-spot.js:663` |
| `aiEnvKpi` | функція | `src/scripts/core/15-flow-spot.js:680` |
| `aiPlanCardHTML` | функція | `src/scripts/core/15-flow-spot.js:688` |
| `aiRenderBody` | функція | `src/scripts/core/15-flow-spot.js:714` |
| `AI_SKILLS` | обʼєкт | `src/scripts/core/15-flow-spot.js:764` |
| `aiSkillFor` | функція | `src/scripts/core/15-flow-spot.js:776` |
| `aiSumBusy` | значення | `src/scripts/core/15-flow-spot.js:783` |
| `aiMaybeSummarize` | функція | `src/scripts/core/15-flow-spot.js:784` |
| `aiChatSend` | функція | `src/scripts/core/15-flow-spot.js:797` |
| `aiRec` | значення | `src/scripts/core/15-flow-spot.js:917` |
| `aiMicUI` | функція | `src/scripts/core/15-flow-spot.js:918` |
| `aiMicToggle` | функція | `src/scripts/core/15-flow-spot.js:919` |
| `aiTranscribeBlob` | функція | `src/scripts/core/15-flow-spot.js:957` |
| `aiTranscribe` | функція | `src/scripts/core/15-flow-spot.js:980` |
| `window.aiChatSheet` | значення | `src/scripts/core/15-flow-spot.js:984` |
| `plStreak` | функція | `src/scripts/core/15-flow-spot.js:986` |
| `heroWeekDays` | функція | `src/scripts/core/15-flow-spot.js:1006` |
| `heroMonthDays` | функція | `src/scripts/core/15-flow-spot.js:1023` |
| `heroDayWord` | функція | `src/scripts/core/15-flow-spot.js:1032` |
| `renderHeroStreak` | функція | `src/scripts/core/15-flow-spot.js:1038` |
| `plBlocksDisplay` | функція | `src/scripts/core/15-flow-spot.js:1063` |
| `plFolderComplete` | функція | `src/scripts/core/15-flow-spot.js:1077` |
| `DOW_UA` | масив | `src/scripts/core/15-flow-spot.js:1082` |
| `plRuleDowsLabel` | функція | `src/scripts/core/15-flow-spot.js:1083` |
| `plFolderAddBlock` | функція | `src/scripts/core/15-flow-spot.js:1092` |
| `plFolderDaySheet` | функція | `src/scripts/core/15-flow-spot.js:1098` |
| `plFolderMonthSheet` | функція | `src/scripts/core/15-flow-spot.js:1153` |
| `plMxSchedule` | функція | `src/scripts/core/15-flow-spot.js:1215` |
| `plSlotTask` | функція | `src/scripts/core/15-flow-spot.js:1229` |
| `plBlockEnd` | функція | `src/scripts/core/15-flow-spot.js:1243` |
| `plTaskCard` | функція | `src/scripts/core/15-flow-spot.js:1244` |
| `plAdd` | функція | `src/scripts/core/15-flow-spot.js:1267` |
| `plAddBlockAt` | функція | `src/scripts/core/15-flow-spot.js:1294` |
| `plLinkTag` | функція | `src/scripts/core/15-flow-spot.js:1299` |
| `plScheduleStep` | функція | `src/scripts/core/15-flow-spot.js:1307` |
| `plMicroBlock` | функція | `src/scripts/core/15-flow-spot.js:1324` |
| `plCompleteBlock` | функція | `src/scripts/core/15-flow-spot.js:1337` |
| `plUncompleteEffects` | функція | `src/scripts/core/15-flow-spot.js:1394` |
| `plToast` | функція | `src/scripts/core/15-flow-spot.js:1411` |
| `plBlockSheet` | функція | `src/scripts/core/15-flow-spot.js:1419` |
| `plEditBlock` | функція | `src/scripts/core/15-flow-spot.js:1643` |
| `plRangeSheet` | функція | `src/scripts/core/15-flow-spot.js:1646` |

### `src/scripts/core/16-dashboard.js` — 83 сутностей

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
| `FC3_IC` | обʼєкт | `src/scripts/core/16-dashboard.js:204` |
| `fc3Svg` | функція | `src/scripts/core/16-dashboard.js:208` |
| `fc3Meta` | функція | `src/scripts/core/16-dashboard.js:210` |
| `fc3Tile` | функція | `src/scripts/core/16-dashboard.js:225` |
| `fc3GroupRow` | функція | `src/scripts/core/16-dashboard.js:269` |
| `fc3Add` | функція | `src/scripts/core/16-dashboard.js:286` |
| `prioHeadLast` | значення | `src/scripts/core/16-dashboard.js:293` |
| `prioHeadReset` | функція | `src/scripts/core/16-dashboard.js:294` |
| `prioHeadMaybe` | функція | `src/scripts/core/16-dashboard.js:295` |
| `renderFolderCovers` | функція | `src/scripts/core/16-dashboard.js:301` |
| `renderDashboard` | функція | `src/scripts/core/16-dashboard.js:333` |
| `inputModal` | функція | `src/scripts/core/16-dashboard.js:448` |
| `createFolder` | функція | `src/scripts/core/16-dashboard.js:490` |
| `groupKids` | функція | `src/scripts/core/16-dashboard.js:513` |
| `hideFolderHint` | функція | `src/scripts/core/16-dashboard.js:517` |
| `isFolderGroup` | функція | `src/scripts/core/16-dashboard.js:522` |
| `window.isFolderGroup` | значення | `src/scripts/core/16-dashboard.js:523` |
| `fgIcon` | функція | `src/scripts/core/16-dashboard.js:524` |
| `fgSub` | функція | `src/scripts/core/16-dashboard.js:527` |
| `fgToast` | функція | `src/scripts/core/16-dashboard.js:534` |
| `fgSheet` | функція | `src/scripts/core/16-dashboard.js:535` |
| `openFolderGroup` | функція | `src/scripts/core/16-dashboard.js:547` |
| `GVIEW` | обʼєкт | `src/scripts/core/16-dashboard.js:580` |
| `gviewOf` | функція | `src/scripts/core/16-dashboard.js:581` |
| `openGroupAsChosen` | функція | `src/scripts/core/16-dashboard.js:582` |
| `window.openGroupAsChosen` | значення | `src/scripts/core/16-dashboard.js:589` |
| `openFolderGroupSpace` | функція | `src/scripts/core/16-dashboard.js:592` |
| `openFolderGroupIOS` | функція | `src/scripts/core/16-dashboard.js:636` |
| `openGroupViewSheet` | функція | `src/scripts/core/16-dashboard.js:657` |
| `openFolderPrioSheet` | функція | `src/scripts/core/16-dashboard.js:674` |
| `openFolderGroupAdd` | функція | `src/scripts/core/16-dashboard.js:695` |
| `openNewFolderChoice` | функція | `src/scripts/core/16-dashboard.js:713` |
| `openFolderMerge` | функція | `src/scripts/core/16-dashboard.js:729` |
| `FV_PREV` | обʼєкт | `src/scripts/core/16-dashboard.js:774` |
| `openFolderViewSheet` | функція | `src/scripts/core/16-dashboard.js:782` |
| `pgBarFolder` | функція | `src/scripts/core/16-dashboard.js:831` |
| `pgBarSwitchGroup` | функція | `src/scripts/core/16-dashboard.js:833` |
| `pgBarSync` | функція | `src/scripts/core/16-dashboard.js:838` |
| `pgBarHasCond` | функція | `src/scripts/core/16-dashboard.js:852` |
| `pgBarSwitchSheet` | функція | `src/scripts/core/16-dashboard.js:859` |
| `pgDocStripHTML` | функція | `src/scripts/core/16-dashboard.js:880` |
| `pgDocStripBind` | функція | `src/scripts/core/16-dashboard.js:890` |
| `pgBarMoreSheet` | функція | `src/scripts/core/16-dashboard.js:898` |
| `pgBarInit` | функція | `src/scripts/core/16-dashboard.js:909` |
| `createProjectFolder` | функція | `src/scripts/core/16-dashboard.js:932` |
| `openPhotoCropEditor` | функція | `src/scripts/core/16-dashboard.js:960` |
| `FM_IC` | обʼєкт | `src/scripts/core/16-dashboard.js:1032` |
| `fmIc` | функція | `src/scripts/core/16-dashboard.js:1053` |
| `fmRow` | функція | `src/scripts/core/16-dashboard.js:1054` |
| `FM_TYPE` | обʼєкт | `src/scripts/core/16-dashboard.js:1055` |
| `fmSwRow` | функція | `src/scripts/core/16-dashboard.js:1060` |
| `FM_VIEW` | масив | `src/scripts/core/16-dashboard.js:1061` |
| `openFolderMenu` | функція | `src/scripts/core/16-dashboard.js:1062` |
| `fmSwSet` | функція | `src/scripts/core/16-dashboard.js:1137` |
| `fmDocText` | функція | `src/scripts/core/16-dashboard.js:1140` |
| `fmCopyText` | функція | `src/scripts/core/16-dashboard.js:1160` |
| `fmPhotoData` | функція | `src/scripts/core/16-dashboard.js:1177` |
| `fmDupBusy` | значення | `src/scripts/core/16-dashboard.js:1187` |
| `fmDuplicate` | функція | `src/scripts/core/16-dashboard.js:1188` |
| `fmCopyTree` | функція | `src/scripts/core/16-dashboard.js:1228` |
| `fmSetView` | функція | `src/scripts/core/16-dashboard.js:1293` |
| `openFolderLook` | функція | `src/scripts/core/16-dashboard.js:1302` |
| `openFolderType` | функція | `src/scripts/core/16-dashboard.js:1318` |
| `closeFolderMenu` | функція | `src/scripts/core/16-dashboard.js:1340` |
| `openFolderIconPicker` | функція | `src/scripts/core/16-dashboard.js:1349` |
| `folderPathName` | функція | `src/scripts/core/16-dashboard.js:1384` |
| `openFolderMovePicker` | функція | `src/scripts/core/16-dashboard.js:1386` |
| `folderAction` | функція | `src/scripts/core/16-dashboard.js:1427` |
| `pickFolderPhoto` | функція | `src/scripts/core/16-dashboard.js:1483` |

### `src/scripts/core/17-folder-render.js` — 2 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `debtTotals` | функція | `src/scripts/core/17-folder-render.js:5` |
| `debtSummary` | функція | `src/scripts/core/17-folder-render.js:10` |

### `src/scripts/core/18-debts.js` — 19 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CUR` | обʼєкт | `src/scripts/core/18-debts.js:5` |
| `DEBT_KEY` | значення | `src/scripts/core/18-debts.js:6` |
| `debtKind` | значення | `src/scripts/core/18-debts.js:7` |
| `debtSave` | функція | `src/scripts/core/18-debts.js:15` |
| `initials` | функція | `src/scripts/core/18-debts.js:18` |
| `sanitizeRich` | функція | `src/scripts/core/18-debts.js:27` |
| `safeHref` | функція | `src/scripts/core/18-debts.js:58` |
| `sanitizeStoredRich` | функція | `src/scripts/core/18-debts.js:69` |
| `safeImg` | функція | `src/scripts/core/18-debts.js:91` |
| `balance` | функція | `src/scripts/core/18-debts.js:107` |
| `debtRender` | функція | `src/scripts/core/18-debts.js:121` |
| `toggleDebtSync` | функція | `src/scripts/core/18-debts.js:160` |
| `curId` | значення | `src/scripts/core/18-debts.js:190` |
| `openModal` | функція | `src/scripts/core/18-debts.js:191` |
| `closeModal` | функція | `src/scripts/core/18-debts.js:194` |
| `renderModal` | функція | `src/scripts/core/18-debts.js:197` |
| `askOp` | функція | `src/scripts/core/18-debts.js:226` |
| `commitOp` | функція | `src/scripts/core/18-debts.js:235` |
| `delOp` | функція | `src/scripts/core/18-debts.js:244` |

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
| `transferPlannedToEnvelopes` | функція | `src/scripts/core/20-work.js:287` |
| `workPlannedTotal` | функція | `src/scripts/core/20-work.js:305` |
| `openAllocModal` | функція | `src/scripts/core/20-work.js:309` |
| `allocUpdateSummary` | функція | `src/scripts/core/20-work.js:332` |
| `allocSave` | функція | `src/scripts/core/20-work.js:343` |
| `renderWork` | функція | `src/scripts/core/20-work.js:360` |
| `workShiftMonth` | функція | `src/scripts/core/20-work.js:463` |
| `pushWorkBatch` | функція | `src/scripts/core/20-work.js:471` |
| `pushWorkToFin` | функція | `src/scripts/core/20-work.js:484` |
| `delWork` | функція | `src/scripts/core/20-work.js:502` |
| `clearWorkMonth` | функція | `src/scripts/core/20-work.js:512` |

### `src/scripts/core/21-patterns.js` — 6 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PAT_CKEY` | значення | `src/scripts/core/21-patterns.js:8` |
| `patChains` | масив | `src/scripts/core/21-patterns.js:9` |
| `patSaveTrans` | функція | `src/scripts/core/21-patterns.js:10` |
| `patDaysFrom` | функція | `src/scripts/core/21-patterns.js:13` |
| `patTCheck` | функція | `src/scripts/core/21-patterns.js:21` |
| `patLast7` | функція | `src/scripts/core/21-patterns.js:29` |

### `src/scripts/core/22-diary.js` — 62 сутностей

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
| `diaShelf` | функція | `src/scripts/core/22-diary.js:362` |
| `diaBookName` | функція | `src/scripts/core/22-diary.js:368` |
| `diaCreateBook` | функція | `src/scripts/core/22-diary.js:369` |
| `diaUpsertEntry` | функція | `src/scripts/core/22-diary.js:375` |
| `goDiaryBook` | функція | `src/scripts/core/22-diary.js:383` |
| `window.goDiaryBook` | значення | `src/scripts/core/22-diary.js:384` |
| `DIA_BOOK_EMOJIS` | масив | `src/scripts/core/22-diary.js:387` |
| `DIA_BOOK_COLORS` | масив | `src/scripts/core/22-diary.js:388` |
| `diaNewEmoji` | значення | `src/scripts/core/22-diary.js:389` |
| `renderDiaBooks` | функція | `src/scripts/core/22-diary.js:390` |
| `diaBookMonth` | значення | `src/scripts/core/22-diary.js:415` |
| `diaBookOpenId` | значення | `src/scripts/core/22-diary.js:416` |
| `renderDiaBook` | функція | `src/scripts/core/22-diary.js:417` |
| `diaRec` | значення | `src/scripts/core/22-diary.js:510` |
| `diaFmtDur` | функція | `src/scripts/core/22-diary.js:511` |
| `diaPlayAudio` | функція | `src/scripts/core/22-diary.js:512` |
| `diaRecord` | функція | `src/scripts/core/22-diary.js:513` |
| `window.diaRecord` | значення | `src/scripts/core/22-diary.js:544` |
| `diaBookRec` | значення | `src/scripts/core/22-diary.js:548` |
| `diaBookRecord` | функція | `src/scripts/core/22-diary.js:549` |

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
| `resortPinned` | функція | `src/scripts/core/23-board.js:37` |
| `BLOCK_TYPES` | обʼєкт | `src/scripts/core/23-board.js:47` |
| `ICONS` | обʼєкт | `src/scripts/core/23-board.js:90` |
| `blockIcon` | функція | `src/scripts/core/23-board.js:122` |
| `blockSearchText` | функція | `src/scripts/core/23-board.js:131` |
| `collectBlocks` | функція | `src/scripts/core/23-board.js:147` |
| `window.flowSearchBoards` | функція | `src/scripts/core/23-board.js:156` |
| `window.flowOpenBlock` | функція | `src/scripts/core/23-board.js:173` |
| `undoSnapshot` | значення | `src/scripts/core/23-board.js:192` |
| `snapshotForUndo` | функція | `src/scripts/core/23-board.js:193` |
| `flowUndoToast` | функція | `src/scripts/core/23-board.js:206` |
| `window.flowUndoToast` | значення | `src/scripts/core/23-board.js:216` |
| `hideUndo` | функція | `src/scripts/core/23-board.js:217` |
| `doUndo` | функція | `src/scripts/core/23-board.js:218` |
| `INBOX_TITLE` | значення | `src/scripts/core/23-board.js:239` |
| `INBOX_FKEY` | значення | `src/scripts/core/23-board.js:240` |
| `ensureInboxFolder` | функція | `src/scripts/core/23-board.js:241` |
| `openQuickCapture` | функція | `src/scripts/core/23-board.js:254` |
| `closeQuickCapture` | функція | `src/scripts/core/23-board.js:260` |
| `saveQuickCapture` | функція | `src/scripts/core/23-board.js:261` |
| `window.flowQuickCapture` | значення | `src/scripts/core/23-board.js:289` |
| `window.flowOpenInbox` | функція | `src/scripts/core/23-board.js:291` |

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
| `findParentArr` | функція | `src/scripts/core/26-blocks-render.js:15` |
| `delBlock` | функція | `src/scripts/core/26-blocks-render.js:25` |
| `getBlock` | функція | `src/scripts/core/26-blocks-render.js:37` |
| `renderBoard` | функція | `src/scripts/core/26-blocks-render.js:42` |
| `defaultSize` | функція | `src/scripts/core/26-blocks-render.js:51` |
| `autoSize` | функція | `src/scripts/core/26-blocks-render.js:56` |
| `szClass` | функція | `src/scripts/core/26-blocks-render.js:69` |
| `headBar` | функція | `src/scripts/core/26-blocks-render.js:75` |
| `BENTO_SKIP` | обʼєкт | `src/scripts/core/26-blocks-render.js:98` |
| `renderTileFull` | функція | `src/scripts/core/26-blocks-render.js:100` |
| `bentoSectionsHtml` | функція | `src/scripts/core/26-blocks-render.js:113` |
| `renderTile` | функція | `src/scripts/core/26-blocks-render.js:143` |
| `focusItem` | функція | `src/scripts/core/26-blocks-render.js:607` |
| `bindTiles` | функція | `src/scripts/core/26-blocks-render.js:616` |

### `src/scripts/core/27-canvas.js` — 28 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `openCardStyle` | функція | `src/scripts/core/27-canvas.js:2` |
| `escAttr` | функція | `src/scripts/core/27-canvas.js:24` |
| `migrate` | функція | `src/scripts/core/27-canvas.js:29` |
| `normalizeBlocks` | функція | `src/scripts/core/27-canvas.js:35` |
| `inboxMigrateOnce` | функція | `src/scripts/core/27-canvas.js:66` |
| `agencyPurgeOnce` | функція | `src/scripts/core/27-canvas.js:107` |
| `migSpacePurge` | функція | `src/scripts/core/27-canvas.js:144` |
| `migLegacyWidgets` | функція | `src/scripts/core/27-canvas.js:175` |
| `migBoardPat` | функція | `src/scripts/core/27-canvas.js:177` |
| `migForceLayoutOff` | функція | `src/scripts/core/27-canvas.js:183` |
| `MIGRATIONS_ONCE` | масив | `src/scripts/core/27-canvas.js:213` |
| `migDeferred` | значення | `src/scripts/core/27-canvas.js:233` |
| `runMigrations` | функція | `src/scripts/core/27-canvas.js:234` |
| `applyFolderCfgRaw` | функція | `src/scripts/core/27-canvas.js:273` |
| `applyFolderOrderRaw` | функція | `src/scripts/core/27-canvas.js:295` |
| `loadInFlight` | значення | `src/scripts/core/27-canvas.js:305` |
| `load` | функція | `src/scripts/core/27-canvas.js:306` |
| `loadOnce` | функція | `src/scripts/core/27-canvas.js:311` |
| `vv` | значення | `src/scripts/core/27-canvas.js:511` |
| `FIELD` | значення | `src/scripts/core/27-canvas.js:512` |
| `isField` | функція | `src/scripts/core/27-canvas.js:514` |
| `kbHeight` | функція | `src/scripts/core/27-canvas.js:517` |
| `syncKb` | функція | `src/scripts/core/27-canvas.js:521` |
| `unshift` | функція | `src/scripts/core/27-canvas.js:531` |
| `ensureVisible` | функція | `src/scripts/core/27-canvas.js:536` |
| `VISION_FKEY` | значення | `src/scripts/core/27-canvas.js:572` |
| `migrateFolderPhotosOnce` | функція | `src/scripts/core/27-canvas.js:579` |
| `removeSystemSeedFoldersOnce` | функція | `src/scripts/core/27-canvas.js:597` |

### `src/scripts/core/28-vision.js` — 3 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `VZKEY` | значення | `src/scripts/core/28-vision.js:5` |
| `vzData` | обʼєкт | `src/scripts/core/28-vision.js:6` |
| `vzNorm` | функція | `src/scripts/core/28-vision.js:8` |

### `src/scripts/core/29-more-screen.js` — 30 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `LITE_DOORS` | масив | `src/scripts/core/29-more-screen.js:12` |
| `DEV_ROWS` | масив | `src/scripts/core/29-more-screen.js:17` |
| `ico` | функція | `src/scripts/core/29-more-screen.js:22` |
| `chev` | функція | `src/scripts/core/29-more-screen.js:23` |
| `rowHTML` | функція | `src/scripts/core/29-more-screen.js:24` |
| `renderMore` | функція | `src/scripts/core/29-more-screen.js:29` |
| `MSEC` | масив | `src/scripts/core/29-more-screen.js:51` |
| `moreIsWide` | функція | `src/scripts/core/29-more-screen.js:53` |
| `renderMoreIndex` | функція | `src/scripts/core/29-more-screen.js:54` |
| `moreShowSection` | функція | `src/scripts/core/29-more-screen.js:62` |
| `window.moreShowSection` | значення | `src/scripts/core/29-more-screen.js:71` |
| `openMoreSheet` | функція | `src/scripts/core/29-more-screen.js:73` |
| `goMore` | функція | `src/scripts/core/29-more-screen.js:95` |
| `window.goMore` | значення | `src/scripts/core/29-more-screen.js:102` |
| `escA` | функція | `src/scripts/core/29-more-screen.js:105` |
| `safeImgA` | функція | `src/scripts/core/29-more-screen.js:106` |
| `readAvatarFile` | функція | `src/scripts/core/29-more-screen.js:108` |
| `syncLabel` | функція | `src/scripts/core/29-more-screen.js:129` |
| `flowStorageInfo` | функція | `src/scripts/core/29-more-screen.js:147` |
| `fmtMem` | функція | `src/scripts/core/29-more-screen.js:156` |
| `fillMemRow` | функція | `src/scripts/core/29-more-screen.js:157` |
| `renderAccount` | функція | `src/scripts/core/29-more-screen.js:172` |
| `window.renderAccount` | значення | `src/scripts/core/29-more-screen.js:575` |
| `maskMail` | функція | `src/scripts/core/29-more-screen.js:582` |
| `foreignWipe` | функція | `src/scripts/core/29-more-screen.js:583` |
| `foreignAsk` | функція | `src/scripts/core/29-more-screen.js:598` |
| `window.flowForeignAsk` | значення | `src/scripts/core/29-more-screen.js:608` |
| `hm` | значення | `src/scripts/core/29-more-screen.js:621` |
| `na` | функція | `src/scripts/core/29-more-screen.js:622` |
| `nm` | значення | `src/scripts/core/29-more-screen.js:623` |

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
| `upSha256` | функція | `src/scripts/core/30-upgrade.js:69` |
| `window.upDevOn` | значення | `src/scripts/core/30-upgrade.js:75` |
| `window.upProfile` | функція | `src/scripts/core/30-upgrade.js:77` |
| `upOverall` | функція | `src/scripts/core/30-upgrade.js:79` |
| `upUserName` | функція | `src/scripts/core/30-upgrade.js:85` |
| `upAvatarHTML` | функція | `src/scripts/core/30-upgrade.js:90` |
| `upSphereCard` | функція | `src/scripts/core/30-upgrade.js:98` |
| `renderUpgrade` | функція | `src/scripts/core/30-upgrade.js:107` |
| `upLastSnapLine` | функція | `src/scripts/core/30-upgrade.js:136` |
| `upEditPath` | функція | `src/scripts/core/30-upgrade.js:146` |
| `upEditSphere` | функція | `src/scripts/core/30-upgrade.js:154` |
| `upCollectDays` | функція | `src/scripts/core/30-upgrade.js:166` |
| `upBuildPrompt` | функція | `src/scripts/core/30-upgrade.js:181` |
| `upParseVerdict` | функція | `src/scripts/core/30-upgrade.js:201` |
| `upSheet` | функція | `src/scripts/core/30-upgrade.js:217` |
| `upApplyVerdict` | функція | `src/scripts/core/30-upgrade.js:231` |
| `upAnalyze` | функція | `src/scripts/core/30-upgrade.js:245` |
| `goUpgrade` | функція | `src/scripts/core/30-upgrade.js:289` |
| `window.goUpgrade` | значення | `src/scripts/core/30-upgrade.js:300` |

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
| `chOpenFolder` | функція | `src/scripts/core/35-channel.js:243` |
| `chFolderChipSheet` | функція | `src/scripts/core/35-channel.js:249` |
| `chAttachLongPress` | функція | `src/scripts/core/35-channel.js:261` |
| `renderChFeed` | функція | `src/scripts/core/35-channel.js:271` |
| `chAppendFeed` | функція | `src/scripts/core/35-channel.js:308` |
| `chEagerPhotos` | функція | `src/scripts/core/35-channel.js:326` |
| `chBubble` | функція | `src/scripts/core/35-channel.js:331` |
| `chAiSync` | функція | `src/scripts/core/35-channel.js:378` |
| `chAiCollect` | функція | `src/scripts/core/35-channel.js:395` |
| `chAiSummarize` | функція | `src/scripts/core/35-channel.js:421` |
| `chBindFeed` | функція | `src/scripts/core/35-channel.js:464` |
| `chJumpTo` | функція | `src/scripts/core/35-channel.js:486` |
| `chRecordSheet` | функція | `src/scripts/core/35-channel.js:498` |
| `chEditRecord` | функція | `src/scripts/core/35-channel.js:517` |
| `chCopyToFolder` | функція | `src/scripts/core/35-channel.js:538` |
| `chPickCopyTarget` | функція | `src/scripts/core/35-channel.js:545` |
| `chDeleteRecord` | функція | `src/scripts/core/35-channel.js:554` |
| `chInitComposer` | функція | `src/scripts/core/35-channel.js:563` |
| `chAutoGrow` | функція | `src/scripts/core/35-channel.js:608` |
| `chSyncSend` | функція | `src/scripts/core/35-channel.js:609` |
| `chSetMode` | функція | `src/scripts/core/35-channel.js:615` |
| `chToggleTray` | функція | `src/scripts/core/35-channel.js:621` |
| `chPushBlock` | функція | `src/scripts/core/35-channel.js:627` |
| `chSend` | функція | `src/scripts/core/35-channel.js:634` |
| `chPickFile` | функція | `src/scripts/core/35-channel.js:647` |
| `chShrink` | функція | `src/scripts/core/35-channel.js:653` |
| `chVoice` | функція | `src/scripts/core/35-channel.js:664` |
| `chSheet` | функція | `src/scripts/core/35-channel.js:695` |

### `src/scripts/core/36-chats.js` — 149 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CHATS_KEY` | значення | `src/scripts/core/36-chats.js:14` |
| `INBOX_CHAT` | значення | `src/scripts/core/36-chats.js:15` |
| `CHAT_PALETTE` | масив | `src/scripts/core/36-chats.js:16` |
| `chats` | масив | `src/scripts/core/36-chats.js:17` |
| `UTABS_KEY` | значення | `src/scripts/core/36-chats.js:25` |
| `UTAB_MAX` | значення | `src/scripts/core/36-chats.js:26` |
| `userTabs` | масив | `src/scripts/core/36-chats.js:27` |
| `utDel` | обʼєкт | `src/scripts/core/36-chats.js:28` |
| `UTAB_TOMB_MS` | значення | `src/scripts/core/36-chats.js:29` |
| `utIdOk` | функція | `src/scripts/core/36-chats.js:30` |
| `UTDEL_KEY` | значення | `src/scripts/core/36-chats.js:34` |
| `parseUTabs` | функція | `src/scripts/core/36-chats.js:35` |
| `parseUTDel` | функція | `src/scripts/core/36-chats.js:41` |
| `utMerge` | функція | `src/scripts/core/36-chats.js:49` |
| `applyUTabsRaw` | функція | `src/scripts/core/36-chats.js:60` |
| `utKeepLocal` | функція | `src/scripts/core/36-chats.js:67` |
| `utSaving` | значення | `src/scripts/core/36-chats.js:71` |
| `saveUTabs` | функція | `src/scripts/core/36-chats.js:72` |
| `utById` | функція | `src/scripts/core/36-chats.js:84` |
| `itemTab` | функція | `src/scripts/core/36-chats.js:86` |
| `folderTabOf` | функція | `src/scripts/core/36-chats.js:88` |
| `HTAB_KEY` | значення | `src/scripts/core/36-chats.js:96` |
| `HTABS` | масив | `src/scripts/core/36-chats.js:97` |
| `htabOk` | функція | `src/scripts/core/36-chats.js:98` |
| `homeTab` | значення | `src/scripts/core/36-chats.js:99` |
| `utCatchAt` | значення | `src/scripts/core/36-chats.js:104` |
| `utCatchup` | функція | `src/scripts/core/36-chats.js:105` |
| `utTrusted` | функція | `src/scripts/core/36-chats.js:111` |
| `homeUserTab` | функція | `src/scripts/core/36-chats.js:116` |
| `homeKeysForTab` | функція | `src/scripts/core/36-chats.js:118` |
| `homeChatsForTab` | функція | `src/scripts/core/36-chats.js:119` |
| `homeFolderCount` | функція | `src/scripts/core/36-chats.js:120` |
| `chatBk` | функція | `src/scripts/core/36-chats.js:122` |
| `chatById` | функція | `src/scripts/core/36-chats.js:123` |
| `chatsForFolder` | функція | `src/scripts/core/36-chats.js:124` |
| `chatFolders` | функція | `src/scripts/core/36-chats.js:126` |
| `chatUid` | функція | `src/scripts/core/36-chats.js:127` |
| `normChat` | функція | `src/scripts/core/36-chats.js:128` |
| `saveChats` | функція | `src/scripts/core/36-chats.js:134` |
| `applyChatsRaw` | функція | `src/scripts/core/36-chats.js:137` |
| `chatCreate` | функція | `src/scripts/core/36-chats.js:143` |
| `createChat` | функція | `src/scripts/core/36-chats.js:156` |
| `chatRename` | функція | `src/scripts/core/36-chats.js:165` |
| `chatDelete` | функція | `src/scripts/core/36-chats.js:174` |
| `chatsRefresh` | функція | `src/scripts/core/36-chats.js:188` |
| `ensureInboxChat` | функція | `src/scripts/core/36-chats.js:195` |
| `chatsMigrateInboxOnce` | функція | `src/scripts/core/36-chats.js:211` |
| `chatLinkFolder` | функція | `src/scripts/core/36-chats.js:243` |
| `chatUnlinkFolder` | функція | `src/scripts/core/36-chats.js:253` |
| `linkableFolders` | функція | `src/scripts/core/36-chats.js:258` |
| `chatAddSheet` | функція | `src/scripts/core/36-chats.js:264` |
| `newFolderForChat` | функція | `src/scripts/core/36-chats.js:279` |
| `pickFolderForChat` | функція | `src/scripts/core/36-chats.js:291` |
| `setHomeTab` | функція | `src/scripts/core/36-chats.js:302` |
| `HTV_KEY` | значення | `src/scripts/core/36-chats.js:312` |
| `htvOk` | функція | `src/scripts/core/36-chats.js:313` |
| `htabsView` | значення | `src/scripts/core/36-chats.js:314` |
| `setHtabsView` | функція | `src/scripts/core/36-chats.js:317` |
| `htInfo` | функція | `src/scripts/core/36-chats.js:318` |
| `renderHtDrop` | функція | `src/scripts/core/36-chats.js:326` |
| `toggleHtDrop` | функція | `src/scripts/core/36-chats.js:349` |
| `renderUserTabs` | функція | `src/scripts/core/36-chats.js:359` |
| `bindUserTab` | функція | `src/scripts/core/36-chats.js:377` |
| `newUserTab` | функція | `src/scripts/core/36-chats.js:384` |
| `userTabMenu` | функція | `src/scripts/core/36-chats.js:398` |
| `deleteUserTab` | функція | `src/scripts/core/36-chats.js:413` |
| `userTabAddSheet` | функція | `src/scripts/core/36-chats.js:432` |
| `tabPickRows` | функція | `src/scripts/core/36-chats.js:450` |
| `tabLabel` | функція | `src/scripts/core/36-chats.js:455` |
| `moveFolderToTab` | функція | `src/scripts/core/36-chats.js:457` |
| `moveChatToTab` | функція | `src/scripts/core/36-chats.js:471` |
| `chatTabSheet` | функція | `src/scripts/core/36-chats.js:481` |
| `chatsHomeSync` | функція | `src/scripts/core/36-chats.js:490` |
| `chatLast` | функція | `src/scripts/core/36-chats.js:521` |
| `chatPreview` | функція | `src/scripts/core/36-chats.js:527` |
| `chatTimeLabel` | функція | `src/scripts/core/36-chats.js:536` |
| `renderChatList` | функція | `src/scripts/core/36-chats.js:543` |
| `chatMenu` | функція | `src/scripts/core/36-chats.js:572` |
| `openChatSettings` | функція | `src/scripts/core/36-chats.js:576` |
| `window.openChatSettings` | значення | `src/scripts/core/36-chats.js:621` |
| `pgFolderKey` | функція | `src/scripts/core/36-chats.js:624` |
| `renderPgLinks` | функція | `src/scripts/core/36-chats.js:625` |
| `pgSubStripHTML` | функція | `src/scripts/core/36-chats.js:648` |
| `pgHasSubsBlock` | функція | `src/scripts/core/36-chats.js:661` |
| `pgSubHTML` | функція | `src/scripts/core/36-chats.js:664` |
| `pgSubOpen` | функція | `src/scripts/core/36-chats.js:670` |
| `pgSubNew` | функція | `src/scripts/core/36-chats.js:671` |
| `FH_I` | обʼєкт | `src/scripts/core/36-chats.js:678` |
| `fhBridge` | функція | `src/scripts/core/36-chats.js:682` |
| `fhWalk` | функція | `src/scripts/core/36-chats.js:683` |
| `fhStats` | функція | `src/scripts/core/36-chats.js:685` |
| `fhTx` | функція | `src/scripts/core/36-chats.js:696` |
| `fhRichTx` | функція | `src/scripts/core/36-chats.js:698` |
| `fhPlain` | функція | `src/scripts/core/36-chats.js:700` |
| `fhLabel` | функція | `src/scripts/core/36-chats.js:701` |
| `fhCoverStyle` | функція | `src/scripts/core/36-chats.js:707` |
| `fhAvatar` | функція | `src/scripts/core/36-chats.js:719` |
| `fhChipsHTML` | функція | `src/scripts/core/36-chats.js:724` |
| `fhTitleHome` | функція | `src/scripts/core/36-chats.js:733` |
| `fhRender` | функція | `src/scripts/core/36-chats.js:737` |
| `FH_NOTE` | обʼєкт | `src/scripts/core/36-chats.js:777` |
| `FH_FILT` | обʼєкт | `src/scripts/core/36-chats.js:778` |
| `fhFilt` | обʼєкт | `src/scripts/core/36-chats.js:779` |
| `fhFiltKey` | функція | `src/scripts/core/36-chats.js:780` |
| `fhKidsHTML` | функція | `src/scripts/core/36-chats.js:781` |
| `fhPillsHTML` | функція | `src/scripts/core/36-chats.js:792` |
| `fhBelowRender` | функція | `src/scripts/core/36-chats.js:800` |
| `FH_SPARK` | значення | `src/scripts/core/36-chats.js:822` |
| `fhAi` | обʼєкт | `src/scripts/core/36-chats.js:823` |
| `fhAiHTML` | функція | `src/scripts/core/36-chats.js:824` |
| `fhAiBind` | функція | `src/scripts/core/36-chats.js:838` |
| `fhAiRun` | функція | `src/scripts/core/36-chats.js:846` |
| `fhAiMove` | функція | `src/scripts/core/36-chats.js:878` |
| `fhFilterApply` | функція | `src/scripts/core/36-chats.js:901` |
| `fhMeltRaf` | значення | `src/scripts/core/36-chats.js:925` |
| `fhMelt` | функція | `src/scripts/core/36-chats.js:926` |
| `fhMeltSoon` | функція | `src/scripts/core/36-chats.js:938` |
| `fhT` | значення | `src/scripts/core/36-chats.js:942` |
| `fhSoon` | функція | `src/scripts/core/36-chats.js:943` |
| `fhFlash` | функція | `src/scripts/core/36-chats.js:947` |
| `fhStatSheet` | функція | `src/scripts/core/36-chats.js:951` |
| `fhCoverSheet` | функція | `src/scripts/core/36-chats.js:988` |
| `fhAddSheet` | функція | `src/scripts/core/36-chats.js:1004` |
| `fhLookSheet` | функція | `src/scripts/core/36-chats.js:1017` |
| `fhView` | функція | `src/scripts/core/36-chats.js:1062` |
| `fhSetView` | функція | `src/scripts/core/36-chats.js:1063` |
| `fhFind` | функція | `src/scripts/core/36-chats.js:1071` |
| `fhCommit` | функція | `src/scripts/core/36-chats.js:1078` |
| `FH_TEXTY` | обʼєкт | `src/scripts/core/36-chats.js:1081` |
| `fhRich` | функція | `src/scripts/core/36-chats.js:1082` |
| `fhTblVal` | функція | `src/scripts/core/36-chats.js:1085` |
| `fhTblHTML` | функція | `src/scripts/core/36-chats.js:1092` |
| `fhPeek` | значення | `src/scripts/core/36-chats.js:1112` |
| `fhPeekOpen` | функція | `src/scripts/core/36-chats.js:1113` |
| `fhPeekEnd` | функція | `src/scripts/core/36-chats.js:1114` |
| `fhBubble` | функція | `src/scripts/core/36-chats.js:1119` |
| `fhChatHTML` | функція | `src/scripts/core/36-chats.js:1132` |
| `fhWallHTML` | функція | `src/scripts/core/36-chats.js:1142` |
| `fhWallSig` | значення | `src/scripts/core/36-chats.js:1148` |
| `fhApplyView` | функція | `src/scripts/core/36-chats.js:1149` |
| `fhMsgSheet` | функція | `src/scripts/core/36-chats.js:1183` |
| `fhCopy` | функція | `src/scripts/core/36-chats.js:1205` |
| `fhPickFolder` | функція | `src/scripts/core/36-chats.js:1207` |
| `fhPickChat` | функція | `src/scripts/core/36-chats.js:1214` |
| `fhEdit` | функція | `src/scripts/core/36-chats.js:1222` |
| `pgHubData` | функція | `src/scripts/core/36-chats.js:1240` |
| `folderAddSheet` | функція | `src/scripts/core/36-chats.js:1249` |
| `pickChatForFolder` | функція | `src/scripts/core/36-chats.js:1264` |
| `chatsInit` | функція | `src/scripts/core/36-chats.js:1274` |

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
| `aiConsentPending` | значення | `src/scripts/core/37-ai-privacy.js:115` |
| `aiConsentSheet` | функція | `src/scripts/core/37-ai-privacy.js:116` |
| `aiConsentGate` | функція | `src/scripts/core/37-ai-privacy.js:150` |
| `aiPrivacySheet` | функція | `src/scripts/core/37-ai-privacy.js:163` |

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
| `SPH_TPL` | обʼєкт | `src/scripts/core/39-spheres.js:25` |
| `SPH_ORDER` | масив | `src/scripts/core/39-spheres.js:49` |
| `sphOn` | функція | `src/scripts/core/39-spheres.js:51` |
| `sphTpl` | функція | `src/scripts/core/39-spheres.js:53` |
| `sphKeys` | функція | `src/scripts/core/39-spheres.js:54` |
| `sphBlocks` | функція | `src/scripts/core/39-spheres.js:57` |
| `sphStreak` | функція | `src/scripts/core/39-spheres.js:63` |
| `sphWeek` | функція | `src/scripts/core/39-spheres.js:69` |
| `sphStats` | функція | `src/scripts/core/39-spheres.js:77` |
| `sphRenderList` | функція | `src/scripts/core/39-spheres.js:102` |
| `sphHomeSync` | функція | `src/scripts/core/39-spheres.js:125` |
| `sphTemplateSheet` | функція | `src/scripts/core/39-spheres.js:138` |
| `sphNewBlocks` | функція | `src/scripts/core/39-spheres.js:157` |
| `sphCreate` | функція | `src/scripts/core/39-spheres.js:161` |
| `sphConvert` | функція | `src/scripts/core/39-spheres.js:177` |
| `sphRenderHead` | функція | `src/scripts/core/39-spheres.js:190` |
| `sphForWorld` | функція | `src/scripts/core/39-spheres.js:205` |
| `spheresInit` | функція | `src/scripts/core/39-spheres.js:212` |

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
| `ylEdit` | функція | `src/scripts/core/40-year-letter.js:178` |
| `ylRead` | функція | `src/scripts/core/40-year-letter.js:220` |
| `ylPace` | функція | `src/scripts/core/40-year-letter.js:257` |
| `ylAskFlow` | функція | `src/scripts/core/40-year-letter.js:262` |
| `ylAiCtx` | функція | `src/scripts/core/40-year-letter.js:268` |
| `ylForWorld` | функція | `src/scripts/core/40-year-letter.js:286` |

### `src/scripts/core/41-journal.js` — 71 сутностей

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
| `jnNumOf` | функція | `src/scripts/core/41-journal.js:38` |
| `jnNumIncome` | функція | `src/scripts/core/41-journal.js:39` |
| `jnNum` | функція | `src/scripts/core/41-journal.js:40` |
| `jnRhythm` | функція | `src/scripts/core/41-journal.js:51` |
| `jnHasMeasure` | функція | `src/scripts/core/41-journal.js:59` |
| `jnPct` | функція | `src/scripts/core/41-journal.js:60` |
| `jnPathTxt` | функція | `src/scripts/core/41-journal.js:68` |
| `jnNumSheet` | функція | `src/scripts/core/41-journal.js:73` |
| `jnMsSetDone` | функція | `src/scripts/core/41-journal.js:92` |
| `jnDayBlocks` | функція | `src/scripts/core/41-journal.js:95` |
| `jnBlockGoal` | функція | `src/scripts/core/41-journal.js:108` |
| `jnXP` | функція | `src/scripts/core/41-journal.js:111` |
| `jnHeroXP` | функція | `src/scripts/core/41-journal.js:119` |
| `jnFreeHours` | функція | `src/scripts/core/41-journal.js:121` |
| `jnDayLevel` | функція | `src/scripts/core/41-journal.js:129` |
| `dayInMotion` | функція | `src/scripts/core/41-journal.js:138` |
| `jnStreak` | функція | `src/scripts/core/41-journal.js:143` |
| `jnWeek` | функція | `src/scripts/core/41-journal.js:149` |
| `jnMateOn` | функція | `src/scripts/core/41-journal.js:156` |
| `jnMateName` | функція | `src/scripts/core/41-journal.js:157` |
| `jnMateHTML` | функція | `src/scripts/core/41-journal.js:158` |
| `jnAvatar` | функція | `src/scripts/core/41-journal.js:164` |
| `jnName` | функція | `src/scripts/core/41-journal.js:170` |
| `jnSchedTxt` | функція | `src/scripts/core/41-journal.js:176` |
| `jnMissionCard` | функція | `src/scripts/core/41-journal.js:181` |
| `jnFocus` | значення | `src/scripts/core/41-journal.js:198` |
| `jnTab` | значення | `src/scripts/core/41-journal.js:201` |
| `jnMissionPhoto` | функція | `src/scripts/core/41-journal.js:204` |
| `jnGoalById` | функція | `src/scripts/core/41-journal.js:211` |
| `jnBg` | функція | `src/scripts/core/41-journal.js:212` |
| `jnStory` | функція | `src/scripts/core/41-journal.js:216` |
| `jnTodayList` | функція | `src/scripts/core/41-journal.js:223` |
| `jnFocusCard` | функція | `src/scripts/core/41-journal.js:227` |
| `jnRender` | функція | `src/scripts/core/41-journal.js:240` |
| `jnTop` | функція | `src/scripts/core/41-journal.js:267` |
| `jnFloatRender` | функція | `src/scripts/core/41-journal.js:269` |
| `jnRenderOtherDay` | функція | `src/scripts/core/41-journal.js:284` |
| `jnRenderToday` | функція | `src/scripts/core/41-journal.js:292` |
| `jnToggleBlock` | функція | `src/scripts/core/41-journal.js:374` |
| `jnDone` | функція | `src/scripts/core/41-journal.js:387` |
| `jnUndoSheet` | функція | `src/scripts/core/41-journal.js:392` |
| `jnCelebrate` | функція | `src/scripts/core/41-journal.js:396` |
| `jnStoryView` | функція | `src/scripts/core/41-journal.js:422` |
| `jnEnergySheet` | функція | `src/scripts/core/41-journal.js:453` |
| `jnHeroSheet` | функція | `src/scripts/core/41-journal.js:462` |
| `jnOverlay` | функція | `src/scripts/core/41-journal.js:478` |
| `jnClearFuture` | функція | `src/scripts/core/41-journal.js:491` |
| `jnOtherTpls` | функція | `src/scripts/core/41-journal.js:499` |
| `jnTplDows` | функція | `src/scripts/core/41-journal.js:502` |
| `jnSyncRecur` | функція | `src/scripts/core/41-journal.js:509` |
| `jnEditor` | функція | `src/scripts/core/41-journal.js:531` |
| `jnStart` | функція | `src/scripts/core/41-journal.js:674` |
| `jnSettings` | функція | `src/scripts/core/41-journal.js:756` |
| `jnDaySheet` | функція | `src/scripts/core/41-journal.js:769` |
| `jnAskReview` | функція | `src/scripts/core/41-journal.js:805` |
| `goJournal` | функція | `src/scripts/core/41-journal.js:816` |

### `src/scripts/core/42-day.js` — 41 сутностей

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
| `DY_HP` | значення | `src/scripts/core/42-day.js:52` |
| `dyRange` | функція | `src/scripts/core/42-day.js:53` |
| `dyLanes` | функція | `src/scripts/core/42-day.js:59` |
| `dyRibbonHTML` | функція | `src/scripts/core/42-day.js:70` |
| `dyGridScroll` | функція | `src/scripts/core/42-day.js:90` |
| `dyDayTitle` | функція | `src/scripts/core/42-day.js:92` |
| `dyDayHTML` | функція | `src/scripts/core/42-day.js:96` |
| `dyBind` | функція | `src/scripts/core/42-day.js:107` |
| `dyNewId` | функція | `src/scripts/core/42-day.js:121` |
| `dyDropReminder` | функція | `src/scripts/core/42-day.js:122` |
| `dyRemove` | функція | `src/scripts/core/42-day.js:125` |
| `dyComplete` | функція | `src/scripts/core/42-day.js:137` |
| `dyMoveTo` | функція | `src/scripts/core/42-day.js:146` |
| `dyDayPicker` | функція | `src/scripts/core/42-day.js:160` |
| `dyPickDay` | функція | `src/scripts/core/42-day.js:169` |
| `dyMenu` | функція | `src/scripts/core/42-day.js:172` |
| `dyFreeSlot` | функція | `src/scripts/core/42-day.js:190` |
| `dyFromMissions` | функція | `src/scripts/core/42-day.js:197` |
| `dyWk` | обʼєкт | `src/scripts/core/42-day.js:228` |
| `dyMonday` | функція | `src/scripts/core/42-day.js:229` |
| `dyHrs` | функція | `src/scripts/core/42-day.js:230` |
| `dyNum` | функція | `src/scripts/core/42-day.js:231` |
| `dyWeekRange` | функція | `src/scripts/core/42-day.js:232` |
| `dyWeekHTMLFull` | функція | `src/scripts/core/42-day.js:236` |
| `dyWeekGridHTML` | функція | `src/scripts/core/42-day.js:277` |
| `dyWeekFind` | функція | `src/scripts/core/42-day.js:291` |
| `dyWeekGridBind` | функція | `src/scripts/core/42-day.js:295` |
| `dyWeekBind` | функція | `src/scripts/core/42-day.js:307` |
| `dyWeekTasks` | функція | `src/scripts/core/42-day.js:326` |
| `dyWeekTasksHTML` | функція | `src/scripts/core/42-day.js:327` |
| `dyTaskToDay` | функція | `src/scripts/core/42-day.js:335` |
| `dyWeekTasksBind` | функція | `src/scripts/core/42-day.js:344` |

### `src/scripts/core/43-month.js` — 37 сутностей

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
| `moLateDays` | функція | `src/scripts/core/43-month.js:22` |
| `moMissions` | функція | `src/scripts/core/43-month.js:24` |
| `moQuarters` | функція | `src/scripts/core/43-month.js:27` |
| `moCard` | функція | `src/scripts/core/43-month.js:31` |
| `moMoneyHTML` | функція | `src/scripts/core/43-month.js:44` |
| `MO_CAT_COLORS` | масив | `src/scripts/core/43-month.js:63` |
| `moCatsHTML` | функція | `src/scripts/core/43-month.js:64` |
| `moCalHTML` | функція | `src/scripts/core/43-month.js:75` |
| `moMonthHTML` | функція | `src/scripts/core/43-month.js:88` |
| `moBind` | функція | `src/scripts/core/43-month.js:100` |
| `moMoneySheet` | функція | `src/scripts/core/43-month.js:109` |
| `moMissionPage` | функція | `src/scripts/core/43-month.js:127` |
| `moPathTab` | функція | `src/scripts/core/43-month.js:156` |
| `moOwnFolder` | функція | `src/scripts/core/43-month.js:185` |
| `moBoard` | функція | `src/scripts/core/43-month.js:186` |
| `moTracker` | функція | `src/scripts/core/43-month.js:188` |
| `moNotes` | функція | `src/scripts/core/43-month.js:189` |
| `moVision` | функція | `src/scripts/core/43-month.js:190` |
| `moMarked` | функція | `src/scripts/core/43-month.js:191` |
| `moToggleMark` | функція | `src/scripts/core/43-month.js:194` |
| `moAddTracker` | функція | `src/scripts/core/43-month.js:202` |
| `moFolderTab` | функція | `src/scripts/core/43-month.js:207` |
| `moChatsTab` | функція | `src/scripts/core/43-month.js:227` |
| `moTextSheet` | функція | `src/scripts/core/43-month.js:235` |
| `moBindMission` | функція | `src/scripts/core/43-month.js:243` |

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
| `pzWithdraw` | функція | `src/scripts/core/44-prizes.js:136` |
| `pzCelebrate` | функція | `src/scripts/core/44-prizes.js:152` |

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
| `yrTableHTML` | функція | `src/scripts/core/45-year.js:46` |
| `yrPhoneHTML` | функція | `src/scripts/core/45-year.js:61` |
| `yrHTML` | функція | `src/scripts/core/45-year.js:85` |
| `yrFind` | функція | `src/scripts/core/45-year.js:88` |
| `yrMove` | функція | `src/scripts/core/45-year.js:89` |
| `yrLvMenu` | функція | `src/scripts/core/45-year.js:97` |
| `yrAddLevel` | функція | `src/scripts/core/45-year.js:104` |
| `yrBind` | функція | `src/scripts/core/45-year.js:115` |

### `src/scripts/core/46-wallet.js` — 43 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `wlState` | обʼєкт | `src/scripts/core/46-wallet.js:8` |
| `wlYm` | функція | `src/scripts/core/46-wallet.js:9` |
| `wlMonthOps` | функція | `src/scripts/core/46-wallet.js:10` |
| `wlDayOps` | функція | `src/scripts/core/46-wallet.js:14` |
| `wlMonthCats` | функція | `src/scripts/core/46-wallet.js:16` |
| `wlGoal` | функція | `src/scripts/core/46-wallet.js:24` |
| `wlMissions` | функція | `src/scripts/core/46-wallet.js:25` |
| `wlMoney` | функція | `src/scripts/core/46-wallet.js:26` |
| `wlAgg` | функція | `src/scripts/core/46-wallet.js:27` |
| `wlRing` | функція | `src/scripts/core/46-wallet.js:34` |
| `wlOpRow` | функція | `src/scripts/core/46-wallet.js:35` |
| `wlRender` | функція | `src/scripts/core/46-wallet.js:43` |
| `wlDebtTotals` | функція | `src/scripts/core/46-wallet.js:64` |
| `wlDebtLineHTML` | функція | `src/scripts/core/46-wallet.js:70` |
| `wlOverviewHTML` | функція | `src/scripts/core/46-wallet.js:75` |
| `wlGoalHours` | функція | `src/scripts/core/46-wallet.js:107` |
| `wlMissionsHTML` | функція | `src/scripts/core/46-wallet.js:112` |
| `wlFoldersHTML` | функція | `src/scripts/core/46-wallet.js:128` |
| `wlFolderSheet` | функція | `src/scripts/core/46-wallet.js:139` |
| `wlBind` | функція | `src/scripts/core/46-wallet.js:152` |
| `WL_SRC` | обʼєкт | `src/scripts/core/46-wallet.js:178` |
| `wlSrc` | функція | `src/scripts/core/46-wallet.js:179` |
| `wlFolderName` | функція | `src/scripts/core/46-wallet.js:180` |
| `wlOpSheet` | функція | `src/scripts/core/46-wallet.js:182` |
| `wlEnvEmptyOffer` | функція | `src/scripts/core/46-wallet.js:253` |
| `wlOpMenu` | функція | `src/scripts/core/46-wallet.js:277` |
| `wlOpEdit` | функція | `src/scripts/core/46-wallet.js:300` |
| `wlLinkedNote` | функція | `src/scripts/core/46-wallet.js:322` |
| `wlMissionSheet` | функція | `src/scripts/core/46-wallet.js:330` |
| `wlQuestCheck` | функція | `src/scripts/core/46-wallet.js:343` |
| `wlCurList` | функція | `src/scripts/core/46-wallet.js:365` |
| `wlCurSave` | функція | `src/scripts/core/46-wallet.js:370` |
| `curBalance` | функція | `src/scripts/core/46-wallet.js:371` |
| `wlTotalApprox` | функція | `src/scripts/core/46-wallet.js:372` |
| `wlCursHTML` | функція | `src/scripts/core/46-wallet.js:374` |
| `wlCurAdd` | функція | `src/scripts/core/46-wallet.js:379` |
| `wlCurSheet` | функція | `src/scripts/core/46-wallet.js:390` |
| `wlExchange` | функція | `src/scripts/core/46-wallet.js:407` |
| `WL_ENV_TPL` | масив | `src/scripts/core/46-wallet.js:453` |
| `WL_ENV_COLORS` | масив | `src/scripts/core/46-wallet.js:461` |
| `wlSpendEnvs` | функція | `src/scripts/core/46-wallet.js:463` |
| `wlEnvPick` | функція | `src/scripts/core/46-wallet.js:465` |
| `wlEnvStarter` | функція | `src/scripts/core/46-wallet.js:466` |

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
| `rlPrevYm` | функція | `src/scripts/core/47-rules.js:263` |
| `rlRecurring` | функція | `src/scripts/core/47-rules.js:265` |
| `rlForecast` | функція | `src/scripts/core/47-rules.js:266` |
| `rlPlanOpen` | функція | `src/scripts/core/47-rules.js:275` |
| `rlPlanHTML` | функція | `src/scripts/core/47-rules.js:280` |
| `rlPlanBind` | функція | `src/scripts/core/47-rules.js:300` |
| `rlPlanEdit` | функція | `src/scripts/core/47-rules.js:309` |
| `rlPlanRowMenu` | функція | `src/scripts/core/47-rules.js:330` |

### `src/scripts/core/48-hero.js` — 41 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `HERO_CROP` | обʼєкт | `src/scripts/core/48-hero.js:20` |
| `HERO_CHEST` | обʼєкт | `src/scripts/core/48-hero.js:22` |
| `HERO_MOOD_NAME` | масив | `src/scripts/core/48-hero.js:24` |
| `HERO_REACT` | обʼєкт | `src/scripts/core/48-hero.js:28` |
| `HERO_REACT_MS` | значення | `src/scripts/core/48-hero.js:29` |
| `heroReact` | значення | `src/scripts/core/48-hero.js:30` |
| `HERO_OUTFITS` | масив | `src/scripts/core/48-hero.js:31` |
| `HERO_FONTS` | обʼєкт | `src/scripts/core/48-hero.js:32` |
| `HERO_COLORS` | масив | `src/scripts/core/48-hero.js:38` |
| `HERO_TECH` | обʼєкт | `src/scripts/core/48-hero.js:39` |
| `HERO_LOOK_DEF` | обʼєкт | `src/scripts/core/48-hero.js:40` |
| `HERO_ICON` | обʼєкт | `src/scripts/core/48-hero.js:44` |
| `HERO_NEED` | обʼєкт | `src/scripts/core/48-hero.js:55` |
| `HERO_PATCHES` | обʼєкт | `src/scripts/core/48-hero.js:61` |
| `HERO_TATS` | обʼєкт | `src/scripts/core/48-hero.js:72` |
| `HERO_PATCH_AT` | обʼєкт | `src/scripts/core/48-hero.js:77` |
| `HERO_TAT_AT` | обʼєкт | `src/scripts/core/48-hero.js:78` |
| `heroLoading` | значення | `src/scripts/core/48-hero.js:79` |
| `heroOf` | функція | `src/scripts/core/48-hero.js:81` |
| `heroReady` | функція | `src/scripts/core/48-hero.js:82` |
| `heroLookAll` | функція | `src/scripts/core/48-hero.js:86` |
| `heroLookNorm` | функція | `src/scripts/core/48-hero.js:89` |
| `heroLook` | функція | `src/scripts/core/48-hero.js:101` |
| `heroRerender` | функція | `src/scripts/core/48-hero.js:103` |
| `heroLoad` | функція | `src/scripts/core/48-hero.js:110` |
| `heroOutfitsLoad` | функція | `src/scripts/core/48-hero.js:127` |
| `heroOverBudget` | функція | `src/scripts/core/48-hero.js:138` |
| `heroReactTo` | функція | `src/scripts/core/48-hero.js:145` |
| `heroMood` | функція | `src/scripts/core/48-hero.js:157` |
| `heroChestLines` | функція | `src/scripts/core/48-hero.js:173` |
| `heroChestText` | функція | `src/scripts/core/48-hero.js:180` |
| `heroUnlocks` | функція | `src/scripts/core/48-hero.js:199` |
| `heroItemOpen` | функція | `src/scripts/core/48-hero.js:208` |
| `heroPatchSVG` | функція | `src/scripts/core/48-hero.js:209` |
| `heroTatSVG` | функція | `src/scripts/core/48-hero.js:217` |
| `heroSVG` | функція | `src/scripts/core/48-hero.js:226` |
| `heroWard` | значення | `src/scripts/core/48-hero.js:262` |
| `heroWardRedraw` | функція | `src/scripts/core/48-hero.js:263` |
| `heroWardSave` | функція | `src/scripts/core/48-hero.js:274` |
| `heroWardItem` | функція | `src/scripts/core/48-hero.js:286` |
| `heroWardrobe` | функція | `src/scripts/core/48-hero.js:294` |

### `src/scripts/core/48-widgets.js` — 85 сутностей

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
| `wgAct` | функція | `src/scripts/core/48-widgets.js:102` |
| `wgFill` | функція | `src/scripts/core/48-widgets.js:123` |
| `wgFillPage` | функція | `src/scripts/core/48-widgets.js:130` |
| `wgWalletHTML` | функція | `src/scripts/core/48-widgets.js:135` |
| `wgHome` | функція | `src/scripts/core/48-widgets.js:137` |
| `wgRefresh` | функція | `src/scripts/core/48-widgets.js:139` |
| `wgMoneyCfg` | функція | `src/scripts/core/48-widgets.js:142` |
| `WD_SZ` | обʼєкт | `src/scripts/core/48-widgets.js:171` |
| `WD_META` | обʼєкт | `src/scripts/core/48-widgets.js:172` |
| `wdCalYm` | обʼєкт | `src/scripts/core/48-widgets.js:187` |
| `wdIs` | функція | `src/scripts/core/48-widgets.js:188` |
| `wdSz` | функція | `src/scripts/core/48-widgets.js:190` |
| `wdSzOld` | функція | `src/scripts/core/48-widgets.js:191` |
| `wdPer` | функція | `src/scripts/core/48-widgets.js:192` |
| `wdOn` | функція | `src/scripts/core/48-widgets.js:193` |
| `wdInit` | функція | `src/scripts/core/48-widgets.js:195` |
| `wdGoal` | функція | `src/scripts/core/48-widgets.js:203` |
| `wdNext` | функція | `src/scripts/core/48-widgets.js:209` |
| `wdDue` | функція | `src/scripts/core/48-widgets.js:216` |
| `wdDaysLeft` | функція | `src/scripts/core/48-widgets.js:221` |
| `wdFolder` | функція | `src/scripts/core/48-widgets.js:222` |
| `wdHead` | функція | `src/scripts/core/48-widgets.js:224` |
| `wdTile` | функція | `src/scripts/core/48-widgets.js:231` |
| `wdRing` | функція | `src/scripts/core/48-widgets.js:236` |
| `wdHm` | функція | `src/scripts/core/48-widgets.js:238` |
| `wdNoGoal` | функція | `src/scripts/core/48-widgets.js:240` |
| `wdLevels` | функція | `src/scripts/core/48-widgets.js:246` |
| `wdHabGrid` | функція | `src/scripts/core/48-widgets.js:253` |
| `wdWeekBars` | функція | `src/scripts/core/48-widgets.js:259` |
| `wdCalWeek` | функція | `src/scripts/core/48-widgets.js:264` |
| `wdHTML` | функція | `src/scripts/core/48-widgets.js:268` |
| `wdPhotos` | функція | `src/scripts/core/48-widgets.js:449` |
| `WD_PH_MAX` | значення | `src/scripts/core/48-widgets.js:454` |
| `wdPhotoAdd` | функція | `src/scripts/core/48-widgets.js:456` |
| `wdPhotoGallery` | функція | `src/scripts/core/48-widgets.js:473` |
| `wdFinal` | функція | `src/scripts/core/48-widgets.js:496` |
| `wdSaveGoal` | функція | `src/scripts/core/48-widgets.js:500` |
| `wdNumTxt` | функція | `src/scripts/core/48-widgets.js:501` |
| `wdCounters` | функція | `src/scripts/core/48-widgets.js:503` |
| `wdCntPct` | функція | `src/scripts/core/48-widgets.js:511` |
| `wdFreshGoal` | функція | `src/scripts/core/48-widgets.js:513` |
| `wdCounterStep` | функція | `src/scripts/core/48-widgets.js:516` |
| `wdCounterSheet` | функція | `src/scripts/core/48-widgets.js:529` |
| `wdSaveGoalSheet` | функція | `src/scripts/core/48-widgets.js:579` |
| `wdTT` | функція | `src/scripts/core/48-widgets.js:598` |
| `wdTasksItems` | функція | `src/scripts/core/48-widgets.js:600` |
| `wdTasksBlock` | функція | `src/scripts/core/48-widgets.js:609` |
| `wdTasksHTML` | функція | `src/scripts/core/48-widgets.js:614` |
| `wdTasksAct` | функція | `src/scripts/core/48-widgets.js:640` |
| `wdTasksAddSheet` | функція | `src/scripts/core/48-widgets.js:660` |
| `wdRedraw` | функція | `src/scripts/core/48-widgets.js:677` |
| `wdAct` | функція | `src/scripts/core/48-widgets.js:678` |
| `wdCfg` | функція | `src/scripts/core/48-widgets.js:711` |
| `wdPickMission` | функція | `src/scripts/core/48-widgets.js:713` |
| `TM_U` | масив | `src/scripts/core/48-widgets.js:732` |
| `TM_N` | обʼєкт | `src/scripts/core/48-widgets.js:733` |
| `TM_SH` | обʼєкт | `src/scripts/core/48-widgets.js:735` |
| `TM_MS` | обʼєкт | `src/scripts/core/48-widgets.js:736` |
| `TM_STY` | масив | `src/scripts/core/48-widgets.js:737` |
| `tmCfgOf` | функція | `src/scripts/core/48-widgets.js:738` |
| `tmAt` | функція | `src/scripts/core/48-widgets.js:745` |
| `tmAddM` | функція | `src/scripts/core/48-widgets.js:747` |
| `tmParts` | функція | `src/scripts/core/48-widgets.js:750` |
| `tmState` | функція | `src/scripts/core/48-widgets.js:764` |
| `tmDateTxt` | функція | `src/scripts/core/48-widgets.js:772` |
| `tmPad` | функція | `src/scripts/core/48-widgets.js:773` |
| `tmInner` | функція | `src/scripts/core/48-widgets.js:775` |
| `tmHTML` | функція | `src/scripts/core/48-widgets.js:804` |
| `tmTimer` | значення | `src/scripts/core/48-widgets.js:814` |
| `tmTickAll` | функція | `src/scripts/core/48-widgets.js:815` |
| `tmStart` | функція | `src/scripts/core/48-widgets.js:825` |
| `tmCfg` | функція | `src/scripts/core/48-widgets.js:827` |
| `WG_OLD` | обʼєкт | `src/scripts/core/48-widgets.js:833` |
| `wgOldScan` | функція | `src/scripts/core/48-widgets.js:834` |
| `wgOldCleanup` | функція | `src/scripts/core/48-widgets.js:841` |

### `src/scripts/core/49-calendar.js` — 36 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CAL_REP` | обʼєкт | `src/scripts/core/49-calendar.js:9` |
| `calEvents` | функція | `src/scripts/core/49-calendar.js:11` |
| `calRep` | функція | `src/scripts/core/49-calendar.js:16` |
| `calDim` | функція | `src/scripts/core/49-calendar.js:17` |
| `calEvOn` | функція | `src/scripts/core/49-calendar.js:19` |
| `calEventsOn` | функція | `src/scripts/core/49-calendar.js:26` |
| `calNote` | функція | `src/scripts/core/49-calendar.js:27` |
| `calPayOn` | функція | `src/scripts/core/49-calendar.js:33` |
| `calBlocks` | функція | `src/scripts/core/49-calendar.js:41` |
| `calBlockColor` | функція | `src/scripts/core/49-calendar.js:42` |
| `calFolderName` | функція | `src/scripts/core/49-calendar.js:47` |
| `calMarks` | функція | `src/scripts/core/49-calendar.js:49` |
| `calDaySheet` | функція | `src/scripts/core/49-calendar.js:55` |
| `calSaveOpenNote` | функція | `src/scripts/core/49-calendar.js:91` |
| `calNoteSave` | функція | `src/scripts/core/49-calendar.js:92` |
| `calEventSheet` | функція | `src/scripts/core/49-calendar.js:102` |
| `calMonthGridHTML` | функція | `src/scripts/core/49-calendar.js:142` |
| `subList` | функція | `src/scripts/core/49-calendar.js:155` |
| `subCount` | функція | `src/scripts/core/49-calendar.js:156` |
| `subBadge` | функція | `src/scripts/core/49-calendar.js:157` |
| `subFind` | функція | `src/scripts/core/49-calendar.js:159` |
| `subAfter` | функція | `src/scripts/core/49-calendar.js:165` |
| `subToggle` | функція | `src/scripts/core/49-calendar.js:167` |
| `subSheet` | функція | `src/scripts/core/49-calendar.js:186` |
| `calAllDayHTML` | функція | `src/scripts/core/49-calendar.js:225` |
| `calNoteCardHTML` | функція | `src/scripts/core/49-calendar.js:232` |
| `calBindDay` | функція | `src/scripts/core/49-calendar.js:237` |
| `wgoAll` | функція | `src/scripts/core/49-calendar.js:248` |
| `wgoList` | функція | `src/scripts/core/49-calendar.js:249` |
| `wgoN` | функція | `src/scripts/core/49-calendar.js:250` |
| `wgoMan` | функція | `src/scripts/core/49-calendar.js:251` |
| `wgoAuto` | функція | `src/scripts/core/49-calendar.js:252` |
| `wgoHTML` | функція | `src/scripts/core/49-calendar.js:257` |
| `wgoSave` | функція | `src/scripts/core/49-calendar.js:267` |
| `wgoBind` | функція | `src/scripts/core/49-calendar.js:270` |
| `wgoSheet` | функція | `src/scripts/core/49-calendar.js:290` |

### `src/scripts/core/49-finlit.js` — 18 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `flCushionEnv` | функція | `src/scripts/core/49-finlit.js:19` |
| `flMonthAgg` | функція | `src/scripts/core/49-finlit.js:20` |
| `flPrevYm` | функція | `src/scripts/core/49-finlit.js:21` |
| `flSavedIn` | функція | `src/scripts/core/49-finlit.js:23` |
| `flAvgSpend` | функція | `src/scripts/core/49-finlit.js:26` |
| `flOnIncome` | функція | `src/scripts/core/49-finlit.js:29` |
| `flBigSum` | функція | `src/scripts/core/49-finlit.js:52` |
| `flH24` | функція | `src/scripts/core/49-finlit.js:67` |
| `flReviewHTML` | функція | `src/scripts/core/49-finlit.js:85` |
| `flReviewBind` | функція | `src/scripts/core/49-finlit.js:97` |
| `FL_NEEDS` | значення | `src/scripts/core/49-finlit.js:102` |
| `FL_SAVE` | значення | `src/scripts/core/49-finlit.js:103` |
| `fl503020` | функція | `src/scripts/core/49-finlit.js:104` |
| `flApply503020` | функція | `src/scripts/core/49-finlit.js:113` |
| `FL_LESSONS` | масив | `src/scripts/core/49-finlit.js:119` |
| `flCushionHTML` | функція | `src/scripts/core/49-finlit.js:127` |
| `flSchoolHTML` | функція | `src/scripts/core/49-finlit.js:135` |
| `flSchoolBind` | функція | `src/scripts/core/49-finlit.js:140` |

### `src/scripts/core/50-quickadd.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `qaNum` | функція | `src/scripts/core/50-quickadd.js:11` |
| `qaParse` | функція | `src/scripts/core/50-quickadd.js:18` |
| `qaClearUrl` | функція | `src/scripts/core/50-quickadd.js:26` |
| `qaRun` | функція | `src/scripts/core/50-quickadd.js:30` |
| `qaGuide` | функція | `src/scripts/core/50-quickadd.js:50` |

### `src/scripts/core/51-money-reset.js` — 15 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `wkMoneyInfo` | функція | `src/scripts/core/51-money-reset.js:11` |
| `wkExpectedMain` | функція | `src/scripts/core/51-money-reset.js:28` |
| `wkPlanRowHTML` | функція | `src/scripts/core/51-money-reset.js:35` |
| `wkPlanBind` | функція | `src/scripts/core/51-money-reset.js:40` |
| `finResetScan` | функція | `src/scripts/core/51-money-reset.js:43` |
| `finResetReady` | функція | `src/scripts/core/51-money-reset.js:50` |
| `finResetAll` | функція | `src/scripts/core/51-money-reset.js:55` |
| `FIN_TOMB_KINDS` | масив | `src/scripts/core/51-money-reset.js:90` |
| `window.finTombReset` | функція | `src/scripts/core/51-money-reset.js:92` |
| `finTombNorm` | функція | `src/scripts/core/51-money-reset.js:94` |
| `finTombGet` | функція | `src/scripts/core/51-money-reset.js:99` |
| `finTombHas` | функція | `src/scripts/core/51-money-reset.js:100` |
| `finTombApply` | функція | `src/scripts/core/51-money-reset.js:105` |
| `finTombLoad` | функція | `src/scripts/core/51-money-reset.js:115` |
| `finTombAdd` | функція | `src/scripts/core/51-money-reset.js:122` |

### `src/scripts/core/52-fresh-start.js` — 29 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FS_KEY` | значення | `src/scripts/core/52-fresh-start.js:13` |
| `fsGet` | функція | `src/scripts/core/52-fresh-start.js:14` |
| `fsSet` | функція | `src/scripts/core/52-fresh-start.js:16` |
| `fsClear` | функція | `src/scripts/core/52-fresh-start.js:18` |
| `fsCatchAt` | значення | `src/scripts/core/52-fresh-start.js:19` |
| `fsCatchup` | функція | `src/scripts/core/52-fresh-start.js:20` |
| `fsTrusted` | функція | `src/scripts/core/52-fresh-start.js:24` |
| `fsBusy` | функція | `src/scripts/core/52-fresh-start.js:28` |
| `fsStartOp` | функція | `src/scripts/core/52-fresh-start.js:29` |
| `fsWalletEmpty` | функція | `src/scripts/core/52-fresh-start.js:31` |
| `fsActive` | функція | `src/scripts/core/52-fresh-start.js:33` |
| `fsStep` | функція | `src/scripts/core/52-fresh-start.js:34` |
| `FS_STEPS` | масив | `src/scripts/core/52-fresh-start.js:35` |
| `fsNum` | функція | `src/scripts/core/52-fresh-start.js:36` |
| `fsHead` | функція | `src/scripts/core/52-fresh-start.js:37` |
| `fsGo` | функція | `src/scripts/core/52-fresh-start.js:39` |
| `wlStartHTML` | функція | `src/scripts/core/52-fresh-start.js:42` |
| `wlStartBind` | функція | `src/scripts/core/52-fresh-start.js:52` |
| `fsStep1` | функція | `src/scripts/core/52-fresh-start.js:58` |
| `fsMainEnvs` | функція | `src/scripts/core/52-fresh-start.js:80` |
| `fsStep2` | функція | `src/scripts/core/52-fresh-start.js:81` |
| `fsSplitPlan` | функція | `src/scripts/core/52-fresh-start.js:93` |
| `fsSplit` | функція | `src/scripts/core/52-fresh-start.js:99` |
| `fsStep3` | функція | `src/scripts/core/52-fresh-start.js:118` |
| `fsPlanRows` | функція | `src/scripts/core/52-fresh-start.js:155` |
| `fsStep4` | функція | `src/scripts/core/52-fresh-start.js:163` |
| `fsDays` | функція | `src/scripts/core/52-fresh-start.js:196` |
| `fsTodayHTML` | функція | `src/scripts/core/52-fresh-start.js:201` |
| `fsTodayBind` | функція | `src/scripts/core/52-fresh-start.js:210` |

### `src/scripts/core/53-starter.js` — 22 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `ST_KEY` | значення | `src/scripts/core/53-starter.js:14` |
| `stLang` | функція | `src/scripts/core/53-starter.js:19` |
| `stL` | функція | `src/scripts/core/53-starter.js:20` |
| `ST_T` | обʼєкт | `src/scripts/core/53-starter.js:21` |
| `stT` | функція | `src/scripts/core/53-starter.js:35` |
| `ST_WISHES` | масив | `src/scripts/core/53-starter.js:36` |
| `ST_FOLDERS` | масив | `src/scripts/core/53-starter.js:44` |
| `stLoading` | значення | `src/scripts/core/53-starter.js:50` |
| `stOff` | функція | `src/scripts/core/53-starter.js:51` |
| `stTrusted` | функція | `src/scripts/core/53-starter.js:52` |
| `stEmpty` | функція | `src/scripts/core/53-starter.js:58` |
| `starterActive` | функція | `src/scripts/core/53-starter.js:62` |
| `stImg` | функція | `src/scripts/core/53-starter.js:63` |
| `stLoad` | функція | `src/scripts/core/53-starter.js:64` |
| `stBg` | функція | `src/scripts/core/53-starter.js:73` |
| `stHeroOff` | функція | `src/scripts/core/53-starter.js:76` |
| `stHero` | функція | `src/scripts/core/53-starter.js:81` |
| `starterRender` | функція | `src/scripts/core/53-starter.js:98` |
| `stRefresh` | функція | `src/scripts/core/53-starter.js:120` |
| `stPick` | функція | `src/scripts/core/53-starter.js:128` |
| `stPut` | функція | `src/scripts/core/53-starter.js:152` |
| `stMakeOwn` | функція | `src/scripts/core/53-starter.js:156` |

### `src/scripts/core/54-intro.js` — 13 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `IN_KEY` | значення | `src/scripts/core/54-intro.js:12` |
| `inShownNow` | значення | `src/scripts/core/54-intro.js:13` |
| `inSeen` | функція | `src/scripts/core/54-intro.js:14` |
| `inMark` | функція | `src/scripts/core/54-intro.js:15` |
| `introMaybe` | функція | `src/scripts/core/54-intro.js:17` |
| `IN_T` | обʼєкт | `src/scripts/core/54-intro.js:22` |
| `inT` | функція | `src/scripts/core/54-intro.js:54` |
| `inPh` | функція | `src/scripts/core/54-intro.js:55` |
| `inTime` | масив | `src/scripts/core/54-intro.js:56` |
| `inSlides` | функція | `src/scripts/core/54-intro.js:57` |
| `inOpen` | функція | `src/scripts/core/54-intro.js:86` |
| `introRefresh` | функція | `src/scripts/core/54-intro.js:121` |
| `window.introOpen` | функція | `src/scripts/core/54-intro.js:130` |

### `src/scripts/core/54-links.js` — 31 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `LK_W` | обʼєкт | `src/scripts/core/54-links.js:7` |
| `lkGoalFolder` | функція | `src/scripts/core/54-links.js:11` |
| `inFolderOp` | функція | `src/scripts/core/54-links.js:12` |
| `inFolderBlock` | функція | `src/scripts/core/54-links.js:13` |
| `lkKey` | функція | `src/scripts/core/54-links.js:15` |
| `lkBoard` | функція | `src/scripts/core/54-links.js:16` |
| `lkWboard` | функція | `src/scripts/core/54-links.js:17` |
| `lkShown` | функція | `src/scripts/core/54-links.js:18` |
| `lkRows` | функція | `src/scripts/core/54-links.js:21` |
| `lkHTML` | функція | `src/scripts/core/54-links.js:39` |
| `lkRefresh` | функція | `src/scripts/core/54-links.js:48` |
| `lkOpen` | функція | `src/scripts/core/54-links.js:53` |
| `lkPickMission` | функція | `src/scripts/core/54-links.js:63` |
| `lkToggle` | функція | `src/scripts/core/54-links.js:78` |
| `lkBind` | функція | `src/scripts/core/54-links.js:94` |
| `lkSheet` | функція | `src/scripts/core/54-links.js:99` |
| `lkAsideSync` | функція | `src/scripts/core/54-links.js:109` |
| `lkPanelHTML` | функція | `src/scripts/core/54-links.js:135` |
| `lkView` | обʼєкт | `src/scripts/core/54-links.js:167` |
| `lkFeedItems` | функція | `src/scripts/core/54-links.js:168` |
| `txtPlain` | функція | `src/scripts/core/54-links.js:186` |
| `lkFeedHTML` | функція | `src/scripts/core/54-links.js:187` |
| `lkViewApply` | функція | `src/scripts/core/54-links.js:196` |
| `dsbOpen` | значення | `src/scripts/core/54-links.js:210` |
| `dsbTreeHidden` | значення | `src/scripts/core/54-links.js:212` |
| `dsbTreeHTML` | функція | `src/scripts/core/54-links.js:213` |
| `dsbTreeSync` | функція | `src/scripts/core/54-links.js:230` |
| `dsbDragKey` | значення | `src/scripts/core/54-links.js:258` |
| `dsbCanDrop` | функція | `src/scripts/core/54-links.js:259` |
| `dsbMove` | функція | `src/scripts/core/54-links.js:266` |
| `dsbDragBind` | функція | `src/scripts/core/54-links.js:272` |

### `src/scripts/core/55-focus.js` — 43 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FC_RUN_KEY` | значення | `src/scripts/core/55-focus.js:15` |
| `fcLang` | функція | `src/scripts/core/55-focus.js:16` |
| `FC_T` | обʼєкт | `src/scripts/core/55-focus.js:17` |
| `fcT` | функція | `src/scripts/core/55-focus.js:43` |
| `fcIdx` | значення | `src/scripts/core/55-focus.js:44` |
| `fcReady` | функція | `src/scripts/core/55-focus.js:47` |
| `fcRun` | функція | `src/scripts/core/55-focus.js:49` |
| `fcRunSet` | функція | `src/scripts/core/55-focus.js:50` |
| `fcLeft` | функція | `src/scripts/core/55-focus.js:51` |
| `fcNowDec` | функція | `src/scripts/core/55-focus.js:52` |
| `fcCands` | функція | `src/scripts/core/55-focus.js:55` |
| `fcHadToday` | функція | `src/scripts/core/55-focus.js:74` |
| `fcMakeBlock` | функція | `src/scripts/core/55-focus.js:77` |
| `fcStepBlock` | функція | `src/scripts/core/55-focus.js:87` |
| `fcDone` | функція | `src/scripts/core/55-focus.js:92` |
| `fcStart` | функція | `src/scripts/core/55-focus.js:101` |
| `fcBeep` | функція | `src/scripts/core/55-focus.js:108` |
| `fcStartTimer` | функція | `src/scripts/core/55-focus.js:114` |
| `fcStopTimer` | функція | `src/scripts/core/55-focus.js:120` |
| `fcFinish` | функція | `src/scripts/core/55-focus.js:128` |
| `fcLoop` | функція | `src/scripts/core/55-focus.js:138` |
| `fcMMSS` | функція | `src/scripts/core/55-focus.js:149` |
| `fcPaintTime` | функція | `src/scripts/core/55-focus.js:150` |
| `fcBoardTasks` | функція | `src/scripts/core/55-focus.js:157` |
| `fcHint` | функція | `src/scripts/core/55-focus.js:165` |
| `fcFeed` | функція | `src/scripts/core/55-focus.js:173` |
| `fcSeen` | функція | `src/scripts/core/55-focus.js:184` |
| `fcMarkSeen` | функція | `src/scripts/core/55-focus.js:185` |
| `fcUnseen` | функція | `src/scripts/core/55-focus.js:189` |
| `fcBadge` | функція | `src/scripts/core/55-focus.js:194` |
| `fcMate` | функція | `src/scripts/core/55-focus.js:205` |
| `fcFeedHTML` | функція | `src/scripts/core/55-focus.js:210` |
| `fcCapHTML` | функція | `src/scripts/core/55-focus.js:221` |
| `fcGameHTML` | функція | `src/scripts/core/55-focus.js:228` |
| `fcSaveThought` | функція | `src/scripts/core/55-focus.js:232` |
| `fcDurHTML` | функція | `src/scripts/core/55-focus.js:246` |
| `fcBodyHTML` | функція | `src/scripts/core/55-focus.js:249` |
| `fcRender` | функція | `src/scripts/core/55-focus.js:290` |
| `fcFeedAct` | функція | `src/scripts/core/55-focus.js:327` |
| `fcClose` | функція | `src/scripts/core/55-focus.js:349` |
| `fcKey` | функція | `src/scripts/core/55-focus.js:355` |
| `openFocus` | функція | `src/scripts/core/55-focus.js:364` |
| `window.openFocus` | значення | `src/scripts/core/55-focus.js:382` |

### `src/scripts/core/56-run.js` — 50 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `rnLang` | функція | `src/scripts/core/56-run.js:17` |
| `RN_T` | обʼєкт | `src/scripts/core/56-run.js:18` |
| `rnT` | функція | `src/scripts/core/56-run.js:60` |
| `RN_MON_G` | масив | `src/scripts/core/56-run.js:61` |
| `RN_MAX_DAYS` | значення | `src/scripts/core/56-run.js:62` |
| `rnDraft` | значення | `src/scripts/core/56-run.js:63` |
| `rnReady` | функція | `src/scripts/core/56-run.js:66` |
| `rnOkDs` | функція | `src/scripts/core/56-run.js:69` |
| `rnD` | функція | `src/scripts/core/56-run.js:70` |
| `rnDiff` | функція | `src/scripts/core/56-run.js:71` |
| `rnAdd` | функція | `src/scripts/core/56-run.js:72` |
| `rnDateTxt` | функція | `src/scripts/core/56-run.js:73` |
| `rnDaysWord` | функція | `src/scripts/core/56-run.js:78` |
| `rnNum` | функція | `src/scripts/core/56-run.js:79` |
| `rnParse` | функція | `src/scripts/core/56-run.js:80` |
| `rnId` | функція | `src/scripts/core/56-run.js:81` |
| `rnGoalNorm` | функція | `src/scripts/core/56-run.js:84` |
| `rnCur` | функція | `src/scripts/core/56-run.js:90` |
| `rnGoals` | функція | `src/scripts/core/56-run.js:95` |
| `rnEnd` | функція | `src/scripts/core/56-run.js:96` |
| `rnOver` | функція | `src/scripts/core/56-run.js:97` |
| `rnVal` | функція | `src/scripts/core/56-run.js:98` |
| `rnPct` | функція | `src/scripts/core/56-run.js:99` |
| `rnMoving` | функція | `src/scripts/core/56-run.js:100` |
| `rnHit` | функція | `src/scripts/core/56-run.js:101` |
| `rnTime` | функція | `src/scripts/core/56-run.js:102` |
| `rnLvDone` | функція | `src/scripts/core/56-run.js:107` |
| `rnXP` | функція | `src/scripts/core/56-run.js:108` |
| `rnStats` | функція | `src/scripts/core/56-run.js:111` |
| `window.runTarget` | функція | `src/scripts/core/56-run.js:135` |
| `window.runFinishedAny` | функція | `src/scripts/core/56-run.js:137` |
| `runStripHTML` | функція | `src/scripts/core/56-run.js:145` |
| `runBind` | функція | `src/scripts/core/56-run.js:157` |
| `rnHead` | функція | `src/scripts/core/56-run.js:160` |
| `rnStatsHTML` | функція | `src/scripts/core/56-run.js:161` |
| `rnGoalHTML` | функція | `src/scripts/core/56-run.js:173` |
| `rnCardHTML` | функція | `src/scripts/core/56-run.js:182` |
| `rnFinHTML` | функція | `src/scripts/core/56-run.js:193` |
| `rnPresetEnd` | функція | `src/scripts/core/56-run.js:205` |
| `rnStartHTML` | функція | `src/scripts/core/56-run.js:212` |
| `rnReadDraft` | функція | `src/scripts/core/56-run.js:237` |
| `rnStartBind` | функція | `src/scripts/core/56-run.js:245` |
| `rnLogSheet` | функція | `src/scripts/core/56-run.js:270` |
| `rnLive` | функція | `src/scripts/core/56-run.js:301` |
| `rnArchive` | функція | `src/scripts/core/56-run.js:305` |
| `rnConfirm` | функція | `src/scripts/core/56-run.js:311` |
| `rnCardBind` | функція | `src/scripts/core/56-run.js:317` |
| `rnAfter` | функція | `src/scripts/core/56-run.js:335` |
| `runOpen` | функція | `src/scripts/core/56-run.js:337` |
| `window.runOpen` | значення | `src/scripts/core/56-run.js:347` |

### `src/scripts/core/57-core.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CORE_VERSION` | значення | `src/scripts/core/57-core.js:18` |
| `coreReady` | функція | `src/scripts/core/57-core.js:19` |
| `corePart` | функція | `src/scripts/core/57-core.js:20` |
| `coreEnvSaved` | функція | `src/scripts/core/57-core.js:24` |
| `coreMoney` | функція | `src/scripts/core/57-core.js:28` |
| `coreGoals` | функція | `src/scripts/core/57-core.js:39` |
| `coreDay` | функція | `src/scripts/core/57-core.js:50` |
| `coreWeek` | функція | `src/scripts/core/57-core.js:55` |
| `coreDiary` | функція | `src/scripts/core/57-core.js:62` |
| `coreNotes` | функція | `src/scripts/core/57-core.js:66` |
| `coreGoalLinks` | функція | `src/scripts/core/57-core.js:75` |
| `graph` | функція | `src/scripts/core/57-core.js:94` |
| `snapshot` | функція | `src/scripts/core/57-core.js:103` |
| `window.Core` | обʼєкт | `src/scripts/core/57-core.js:115` |

### `src/scripts/core/57-my-plan.js` — 49 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `mrDetail` | значення | `src/scripts/core/57-my-plan.js:11` |
| `MR_QN` | масив | `src/scripts/core/57-my-plan.js:12` |
| `mrQuarters` | функція | `src/scripts/core/57-my-plan.js:15` |
| `mrActive` | функція | `src/scripts/core/57-my-plan.js:20` |
| `mrLvIn` | функція | `src/scripts/core/57-my-plan.js:24` |
| `mrEn` | функція | `src/scripts/core/57-my-plan.js:26` |
| `mrT` | функція | `src/scripts/core/57-my-plan.js:27` |
| `mrFar` | функція | `src/scripts/core/57-my-plan.js:29` |
| `mrDate` | функція | `src/scripts/core/57-my-plan.js:31` |
| `mrMonth` | функція | `src/scripts/core/57-my-plan.js:38` |
| `mrFinish` | функція | `src/scripts/core/57-my-plan.js:45` |
| `mrUntil` | функція | `src/scripts/core/57-my-plan.js:50` |
| `mrFirst` | функція | `src/scripts/core/57-my-plan.js:51` |
| `mrPointB` | функція | `src/scripts/core/57-my-plan.js:55` |
| `mrTile` | функція | `src/scripts/core/57-my-plan.js:66` |
| `mrCalendar` | функція | `src/scripts/core/57-my-plan.js:77` |
| `mrHTML` | функція | `src/scripts/core/57-my-plan.js:86` |
| `mrSub` | функція | `src/scripts/core/57-my-plan.js:101` |
| `mrOpen` | функція | `src/scripts/core/57-my-plan.js:102` |
| `mrBind` | функція | `src/scripts/core/57-my-plan.js:104` |
| `mrDayCard` | функція | `src/scripts/core/57-my-plan.js:117` |
| `mrDayBind` | функція | `src/scripts/core/57-my-plan.js:130` |
| `mrMoneySum` | функція | `src/scripts/core/57-my-plan.js:145` |
| `mrEnv` | функція | `src/scripts/core/57-my-plan.js:147` |
| `mrSaved` | функція | `src/scripts/core/57-my-plan.js:151` |
| `mrK` | функція | `src/scripts/core/57-my-plan.js:152` |
| `mrDueOk` | функція | `src/scripts/core/57-my-plan.js:153` |
| `mrDueDs` | функція | `src/scripts/core/57-my-plan.js:155` |
| `mrDaysLeft` | функція | `src/scripts/core/57-my-plan.js:160` |
| `mrPerMonth` | функція | `src/scripts/core/57-my-plan.js:162` |
| `mrWishesOf` | функція | `src/scripts/core/57-my-plan.js:167` |
| `mrUnlinkWishes` | функція | `src/scripts/core/57-my-plan.js:169` |
| `mrWishImg` | функція | `src/scripts/core/57-my-plan.js:174` |
| `mrGoalHTML` | функція | `src/scripts/core/57-my-plan.js:176` |
| `mrGoalPage` | функція | `src/scripts/core/57-my-plan.js:219` |
| `mrWhySheet` | функція | `src/scripts/core/57-my-plan.js:254` |
| `mrDueSheet` | функція | `src/scripts/core/57-my-plan.js:268` |
| `mrSumSheet` | функція | `src/scripts/core/57-my-plan.js:277` |
| `mrMoveSheet` | функція | `src/scripts/core/57-my-plan.js:298` |
| `mrDeposit` | функція | `src/scripts/core/57-my-plan.js:323` |
| `mrAddStep` | функція | `src/scripts/core/57-my-plan.js:337` |
| `mrAddPhoto` | функція | `src/scripts/core/57-my-plan.js:350` |
| `mrLinkWish` | функція | `src/scripts/core/57-my-plan.js:375` |
| `mrNewGoal` | функція | `src/scripts/core/57-my-plan.js:392` |
| `mrMoneyHTML` | функція | `src/scripts/core/57-my-plan.js:433` |
| `mrRules` | функція | `src/scripts/core/57-my-plan.js:449` |
| `mrRulesHTML` | функція | `src/scripts/core/57-my-plan.js:450` |
| `mrRuleEdit` | функція | `src/scripts/core/57-my-plan.js:456` |
| `mrRuleMenu` | функція | `src/scripts/core/57-my-plan.js:468` |

### `src/scripts/core/58-moods.js` — 44 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MOODS_KEY` | значення | `src/scripts/core/58-moods.js:11` |
| `MOODS` | обʼєкт | `src/scripts/core/58-moods.js:12` |
| `mdLang` | функція | `src/scripts/core/58-moods.js:14` |
| `MD_T` | обʼєкт | `src/scripts/core/58-moods.js:15` |
| `mdT` | функція | `src/scripts/core/58-moods.js:49` |
| `MD_ICONS` | масив | `src/scripts/core/58-moods.js:50` |
| `MD_COLORS` | масив | `src/scripts/core/58-moods.js:51` |
| `MD_SLOTS` | масив | `src/scripts/core/58-moods.js:52` |
| `mdSel` | значення | `src/scripts/core/58-moods.js:53` |
| `mdF` | значення | `src/scripts/core/58-moods.js:54` |
| `mdListId` | значення | `src/scripts/core/58-moods.js:55` |
| `mdClean` | функція | `src/scripts/core/58-moods.js:58` |
| `loadMoods` | функція | `src/scripts/core/58-moods.js:72` |
| `window.loadMoods` | значення | `src/scripts/core/58-moods.js:77` |
| `saveMoods` | функція | `src/scripts/core/58-moods.js:78` |
| `moodGet` | функція | `src/scripts/core/58-moods.js:79` |
| `moodDaysOf` | функція | `src/scripts/core/58-moods.js:80` |
| `moodStepsOf` | функція | `src/scripts/core/58-moods.js:81` |
| `moodSetSteps` | функція | `src/scripts/core/58-moods.js:82` |
| `moodName` | функція | `src/scripts/core/58-moods.js:83` |
| `moodAll` | функція | `src/scripts/core/58-moods.js:85` |
| `mdNewStepId` | функція | `src/scripts/core/58-moods.js:90` |
| `moodTemplates` | функція | `src/scripts/core/58-moods.js:91` |
| `mdSlotNow` | функція | `src/scripts/core/58-moods.js:100` |
| `moodStat` | функція | `src/scripts/core/58-moods.js:102` |
| `moodCurrent` | функція | `src/scripts/core/58-moods.js:108` |
| `moodsBlockHTML` | функція | `src/scripts/core/58-moods.js:117` |
| `moodsBlockBind` | функція | `src/scripts/core/58-moods.js:145` |
| `mdRerender` | функція | `src/scripts/core/58-moods.js:154` |
| `mdTaTimer` | значення | `src/scripts/core/58-moods.js:157` |
| `moodFocus` | функція | `src/scripts/core/58-moods.js:158` |
| `mdTaFlush` | функція | `src/scripts/core/58-moods.js:172` |
| `mdFocusClose` | функція | `src/scripts/core/58-moods.js:178` |
| `mdFocusRender` | функція | `src/scripts/core/58-moods.js:185` |
| `moodFocusRerender` | функція | `src/scripts/core/58-moods.js:241` |
| `moodListSheet` | функція | `src/scripts/core/58-moods.js:248` |
| `moodMenu` | функція | `src/scripts/core/58-moods.js:265` |
| `moodSetBook` | функція | `src/scripts/core/58-moods.js:280` |
| `moodBookPick` | функція | `src/scripts/core/58-moods.js:286` |
| `moodToDiary` | функція | `src/scripts/core/58-moods.js:298` |
| `moodSheet` | функція | `src/scripts/core/58-moods.js:311` |
| `mdShelfHTML` | функція | `src/scripts/core/58-moods.js:367` |
| `mdShelfBind` | функція | `src/scripts/core/58-moods.js:377` |
| `mdBookNew` | функція | `src/scripts/core/58-moods.js:385` |

### `src/scripts/core/59-core-screen.js` — 19 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `crLang` | функція | `src/scripts/core/59-core-screen.js:10` |
| `CR_T` | обʼєкт | `src/scripts/core/59-core-screen.js:11` |
| `crT` | функція | `src/scripts/core/59-core-screen.js:37` |
| `crGoalId` | значення | `src/scripts/core/59-core-screen.js:38` |
| `CR_MAX` | значення | `src/scripts/core/59-core-screen.js:39` |
| `crGoalObj` | функція | `src/scripts/core/59-core-screen.js:41` |
| `crMoney` | функція | `src/scripts/core/59-core-screen.js:42` |
| `crAt` | функція | `src/scripts/core/59-core-screen.js:44` |
| `crLine` | функція | `src/scripts/core/59-core-screen.js:46` |
| `crStar` | функція | `src/scripts/core/59-core-screen.js:47` |
| `crLifeHTML` | функція | `src/scripts/core/59-core-screen.js:54` |
| `crGoalHTML` | функція | `src/scripts/core/59-core-screen.js:72` |
| `crRender` | функція | `src/scripts/core/59-core-screen.js:94` |
| `crAct` | функція | `src/scripts/core/59-core-screen.js:107` |
| `crGo` | функція | `src/scripts/core/59-core-screen.js:117` |
| `crSheet` | функція | `src/scripts/core/59-core-screen.js:120` |
| `goCore` | функція | `src/scripts/core/59-core-screen.js:162` |
| `crLive` | функція | `src/scripts/core/59-core-screen.js:167` |
| `window.goCore` | значення | `src/scripts/core/59-core-screen.js:172` |

### `src/scripts/core/60-core-actions.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `caLang` | функція | `src/scripts/core/60-core-actions.js:16` |
| `CA_T` | обʼєкт | `src/scripts/core/60-core-actions.js:17` |
| `caT` | функція | `src/scripts/core/60-core-actions.js:33` |
| `caReady` | функція | `src/scripts/core/60-core-actions.js:34` |
| `caStr` | функція | `src/scripts/core/60-core-actions.js:35` |
| `caAmt` | функція | `src/scripts/core/60-core-actions.js:36` |
| `caGoal` | функція | `src/scripts/core/60-core-actions.js:37` |
| `caFresh` | функція | `src/scripts/core/60-core-actions.js:38` |
| `ACTIONS` | обʼєкт | `src/scripts/core/60-core-actions.js:41` |
| `caMoney` | функція | `src/scripts/core/60-core-actions.js:42` |
| `listeners` | масив | `src/scripts/core/60-core-actions.js:149` |
| `notify` | функція | `src/scripts/core/60-core-actions.js:151` |
| `run` | функція | `src/scripts/core/60-core-actions.js:153` |
| `C` | значення | `src/scripts/core/60-core-actions.js:176` |

### `src/scripts/core/61-folder-canvas.js` — 15 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FC_GAP` | значення | `src/scripts/core/61-folder-canvas.js:10` |
| `fcEdit` | значення | `src/scripts/core/61-folder-canvas.js:11` |
| `fcDev` | функція | `src/scripts/core/61-folder-canvas.js:12` |
| `fcCols` | функція | `src/scripts/core/61-folder-canvas.js:13` |
| `fcRectOk` | функція | `src/scripts/core/61-folder-canvas.js:14` |
| `fcSaved` | функція | `src/scripts/core/61-folder-canvas.js:15` |
| `fcList` | функція | `src/scripts/core/61-folder-canvas.js:17` |
| `fcDefSize` | функція | `src/scripts/core/61-folder-canvas.js:23` |
| `fcLayout` | функція | `src/scripts/core/61-folder-canvas.js:40` |
| `fcCardHTML` | функція | `src/scripts/core/61-folder-canvas.js:58` |
| `fcRender` | функція | `src/scripts/core/61-folder-canvas.js:67` |
| `fcFreeze` | функція | `src/scripts/core/61-folder-canvas.js:94` |
| `fcAlign` | функція | `src/scripts/core/61-folder-canvas.js:98` |
| `fcBindDrag` | функція | `src/scripts/core/61-folder-canvas.js:109` |
| `fcRz` | значення | `src/scripts/core/61-folder-canvas.js:149` |

### `src/scripts/core/62-block-store.js` — 25 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `BS_KEY` | значення | `src/scripts/core/62-block-store.js:9` |
| `BS_SPH` | масив | `src/scripts/core/62-block-store.js:10` |
| `BS_ITEMS` | обʼєкт | `src/scripts/core/62-block-store.js:14` |
| `BS_REL` | обʼєкт | `src/scripts/core/62-block-store.js:73` |
| `bsLang` | функція | `src/scripts/core/62-block-store.js:74` |
| `bsT` | функція | `src/scripts/core/62-block-store.js:75` |
| `bsReady` | функція | `src/scripts/core/62-block-store.js:78` |
| `bsInStore` | функція | `src/scripts/core/62-block-store.js:79` |
| `bsIsNew` | функція | `src/scripts/core/62-block-store.js:80` |
| `bsRaw` | функція | `src/scripts/core/62-block-store.js:82` |
| `bsGot` | функція | `src/scripts/core/62-block-store.js:83` |
| `bsNewCount` | функція | `src/scripts/core/62-block-store.js:84` |
| `bsSet` | функція | `src/scripts/core/62-block-store.js:85` |
| `bsCatchAt` | значення | `src/scripts/core/62-block-store.js:98` |
| `bsCatchup` | функція | `src/scripts/core/62-block-store.js:99` |
| `bsTrusted` | функція | `src/scripts/core/62-block-store.js:103` |
| `bsPv` | функція | `src/scripts/core/62-block-store.js:106` |
| `bsState` | обʼєкт | `src/scripts/core/62-block-store.js:138` |
| `bsBtn` | функція | `src/scripts/core/62-block-store.js:139` |
| `bsRow` | функція | `src/scripts/core/62-block-store.js:143` |
| `bsHomeHTML` | функція | `src/scripts/core/62-block-store.js:145` |
| `bsPageHTML` | функція | `src/scripts/core/62-block-store.js:162` |
| `bsRedraw` | функція | `src/scripts/core/62-block-store.js:174` |
| `bsToast` | функція | `src/scripts/core/62-block-store.js:184` |
| `bsOpen` | функція | `src/scripts/core/62-block-store.js:185` |

### `src/scripts/core/63-widget-sheet.js` — 22 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `WD_ROWS` | значення | `src/scripts/core/63-widget-sheet.js:8` |
| `WD_SZ_CELL` | обʼєкт | `src/scripts/core/63-widget-sheet.js:9` |
| `WD_CC` | масив | `src/scripts/core/63-widget-sheet.js:10` |
| `wdDev` | функція | `src/scripts/core/63-widget-sheet.js:11` |
| `wdCols` | функція | `src/scripts/core/63-widget-sheet.js:12` |
| `wdCell` | функція | `src/scripts/core/63-widget-sheet.js:14` |
| `wdTierOf` | функція | `src/scripts/core/63-widget-sheet.js:22` |
| `wdTier` | функція | `src/scripts/core/63-widget-sheet.js:29` |
| `wdSetCell` | функція | `src/scripts/core/63-widget-sheet.js:31` |
| `wdCcOf` | функція | `src/scripts/core/63-widget-sheet.js:37` |
| `wdDevNow` | значення | `src/scripts/core/63-widget-sheet.js:39` |
| `WS_KEYS` | масив | `src/scripts/core/63-widget-sheet.js:43` |
| `WS_PAL` | масив | `src/scripts/core/63-widget-sheet.js:44` |
| `wsName` | функція | `src/scripts/core/63-widget-sheet.js:45` |
| `wdSheet` | функція | `src/scripts/core/63-widget-sheet.js:46` |
| `wsGoal` | функція | `src/scripts/core/63-widget-sheet.js:199` |
| `wsQ` | функція | `src/scripts/core/63-widget-sheet.js:200` |
| `wdDup` | функція | `src/scripts/core/63-widget-sheet.js:203` |
| `wdRemove` | функція | `src/scripts/core/63-widget-sheet.js:209` |
| `t` | значення | `src/scripts/core/63-widget-sheet.js:226` |
| `hostOf` | функція | `src/scripts/core/63-widget-sheet.js:227` |
| `stop` | функція | `src/scripts/core/63-widget-sheet.js:228` |

### `src/scripts/core/64-rich-text.js` — 23 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `TX_RICH` | обʼєкт | `src/scripts/core/64-rich-text.js:7` |
| `TX_URL` | значення | `src/scripts/core/64-rich-text.js:8` |
| `TX_MARKS` | масив | `src/scripts/core/64-rich-text.js:10` |
| `TX_LINK` | значення | `src/scripts/core/64-rich-text.js:16` |
| `txHTML` | функція | `src/scripts/core/64-rich-text.js:18` |
| `txPlain` | функція | `src/scripts/core/64-rich-text.js:33` |
| `txPlainKeep` | функція | `src/scripts/core/64-rich-text.js:39` |
| `txHas` | функція | `src/scripts/core/64-rich-text.js:40` |
| `TX_BLOCK` | обʼєкт | `src/scripts/core/64-rich-text.js:42` |
| `txMarkOf` | функція | `src/scripts/core/64-rich-text.js:44` |
| `txMerge` | функція | `src/scripts/core/64-rich-text.js:54` |
| `txFromDom` | функція | `src/scripts/core/64-rich-text.js:59` |
| `txFromHTML` | функція | `src/scripts/core/64-rich-text.js:87` |
| `TX_MON` | масив | `src/scripts/core/64-rich-text.js:95` |
| `TX_DOW` | масив | `src/scripts/core/64-rich-text.js:96` |
| `TX_CUR` | обʼєкт | `src/scripts/core/64-rich-text.js:97` |
| `txDateOf` | функція | `src/scripts/core/64-rich-text.js:99` |
| `txMoneyOf` | функція | `src/scripts/core/64-rich-text.js:113` |
| `txFolderList` | функція | `src/scripts/core/64-rich-text.js:121` |
| `txReEsc` | функція | `src/scripts/core/64-rich-text.js:122` |
| `txChips` | функція | `src/scripts/core/64-rich-text.js:124` |
| `txLead` | функція | `src/scripts/core/64-rich-text.js:149` |
| `txChipCard` | функція | `src/scripts/core/64-rich-text.js:156` |

### `src/scripts/core/65-plan.js` — 58 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PN_TXT` | обʼєкт | `src/scripts/core/65-plan.js:8` |
| `PN_DOW` | обʼєкт | `src/scripts/core/65-plan.js:32` |
| `PN_DOWL` | обʼєкт | `src/scripts/core/65-plan.js:33` |
| `PN_MON` | обʼєкт | `src/scripts/core/65-plan.js:34` |
| `PN_MONG` | обʼєкт | `src/scripts/core/65-plan.js:36` |
| `PN_QC` | обʼєкт | `src/scripts/core/65-plan.js:37` |
| `PN_FC` | масив | `src/scripts/core/65-plan.js:38` |
| `PN_ICO` | обʼєкт | `src/scripts/core/65-plan.js:39` |
| `pnLang` | функція | `src/scripts/core/65-plan.js:53` |
| `pnT` | функція | `src/scripts/core/65-plan.js:54` |
| `pnPer` | значення | `src/scripts/core/65-plan.js:57` |
| `pnRemember` | функція | `src/scripts/core/65-plan.js:61` |
| `pnToday` | функція | `src/scripts/core/65-plan.js:63` |
| `pnDay` | функція | `src/scripts/core/65-plan.js:64` |
| `pnAdd` | функція | `src/scripts/core/65-plan.js:65` |
| `pnMon` | функція | `src/scripts/core/65-plan.js:66` |
| `pnDowI` | функція | `src/scripts/core/65-plan.js:67` |
| `pnHM` | функція | `src/scripts/core/65-plan.js:68` |
| `pnEnd` | функція | `src/scripts/core/65-plan.js:69` |
| `pnRaw` | функція | `src/scripts/core/65-plan.js:71` |
| `pnFolder` | функція | `src/scripts/core/65-plan.js:73` |
| `pnFolderColor` | функція | `src/scripts/core/65-plan.js:74` |
| `pnTaskDate` | функція | `src/scripts/core/65-plan.js:85` |
| `pnTaskOn` | функція | `src/scripts/core/65-plan.js:86` |
| `pnItems` | функція | `src/scripts/core/65-plan.js:94` |
| `pnDayRead` | функція | `src/scripts/core/65-plan.js:101` |
| `pnFind` | функція | `src/scripts/core/65-plan.js:107` |
| `pnChip` | функція | `src/scripts/core/65-plan.js:109` |
| `pnCheck` | функція | `src/scripts/core/65-plan.js:113` |
| `pnStarBtn` | функція | `src/scripts/core/65-plan.js:114` |
| `pnMeta` | функція | `src/scripts/core/65-plan.js:115` |
| `pnRow` | функція | `src/scripts/core/65-plan.js:120` |
| `pnMainHTML` | функція | `src/scripts/core/65-plan.js:127` |
| `pnShort` | функція | `src/scripts/core/65-plan.js:142` |
| `pnAddHTML` | функція | `src/scripts/core/65-plan.js:143` |
| `pnHoursHTML` | функція | `src/scripts/core/65-plan.js:146` |
| `pnQuadHTML` | функція | `src/scripts/core/65-plan.js:161` |
| `pnWeekHTML` | функція | `src/scripts/core/65-plan.js:176` |
| `pnMonthHTML` | функція | `src/scripts/core/65-plan.js:191` |
| `pnYearHTML` | функція | `src/scripts/core/65-plan.js:206` |
| `pnRing` | функція | `src/scripts/core/65-plan.js:217` |
| `pnHead` | функція | `src/scripts/core/65-plan.js:221` |
| `pnStrip` | функція | `src/scripts/core/65-plan.js:232` |
| `pnFlowHint` | функція | `src/scripts/core/65-plan.js:237` |
| `pnRender` | функція | `src/scripts/core/65-plan.js:241` |
| `pnSave` | функція | `src/scripts/core/65-plan.js:265` |
| `pnSplit` | функція | `src/scripts/core/65-plan.js:266` |
| `pnToggleDone` | функція | `src/scripts/core/65-plan.js:267` |
| `pnToggleStar` | функція | `src/scripts/core/65-plan.js:273` |
| `pnFolderSheet` | функція | `src/scripts/core/65-plan.js:279` |
| `pnQuadSheet` | функція | `src/scripts/core/65-plan.js:286` |
| `pnOpen` | функція | `src/scripts/core/65-plan.js:292` |
| `pnAddTask` | функція | `src/scripts/core/65-plan.js:309` |
| `pnFlowOpen` | функція | `src/scripts/core/65-plan.js:317` |
| `pnBind` | функція | `src/scripts/core/65-plan.js:321` |
| `pnTop` | функція | `src/scripts/core/65-plan.js:342` |
| `pnIsOpen` | функція | `src/scripts/core/65-plan.js:343` |
| `goPlan` | функція | `src/scripts/core/65-plan.js:346` |

### `src/scripts/core/66-year-planner.js` — 19 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `ypSel` | значення | `src/scripts/core/66-year-planner.js:9` |
| `ypBack` | значення | `src/scripts/core/66-year-planner.js:10` |
| `YP_QN` | масив | `src/scripts/core/66-year-planner.js:11` |
| `ypT` | функція | `src/scripts/core/66-year-planner.js:12` |
| `ypFreeWishes` | функція | `src/scripts/core/66-year-planner.js:15` |
| `ypCur` | функція | `src/scripts/core/66-year-planner.js:18` |
| `ypCard` | функція | `src/scripts/core/66-year-planner.js:25` |
| `ypWishCard` | функція | `src/scripts/core/66-year-planner.js:31` |
| `ypNewCard` | функція | `src/scripts/core/66-year-planner.js:36` |
| `ypChain` | функція | `src/scripts/core/66-year-planner.js:39` |
| `ypRoad` | функція | `src/scripts/core/66-year-planner.js:53` |
| `ypEmpty` | функція | `src/scripts/core/66-year-planner.js:65` |
| `ypHTML` | функція | `src/scripts/core/66-year-planner.js:75` |
| `ypRender` | функція | `src/scripts/core/66-year-planner.js:91` |
| `ypDock` | функція | `src/scripts/core/66-year-planner.js:119` |
| `ypRefresh` | функція | `src/scripts/core/66-year-planner.js:127` |
| `goYearPlanBack` | функція | `src/scripts/core/66-year-planner.js:128` |
| `goYearPlan` | функція | `src/scripts/core/66-year-planner.js:129` |
| `window.goYearPlan` | значення | `src/scripts/core/66-year-planner.js:134` |

### `src/scripts/page-editor/01-palette.js` — 17 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PGS_CATS` | масив | `src/scripts/page-editor/01-palette.js:5` |
| `CATALOG` | масив | `src/scripts/page-editor/01-palette.js:13` |
| `PGS_SYN` | обʼєкт | `src/scripts/page-editor/01-palette.js:57` |
| `PGS_ICONS` | обʼєкт | `src/scripts/page-editor/01-palette.js:89` |
| `pgsIc` | функція | `src/scripts/page-editor/01-palette.js:143` |
| `bridge` | функція | `src/scripts/page-editor/01-palette.js:145` |
| `editor` | значення | `src/scripts/page-editor/01-palette.js:146` |
| `scr` | значення | `src/scripts/page-editor/01-palette.js:147` |
| `uid` | функція | `src/scripts/page-editor/01-palette.js:148` |
| `esc` | функція | `src/scripts/page-editor/01-palette.js:149` |
| `txtOf` | функція | `src/scripts/page-editor/01-palette.js:152` |
| `setTxt` | функція | `src/scripts/page-editor/01-palette.js:153` |
| `locate` | функція | `src/scripts/page-editor/01-palette.js:155` |
| `save` | функція | `src/scripts/page-editor/01-palette.js:163` |
| `moveBlock` | функція | `src/scripts/page-editor/01-palette.js:167` |
| `snapshotArr` | функція | `src/scripts/page-editor/01-palette.js:189` |
| `restoreArr` | функція | `src/scripts/page-editor/01-palette.js:190` |

### `src/scripts/page-editor/02-block-styles.js` — 55 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `txRich` | функція | `src/scripts/page-editor/02-block-styles.js:2` |
| `txIsRich` | функція | `src/scripts/page-editor/02-block-styles.js:3` |
| `equalizeWidths` | функція | `src/scripts/page-editor/02-block-styles.js:4` |
| `PGH_FONTS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:7` |
| `PGH_CLR_VAR` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:11` |
| `headingClr` | функція | `src/scripts/page-editor/02-block-styles.js:12` |
| `headingStyle` | функція | `src/scripts/page-editor/02-block-styles.js:17` |
| `pgShowHidden` | значення | `src/scripts/page-editor/02-block-styles.js:29` |
| `condMet` | функція | `src/scripts/page-editor/02-block-styles.js:30` |
| `moveBlockSide` | функція | `src/scripts/page-editor/02-block-styles.js:49` |
| `undoMove` | функція | `src/scripts/page-editor/02-block-styles.js:84` |
| `redoMove` | функція | `src/scripts/page-editor/02-block-styles.js:89` |
| `undoStack` | масив | `src/scripts/page-editor/02-block-styles.js:96` |
| `pushOp` | функція | `src/scripts/page-editor/02-block-styles.js:97` |
| `doUndo` | функція | `src/scripts/page-editor/02-block-styles.js:103` |
| `doRedo` | функція | `src/scripts/page-editor/02-block-styles.js:104` |
| `syncUndoBtn` | функція | `src/scripts/page-editor/02-block-styles.js:105` |
| `STATUS_COLORS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:115` |
| `STATUS_ORDER` | масив | `src/scripts/page-editor/02-block-styles.js:116` |
| `dbColType` | функція | `src/scripts/page-editor/02-block-styles.js:117` |
| `dbFmtNum` | функція | `src/scripts/page-editor/02-block-styles.js:118` |
| `PG_GONE` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:122` |
| `inner` | функція | `src/scripts/page-editor/02-block-styles.js:125` |
| `dbEnsure` | функція | `src/scripts/page-editor/02-block-styles.js:377` |
| `dbHTML` | функція | `src/scripts/page-editor/02-block-styles.js:394` |
| `pgSgBusy` | значення | `src/scripts/page-editor/02-block-styles.js:444` |
| `pgSgPlace` | функція | `src/scripts/page-editor/02-block-styles.js:445` |
| `PGLAST` | значення | `src/scripts/page-editor/02-block-styles.js:453` |
| `pgLastGet` | функція | `src/scripts/page-editor/02-block-styles.js:454` |
| `pgLastSet` | функція | `src/scripts/page-editor/02-block-styles.js:455` |
| `PGRECENT` | значення | `src/scripts/page-editor/02-block-styles.js:457` |
| `pgRecentGet` | функція | `src/scripts/page-editor/02-block-styles.js:458` |
| `pgRecentAdd` | функція | `src/scripts/page-editor/02-block-styles.js:459` |
| `renderList` | функція | `src/scripts/page-editor/02-block-styles.js:460` |
| `renderBoardBlock` | функція | `src/scripts/page-editor/02-block-styles.js:480` |
| `renderRowBlock` | функція | `src/scripts/page-editor/02-block-styles.js:514` |
| `renumber` | функція | `src/scripts/page-editor/02-block-styles.js:531` |
| `pgPath` | масив | `src/scripts/page-editor/02-block-styles.js:533` |
| `pgResolve` | функція | `src/scripts/page-editor/02-block-styles.js:534` |
| `pgHeaStrip` | функція | `src/scripts/page-editor/02-block-styles.js:544` |
| `render` | функція | `src/scripts/page-editor/02-block-styles.js:560` |
| `fillWidgetHosts` | функція | `src/scripts/page-editor/02-block-styles.js:596` |
| `window.__pgWidgetsSync` | функція | `src/scripts/page-editor/02-block-styles.js:608` |
| `caretEnd` | функція | `src/scripts/page-editor/02-block-styles.js:614` |
| `slashCtx` | значення | `src/scripts/page-editor/02-block-styles.js:617` |
| `slash` | значення | `src/scripts/page-editor/02-block-styles.js:695` |
| `srail` | значення | `src/scripts/page-editor/02-block-styles.js:697` |
| `pgsCat` | значення | `src/scripts/page-editor/02-block-styles.js:698` |
| `pgsGotOk` | функція | `src/scripts/page-editor/02-block-styles.js:700` |
| `pgsMatch` | функція | `src/scripts/page-editor/02-block-styles.js:701` |
| `pgsHiddenN` | функція | `src/scripts/page-editor/02-block-styles.js:708` |
| `pgsShopOpen` | функція | `src/scripts/page-editor/02-block-styles.js:710` |
| `pgsFiltered` | функція | `src/scripts/page-editor/02-block-styles.js:711` |
| `buildRail` | функція | `src/scripts/page-editor/02-block-styles.js:716` |
| `buildSlash` | функція | `src/scripts/page-editor/02-block-styles.js:730` |

### `src/scripts/page-editor/03-premium-pack.js` — 60 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `pgAsk` | функція | `src/scripts/page-editor/03-premium-pack.js:15` |
| `openCondSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:30` |
| `PG_BW` | обʼєкт | `src/scripts/page-editor/03-premium-pack.js:77` |
| `pgEmptyBlock` | функція | `src/scripts/page-editor/03-premium-pack.js:78` |
| `pgRowOf` | функція | `src/scripts/page-editor/03-premium-pack.js:79` |
| `pgSetCols` | функція | `src/scripts/page-editor/03-premium-pack.js:84` |
| `plToastSafe` | функція | `src/scripts/page-editor/03-premium-pack.js:112` |
| `openLayoutSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:113` |
| `openHeadingStyleSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:162` |
| `unanchorSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:235` |
| `positionSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:241` |
| `pgMenuTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:277` |
| `openSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:278` |
| `pgAddPending` | значення | `src/scripts/page-editor/03-premium-pack.js:287` |
| `dropPendingAdd` | функція | `src/scripts/page-editor/03-premium-pack.js:288` |
| `closeSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:295` |
| `applySlash` | функція | `src/scripts/page-editor/03-premium-pack.js:297` |
| `pgFindWboard` | функція | `src/scripts/page-editor/03-premium-pack.js:433` |
| `pgDataInsert` | функція | `src/scripts/page-editor/03-premium-pack.js:437` |
| `drag` | значення | `src/scripts/page-editor/03-premium-pack.js:466` |
| `dragStale` | функція | `src/scripts/page-editor/03-premium-pack.js:474` |
| `dstart` | функція | `src/scripts/page-editor/03-premium-pack.js:475` |
| `dragBegin` | функція | `src/scripts/page-editor/03-premium-pack.js:484` |
| `dragOff` | функція | `src/scripts/page-editor/03-premium-pack.js:492` |
| `liftOn` | функція | `src/scripts/page-editor/03-premium-pack.js:498` |
| `liftOff` | функція | `src/scripts/page-editor/03-premium-pack.js:507` |
| `ghostMake` | функція | `src/scripts/page-editor/03-premium-pack.js:512` |
| `ghostMove` | функція | `src/scripts/page-editor/03-premium-pack.js:522` |
| `asRaf` | значення | `src/scripts/page-editor/03-premium-pack.js:524` |
| `pgScroller` | функція | `src/scripts/page-editor/03-premium-pack.js:525` |
| `asTick` | функція | `src/scripts/page-editor/03-premium-pack.js:530` |
| `ghostKill` | функція | `src/scripts/page-editor/03-premium-pack.js:537` |
| `clearMarks` | функція | `src/scripts/page-editor/03-premium-pack.js:538` |
| `dmove` | функція | `src/scripts/page-editor/03-premium-pack.js:539` |
| `dtrack` | функція | `src/scripts/page-editor/03-premium-pack.js:554` |
| `dend` | функція | `src/scripts/page-editor/03-premium-pack.js:577` |
| `cancelDrag` | функція | `src/scripts/page-editor/03-premium-pack.js:596` |
| `bmenu` | значення | `src/scripts/page-editor/03-premium-pack.js:727` |
| `openBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:728` |
| `lmenu` | значення | `src/scripts/page-editor/03-premium-pack.js:777` |
| `lmenuOpen` | функція | `src/scripts/page-editor/03-premium-pack.js:783` |
| `lmenuHide` | функція | `src/scripts/page-editor/03-premium-pack.js:795` |
| `lmenuClose` | функція | `src/scripts/page-editor/03-premium-pack.js:796` |
| `closeBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:806` |
| `bmRun` | функція | `src/scripts/page-editor/03-premium-pack.js:811` |
| `THKEY` | значення | `src/scripts/page-editor/03-premium-pack.js:864` |
| `applyTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:865` |
| `pageThemeDefault` | функція | `src/scripts/page-editor/03-premium-pack.js:870` |
| `window.__pgThemeAuto` | функція | `src/scripts/page-editor/03-premium-pack.js:879` |
| `window.__pgThemeIsAuto` | функція | `src/scripts/page-editor/03-premium-pack.js:880` |
| `pgTitle` | значення | `src/scripts/page-editor/03-premium-pack.js:894` |
| `pgTitleCommit` | функція | `src/scripts/page-editor/03-premium-pack.js:897` |
| `addBtn` | значення | `src/scripts/page-editor/03-premium-pack.js:916` |
| `pgLastEdit` | значення | `src/scripts/page-editor/03-premium-pack.js:918` |
| `pgTrackEdit` | функція | `src/scripts/page-editor/03-premium-pack.js:921` |
| `pgAddViaMenu` | функція | `src/scripts/page-editor/03-premium-pack.js:928` |
| `pgcApi` | значення | `src/scripts/page-editor/03-premium-pack.js:943` |
| `CD_MONTHS` | масив | `src/scripts/page-editor/03-premium-pack.js:1144` |
| `cdFmt` | функція | `src/scripts/page-editor/03-premium-pack.js:1145` |
| `cdHTML` | функція | `src/scripts/page-editor/03-premium-pack.js:1150` |

### `src/scripts/page-editor/04-table.js` — 26 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `TB_TY` | обʼєкт | `src/scripts/page-editor/04-table.js:7` |
| `TB_ST` | масив | `src/scripts/page-editor/04-table.js:8` |
| `TB_MAXC` | значення | `src/scripts/page-editor/04-table.js:9` |
| `tbId` | функція | `src/scripts/page-editor/04-table.js:10` |
| `tbInit` | функція | `src/scripts/page-editor/04-table.js:11` |
| `tbHasTy` | функція | `src/scripts/page-editor/04-table.js:16` |
| `tbOkId` | функція | `src/scripts/page-editor/04-table.js:17` |
| `tbCols` | функція | `src/scripts/page-editor/04-table.js:18` |
| `tbRows` | функція | `src/scripts/page-editor/04-table.js:19` |
| `tbYm` | функція | `src/scripts/page-editor/04-table.js:20` |
| `tbDays` | функція | `src/scripts/page-editor/04-table.js:21` |
| `tbFolder` | функція | `src/scripts/page-editor/04-table.js:22` |
| `tbPlanMin` | функція | `src/scripts/page-editor/04-table.js:24` |
| `tbRowDate` | функція | `src/scripts/page-editor/04-table.js:29` |
| `tbNum` | функція | `src/scripts/page-editor/04-table.js:30` |
| `tbFmt` | функція | `src/scripts/page-editor/04-table.js:31` |
| `tbCellHTML` | функція | `src/scripts/page-editor/04-table.js:32` |
| `tbHTML` | функція | `src/scripts/page-editor/04-table.js:40` |
| `tbTitleCol` | функція | `src/scripts/page-editor/04-table.js:80` |
| `tbBoardHTML` | функція | `src/scripts/page-editor/04-table.js:81` |
| `tbCalHTML` | функція | `src/scripts/page-editor/04-table.js:98` |
| `tbLoc` | функція | `src/scripts/page-editor/04-table.js:110` |
| `tbCellObj` | функція | `src/scripts/page-editor/04-table.js:111` |
| `tbSetUndo` | функція | `src/scripts/page-editor/04-table.js:113` |
| `tbColSheet` | функція | `src/scripts/page-editor/04-table.js:178` |
| `tbCfgSheet` | функція | `src/scripts/page-editor/04-table.js:206` |

### `src/scripts/page-editor/05-fold.js` — 8 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `fdLoc` | функція | `src/scripts/page-editor/05-fold.js:5` |
| `fdOk` | функція | `src/scripts/page-editor/05-fold.js:6` |
| `fdIco` | функція | `src/scripts/page-editor/05-fold.js:7` |
| `fdHTML` | функція | `src/scripts/page-editor/05-fold.js:8` |
| `fdSet` | функція | `src/scripts/page-editor/05-fold.js:19` |
| `fdTree` | функція | `src/scripts/page-editor/05-fold.js:26` |
| `fdPick` | функція | `src/scripts/page-editor/05-fold.js:33` |
| `sbHTML` | функція | `src/scripts/page-editor/05-fold.js:51` |

### `src/scripts/page-editor/08-w-projects-hub.js` — 41 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `pgFileIc` | функція | `src/scripts/page-editor/08-w-projects-hub.js:2` |
| `cdTick` | функція | `src/scripts/page-editor/08-w-projects-hub.js:10` |
| `CAL_MONTHS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:38` |
| `calWrap` | значення | `src/scripts/page-editor/08-w-projects-hub.js:39` |
| `calId` | значення | `src/scripts/page-editor/08-w-projects-hub.js:50` |
| `calYmd` | функція | `src/scripts/page-editor/08-w-projects-hub.js:51` |
| `openCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:52` |
| `closeCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:60` |
| `buildCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:61` |
| `pgPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:332` |
| `PGPH_SIZES` | масив | `src/scripts/page-editor/08-w-projects-hub.js:357` |
| `pgSzBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:358` |
| `pgSzBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:359` |
| `pgSzSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:387` |
| `pgSzClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:394` |
| `pgPhotoSizeSheet` | функція | `src/scripts/page-editor/08-w-projects-hub.js:395` |
| `pgPhotoMenu` | функція | `src/scripts/page-editor/08-w-projects-hub.js:398` |
| `pgRz` | значення | `src/scripts/page-editor/08-w-projects-hub.js:419` |
| `COVKEY` | значення | `src/scripts/page-editor/08-w-projects-hub.js:441` |
| `covers` | обʼєкт | `src/scripts/page-editor/08-w-projects-hub.js:442` |
| `covIsData` | функція | `src/scripts/page-editor/08-w-projects-hub.js:456` |
| `covStore` | функція | `src/scripts/page-editor/08-w-projects-hub.js:457` |
| `covDropImg` | функція | `src/scripts/page-editor/08-w-projects-hub.js:463` |
| `covRetryT` | значення | `src/scripts/page-editor/08-w-projects-hub.js:471` |
| `covImgUrl` | функція | `src/scripts/page-editor/08-w-projects-hub.js:472` |
| `covSaveT` | значення | `src/scripts/page-editor/08-w-projects-hub.js:482` |
| `saveCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:483` |
| `saveCoversSoon` | функція | `src/scripts/page-editor/08-w-projects-hub.js:492` |
| `flushCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:496` |
| `COV_GRADS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:506` |
| `covEl` | значення | `src/scripts/page-editor/08-w-projects-hub.js:512` |
| `covKey` | функція | `src/scripts/page-editor/08-w-projects-hub.js:532` |
| `covMenuHTML` | функція | `src/scripts/page-editor/08-w-projects-hub.js:533` |
| `renderCover` | функція | `src/scripts/page-editor/08-w-projects-hub.js:540` |
| `covPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:572` |
| `covEdBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:615` |
| `covEdState` | функція | `src/scripts/page-editor/08-w-projects-hub.js:616` |
| `covEdSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:622` |
| `covEdBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:635` |
| `covEdOpen` | функція | `src/scripts/page-editor/08-w-projects-hub.js:689` |
| `covEdClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:690` |

### `src/scripts/page-editor/08b-rich-text.js` — 100 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `rbBar` | значення | `src/scripts/page-editor/08b-rich-text.js:7` |
| `RB_BTN` | масив | `src/scripts/page-editor/08b-rich-text.js:9` |
| `rbPhone` | функція | `src/scripts/page-editor/08b-rich-text.js:14` |
| `rbField` | функція | `src/scripts/page-editor/08b-rich-text.js:16` |
| `rbIsPgc` | функція | `src/scripts/page-editor/08b-rich-text.js:25` |
| `pgcShown` | функція | `src/scripts/page-editor/08b-rich-text.js:27` |
| `rbDock` | функція | `src/scripts/page-editor/08b-rich-text.js:29` |
| `rbHide` | функція | `src/scripts/page-editor/08b-rich-text.js:35` |
| `rbPlace` | функція | `src/scripts/page-editor/08b-rich-text.js:36` |
| `rbSync` | функція | `src/scripts/page-editor/08b-rich-text.js:58` |
| `rbSave` | функція | `src/scripts/page-editor/08b-rich-text.js:76` |
| `rbDo` | функція | `src/scripts/page-editor/08b-rich-text.js:83` |
| `rbMark` | функція | `src/scripts/page-editor/08b-rich-text.js:102` |
| `rbUrl` | функція | `src/scripts/page-editor/08b-rich-text.js:113` |
| `range` | значення | `src/scripts/page-editor/08b-rich-text.js:133` |
| `br` | значення | `src/scripts/page-editor/08b-rich-text.js:155` |
| `lc` | значення | `src/scripts/page-editor/08b-rich-text.js:162` |
| `s` | значення | `src/scripts/page-editor/08b-rich-text.js:164` |
| `keepMarks` | значення | `src/scripts/page-editor/08b-rich-text.js:166` |
| `src` | значення | `src/scripts/page-editor/08b-rich-text.js:167` |
| `id` | значення | `src/scripts/page-editor/08b-rich-text.js:170` |
| `isList` | значення | `src/scripts/page-editor/08b-rich-text.js:171` |
| `ov` | значення | `src/scripts/page-editor/08b-rich-text.js:174` |
| `out` | значення | `src/scripts/page-editor/08b-rich-text.js:181` |
| `close` | функція | `src/scripts/page-editor/08b-rich-text.js:182` |
| `key` | функція | `src/scripts/page-editor/08b-rich-text.js:184` |
| `mo` | обʼєкт | `src/scripts/page-editor/08b-rich-text.js:187` |
| `SYS` | значення | `src/scripts/page-editor/08b-rich-text.js:189` |
| `txt` | значення | `src/scripts/page-editor/08b-rich-text.js:197` |
| `o` | значення | `src/scripts/page-editor/08b-rich-text.js:201` |
| `clean` | функція | `src/scripts/page-editor/08b-rich-text.js:203` |
| `items` | значення | `src/scripts/page-editor/08b-rich-text.js:204` |
| `text` | значення | `src/scripts/page-editor/08b-rich-text.js:205` |
| `A` | значення | `src/scripts/page-editor/08b-rich-text.js:209` |
| `lc` | значення | `src/scripts/page-editor/08b-rich-text.js:220` |
| `arr` | значення | `src/scripts/page-editor/08b-rich-text.js:221` |
| `isList` | значення | `src/scripts/page-editor/08b-rich-text.js:222` |
| `after` | значення | `src/scripts/page-editor/08b-rich-text.js:238` |
| `lc` | значення | `src/scripts/page-editor/08b-rich-text.js:263` |
| `br` | значення | `src/scripts/page-editor/08b-rich-text.js:267` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:284` |
| `lc` | значення | `src/scripts/page-editor/08b-rich-text.js:285` |
| `h` | значення | `src/scripts/page-editor/08b-rich-text.js:286` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:292` |
| `k` | значення | `src/scripts/page-editor/08b-rich-text.js:293` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:304` |
| `lc` | значення | `src/scripts/page-editor/08b-rich-text.js:305` |
| `raw` | значення | `src/scripts/page-editor/08b-rich-text.js:306` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:319` |
| `lc` | значення | `src/scripts/page-editor/08b-rich-text.js:320` |
| `cd` | значення | `src/scripts/page-editor/08b-rich-text.js:321` |
| `html` | значення | `src/scripts/page-editor/08b-rich-text.js:323` |
| `marks` | значення | `src/scripts/page-editor/08b-rich-text.js:326` |
| `ch` | значення | `src/scripts/page-editor/08b-rich-text.js:336` |
| `a` | значення | `src/scripts/page-editor/08b-rich-text.js:338` |
| `ce` | значення | `src/scripts/page-editor/08b-rich-text.js:339` |
| `u` | значення | `src/scripts/page-editor/08b-rich-text.js:340` |
| `q` | значення | `src/scripts/page-editor/08b-rich-text.js:352` |
| `q` | значення | `src/scripts/page-editor/08b-rich-text.js:359` |
| `cats` | значення | `src/scripts/page-editor/08b-rich-text.js:360` |
| `nn` | значення | `src/scripts/page-editor/08b-rich-text.js:361` |
| `hid` | значення | `src/scripts/page-editor/08b-rich-text.js:362` |
| `b` | значення | `src/scripts/page-editor/08b-rich-text.js:370` |
| `plus` | значення | `src/scripts/page-editor/08b-rich-text.js:371` |
| `b` | значення | `src/scripts/page-editor/08b-rich-text.js:396` |
| `nb` | обʼєкт | `src/scripts/page-editor/08b-rich-text.js:403` |
| `s` | значення | `src/scripts/page-editor/08b-rich-text.js:418` |
| `pgc` | значення | `src/scripts/page-editor/08b-rich-text.js:419` |
| `phone` | значення | `src/scripts/page-editor/08b-rich-text.js:422` |
| `box` | значення | `src/scripts/page-editor/08b-rich-text.js:424` |
| `more` | значення | `src/scripts/page-editor/08b-rich-text.js:429` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:446` |
| `lim` | значення | `src/scripts/page-editor/08b-rich-text.js:447` |
| `d` | значення | `src/scripts/page-editor/08b-rich-text.js:448` |
| `cb` | значення | `src/scripts/page-editor/08b-rich-text.js:455` |
| `more` | значення | `src/scripts/page-editor/08b-rich-text.js:456` |
| `head` | значення | `src/scripts/page-editor/08b-rich-text.js:469` |
| `sty` | значення | `src/scripts/page-editor/08b-rich-text.js:476` |
| `sel` | значення | `src/scripts/page-editor/08b-rich-text.js:477` |
| `b` | значення | `src/scripts/page-editor/08b-rich-text.js:490` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:491` |
| `a` | значення | `src/scripts/page-editor/08b-rich-text.js:495` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:518` |
| `r` | значення | `src/scripts/page-editor/08b-rich-text.js:519` |
| `w0` | значення | `src/scripts/page-editor/08b-rich-text.js:520` |
| `n` | значення | `src/scripts/page-editor/08b-rich-text.js:521` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:531` |
| `lc` | значення | `src/scripts/page-editor/08b-rich-text.js:533` |
| `el` | значення | `src/scripts/page-editor/08b-rich-text.js:540` |
| `r` | значення | `src/scripts/page-editor/08b-rich-text.js:541` |
| `IN` | значення | `src/scripts/page-editor/08b-rich-text.js:545` |
| `pv` | значення | `src/scripts/page-editor/08b-rich-text.js:548` |
| `nx` | значення | `src/scripts/page-editor/08b-rich-text.js:549` |
| `t` | значення | `src/scripts/page-editor/08b-rich-text.js:550` |
| `vv` | значення | `src/scripts/page-editor/08b-rich-text.js:566` |
| `cap` | значення | `src/scripts/page-editor/08b-rich-text.js:567` |
| `t` | значення | `src/scripts/page-editor/08b-rich-text.js:568` |
| `moved` | функція | `src/scripts/page-editor/08b-rich-text.js:569` |
| `b` | значення | `src/scripts/page-editor/08b-rich-text.js:581` |
| `k` | значення | `src/scripts/page-editor/08b-rich-text.js:582` |

### `src/scripts/page-editor/09-open-page.js` — 1 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `fid` | значення | `src/scripts/page-editor/09-open-page.js:19` |

### `src/scripts/page-editor/10-mic.js` — 13 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `el` | значення | `src/scripts/page-editor/10-mic.js:26` |
| `ins` | значення | `src/scripts/page-editor/10-mic.js:55` |
| `cur` | значення | `src/scripts/page-editor/10-mic.js:57` |
| `v` | значення | `src/scripts/page-editor/10-mic.js:59` |
| `add` | значення | `src/scripts/page-editor/10-mic.js:60` |
| `el` | значення | `src/scripts/page-editor/10-mic.js:78` |
| `before` | значення | `src/scripts/page-editor/10-mic.js:89` |
| `needSpace` | значення | `src/scripts/page-editor/10-mic.js:90` |
| `ok` | значення | `src/scripts/page-editor/10-mic.js:93` |
| `mime` | значення | `src/scripts/page-editor/10-mic.js:132` |
| `chunks` | масив | `src/scripts/page-editor/10-mic.js:138` |
| `startedAt` | значення | `src/scripts/page-editor/10-mic.js:139` |
| `field` | значення | `src/scripts/page-editor/10-mic.js:184` |

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

### `tools/test-month.js` — 7 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `fs` | значення | `tools/test-month.js:18` |
| `path` | значення | `tools/test-month.js:19` |
| `target` | функція | `tools/test-month.js:22` |
| `WAIT` | значення | `tools/test-month.js:23` |
| `sleep` | функція | `tools/test-month.js:24` |
| `errors` | масив | `tools/test-month.js:25` |
| `pageMain` | функція | `tools/test-month.js:32` |

### `tools/test-rls.mjs` — 16 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `ROOT` | значення | `tools/test-rls.mjs:20` |
| `storage` | значення | `tools/test-rls.mjs:21` |
| `SB_URL` | значення | `tools/test-rls.mjs:22` |
| `SB_KEY` | значення | `tools/test-rls.mjs:23` |
| `envFile` | значення | `tools/test-rls.mjs:26` |
| `env` | обʼєкт | `tools/test-rls.mjs:27` |
| `need` | функція | `tools/test-rls.mjs:34` |
| `pass` | значення | `tools/test-rls.mjs:37` |
| `check` | функція | `tools/test-rls.mjs:38` |
| `signIn` | функція | `tools/test-rls.mjs:44` |
| `rest` | функція | `tools/test-rls.mjs:53` |
| `enc` | значення | `tools/test-rls.mjs:61` |
| `denied` | функція | `tools/test-rls.mjs:62` |
| `KEY` | значення | `tools/test-rls.mjs:64` |
| `onA` | значення | `tools/test-rls.mjs:72` |
| `readA` | функція | `tools/test-rls.mjs:73` |

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
