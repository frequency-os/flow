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
| Файлів JS | 72 |
| Рядків JS | 29099 |
| Файлів CSS | 34 |
| Рядків CSS | 8747 |
| Сутностей верхнього рівня | 1825 |
| Ключів сховища (FLOW_KEYS) | 72 |

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
| `src/scripts/44-week.js` | 334 | 0 |
| `src/scripts/45-month.js` | 662 | 0 |
| `src/scripts/46-mx.js` | 220 | 0 |
| `src/scripts/core/01-base.js` | 404 | 39 |
| `src/scripts/core/02-storage.js` | 1992 | 165 |
| `src/scripts/core/03-platform.js` | 60 | 14 |
| `src/scripts/core/04-folders-nav.js` | 439 | 60 |
| `src/scripts/core/05-spaces.js` | 684 | 60 |
| `src/scripts/core/06-wishes.js` | 1192 | 92 |
| `src/scripts/core/07-values.js` | 202 | 18 |
| `src/scripts/core/08-finance.js` | 922 | 92 |
| `src/scripts/core/09-goals.js` | 665 | 25 |
| `src/scripts/core/10-planner.js` | 911 | 49 |
| `src/scripts/core/11-ai-flow.js` | 258 | 26 |
| `src/scripts/core/12-ai-agent.js` | 1749 | 92 |
| `src/scripts/core/13-pets.js` | 216 | 13 |
| `src/scripts/core/14-react.js` | 335 | 43 |
| `src/scripts/core/15-flow-spot.js` | 2064 | 97 |
| `src/scripts/core/16-dashboard.js` | 559 | 21 |
| `src/scripts/core/17-folder-render.js` | 16 | 2 |
| `src/scripts/core/18-debts.js` | 190 | 18 |
| `src/scripts/core/19-spending.js` | 136 | 14 |
| `src/scripts/core/20-work.js` | 487 | 50 |
| `src/scripts/core/21-patterns.js` | 191 | 21 |
| `src/scripts/core/22-diary.js` | 531 | 54 |
| `src/scripts/core/23-board.js` | 330 | 32 |
| `src/scripts/core/24-reminders.js` | 196 | 16 |
| `src/scripts/core/25-reader.js` | 566 | 40 |
| `src/scripts/core/26-blocks-render.js` | 1651 | 16 |
| `src/scripts/core/27-canvas.js` | 590 | 27 |
| `src/scripts/core/28-vision.js` | 529 | 42 |
| `src/scripts/core/29-more-screen.js` | 501 | 22 |
| `src/scripts/core/30-upgrade.js` | 296 | 30 |
| `src/scripts/core/31-my-year.js` | 200 | 21 |
| `src/scripts/core/32-global-search.js` | 152 | 13 |
| `src/scripts/core/33-home-widgets.js` | 133 | 14 |
| `src/scripts/core/34-shortcuts.js` | 54 | 5 |
| `src/scripts/core/35-channel.js` | 702 | 65 |
| `src/scripts/core/36-chats.js` | 350 | 40 |
| `src/scripts/core/37-ai-privacy.js` | 203 | 20 |
| `src/scripts/core/38-world.js` | 86 | 7 |
| `src/scripts/core/39-spheres.js` | 232 | 20 |
| `src/scripts/page-editor/01-palette.js` | 177 | 17 |
| `src/scripts/page-editor/02-block-styles.js` | 904 | 47 |
| `src/scripts/page-editor/03-premium-pack.js` | 602 | 27 |
| `src/scripts/page-editor/04-w-journal.js` | 107 | 9 |
| `src/scripts/page-editor/05-w-decisions.js` | 112 | 4 |
| `src/scripts/page-editor/06-w-project.js` | 100 | 6 |
| `src/scripts/page-editor/07-w-habits.js` | 69 | 4 |
| `src/scripts/page-editor/08-w-projects-hub.js` | 983 | 44 |
| `src/scripts/page-editor/09-journal-sheet.js` | 488 | 37 |
| `src/scripts/page-editor/10-mic.js` | 155 | 10 |
| `src/vendor/jszip.min.js` _(мініфікований вендор)_ | 13 | — |
| `src/vendor/pdf.min.js` _(мініфікований вендор)_ | 22 | — |
| `src/vendor/supabase.min.js` _(мініфікований вендор)_ | 11 | — |
| `src/web/misto-assets.js` _(мініфікований вендор)_ | 43 | — |
| `src/web/sw.js` | 107 | 9 |
| `tools/make-icon.js` | 40 | 5 |
| `tools/scriptcheck.js` | 98 | 12 |
| `tools/smoke.js` | 61 | 5 |
| `tools/test-migrations.js` | 230 | 27 |
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
| `src/styles/core/01-tokens-base.css` | 349 | 9 |
| `src/styles/core/02-page-editor.css` | 1253 | 10 |
| `src/styles/core/03-folders-projects.css` | 578 | 0 |
| `src/styles/core/04-menus.css` | 89 | 0 |
| `src/styles/core/05-values-wishes.css` | 186 | 0 |
| `src/styles/core/06-goals.css` | 228 | 0 |
| `src/styles/core/07-finance.css` | 597 | 0 |
| `src/styles/core/08-work.css` | 202 | 0 |
| `src/styles/core/09-board-canvas.css` | 193 | 3 |
| `src/styles/core/10-reader-blocks.css` | 461 | 4 |
| `src/styles/core/11-spaces-desktop.css` | 211 | 0 |
| `src/styles/core/12-pets-more-planner.css` | 1206 | 0 |
| `src/styles/core/13-search-capture.css` | 84 | 0 |
| `src/styles/core/15-vision.css` | 172 | 0 |
| `src/styles/core/16-upgrade.css` | 54 | 0 |
| `src/styles/core/17-my-year.css` | 64 | 0 |
| `src/styles/core/18-channel.css` | 178 | 0 |
| `src/styles/core/19-chats.css` | 69 | 0 |
| `src/styles/core/20-world.css` | 29 | 0 |
| `src/styles/core/21-spheres.css` | 57 | 0 |

## Ключі сховища — FLOW_KEYS (72)

`src/scripts/core/01-base.js`

`0` · `active_space_map_v2` · `ai_chat` · `ai_endpoint` · `ai_memory` · `ai_pet`

`ai_privacy_v1` · `ai_prompts` · `ai_voice` · `blockusage` · `board` · `chats_v1`

`collage_board` · `custom_avatar_v1` · `customboards` · `debts` · `diary_books_v1` · `diary_entries_v1`

`diary_insights_v1` · `envelopes` · `fin_ops` · `fin_recurring` · `flowPgCovers` · `flowcardskin`

`flowprotheme` · `flowtheme` · `folder_widgets` · `folders_cfg` · `folders_deleted_v1` · `folders_order`

`folderview` · `forcedesktop` · `forcemobile` · `fx_cfg` · `fx_mode` · `fx_say`

`goals_data` · `home_glass_on` · `homeov` · `hometab` · `homewidgets` · `i18n_content_cache`

`income_cards` · `lang_pref` · `patterns_chains` · `patterns_score` · `patterns_transform` · `pet_hidden`

`pet_pos` · `pet_sleep` · `readerCfg` · `ritual_board` · `sidebarcol` · `spacecanvas`

`spacecanvaszoom` · `spacefull` · `spaces_map_v2` · `spaceview` · `spacewide` · `spend`

`switcher_style` · `ui_mode` · `upgrade_profile_v1` · `values_state` · `vision_v1` · `wish_active_days_v1`

`wish_price` · `wishes_board` · `work_blocks` · `work_cfg` · `work_extras` · `work_sessions`

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
| `window.FLOW_RAW_KEYS` | масив | `src/scripts/core/01-base.js:172` |
| `getLang` | функція | `src/scripts/core/01-base.js:189` |
| `setLang` | функція | `src/scripts/core/01-base.js:190` |
| `window.__flowLang` | значення | `src/scripts/core/01-base.js:191` |
| `window.flowLang` | значення | `src/scripts/core/01-base.js:192` |
| `window.flowSetLang` | значення | `src/scripts/core/01-base.js:193` |
| `I18N_DICT` | обʼєкт | `src/scripts/core/01-base.js:198` |
| `I18N_WORDS` | масив | `src/scripts/core/01-base.js:250` |
| `wordLevelTranslate` | функція | `src/scripts/core/01-base.js:278` |
| `I18N_NO_TOUCH` | обʼєкт | `src/scripts/core/01-base.js:293` |
| `translateNode` | функція | `src/scripts/core/01-base.js:296` |
| `i18nApply` | функція | `src/scripts/core/01-base.js:319` |
| `window.i18nApply` | значення | `src/scripts/core/01-base.js:323` |
| `i18nBlocked` | функція | `src/scripts/core/01-base.js:327` |
| `raf` | значення | `src/scripts/core/01-base.js:337` |
| `flush` | функція | `src/scripts/core/01-base.js:338` |
| `mo` | функція | `src/scripts/core/01-base.js:345` |
| `contentTranslateOn` | функція | `src/scripts/core/01-base.js:366` |
| `window.flowContentTranslateOn` | значення | `src/scripts/core/01-base.js:369` |
| `hash` | функція | `src/scripts/core/01-base.js:370` |
| `cacheGet` | функція | `src/scripts/core/01-base.js:371` |
| `window.flowTranslateContent` | функція | `src/scripts/core/01-base.js:376` |
| `window.__flowErrors` | масив | `src/scripts/core/01-base.js:392` |
| `push` | функція | `src/scripts/core/01-base.js:393` |
| `window.flowErrors` | функція | `src/scripts/core/01-base.js:402` |

### `src/scripts/core/02-storage.js` — 165 сутностей

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
| `loadSupabaseLib` | функція | `src/scripts/core/02-storage.js:370` |
| `sbReadyEvt` | функція | `src/scripts/core/02-storage.js:390` |
| `sbInit` | функція | `src/scripts/core/02-storage.js:391` |
| `window.sbUser` | функція | `src/scripts/core/02-storage.js:447` |
| `sbFromCloud` | функція | `src/scripts/core/02-storage.js:457` |
| `sbToCloud` | функція | `src/scripts/core/02-storage.js:458` |
| `window.sbAccessToken` | функція | `src/scripts/core/02-storage.js:466` |
| `sbPrefetchAll` | функція | `src/scripts/core/02-storage.js:475` |
| `sbLocalVersion` | функція | `src/scripts/core/02-storage.js:490` |
| `window.sbPrefetchAll` | значення | `src/scripts/core/02-storage.js:498` |
| `window.sbCloudFresher` | функція | `src/scripts/core/02-storage.js:504` |
| `window.sbCacheLocal` | функція | `src/scripts/core/02-storage.js:518` |
| `window.sbDataTrusted` | функція | `src/scripts/core/02-storage.js:533` |
| `keyRead` | обʼєкт | `src/scripts/core/02-storage.js:549` |
| `keyMark` | обʼєкт | `src/scripts/core/02-storage.js:550` |
| `keyRecon` | обʼєкт | `src/scripts/core/02-storage.js:551` |
| `keyPending` | обʼєкт | `src/scripts/core/02-storage.js:552` |
| `sbLastGot` | обʼєкт | `src/scripts/core/02-storage.js:553` |
| `autoDepth` | значення | `src/scripts/core/02-storage.js:554` |
| `sbReconciled` | функція | `src/scripts/core/02-storage.js:555` |
| `window.storeMarkRead` | функція | `src/scripts/core/02-storage.js:557` |
| `window.storeKeyReady` | функція | `src/scripts/core/02-storage.js:577` |
| `window.storeAutoBegin` | функція | `src/scripts/core/02-storage.js:587` |
| `window.storeAuto` | функція | `src/scripts/core/02-storage.js:591` |
| `sbWriteMeta` | функція | `src/scripts/core/02-storage.js:608` |
| `sbMergeHeld` | функція | `src/scripts/core/02-storage.js:633` |
| `HK_PREFIX` | значення | `src/scripts/core/02-storage.js:669` |
| `sbKeepHeld` | функція | `src/scripts/core/02-storage.js:670` |
| `sbReconcile` | функція | `src/scripts/core/02-storage.js:691` |
| `sbCommitReconciled` | функція | `src/scripts/core/02-storage.js:712` |
| `sbSigningIn` | значення | `src/scripts/core/02-storage.js:733` |
| `window.sbSignInGoogle` | функція | `src/scripts/core/02-storage.js:734` |
| `window.sbSignOut` | функція | `src/scripts/core/02-storage.js:809` |
| `origGet` | значення | `src/scripts/core/02-storage.js:847` |
| `origSet` | значення | `src/scripts/core/02-storage.js:848` |
| `origDelete` | значення | `src/scripts/core/02-storage.js:849` |
| `origList` | значення | `src/scripts/core/02-storage.js:850` |
| `sbGet` | функція | `src/scripts/core/02-storage.js:852` |
| `sbWriteQueue` | обʼєкт | `src/scripts/core/02-storage.js:897` |
| `sbWriteTimer` | значення | `src/scripts/core/02-storage.js:898` |
| `sbInFlight` | обʼєкт | `src/scripts/core/02-storage.js:904` |
| `sbFlushSeq` | значення | `src/scripts/core/02-storage.js:910` |
| `sbDoneSeq` | обʼєкт | `src/scripts/core/02-storage.js:911` |
| `sbOutboxSave` | функція | `src/scripts/core/02-storage.js:914` |
| `sbOutboxTimer` | значення | `src/scripts/core/02-storage.js:935` |
| `sbOutboxKeys` | обʼєкт | `src/scripts/core/02-storage.js:936` |
| `sbHiding` | значення | `src/scripts/core/02-storage.js:937` |
| `sbOutboxSaveSoon` | функція | `src/scripts/core/02-storage.js:938` |
| `sbOutboxLoad` | функція | `src/scripts/core/02-storage.js:942` |
| `sbSyncPending` | функція | `src/scripts/core/02-storage.js:949` |
| `sbScheduleWrite` | функція | `src/scripts/core/02-storage.js:950` |
| `sbFlushWrites` | функція | `src/scripts/core/02-storage.js:958` |
| `window.sbFlushWrites` | значення | `src/scripts/core/02-storage.js:1019` |
| `sbOnHide` | функція | `src/scripts/core/02-storage.js:1022` |
| `sbPullChanged` | функція | `src/scripts/core/02-storage.js:1057` |
| `sbLastPull` | значення | `src/scripts/core/02-storage.js:1079` |
| `sbPullFresh` | функція | `src/scripts/core/02-storage.js:1080` |
| `sbPullAndLoad` | функція | `src/scripts/core/02-storage.js:1098` |
| `window.sbPullFresh` | значення | `src/scripts/core/02-storage.js:1121` |
| `window.sbPullAndLoad` | значення | `src/scripts/core/02-storage.js:1122` |
| `PH_KEY` | значення | `src/scripts/core/02-storage.js:1138` |
| `PH_PENDING` | значення | `src/scripts/core/02-storage.js:1139` |
| `phPendingGet` | функція | `src/scripts/core/02-storage.js:1140` |
| `phPendingSet` | функція | `src/scripts/core/02-storage.js:1141` |
| `phPendingAdd` | функція | `src/scripts/core/02-storage.js:1142` |
| `phPendingDrop` | функція | `src/scripts/core/02-storage.js:1143` |
| `PH_TS` | значення | `src/scripts/core/02-storage.js:1148` |
| `phTsGet` | функція | `src/scripts/core/02-storage.js:1149` |
| `phTsSet` | функція | `src/scripts/core/02-storage.js:1150` |
| `phTsDrop` | функція | `src/scripts/core/02-storage.js:1151` |
| `window.sbPhotoPush` | функція | `src/scripts/core/02-storage.js:1153` |
| `window.sbPhotoFetch` | функція | `src/scripts/core/02-storage.js:1169` |
| `window.sbPhotoList` | функція | `src/scripts/core/02-storage.js:1186` |
| `window.sbPhotoDel` | функція | `src/scripts/core/02-storage.js:1201` |
| `phSyncBusy` | значення | `src/scripts/core/02-storage.js:1211` |
| `sbPhotoSync` | функція | `src/scripts/core/02-storage.js:1212` |
| `window.sbPhotoSync` | значення | `src/scripts/core/02-storage.js:1242` |
| `window.sbWipeAll` | функція | `src/scripts/core/02-storage.js:1247` |
| `prefSet` | функція | `src/scripts/core/02-storage.js:1316` |
| `prefCatchup` | функція | `src/scripts/core/02-storage.js:1320` |
| `UIMODE_KEY` | значення | `src/scripts/core/02-storage.js:1333` |
| `window.uiMode` | значення | `src/scripts/core/02-storage.js:1334` |
| `applyUiMode` | функція | `src/scripts/core/02-storage.js:1335` |
| `setUiMode` | функція | `src/scripts/core/02-storage.js:1336` |
| `window.setUiMode` | значення | `src/scripts/core/02-storage.js:1344` |
| `LP` | значення | `src/scripts/core/02-storage.js:1351` |
| `FORMAT` | значення | `src/scripts/core/02-storage.js:1352` |
| `APP` | значення | `src/scripts/core/02-storage.js:1353` |
| `ZIP_JSON` | значення | `src/scripts/core/02-storage.js:1354` |
| `isSvc` | функція | `src/scripts/core/02-storage.js:1360` |
| `RAW_DATA` | масив | `src/scripts/core/02-storage.js:1364` |
| `JSON_KEYS` | масив | `src/scripts/core/02-storage.js:1366` |
| `collect` | функція | `src/scripts/core/02-storage.js:1370` |
| `collectRaw` | функція | `src/scripts/core/02-storage.js:1387` |
| `stats` | функція | `src/scripts/core/02-storage.js:1394` |
| `phBytes` | функція | `src/scripts/core/02-storage.js:1400` |
| `signedIn` | функція | `src/scripts/core/02-storage.js:1401` |
| `photoStats` | функція | `src/scripts/core/02-storage.js:1407` |
| `gatherPhotos` | функція | `src/scripts/core/02-storage.js:1428` |
| `makeEnvelope` | функція | `src/scripts/core/02-storage.js:1455` |
| `loadZip` | функція | `src/scripts/core/02-storage.js:1468` |
| `PH_EXT` | обʼєкт | `src/scripts/core/02-storage.js:1473` |
| `dataUrlParts` | функція | `src/scripts/core/02-storage.js:1474` |
| `makeFile` | функція | `src/scripts/core/02-storage.js:1487` |
| `saveBlob` | функція | `src/scripts/core/02-storage.js:1537` |
| `saveFile` | функція | `src/scripts/core/02-storage.js:1582` |
| `photosGap` | функція | `src/scripts/core/02-storage.js:1589` |
| `tapStillFresh` | функція | `src/scripts/core/02-storage.js:1600` |
| `exportToFile` | функція | `src/scripts/core/02-storage.js:1609` |
| `snapshot` | функція | `src/scripts/core/02-storage.js:1624` |
| `restoreSnapshot` | функція | `src/scripts/core/02-storage.js:1627` |
| `unwrapVal` | функція | `src/scripts/core/02-storage.js:1632` |
| `valOf` | функція | `src/scripts/core/02-storage.js:1637` |
| `checkEnvelope` | функція | `src/scripts/core/02-storage.js:1646` |
| `plural` | функція | `src/scripts/core/02-storage.js:1664` |
| `summarize` | функція | `src/scripts/core/02-storage.js:1669` |
| `readFile` | функція | `src/scripts/core/02-storage.js:1692` |
| `inspectFile` | функція | `src/scripts/core/02-storage.js:1702` |
| `applyEnvelope` | функція | `src/scripts/core/02-storage.js:1731` |
| `pushRestored` | функція | `src/scripts/core/02-storage.js:1755` |
| `applyInspected` | функція | `src/scripts/core/02-storage.js:1781` |
| `importFromFile` | функція | `src/scripts/core/02-storage.js:1799` |
| `window.flowBackup` | обʼєкт | `src/scripts/core/02-storage.js:1805` |
| `window.flowFactoryReset` | функція | `src/scripts/core/02-storage.js:1821` |
| `window.PhotoDB` | значення | `src/scripts/core/02-storage.js:1889` |
| `window.__photoCache` | значення | `src/scripts/core/02-storage.js:1927` |
| `__phPending` | обʼєкт | `src/scripts/core/02-storage.js:1933` |
| `__photoPoke` | функція | `src/scripts/core/02-storage.js:1934` |
| `window.photoSrc` | функція | `src/scripts/core/02-storage.js:1942` |
| `window.photoIsRef` | функція | `src/scripts/core/02-storage.js:1966` |
| `window.photoWarm` | функція | `src/scripts/core/02-storage.js:1967` |
| `window.photoPut` | функція | `src/scripts/core/02-storage.js:1973` |
| `window.photoDel` | функція | `src/scripts/core/02-storage.js:1982` |

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

### `src/scripts/core/04-folders-nav.js` — 60 сутностей

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
| `FDELKEY` | значення | `src/scripts/core/04-folders-nav.js:158` |
| `FDEL_MAX` | значення | `src/scripts/core/04-folders-nav.js:159` |
| `tombsNorm` | функція | `src/scripts/core/04-folders-nav.js:160` |
| `tombsMerge` | функція | `src/scripts/core/04-folders-nav.js:169` |
| `tombsSame` | функція | `src/scripts/core/04-folders-nav.js:174` |
| `folderTombs` | обʼєкт | `src/scripts/core/04-folders-nav.js:178` |
| `folderTombed` | функція | `src/scripts/core/04-folders-nav.js:181` |
| `saveFolderTombs` | функція | `src/scripts/core/04-folders-nav.js:182` |
| `window.folderTombsReset` | функція | `src/scripts/core/04-folders-nav.js:184` |
| `folderPurge` | функція | `src/scripts/core/04-folders-nav.js:195` |
| `folderDelete` | функція | `src/scripts/core/04-folders-nav.js:242` |
| `mergeFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:257` |
| `applyFolderTombsRaw` | функція | `src/scripts/core/04-folders-nav.js:266` |
| `leaveTombedFolder` | функція | `src/scripts/core/04-folders-nav.js:294` |
| `WIDGET_CATALOG` | обʼєкт | `src/scripts/core/04-folders-nav.js:313` |
| `folderWidgets` | обʼєкт | `src/scripts/core/04-folders-nav.js:322` |
| `FWKEY` | значення | `src/scripts/core/04-folders-nav.js:323` |
| `saveFolderWidgets` | функція | `src/scripts/core/04-folders-nav.js:324` |
| `addWidgetToFolder` | функція | `src/scripts/core/04-folders-nav.js:325` |
| `orderedFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:333` |
| `FOLDER_ROLES` | обʼєкт | `src/scripts/core/04-folders-nav.js:339` |
| `PROJECT_STATUSES` | масив | `src/scripts/core/04-folders-nav.js:344` |
| `projStatusMeta` | функція | `src/scripts/core/04-folders-nav.js:348` |
| `folderProgress` | функція | `src/scripts/core/04-folders-nav.js:350` |
| `dueLabel` | функція | `src/scripts/core/04-folders-nav.js:362` |
| `projFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:371` |
| `folderNextStep` | функція | `src/scripts/core/04-folders-nav.js:373` |
| `completeFolderNextStep` | функція | `src/scripts/core/04-folders-nav.js:384` |
| `childFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:393` |
| `topFolderKeys` | функція | `src/scripts/core/04-folders-nav.js:396` |
| `isDescendantFolder` | функція | `src/scripts/core/04-folders-nav.js:399` |
| `moveFolderTo` | функція | `src/scripts/core/04-folders-nav.js:407` |
| `goHome` | функція | `src/scripts/core/04-folders-nav.js:417` |
| `goFolder` | функція | `src/scripts/core/04-folders-nav.js:418` |
| `goDebts` | функція | `src/scripts/core/04-folders-nav.js:433` |
| `goFinance` | функція | `src/scripts/core/04-folders-nav.js:434` |
| `goEnvelopes` | функція | `src/scripts/core/04-folders-nav.js:435` |
| `goSpend` | функція | `src/scripts/core/04-folders-nav.js:436` |
| `workOrigin` | значення | `src/scripts/core/04-folders-nav.js:437` |
| `goWork` | функція | `src/scripts/core/04-folders-nav.js:438` |

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
| `dsbFillUser` | функція | `src/scripts/core/05-spaces.js:187` |
| `window.dsbFillUser` | значення | `src/scripts/core/05-spaces.js:210` |
| `dsbProfileSheet` | функція | `src/scripts/core/05-spaces.js:211` |
| `renderSettingsCard` | функція | `src/scripts/core/05-spaces.js:246` |
| `window.renderSettingsCard` | значення | `src/scripts/core/05-spaces.js:305` |
| `openSettings` | функція | `src/scripts/core/05-spaces.js:307` |
| `window.openSettingsSheet` | значення | `src/scripts/core/05-spaces.js:323` |
| `sidebarCollapsed` | значення | `src/scripts/core/05-spaces.js:358` |
| `applyChrome` | функція | `src/scripts/core/05-spaces.js:363` |
| `homeWidgets` | значення | `src/scripts/core/05-spaces.js:379` |
| `applyHomeWidgets` | функція | `src/scripts/core/05-spaces.js:382` |
| `THEME_SETS` | обʼєкт | `src/scripts/core/05-spaces.js:402` |
| `THEME_META` | обʼєкт | `src/scripts/core/05-spaces.js:408` |
| `THEME_KEYS` | значення | `src/scripts/core/05-spaces.js:417` |
| `isTheme` | функція | `src/scripts/core/05-spaces.js:418` |
| `themeSetOf` | функція | `src/scripts/core/05-spaces.js:420` |
| `themeIsDark` | функція | `src/scripts/core/05-spaces.js:424` |
| `theme` | значення | `src/scripts/core/05-spaces.js:425` |
| `applyTheme` | функція | `src/scripts/core/05-spaces.js:449` |
| `setTheme` | функція | `src/scripts/core/05-spaces.js:474` |
| `setThemeSet` | функція | `src/scripts/core/05-spaces.js:484` |
| `toggleTheme` | функція | `src/scripts/core/05-spaces.js:488` |
| `proTheme` | значення | `src/scripts/core/05-spaces.js:502` |
| `applyProTheme` | функція | `src/scripts/core/05-spaces.js:504` |
| `toggleProTheme` | функція | `src/scripts/core/05-spaces.js:510` |
| `cardSkin` | значення | `src/scripts/core/05-spaces.js:520` |
| `applyCardSkin` | функція | `src/scripts/core/05-spaces.js:522` |
| `setCardSkin` | функція | `src/scripts/core/05-spaces.js:528` |
| `RR_DEFS` | обʼєкт | `src/scripts/core/05-spaces.js:549` |
| `rrCfg` | функція | `src/scripts/core/05-spaces.js:550` |
| `rrSave` | функція | `src/scripts/core/05-spaces.js:555` |
| `rrCfgSheet` | функція | `src/scripts/core/05-spaces.js:556` |
| `renderRightRail` | функція | `src/scripts/core/05-spaces.js:575` |
| `goGoals` | функція | `src/scripts/core/05-spaces.js:609` |
| `prjHexToRgb` | функція | `src/scripts/core/05-spaces.js:612` |
| `prjTileHTML` | функція | `src/scripts/core/05-spaces.js:620` |
| `renderProjects` | функція | `src/scripts/core/05-spaces.js:628` |
| `goProjects` | функція | `src/scripts/core/05-spaces.js:661` |
| `goPlanner` | функція | `src/scripts/core/05-spaces.js:664` |
| `goValues` | функція | `src/scripts/core/05-spaces.js:668` |
| `goWishes` | функція | `src/scripts/core/05-spaces.js:670` |
| `window.goWishes` | значення | `src/scripts/core/05-spaces.js:671` |

### `src/scripts/core/06-wishes.js` — 92 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `WICONS` | обʼєкт | `src/scripts/core/06-wishes.js:3` |
| `icoHtml` | функція | `src/scripts/core/06-wishes.js:16` |
| `actionSheet` | функція | `src/scripts/core/06-wishes.js:19` |
| `confirmSheet` | функція | `src/scripts/core/06-wishes.js:44` |
| `flowAlert` | функція | `src/scripts/core/06-wishes.js:55` |
| `WISH_KEY` | значення | `src/scripts/core/06-wishes.js:64` |
| `WISH_ACT_KEY` | значення | `src/scripts/core/06-wishes.js:65` |
| `wishes` | масив | `src/scripts/core/06-wishes.js:66` |
| `wishActiveDays` | обʼєкт | `src/scripts/core/06-wishes.js:67` |
| `loadWishes` | функція | `src/scripts/core/06-wishes.js:69` |
| `migrateWishPhotosOnce` | функція | `src/scripts/core/06-wishes.js:79` |
| `saveWishActiveDays` | функція | `src/scripts/core/06-wishes.js:95` |
| `saveWishes` | функція | `src/scripts/core/06-wishes.js:96` |
| `HOMEGLASS_KEY` | значення | `src/scripts/core/06-wishes.js:106` |
| `homeGlass` | значення | `src/scripts/core/06-wishes.js:107` |
| `loadHomeGlass` | функція | `src/scripts/core/06-wishes.js:109` |
| `saveHomeGlass` | функція | `src/scripts/core/06-wishes.js:110` |
| `applyHomeGlass` | функція | `src/scripts/core/06-wishes.js:111` |
| `WPRICE_KEY` | значення | `src/scripts/core/06-wishes.js:114` |
| `wishPrice` | значення | `src/scripts/core/06-wishes.js:115` |
| `loadWishPrice` | функція | `src/scripts/core/06-wishes.js:117` |
| `saveWishPrice` | функція | `src/scripts/core/06-wishes.js:118` |
| `wishPriceHTML` | функція | `src/scripts/core/06-wishes.js:119` |
| `bindWishPrice` | функція | `src/scripts/core/06-wishes.js:126` |
| `WISH_SLIDE_MS` | значення | `src/scripts/core/06-wishes.js:135` |
| `wishSlideTimer` | значення | `src/scripts/core/06-wishes.js:136` |
| `updateSummaryBg` | функція | `src/scripts/core/06-wishes.js:137` |
| `compressImage` | функція | `src/scripts/core/06-wishes.js:203` |
| `pickWishPhoto` | функція | `src/scripts/core/06-wishes.js:224` |
| `WISH_SIZES` | масив | `src/scripts/core/06-wishes.js:253` |
| `WISH_SIZE_LABEL` | обʼєкт | `src/scripts/core/06-wishes.js:254` |
| `cycleWishSize` | функція | `src/scripts/core/06-wishes.js:255` |
| `askWishCap` | функція | `src/scripts/core/06-wishes.js:261` |
| `openWishCard` | функція | `src/scripts/core/06-wishes.js:267` |
| `pickProofPhoto` | функція | `src/scripts/core/06-wishes.js:341` |
| `delWish` | функція | `src/scripts/core/06-wishes.js:348` |
| `parseVideo` | функція | `src/scripts/core/06-wishes.js:363` |
| `addWishVideo` | функція | `src/scripts/core/06-wishes.js:381` |
| `setWishCover` | функція | `src/scripts/core/06-wishes.js:406` |
| `openWishVideo` | функція | `src/scripts/core/06-wishes.js:423` |
| `openWishMenu` | функція | `src/scripts/core/06-wishes.js:432` |
| `moveWish` | функція | `src/scripts/core/06-wishes.js:471` |
| `wishToGoal` | функція | `src/scripts/core/06-wishes.js:478` |
| `RIT_KEY` | значення | `src/scripts/core/06-wishes.js:505` |
| `RIT` | обʼєкт | `src/scripts/core/06-wishes.js:506` |
| `loadRitual` | функція | `src/scripts/core/06-wishes.js:508` |
| `saveRitual` | функція | `src/scripts/core/06-wishes.js:510` |
| `__ritLoad` | значення | `src/scripts/core/06-wishes.js:511` |
| `ritualRerender` | функція | `src/scripts/core/06-wishes.js:513` |
| `goRitual` | функція | `src/scripts/core/06-wishes.js:515` |
| `ritDay` | функція | `src/scripts/core/06-wishes.js:537` |
| `ritDs` | функція | `src/scripts/core/06-wishes.js:538` |
| `ritStreak` | функція | `src/scripts/core/06-wishes.js:539` |
| `ytId` | функція | `src/scripts/core/06-wishes.js:553` |
| `fmtDur` | функція | `src/scripts/core/06-wishes.js:554` |
| `ritRec` | значення | `src/scripts/core/06-wishes.js:557` |
| `ritStopAll` | функція | `src/scripts/core/06-wishes.js:558` |
| `ritRecord` | функція | `src/scripts/core/06-wishes.js:560` |
| `ritPlay` | функція | `src/scripts/core/06-wishes.js:595` |
| `ritMixPlay` | функція | `src/scripts/core/06-wishes.js:596` |
| `ritFieldMic` | функція | `src/scripts/core/06-wishes.js:604` |
| `ritMixMenu` | функція | `src/scripts/core/06-wishes.js:614` |
| `ritAddLink` | функція | `src/scripts/core/06-wishes.js:622` |
| `ritLinkMenu` | функція | `src/scripts/core/06-wishes.js:632` |
| `RIT_J` | масив | `src/scripts/core/06-wishes.js:642` |
| `ritualInnerHTML` | функція | `src/scripts/core/06-wishes.js:645` |
| `ritualBind` | функція | `src/scripts/core/06-wishes.js:693` |
| `RPH_ICON` | значення | `src/scripts/core/06-wishes.js:738` |
| `ritPhotoCardHTML` | функція | `src/scripts/core/06-wishes.js:739` |
| `ritPhotoTap` | функція | `src/scripts/core/06-wishes.js:753` |
| `fetchWithTimeout` | функція | `src/scripts/core/06-wishes.js:764` |
| `ritSavePhoto` | функція | `src/scripts/core/06-wishes.js:770` |
| `ritPhotoMenu` | функція | `src/scripts/core/06-wishes.js:788` |
| `rmomTimer` | значення | `src/scripts/core/06-wishes.js:797` |
| `ritEnterMoment` | функція | `src/scripts/core/06-wishes.js:798` |
| `ritMixRecTap` | функція | `src/scripts/core/06-wishes.js:830` |
| `ritMixLongOrRec` | функція | `src/scripts/core/06-wishes.js:831` |
| `CLG_KEY` | значення | `src/scripts/core/06-wishes.js:839` |
| `collage` | масив | `src/scripts/core/06-wishes.js:840` |
| `loadCollage` | функція | `src/scripts/core/06-wishes.js:842` |
| `saveCollage` | функція | `src/scripts/core/06-wishes.js:844` |
| `goCollage` | функція | `src/scripts/core/06-wishes.js:847` |
| `clgPickPhotos` | функція | `src/scripts/core/06-wishes.js:850` |
| `clgImportWishes` | функція | `src/scripts/core/06-wishes.js:865` |
| `clgMenu` | функція | `src/scripts/core/06-wishes.js:876` |
| `renderCollage` | функція | `src/scripts/core/06-wishes.js:889` |
| `clgWrap` | функція | `src/scripts/core/06-wishes.js:946` |
| `clgWallpaper` | функція | `src/scripts/core/06-wishes.js:952` |
| `wdkShow` | значення | `src/scripts/core/06-wishes.js:1026` |
| `wishDateInfo` | функція | `src/scripts/core/06-wishes.js:1027` |
| `renderWishDeck` | функція | `src/scripts/core/06-wishes.js:1046` |
| `renderWishes` | функція | `src/scripts/core/06-wishes.js:1122` |

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

### `src/scripts/core/09-goals.js` — 25 сутностей

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
| `aiGenerate` | функція | `src/scripts/core/09-goals.js:102` |
| `aiLocalDraft` | функція | `src/scripts/core/09-goals.js:136` |
| `DOW_SHORT` | масив | `src/scripts/core/09-goals.js:160` |
| `aiPreview` | функція | `src/scripts/core/09-goals.js:161` |
| `aiApplyDraft` | функція | `src/scripts/core/09-goals.js:196` |
| `renderGoals` | функція | `src/scripts/core/09-goals.js:236` |
| `dgDateStr` | функція | `src/scripts/core/09-goals.js:301` |
| `dgWeekDates` | функція | `src/scripts/core/09-goals.js:302` |
| `dgListFor` | функція | `src/scripts/core/09-goals.js:305` |
| `dgSync` | функція | `src/scripts/core/09-goals.js:307` |
| `dayGoalsBlock` | функція | `src/scripts/core/09-goals.js:328` |
| `pickFolderForGoal` | функція | `src/scripts/core/09-goals.js:380` |
| `renderGoalsTab` | функція | `src/scripts/core/09-goals.js:419` |

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
| `plMonthCalHTML` | функція | `src/scripts/core/10-planner.js:92` |
| `plTemplateGoalMeta` | функція | `src/scripts/core/10-planner.js:170` |
| `plDowLabel` | функція | `src/scripts/core/10-planner.js:178` |
| `plTemplateListHTML` | функція | `src/scripts/core/10-planner.js:182` |
| `plToggleTemplate` | функція | `src/scripts/core/10-planner.js:202` |
| `plNewTemplateSheet` | функція | `src/scripts/core/10-planner.js:214` |
| `plHM` | функція | `src/scripts/core/10-planner.js:268` |
| `plHMtoDec` | функція | `src/scripts/core/10-planner.js:269` |
| `plDurLabel` | функція | `src/scripts/core/10-planner.js:270` |
| `PL_ICON_CORE` | обʼєкт | `src/scripts/core/10-planner.js:272` |
| `PL_ICONS` | обʼєкт | `src/scripts/core/10-planner.js:305` |
| `plIconStyle` | функція | `src/scripts/core/10-planner.js:313` |
| `plIco` | функція | `src/scripts/core/10-planner.js:315` |
| `plRing` | функція | `src/scripts/core/10-planner.js:322` |
| `goalPctP` | функція | `src/scripts/core/10-planner.js:331` |
| `renderPath` | функція | `src/scripts/core/10-planner.js:336` |
| `pathFlowHtml` | функція | `src/scripts/core/10-planner.js:361` |
| `brdRing` | функція | `src/scripts/core/10-planner.js:410` |
| `pathBridgeHtml` | функція | `src/scripts/core/10-planner.js:417` |
| `plRerender` | функція | `src/scripts/core/10-planner.js:444` |
| `renderPlanner` | функція | `src/scripts/core/10-planner.js:450` |
| `plFmtMMSS` | функція | `src/scripts/core/10-planner.js:679` |
| `plStartFocus` | функція | `src/scripts/core/10-planner.js:680` |
| `plNowIv` | значення | `src/scripts/core/10-planner.js:741` |
| `plFmtHMS` | функція | `src/scripts/core/10-planner.js:742` |
| `plNowInfo` | функція | `src/scripts/core/10-planner.js:744` |
| `plNowCardHTML` | функція | `src/scripts/core/10-planner.js:753` |
| `plNowTick` | функція | `src/scripts/core/10-planner.js:772` |
| `plNowLineHTML` | функція | `src/scripts/core/10-planner.js:785` |
| `plQuickAddHTML` | функція | `src/scripts/core/10-planner.js:787` |
| `plParseQuick` | функція | `src/scripts/core/10-planner.js:793` |
| `plWeekStats` | функція | `src/scripts/core/10-planner.js:819` |
| `plWeekReviewSheet` | функція | `src/scripts/core/10-planner.js:832` |
| `plWeekAI` | функція | `src/scripts/core/10-planner.js:885` |

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

### `src/scripts/core/12-ai-agent.js` — 92 сутностей

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
| `aiTraceReadMeta` | функція | `src/scripts/core/12-ai-agent.js:408` |
| `aiTraceStart` | функція | `src/scripts/core/12-ai-agent.js:426` |
| `aiTraceStep` | функція | `src/scripts/core/12-ai-agent.js:427` |
| `aiTraceEnd` | функція | `src/scripts/core/12-ai-agent.js:444` |
| `aiTraceRepaint` | функція | `src/scripts/core/12-ai-agent.js:449` |
| `aiTraceFinish` | функція | `src/scripts/core/12-ai-agent.js:455` |
| `FLOW_TOOLS` | масив | `src/scripts/core/12-ai-agent.js:465` |
| `AI_AGENT_ADDON` | значення | `src/scripts/core/12-ai-agent.js:541` |
| `flowToolExec` | функція | `src/scripts/core/12-ai-agent.js:558` |
| `flowToolRead` | функція | `src/scripts/core/12-ai-agent.js:587` |
| `aiRemindWhen` | функція | `src/scripts/core/12-ai-agent.js:678` |
| `flowToolPlanner` | функція | `src/scripts/core/12-ai-agent.js:685` |
| `flowToolGoals` | функція | `src/scripts/core/12-ai-agent.js:756` |
| `aiToolConfirm` | функція | `src/scripts/core/12-ai-agent.js:794` |
| `aiFinConfirm` | функція | `src/scripts/core/12-ai-agent.js:813` |
| `flowToolFinance` | функція | `src/scripts/core/12-ai-agent.js:816` |
| `flowToolDiary` | функція | `src/scripts/core/12-ai-agent.js:964` |
| `flowToolPatterns` | функція | `src/scripts/core/12-ai-agent.js:1014` |
| `flowToolMemory` | функція | `src/scripts/core/12-ai-agent.js:1035` |
| `aiMemGate` | функція | `src/scripts/core/12-ai-agent.js:1061` |
| `flowToolFolders` | функція | `src/scripts/core/12-ai-agent.js:1070` |
| `AI_MAIN_RE` | значення | `src/scripts/core/12-ai-agent.js:1127` |
| `aiPickModel` | функція | `src/scripts/core/12-ai-agent.js:1128` |
| `aiCacheMin` | функція | `src/scripts/core/12-ai-agent.js:1135` |
| `aiTokEst` | функція | `src/scripts/core/12-ai-agent.js:1140` |
| `aiCacheTail` | функція | `src/scripts/core/12-ai-agent.js:1145` |
| `aiUsageAdd` | функція | `src/scripts/core/12-ai-agent.js:1156` |
| `aiCallRaw` | функція | `src/scripts/core/12-ai-agent.js:1169` |
| `aiToolIsWrite` | функція | `src/scripts/core/12-ai-agent.js:1244` |
| `AI_WRITE_LIMIT` | значення | `src/scripts/core/12-ai-agent.js:1253` |
| `aiTurnWrites` | значення | `src/scripts/core/12-ai-agent.js:1254` |
| `aiTurnDone` | масив | `src/scripts/core/12-ai-agent.js:1255` |
| `aiDoneLine` | функція | `src/scripts/core/12-ai-agent.js:1259` |
| `aiToolWriteCost` | функція | `src/scripts/core/12-ai-agent.js:1277` |
| `AI_TOOL_OUT_MAX` | обʼєкт | `src/scripts/core/12-ai-agent.js:1285` |
| `aiToolOut` | функція | `src/scripts/core/12-ai-agent.js:1286` |
| `aiAgentTurn` | функція | `src/scripts/core/12-ai-agent.js:1291` |
| `aiFinMonthNet` | функція | `src/scripts/core/12-ai-agent.js:1355` |
| `aiFinCtx` | функція | `src/scripts/core/12-ai-agent.js:1363` |
| `aiCtx` | функція | `src/scripts/core/12-ai-agent.js:1383` |
| `aiFindGoal` | функція | `src/scripts/core/12-ai-agent.js:1422` |
| `aiParseBlocks` | функція | `src/scripts/core/12-ai-agent.js:1426` |
| `aiOpsCount` | функція | `src/scripts/core/12-ai-agent.js:1457` |
| `aiStreamText` | функція | `src/scripts/core/12-ai-agent.js:1462` |
| `aiOpDs` | функція | `src/scripts/core/12-ai-agent.js:1472` |
| `aiOpMatches` | функція | `src/scripts/core/12-ai-agent.js:1473` |
| `aiOpBlock` | функція | `src/scripts/core/12-ai-agent.js:1483` |
| `aiFindBlockByT` | функція | `src/scripts/core/12-ai-agent.js:1484` |
| `aiOpWarn` | функція | `src/scripts/core/12-ai-agent.js:1486` |
| `aiResolveOps` | функція | `src/scripts/core/12-ai-agent.js:1498` |
| `aiMissText` | функція | `src/scripts/core/12-ai-agent.js:1512` |
| `aiOpRow` | функція | `src/scripts/core/12-ai-agent.js:1519` |
| `aiGateOps` | функція | `src/scripts/core/12-ai-agent.js:1526` |
| `aiFindFolderKey` | функція | `src/scripts/core/12-ai-agent.js:1546` |
| `aiBuildPageBlock` | функція | `src/scripts/core/12-ai-agent.js:1554` |
| `aiApplyPages` | функція | `src/scripts/core/12-ai-agent.js:1573` |
| `aiApplyActions` | функція | `src/scripts/core/12-ai-agent.js:1596` |
| `aiCommit` | функція | `src/scripts/core/12-ai-agent.js:1686` |
| `aiUndo` | функція | `src/scripts/core/12-ai-agent.js:1702` |

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
| `plFolderDaySheet` | функція | `src/scripts/core/15-flow-spot.js:1206` |
| `plFolderMonthSheet` | функція | `src/scripts/core/15-flow-spot.js:1263` |
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
| `plUncompleteEffects` | функція | `src/scripts/core/15-flow-spot.js:1764` |
| `plToast` | функція | `src/scripts/core/15-flow-spot.js:1780` |
| `plBlockSheet` | функція | `src/scripts/core/15-flow-spot.js:1788` |
| `plEditBlock` | функція | `src/scripts/core/15-flow-spot.js:2010` |
| `plRangeSheet` | функція | `src/scripts/core/15-flow-spot.js:2013` |

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
| `createFolder` | функція | `src/scripts/core/16-dashboard.js:283` |
| `createProjectFolder` | функція | `src/scripts/core/16-dashboard.js:298` |
| `openPhotoCropEditor` | функція | `src/scripts/core/16-dashboard.js:325` |
| `openFolderMenu` | функція | `src/scripts/core/16-dashboard.js:388` |
| `closeFolderMenu` | функція | `src/scripts/core/16-dashboard.js:442` |
| `openFolderIconPicker` | функція | `src/scripts/core/16-dashboard.js:449` |
| `openFolderMovePicker` | функція | `src/scripts/core/16-dashboard.js:482` |
| `folderAction` | функція | `src/scripts/core/16-dashboard.js:498` |
| `cycleFolderColor` | функція | `src/scripts/core/16-dashboard.js:523` |
| `pickFolderPhoto` | функція | `src/scripts/core/16-dashboard.js:529` |

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
| `balance` | функція | `src/scripts/core/18-debts.js:53` |
| `debtDel` | функція | `src/scripts/core/18-debts.js:66` |
| `debtRender` | функція | `src/scripts/core/18-debts.js:68` |
| `toggleDebtSync` | функція | `src/scripts/core/18-debts.js:107` |
| `curId` | значення | `src/scripts/core/18-debts.js:132` |
| `openModal` | функція | `src/scripts/core/18-debts.js:133` |
| `closeModal` | функція | `src/scripts/core/18-debts.js:136` |
| `renderModal` | функція | `src/scripts/core/18-debts.js:139` |
| `askOp` | функція | `src/scripts/core/18-debts.js:168` |
| `commitOp` | функція | `src/scripts/core/18-debts.js:177` |
| `delOp` | функція | `src/scripts/core/18-debts.js:186` |

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

### `src/scripts/core/23-board.js` — 32 сутностей

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
| `flowUndoToast` | функція | `src/scripts/core/23-board.js:241` |
| `window.flowUndoToast` | значення | `src/scripts/core/23-board.js:251` |
| `hideUndo` | функція | `src/scripts/core/23-board.js:252` |
| `doUndo` | функція | `src/scripts/core/23-board.js:253` |
| `INBOX_TITLE` | значення | `src/scripts/core/23-board.js:274` |
| `INBOX_FKEY` | значення | `src/scripts/core/23-board.js:275` |
| `ensureInboxFolder` | функція | `src/scripts/core/23-board.js:276` |
| `openQuickCapture` | функція | `src/scripts/core/23-board.js:289` |
| `closeQuickCapture` | функція | `src/scripts/core/23-board.js:295` |
| `saveQuickCapture` | функція | `src/scripts/core/23-board.js:296` |
| `window.flowQuickCapture` | значення | `src/scripts/core/23-board.js:324` |
| `window.flowOpenInbox` | функція | `src/scripts/core/23-board.js:326` |

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
| `focusItem` | функція | `src/scripts/core/26-blocks-render.js:814` |
| `bindTiles` | функція | `src/scripts/core/26-blocks-render.js:823` |

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
| `applyFolderOrderRaw` | функція | `src/scripts/core/27-canvas.js:300` |
| `loadInFlight` | значення | `src/scripts/core/27-canvas.js:310` |
| `load` | функція | `src/scripts/core/27-canvas.js:311` |
| `loadOnce` | функція | `src/scripts/core/27-canvas.js:316` |
| `vv` | значення | `src/scripts/core/27-canvas.js:503` |
| `FIELD` | значення | `src/scripts/core/27-canvas.js:504` |
| `isField` | функція | `src/scripts/core/27-canvas.js:506` |
| `kbHeight` | функція | `src/scripts/core/27-canvas.js:509` |
| `syncKb` | функція | `src/scripts/core/27-canvas.js:513` |
| `ensureVisible` | функція | `src/scripts/core/27-canvas.js:520` |
| `VISION_FKEY` | значення | `src/scripts/core/27-canvas.js:556` |
| `migrateFolderPhotosOnce` | функція | `src/scripts/core/27-canvas.js:563` |
| `removeSystemSeedFoldersOnce` | функція | `src/scripts/core/27-canvas.js:581` |

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

### `src/scripts/core/29-more-screen.js` — 22 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `MAIN` | масив | `src/scripts/core/29-more-screen.js:6` |
| `MORE` | масив | `src/scripts/core/29-more-screen.js:10` |
| `LITE_DOORS` | масив | `src/scripts/core/29-more-screen.js:15` |
| `inboxWaiting` | функція | `src/scripts/core/29-more-screen.js:22` |
| `tileHTML` | функція | `src/scripts/core/29-more-screen.js:25` |
| `rowHTML` | функція | `src/scripts/core/29-more-screen.js:32` |
| `renderMore` | функція | `src/scripts/core/29-more-screen.js:41` |
| `openMoreSheet` | функція | `src/scripts/core/29-more-screen.js:78` |
| `goMore` | функція | `src/scripts/core/29-more-screen.js:98` |
| `window.goMore` | значення | `src/scripts/core/29-more-screen.js:99` |
| `escA` | функція | `src/scripts/core/29-more-screen.js:102` |
| `safeImgA` | функція | `src/scripts/core/29-more-screen.js:103` |
| `readAvatarFile` | функція | `src/scripts/core/29-more-screen.js:105` |
| `syncLabel` | функція | `src/scripts/core/29-more-screen.js:126` |
| `flowStorageInfo` | функція | `src/scripts/core/29-more-screen.js:144` |
| `fmtMem` | функція | `src/scripts/core/29-more-screen.js:153` |
| `fillMemRow` | функція | `src/scripts/core/29-more-screen.js:154` |
| `renderAccount` | функція | `src/scripts/core/29-more-screen.js:169` |
| `window.renderAccount` | значення | `src/scripts/core/29-more-screen.js:483` |
| `hm` | значення | `src/scripts/core/29-more-screen.js:493` |
| `na` | функція | `src/scripts/core/29-more-screen.js:494` |
| `nm` | значення | `src/scripts/core/29-more-screen.js:495` |

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
| `chMoreSheet` | функція | `src/scripts/core/35-channel.js:206` |
| `renderChChips` | функція | `src/scripts/core/35-channel.js:225` |
| `chOpenFolder` | функція | `src/scripts/core/35-channel.js:242` |
| `chFolderChipSheet` | функція | `src/scripts/core/35-channel.js:248` |
| `chAttachLongPress` | функція | `src/scripts/core/35-channel.js:258` |
| `renderChFeed` | функція | `src/scripts/core/35-channel.js:268` |
| `chAppendFeed` | функція | `src/scripts/core/35-channel.js:301` |
| `chEagerPhotos` | функція | `src/scripts/core/35-channel.js:319` |
| `chBubble` | функція | `src/scripts/core/35-channel.js:324` |
| `chAiSync` | функція | `src/scripts/core/35-channel.js:371` |
| `chAiCollect` | функція | `src/scripts/core/35-channel.js:388` |
| `chAiSummarize` | функція | `src/scripts/core/35-channel.js:414` |
| `chBindFeed` | функція | `src/scripts/core/35-channel.js:457` |
| `chJumpTo` | функція | `src/scripts/core/35-channel.js:479` |
| `chRecordSheet` | функція | `src/scripts/core/35-channel.js:491` |
| `chEditRecord` | функція | `src/scripts/core/35-channel.js:510` |
| `chCopyToFolder` | функція | `src/scripts/core/35-channel.js:531` |
| `chPickCopyTarget` | функція | `src/scripts/core/35-channel.js:538` |
| `chDeleteRecord` | функція | `src/scripts/core/35-channel.js:547` |
| `chInitComposer` | функція | `src/scripts/core/35-channel.js:556` |
| `chAutoGrow` | функція | `src/scripts/core/35-channel.js:601` |
| `chSyncSend` | функція | `src/scripts/core/35-channel.js:602` |
| `chSetMode` | функція | `src/scripts/core/35-channel.js:608` |
| `chToggleTray` | функція | `src/scripts/core/35-channel.js:614` |
| `chPushBlock` | функція | `src/scripts/core/35-channel.js:620` |
| `chSend` | функція | `src/scripts/core/35-channel.js:627` |
| `chPickFile` | функція | `src/scripts/core/35-channel.js:640` |
| `chShrink` | функція | `src/scripts/core/35-channel.js:646` |
| `chVoice` | функція | `src/scripts/core/35-channel.js:657` |
| `chSheet` | функція | `src/scripts/core/35-channel.js:688` |

### `src/scripts/core/36-chats.js` — 40 сутностей

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
| `chatLast` | функція | `src/scripts/core/36-chats.js:234` |
| `chatPreview` | функція | `src/scripts/core/36-chats.js:240` |
| `chatTimeLabel` | функція | `src/scripts/core/36-chats.js:249` |
| `renderChatList` | функція | `src/scripts/core/36-chats.js:256` |
| `chatMenu` | функція | `src/scripts/core/36-chats.js:283` |
| `pgFolderKey` | функція | `src/scripts/core/36-chats.js:297` |
| `renderPgLinks` | функція | `src/scripts/core/36-chats.js:298` |
| `folderAddSheet` | функція | `src/scripts/core/36-chats.js:313` |
| `pickChatForFolder` | функція | `src/scripts/core/36-chats.js:328` |
| `chatsInit` | функція | `src/scripts/core/36-chats.js:338` |

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

### `src/scripts/core/38-world.js` — 7 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `worldShown` | значення | `src/scripts/core/38-world.js:7` |
| `worldOn` | функція | `src/scripts/core/38-world.js:8` |
| `worldFmt` | функція | `src/scripts/core/38-world.js:10` |
| `worldApplyNav` | функція | `src/scripts/core/38-world.js:12` |
| `worldMoneyChip` | функція | `src/scripts/core/38-world.js:23` |
| `worldBridge` | функція | `src/scripts/core/38-world.js:31` |
| `goWorld` | функція | `src/scripts/core/38-world.js:47` |

### `src/scripts/core/39-spheres.js` — 20 сутностей

| Імʼя | Вид | Де |
|---|---|---|
| `SPH_ICONS` | обʼєкт | `src/scripts/core/39-spheres.js:11` |
| `sphIcon` | функція | `src/scripts/core/39-spheres.js:21` |
| `SPH_TPL` | обʼєкт | `src/scripts/core/39-spheres.js:24` |
| `SPH_ORDER` | масив | `src/scripts/core/39-spheres.js:51` |
| `sphOn` | функція | `src/scripts/core/39-spheres.js:53` |
| `sphTpl` | функція | `src/scripts/core/39-spheres.js:55` |
| `sphKeys` | функція | `src/scripts/core/39-spheres.js:56` |
| `sphBlocks` | функція | `src/scripts/core/39-spheres.js:59` |
| `sphStreak` | функція | `src/scripts/core/39-spheres.js:65` |
| `sphWeek` | функція | `src/scripts/core/39-spheres.js:71` |
| `sphStats` | функція | `src/scripts/core/39-spheres.js:79` |
| `sphRenderList` | функція | `src/scripts/core/39-spheres.js:108` |
| `sphHomeSync` | функція | `src/scripts/core/39-spheres.js:127` |
| `sphTemplateSheet` | функція | `src/scripts/core/39-spheres.js:137` |
| `sphNewBlocks` | функція | `src/scripts/core/39-spheres.js:156` |
| `sphCreate` | функція | `src/scripts/core/39-spheres.js:160` |
| `sphConvert` | функція | `src/scripts/core/39-spheres.js:176` |
| `sphRenderHead` | функція | `src/scripts/core/39-spheres.js:189` |
| `sphForWorld` | функція | `src/scripts/core/39-spheres.js:204` |
| `spheresInit` | функція | `src/scripts/core/39-spheres.js:211` |

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
| `positionSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:155` |
| `openSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:178` |
| `closeSlash` | функція | `src/scripts/page-editor/03-premium-pack.js:184` |
| `applySlash` | функція | `src/scripts/page-editor/03-premium-pack.js:186` |
| `drag` | значення | `src/scripts/page-editor/03-premium-pack.js:321` |
| `dstart` | функція | `src/scripts/page-editor/03-premium-pack.js:324` |
| `ghostMake` | функція | `src/scripts/page-editor/03-premium-pack.js:334` |
| `ghostMove` | функція | `src/scripts/page-editor/03-premium-pack.js:343` |
| `ghostKill` | функція | `src/scripts/page-editor/03-premium-pack.js:344` |
| `clearMarks` | функція | `src/scripts/page-editor/03-premium-pack.js:345` |
| `dmove` | функція | `src/scripts/page-editor/03-premium-pack.js:346` |
| `dend` | функція | `src/scripts/page-editor/03-premium-pack.js:368` |
| `cancelDrag` | функція | `src/scripts/page-editor/03-premium-pack.js:380` |
| `bmenu` | значення | `src/scripts/page-editor/03-premium-pack.js:459` |
| `openBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:460` |
| `closeBmenu` | функція | `src/scripts/page-editor/03-premium-pack.js:494` |
| `THKEY` | значення | `src/scripts/page-editor/03-premium-pack.js:540` |
| `applyTheme` | функція | `src/scripts/page-editor/03-premium-pack.js:541` |
| `pageThemeDefault` | функція | `src/scripts/page-editor/03-premium-pack.js:544` |
| `pgTitle` | значення | `src/scripts/page-editor/03-premium-pack.js:562` |
| `addBtn` | значення | `src/scripts/page-editor/03-premium-pack.js:572` |
| `CD_MONTHS` | масив | `src/scripts/page-editor/03-premium-pack.js:581` |
| `cdFmt` | функція | `src/scripts/page-editor/03-premium-pack.js:582` |
| `cdHTML` | функція | `src/scripts/page-editor/03-premium-pack.js:587` |

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
| `pgPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:665` |
| `PGPH_SIZES` | масив | `src/scripts/page-editor/08-w-projects-hub.js:690` |
| `pgSzBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:691` |
| `pgSzBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:692` |
| `pgSzSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:720` |
| `pgSzClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:727` |
| `pgPhotoSizeSheet` | функція | `src/scripts/page-editor/08-w-projects-hub.js:728` |
| `pgPhotoMenu` | функція | `src/scripts/page-editor/08-w-projects-hub.js:731` |
| `pgRz` | значення | `src/scripts/page-editor/08-w-projects-hub.js:752` |
| `COVKEY` | значення | `src/scripts/page-editor/08-w-projects-hub.js:774` |
| `covers` | обʼєкт | `src/scripts/page-editor/08-w-projects-hub.js:775` |
| `covSaveT` | значення | `src/scripts/page-editor/08-w-projects-hub.js:783` |
| `saveCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:784` |
| `saveCoversSoon` | функція | `src/scripts/page-editor/08-w-projects-hub.js:793` |
| `flushCovers` | функція | `src/scripts/page-editor/08-w-projects-hub.js:797` |
| `COV_GRADS` | масив | `src/scripts/page-editor/08-w-projects-hub.js:807` |
| `covEl` | значення | `src/scripts/page-editor/08-w-projects-hub.js:813` |
| `covKey` | функція | `src/scripts/page-editor/08-w-projects-hub.js:828` |
| `covMenuHTML` | функція | `src/scripts/page-editor/08-w-projects-hub.js:829` |
| `renderCover` | функція | `src/scripts/page-editor/08-w-projects-hub.js:836` |
| `covPickPhoto` | функція | `src/scripts/page-editor/08-w-projects-hub.js:866` |
| `covEdBox` | значення | `src/scripts/page-editor/08-w-projects-hub.js:907` |
| `covEdState` | функція | `src/scripts/page-editor/08-w-projects-hub.js:908` |
| `covEdSync` | функція | `src/scripts/page-editor/08-w-projects-hub.js:914` |
| `covEdBuild` | функція | `src/scripts/page-editor/08-w-projects-hub.js:927` |
| `covEdOpen` | функція | `src/scripts/page-editor/08-w-projects-hub.js:981` |
| `covEdClose` | функція | `src/scripts/page-editor/08-w-projects-hub.js:982` |

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
| `NAV_WAIT` | значення | `src/web/sw.js:20` |
| `NAV_ABORT` | значення | `src/web/sw.js:21` |
| `stamp` | функція | `src/web/sw.js:40` |
| `keepIndex` | функція | `src/web/sw.js:45` |
| `navigate` | функція | `src/web/sw.js:52` |

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
