development.js:20614
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
EnhancedGameSessionService.ts:652 ✅ [STORE GEM] Successfully stored custom vocabulary gem after retry. ID: d52696e2-680b-40a7-8a27-059a53efc934
EnhancedGameSessionService.ts:658 💎 [STORE GEM] Database insert result [mjaz7k6or]: {success: true, error: undefined, errorCode: undefined, insertedData: Array(1)}
EnhancedGameSessionService.ts:669 💎 [STORE GEM] Successfully stored mastery gem [mjaz7k6or]: new_discovery (5 XP) for "Tenis"
EnhancedGameSessionService.ts:531 🔮 [SESSION SERVICE] Gem event cached for session summary [182rgkhfi]: {rarity: 'new_discovery', xpValue: 5}
EnhancedGameSessionService.ts:537 🔮 [SESSION SERVICE] recordWordAttempt completed [182rgkhfi]: {returnedGemEvent: true, gemRarity: 'new_discovery', gemXP: 5}
VocabBlastGame.tsx:405 🔮 Vocab Blast earned new_discovery gem (5 XP) for "Tenis"
VocabBlastGame.tsx:373 🎯 [LAYER 1] Marked word as used: 0074064f-54e4-41e3-86f4-6c0ac483d4d4 (total: 2)
VocabBlastGame.tsx:301 ✅ Next word selected: Béisbol
EnhancedGameSessionService.ts:330 🔮 [SESSION SERVICE] recordWordAttempt called [tm7kfk0k6]: {sessionId: '75f01d46-1fc6-44b4-bd5e-5b01c706a686', gameType: 'vocab-blast', attempt: {…}, skipSpacedRepetition: false}
EnhancedGameSessionService.ts:133 📊 [SESSION COUNTS] Incrementing for session 75f01d46-1fc6-44b4-bd5e-5b01c706a686, wasCorrect: true
EnhancedGameSessionService.ts:155 📊 [SESSION COUNTS] Updating: 1 → 2 attempted, 1 → 2 correct
EnhancedGameSessionService.ts:169 ✅ [SESSION COUNTS] Successfully updated session 75f01d46-1fc6-44b4-bd5e-5b01c706a686
EnhancedGameSessionService.ts:347 🔮 [SESSION SERVICE] Logging word performance [tm7kfk0k6]...
EnhancedGameSessionService.ts:360 🔍 [ENHANCED SESSION] FSRS update: {vocabularyId: '0074064f-54e4-41e3-86f4-6c0ac483d4d4', enhancedVocabularyItemId: undefined, wasCorrect: true, callId: 'tm7kfk0k6'}
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
EnhancedGameSessionService.ts:939 ⚠️ [PERFORMANCE LOG] FK violation detected. Retrying as Custom Vocabulary...
logWordPerformance @ EnhancedGameSessionService.ts:939
await in logWordPerformance
recordWordAttempt @ EnhancedGameSessionService.ts:348
await in recordWordAttempt
eval @ VocabBlastGame.tsx:388
Promise.then
eval @ VocabBlastGame.tsx:383
eval @ VocabBlastEngine.tsx:294
onClick @ VocabBlastEngine.tsx:398
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
EnhancedGameSessionService.ts:1060 ✅ [FSRS GATE] Word is due for review, allowing progression: {vocabularyId: '0074064f-54e4-41e3-86f4-6c0ac483d4d4', phase: 'new', state: 'new'}
EnhancedGameSessionService.ts:1117 ✅ [DIRECT UPDATE] Vocabulary updated successfully: {vocabularyId: '0074064f-54e4-41e3-86f4-6c0ac483d4d4', wasCorrect: true, studentId: '9d184226-be17-4612-8685-0ac45fcef060', phase: 'new'}
EnhancedGameSessionService.ts:375 ✅ [ENHANCED SESSION] FSRS update completed successfully
EnhancedGameSessionService.ts:416 🔮 [SESSION SERVICE] Getting session context for session [tm7kfk0k6]...
EnhancedGameSessionService.ts:418 🔮 [SESSION SERVICE] Student ID: 9d184226-be17-4612-8685-0ac45fcef060, Assignment ID: 8b3e35fd-11ba-4da9-bc87-333b01d37dd2 [tm7kfk0k6]
EnhancedGameSessionService.ts:426 📝 [LAYER 2] Recording exposure for word 0074064f-54e4-41e3-86f4-6c0ac483d4d4 in assignment 8b3e35fd-11ba-4da9-bc87-333b01d37dd2 (isCustom: false)
AssignmentExposureService.ts:64 📝 [EXPOSURE SERVICE] Recording exposures [aiikwo]: {assignmentId: '8b3e35fd-11ba-4da9-bc87-333b01d37dd2', studentId: '9d184226-be17-4612-8685-0ac45fcef060', wordCount: 1, wordIds: Array(1), isCustomVocabulary: false}
EnhancedGameSessionService.ts:435 🎮 [DUAL-TRACK] Awarding Activity Gem for correct answer [tm7kfk0k6]
EnhancedGameSessionService.ts:456 🔮 [SESSION SERVICE] Activity gem created [tm7kfk0k6]: {rarity: 'common', xpValue: 2, wordText: 'Atletismo'}
EnhancedGameSessionService.ts:463 🔮 [SESSION SERVICE] Storing Activity Gem in database [tm7kfk0k6]...
EnhancedGameSessionService.ts:561 💎 [STORE GEM] Starting to store gem event [qxhbpxc0b]: {sessionId: '75f01d46-1fc6-44b4-bd5e-5b01c706a686', studentId: '9d184226-be17-4612-8685-0ac45fcef060', gemType: 'activity', gemEvent: {…}}
EnhancedGameSessionService.ts:627 💎 [STORE GEM] Inserting into gem_events table [qxhbpxc0b]: {session_id: '75f01d46-1fc6-44b4-bd5e-5b01c706a686', student_id: '9d184226-be17-4612-8685-0ac45fcef060', gem_rarity: 'common', xp_value: 2, word_text: 'Atletismo', …}
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
eval @ VocabBlastGame.tsx:388
Promise.then
eval @ VocabBlastGame.tsx:383
eval @ VocabBlastEngine.tsx:294
onClick @ VocabBlastEngine.tsx:398
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
AssignmentExposureService.ts:120 ⚠️ [EXPOSURE SERVICE] FK violation on centralized_vocabulary_id [aiikwo]. Retrying as custom vocabulary...
recordWordExposures @ AssignmentExposureService.ts:120
await in recordWordExposures
recordWordAttempt @ EnhancedGameSessionService.ts:427
await in recordWordAttempt
eval @ VocabBlastGame.tsx:388
Promise.then
eval @ VocabBlastGame.tsx:383
eval @ VocabBlastEngine.tsx:294
onClick @ VocabBlastEngine.tsx:398
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
EnhancedGameSessionService.ts:652 ✅ [STORE GEM] Successfully stored custom vocabulary gem after retry. ID: 0074064f-54e4-41e3-86f4-6c0ac483d4d4
EnhancedGameSessionService.ts:658 💎 [STORE GEM] Database insert result [qxhbpxc0b]: {success: true, error: undefined, errorCode: undefined, insertedData: Array(1)}
EnhancedGameSessionService.ts:669 💎 [STORE GEM] Successfully stored activity gem [qxhbpxc0b]: common (2 XP) for "Atletismo"
AssignmentExposureService.ts:144 ✅ [EXPOSURE SERVICE] Recorded 1 custom exposures [aiikwo]
EnhancedGameSessionService.ts:492 💎 [DUAL-TRACK] FSRS allows progression - awarding Mastery Gem
EnhancedGameSessionService.ts:493 🔍 [DEBUG] canProgress data: {allowed: true, reason: 'New word - first encounter', phase: 'new', state: 'new', nextReviewAt: '2026-01-12T20:43:33.313224+00:00'}
EnhancedGameSessionService.ts:495 🔍 [DEBUG] isFirstTime calculation: {phase: 'new', isFirstTime: true}
RewardEngine.ts:215 🆕 [REWARD ENGINE] First-time word detected - awarding New Discovery
EnhancedGameSessionService.ts:561 💎 [STORE GEM] Starting to store gem event [abxzefp93]: {sessionId: '75f01d46-1fc6-44b4-bd5e-5b01c706a686', studentId: '9d184226-be17-4612-8685-0ac45fcef060', gemType: 'mastery', gemEvent: {…}}
EnhancedGameSessionService.ts:627 💎 [STORE GEM] Inserting into gem_events table [abxzefp93]: {session_id: '75f01d46-1fc6-44b4-bd5e-5b01c706a686', student_id: '9d184226-be17-4612-8685-0ac45fcef060', gem_rarity: 'new_discovery', xp_value: 5, word_text: 'Atletismo', …}
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
eval @ VocabBlastGame.tsx:388
Promise.then
eval @ VocabBlastGame.tsx:383
eval @ VocabBlastEngine.tsx:294
onClick @ VocabBlastEngine.tsx:398
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
EnhancedGameSessionService.ts:652 ✅ [STORE GEM] Successfully stored custom vocabulary gem after retry. ID: 0074064f-54e4-41e3-86f4-6c0ac483d4d4
EnhancedGameSessionService.ts:658 💎 [STORE GEM] Database insert result [abxzefp93]: {success: true, error: undefined, errorCode: undefined, insertedData: Array(1)}
EnhancedGameSessionService.ts:669 💎 [STORE GEM] Successfully stored mastery gem [abxzefp93]: new_discovery (5 XP) for "Atletismo"
EnhancedGameSessionService.ts:531 🔮 [SESSION SERVICE] Gem event cached for session summary [tm7kfk0k6]: {rarity: 'new_discovery', xpValue: 5}
EnhancedGameSessionService.ts:537 🔮 [SESSION SERVICE] recordWordAttempt completed [tm7kfk0k6]: {returnedGemEvent: true, gemRarity: 'new_discovery', gemXP: 5}
VocabBlastGame.tsx:405 🔮 Vocab Blast earned new_discovery gem (5 XP) for "Atletismo"
