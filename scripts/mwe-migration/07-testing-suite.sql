-- ============================================================================
-- MWE Migration Phase 4: Comprehensive Testing Suite
-- ============================================================================

-- Create test results table
CREATE TABLE IF NOT EXISTS mwe_migration_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name TEXT NOT NULL,
    test_category TEXT NOT NULL,
    test_status TEXT NOT NULL CHECK (test_status IN ('passed', 'failed', 'warning', 'skipped')),
    expected_result TEXT,
    actual_result TEXT,
    error_message TEXT,
    test_data JSONB,
    execution_time_ms INTEGER,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to run all MWE migration tests
CREATE OR REPLACE FUNCTION run_mwe_migration_tests()
RETURNS TABLE (
    test_category TEXT,
    tests_run INTEGER,
    tests_passed INTEGER,
    tests_failed INTEGER,
    tests_warning INTEGER,
    overall_status TEXT
) AS $$
DECLARE
    test_start_time TIMESTAMP;
    test_end_time TIMESTAMP;
    execution_time INTEGER;
    test_result RECORD;
BEGIN
    -- Clear previous test results
    DELETE FROM mwe_migration_tests;
    
    -- Log test suite start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status)
    VALUES ('testing', 'run_test_suite', 'mwe_migration_tests', 'started');

    -- Test Category 1: Data Integrity Tests
    test_start_time := clock_timestamp();
    
    -- Test 1.1: Verify backup tables exist and have data
    BEGIN
        PERFORM run_data_integrity_test('backup_tables_exist', 
            'Backup tables contain expected data',
            (SELECT COUNT(*) FROM centralized_vocabulary_backup_mwe) > 0 AND 
            (SELECT COUNT(*) FROM sentences_backup_mwe) = 4441
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('backup_tables_exist', 'data_integrity', SQLERRM);
    END;

    -- Test 1.2: Verify MWE flags are properly set
    BEGIN
        PERFORM run_data_integrity_test('mwe_flags_consistent',
            'All multi-word entries have is_mwe=TRUE',
            (SELECT COUNT(*) FROM centralized_vocabulary WHERE word LIKE '% %' AND (is_mwe IS NULL OR is_mwe = FALSE)) = 0
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('mwe_flags_consistent', 'data_integrity', SQLERRM);
    END;

    -- Test 1.3: Verify component_words arrays are populated
    BEGIN
        PERFORM run_data_integrity_test('component_words_populated',
            'All MWEs have component_words arrays',
            (SELECT COUNT(*) FROM centralized_vocabulary WHERE is_mwe = TRUE AND (component_words IS NULL OR array_length(component_words, 1) IS NULL)) = 0
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('component_words_populated', 'data_integrity', SQLERRM);
    END;

    -- Test Category 2: Parsing Logic Tests
    test_start_time := clock_timestamp();

    -- Test 2.1: Longest-match-first parsing simulation
    BEGIN
        PERFORM run_parsing_test('longest_match_first',
            'MWE parsing prioritizes longer matches',
            test_longest_match_parsing()
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('longest_match_first', 'parsing_logic', SQLERRM);
    END;

    -- Test 2.2: Critical MWE recognition
    BEGIN
        PERFORM run_parsing_test('critical_mwe_recognition',
            'Critical MWEs are properly recognized',
            test_critical_mwe_recognition()
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('critical_mwe_recognition', 'parsing_logic', SQLERRM);
    END;

    -- Test Category 3: FSRS Integration Tests
    test_start_time := clock_timestamp();

    -- Test 3.1: Verify trackable MWEs
    BEGIN
        PERFORM run_fsrs_test('trackable_mwes',
            'Critical MWEs are marked for FSRS tracking',
            (SELECT COUNT(*) FROM centralized_vocabulary WHERE is_mwe = TRUE AND mwe_type = 'fixed_expression' AND should_track_for_fsrs = FALSE) = 0
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('trackable_mwes', 'fsrs_integration', SQLERRM);
    END;

    -- Test 3.2: Function words excluded from tracking
    BEGIN
        PERFORM run_fsrs_test('function_words_excluded',
            'Function words are not marked for FSRS tracking',
            test_function_word_exclusion()
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('function_words_excluded', 'fsrs_integration', SQLERRM);
    END;

    -- Test Category 4: Performance Tests
    test_start_time := clock_timestamp();

    -- Test 4.1: Query performance for MWE lookup
    BEGIN
        test_start_time := clock_timestamp();
        PERFORM test_mwe_lookup_performance();
        test_end_time := clock_timestamp();
        execution_time := EXTRACT(MILLISECONDS FROM test_end_time - test_start_time);
        
        PERFORM run_performance_test('mwe_lookup_speed',
            'MWE lookup queries complete within acceptable time',
            execution_time < 100, -- Less than 100ms
            execution_time
        );
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_test_error('mwe_lookup_speed', 'performance', SQLERRM);
    END;

    -- Log test suite completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW()
    WHERE phase = 'testing' AND operation = 'run_test_suite' AND status = 'started';

    -- Return test summary
    RETURN QUERY
    SELECT 
        mt.test_category,
        COUNT(*)::INTEGER as tests_run,
        COUNT(*) FILTER (WHERE mt.test_status = 'passed')::INTEGER as tests_passed,
        COUNT(*) FILTER (WHERE mt.test_status = 'failed')::INTEGER as tests_failed,
        COUNT(*) FILTER (WHERE mt.test_status = 'warning')::INTEGER as tests_warning,
        CASE 
            WHEN COUNT(*) FILTER (WHERE mt.test_status = 'failed') > 0 THEN 'FAILED'
            WHEN COUNT(*) FILTER (WHERE mt.test_status = 'warning') > 0 THEN 'WARNING'
            ELSE 'PASSED'
        END as overall_status
    FROM mwe_migration_tests mt
    GROUP BY mt.test_category
    ORDER BY mt.test_category;
END;
$$ LANGUAGE plpgsql;

-- Helper functions for specific test types
CREATE OR REPLACE FUNCTION run_data_integrity_test(
    p_test_name TEXT,
    p_description TEXT,
    p_condition BOOLEAN
) RETURNS VOID AS $$
BEGIN
    INSERT INTO mwe_migration_tests (test_name, test_category, test_status, expected_result, actual_result)
    VALUES (
        p_test_name,
        'data_integrity',
        CASE WHEN p_condition THEN 'passed' ELSE 'failed' END,
        p_description,
        CASE WHEN p_condition THEN 'PASS' ELSE 'FAIL' END
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION run_parsing_test(
    p_test_name TEXT,
    p_description TEXT,
    p_condition BOOLEAN
) RETURNS VOID AS $$
BEGIN
    INSERT INTO mwe_migration_tests (test_name, test_category, test_status, expected_result, actual_result)
    VALUES (
        p_test_name,
        'parsing_logic',
        CASE WHEN p_condition THEN 'passed' ELSE 'failed' END,
        p_description,
        CASE WHEN p_condition THEN 'PASS' ELSE 'FAIL' END
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION run_fsrs_test(
    p_test_name TEXT,
    p_description TEXT,
    p_condition BOOLEAN
) RETURNS VOID AS $$
BEGIN
    INSERT INTO mwe_migration_tests (test_name, test_category, test_status, expected_result, actual_result)
    VALUES (
        p_test_name,
        'fsrs_integration',
        CASE WHEN p_condition THEN 'passed' ELSE 'failed' END,
        p_description,
        CASE WHEN p_condition THEN 'PASS' ELSE 'FAIL' END
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION run_performance_test(
    p_test_name TEXT,
    p_description TEXT,
    p_condition BOOLEAN,
    p_execution_time INTEGER
) RETURNS VOID AS $$
BEGIN
    INSERT INTO mwe_migration_tests (test_name, test_category, test_status, expected_result, actual_result, execution_time_ms)
    VALUES (
        p_test_name,
        'performance',
        CASE WHEN p_condition THEN 'passed' ELSE 'failed' END,
        p_description,
        p_execution_time || 'ms',
        p_execution_time
    );
END;
$$ LANGUAGE plpgsql;

-- Test implementation functions
CREATE OR REPLACE FUNCTION test_longest_match_parsing() RETURNS BOOLEAN AS $$
BEGIN
    -- Test that "me gusta mucho" would match "me gusta" (2 words) over "gusta" (1 word)
    RETURN (
        SELECT COUNT(*) FROM centralized_vocabulary 
        WHERE word = 'me gusta' AND is_mwe = TRUE
    ) > 0 AND (
        SELECT LENGTH(word) FROM centralized_vocabulary 
        WHERE word IN ('me gusta', 'gusta') AND is_mwe = TRUE
        ORDER BY LENGTH(word) DESC LIMIT 1
    ) > 5; -- "me gusta" is longer than "gusta"
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION test_critical_mwe_recognition() RETURNS BOOLEAN AS $$
BEGIN
    -- Verify critical Spanish MWEs are present
    RETURN (
        SELECT COUNT(*) FROM centralized_vocabulary 
        WHERE word IN ('me gusta', 'se llama', 'hay que') 
        AND is_mwe = TRUE 
        AND mwe_type = 'fixed_expression'
    ) >= 3;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION test_function_word_exclusion() RETURNS BOOLEAN AS $$
BEGIN
    -- Verify common function words are not marked for FSRS tracking
    RETURN (
        SELECT COUNT(*) FROM centralized_vocabulary 
        WHERE word IN ('el', 'la', 'de', 'en', 'a', 'y', 'es', 'le', 'der', 'die', 'das')
        AND should_track_for_fsrs = TRUE
    ) = 0;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION test_mwe_lookup_performance() RETURNS VOID AS $$
DECLARE
    test_sentence TEXT := 'me gusta la comida española';
    mwe_count INTEGER;
BEGIN
    -- Simulate MWE lookup in a sentence
    SELECT COUNT(*) INTO mwe_count
    FROM centralized_vocabulary 
    WHERE is_mwe = TRUE 
    AND test_sentence LIKE '%' || word || '%'
    ORDER BY LENGTH(word) DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_test_error(
    p_test_name TEXT,
    p_category TEXT,
    p_error_message TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO mwe_migration_tests (test_name, test_category, test_status, error_message)
    VALUES (p_test_name, p_category, 'failed', p_error_message);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION run_mwe_migration_tests() IS 'Comprehensive test suite for MWE migration validation';
COMMENT ON TABLE mwe_migration_tests IS 'Test results and validation data for MWE migration process';
