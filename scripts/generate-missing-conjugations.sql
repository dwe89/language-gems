-- Script to generate missing conjugations for all verbs
-- This will populate the grammar_conjugations table with present tense conjugations

-- Function to generate Spanish present tense conjugations
CREATE OR REPLACE FUNCTION generate_spanish_present_conjugations()
RETURNS void AS $$
DECLARE
  verb_record RECORD;
  verb_stem TEXT;
  verb_ending TEXT;
BEGIN
  -- Loop through all Spanish verbs without conjugations
  FOR verb_record IN 
    SELECT gv.id, gv.infinitive, gv.verb_type
    FROM grammar_verbs gv
    LEFT JOIN grammar_conjugations gc ON gv.id = gc.verb_id AND gc.tense = 'present'
    WHERE gv.language = 'es' 
      AND gv.is_active = true 
      AND gc.id IS NULL
      AND gv.infinitive ~ '(ar|er|ir)$' -- Only process verbs ending in ar/er/ir
  LOOP
    -- Get verb stem and ending
    verb_stem := substring(verb_record.infinitive from 1 for length(verb_record.infinitive) - 2);
    verb_ending := substring(verb_record.infinitive from length(verb_record.infinitive) - 1);
    
    -- Generate conjugations based on verb ending
    IF verb_ending = 'ar' THEN
      INSERT INTO grammar_conjugations (verb_id, tense, person, conjugated_form, is_irregular)
      VALUES
        (verb_record.id, 'present', 'yo', verb_stem || 'o', false),
        (verb_record.id, 'present', 'tu', verb_stem || 'as', false),
        (verb_record.id, 'present', 'el_ella_usted', verb_stem || 'a', false),
        (verb_record.id, 'present', 'nosotros', verb_stem || 'amos', false),
        (verb_record.id, 'present', 'vosotros', verb_stem || 'áis', false),
        (verb_record.id, 'present', 'ellos_ellas_ustedes', verb_stem || 'an', false);
        
    ELSIF verb_ending = 'er' THEN
      INSERT INTO grammar_conjugations (verb_id, tense, person, conjugated_form, is_irregular)
      VALUES
        (verb_record.id, 'present', 'yo', verb_stem || 'o', false),
        (verb_record.id, 'present', 'tu', verb_stem || 'es', false),
        (verb_record.id, 'present', 'el_ella_usted', verb_stem || 'e', false),
        (verb_record.id, 'present', 'nosotros', verb_stem || 'emos', false),
        (verb_record.id, 'present', 'vosotros', verb_stem || 'éis', false),
        (verb_record.id, 'present', 'ellos_ellas_ustedes', verb_stem || 'en', false);
        
    ELSIF verb_ending = 'ir' THEN
      INSERT INTO grammar_conjugations (verb_id, tense, person, conjugated_form, is_irregular)
      VALUES
        (verb_record.id, 'present', 'yo', verb_stem || 'o', false),
        (verb_record.id, 'present', 'tu', verb_stem || 'es', false),
        (verb_record.id, 'present', 'el_ella_usted', verb_stem || 'e', false),
        (verb_record.id, 'present', 'nosotros', verb_stem || 'imos', false),
        (verb_record.id, 'present', 'vosotros', verb_stem || 'ís', false),
        (verb_record.id, 'present', 'ellos_ellas_ustedes', verb_stem || 'en', false);
    END IF;
    
    RAISE NOTICE 'Generated conjugations for: %', verb_record.infinitive;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate French present tense conjugations
CREATE OR REPLACE FUNCTION generate_french_present_conjugations()
RETURNS void AS $$
DECLARE
  verb_record RECORD;
  verb_stem TEXT;
  verb_ending TEXT;
BEGIN
  -- Loop through all French verbs without conjugations
  FOR verb_record IN 
    SELECT gv.id, gv.infinitive, gv.verb_type
    FROM grammar_verbs gv
    LEFT JOIN grammar_conjugations gc ON gv.id = gc.verb_id AND gc.tense = 'present'
    WHERE gv.language = 'fr' 
      AND gv.is_active = true 
      AND gc.id IS NULL
      AND gv.infinitive ~ '(er|ir|re)$' -- Only process verbs ending in er/ir/re
  LOOP
    -- Get verb stem and ending
    verb_stem := substring(verb_record.infinitive from 1 for length(verb_record.infinitive) - 2);
    verb_ending := substring(verb_record.infinitive from length(verb_record.infinitive) - 1);
    
    -- Generate conjugations based on verb ending (-er verbs are most common)
    IF verb_ending = 'er' THEN
      INSERT INTO grammar_conjugations (verb_id, tense, person, conjugated_form, is_irregular)
      VALUES
        (verb_record.id, 'present', 'yo', verb_stem || 'e', false),  -- je
        (verb_record.id, 'present', 'tu', verb_stem || 'es', false),
        (verb_record.id, 'present', 'el_ella_usted', verb_stem || 'e', false),  -- il/elle
        (verb_record.id, 'present', 'nosotros', verb_stem || 'ons', false),  -- nous
        (verb_record.id, 'present', 'vosotros', verb_stem || 'ez', false),  -- vous
        (verb_record.id, 'present', 'ellos_ellas_ustedes', verb_stem || 'ent', false);  -- ils/elles
        
    ELSIF verb_ending = 'ir' THEN
      INSERT INTO grammar_conjugations (verb_id, tense, person, conjugated_form, is_irregular)
      VALUES
        (verb_record.id, 'present', 'yo', verb_stem || 'is', false),
        (verb_record.id, 'present', 'tu', verb_stem || 'is', false),
        (verb_record.id, 'present', 'el_ella_usted', verb_stem || 'it', false),
        (verb_record.id, 'present', 'nosotros', verb_stem || 'issons', false),
        (verb_record.id, 'present', 'vosotros', verb_stem || 'issez', false),
        (verb_record.id, 'present', 'ellos_ellas_ustedes', verb_stem || 'issent', false);
        
    ELSIF verb_ending = 're' THEN
      INSERT INTO grammar_conjugations (verb_id, tense, person, conjugated_form, is_irregular)
      VALUES
        (verb_record.id, 'present', 'yo', verb_stem || 's', false),
        (verb_record.id, 'present', 'tu', verb_stem || 's', false),
        (verb_record.id, 'present', 'el_ella_usted', verb_stem, false),
        (verb_record.id, 'present', 'nosotros', verb_stem || 'ons', false),
        (verb_record.id, 'present', 'vosotros', verb_stem || 'ez', false),
        (verb_record.id, 'present', 'ellos_ellas_ustedes', verb_stem || 'ent', false);
    END IF;
    
    RAISE NOTICE 'Generated conjugations for: %', verb_record.infinitive;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate German present tense conjugations
CREATE OR REPLACE FUNCTION generate_german_present_conjugations()
RETURNS void AS $$
DECLARE
  verb_record RECORD;
  verb_stem TEXT;
BEGIN
  -- Loop through all German verbs without conjugations
  FOR verb_record IN 
    SELECT gv.id, gv.infinitive, gv.verb_type
    FROM grammar_verbs gv
    LEFT JOIN grammar_conjugations gc ON gv.id = gc.verb_id AND gc.tense = 'present'
    WHERE gv.language = 'de' 
      AND gv.is_active = true 
      AND gc.id IS NULL
      AND gv.infinitive ~ 'en$' -- Only process verbs ending in -en
  LOOP
    -- Get verb stem (remove -en)
    verb_stem := substring(verb_record.infinitive from 1 for length(verb_record.infinitive) - 2);
    
    -- Generate conjugations
    INSERT INTO grammar_conjugations (verb_id, tense, person, conjugated_form, is_irregular)
    VALUES
      (verb_record.id, 'present', 'yo', verb_stem || 'e', false),  -- ich
      (verb_record.id, 'present', 'tu', verb_stem || 'st', false),  -- du
      (verb_record.id, 'present', 'el_ella_usted', verb_stem || 't', false),  -- er/sie/es
      (verb_record.id, 'present', 'nosotros', verb_stem || 'en', false),  -- wir
      (verb_record.id, 'present', 'vosotros', verb_stem || 't', false),  -- ihr
      (verb_record.id, 'present', 'ellos_ellas_ustedes', verb_stem || 'en', false);  -- sie/Sie
    
    RAISE NOTICE 'Generated conjugations for: %', verb_record.infinitive;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the functions to generate all missing conjugations
SELECT generate_spanish_present_conjugations();
SELECT generate_french_present_conjugations();
SELECT generate_german_present_conjugations();

-- Verify the results
SELECT 
  gv.language,
  COUNT(DISTINCT gv.id) as total_verbs,
  COUNT(DISTINCT CASE WHEN gc.id IS NOT NULL THEN gv.id END) as verbs_with_conjugations,
  COUNT(DISTINCT CASE WHEN gc.id IS NULL THEN gv.id END) as verbs_without_conjugations
FROM grammar_verbs gv
LEFT JOIN grammar_conjugations gc ON gv.id = gc.verb_id
WHERE gv.is_active = true
GROUP BY gv.language;

