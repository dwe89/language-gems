
-- Verify all topics were created
SELECT 
  category,
  COUNT(*) as topic_count,
  STRING_AGG(slug, ', ' ORDER BY slug) as topics
FROM grammar_topics 
WHERE language = 'es' 
GROUP BY category 
ORDER BY category;

-- Check total count
SELECT COUNT(*) as total_spanish_topics FROM grammar_topics WHERE language = 'es';
