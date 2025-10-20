# Grammar Assignment Integration - Testing Guide

## Overview
This guide provides step-by-step instructions for testing the newly integrated grammar assignment tracking system.

## What Was Implemented

### 1. Database Schema
- **Table**: `grammar_assignment_sessions` - Tracks all grammar practice/test sessions
- **Views**: 
  - `student_grammar_assignment_performance` - Aggregated performance metrics
  - `grammar_assignment_topic_mastery` - Topic-level mastery tracking
- **Function**: `get_grammar_assignment_completion()` - Calculates assignment completion status

### 2. Service Layer
- **GrammarSessionService** (`src/services/grammar/GrammarSessionService.ts`)
  - `startSession()` - Initialize grammar sessions
  - `recordQuestionAttempt()` - Track individual questions
  - `endSession()` - Finalize with gems/XP rewards
  - Enhanced gem calculation: Practice (2-5 gems/question), Test (5-10 gems/question)

### 3. Analytics Integration
- **GrammarAnalyticsService** extended with assignment-specific methods:
  - `getAssignmentGrammarPerformance()`
  - `getAssignmentTopicMastery()`
  - `getAssignmentGrammarSessions()`
  - `getAssignmentCompletion()`
  - `getAssignmentAnalytics()` - Comprehensive analytics

### 4. Frontend Integration
- Grammar practice/test pages detect `?assignment=<id>` parameter
- Automatic session tracking in assignment mode
- Student dashboard displays grammar assignment progress
- Topic-level progress bars for skills

## Testing Checklist

### Phase 1: Create Grammar Assignment

1. **Navigate to Assignment Creator**
   - URL: `http://localhost:3000/dashboard/assignments`
   - Click "Create New Assignment"

2. **Configure Assignment**
   - **Title**: "Spanish Grammar Practice - Test Assignment"
   - **Description**: "Practice adjective agreement and present tense"
   - **Due Date**: Set to 7 days from now
   - **Gem Type**: Choose any gem type

3. **Select Grammar Topics**
   - Go to "Skills" tab
   - Select Language: Spanish
   - Select Category: "Adjectives" or "Verbs"
   - Select 2-3 topics (e.g., "Adjective Agreement", "Present Tense Regular Verbs")
   - Click "Add Selected Topics"

4. **Review and Create**
   - Review the assignment configuration
   - Click "Create Assignment"
   - **Note the Assignment ID** from the URL

### Phase 2: Complete Grammar Practice Session

1. **Access Assignment as Student**
   - Navigate to: `http://localhost:3001/student-dashboard/assignments`
   - Find your test assignment
   - Click on the assignment card

2. **Start Grammar Practice**
   - Click on one of the grammar topics
   - Should redirect to: `/grammar/spanish/[category]/[topic]/practice?assignment=<id>`
   - Verify the assignment parameter is in the URL

3. **Complete Practice Session**
   - Answer 10-15 questions (depending on practice mode)
   - Try to get at least 80% accuracy for bonus gems
   - Complete the full session

4. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look for logs starting with `[GRAMMAR SESSION]`:
     ```
     🎯 [GRAMMAR SESSION] Starting new session
     📝 [GRAMMAR SESSION] Recording question attempt
     🏁 [GRAMMAR SESSION] Ending session
     ✅ [GRAMMAR SESSION] Session ended successfully
     ```

### Phase 3: Verify Database Tracking

1. **Check Session Record**
   ```sql
   SELECT * FROM grammar_assignment_sessions 
   WHERE assignment_id = '<your-assignment-id>'
   ORDER BY started_at DESC 
   LIMIT 1;
   ```

2. **Verify Session Data**
   - `completion_status` should be 'completed'
   - `questions_attempted` should match number of questions
   - `accuracy_percentage` should be calculated correctly
   - `gems_earned` should be > 0
   - `session_data` should contain question attempts

3. **Check Assignment Progress**
   ```sql
   SELECT * FROM enhanced_assignment_progress 
   WHERE assignment_id = '<your-assignment-id>';
   ```

### Phase 4: Test Grammar Test Mode

1. **Access Grammar Test**
   - From assignment page, click on a topic
   - Navigate to test mode (if available)
   - URL should include: `/grammar/spanish/[category]/[topic]/test?assignment=<id>`

2. **Complete Test Session**
   - Answer all questions
   - Note: Tests should award MORE gems than practice (5-10 per question vs 2-5)

3. **Verify Higher Gem Rewards**
   ```sql
   SELECT session_type, gems_earned, questions_correct 
   FROM grammar_assignment_sessions 
   WHERE assignment_id = '<your-assignment-id>'
   ORDER BY started_at DESC;
   ```
   - Test sessions should have higher `gems_earned` for same `questions_correct`

### Phase 5: Check Student Dashboard

1. **Navigate to Assignment Detail Page**
   - URL: `http://localhost:3001/student-dashboard/assignments/<assignment-id>`

2. **Verify Grammar Progress Display**
   - Skills section should show completed topics
   - Progress bar should reflect: `sessionsCompleted / totalTopics`
   - Accuracy and score should be displayed
   - Time spent should be shown

3. **Check Overall Assignment Progress**
   - Overall progress percentage should update
   - Completion status should change when all topics are completed

### Phase 6: Test Analytics Dashboard

1. **Access Grammar Analytics** (Future Enhancement)
   - URL: `http://localhost:3001/dashboard/grammar/analytics`
   - Filter by assignment
   - Verify topic mastery indicators (🔴 🟡 🟢)

2. **Check Performance Metrics**
   - Average accuracy across topics
   - Total time spent
   - Sessions completed
   - Proficiency levels per topic

## Expected Results

### Gem Rewards
- **Practice Mode**:
  - Base: 2 gems per correct answer
  - 90%+ accuracy: +100% bonus (4 gems per correct)
  - 75-89% accuracy: +50% bonus (3 gems per correct)
  - Perfect score: +5 gems bonus

- **Test Mode**:
  - Base: 5 gems per correct answer
  - 90%+ accuracy: +100% bonus (10 gems per correct)
  - 75-89% accuracy: +50% bonus (7.5 gems per correct)
  - Perfect score: +10 gems bonus

### Proficiency Levels
- 🔴 **Struggling**: accuracy < 60% OR encounters < 3
- 🟡 **Learning**: 60-89% accuracy AND encounters ≥ 3
- 🟢 **Proficient**: ≥90% accuracy AND encounters ≥ 5

### Assignment Completion
- Assignment is complete when at least one session per topic is completed
- Progress bar shows: `completedSessions / totalTopics`

## Troubleshooting

### Session Not Recording
- Check browser console for errors
- Verify `?assignment=<id>` parameter is in URL
- Check that user is authenticated
- Verify database migration was applied

### Gems Not Awarded
- Check `grammar_assignment_sessions.gems_earned` column
- Verify `endSession()` was called successfully
- Check console logs for calculation details

### Progress Not Updating
- Verify `updateAssignmentProgress()` is being called
- Check `enhanced_assignment_progress` table
- Ensure RLS policies allow updates

### Analytics Not Showing Data
- Verify sessions exist in `grammar_assignment_sessions`
- Check that views are created: `student_grammar_assignment_performance`, `grammar_assignment_topic_mastery`
- Ensure `get_grammar_assignment_completion()` function exists

## Next Steps After Testing

1. **Fine-tune Gem Rewards** - Adjust multipliers based on testing feedback
2. **Add Grammar Analytics Dashboard** - Display assignment-specific performance
3. **Implement Leaderboards** - Show top performers in grammar assignments
4. **Add Notifications** - Alert students when grammar assignments are due
5. **Create Teacher Reports** - Show class-wide grammar assignment performance

## Files Modified

- `src/services/grammar/GrammarSessionService.ts` - Session tracking service
- `src/services/analytics/GrammarAnalyticsService.ts` - Analytics methods
- `src/app/grammar/[language]/[category]/[topic]/practice/page.tsx` - Practice page integration
- `src/app/grammar/[language]/[category]/[topic]/test/page.tsx` - Test page integration
- `src/components/grammar/GrammarPractice.tsx` - Session recording
- `src/app/student-dashboard/assignments/[assignmentId]/page.tsx` - Progress display
- `supabase/migrations/20250120000000_create_grammar_assignment_sessions.sql` - Database schema

## Support

If you encounter any issues during testing, check:
1. Browser console for JavaScript errors
2. Network tab for failed API requests
3. Supabase logs for database errors
4. Terminal output for Next.js compilation errors

