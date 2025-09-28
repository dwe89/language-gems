
-- Verify content was created for all topics
SELECT 
  gt.category,
  gt.slug,
  COUNT(gc.id) as content_count,
  STRING_AGG(gc.content_type, ', ' ORDER BY gc.content_type) as content_types
FROM grammar_topics gt
LEFT JOIN grammar_content gc ON gt.id = gc.topic_id
WHERE gt.language = 'es'
GROUP BY gt.id, gt.category, gt.slug
ORDER BY gt.category, gt.slug;

-- Check total content count
SELECT 
  content_type,
  COUNT(*) as count
FROM grammar_content gc
JOIN grammar_topics gt ON gc.topic_id = gt.id
WHERE gt.language = 'es'
GROUP BY content_type;
