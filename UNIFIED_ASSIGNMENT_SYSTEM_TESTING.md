# Unified Assignment System Testing Guide

## 🎯 Overview

This guide provides step-by-step testing procedures to validate the unified vocabulary assignment system implementation across all Language Gems games.

## ✅ Pre-Testing Setup

### Database Verification
1. **Check Migration Status**:
   ```sql
   -- Verify curriculum level columns exist
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'assignments' AND column_name = 'curriculum_level';

   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'centralized_vocabulary' AND column_name = 'curriculum_level';

   -- Verify KS4-specific columns exist
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'centralized_vocabulary'
   AND column_name IN ('tier', 'theme_name', 'exam_board_code', 'is_required');
   ```

2. **Verify Sample Data**:
   ```sql
   -- Check assignments have curriculum levels
   SELECT curriculum_level, COUNT(*) FROM assignments GROUP BY curriculum_level;

   -- Check vocabulary has curriculum levels
   SELECT curriculum_level, COUNT(*) FROM centralized_vocabulary GROUP BY curriculum_level;

   -- Verify KS4 vocabulary migration
   SELECT curriculum_level, tier, COUNT(*) FROM centralized_vocabulary
   WHERE curriculum_level = 'KS4' GROUP BY curriculum_level, tier;
   ```

3. **Verify Consolidated Assignment Creator**:
   - [ ] `ConsolidatedAssignmentCreator.tsx` exists in `src/components/assignments/`
   - [ ] Consolidated assignment route exists at `/dashboard/assignments/new/consolidated`
   - [ ] Enhanced vocabulary service supports KS4 filtering

### Component Verification
- [ ] `UnifiedAssignmentService.ts` exists in `src/services/`
- [ ] `BaseGameAssignment.tsx` exists in `src/components/games/`
- [ ] Assignment wrappers exist for supported games
- [ ] Assignment routes exist for supported games

## 🎮 Game-by-Game Testing

### 1. Memory Game Assignment Testing

#### Test Assignment Creation
1. Navigate to `/dashboard/assignments/new/enhanced`
2. Create assignment with:
   - Title: "Memory Game Test - KS4"
   - Curriculum Level: KS4
   - Game: Memory Game
   - Category: Animals → Pets
   - Word Count: 20
3. Verify assignment appears in teacher dashboard
4. Check database record has `curriculum_level = 'KS4'`

#### Test Student Experience
1. Navigate to `/student-dashboard/assignments`
2. Verify assignment shows:
   - KS4 curriculum badge
   - Correct word count
   - Memory Game icon
3. Click "Start Assignment"
4. Verify route: `/games/memory-game/assignment/[assignmentId]`
5. Test assignment header shows correctly
6. Complete game and verify progress tracking

### 2. Word Scramble Assignment Testing

#### Test Assignment Creation
1. Create assignment with:
   - Title: "Word Scramble Test - KS3"
   - Curriculum Level: KS3
   - Game: Word Scramble
   - Category: Food & Drink → Meals
   - Word Count: 15
2. Verify assignment creation successful

#### Test Student Experience
1. Access assignment from student dashboard
2. Verify route: `/games/word-scramble/assignment/[assignmentId]`
3. Test vocabulary loading from assignment
4. Complete scramble and verify progress
5. Check assignment completion status

### 3. Hangman Assignment Testing

#### Test Assignment Creation
1. Create assignment with:
   - Title: "Hangman Test - Mixed Levels"
   - Curriculum Level: KS3
   - Game: Hangman
   - Custom vocabulary list
2. Verify custom vocabulary integration

#### Test Student Experience
1. Access assignment: `/games/hangman/assignment/[assignmentId]`
2. Test custom vocabulary loading
3. Verify hangman game mechanics work with assignment
4. Test progress tracking and completion

### 4. Vocab Blast Assignment Testing

#### Test Assignment Creation
1. Create assignment with:
   - Title: "Vocab Blast Test - Advanced"
   - Curriculum Level: KS4
   - Game: Vocab Blast
   - Category: School → Subjects
   - Theme: Space Explorer
2. Verify theme configuration saved

#### Test Student Experience
1. Access assignment: `/games/vocab-blast/assignment/[assignmentId]`
2. Verify theme loads correctly
3. Test vocabulary objects spawn correctly
4. Complete game and verify scoring

### 5. Word Guesser Assignment Testing

#### Test Assignment Creation
1. Create assignment with:
   - Title: "Word Guesser Test - Intermediate"
   - Curriculum Level: KS3
   - Game: Word Guesser
   - Category: Travel → Transportation
   - Max Guesses: 6
2. Verify game settings saved

#### Test Student Experience
1. Access assignment: `/games/word-guesser/assignment/[assignmentId]`
2. Test vocabulary loading
3. Verify guess limit works
4. Test hint system if enabled
5. Complete and verify progress

### 6. Noughts & Crosses Assignment Testing

#### Test Assignment Creation
1. Create assignment with:
   - Title: "Noughts & Crosses Test - KS4"
   - Curriculum Level: KS4
   - Game: Noughts & Crosses
   - Category: Technology → Computers
   - Theme: Tokyo Nights
2. Verify theme and vocabulary saved

#### Test Student Experience
1. Access assignment: `/games/noughts-and-crosses/assignment/[assignmentId]`
2. Test vocabulary integration with game grid
3. Verify theme styling applies
4. Complete games and verify progress

## 📊 System Integration Testing

### Consolidated Assignment Creator Testing
1. **Mode Selection**:
   - [ ] Navigate to `/dashboard/assignments/new/consolidated`
   - [ ] Three modes display correctly (Quick, Standard, Advanced)
   - [ ] Mode selection works and shows appropriate features
   - [ ] Feature comparison table is accurate

2. **Quick Mode Testing**:
   - [ ] Single game selection only
   - [ ] Basic vocabulary configuration
   - [ ] Curriculum level selector (KS3/KS4)
   - [ ] Assignment creation completes in 2-3 minutes

3. **Standard Mode Testing** (Recommended):
   - [ ] Multi-game selection available
   - [ ] Advanced vocabulary options work
   - [ ] KS4 tier selection appears for GCSE level
   - [ ] Vocabulary preview loads correctly
   - [ ] Assignment creation workflow is intuitive

4. **Advanced Mode Testing**:
   - [ ] All Standard mode features plus game settings step
   - [ ] Game customization options available
   - [ ] Time limits and attempt settings work
   - [ ] Feature toggles (hints, power-ups, etc.) function

### Legacy System Compatibility
1. **Standard Assignment Creator** (`/dashboard/assignments/new/page.tsx`):
   - [ ] Still functional for existing workflows
   - [ ] Enhanced with curriculum level support
   - [ ] Vocabulary filtering by curriculum level works

2. **Enhanced Assignment Creator** (`/dashboard/assignments/new/enhanced/page.tsx`):
   - [ ] Maintains existing functionality
   - [ ] Integrates with unified assignment system
   - [ ] KS4 curriculum support active

### Student Dashboard Testing
1. **Assignment Display**:
   - [ ] All assignments show with correct metadata
   - [ ] Curriculum level badges display correctly
   - [ ] Game icons and colors are consistent
   - [ ] Assignment status updates correctly

2. **Assignment Access**:
   - [ ] Assignment routing works for all games
   - [ ] Assignment context preserved in games
   - [ ] Progress tracking works across sessions
   - [ ] Assignment completion updates status

### Database Integration Testing
1. **Data Consistency**:
   ```sql
   -- Test assignment data integrity
   SELECT a.id, a.title, a.curriculum_level, a.game_type 
   FROM assignments a 
   WHERE a.curriculum_level IS NOT NULL;
   
   -- Test vocabulary curriculum alignment
   SELECT cv.curriculum_level, COUNT(*) 
   FROM centralized_vocabulary cv 
   GROUP BY cv.curriculum_level;
   ```

2. **Progress Tracking**:
   ```sql
   -- Verify progress records created
   SELECT * FROM enhanced_assignment_progress 
   WHERE assignment_id = '[test_assignment_id]';
   ```

## 🔧 Error Handling Testing

### Invalid Assignment Data
1. Test assignment with missing vocabulary
2. Test assignment with invalid game type
3. Test assignment with missing curriculum level
4. Verify error messages are user-friendly

### Network Issues
1. Test assignment loading with slow connection
2. Test progress saving with intermittent connection
3. Verify offline behavior and recovery

### Edge Cases
1. Test assignment with 0 vocabulary items
2. Test assignment with 1000+ vocabulary items
3. Test concurrent assignment access
4. Test assignment deletion while student is playing

## 📱 Cross-Platform Testing

### Desktop Browsers
- [ ] Chrome: Assignment creation and completion
- [ ] Firefox: Game assignment functionality
- [ ] Safari: Assignment routing and progress
- [ ] Edge: Complete workflow testing

### Mobile Devices
- [ ] iOS Safari: Touch interactions work
- [ ] Android Chrome: Responsive design
- [ ] Tablet: Assignment interface scaling

## 🎯 Performance Testing

### Load Testing
1. Create 50+ assignments simultaneously
2. Test 30+ students accessing assignments concurrently
3. Measure assignment loading times
4. Test vocabulary loading performance

### Memory Testing
1. Monitor memory usage during long assignment sessions
2. Test for memory leaks in assignment wrappers
3. Verify cleanup on assignment completion

## 📋 Acceptance Criteria

### Functional Requirements
- [ ] All 6 games support assignment mode
- [ ] Curriculum levels (KS3/KS4) work correctly
- [ ] Vocabulary delivery is consistent across games
- [ ] Progress tracking works for all games
- [ ] Assignment completion updates correctly

### User Experience Requirements
- [ ] Assignment creation is intuitive
- [ ] Student assignment access is seamless
- [ ] Game assignment headers are consistent
- [ ] Progress indicators are clear and accurate
- [ ] Error messages are helpful

### Technical Requirements
- [ ] Database migrations applied successfully
- [ ] No console errors during normal operation
- [ ] Assignment routes work correctly
- [ ] API endpoints respond within 2 seconds
- [ ] Memory usage remains stable

## 🚨 Known Issues & Workarounds

### Issue 1: Assignment Progress Table
- **Problem**: Different assignment progress tables exist
- **Workaround**: Using `enhanced_assignment_progress` table
- **Status**: Resolved with conditional migration

### Issue 2: Game-Specific Settings
- **Problem**: Each game has unique configuration needs
- **Workaround**: Using flexible `gameConfig` JSON field
- **Status**: Implemented in assignment wrappers

## 📊 Test Results Template

```markdown
## Test Execution Results

### Date: [DATE]
### Tester: [NAME]
### Environment: [PRODUCTION/STAGING/LOCAL]

#### Game Assignment Tests
- [ ] Memory Game: PASS/FAIL - [Notes]
- [ ] Word Scramble: PASS/FAIL - [Notes]
- [ ] Hangman: PASS/FAIL - [Notes]
- [ ] Vocab Blast: PASS/FAIL - [Notes]
- [ ] Word Guesser: PASS/FAIL - [Notes]
- [ ] Noughts & Crosses: PASS/FAIL - [Notes]

#### System Integration Tests
- [ ] Teacher Dashboard: PASS/FAIL - [Notes]
- [ ] Student Dashboard: PASS/FAIL - [Notes]
- [ ] Database Integration: PASS/FAIL - [Notes]

#### Performance Tests
- [ ] Load Testing: PASS/FAIL - [Notes]
- [ ] Memory Testing: PASS/FAIL - [Notes]

#### Overall Status: PASS/FAIL
#### Critical Issues: [List any blocking issues]
#### Recommendations: [Next steps or improvements needed]
```

## 🎉 Success Criteria

The unified assignment system is considered successfully implemented when:

1. **100% Game Coverage**: All 6 supported games work with assignments
2. **Curriculum Compliance**: KS3/KS4 levels work correctly
3. **User Experience**: Teachers and students can complete full workflows
4. **Data Integrity**: All assignment and progress data saves correctly
5. **Performance**: System handles expected load without issues
6. **Error Handling**: Graceful handling of edge cases and errors

---

**Next Steps After Testing**: Based on test results, prioritize any critical fixes, document known limitations, and plan for additional game integrations or feature enhancements.
