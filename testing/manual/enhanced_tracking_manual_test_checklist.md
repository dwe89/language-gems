# Enhanced Tracking System - Manual Testing Checklist

## Overview
This checklist provides specific testing scenarios for each game to validate the enhanced tracking system's accuracy and consistency. Internal testers should follow these scenarios while debug logging is enabled.

## Pre-Testing Setup

### 1. Enable Debug Logging
```bash
# Add to .env.local
NEXT_PUBLIC_DEBUG_TRACKING=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 2. Open Browser Developer Tools
- Open Chrome/Firefox Developer Tools (F12)
- Go to Console tab to monitor tracking logs
- Go to Network tab to monitor API calls

### 3. Test User Accounts
Use these test accounts for consistent results:
- **High Performer**: `advanced@test.com` / `password123`
- **Average Performer**: `student@test.com` / `password123`  
- **Beginner**: `beginner@test.com` / `password123`

## SKILL-BASED GAMES TESTING
*These games MUST track detailed vocabulary/accuracy data*

### 1. VocabMaster
**Normal Mode Test:**
- [ ] Navigate to `/games/vocab-master`
- [ ] Select Spanish → English, Intermediate level
- [ ] Play for exactly 10 words
- [ ] Answer 7 correctly, 3 incorrectly (mix response times: 2-8 seconds)
- [ ] **Verify Console Logs:**
  - [ ] Session start logged with correct game_type: 'vocab-master'
  - [ ] Each word attempt logged with response_time_ms
  - [ ] Session end logged with final statistics
- [ ] **Verify Network Calls:**
  - [ ] POST to `/api/enhanced-game-service/start-session`
  - [ ] Multiple POST to `/api/enhanced-game-service/log-word-performance`
  - [ ] POST to `/api/enhanced-game-service/end-session`

**Assignment Mode Test:**
- [ ] Navigate to `/games/vocab-master?assignment=test-assignment-1&mode=assignment`
- [ ] Complete same scenario as above
- [ ] **Additional Verification:**
  - [ ] Assignment ID included in session data
  - [ ] Session mode = 'assignment'
  - [ ] Redirect to assignments page after completion

### 2. Word Scramble
**Normal Mode Test:**
- [ ] Navigate to `/games/word-scramble`
- [ ] Select Food category, Medium difficulty
- [ ] Complete 5 words (mix of correct/incorrect solutions)
- [ ] **Verify Tracking:**
  - [ ] Session initialization logged
  - [ ] Word performance for each scrambled word
  - [ ] Accuracy calculation matches actual performance

**Assignment Mode Test:**
- [ ] Test with assignment parameters
- [ ] Verify consistent tracking with normal mode

### 3. Detective Listening Game
**Test Scenario:**
- [ ] Navigate to `/games/detective-listening`
- [ ] Play "Family Mystery" case
- [ ] Listen to 8 audio clues, answer 5 correctly, 3 incorrectly
- [ ] **Verify Audio Tracking:**
  - [ ] Audio playback events logged
  - [ ] Response time from audio end to answer submission
  - [ ] Listening comprehension accuracy tracked

### 4. Word Blast
**Test Scenario:**
- [ ] Navigate to `/games/word-blast`
- [ ] Play for 2 minutes
- [ ] Create word matches (aim for 15 matches, 3 misses)
- [ ] **Verify Explosive Tracking:**
  - [ ] Each word match logged individually
  - [ ] Chain reaction bonuses tracked
  - [ ] Time pressure performance metrics

### 5. Case File Translator
**Test Scenario:**
- [ ] Navigate to `/games/case-file-translator`
- [ ] Translate 6 evidence documents
- [ ] Mix translation accuracy (4 correct, 2 incorrect)
- [ ] **Verify Translation Tracking:**
  - [ ] Each translation attempt logged
  - [ ] Context clues usage tracked
  - [ ] Document completion time recorded

### 6. Lava Temple: Word Restore
**Test Scenario:**
- [ ] Navigate to `/games/lava-temple-word-restore`
- [ ] Restore 8 stone tablets
- [ ] Fill in missing letters (6 correct, 2 incorrect)
- [ ] **Verify Restoration Tracking:**
  - [ ] Letter placement attempts logged
  - [ ] Tablet completion time tracked
  - [ ] Archaeological theme context preserved

### 7. Verb Quest
**Test Scenario:**
- [ ] Navigate to `/games/verb-quest`
- [ ] Create character, complete 3 quests
- [ ] Conjugate 12 verbs (9 correct, 3 incorrect)
- [ ] **Verify RPG Tracking:**
  - [ ] Character progression logged
  - [ ] Quest completion tracked
  - [ ] Verb conjugation accuracy per tense

### 8. Conjugation Duel
**Test Scenario:**
- [ ] Navigate to `/games/conjugation-duel`
- [ ] Complete 5 duels against AI opponents
- [ ] Win 3 duels, lose 2 duels
- [ ] **Verify Competitive Tracking:**
  - [ ] Duel outcomes logged
  - [ ] Head-to-head performance metrics
  - [ ] League progression tracked

### 9. Sentence Towers
**Test Scenario:**
- [ ] Navigate to `/games/sentence-towers`
- [ ] Build 6 sentence towers
- [ ] Complete 4 successfully, fail 2
- [ ] **Verify Construction Tracking:**
  - [ ] Word placement accuracy
  - [ ] Sentence structure understanding
  - [ ] Tower completion time

### 10. Speed Builder
**Test Scenario:**
- [ ] Navigate to `/games/speed-builder`
- [ ] Complete speed building session (2 minutes)
- [ ] Build 10 sentences under time pressure
- [ ] **Verify Speed Tracking:**
  - [ ] Words per minute calculated
  - [ ] Time pressure performance
  - [ ] Speed vs accuracy balance

### 11. Vocab Blast (Different from Word Blast)
**Test Scenario:**
- [ ] Navigate to `/games/vocab-blast`
- [ ] Blast vocabulary targets for 90 seconds
- [ ] Hit 20 targets, miss 5 targets
- [ ] **Verify Blast Tracking:**
  - [ ] Target hit accuracy
  - [ ] Reaction time per target
  - [ ] Explosive combo tracking

## LUCK-BASED GAMES TESTING
*These games should NOT track individual word accuracy*

### 12. Memory Match
**Test Scenario:**
- [ ] Navigate to `/games/memory-match`
- [ ] Complete memory card game (16 pairs)
- [ ] Match 12 pairs correctly, 4 pairs incorrectly
- [ ] **Verify Limited Tracking:**
  - [ ] ✅ Session start/end logged
  - [ ] ✅ Total pairs matched
  - [ ] ✅ Game completion time
  - [ ] ❌ NO individual word performance logs
  - [ ] ❌ NO vocabulary mastery updates

### 13. Hangman
**Test Scenario:**
- [ ] Navigate to `/games/hangman`
- [ ] Play 5 hangman rounds
- [ ] Guess 3 words correctly, fail 2 words
- [ ] **Verify Limited Tracking:**
  - [ ] ✅ Session data only
  - [ ] ✅ Words guessed vs total words
  - [ ] ❌ NO letter-by-letter tracking
  - [ ] ❌ NO vocabulary progress updates

### 14. Noughts and Crosses
**Test Scenario:**
- [ ] Navigate to `/games/noughts-and-crosses`
- [ ] Play 7 games against AI
- [ ] Win 4 games, lose 3 games
- [ ] **Verify Limited Tracking:**
  - [ ] ✅ Game outcomes only
  - [ ] ✅ Win/loss ratio
  - [ ] ❌ NO vocabulary tracking
  - [ ] ❌ NO word performance data

## CROSS-CUTTING CONCERNS

### Assignment Mode Consistency Test
**For each skill-based game:**
- [ ] Play same game in normal mode and assignment mode
- [ ] **Verify Identical Tracking:**
  - [ ] Same data fields collected
  - [ ] Same API endpoints called
  - [ ] Only difference: assignment_id and session_mode

### Performance Edge Cases

#### Rapid Input Test
- [ ] Select any skill-based game
- [ ] Click answers very rapidly (< 500ms between clicks)
- [ ] **Verify Graceful Handling:**
  - [ ] No duplicate logs
  - [ ] Response times accurately recorded
  - [ ] No system crashes or errors

#### Network Interruption Test
- [ ] Start any game session
- [ ] Disable network connection mid-game
- [ ] Re-enable network after 30 seconds
- [ ] **Verify Recovery:**
  - [ ] Session data queued locally
  - [ ] Data synced when connection restored
  - [ ] No data loss

#### Perfect Performance Test
- [ ] Play VocabMaster with 100% accuracy
- [ ] Answer all 10 words correctly in < 2 seconds each
- [ ] **Verify Edge Case Handling:**
  - [ ] 100% accuracy recorded correctly
  - [ ] Fast response times logged accurately
  - [ ] Bonus XP calculations correct

#### Zero Performance Test
- [ ] Play Detective Listening with 0% accuracy
- [ ] Answer all questions incorrectly with long delays (> 10 seconds)
- [ ] **Verify Edge Case Handling:**
  - [ ] 0% accuracy recorded without errors
  - [ ] Long response times logged correctly
  - [ ] No division by zero errors

## DATABASE VERIFICATION

### After Each Test Session:
1. **Check enhanced_game_sessions table:**
   ```sql
   SELECT * FROM enhanced_game_sessions 
   WHERE student_id = 'your-test-user-id' 
   ORDER BY created_at DESC LIMIT 5;
   ```

2. **Check word_performance_logs table (skill-based games only):**
   ```sql
   SELECT wpl.*, egs.game_type 
   FROM word_performance_logs wpl
   JOIN enhanced_game_sessions egs ON wpl.session_id = egs.id
   WHERE egs.student_id = 'your-test-user-id'
   ORDER BY wpl.timestamp DESC LIMIT 10;
   ```

3. **Verify data consistency:**
   - [ ] Session duration matches actual play time (±10 seconds)
   - [ ] Word count matches actual words attempted
   - [ ] Accuracy percentage calculation is correct
   - [ ] XP earned follows expected formula

## ISSUE REPORTING

### For Each Failed Test:
1. **Screenshot** of console errors
2. **Network tab** showing failed API calls
3. **Database state** before and after test
4. **Exact steps** to reproduce the issue
5. **Expected vs actual** behavior description

### Critical Issues (Stop Testing):
- [ ] No session data recorded at all
- [ ] Skill-based game not logging word performance
- [ ] Luck-based game incorrectly logging word performance
- [ ] Assignment mode using different tracking than normal mode

### Minor Issues (Continue Testing):
- [ ] Incorrect accuracy calculations
- [ ] Missing session metadata
- [ ] Slow API response times
- [ ] UI elements not properly labeled for testing

## COMPLETION CRITERIA

### All Tests Pass When:
- [ ] All 15 games successfully track sessions
- [ ] Skill-based games (11) log word performance data
- [ ] Luck-based games (3) do NOT log word performance data
- [ ] Assignment mode identical to normal mode tracking
- [ ] Edge cases handled gracefully
- [ ] Database data matches expected patterns
- [ ] No console errors during normal gameplay
- [ ] API response times < 2 seconds for all calls

**Estimated Testing Time:** 4-6 hours for complete checklist
**Recommended Team Size:** 2-3 testers working in parallel
