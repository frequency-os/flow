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
| Файлів JS | 87 |
| Рядків JS | 33077 |
| Файлів CSS | 49 |
| Рядків CSS | 10520 |
| Сутностей верхнього рівня | 2335 |
| Ключів сховища (FLOW_KEYS) | 79 |

## Файли JS

| Файл | Рядків | Сутностей |
|---|---|---|
| `desktop/main.js` | 232 | 13 |
| `desktop/preload.js` | 21 | 0 |
| `src/scripts/01-crash-screen.js` | 82 | 10 |
| `src/scripts/03-quota-banner.js` | 14 | 2 |
| `src/scripts/21-newyear-countdown.js` | 127 | 11 |
| `src/scripts/40-pets-3d.js` | 297 | 0 |
| `src/scripts/41-theme-layer.js` | 153 | 0 |
| `src/scripts/42-voice-island.js` | 792 | 0 |
| `src/scripts/43-planner.js` | 137 | 0 |
| `src/scripts/44-week.js` | 325 | 0 |
| `src/scripts/45-month.js` | 662 | 0 |
| `src/scripts/46-mx.js` | 220 | 0 |
| `src/scripts/core/01-base.js` | 411 | 39 |
| `src/scripts/core/02-storage.js` | 2097 | 175 |
| `src/scripts/core/03-platform.js` | 60 | 14 |
| `src/scripts/core/04-folders-nav.js` | 426 | 58 |
| `src/scripts/core/05-spaces.js` | 691 | 61 |
| `src/scripts/core/06-wishes.js` | 1470 | 112 |
| `src/scripts/core/07-values.js` | 202 | 18 |
| `src/scripts/core/08-finance.js` | 655 | 86 |
| `src/scripts/core/09-goals.js` | 692 | 27 |
| `src/scripts/core/10-planner.js` | 923 | 49 |
| `src/scripts/core/11-ai-flow.js` | 258 | 26 |
| `src/scripts/core/12-ai-agent.js` | 1831 | 94 |
| `src/scripts/core/13-pets.js` | 240 | 14 |
| `src/scripts/core/14-react.js` | 338 | 43 |
| `src/scripts/core/15-flow-spot.js` | 2067 | 98 |
| `src/scripts/core/16-dashboard.js` | 1112 | 61 |
| `src/scripts/core/17-folder-render.js` | 16 | 2 |
| `src/scripts/core/18-debts.js` | 199 | 18 |
| `src/scripts/core/19-spending.js` | 136 | 14 |
| `src/scripts/core/20-work.js` | 525 | 51 |
| `src/scripts/core/21-patterns.js` | 191 | 21 |
| `src/scripts/core/22-diary.js` | 531 | 54 |
| `src/scripts/core/23-board.js` | 295 | 29 |
| `src/scripts/core/24-reminders.js` | 181 | 16 |
| `src/scripts/core/25-reader.js` | 566 | 40 |
| `src/scripts/core/26-blocks-render.js` | 1203 | 16 |
| `src/scripts/core/27-canvas.js` | 594 | 27 |
| `src/scripts/core/28-vision.js` | 528 | 42 |
| `src/scripts/core/29-more-screen.js` | 596 | 32 |
| `src/scripts/core/30-upgrade.js` | 296 | 30 |
| `src/scripts/core/31-my-year.js` | 200 | 21 |
| `src/scripts/core/32-global-search.js` | 152 | 13 |
| `src/scripts/core/34-shortcuts.js` | 54 | 5 |
| `src/scripts/core/35-channel.js` | 691 | 65 |
| `src/scripts/core/36-chats.js` | 437 | 46 |
| `src/scripts/core/37-ai-privacy.js` | 202 | 20 |
| `src/scripts/core/38-world.js` | 107 | 5 |
| `src/scripts/core/39-spheres.js` | 233 | 20 |
| `src/scripts/core/40-year-letter.js` | 292 | 30 |
| `src/scripts/core/41-journal.js` | 749 | 64 |
| `src/scripts/core/42-day.js` | 363 | 41 |
| `src/scripts/core/43-month.js` | 257 | 34 |
| `src/scripts/core/44-prizes.js` | 171 | 24 |
| `src/scripts/core/45-year.js` | 145 | 21 |
| `src/scripts/core/46-wallet.js` | 408 | 36 |
| `src/scripts/core/47-rules.js` | 351 | 29 |
| `src/scripts/core/48-hero.js` | 338 | 41 |
| `src/scripts/core/48-widgets.js` | 463 | 46 |
| `src/scripts/core/49-calendar.js` | 310 | 36 |
| `src/scripts/core/49-finlit.js` | 132 | 17 |
| `src/scripts/core/50-quickadd.js` | 65 | 5 |
| `src/scripts/core/51-money-reset.js` | 132 | 15 |
| `src/scripts/core/52-fresh-start.js` | 204 | 27 |
| `src/scripts/core/53-starter.js` | 155 | 18 |
| `src/scripts/core/54-intro.js` | 79 | 9 |
| `src/scripts/page-editor/01-palette.js` | 180 | 17 |
| `src/scripts/page-editor/02-block-styles.js` | 764 | 49 |
| `src/scripts/page-editor/03-premium-pack.js` | 649 | 35 |
| `src/scripts/page-editor/08-w-projects-hub.js` | 689 | 41 |
| `src/scripts/page-editor/09-open-page.js` | 33 | 1 |
| `src/scripts/page-editor/10-mic.js` | 154 | 10 |
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
| `tools/test-migrations.js` | 297 | 29 |
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
| `src/styles/17-horizon.css` | 238 | 1 |
| `src/styles/18-standalone.css` | 43 | 1 |
| `src/styles/19-themes-flat.css` | 408 | 3 |
| `src/styles/20-depth.css` | 129 | 8 |
| `src/styles/21-hero-week.css` | 133 | 2 |
| `src/styles/22-more-screen.css` | 181 | 0 |
| `src/styles/23-doc-readable.css` | 110 | 4 |
| `src/styles/core/01-tokens-base.css` | 349 | 9 |
| `src/styles/core/02-page-editor.css` | 989 | 9 |
| `src/styles/core/03-folders-projects.css` | 643 | 0 |
| `src/styles/core/04-menus.css` | 89 | 0 |
| `src/styles/core/05-values-wishes.css` | 186 | 0 |
| `src/styles/core/06-goals.css` | 206 | 0 |
| `src/styles/core/07-finance.css` | 586 | 0 |
| `src/styles/core/08-work.css` | 202 | 0 |
| `src/styles/core/09-board-canvas.css` | 188 | 3 |
| `src/styles/core/10-reader-blocks.css` | 448 | 4 |
| `src/styles/core/11-spaces-desktop.css` | 181 | 0 |
| `src/styles/core/12-pets-more-planner.css` | 1228 | 0 |
| `src/styles/core/13-search-capture.css` | 84 | 0 |
| `src/styles/core/15-vision.css` | 172 | 0 |
| `src/styles/core/16-upgrade.css` | 54 | 0 |
| `src/styles/core/17-my-year.css` | 64 | 0 |
| `src/styles/core/18-channel.css` | 178 | 0 |
| `src/styles/core/19-chats.css` | 120 | 0 |
| `src/styles/core/20-world.css` | 20 | 0 |
| `src/styles/core/21-spheres.css` | 82 | 0 |
| `src/styles/core/22-year-letter.css` | 70 | 0 |
| `src/styles/core/23-ritual-steps.css` | 65 | 0 |
| `src/styles/core/24-home-gallery.css` | 215 | 0 |
| `src/styles/core/25-journal.css` | 301 | 0 |
| `src/styles/core/26-day.css` | 173 | 0 |
| `src/styles/core/27-month.css` | 202 | 0 |
| `src/styles/core/28-prizes.css` | 43 | 0 |
| `src/styles/core/29-year.css` | 84 | 0 |
| `src/styles/core/30-wallet.css` | 147 | 0 |
| `src/styles/core/31-rules.css` | 76 | 0 |
| `src/styles/core/32-widgets.css` | 292 | 0 |
| `src/styles/core/33-starter.css` | 63 | 0 |
| `src/styles/core/34-intro.css` | 73 | 0 |

## Ключі сховища — FLOW_KEYS (79)

`src/scripts/core/01-base.js`

`0` · `active_space_map_v2` · `ai_chat` · `ai_endpoint` · `ai_memory` · `ai_pet`

`ai_privacy_v1` · `ai_prompts` · `ai_voice` · `blockusage` · `board` · `chats_v1`

`collage_board` · `custom_avatar_v1` · `customboards` · `debts` · `diary_books_v1` · `diary_entries_v1`

`diary_insights_v1` · `envelopes` · `fin_curs` · `fin_ops` · `fin_projects` · `fin_recurring`

`fin_tomb` · `flowPgCovers` · `flowcardskin` · `flowprotheme` · `flowtheme` · `folder_widgets`

`folderopts` · `folders_cfg` · `folders_deleted_v1` · `folders_order` · `folderview` · `forcedesktop`

`forcemobile` · `fx_cfg` · `fx_mode` · `fx_say` · `goals_data` · `hero_look`

`home_glass_on` · `homeov` · `hometab` · `homewidgets` · `i18n_content_cache` · `income_cards`

`lang_pref` · `main_cur` · `patterns_chains` · `patterns_score` · `patterns_transform` · `pet_hidden`

`pet_pos` · `pet_sleep` · `readerCfg` · `ritual_board` · `sidebarcol` · `spacecanvas`

`spacecanvaszoom` · `spacefull` · `spaces_map_v2` · `spaceview` · `spacewide` · `spend`

`switcher_style` · `ui_mode` · `upgrade_profile_v1` · `values_state` · `vision_v1` · `wish_active_days_v1`

`wish_price` · `wishes_board` · `work_blocks` · `work_cfg` · `work_extras` · `work_sessions`

`world_game`

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

### `src/scripts/01-crash-screen.js` — 10 сутностей

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
| `window.FLOW_RAW_KEYS` | масив | `src/scripts/core/01-base.js:179` |
| `getLang` | функція | `src/scripts/core/01-base.js:196` |
| `setLang` | функція | `src/scripts/core/01-base.js:197` |
| `window.__flowLang` | значення | `src/scripts/core/01-base.js:198` |
| `window.flowLang` | значення | `src/scripts/core/01-base.js:199` |
| `window.flowSetLang` | значення | `src/scripts/core/01-base.js:200` |
| `I18N_DICT` | обʼєкт | `src/scripts/core/01-base.js:205` |
| `I18N_WORDS` | масив | `src/scripts/core/01-base.js:257` |
| `wordLevelTranslate` | функція | `src/scripts/core/01-base.js:285` |
| `I18N_NO_TOUCH` | обʼєкт | `src/scripts/core/01-base.js:300` |
| `translateNode` | функція | `src/scripts/core/01-base.js:303` |
| `i18nApply` | функція | `src/scripts/core/01-base.js:326` |
| `window.i18nApply` | значення | `src/scripts/core/01-base.js:330` |
| `i18nBlocked` | функція | `src/scripts/core/01-base.js:334` |
| `raf` | значення | `src/scripts/core/01-base.js:344` |
| `flush` | функція | `src/scripts/core/01-base.js:345` |
| `mo` | функція | `src/scripts/core/01-base.js:352` |
| `contentTranslateOn` | функція | `src/scripts/core/01-base.js:373` |
| `window.flowContentTranslateOn` | значення | `src/scripts/core/01-base.js:376` |
| `hash` | функція | `src/scripts/core/01-base.js:377` |
| `cacheGet` | функція | `src/scripts/core/01-base.js:378` |
| `window.flowTranslateContent` | функція | `src/scripts/core/01-base.js:383` |
| `window.__flowErrors` | масив | `src/scripts/core/01-base.js:399` |
| `push` | функція | `src/scripts/core/01-base.js:400` |
| `window.flowErrors` | функція | `src/scripts/core/01-base.js:409` |

### `src/scripts/core/02-storage.js` — 175 сутностей

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
| `npHydrate` | функція | `src/scripts/core/02-storage.js:226` |
| `npSeed` | функція | `src/scripts/core/02-storage.js:251` |
| `window.storage` | обʼєкт | `src/scripts/core/02-storage.js:268` |
| `SB_URL` | значення | `src/scripts/core/02-storage.js:360` |
| `SB_KEY` | значення | `src/scripts/core/02-storage.js:361` |
| `sb` | значення | `src/scripts/core/02-storage.js:362` |
| `sbBatchCache` | значення | `src/scripts/core/02-storage.js:363` |
| `sbBatchTs` | обʼєкт | `src/scripts/core/02-storage.js:364` |
| `window.__sbReady` | значення | `src/scripts/core/02-storage.js:365` |
| `OWNER_KEY` | значення | `src/scripts/core/02-storage.js:384` |
| `sbOwnerRead` | функція | `src/scripts/core/02-storage.js:385` |
| `sbPastUsers` | функція | `src/scripts/core/02-storage.js:390` |
| `sbForeign` | значення | `src/scripts/core/02-storage.js:396` |
| `sbTabOwner` | значення | `src/scripts/core/02-storage.js:397` |
| `sbReloading` | значення | `src/scripts/core/02-storage.js:398` |
| `sbReloadTab` | функція | `src/scripts/core/02-storage.js:399` |
| `sbSetUser` | функція | `src/scripts/core/02-storage.js:404` |
| `sbOutboxMine` | функція | `src/scripts/core/02-storage.js:440` |
| `loadSupabaseLib` | функція | `src/scripts/core/02-storage.js:451` |
| `sbReadyEvt` | функція | `src/scripts/core/02-storage.js:471` |
| `sbInit` | функція | `src/scripts/core/02-storage.js:472` |
| `window.sbUser` | функція | `src/scripts/core/02-storage.js:528` |
| `sbFromCloud` | функція | `src/scripts/core/02-storage.js:538` |
| `sbToCloud` | функція | `src/scripts/core/02-storage.js:539` |
| `window.sbAccessToken` | функція | `src/scripts/core/02-storage.js:547` |
| `sbPrefetchAll` | функція | `src/scripts/core/02-storage.js:556` |
| `sbLocalVersion` | функція | `src/scripts/core/02-storage.js:571` |
| `window.sbPrefetchAll` | значення | `src/scripts/core/02-storage.js:579` |
| `window.sbCloudFresher` | функція | `src/scripts/core/02-storage.js:585` |
| `window.sbCacheLocal` | функція | `src/scripts/core/02-storage.js:599` |
| `window.sbDataTrusted` | функція | `src/scripts/core/02-storage.js:614` |
| `keyRead` | обʼєкт | `src/scripts/core/02-storage.js:630` |
| `keyMark` | обʼєкт | `src/scripts/core/02-storage.js:631` |
| `keyRecon` | обʼєкт | `src/scripts/core/02-storage.js:632` |
| `keyPending` | обʼєкт | `src/scripts/core/02-storage.js:633` |
| `sbLastGot` | обʼєкт | `src/scripts/core/02-storage.js:634` |
| `autoDepth` | значення | `src/scripts/core/02-storage.js:635` |
| `sbReconciled` | функція | `src/scripts/core/02-storage.js:636` |
| `window.storeMarkRead` | функція | `src/scripts/core/02-storage.js:638` |
| `window.storeKeyReady` | функція | `src/scripts/core/02-storage.js:658` |
| `window.storeAutoBegin` | функція | `src/scripts/core/02-storage.js:668` |
| `window.storeAuto` | функція | `src/scripts/core/02-storage.js:672` |
| `sbWriteMeta` | функція | `src/scripts/core/02-storage.js:689` |
| `sbMergeHeld` | функція | `src/scripts/core/02-storage.js:714` |
| `HK_PREFIX` | значення | `src/scripts/core/02-storage.js:750` |
| `sbKeepHeld` | функція | `src/scripts/core/02-storage.js:751` |
| `sbReconcile` | функція | `src/scripts/core/02-storage.js:772` |
| `sbCommitReconciled` | функція | `src/scripts/core/02-storage.js:793` |
| `sbSigningIn` | значення | `src/scripts/core/02-storage.js:814` |
| `window.sbSignInGoogle` | функція | `src/scripts/core/02-storage.js:815` |
| `window.sbSignOut` | функція | `src/scripts/core/02-storage.js:892` |
| `origGet` | значення | `src/scripts/core/02-storage.js:930` |
| `origSet` | значення | `src/scripts/core/02-storage.js:931` |
| `origDelete` | значення | `src/scripts/core/02-storage.js:932` |
| `origList` | значення | `src/scripts/core/02-storage.js:933` |
| `sbGet` | функція | `src/scripts/core/02-storage.js:935` |
| `sbWriteQueue` | обʼєкт | `src/scripts/core/02-storage.js:980` |
| `sbWriteTimer` | значення | `src/scripts/core/02-storage.js:981` |
| `sbInFlight` | обʼєкт | `src/scripts/core/02-storage.js:987` |
| `sbFlushSeq` | значення | `src/scripts/core/02-storage.js:993` |
| `sbDoneSeq` | обʼєкт | `src/scripts/core/02-storage.js:994` |
| `sbOutboxSave` | функція | `src/scripts/core/02-storage.js:997` |
| `sbOutboxTimer` | значення | `src/scripts/core/02-storage.js:1021` |
| `sbOutboxKeys` | обʼєкт | `src/scripts/core/02-storage.js:1022` |
| `sbHiding` | значення | `src/scripts/core/02-storage.js:1023` |
| `sbOutboxSaveSoon` | функція | `src/scripts/core/02-storage.js:1024` |
| `sbOutboxLoad` | функція | `src/scripts/core/02-storage.js:1028` |
| `sbSyncPending` | функція | `src/scripts/core/02-storage.js:1035` |
| `sbScheduleWrite` | функція | `src/scripts/core/02-storage.js:1036` |
| `sbFlushWrites` | функція | `src/scripts/core/02-storage.js:1044` |
| `window.sbFlushWrites` | значення | `src/scripts/core/02-storage.js:1107` |
| `window.sbDropQueue` | функція | `src/scripts/core/02-storage.js:1109` |
| `sbOnHide` | функція | `src/scripts/core/02-storage.js:1116` |
| `sbPullChanged` | функція | `src/scripts/core/02-storage.js:1151` |
| `sbLastPull` | значення | `src/scripts/core/02-storage.js:1173` |
| `sbPullFresh` | функція | `src/scripts/core/02-storage.js:1174` |
| `sbPullAndLoad` | функція | `src/scripts/core/02-storage.js:1192` |
| `window.sbPullFresh` | значення | `src/scripts/core/02-storage.js:1215` |
| `window.sbPullAndLoad` | значення | `src/scripts/core/02-storage.js:1216` |
| `PH_KEY` | значення | `src/scripts/core/02-storage.js:1232` |
| `PH_PENDING` | значення | `src/scripts/core/02-storage.js:1233` |
| `phPendingGet` | функція | `src/scripts/core/02-storage.js:1234` |
| `phPendingSet` | функція | `src/scripts/core/02-storage.js:1235` |
| `phPendingAdd` | функція | `src/scripts/core/02-storage.js:1236` |
| `phPendingDrop` | функція | `src/scripts/core/02-storage.js:1237` |
| `PH_TS` | значення | `src/scripts/core/02-storage.js:1242` |
| `phTsGet` | функція | `src/scripts/core/02-storage.js:1243` |
| `phTsSet` | функція | `src/scripts/core/02-storage.js:1244` |
| `phTsDrop` | функція | `src/scripts/core/02-storage.js:1245` |
| `window.sbPhotoPush` | функція | `src/scripts/core/02-storage.js:1247` |
| `window.sbPhotoFetch` | функція | `src/scripts/core/02-storage.js:1263` |
| `window.sbPhotoList` | функція | `src/scripts/core/02-storage.js:1280` |
| `window.sbPhotoDel` | функція | `src/scripts/core/02-storage.js:1295` |
| `phSyncBusy` | значення | `src/scripts/core/02-storage.js:1305` |
| `sbPhotoSync` | функція | `src/scripts/core/02-storage.js:1306` |
| `window.sbPhotoSync` | значення | `src/scripts/core/02-storage.js:1336` |
| `window.sbWipeAll` | функція | `src/scripts/core/02-storage.js:1341` |
| `prefSet` | функція | `src/scripts/core/02-storage.js:1410` |
| `prefCatchup` | функція | `src/scripts/core/02-storage.js:1414` |
| `UIMODE_KEY` | значення | `src/scripts/core/02-storage.js:1427` |
| `window.uiMode` | значення | `src/scripts/core/02-storage.js:1428` |
| `applyUiMode` | функція | `src/scripts/core/02-storage.js:1429` |
| `setUiMode` | функція | `src/scripts/core/02-storage.js:1430` |
| `window.setUiMode` | значення | `src/scripts/core/02-storage.js:1438` |
| `LP` | значення | `src/scripts/core/02-storage.js:1445` |
| `FORMAT` | значення | `src/scripts/core/02-storage.js:1446` |
| `APP` | значення | `src/scripts/core/02-storage.js:1447` |
| `ZIP_JSON` | значення | `src/scripts/core/02-storage.js:1448` |
| `isSvc` | функція | `src/scripts/core/02-storage.js:1454` |
| `RAW_DATA` | масив | `src/scripts/core/02-storage.js:1458` |
| `JSON_KEYS` | масив | `src/scripts/core/02-storage.js:1460` |
| `collect` | функція | `src/scripts/core/02-storage.js:1464` |
| `collectRaw` | функція | `src/scripts/core/02-storage.js:1481` |
| `stats` | функція | `src/scripts/core/02-storage.js:1488` |
| `phBytes` | функція | `src/scripts/core/02-storage.js:1494` |
| `signedIn` | функція | `src/scripts/core/02-storage.js:1495` |
| `photoStats` | функція | `src/scripts/core/02-storage.js:1501` |
| `gatherPhotos` | функція | `src/scripts/core/02-storage.js:1522` |
| `makeEnvelope` | функція | `src/scripts/core/02-storage.js:1549` |
| `loadZip` | функція | `src/scripts/core/02-storage.js:1562` |
| `PH_EXT` | обʼєкт | `src/scripts/core/02-storage.js:1567` |
| `dataUrlParts` | функція | `src/scripts/core/02-storage.js:1568` |
| `makeFile` | функція | `src/scripts/core/02-storage.js:1581` |
| `saveBlob` | функція | `src/scripts/core/02-storage.js:1631` |
| `saveFile` | функція | `src/scripts/core/02-storage.js:1676` |
| `photosGap` | функція | `src/scripts/core/02-storage.js:1683` |
| `tapStillFresh` | функція | `src/scripts/core/02-storage.js:1694` |
| `exportToFile` | функція | `src/scripts/core/02-storage.js:1703` |
| `snapshot` | функція | `src/scripts/core/02-storage.js:1718` |
| `restoreSnapshot` | функція | `src/scripts/core/02-storage.js:1721` |
| `unwrapVal` | функція | `src/scripts/core/02-storage.js:1729` |
| `valOf` | функція | `src/scripts/core/02-storage.js:1734` |
| `checkEnvelope` | функція | `src/scripts/core/02-storage.js:1743` |
| `plural` | функція | `src/scripts/core/02-storage.js:1761` |
| `summarize` | функція | `src/scripts/core/02-storage.js:1766` |
| `readFile` | функція | `src/scripts/core/02-storage.js:1789` |
| `inspectFile` | функція | `src/scripts/core/02-storage.js:1799` |
| `applyEnvelope` | функція | `src/scripts/core/02-storage.js:1828` |
| `pushRestored` | функція | `src/scripts/core/02-storage.js:1852` |
| `applyInspected` | функція | `src/scripts/core/02-storage.js:1881` |
| `importFromFile` | функція | `src/scripts/core/02-storage.js:1899` |
| `window.flowBackup` | обʼєкт | `src/scripts/core/02-storage.js:1905` |
| `window.flowFactoryReset` | функція | `src/scripts/core/02-storage.js:1921` |
| `window.PhotoDB` | значення | `src/scripts/core/02-storage.js:1994` |
| `window.__photoCache` | значення | `src/scripts/core/02-storage.js:2032` |
| `__phPending` | обʼєкт | `src/scripts/core/02-storage.js:2038` |
| `__photoPoke` | функція | `src/scripts/core/02-storage.js:2039` |
| `window.photoSrc` | функція | `src/scripts/core/02-storage.js:2047` |
| `window.photoIsRef` | функція | `src/scripts/core/02-storage.js:2071` |
| `window.photoWarm` | функція | `src/scripts/core/02-storage.js:2072` |
| `window.photoPut` | функція | `src/scripts/core/02-storage.js:2078` |
| `window.photoDel` | функція | `src/scripts/core/02-storage.js:2087` |

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

### `src/scripts/core/04-folders-nav.js` — 58 сутностей

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
| `folderDelPending` | обʼєкт | `src/scripts/core/04-folders-nav.js:88` |
| `folderVisible` | функція | `src/scripts/core/04-folders-nav.js:89` |
| `folderDeleteLater` | функція | `src/scripts/core/04-folders-nav.js:90` |
| `folderDeleteCancel` | функція | `src/scripts/core/04-folders-nav.js:100` |
| `foldersLoaded` | значення | `src/scripts/core/04-folders-nav.js:120` |
| `markFoldersLoaded` | функція | `src/scripts/core/04-folders-nav.js:121` |
| `foldersLookFactory` | функція | `src/scripts/core/04-folders-nav.js:123` |
| `storedFolderCount` | функція | `src/scripts/core/04-folders-nav.js:128` |
| `saveFolders` | функція | `src/scripts/core/04-folders-nav.js:137` |
| `FDELKEY` | значення | `src/scripts/core/04-folders-nav.js:181` |
| `FDEL_MAX` | значення | `src/scripts/core/04-folders-nav.js:182` |
| `tombsNorm` | функція | `src/scripts/core/04-folders-nav.js:183` |
| `tombsMerge` | функція | `src/scripts/core/04-folders-nav.js:192` |
| `tombsSame` | функція | `src/scripts/core/04-folders-nav.js:197` |
| `folderTombs` | обʼєкт | `src/scripts/core/04-folders-nav.js:201` |
| `folderTombed` | функція | `src/scripts/core/04-folders-nav.js:204` |
| `saveFolderTombs` | функція | `src/scripts/core/04-folders-nav.js:205` |
| `window.folderTombsReset` | функція | `src/scripts/core/04-folders-nav.js:207` |
| `folderPurge` | функція | `src/scripts/core/04-folders-nav.js:218` |
| `folderDelete` | функція | `src/scripts/core/04-folders-nav.js:265` |
| `mergeFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:283` |
| `applyFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:292` |
| `leaveTombedFolder` | функція | `src/scripts/core/04-folders-nav.js:320` |
| `folderWidgets` | обʼєкт | `src/scripts/core/04-folders-nav.js:339` |
| `FWKEY` | значення | `src/scripts/core/04-folders-nav.js:340` |
| `saveFolderWidgets` | функція | `src/scripts/core/04-folders-nav.js:341` |
| `orderedFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:343` |
| `PROJECT_STATUSES` | масив | `src/scripts/core/04-folders-nav.js:349` |
| `projStatusMeta` | функція | `src/scripts/core/04-folders-nav.js:353` |
| `folderProgress` | функція | `src/scripts/core/04-folders-nav.js:355` |
| `dueLabel` | функція | `src/scripts/core/04-folders-nav.js:367` |
| `projFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:376` |
| `childFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:379` |
| `topFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:382` |
| `isDescendantFolder` | функція | `src/scripts/core/04-folders-nav.js:386` |
| `moveFolderTo` | функція | `src/scripts/core/04-folders-nav.js:394` |
| `goHome` | функція | `src/scripts/core/04-folders-nav.js:404` |
| `goFolder` | функція | `src/scripts/core/04-folders-nav.js:405` |
| `goDebts` | функція | `src/scripts/core/04-folders-nav.js:420` |
| `goFinance` | функція | `src/scripts/core/04-folders-nav.js:421` |
| `goEnvelopes` | функція | `src/scripts/core/04-folders-nav.js:422` |
| `goSpend` | функція | `src/scripts/core/04-folders-nav.js:423` |
| `workOrigin` | значення | `src/scripts/core/04-folders-nav.js:424` |
| `goWork` | функція | `src/scripts/core/04-folders-nav.js:425` |

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
| `spaceFromFolder` | значення | `src/scripts/core/05-spaces.js:74` |
| `show` | функція | `src/scripts/core/05-spaces.js:77` |
| `dsbFillUser` | функція | `src/scripts/core/05-spaces.js:130` |
| `window.dsbFillUser` | значення | `src/scripts/core/05-spaces.js:153` |
| `dsbProfileSheet` | функція | `src/scripts/core/05-spaces.js:154` |
| `STG_COL` | обʼєкт | `src/scripts/core/05-spaces.js:190` |
| `STG_IC` | обʼєкт | `src/scripts/core/05-spaces.js:192` |
| `stgSvg` | функція | `src/scripts/core/05-spaces.js:220` |
| `stgIco` | функція | `src/scripts/core/05-spaces.js:224` |
| `renderSettingsCard` | функція | `src/scripts/core/05-spaces.js:239` |
| `window.renderSettingsCard` | значення | `src/scripts/core/05-spaces.js:321` |
| `openSettings` | функція | `src/scripts/core/05-spaces.js:326` |
| `window.openSettingsSheet` | значення | `src/scripts/core/05-spaces.js:333` |
| `sidebarCollapsed` | значення | `src/scripts/core/05-spaces.js:368` |
| `applyChrome` | функція | `src/scripts/core/05-spaces.js:373` |
| `homeWidgets` | значення | `src/scripts/core/05-spaces.js:389` |
| `applyHomeWidgets` | функція | `src/scripts/core/05-spaces.js:392` |
| `THEME_SETS` | обʼєкт | `src/scripts/core/05-spaces.js:412` |
| `THEME_META` | обʼєкт | `src/scripts/core/05-spaces.js:418` |
| `THEME_KEYS` | значення | `src/scripts/core/05-spaces.js:427` |
| `isTheme` | функція | `src/scripts/core/05-spaces.js:428` |
| `themeSetOf` | функція | `src/scripts/core/05-spaces.js:430` |
| `themeIsDark` | функція | `src/scripts/core/05-spaces.js:434` |
| `theme` | значення | `src/scripts/core/05-spaces.js:435` |
| `applyTheme` | функція | `src/scripts/core/05-spaces.js:459` |
| `setTheme` | функція | `src/scripts/core/05-spaces.js:484` |
| `setThemeSet` | функція | `src/scripts/core/05-spaces.js:494` |
| `toggleTheme` | функція | `src/scripts/core/05-spaces.js:498` |
| `proTheme` | значення | `src/scripts/core/05-spaces.js:512` |
| `applyProTheme` | функція | `src/scripts/core/05-spaces.js:514` |
| `toggleProTheme` | функція | `src/scripts/core/05-spaces.js:520` |
| `cardSkin` | значення | `src/scripts/core/05-spaces.js:530` |
| `applyCardSkin` | функція | `src/scripts/core/05-spaces.js:532` |
| `setCardSkin` | функція | `src/scripts/core/05-spaces.js:538` |
| `RR_DEFS` | обʼєкт | `src/scripts/core/05-spaces.js:559` |
| `rrCfg` | функція | `src/scripts/core/05-spaces.js:560` |
| `rrSave` | функція | `src/scripts/core/05-spaces.js:565` |
| `rrCfgSheet` | функція | `src/scripts/core/05-spaces.js:566` |
| `renderRightRail` | функція | `src/scripts/core/05-spaces.js:585` |
| `goGoals` | функція | `src/scripts/core/05-spaces.js:613` |
| `prjHexToRgb` | функція | `src/scripts/core/05-spaces.js:616` |
| `prjTileHTML` | функція | `src/scripts/core/05-spaces.js:624` |
| `renderProjects` | функція | `src/scripts/core/05-spaces.js:632` |
| `goProjects` | функція | `src/scripts/core/05-spaces.js:665` |
| `goPlanner` | функція | `src/scripts/core/05-spaces.js:670` |
| `goValues` | функція | `src/scripts/core/05-spaces.js:675` |
| `goWishes` | функція | `src/scripts/core/05-spaces.js:677` |
| `window.goWishes` | значення | `src/scripts/core/05-spaces.js:678` |

### `src/scripts/core/06-wishes.js` — 112 сутностей

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
| `compressImage` | функція | `src/scripts/core/06-wishes.js:207` |
| `pickWishPhoto` | функція | `src/scripts/core/06-wishes.js:228` |
| `replaceWishPhoto` | функція | `src/scripts/core/06-wishes.js:271` |
| `askWishCap` | функція | `src/scripts/core/06-wishes.js:295` |
| `openWishCard` | функція | `src/scripts/core/06-wishes.js:301` |
| `pickProofPhoto` | функція | `src/scripts/core/06-wishes.js:375` |
| `delWish` | функція | `src/scripts/core/06-wishes.js:382` |
| `parseVideo` | функція | `src/scripts/core/06-wishes.js:397` |
| `addWishVideo` | функція | `src/scripts/core/06-wishes.js:415` |
| `setWishCover` | функція | `src/scripts/core/06-wishes.js:440` |
| `openWishVideo` | функція | `src/scripts/core/06-wishes.js:457` |
| `openWishMenu` | функція | `src/scripts/core/06-wishes.js:466` |
| `moveWish` | функція | `src/scripts/core/06-wishes.js:508` |
| `wishToGoal` | функція | `src/scripts/core/06-wishes.js:515` |
| `RIT_KEY` | значення | `src/scripts/core/06-wishes.js:542` |
| `RIT` | обʼєкт | `src/scripts/core/06-wishes.js:543` |
| `RIT_STEPS_KEY` | значення | `src/scripts/core/06-wishes.js:547` |
| `RIT_STEPS` | значення | `src/scripts/core/06-wishes.js:548` |
| `loadRitual` | функція | `src/scripts/core/06-wishes.js:554` |
| `saveRitual` | функція | `src/scripts/core/06-wishes.js:561` |
| `saveRitSteps` | функція | `src/scripts/core/06-wishes.js:562` |
| `__ritLoad` | значення | `src/scripts/core/06-wishes.js:563` |
| `ritualRerender` | функція | `src/scripts/core/06-wishes.js:565` |
| `ritualSheet` | функція | `src/scripts/core/06-wishes.js:572` |
| `ritForWorld` | функція | `src/scripts/core/06-wishes.js:590` |
| `ritDayForWorld` | функція | `src/scripts/core/06-wishes.js:599` |
| `goRitual` | функція | `src/scripts/core/06-wishes.js:616` |
| `ritDay` | функція | `src/scripts/core/06-wishes.js:638` |
| `ritDs` | функція | `src/scripts/core/06-wishes.js:639` |
| `ritStreak` | функція | `src/scripts/core/06-wishes.js:640` |
| `ytId` | функція | `src/scripts/core/06-wishes.js:654` |
| `fmtDur` | функція | `src/scripts/core/06-wishes.js:655` |
| `ritRec` | значення | `src/scripts/core/06-wishes.js:658` |
| `ritStopAll` | функція | `src/scripts/core/06-wishes.js:659` |
| `ritRecord` | функція | `src/scripts/core/06-wishes.js:661` |
| `ritPlay` | функція | `src/scripts/core/06-wishes.js:697` |
| `ritMixPlay` | функція | `src/scripts/core/06-wishes.js:698` |
| `ritFieldMic` | функція | `src/scripts/core/06-wishes.js:707` |
| `ritMixMenu` | функція | `src/scripts/core/06-wishes.js:717` |
| `ritAddLink` | функція | `src/scripts/core/06-wishes.js:725` |
| `ritLinkMenu` | функція | `src/scripts/core/06-wishes.js:735` |
| `RIT_CAT` | обʼєкт | `src/scripts/core/06-wishes.js:748` |
| `RIT_TPL` | масив | `src/scripts/core/06-wishes.js:762` |
| `RIT_TY` | обʼєкт | `src/scripts/core/06-wishes.js:768` |
| `ritCleanStep` | функція | `src/scripts/core/06-wishes.js:770` |
| `ritSteps` | функція | `src/scripts/core/06-wishes.js:780` |
| `RIT_OWN_IC` | обʼєкт | `src/scripts/core/06-wishes.js:784` |
| `ritCat` | функція | `src/scripts/core/06-wishes.js:785` |
| `ritMeta` | функція | `src/scripts/core/06-wishes.js:786` |
| `ritAudioKey` | функція | `src/scripts/core/06-wishes.js:789` |
| `ritStepDone` | функція | `src/scripts/core/06-wishes.js:790` |
| `ritTouch` | функція | `src/scripts/core/06-wishes.js:797` |
| `ritSaveToday` | функція | `src/scripts/core/06-wishes.js:798` |
| `ritTplName` | функція | `src/scripts/core/06-wishes.js:799` |
| `ritStepHTML` | функція | `src/scripts/core/06-wishes.js:805` |
| `ritMixHTML` | функція | `src/scripts/core/06-wishes.js:830` |
| `ritLinksHTML` | функція | `src/scripts/core/06-wishes.js:841` |
| `ritualInnerHTML` | функція | `src/scripts/core/06-wishes.js:854` |
| `ritualBind` | функція | `src/scripts/core/06-wishes.js:880` |
| `ritEditor` | функція | `src/scripts/core/06-wishes.js:940` |
| `RPH_ICON` | значення | `src/scripts/core/06-wishes.js:998` |
| `ritPhotoCardHTML` | функція | `src/scripts/core/06-wishes.js:999` |
| `ritPhotoTap` | функція | `src/scripts/core/06-wishes.js:1013` |
| `fetchWithTimeout` | функція | `src/scripts/core/06-wishes.js:1024` |
| `ritSavePhoto` | функція | `src/scripts/core/06-wishes.js:1030` |
| `ritPhotoMenu` | функція | `src/scripts/core/06-wishes.js:1048` |
| `rmomTimer` | значення | `src/scripts/core/06-wishes.js:1057` |
| `ritEnterMoment` | функція | `src/scripts/core/06-wishes.js:1060` |
| `ritMixRecTap` | функція | `src/scripts/core/06-wishes.js:1108` |
| `ritMixLongOrRec` | функція | `src/scripts/core/06-wishes.js:1109` |
| `CLG_KEY` | значення | `src/scripts/core/06-wishes.js:1117` |
| `collage` | масив | `src/scripts/core/06-wishes.js:1118` |
| `loadCollage` | функція | `src/scripts/core/06-wishes.js:1120` |
| `saveCollage` | функція | `src/scripts/core/06-wishes.js:1122` |
| `goCollage` | функція | `src/scripts/core/06-wishes.js:1125` |
| `clgPickPhotos` | функція | `src/scripts/core/06-wishes.js:1128` |
| `clgImportWishes` | функція | `src/scripts/core/06-wishes.js:1143` |
| `clgMenu` | функція | `src/scripts/core/06-wishes.js:1154` |
| `renderCollage` | функція | `src/scripts/core/06-wishes.js:1167` |
| `clgWrap` | функція | `src/scripts/core/06-wishes.js:1224` |
| `clgWallpaper` | функція | `src/scripts/core/06-wishes.js:1230` |
| `wdkShow` | значення | `src/scripts/core/06-wishes.js:1304` |
| `wishDateInfo` | функція | `src/scripts/core/06-wishes.js:1305` |
| `renderWishDeck` | функція | `src/scripts/core/06-wishes.js:1324` |
| `renderWishes` | функція | `src/scripts/core/06-wishes.js:1400` |

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

### `src/scripts/core/08-finance.js` — 86 сутностей

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
| `renderEnvSheet` | функція | `src/scripts/core/08-finance.js:569` |

### `src/scripts/core/09-goals.js` — 27 сутностей

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
| `aiEpAllowed` | функція | `src/scripts/core/09-goals.js:51` |
| `aiConfig` | функція | `src/scripts/core/09-goals.js:59` |
| `aiSheetClose` | функція | `src/scripts/core/09-goals.js:70` |
| `aiStartSheet` | функція | `src/scripts/core/09-goals.js:71` |
| `aiGenerate` | функція | `src/scripts/core/09-goals.js:116` |
| `aiLocalDraft` | функція | `src/scripts/core/09-goals.js:167` |
| `DOW_SHORT` | масив | `src/scripts/core/09-goals.js:199` |
| `aiPreview` | функція | `src/scripts/core/09-goals.js:200` |
| `aiDraftSentence` | функція | `src/scripts/core/09-goals.js:240` |
| `aiDraftMonths` | функція | `src/scripts/core/09-goals.js:244` |
| `aiApplyDraft` | функція | `src/scripts/core/09-goals.js:250` |
| `renderGoals` | функція | `src/scripts/core/09-goals.js:293` |
| `dgDateStr` | функція | `src/scripts/core/09-goals.js:326` |
| `dgWeekDates` | функція | `src/scripts/core/09-goals.js:327` |
| `dgListFor` | функція | `src/scripts/core/09-goals.js:330` |
| `dgSync` | функція | `src/scripts/core/09-goals.js:332` |
| `dayGoalsBlock` | функція | `src/scripts/core/09-goals.js:353` |
| `pickFolderForGoal` | функція | `src/scripts/core/09-goals.js:405` |
| `renderGoalsTab` | функція | `src/scripts/core/09-goals.js:446` |

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

### `src/scripts/core/11-ai-flow.js` — 26 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `aiChatMsgs` | масив | `src/scripts/core/11-ai-flow.js:3` |
| `aiView` | значення | `src/scripts/core/11-ai-flow.js:4` |
| `aiMem` | масив | `src/scripts/core/11-ai-flow.js:5` |
| `aiPrompts` | масив | `src/scripts/core/11-ai-flow.js:6` |
| `aiPromptsSave` | функція | `src/scripts/core/11-ai-flow.js:7` |
| `aiChatLoad` | функція | `src/scripts/core/11-ai-flow.js:13` |
| `aiChatSave` | функція | `src/scripts/core/11-ai-flow.js:39` |
| `aiMemSave` | функція | `src/scripts/core/11-ai-flow.js:50` |
| `aiMemAdd` | функція | `src/scripts/core/11-ai-flow.js:56` |
| `aiMoodCalc` | функція | `src/scripts/core/11-ai-flow.js:68` |
| `aiMood` | функція | `src/scripts/core/11-ai-flow.js:82` |
| `AI_CORE_SYS` | значення | `src/scripts/core/11-ai-flow.js:93` |
| `AI_PAGES_SYS` | значення | `src/scripts/core/11-ai-flow.js:112` |
| `AI_FLOWOPS_SYS` | значення | `src/scripts/core/11-ai-flow.js:121` |
| `AI_CHAT_SYS` | значення | `src/scripts/core/11-ai-flow.js:132` |
| `aiHttpError` | функція | `src/scripts/core/11-ai-flow.js:137` |
| `aiLangDirective` | функція | `src/scripts/core/11-ai-flow.js:151` |
| `AI_MAX_TOKENS` | значення | `src/scripts/core/11-ai-flow.js:161` |
| `AI_IDLE_MS` | значення | `src/scripts/core/11-ai-flow.js:162` |
| `AI_NOSTREAM_MS` | значення | `src/scripts/core/11-ai-flow.js:167` |
| `AI_CUT_NOTE` | значення | `src/scripts/core/11-ai-flow.js:168` |
| `AI_REFUSAL_NOTE` | значення | `src/scripts/core/11-ai-flow.js:169` |
| `aiLastStop` | значення | `src/scripts/core/11-ai-flow.js:170` |
| `aiTimeoutError` | функція | `src/scripts/core/11-ai-flow.js:171` |
| `aiIdleGuard` | функція | `src/scripts/core/11-ai-flow.js:180` |
| `aiCall` | функція | `src/scripts/core/11-ai-flow.js:203` |

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
| `aiMorningMaybe` | функція | `src/scripts/core/12-ai-agent.js:331` |
| `aiWeeklyMaybe` | функція | `src/scripts/core/12-ai-agent.js:344` |
| `aiAgentStatusFor` | функція | `src/scripts/core/12-ai-agent.js:357` |
| `aiTrace` | значення | `src/scripts/core/12-ai-agent.js:396` |
| `aiPlz` | функція | `src/scripts/core/12-ai-agent.js:397` |
| `AI_TRACE_READ` | обʼєкт | `src/scripts/core/12-ai-agent.js:401` |
| `aiTraceReadMeta` | функція | `src/scripts/core/12-ai-agent.js:409` |
| `aiTraceStart` | функція | `src/scripts/core/12-ai-agent.js:427` |
| `aiTraceStep` | функція | `src/scripts/core/12-ai-agent.js:428` |
| `aiTraceEnd` | функція | `src/scripts/core/12-ai-agent.js:445` |
| `aiTraceRepaint` | функція | `src/scripts/core/12-ai-agent.js:450` |
| `aiTraceFinish` | функція | `src/scripts/core/12-ai-agent.js:456` |
| `FLOW_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:466` |
| `AI_AGENT_ADDON` | значення | `src/scripts/core/12-ai-agent.js:543` |
| `flowToolExec` | функція | `src/scripts/core/12-ai-agent.js:561` |
| `aiMissionLine` | функція | `src/scripts/core/12-ai-agent.js:591` |
| `aiJournalRead` | функція | `src/scripts/core/12-ai-agent.js:614` |
| `flowToolRead` | функція | `src/scripts/core/12-ai-agent.js:642` |
| `aiRemindWhen` | функція | `src/scripts/core/12-ai-agent.js:734` |
| `flowToolPlanner` | функція | `src/scripts/core/12-ai-agent.js:741` |
| `flowToolGoals` | функція | `src/scripts/core/12-ai-agent.js:812` |
| `aiToolConfirm` | функція | `src/scripts/core/12-ai-agent.js:877` |
| `aiFinConfirm` | функція | `src/scripts/core/12-ai-agent.js:896` |
| `flowToolFinance` | функція | `src/scripts/core/12-ai-agent.js:899` |
| `flowToolDiary` | функція | `src/scripts/core/12-ai-agent.js:1048` |
| `flowToolPatterns` | функція | `src/scripts/core/12-ai-agent.js:1098` |
| `flowToolMemory` | функція | `src/scripts/core/12-ai-agent.js:1119` |
| `aiMemGate` | функція | `src/scripts/core/12-ai-agent.js:1145` |
| `flowToolFolders` | функція | `src/scripts/core/12-ai-agent.js:1154` |
| `AI_MAIN_RE` | значення | `src/scripts/core/12-ai-agent.js:1211` |
| `aiPickModel` | функція | `src/scripts/core/12-ai-agent.js:1212` |
| `aiCacheMin` | функція | `src/scripts/core/12-ai-agent.js:1219` |
| `aiTokEst` | функція | `src/scripts/core/12-ai-agent.js:1224` |
| `aiCacheTail` | функція | `src/scripts/core/12-ai-agent.js:1229` |
| `aiUsageAdd` | функція | `src/scripts/core/12-ai-agent.js:1240` |
| `aiCallRaw` | функція | `src/scripts/core/12-ai-agent.js:1253` |
| `aiToolIsWrite` | функція | `src/scripts/core/12-ai-agent.js:1328` |
| `AI_WRITE_LIMIT` | значення | `src/scripts/core/12-ai-agent.js:1337` |
| `aiTurnWrites` | значення | `src/scripts/core/12-ai-agent.js:1338` |
| `aiTurnDone` | масив | `src/scripts/core/12-ai-agent.js:1339` |
| `aiDoneLine` | функція | `src/scripts/core/12-ai-agent.js:1343` |
| `aiToolWriteCost` | функція | `src/scripts/core/12-ai-agent.js:1361` |
| `AI_TOOL_OUT_MAX` | обʼєкт | `src/scripts/core/12-ai-agent.js:1369` |
| `aiToolOut` | функція | `src/scripts/core/12-ai-agent.js:1370` |
| `aiAgentTurn` | функція | `src/scripts/core/12-ai-agent.js:1375` |
| `aiFinMonthNet` | функція | `src/scripts/core/12-ai-agent.js:1439` |
| `aiFinCtx` | функція | `src/scripts/core/12-ai-agent.js:1447` |
| `aiCtx` | функція | `src/scripts/core/12-ai-agent.js:1467` |
| `aiFindGoal` | функція | `src/scripts/core/12-ai-agent.js:1508` |
| `aiParseBlocks` | функція | `src/scripts/core/12-ai-agent.js:1512` |
| `aiOpsCount` | функція | `src/scripts/core/12-ai-agent.js:1543` |
| `aiStreamText` | функція | `src/scripts/core/12-ai-agent.js:1548` |
| `aiOpDs` | функція | `src/scripts/core/12-ai-agent.js:1558` |
| `aiOpMatches` | функція | `src/scripts/core/12-ai-agent.js:1559` |
| `aiOpBlock` | функція | `src/scripts/core/12-ai-agent.js:1569` |
| `aiFindBlockByT` | функція | `src/scripts/core/12-ai-agent.js:1570` |
| `aiOpWarn` | функція | `src/scripts/core/12-ai-agent.js:1572` |
| `aiResolveOps` | функція | `src/scripts/core/12-ai-agent.js:1584` |
| `aiMissText` | функція | `src/scripts/core/12-ai-agent.js:1598` |
| `aiOpRow` | функція | `src/scripts/core/12-ai-agent.js:1605` |
| `aiGateOps` | функція | `src/scripts/core/12-ai-agent.js:1612` |
| `aiFindFolderKey` | функція | `src/scripts/core/12-ai-agent.js:1632` |
| `aiBuildPageBlock` | функція | `src/scripts/core/12-ai-agent.js:1640` |
| `aiApplyPages` | функція | `src/scripts/core/12-ai-agent.js:1658` |
| `aiApplyActions` | функція | `src/scripts/core/12-ai-agent.js:1681` |
| `aiCommit` | функція | `src/scripts/core/12-ai-agent.js:1768` |
| `aiUndo` | функція | `src/scripts/core/12-ai-agent.js:1784` |

### `src/scripts/core/13-pets.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FLOW_PETS` | обʼєкт | `src/scripts/core/13-pets.js:2` |
| `PETS_LEGACY_HIDDEN` | значення | `src/scripts/core/13-pets.js:51` |
| `petCur` | функція | `src/scripts/core/13-pets.js:52` |
| `petPersona` | функція | `src/scripts/core/13-pets.js:55` |
| `petSVG` | функція | `src/scripts/core/13-pets.js:56` |
| `petPickerSheet` | функція | `src/scripts/core/13-pets.js:98` |
| `petSleeping` | функція | `src/scripts/core/13-pets.js:180` |
| `petSleepSet` | функція | `src/scripts/core/13-pets.js:181` |
| `window.petWake` | функція | `src/scripts/core/13-pets.js:182` |
| `fcPos` | функція | `src/scripts/core/13-pets.js:183` |
| `fcClamp` | функція | `src/scripts/core/13-pets.js:184` |
| `fcApplyPos` | функція | `src/scripts/core/13-pets.js:189` |
| `fcBindDrag` | функція | `src/scripts/core/13-pets.js:195` |
| `fcBurst` | функція | `src/scripts/core/13-pets.js:233` |

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

### `src/scripts/core/15-flow-spot.js` — 98 сутностей

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
| `spotMicToggle` | функція | `src/scripts/core/15-flow-spot.js:154` |
| `window.flowCapRender` | значення | `src/scripts/core/15-flow-spot.js:183` |
| `window.flowSpotOpen` | значення | `src/scripts/core/15-flow-spot.js:184` |
| `aiChatSheet` | функція | `src/scripts/core/15-flow-spot.js:187` |
| `aiClose` | функція | `src/scripts/core/15-flow-spot.js:220` |
| `aiDayPct` | функція | `src/scripts/core/15-flow-spot.js:227` |
| `aiVoiceOn` | значення | `src/scripts/core/15-flow-spot.js:234` |
| `aiSpeakStop` | функція | `src/scripts/core/15-flow-spot.js:236` |
| `aiSpeak` | функція | `src/scripts/core/15-flow-spot.js:237` |
| `aiVoiceToggle` | функція | `src/scripts/core/15-flow-spot.js:277` |
| `aiRenderHead` | функція | `src/scripts/core/15-flow-spot.js:284` |
| `aiMemSheet` | функція | `src/scripts/core/15-flow-spot.js:328` |
| `aiRenderViews` | функція | `src/scripts/core/15-flow-spot.js:350` |
| `aiLogHTML` | функція | `src/scripts/core/15-flow-spot.js:355` |
| `aiTlHTML` | функція | `src/scripts/core/15-flow-spot.js:362` |
| `aiActsHTML` | функція | `src/scripts/core/15-flow-spot.js:385` |
| `aiTraceLiveHTML` | функція | `src/scripts/core/15-flow-spot.js:425` |
| `aiTraceRowHTML` | функція | `src/scripts/core/15-flow-spot.js:431` |
| `AI_SHELF_GO` | обʼєкт | `src/scripts/core/15-flow-spot.js:436` |
| `aiShelfHTML` | функція | `src/scripts/core/15-flow-spot.js:437` |
| `aiTraceKpisHTML` | функція | `src/scripts/core/15-flow-spot.js:447` |
| `aiWireBody` | функція | `src/scripts/core/15-flow-spot.js:462` |
| `aiChipsHTML` | функція | `src/scripts/core/15-flow-spot.js:483` |
| `AI_SVG` | обʼєкт | `src/scripts/core/15-flow-spot.js:489` |
| `AI_ICO` | обʼєкт | `src/scripts/core/15-flow-spot.js:497` |
| `aiIco` | функція | `src/scripts/core/15-flow-spot.js:520` |
| `aiMD` | функція | `src/scripts/core/15-flow-spot.js:525` |
| `aiBusyHTML` | функція | `src/scripts/core/15-flow-spot.js:531` |
| `aiSlashHide` | функція | `src/scripts/core/15-flow-spot.js:539` |
| `aiSlashShow` | функція | `src/scripts/core/15-flow-spot.js:540` |
| `aiAttachRender` | функція | `src/scripts/core/15-flow-spot.js:555` |
| `aiImgShrink` | функція | `src/scripts/core/15-flow-spot.js:567` |
| `aiFileB64` | функція | `src/scripts/core/15-flow-spot.js:584` |
| `aiPickFile` | функція | `src/scripts/core/15-flow-spot.js:592` |
| `aiPlusSheet` | функція | `src/scripts/core/15-flow-spot.js:618` |
| `aiPromptsSheet` | функція | `src/scripts/core/15-flow-spot.js:638` |
| `aiPromptEdit` | функція | `src/scripts/core/15-flow-spot.js:657` |
| `aiEnvKpi` | функція | `src/scripts/core/15-flow-spot.js:674` |
| `aiPlanCardHTML` | функція | `src/scripts/core/15-flow-spot.js:682` |
| `aiRenderBody` | функція | `src/scripts/core/15-flow-spot.js:708` |
| `AI_SKILLS` | обʼєкт | `src/scripts/core/15-flow-spot.js:758` |
| `aiSkillFor` | функція | `src/scripts/core/15-flow-spot.js:770` |
| `aiSumBusy` | значення | `src/scripts/core/15-flow-spot.js:777` |
| `aiMaybeSummarize` | функція | `src/scripts/core/15-flow-spot.js:778` |
| `aiChatSend` | функція | `src/scripts/core/15-flow-spot.js:791` |
| `aiRec` | значення | `src/scripts/core/15-flow-spot.js:916` |
| `aiMicUI` | функція | `src/scripts/core/15-flow-spot.js:917` |
| `aiMicToggle` | функція | `src/scripts/core/15-flow-spot.js:918` |
| `aiTranscribeBlob` | функція | `src/scripts/core/15-flow-spot.js:956` |
| `aiTranscribe` | функція | `src/scripts/core/15-flow-spot.js:979` |
| `window.aiChatSheet` | значення | `src/scripts/core/15-flow-spot.js:983` |
| `plStreak` | функція | `src/scripts/core/15-flow-spot.js:985` |
| `heroWeekDays` | функція | `src/scripts/core/15-flow-spot.js:1004` |
| `heroMonthDays` | функція | `src/scripts/core/15-flow-spot.js:1022` |
| `heroDayWord` | функція | `src/scripts/core/15-flow-spot.js:1033` |
| `renderHeroStreak` | функція | `src/scripts/core/15-flow-spot.js:1039` |
| `plRolloverHTML` | функція | `src/scripts/core/15-flow-spot.js:1062` |
| `plDaySummaryHTML` | функція | `src/scripts/core/15-flow-spot.js:1074` |
| `plAutoSuggestHTML` | функція | `src/scripts/core/15-flow-spot.js:1108` |
| `plWeekCalHTML` | функція | `src/scripts/core/15-flow-spot.js:1150` |
| `plBlocksDisplay` | функція | `src/scripts/core/15-flow-spot.js:1177` |
| `plFolderComplete` | функція | `src/scripts/core/15-flow-spot.js:1191` |
| `DOW_UA` | масив | `src/scripts/core/15-flow-spot.js:1196` |
| `plRuleDowsLabel` | функція | `src/scripts/core/15-flow-spot.js:1197` |
| `plFolderAddBlock` | функція | `src/scripts/core/15-flow-spot.js:1206` |
| `plFolderDaySheet` | функція | `src/scripts/core/15-flow-spot.js:1212` |
| `plFolderMonthSheet` | функція | `src/scripts/core/15-flow-spot.js:1266` |
| `PL_MXQ` | масив | `src/scripts/core/15-flow-spot.js:1328` |
| `plMatrixHTML` | функція | `src/scripts/core/15-flow-spot.js:1329` |
| `plMxSchedule` | функція | `src/scripts/core/15-flow-spot.js:1348` |
| `plSlotTask` | функція | `src/scripts/core/15-flow-spot.js:1362` |
| `plBacklogHTML` | функція | `src/scripts/core/15-flow-spot.js:1376` |
| `plInboxHTML` | функція | `src/scripts/core/15-flow-spot.js:1391` |
| `plBlockEnd` | функція | `src/scripts/core/15-flow-spot.js:1406` |
| `plDayHTML` | функція | `src/scripts/core/15-flow-spot.js:1407` |
| `plTaskCard` | функція | `src/scripts/core/15-flow-spot.js:1616` |
| `plAdd` | функція | `src/scripts/core/15-flow-spot.js:1639` |
| `plAddBlockAt` | функція | `src/scripts/core/15-flow-spot.js:1666` |
| `plLinkTag` | функція | `src/scripts/core/15-flow-spot.js:1671` |
| `plScheduleStep` | функція | `src/scripts/core/15-flow-spot.js:1679` |
| `plMicroBlock` | функція | `src/scripts/core/15-flow-spot.js:1696` |
| `plCompleteBlock` | функція | `src/scripts/core/15-flow-spot.js:1709` |
| `plUncompleteEffects` | функція | `src/scripts/core/15-flow-spot.js:1766` |
| `plToast` | функція | `src/scripts/core/15-flow-spot.js:1783` |
| `plBlockSheet` | функція | `src/scripts/core/15-flow-spot.js:1791` |
| `plEditBlock` | функція | `src/scripts/core/15-flow-spot.js:2013` |
| `plRangeSheet` | функція | `src/scripts/core/15-flow-spot.js:2016` |

### `src/scripts/core/16-dashboard.js` — 61 сутностей

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
| `inputModal` | функція | `src/scripts/core/16-dashboard.js:372` |
| `createFolder` | функція | `src/scripts/core/16-dashboard.js:407` |
| `groupKids` | функція | `src/scripts/core/16-dashboard.js:431` |
| `fgIcon` | функція | `src/scripts/core/16-dashboard.js:434` |
| `fgSub` | функція | `src/scripts/core/16-dashboard.js:437` |
| `fgToast` | функція | `src/scripts/core/16-dashboard.js:444` |
| `fgSheet` | функція | `src/scripts/core/16-dashboard.js:445` |
| `openFolderGroup` | функція | `src/scripts/core/16-dashboard.js:457` |
| `GVIEW` | обʼєкт | `src/scripts/core/16-dashboard.js:486` |
| `gviewOf` | функція | `src/scripts/core/16-dashboard.js:487` |
| `openGroupAsChosen` | функція | `src/scripts/core/16-dashboard.js:488` |
| `window.openGroupAsChosen` | значення | `src/scripts/core/16-dashboard.js:494` |
| `openFolderGroupIOS` | функція | `src/scripts/core/16-dashboard.js:495` |
| `openGroupViewSheet` | функція | `src/scripts/core/16-dashboard.js:516` |
| `openFolderGroupAdd` | функція | `src/scripts/core/16-dashboard.js:534` |
| `openFolderMerge` | функція | `src/scripts/core/16-dashboard.js:551` |
| `FV_PREV` | обʼєкт | `src/scripts/core/16-dashboard.js:591` |
| `openFolderViewSheet` | функція | `src/scripts/core/16-dashboard.js:598` |
| `pgBarFolder` | функція | `src/scripts/core/16-dashboard.js:642` |
| `pgBarSwitchGroup` | функція | `src/scripts/core/16-dashboard.js:644` |
| `pgBarSync` | функція | `src/scripts/core/16-dashboard.js:649` |
| `pgBarHasCond` | функція | `src/scripts/core/16-dashboard.js:663` |
| `pgBarSwitchSheet` | функція | `src/scripts/core/16-dashboard.js:670` |
| `pgBarMoreSheet` | функція | `src/scripts/core/16-dashboard.js:689` |
| `pgBarInit` | функція | `src/scripts/core/16-dashboard.js:730` |
| `createProjectFolder` | функція | `src/scripts/core/16-dashboard.js:752` |
| `openPhotoCropEditor` | функція | `src/scripts/core/16-dashboard.js:780` |
| `FM_IC` | обʼєкт | `src/scripts/core/16-dashboard.js:852` |
| `fmIc` | функція | `src/scripts/core/16-dashboard.js:871` |
| `fmRow` | функція | `src/scripts/core/16-dashboard.js:872` |
| `FM_TYPE` | обʼєкт | `src/scripts/core/16-dashboard.js:873` |
| `openFolderMenu` | функція | `src/scripts/core/16-dashboard.js:874` |
| `openFolderLook` | функція | `src/scripts/core/16-dashboard.js:934` |
| `openFolderType` | функція | `src/scripts/core/16-dashboard.js:950` |
| `closeFolderMenu` | функція | `src/scripts/core/16-dashboard.js:981` |
| `openFolderIconPicker` | функція | `src/scripts/core/16-dashboard.js:990` |
| `openFolderMovePicker` | функція | `src/scripts/core/16-dashboard.js:1023` |
| `folderAction` | функція | `src/scripts/core/16-dashboard.js:1039` |
| `pickFolderPhoto` | функція | `src/scripts/core/16-dashboard.js:1082` |

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
| `diaMoodBusy` | значення | `src/scripts/core/22-diary.js:322` |
| `diaMoodBatch` | функція | `src/scripts/core/22-diary.js:323` |
| `DIA_BOOK_EMOJIS` | масив | `src/scripts/core/22-diary.js:357` |
| `DIA_BOOK_COLORS` | масив | `src/scripts/core/22-diary.js:358` |
| `diaNewEmoji` | значення | `src/scripts/core/22-diary.js:359` |
| `renderDiaBooks` | функція | `src/scripts/core/22-diary.js:360` |
| `renderDiaBook` | функція | `src/scripts/core/22-diary.js:385` |
| `diaRec` | значення | `src/scripts/core/22-diary.js:452` |
| `diaFmtDur` | функція | `src/scripts/core/22-diary.js:453` |
| `diaPlayAudio` | функція | `src/scripts/core/22-diary.js:454` |
| `diaRecord` | функція | `src/scripts/core/22-diary.js:455` |
| `window.diaRecord` | значення | `src/scripts/core/22-diary.js:486` |
| `diaBookRec` | значення | `src/scripts/core/22-diary.js:490` |
| `diaBookRecord` | функція | `src/scripts/core/22-diary.js:491` |

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

### `src/scripts/core/27-canvas.js` — 27 сутностей

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
| `applyFolderOrderRaw` | функція | `src/scripts/core/27-canvas.js:291` |
| `loadInFlight` | значення | `src/scripts/core/27-canvas.js:301` |
| `load` | функція | `src/scripts/core/27-canvas.js:302` |
| `loadOnce` | функція | `src/scripts/core/27-canvas.js:307` |
| `vv` | значення | `src/scripts/core/27-canvas.js:507` |
| `FIELD` | значення | `src/scripts/core/27-canvas.js:508` |
| `isField` | функція | `src/scripts/core/27-canvas.js:510` |
| `kbHeight` | функція | `src/scripts/core/27-canvas.js:513` |
| `syncKb` | функція | `src/scripts/core/27-canvas.js:517` |
| `ensureVisible` | функція | `src/scripts/core/27-canvas.js:524` |
| `VISION_FKEY` | значення | `src/scripts/core/27-canvas.js:560` |
| `migrateFolderPhotosOnce` | функція | `src/scripts/core/27-canvas.js:567` |
| `removeSystemSeedFoldersOnce` | функція | `src/scripts/core/27-canvas.js:585` |

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
| `window.renderAccount` | значення | `src/scripts/core/29-more-screen.js:542` |
| `maskMail` | функція | `src/scripts/core/29-more-screen.js:549` |
| `foreignWipe` | функція | `src/scripts/core/29-more-screen.js:550` |
| `foreignAsk` | функція | `src/scripts/core/29-more-screen.js:565` |
| `window.flowForeignAsk` | значення | `src/scripts/core/29-more-screen.js:575` |
| `hm` | значення | `src/scripts/core/29-more-screen.js:588` |
| `na` | функція | `src/scripts/core/29-more-screen.js:589` |
| `nm` | значення | `src/scripts/core/29-more-screen.js:590` |

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

### `src/scripts/core/36-chats.js` — 46 сутностей

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
| `pgSubHTML` | функція | `src/scripts/core/36-chats.js:363` |
| `pgHubData` | функція | `src/scripts/core/36-chats.js:371` |
| `pgHubHTML` | функція | `src/scripts/core/36-chats.js:380` |
| `pgHubOpen` | функція | `src/scripts/core/36-chats.js:391` |
| `folderAddSheet` | функція | `src/scripts/core/36-chats.js:400` |
| `pickChatForFolder` | функція | `src/scripts/core/36-chats.js:415` |
| `chatsInit` | функція | `src/scripts/core/36-chats.js:425` |

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
| `jnToggleBlock` | функція | `src/scripts/core/41-journal.js:307` |
| `jnDone` | функція | `src/scripts/core/41-journal.js:320` |
| `jnUndoSheet` | функція | `src/scripts/core/41-journal.js:325` |
| `jnCelebrate` | функція | `src/scripts/core/41-journal.js:329` |
| `jnStoryView` | функція | `src/scripts/core/41-journal.js:355` |
| `jnEnergySheet` | функція | `src/scripts/core/41-journal.js:386` |
| `jnHeroSheet` | функція | `src/scripts/core/41-journal.js:395` |
| `jnOverlay` | функція | `src/scripts/core/41-journal.js:411` |
| `jnClearFuture` | функція | `src/scripts/core/41-journal.js:424` |
| `jnOtherTpls` | функція | `src/scripts/core/41-journal.js:432` |
| `jnTplDows` | функція | `src/scripts/core/41-journal.js:435` |
| `jnSyncRecur` | функція | `src/scripts/core/41-journal.js:442` |
| `jnEditor` | функція | `src/scripts/core/41-journal.js:463` |
| `jnStartCard` | функція | `src/scripts/core/41-journal.js:595` |
| `jnStart` | функція | `src/scripts/core/41-journal.js:600` |
| `jnSettings` | функція | `src/scripts/core/41-journal.js:682` |
| `jnDaySheet` | функція | `src/scripts/core/41-journal.js:695` |
| `jnAskReview` | функція | `src/scripts/core/41-journal.js:731` |
| `goJournal` | функція | `src/scripts/core/41-journal.js:742` |

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

### `src/scripts/core/43-month.js` — 34 сутностей

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
| `moMonthHTML` | функція | `src/scripts/core/43-month.js:72` |
| `moBind` | функція | `src/scripts/core/43-month.js:84` |
| `moMoneySheet` | функція | `src/scripts/core/43-month.js:93` |
| `moMissionPage` | функція | `src/scripts/core/43-month.js:111` |
| `moPathTab` | функція | `src/scripts/core/43-month.js:139` |
| `moOwnFolder` | функція | `src/scripts/core/43-month.js:168` |
| `moBoard` | функція | `src/scripts/core/43-month.js:169` |
| `moTracker` | функція | `src/scripts/core/43-month.js:171` |
| `moNotes` | функція | `src/scripts/core/43-month.js:172` |
| `moVision` | функція | `src/scripts/core/43-month.js:173` |
| `moMarked` | функція | `src/scripts/core/43-month.js:174` |
| `moToggleMark` | функція | `src/scripts/core/43-month.js:177` |
| `moAddTracker` | функція | `src/scripts/core/43-month.js:185` |
| `moFolderTab` | функція | `src/scripts/core/43-month.js:190` |
| `moChatsTab` | функція | `src/scripts/core/43-month.js:210` |
| `moTextSheet` | функція | `src/scripts/core/43-month.js:218` |
| `moBindMission` | функція | `src/scripts/core/43-month.js:226` |

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
| `wlOverviewHTML` | функція | `src/scripts/core/46-wallet.js:48` |
| `wlMissionsHTML` | функція | `src/scripts/core/46-wallet.js:78` |
| `wlFoldersHTML` | функція | `src/scripts/core/46-wallet.js:89` |
| `wlFolderSheet` | функція | `src/scripts/core/46-wallet.js:100` |
| `wlBind` | функція | `src/scripts/core/46-wallet.js:113` |
| `WL_SRC` | обʼєкт | `src/scripts/core/46-wallet.js:136` |
| `wlSrc` | функція | `src/scripts/core/46-wallet.js:137` |
| `wlFolderName` | функція | `src/scripts/core/46-wallet.js:138` |
| `wlOpSheet` | функція | `src/scripts/core/46-wallet.js:140` |
| `wlOpMenu` | функція | `src/scripts/core/46-wallet.js:206` |
| `wlLinkedNote` | функція | `src/scripts/core/46-wallet.js:226` |
| `wlMissionSheet` | функція | `src/scripts/core/46-wallet.js:232` |
| `wlQuestCheck` | функція | `src/scripts/core/46-wallet.js:245` |
| `wlCurList` | функція | `src/scripts/core/46-wallet.js:267` |
| `wlCurSave` | функція | `src/scripts/core/46-wallet.js:272` |
| `curBalance` | функція | `src/scripts/core/46-wallet.js:273` |
| `wlTotalApprox` | функція | `src/scripts/core/46-wallet.js:274` |
| `wlCursHTML` | функція | `src/scripts/core/46-wallet.js:276` |
| `wlCurAdd` | функція | `src/scripts/core/46-wallet.js:281` |
| `wlCurSheet` | функція | `src/scripts/core/46-wallet.js:292` |
| `wlExchange` | функція | `src/scripts/core/46-wallet.js:309` |
| `WL_ENV_TPL` | масив | `src/scripts/core/46-wallet.js:355` |
| `WL_ENV_COLORS` | масив | `src/scripts/core/46-wallet.js:361` |
| `wlSpendEnvs` | функція | `src/scripts/core/46-wallet.js:363` |
| `wlEnvPick` | функція | `src/scripts/core/46-wallet.js:365` |
| `wlEnvStarter` | функція | `src/scripts/core/46-wallet.js:366` |

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
| `HERO_NEED` | обʼєкт | `src/scripts/core/48-hero.js:54` |
| `HERO_PATCHES` | обʼєкт | `src/scripts/core/48-hero.js:59` |
| `HERO_TATS` | обʼєкт | `src/scripts/core/48-hero.js:69` |
| `HERO_PATCH_AT` | обʼєкт | `src/scripts/core/48-hero.js:74` |
| `HERO_TAT_AT` | обʼєкт | `src/scripts/core/48-hero.js:75` |
| `heroLoading` | значення | `src/scripts/core/48-hero.js:76` |
| `heroOf` | функція | `src/scripts/core/48-hero.js:78` |
| `heroReady` | функція | `src/scripts/core/48-hero.js:79` |
| `heroLookAll` | функція | `src/scripts/core/48-hero.js:83` |
| `heroLookNorm` | функція | `src/scripts/core/48-hero.js:86` |
| `heroLook` | функція | `src/scripts/core/48-hero.js:98` |
| `heroRerender` | функція | `src/scripts/core/48-hero.js:100` |
| `heroLoad` | функція | `src/scripts/core/48-hero.js:107` |
| `heroOutfitsLoad` | функція | `src/scripts/core/48-hero.js:124` |
| `heroOverBudget` | функція | `src/scripts/core/48-hero.js:135` |
| `heroReactTo` | функція | `src/scripts/core/48-hero.js:142` |
| `heroMood` | функція | `src/scripts/core/48-hero.js:154` |
| `heroChestLines` | функція | `src/scripts/core/48-hero.js:170` |
| `heroChestText` | функція | `src/scripts/core/48-hero.js:177` |
| `heroUnlocks` | функція | `src/scripts/core/48-hero.js:196` |
| `heroItemOpen` | функція | `src/scripts/core/48-hero.js:204` |
| `heroPatchSVG` | функція | `src/scripts/core/48-hero.js:205` |
| `heroTatSVG` | функція | `src/scripts/core/48-hero.js:213` |
| `heroSVG` | функція | `src/scripts/core/48-hero.js:222` |
| `heroWard` | значення | `src/scripts/core/48-hero.js:258` |
| `heroWardRedraw` | функція | `src/scripts/core/48-hero.js:259` |
| `heroWardSave` | функція | `src/scripts/core/48-hero.js:270` |
| `heroWardItem` | функція | `src/scripts/core/48-hero.js:282` |
| `heroWardrobe` | функція | `src/scripts/core/48-hero.js:290` |

### `src/scripts/core/48-widgets.js` — 46 сутностей

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
| `wdCalYm` | обʼєкт | `src/scripts/core/48-widgets.js:178` |
| `wdIs` | функція | `src/scripts/core/48-widgets.js:179` |
| `wdSz` | функція | `src/scripts/core/48-widgets.js:180` |
| `wdPer` | функція | `src/scripts/core/48-widgets.js:181` |
| `wdOn` | функція | `src/scripts/core/48-widgets.js:182` |
| `wdInit` | функція | `src/scripts/core/48-widgets.js:184` |
| `wdGoal` | функція | `src/scripts/core/48-widgets.js:190` |
| `wdNext` | функція | `src/scripts/core/48-widgets.js:196` |
| `wdDue` | функція | `src/scripts/core/48-widgets.js:203` |
| `wdDaysLeft` | функція | `src/scripts/core/48-widgets.js:208` |
| `wdFolder` | функція | `src/scripts/core/48-widgets.js:209` |
| `wdHead` | функція | `src/scripts/core/48-widgets.js:211` |
| `wdTile` | функція | `src/scripts/core/48-widgets.js:217` |
| `wdRing` | функція | `src/scripts/core/48-widgets.js:221` |
| `wdHm` | функція | `src/scripts/core/48-widgets.js:223` |
| `wdNoGoal` | функція | `src/scripts/core/48-widgets.js:225` |
| `wdLevels` | функція | `src/scripts/core/48-widgets.js:231` |
| `wdHabGrid` | функція | `src/scripts/core/48-widgets.js:238` |
| `wdWeekBars` | функція | `src/scripts/core/48-widgets.js:244` |
| `wdHTML` | функція | `src/scripts/core/48-widgets.js:248` |
| `wdRedraw` | функція | `src/scripts/core/48-widgets.js:344` |
| `wdAct` | функція | `src/scripts/core/48-widgets.js:345` |
| `wdCfg` | функція | `src/scripts/core/48-widgets.js:369` |
| `wdPickMission` | функція | `src/scripts/core/48-widgets.js:416` |
| `WG_OLD` | обʼєкт | `src/scripts/core/48-widgets.js:434` |
| `wgOldScan` | функція | `src/scripts/core/48-widgets.js:435` |
| `wgOldCleanup` | функція | `src/scripts/core/48-widgets.js:442` |

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

### `src/scripts/core/52-fresh-start.js` — 27 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FS_KEY` | значення | `src/scripts/core/52-fresh-start.js:10` |
| `fsGet` | функція | `src/scripts/core/52-fresh-start.js:11` |
| `fsSet` | функція | `src/scripts/core/52-fresh-start.js:12` |
| `fsClear` | функція | `src/scripts/core/52-fresh-start.js:13` |
| `fsTrusted` | функція | `src/scripts/core/52-fresh-start.js:14` |
| `fsBusy` | функція | `src/scripts/core/52-fresh-start.js:18` |
| `fsStartOp` | функція | `src/scripts/core/52-fresh-start.js:19` |
| `fsWalletEmpty` | функція | `src/scripts/core/52-fresh-start.js:21` |
| `fsActive` | функція | `src/scripts/core/52-fresh-start.js:23` |
| `fsStep` | функція | `src/scripts/core/52-fresh-start.js:24` |
| `FS_STEPS` | масив | `src/scripts/core/52-fresh-start.js:25` |
| `fsNum` | функція | `src/scripts/core/52-fresh-start.js:26` |
| `fsHead` | функція | `src/scripts/core/52-fresh-start.js:27` |
| `fsGo` | функція | `src/scripts/core/52-fresh-start.js:29` |
| `wlStartHTML` | функція | `src/scripts/core/52-fresh-start.js:32` |
| `wlStartBind` | функція | `src/scripts/core/52-fresh-start.js:42` |
| `fsStep1` | функція | `src/scripts/core/52-fresh-start.js:48` |
| `fsMainEnvs` | функція | `src/scripts/core/52-fresh-start.js:70` |
| `fsStep2` | функція | `src/scripts/core/52-fresh-start.js:71` |
| `fsSplitPlan` | функція | `src/scripts/core/52-fresh-start.js:83` |
| `fsSplit` | функція | `src/scripts/core/52-fresh-start.js:89` |
| `fsStep3` | функція | `src/scripts/core/52-fresh-start.js:108` |
| `fsPlanRows` | функція | `src/scripts/core/52-fresh-start.js:145` |
| `fsStep4` | функція | `src/scripts/core/52-fresh-start.js:153` |
| `fsDays` | функція | `src/scripts/core/52-fresh-start.js:186` |
| `fsTodayHTML` | функція | `src/scripts/core/52-fresh-start.js:191` |
| `fsTodayBind` | функція | `src/scripts/core/52-fresh-start.js:200` |

### `src/scripts/core/53-starter.js` — 18 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `ST_KEY` | значення | `src/scripts/core/53-starter.js:14` |
| `ST_WISHES` | масив | `src/scripts/core/53-starter.js:15` |
| `ST_FOLDERS` | масив | `src/scripts/core/53-starter.js:23` |
| `stLoading` | значення | `src/scripts/core/53-starter.js:29` |
| `stOff` | функція | `src/scripts/core/53-starter.js:30` |
| `stTrusted` | функція | `src/scripts/core/53-starter.js:31` |
| `stEmpty` | функція | `src/scripts/core/53-starter.js:37` |
| `starterActive` | функція | `src/scripts/core/53-starter.js:41` |
| `stImg` | функція | `src/scripts/core/53-starter.js:42` |
| `stLoad` | функція | `src/scripts/core/53-starter.js:43` |
| `stBg` | функція | `src/scripts/core/53-starter.js:52` |
| `stHeroOff` | функція | `src/scripts/core/53-starter.js:55` |
| `stHero` | функція | `src/scripts/core/53-starter.js:60` |
| `starterRender` | функція | `src/scripts/core/53-starter.js:77` |
| `stRefresh` | функція | `src/scripts/core/53-starter.js:99` |
| `stPick` | функція | `src/scripts/core/53-starter.js:105` |
| `stPut` | функція | `src/scripts/core/53-starter.js:129` |
| `stMakeOwn` | функція | `src/scripts/core/53-starter.js:133` |

### `src/scripts/core/54-intro.js` — 9 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `IN_KEY` | значення | `src/scripts/core/54-intro.js:10` |
| `inShownNow` | значення | `src/scripts/core/54-intro.js:11` |
| `inSeen` | функція | `src/scripts/core/54-intro.js:12` |
| `inMark` | функція | `src/scripts/core/54-intro.js:13` |
| `introMaybe` | функція | `src/scripts/core/54-intro.js:15` |
| `inPh` | функція | `src/scripts/core/54-intro.js:20` |
| `inSlides` | функція | `src/scripts/core/54-intro.js:21` |
| `introOpen` | функція | `src/scripts/core/54-intro.js:44` |
| `introRefresh` | функція | `src/scripts/core/54-intro.js:74` |

### `src/scripts/page-editor/01-palette.js` — 17 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PGS_CATS` | масив | `src/scripts/page-editor/01-palette.js:5` |
| `CATALOG` | масив | `src/scripts/page-editor/01-palette.js:13` |
| `PGS_SYN` | обʼєкт | `src/scripts/page-editor/01-palette.js:51` |
| `PGS_ICONS` | обʼєкт | `src/scripts/page-editor/01-palette.js:79` |
| `pgsIc` | функція | `src/scripts/page-editor/01-palette.js:133` |
| `bridge` | функція | `src/scripts/page-editor/01-palette.js:135` |
| `editor` | значення | `src/scripts/page-editor/01-palette.js:136` |
| `scr` | значення | `src/scripts/page-editor/01-palette.js:137` |
| `uid` | функція | `src/scripts/page-editor/01-palette.js:138` |
| `esc` | функція | `src/scripts/page-editor/01-palette.js:139` |
| `txtOf` | функція | `src/scripts/page-editor/01-palette.js:142` |
| `setTxt` | функція | `src/scripts/page-editor/01-palette.js:143` |
| `locate` | функція | `src/scripts/page-editor/01-palette.js:145` |
| `save` | функція | `src/scripts/page-editor/01-palette.js:153` |
| `moveBlock` | функція | `src/scripts/page-editor/01-palette.js:157` |
| `snapshotArr` | функція | `src/scripts/page-editor/01-palette.js:179` |
| `restoreArr` | функція | `src/scripts/page-editor/01-palette.js:180` |

### `src/scripts/page-editor/02-block-styles.js` — 49 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `equalizeWidths` | функція | `src/scripts/page-editor/02-block-styles.js:1` |
| `PGH_FONTS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:4` |
| `PGH_CLR_VAR` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:8` |
| `headingClr` | функція | `src/scripts/page-editor/02-block-styles.js:9` |
| `headingStyle` | функція | `src/scripts/page-editor/02-block-styles.js:14` |
| `pgShowHidden` | значення | `src/scripts/page-editor/02-block-styles.js:26` |
| `condMet` | функція | `src/scripts/page-editor/02-block-styles.js:27` |
| `moveBlockSide` | функція | `src/scripts/page-editor/02-block-styles.js:46` |
| `undoMove` | функція | `src/scripts/page-editor/02-block-styles.js:81` |
| `redoMove` | функція | `src/scripts/page-editor/02-block-styles.js:86` |
| `undoStack` | масив | `src/scripts/page-editor/02-block-styles.js:93` |
| `pushOp` | функція | `src/scripts/page-editor/02-block-styles.js:94` |
| `doUndo` | функція | `src/scripts/page-editor/02-block-styles.js:99` |
| `doRedo` | функція | `src/scripts/page-editor/02-block-styles.js:100` |
| `syncUndoBtn` | функція | `src/scripts/page-editor/02-block-styles.js:101` |
| `STATUS_COLORS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:111` |
| `STATUS_ORDER` | масив | `src/scripts/page-editor/02-block-styles.js:112` |
| `dbColType` | функція | `src/scripts/page-editor/02-block-styles.js:113` |
| `dbFmtNum` | функція | `src/scripts/page-editor/02-block-styles.js:114` |
| `PG_GONE` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:118` |
| `inner` | функція | `src/scripts/page-editor/02-block-styles.js:121` |
| `dbEnsure` | функція | `src/scripts/page-editor/02-block-styles.js:370` |
| `dbHTML` | функція | `src/scripts/page-editor/02-block-styles.js:387` |
| `pgSgBusy` | значення | `src/scripts/page-editor/02-block-styles.js:437` |
| `pgSgPlace` | функція | `src/scripts/page-editor/02-block-styles.js:438` |
| `PGLAST` | значення | `src/scripts/page-editor/02-block-styles.js:446` |
| `pgLastGet` | функція | `src/scripts/page-editor/02-block-styles.js:447` |
| `pgLastSet` | функція | `src/scripts/page-editor/02-block-styles.js:448` |
| `PGRECENT` | значення | `src/scripts/page-editor/02-block-styles.js:450` |
| `pgRecentGet` | функція | `src/scripts/page-editor/02-block-styles.js:451` |
| `pgRecentAdd` | функція | `src/scripts/page-editor/02-block-styles.js:452` |
| `renderList` | функція | `src/scripts/page-editor/02-block-styles.js:453` |
| `renderBoardBlock` | функція | `src/scripts/page-editor/02-block-styles.js:472` |
| `renderRowBlock` | функція | `src/scripts/page-editor/02-block-styles.js:494` |
| `renumber` | функція | `src/scripts/page-editor/02-block-styles.js:511` |
| `pgPath` | масив | `src/scripts/page-editor/02-block-styles.js:513` |
| `pgResolve` | функція | `src/scripts/page-editor/02-block-styles.js:514` |
| `pgHeaStrip` | функція | `src/scripts/page-editor/02-block-styles.js:524` |
| `render` | функція | `src/scripts/page-editor/02-block-styles.js:540` |
| `fillWidgetHosts` | функція | `src/scripts/page-editor/02-block-styles.js:583` |
| `window.__pgWidgetsSync` | функція | `src/scripts/page-editor/02-block-styles.js:595` |
| `caretEnd` | функція | `src/scripts/page-editor/02-block-styles.js:601` |
| `slashCtx` | значення | `src/scripts/page-editor/02-block-styles.js:604` |
| `slash` | значення | `src/scripts/page-editor/02-block-styles.js:682` |
| `srail` | значення | `src/scripts/page-editor/02-block-styles.js:684` |
| `pgsCat` | значення | `src/scripts/page-editor/02-block-styles.js:685` |
| `pgsFiltered` | функція | `src/scripts/page-editor/02-block-styles.js:686` |
| `buildRail` | функція | `src/scripts/page-editor/02-block-styles.js:696` |
| `buildSlash` | функція | `src/scripts/page-editor/02-block-styles.js:705` |

### `src/scripts/page-editor/03-premium-pack.js` — 35 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `pgAsk` | функція | `src/scripts/page-editor/03-premium-pack.js:15` |
| `openCondSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:30` |
| `openHeadingStyleSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:74` |
| `positionSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:146` |
| `pgMenuTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:171` |
| `openSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:172` |
| `pgAddPending` | значення | `src/scripts/page-editor/03-premium-pack.js:181` |
| `dropPendingAdd` | функція | `src/scripts/page-editor/03-premium-pack.js:182` |
| `closeSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:189` |
| `applySlash` | функція | `src/scripts/page-editor/03-premium-pack.js:191` |
| `pgFindWboard` | функція | `src/scripts/page-editor/03-premium-pack.js:302` |
| `pgDataInsert` | функція | `src/scripts/page-editor/03-premium-pack.js:306` |
| `drag` | значення | `src/scripts/page-editor/03-premium-pack.js:332` |
| `dstart` | функція | `src/scripts/page-editor/03-premium-pack.js:335` |
| `ghostMake` | функція | `src/scripts/page-editor/03-premium-pack.js:345` |
| `ghostMove` | функція | `src/scripts/page-editor/03-premium-pack.js:354` |
| `ghostKill` | функція | `src/scripts/page-editor/03-premium-pack.js:355` |
| `clearMarks` | функція | `src/scripts/page-editor/03-premium-pack.js:356` |
| `dmove` | функція | `src/scripts/page-editor/03-premium-pack.js:357` |
| `dend` | функція | `src/scripts/page-editor/03-premium-pack.js:379` |
| `cancelDrag` | функція | `src/scripts/page-editor/03-premium-pack.js:391` |
| `bmenu` | значення | `src/scripts/page-editor/03-premium-pack.js:486` |
| `openBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:487` |
| `closeBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:521` |
| `THKEY` | значення | `src/scripts/page-editor/03-premium-pack.js:567` |
| `applyTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:568` |
| `pageThemeDefault` | функція | `src/scripts/page-editor/03-premium-pack.js:571` |
| `window.__pgThemeAuto` | функція | `src/scripts/page-editor/03-premium-pack.js:582` |
| `window.__pgThemeIsAuto` | функція | `src/scripts/page-editor/03-premium-pack.js:583` |
| `pgTitle` | значення | `src/scripts/page-editor/03-premium-pack.js:597` |
| `pgTitleCommit` | функція | `src/scripts/page-editor/03-premium-pack.js:600` |
| `addBtn` | значення | `src/scripts/page-editor/03-premium-pack.js:619` |
| `CD_MONTHS` | масив | `src/scripts/page-editor/03-premium-pack.js:628` |
| `cdFmt` | функція | `src/scripts/page-editor/03-premium-pack.js:629` |
| `cdHTML` | функція | `src/scripts/page-editor/03-premium-pack.js:634` |

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
| `covPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:570` |
| `covEdBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:613` |
| `covEdState` | функція | `src/scripts/page-editor/08-w-projects-hub.js:614` |
| `covEdSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:620` |
| `covEdBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:633` |
| `covEdOpen` | функція | `src/scripts/page-editor/08-w-projects-hub.js:687` |
| `covEdClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:688` |

### `src/scripts/page-editor/09-open-page.js` — 1 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `window.openFlowPage` | функція | `src/scripts/page-editor/09-open-page.js:6` |

### `src/scripts/page-editor/10-mic.js` — 10 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `btn` | значення | `src/scripts/page-editor/10-mic.js:14` |
| `lastEl` | значення | `src/scripts/page-editor/10-mic.js:15` |
| `lastRange` | значення | `src/scripts/page-editor/10-mic.js:16` |
| `toast` | функція | `src/scripts/page-editor/10-mic.js:18` |
| `setLive` | функція | `src/scripts/page-editor/10-mic.js:40` |
| `insert` | функція | `src/scripts/page-editor/10-mic.js:47` |
| `start` | функція | `src/scripts/page-editor/10-mic.js:80` |
| `stop` | функція | `src/scripts/page-editor/10-mic.js:130` |
| `toggle` | функція | `src/scripts/page-editor/10-mic.js:139` |
| `wire` | функція | `src/scripts/page-editor/10-mic.js:141` |

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

### `tools/test-migrations.js` — 29 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `fs` | значення | `tools/test-migrations.js:15` |
| `os` | значення | `tools/test-migrations.js:16` |
| `path` | значення | `tools/test-migrations.js:17` |
| `target` | функція | `tools/test-migrations.js:20` |
| `SB_TOKEN_KEY` | значення | `tools/test-migrations.js:23` |
| `FLAGS` | масив | `tools/test-migrations.js:25` |
| `WAIT` | значення | `tools/test-migrations.js:28` |
| `T0` | значення | `tools/test-migrations.js:30` |
| `PNG` | значення | `tools/test-migrations.js:31` |
| `W` | функція | `tools/test-migrations.js:33` |
| `LEGACY` | обʼєкт | `tools/test-migrations.js:35` |
| `POSTMIG` | значення | `tools/test-migrations.js:72` |
| `fakeSession` | функція | `tools/test-migrations.js:88` |
| `problems` | масив | `tools/test-migrations.js:96` |
| `bad` | функція | `tools/test-migrations.js:97` |
| `sleep` | функція | `tools/test-migrations.js:98` |
| `errors` | масив | `tools/test-migrations.js:99` |
| `blank` | значення | `tools/test-migrations.js:107` |
| `makeWin` | функція | `tools/test-migrations.js:110` |
| `seed` | функція | `tools/test-migrations.js:123` |
| `start` | функція | `tools/test-migrations.js:127` |
| `snap` | функція | `tools/test-migrations.js:128` |
| `js` | функція | `tools/test-migrations.js:130` |
| `diff` | функція | `tools/test-migrations.js:131` |
| `isStore` | функція | `tools/test-migrations.js:141` |
| `dataOf` | функція | `tools/test-migrations.js:142` |
| `scenarioA` | функція | `tools/test-migrations.js:144` |
| `scenarioP` | функція | `tools/test-migrations.js:207` |
| `scenarioSilent` | функція | `tools/test-migrations.js:243` |

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
