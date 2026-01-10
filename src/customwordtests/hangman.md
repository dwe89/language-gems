:3000/activities/hangman?assignment=8b3e35fd-11ba-4da9-bc87-333b01d37dd2&mode=assignment&filterOutstanding=true:1 The resource http://localhost:3000/_next/static/css/app/layout.css?v=1768077724171 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
useGlobalAudioContext.ts:212 🎵 GlobalAudioContext: Removed initial user interaction listeners.
:3000/activities/hangman?assignment=8b3e35fd-11ba-4da9-bc87-333b01d37dd2&mode=assignment&filterOutstanding=true:1 The resource http://localhost:3000/_next/static/css/app/layout.css?v=1768077724171 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
HangmanGame.tsx:428 🎯 [HANGMAN WIN] Starting FSRS recording for word: voleibol
HangmanGame.tsx:438 🎯 [HANGMAN WIN] Word data prepared: {id: 'a9f4fa31-8e04-4821-82fd-6b2c7a775432', word: 'voleibol', translation: 'Volleyball', language: 'es'}
HangmanGame.tsx:448 🎯 [HANGMAN WIN] Confidence calculated: 0.8571428571428571 {accuracy: 0.8571428571428571, timeBonus: 0.1, mistakesPenalty: 0.1, timer: 0, wrongGuesses: 1}
HangmanGame.tsx:460 🎮 [HANGMAN] Recording successful word completion: {word: 'voleibol', vocabularyId: 'a9f4fa31-8e04-4821-82fd-6b2c7a775432', isCustomVocabulary: undefined, gameSessionId: '675f1637-827d-48b3-bec1-b9b6c4f04380', wrongGuesses: 1, …}
EnhancedGameSessionService.ts:330 🔮 [SESSION SERVICE] recordWordAttempt called [y1bran55g]: {sessionId: '675f1637-827d-48b3-bec1-b9b6c4f04380', gameType: 'hangman', attempt: {…}, skipSpacedRepetition: false}
EnhancedGameSessionService.ts:133 📊 [SESSION COUNTS] Incrementing for session 675f1637-827d-48b3-bec1-b9b6c4f04380, wasCorrect: true
EnhancedGameSessionService.ts:155 📊 [SESSION COUNTS] Updating: 0 → 1 attempted, 0 → 1 correct
EnhancedGameSessionService.ts:169 ✅ [SESSION COUNTS] Successfully updated session 675f1637-827d-48b3-bec1-b9b6c4f04380
EnhancedGameSessionService.ts:347 🔮 [SESSION SERVICE] Logging word performance [y1bran55g]...
fetch.js:30  POST https://xetsvpfunazwkontdpdh.supabase.co/rest/v1/word_performance_logs 409 (Conflict)
eval @ fetch.js:30
eval @ fetch.js:51
fulfilled @ fetch.js:11
Promise.then
step @ fetch.js:13
eval @ fetch.js:14
__awaiter @ fetch.js:10
eval @ fetch.js:41
then @ PostgrestBuilder.js:66
EnhancedGameSessionService.ts:360 🔍 [ENHANCED SESSION] FSRS update: {vocabularyId: 'a9f4fa31-8e04-4821-82fd-6b2c7a775432', enhancedVocabularyItemId: undefined, wasCorrect: true, callId: 'y1bran55g'}
EnhancedGameSessionService.ts:939 ⚠️ [PERFORMANCE LOG] FK violation detected. Retrying as Custom Vocabulary...
logWordPerformance @ EnhancedGameSessionService.ts:939
await in logWordPerformance
recordWordAttempt @ EnhancedGameSessionService.ts:348
await in recordWordAttempt
recordGemAttempt @ HangmanGame.tsx:470
handleLetterGuess @ HangmanGame.tsx:495
onClick @ HangmanGame.tsx:772
callCallback @ react-dom.development.js:20565
invokeGuardedCallbackImpl @ react-dom.development.js:20614
invokeGuardedCallback @ react-dom.development.js:20689
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:20703
executeDispatch @ react-dom.development.js:32128
processDispatchQueueItemsInOrder @ react-dom.development.js:32160
processDispatchQueue @ react-dom.development.js:32173
dispatchEventsForPlugins @ react-dom.development.js:32184
eval @ react-dom.development.js:32374
batchedUpdates$1 @ react-dom.development.js:24953
batchedUpdates @ react-dom.development.js:28844
dispatchEventForPluginEventSystem @ react-dom.development.js:32373
dispatchEvent @ react-dom.development.js:30141
dispatchDiscreteEvent @ react-dom.development.js:30112
EnhancedGameSessionService.ts:951 ✅ [PERFORMANCE LOG] Successfully logged custom vocabulary performance after retry.
EnhancedGameSessionService.ts:1060 ✅ [FSRS GATE] Word is due for review, allowing progression: {vocabularyId: 'a9f4fa31-8e04-4821-82fd-6b2c7a775432', phase: 'new', state: 'new'}
EnhancedGameSessionService.ts:1117 ✅ [DIRECT UPDATE] Vocabulary updated successfully: {vocabularyId: 'a9f4fa31-8e04-4821-82fd-6b2c7a775432', wasCorrect: true, studentId: '9d184226-be17-4612-8685-0ac45fcef060', phase: 'new'}
EnhancedGameSessionService.ts:375 ✅ [ENHANCED SESSION] FSRS update completed successfully
EnhancedGameSessionService.ts:416 🔮 [SESSION SERVICE] Getting session context for session [y1bran55g]...
EnhancedGameSessionService.ts:418 🔮 [SESSION SERVICE] Student ID: 9d184226-be17-4612-8685-0ac45fcef060, Assignment ID: 8b3e35fd-11ba-4da9-bc87-333b01d37dd2 [y1bran55g]
EnhancedGameSessionService.ts:426 📝 [LAYER 2] Recording exposure for word a9f4fa31-8e04-4821-82fd-6b2c7a775432 in assignment 8b3e35fd-11ba-4da9-bc87-333b01d37dd2 (isCustom: false)
AssignmentExposureService.ts:64 📝 [EXPOSURE SERVICE] Recording exposures [sbu5oo]: {assignmentId: '8b3e35fd-11ba-4da9-bc87-333b01d37dd2', studentId: '9d184226-be17-4612-8685-0ac45fcef060', wordCount: 1, wordIds: Array(1), isCustomVocabulary: false}
EnhancedGameSessionService.ts:435 🎮 [DUAL-TRACK] Awarding Activity Gem for correct answer [y1bran55g]
EnhancedGameSessionService.ts:456 🔮 [SESSION SERVICE] Activity gem created [y1bran55g]: {rarity: 'rare', xpValue: 5, wordText: 'voleibol'}
EnhancedGameSessionService.ts:463 🔮 [SESSION SERVICE] Storing Activity Gem in database [y1bran55g]...
EnhancedGameSessionService.ts:561 💎 [STORE GEM] Starting to store gem event [xinuc07nf]: {sessionId: '675f1637-827d-48b3-bec1-b9b6c4f04380', studentId: '9d184226-be17-4612-8685-0ac45fcef060', gemType: 'activity', gemEvent: {…}}
EnhancedGameSessionService.ts:627 💎 [STORE GEM] Inserting into gem_events table [xinuc07nf]: {session_id: '675f1637-827d-48b3-bec1-b9b6c4f04380', student_id: '9d184226-be17-4612-8685-0ac45fcef060', gem_rarity: 'rare', xp_value: 5, word_text: 'voleibol', …}
fetch.js:30  POST https://xetsvpfunazwkontdpdh.supabase.co/rest/v1/gem_events?select=* 409 (Conflict)
eval @ fetch.js:30
eval @ fetch.js:51
fulfilled @ fetch.js:11
Promise.then
step @ fetch.js:13
eval @ fetch.js:14
__awaiter @ fetch.js:10
eval @ fetch.js:41
then @ PostgrestBuilder.js:66
EnhancedGameSessionService.ts:637 ⚠️ [STORE GEM] FK violation detected. Code: 23503. Retrying as Custom Vocabulary...
storeGemEvent @ EnhancedGameSessionService.ts:637
await in storeGemEvent
recordWordAttempt @ EnhancedGameSessionService.ts:464
await in recordWordAttempt
recordGemAttempt @ HangmanGame.tsx:470
handleLetterGuess @ HangmanGame.tsx:495
onClick @ HangmanGame.tsx:772
callCallback @ react-dom.development.js:20565
invokeGuardedCallbackImpl @ react-dom.development.js:20614
invokeGuardedCallback @ react-dom.development.js:20689
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:20703
executeDispatch @ react-dom.development.js:32128
processDispatchQueueItemsInOrder @ react-dom.development.js:32160
processDispatchQueue @ react-dom.development.js:32173
dispatchEventsForPlugins @ react-dom.development.js:32184
eval @ react-dom.development.js:32374
batchedUpdates$1 @ react-dom.development.js:24953
batchedUpdates @ react-dom.development.js:28844
dispatchEventForPluginEventSystem @ react-dom.development.js:32373
dispatchEvent @ react-dom.development.js:30141
dispatchDiscreteEvent @ react-dom.development.js:30112
fetch.js:30  POST https://xetsvpfunazwkontdpdh.supabase.co/rest/v1/assignment_word_exposure?on_conflict=assignment_id%2Cstudent_id%2Ccentralized_vocabulary_id&columns=%22assignment_id%22%2C%22student_id%22%2C%22centralized_vocabulary_id%22%2C%22last_exposed_at%22&select=* 409 (Conflict)
eval @ fetch.js:30
eval @ fetch.js:51
fulfilled @ fetch.js:11
Promise.then
step @ fetch.js:13
eval @ fetch.js:14
__awaiter @ fetch.js:10
eval @ fetch.js:41
then @ PostgrestBuilder.js:66
AssignmentExposureService.ts:120 ⚠️ [EXPOSURE SERVICE] FK violation on centralized_vocabulary_id [sbu5oo]. Retrying as custom vocabulary...
recordWordExposures @ AssignmentExposureService.ts:120
await in recordWordExposures
recordWordAttempt @ EnhancedGameSessionService.ts:427
await in recordWordAttempt
recordGemAttempt @ HangmanGame.tsx:470
handleLetterGuess @ HangmanGame.tsx:495
onClick @ HangmanGame.tsx:772
callCallback @ react-dom.development.js:20565
invokeGuardedCallbackImpl @ react-dom.development.js:20614
invokeGuardedCallback @ react-dom.development.js:20689
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:20703
executeDispatch @ react-dom.development.js:32128
processDispatchQueueItemsInOrder @ react-dom.development.js:32160
processDispatchQueue @ react-dom.development.js:32173
dispatchEventsForPlugins @ react-dom.development.js:32184
eval @ react-dom.development.js:32374
batchedUpdates$1 @ react-dom.development.js:24953
batchedUpdates @ react-dom.development.js:28844
dispatchEventForPluginEventSystem @ react-dom.development.js:32373
dispatchEvent @ react-dom.development.js:30141
dispatchDiscreteEvent @ react-dom.development.js:30112
AssignmentExposureService.ts:121 ⚠️ [EXPOSURE SERVICE] Note: This is expected for custom vocabulary items.
AssignmentExposureService.ts:144 ✅ [EXPOSURE SERVICE] Recorded 1 custom exposures [sbu5oo]
EnhancedGameSessionService.ts:652 ✅ [STORE GEM] Successfully stored custom vocabulary gem after retry. ID: a9f4fa31-8e04-4821-82fd-6b2c7a775432
EnhancedGameSessionService.ts:658 💎 [STORE GEM] Database insert result [xinuc07nf]: {success: true, error: undefined, errorCode: undefined, insertedData: Array(1)}
EnhancedGameSessionService.ts:669 💎 [STORE GEM] Successfully stored activity gem [xinuc07nf]: rare (5 XP) for "voleibol"
EnhancedGameSessionService.ts:492 💎 [DUAL-TRACK] FSRS allows progression - awarding Mastery Gem
EnhancedGameSessionService.ts:493 🔍 [DEBUG] canProgress data: {allowed: true, reason: 'New word - first encounter', phase: 'new', state: 'new', nextReviewAt: '2026-01-12T20:44:16.618528+00:00'}
EnhancedGameSessionService.ts:495 🔍 [DEBUG] isFirstTime calculation: {phase: 'new', isFirstTime: true}
RewardEngine.ts:215 🆕 [REWARD ENGINE] First-time word detected - awarding New Discovery
EnhancedGameSessionService.ts:561 💎 [STORE GEM] Starting to store gem event [qinsmcoxd]: {sessionId: '675f1637-827d-48b3-bec1-b9b6c4f04380', studentId: '9d184226-be17-4612-8685-0ac45fcef060', gemType: 'mastery', gemEvent: {…}}
EnhancedGameSessionService.ts:627 💎 [STORE GEM] Inserting into gem_events table [qinsmcoxd]: {session_id: '675f1637-827d-48b3-bec1-b9b6c4f04380', student_id: '9d184226-be17-4612-8685-0ac45fcef060', gem_rarity: 'new_discovery', xp_value: 5, word_text: 'voleibol', …}
fetch.js:30  POST https://xetsvpfunazwkontdpdh.supabase.co/rest/v1/gem_events?select=* 409 (Conflict)
eval @ fetch.js:30
eval @ fetch.js:51
fulfilled @ fetch.js:11
Promise.then
step @ fetch.js:13
eval @ fetch.js:14
__awaiter @ fetch.js:10
eval @ fetch.js:41
then @ PostgrestBuilder.js:66
EnhancedGameSessionService.ts:637 ⚠️ [STORE GEM] FK violation detected. Code: 23503. Retrying as Custom Vocabulary...
storeGemEvent @ EnhancedGameSessionService.ts:637
await in storeGemEvent
recordWordAttempt @ EnhancedGameSessionService.ts:519
await in recordWordAttempt
recordGemAttempt @ HangmanGame.tsx:470
handleLetterGuess @ HangmanGame.tsx:495
onClick @ HangmanGame.tsx:772
callCallback @ react-dom.development.js:20565
invokeGuardedCallbackImpl @ react-dom.development.js:20614
invokeGuardedCallback @ react-dom.development.js:20689
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:20703
executeDispatch @ react-dom.development.js:32128
processDispatchQueueItemsInOrder @ react-dom.development.js:32160
processDispatchQueue @ react-dom.development.js:32173
dispatchEventsForPlugins @ react-dom.development.js:32184
eval @ react-dom.development.js:32374
batchedUpdates$1 @ react-dom.development.js:24953
batchedUpdates @ react-dom.development.js:28844
dispatchEventForPluginEventSystem @ react-dom.development.js:32373
dispatchEvent @ react-dom.development.js:30141
dispatchDiscreteEvent @ react-dom.development.js:30112
EnhancedGameSessionService.ts:652 ✅ [STORE GEM] Successfully stored custom vocabulary gem after retry. ID: a9f4fa31-8e04-4821-82fd-6b2c7a775432
EnhancedGameSessionService.ts:658 💎 [STORE GEM] Database insert result [qinsmcoxd]: {success: true, error: undefined, errorCode: undefined, insertedData: Array(1)}
EnhancedGameSessionService.ts:669 💎 [STORE GEM] Successfully stored mastery gem [qinsmcoxd]: new_discovery (5 XP) for "voleibol"
EnhancedGameSessionService.ts:531 🔮 [SESSION SERVICE] Gem event cached for session summary [y1bran55g]: {rarity: 'new_discovery', xpValue: 5}
EnhancedGameSessionService.ts:537 🔮 [SESSION SERVICE] recordWordAttempt completed [y1bran55g]: {returnedGemEvent: true, gemRarity: 'new_discovery', gemXP: 5}
HangmanGame.tsx:487 ✅ [HANGMAN] Gem awarded: new_discovery (5 XP) - Wrong guesses: 1, Time: 0s
:3000/activities/hangman?assignment=8b3e35fd-11ba-4da9-bc87-333b01d37dd2&mode=assignment&filterOutstanding=true:1 The resource http://localhost:3000/_next/static/css/app/layout.css?v=1768077724171 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
