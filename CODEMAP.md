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
| Файлів JS | 55 |
| Рядків JS | 26070 |
| Файлів CSS | 28 |
| Рядків CSS | 8757 |
| Сутностей верхнього рівня | 1564 |
| Ключів сховища (FLOW_KEYS) | 44 |

## Файли JS

| Файл | Рядків | Сутностей |
|---|---|---|
| `src/scripts/01-crash-screen.js` | 18 | 1 |
| `src/scripts/03-quota-banner.js` | 10 | 2 |
| `src/scripts/20-radial-menu.js` | 108 | 12 |
| `src/scripts/21-newyear-countdown.js` | 124 | 11 |
| `src/scripts/40-pets-3d.js` | 287 | 0 |
| `src/scripts/41-theme-layer.js` | 153 | 0 |
| `src/scripts/42-voice-island.js` | 782 | 0 |
| `src/scripts/43-planner.js` | 134 | 0 |
| `src/scripts/44-week.js` | 329 | 0 |
| `src/scripts/45-month.js` | 661 | 0 |
| `src/scripts/46-mx.js` | 215 | 0 |
| `src/scripts/core/01-base.js` | 313 | 37 |
| `src/scripts/core/02-storage.js` | 1130 | 102 |
| `src/scripts/core/03-platform.js` | 60 | 14 |
| `src/scripts/core/04-folders-nav.js` | 241 | 45 |
| `src/scripts/core/05-spaces.js` | 916 | 75 |
| `src/scripts/core/06-wishes.js` | 1191 | 92 |
| `src/scripts/core/07-values.js` | 202 | 18 |
| `src/scripts/core/08-finance.js` | 935 | 99 |
| `src/scripts/core/09-goals.js` | 610 | 23 |
| `src/scripts/core/10-planner.js` | 903 | 49 |
| `src/scripts/core/11-ai-flow.js` | 168 | 14 |
| `src/scripts/core/12-ai-agent.js` | 1508 | 68 |
| `src/scripts/core/13-pets.js` | 206 | 13 |
| `src/scripts/core/14-react.js` | 345 | 41 |
| `src/scripts/core/15-flow-spot.js` | 2059 | 103 |
| `src/scripts/core/16-dashboard.js` | 555 | 21 |
| `src/scripts/core/17-folder-render.js` | 225 | 8 |
| `src/scripts/core/18-debts.js` | 182 | 20 |
| `src/scripts/core/19-spending.js` | 135 | 15 |
| `src/scripts/core/20-work.js` | 506 | 55 |
| `src/scripts/core/21-patterns.js` | 191 | 21 |
| `src/scripts/core/22-diary.js` | 525 | 54 |
| `src/scripts/core/23-board.js` | 658 | 85 |
| `src/scripts/core/24-reminders.js` | 627 | 35 |
| `src/scripts/core/25-reader.js` | 502 | 35 |
| `src/scripts/core/26-blocks-render.js` | 1891 | 25 |
| `src/scripts/core/27-canvas.js` | 1137 | 27 |
| `src/scripts/core/28-vision.js` | 533 | 43 |
| `src/scripts/core/29-more-screen.js` | 385 | 22 |
| `src/scripts/core/30-upgrade.js` | 291 | 30 |
| `src/scripts/core/31-my-year.js` | 200 | 21 |
| `src/scripts/core/32-global-search.js` | 143 | 13 |
| `src/scripts/core/33-home-widgets.js` | 84 | 8 |
| `src/scripts/core/34-shortcuts.js` | 54 | 5 |
| `src/scripts/page-editor/01-palette.js` | 204 | 18 |
| `src/scripts/page-editor/02-block-styles.js` | 924 | 47 |
| `src/scripts/page-editor/03-premium-pack.js` | 590 | 27 |
| `src/scripts/page-editor/04-w-journal.js` | 107 | 9 |
| `src/scripts/page-editor/05-w-decisions.js` | 112 | 4 |
| `src/scripts/page-editor/06-w-project.js` | 100 | 6 |
| `src/scripts/page-editor/07-w-habits.js` | 69 | 4 |
| `src/scripts/page-editor/08-w-projects-hub.js` | 927 | 41 |
| `src/scripts/page-editor/09-journal-sheet.js` | 450 | 36 |
| `src/scripts/page-editor/10-mic.js` | 155 | 10 |

## Файли CSS

| Файл | Рядків | Селекторів |
|---|---|---|
| `src/styles/00-fonts.css` | 97 | 0 |
| `src/styles/03-patterns.css` | 71 | 0 |
| `src/styles/04-diary.css` | 110 | 0 |
| `src/styles/10-fd26.css` | 29 | 0 |
| `src/styles/12-theme-nightfire.css` | 428 | 6 |
| `src/styles/13-planner.css` | 82 | 0 |
| `src/styles/14-week.css` | 157 | 0 |
| `src/styles/15-month.css` | 227 | 2 |
| `src/styles/16-mx.css` | 242 | 2 |
| `src/styles/17-horizon.css` | 363 | 1 |
| `src/styles/18-standalone.css` | 43 | 1 |
| `src/styles/19-themes-flat.css` | 416 | 3 |
| `src/styles/core/01-tokens-base.css` | 343 | 8 |
| `src/styles/core/02-page-editor.css` | 1299 | 10 |
| `src/styles/core/03-folders-projects.css` | 568 | 0 |
| `src/styles/core/04-menus.css` | 61 | 0 |
| `src/styles/core/05-values-wishes.css` | 186 | 0 |
| `src/styles/core/06-goals.css` | 228 | 0 |
| `src/styles/core/07-finance.css` | 623 | 0 |
| `src/styles/core/08-work.css` | 202 | 0 |
| `src/styles/core/09-board-canvas.css` | 527 | 9 |
| `src/styles/core/10-reader-blocks.css` | 529 | 4 |
| `src/styles/core/11-spaces-desktop.css` | 367 | 5 |
| `src/styles/core/12-pets-more-planner.css` | 1189 | 0 |
| `src/styles/core/13-search-capture.css` | 80 | 0 |
| `src/styles/core/15-vision.css` | 172 | 0 |
| `src/styles/core/16-upgrade.css` | 54 | 0 |
| `src/styles/core/17-my-year.css` | 64 | 0 |

## Ключі сховища — FLOW_KEYS (44)

`src/scripts/core/01-base.js`

`active_space_map_v2` · `ai_chat` · `ai_endpoint` · `ai_memory` · `ai_prompts` · `blockusage`

`board` · `custom_avatar_v1` · `customboards` · `debts` · `diary_books_v1` · `diary_entries_v1`

`diary_insights_v1` · `envelopes` · `fin_ops` · `fin_recurring` · `folder_widgets` · `folders_cfg`

`folders_order` · `fx_cfg` · `goals_data` · `i18n_content_cache` · `income_cards` · `lang_pref`

`patterns_chains` · `patterns_score` · `patterns_transform` · `readerCfg` · `spacecanvas` · `spacecanvaszoom`

`spaces_map_v2` · `spaceview` · `spacewide` · `spend` · `switcher_style` · `ui_mode`

`upgrade_profile_v1` · `values_state` · `vision_v1` · `wishes_board` · `work_blocks` · `work_cfg`

`work_extras` · `work_sessions`

## Сутності по файлах

Посилання виду `файл:рядок` — клікабельні.

### `src/scripts/01-crash-screen.js` — 1 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `show` | функція | `src/scripts/01-crash-screen.js:4` |

### `src/scripts/03-quota-banner.js` — 2 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `window.__quotaHit` | значення | `src/scripts/03-quota-banner.js:2` |
| `window.showQuotaBanner` | функція | `src/scripts/03-quota-banner.js:3` |

### `src/scripts/20-radial-menu.js` — 12 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `rmenu` | значення | `src/scripts/20-radial-menu.js:5` |
| `ring` | значення | `src/scripts/20-radial-menu.js:6` |
| `center` | значення | `src/scripts/20-radial-menu.js:7` |
| `activeTile` | значення | `src/scripts/20-radial-menu.js:8` |
| `clickIn` | функція | `src/scripts/20-radial-menu.js:10` |
| `buildOpts` | функція | `src/scripts/20-radial-menu.js:12` |
| `window.openRadialMenu` | функція | `src/scripts/20-radial-menu.js:67` |
| `closeRadial` | функція | `src/scripts/20-radial-menu.js:77` |
| `bnpop` | значення | `src/scripts/20-radial-menu.js:82` |
| `bnpopAdd` | значення | `src/scripts/20-radial-menu.js:83` |
| `closeBnpop` | функція | `src/scripts/20-radial-menu.js:85` |
| `window.openBentoPop` | функція | `src/scripts/20-radial-menu.js:87` |

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
| `window.goNYC` | функція | `src/scripts/21-newyear-countdown.js:119` |

### `src/scripts/40-pets-3d.js` — порожньо на верхньому рівні

### `src/scripts/41-theme-layer.js` — порожньо на верхньому рівні

### `src/scripts/42-voice-island.js` — порожньо на верхньому рівні

### `src/scripts/43-planner.js` — порожньо на верхньому рівні

### `src/scripts/44-week.js` — порожньо на верхньому рівні

### `src/scripts/45-month.js` — порожньо на верхньому рівні

### `src/scripts/46-mx.js` — порожньо на верхньому рівні

### `src/scripts/core/01-base.js` — 37 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `ymdLocal` | функція | `src/scripts/core/01-base.js:31` |
| `ymLocal` | функція | `src/scripts/core/01-base.js:33` |
| `window.ymdLocal` | значення | `src/scripts/core/01-base.js:34` |
| `pluralUk` | функція | `src/scripts/core/01-base.js:39` |
| `window.pluralUk` | значення | `src/scripts/core/01-base.js:46` |
| `window.FLOW_KEYS` | масив | `src/scripts/core/01-base.js:54` |
| `getLang` | функція | `src/scripts/core/01-base.js:81` |
| `setLang` | функція | `src/scripts/core/01-base.js:82` |
| `window.__flowLang` | значення | `src/scripts/core/01-base.js:83` |
| `window.flowLang` | значення | `src/scripts/core/01-base.js:84` |
| `window.flowSetLang` | значення | `src/scripts/core/01-base.js:85` |
| `I18N_DICT` | обʼєкт | `src/scripts/core/01-base.js:90` |
| `I18N_WORDS` | масив | `src/scripts/core/01-base.js:142` |
| `wordLevelTranslate` | функція | `src/scripts/core/01-base.js:166` |
| `UI_CACHE_KEY` | значення | `src/scripts/core/01-base.js:183` |
| `uiHash` | функція | `src/scripts/core/01-base.js:184` |
| `uiCacheGet` | функція | `src/scripts/core/01-base.js:185` |
| `uiCacheSet` | функція | `src/scripts/core/01-base.js:186` |
| `uiInFlight` | обʼєкт | `src/scripts/core/01-base.js:187` |
| `uiQueue` | масив | `src/scripts/core/01-base.js:188` |
| `uiPump` | функція | `src/scripts/core/01-base.js:189` |
| `HAS_CYR` | значення | `src/scripts/core/01-base.js:195` |
| `autoTranslateNode` | функція | `src/scripts/core/01-base.js:196` |
| `translateNode` | функція | `src/scripts/core/01-base.js:220` |
| `i18nApply` | функція | `src/scripts/core/01-base.js:238` |
| `window.i18nApply` | значення | `src/scripts/core/01-base.js:242` |
| `raf` | значення | `src/scripts/core/01-base.js:245` |
| `mo` | функція | `src/scripts/core/01-base.js:246` |
| `contentTranslateOn` | функція | `src/scripts/core/01-base.js:263` |
| `window.flowContentTranslateOn` | значення | `src/scripts/core/01-base.js:266` |
| `hash` | функція | `src/scripts/core/01-base.js:267` |
| `cacheGet` | функція | `src/scripts/core/01-base.js:268` |
| `cacheSet` | функція | `src/scripts/core/01-base.js:269` |
| `window.flowTranslateContent` | функція | `src/scripts/core/01-base.js:274` |
| `window.__flowErrors` | масив | `src/scripts/core/01-base.js:301` |
| `push` | функція | `src/scripts/core/01-base.js:302` |
| `window.flowErrors` | функція | `src/scripts/core/01-base.js:311` |

### `src/scripts/core/02-storage.js` — 102 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FLAG` | значення | `src/scripts/core/02-storage.js:11` |
| `LP` | значення | `src/scripts/core/02-storage.js:24` |
| `window.__flowSync` | обʼєкт | `src/scripts/core/02-storage.js:25` |
| `setSync` | функція | `src/scripts/core/02-storage.js:27` |
| `wrap` | функція | `src/scripts/core/02-storage.js:29` |
| `unwrap` | функція | `src/scripts/core/02-storage.js:30` |
| `SCHEMAS` | обʼєкт | `src/scripts/core/02-storage.js:46` |
| `MIGRATIONS` | обʼєкт | `src/scripts/core/02-storage.js:56` |
| `readSv` | функція | `src/scripts/core/02-storage.js:72` |
| `migrateParsed` | функція | `src/scripts/core/02-storage.js:79` |
| `stampSv` | функція | `src/scripts/core/02-storage.js:94` |
| `unstampSv` | функція | `src/scripts/core/02-storage.js:107` |
| `lcGet` | функція | `src/scripts/core/02-storage.js:115` |
| `isQuotaErr` | функція | `src/scripts/core/02-storage.js:117` |
| `purgeDisposable` | функція | `src/scripts/core/02-storage.js:122` |
| `lcSet` | функція | `src/scripts/core/02-storage.js:138` |
| `lcDel` | функція | `src/scripts/core/02-storage.js:157` |
| `NP` | значення | `src/scripts/core/02-storage.js:173` |
| `npTimers` | обʼєкт | `src/scripts/core/02-storage.js:181` |
| `npFails` | значення | `src/scripts/core/02-storage.js:182` |
| `npReady` | функція | `src/scripts/core/02-storage.js:186` |
| `npWrite` | функція | `src/scripts/core/02-storage.js:188` |
| `npDel` | функція | `src/scripts/core/02-storage.js:206` |
| `npHydrate` | функція | `src/scripts/core/02-storage.js:214` |
| `npSeed` | функція | `src/scripts/core/02-storage.js:239` |
| `window.storage` | обʼєкт | `src/scripts/core/02-storage.js:256` |
| `SB_URL` | значення | `src/scripts/core/02-storage.js:317` |
| `SB_KEY` | значення | `src/scripts/core/02-storage.js:318` |
| `sb` | значення | `src/scripts/core/02-storage.js:319` |
| `sbBatchCache` | значення | `src/scripts/core/02-storage.js:320` |
| `sbBatchTs` | обʼєкт | `src/scripts/core/02-storage.js:321` |
| `window.__sbReady` | значення | `src/scripts/core/02-storage.js:322` |
| `loadSupabaseLib` | функція | `src/scripts/core/02-storage.js:327` |
| `sbInit` | функція | `src/scripts/core/02-storage.js:346` |
| `window.sbUser` | функція | `src/scripts/core/02-storage.js:402` |
| `sbPrefetchAll` | функція | `src/scripts/core/02-storage.js:405` |
| `sbLocalVersion` | функція | `src/scripts/core/02-storage.js:419` |
| `window.sbPrefetchAll` | значення | `src/scripts/core/02-storage.js:427` |
| `sbSigningIn` | значення | `src/scripts/core/02-storage.js:428` |
| `window.sbSignInGoogle` | функція | `src/scripts/core/02-storage.js:429` |
| `window.sbSignOut` | функція | `src/scripts/core/02-storage.js:504` |
| `origGet` | значення | `src/scripts/core/02-storage.js:542` |
| `origSet` | значення | `src/scripts/core/02-storage.js:543` |
| `origDelete` | значення | `src/scripts/core/02-storage.js:544` |
| `origList` | значення | `src/scripts/core/02-storage.js:545` |
| `sbWriteQueue` | обʼєкт | `src/scripts/core/02-storage.js:580` |
| `sbWriteTimer` | значення | `src/scripts/core/02-storage.js:581` |
| `sbOutboxSave` | функція | `src/scripts/core/02-storage.js:584` |
| `sbOutboxLoad` | функція | `src/scripts/core/02-storage.js:590` |
| `sbSyncPending` | функція | `src/scripts/core/02-storage.js:597` |
| `sbScheduleWrite` | функція | `src/scripts/core/02-storage.js:598` |
| `sbFlushWrites` | функція | `src/scripts/core/02-storage.js:605` |
| `window.sbFlushWrites` | значення | `src/scripts/core/02-storage.js:647` |
| `sbLastPull` | значення | `src/scripts/core/02-storage.js:668` |
| `sbPullFresh` | функція | `src/scripts/core/02-storage.js:669` |
| `window.sbPullFresh` | значення | `src/scripts/core/02-storage.js:695` |
| `PH_KEY` | значення | `src/scripts/core/02-storage.js:710` |
| `PH_PENDING` | значення | `src/scripts/core/02-storage.js:711` |
| `phPendingGet` | функція | `src/scripts/core/02-storage.js:712` |
| `phPendingSet` | функція | `src/scripts/core/02-storage.js:713` |
| `phPendingAdd` | функція | `src/scripts/core/02-storage.js:714` |
| `phPendingDrop` | функція | `src/scripts/core/02-storage.js:715` |
| `PH_TS` | значення | `src/scripts/core/02-storage.js:720` |
| `phTsGet` | функція | `src/scripts/core/02-storage.js:721` |
| `phTsSet` | функція | `src/scripts/core/02-storage.js:722` |
| `phTsDrop` | функція | `src/scripts/core/02-storage.js:723` |
| `window.sbPhotoPush` | функція | `src/scripts/core/02-storage.js:725` |
| `window.sbPhotoFetch` | функція | `src/scripts/core/02-storage.js:740` |
| `window.sbPhotoDel` | функція | `src/scripts/core/02-storage.js:749` |
| `phSyncBusy` | значення | `src/scripts/core/02-storage.js:759` |
| `sbPhotoSync` | функція | `src/scripts/core/02-storage.js:760` |
| `window.sbPhotoSync` | значення | `src/scripts/core/02-storage.js:790` |
| `window.sbWipeAll` | функція | `src/scripts/core/02-storage.js:795` |
| `prefSet` | функція | `src/scripts/core/02-storage.js:848` |
| `prefCatchup` | функція | `src/scripts/core/02-storage.js:852` |
| `UIMODE_KEY` | значення | `src/scripts/core/02-storage.js:865` |
| `window.uiMode` | значення | `src/scripts/core/02-storage.js:866` |
| `applyUiMode` | функція | `src/scripts/core/02-storage.js:867` |
| `setUiMode` | функція | `src/scripts/core/02-storage.js:868` |
| `window.setUiMode` | значення | `src/scripts/core/02-storage.js:876` |
| `LP` | значення | `src/scripts/core/02-storage.js:883` |
| `FORMAT` | значення | `src/scripts/core/02-storage.js:884` |
| `APP` | значення | `src/scripts/core/02-storage.js:885` |
| `collect` | функція | `src/scripts/core/02-storage.js:888` |
| `stats` | функція | `src/scripts/core/02-storage.js:899` |
| `makeEnvelope` | функція | `src/scripts/core/02-storage.js:906` |
| `exportToFile` | функція | `src/scripts/core/02-storage.js:917` |
| `snapshot` | функція | `src/scripts/core/02-storage.js:932` |
| `restoreSnapshot` | функція | `src/scripts/core/02-storage.js:935` |
| `applyEnvelope` | функція | `src/scripts/core/02-storage.js:941` |
| `importFromFile` | функція | `src/scripts/core/02-storage.js:963` |
| `window.flowBackup` | обʼєкт | `src/scripts/core/02-storage.js:972` |
| `window.flowFactoryReset` | функція | `src/scripts/core/02-storage.js:986` |
| `window.PhotoDB` | значення | `src/scripts/core/02-storage.js:1027` |
| `window.__photoCache` | значення | `src/scripts/core/02-storage.js:1065` |
| `__phPending` | обʼєкт | `src/scripts/core/02-storage.js:1071` |
| `__photoPoke` | функція | `src/scripts/core/02-storage.js:1072` |
| `window.photoSrc` | функція | `src/scripts/core/02-storage.js:1080` |
| `window.photoIsRef` | функція | `src/scripts/core/02-storage.js:1104` |
| `window.photoWarm` | функція | `src/scripts/core/02-storage.js:1105` |
| `window.photoPut` | функція | `src/scripts/core/02-storage.js:1111` |
| `window.photoDel` | функція | `src/scripts/core/02-storage.js:1120` |

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

### `src/scripts/core/04-folders-nav.js` — 45 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `folders` | обʼєкт | `src/scripts/core/04-folders-nav.js:2` |
| `order` | масив | `src/scripts/core/04-folders-nav.js:6` |
| `CUSTOM_AV_KEY` | значення | `src/scripts/core/04-folders-nav.js:9` |
| `customAvatar` | значення | `src/scripts/core/04-folders-nav.js:10` |
| `saveCustomAvatar` | функція | `src/scripts/core/04-folders-nav.js:11` |
| `customAvatarHtml` | функція | `src/scripts/core/04-folders-nav.js:12` |
| `FKEY` | значення | `src/scripts/core/04-folders-nav.js:13` |
| `FOLDER_COLORS` | масив | `src/scripts/core/04-folders-nav.js:14` |
| `FOLDER_EMOJIS` | масив | `src/scripts/core/04-folders-nav.js:15` |
| `FOLDER_ICONS` | масив | `src/scripts/core/04-folders-nav.js:20` |
| `EMOJI_ICON` | обʼєкт | `src/scripts/core/04-folders-nav.js:24` |
| `folderIconFor` | функція | `src/scripts/core/04-folders-nav.js:61` |
| `folderIcon` | функція | `src/scripts/core/04-folders-nav.js:68` |
| `ICON_ALL` | масив | `src/scripts/core/04-folders-nav.js:71` |
| `folderVisible` | функція | `src/scripts/core/04-folders-nav.js:84` |
| `saveFolders` | функція | `src/scripts/core/04-folders-nav.js:87` |
| `WIDGET_CATALOG` | обʼєкт | `src/scripts/core/04-folders-nav.js:101` |
| `folderWidgets` | обʼєкт | `src/scripts/core/04-folders-nav.js:110` |
| `FWKEY` | значення | `src/scripts/core/04-folders-nav.js:111` |
| `saveFolderWidgets` | функція | `src/scripts/core/04-folders-nav.js:112` |
| `widgetsForFolder` | функція | `src/scripts/core/04-folders-nav.js:113` |
| `addWidgetToFolder` | функція | `src/scripts/core/04-folders-nav.js:122` |
| `removeWidgetFromFolder` | функція | `src/scripts/core/04-folders-nav.js:130` |
| `orderedFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:135` |
| `FOLDER_ROLES` | обʼєкт | `src/scripts/core/04-folders-nav.js:141` |
| `PROJECT_STATUSES` | масив | `src/scripts/core/04-folders-nav.js:146` |
| `projStatusMeta` | функція | `src/scripts/core/04-folders-nav.js:150` |
| `folderProgress` | функція | `src/scripts/core/04-folders-nav.js:152` |
| `dueLabel` | функція | `src/scripts/core/04-folders-nav.js:164` |
| `projFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:173` |
| `folderNextStep` | функція | `src/scripts/core/04-folders-nav.js:175` |
| `completeFolderNextStep` | функція | `src/scripts/core/04-folders-nav.js:186` |
| `childFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:195` |
| `topFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:198` |
| `isDescendantFolder` | функція | `src/scripts/core/04-folders-nav.js:201` |
| `moveFolderTo` | функція | `src/scripts/core/04-folders-nav.js:209` |
| `goHome` | функція | `src/scripts/core/04-folders-nav.js:219` |
| `goFolder` | функція | `src/scripts/core/04-folders-nav.js:220` |
| `goDebts` | функція | `src/scripts/core/04-folders-nav.js:234` |
| `goFinance` | функція | `src/scripts/core/04-folders-nav.js:235` |
| `goEnvelopes` | функція | `src/scripts/core/04-folders-nav.js:236` |
| `goSpend` | функція | `src/scripts/core/04-folders-nav.js:237` |
| `workOrigin` | значення | `src/scripts/core/04-folders-nav.js:238` |
| `goWork` | функція | `src/scripts/core/04-folders-nav.js:239` |
| `goSpace` | функція | `src/scripts/core/04-folders-nav.js:240` |

### `src/scripts/core/05-spaces.js` — 75 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `switcherStyle` | значення | `src/scripts/core/05-spaces.js:8` |
| `SWKEY` | значення | `src/scripts/core/05-spaces.js:9` |
| `spacesMap` | обʼєкт | `src/scripts/core/05-spaces.js:14` |
| `SPMKEY` | значення | `src/scripts/core/05-spaces.js:15` |
| `saveSpacesMeta` | функція | `src/scripts/core/05-spaces.js:22` |
| `curCtx` | функція | `src/scripts/core/05-spaces.js:25` |
| `ctxBaseKey` | функція | `src/scripts/core/05-spaces.js:29` |
| `ctxDefaultMeta` | функція | `src/scripts/core/05-spaces.js:30` |
| `spacesFor` | функція | `src/scripts/core/05-spaces.js:36` |
| `activeSpaceFor` | функція | `src/scripts/core/05-spaces.js:41` |
| `spaceByIdIn` | функція | `src/scripts/core/05-spaces.js:42` |
| `keyForSpaceIn` | функція | `src/scripts/core/05-spaces.js:43` |
| `spaceCountIn` | функція | `src/scripts/core/05-spaces.js:44` |
| `goActiveSpace` | функція | `src/scripts/core/05-spaces.js:47` |
| `switchSpace` | функція | `src/scripts/core/05-spaces.js:55` |
| `addSpace` | функція | `src/scripts/core/05-spaces.js:64` |
| `deleteSpace` | функція | `src/scripts/core/05-spaces.js:77` |
| `renderSpaceSwitcher` | функція | `src/scripts/core/05-spaces.js:91` |
| `openSpaceSettings` | функція | `src/scripts/core/05-spaces.js:132` |
| `goSpaceFor` | функція | `src/scripts/core/05-spaces.js:183` |
| `spaceFromFolder` | значення | `src/scripts/core/05-spaces.js:204` |
| `show` | функція | `src/scripts/core/05-spaces.js:207` |
| `openSpaceMore` | функція | `src/scripts/core/05-spaces.js:252` |
| `dsbFillUser` | функція | `src/scripts/core/05-spaces.js:279` |
| `window.dsbFillUser` | значення | `src/scripts/core/05-spaces.js:302` |
| `dsbProfileSheet` | функція | `src/scripts/core/05-spaces.js:303` |
| `renderSettingsCard` | функція | `src/scripts/core/05-spaces.js:338` |
| `window.renderSettingsCard` | значення | `src/scripts/core/05-spaces.js:397` |
| `openSettings` | функція | `src/scripts/core/05-spaces.js:399` |
| `window.openSettingsSheet` | значення | `src/scripts/core/05-spaces.js:415` |
| `ex` | значення | `src/scripts/core/05-spaces.js:438` |
| `setNote` | функція | `src/scripts/core/05-spaces.js:440` |
| `spaceLayout` | значення | `src/scripts/core/05-spaces.js:496` |
| `applySpaceLayout` | функція | `src/scripts/core/05-spaces.js:499` |
| `sidebarCollapsed` | значення | `src/scripts/core/05-spaces.js:511` |
| `applyChrome` | функція | `src/scripts/core/05-spaces.js:516` |
| `renderPaneList` | функція | `src/scripts/core/05-spaces.js:532` |
| `homeWidgets` | значення | `src/scripts/core/05-spaces.js:563` |
| `applyHomeWidgets` | функція | `src/scripts/core/05-spaces.js:566` |
| `THEME_SETS` | обʼєкт | `src/scripts/core/05-spaces.js:586` |
| `THEME_META` | обʼєкт | `src/scripts/core/05-spaces.js:592` |
| `THEME_KEYS` | значення | `src/scripts/core/05-spaces.js:601` |
| `isTheme` | функція | `src/scripts/core/05-spaces.js:602` |
| `themeSetOf` | функція | `src/scripts/core/05-spaces.js:604` |
| `themeIsDark` | функція | `src/scripts/core/05-spaces.js:608` |
| `theme` | значення | `src/scripts/core/05-spaces.js:609` |
| `applyTheme` | функція | `src/scripts/core/05-spaces.js:627` |
| `setTheme` | функція | `src/scripts/core/05-spaces.js:652` |
| `setThemeSet` | функція | `src/scripts/core/05-spaces.js:662` |
| `toggleTheme` | функція | `src/scripts/core/05-spaces.js:666` |
| `proTheme` | значення | `src/scripts/core/05-spaces.js:680` |
| `applyProTheme` | функція | `src/scripts/core/05-spaces.js:682` |
| `toggleProTheme` | функція | `src/scripts/core/05-spaces.js:688` |
| `cardSkin` | значення | `src/scripts/core/05-spaces.js:698` |
| `applyCardSkin` | функція | `src/scripts/core/05-spaces.js:700` |
| `setCardSkin` | функція | `src/scripts/core/05-spaces.js:706` |
| `zenMode` | значення | `src/scripts/core/05-spaces.js:716` |
| `applyZen` | функція | `src/scripts/core/05-spaces.js:717` |
| `setZen` | функція | `src/scripts/core/05-spaces.js:724` |
| `tidyCanvas` | функція | `src/scripts/core/05-spaces.js:756` |
| `window.__fitAll` | значення | `src/scripts/core/05-spaces.js:764` |
| `RR_DEFS` | обʼєкт | `src/scripts/core/05-spaces.js:775` |
| `rrCfg` | функція | `src/scripts/core/05-spaces.js:776` |
| `rrSave` | функція | `src/scripts/core/05-spaces.js:781` |
| `rrCfgSheet` | функція | `src/scripts/core/05-spaces.js:782` |
| `renderRightRail` | функція | `src/scripts/core/05-spaces.js:801` |
| `goGoals` | функція | `src/scripts/core/05-spaces.js:835` |
| `prjHexToRgb` | функція | `src/scripts/core/05-spaces.js:838` |
| `prjTileHTML` | функція | `src/scripts/core/05-spaces.js:846` |
| `renderProjects` | функція | `src/scripts/core/05-spaces.js:854` |
| `goProjects` | функція | `src/scripts/core/05-spaces.js:887` |
| `goPlanner` | функція | `src/scripts/core/05-spaces.js:890` |
| `goValues` | функція | `src/scripts/core/05-spaces.js:894` |
| `goWishes` | функція | `src/scripts/core/05-spaces.js:896` |
| `window.goWishes` | значення | `src/scripts/core/05-spaces.js:897` |

### `src/scripts/core/06-wishes.js` — 92 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `WICONS` | обʼєкт | `src/scripts/core/06-wishes.js:3` |
| `icoHtml` | функція | `src/scripts/core/06-wishes.js:16` |
| `actionSheet` | функція | `src/scripts/core/06-wishes.js:19` |
| `confirmSheet` | функція | `src/scripts/core/06-wishes.js:43` |
| `flowAlert` | функція | `src/scripts/core/06-wishes.js:54` |
| `WISH_KEY` | значення | `src/scripts/core/06-wishes.js:63` |
| `WISH_ACT_KEY` | значення | `src/scripts/core/06-wishes.js:64` |
| `wishes` | масив | `src/scripts/core/06-wishes.js:65` |
| `wishActiveDays` | обʼєкт | `src/scripts/core/06-wishes.js:66` |
| `loadWishes` | функція | `src/scripts/core/06-wishes.js:68` |
| `migrateWishPhotosOnce` | функція | `src/scripts/core/06-wishes.js:78` |
| `saveWishActiveDays` | функція | `src/scripts/core/06-wishes.js:94` |
| `saveWishes` | функція | `src/scripts/core/06-wishes.js:95` |
| `HOMEGLASS_KEY` | значення | `src/scripts/core/06-wishes.js:105` |
| `homeGlass` | значення | `src/scripts/core/06-wishes.js:106` |
| `loadHomeGlass` | функція | `src/scripts/core/06-wishes.js:108` |
| `saveHomeGlass` | функція | `src/scripts/core/06-wishes.js:109` |
| `applyHomeGlass` | функція | `src/scripts/core/06-wishes.js:110` |
| `WPRICE_KEY` | значення | `src/scripts/core/06-wishes.js:113` |
| `wishPrice` | значення | `src/scripts/core/06-wishes.js:114` |
| `loadWishPrice` | функція | `src/scripts/core/06-wishes.js:116` |
| `saveWishPrice` | функція | `src/scripts/core/06-wishes.js:117` |
| `wishPriceHTML` | функція | `src/scripts/core/06-wishes.js:118` |
| `bindWishPrice` | функція | `src/scripts/core/06-wishes.js:125` |
| `WISH_SLIDE_MS` | значення | `src/scripts/core/06-wishes.js:134` |
| `wishSlideTimer` | значення | `src/scripts/core/06-wishes.js:135` |
| `updateSummaryBg` | функція | `src/scripts/core/06-wishes.js:136` |
| `compressImage` | функція | `src/scripts/core/06-wishes.js:202` |
| `pickWishPhoto` | функція | `src/scripts/core/06-wishes.js:223` |
| `WISH_SIZES` | масив | `src/scripts/core/06-wishes.js:252` |
| `WISH_SIZE_LABEL` | обʼєкт | `src/scripts/core/06-wishes.js:253` |
| `cycleWishSize` | функція | `src/scripts/core/06-wishes.js:254` |
| `askWishCap` | функція | `src/scripts/core/06-wishes.js:260` |
| `openWishCard` | функція | `src/scripts/core/06-wishes.js:266` |
| `pickProofPhoto` | функція | `src/scripts/core/06-wishes.js:340` |
| `delWish` | функція | `src/scripts/core/06-wishes.js:347` |
| `parseVideo` | функція | `src/scripts/core/06-wishes.js:362` |
| `addWishVideo` | функція | `src/scripts/core/06-wishes.js:380` |
| `setWishCover` | функція | `src/scripts/core/06-wishes.js:405` |
| `openWishVideo` | функція | `src/scripts/core/06-wishes.js:422` |
| `openWishMenu` | функція | `src/scripts/core/06-wishes.js:431` |
| `moveWish` | функція | `src/scripts/core/06-wishes.js:470` |
| `wishToGoal` | функція | `src/scripts/core/06-wishes.js:477` |
| `RIT_KEY` | значення | `src/scripts/core/06-wishes.js:504` |
| `RIT` | обʼєкт | `src/scripts/core/06-wishes.js:505` |
| `loadRitual` | функція | `src/scripts/core/06-wishes.js:507` |
| `saveRitual` | функція | `src/scripts/core/06-wishes.js:509` |
| `__ritLoad` | значення | `src/scripts/core/06-wishes.js:510` |
| `ritualRerender` | функція | `src/scripts/core/06-wishes.js:512` |
| `goRitual` | функція | `src/scripts/core/06-wishes.js:514` |
| `ritDay` | функція | `src/scripts/core/06-wishes.js:536` |
| `ritDs` | функція | `src/scripts/core/06-wishes.js:537` |
| `ritStreak` | функція | `src/scripts/core/06-wishes.js:538` |
| `ytId` | функція | `src/scripts/core/06-wishes.js:552` |
| `fmtDur` | функція | `src/scripts/core/06-wishes.js:553` |
| `ritRec` | значення | `src/scripts/core/06-wishes.js:556` |
| `ritStopAll` | функція | `src/scripts/core/06-wishes.js:557` |
| `ritRecord` | функція | `src/scripts/core/06-wishes.js:559` |
| `ritPlay` | функція | `src/scripts/core/06-wishes.js:594` |
| `ritMixPlay` | функція | `src/scripts/core/06-wishes.js:595` |
| `ritFieldMic` | функція | `src/scripts/core/06-wishes.js:603` |
| `ritMixMenu` | функція | `src/scripts/core/06-wishes.js:613` |
| `ritAddLink` | функція | `src/scripts/core/06-wishes.js:621` |
| `ritLinkMenu` | функція | `src/scripts/core/06-wishes.js:631` |
| `RIT_J` | масив | `src/scripts/core/06-wishes.js:641` |
| `ritualInnerHTML` | функція | `src/scripts/core/06-wishes.js:644` |
| `ritualBind` | функція | `src/scripts/core/06-wishes.js:692` |
| `RPH_ICON` | значення | `src/scripts/core/06-wishes.js:737` |
| `ritPhotoCardHTML` | функція | `src/scripts/core/06-wishes.js:738` |
| `ritPhotoTap` | функція | `src/scripts/core/06-wishes.js:752` |
| `fetchWithTimeout` | функція | `src/scripts/core/06-wishes.js:763` |
| `ritSavePhoto` | функція | `src/scripts/core/06-wishes.js:769` |
| `ritPhotoMenu` | функція | `src/scripts/core/06-wishes.js:787` |
| `rmomTimer` | значення | `src/scripts/core/06-wishes.js:796` |
| `ritEnterMoment` | функція | `src/scripts/core/06-wishes.js:797` |
| `ritMixRecTap` | функція | `src/scripts/core/06-wishes.js:829` |
| `ritMixLongOrRec` | функція | `src/scripts/core/06-wishes.js:830` |
| `CLG_KEY` | значення | `src/scripts/core/06-wishes.js:838` |
| `collage` | масив | `src/scripts/core/06-wishes.js:839` |
| `loadCollage` | функція | `src/scripts/core/06-wishes.js:841` |
| `saveCollage` | функція | `src/scripts/core/06-wishes.js:843` |
| `goCollage` | функція | `src/scripts/core/06-wishes.js:846` |
| `clgPickPhotos` | функція | `src/scripts/core/06-wishes.js:849` |
| `clgImportWishes` | функція | `src/scripts/core/06-wishes.js:864` |
| `clgMenu` | функція | `src/scripts/core/06-wishes.js:875` |
| `renderCollage` | функція | `src/scripts/core/06-wishes.js:888` |
| `clgWrap` | функція | `src/scripts/core/06-wishes.js:945` |
| `clgWallpaper` | функція | `src/scripts/core/06-wishes.js:951` |
| `wdkShow` | значення | `src/scripts/core/06-wishes.js:1025` |
| `wishDateInfo` | функція | `src/scripts/core/06-wishes.js:1026` |
| `renderWishDeck` | функція | `src/scripts/core/06-wishes.js:1045` |
| `renderWishes` | функція | `src/scripts/core/06-wishes.js:1121` |

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

### `src/scripts/core/08-finance.js` — 99 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `envelopes` | масив | `src/scripts/core/08-finance.js:2` |
| `ENVKEY` | значення | `src/scripts/core/08-finance.js:3` |
| `saveEnvelopes` | функція | `src/scripts/core/08-finance.js:4` |
| `envMigrate` | функція | `src/scripts/core/08-finance.js:10` |
| `envSaved` | функція | `src/scripts/core/08-finance.js:18` |
| `envSpentOut` | функція | `src/scripts/core/08-finance.js:19` |
| `envTotalSaved` | функція | `src/scripts/core/08-finance.js:20` |
| `envAddOp` | функція | `src/scripts/core/08-finance.js:23` |
| `envDelOp` | функція | `src/scripts/core/08-finance.js:40` |
| `envSummary` | функція | `src/scripts/core/08-finance.js:48` |
| `finOps` | масив | `src/scripts/core/08-finance.js:51` |
| `FINOPKEY` | значення | `src/scripts/core/08-finance.js:52` |
| `saveFinOps` | функція | `src/scripts/core/08-finance.js:53` |
| `window.flowSearchFin` | функція | `src/scripts/core/08-finance.js:55` |
| `recurring` | масив | `src/scripts/core/08-finance.js:57` |
| `RECKEY` | значення | `src/scripts/core/08-finance.js:58` |
| `saveRecurring` | функція | `src/scripts/core/08-finance.js:59` |
| `WALLET_ID` | значення | `src/scripts/core/08-finance.js:69` |
| `cards` | масив | `src/scripts/core/08-finance.js:70` |
| `saveCards` | функція | `src/scripts/core/08-finance.js:71` |
| `walletCard` | функція | `src/scripts/core/08-finance.js:72` |
| `walletOps` | функція | `src/scripts/core/08-finance.js:75` |
| `walletBalance` | функція | `src/scripts/core/08-finance.js:76` |
| `mainCard` | функція | `src/scripts/core/08-finance.js:78` |
| `cardById` | функція | `src/scripts/core/08-finance.js:79` |
| `cardSym` | функція | `src/scripts/core/08-finance.js:80` |
| `cardBalance` | функція | `src/scripts/core/08-finance.js:81` |
| `incomeSummary` | функція | `src/scripts/core/08-finance.js:82` |
| `_projCardId` | функція | `src/scripts/core/08-finance.js:83` |
| `ensureCards` | функція | `src/scripts/core/08-finance.js:84` |
| `migRaw` | функція | `src/scripts/core/08-finance.js:112` |
| `migRates` | функція | `src/scripts/core/08-finance.js:121` |
| `migCurByCard` | функція | `src/scripts/core/08-finance.js:126` |
| `walletSumUAH` | функція | `src/scripts/core/08-finance.js:133` |
| `migrateToWallet` | функція | `src/scripts/core/08-finance.js:144` |
| `recDayOf` | функція | `src/scripts/core/08-finance.js:175` |
| `recAutoPost` | функція | `src/scripts/core/08-finance.js:176` |
| `nextRecurring` | функція | `src/scripts/core/08-finance.js:199` |
| `openNextSheet` | функція | `src/scripts/core/08-finance.js:208` |
| `workCardId` | значення | `src/scripts/core/08-finance.js:223` |
| `workCard` | функція | `src/scripts/core/08-finance.js:224` |
| `_isRealExpense` | функція | `src/scripts/core/08-finance.js:227` |
| `_isRealIncome` | функція | `src/scripts/core/08-finance.js:228` |
| `lastMonths` | функція | `src/scripts/core/08-finance.js:229` |
| `monthAgg` | функція | `src/scripts/core/08-finance.js:230` |
| `finTab` | значення | `src/scripts/core/08-finance.js:235` |
| `finView` | значення | `src/scripts/core/08-finance.js:236` |
| `finIncome` | функція | `src/scripts/core/08-finance.js:237` |
| `finExpense` | функція | `src/scripts/core/08-finance.js:238` |
| `finBalance` | функція | `src/scripts/core/08-finance.js:239` |
| `finEnvIcon` | функція | `src/scripts/core/08-finance.js:241` |
| `renderFinance` | функція | `src/scripts/core/08-finance.js:249` |
| `MON_UA` | масив | `src/scripts/core/08-finance.js:256` |
| `renderFinDash` | функція | `src/scripts/core/08-finance.js:262` |
| `bindFinDash` | функція | `src/scripts/core/08-finance.js:312` |
| `renderEnvScreen` | функція | `src/scripts/core/08-finance.js:340` |
| `addFinOp` | функція | `src/scripts/core/08-finance.js:384` |
| `addFinOpCard` | функція | `src/scripts/core/08-finance.js:388` |
| `newRecurring` | функція | `src/scripts/core/08-finance.js:399` |
| `newEnvelope` | функція | `src/scripts/core/08-finance.js:415` |
| `envOpenId` | значення | `src/scripts/core/08-finance.js:433` |
| `openEnvSheet` | функція | `src/scripts/core/08-finance.js:434` |
| `closeEnvSheet` | функція | `src/scripts/core/08-finance.js:439` |
| `projIncome` | функція | `src/scripts/core/08-finance.js:444` |
| `projExpense` | функція | `src/scripts/core/08-finance.js:445` |
| `projNet` | функція | `src/scripts/core/08-finance.js:446` |
| `projIsLocked` | функція | `src/scripts/core/08-finance.js:447` |
| `projDaysLeft` | функція | `src/scripts/core/08-finance.js:453` |
| `projectWidgetHtml` | функція | `src/scripts/core/08-finance.js:458` |
| `fmtDate` | функція | `src/scripts/core/08-finance.js:534` |
| `kanbanWidgetHtml` | функція | `src/scripts/core/08-finance.js:538` |
| `kbwFind` | функція | `src/scripts/core/08-finance.js:552` |
| `kbwAddCard` | функція | `src/scripts/core/08-finance.js:553` |
| `kbwCardMenu` | функція | `src/scripts/core/08-finance.js:563` |
| `kbwColMenu` | функція | `src/scripts/core/08-finance.js:580` |
| `CTW_COLORS` | масив | `src/scripts/core/08-finance.js:595` |
| `ctwInit` | функція | `src/scripts/core/08-finance.js:596` |
| `contactsWidgetHtml` | функція | `src/scripts/core/08-finance.js:601` |
| `ctwAdd` | функція | `src/scripts/core/08-finance.js:611` |
| `ctwOpenLink` | функція | `src/scripts/core/08-finance.js:621` |
| `ctwMenu` | функція | `src/scripts/core/08-finance.js:627` |
| `clwFmt` | функція | `src/scripts/core/08-finance.js:638` |
| `caselineWidgetHtml` | функція | `src/scripts/core/08-finance.js:643` |
| `clwAdd` | функція | `src/scripts/core/08-finance.js:651` |
| `clwMenu` | функція | `src/scripts/core/08-finance.js:661` |
| `fstwCountdown` | функція | `src/scripts/core/08-finance.js:670` |
| `fstwSpent` | функція | `src/scripts/core/08-finance.js:678` |
| `festivalWidgetHtml` | функція | `src/scripts/core/08-finance.js:679` |
| `fstwSpend` | функція | `src/scripts/core/08-finance.js:705` |
| `fstwOpsSheet` | функція | `src/scripts/core/08-finance.js:715` |
| `fstwSetup` | функція | `src/scripts/core/08-finance.js:723` |
| `projAddMovement` | функція | `src/scripts/core/08-finance.js:736` |
| `projAskExpense` | функція | `src/scripts/core/08-finance.js:761` |
| `projReceiveExpected` | функція | `src/scripts/core/08-finance.js:780` |
| `projSplitPreset` | функція | `src/scripts/core/08-finance.js:794` |
| `projDistributeToEnvelope` | функція | `src/scripts/core/08-finance.js:817` |
| `createEnvelopeFor` | функція | `src/scripts/core/08-finance.js:841` |
| `pickEnvelopeFor` | функція | `src/scripts/core/08-finance.js:858` |
| `renderEnvSheet` | функція | `src/scripts/core/08-finance.js:869` |

### `src/scripts/core/09-goals.js` — 23 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `goalsData` | обʼєкт | `src/scripts/core/09-goals.js:2` |
| `GKEY` | значення | `src/scripts/core/09-goals.js:4` |
| `saveGoals` | функція | `src/scripts/core/09-goals.js:5` |
| `AI_EP_KEY` | значення | `src/scripts/core/09-goals.js:9` |
| `AI_EP_DEFAULT` | значення | `src/scripts/core/09-goals.js:10` |
| `aiEndpoint` | функція | `src/scripts/core/09-goals.js:11` |
| `aiConfig` | функція | `src/scripts/core/09-goals.js:12` |
| `aiSheetClose` | функція | `src/scripts/core/09-goals.js:18` |
| `aiStartSheet` | функція | `src/scripts/core/09-goals.js:19` |
| `aiGenerate` | функція | `src/scripts/core/09-goals.js:50` |
| `aiLocalDraft` | функція | `src/scripts/core/09-goals.js:82` |
| `DOW_SHORT` | масив | `src/scripts/core/09-goals.js:106` |
| `aiPreview` | функція | `src/scripts/core/09-goals.js:107` |
| `aiApplyDraft` | функція | `src/scripts/core/09-goals.js:142` |
| `renderGoals` | функція | `src/scripts/core/09-goals.js:182` |
| `dgDateStr` | функція | `src/scripts/core/09-goals.js:247` |
| `dgWeekDates` | функція | `src/scripts/core/09-goals.js:248` |
| `dgListFor` | функція | `src/scripts/core/09-goals.js:251` |
| `dgSync` | функція | `src/scripts/core/09-goals.js:253` |
| `dayGoalsBlock` | функція | `src/scripts/core/09-goals.js:274` |
| `pickFolderForGoal` | функція | `src/scripts/core/09-goals.js:326` |
| `renderGoalsTab` | функція | `src/scripts/core/09-goals.js:365` |
| `currentWeekDates` | функція | `src/scripts/core/09-goals.js:602` |

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
| `plMaterializeRecurring` | функція | `src/scripts/core/10-planner.js:47` |
| `plBlocksFor` | функція | `src/scripts/core/10-planner.js:61` |
| `PL_MONTH_NAMES` | масив | `src/scripts/core/10-planner.js:65` |
| `plShiftCalMonth` | функція | `src/scripts/core/10-planner.js:66` |
| `plMonthWeeks` | функція | `src/scripts/core/10-planner.js:72` |
| `plGoalColorFor` | функція | `src/scripts/core/10-planner.js:84` |
| `plMonthCalHTML` | функція | `src/scripts/core/10-planner.js:91` |
| `plTemplateGoalMeta` | функція | `src/scripts/core/10-planner.js:169` |
| `plDowLabel` | функція | `src/scripts/core/10-planner.js:176` |
| `plTemplateListHTML` | функція | `src/scripts/core/10-planner.js:180` |
| `plToggleTemplate` | функція | `src/scripts/core/10-planner.js:200` |
| `plNewTemplateSheet` | функція | `src/scripts/core/10-planner.js:212` |
| `plHM` | функція | `src/scripts/core/10-planner.js:266` |
| `plHMtoDec` | функція | `src/scripts/core/10-planner.js:267` |
| `plDurLabel` | функція | `src/scripts/core/10-planner.js:268` |
| `PL_ICON_CORE` | обʼєкт | `src/scripts/core/10-planner.js:270` |
| `PL_ICONS` | обʼєкт | `src/scripts/core/10-planner.js:303` |
| `plIconStyle` | функція | `src/scripts/core/10-planner.js:311` |
| `plIco` | функція | `src/scripts/core/10-planner.js:313` |
| `plRing` | функція | `src/scripts/core/10-planner.js:320` |
| `goalPctP` | функція | `src/scripts/core/10-planner.js:329` |
| `renderPath` | функція | `src/scripts/core/10-planner.js:334` |
| `pathFlowHtml` | функція | `src/scripts/core/10-planner.js:359` |
| `brdRing` | функція | `src/scripts/core/10-planner.js:408` |
| `pathBridgeHtml` | функція | `src/scripts/core/10-planner.js:415` |
| `plRerender` | функція | `src/scripts/core/10-planner.js:442` |
| `renderPlanner` | функція | `src/scripts/core/10-planner.js:448` |
| `plFmtMMSS` | функція | `src/scripts/core/10-planner.js:673` |
| `plStartFocus` | функція | `src/scripts/core/10-planner.js:674` |
| `plNowIv` | значення | `src/scripts/core/10-planner.js:735` |
| `plFmtHMS` | функція | `src/scripts/core/10-planner.js:736` |
| `plNowInfo` | функція | `src/scripts/core/10-planner.js:738` |
| `plNowCardHTML` | функція | `src/scripts/core/10-planner.js:747` |
| `plNowTick` | функція | `src/scripts/core/10-planner.js:766` |
| `plNowLineHTML` | функція | `src/scripts/core/10-planner.js:779` |
| `plQuickAddHTML` | функція | `src/scripts/core/10-planner.js:781` |
| `plParseQuick` | функція | `src/scripts/core/10-planner.js:787` |
| `plWeekStats` | функція | `src/scripts/core/10-planner.js:813` |
| `plWeekReviewSheet` | функція | `src/scripts/core/10-planner.js:826` |
| `plWeekAI` | функція | `src/scripts/core/10-planner.js:879` |

### `src/scripts/core/11-ai-flow.js` — 14 сутностей

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
| `aiMoodBadge` | функція | `src/scripts/core/11-ai-flow.js:89` |
| `AI_CHAT_SYS` | значення | `src/scripts/core/11-ai-flow.js:95` |
| `aiCall` | функція | `src/scripts/core/11-ai-flow.js:130` |

### `src/scripts/core/12-ai-agent.js` — 68 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `AI_AGENT_KEY` | значення | `src/scripts/core/12-ai-agent.js:6` |
| `aiAgentOn` | функція | `src/scripts/core/12-ai-agent.js:7` |
| `aiAgentStatus` | значення | `src/scripts/core/12-ai-agent.js:8` |
| `aiAgentSetStatus` | функція | `src/scripts/core/12-ai-agent.js:9` |
| `aiDevOn` | функція | `src/scripts/core/12-ai-agent.js:20` |
| `aiDevToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:25` |
| `devContentTranslateToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:44` |
| `window.devContentTranslateToggleSheet` | значення | `src/scripts/core/12-ai-agent.js:61` |
| `AI_DEV_SYS` | значення | `src/scripts/core/12-ai-agent.js:62` |
| `aiDevCtx` | функція | `src/scripts/core/12-ai-agent.js:69` |
| `DEV_FEATURES` | масив | `src/scripts/core/12-ai-agent.js:82` |
| `aiDevHelpText` | функція | `src/scripts/core/12-ai-agent.js:93` |
| `aiDevConfirm` | функція | `src/scripts/core/12-ai-agent.js:100` |
| `devSnapshot` | функція | `src/scripts/core/12-ai-agent.js:120` |
| `DEV_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:126` |
| `devToolStorage` | функція | `src/scripts/core/12-ai-agent.js:151` |
| `devToolErrors` | функція | `src/scripts/core/12-ai-agent.js:190` |
| `devToolCost` | функція | `src/scripts/core/12-ai-agent.js:195` |
| `devToolSelftest` | функція | `src/scripts/core/12-ai-agent.js:214` |
| `devToolData` | функція | `src/scripts/core/12-ai-agent.js:244` |
| `devToolEval` | функція | `src/scripts/core/12-ai-agent.js:264` |
| `aiPageAsk` | функція | `src/scripts/core/12-ai-agent.js:280` |
| `aiMorningMaybe` | функція | `src/scripts/core/12-ai-agent.js:288` |
| `aiWeeklyMaybe` | функція | `src/scripts/core/12-ai-agent.js:300` |
| `aiAgentStatusFor` | функція | `src/scripts/core/12-ai-agent.js:312` |
| `aiTrace` | значення | `src/scripts/core/12-ai-agent.js:351` |
| `aiPlz` | функція | `src/scripts/core/12-ai-agent.js:352` |
| `AI_TRACE_READ` | обʼєкт | `src/scripts/core/12-ai-agent.js:356` |
| `aiTraceReadMeta` | функція | `src/scripts/core/12-ai-agent.js:363` |
| `aiTraceStart` | функція | `src/scripts/core/12-ai-agent.js:380` |
| `aiTraceStep` | функція | `src/scripts/core/12-ai-agent.js:381` |
| `aiTraceEnd` | функція | `src/scripts/core/12-ai-agent.js:398` |
| `aiTraceRepaint` | функція | `src/scripts/core/12-ai-agent.js:403` |
| `aiTraceFinish` | функція | `src/scripts/core/12-ai-agent.js:409` |
| `FLOW_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:419` |
| `AI_AGENT_ADDON` | значення | `src/scripts/core/12-ai-agent.js:495` |
| `flowToolExec` | функція | `src/scripts/core/12-ai-agent.js:511` |
| `flowToolRead` | функція | `src/scripts/core/12-ai-agent.js:538` |
| `aiRemindWhen` | функція | `src/scripts/core/12-ai-agent.js:628` |
| `flowToolPlanner` | функція | `src/scripts/core/12-ai-agent.js:635` |
| `flowToolGoals` | функція | `src/scripts/core/12-ai-agent.js:701` |
| `aiToolConfirm` | функція | `src/scripts/core/12-ai-agent.js:736` |
| `aiFinConfirm` | функція | `src/scripts/core/12-ai-agent.js:755` |
| `flowToolFinance` | функція | `src/scripts/core/12-ai-agent.js:758` |
| `flowToolDiary` | функція | `src/scripts/core/12-ai-agent.js:906` |
| `flowToolPatterns` | функція | `src/scripts/core/12-ai-agent.js:956` |
| `flowToolMemory` | функція | `src/scripts/core/12-ai-agent.js:977` |
| `flowToolFolders` | функція | `src/scripts/core/12-ai-agent.js:994` |
| `aiPickModel` | функція | `src/scripts/core/12-ai-agent.js:1047` |
| `aiUsageAdd` | функція | `src/scripts/core/12-ai-agent.js:1055` |
| `aiCallRaw` | функція | `src/scripts/core/12-ai-agent.js:1067` |
| `aiToolIsWrite` | функція | `src/scripts/core/12-ai-agent.js:1128` |
| `AI_WRITE_LIMIT` | значення | `src/scripts/core/12-ai-agent.js:1137` |
| `aiAgentTurn` | функція | `src/scripts/core/12-ai-agent.js:1138` |
| `aiFinMonthNet` | функція | `src/scripts/core/12-ai-agent.js:1183` |
| `aiFinCtx` | функція | `src/scripts/core/12-ai-agent.js:1191` |
| `aiCtx` | функція | `src/scripts/core/12-ai-agent.js:1211` |
| `aiFindGoal` | функція | `src/scripts/core/12-ai-agent.js:1250` |
| `aiParseBlocks` | функція | `src/scripts/core/12-ai-agent.js:1254` |
| `aiOpsCount` | функція | `src/scripts/core/12-ai-agent.js:1285` |
| `aiStreamText` | функція | `src/scripts/core/12-ai-agent.js:1290` |
| `aiFindBlockByT` | функція | `src/scripts/core/12-ai-agent.js:1295` |
| `aiFindFolderKey` | функція | `src/scripts/core/12-ai-agent.js:1301` |
| `aiBuildPageBlock` | функція | `src/scripts/core/12-ai-agent.js:1309` |
| `aiApplyPages` | функція | `src/scripts/core/12-ai-agent.js:1328` |
| `aiApplyActions` | функція | `src/scripts/core/12-ai-agent.js:1351` |
| `aiCommit` | функція | `src/scripts/core/12-ai-agent.js:1442` |
| `aiUndo` | функція | `src/scripts/core/12-ai-agent.js:1458` |

### `src/scripts/core/13-pets.js` — 13 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FLOW_PETS` | обʼєкт | `src/scripts/core/13-pets.js:2` |
| `petCur` | функція | `src/scripts/core/13-pets.js:34` |
| `petPersona` | функція | `src/scripts/core/13-pets.js:35` |
| `petSVG` | функція | `src/scripts/core/13-pets.js:36` |
| `petPickerSheet` | функція | `src/scripts/core/13-pets.js:77` |
| `petSleeping` | функція | `src/scripts/core/13-pets.js:146` |
| `petSleepSet` | функція | `src/scripts/core/13-pets.js:147` |
| `window.petWake` | функція | `src/scripts/core/13-pets.js:148` |
| `fcPos` | функція | `src/scripts/core/13-pets.js:149` |
| `fcClamp` | функція | `src/scripts/core/13-pets.js:150` |
| `fcApplyPos` | функція | `src/scripts/core/13-pets.js:155` |
| `fcBindDrag` | функція | `src/scripts/core/13-pets.js:161` |
| `fcBurst` | функція | `src/scripts/core/13-pets.js:199` |

### `src/scripts/core/14-react.js` — 41 сутностей

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
| `AI_HAM_ACTS` | масив | `src/scripts/core/14-react.js:122` |
| `aiHamAct` | функція | `src/scripts/core/14-react.js:130` |
| `aiHamNextAct` | функція | `src/scripts/core/14-react.js:134` |
| `aiHamCoreHTML` | функція | `src/scripts/core/14-react.js:140` |
| `aiHamSceneHTML` | функція | `src/scripts/core/14-react.js:152` |
| `aiHamRotT` | значення | `src/scripts/core/14-react.js:161` |
| `aiHamRotStart` | функція | `src/scripts/core/14-react.js:162` |
| `aiHamWakeFrom` | функція | `src/scripts/core/14-react.js:172` |
| `aiHamBind` | функція | `src/scripts/core/14-react.js:179` |
| `aiWakeInChat` | функція | `src/scripts/core/14-react.js:185` |
| `petSleepNow` | функція | `src/scripts/core/14-react.js:199` |
| `window.petSleepNow` | значення | `src/scripts/core/14-react.js:211` |
| `fcWakeNow` | функція | `src/scripts/core/14-react.js:212` |
| `window.petWake` | значення | `src/scripts/core/14-react.js:222` |
| `FC_SAY` | обʼєкт | `src/scripts/core/14-react.js:224` |
| `fcSayPick` | функція | `src/scripts/core/14-react.js:242` |
| `fcSayTimer` | значення | `src/scripts/core/14-react.js:255` |
| `fcSayHide` | функція | `src/scripts/core/14-react.js:256` |
| `fcSayShow` | функція | `src/scripts/core/14-react.js:257` |
| `fcSayStart` | функція | `src/scripts/core/14-react.js:289` |
| `flowCapRender` | функція | `src/scripts/core/14-react.js:294` |
| `fcCheckOverlap` | функція | `src/scripts/core/14-react.js:319` |
| `window.fcCheckOverlap` | значення | `src/scripts/core/14-react.js:339` |
| `t` | значення | `src/scripts/core/14-react.js:341` |
| `sched` | функція | `src/scripts/core/14-react.js:342` |

### `src/scripts/core/15-flow-spot.js` — 103 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `spotMsgs` | масив | `src/scripts/core/15-flow-spot.js:2` |
| `spotCtx` | функція | `src/scripts/core/15-flow-spot.js:3` |
| `spotChips` | функція | `src/scripts/core/15-flow-spot.js:17` |
| `spotAddon` | функція | `src/scripts/core/15-flow-spot.js:26` |
| `aiParsePage` | функція | `src/scripts/core/15-flow-spot.js:38` |
| `applyPageBlocks` | функція | `src/scripts/core/15-flow-spot.js:45` |
| `flowSpotEl` | функція | `src/scripts/core/15-flow-spot.js:71` |
| `flowSpotToggle` | функція | `src/scripts/core/15-flow-spot.js:93` |
| `flowSpotOpen` | функція | `src/scripts/core/15-flow-spot.js:94` |
| `flowSpotClose` | функція | `src/scripts/core/15-flow-spot.js:108` |
| `flowSpotSend` | функція | `src/scripts/core/15-flow-spot.js:109` |
| `spotMicToggle` | функція | `src/scripts/core/15-flow-spot.js:141` |
| `window.flowCapRender` | значення | `src/scripts/core/15-flow-spot.js:170` |
| `window.flowSpotOpen` | значення | `src/scripts/core/15-flow-spot.js:171` |
| `aiChatSheet` | функція | `src/scripts/core/15-flow-spot.js:174` |
| `aiClose` | функція | `src/scripts/core/15-flow-spot.js:207` |
| `aiDayPct` | функція | `src/scripts/core/15-flow-spot.js:214` |
| `aiVoiceOn` | значення | `src/scripts/core/15-flow-spot.js:221` |
| `aiSpeakStop` | функція | `src/scripts/core/15-flow-spot.js:223` |
| `aiSpeak` | функція | `src/scripts/core/15-flow-spot.js:224` |
| `aiVoiceToggle` | функція | `src/scripts/core/15-flow-spot.js:264` |
| `aiRenderHead` | функція | `src/scripts/core/15-flow-spot.js:271` |
| `aiMemSheet` | функція | `src/scripts/core/15-flow-spot.js:315` |
| `aiRenderViews` | функція | `src/scripts/core/15-flow-spot.js:337` |
| `aiPendingMsg` | функція | `src/scripts/core/15-flow-spot.js:342` |
| `aiLogHTML` | функція | `src/scripts/core/15-flow-spot.js:353` |
| `aiTlHTML` | функція | `src/scripts/core/15-flow-spot.js:360` |
| `aiActsHTML` | функція | `src/scripts/core/15-flow-spot.js:383` |
| `aiTraceLiveHTML` | функція | `src/scripts/core/15-flow-spot.js:423` |
| `aiTraceRowHTML` | функція | `src/scripts/core/15-flow-spot.js:429` |
| `AI_SHELF_GO` | обʼєкт | `src/scripts/core/15-flow-spot.js:434` |
| `aiShelfHTML` | функція | `src/scripts/core/15-flow-spot.js:435` |
| `aiTraceKpisHTML` | функція | `src/scripts/core/15-flow-spot.js:445` |
| `aiWireBody` | функція | `src/scripts/core/15-flow-spot.js:460` |
| `aiChipsHTML` | функція | `src/scripts/core/15-flow-spot.js:479` |
| `AI_SVG` | обʼєкт | `src/scripts/core/15-flow-spot.js:485` |
| `AI_ICO` | обʼєкт | `src/scripts/core/15-flow-spot.js:493` |
| `aiIco` | функція | `src/scripts/core/15-flow-spot.js:516` |
| `aiMD` | функція | `src/scripts/core/15-flow-spot.js:521` |
| `aiBusyHTML` | функція | `src/scripts/core/15-flow-spot.js:527` |
| `aiSlashHide` | функція | `src/scripts/core/15-flow-spot.js:535` |
| `aiSlashShow` | функція | `src/scripts/core/15-flow-spot.js:536` |
| `aiAttachRender` | функція | `src/scripts/core/15-flow-spot.js:551` |
| `aiImgShrink` | функція | `src/scripts/core/15-flow-spot.js:563` |
| `aiFileB64` | функція | `src/scripts/core/15-flow-spot.js:580` |
| `aiPickFile` | функція | `src/scripts/core/15-flow-spot.js:588` |
| `aiPlusSheet` | функція | `src/scripts/core/15-flow-spot.js:613` |
| `aiPromptsSheet` | функція | `src/scripts/core/15-flow-spot.js:633` |
| `aiPromptEdit` | функція | `src/scripts/core/15-flow-spot.js:652` |
| `aiEnvKpi` | функція | `src/scripts/core/15-flow-spot.js:669` |
| `aiPlanCardHTML` | функція | `src/scripts/core/15-flow-spot.js:677` |
| `aiRenderBody` | функція | `src/scripts/core/15-flow-spot.js:703` |
| `AI_SKILLS` | обʼєкт | `src/scripts/core/15-flow-spot.js:753` |
| `aiSkillFor` | функція | `src/scripts/core/15-flow-spot.js:765` |
| `aiSumBusy` | значення | `src/scripts/core/15-flow-spot.js:772` |
| `aiMaybeSummarize` | функція | `src/scripts/core/15-flow-spot.js:773` |
| `aiChatSend` | функція | `src/scripts/core/15-flow-spot.js:785` |
| `aiRec` | значення | `src/scripts/core/15-flow-spot.js:872` |
| `aiMicUI` | функція | `src/scripts/core/15-flow-spot.js:873` |
| `aiMicToggle` | функція | `src/scripts/core/15-flow-spot.js:874` |
| `aiTranscribeBlob` | функція | `src/scripts/core/15-flow-spot.js:912` |
| `aiTranscribe` | функція | `src/scripts/core/15-flow-spot.js:935` |
| `window.aiChatSheet` | значення | `src/scripts/core/15-flow-spot.js:939` |
| `plStreak` | функція | `src/scripts/core/15-flow-spot.js:941` |
| `plBestStreak` | функція | `src/scripts/core/15-flow-spot.js:950` |
| `plWeekDots` | функція | `src/scripts/core/15-flow-spot.js:964` |
| `heroMonthPct` | функція | `src/scripts/core/15-flow-spot.js:979` |
| `heroDayWord` | функція | `src/scripts/core/15-flow-spot.js:990` |
| `renderHeroStreak` | функція | `src/scripts/core/15-flow-spot.js:996` |
| `plRolloverHTML` | функція | `src/scripts/core/15-flow-spot.js:1010` |
| `plDaySummaryHTML` | функція | `src/scripts/core/15-flow-spot.js:1022` |
| `plAutoSuggestHTML` | функція | `src/scripts/core/15-flow-spot.js:1056` |
| `plQAnchorsHTML` | функція | `src/scripts/core/15-flow-spot.js:1098` |
| `plWeekCalHTML` | функція | `src/scripts/core/15-flow-spot.js:1123` |
| `plDayTitle` | функція | `src/scripts/core/15-flow-spot.js:1146` |
| `plBlocksDisplay` | функція | `src/scripts/core/15-flow-spot.js:1159` |
| `plFolderDayVal` | функція | `src/scripts/core/15-flow-spot.js:1172` |
| `plFolderMonthVal` | функція | `src/scripts/core/15-flow-spot.js:1177` |
| `plFolderComplete` | функція | `src/scripts/core/15-flow-spot.js:1186` |
| `DOW_UA` | масив | `src/scripts/core/15-flow-spot.js:1191` |
| `plRuleDowsLabel` | функція | `src/scripts/core/15-flow-spot.js:1192` |
| `plFolderDaySheet` | функція | `src/scripts/core/15-flow-spot.js:1201` |
| `plFolderMonthSheet` | функція | `src/scripts/core/15-flow-spot.js:1258` |
| `PL_MXQ` | масив | `src/scripts/core/15-flow-spot.js:1323` |
| `plMatrixHTML` | функція | `src/scripts/core/15-flow-spot.js:1324` |
| `plMxSchedule` | функція | `src/scripts/core/15-flow-spot.js:1343` |
| `plSlotTask` | функція | `src/scripts/core/15-flow-spot.js:1357` |
| `plBacklogHTML` | функція | `src/scripts/core/15-flow-spot.js:1371` |
| `plInboxHTML` | функція | `src/scripts/core/15-flow-spot.js:1386` |
| `plBlockEnd` | функція | `src/scripts/core/15-flow-spot.js:1401` |
| `plDayHTML` | функція | `src/scripts/core/15-flow-spot.js:1402` |
| `plTaskCard` | функція | `src/scripts/core/15-flow-spot.js:1611` |
| `plAdd` | функція | `src/scripts/core/15-flow-spot.js:1634` |
| `plAddBlockAt` | функція | `src/scripts/core/15-flow-spot.js:1661` |
| `plLinkTag` | функція | `src/scripts/core/15-flow-spot.js:1666` |
| `plScheduleStep` | функція | `src/scripts/core/15-flow-spot.js:1674` |
| `plMicroBlock` | функція | `src/scripts/core/15-flow-spot.js:1691` |
| `plCompleteBlock` | функція | `src/scripts/core/15-flow-spot.js:1704` |
| `plUncompleteEffects` | функція | `src/scripts/core/15-flow-spot.js:1759` |
| `plToast` | функція | `src/scripts/core/15-flow-spot.js:1775` |
| `plBlockSheet` | функція | `src/scripts/core/15-flow-spot.js:1783` |
| `plEditBlock` | функція | `src/scripts/core/15-flow-spot.js:2005` |
| `plRangeSheet` | функція | `src/scripts/core/15-flow-spot.js:2008` |

### `src/scripts/core/16-dashboard.js` — 21 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FV_ORDER` | масив | `src/scripts/core/16-dashboard.js:3` |
| `FV_NAME` | обʼєкт | `src/scripts/core/16-dashboard.js:4` |
| `homeFolderView` | значення | `src/scripts/core/16-dashboard.js:5` |
| `applyFolderViewIcon` | функція | `src/scripts/core/16-dashboard.js:10` |
| `setFolderView` | функція | `src/scripts/core/16-dashboard.js:14` |
| `R` | значення | `src/scripts/core/16-dashboard.js:24` |
| `moveOrderItem` | функція | `src/scripts/core/16-dashboard.js:27` |
| `enableFolderDrag` | функція | `src/scripts/core/16-dashboard.js:34` |
| `renderProjRail` | функція | `src/scripts/core/16-dashboard.js:144` |
| `renderDashboard` | функція | `src/scripts/core/16-dashboard.js:159` |
| `inputModal` | функція | `src/scripts/core/16-dashboard.js:248` |
| `createFolder` | функція | `src/scripts/core/16-dashboard.js:281` |
| `createProjectFolder` | функція | `src/scripts/core/16-dashboard.js:296` |
| `openPhotoCropEditor` | функція | `src/scripts/core/16-dashboard.js:323` |
| `openFolderMenu` | функція | `src/scripts/core/16-dashboard.js:386` |
| `closeFolderMenu` | функція | `src/scripts/core/16-dashboard.js:439` |
| `openFolderIconPicker` | функція | `src/scripts/core/16-dashboard.js:446` |
| `openFolderMovePicker` | функція | `src/scripts/core/16-dashboard.js:479` |
| `folderAction` | функція | `src/scripts/core/16-dashboard.js:495` |
| `cycleFolderColor` | функція | `src/scripts/core/16-dashboard.js:519` |
| `pickFolderPhoto` | функція | `src/scripts/core/16-dashboard.js:525` |

### `src/scripts/core/17-folder-render.js` — 8 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `folderView` | значення | `src/scripts/core/17-folder-render.js:2` |
| `currentFolderKey` | значення | `src/scripts/core/17-folder-render.js:3` |
| `renderFolder` | функція | `src/scripts/core/17-folder-render.js:8` |
| `openWidgetPicker` | функція | `src/scripts/core/17-folder-render.js:168` |
| `createCustomBoard` | функція | `src/scripts/core/17-folder-render.js:191` |
| `delCustomBoard` | функція | `src/scripts/core/17-folder-render.js:204` |
| `debtTotals` | функція | `src/scripts/core/17-folder-render.js:214` |
| `debtSummary` | функція | `src/scripts/core/17-folder-render.js:219` |

### `src/scripts/core/18-debts.js` — 20 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CUR` | обʼєкт | `src/scripts/core/18-debts.js:2` |
| `KEY` | значення | `src/scripts/core/18-debts.js:3` |
| `kind` | значення | `src/scripts/core/18-debts.js:4` |
| `save` | функція | `src/scripts/core/18-debts.js:12` |
| `fmt` | функція | `src/scripts/core/18-debts.js:15` |
| `initials` | функція | `src/scripts/core/18-debts.js:16` |
| `esc` | функція | `src/scripts/core/18-debts.js:17` |
| `sanitizeRich` | функція | `src/scripts/core/18-debts.js:19` |
| `safeImg` | функція | `src/scripts/core/18-debts.js:40` |
| `balance` | функція | `src/scripts/core/18-debts.js:52` |
| `del` | функція | `src/scripts/core/18-debts.js:65` |
| `render` | функція | `src/scripts/core/18-debts.js:67` |
| `toggleDebtSync` | функція | `src/scripts/core/18-debts.js:102` |
| `curId` | значення | `src/scripts/core/18-debts.js:127` |
| `openModal` | функція | `src/scripts/core/18-debts.js:128` |
| `closeModal` | функція | `src/scripts/core/18-debts.js:131` |
| `renderModal` | функція | `src/scripts/core/18-debts.js:134` |
| `askOp` | функція | `src/scripts/core/18-debts.js:160` |
| `commitOp` | функція | `src/scripts/core/18-debts.js:169` |
| `delOp` | функція | `src/scripts/core/18-debts.js:178` |

### `src/scripts/core/19-spending.js` — 15 сутностей

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
| `spendSummary` | функція | `src/scripts/core/19-spending.js:65` |
| `delSpend` | функція | `src/scripts/core/19-spending.js:77` |
| `renderSpend` | функція | `src/scripts/core/19-spending.js:79` |
| `exportSpend` | функція | `src/scripts/core/19-spending.js:125` |
| `clearSpend` | функція | `src/scripts/core/19-spending.js:134` |

### `src/scripts/core/20-work.js` — 55 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `workSessions` | масив | `src/scripts/core/20-work.js:2` |
| `workRate` | значення | `src/scripts/core/20-work.js:3` |
| `workCur` | значення | `src/scripts/core/20-work.js:4` |
| `workMonth` | функція | `src/scripts/core/20-work.js:5` |
| `workPayday` | значення | `src/scripts/core/20-work.js:6` |
| `WORKKEY` | значення | `src/scripts/core/20-work.js:7` |
| `saveWork` | функція | `src/scripts/core/20-work.js:8` |
| `workHoursTotal` | функція | `src/scripts/core/20-work.js:12` |
| `workEarnedTotal` | функція | `src/scripts/core/20-work.js:13` |
| `workSummary` | функція | `src/scripts/core/20-work.js:14` |
| `workHoursOn` | функція | `src/scripts/core/20-work.js:15` |
| `workSessionsIn` | функція | `src/scripts/core/20-work.js:16` |
| `WK_MONTHS` | масив | `src/scripts/core/20-work.js:18` |
| `renderWorkCal` | функція | `src/scripts/core/20-work.js:19` |
| `wkmDate` | значення | `src/scripts/core/20-work.js:49` |
| `workTapDay` | функція | `src/scripts/core/20-work.js:50` |
| `wkmHoursVal` | функція | `src/scripts/core/20-work.js:61` |
| `wkmRate` | функція | `src/scripts/core/20-work.js:62` |
| `wkmRenderChips` | функція | `src/scripts/core/20-work.js:63` |
| `wkmUpdateMoney` | функція | `src/scripts/core/20-work.js:71` |
| `wkmClose` | функція | `src/scripts/core/20-work.js:76` |
| `wkmSave` | функція | `src/scripts/core/20-work.js:77` |
| `workUpdatePreview` | функція | `src/scripts/core/20-work.js:114` |
| `ymOffset` | функція | `src/scripts/core/20-work.js:124` |
| `renderWorkMonthStrip` | функція | `src/scripts/core/20-work.js:130` |
| `renderWorkSalary` | функція | `src/scripts/core/20-work.js:146` |
| `pluralDaysWk` | функція | `src/scripts/core/20-work.js:181` |
| `workPostedSal` | обʼєкт | `src/scripts/core/20-work.js:184` |
| `workExtras` | масив | `src/scripts/core/20-work.js:185` |
| `WKEXTRAKEY` | значення | `src/scripts/core/20-work.js:186` |
| `wkBlocks` | обʼєкт | `src/scripts/core/20-work.js:188` |
| `WKBLKKEY` | значення | `src/scripts/core/20-work.js:189` |
| `saveWkBlocks` | функція | `src/scripts/core/20-work.js:190` |
| `applyWkBlocks` | функція | `src/scripts/core/20-work.js:191` |
| `saveExtras` | функція | `src/scripts/core/20-work.js:202` |
| `EXTRA_META` | обʼєкт | `src/scripts/core/20-work.js:203` |
| `extrasIn` | функція | `src/scripts/core/20-work.js:204` |
| `extrasNet` | функція | `src/scripts/core/20-work.js:205` |
| `extraKind` | значення | `src/scripts/core/20-work.js:206` |
| `addExtra` | функція | `src/scripts/core/20-work.js:207` |
| `extraSave` | функція | `src/scripts/core/20-work.js:222` |
| `delExtra` | функція | `src/scripts/core/20-work.js:238` |
| `renderExtras` | функція | `src/scripts/core/20-work.js:239` |
| `syncSalaryToFin` | функція | `src/scripts/core/20-work.js:258` |
| `transferPlannedToEnvelopes` | функція | `src/scripts/core/20-work.js:279` |
| `workPlannedTotal` | функція | `src/scripts/core/20-work.js:296` |
| `openAllocModal` | функція | `src/scripts/core/20-work.js:300` |
| `allocUpdateSummary` | функція | `src/scripts/core/20-work.js:323` |
| `allocSave` | функція | `src/scripts/core/20-work.js:334` |
| `renderWork` | функція | `src/scripts/core/20-work.js:351` |
| `workShiftMonth` | функція | `src/scripts/core/20-work.js:455` |
| `pushWorkToFin` | функція | `src/scripts/core/20-work.js:462` |
| `delWork` | функція | `src/scripts/core/20-work.js:476` |
| `clearWork` | функція | `src/scripts/core/20-work.js:486` |
| `clearWorkMonth` | функція | `src/scripts/core/20-work.js:493` |

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
| `diaMoodBusy` | значення | `src/scripts/core/22-diary.js:319` |
| `diaMoodBatch` | функція | `src/scripts/core/22-diary.js:320` |
| `DIA_BOOK_EMOJIS` | масив | `src/scripts/core/22-diary.js:351` |
| `DIA_BOOK_COLORS` | масив | `src/scripts/core/22-diary.js:352` |
| `diaNewEmoji` | значення | `src/scripts/core/22-diary.js:353` |
| `renderDiaBooks` | функція | `src/scripts/core/22-diary.js:354` |
| `renderDiaBook` | функція | `src/scripts/core/22-diary.js:379` |
| `diaRec` | значення | `src/scripts/core/22-diary.js:446` |
| `diaFmtDur` | функція | `src/scripts/core/22-diary.js:447` |
| `diaPlayAudio` | функція | `src/scripts/core/22-diary.js:448` |
| `diaRecord` | функція | `src/scripts/core/22-diary.js:449` |
| `window.diaRecord` | значення | `src/scripts/core/22-diary.js:480` |
| `diaBookRec` | значення | `src/scripts/core/22-diary.js:484` |
| `diaBookRecord` | функція | `src/scripts/core/22-diary.js:485` |

### `src/scripts/core/23-board.js` — 85 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `BKEY` | значення | `src/scripts/core/23-board.js:2` |
| `CBKEY` | значення | `src/scripts/core/23-board.js:3` |
| `BUILTIN_TABS` | масив | `src/scripts/core/23-board.js:5` |
| `customBoards` | масив | `src/scripts/core/23-board.js:13` |
| `allTabs` | функція | `src/scripts/core/23-board.js:15` |
| `tabByKey` | функція | `src/scripts/core/23-board.js:16` |
| `tabsForFolder` | функція | `src/scripts/core/23-board.js:18` |
| `BOARD_TABS` | значення | `src/scripts/core/23-board.js:19` |
| `boards` | обʼєкт | `src/scripts/core/23-board.js:20` |
| `boardKey` | значення | `src/scripts/core/23-board.js:21` |
| `viewMode` | значення | `src/scripts/core/23-board.js:22` |
| `folderPath` | масив | `src/scripts/core/23-board.js:23` |
| `currentLevelArr` | функція | `src/scripts/core/23-board.js:25` |
| `currentFolderObj` | функція | `src/scripts/core/23-board.js:34` |
| `VMKEY` | значення | `src/scripts/core/23-board.js:38` |
| `saveViewMode` | функція | `src/scripts/core/23-board.js:41` |
| `BWKEY` | значення | `src/scripts/core/23-board.js:44` |
| `WIDE_STEPS` | масив | `src/scripts/core/23-board.js:45` |
| `boardCols` | значення | `src/scripts/core/23-board.js:46` |
| `saveBoardCols` | функція | `src/scripts/core/23-board.js:49` |
| `CANVKEY` | значення | `src/scripts/core/23-board.js:52` |
| `canvasBoards` | обʼєкт | `src/scripts/core/23-board.js:53` |
| `saveCanvasBoards` | функція | `src/scripts/core/23-board.js:55` |
| `isCanvasMode` | функція | `src/scripts/core/23-board.js:56` |
| `toggleCanvasMode` | функція | `src/scripts/core/23-board.js:57` |
| `CZKEY` | значення | `src/scripts/core/23-board.js:67` |
| `canvasZoom` | обʼєкт | `src/scripts/core/23-board.js:68` |
| `saveCanvasZoom` | функція | `src/scripts/core/23-board.js:70` |
| `getZoom` | функція | `src/scripts/core/23-board.js:71` |
| `setZoom` | функція | `src/scripts/core/23-board.js:73` |
| `canvasSnap` | значення | `src/scripts/core/23-board.js:110` |
| `toggleSnap` | функція | `src/scripts/core/23-board.js:113` |
| `snapVal` | функція | `src/scripts/core/23-board.js:116` |
| `CANVAS_SKINS` | масив | `src/scripts/core/23-board.js:119` |
| `canvasSkin` | значення | `src/scripts/core/23-board.js:120` |
| `applyCanvasSkin` | функція | `src/scripts/core/23-board.js:123` |
| `cycleCanvasSkin` | функція | `src/scripts/core/23-board.js:127` |
| `fitAll` | функція | `src/scripts/core/23-board.js:143` |
| `zoomToBlock` | функція | `src/scripts/core/23-board.js:167` |
| `_mmHideT` | значення | `src/scripts/core/23-board.js:182` |
| `updateMinimap` | функція | `src/scripts/core/23-board.js:183` |
| `flashMinimap` | функція | `src/scripts/core/23-board.js:213` |
| `curBoard` | функція | `src/scripts/core/23-board.js:221` |
| `blocks` | масив | `src/scripts/core/23-board.js:222` |
| `syncBlocks` | функція | `src/scripts/core/23-board.js:223` |
| `resortPinned` | функція | `src/scripts/core/23-board.js:264` |
| `saveCustomBoards` | функція | `src/scripts/core/23-board.js:273` |
| `BOARD_COLORS` | масив | `src/scripts/core/23-board.js:276` |
| `BOARD_EMOJIS` | масив | `src/scripts/core/23-board.js:277` |
| `BLOCK_TYPES` | обʼєкт | `src/scripts/core/23-board.js:279` |
| `WIDGET_TYPES` | масив | `src/scripts/core/23-board.js:330` |
| `PROJECT_BLOCKS` | масив | `src/scripts/core/23-board.js:332` |
| `PROJECT_ONLY` | масив | `src/scripts/core/23-board.js:333` |
| `ICONS` | обʼєкт | `src/scripts/core/23-board.js:336` |
| `blockIcon` | функція | `src/scripts/core/23-board.js:376` |
| `blockUsage` | обʼєкт | `src/scripts/core/23-board.js:385` |
| `UKEY` | значення | `src/scripts/core/23-board.js:386` |
| `saveUsage` | функція | `src/scripts/core/23-board.js:387` |
| `addTab` | значення | `src/scripts/core/23-board.js:389` |
| `addSheetStyle` | значення | `src/scripts/core/23-board.js:392` |
| `autoFocusNewBlock` | значення | `src/scripts/core/23-board.js:396` |
| `blockSearchText` | функція | `src/scripts/core/23-board.js:400` |
| `collectBlocks` | функція | `src/scripts/core/23-board.js:416` |
| `escRe` | функція | `src/scripts/core/23-board.js:423` |
| `hiliteText` | функція | `src/scripts/core/23-board.js:424` |
| `pathLabel` | функція | `src/scripts/core/23-board.js:431` |
| `runSearch` | функція | `src/scripts/core/23-board.js:436` |
| `pathToBlock` | функція | `src/scripts/core/23-board.js:481` |
| `jumpToBlock` | функція | `src/scripts/core/23-board.js:491` |
| `window.flowSearchBoards` | функція | `src/scripts/core/23-board.js:517` |
| `window.flowOpenBlock` | функція | `src/scripts/core/23-board.js:533` |
| `openSearch` | функція | `src/scripts/core/23-board.js:540` |
| `closeSearch` | функція | `src/scripts/core/23-board.js:548` |
| `srchDelegate` | функція | `src/scripts/core/23-board.js:550` |
| `undoSnapshot` | значення | `src/scripts/core/23-board.js:574` |
| `snapshotForUndo` | функція | `src/scripts/core/23-board.js:575` |
| `hideUndo` | функція | `src/scripts/core/23-board.js:585` |
| `doUndo` | функція | `src/scripts/core/23-board.js:586` |
| `INBOX_TITLE` | значення | `src/scripts/core/23-board.js:600` |
| `ensureInboxFolder` | функція | `src/scripts/core/23-board.js:601` |
| `openQuickCapture` | функція | `src/scripts/core/23-board.js:611` |
| `closeQuickCapture` | функція | `src/scripts/core/23-board.js:617` |
| `saveQuickCapture` | функція | `src/scripts/core/23-board.js:618` |
| `window.flowQuickCapture` | значення | `src/scripts/core/23-board.js:646` |
| `window.flowOpenInbox` | функція | `src/scripts/core/23-board.js:648` |

### `src/scripts/core/24-reminders.js` — 35 сутностей

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
| `buildAddSheet` | функція | `src/scripts/core/24-reminders.js:139` |
| `openFullAddSheet` | функція | `src/scripts/core/24-reminders.js:283` |
| `toggleFabRadial` | функція | `src/scripts/core/24-reminders.js:289` |
| `dock` | значення | `src/scripts/core/24-reminders.js:321` |
| `plus` | значення | `src/scripts/core/24-reminders.js:334` |
| `h` | значення | `src/scripts/core/24-reminders.js:335` |
| `clr` | функція | `src/scripts/core/24-reminders.js:337` |
| `VIEW_ORDER` | масив | `src/scripts/core/24-reminders.js:355` |
| `_vsvg` | функція | `src/scripts/core/24-reminders.js:356` |
| `VIEW_ICON` | обʼєкт | `src/scripts/core/24-reminders.js:357` |
| `VIEW_NAME` | обʼєкт | `src/scripts/core/24-reminders.js:362` |
| `applyViewIcon` | функція | `src/scripts/core/24-reminders.js:363` |
| `applyWideIcon` | функція | `src/scripts/core/24-reminders.js:374` |
| `wideBtn` | значення | `src/scripts/core/24-reminders.js:383` |
| `canvasBtn` | значення | `src/scripts/core/24-reminders.js:394` |
| `saveBoard` | функція | `src/scripts/core/24-reminders.js:397` |
| `buildBlock` | функція | `src/scripts/core/24-reminders.js:402` |
| `addBlock` | функція | `src/scripts/core/24-reminders.js:455` |
| `addTargetGroup` | значення | `src/scripts/core/24-reminders.js:623` |
| `bentoTarget` | значення | `src/scripts/core/24-reminders.js:624` |
| `BENTO_SEC_TYPES` | обʼєкт | `src/scripts/core/24-reminders.js:626` |

### `src/scripts/core/25-reader.js` — 35 сутностей

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
| `pdfPages` | масив | `src/scripts/core/25-reader.js:98` |
| `rdrChapters` | масив | `src/scripts/core/25-reader.js:99` |
| `rdrRestoreTo` | значення | `src/scripts/core/25-reader.js:100` |
| `setRdrLoading` | функція | `src/scripts/core/25-reader.js:102` |
| `openReader` | функція | `src/scripts/core/25-reader.js:108` |
| `renderTextBook` | функція | `src/scripts/core/25-reader.js:142` |
| `mdToHtml` | функція | `src/scripts/core/25-reader.js:161` |
| `inlineMd` | функція | `src/scripts/core/25-reader.js:180` |
| `renderEpub` | функція | `src/scripts/core/25-reader.js:189` |
| `readZipText` | функція | `src/scripts/core/25-reader.js:229` |
| `normalizeZipPath` | функція | `src/scripts/core/25-reader.js:230` |
| `stripEpubHtml` | функція | `src/scripts/core/25-reader.js:231` |
| `embedEpubImages` | функція | `src/scripts/core/25-reader.js:237` |
| `renderPdf` | функція | `src/scripts/core/25-reader.js:255` |
| `repaintPdfZoom` | функція | `src/scripts/core/25-reader.js:297` |
| `buildToc` | функція | `src/scripts/core/25-reader.js:317` |
| `scrollFraction` | функція | `src/scripts/core/25-reader.js:329` |
| `restoreScroll` | функція | `src/scripts/core/25-reader.js:334` |
| `rdrSaveTimer` | значення | `src/scripts/core/25-reader.js:340` |
| `rdrTotalWords` | значення | `src/scripts/core/25-reader.js:341` |
| `RDR_WPM` | значення | `src/scripts/core/25-reader.js:342` |
| `updateRdrProgressUI` | функція | `src/scripts/core/25-reader.js:343` |
| `initReader` | функція | `src/scripts/core/25-reader.js:382` |
| `openBmSheet` | функція | `src/scripts/core/25-reader.js:449` |
| `renderMarks` | функція | `src/scripts/core/25-reader.js:467` |
| `addBookmark` | функція | `src/scripts/core/25-reader.js:487` |

### `src/scripts/core/26-blocks-render.js` — 25 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `pickPhoto` | функція | `src/scripts/core/26-blocks-render.js:1` |
| `isContainer` | функція | `src/scripts/core/26-blocks-render.js:28` |
| `findBlockDeep` | функція | `src/scripts/core/26-blocks-render.js:29` |
| `findParentArr` | функція | `src/scripts/core/26-blocks-render.js:39` |
| `delBlock` | функція | `src/scripts/core/26-blocks-render.js:48` |
| `getBlock` | функція | `src/scripts/core/26-blocks-render.js:60` |
| `renderBoardTabs` | функція | `src/scripts/core/26-blocks-render.js:62` |
| `SD_GRADS` | масив | `src/scripts/core/26-blocks-render.js:75` |
| `sdCovers` | функція | `src/scripts/core/26-blocks-render.js:81` |
| `sdSaveCovers` | функція | `src/scripts/core/26-blocks-render.js:82` |
| `sdDashOpen` | функція | `src/scripts/core/26-blocks-render.js:86` |
| `sdStats` | функція | `src/scripts/core/26-blocks-render.js:87` |
| `spaceDashHTML` | функція | `src/scripts/core/26-blocks-render.js:105` |
| `board` | значення | `src/scripts/core/26-blocks-render.js:143` |
| `renderBoard` | функція | `src/scripts/core/26-blocks-render.js:175` |
| `defaultSize` | функція | `src/scripts/core/26-blocks-render.js:281` |
| `autoSize` | функція | `src/scripts/core/26-blocks-render.js:287` |
| `szClass` | функція | `src/scripts/core/26-blocks-render.js:301` |
| `headBar` | функція | `src/scripts/core/26-blocks-render.js:307` |
| `BENTO_SKIP` | обʼєкт | `src/scripts/core/26-blocks-render.js:330` |
| `renderTileFull` | функція | `src/scripts/core/26-blocks-render.js:332` |
| `bentoSectionsHtml` | функція | `src/scripts/core/26-blocks-render.js:353` |
| `renderTile` | функція | `src/scripts/core/26-blocks-render.js:383` |
| `focusItem` | функція | `src/scripts/core/26-blocks-render.js:1053` |
| `bindTiles` | функція | `src/scripts/core/26-blocks-render.js:1062` |

### `src/scripts/core/27-canvas.js` — 27 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `enableCanvasZoom` | функція | `src/scripts/core/27-canvas.js:2` |
| `canvasRect` | функція | `src/scripts/core/27-canvas.js:114` |
| `openCanvasRadial` | функція | `src/scripts/core/27-canvas.js:121` |
| `clearAlignGuides` | функція | `src/scripts/core/27-canvas.js:150` |
| `showAlignGuides` | функція | `src/scripts/core/27-canvas.js:151` |
| `rectsOverlap` | функція | `src/scripts/core/27-canvas.js:173` |
| `resolveCanvasCollision` | функція | `src/scripts/core/27-canvas.js:182` |
| `applyFreeSizes` | функція | `src/scripts/core/27-canvas.js:217` |
| `openCardStyle` | функція | `src/scripts/core/27-canvas.js:341` |
| `enableTileResize` | функція | `src/scripts/core/27-canvas.js:364` |
| `enableTileDrag` | функція | `src/scripts/core/27-canvas.js:479` |
| `escAttr` | функція | `src/scripts/core/27-canvas.js:740` |
| `migrate` | функція | `src/scripts/core/27-canvas.js:743` |
| `normalizeBlocks` | функція | `src/scripts/core/27-canvas.js:749` |
| `agencyPurgeOnce` | функція | `src/scripts/core/27-canvas.js:782` |
| `applyFolderCfgRaw` | функція | `src/scripts/core/27-canvas.js:820` |
| `applyFolderOrderRaw` | функція | `src/scripts/core/27-canvas.js:834` |
| `load` | функція | `src/scripts/core/27-canvas.js:838` |
| `vv` | значення | `src/scripts/core/27-canvas.js:1047` |
| `FIELD` | значення | `src/scripts/core/27-canvas.js:1048` |
| `isField` | функція | `src/scripts/core/27-canvas.js:1050` |
| `kbHeight` | функція | `src/scripts/core/27-canvas.js:1053` |
| `syncKb` | функція | `src/scripts/core/27-canvas.js:1057` |
| `ensureVisible` | функція | `src/scripts/core/27-canvas.js:1064` |
| `VISION_FKEY` | значення | `src/scripts/core/27-canvas.js:1100` |
| `migrateFolderPhotosOnce` | функція | `src/scripts/core/27-canvas.js:1107` |
| `removeSystemSeedFoldersOnce` | функція | `src/scripts/core/27-canvas.js:1124` |

### `src/scripts/core/28-vision.js` — 43 сутностей

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
| `vzEditWhy` | функція | `src/scripts/core/28-vision.js:86` |
| `vzEditFocus` | функція | `src/scripts/core/28-vision.js:90` |
| `vzAddStep` | функція | `src/scripts/core/28-vision.js:105` |
| `vzStepMenu` | функція | `src/scripts/core/28-vision.js:115` |
| `vzPickFolder` | функція | `src/scripts/core/28-vision.js:133` |
| `VZ_GOAL_COLORS` | масив | `src/scripts/core/28-vision.js:141` |
| `vzAfterGoalCreated` | функція | `src/scripts/core/28-vision.js:142` |
| `vzStepToGoal` | функція | `src/scripts/core/28-vision.js:147` |
| `vzPlanToGoal` | функція | `src/scripts/core/28-vision.js:154` |
| `VZ_TERMS` | масив | `src/scripts/core/28-vision.js:164` |
| `VZ_TERM_LABEL` | обʼєкт | `src/scripts/core/28-vision.js:165` |
| `vzAddPlan` | функція | `src/scripts/core/28-vision.js:166` |
| `vzPlanAddItem` | функція | `src/scripts/core/28-vision.js:173` |
| `vzPlanMenu` | функція | `src/scripts/core/28-vision.js:180` |
| `vzAddFolderLink` | функція | `src/scripts/core/28-vision.js:197` |
| `vzFolderChipMenu` | функція | `src/scripts/core/28-vision.js:205` |
| `vzRzToday` | функція | `src/scripts/core/28-vision.js:214` |
| `vzRzDayFull` | функція | `src/scripts/core/28-vision.js:215` |
| `vzRzToggle` | функція | `src/scripts/core/28-vision.js:217` |
| `vzRzMenu` | функція | `src/scripts/core/28-vision.js:224` |
| `vzKtStats` | функція | `src/scripts/core/28-vision.js:243` |
| `vzKtAnswer` | функція | `src/scripts/core/28-vision.js:250` |
| `vzKtMenu` | функція | `src/scripts/core/28-vision.js:254` |
| `vzFocus` | обʼєкт | `src/scripts/core/28-vision.js:273` |
| `vzQueue` | функція | `src/scripts/core/28-vision.js:274` |
| `vzFocusStop` | функція | `src/scripts/core/28-vision.js:284` |
| `vzFocusDone` | функція | `src/scripts/core/28-vision.js:285` |
| `renderVisionFocus` | функція | `src/scripts/core/28-vision.js:295` |
| `renderVision` | функція | `src/scripts/core/28-vision.js:335` |
| `goVision` | функція | `src/scripts/core/28-vision.js:530` |
| `window.goVision` | значення | `src/scripts/core/28-vision.js:531` |

### `src/scripts/core/29-more-screen.js` — 22 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MAIN` | масив | `src/scripts/core/29-more-screen.js:3` |
| `MORE` | масив | `src/scripts/core/29-more-screen.js:9` |
| `INFO` | обʼєкт | `src/scripts/core/29-more-screen.js:15` |
| `tileHTML` | функція | `src/scripts/core/29-more-screen.js:25` |
| `rowHTML` | функція | `src/scripts/core/29-more-screen.js:32` |
| `renderMore` | функція | `src/scripts/core/29-more-screen.js:41` |
| `openMoreSheet` | функція | `src/scripts/core/29-more-screen.js:69` |
| `goMore` | функція | `src/scripts/core/29-more-screen.js:88` |
| `window.goMore` | значення | `src/scripts/core/29-more-screen.js:89` |
| `escA` | функція | `src/scripts/core/29-more-screen.js:92` |
| `safeImgA` | функція | `src/scripts/core/29-more-screen.js:93` |
| `readAvatarFile` | функція | `src/scripts/core/29-more-screen.js:95` |
| `syncLabel` | функція | `src/scripts/core/29-more-screen.js:116` |
| `ALL_KEYS` | функція | `src/scripts/core/29-more-screen.js:129` |
| `flowStorageInfo` | функція | `src/scripts/core/29-more-screen.js:135` |
| `fmtMem` | функція | `src/scripts/core/29-more-screen.js:144` |
| `fillMemRow` | функція | `src/scripts/core/29-more-screen.js:145` |
| `renderAccount` | функція | `src/scripts/core/29-more-screen.js:160` |
| `window.renderAccount` | значення | `src/scripts/core/29-more-screen.js:367` |
| `hm` | значення | `src/scripts/core/29-more-screen.js:377` |
| `na` | функція | `src/scripts/core/29-more-screen.js:378` |
| `nm` | значення | `src/scripts/core/29-more-screen.js:379` |

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
| `upBuildPrompt` | функція | `src/scripts/core/30-upgrade.js:175` |
| `upParseVerdict` | функція | `src/scripts/core/30-upgrade.js:195` |
| `upSheet` | функція | `src/scripts/core/30-upgrade.js:211` |
| `upApplyVerdict` | функція | `src/scripts/core/30-upgrade.js:225` |
| `upAnalyze` | функція | `src/scripts/core/30-upgrade.js:239` |
| `goUpgrade` | функція | `src/scripts/core/30-upgrade.js:279` |
| `window.goUpgrade` | значення | `src/scripts/core/30-upgrade.js:288` |

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
| `hitHTML` | функція | `src/scripts/core/32-global-search.js:58` |
| `render` | функція | `src/scripts/core/32-global-search.js:68` |
| `open` | функція | `src/scripts/core/32-global-search.js:124` |
| `close` | функція | `src/scripts/core/32-global-search.js:131` |
| `window.flowGlobalSearch` | значення | `src/scripts/core/32-global-search.js:132` |
| `hb` | значення | `src/scripts/core/32-global-search.js:142` |

### `src/scripts/core/33-home-widgets.js` — 8 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `hwEsc` | функція | `src/scripts/core/33-home-widgets.js:6` |
| `hwFmt` | функція | `src/scripts/core/33-home-widgets.js:7` |
| `hwHour` | функція | `src/scripts/core/33-home-widgets.js:8` |
| `nextBlocks` | функція | `src/scripts/core/33-home-widgets.js:11` |
| `diaryStreak` | функція | `src/scripts/core/33-home-widgets.js:20` |
| `cardHTML` | функція | `src/scripts/core/33-home-widgets.js:30` |
| `render` | функція | `src/scripts/core/33-home-widgets.js:32` |
| `window.renderHomeWidgets` | значення | `src/scripts/core/33-home-widgets.js:68` |

### `src/scripts/core/34-shortcuts.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MAP` | обʼєкт | `src/scripts/core/34-shortcuts.js:6` |
| `typing` | функція | `src/scripts/core/34-shortcuts.js:14` |
| `ks` | значення | `src/scripts/core/34-shortcuts.js:19` |
| `sheetHTML` | функція | `src/scripts/core/34-shortcuts.js:20` |
| `sheetToggle` | функція | `src/scripts/core/34-shortcuts.js:32` |

### `src/scripts/page-editor/01-palette.js` — 18 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PGS_CATS` | масив | `src/scripts/page-editor/01-palette.js:5` |
| `CATALOG` | масив | `src/scripts/page-editor/01-palette.js:12` |
| `PGS_SYN` | обʼєкт | `src/scripts/page-editor/01-palette.js:47` |
| `PGS_ICONS` | обʼєкт | `src/scripts/page-editor/01-palette.js:76` |
| `pgsIc` | функція | `src/scripts/page-editor/01-palette.js:130` |
| `pgsDemo` | функція | `src/scripts/page-editor/01-palette.js:131` |
| `bridge` | функція | `src/scripts/page-editor/01-palette.js:159` |
| `editor` | значення | `src/scripts/page-editor/01-palette.js:160` |
| `scr` | значення | `src/scripts/page-editor/01-palette.js:161` |
| `uid` | функція | `src/scripts/page-editor/01-palette.js:162` |
| `esc` | функція | `src/scripts/page-editor/01-palette.js:163` |
| `txtOf` | функція | `src/scripts/page-editor/01-palette.js:166` |
| `setTxt` | функція | `src/scripts/page-editor/01-palette.js:167` |
| `locate` | функція | `src/scripts/page-editor/01-palette.js:169` |
| `save` | функція | `src/scripts/page-editor/01-palette.js:177` |
| `moveBlock` | функція | `src/scripts/page-editor/01-palette.js:181` |
| `snapshotArr` | функція | `src/scripts/page-editor/01-palette.js:203` |
| `restoreArr` | функція | `src/scripts/page-editor/01-palette.js:204` |

### `src/scripts/page-editor/02-block-styles.js` — 47 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `equalizeWidths` | функція | `src/scripts/page-editor/02-block-styles.js:1` |
| `PGH_FONTS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:4` |
| `headingStyle` | функція | `src/scripts/page-editor/02-block-styles.js:5` |
| `pgShowHidden` | значення | `src/scripts/page-editor/02-block-styles.js:16` |
| `pbarAutoValue` | функція | `src/scripts/page-editor/02-block-styles.js:17` |
| `condMet` | функція | `src/scripts/page-editor/02-block-styles.js:22` |
| `moveBlockSide` | функція | `src/scripts/page-editor/02-block-styles.js:47` |
| `undoMove` | функція | `src/scripts/page-editor/02-block-styles.js:82` |
| `redoMove` | функція | `src/scripts/page-editor/02-block-styles.js:87` |
| `undoStack` | масив | `src/scripts/page-editor/02-block-styles.js:94` |
| `pushOp` | функція | `src/scripts/page-editor/02-block-styles.js:95` |
| `doUndo` | функція | `src/scripts/page-editor/02-block-styles.js:100` |
| `doRedo` | функція | `src/scripts/page-editor/02-block-styles.js:101` |
| `syncUndoBtn` | функція | `src/scripts/page-editor/02-block-styles.js:102` |
| `STATUS_COLORS` | обʼєкт | `src/scripts/page-editor/02-block-styles.js:112` |
| `STATUS_ORDER` | масив | `src/scripts/page-editor/02-block-styles.js:113` |
| `dbColType` | функція | `src/scripts/page-editor/02-block-styles.js:114` |
| `dbFmtNum` | функція | `src/scripts/page-editor/02-block-styles.js:115` |
| `inner` | функція | `src/scripts/page-editor/02-block-styles.js:117` |
| `dbEnsure` | функція | `src/scripts/page-editor/02-block-styles.js:438` |
| `dbHTML` | функція | `src/scripts/page-editor/02-block-styles.js:455` |
| `pgSgBusy` | значення | `src/scripts/page-editor/02-block-styles.js:505` |
| `pgSgPlace` | функція | `src/scripts/page-editor/02-block-styles.js:506` |
| `PGLAST` | значення | `src/scripts/page-editor/02-block-styles.js:514` |
| `pgLastGet` | функція | `src/scripts/page-editor/02-block-styles.js:515` |
| `pgLastSet` | функція | `src/scripts/page-editor/02-block-styles.js:516` |
| `PGRECENT` | значення | `src/scripts/page-editor/02-block-styles.js:518` |
| `pgRecentGet` | функція | `src/scripts/page-editor/02-block-styles.js:519` |
| `pgRecentAdd` | функція | `src/scripts/page-editor/02-block-styles.js:520` |
| `renderList` | функція | `src/scripts/page-editor/02-block-styles.js:521` |
| `renderBoardBlock` | функція | `src/scripts/page-editor/02-block-styles.js:540` |
| `renderRowBlock` | функція | `src/scripts/page-editor/02-block-styles.js:559` |
| `renumber` | функція | `src/scripts/page-editor/02-block-styles.js:576` |
| `pgPath` | масив | `src/scripts/page-editor/02-block-styles.js:578` |
| `pgResolve` | функція | `src/scripts/page-editor/02-block-styles.js:579` |
| `pgHeaStrip` | функція | `src/scripts/page-editor/02-block-styles.js:589` |
| `render` | функція | `src/scripts/page-editor/02-block-styles.js:625` |
| `fillWidgetHosts` | функція | `src/scripts/page-editor/02-block-styles.js:683` |
| `window.__pgWidgetsSync` | функція | `src/scripts/page-editor/02-block-styles.js:694` |
| `caretEnd` | функція | `src/scripts/page-editor/02-block-styles.js:700` |
| `slashCtx` | значення | `src/scripts/page-editor/02-block-styles.js:703` |
| `slash` | значення | `src/scripts/page-editor/02-block-styles.js:796` |
| `srail` | значення | `src/scripts/page-editor/02-block-styles.js:798` |
| `pgsCat` | значення | `src/scripts/page-editor/02-block-styles.js:799` |
| `pgsFiltered` | функція | `src/scripts/page-editor/02-block-styles.js:800` |
| `buildRail` | функція | `src/scripts/page-editor/02-block-styles.js:810` |
| `buildSlash` | функція | `src/scripts/page-editor/02-block-styles.js:819` |

### `src/scripts/page-editor/03-premium-pack.js` — 27 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `pgAsk` | функція | `src/scripts/page-editor/03-premium-pack.js:15` |
| `openCondSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:30` |
| `openHeadingStyleSheet` | функція | `src/scripts/page-editor/03-premium-pack.js:83` |
| `positionSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:154` |
| `openSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:177` |
| `closeSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:183` |
| `applySlash` | функція | `src/scripts/page-editor/03-premium-pack.js:185` |
| `drag` | значення | `src/scripts/page-editor/03-premium-pack.js:320` |
| `dstart` | функція | `src/scripts/page-editor/03-premium-pack.js:323` |
| `ghostMake` | функція | `src/scripts/page-editor/03-premium-pack.js:333` |
| `ghostMove` | функція | `src/scripts/page-editor/03-premium-pack.js:342` |
| `ghostKill` | функція | `src/scripts/page-editor/03-premium-pack.js:343` |
| `clearMarks` | функція | `src/scripts/page-editor/03-premium-pack.js:344` |
| `dmove` | функція | `src/scripts/page-editor/03-premium-pack.js:345` |
| `dend` | функція | `src/scripts/page-editor/03-premium-pack.js:367` |
| `cancelDrag` | функція | `src/scripts/page-editor/03-premium-pack.js:379` |
| `bmenu` | значення | `src/scripts/page-editor/03-premium-pack.js:458` |
| `openBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:459` |
| `closeBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:493` |
| `THKEY` | значення | `src/scripts/page-editor/03-premium-pack.js:535` |
| `applyTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:536` |
| `savedTheme` | значення | `src/scripts/page-editor/03-premium-pack.js:547` |
| `pgTitle` | значення | `src/scripts/page-editor/03-premium-pack.js:550` |
| `addBtn` | значення | `src/scripts/page-editor/03-premium-pack.js:560` |
| `CD_MONTHS` | масив | `src/scripts/page-editor/03-premium-pack.js:569` |
| `cdFmt` | функція | `src/scripts/page-editor/03-premium-pack.js:570` |
| `cdHTML` | функція | `src/scripts/page-editor/03-premium-pack.js:575` |

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

### `src/scripts/page-editor/08-w-projects-hub.js` — 41 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `phOpen` | обʼєкт | `src/scripts/page-editor/08-w-projects-hub.js:2` |
| `PH_COLORS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:3` |
| `phHTML` | функція | `src/scripts/page-editor/08-w-projects-hub.js:4` |
| `phExport` | функція | `src/scripts/page-editor/08-w-projects-hub.js:83` |
| `pgFileIc` | функція | `src/scripts/page-editor/08-w-projects-hub.js:101` |
| `currentPtKey` | функція | `src/scripts/page-editor/08-w-projects-hub.js:109` |
| `ptExport` | функція | `src/scripts/page-editor/08-w-projects-hub.js:110` |
| `jrExport` | функція | `src/scripts/page-editor/08-w-projects-hub.js:131` |
| `cdTick` | функція | `src/scripts/page-editor/08-w-projects-hub.js:157` |
| `CAL_MONTHS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:185` |
| `calWrap` | значення | `src/scripts/page-editor/08-w-projects-hub.js:186` |
| `calId` | значення | `src/scripts/page-editor/08-w-projects-hub.js:197` |
| `calYmd` | функція | `src/scripts/page-editor/08-w-projects-hub.js:198` |
| `openCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:199` |
| `closeCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:207` |
| `buildCal` | функція | `src/scripts/page-editor/08-w-projects-hub.js:208` |
| `pgPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:647` |
| `PGPH_SIZES` | масив | `src/scripts/page-editor/08-w-projects-hub.js:672` |
| `pgSzBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:673` |
| `pgSzBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:674` |
| `pgSzSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:702` |
| `pgSzClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:709` |
| `pgPhotoSizeSheet` | функція | `src/scripts/page-editor/08-w-projects-hub.js:710` |
| `pgPhotoMenu` | функція | `src/scripts/page-editor/08-w-projects-hub.js:713` |
| `pgRz` | значення | `src/scripts/page-editor/08-w-projects-hub.js:734` |
| `COVKEY` | значення | `src/scripts/page-editor/08-w-projects-hub.js:756` |
| `covers` | обʼєкт | `src/scripts/page-editor/08-w-projects-hub.js:757` |
| `saveCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:765` |
| `COV_GRADS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:769` |
| `covEl` | значення | `src/scripts/page-editor/08-w-projects-hub.js:775` |
| `pgHasCov` | функція | `src/scripts/page-editor/08-w-projects-hub.js:776` |
| `covKey` | функція | `src/scripts/page-editor/08-w-projects-hub.js:777` |
| `covMenuHTML` | функція | `src/scripts/page-editor/08-w-projects-hub.js:778` |
| `renderCover` | функція | `src/scripts/page-editor/08-w-projects-hub.js:785` |
| `covPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:815` |
| `covEdBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:856` |
| `covEdState` | функція | `src/scripts/page-editor/08-w-projects-hub.js:857` |
| `covEdSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:863` |
| `covEdBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:876` |
| `covEdOpen` | функція | `src/scripts/page-editor/08-w-projects-hub.js:925` |
| `covEdClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:926` |

### `src/scripts/page-editor/09-journal-sheet.js` — 36 сутностей

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
| `jeFacts` | функція | `src/scripts/page-editor/09-journal-sheet.js:225` |
| `jePending` | функція | `src/scripts/page-editor/09-journal-sheet.js:243` |
| `JE_SYS_W` | значення | `src/scripts/page-editor/09-journal-sheet.js:262` |
| `JE_SYS_M` | значення | `src/scripts/page-editor/09-journal-sheet.js:268` |
| `jeBusy` | значення | `src/scripts/page-editor/09-journal-sheet.js:273` |
| `jeGen` | функція | `src/scripts/page-editor/09-journal-sheet.js:275` |
| `jeAuto` | функція | `src/scripts/page-editor/09-journal-sheet.js:309` |
| `jeMd` | функція | `src/scripts/page-editor/09-journal-sheet.js:313` |
| `jeAiHTML` | функція | `src/scripts/page-editor/09-journal-sheet.js:319` |
| `jeRec` | значення | `src/scripts/page-editor/09-journal-sheet.js:401` |
| `jeMic` | функція | `src/scripts/page-editor/09-journal-sheet.js:402` |
| `window.openFlowPage` | функція | `src/scripts/page-editor/09-journal-sheet.js:439` |

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
