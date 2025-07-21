-- Script to add articles to existing vocabulary items
-- This will intelligently parse existing words and extract articles

-- First, let's see what we're working with
SELECT 
  language, 
  COUNT(*) as word_count,
  COUNT(CASE WHEN article IS NOT NULL AND article != '' THEN 1 END) as has_article,
  COUNT(CASE WHEN base_word IS NOT NULL AND base_word != '' THEN 1 END) as has_base_word
FROM centralized_vocabulary 
GROUP BY language;

-- For Spanish words, extract common articles (el, la, los, las)
UPDATE centralized_vocabulary 
SET 
  article = CASE 
    WHEN word ILIKE 'el %' THEN 'el'
    WHEN word ILIKE 'la %' THEN 'la' 
    WHEN word ILIKE 'los %' THEN 'los'
    WHEN word ILIKE 'las %' THEN 'las'
    WHEN word ILIKE 'un %' THEN 'un'
    WHEN word ILIKE 'una %' THEN 'una'
    ELSE NULL
  END,
  base_word = CASE 
    WHEN word ILIKE 'el %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'la %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'los %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'las %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'un %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'una %' THEN TRIM(SUBSTRING(word FROM 5))
    ELSE word
  END
WHERE language = 'es' AND (article IS NULL OR article = '');

-- For French words, extract common articles (le, la, les, un, une, des)
UPDATE centralized_vocabulary 
SET 
  article = CASE 
    WHEN word ILIKE 'le %' THEN 'le'
    WHEN word ILIKE 'la %' THEN 'la' 
    WHEN word ILIKE 'les %' THEN 'les'
    WHEN word ILIKE 'un %' THEN 'un'
    WHEN word ILIKE 'une %' THEN 'une'
    WHEN word ILIKE 'des %' THEN 'des'
    WHEN word ILIKE 'du %' THEN 'du'
    WHEN word ILIKE 'de la %' THEN 'de la'
    ELSE NULL
  END,
  base_word = CASE 
    WHEN word ILIKE 'le %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'la %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'les %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'un %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'une %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'des %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'du %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'de la %' THEN TRIM(SUBSTRING(word FROM 7))
    ELSE word
  END
WHERE language = 'fr' AND (article IS NULL OR article = '');

-- For German words, extract common articles (der, die, das, ein, eine)
UPDATE centralized_vocabulary 
SET 
  article = CASE 
    WHEN word ILIKE 'der %' THEN 'der'
    WHEN word ILIKE 'die %' THEN 'die' 
    WHEN word ILIKE 'das %' THEN 'das'
    WHEN word ILIKE 'ein %' THEN 'ein'
    WHEN word ILIKE 'eine %' THEN 'eine'
    ELSE NULL
  END,
  base_word = CASE 
    WHEN word ILIKE 'der %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'die %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'das %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'ein %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'eine %' THEN TRIM(SUBSTRING(word FROM 6))
    ELSE word
  END
WHERE language = 'de' AND (article IS NULL OR article = '');

-- For Italian words, extract common articles (il, la, lo, gli, le, un, una)
UPDATE centralized_vocabulary 
SET 
  article = CASE 
    WHEN word ILIKE 'il %' THEN 'il'
    WHEN word ILIKE 'la %' THEN 'la' 
    WHEN word ILIKE 'lo %' THEN 'lo'
    WHEN word ILIKE 'gli %' THEN 'gli'
    WHEN word ILIKE 'le %' THEN 'le'
    WHEN word ILIKE 'un %' THEN 'un'
    WHEN word ILIKE 'una %' THEN 'una'
    ELSE NULL
  END,
  base_word = CASE 
    WHEN word ILIKE 'il %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'la %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'lo %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'gli %' THEN TRIM(SUBSTRING(word FROM 5))
    WHEN word ILIKE 'le %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'un %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'una %' THEN TRIM(SUBSTRING(word FROM 5))
    ELSE word
  END
WHERE language = 'it' AND (article IS NULL OR article = '');

-- For Portuguese words, extract common articles (o, a, os, as, um, uma)
UPDATE centralized_vocabulary 
SET 
  article = CASE 
    WHEN word ILIKE 'o %' THEN 'o'
    WHEN word ILIKE 'a %' THEN 'a' 
    WHEN word ILIKE 'os %' THEN 'os'
    WHEN word ILIKE 'as %' THEN 'as'
    WHEN word ILIKE 'um %' THEN 'um'
    WHEN word ILIKE 'uma %' THEN 'uma'
    ELSE NULL
  END,
  base_word = CASE 
    WHEN word ILIKE 'o %' THEN TRIM(SUBSTRING(word FROM 3))
    WHEN word ILIKE 'a %' THEN TRIM(SUBSTRING(word FROM 3))
    WHEN word ILIKE 'os %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'as %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'um %' THEN TRIM(SUBSTRING(word FROM 4))
    WHEN word ILIKE 'uma %' THEN TRIM(SUBSTRING(word FROM 5))
    ELSE word
  END
WHERE language = 'pt' AND (article IS NULL OR article = '');

-- For all languages, ensure base_word is set to word if it's still null
UPDATE centralized_vocabulary 
SET base_word = word 
WHERE base_word IS NULL OR base_word = '';

-- Show results
SELECT 
  language, 
  COUNT(*) as total_words,
  COUNT(CASE WHEN article IS NOT NULL AND article != '' THEN 1 END) as words_with_articles,
  COUNT(CASE WHEN base_word IS NOT NULL AND base_word != '' THEN 1 END) as words_with_base_word,
  ROUND(
    COUNT(CASE WHEN article IS NOT NULL AND article != '' THEN 1 END) * 100.0 / COUNT(*), 
    1
  ) as article_percentage
FROM centralized_vocabulary 
GROUP BY language
ORDER BY language;
