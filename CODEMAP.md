# CODEMAP — index.html
> Оновлено вручну (Claude) після сесії SPECblocksv2 — Google Fonts (Lora/Caveat) додано, редактор Папок/сторінок добудовано. Розміри сутностей рахуються реальним підрахунком дужок (а не відстанню до наступної відомої сутності), з відкатом на грубу оцінку в ~8 випадках, де регулярні вирази в коді (напр. `/"/g`) заплутують наївний парсер. Попередній автогенерований хеш: `a4b3b7081580` (застарів).
>
> **Навіщо цей файл:** замість завантаження всього файлу (34664 рядків, 2332.8 KB) в контекст AI-сесії — спочатку читай цю карту, а потім запитуй `view` лише потрібний діапазон рядків.

## Огляд файлу

| Метрика | Значення |
|---|---|
| Рядків всього | 34664 |
| Розмір | 2332.8 KB |
| `<script>` блоків (внутрішніх) | 15 |
| `<style>` блоків | 12 |
| Top-level сутностей знайдено | 1187 |
| FLOW_KEYS (ключів сховища) | 45 |
| IndexedDB бази (DB/STORE пари) | 2 |
| CSS змінних --pg-* / всього | 14 / 132 |

## <script> блоки

| # | id | рядок старту | рядків коду |
|---|---|---|---|
| 1 | (без id) | 8 | ~19 |
| 2 | (без id) | 27 | ~1 |
| 3 | (без id) | 28 | ~3 |
| 4 | (без id) | 6525 | ~11 |
| 5 | (без id) | 7362 | ~19416 |
| 6 | (без id) | 26789 | ~109 |
| 7 | (без id) | 26921 | ~125 |
| 8 | (без id) | 27046 | ~3484 |
| 9 | fd26js | 30609 | ~288 |
| 10 | fd26tjs | 31362 | ~150 |
| 11 | fdVoiceJs | 31513 | ~783 |
| 12 | fd26js-planner | 32381 | ~135 |
| 13 | fd26js-week | 32654 | ~330 |
| 14 | fd26js-month | 33215 | ~662 |
| 15 | fd26js-mx | 34081 | ~216 |

## <style> блоки

| id | рядки |
|---|---|
| (без id) | 34–6246 |
| (без id) | 6247–6399 |
| patterns-css | 6400–6471 |
| diary-css | 6472–6507 |
| fd26css | 30531–30560 |
| fd26css-agency | 30561–30608 |
| fd26tcss | 30898–31360 |
| fd26css-planner | 32298–32380 |
| fd26css-week | 32516–32653 |
| fd26css-month | 32986–33213 |
| fd26css-mx | 33878–34079 |
| fdHorizonWin | 34298–34661 |

## Структура пам'яті (сховище даних)

### window.FLOW_KEYS (45)

```
ui_mode
ai_endpoint
ai_chat
ai_memory
ai_prompts
folders_cfg
folders_order
folder_widgets
switcher_style
spaces_map_v2
active_space_map_v2
goals_data
values_state
wishes_board
envelopes
debts
fin_ops
fin_recurring
fin_challenges
income_cards
income_cfg
fx_cfg
finlit_state
spend
work_sessions
work_cfg
work_extras
work_blocks
board
customboards
blockusage
spaceview
spacewide
spacecanvas
spacecanvaszoom
readerCfg
patterns_chains
patterns_score
patterns_transform
vision_v1
vault_cfg
custom_avatar_v1
diary_entries_v1
lang_pref
i18n_content_cache
```

### IndexedDB

| DB | STORE | рядок |
|---|---|---|
| `flow_books` | `books` | 22333 |
| `flow_docs` | `docs` | 22353 |

Модулі сховища: `BookDB` (рядок 22333), `DocDB` (рядок 22353)

## Карта по системах

> Рядки старту всіх сутностей нижче перевірені напряму проти поточного файлу. Розмір — реальний підрахунок парних дужок від декларації до закриття (не відстань до сусідньої сутності); де це виявилось ненадійним (~8 функцій із регулярними виразами в тілі), лишив грубішу, але безпечну оцінку — такі не позначені окремо, бо їх мало і різниця в межах десятків рядків.

### Редактор Папок/сторінок (АКТИВНА система блоків, SPECblocksv2) — 155 сутностей

> Основна робота сесії SPECblocksv2: дерево блоків, undo/redo, консолідована палітра, колонки, дошка, умовне відображення, стилі заголовків. Раніше цієї системи в карті не було — старий розділ «pg-editor» (WIDGET_CATALOG/addWidgetToFolder/openWidgetPicker) описував іншу систему (дашборд-віджети), перенесену нижче під власною назвою.

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| **Палітра блоків (CATALOG, пошук, «Нещодавні»)** | | | |
| `PGS_CATS` | var | 27050–27056 | 7 |
| `CATALOG` | var | 27057–27090 | 34 |
| `PGS_SYN` | var | 27092–27118 | 27 |
| `PGS_ICONS` | var | 27121–27174 | 54 |
| `pgsIc` | function | 27175–27175 | 1 |
| `pgsDemo` | function | 27176–27202 | 27 |
| `pgsFiltered` | function | 28049–28058 | 10 |
| `buildRail` | function | 28059–28067 | 9 |
| `buildSlash` | function | 28068–28097 | 30 |
| `pgLastGet` | function | 27764–27764 | 1 |
| `pgLastSet` | function | 27765–27765 | 1 |
| `PGLAST` | var | 27763–27763 | 1 |
| `PGRECENT` | var | 27767–27767 | 1 |
| `pgRecentGet` | function | 27768–27768 | 1 |
| `pgRecentAdd` | function | 27769–27769 | 1 |
| **Дерево блоків, переміщення, undo/redo** | | | |
| `bridge` | function | 27204–27204 | 1 |
| `editor` | var | 27205–27205 | 1 |
| `scr` | var | 27206–27206 | 1 |
| `uid` | var | 27207–27207 | 1 |
| `esc` | function | 27208–27208 | 1 |
| `txtOf` | function | 27211–27211 | 1 |
| `setTxt` | function | 27212–27212 | 1 |
| `locate` | function | 27214–27221 | 8 |
| `save` | function | 27222–27222 | 1 |
| `moveBlock` | function | 27226–27247 | 22 |
| `moveBlockSide` | function | 27296–27330 | 35 |
| `snapshotArr` | function | 27248–27248 | 1 |
| `restoreArr` | function | 27249–27249 | 1 |
| `equalizeWidths` | function | 27250–27250 | 1 |
| `undoMove` | function | 27331–27335 | 5 |
| `redoMove` | function | 27336–27340 | 5 |
| `undoStack` | var | 27343–27343 | 1 |
| `pushOp` | function | 27344–27348 | 5 |
| `doUndo` | function | 27349–27349 | 1 |
| `doRedo` | function | 27350–27350 | 1 |
| `syncUndoBtn` | function | 27351–27351 | 1 |
| **Стиль заголовків і умовне відображення** | | | |
| `PGH_FONTS` | var | 27253–27253 | 1 |
| `headingStyle` | function | 27254–27262 | 9 |
| `pgShowHidden` | var | 27265–27265 | 1 |
| `pbarAutoValue` | function | 27266–27270 | 5 |
| `condMet` | function | 27271–27292 | 22 |
| `openCondSheet` | function | 28203–28254 | 52 |
| `openHeadingStyleSheet` | function | 28256–28299 | 44 |
| **Рендер блоків (inner/renderList + ряди/дошка)** | | | |
| `STATUS_COLORS` | var | 27361–27361 | 1 |
| `STATUS_ORDER` | var | 27362–27362 | 1 |
| `dbColType` | function | 27363–27363 | 1 |
| `dbFmtNum` | function | 27364–27364 | 1 |
| `inner` | function | 27366–27685 | 320 |
| `dbEnsure` | function | 27687–27703 | 17 |
| `dbHTML` | function | 27704–27752 | 49 |
| `pgSgBusy` | var | 27754–27754 | 1 |
| `pgSgPlace` | function | 27755–27762 | 8 |
| `renderList` | function | 27770–27787 | 18 |
| `renderBoardBlock` | function | 27789–27806 | 18 |
| `renderRowBlock` | function | 27808–27824 | 17 |
| `renumber` | function | 27825–27825 | 1 |
| `pgPath` | var | 27827–27827 | 1 |
| `pgResolve` | function | 27828–27837 | 10 |
| `pgHeaStrip` | function | 27838–27873 | 36 |
| `render` | function | 27874–27930 | 57 |
| `fillWidgetHosts` | function | 27932–27941 | 10 |
| `caretEnd` | function | 27949–27949 | 1 |
| **Слеш-меню вставки блоку** | | | |
| `slashCtx` | var | 27952–27952 | 1 |
| `slash` | var | 28045–28046 | 2 |
| `srail` | var | 28047–28047 | 1 |
| `pgsCat` | var | 28048–28048 | 1 |
| `pgAsk` | function | 28188–28201 | 14 |
| `positionSlash` | function | 28327–28349 | 23 |
| `openSlash` | function | 28350–28355 | 6 |
| `closeSlash` | function | 28356–28356 | 1 |
| `applySlash` | function | 28358–28489 | 132 |
| **Drag & drop (блоки, колонки, дошка)** | | | |
| `drag` | var | 28493–28493 | 1 |
| `dstart` | function | 28496–28504 | 9 |
| `ghostMake` | function | 28506–28514 | 9 |
| `ghostMove` | function | 28515–28515 | 1 |
| `ghostKill` | function | 28516–28516 | 1 |
| `clearMarks` | function | 28517–28517 | 1 |
| `dmove` | function | 28518–28539 | 22 |
| `dend` | function | 28540–28551 | 12 |
| `cancelDrag` | function | 28552–28558 | 7 |
| **Меню блока (довге натискання)** | | | |
| `bmenu` | var | 28631–28631 | 1 |
| `openBmenu` | function | 28632–28632 | 1 |
| `closeBmenu` | function | 28666–28666 | 1 |
| **Тема й шапка редактора** | | | |
| `THKEY` | var | 28708–28708 | 1 |
| `applyTheme` | function | 28709–28711 | 3 |
| `savedTheme` | var | 28720–28720 | 1 |
| `pgTitle` | var | 28723–28723 | 1 |
| `addBtn` | var | 28733–28733 | 1 |
| **Тайли віджетів даних (Відлік/Щоденник/Лог рішень/Проєкти/Звички/Хаб)** | | | |
| `CD_MONTHS` | var | 28742–28742 | 1 |
| `cdFmt` | function | 28743–28747 | 5 |
| `cdHTML` | function | 28748–28762 | 15 |
| `cdTick` | function | 29308–29332 | 25 |
| `JR_WD` | var | 28765–28765 | 1 |
| `JR_MON` | var | 28766–28766 | 1 |
| `jrOpen` | var | 28767–28767 | 1 |
| `jrEdit` | var | 28768–28768 | 1 |
| `jrYmd` | function | 28769–28769 | 1 |
| `jrParse` | function | 28770–28770 | 1 |
| `jrStreak` | function | 28771–28776 | 6 |
| `jrHTML` | function | 28777–28869 | 93 |
| `jrTdAdd` | var | 28870–28870 | 1 |
| `jrExport` | function | 29282–29307 | 26 |
| `dlNew` | var | 28872–28872 | 1 |
| `dlDaysLeft` | function | 28873–28876 | 4 |
| `dlHTML` | function | 28877–28958 | 82 |
| `dlExport` | function | 28959–28981 | 23 |
| `ptStepAdd` | var | 28984–28984 | 1 |
| `PT_WD` | var | 28985–28985 | 1 |
| `ptWeekDays` | function | 28986–28989 | 4 |
| `ptHabStreak` | function | 28990–28992 | 3 |
| `ptProgress` | function | 28993–29000 | 8 |
| `ptHTML` | function | 29001–29082 | 82 |
| `currentPtKey` | function | 29260–29260 | 1 |
| `ptExport` | function | 29261–29280 | 20 |
| `hbAdd` | var | 29084–29084 | 1 |
| `HB_COLORS` | var | 29085–29085 | 1 |
| `hbHTML` | function | 29086–29133 | 48 |
| `hbExport` | function | 29134–29150 | 17 |
| `phOpen` | var | 29153–29153 | 1 |
| `PH_COLORS` | var | 29154–29154 | 1 |
| `phHTML` | function | 29155–29233 | 79 |
| `phExport` | function | 29234–29250 | 17 |
| **Фото / обкладинка сторінки / календар (спільні утиліти)** | | | |
| `pgFileIc` | function | 29252–29259 | 8 |
| `CAL_MONTHS` | var | 29336–29336 | 1 |
| `calWrap` | var | 29337–29337 | 1 |
| `calId` | var | 29348–29348 | 1 |
| `calYmd` | function | 29349–29349 | 1 |
| `openCal` | function | 29350–29357 | 8 |
| `closeCal` | function | 29358–29358 | 1 |
| `buildCal` | function | 29359–29375 | 17 |
| `pgPickPhoto` | function | 29798–29822 | 25 |
| `PGPH_SIZES` | var | 29823–29823 | 1 |
| `pgSzBox` | var | 29824–29824 | 1 |
| `pgSzBuild` | function | 29825–29852 | 28 |
| `pgSzSync` | function | 29853–29859 | 7 |
| `pgSzClose` | function | 29860–29860 | 1 |
| `pgPhotoSizeSheet` | function | 29861–29863 | 3 |
| `pgPhotoMenu` | function | 29864–29876 | 13 |
| `pgRz` | var | 29885–29885 | 1 |
| `COVKEY` | var | 29907–29907 | 1 |
| `covers` | var | 29908–29908 | 1 |
| `saveCovers` | function | 29916–29919 | 4 |
| `COV_GRADS` | var | 29920–29925 | 6 |
| `covEl` | var | 29926–29926 | 1 |
| `pgHasCov` | function | 29927–29927 | 1 |
| `covKey` | function | 29928–29928 | 1 |
| `covMenuHTML` | function | 29929–29935 | 7 |
| `renderCover` | function | 29936–29965 | 30 |
| `covPickPhoto` | function | 29966–30006 | 41 |
| `covEdBox` | var | 30007–30007 | 1 |
| `covEdState` | function | 30008–30013 | 6 |
| `covEdSync` | function | 30014–30026 | 13 |
| `covEdBuild` | function | 30027–30075 | 49 |
| `covEdOpen` | function | 30076–30076 | 1 |
| `covEdClose` | function | 30077–30077 | 1 |

> Скоуп файлу: рядки ~27046–30088 усередині script-блоку #8 (той самий блок раніше містив лише 3 задокументовані сутності). Далі в тому ж блоці (рядки ~30089+) — окрема система «je*» (Щоденник/Diary), не займана в цій сесії, лишена в «Інше/не класифіковано».

### Дашборд-віджети (WIDGET_CATALOG — ЦЕ НЕ редактор сторінок, окрема система) — 3 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `WIDGET_CATALOG` | object | 8761–8770 | 10 |
| `addWidgetToFolder` | function | 8783–8790 | 8 |
| `openWidgetPicker` | function | 19803–19824 | 22 |

### Простір / BLOCK_TYPES (LEGACY — не додавати нове) — 7 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `deleteSpace` | function | 10099–10110 | 12 |
| `BLOCK_TYPES` | object | 21342–21391 | 50 |
| `buildAddSheet` | function | 21839–21839 | 1 |
| `buildBlock` | function | 22102–22153 | 52 |
| `spaceDashHTML` | function | 23020–23056 | 37 |
| `renderTileFull` | function | 23247–23266 | 20 |
| `renderTile` | function | 23298–23298 | 1 |

### Захист.SK (агенція) — 39 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `AGENCY_KEY` | const | 8907–8907 | 1 |
| `agBoard` | function | 8910–8910 | 1 |
| `goAgency` | function | 8915–8921 | 7 |
| `renderAgency` | function | 8923–8929 | 7 |
| `agEnterFx` | function | 8930–8932 | 3 |
| `agTodayItems` | function | 8953–8971 | 19 |
| `renderAgHome` | function | 8988–9091 | 104 |
| `agRipple` | function | 9093–9098 | 6 |
| `renderAgDocs` | function | 9101–9101 | 1 |
| `agVaultUpload` | function | 9146–9146 | 1 |
| `renderAgCli` | function | 9273–9273 | 1 |
| `agMakeBlock` | function | 9371–9371 | 1 |
| `agRenameBlock` | function | 9372–9372 | 1 |
| `agClientsBlock` | function | 9536–9541 | 6 |
| `agClients` | function | 9542–9542 | 1 |
| `agClientById` | function | 9543–9543 | 1 |
| `agClientPaid` | function | 9545–9545 | 1 |
| `agClientOwe` | function | 9546–9546 | 1 |
| `agClientDocsDone` | function | 9547–9547 | 1 |
| `agClientNext` | function | 9552–9561 | 10 |
| `agCreateClient` | function | 9564–9572 | 9 |
| `agAddClientFlow` | function | 9574–9584 | 11 |
| `openClient` | function | 9586–9586 | 1 |
| `renderClient` | function | 9588–9679 | 92 |
| `agPhotoView` | function | 9710–9721 | 12 |
| `wireClient` | function | 9723–9723 | 1 |
| `agUnapplyPaymentEffects` | function | 9818–9825 | 8 |
| `agAddPayment` | function | 9827–9840 | 14 |
| `AI_AGENT_ADDON` | const | 15772–15772 | 1 |
| `flowToolAgency` | function | 16134–16177 | 44 |
| `fcBindDrag` | function | 16774–16810 | 37 |
| `aiHamWakeFrom` | function | 16991–16997 | 7 |
| `petSleepNow` | function | 17018–17029 | 12 |
| `agAttachFromLibrary` | function | 22391–22409 | 19 |
| `agOpenFile` | function | 22411–22423 | 13 |
| `agDownloadFile` | function | 22442–22448 | 7 |
| `scrollFraction` | function | 22743–22747 | 5 |
| `restoreScroll` | function | 22748–22753 | 6 |
| `seedAgencySlovakia` | function | 25582–25592 | 11 |

### Фінанси — 48 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `goFinance` | function | 8899–8899 | 1 |
| `goEnvelopes` | function | 8900–8900 | 1 |
| `agEnvById` | function | 9188–9188 | 1 |
| `envelopes` | array | 12193–12193 | 1 |
| `ENVKEY` | const | 12194–12194 | 1 |
| `saveEnvelopes` | function | 12195–12195 | 1 |
| `envTotalSaved` | function | 12211–12211 | 1 |
| `envDelOp` | function | 12231–12238 | 8 |
| `envSummary` | function | 12239–12239 | 1 |
| `finOps` | array | 12242–12242 | 1 |
| `saveFinOps` | function | 12244–12244 | 1 |
| `cardOps` | function | 12265–12265 | 1 |
| `cardFundEnvelope` | function | 12355–12368 | 14 |
| `monthAgg` | function | 12564–12564 | 1 |
| `finlitScore` | function | 12620–12637 | 18 |
| `litStreak` | function | 12640–12646 | 7 |
| `finIncome` | function | 12716–12716 | 1 |
| `finExpense` | function | 12717–12717 | 1 |
| `finBalance` | function | 12718–12718 | 1 |
| `renderFinance` | function | 12729–12734 | 6 |
| `topCat` | function | 12752–12760 | 9 |
| `finNorm` | function | 12764–12783 | 20 |
| `finWeekHTML` | function | 12786–12818 | 33 |
| `finTopCats` | function | 12820–12833 | 14 |
| `finFreedomHTML` | function | 12848–12880 | 33 |
| `renderFinDash` | function | 12882–13024 | 143 |
| `renderEnvScreen` | function | 13050–13091 | 42 |
| `newEnvelope` | function | 13162–13177 | 16 |
| `projDistributeToEnvelope` | function | 13564–13585 | 22 |
| `createEnvelopeFor` | function | 13588–13603 | 16 |
| `pickEnvelopeFor` | function | 13605–13615 | 11 |
| `renderEnvSheet` | function | 13616–13682 | 67 |
| `DEV_FEATURES` | array | 15434–15444 | 11 |
| `aiAgentStatusFor` | function | 15664–15693 | 30 |
| `flowToolFinance` | function | 15939–16042 | 104 |
| `aiFinCtx` | function | 16296–16315 | 20 |
| `aiEnvKpi` | function | 17755–17761 | 7 |
| `spendOps` | function | 20085–20085 | 1 |
| `migrateSpendsToFin` | function | 20086–20099 | 14 |
| `delSpend` | function | 20113–20113 | 1 |
| `clearSpend` | function | 20170–20170 | 1 |
| `transferPlannedToEnvelopes` | function | 20450–20464 | 15 |
| `workPlannedTotal` | function | 20467–20470 | 4 |
| `openAllocModal` | function | 20471–20493 | 23 |
| `allocSave` | function | 20505–20516 | 12 |
| `delWork` | function | 20647–20656 | 10 |
| `WIDGET_TYPES` | array | 21393–21393 | 1 |
| `vzFin` | function | 25970–25974 | 5 |

### Планувальник — 18 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `goPlanner` | function | 10842–10842 | 1 |
| `RIT_KEY` | const | 11302–11302 | 1 |
| `loadRitual` | function | 11305–11306 | 2 |
| `saveRitual` | function | 11307–11307 | 1 |
| `ritualRerender` | function | 11310–11311 | 2 |
| `goRitual` | function | 11312–11315 | 4 |
| `ritMixPlay` | function | 11393–11400 | 8 |
| `ritualInnerHTML` | function | 11442–11442 | 1 |
| `ritualBind` | function | 11490–11533 | 44 |
| `goalsData` | object | 13685–13686 | 2 |
| `renderGoalsTab` | function | 14048–14093 | 46 |
| `plData` | function | 14302–14324 | 23 |
| `plRerender` | function | 14735–14739 | 5 |
| `renderPlanner` | function | 14741–14963 | 223 |
| `flowToolExec` | function | 15785–15811 | 27 |
| `flowToolPlanner` | function | 15855–15880 | 26 |
| `vzRzToday` | function | 26147–26147 | 1 |
| `vzRzDayFull` | function | 26148–26149 | 2 |

### Spark AI (компаньйон) — 9 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `finSpark` | function | 12737–12743 | 7 |
| `finSpark7Total` | function | 12744–12744 | 1 |
| `PL_ICONS` | object | 14596–14603 | 8 |
| `FLOW_PETS` | object | 16615–16643 | 29 |
| `petCur` | function | 16647–16647 | 1 |
| `petSVG` | function | 16649–16689 | 41 |
| `FC_EMO` | object | 16910–16910 | 1 |
| `fcEmote` | function | 16911–16921 | 11 |
| `FC_SAY` | object | 17043–17060 | 18 |

### Локалізація (i18n) — 2 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `devContentTranslateToggleSheet` | function | 15396–15412 | 17 |
| `enableCanvasZoom` | function | 24808–24916 | 109 |

### Platform / iOS / Capacitor — 10 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `vaultAttachLongPress` | function | 8723–8742 | 20 |
| `setCardSkin` | function | 10655–10660 | 6 |
| `setZen` | function | 10449–10454 | 6 |
| `aiDevCtx` | function | 15421–15432 | 12 |
| `DEV_TOOLS` | array | 15477–15500 | 24 |
| `devToolStorage` | function | 15503–15541 | 39 |
| `fcWakeNow` | function | 17031–17040 | 10 |
| `fireReminder` | function | 21743–21753 | 11 |
| `plFireReminder` | function | 21801–21811 | 11 |
| `vzKtAnswer` | function | 26183–26186 | 4 |

### Сховище (IndexedDB) — 2 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `BookDB` | const | 22333–22350 | 18 |
| `DocDB` | const | 22353–22370 | 18 |

### Інше / не класифіковано — 894 сутностей

| Назва | Тип | Рядки | Розмір |
|---|---|---|---|
| `ymdLocal` | function | 7375–7376 | 2 |
| `ymLocal` | function | 7377–7377 | 1 |
| `prefSet` | function | 8387–8390 | 4 |
| `prefCatchup` | function | 8391–8401 | 11 |
| `UIMODE_KEY` | const | 8404–8404 | 1 |
| `applyUiMode` | function | 8406–8406 | 1 |
| `setUiMode` | function | 8407–8414 | 8 |
| `folders` | object | 8617–8620 | 4 |
| `order` | array | 8621–8621 | 1 |
| `FKEY` | const | 8628–8628 | 1 |
| `FOKEY` | const | 8628–8628 | 1 |
| `FOLDER_COLORS` | array | 8629–8629 | 1 |
| `FOLDER_EMOJIS` | array | 8630–8630 | 1 |
| `VAULT_KEY` | const | 8635–8635 | 1 |
| `saveVaultCfg` | function | 8638–8638 | 1 |
| `vaultHash` | function | 8639–8653 | 15 |
| `vaultRandSalt` | function | 8654–8657 | 4 |
| `vaultLock` | function | 8658–8664 | 7 |
| `vaultPinSheet` | function | 8669–8720 | 52 |
| `folderVisible` | function | 8744–8744 | 1 |
| `saveFolders` | function | 8747–8757 | 11 |
| `folderWidgets` | object | 8771–8771 | 1 |
| `FWKEY` | const | 8772–8772 | 1 |
| `saveFolderWidgets` | function | 8773–8773 | 1 |
| `widgetsForFolder` | function | 8774–8782 | 9 |
| `removeWidgetFromFolder` | function | 8791–8794 | 4 |
| `orderedFolderKeys` | function | 8796–8799 | 4 |
| `FOLDER_ROLES` | object | 8802–8806 | 5 |
| `PROJECT_STATUSES` | array | 8807–8810 | 4 |
| `projStatusMeta` | function | 8811–8811 | 1 |
| `folderProgress` | function | 8813–8824 | 12 |
| `dueLabel` | function | 8825–8832 | 8 |
| `projFolderKeys` | function | 8834–8834 | 1 |
| `folderNextStep` | function | 8836–8846 | 11 |
| `completeFolderNextStep` | function | 8847–8853 | 7 |
| `childFolderKeys` | function | 8856–8858 | 3 |
| `topFolderKeys` | function | 8859–8861 | 3 |
| `isDescendantFolder` | function | 8862–8869 | 8 |
| `moveFolderTo` | function | 8870–8877 | 8 |
| `goHome` | function | 8880–8880 | 1 |
| `goFolder` | function | 8881–8897 | 17 |
| `goDebts` | function | 8898–8898 | 1 |
| `goSpend` | function | 8901–8901 | 1 |
| `goWork` | function | 8903–8903 | 1 |
| `goSpace` | function | 8904–8904 | 1 |
| `agFindType` | function | 8911–8911 | 1 |
| `agFindAll` | function | 8912–8912 | 1 |
| `agProjBlock` | function | 8913–8913 | 1 |
| `agMovePill` | function | 8933–8939 | 7 |
| `agRing` | function | 8943–8950 | 8 |
| `AG_STG_COLORS` | object | 8973–8973 | 1 |
| `agMonthsBack` | function | 8974–8980 | 7 |
| `agAdvanceStage` | function | 8981–8986 | 6 |
| `agBindSwipe` | function | 9173–9185 | 13 |
| `renderAgFin` | function | 9189–9260 | 72 |
| `agRegSort` | object | 9263–9263 | 1 |
| `agKanHtml` | function | 9264–9271 | 8 |
| `agWireKanban` | function | 9346–9351 | 6 |
| `agBlockById` | function | 9354–9354 | 1 |
| `agTextModal` | function | 9355–9370 | 16 |
| `agDatePrompt` | function | 9373–9376 | 4 |
| `agHd` | function-expr | 9377–9384 | 8 |
| `agMissBtn` | function-expr | 9378–9384 | 7 |
| `agNoteHtml` | function-expr | 9379–9384 | 6 |
| `agWireCommon` | function | 9380–9384 | 5 |
| `renderAgMkt` | function | 9387–9433 | 47 |
| `renderAgOps` | function | 9436–9511 | 76 |
| `SWKEY` | const | 9518–9518 | 1 |
| `spacesMap` | object | 9523–9523 | 1 |
| `activeSpaceMap` | object | 9523–9523 | 1 |
| `SPMKEY` | const | 9524–9524 | 1 |
| `ACMKEY` | const | 9524–9524 | 1 |
| `AG_STAGES` | array | 9531–9531 | 1 |
| `AG_SERVICES` | array | 9532–9532 | 1 |
| `agInit` | function | 9548–9548 | 1 |
| `agColorFor` | function | 9549–9549 | 1 |
| `agContactSummary` | function | 9682–9691 | 10 |
| `agPhotoMenu` | function | 9693–9703 | 11 |
| `agPhotoUpload` | function | 9704–9704 | 1 |
| `agApplyPaymentEffects` | function | 9800–9816 | 17 |
| `agRemovePayment` | function | 9841–9848 | 8 |
| `agEditPayment` | function | 9850–9872 | 23 |
| `agResetAllPayments` | function | 9874–9903 | 30 |
| `agPartnersBlock` | function | 9907–9923 | 17 |
| `agProfitPool` | function | 9926–9938 | 13 |
| `agPartnerShare` | function | 9939–9939 | 1 |
| `agPartnerPaid` | function | 9940–9940 | 1 |
| `agPartnerDue` | function | 9941–9941 | 1 |
| `renderAgPartners` | function | 9943–9996 | 54 |
| `wirePartners` | function | 9998–10038 | 41 |
| `ptNewTerm` | function | 10039–10042 | 4 |
| `saveSpacesMeta` | function | 10044–10044 | 1 |
| `curCtx` | function | 10047–10050 | 4 |
| `ctxBaseKey` | function | 10051–10051 | 1 |
| `ctxDefaultMeta` | function | 10052–10056 | 5 |
| `spacesFor` | function | 10058–10062 | 5 |
| `activeSpaceFor` | function | 10063–10063 | 1 |
| `spaceByIdIn` | function | 10064–10064 | 1 |
| `keyForSpaceIn` | function | 10065–10065 | 1 |
| `spaceCountIn` | function | 10066–10066 | 1 |
| `goActiveSpace` | function | 10069–10075 | 7 |
| `switchSpace` | function | 10077–10085 | 9 |
| `addSpace` | function | 10086–10098 | 13 |
| `renderSpaceSwitcher` | function | 10113–10151 | 39 |
| `openSpaceSettings` | function | 10154–10154 | 1 |
| `goSpaceFor` | function | 10205–10225 | 21 |
| `show` | function | 11–18 | 8 |
| `openSpaceMore` | function | 10275–10298 | 24 |
| `dsbFillUser` | function | 10302–10331 | 30 |
| `dsbProfileSheet` | function | 10333–10363 | 31 |
| `renderSettingsCard` | function | 10371–10371 | 1 |
| `openSettings` | function | 10423–10438 | 16 |
| `applySpaceLayout` | function | 10523–10528 | 6 |
| `applyChrome` | function | 10540–10545 | 6 |
| `renderPaneList` | function | 10556–10585 | 30 |
| `applyHomeWidgets` | function | 10590–10597 | 8 |
| `THEME_META` | object | 10606–10606 | 1 |
| `applyTheme` | function | 10607–10617 | 11 |
| `toggleTheme` | function | 10619–10625 | 7 |
| `applyProTheme` | function | 10631–10635 | 5 |
| `toggleProTheme` | function | 10637–10643 | 7 |
| `applyCardSkin` | function | 10649–10653 | 5 |
| `applyZen` | function | 10666–10672 | 7 |
| `tidyCanvas` | function | 10705–10712 | 8 |
| `RR_DEFS` | object | 10724–10724 | 1 |
| `rrCfg` | function | 10725–10729 | 5 |
| `rrSave` | function | 10730–10730 | 1 |
| `rrCfgSheet` | function | 10731–10731 | 1 |
| `renderRightRail` | function | 10750–10782 | 33 |
| `goGoals` | function | 10784–10784 | 1 |
| `prjHexToRgb` | function | 10787–10794 | 8 |
| `prjTileHTML` | function | 10795–10802 | 8 |
| `renderProjects` | function | 10803–10837 | 35 |
| `goProjects` | function | 10838–10838 | 1 |
| `goValues` | function | 10843–10843 | 1 |
| `goWishes` | function | 10845–10845 | 1 |
| `WICONS` | object | 10874–10886 | 13 |
| `icoHtml` | function | 10887–10887 | 1 |
| `actionSheet` | function | 10890–10913 | 24 |
| `confirmSheet` | function | 10914–10922 | 9 |
| `flowAlert` | function | 10925–10932 | 8 |
| `WISH_KEY` | const | 10934–10934 | 1 |
| `wishes` | array | 10936–10936 | 1 |
| `loadWishes` | function | 10939–10942 | 4 |
| `saveWishes` | function | 10944–10951 | 8 |
| `HOMEGLASS_KEY` | const | 10954–10954 | 1 |
| `loadHomeGlass` | function | 10957–10957 | 1 |
| `saveHomeGlass` | function | 10958–10958 | 1 |
| `applyHomeGlass` | function | 10959–10959 | 1 |
| `WPRICE_KEY` | const | 10962–10962 | 1 |
| `loadWishPrice` | function | 10965–10965 | 1 |
| `saveWishPrice` | function | 10966–10966 | 1 |
| `wishPriceHTML` | function | 10967–10973 | 7 |
| `bindWishPrice` | function | 10974–10980 | 7 |
| `updateSummaryBg` | function | 10984–11025 | 42 |
| `compressImage` | function | 11028–11045 | 18 |
| `pickWishPhoto` | function | 11047–11047 | 1 |
| `WISH_SIZES` | array | 11073–11073 | 1 |
| `WISH_SIZE_LABEL` | object | 11074–11074 | 1 |
| `cycleWishSize` | function | 11075–11080 | 6 |
| `askWishCap` | function | 11081–11085 | 5 |
| `openWishCard` | function | 11087–11160 | 74 |
| `pickProofPhoto` | function | 11161–11161 | 1 |
| `delWish` | function | 11168–11176 | 9 |
| `parseVideo` | function | 11180–11197 | 18 |
| `addWishVideo` | function | 11198–11221 | 24 |
| `setWishCover` | function | 11223–11223 | 1 |
| `openWishVideo` | function | 11236–11242 | 7 |
| `openWishMenu` | function | 11245–11267 | 23 |
| `moveWish` | function | 11268–11273 | 6 |
| `wishToGoal` | function | 11275–11296 | 22 |
| `RIT` | object | 11303–11303 | 1 |
| `ritDay` | function | 11334–11334 | 1 |
| `ritDs` | function | 11335–11335 | 1 |
| `ritStreak` | function | 11336–11349 | 14 |
| `ytId` | function | 11350–11350 | 1 |
| `fmtDur` | function | 11351–11351 | 1 |
| `ritMixQ` | array | 11354–11354 | 1 |
| `ritStopAll` | function | 11355–11356 | 2 |
| `ritRecord` | function | 11357–11384 | 28 |
| `ritPlay` | function | 11392–11392 | 1 |
| `ritFieldMic` | function | 11401–11410 | 10 |
| `ritMixMenu` | function | 11411–11418 | 8 |
| `ritAddLink` | function | 11419–11428 | 10 |
| `ritLinkMenu` | function | 11429–11437 | 9 |
| `RIT_J` | array | 11439–11441 | 3 |
| `RPH_ICON` | const | 11535–11535 | 1 |
| `ritPhotoCardHTML` | function | 11536–11549 | 14 |
| `ritPhotoTap` | function | 11550–11580 | 31 |
| `fetchWithTimeout` | function | 11561–11566 | 6 |
| `ritSavePhoto` | function | 11567–11584 | 18 |
| `ritPhotoMenu` | function | 11585–11592 | 8 |
| `ritEnterMoment` | function | 11595–11626 | 32 |
| `ritMixRecTap` | function | 11627–11627 | 1 |
| `ritMixLongOrRec` | function | 11628–11633 | 6 |
| `CLG_KEY` | const | 11636–11636 | 1 |
| `collage` | array | 11637–11637 | 1 |
| `loadCollage` | function | 11639–11640 | 2 |
| `saveCollage` | function | 11641–11641 | 1 |
| `goCollage` | function | 11644–11644 | 1 |
| `clgPickPhotos` | function | 11647–11647 | 1 |
| `clgImportWishes` | function | 11662–11672 | 11 |
| `clgMenu` | function | 11673–11685 | 13 |
| `renderCollage` | function | 11686–11740 | 55 |
| `clgWrap` | function | 11743–11748 | 6 |
| `clgWallpaper` | function | 11749–11820 | 72 |
| `wishDateInfo` | function | 11824–11842 | 19 |
| `renderWishDeck` | function | 11843–11917 | 75 |
| `renderWishes` | function | 11919–11988 | 70 |
| `VAL_KEY` | const | 11991–11991 | 1 |
| `VALUES_LIBRARY` | array | 11992–12001 | 10 |
| `valState` | object | 12002–12012 | 11 |
| `loadValues` | function | 12015–12017 | 3 |
| `saveValues` | function | 12018–12018 | 1 |
| `todayStr` | function | 12019–12019 | 1 |
| `dmy` | function | 12020–12020 | 1 |
| `VISION_Q` | array | 12022–12028 | 7 |
| `ANTI_Q` | array | 12029–12033 | 5 |
| `DAILY_AM` | array | 12034–12037 | 4 |
| `DAILY_PM` | array | 12038–12041 | 4 |
| `renderValues` | function | 12043–12060 | 18 |
| `renderCompass` | function | 12062–12109 | 48 |
| `renderEditCards` | function | 12111–12129 | 19 |
| `renderValVision` | function | 12130–12133 | 4 |
| `renderAnti` | function | 12134–12137 | 4 |
| `renderDaily` | function | 12139–12139 | 1 |
| `envMigrate` | function | 12201–12208 | 8 |
| `envSaved` | function | 12209–12209 | 1 |
| `envSpentOut` | function | 12210–12210 | 1 |
| `envAddOp` | function | 12214–12230 | 17 |
| `FINOPKEY` | const | 12243–12243 | 1 |
| `recurring` | array | 12246–12246 | 1 |
| `RECKEY` | const | 12247–12247 | 1 |
| `saveRecurring` | function | 12248–12248 | 1 |
| `challenges` | array | 12250–12250 | 1 |
| `CHKEY` | const | 12251–12251 | 1 |
| `saveChallenges` | function | 12252–12252 | 1 |
| `cards` | array | 9267–9267 | 1 |
| `CARDKEY` | const | 12256–12256 | 1 |
| `cardCfg` | object | 12257–12257 | 1 |
| `CARDCFGKEY` | const | 12257–12257 | 1 |
| `saveCards` | function | 12258–12258 | 1 |
| `saveCardCfg` | function | 12259–12259 | 1 |
| `CARD_TYPES` | object | 12260–12260 | 1 |
| `CARD_COLORS` | array | 12261–12261 | 1 |
| `mainCard` | function | 12262–12262 | 1 |
| `cardById` | function | 12263–12263 | 1 |
| `cardSym` | function | 12264–12264 | 1 |
| `cardBalance` | function | 12266–12266 | 1 |
| `cardMonthIn` | function | 12267–12267 | 1 |
| `cardsTotals` | function | 12268–12268 | 1 |
| `cardNum` | function | 12269–12269 | 1 |
| `incomeSummary` | function | 12270–12270 | 1 |
| `_projCardId` | function | 12271–12271 | 1 |
| `ensureCards` | function | 12272–12296 | 25 |
| `pickCard` | function | 12297–12305 | 9 |
| `newCard` | function | 12306–12316 | 11 |
| `cardSheet` | function | 12317–12339 | 23 |
| `cardTransfer` | function | 12340–12354 | 15 |
| `fx` | object | 12370–12370 | 1 |
| `FXKEY` | const | 12371–12371 | 1 |
| `saveFx` | function | 12372–12372 | 1 |
| `fxConv` | function | 12373–12373 | 1 |
| `fxTotalIn` | function | 12374–12374 | 1 |
| `fxUpdate` | function | 12375–12393 | 19 |
| `fxAgo` | function | 12394–12394 | 1 |
| `openFxSheet` | function | 12395–12404 | 10 |
| `cardQuickSheet` | function | 12407–12419 | 13 |
| `recDayOf` | function | 12421–12421 | 1 |
| `recAutoPost` | function | 12422–12444 | 23 |
| `nextRecurring` | function | 12445–12453 | 9 |
| `openNextSheet` | function | 12454–12468 | 15 |
| `goIncome` | function | 12469–12469 | 1 |
| `renderIncome` | function | 12470–12555 | 86 |
| `workCard` | function | 12557–12557 | 1 |
| `ANA_M` | array | 12560–12560 | 1 |
| `_isRealExpense` | function | 12561–12561 | 1 |
| `_isRealIncome` | function | 12562–12562 | 1 |
| `lastMonths` | function | 12563–12563 | 1 |
| `goAnalytics` | function | 12565–12565 | 1 |
| `renderAnalytics` | function | 12566–12602 | 37 |
| `finlit` | object | 12606–12606 | 1 |
| `FINLITKEY` | const | 12606–12606 | 1 |
| `saveFinlit` | function | 12607–12607 | 1 |
| `LIT_LESSONS` | array | 12608–12619 | 12 |
| `finlitScoreSafe` | function | 12638–12638 | 1 |
| `goFinlit` | function | 12639–12639 | 1 |
| `renderFinlit` | function | 12647–12647 | 1 |
| `planMonthTs` | function | 12710–12710 | 1 |
| `recTotal` | function | 12719–12719 | 1 |
| `finEnvIcon` | function | 12721–12728 | 8 |
| `nearestPay` | function | 12747–12750 | 4 |
| `finTopCatsHTML` | function | 12835–12847 | 13 |
| `bindFinDash` | function | 13026–13047 | 22 |
| `openChallengesSheet` | function | 13094–13111 | 18 |
| `addFinOp` | function | 13113–13116 | 4 |
| `addFinOpCard` | function | 13117–13127 | 11 |
| `newRecurring` | function | 13128–13142 | 15 |
| `newChallenge` | function | 13143–13153 | 11 |
| `editChallenge` | function | 13154–13160 | 7 |
| `openEnvSheet` | function | 13181–13185 | 5 |
| `closeEnvSheet` | function | 13186–13189 | 4 |
| `projIncome` | function | 13191–13191 | 1 |
| `projExpense` | function | 13192–13192 | 1 |
| `projNet` | function | 13193–13193 | 1 |
| `projIsLocked` | function | 13194–13199 | 6 |
| `projDaysLeft` | function | 13200–13204 | 5 |
| `projectWidgetHtml` | function | 13205–13280 | 76 |
| `fmtDate` | function | 13281–13281 | 1 |
| `kanbanWidgetHtml` | function | 13285–13298 | 14 |
| `kbwFind` | function | 13299–13299 | 1 |
| `kbwAddCard` | function | 13300–13309 | 10 |
| `kbwCardMenu` | function | 13310–13326 | 17 |
| `kbwColMenu` | function | 13327–13340 | 14 |
| `CTW_COLORS` | array | 13342–13342 | 1 |
| `ctwInit` | function | 13343–13347 | 5 |
| `contactsWidgetHtml` | function | 13348–13357 | 10 |
| `ctwAdd` | function | 13358–13367 | 10 |
| `ctwOpenLink` | function | 13368–13373 | 6 |
| `ctwMenu` | function | 13374–13383 | 10 |
| `clwFmt` | function | 13385–13389 | 5 |
| `caselineWidgetHtml` | function | 13390–13397 | 8 |
| `clwAdd` | function | 13398–13407 | 10 |
| `clwMenu` | function | 13408–13415 | 8 |
| `fstwCountdown` | function | 13417–13424 | 8 |
| `fstwSpent` | function | 13425–13425 | 1 |
| `festivalWidgetHtml` | function | 13426–13451 | 26 |
| `fstwSpend` | function | 13452–13461 | 10 |
| `fstwOpsSheet` | function | 13462–13469 | 8 |
| `fstwSetup` | function | 13470–13480 | 11 |
| `projAddMovement` | function | 13483–13507 | 25 |
| `projAskExpense` | function | 13508–13525 | 18 |
| `projReceiveExpected` | function | 13527–13537 | 11 |
| `projSplitPreset` | function | 13541–13561 | 21 |
| `GKEY` | const | 13687–13687 | 1 |
| `saveGoals` | function | 13688–13688 | 1 |
| `AI_EP_KEY` | const | 13692–13692 | 1 |
| `AI_EP_DEFAULT` | const | 13693–13693 | 1 |
| `aiEndpoint` | function | 13694–13694 | 1 |
| `aiConfig` | function | 13695–13700 | 6 |
| `aiSheetClose` | function | 13701–13701 | 1 |
| `aiStartSheet` | function | 13702–13732 | 31 |
| `aiGenerate` | function | 13733–13763 | 31 |
| `aiLocalDraft` | function | 13765–13788 | 24 |
| `DOW_SHORT` | array | 13789–13789 | 1 |
| `aiPreview` | function | 13790–13824 | 35 |
| `aiApplyDraft` | function | 13825–13863 | 39 |
| `renderGoals` | function | 13865–13927 | 63 |
| `dgDateStr` | function | 13930–13930 | 1 |
| `dgWeekDates` | function | 13931–13933 | 3 |
| `dgListFor` | function | 13934–13934 | 1 |
| `dgSync` | function | 13936–13956 | 21 |
| `dayGoalsBlock` | function | 13957–14006 | 50 |
| `pickFolderForGoal` | function | 14009–14046 | 38 |
| `currentWeekDates` | function | 14285–14292 | 8 |
| `PL_COL` | object | 14295–14295 | 1 |
| `PL_RGB` | object | 14296–14296 | 1 |
| `PL_PRIO` | object | 14297–14297 | 1 |
| `plFocusToday` | function | 14300–14301 | 2 |
| `plTodayStr` | function | 14325–14325 | 1 |
| `PL_REPEAT_LABEL` | object | 14327–14327 | 1 |
| `plRecurMatchesDay` | function | 14328–14338 | 11 |
| `plMaterializeRecurring` | function | 14340–14352 | 13 |
| `plBlocksFor` | function | 14354–14355 | 2 |
| `PL_MONTH_NAMES` | array | 14358–14358 | 1 |
| `plShiftCalMonth` | function | 14359–14363 | 5 |
| `plMonthWeeks` | function | 14365–14375 | 11 |
| `plGoalColorFor` | function | 14377–14383 | 7 |
| `plMonthCalHTML` | function | 14384–14459 | 76 |
| `plTemplateGoalMeta` | function | 14462–14468 | 7 |
| `plDowLabel` | function | 14469–14472 | 4 |
| `plTemplateListHTML` | function | 14473–14491 | 19 |
| `plToggleTemplate` | function | 14493–14503 | 11 |
| `plNewTemplateSheet` | function | 14505–14557 | 53 |
| `plHM` | function | 14559–14559 | 1 |
| `plHMtoDec` | function | 14560–14560 | 1 |
| `plDurLabel` | function | 14561–14561 | 1 |
| `PL_ICON_CORE` | object | 14563–14594 | 32 |
| `plIconStyle` | function | 14604–14604 | 1 |
| `plIco` | function | 14606–14611 | 6 |
| `plRing` | function | 14613–14619 | 7 |
| `goalPctP` | function | 14622–14626 | 5 |
| `renderPath` | function | 14627–14650 | 24 |
| `pathFlowHtml` | function | 14652–14670 | 19 |
| `brdRing` | function | 14701–14707 | 7 |
| `pathBridgeHtml` | function | 14708–14732 | 25 |
| `plFmtMMSS` | function | 14966–14966 | 1 |
| `plStartFocus` | function | 14967–15024 | 58 |
| `plFmtHMS` | function | 15029–15030 | 2 |
| `plNowInfo` | function | 15031–15039 | 9 |
| `plNowCardHTML` | function | 15040–15058 | 19 |
| `plNowTick` | function | 15059–15071 | 13 |
| `plNowLineHTML` | function | 15072–15073 | 2 |
| `plQuickAddHTML` | function | 15074–15079 | 6 |
| `plParseQuick` | function | 15080–15104 | 25 |
| `plWeekStats` | function | 15106–15118 | 13 |
| `plWeekReviewSheet` | function | 15119–15171 | 53 |
| `plWeekAI` | function | 15172–15196 | 25 |
| `aiChatMsgs` | array | 15199–15199 | 1 |
| `aiLog` | array | 15199–15199 | 1 |
| `aiMem` | array | 15201–15201 | 1 |
| `aiPrompts` | array | 15202–15202 | 1 |
| `aiAttach` | array | 15202–15202 | 1 |
| `aiPromptsSave` | function | 15203–15208 | 6 |
| `aiChatLoad` | function | 15209–15234 | 26 |
| `aiChatSave` | function | 15235–15241 | 7 |
| `aiMemSave` | function | 15242–15247 | 6 |
| `aiMemAdd` | function | 15248–15258 | 11 |
| `aiMoodCalc` | function | 15260–15273 | 14 |
| `aiMood` | function | 15274–15280 | 7 |
| `aiMoodBadge` | function | 15281–15286 | 6 |
| `AI_CHAT_SYS` | const | 15287–15290 | 4 |
| `aiCall` | function | 15314–15352 | 39 |
| `AI_AGENT_KEY` | const | 15358–15358 | 1 |
| `aiAgentOn` | function | 15359–15359 | 1 |
| `aiAgentSetStatus` | function | 15361–15366 | 6 |
| `aiDevOn` | function | 15372–15375 | 4 |
| `aiDevToggleSheet` | function | 15377–15393 | 17 |
| `AI_DEV_SYS` | const | 15414–15416 | 3 |
| `aiDevHelpText` | function | 15445–15449 | 5 |
| `aiDevConfirm` | function | 15452–15469 | 18 |
| `devSnapshot` | function | 15472–15475 | 4 |
| `devToolErrors` | function | 15542–15546 | 5 |
| `devToolCost` | function | 15547–15565 | 19 |
| `devToolSelftest` | function | 15566–15595 | 30 |
| `devToolData` | function | 15596–15615 | 20 |
| `devToolEval` | function | 15616–15629 | 14 |
| `aiPageAsk` | function | 15632–15638 | 7 |
| `aiMorningMaybe` | function | 15640–15650 | 11 |
| `aiWeeklyMaybe` | function | 15652–15663 | 12 |
| `FLOW_TOOLS` | array | 15695–15770 | 76 |
| `flowToolRead` | function | 15812–15854 | 43 |
| `flowToolGoals` | function | 15882–15916 | 35 |
| `aiToolConfirm` | function | 15917–15935 | 19 |
| `aiFinConfirm` | function | 15936–15938 | 3 |
| `flowToolPatterns` | function | 16043–16063 | 21 |
| `flowToolMemory` | function | 16064–16080 | 17 |
| `flowToolFolders` | function | 16081–16133 | 53 |
| `aiPickModel` | function | 16178–16184 | 7 |
| `aiUsageAdd` | function | 16186–16196 | 11 |
| `aiCallRaw` | function | 16198–16256 | 59 |
| `aiAgentTurn` | function | 16258–16293 | 36 |
| `aiCtx` | function | 16316–16353 | 38 |
| `aiFindGoal` | function | 16355–16358 | 4 |
| `aiParseBlocks` | function | 16359–16389 | 31 |
| `aiOpsCount` | function | 16390–16393 | 4 |
| `aiStreamText` | function | 16395–16399 | 5 |
| `aiFindBlockByT` | function | 16400–16404 | 5 |
| `aiFindFolderKey` | function | 16406–16412 | 7 |
| `aiBuildPageBlock` | function | 16414–16432 | 19 |
| `aiApplyPages` | function | 16433–16454 | 22 |
| `aiApplyActions` | function | 16456–16546 | 91 |
| `aiCommit` | function | 16547–16562 | 16 |
| `aiUndo` | function | 16563–16613 | 51 |
| `petPersona` | function | 16648–16648 | 1 |
| `petPickerSheet` | function | 16690–16758 | 69 |
| `petSleeping` | function | 16759–16759 | 1 |
| `petSleepSet` | function | 16760–16760 | 1 |
| `fcPos` | function | 16762–16762 | 1 |
| `fcClamp` | function | 16763–16767 | 5 |
| `fcApplyPos` | function | 16768–16773 | 6 |
| `fcBurst` | function | 16812–16819 | 8 |
| `frMode` | function | 16822–16822 | 1 |
| `frModeSet` | function | 16823–16823 | 1 |
| `frSayOn` | function | 16824–16824 | 1 |
| `frSaySet` | function | 16825–16825 | 1 |
| `FR_PRESETS` | object | 16826–16836 | 11 |
| `flowReactAt` | function | 16838–16862 | 25 |
| `flowReact` | function | 16863–16897 | 35 |
| `flowSay` | function | 16899–16908 | 10 |
| `fcLifeStart` | function | 16923–16932 | 10 |
| `petSVGSleep` | function | 16934–16939 | 6 |
| `AI_HAM_ACTS` | array | 16941–16948 | 8 |
| `aiHamAct` | function | 16949–16952 | 4 |
| `aiHamNextAct` | function | 16953–16957 | 5 |
| `aiHamCoreHTML` | function | 16959–16970 | 12 |
| `aiHamSceneHTML` | function | 16971–16978 | 8 |
| `aiHamRotStart` | function | 16981–16990 | 10 |
| `aiHamBind` | function | 16998–17002 | 5 |
| `aiWakeInChat` | function | 17004–17017 | 14 |
| `fcSayPick` | function | 17061–17073 | 13 |
| `fcSayHide` | function | 17075–17075 | 1 |
| `fcSayShow` | function | 17076–17097 | 22 |
| `fcSayStart` | function | 17098–17102 | 5 |
| `flowCapRender` | function | 17103–17124 | 22 |
| `spotMsgs` | array | 17156–17156 | 1 |
| `spotCtx` | function | 17157–17170 | 14 |
| `spotChips` | function | 17171–17179 | 9 |
| `spotAddon` | function | 17180–17191 | 12 |
| `aiParsePage` | function | 17192–17198 | 7 |
| `applyPageBlocks` | function | 17199–17224 | 26 |
| `flowSpotEl` | function | 17225–17246 | 22 |
| `flowSpotToggle` | function | 17247–17247 | 1 |
| `flowSpotOpen` | function | 17248–17261 | 14 |
| `flowSpotClose` | function | 17262–17262 | 1 |
| `flowSpotSend` | function | 17263–17294 | 32 |
| `spotMicToggle` | function | 17295–17316 | 22 |
| `aiChatSheet` | function | 17328–17360 | 33 |
| `aiClose` | function | 17361–17367 | 7 |
| `aiDayPct` | function | 17368–17373 | 6 |
| `aiSpeakStop` | function | 17377–17377 | 1 |
| `aiSpeak` | function | 17378–17393 | 16 |
| `aiVoiceToggle` | function | 17394–17400 | 7 |
| `aiRenderHead` | function | 17401–17443 | 43 |
| `aiMemSheet` | function | 17445–17466 | 22 |
| `aiRenderViews` | function | 17467–17471 | 5 |
| `aiPendingMsg` | function | 17472–17482 | 11 |
| `aiLogHTML` | function | 17483–17487 | 5 |
| `aiTlHTML` | function | 17490–17512 | 23 |
| `aiActsHTML` | function | 17513–17550 | 38 |
| `aiWireBody` | function | 17551–17564 | 14 |
| `aiChipsHTML` | function | 17565–17570 | 6 |
| `AI_SVG` | object | 17571–17577 | 7 |
| `AI_ICO` | object | 17579–17601 | 23 |
| `aiIco` | function | 17602–17605 | 4 |
| `aiMD` | function | 17607–17612 | 6 |
| `aiBusyHTML` | function | 17613–17619 | 7 |
| `aiSlashHide` | function | 17621–17621 | 1 |
| `aiSlashShow` | function | 17622–17635 | 14 |
| `aiAttachRender` | function | 17637–17648 | 12 |
| `aiImgShrink` | function | 17649–17665 | 17 |
| `aiFileB64` | function | 17666–17673 | 8 |
| `aiPickFile` | function | 17674–17698 | 25 |
| `aiPlusSheet` | function | 17699–17717 | 19 |
| `aiPromptsSheet` | function | 17719–17737 | 19 |
| `aiPromptEdit` | function | 17738–17754 | 17 |
| `aiPlanCardHTML` | function | 17763–17788 | 26 |
| `aiRenderBody` | function | 17789–17826 | 38 |
| `AI_SKILLS` | object | 17832–17843 | 12 |
| `aiSkillFor` | function | 17844–17849 | 6 |
| `aiMaybeSummarize` | function | 17852–17863 | 12 |
| `aiChatSend` | function | 17864–17947 | 84 |
| `aiMicUI` | function | 17950–17950 | 1 |
| `aiMicToggle` | function | 17951–17979 | 29 |
| `aiTranscribeBlob` | function | 17989–18011 | 23 |
| `aiTranscribe` | function | 18012–18015 | 4 |
| `plStreak` | function | 18018–18025 | 8 |
| `plRolloverHTML` | function | 18087–18097 | 11 |
| `plDaySummaryHTML` | function | 18099–18130 | 32 |
| `plAutoSuggestHTML` | function | 18133–18172 | 40 |
| `plQAnchorsHTML` | function | 18175–18197 | 23 |
| `plWeekCalHTML` | function | 18200–18221 | 22 |
| `plDayTitle` | function | 18222–18230 | 9 |
| `plBlocksDisplay` | function | 18235–18247 | 13 |
| `plFolderDayVal` | function | 18248–18252 | 5 |
| `plFolderMonthVal` | function | 18253–18260 | 8 |
| `plFolderComplete` | function | 18262–18266 | 5 |
| `DOW_UA` | array | 18267–18267 | 1 |
| `plRuleDowsLabel` | function | 18268–18275 | 8 |
| `plFolderDaySheet` | function | 18277–18332 | 56 |
| `plFolderMonthSheet` | function | 18334–18396 | 63 |
| `PL_MXQ` | array | 18399–18399 | 1 |
| `plMatrixHTML` | function | 18400–18417 | 18 |
| `plMxSchedule` | function | 18419–18430 | 12 |
| `plSlotTask` | function | 18433–18444 | 12 |
| `plBacklogHTML` | function | 18447–18459 | 13 |
| `plInboxHTML` | function | 18462–18474 | 13 |
| `plBlockEnd` | function | 18477–18477 | 1 |
| `plDayHTML` | function | 18478–18478 | 1 |
| `plTaskCard` | function | 18687–18708 | 22 |
| `plAdd` | function | 18710–18734 | 25 |
| `plAddBlockAt` | function | 18737–18740 | 4 |
| `plLinkTag` | function | 18742–18748 | 7 |
| `plScheduleStep` | function | 18750–18765 | 16 |
| `plMicroBlock` | function | 18767–18778 | 12 |
| `plCompleteBlock` | function | 18780–18833 | 54 |
| `plUncompleteEffects` | function | 18835–18848 | 14 |
| `plToast` | function | 18851–18856 | 6 |
| `plBlockSheet` | function | 18859–18859 | 1 |
| `plEditBlock` | function | 19081–19081 | 1 |
| `plRangeSheet` | function | 19084–19133 | 50 |
| `FV_ORDER` | array | 19138–19138 | 1 |
| `FV_NAME` | object | 19139–19139 | 1 |
| `applyFolderViewIcon` | function | 19145–19148 | 4 |
| `setFolderView` | function | 19149–19155 | 7 |
| `moveOrderItem` | function | 19162–19167 | 6 |
| `enableFolderDrag` | function | 19169–19277 | 109 |
| `renderDashboard` | function | 19294–19373 | 80 |
| `inputModal` | function | 19377–19408 | 32 |
| `createFolder` | function | 19410–19422 | 13 |
| `createProjectFolder` | function | 19424–19445 | 22 |
| `openFolderMenu` | function | 19513–19513 | 1 |
| `closeFolderMenu` | function | 19566–19566 | 1 |
| `openFolderMovePicker` | function | 19568–19583 | 16 |
| `folderAction` | function | 19584–19604 | 21 |
| `cycleFolderColor` | function | 19605–19610 | 6 |
| `pickFolderPhoto` | function | 19611–19611 | 1 |
| `renderFolder` | function | 19643–19643 | 1 |
| `createCustomBoard` | function | 19826–19838 | 13 |
| `delCustomBoard` | function | 19839–19848 | 10 |
| `debtTotals` | function | 19849–19853 | 5 |
| `debtSummary` | function | 19854–19859 | 6 |
| `CUR` | object | 19862–19862 | 1 |
| `KEY` | const | 19863–19863 | 1 |
| `items` | array | 8954–8954 | 1 |
| `save` | function | 19872–19874 | 3 |
| `fmt` | function | 19875–19875 | 1 |
| `initials` | function | 19876–19876 | 1 |
| `esc` | function | 19877–19877 | 1 |
| `sanitizeRich` | function | 19879–19898 | 20 |
| `safeImg` | function | 19900–19905 | 6 |
| `balance` | function | 19906–19906 | 1 |
| `del` | function | 19919–19919 | 1 |
| `render` | function | 19921–19954 | 34 |
| `toggleDebtSync` | function | 19956–19978 | 23 |
| `openModal` | function | 19982–19984 | 3 |
| `closeModal` | function | 19985–19985 | 1 |
| `renderModal` | function | 19988–20013 | 26 |
| `askOp` | function | 20014–20020 | 7 |
| `commitOp` | function | 20023–20031 | 9 |
| `delOp` | function | 20032–20035 | 4 |
| `SKEY` | const | 20038–20038 | 1 |
| `spends` | array | 20039–20039 | 1 |
| `CATS` | object | 20041–20051 | 11 |
| `CAT_ORDER` | array | 20052–20052 | 1 |
| `categorize` | function | 20054–20060 | 7 |
| `parseLine` | function | 20063–20077 | 15 |
| `saveSpend` | function | 20079–20081 | 3 |
| `spendTotal` | function | 20100–20100 | 1 |
| `spendSummary` | function | 20101–20101 | 1 |
| `renderSpend` | function | 20115–20159 | 45 |
| `exportSpend` | function | 20161–20169 | 9 |
| `workSessions` | array | 20173–20173 | 1 |
| `WORKKEY` | const | 20178–20178 | 1 |
| `WORKCFGKEY` | const | 20178–20178 | 1 |
| `saveWork` | function | 20179–20182 | 4 |
| `workHoursTotal` | function | 20183–20183 | 1 |
| `workEarnedTotal` | function | 20184–20184 | 1 |
| `workSummary` | function | 20185–20185 | 1 |
| `workHoursOn` | function | 20186–20186 | 1 |
| `workSessionsIn` | function | 20187–20187 | 1 |
| `WK_MONTHS` | array | 20189–20189 | 1 |
| `renderWorkCal` | function | 20190–20218 | 29 |
| `workTapDay` | function | 20221–20231 | 11 |
| `wkmHoursVal` | function | 20232–20232 | 1 |
| `wkmRate` | function | 20233–20233 | 1 |
| `wkmRenderChips` | function | 20234–20241 | 8 |
| `wkmUpdateMoney` | function | 20242–20246 | 5 |
| `wkmClose` | function | 20247–20247 | 1 |
| `wkmSave` | function | 20248–20276 | 29 |
| `workUpdatePreview` | function | 20285–20293 | 9 |
| `ymOffset` | function | 20295–20300 | 6 |
| `renderWorkMonthStrip` | function | 20301–20315 | 15 |
| `renderWorkSalary` | function | 20317–20351 | 35 |
| `pluralDaysWk` | function | 20352–20352 | 1 |
| `workPostedSal` | object | 20355–20355 | 1 |
| `workExtras` | array | 20356–20356 | 1 |
| `WKEXTRAKEY` | const | 20357–20357 | 1 |
| `wkBlocks` | object | 20359–20359 | 1 |
| `WKBLKKEY` | const | 20360–20360 | 1 |
| `saveWkBlocks` | function | 20361–20361 | 1 |
| `applyWkBlocks` | function | 20362–20369 | 8 |
| `saveExtras` | function | 20373–20373 | 1 |
| `EXTRA_META` | object | 20374–20374 | 1 |
| `extrasIn` | function | 20375–20375 | 1 |
| `extrasNet` | function | 20376–20376 | 1 |
| `addExtra` | function | 20378–20392 | 15 |
| `extraSave` | function | 20393–20400 | 8 |
| `delExtra` | function | 20409–20409 | 1 |
| `renderExtras` | function | 20410–20427 | 18 |
| `syncSalaryToFin` | function | 20429–20447 | 19 |
| `allocUpdateSummary` | function | 20494–20504 | 11 |
| `renderWork` | function | 20522–20591 | 70 |
| `workShiftMonth` | function | 20626–20629 | 4 |
| `pushWorkToFin` | function | 20633–20645 | 13 |
| `clearWork` | function | 20657–20663 | 7 |
| `clearWorkMonth` | function | 20664–20676 | 13 |
| `PAT_CKEY` | const | 20681–20681 | 1 |
| `PAT_SKEY` | const | 20681–20681 | 1 |
| `PAT_TKEY` | const | 20681–20681 | 1 |
| `patChains` | array | 20682–20682 | 1 |
| `patScore` | object | 20682–20682 | 1 |
| `patTrans` | array | 20682–20682 | 1 |
| `PAT_PHASES` | array | 20683–20688 | 6 |
| `patSaveChains` | function | 20689–20689 | 1 |
| `patSaveScore` | function | 20690–20690 | 1 |
| `patSaveTrans` | function | 20691–20691 | 1 |
| `patEsc` | function | 20692–20692 | 1 |
| `patFmt` | function | 20693–20693 | 1 |
| `goPatterns` | function | 20695–20695 | 1 |
| `patSetView` | function | 20700–20705 | 6 |
| `patInterceptData` | function | 20711–20718 | 8 |
| `patOpenIntercept` | function | 20719–20733 | 15 |
| `patDecide` | function | 20734–20740 | 7 |
| `patAddChain` | function | 20746–20755 | 10 |
| `patDelChain` | function | 20757–20761 | 5 |
| `patDaysFrom` | function | 20765–20771 | 7 |
| `patAddTrans` | function | 20772–20782 | 11 |
| `patDelTrans` | function | 20790–20794 | 5 |
| `patTCheck` | function | 20795–20801 | 7 |
| `patLast7` | function | 20803–20808 | 6 |
| `renderPatterns` | function | 20811–20866 | 56 |
| `BKEY` | const | 21065–21065 | 1 |
| `CBKEY` | const | 21066–21066 | 1 |
| `BUILTIN_TABS` | array | 21068–21074 | 7 |
| `customBoards` | array | 21076–21076 | 1 |
| `allTabs` | function | 21078–21078 | 1 |
| `tabByKey` | function | 21079–21079 | 1 |
| `tabsForFolder` | function | 21081–21081 | 1 |
| `BOARD_TABS` | const | 21082–21082 | 1 |
| `boards` | object | 21083–21083 | 1 |
| `folderPath` | array | 21086–21086 | 1 |
| `currentLevelArr` | function | 21088–21096 | 9 |
| `currentFolderObj` | function | 21097–21100 | 4 |
| `VMKEY` | const | 21101–21101 | 1 |
| `saveViewMode` | function | 21104–21104 | 1 |
| `BWKEY` | const | 21107–21107 | 1 |
| `WIDE_STEPS` | array | 21108–21108 | 1 |
| `saveBoardCols` | function | 21112–21112 | 1 |
| `CANVKEY` | const | 21115–21115 | 1 |
| `canvasBoards` | object | 21116–21116 | 1 |
| `saveCanvasBoards` | function | 21118–21118 | 1 |
| `isCanvasMode` | function | 21119–21119 | 1 |
| `toggleCanvasMode` | function | 21120–21127 | 8 |
| `CZKEY` | const | 21130–21130 | 1 |
| `canvasZoom` | object | 21131–21131 | 1 |
| `saveCanvasZoom` | function | 21133–21133 | 1 |
| `getZoom` | function | 21134–21134 | 1 |
| `setZoom` | function | 21136–21170 | 35 |
| `toggleSnap` | function | 21176–21178 | 3 |
| `snapVal` | function | 21179–21179 | 1 |
| `CANVAS_SKINS` | array | 21182–21182 | 1 |
| `applyCanvasSkin` | function | 21186–21189 | 4 |
| `cycleCanvasSkin` | function | 21190–21202 | 13 |
| `fitAll` | function | 21206–21227 | 22 |
| `zoomToBlock` | function | 21230–21242 | 13 |
| `updateMinimap` | function | 21246–21274 | 29 |
| `flashMinimap` | function | 21276–21281 | 6 |
| `curBoard` | function | 21284–21284 | 1 |
| `blocks` | array | 15035–15035 | 1 |
| `syncBlocks` | function | 21286–21286 | 1 |
| `resortPinned` | function | 21327–21334 | 8 |
| `saveCustomBoards` | function | 21336–21338 | 3 |
| `BOARD_COLORS` | array | 21339–21339 | 1 |
| `BOARD_EMOJIS` | array | 21340–21340 | 1 |
| `PROJECT_BLOCKS` | array | 21395–21395 | 1 |
| `PROJECT_ONLY` | array | 21396–21396 | 1 |
| `ICONS` | object | 21399–21437 | 39 |
| `blockIcon` | function | 21439–21444 | 6 |
| `blockUsage` | object | 21448–21448 | 1 |
| `UKEY` | const | 21449–21449 | 1 |
| `saveUsage` | function | 21450–21450 | 1 |
| `blockSearchText` | function | 21463–21477 | 15 |
| `collectBlocks` | function | 21479–21485 | 7 |
| `escRe` | function | 21486–21486 | 1 |
| `hiliteText` | function | 21487–21493 | 7 |
| `pathLabel` | function | 21494–21498 | 5 |
| `runSearch` | function | 21499–21542 | 44 |
| `pathToBlock` | function | 21544–21553 | 10 |
| `jumpToBlock` | function | 21554–21577 | 24 |
| `openSearch` | function | 21578–21585 | 8 |
| `closeSearch` | function | 21586–21586 | 1 |
| `srchDelegate` | function | 21588–21596 | 9 |
| `snapshotForUndo` | function | 21613–21622 | 10 |
| `hideUndo` | function | 21623–21623 | 1 |
| `doUndo` | function | 21624–21634 | 11 |
| `INBOX_TITLE` | const | 21638–21638 | 1 |
| `ensureInboxFolder` | function | 21639–21648 | 10 |
| `openQuickCapture` | function | 21649–21654 | 6 |
| `closeQuickCapture` | function | 21655–21655 | 1 |
| `saveQuickCapture` | function | 21656–21667 | 12 |
| `setTaskReminder` | function | 21699–21713 | 15 |
| `toLocalInput` | function | 21714–21717 | 4 |
| `remindLabel` | function | 21718–21727 | 10 |
| `parseLocalInput` | function | 21728–21732 | 5 |
| `reminderTimers` | object | 21734–21734 | 1 |
| `scheduleReminder` | function | 21735–21742 | 8 |
| `rescheduleAllReminders` | function | 21755–21766 | 12 |
| `checkDueReminders` | function | 21768–21788 | 21 |
| `plScheduleReminder` | function | 21792–21800 | 9 |
| `plRescheduleReminders` | function | 21813–21820 | 8 |
| `plCheckDueReminders` | function | 21822–21837 | 16 |
| `openFullAddSheet` | function | 21983–21983 | 1 |
| `toggleFabRadial` | function | 21989–22018 | 30 |
| `VIEW_ORDER` | array | 22055–22055 | 1 |
| `_vsvg` | function-expr | 22056–22061 | 6 |
| `VIEW_ICON` | object | 22057–22061 | 5 |
| `VIEW_NAME` | object | 22062–22062 | 1 |
| `applyViewIcon` | function | 22063–22066 | 4 |
| `applyWideIcon` | function | 22074–22082 | 9 |
| `saveBoard` | function | 22097–22099 | 3 |
| `addBlock` | function | 22155–22322 | 168 |
| `BENTO_SEC_TYPES` | object | 22326–22326 | 1 |
| `agAttachFile` | function | 22373–22390 | 18 |
| `agRemoveFile` | function | 22424–22433 | 10 |
| `agFileMenu` | function | 22434–22441 | 8 |
| `agFileSizeStr` | function | 22449–22449 | 1 |
| `agFileIcon` | function | 22450–22450 | 1 |
| `loadScriptOnce` | function | 22451–22459 | 9 |
| `pickBookFile` | function | 22462–22485 | 24 |
| `rdrCfg` | object | 22488–22488 | 1 |
| `RDR_CFG_KEY` | const | 22489–22489 | 1 |
| `loadRdrCfg` | function | 22490–22492 | 3 |
| `saveRdrCfg` | function | 22493–22493 | 1 |
| `applyRdrCfg` | function | 22494–22508 | 15 |
| `pdfPages` | array | 22512–22512 | 1 |
| `rdrChapters` | array | 22513–22513 | 1 |
| `setRdrLoading` | function | 22516–22520 | 5 |
| `openReader` | function | 22522–22553 | 32 |
| `renderTextBook` | function | 22556–22572 | 17 |
| `mdToHtml` | function | 22575–22593 | 19 |
| `inlineMd` | function | 22594–22600 | 7 |
| `renderEpub` | function | 22603–22642 | 40 |
| `readZipText` | function | 22643–22643 | 1 |
| `normalizeZipPath` | function | 22644–22644 | 1 |
| `stripEpubHtml` | function | 22645–22650 | 6 |
| `embedEpubImages` | function | 22651–22666 | 16 |
| `renderPdf` | function | 22669–22709 | 41 |
| `repaintPdfZoom` | function | 22711–22728 | 18 |
| `buildToc` | function | 22731–22740 | 10 |
| `RDR_WPM` | const | 22756–22756 | 1 |
| `updateRdrProgressUI` | function | 22757–22793 | 37 |
| `initReader` | function | 22796–22860 | 65 |
| `openBmSheet` | function | 22862–22879 | 18 |
| `renderMarks` | function | 22880–22899 | 20 |
| `addBookmark` | function | 22900–22913 | 14 |
| `pickPhoto` | function | 22916–22916 | 1 |
| `isContainer` | function | 22943–22943 | 1 |
| `findBlockDeep` | function | 22944–22952 | 9 |
| `findParentArr` | function | 22954–22962 | 9 |
| `delBlock` | function | 22963–22974 | 12 |
| `getBlock` | function | 22975–22975 | 1 |
| `renderBoardTabs` | function | 22977–22987 | 11 |
| `SD_GRADS` | array | 22990–22995 | 6 |
| `sdCovers` | function | 22996–22996 | 1 |
| `sdSaveCovers` | function | 22997–23000 | 4 |
| `sdDashOpen` | function | 23001–23001 | 1 |
| `sdStats` | function | 23002–23019 | 18 |
| `renderBoard` | function | 23090–23193 | 104 |
| `defaultSize` | function | 23196–23200 | 5 |
| `autoSize` | function | 23202–23215 | 14 |
| `szClass` | function | 23216–23220 | 5 |
| `headBar` | function | 23222–23241 | 20 |
| `BENTO_SKIP` | object | 23245–23245 | 1 |
| `bentoSectionsHtml` | function | 23268–23296 | 29 |
| `focusItem` | function | 23968–23975 | 8 |
| `bindTiles` | function | 23977–24805 | 829 |
| `canvasRect` | function | 24920–24924 | 5 |
| `openCanvasRadial` | function | 24927–24953 | 27 |
| `clearAlignGuides` | function | 24956–24956 | 1 |
| `showAlignGuides` | function | 24957–24978 | 22 |
| `rectsOverlap` | function | 24979–24985 | 7 |
| `resolveCanvasCollision` | function | 24988–25020 | 33 |
| `applyFreeSizes` | function | 25023–25144 | 122 |
| `openCardStyle` | function | 25147–25167 | 21 |
| `enableTileResize` | function | 25170–25282 | 113 |
| `enableTileDrag` | function | 25285–25545 | 261 |
| `escAttr` | function | 25546–25546 | 1 |
| `migrate` | function | 25549–25553 | 5 |
| `normalizeBlocks` | function | 25555–25580 | 26 |
| `agskCleanupOnce` | function | 25595–25628 | 34 |
| `applyFolderCfgRaw` | function | 25631–25640 | 10 |
| `applyFolderOrderRaw` | function | 25641–25644 | 4 |
| `load` | function | 25645–25852 | 208 |
| `VISION_FKEY` | const | 25917–25917 | 1 |
| `VZKEY` | const | 25935–25935 | 1 |
| `vzData` | object | 25936–25937 | 2 |
| `vzNorm` | function | 25938–25966 | 29 |
| `vzSave` | function | 25967–25967 | 1 |
| `vzDay` | function | 25975–25977 | 3 |
| `vzGoalsInfo` | function | 25978–25981 | 4 |
| `vzStreak` | function | 25982–25989 | 8 |
| `vzFocusCalc` | function | 25990–25997 | 8 |
| `vzCoachMsg` | function | 26000–26010 | 11 |
| `vzEditStatement` | function | 26013–26015 | 3 |
| `vzEditTags` | function | 26016–26018 | 3 |
| `vzEditWhy` | function | 26019–26022 | 4 |
| `vzEditFocus` | function | 26023–26037 | 15 |
| `vzAddStep` | function | 26038–26047 | 10 |
| `vzStepMenu` | function | 26048–26064 | 17 |
| `vzPickFolder` | function | 26066–26072 | 7 |
| `VZ_GOAL_COLORS` | array | 26074–26074 | 1 |
| `vzAfterGoalCreated` | function | 26075–26079 | 5 |
| `vzStepToGoal` | function | 26080–26086 | 7 |
| `vzPlanToGoal` | function | 26087–26095 | 9 |
| `VZ_TERMS` | array | 26097–26097 | 1 |
| `VZ_TERM_LABEL` | object | 26098–26098 | 1 |
| `vzAddPlan` | function | 26099–26105 | 7 |
| `vzPlanAddItem` | function | 26106–26112 | 7 |
| `vzPlanMenu` | function | 26113–26129 | 17 |
| `vzAddFolderLink` | function | 26130–26137 | 8 |
| `vzFolderChipMenu` | function | 26138–26144 | 7 |
| `vzRzToggle` | function | 26150–26156 | 7 |
| `vzRzMenu` | function | 26157–26174 | 18 |
| `vzKtStats` | function | 26176–26182 | 7 |
| `vzKtMenu` | function | 26187–26204 | 18 |
| `vzFocus` | object | 26206–26206 | 1 |
| `vzQueue` | function | 26207–26216 | 10 |
| `vzFocusStop` | function | 26217–26217 | 1 |
| `vzFocusDone` | function | 26218–26227 | 10 |
| `renderVisionFocus` | function | 26228–26266 | 39 |
| `renderVision` | function | 26268–26268 | 1 |
| `goVision` | function | 26463–26463 | 1 |

