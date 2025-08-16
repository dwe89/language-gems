# MWE Migration Execution Guide

## Overview
This guide provides step-by-step instructions for safely executing the Multi-Word Expression (MWE) migration to enhance vocabulary tracking in LanguageGems sentence-building games.

## Pre-Execution Checklist

### 1. Environment Preparation
- [ ] Verify database backup capabilities
- [ ] Ensure sufficient disk space for backup tables
- [ ] Confirm Supabase connection stability
- [ ] Test rollback procedures in development environment

### 2. Safety Measures
- [ ] Create emergency rollback point
- [ ] Notify team of maintenance window
- [ ] Prepare monitoring dashboard
- [ ] Have rollback team on standby

## Execution Steps

### Phase 1: Data Safety and Analysis (30-45 minutes)

#### Step 1.1: Create Backups
```sql
-- Execute backup strategy
\i scripts/mwe-migration/01-backup-strategy.sql

-- Verify backups
SELECT COUNT(*) FROM centralized_vocabulary_backup_mwe;
SELECT COUNT(*) FROM sentences_backup_mwe;
```

#### Step 1.2: Run Analysis
```sql
-- Execute analysis scripts
\i scripts/mwe-migration/02-analysis-script.sql
\i scripts/mwe-migration/03-cross-reference-analysis.sql

-- Run analysis functions
SELECT * FROM extract_potential_mwes();
SELECT * FROM analyze_vocabulary_coverage();

-- Review analysis results
SELECT * FROM mwe_analysis_summary;
SELECT * FROM high_priority_missing_mwes LIMIT 20;
```

**Expected Results:**
- ~200-400 potential MWEs identified across 3 languages
- 60-80% vocabulary coverage from sentences
- 50-100 high-priority MWEs missing from centralized_vocabulary

### Phase 2: Gap Identification and Prioritization (20-30 minutes)

#### Step 2.1: Schema Enhancement
```sql
-- Add MWE columns and classification
\i scripts/mwe-migration/04-schema-enhancement.sql

-- Populate classifications
SELECT populate_mwe_classifications();

-- Review classifications
SELECT * FROM critical_mwes_to_add;
SELECT * FROM high_priority_mwes_to_add LIMIT 10;
```

#### Step 2.2: Translation Preparation
```sql
-- Setup translation mappings
\i scripts/mwe-migration/05-translation-strategy.sql

-- Derive additional translations
SELECT derive_translations_from_context();

-- Review translation quality
SELECT * FROM translation_review_queue LIMIT 10;
SELECT * FROM validate_translation_quality();
```

**Expected Results:**
- 30-50 critical MWEs identified for immediate addition
- 80-90% of critical MWEs have high-confidence translations
- Translation review queue contains 10-20 items needing manual review

### Phase 3: Database Migration (15-25 minutes)

#### Step 3.1: Safe Insertion
```sql
-- Execute safe insertion process
\i scripts/mwe-migration/06-safe-insertion.sql

-- Insert critical MWEs first
SELECT * FROM insert_mwes_to_vocabulary(50, 'critical');

-- Insert high-priority MWEs
SELECT * FROM insert_mwes_to_vocabulary(100, 'high');

-- Update existing entries
SELECT update_existing_mwe_flags();

-- Validate insertions
SELECT * FROM validate_inserted_mwes();
```

**Expected Results:**
- 30-50 critical MWEs successfully inserted
- 80-150 high-priority MWEs successfully inserted
- All validation checks pass
- No duplicate entries created

### Phase 4: Testing and Validation (20-30 minutes)

#### Step 4.1: Comprehensive Testing
```sql
-- Execute test suite
\i scripts/mwe-migration/07-testing-suite.sql
\i scripts/mwe-migration/08-rollback-procedures.sql

-- Run all tests
SELECT * FROM run_mwe_migration_tests();

-- Review test results
SELECT test_category, tests_passed, tests_failed, overall_status 
FROM run_mwe_migration_tests();
```

**Expected Results:**
- All data integrity tests pass
- Parsing logic tests pass
- FSRS integration tests pass
- Performance tests complete within acceptable limits

#### Step 4.2: Application Testing
```sql
-- Test sentence parsing with new MWEs
SELECT word, translation, is_mwe, mwe_type 
FROM centralized_vocabulary 
WHERE word IN ('me gusta', 'se llama', 'hay que', 'il y a', 'es gibt')
AND is_mwe = TRUE;

-- Verify FSRS tracking flags
SELECT COUNT(*) as trackable_mwes 
FROM centralized_vocabulary 
WHERE is_mwe = TRUE AND should_track_for_fsrs = TRUE;
```

## Post-Migration Verification

### 1. Data Integrity Checks
```sql
-- Verify MWE insertion summary
SELECT * FROM mwe_insertion_summary;

-- Check insertion progress
SELECT * FROM mwe_insertion_progress;

-- Validate no data corruption
SELECT COUNT(*) as total_vocab FROM centralized_vocabulary;
SELECT COUNT(*) as mwe_vocab FROM centralized_vocabulary WHERE is_mwe = TRUE;
```

### 2. Application Integration Testing
- [ ] Test Sentence Sprint game with MWE tracking
- [ ] Verify FSRS integration works with MWEs
- [ ] Check gem progression for MWE learning
- [ ] Validate VocabularyTrackingService recognizes MWEs

### 3. Performance Monitoring
- [ ] Monitor database query performance
- [ ] Check sentence parsing speed
- [ ] Verify memory usage remains stable
- [ ] Test concurrent user load

## Rollback Procedures

### Emergency Rollback (if critical issues found)
```sql
-- Create emergency rollback point (before migration)
SELECT create_emergency_rollback_point();

-- If rollback needed:
SELECT * FROM rollback_mwe_migration('full', TRUE);

-- Verify rollback
SELECT COUNT(*) FROM centralized_vocabulary;
SELECT COUNT(*) FROM centralized_vocabulary WHERE is_mwe = TRUE;
```

### Partial Rollback Options
```sql
-- Rollback only new entries (keep schema changes)
SELECT * FROM rollback_mwe_migration('new_entries_only', TRUE);

-- Rollback only schema changes (keep data)
SELECT * FROM rollback_mwe_migration('schema_only', TRUE);
```

## Success Criteria

### Technical Success
- [ ] All MWE entries successfully inserted
- [ ] No data corruption or loss
- [ ] All tests pass
- [ ] Performance within acceptable limits

### Functional Success
- [ ] Sentence parsing correctly identifies MWEs
- [ ] FSRS tracking works for MWEs
- [ ] Gem progression functions properly
- [ ] No regression in existing functionality

### Business Success
- [ ] Improved vocabulary tracking accuracy
- [ ] Better spaced repetition for complex expressions
- [ ] Enhanced learning analytics for MWEs
- [ ] Positive impact on student learning outcomes

## Monitoring and Maintenance

### Ongoing Monitoring
```sql
-- Weekly MWE usage analysis
SELECT language, COUNT(*) as mwe_count, AVG(frequency_rank) as avg_frequency
FROM centralized_vocabulary 
WHERE is_mwe = TRUE 
GROUP BY language;

-- Monthly translation quality review
SELECT * FROM translation_review_queue 
WHERE translation_confidence IN ('needs_review', 'low');
```

### Future Enhancements
1. **Automated MWE Discovery**: Implement ML-based MWE detection
2. **Dynamic Translation Updates**: Crowd-sourced translation improvements
3. **Advanced Parsing**: Context-aware MWE recognition
4. **Performance Optimization**: Indexing and caching strategies

## Troubleshooting

### Common Issues and Solutions

#### Issue: High memory usage during migration
**Solution**: Process in smaller batches, increase batch processing delays

#### Issue: Translation quality concerns
**Solution**: Use manual review queue, implement translation validation

#### Issue: Performance degradation
**Solution**: Add database indexes, optimize query patterns

#### Issue: FSRS integration problems
**Solution**: Verify vocabulary ID consistency, check tracking flags

## Contact Information

**Migration Team:**
- Database Administrator: [Contact]
- Application Developer: [Contact]
- QA Engineer: [Contact]
- Product Manager: [Contact]

**Emergency Contacts:**
- On-call Engineer: [Contact]
- Database Emergency: [Contact]
- System Administrator: [Contact]
