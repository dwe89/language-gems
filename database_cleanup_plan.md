# 🗄️ DATABASE CLEANUP PLAN

## 📊 CURRENT TABLE ANALYSIS

### ✅ TABLES TO KEEP (ACTIVELY USED)

#### **Core Vocabulary Data**
- `centralized_vocabulary` - Main vocabulary source for all games
- `vocabulary_lists` - Vocabulary list management
- `vocabulary_themes` - Theme categorization
- `vocabulary_topics` - Topic categorization

#### **Progress Tracking (ACTIVE)**
- `vocabulary_gem_collection` - **PRIMARY** for Vocabulary Mining (spaced repetition, gems)
- `user_vocabulary_progress` - Used by VocabMaster (simple progress tracking)

#### **User Management**
- `auth.users` - Supabase auth users
- `user_profiles` - Extended user information
- `classes` - Class management
- `assignments` - Assignment system

### ❌ TABLES TO DELETE (OBSOLETE/DUPLICATE)

#### **Duplicate Progress Tables**
- `student_vocabulary_practice` - **DUPLICATE** of vocabulary_gem_collection
- `student_vocabulary_progress` - **DUPLICATE** of user_vocabulary_progress
- `vocabulary_items` - **OLD** vocabulary table (replaced by centralized_vocabulary)

#### **Unused Assignment Tables**
- `student_vocabulary_assignment_progress` - Not used in current system
- `assignment_game_sessions` - Replaced by enhanced_game_sessions

#### **Old Migration Tables**
- `vocabulary_topic_performance` - Not actively used
- `vocabulary_mining_sessions` - Redundant with enhanced_game_sessions

## 🔧 CLEANUP STEPS

### Step 1: Backup Data
```sql
-- Backup any important data from tables to be deleted
CREATE TABLE backup_student_vocabulary_practice AS SELECT * FROM student_vocabulary_practice;
CREATE TABLE backup_student_vocabulary_progress AS SELECT * FROM student_vocabulary_progress;
CREATE TABLE backup_vocabulary_items AS SELECT * FROM vocabulary_items;
```

### Step 2: Migrate Essential Data
```sql
-- Migrate any missing data from old tables to new tables
-- (Check if any data in old tables is not in new tables)

-- Example: Migrate student_vocabulary_practice to vocabulary_gem_collection
INSERT INTO vocabulary_gem_collection (
    student_id, vocabulary_item_id, total_encounters, correct_encounters,
    incorrect_encounters, mastery_level, created_at, updated_at
)
SELECT 
    student_id, vocabulary_id::text, total_attempts, correct_attempts,
    (total_attempts - correct_attempts), mastery_level, first_practiced_at, last_practiced_at
FROM student_vocabulary_practice 
WHERE NOT EXISTS (
    SELECT 1 FROM vocabulary_gem_collection vgc 
    WHERE vgc.student_id = student_vocabulary_practice.student_id 
    AND vgc.vocabulary_item_id = student_vocabulary_practice.vocabulary_id::text
);
```

### Step 3: Drop Obsolete Tables
```sql
-- Drop duplicate/obsolete tables
DROP TABLE IF EXISTS student_vocabulary_practice CASCADE;
DROP TABLE IF EXISTS student_vocabulary_progress CASCADE;
DROP TABLE IF EXISTS vocabulary_items CASCADE;
DROP TABLE IF EXISTS student_vocabulary_assignment_progress CASCADE;
DROP TABLE IF EXISTS assignment_game_sessions CASCADE;
DROP TABLE IF EXISTS vocabulary_topic_performance CASCADE;
DROP TABLE IF EXISTS vocabulary_mining_sessions CASCADE;
```

### Step 4: Clean Up Functions
```sql
-- Drop functions that reference deleted tables
DROP FUNCTION IF EXISTS track_vocabulary_practice CASCADE;
DROP FUNCTION IF EXISTS update_student_vocabulary_progress CASCADE;
```

## 🎯 FINAL SIMPLIFIED SCHEMA

### **Vocabulary Data**
- `centralized_vocabulary` - All vocabulary words
- `vocabulary_lists` - List management
- `vocabulary_themes` - Themes
- `vocabulary_topics` - Topics

### **Progress Tracking**
- `vocabulary_gem_collection` - Vocabulary Mining progress (spaced repetition)
- `user_vocabulary_progress` - VocabMaster progress (simple tracking)

### **Game Sessions**
- `enhanced_game_sessions` - All game session data

### **User & Assignment Management**
- `auth.users` - Users
- `user_profiles` - User profiles
- `classes` - Classes
- `assignments` - Assignments
- `assignment_progress` - Assignment progress

## 🚨 VERIFICATION CHECKLIST

Before cleanup:
- [ ] Verify no active code references deleted tables
- [ ] Backup all data from tables to be deleted
- [ ] Test that Vocabulary Mining still works with vocabulary_gem_collection
- [ ] Test that VocabMaster still works with user_vocabulary_progress
- [ ] Verify all games can load vocabulary from centralized_vocabulary

After cleanup:
- [ ] Run all games to ensure they work
- [ ] Check that progress is being saved correctly
- [ ] Verify no database errors in logs
- [ ] Confirm user stats load correctly

## 📝 CURRENT USAGE SUMMARY

**Vocabulary Mining Game uses:**
- `vocabulary_gem_collection` (progress tracking)
- `centralized_vocabulary` (vocabulary data)

**VocabMaster Game uses:**
- `user_vocabulary_progress` (progress tracking)
- `centralized_vocabulary` (vocabulary data)

**All other games use:**
- `centralized_vocabulary` (vocabulary data)
- `enhanced_game_sessions` (session tracking)
