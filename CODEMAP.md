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
| Файлів JS | 68 |
| Рядків JS | 26983 |
| Файлів CSS | 32 |
| Рядків CSS | 8643 |
| Сутностей верхнього рівня | 1667 |
| Ключів сховища (FLOW_KEYS) | 70 |

## Файли JS

| Файл | Рядків | Сутностей |
|---|---|---|
| `desktop/main.js` | 232 | 13 |
| `desktop/preload.js` | 21 | 0 |
| `src/scripts/01-crash-screen.js` | 82 | 10 |
| `src/scripts/03-quota-banner.js` | 14 | 2 |
| `src/scripts/21-newyear-countdown.js` | 124 | 11 |
| `src/scripts/40-pets-3d.js` | 287 | 0 |
| `src/scripts/41-theme-layer.js` | 153 | 0 |
| `src/scripts/42-voice-island.js` | 785 | 0 |
| `src/scripts/43-planner.js` | 134 | 0 |
| `src/scripts/44-week.js` | 329 | 0 |
| `src/scripts/45-month.js` | 661 | 0 |
| `src/scripts/46-mx.js` | 215 | 0 |
| `src/scripts/core/01-base.js` | 328 | 31 |
| `src/scripts/core/02-storage.js` | 1309 | 115 |
| `src/scripts/core/03-platform.js` | 60 | 14 |
| `src/scripts/core/04-folders-nav.js` | 268 | 46 |
| `src/scripts/core/05-spaces.js` | 673 | 60 |
| `src/scripts/core/06-wishes.js` | 1191 | 92 |
| `src/scripts/core/07-values.js` | 202 | 18 |
| `src/scripts/core/08-finance.js` | 922 | 92 |
| `src/scripts/core/09-goals.js` | 632 | 24 |
| `src/scripts/core/10-planner.js` | 903 | 49 |
| `src/scripts/core/11-ai-flow.js` | 177 | 14 |
| `src/scripts/core/12-ai-agent.js` | 1624 | 79 |
| `src/scripts/core/13-pets.js` | 216 | 13 |
| `src/scripts/core/14-react.js` | 335 | 43 |
| `src/scripts/core/15-flow-spot.js` | 2027 | 97 |
| `src/scripts/core/16-dashboard.js` | 556 | 21 |
| `src/scripts/core/17-folder-render.js` | 16 | 2 |
| `src/scripts/core/18-debts.js` | 182 | 20 |
| `src/scripts/core/19-spending.js` | 134 | 14 |
| `src/scripts/core/20-work.js` | 487 | 50 |
| `src/scripts/core/21-patterns.js` | 191 | 21 |
| `src/scripts/core/22-diary.js` | 525 | 54 |
| `src/scripts/core/23-board.js` | 312 | 30 |
| `src/scripts/core/24-reminders.js` | 196 | 16 |
| `src/scripts/core/25-reader.js` | 566 | 40 |
| `src/scripts/core/26-blocks-render.js` | 1648 | 16 |
| `src/scripts/core/27-canvas.js` | 568 | 27 |
| `src/scripts/core/28-vision.js` | 529 | 42 |
| `src/scripts/core/29-more-screen.js` | 436 | 21 |
| `src/scripts/core/30-upgrade.js` | 291 | 30 |
| `src/scripts/core/31-my-year.js` | 200 | 21 |
| `src/scripts/core/32-global-search.js` | 151 | 13 |
| `src/scripts/core/33-home-widgets.js` | 133 | 14 |
| `src/scripts/core/34-shortcuts.js` | 54 | 5 |
| `src/scripts/core/35-channel.js` | 665 | 62 |
| `src/scripts/core/36-chats.js` | 341 | 39 |
| `src/scripts/page-editor/01-palette.js` | 177 | 17 |
| `src/scripts/page-editor/02-block-styles.js` | 904 | 47 |
| `src/scripts/page-editor/03-premium-pack.js` | 601 | 27 |
| `src/scripts/page-editor/04-w-journal.js` | 107 | 9 |
| `src/scripts/page-editor/05-w-decisions.js` | 112 | 4 |
| `src/scripts/page-editor/06-w-project.js` | 100 | 6 |
| `src/scripts/page-editor/07-w-habits.js` | 69 | 4 |
| `src/scripts/page-editor/08-w-projects-hub.js` | 961 | 43 |
| `src/scripts/page-editor/09-journal-sheet.js` | 467 | 36 |
| `src/scripts/page-editor/10-mic.js` | 155 | 10 |
| `src/vendor/jszip.min.js` _(мініфікований вендор)_ | 13 | — |
| `src/vendor/pdf.min.js` _(мініфікований вендор)_ | 22 | — |
| `src/vendor/supabase.min.js` _(мініфікований вендор)_ | 11 | — |
| `src/web/sw.js` | 41 | 3 |
| `tools/make-icon.js` | 40 | 5 |
| `tools/scriptcheck.js` | 98 | 12 |
| `tools/smoke.js` | 58 | 5 |
| `tools/test-migrations.js` | 230 | 27 |
| `worker/flow-ai-worker.js` | 581 | 20 |
| `worker/test-worker.mjs` | 151 | 11 |

## Файли CSS

| Файл | Рядків | Селекторів |
|---|---|---|
| `src/styles/00-fonts.css` | 97 | 0 |
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
| `src/styles/core/01-tokens-base.css` | 343 | 8 |
| `src/styles/core/02-page-editor.css` | 1253 | 10 |
| `src/styles/core/03-folders-projects.css` | 578 | 0 |
| `src/styles/core/04-menus.css` | 61 | 0 |
| `src/styles/core/05-values-wishes.css` | 186 | 0 |
| `src/styles/core/06-goals.css` | 228 | 0 |
| `src/styles/core/07-finance.css` | 597 | 0 |
| `src/styles/core/08-work.css` | 202 | 0 |
| `src/styles/core/09-board-canvas.css` | 193 | 3 |
| `src/styles/core/10-reader-blocks.css` | 461 | 4 |
| `src/styles/core/11-spaces-desktop.css` | 211 | 0 |
| `src/styles/core/12-pets-more-planner.css` | 1197 | 0 |
| `src/styles/core/13-search-capture.css` | 80 | 0 |
| `src/styles/core/15-vision.css` | 172 | 0 |
| `src/styles/core/16-upgrade.css` | 54 | 0 |
| `src/styles/core/17-my-year.css` | 64 | 0 |
| `src/styles/core/18-channel.css` | 178 | 0 |
| `src/styles/core/19-chats.css` | 69 | 0 |

## Ключі сховища — FLOW_KEYS (70)

`src/scripts/core/01-base.js`

`0` · `active_space_map_v2` · `ai_chat` · `ai_endpoint` · `ai_memory` · `ai_pet`

`ai_prompts` · `ai_voice` · `blockusage` · `board` · `chats_v1` · `collage_board`

`custom_avatar_v1` · `customboards` · `debts` · `diary_books_v1` · `diary_entries_v1` · `diary_insights_v1`

`envelopes` · `fin_ops` · `fin_recurring` · `flowPgCovers` · `flowcardskin` · `flowprotheme`

`flowtheme` · `folder_widgets` · `folders_cfg` · `folders_order` · `folderview` · `forcedesktop`

`forcemobile` · `fx_cfg` · `fx_mode` · `fx_say` · `goals_data` · `home_glass_on`

`homeov` · `hometab` · `homewidgets` · `i18n_content_cache` · `income_cards` · `lang_pref`

`patterns_chains` · `patterns_score` · `patterns_transform` · `pet_hidden` · `pet_pos` · `pet_sleep`

`readerCfg` · `ritual_board` · `sidebarcol` · `spacecanvas` · `spacecanvaszoom` · `spacefull`

`spaces_map_v2` · `spaceview` · `spacewide` · `spend` · `switcher_style` · `ui_mode`

`upgrade_profile_v1` · `values_state` · `vision_v1` · `wish_active_days_v1` · `wish_price` · `wishes_board`

`work_blocks` · `work_cfg` · `work_extras` · `work_sessions`

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
| `window.goNYC` | функція | `src/scripts/21-newyear-countdown.js:119` |

### `src/scripts/40-pets-3d.js` — порожньо на верхньому рівні

### `src/scripts/41-theme-layer.js` — порожньо на верхньому рівні

### `src/scripts/42-voice-island.js` — порожньо на верхньому рівні

### `src/scripts/43-planner.js` — порожньо на верхньому рівні

### `src/scripts/44-week.js` — порожньо на верхньому рівні

### `src/scripts/45-month.js` — порожньо на верхньому рівні

### `src/scripts/46-mx.js` — порожньо на верхньому рівні

### `src/scripts/core/01-base.js` — 31 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `ymdLocal` | функція | `src/scripts/core/01-base.js:31` |
| `ymLocal` | функція | `src/scripts/core/01-base.js:33` |
| `window.ymdLocal` | значення | `src/scripts/core/01-base.js:34` |
| `pluralUk` | функція | `src/scripts/core/01-base.js:39` |
| `window.pluralUk` | значення | `src/scripts/core/01-base.js:46` |
| `safeEmoji` | функція | `src/scripts/core/01-base.js:53` |
| `window.safeEmoji` | значення | `src/scripts/core/01-base.js:58` |
| `window.FLOW_KEYS` | масив | `src/scripts/core/01-base.js:67` |
| `window.FLOW_RAW_KEYS` | масив | `src/scripts/core/01-base.js:118` |
| `getLang` | функція | `src/scripts/core/01-base.js:135` |
| `setLang` | функція | `src/scripts/core/01-base.js:136` |
| `window.__flowLang` | значення | `src/scripts/core/01-base.js:137` |
| `window.flowLang` | значення | `src/scripts/core/01-base.js:138` |
| `window.flowSetLang` | значення | `src/scripts/core/01-base.js:139` |
| `I18N_DICT` | обʼєкт | `src/scripts/core/01-base.js:144` |
| `I18N_WORDS` | масив | `src/scripts/core/01-base.js:196` |
| `wordLevelTranslate` | функція | `src/scripts/core/01-base.js:224` |
| `I18N_NO_TOUCH` | обʼєкт | `src/scripts/core/01-base.js:239` |
| `translateNode` | функція | `src/scripts/core/01-base.js:242` |
| `i18nApply` | функція | `src/scripts/core/01-base.js:265` |
| `window.i18nApply` | значення | `src/scripts/core/01-base.js:269` |
| `raf` | значення | `src/scripts/core/01-base.js:272` |
| `mo` | функція | `src/scripts/core/01-base.js:273` |
| `contentTranslateOn` | функція | `src/scripts/core/01-base.js:290` |
| `window.flowContentTranslateOn` | значення | `src/scripts/core/01-base.js:293` |
| `hash` | функція | `src/scripts/core/01-base.js:294` |
| `cacheGet` | функція | `src/scripts/core/01-base.js:295` |
| `window.flowTranslateContent` | функція | `src/scripts/core/01-base.js:300` |
| `window.__flowErrors` | масив | `src/scripts/core/01-base.js:316` |
| `push` | функція | `src/scripts/core/01-base.js:317` |
| `window.flowErrors` | функція | `src/scripts/core/01-base.js:326` |

### `src/scripts/core/02-storage.js` — 115 сутностей

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
| `SB_URL` | значення | `src/scripts/core/02-storage.js:334` |
| `SB_KEY` | значення | `src/scripts/core/02-storage.js:335` |
| `sb` | значення | `src/scripts/core/02-storage.js:336` |
| `sbBatchCache` | значення | `src/scripts/core/02-storage.js:337` |
| `sbBatchTs` | обʼєкт | `src/scripts/core/02-storage.js:338` |
| `window.__sbReady` | значення | `src/scripts/core/02-storage.js:339` |
| `loadSupabaseLib` | функція | `src/scripts/core/02-storage.js:344` |
| `sbReadyEvt` | функція | `src/scripts/core/02-storage.js:364` |
| `sbInit` | функція | `src/scripts/core/02-storage.js:365` |
| `window.sbUser` | функція | `src/scripts/core/02-storage.js:421` |
| `sbFromCloud` | функція | `src/scripts/core/02-storage.js:431` |
| `sbToCloud` | функція | `src/scripts/core/02-storage.js:432` |
| `window.sbAccessToken` | функція | `src/scripts/core/02-storage.js:440` |
| `sbPrefetchAll` | функція | `src/scripts/core/02-storage.js:449` |
| `sbLocalVersion` | функція | `src/scripts/core/02-storage.js:464` |
| `window.sbPrefetchAll` | значення | `src/scripts/core/02-storage.js:472` |
| `window.sbDataTrusted` | функція | `src/scripts/core/02-storage.js:480` |
| `sbSigningIn` | значення | `src/scripts/core/02-storage.js:485` |
| `window.sbSignInGoogle` | функція | `src/scripts/core/02-storage.js:486` |
| `window.sbSignOut` | функція | `src/scripts/core/02-storage.js:561` |
| `origGet` | значення | `src/scripts/core/02-storage.js:599` |
| `origSet` | значення | `src/scripts/core/02-storage.js:600` |
| `origDelete` | значення | `src/scripts/core/02-storage.js:601` |
| `origList` | значення | `src/scripts/core/02-storage.js:602` |
| `sbWriteQueue` | обʼєкт | `src/scripts/core/02-storage.js:637` |
| `sbWriteTimer` | значення | `src/scripts/core/02-storage.js:638` |
| `sbInFlight` | обʼєкт | `src/scripts/core/02-storage.js:644` |
| `sbFlushSeq` | значення | `src/scripts/core/02-storage.js:650` |
| `sbDoneSeq` | обʼєкт | `src/scripts/core/02-storage.js:651` |
| `sbOutboxSave` | функція | `src/scripts/core/02-storage.js:654` |
| `sbOutboxTimer` | значення | `src/scripts/core/02-storage.js:670` |
| `sbHiding` | значення | `src/scripts/core/02-storage.js:671` |
| `sbOutboxSaveSoon` | функція | `src/scripts/core/02-storage.js:672` |
| `sbOutboxLoad` | функція | `src/scripts/core/02-storage.js:676` |
| `sbSyncPending` | функція | `src/scripts/core/02-storage.js:683` |
| `sbScheduleWrite` | функція | `src/scripts/core/02-storage.js:684` |
| `sbFlushWrites` | функція | `src/scripts/core/02-storage.js:691` |
| `window.sbFlushWrites` | значення | `src/scripts/core/02-storage.js:740` |
| `sbOnHide` | функція | `src/scripts/core/02-storage.js:743` |
| `sbPullChanged` | функція | `src/scripts/core/02-storage.js:778` |
| `sbLastPull` | значення | `src/scripts/core/02-storage.js:800` |
| `sbPullFresh` | функція | `src/scripts/core/02-storage.js:801` |
| `window.sbPullFresh` | значення | `src/scripts/core/02-storage.js:830` |
| `PH_KEY` | значення | `src/scripts/core/02-storage.js:845` |
| `PH_PENDING` | значення | `src/scripts/core/02-storage.js:846` |
| `phPendingGet` | функція | `src/scripts/core/02-storage.js:847` |
| `phPendingSet` | функція | `src/scripts/core/02-storage.js:848` |
| `phPendingAdd` | функція | `src/scripts/core/02-storage.js:849` |
| `phPendingDrop` | функція | `src/scripts/core/02-storage.js:850` |
| `PH_TS` | значення | `src/scripts/core/02-storage.js:855` |
| `phTsGet` | функція | `src/scripts/core/02-storage.js:856` |
| `phTsSet` | функція | `src/scripts/core/02-storage.js:857` |
| `phTsDrop` | функція | `src/scripts/core/02-storage.js:858` |
| `window.sbPhotoPush` | функція | `src/scripts/core/02-storage.js:860` |
| `window.sbPhotoFetch` | функція | `src/scripts/core/02-storage.js:875` |
| `window.sbPhotoDel` | функція | `src/scripts/core/02-storage.js:884` |
| `phSyncBusy` | значення | `src/scripts/core/02-storage.js:894` |
| `sbPhotoSync` | функція | `src/scripts/core/02-storage.js:895` |
| `window.sbPhotoSync` | значення | `src/scripts/core/02-storage.js:925` |
| `window.sbWipeAll` | функція | `src/scripts/core/02-storage.js:930` |
| `prefSet` | функція | `src/scripts/core/02-storage.js:983` |
| `prefCatchup` | функція | `src/scripts/core/02-storage.js:987` |
| `UIMODE_KEY` | значення | `src/scripts/core/02-storage.js:1000` |
| `window.uiMode` | значення | `src/scripts/core/02-storage.js:1001` |
| `applyUiMode` | функція | `src/scripts/core/02-storage.js:1002` |
| `setUiMode` | функція | `src/scripts/core/02-storage.js:1003` |
| `window.setUiMode` | значення | `src/scripts/core/02-storage.js:1011` |
| `LP` | значення | `src/scripts/core/02-storage.js:1018` |
| `FORMAT` | значення | `src/scripts/core/02-storage.js:1019` |
| `APP` | значення | `src/scripts/core/02-storage.js:1020` |
| `collect` | функція | `src/scripts/core/02-storage.js:1023` |
| `stats` | функція | `src/scripts/core/02-storage.js:1034` |
| `makeEnvelope` | функція | `src/scripts/core/02-storage.js:1041` |
| `exportToFile` | функція | `src/scripts/core/02-storage.js:1060` |
| `snapshot` | функція | `src/scripts/core/02-storage.js:1105` |
| `restoreSnapshot` | функція | `src/scripts/core/02-storage.js:1108` |
| `applyEnvelope` | функція | `src/scripts/core/02-storage.js:1114` |
| `importFromFile` | функція | `src/scripts/core/02-storage.js:1136` |
| `window.flowBackup` | обʼєкт | `src/scripts/core/02-storage.js:1145` |
| `window.flowFactoryReset` | функція | `src/scripts/core/02-storage.js:1159` |
| `window.PhotoDB` | значення | `src/scripts/core/02-storage.js:1206` |
| `window.__photoCache` | значення | `src/scripts/core/02-storage.js:1244` |
| `__phPending` | обʼєкт | `src/scripts/core/02-storage.js:1250` |
| `__photoPoke` | функція | `src/scripts/core/02-storage.js:1251` |
| `window.photoSrc` | функція | `src/scripts/core/02-storage.js:1259` |
| `window.photoIsRef` | функція | `src/scripts/core/02-storage.js:1283` |
| `window.photoWarm` | функція | `src/scripts/core/02-storage.js:1284` |
| `window.photoPut` | функція | `src/scripts/core/02-storage.js:1290` |
| `window.photoDel` | функція | `src/scripts/core/02-storage.js:1299` |

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

### `src/scripts/core/04-folders-nav.js` — 46 сутностей

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
| `folderIcon` | функція | `src/scripts/core/04-folders-nav.js:68` |
| `ICON_ALL` | масив | `src/scripts/core/04-folders-nav.js:71` |
| `folderVisible` | функція | `src/scripts/core/04-folders-nav.js:84` |
| `foldersLoaded` | значення | `src/scripts/core/04-folders-nav.js:99` |
| `markFoldersLoaded` | функція | `src/scripts/core/04-folders-nav.js:100` |
| `foldersLookFactory` | функція | `src/scripts/core/04-folders-nav.js:102` |
| `storedFolderCount` | функція | `src/scripts/core/04-folders-nav.js:107` |
| `saveFolders` | функція | `src/scripts/core/04-folders-nav.js:116` |
| `WIDGET_CATALOG` | обʼєкт | `src/scripts/core/04-folders-nav.js:142` |
| `folderWidgets` | обʼєкт | `src/scripts/core/04-folders-nav.js:151` |
| `FWKEY` | значення | `src/scripts/core/04-folders-nav.js:152` |
| `saveFolderWidgets` | функція | `src/scripts/core/04-folders-nav.js:153` |
| `addWidgetToFolder` | функція | `src/scripts/core/04-folders-nav.js:154` |
| `orderedFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:162` |
| `FOLDER_ROLES` | обʼєкт | `src/scripts/core/04-folders-nav.js:168` |
| `PROJECT_STATUSES` | масив | `src/scripts/core/04-folders-nav.js:173` |
| `projStatusMeta` | функція | `src/scripts/core/04-folders-nav.js:177` |
| `folderProgress` | функція | `src/scripts/core/04-folders-nav.js:179` |
| `dueLabel` | функція | `src/scripts/core/04-folders-nav.js:191` |
| `projFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:200` |
| `folderNextStep` | функція | `src/scripts/core/04-folders-nav.js:202` |
| `completeFolderNextStep` | функція | `src/scripts/core/04-folders-nav.js:213` |
| `childFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:222` |
| `topFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:225` |
| `isDescendantFolder` | функція | `src/scripts/core/04-folders-nav.js:228` |
| `moveFolderTo` | функція | `src/scripts/core/04-folders-nav.js:236` |
| `goHome` | функція | `src/scripts/core/04-folders-nav.js:246` |
| `goFolder` | функція | `src/scripts/core/04-folders-nav.js:247` |
| `goDebts` | функція | `src/scripts/core/04-folders-nav.js:262` |
| `goFinance` | функція | `src/scripts/core/04-folders-nav.js:263` |
| `goEnvelopes` | функція | `src/scripts/core/04-folders-nav.js:264` |
| `goSpend` | функція | `src/scripts/core/04-folders-nav.js:265` |
| `workOrigin` | значення | `src/scripts/core/04-folders-nav.js:266` |
| `goWork` | функція | `src/scripts/core/04-folders-nav.js:267` |

### `src/scripts/core/05-spaces.js` — 60 сутностей

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
| `addSpace` | функція | `src/scripts/core/05-spaces.js:52` |
| `deleteSpace` | функція | `src/scripts/core/05-spaces.js:65` |
| `openSpaceSettings` | функція | `src/scripts/core/05-spaces.js:79` |
| `goSpaceFor` | функція | `src/scripts/core/05-spaces.js:123` |
| `spaceFromFolder` | значення | `src/scripts/core/05-spaces.js:134` |
| `show` | функція | `src/scripts/core/05-spaces.js:137` |
| `dsbFillUser` | функція | `src/scripts/core/05-spaces.js:176` |
| `window.dsbFillUser` | значення | `src/scripts/core/05-spaces.js:199` |
| `dsbProfileSheet` | функція | `src/scripts/core/05-spaces.js:200` |
| `renderSettingsCard` | функція | `src/scripts/core/05-spaces.js:235` |
| `window.renderSettingsCard` | значення | `src/scripts/core/05-spaces.js:294` |
| `openSettings` | функція | `src/scripts/core/05-spaces.js:296` |
| `window.openSettingsSheet` | значення | `src/scripts/core/05-spaces.js:312` |
| `sidebarCollapsed` | значення | `src/scripts/core/05-spaces.js:347` |
| `applyChrome` | функція | `src/scripts/core/05-spaces.js:352` |
| `homeWidgets` | значення | `src/scripts/core/05-spaces.js:368` |
| `applyHomeWidgets` | функція | `src/scripts/core/05-spaces.js:371` |
| `THEME_SETS` | обʼєкт | `src/scripts/core/05-spaces.js:391` |
| `THEME_META` | обʼєкт | `src/scripts/core/05-spaces.js:397` |
| `THEME_KEYS` | значення | `src/scripts/core/05-spaces.js:406` |
| `isTheme` | функція | `src/scripts/core/05-spaces.js:407` |
| `themeSetOf` | функція | `src/scripts/core/05-spaces.js:409` |
| `themeIsDark` | функція | `src/scripts/core/05-spaces.js:413` |
| `theme` | значення | `src/scripts/core/05-spaces.js:414` |
| `applyTheme` | функція | `src/scripts/core/05-spaces.js:438` |
| `setTheme` | функція | `src/scripts/core/05-spaces.js:463` |
| `setThemeSet` | функція | `src/scripts/core/05-spaces.js:473` |
| `toggleTheme` | функція | `src/scripts/core/05-spaces.js:477` |
| `proTheme` | значення | `src/scripts/core/05-spaces.js:491` |
| `applyProTheme` | функція | `src/scripts/core/05-spaces.js:493` |
| `toggleProTheme` | функція | `src/scripts/core/05-spaces.js:499` |
| `cardSkin` | значення | `src/scripts/core/05-spaces.js:509` |
| `applyCardSkin` | функція | `src/scripts/core/05-spaces.js:511` |
| `setCardSkin` | функція | `src/scripts/core/05-spaces.js:517` |
| `RR_DEFS` | обʼєкт | `src/scripts/core/05-spaces.js:538` |
| `rrCfg` | функція | `src/scripts/core/05-spaces.js:539` |
| `rrSave` | функція | `src/scripts/core/05-spaces.js:544` |
| `rrCfgSheet` | функція | `src/scripts/core/05-spaces.js:545` |
| `renderRightRail` | функція | `src/scripts/core/05-spaces.js:564` |
| `goGoals` | функція | `src/scripts/core/05-spaces.js:598` |
| `prjHexToRgb` | функція | `src/scripts/core/05-spaces.js:601` |
| `prjTileHTML` | функція | `src/scripts/core/05-spaces.js:609` |
| `renderProjects` | функція | `src/scripts/core/05-spaces.js:617` |
| `goProjects` | функція | `src/scripts/core/05-spaces.js:650` |
| `goPlanner` | функція | `src/scripts/core/05-spaces.js:653` |
| `goValues` | функція | `src/scripts/core/05-spaces.js:657` |
| `goWishes` | функція | `src/scripts/core/05-spaces.js:659` |
| `window.goWishes` | значення | `src/scripts/core/05-spaces.js:660` |

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

### `src/scripts/core/08-finance.js` — 92 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `envelopes` | масив | `src/scripts/core/08-finance.js:2` |
| `ENVKEY` | значення | `src/scripts/core/08-finance.js:3` |
| `saveEnvelopes` | функція | `src/scripts/core/08-finance.js:4` |
| `envMigrate` | функція | `src/scripts/core/08-finance.js:10` |
| `envSaved` | функція | `src/scripts/core/08-finance.js:18` |
| `envTotalSaved` | функція | `src/scripts/core/08-finance.js:19` |
| `envAddOp` | функція | `src/scripts/core/08-finance.js:22` |
| `envDelOp` | функція | `src/scripts/core/08-finance.js:39` |
| `finOps` | масив | `src/scripts/core/08-finance.js:49` |
| `FINOPKEY` | значення | `src/scripts/core/08-finance.js:50` |
| `saveFinOps` | функція | `src/scripts/core/08-finance.js:51` |
| `window.flowSearchFin` | функція | `src/scripts/core/08-finance.js:53` |
| `recurring` | масив | `src/scripts/core/08-finance.js:55` |
| `RECKEY` | значення | `src/scripts/core/08-finance.js:56` |
| `saveRecurring` | функція | `src/scripts/core/08-finance.js:57` |
| `WALLET_ID` | значення | `src/scripts/core/08-finance.js:67` |
| `cards` | масив | `src/scripts/core/08-finance.js:68` |
| `saveCards` | функція | `src/scripts/core/08-finance.js:69` |
| `walletCard` | функція | `src/scripts/core/08-finance.js:70` |
| `walletOps` | функція | `src/scripts/core/08-finance.js:73` |
| `walletBalance` | функція | `src/scripts/core/08-finance.js:74` |
| `mainCard` | функція | `src/scripts/core/08-finance.js:76` |
| `cardById` | функція | `src/scripts/core/08-finance.js:77` |
| `cardSym` | функція | `src/scripts/core/08-finance.js:78` |
| `cardBalance` | функція | `src/scripts/core/08-finance.js:79` |
| `incomeSummary` | функція | `src/scripts/core/08-finance.js:80` |
| `_projCardId` | функція | `src/scripts/core/08-finance.js:81` |
| `ensureCards` | функція | `src/scripts/core/08-finance.js:84` |
| `migRaw` | функція | `src/scripts/core/08-finance.js:113` |
| `migRates` | функція | `src/scripts/core/08-finance.js:122` |
| `migCurByCard` | функція | `src/scripts/core/08-finance.js:127` |
| `walletSumUAH` | функція | `src/scripts/core/08-finance.js:134` |
| `WALLET_MIG_FLAG` | значення | `src/scripts/core/08-finance.js:154` |
| `migrateToWallet` | функція | `src/scripts/core/08-finance.js:159` |
| `recDayOf` | функція | `src/scripts/core/08-finance.js:197` |
| `recAutoPost` | функція | `src/scripts/core/08-finance.js:198` |
| `workCardId` | значення | `src/scripts/core/08-finance.js:221` |
| `workCard` | функція | `src/scripts/core/08-finance.js:222` |
| `_isRealExpense` | функція | `src/scripts/core/08-finance.js:225` |
| `_isRealIncome` | функція | `src/scripts/core/08-finance.js:226` |
| `monthAgg` | функція | `src/scripts/core/08-finance.js:227` |
| `finTab` | значення | `src/scripts/core/08-finance.js:232` |
| `finView` | значення | `src/scripts/core/08-finance.js:233` |
| `finBalance` | функція | `src/scripts/core/08-finance.js:234` |
| `renderFinance` | функція | `src/scripts/core/08-finance.js:236` |
| `MON_UA` | масив | `src/scripts/core/08-finance.js:243` |
| `renderFinDash` | функція | `src/scripts/core/08-finance.js:249` |
| `bindFinDash` | функція | `src/scripts/core/08-finance.js:299` |
| `renderEnvScreen` | функція | `src/scripts/core/08-finance.js:327` |
| `addFinOp` | функція | `src/scripts/core/08-finance.js:371` |
| `addFinOpCard` | функція | `src/scripts/core/08-finance.js:375` |
| `newRecurring` | функція | `src/scripts/core/08-finance.js:386` |
| `newEnvelope` | функція | `src/scripts/core/08-finance.js:402` |
| `envOpenId` | значення | `src/scripts/core/08-finance.js:420` |
| `openEnvSheet` | функція | `src/scripts/core/08-finance.js:421` |
| `closeEnvSheet` | функція | `src/scripts/core/08-finance.js:426` |
| `projIncome` | функція | `src/scripts/core/08-finance.js:431` |
| `projExpense` | функція | `src/scripts/core/08-finance.js:432` |
| `projNet` | функція | `src/scripts/core/08-finance.js:433` |
| `projIsLocked` | функція | `src/scripts/core/08-finance.js:434` |
| `projDaysLeft` | функція | `src/scripts/core/08-finance.js:440` |
| `projectWidgetHtml` | функція | `src/scripts/core/08-finance.js:445` |
| `fmtDate` | функція | `src/scripts/core/08-finance.js:521` |
| `kanbanWidgetHtml` | функція | `src/scripts/core/08-finance.js:525` |
| `kbwFind` | функція | `src/scripts/core/08-finance.js:539` |
| `kbwAddCard` | функція | `src/scripts/core/08-finance.js:540` |
| `kbwCardMenu` | функція | `src/scripts/core/08-finance.js:550` |
| `kbwColMenu` | функція | `src/scripts/core/08-finance.js:567` |
| `CTW_COLORS` | масив | `src/scripts/core/08-finance.js:582` |
| `ctwInit` | функція | `src/scripts/core/08-finance.js:583` |
| `contactsWidgetHtml` | функція | `src/scripts/core/08-finance.js:588` |
| `ctwAdd` | функція | `src/scripts/core/08-finance.js:598` |
| `ctwOpenLink` | функція | `src/scripts/core/08-finance.js:608` |
| `ctwMenu` | функція | `src/scripts/core/08-finance.js:614` |
| `clwFmt` | функція | `src/scripts/core/08-finance.js:625` |
| `caselineWidgetHtml` | функція | `src/scripts/core/08-finance.js:630` |
| `clwAdd` | функція | `src/scripts/core/08-finance.js:638` |
| `clwMenu` | функція | `src/scripts/core/08-finance.js:648` |
| `fstwCountdown` | функція | `src/scripts/core/08-finance.js:657` |
| `fstwSpent` | функція | `src/scripts/core/08-finance.js:665` |
| `festivalWidgetHtml` | функція | `src/scripts/core/08-finance.js:666` |
| `fstwSpend` | функція | `src/scripts/core/08-finance.js:692` |
| `fstwOpsSheet` | функція | `src/scripts/core/08-finance.js:702` |
| `fstwSetup` | функція | `src/scripts/core/08-finance.js:710` |
| `projAddMovement` | функція | `src/scripts/core/08-finance.js:723` |
| `projAskExpense` | функція | `src/scripts/core/08-finance.js:748` |
| `projReceiveExpected` | функція | `src/scripts/core/08-finance.js:767` |
| `projSplitPreset` | функція | `src/scripts/core/08-finance.js:781` |
| `projDistributeToEnvelope` | функція | `src/scripts/core/08-finance.js:804` |
| `createEnvelopeFor` | функція | `src/scripts/core/08-finance.js:828` |
| `pickEnvelopeFor` | функція | `src/scripts/core/08-finance.js:845` |
| `renderEnvSheet` | функція | `src/scripts/core/08-finance.js:856` |

### `src/scripts/core/09-goals.js` — 24 сутностей

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
| `aiConfig` | функція | `src/scripts/core/09-goals.js:40` |
| `aiSheetClose` | функція | `src/scripts/core/09-goals.js:46` |
| `aiStartSheet` | функція | `src/scripts/core/09-goals.js:47` |
| `aiGenerate` | функція | `src/scripts/core/09-goals.js:78` |
| `aiLocalDraft` | функція | `src/scripts/core/09-goals.js:110` |
| `DOW_SHORT` | масив | `src/scripts/core/09-goals.js:134` |
| `aiPreview` | функція | `src/scripts/core/09-goals.js:135` |
| `aiApplyDraft` | функція | `src/scripts/core/09-goals.js:170` |
| `renderGoals` | функція | `src/scripts/core/09-goals.js:210` |
| `dgDateStr` | функція | `src/scripts/core/09-goals.js:275` |
| `dgWeekDates` | функція | `src/scripts/core/09-goals.js:276` |
| `dgListFor` | функція | `src/scripts/core/09-goals.js:279` |
| `dgSync` | функція | `src/scripts/core/09-goals.js:281` |
| `dayGoalsBlock` | функція | `src/scripts/core/09-goals.js:302` |
| `pickFolderForGoal` | функція | `src/scripts/core/09-goals.js:354` |
| `renderGoalsTab` | функція | `src/scripts/core/09-goals.js:393` |

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
| `AI_CHAT_SYS` | значення | `src/scripts/core/11-ai-flow.js:89` |
| `aiHttpError` | функція | `src/scripts/core/11-ai-flow.js:128` |
| `aiCall` | функція | `src/scripts/core/11-ai-flow.js:139` |

### `src/scripts/core/12-ai-agent.js` — 79 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `AI_AGENT_KEY` | значення | `src/scripts/core/12-ai-agent.js:6` |
| `aiAgentOn` | функція | `src/scripts/core/12-ai-agent.js:7` |
| `aiAgentStatus` | значення | `src/scripts/core/12-ai-agent.js:8` |
| `aiAgentSetStatus` | функція | `src/scripts/core/12-ai-agent.js:9` |
| `aiDevOn` | функція | `src/scripts/core/12-ai-agent.js:23` |
| `aiDevEvalOn` | функція | `src/scripts/core/12-ai-agent.js:34` |
| `aiDevToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:39` |
| `devContentTranslateToggleSheet` | функція | `src/scripts/core/12-ai-agent.js:58` |
| `window.devContentTranslateToggleSheet` | значення | `src/scripts/core/12-ai-agent.js:75` |
| `AI_DEV_SYS` | значення | `src/scripts/core/12-ai-agent.js:76` |
| `aiDevCtx` | функція | `src/scripts/core/12-ai-agent.js:83` |
| `DEV_FEATURES` | масив | `src/scripts/core/12-ai-agent.js:96` |
| `aiDevHelpText` | функція | `src/scripts/core/12-ai-agent.js:107` |
| `aiDevConfirm` | функція | `src/scripts/core/12-ai-agent.js:114` |
| `devSnapshot` | функція | `src/scripts/core/12-ai-agent.js:134` |
| `DEV_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:140` |
| `devToolStorage` | функція | `src/scripts/core/12-ai-agent.js:165` |
| `devToolErrors` | функція | `src/scripts/core/12-ai-agent.js:210` |
| `devToolCost` | функція | `src/scripts/core/12-ai-agent.js:215` |
| `devToolSelftest` | функція | `src/scripts/core/12-ai-agent.js:234` |
| `devToolData` | функція | `src/scripts/core/12-ai-agent.js:264` |
| `devToolEval` | функція | `src/scripts/core/12-ai-agent.js:284` |
| `aiPageAsk` | функція | `src/scripts/core/12-ai-agent.js:301` |
| `aiMorningMaybe` | функція | `src/scripts/core/12-ai-agent.js:309` |
| `aiWeeklyMaybe` | функція | `src/scripts/core/12-ai-agent.js:321` |
| `aiAgentStatusFor` | функція | `src/scripts/core/12-ai-agent.js:333` |
| `aiTrace` | значення | `src/scripts/core/12-ai-agent.js:372` |
| `aiPlz` | функція | `src/scripts/core/12-ai-agent.js:373` |
| `AI_TRACE_READ` | обʼєкт | `src/scripts/core/12-ai-agent.js:377` |
| `aiTraceReadMeta` | функція | `src/scripts/core/12-ai-agent.js:384` |
| `aiTraceStart` | функція | `src/scripts/core/12-ai-agent.js:401` |
| `aiTraceStep` | функція | `src/scripts/core/12-ai-agent.js:402` |
| `aiTraceEnd` | функція | `src/scripts/core/12-ai-agent.js:419` |
| `aiTraceRepaint` | функція | `src/scripts/core/12-ai-agent.js:424` |
| `aiTraceFinish` | функція | `src/scripts/core/12-ai-agent.js:430` |
| `FLOW_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:440` |
| `AI_AGENT_ADDON` | значення | `src/scripts/core/12-ai-agent.js:517` |
| `flowToolExec` | функція | `src/scripts/core/12-ai-agent.js:533` |
| `flowToolRead` | функція | `src/scripts/core/12-ai-agent.js:560` |
| `aiRemindWhen` | функція | `src/scripts/core/12-ai-agent.js:650` |
| `flowToolPlanner` | функція | `src/scripts/core/12-ai-agent.js:657` |
| `flowToolGoals` | функція | `src/scripts/core/12-ai-agent.js:728` |
| `aiToolConfirm` | функція | `src/scripts/core/12-ai-agent.js:766` |
| `aiFinConfirm` | функція | `src/scripts/core/12-ai-agent.js:785` |
| `flowToolFinance` | функція | `src/scripts/core/12-ai-agent.js:788` |
| `flowToolDiary` | функція | `src/scripts/core/12-ai-agent.js:936` |
| `flowToolPatterns` | функція | `src/scripts/core/12-ai-agent.js:986` |
| `flowToolMemory` | функція | `src/scripts/core/12-ai-agent.js:1007` |
| `flowToolFolders` | функція | `src/scripts/core/12-ai-agent.js:1024` |
| `aiPickModel` | функція | `src/scripts/core/12-ai-agent.js:1077` |
| `aiUsageAdd` | функція | `src/scripts/core/12-ai-agent.js:1085` |
| `aiCallRaw` | функція | `src/scripts/core/12-ai-agent.js:1097` |
| `aiToolIsWrite` | функція | `src/scripts/core/12-ai-agent.js:1158` |
| `AI_WRITE_LIMIT` | значення | `src/scripts/core/12-ai-agent.js:1167` |
| `aiTurnWrites` | значення | `src/scripts/core/12-ai-agent.js:1168` |
| `aiToolWriteCost` | функція | `src/scripts/core/12-ai-agent.js:1173` |
| `aiAgentTurn` | функція | `src/scripts/core/12-ai-agent.js:1178` |
| `aiFinMonthNet` | функція | `src/scripts/core/12-ai-agent.js:1227` |
| `aiFinCtx` | функція | `src/scripts/core/12-ai-agent.js:1235` |
| `aiCtx` | функція | `src/scripts/core/12-ai-agent.js:1255` |
| `aiFindGoal` | функція | `src/scripts/core/12-ai-agent.js:1294` |
| `aiParseBlocks` | функція | `src/scripts/core/12-ai-agent.js:1298` |
| `aiOpsCount` | функція | `src/scripts/core/12-ai-agent.js:1329` |
| `aiStreamText` | функція | `src/scripts/core/12-ai-agent.js:1334` |
| `aiOpDs` | функція | `src/scripts/core/12-ai-agent.js:1344` |
| `aiOpMatches` | функція | `src/scripts/core/12-ai-agent.js:1345` |
| `aiOpBlock` | функція | `src/scripts/core/12-ai-agent.js:1355` |
| `aiFindBlockByT` | функція | `src/scripts/core/12-ai-agent.js:1356` |
| `aiOpWarn` | функція | `src/scripts/core/12-ai-agent.js:1358` |
| `aiResolveOps` | функція | `src/scripts/core/12-ai-agent.js:1370` |
| `aiMissText` | функція | `src/scripts/core/12-ai-agent.js:1384` |
| `aiOpRow` | функція | `src/scripts/core/12-ai-agent.js:1391` |
| `aiGateOps` | функція | `src/scripts/core/12-ai-agent.js:1398` |
| `aiFindFolderKey` | функція | `src/scripts/core/12-ai-agent.js:1418` |
| `aiBuildPageBlock` | функція | `src/scripts/core/12-ai-agent.js:1426` |
| `aiApplyPages` | функція | `src/scripts/core/12-ai-agent.js:1445` |
| `aiApplyActions` | функція | `src/scripts/core/12-ai-agent.js:1468` |
| `aiCommit` | функція | `src/scripts/core/12-ai-agent.js:1558` |
| `aiUndo` | функція | `src/scripts/core/12-ai-agent.js:1574` |

### `src/scripts/core/13-pets.js` — 13 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `FLOW_PETS` | обʼєкт | `src/scripts/core/13-pets.js:2` |
| `petCur` | функція | `src/scripts/core/13-pets.js:34` |
| `petPersona` | функція | `src/scripts/core/13-pets.js:35` |
| `petSVG` | функція | `src/scripts/core/13-pets.js:36` |
| `petPickerSheet` | функція | `src/scripts/core/13-pets.js:77` |
| `petSleeping` | функція | `src/scripts/core/13-pets.js:156` |
| `petSleepSet` | функція | `src/scripts/core/13-pets.js:157` |
| `window.petWake` | функція | `src/scripts/core/13-pets.js:158` |
| `fcPos` | функція | `src/scripts/core/13-pets.js:159` |
| `fcClamp` | функція | `src/scripts/core/13-pets.js:160` |
| `fcApplyPos` | функція | `src/scripts/core/13-pets.js:165` |
| `fcBindDrag` | функція | `src/scripts/core/13-pets.js:171` |
| `fcBurst` | функція | `src/scripts/core/13-pets.js:209` |

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
| `fcCheckOverlap` | функція | `src/scripts/core/14-react.js:325` |
| `window.fcCheckOverlap` | значення | `src/scripts/core/14-react.js:326` |
| `petHidden` | функція | `src/scripts/core/14-react.js:328` |
| `petHiddenSet` | функція | `src/scripts/core/14-react.js:329` |
| `t` | значення | `src/scripts/core/14-react.js:332` |
| `sched` | функція | `src/scripts/core/14-react.js:333` |

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
| `spotMicToggle` | функція | `src/scripts/core/15-flow-spot.js:148` |
| `window.flowCapRender` | значення | `src/scripts/core/15-flow-spot.js:177` |
| `window.flowSpotOpen` | значення | `src/scripts/core/15-flow-spot.js:178` |
| `aiChatSheet` | функція | `src/scripts/core/15-flow-spot.js:181` |
| `aiClose` | функція | `src/scripts/core/15-flow-spot.js:214` |
| `aiDayPct` | функція | `src/scripts/core/15-flow-spot.js:221` |
| `aiVoiceOn` | значення | `src/scripts/core/15-flow-spot.js:228` |
| `aiSpeakStop` | функція | `src/scripts/core/15-flow-spot.js:230` |
| `aiSpeak` | функція | `src/scripts/core/15-flow-spot.js:231` |
| `aiVoiceToggle` | функція | `src/scripts/core/15-flow-spot.js:271` |
| `aiRenderHead` | функція | `src/scripts/core/15-flow-spot.js:278` |
| `aiMemSheet` | функція | `src/scripts/core/15-flow-spot.js:322` |
| `aiRenderViews` | функція | `src/scripts/core/15-flow-spot.js:344` |
| `aiLogHTML` | функція | `src/scripts/core/15-flow-spot.js:349` |
| `aiTlHTML` | функція | `src/scripts/core/15-flow-spot.js:356` |
| `aiActsHTML` | функція | `src/scripts/core/15-flow-spot.js:379` |
| `aiTraceLiveHTML` | функція | `src/scripts/core/15-flow-spot.js:419` |
| `aiTraceRowHTML` | функція | `src/scripts/core/15-flow-spot.js:425` |
| `AI_SHELF_GO` | обʼєкт | `src/scripts/core/15-flow-spot.js:430` |
| `aiShelfHTML` | функція | `src/scripts/core/15-flow-spot.js:431` |
| `aiTraceKpisHTML` | функція | `src/scripts/core/15-flow-spot.js:441` |
| `aiWireBody` | функція | `src/scripts/core/15-flow-spot.js:456` |
| `aiChipsHTML` | функція | `src/scripts/core/15-flow-spot.js:477` |
| `AI_SVG` | обʼєкт | `src/scripts/core/15-flow-spot.js:483` |
| `AI_ICO` | обʼєкт | `src/scripts/core/15-flow-spot.js:491` |
| `aiIco` | функція | `src/scripts/core/15-flow-spot.js:514` |
| `aiMD` | функція | `src/scripts/core/15-flow-spot.js:519` |
| `aiBusyHTML` | функція | `src/scripts/core/15-flow-spot.js:525` |
| `aiSlashHide` | функція | `src/scripts/core/15-flow-spot.js:533` |
| `aiSlashShow` | функція | `src/scripts/core/15-flow-spot.js:534` |
| `aiAttachRender` | функція | `src/scripts/core/15-flow-spot.js:549` |
| `aiImgShrink` | функція | `src/scripts/core/15-flow-spot.js:561` |
| `aiFileB64` | функція | `src/scripts/core/15-flow-spot.js:578` |
| `aiPickFile` | функція | `src/scripts/core/15-flow-spot.js:586` |
| `aiPlusSheet` | функція | `src/scripts/core/15-flow-spot.js:611` |
| `aiPromptsSheet` | функція | `src/scripts/core/15-flow-spot.js:631` |
| `aiPromptEdit` | функція | `src/scripts/core/15-flow-spot.js:650` |
| `aiEnvKpi` | функція | `src/scripts/core/15-flow-spot.js:667` |
| `aiPlanCardHTML` | функція | `src/scripts/core/15-flow-spot.js:675` |
| `aiRenderBody` | функція | `src/scripts/core/15-flow-spot.js:701` |
| `AI_SKILLS` | обʼєкт | `src/scripts/core/15-flow-spot.js:751` |
| `aiSkillFor` | функція | `src/scripts/core/15-flow-spot.js:763` |
| `aiSumBusy` | значення | `src/scripts/core/15-flow-spot.js:770` |
| `aiMaybeSummarize` | функція | `src/scripts/core/15-flow-spot.js:771` |
| `aiChatSend` | функція | `src/scripts/core/15-flow-spot.js:783` |
| `aiRec` | значення | `src/scripts/core/15-flow-spot.js:879` |
| `aiMicUI` | функція | `src/scripts/core/15-flow-spot.js:880` |
| `aiMicToggle` | функція | `src/scripts/core/15-flow-spot.js:881` |
| `aiTranscribeBlob` | функція | `src/scripts/core/15-flow-spot.js:919` |
| `aiTranscribe` | функція | `src/scripts/core/15-flow-spot.js:942` |
| `window.aiChatSheet` | значення | `src/scripts/core/15-flow-spot.js:946` |
| `plStreak` | функція | `src/scripts/core/15-flow-spot.js:948` |
| `heroWeekDays` | функція | `src/scripts/core/15-flow-spot.js:967` |
| `heroMonthDays` | функція | `src/scripts/core/15-flow-spot.js:985` |
| `heroDayWord` | функція | `src/scripts/core/15-flow-spot.js:996` |
| `renderHeroStreak` | функція | `src/scripts/core/15-flow-spot.js:1002` |
| `plRolloverHTML` | функція | `src/scripts/core/15-flow-spot.js:1025` |
| `plDaySummaryHTML` | функція | `src/scripts/core/15-flow-spot.js:1037` |
| `plAutoSuggestHTML` | функція | `src/scripts/core/15-flow-spot.js:1071` |
| `plWeekCalHTML` | функція | `src/scripts/core/15-flow-spot.js:1113` |
| `plBlocksDisplay` | функція | `src/scripts/core/15-flow-spot.js:1140` |
| `plFolderComplete` | функція | `src/scripts/core/15-flow-spot.js:1154` |
| `DOW_UA` | масив | `src/scripts/core/15-flow-spot.js:1159` |
| `plRuleDowsLabel` | функція | `src/scripts/core/15-flow-spot.js:1160` |
| `plFolderDaySheet` | функція | `src/scripts/core/15-flow-spot.js:1169` |
| `plFolderMonthSheet` | функція | `src/scripts/core/15-flow-spot.js:1226` |
| `PL_MXQ` | масив | `src/scripts/core/15-flow-spot.js:1291` |
| `plMatrixHTML` | функція | `src/scripts/core/15-flow-spot.js:1292` |
| `plMxSchedule` | функція | `src/scripts/core/15-flow-spot.js:1311` |
| `plSlotTask` | функція | `src/scripts/core/15-flow-spot.js:1325` |
| `plBacklogHTML` | функція | `src/scripts/core/15-flow-spot.js:1339` |
| `plInboxHTML` | функція | `src/scripts/core/15-flow-spot.js:1354` |
| `plBlockEnd` | функція | `src/scripts/core/15-flow-spot.js:1369` |
| `plDayHTML` | функція | `src/scripts/core/15-flow-spot.js:1370` |
| `plTaskCard` | функція | `src/scripts/core/15-flow-spot.js:1579` |
| `plAdd` | функція | `src/scripts/core/15-flow-spot.js:1602` |
| `plAddBlockAt` | функція | `src/scripts/core/15-flow-spot.js:1629` |
| `plLinkTag` | функція | `src/scripts/core/15-flow-spot.js:1634` |
| `plScheduleStep` | функція | `src/scripts/core/15-flow-spot.js:1642` |
| `plMicroBlock` | функція | `src/scripts/core/15-flow-spot.js:1659` |
| `plCompleteBlock` | функція | `src/scripts/core/15-flow-spot.js:1672` |
| `plUncompleteEffects` | функція | `src/scripts/core/15-flow-spot.js:1727` |
| `plToast` | функція | `src/scripts/core/15-flow-spot.js:1743` |
| `plBlockSheet` | функція | `src/scripts/core/15-flow-spot.js:1751` |
| `plEditBlock` | функція | `src/scripts/core/15-flow-spot.js:1973` |
| `plRangeSheet` | функція | `src/scripts/core/15-flow-spot.js:1976` |

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
| `inputModal` | функція | `src/scripts/core/16-dashboard.js:249` |
| `createFolder` | функція | `src/scripts/core/16-dashboard.js:282` |
| `createProjectFolder` | функція | `src/scripts/core/16-dashboard.js:297` |
| `openPhotoCropEditor` | функція | `src/scripts/core/16-dashboard.js:324` |
| `openFolderMenu` | функція | `src/scripts/core/16-dashboard.js:387` |
| `closeFolderMenu` | функція | `src/scripts/core/16-dashboard.js:440` |
| `openFolderIconPicker` | функція | `src/scripts/core/16-dashboard.js:447` |
| `openFolderMovePicker` | функція | `src/scripts/core/16-dashboard.js:480` |
| `folderAction` | функція | `src/scripts/core/16-dashboard.js:496` |
| `cycleFolderColor` | функція | `src/scripts/core/16-dashboard.js:520` |
| `pickFolderPhoto` | функція | `src/scripts/core/16-dashboard.js:526` |

### `src/scripts/core/17-folder-render.js` — 2 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `debtTotals` | функція | `src/scripts/core/17-folder-render.js:5` |
| `debtSummary` | функція | `src/scripts/core/17-folder-render.js:10` |

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
| `exportSpend` | функція | `src/scripts/core/19-spending.js:124` |
| `clearSpend` | функція | `src/scripts/core/19-spending.js:133` |

### `src/scripts/core/20-work.js` — 50 сутностей

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
| `transferPlannedToEnvelopes` | функція | `src/scripts/core/20-work.js:267` |
| `workPlannedTotal` | функція | `src/scripts/core/20-work.js:284` |
| `openAllocModal` | функція | `src/scripts/core/20-work.js:288` |
| `allocUpdateSummary` | функція | `src/scripts/core/20-work.js:311` |
| `allocSave` | функція | `src/scripts/core/20-work.js:322` |
| `renderWork` | функція | `src/scripts/core/20-work.js:339` |
| `workShiftMonth` | функція | `src/scripts/core/20-work.js:443` |
| `pushWorkToFin` | функція | `src/scripts/core/20-work.js:450` |
| `delWork` | функція | `src/scripts/core/20-work.js:464` |
| `clearWorkMonth` | функція | `src/scripts/core/20-work.js:474` |

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

### `src/scripts/core/23-board.js` — 30 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `BKEY` | значення | `src/scripts/core/23-board.js:2` |
| `boards` | обʼєкт | `src/scripts/core/23-board.js:3` |
| `boardKey` | значення | `src/scripts/core/23-board.js:4` |
| `folderPath` | масив | `src/scripts/core/23-board.js:5` |
| `curBoard` | функція | `src/scripts/core/23-board.js:7` |
| `blocks` | масив | `src/scripts/core/23-board.js:8` |
| `syncBlocks` | функція | `src/scripts/core/23-board.js:9` |
| `resortPinned` | функція | `src/scripts/core/23-board.js:50` |
| `BLOCK_TYPES` | обʼєкт | `src/scripts/core/23-board.js:60` |
| `WIDGET_TYPES` | масив | `src/scripts/core/23-board.js:111` |
| `PROJECT_BLOCKS` | масив | `src/scripts/core/23-board.js:113` |
| `PROJECT_ONLY` | масив | `src/scripts/core/23-board.js:114` |
| `ICONS` | обʼєкт | `src/scripts/core/23-board.js:117` |
| `blockIcon` | функція | `src/scripts/core/23-board.js:157` |
| `blockSearchText` | функція | `src/scripts/core/23-board.js:166` |
| `collectBlocks` | функція | `src/scripts/core/23-board.js:182` |
| `window.flowSearchBoards` | функція | `src/scripts/core/23-board.js:191` |
| `window.flowOpenBlock` | функція | `src/scripts/core/23-board.js:208` |
| `undoSnapshot` | значення | `src/scripts/core/23-board.js:227` |
| `snapshotForUndo` | функція | `src/scripts/core/23-board.js:228` |
| `hideUndo` | функція | `src/scripts/core/23-board.js:238` |
| `doUndo` | функція | `src/scripts/core/23-board.js:239` |
| `INBOX_TITLE` | значення | `src/scripts/core/23-board.js:256` |
| `INBOX_FKEY` | значення | `src/scripts/core/23-board.js:257` |
| `ensureInboxFolder` | функція | `src/scripts/core/23-board.js:258` |
| `openQuickCapture` | функція | `src/scripts/core/23-board.js:271` |
| `closeQuickCapture` | функція | `src/scripts/core/23-board.js:277` |
| `saveQuickCapture` | функція | `src/scripts/core/23-board.js:278` |
| `window.flowQuickCapture` | значення | `src/scripts/core/23-board.js:306` |
| `window.flowOpenInbox` | функція | `src/scripts/core/23-board.js:308` |

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
| `autoSize` | функція | `src/scripts/core/26-blocks-render.js:54` |
| `szClass` | функція | `src/scripts/core/26-blocks-render.js:68` |
| `headBar` | функція | `src/scripts/core/26-blocks-render.js:74` |
| `BENTO_SKIP` | обʼєкт | `src/scripts/core/26-blocks-render.js:97` |
| `renderTileFull` | функція | `src/scripts/core/26-blocks-render.js:99` |
| `bentoSectionsHtml` | функція | `src/scripts/core/26-blocks-render.js:112` |
| `renderTile` | функція | `src/scripts/core/26-blocks-render.js:142` |
| `focusItem` | функція | `src/scripts/core/26-blocks-render.js:812` |
| `bindTiles` | функція | `src/scripts/core/26-blocks-render.js:821` |

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
| `migLegacyWidgets` | функція | `src/scripts/core/27-canvas.js:171` |
| `migBoardPat` | функція | `src/scripts/core/27-canvas.js:188` |
| `migForceLayoutOff` | функція | `src/scripts/core/27-canvas.js:194` |
| `MIGRATIONS_ONCE` | масив | `src/scripts/core/27-canvas.js:224` |
| `migDeferred` | значення | `src/scripts/core/27-canvas.js:243` |
| `runMigrations` | функція | `src/scripts/core/27-canvas.js:244` |
| `applyFolderCfgRaw` | функція | `src/scripts/core/27-canvas.js:283` |
| `applyFolderOrderRaw` | функція | `src/scripts/core/27-canvas.js:297` |
| `loadInFlight` | значення | `src/scripts/core/27-canvas.js:307` |
| `load` | функція | `src/scripts/core/27-canvas.js:308` |
| `loadOnce` | функція | `src/scripts/core/27-canvas.js:313` |
| `vv` | значення | `src/scripts/core/27-canvas.js:481` |
| `FIELD` | значення | `src/scripts/core/27-canvas.js:482` |
| `isField` | функція | `src/scripts/core/27-canvas.js:484` |
| `kbHeight` | функція | `src/scripts/core/27-canvas.js:487` |
| `syncKb` | функція | `src/scripts/core/27-canvas.js:491` |
| `ensureVisible` | функція | `src/scripts/core/27-canvas.js:498` |
| `VISION_FKEY` | значення | `src/scripts/core/27-canvas.js:534` |
| `migrateFolderPhotosOnce` | функція | `src/scripts/core/27-canvas.js:541` |
| `removeSystemSeedFoldersOnce` | функція | `src/scripts/core/27-canvas.js:559` |

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
| `vzRzMenu` | функція | `src/scripts/core/28-vision.js:220` |
| `vzKtStats` | функція | `src/scripts/core/28-vision.js:239` |
| `vzKtAnswer` | функція | `src/scripts/core/28-vision.js:246` |
| `vzKtMenu` | функція | `src/scripts/core/28-vision.js:250` |
| `vzFocus` | обʼєкт | `src/scripts/core/28-vision.js:269` |
| `vzQueue` | функція | `src/scripts/core/28-vision.js:270` |
| `vzFocusStop` | функція | `src/scripts/core/28-vision.js:280` |
| `vzFocusDone` | функція | `src/scripts/core/28-vision.js:281` |
| `renderVisionFocus` | функція | `src/scripts/core/28-vision.js:291` |
| `renderVision` | функція | `src/scripts/core/28-vision.js:331` |
| `goVision` | функція | `src/scripts/core/28-vision.js:526` |
| `window.goVision` | значення | `src/scripts/core/28-vision.js:527` |

### `src/scripts/core/29-more-screen.js` — 21 сутностей

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
| `flowStorageInfo` | функція | `src/scripts/core/29-more-screen.js:134` |
| `fmtMem` | функція | `src/scripts/core/29-more-screen.js:143` |
| `fillMemRow` | функція | `src/scripts/core/29-more-screen.js:144` |
| `renderAccount` | функція | `src/scripts/core/29-more-screen.js:159` |
| `window.renderAccount` | значення | `src/scripts/core/29-more-screen.js:418` |
| `hm` | значення | `src/scripts/core/29-more-screen.js:428` |
| `na` | функція | `src/scripts/core/29-more-screen.js:429` |
| `nm` | значення | `src/scripts/core/29-more-screen.js:430` |

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
| `hitHTML` | функція | `src/scripts/core/32-global-search.js:59` |
| `render` | функція | `src/scripts/core/32-global-search.js:69` |
| `open` | функція | `src/scripts/core/32-global-search.js:132` |
| `close` | функція | `src/scripts/core/32-global-search.js:139` |
| `window.flowGlobalSearch` | значення | `src/scripts/core/32-global-search.js:140` |
| `hb` | значення | `src/scripts/core/32-global-search.js:150` |

### `src/scripts/core/33-home-widgets.js` — 14 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `hwEsc` | функція | `src/scripts/core/33-home-widgets.js:6` |
| `hwFmt` | функція | `src/scripts/core/33-home-widgets.js:7` |
| `hwHour` | функція | `src/scripts/core/33-home-widgets.js:8` |
| `nextBlocks` | функція | `src/scripts/core/33-home-widgets.js:11` |
| `diaryStreak` | функція | `src/scripts/core/33-home-widgets.js:20` |
| `cardHTML` | функція | `src/scripts/core/33-home-widgets.js:30` |
| `hwIco` | функція | `src/scripts/core/33-home-widgets.js:32` |
| `OV_KEY` | значення | `src/scripts/core/33-home-widgets.js:38` |
| `ovOpen` | значення | `src/scripts/core/33-home-widgets.js:39` |
| `applyOv` | функція | `src/scripts/core/33-home-widgets.js:43` |
| `toggleOv` | функція | `src/scripts/core/33-home-widgets.js:57` |
| `miniHTML` | функція | `src/scripts/core/33-home-widgets.js:66` |
| `render` | функція | `src/scripts/core/33-home-widgets.js:75` |
| `window.renderHomeWidgets` | значення | `src/scripts/core/33-home-widgets.js:117` |

### `src/scripts/core/34-shortcuts.js` — 5 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MAP` | обʼєкт | `src/scripts/core/34-shortcuts.js:6` |
| `typing` | функція | `src/scripts/core/34-shortcuts.js:14` |
| `ks` | значення | `src/scripts/core/34-shortcuts.js:19` |
| `sheetHTML` | функція | `src/scripts/core/34-shortcuts.js:20` |
| `sheetToggle` | функція | `src/scripts/core/34-shortcuts.js:32` |

### `src/scripts/core/35-channel.js` — 62 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `chKey` | значення | `src/scripts/core/35-channel.js:14` |
| `chTopic` | значення | `src/scripts/core/35-channel.js:15` |
| `chOrigin` | значення | `src/scripts/core/35-channel.js:16` |
| `chMode` | значення | `src/scripts/core/35-channel.js:17` |
| `chRec` | значення | `src/scripts/core/35-channel.js:18` |
| `chLongPressed` | значення | `src/scripts/core/35-channel.js:19` |
| `chAiBusy` | значення | `src/scripts/core/35-channel.js:20` |
| `CH_I` | обʼєкт | `src/scripts/core/35-channel.js:22` |
| `chI` | функція | `src/scripts/core/35-channel.js:46` |
| `chToast` | функція | `src/scripts/core/35-channel.js:47` |
| `chHaptic` | функція | `src/scripts/core/35-channel.js:48` |
| `chChat` | функція | `src/scripts/core/35-channel.js:49` |
| `chBoardKey` | функція | `src/scripts/core/35-channel.js:50` |
| `chTargetBk` | функція | `src/scripts/core/35-channel.js:52` |
| `chFolders` | функція | `src/scripts/core/35-channel.js:54` |
| `chUid` | функція | `src/scripts/core/35-channel.js:56` |
| `chPlain` | функція | `src/scripts/core/35-channel.js:58` |
| `chTxt` | функція | `src/scripts/core/35-channel.js:63` |
| `chTimeOf` | функція | `src/scripts/core/35-channel.js:66` |
| `chDayLabel` | функція | `src/scripts/core/35-channel.js:76` |
| `chHM` | функція | `src/scripts/core/35-channel.js:87` |
| `chItems` | функція | `src/scripts/core/35-channel.js:90` |
| `chPhotos` | функція | `src/scripts/core/35-channel.js:97` |
| `goChat` | функція | `src/scripts/core/35-channel.js:109` |
| `goChannel` | функція | `src/scripts/core/35-channel.js:122` |
| `chBack` | функція | `src/scripts/core/35-channel.js:127` |
| `chScrollBottom` | функція | `src/scripts/core/35-channel.js:138` |
| `chFitFeed` | функція | `src/scripts/core/35-channel.js:144` |
| `renderChannel` | функція | `src/scripts/core/35-channel.js:149` |
| `chCoverApi` | функція | `src/scripts/core/35-channel.js:158` |
| `chSubText` | функція | `src/scripts/core/35-channel.js:160` |
| `chSyncSub` | функція | `src/scripts/core/35-channel.js:167` |
| `renderChCover` | функція | `src/scripts/core/35-channel.js:168` |
| `chCoverSheet` | функція | `src/scripts/core/35-channel.js:191` |
| `chMoreSheet` | функція | `src/scripts/core/35-channel.js:205` |
| `renderChChips` | функція | `src/scripts/core/35-channel.js:224` |
| `chOpenFolder` | функція | `src/scripts/core/35-channel.js:241` |
| `chFolderChipSheet` | функція | `src/scripts/core/35-channel.js:247` |
| `chAttachLongPress` | функція | `src/scripts/core/35-channel.js:257` |
| `renderChFeed` | функція | `src/scripts/core/35-channel.js:267` |
| `chBubble` | функція | `src/scripts/core/35-channel.js:291` |
| `chAiSync` | функція | `src/scripts/core/35-channel.js:338` |
| `chAiCollect` | функція | `src/scripts/core/35-channel.js:355` |
| `chAiSummarize` | функція | `src/scripts/core/35-channel.js:381` |
| `chBindFeed` | функція | `src/scripts/core/35-channel.js:423` |
| `chJumpTo` | функція | `src/scripts/core/35-channel.js:443` |
| `chRecordSheet` | функція | `src/scripts/core/35-channel.js:455` |
| `chEditRecord` | функція | `src/scripts/core/35-channel.js:474` |
| `chCopyToFolder` | функція | `src/scripts/core/35-channel.js:495` |
| `chPickCopyTarget` | функція | `src/scripts/core/35-channel.js:502` |
| `chDeleteRecord` | функція | `src/scripts/core/35-channel.js:511` |
| `chInitComposer` | функція | `src/scripts/core/35-channel.js:520` |
| `chAutoGrow` | функція | `src/scripts/core/35-channel.js:565` |
| `chSyncSend` | функція | `src/scripts/core/35-channel.js:566` |
| `chSetMode` | функція | `src/scripts/core/35-channel.js:572` |
| `chToggleTray` | функція | `src/scripts/core/35-channel.js:578` |
| `chPushBlock` | функція | `src/scripts/core/35-channel.js:584` |
| `chSend` | функція | `src/scripts/core/35-channel.js:591` |
| `chPickFile` | функція | `src/scripts/core/35-channel.js:604` |
| `chShrink` | функція | `src/scripts/core/35-channel.js:610` |
| `chVoice` | функція | `src/scripts/core/35-channel.js:621` |
| `chSheet` | функція | `src/scripts/core/35-channel.js:652` |

### `src/scripts/core/36-chats.js` — 39 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `CHATS_KEY` | значення | `src/scripts/core/36-chats.js:14` |
| `INBOX_CHAT` | значення | `src/scripts/core/36-chats.js:15` |
| `CHAT_PALETTE` | масив | `src/scripts/core/36-chats.js:16` |
| `chats` | масив | `src/scripts/core/36-chats.js:17` |
| `HTAB_KEY` | значення | `src/scripts/core/36-chats.js:20` |
| `homeTab` | значення | `src/scripts/core/36-chats.js:21` |
| `chatBk` | функція | `src/scripts/core/36-chats.js:25` |
| `chatById` | функція | `src/scripts/core/36-chats.js:26` |
| `chatsForFolder` | функція | `src/scripts/core/36-chats.js:27` |
| `chatFolders` | функція | `src/scripts/core/36-chats.js:29` |
| `chatUid` | функція | `src/scripts/core/36-chats.js:30` |
| `normChat` | функція | `src/scripts/core/36-chats.js:31` |
| `saveChats` | функція | `src/scripts/core/36-chats.js:37` |
| `applyChatsRaw` | функція | `src/scripts/core/36-chats.js:40` |
| `chatCreate` | функція | `src/scripts/core/36-chats.js:46` |
| `createChat` | функція | `src/scripts/core/36-chats.js:58` |
| `chatRename` | функція | `src/scripts/core/36-chats.js:67` |
| `chatDelete` | функція | `src/scripts/core/36-chats.js:76` |
| `chatsRefresh` | функція | `src/scripts/core/36-chats.js:90` |
| `ensureInboxChat` | функція | `src/scripts/core/36-chats.js:97` |
| `chatsMigrateInboxOnce` | функція | `src/scripts/core/36-chats.js:109` |
| `chatLinkFolder` | функція | `src/scripts/core/36-chats.js:141` |
| `chatUnlinkFolder` | функція | `src/scripts/core/36-chats.js:151` |
| `linkableFolders` | функція | `src/scripts/core/36-chats.js:156` |
| `chatAddSheet` | функція | `src/scripts/core/36-chats.js:162` |
| `newFolderForChat` | функція | `src/scripts/core/36-chats.js:177` |
| `pickFolderForChat` | функція | `src/scripts/core/36-chats.js:189` |
| `setHomeTab` | функція | `src/scripts/core/36-chats.js:200` |
| `chatsHomeSync` | функція | `src/scripts/core/36-chats.js:209` |
| `chatLast` | функція | `src/scripts/core/36-chats.js:225` |
| `chatPreview` | функція | `src/scripts/core/36-chats.js:231` |
| `chatTimeLabel` | функція | `src/scripts/core/36-chats.js:240` |
| `renderChatList` | функція | `src/scripts/core/36-chats.js:247` |
| `chatMenu` | функція | `src/scripts/core/36-chats.js:274` |
| `pgFolderKey` | функція | `src/scripts/core/36-chats.js:288` |
| `renderPgLinks` | функція | `src/scripts/core/36-chats.js:289` |
| `folderAddSheet` | функція | `src/scripts/core/36-chats.js:304` |
| `pickChatForFolder` | функція | `src/scripts/core/36-chats.js:319` |
| `chatsInit` | функція | `src/scripts/core/36-chats.js:329` |

### `src/scripts/page-editor/01-palette.js` — 17 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `PGS_CATS` | масив | `src/scripts/page-editor/01-palette.js:5` |
| `CATALOG` | масив | `src/scripts/page-editor/01-palette.js:12` |
| `PGS_SYN` | обʼєкт | `src/scripts/page-editor/01-palette.js:47` |
| `PGS_ICONS` | обʼєкт | `src/scripts/page-editor/01-palette.js:76` |
| `pgsIc` | функція | `src/scripts/page-editor/01-palette.js:130` |
| `bridge` | функція | `src/scripts/page-editor/01-palette.js:132` |
| `editor` | значення | `src/scripts/page-editor/01-palette.js:133` |
| `scr` | значення | `src/scripts/page-editor/01-palette.js:134` |
| `uid` | функція | `src/scripts/page-editor/01-palette.js:135` |
| `esc` | функція | `src/scripts/page-editor/01-palette.js:136` |
| `txtOf` | функція | `src/scripts/page-editor/01-palette.js:139` |
| `setTxt` | функція | `src/scripts/page-editor/01-palette.js:140` |
| `locate` | функція | `src/scripts/page-editor/01-palette.js:142` |
| `save` | функція | `src/scripts/page-editor/01-palette.js:150` |
| `moveBlock` | функція | `src/scripts/page-editor/01-palette.js:154` |
| `snapshotArr` | функція | `src/scripts/page-editor/01-palette.js:176` |
| `restoreArr` | функція | `src/scripts/page-editor/01-palette.js:177` |

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
| `render` | функція | `src/scripts/page-editor/02-block-styles.js:605` |
| `fillWidgetHosts` | функція | `src/scripts/page-editor/02-block-styles.js:663` |
| `window.__pgWidgetsSync` | функція | `src/scripts/page-editor/02-block-styles.js:674` |
| `caretEnd` | функція | `src/scripts/page-editor/02-block-styles.js:680` |
| `slashCtx` | значення | `src/scripts/page-editor/02-block-styles.js:683` |
| `slash` | значення | `src/scripts/page-editor/02-block-styles.js:776` |
| `srail` | значення | `src/scripts/page-editor/02-block-styles.js:778` |
| `pgsCat` | значення | `src/scripts/page-editor/02-block-styles.js:779` |
| `pgsFiltered` | функція | `src/scripts/page-editor/02-block-styles.js:780` |
| `buildRail` | функція | `src/scripts/page-editor/02-block-styles.js:790` |
| `buildSlash` | функція | `src/scripts/page-editor/02-block-styles.js:799` |

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
| `THKEY` | значення | `src/scripts/page-editor/03-premium-pack.js:539` |
| `applyTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:540` |
| `pageThemeDefault` | функція | `src/scripts/page-editor/03-premium-pack.js:543` |
| `pgTitle` | значення | `src/scripts/page-editor/03-premium-pack.js:561` |
| `addBtn` | значення | `src/scripts/page-editor/03-premium-pack.js:571` |
| `CD_MONTHS` | масив | `src/scripts/page-editor/03-premium-pack.js:580` |
| `cdFmt` | функція | `src/scripts/page-editor/03-premium-pack.js:581` |
| `cdHTML` | функція | `src/scripts/page-editor/03-premium-pack.js:586` |

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

### `src/scripts/page-editor/08-w-projects-hub.js` — 43 сутностей

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
| `covSaveT` | значення | `src/scripts/page-editor/08-w-projects-hub.js:765` |
| `saveCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:766` |
| `saveCoversSoon` | функція | `src/scripts/page-editor/08-w-projects-hub.js:775` |
| `flushCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:779` |
| `COV_GRADS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:789` |
| `covEl` | значення | `src/scripts/page-editor/08-w-projects-hub.js:795` |
| `covKey` | функція | `src/scripts/page-editor/08-w-projects-hub.js:806` |
| `covMenuHTML` | функція | `src/scripts/page-editor/08-w-projects-hub.js:807` |
| `renderCover` | функція | `src/scripts/page-editor/08-w-projects-hub.js:814` |
| `covPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:844` |
| `covEdBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:885` |
| `covEdState` | функція | `src/scripts/page-editor/08-w-projects-hub.js:886` |
| `covEdSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:892` |
| `covEdBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:905` |
| `covEdOpen` | функція | `src/scripts/page-editor/08-w-projects-hub.js:959` |
| `covEdClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:960` |

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
| `window.openFlowPage` | функція | `src/scripts/page-editor/09-journal-sheet.js:440` |

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

### `src/web/sw.js` — 3 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `VERSION` | значення | `src/web/sw.js:5` |
| `CACHE` | значення | `src/web/sw.js:6` |
| `PRECACHE` | масив | `src/web/sw.js:7` |

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

### `tools/test-migrations.js` — 27 сутностей

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
| `fakeSession` | функція | `tools/test-migrations.js:66` |
| `problems` | масив | `tools/test-migrations.js:74` |
| `bad` | функція | `tools/test-migrations.js:75` |
| `sleep` | функція | `tools/test-migrations.js:76` |
| `errors` | масив | `tools/test-migrations.js:77` |
| `blank` | значення | `tools/test-migrations.js:85` |
| `makeWin` | функція | `tools/test-migrations.js:88` |
| `seed` | функція | `tools/test-migrations.js:101` |
| `start` | функція | `tools/test-migrations.js:105` |
| `snap` | функція | `tools/test-migrations.js:106` |
| `js` | функція | `tools/test-migrations.js:108` |
| `diff` | функція | `tools/test-migrations.js:109` |
| `isStore` | функція | `tools/test-migrations.js:117` |
| `dataOf` | функція | `tools/test-migrations.js:118` |
| `scenarioA` | функція | `tools/test-migrations.js:120` |
| `scenarioSilent` | функція | `tools/test-migrations.js:178` |

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
