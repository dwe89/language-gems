# Dashboard Issues Analysis & Recommendations

Date: January 7, 2026  
Class: 9R/Sp1 (ID: be8ed3df-edfc-48c9-8956-6adc2ac1e39b)  
35 students total

---

## 🔴 Critical Issues Found

### 1. **Missing Numbers in Overview Cards**

**Symptoms:**
- "Learning Words" shows "In progress" but no number
- "Proficient Words" shows "Class total" but no number

**Root Cause:**
The `calculateClassStats` method in `teacherVocabularyAnalytics.ts` (lines 571-629) is returning old field names that don't match the TypeScript interface.

**Current Code Returns:**
```typescript
{
  averageMasteredWords: 0,
  classAverageMemoryStrength: 0
}
```

**Interface Expects:**
```typescript
{
  proficientWords: number,
  learningWords: number,
  strugglingWords: number
}
```

**Fix Required:**
Update `calculateClassStats` to calculate and return the correct fields based on student word proficiency levels.

---

### 2. **Students Showing 0 Words Despite Activity**

**Affected Students:**
- **Sofia Welch**: 0 words, but last active 11/27/2025
- **Lukass Totoris**: 0 words, but last active 11/27/2025  
- **Lucy Evans**: 0 words, last active 10/23/2025

**Analysis:**
The vocabulary analytics service is now fetching from both:
- `vocabulary_gem_collection` (free-play games)
- `assignment_vocabulary_progress` (assignments)

**Service Stats:**
- 27 students have gem collection data (515 records)
- 31 students have assignment vocab data (1,018 records)

**Issue:**
These students likely completed assignments, but assignment vocabulary tracking may have:
1. NULL values in `seen_count`/`correct_count` fields
2. Records created but not populated during assignment completion
3. Assignment completion logic not properly writing vocabulary progress

**Verification Needed:**
Check database for these students in `assignment_vocabulary_progress`:
```sql
SELECT student_id, assignment_id, vocab_id, seen_count, correct_count, last_seen_at
FROM assignment_vocabulary_progress
WHERE student_id IN (
  '286f5154-c394-4de4-b8c4-343514dfe726', -- Sofia Welch
  '80f51d54-de7e-44d9-abf4-490ff9aa1f5c', -- Lukass Totoris
  'f243e6b9-e920-4ec1-af3c-0689765721dd'  -- Lucy Evans
);
```

---

### 3. **Lexie Evans Data Anomaly**

**Current Data:**
- Total Words: **0**
- Average Accuracy: **91.3%**
- Overdue Words: **10**
- Struggling Words: **1**

**Problem:**
This is mathematically impossible. You can't have:
- Accuracy without words
- Overdue words without total words
- Struggling words without total words

**Root Cause:**
The service is calculating accuracy from gem collection/assignment vocab, but counting unique words from a different source (possibly `vocabulary_item_id` isn't matching properly between tables).

**Code Location:**
`teacherVocabularyAnalytics.ts`, lines 418-493 (student processing loop)

---

### 4. **Progress Dashboard Showing All Critical**

**Symptoms:**
Multiple students showing:
- Avg Score: 0%
- Low accuracy (0%)
- Low engagement (0 activities)
- All marked as "critical"

**Probable Causes:**
1. **Time Range Filter**: Progress dashboard may be using a different date range than vocabulary dashboard
2. **Activity Definition**: May only count certain activity types, missing assignments
3. **Data Source Mismatch**: Different API endpoint/service than vocabulary tab

**Investigation Needed:**
- Check `/api/dashboard/progress` endpoint code
- Compare query logic with class summary and vocabulary analytics
- Verify date range handling

---

### 5. **Asher Bannatyne Inconsistency**

**Word Analysis Tab:**
- Shows 6 strong words
- Shows 1 weak word
- Lists specific words with accuracy percentages

**Students Tab:**
- Words don't load

**Possible Causes:**
1. Different component rendering logic
2. Student-specific word details not fetching correctly
3. `studentWordDetails` vs `detailedWords` data structure mismatch

**Code Locations:**
- Word Analysis: Uses `analytics.detailedWords`
- Students Tab: Uses `analytics.studentWordDetails`

---

## 📊 Data Integrity Issues

### Vocabulary Tracking Gaps

**Students with NO vocabulary data** (despite activity):
1. Sofia Welch (last active 41 days ago)
2. Lukass Totoris (last active 41 days ago)
3. Lucy Evans (last active 41 days ago)

**Likely Scenario:**
- Students completed assignments in October/November 2025
- Assignment submission recorded in `enhanced_assignment_progress`
- But `assignment_vocabulary_progress` either:
  - Not created
  - Created with NULL values
  - Created but analytics query filtering them out

---

## 🎯 Recommendations

### Immediate Actions (Critical)

1. **Fix Missing Overview Numbers** ✅ HIGH PRIORITY
   - Update `calculateClassStats` to return `proficientWords`, `learningWords`, `strugglingWords`
   - Calculate based on student word proficiency levels (struggling, learning, proficient)
   - File: `src/services/teacherVocabularyAnalytics.ts` lines 571-629

2. **Fix Lexie Evans Anomaly** ✅ HIGH PRIORITY
   - Debug word counting logic in student processing loop
   - Ensure `uniqueVocabIds` Set properly merges both data sources
   - Verify `vocab_id` vs `vocabulary_id` field mapping
   - File: `src/services/teacherVocabularyAnalytics.ts` lines 418-493

3. **Investigate Progress Dashboard** ✅ HIGH PRIORITY
   - Compare with class summary API logic
   - Verify time range handling
   - Check activity definition includes all types

### Short-term Actions

4. **Database Audit for Missing Vocabulary**
   - Run queries to find students with assignment progress but no vocabulary records
   - Check for NULL values in `seen_count`/`correct_count`
   - Identify if this is historical or ongoing

5. **Fix Asher Bannatyne Inconsistency**
   - Debug student word details loading
   - Compare data structures between word analysis and students tab
   - Ensure both use same data source

6. **Add Data Validation**
   - Add checks for impossible data combinations (0 words + accuracy)
   - Log warnings when data anomalies detected
   - Add null checks before calculations

### Long-term Improvements

7. **Dashboard Redesign Considerations**

**Current Pain Points:**
- Multiple views showing different "truth" (word analysis vs students tab)
- Time range not visible to users (causes confusion)
- Missing data presented as zeros (hard to distinguish from truly zero)
- Complex navigation between tabs

**Suggested Improvements:**
- **Unified Data Display**: Show same data across all tabs
- **Clear Empty States**: "No data yet" instead of "0" when truly no activity
- **Visible Date Range**: Always show what date range is being analyzed
- **Loading Skeletons**: Show which data is loading vs missing
- **Data Source Indicators**: Badge showing "from games" vs "from assignments"

**Example Empty State:**
```
Sofia Welch
📊 No vocabulary data yet
Last seen: Nov 27, 2025 (41 days ago)
✅ Completed 2 assignments
```

Instead of:
```
Sofia Welch
0 strong words
0 weak words
```

8. **Data Quality Monitoring**
   - Add background job to find data inconsistencies
   - Alert when impossible data combinations detected
   - Weekly report of students with activity but no vocabulary

---

## 🔧 Technical Debt

### Type System Mismatches
- `ClassVocabularyStats` interface updated but implementation not
- Multiple services using different field names
- Need to standardize across codebase

### Code Duplication
- Word proficiency logic duplicated across services
- Date range handling inconsistent
- Multiple ways to check "has activity"

### Testing Gaps
- No unit tests for data calculations
- No integration tests for multi-table queries
- No data validation tests

---

## 📝 Summary

**Is the data real?**
- Mix of real and missing data
- Some students have real activity but incomplete tracking
- Service is correctly reading from both tables now
- Calculation bugs causing display issues

**Does the dashboard need redesign?**
- **Current functionality**: Core data display works, but confusing presentation
- **Primary issue**: Data quality problems, not design problems
- **Recommendation**: Fix data issues first, then evaluate UX

**Priority Order:**
1. Fix missing numbers (TypeScript interface mismatch)
2. Fix Lexie Evans impossible data (calculation bug)
3. Investigate progress dashboard (different logic)
4. Audit missing vocabulary data (database issue)
5. Consider UX improvements (after data is reliable)

---

## Next Steps

1. **Immediate**: Run database queries to verify student data
2. **Today**: Fix `calculateClassStats` method
3. **This week**: Debug student processing loop
4. **This month**: Implement data validation and monitoring

Would you like me to:
- Fix the `calculateClassStats` method now?
- Run database queries to check student vocabulary data?
- Compare progress dashboard with vocabulary analytics logic?
- Prototype improved empty states/data display?
