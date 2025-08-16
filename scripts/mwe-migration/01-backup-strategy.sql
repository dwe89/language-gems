-- ============================================================================
-- MWE Migration Phase 1: Database Backup Strategy
-- ============================================================================

-- 1. Create backup tables for critical data
CREATE TABLE IF NOT EXISTS centralized_vocabulary_backup_mwe AS 
SELECT * FROM centralized_vocabulary;

CREATE TABLE IF NOT EXISTS sentences_backup_mwe AS 
SELECT * FROM sentences;

-- 2. Create migration tracking table
CREATE TABLE IF NOT EXISTS mwe_migration_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase TEXT NOT NULL,
    operation TEXT NOT NULL,
    table_name TEXT NOT NULL,
    records_affected INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'rolled_back')),
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- 3. Create rollback procedures
CREATE OR REPLACE FUNCTION rollback_mwe_migration()
RETURNS VOID AS $$
BEGIN
    -- Log rollback start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status)
    VALUES ('rollback', 'restore_centralized_vocabulary', 'centralized_vocabulary', 'started');
    
    -- Restore centralized_vocabulary from backup
    DELETE FROM centralized_vocabulary;
    INSERT INTO centralized_vocabulary SELECT * FROM centralized_vocabulary_backup_mwe;
    
    -- Log rollback completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW()
    WHERE phase = 'rollback' AND operation = 'restore_centralized_vocabulary' AND status = 'started';
    
    RAISE NOTICE 'MWE migration rollback completed successfully';
END;
$$ LANGUAGE plpgsql;

-- 4. Verification queries for backup integrity
-- Run these to verify backups are complete:
-- SELECT COUNT(*) FROM centralized_vocabulary_backup_mwe;
-- SELECT COUNT(*) FROM sentences_backup_mwe;
-- SELECT COUNT(*) FROM centralized_vocabulary;
-- SELECT COUNT(*) FROM sentences;

COMMENT ON TABLE centralized_vocabulary_backup_mwe IS 'Backup of centralized_vocabulary before MWE migration';
COMMENT ON TABLE sentences_backup_mwe IS 'Backup of sentences table before MWE migration';
COMMENT ON TABLE mwe_migration_log IS 'Migration tracking and audit log for MWE enhancement project';
