-- Add enhanced_vocabulary_item_id to gem_events and word_performance_logs
-- This enables gems and performance tracking for custom vocabulary items

-- 1. gem_events updates
ALTER TABLE gem_events
ADD COLUMN IF NOT EXISTS enhanced_vocabulary_item_id UUID REFERENCES enhanced_vocabulary_items(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_gem_events_enhanced_vocab 
ON gem_events(enhanced_vocabulary_item_id);

-- 2. word_performance_logs updates
ALTER TABLE word_performance_logs
ADD COLUMN IF NOT EXISTS enhanced_vocabulary_item_id UUID REFERENCES enhanced_vocabulary_items(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_word_perf_enhanced_vocab 
ON word_performance_logs(enhanced_vocabulary_item_id);

-- 3. Comments
COMMENT ON COLUMN gem_events.enhanced_vocabulary_item_id IS 'References enhanced_vocabulary_items for custom vocabulary gems';
COMMENT ON COLUMN word_performance_logs.enhanced_vocabulary_item_id IS 'References enhanced_vocabulary_items for custom vocabulary performance logs';
