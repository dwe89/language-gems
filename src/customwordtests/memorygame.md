useGlobalAudioContext.ts:212 🎵 GlobalAudioContext: Removed initial user interaction listeners.
useGlobalAudioContext.ts:212 🎵 GlobalAudioContext: Removed initial user interaction listeners.
MemoryGameMain.tsx:940 🎵 Playing wrong sound...
MemoryGameMain.tsx:958 🎮 [MEMORY GAME] Failed match - no tracking (luck-based game)
MemoryGameMain.tsx:940 🎵 Playing wrong sound...
MemoryGameMain.tsx:958 🎮 [MEMORY GAME] Failed match - no tracking (luck-based game)
MemoryGameMain.tsx:940 🎵 Playing wrong sound...
MemoryGameMain.tsx:958 🎮 [MEMORY GAME] Failed match - no tracking (luck-based game)
MemoryGameMain.tsx:714 🎵 Playing correct sound...
MemoryGameMain.tsx:776 🔍 [FSRS DEBUG] Memory Game card data: {firstCardVocabularyId: '95740e7c-272e-4385-b6b3-2ae0a001cafe', firstCardVocabularyIdType: 'string', firstCardWord: undefined, firstCardTranslation: undefined, firstCardValue: 'Swimming'}
MemoryGameMain.tsx:799 🔍 [FSRS DEBUG] Word data being passed to FSRS: {id: '95740e7c-272e-4385-b6b3-2ae0a001cafe', word: 'Swimming', translation: 'translation', language: 'es'}
MemoryGameMain.tsx:802 ✅ [LAYER 3] FSRS tracking handled by EnhancedGameSessionService
MemoryGameMain.tsx:813 🔍 [VOCAB TRACKING] Starting vocabulary tracking for memory match: {vocabularyId: '95740e7c-272e-4385-b6b3-2ae0a001cafe', vocabularyIdType: 'string', word: 'Swimming', translation: 'translation', wasCorrect: true, …}
EnhancedGameSessionService.ts:330 🔮 [SESSION SERVICE] recordWordAttempt called [svr16tb58]: {sessionId: 'c0da3a41-7316-4fc9-8c62-adc1f6746915', gameType: 'memory-game', attempt: {…}, skipSpacedRepetition: false}
EnhancedGameSessionService.ts:133 📊 [SESSION COUNTS] Incrementing for session c0da3a41-7316-4fc9-8c62-adc1f6746915, wasCorrect: true
MemoryGameMain.tsx:740 🎯 [LAYER 1] Marked word as used: 95740e7c-272e-4385-b6b3-2ae0a001cafe (total: 1)
MemoryGameMain.tsx:740 🎯 [LAYER 1] Marked word as used: 95740e7c-272e-4385-b6b3-2ae0a001cafe (total: 1)
EnhancedGameSessionService.ts:155 📊 [SESSION COUNTS] Updating: 0 → 1 attempted, 0 → 1 correct
EnhancedGameSessionService.ts:169 ✅ [SESSION COUNTS] Successfully updated session c0da3a41-7316-4fc9-8c62-adc1f6746915
EnhancedGameSessionService.ts:347 🔮 [SESSION SERVICE] Logging word performance [svr16tb58]...
EnhancedGameSessionService.ts:360 🔍 [ENHANCED SESSION] FSRS update: {vocabularyId: '95740e7c-272e-4385-b6b3-2ae0a001cafe', enhancedVocabularyItemId: undefined, wasCorrect: true, callId: 'svr16tb58'}
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
eval @ MemoryGameMain.tsx:827
setTimeout
handleCardClick @ MemoryGameMain.tsx:723
onClick @ MemoryGameMain.tsx:1187
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
EnhancedGameSessionService.ts:1060 ✅ [FSRS GATE] Word is due for review, allowing progression: {vocabularyId: '95740e7c-272e-4385-b6b3-2ae0a001cafe', phase: 'new', state: 'new'}
EnhancedGameSessionService.ts:1117 ✅ [DIRECT UPDATE] Vocabulary updated successfully: {vocabularyId: '95740e7c-272e-4385-b6b3-2ae0a001cafe', wasCorrect: true, studentId: '9d184226-be17-4612-8685-0ac45fcef060', phase: 'new'}
EnhancedGameSessionService.ts:375 ✅ [ENHANCED SESSION] FSRS update completed successfully
EnhancedGameSessionService.ts:416 🔮 [SESSION SERVICE] Getting session context for session [svr16tb58]...
EnhancedGameSessionService.ts:951 ✅ [PERFORMANCE LOG] Successfully logged custom vocabulary performance after retry.
EnhancedGameSessionService.ts:418 🔮 [SESSION SERVICE] Student ID: 9d184226-be17-4612-8685-0ac45fcef060, Assignment ID: 8b3e35fd-11ba-4da9-bc87-333b01d37dd2 [svr16tb58]
EnhancedGameSessionService.ts:426 📝 [LAYER 2] Recording exposure for word 95740e7c-272e-4385-b6b3-2ae0a001cafe in assignment 8b3e35fd-11ba-4da9-bc87-333b01d37dd2 (isCustom: false)
AssignmentExposureService.ts:64 📝 [EXPOSURE SERVICE] Recording exposures [f1kml]: {assignmentId: '8b3e35fd-11ba-4da9-bc87-333b01d37dd2', studentId: '9d184226-be17-4612-8685-0ac45fcef060', wordCount: 1, wordIds: Array(1), isCustomVocabulary: false}
EnhancedGameSessionService.ts:435 🎮 [DUAL-TRACK] Awarding Activity Gem for correct answer [svr16tb58]
EnhancedGameSessionService.ts:456 🔮 [SESSION SERVICE] Activity gem created [svr16tb58]: {rarity: 'common', xpValue: 2, wordText: 'Swimming'}
EnhancedGameSessionService.ts:463 🔮 [SESSION SERVICE] Storing Activity Gem in database [svr16tb58]...
EnhancedGameSessionService.ts:561 💎 [STORE GEM] Starting to store gem event [jysvs3zxa]: {sessionId: 'c0da3a41-7316-4fc9-8c62-adc1f6746915', studentId: '9d184226-be17-4612-8685-0ac45fcef060', gemType: 'activity', gemEvent: {…}}
EnhancedGameSessionService.ts:627 💎 [STORE GEM] Inserting into gem_events table [jysvs3zxa]: {session_id: 'c0da3a41-7316-4fc9-8c62-adc1f6746915', student_id: '9d184226-be17-4612-8685-0ac45fcef060', gem_rarity: 'common', xp_value: 2, word_text: 'Swimming', …}
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
EnhancedGameSessionService.ts:637 ⚠️ [STORE GEM] FK violation detected. Code: 23503. Retrying as Custom Vocabulary...
storeGemEvent @ EnhancedGameSessionService.ts:637
await in storeGemEvent
recordWordAttempt @ EnhancedGameSessionService.ts:464
await in recordWordAttempt
eval @ MemoryGameMain.tsx:827
setTimeout
handleCardClick @ MemoryGameMain.tsx:723
onClick @ MemoryGameMain.tsx:1187
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
AssignmentExposureService.ts:120 ⚠️ [EXPOSURE SERVICE] FK violation on centralized_vocabulary_id [f1kml]. Retrying as custom vocabulary...
recordWordExposures @ AssignmentExposureService.ts:120
await in recordWordExposures
recordWordAttempt @ EnhancedGameSessionService.ts:427
await in recordWordAttempt
eval @ MemoryGameMain.tsx:827
setTimeout
handleCardClick @ MemoryGameMain.tsx:723
onClick @ MemoryGameMain.tsx:1187
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
AssignmentExposureService.ts:144 ✅ [EXPOSURE SERVICE] Recorded 1 custom exposures [f1kml]
EnhancedGameSessionService.ts:652 ✅ [STORE GEM] Successfully stored custom vocabulary gem after retry. ID: 95740e7c-272e-4385-b6b3-2ae0a001cafe
EnhancedGameSessionService.ts:658 💎 [STORE GEM] Database insert result [jysvs3zxa]: {success: true, error: undefined, errorCode: undefined, insertedData: Array(1)}
EnhancedGameSessionService.ts:669 💎 [STORE GEM] Successfully stored activity gem [jysvs3zxa]: common (2 XP) for "Swimming"
EnhancedGameSessionService.ts:524 ⏰ [DUAL-TRACK] FSRS blocks progression - only Activity Gem awarded: Word not yet due for review
EnhancedGameSessionService.ts:531 🔮 [SESSION SERVICE] Gem event cached for session summary [svr16tb58]: {rarity: 'common', xpValue: 2}
EnhancedGameSessionService.ts:537 🔮 [SESSION SERVICE] recordWordAttempt completed [svr16tb58]: {returnedGemEvent: true, gemRarity: 'common', gemXP: 2}
MemoryGameMain.tsx:843 🔍 [VOCAB TRACKING] Gem event result: {gemEventExists: true, gemEvent: {…}, wasCorrect: true}
MemoryGameMain.tsx:856 🔮 Memory Game earned common gem (2 XP) for "Swimming"
