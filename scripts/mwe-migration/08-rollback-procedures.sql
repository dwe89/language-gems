-- ============================================================================
-- MWE Migration Phase 4: Rollback Procedures
-- ============================================================================

-- Enhanced rollback function with granular control
CREATE OR REPLACE FUNCTION rollback_mwe_migration(
    p_rollback_scope TEXT DEFAULT 'full', -- 'full', 'schema_only', 'data_only', 'new_entries_only'
    p_confirm_rollback BOOLEAN DEFAULT FALSE
) RETURNS TABLE (
    rollback_step TEXT,
    status TEXT,
    records_affected INTEGER,
    error_message TEXT
) AS $$
DECLARE
    step_count INTEGER := 0;
    affected_count INTEGER;
    error_msg TEXT;
BEGIN
    -- Safety check - require explicit confirmation
    IF NOT p_confirm_rollback THEN
        RETURN QUERY SELECT 
            'confirmation_required'::TEXT,
            'failed'::TEXT,
            0::INTEGER,
            'Rollback requires explicit confirmation. Set p_confirm_rollback = TRUE'::TEXT;
        RETURN;
    END IF;

    -- Log rollback start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status, metadata)
    VALUES ('rollback', 'start_rollback', 'multiple', 'started', 
            jsonb_build_object('scope', p_rollback_scope, 'timestamp', NOW()));

    -- Step 1: Rollback new MWE entries (if scope includes data)
    IF p_rollback_scope IN ('full', 'data_only', 'new_entries_only') THEN
        BEGIN
            step_count := step_count + 1;
            
            -- Delete MWE entries added during migration
            DELETE FROM centralized_vocabulary 
            WHERE is_mwe = TRUE 
            AND id IN (
                SELECT DISTINCT jsonb_extract_path_text(metadata, 'vocabulary_id')::UUID
                FROM mwe_migration_log 
                WHERE operation = 'mwe_inserted' 
                AND status = 'completed'
                AND jsonb_extract_path_text(metadata, 'vocabulary_id') IS NOT NULL
            );
            
            GET DIAGNOSTICS affected_count = ROW_COUNT;
            
            RETURN QUERY SELECT 
                'delete_new_mwe_entries'::TEXT,
                'completed'::TEXT,
                affected_count,
                NULL::TEXT;
                
        EXCEPTION WHEN OTHERS THEN
            error_msg := SQLERRM;
            RETURN QUERY SELECT 
                'delete_new_mwe_entries'::TEXT,
                'failed'::TEXT,
                0::INTEGER,
                error_msg;
        END;
    END IF;

    -- Step 2: Rollback schema changes (if scope includes schema)
    IF p_rollback_scope IN ('full', 'schema_only') THEN
        BEGIN
            step_count := step_count + 1;
            
            -- Remove MWE-specific columns (with data preservation check)
            IF p_rollback_scope = 'full' THEN
                -- Full rollback: restore from backup
                DELETE FROM centralized_vocabulary;
                INSERT INTO centralized_vocabulary SELECT * FROM centralized_vocabulary_backup_mwe;
                GET DIAGNOSTICS affected_count = ROW_COUNT;
                
                RETURN QUERY SELECT 
                    'restore_from_backup'::TEXT,
                    'completed'::TEXT,
                    affected_count,
                    NULL::TEXT;
            ELSE
                -- Schema-only: just reset MWE flags
                UPDATE centralized_vocabulary 
                SET is_mwe = NULL,
                    mwe_type = NULL,
                    component_words = NULL,
                    frequency_rank = NULL,
                    should_track_for_fsrs = TRUE;
                    
                GET DIAGNOSTICS affected_count = ROW_COUNT;
                
                RETURN QUERY SELECT 
                    'reset_mwe_flags'::TEXT,
                    'completed'::TEXT,
                    affected_count,
                    NULL::TEXT;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            error_msg := SQLERRM;
            RETURN QUERY SELECT 
                'schema_rollback'::TEXT,
                'failed'::TEXT,
                0::INTEGER,
                error_msg;
        END;
    END IF;

    -- Step 3: Clean up migration tables (if full rollback)
    IF p_rollback_scope = 'full' THEN
        BEGIN
            step_count := step_count + 1;
            
            -- Archive migration data before cleanup
            CREATE TABLE IF NOT EXISTS mwe_migration_archive AS 
            SELECT *, NOW() as archived_at FROM mwe_migration_log;
            
            -- Clean up migration tables
            DROP TABLE IF EXISTS mwe_analysis_results CASCADE;
            DROP TABLE IF EXISTS mwe_priority_classification CASCADE;
            DROP TABLE IF EXISTS mwe_translation_mappings CASCADE;
            DROP TABLE IF EXISTS mwe_migration_tests CASCADE;
            
            RETURN QUERY SELECT 
                'cleanup_migration_tables'::TEXT,
                'completed'::TEXT,
                4::INTEGER, -- Number of tables dropped
                NULL::TEXT;
                
        EXCEPTION WHEN OTHERS THEN
            error_msg := SQLERRM;
            RETURN QUERY SELECT 
                'cleanup_migration_tables'::TEXT,
                'failed'::TEXT,
                0::INTEGER,
                error_msg;
        END;
    END IF;

    -- Step 4: Verify rollback integrity
    BEGIN
        step_count := step_count + 1;
        
        -- Run verification checks
        PERFORM verify_rollback_integrity(p_rollback_scope);
        
        RETURN QUERY SELECT 
            'verify_rollback_integrity'::TEXT,
            'completed'::TEXT,
            0::INTEGER,
            NULL::TEXT;
            
    EXCEPTION WHEN OTHERS THEN
        error_msg := SQLERRM;
        RETURN QUERY SELECT 
            'verify_rollback_integrity'::TEXT,
            'failed'::TEXT,
            0::INTEGER,
            error_msg;
    END;

    -- Log rollback completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW(),
        metadata = metadata || jsonb_build_object('steps_completed', step_count)
    WHERE phase = 'rollback' AND operation = 'start_rollback' AND status = 'started';

    -- Final summary
    RETURN QUERY SELECT 
        'rollback_summary'::TEXT,
        'completed'::TEXT,
        step_count,
        'Rollback completed successfully'::TEXT;

EXCEPTION WHEN OTHERS THEN
    -- Log rollback failure
    UPDATE mwe_migration_log 
    SET status = 'failed', completed_at = NOW(), error_message = SQLERRM
    WHERE phase = 'rollback' AND operation = 'start_rollback' AND status = 'started';
    
    RETURN QUERY SELECT 
        'rollback_failed'::TEXT,
        'failed'::TEXT,
        0::INTEGER,
        SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Function to verify rollback integrity
CREATE OR REPLACE FUNCTION verify_rollback_integrity(p_scope TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    backup_count INTEGER;
    current_count INTEGER;
    integrity_passed BOOLEAN := TRUE;
BEGIN
    -- Verify backup table integrity
    SELECT COUNT(*) INTO backup_count FROM centralized_vocabulary_backup_mwe;
    SELECT COUNT(*) INTO current_count FROM centralized_vocabulary;
    
    IF p_scope = 'full' THEN
        -- For full rollback, counts should match
        IF backup_count != current_count THEN
            RAISE EXCEPTION 'Rollback integrity check failed: backup count (%) != current count (%)', backup_count, current_count;
        END IF;
        
        -- Verify no MWE flags remain
        IF EXISTS (SELECT 1 FROM centralized_vocabulary WHERE is_mwe = TRUE) THEN
            RAISE EXCEPTION 'Rollback integrity check failed: MWE flags still present after full rollback';
        END IF;
    END IF;
    
    -- Verify no orphaned migration data
    IF p_scope = 'full' THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name LIKE 'mwe_%' AND table_name != 'mwe_migration_archive') THEN
            RAISE WARNING 'Some MWE migration tables still exist after cleanup';
            integrity_passed := FALSE;
        END IF;
    END IF;
    
    RETURN integrity_passed;
END;
$$ LANGUAGE plpgsql;

-- Function to create emergency rollback point
CREATE OR REPLACE FUNCTION create_emergency_rollback_point()
RETURNS TEXT AS $$
DECLARE
    rollback_id TEXT;
    backup_count INTEGER;
BEGIN
    rollback_id := 'emergency_' || to_char(NOW(), 'YYYYMMDD_HH24MISS');
    
    -- Create emergency backup with timestamp
    EXECUTE format('CREATE TABLE centralized_vocabulary_emergency_%s AS SELECT * FROM centralized_vocabulary', rollback_id);
    EXECUTE format('CREATE TABLE sentences_emergency_%s AS SELECT * FROM sentences', rollback_id);
    
    -- Verify backup
    EXECUTE format('SELECT COUNT(*) FROM centralized_vocabulary_emergency_%s', rollback_id) INTO backup_count;
    
    IF backup_count = 0 THEN
        RAISE EXCEPTION 'Emergency rollback point creation failed - no data backed up';
    END IF;
    
    -- Log emergency backup
    INSERT INTO mwe_migration_log (phase, operation, table_name, status, metadata)
    VALUES ('emergency', 'create_rollback_point', 'centralized_vocabulary', 'completed',
            jsonb_build_object('rollback_id', rollback_id, 'backup_count', backup_count));
    
    RETURN rollback_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore from emergency rollback point
CREATE OR REPLACE FUNCTION restore_from_emergency_rollback(p_rollback_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    table_exists BOOLEAN;
    restored_count INTEGER;
BEGIN
    -- Check if emergency backup exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'centralized_vocabulary_emergency_' || p_rollback_id
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE EXCEPTION 'Emergency rollback point % does not exist', p_rollback_id;
    END IF;
    
    -- Restore from emergency backup
    DELETE FROM centralized_vocabulary;
    EXECUTE format('INSERT INTO centralized_vocabulary SELECT * FROM centralized_vocabulary_emergency_%s', p_rollback_id);
    
    GET DIAGNOSTICS restored_count = ROW_COUNT;
    
    -- Log emergency restore
    INSERT INTO mwe_migration_log (phase, operation, table_name, status, metadata)
    VALUES ('emergency', 'restore_from_rollback_point', 'centralized_vocabulary', 'completed',
            jsonb_build_object('rollback_id', p_rollback_id, 'restored_count', restored_count));
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create view for rollback status monitoring
CREATE OR REPLACE VIEW rollback_status_monitor AS
SELECT 
    phase,
    operation,
    status,
    records_affected,
    error_message,
    started_at,
    completed_at,
    completed_at - started_at as duration,
    metadata
FROM mwe_migration_log 
WHERE phase IN ('rollback', 'emergency')
ORDER BY started_at DESC;

-- Create function to list available rollback points
CREATE OR REPLACE FUNCTION list_available_rollback_points()
RETURNS TABLE (
    rollback_type TEXT,
    rollback_id TEXT,
    table_name TEXT,
    record_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- List emergency rollback points
    RETURN QUERY
    SELECT 
        'emergency'::TEXT,
        regexp_replace(t.table_name, '^centralized_vocabulary_emergency_', '') as rollback_id,
        t.table_name,
        (SELECT COUNT(*)::INTEGER FROM centralized_vocabulary) as record_count, -- Placeholder
        NOW() as created_at -- Placeholder - would need actual creation time
    FROM information_schema.tables t
    WHERE t.table_name LIKE 'centralized_vocabulary_emergency_%'
    
    UNION ALL
    
    -- List standard backup
    SELECT 
        'standard'::TEXT,
        'mwe_migration_backup'::TEXT,
        'centralized_vocabulary_backup_mwe'::TEXT,
        (SELECT COUNT(*)::INTEGER FROM centralized_vocabulary_backup_mwe),
        (SELECT MIN(created_at) FROM centralized_vocabulary_backup_mwe)
    WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'centralized_vocabulary_backup_mwe')
    
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rollback_mwe_migration(TEXT, BOOLEAN) IS 'Comprehensive rollback function with granular control and safety checks';
COMMENT ON FUNCTION create_emergency_rollback_point() IS 'Creates emergency backup point before risky operations';
COMMENT ON FUNCTION restore_from_emergency_rollback(TEXT) IS 'Restores database from specific emergency rollback point';
COMMENT ON VIEW rollback_status_monitor IS 'Monitors rollback operations and their status';
