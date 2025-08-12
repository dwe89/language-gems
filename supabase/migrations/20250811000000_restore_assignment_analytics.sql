-- ============================================================================
-- RESTORE ASSIGNMENT ANALYTICS TABLE
-- ============================================================================
-- This migration restores the assignment_analytics table that was incorrectly
-- removed during database cleanup. This table is critical for teacher analytics.

-- Create assignment analytics table
CREATE TABLE IF NOT EXISTS assignment_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    
    -- Participation metrics
    total_students INTEGER DEFAULT 0,
    students_started INTEGER DEFAULT 0,
    students_completed INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Performance metrics
    average_score DECIMAL(8,2) DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0,
    average_time_spent INTEGER DEFAULT 0,
    average_attempts DECIMAL(5,2) DEFAULT 0,
    
    -- Vocabulary metrics
    total_words_practiced INTEGER DEFAULT 0,
    average_words_learned DECIMAL(5,2) DEFAULT 0,
    vocabulary_mastery_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Difficulty analysis
    difficulty_rating DECIMAL(3,2) DEFAULT 0, -- 1-5 scale
    words_causing_difficulty TEXT[] DEFAULT '{}',
    common_mistakes JSONB DEFAULT '{}',
    
    -- Engagement metrics
    dropout_rate DECIMAL(5,2) DEFAULT 0,
    help_requests INTEGER DEFAULT 0,
    peak_activity_hours INTEGER[] DEFAULT '{}',
    average_session_length INTEGER DEFAULT 0,
    
    -- Metadata
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(assignment_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignment_analytics_assignment_id ON assignment_analytics(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_analytics_completion_rate ON assignment_analytics(completion_rate);
CREATE INDEX IF NOT EXISTS idx_assignment_analytics_difficulty ON assignment_analytics(difficulty_rating);

-- Enable Row Level Security
ALTER TABLE assignment_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Teachers can view assignment analytics" ON assignment_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assignments a 
            WHERE a.id = assignment_analytics.assignment_id 
            AND a.created_by = auth.uid()
        )
    );

CREATE POLICY "Teachers can update assignment analytics" ON assignment_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assignments a 
            WHERE a.id = assignment_analytics.assignment_id 
            AND a.created_by = auth.uid()
        )
    );

-- ============================================================================
-- RESTORE ANALYTICS FUNCTIONS
-- ============================================================================

-- Function to calculate assignment completion rate
CREATE OR REPLACE FUNCTION calculate_assignment_completion_rate(assignment_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    completion_rate DECIMAL(5,2);
BEGIN
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100, 2)
        END
    INTO completion_rate
    FROM enhanced_assignment_progress
    WHERE assignment_id = assignment_uuid;
    
    RETURN completion_rate;
END;
$$ LANGUAGE plpgsql;

-- Function to update assignment analytics
CREATE OR REPLACE FUNCTION update_assignment_analytics(assignment_uuid UUID)
RETURNS VOID AS $$
DECLARE
    analytics_record RECORD;
BEGIN
    -- Calculate analytics from enhanced_assignment_progress
    SELECT 
        COUNT(*) as total_students,
        COUNT(*) FILTER (WHERE status != 'not_started') as students_started,
        COUNT(*) FILTER (WHERE status = 'completed') as students_completed,
        COALESCE(AVG(best_score) FILTER (WHERE status = 'completed'), 0) as avg_score,
        COALESCE(AVG(best_accuracy) FILTER (WHERE status = 'completed'), 0) as avg_accuracy,
        COALESCE(AVG(total_time_spent) FILTER (WHERE status = 'completed'), 0) as avg_time_spent,
        COALESCE(AVG(attempts_count) FILTER (WHERE status = 'completed'), 0) as avg_attempts
    INTO analytics_record
    FROM enhanced_assignment_progress eap
    WHERE eap.assignment_id = assignment_uuid;
    
    -- Upsert analytics
    INSERT INTO assignment_analytics (
        assignment_id, total_students, students_started, students_completed,
        completion_rate, average_score, average_accuracy, average_time_spent,
        average_attempts, computed_at
    ) VALUES (
        assignment_uuid,
        analytics_record.total_students,
        analytics_record.students_started,
        analytics_record.students_completed,
        calculate_assignment_completion_rate(assignment_uuid),
        analytics_record.avg_score,
        analytics_record.avg_accuracy,
        analytics_record.avg_time_spent,
        analytics_record.avg_attempts,
        NOW()
    )
    ON CONFLICT (assignment_id) DO UPDATE SET
        total_students = EXCLUDED.total_students,
        students_started = EXCLUDED.students_started,
        students_completed = EXCLUDED.students_completed,
        completion_rate = EXCLUDED.completion_rate,
        average_score = EXCLUDED.average_score,
        average_accuracy = EXCLUDED.average_accuracy,
        average_time_spent = EXCLUDED.average_time_spent,
        average_attempts = EXCLUDED.average_attempts,
        last_calculated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RESTORE ANALYTICS TRIGGERS
-- ============================================================================

-- Function for trigger
CREATE OR REPLACE FUNCTION trigger_update_assignment_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics for the affected assignment
    PERFORM update_assignment_analytics(COALESCE(NEW.assignment_id, OLD.assignment_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on enhanced_assignment_progress
DROP TRIGGER IF EXISTS enhanced_assignment_progress_analytics_trigger ON enhanced_assignment_progress;
CREATE TRIGGER enhanced_assignment_progress_analytics_trigger
    AFTER INSERT OR UPDATE OR DELETE ON enhanced_assignment_progress
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_assignment_analytics();

-- ============================================================================
-- INITIALIZE ANALYTICS FOR EXISTING ASSIGNMENTS
-- ============================================================================

-- Update analytics for all existing assignments
DO $$
DECLARE
    assignment_record RECORD;
BEGIN
    FOR assignment_record IN 
        SELECT DISTINCT id FROM assignments 
    LOOP
        PERFORM update_assignment_analytics(assignment_record.id);
    END LOOP;
    
    RAISE NOTICE 'Assignment analytics initialized for all existing assignments';
END $$;

-- Add comment
COMMENT ON TABLE assignment_analytics IS 'Analytics and performance metrics for assignments - restored after incorrect cleanup';
