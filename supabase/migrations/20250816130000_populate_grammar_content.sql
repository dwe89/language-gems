-- ============================================================================
-- POPULATE COMPREHENSIVE GRAMMAR CONTENT FOR LANGUAGEGEMS
-- ============================================================================
-- This migration populates the grammar system with comprehensive topics and
-- content for Spanish, French, and German across KS3 and KS4 levels
-- ============================================================================

-- ============================================================================
-- SPANISH GRAMMAR TOPICS
-- ============================================================================

-- Spanish Verbs
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('present_tense_regular', 'present-tense-regular', 'es', 'verbs', 'beginner', 'KS3', 'Present Tense - Regular Verbs', 'Learn to conjugate regular -ar, -er, and -ir verbs in the present tense', ARRAY['Conjugate regular -ar verbs', 'Conjugate regular -er verbs', 'Conjugate regular -ir verbs', 'Use present tense in context'], 1),
('present_tense_irregular', 'present-tense-irregular', 'es', 'verbs', 'intermediate', 'KS3', 'Present Tense - Irregular Verbs', 'Master common irregular verbs in the present tense', ARRAY['Conjugate ser and estar', 'Use tener and hacer', 'Master ir and venir', 'Apply irregular verbs in sentences'], 2),
('ser_vs_estar', 'ser-vs-estar', 'es', 'verbs', 'intermediate', 'KS3', 'Ser vs Estar', 'Understand when to use ser and estar (to be)', ARRAY['Distinguish permanent vs temporary states', 'Use ser for identity and characteristics', 'Use estar for location and condition', 'Apply both verbs correctly'], 3),
('preterite_tense', 'preterite-tense', 'es', 'verbs', 'intermediate', 'KS4', 'Preterite Tense', 'Express completed actions in the past', ARRAY['Form regular preterite verbs', 'Use irregular preterite forms', 'Express specific past events', 'Distinguish from imperfect tense'], 4),
('imperfect_tense', 'imperfect-tense', 'es', 'verbs', 'intermediate', 'KS4', 'Imperfect Tense', 'Describe ongoing past actions and habits', ARRAY['Form imperfect tense verbs', 'Express habitual past actions', 'Describe past states and conditions', 'Use time expressions with imperfect'], 5),
('subjunctive_mood', 'subjunctive-mood', 'es', 'verbs', 'advanced', 'KS4', 'Subjunctive Mood', 'Express doubt, emotion, and hypothetical situations', ARRAY['Form present subjunctive', 'Use subjunctive with emotion', 'Express doubt and uncertainty', 'Apply in complex sentences'], 6);

-- Spanish Nouns
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('noun_gender', 'noun-gender', 'es', 'nouns', 'beginner', 'KS3', 'Noun Gender', 'Learn masculine and feminine nouns', ARRAY['Identify masculine nouns', 'Identify feminine nouns', 'Use correct articles', 'Apply gender rules'], 1),
('plural_formation', 'plural-formation', 'es', 'nouns', 'beginner', 'KS3', 'Plural Formation', 'Form plural nouns correctly', ARRAY['Add -s to vowel-ending nouns', 'Add -es to consonant-ending nouns', 'Handle irregular plurals', 'Use plural articles'], 2),
('definite_articles', 'definite-articles', 'es', 'nouns', 'beginner', 'KS3', 'Definite Articles', 'Master el, la, los, las', ARRAY['Use el with masculine singular', 'Use la with feminine singular', 'Use los with masculine plural', 'Use las with feminine plural'], 3),
('indefinite_articles', 'indefinite-articles', 'es', 'nouns', 'beginner', 'KS3', 'Indefinite Articles', 'Learn un, una, unos, unas', ARRAY['Use un with masculine singular', 'Use una with feminine singular', 'Use unos with masculine plural', 'Use unas with feminine plural'], 4);

-- Spanish Adjectives
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('adjective_agreement', 'adjective-agreement', 'es', 'adjectives', 'beginner', 'KS3', 'Adjective Agreement', 'Make adjectives agree with nouns', ARRAY['Match adjective gender with noun', 'Match adjective number with noun', 'Apply agreement rules', 'Use descriptive adjectives'], 1),
('adjective_position', 'adjective-position', 'es', 'adjectives', 'intermediate', 'KS3', 'Adjective Position', 'Learn where to place adjectives', ARRAY['Place descriptive adjectives after nouns', 'Use limiting adjectives before nouns', 'Handle adjectives that change meaning', 'Apply position rules'], 2),
('comparatives', 'comparatives', 'es', 'adjectives', 'intermediate', 'KS4', 'Comparatives', 'Compare things using más/menos que', ARRAY['Form comparative adjectives', 'Use más... que constructions', 'Use menos... que constructions', 'Express equality with tan... como'], 3),
('superlatives', 'superlatives', 'es', 'adjectives', 'intermediate', 'KS4', 'Superlatives', 'Express the most/least using superlatives', ARRAY['Form superlative adjectives', 'Use el/la más... de', 'Use el/la menos... de', 'Apply in context'], 4);

-- ============================================================================
-- FRENCH GRAMMAR TOPICS
-- ============================================================================

-- French Verbs
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('present_tense_er', 'present-tense-er', 'fr', 'verbs', 'beginner', 'KS3', 'Present Tense - ER Verbs', 'Conjugate regular -er verbs in present tense', ARRAY['Remove -er ending', 'Add present tense endings', 'Use common -er verbs', 'Apply in sentences'], 1),
('present_tense_ir_re', 'present-tense-ir-re', 'fr', 'verbs', 'beginner', 'KS3', 'Present Tense - IR and RE Verbs', 'Conjugate -ir and -re verbs in present tense', ARRAY['Conjugate regular -ir verbs', 'Conjugate regular -re verbs', 'Distinguish verb groups', 'Use in context'], 2),
('avoir_etre', 'avoir-etre', 'fr', 'verbs', 'beginner', 'KS3', 'Avoir and Être', 'Master the most important French verbs', ARRAY['Conjugate avoir (to have)', 'Conjugate être (to be)', 'Use as auxiliary verbs', 'Apply in expressions'], 3),
('passe_compose', 'passe-compose', 'fr', 'verbs', 'intermediate', 'KS4', 'Passé Composé', 'Express completed past actions', ARRAY['Form with avoir', 'Form with être', 'Apply past participle agreement', 'Use time expressions'], 4),
('imparfait', 'imparfait', 'fr', 'verbs', 'intermediate', 'KS4', 'Imparfait', 'Describe ongoing past actions', ARRAY['Form imparfait tense', 'Express habitual past actions', 'Describe past states', 'Contrast with passé composé'], 5),
('conditional_mood', 'conditional-mood', 'fr', 'verbs', 'advanced', 'KS4', 'Conditional Mood', 'Express hypothetical situations', ARRAY['Form conditional tense', 'Express politeness', 'Use in hypothetical situations', 'Apply in complex sentences'], 6);

-- French Nouns
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('noun_gender_fr', 'noun-gender', 'fr', 'nouns', 'beginner', 'KS3', 'Noun Gender', 'Learn masculine and feminine nouns in French', ARRAY['Identify masculine nouns', 'Identify feminine nouns', 'Use correct articles', 'Apply gender patterns'], 1),
('plural_formation_fr', 'plural-formation', 'fr', 'nouns', 'beginner', 'KS3', 'Plural Formation', 'Form plural nouns in French', ARRAY['Add -s for regular plurals', 'Handle -x endings', 'Use irregular plurals', 'Apply plural articles'], 2),
('articles_fr', 'articles', 'fr', 'nouns', 'beginner', 'KS3', 'Articles', 'Master French articles', ARRAY['Use definite articles le, la, les', 'Use indefinite articles un, une, des', 'Use partitive articles du, de la, des', 'Apply in context'], 3);

-- ============================================================================
-- GERMAN GRAMMAR TOPICS
-- ============================================================================

-- German Nouns
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('noun_gender_de', 'noun-gender', 'de', 'nouns', 'beginner', 'KS3', 'Noun Gender', 'Learn der, die, das system', ARRAY['Identify masculine nouns (der)', 'Identify feminine nouns (die)', 'Identify neuter nouns (das)', 'Apply gender patterns'], 1),
('nominative_case', 'nominative-case', 'de', 'nouns', 'beginner', 'KS3', 'Nominative Case', 'Use the subject case', ARRAY['Identify sentence subjects', 'Use nominative articles', 'Apply nominative pronouns', 'Form basic sentences'], 2),
('accusative_case', 'accusative-case', 'de', 'nouns', 'intermediate', 'KS3', 'Accusative Case', 'Use the direct object case', ARRAY['Identify direct objects', 'Use accusative articles', 'Apply accusative pronouns', 'Use accusative prepositions'], 3),
('dative_case', 'dative-case', 'de', 'nouns', 'intermediate', 'KS4', 'Dative Case', 'Use the indirect object case', ARRAY['Identify indirect objects', 'Use dative articles', 'Apply dative pronouns', 'Use dative prepositions'], 4),
('genitive_case', 'genitive-case', 'de', 'nouns', 'advanced', 'KS4', 'Genitive Case', 'Express possession and relationships', ARRAY['Form genitive case', 'Express possession', 'Use genitive prepositions', 'Apply in formal contexts'], 5);

-- German Verbs
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('present_tense_de', 'present-tense', 'de', 'verbs', 'beginner', 'KS3', 'Present Tense', 'Conjugate German verbs in present tense', ARRAY['Use regular verb endings', 'Handle stem changes', 'Conjugate common verbs', 'Apply word order rules'], 1),
('modal_verbs', 'modal-verbs', 'de', 'verbs', 'intermediate', 'KS3', 'Modal Verbs', 'Express ability, permission, and obligation', ARRAY['Use können (can)', 'Use müssen (must)', 'Use wollen (want)', 'Apply modal verb structure'], 2),
('perfect_tense', 'perfect-tense', 'de', 'verbs', 'intermediate', 'KS4', 'Perfect Tense', 'Express completed actions', ARRAY['Form with haben', 'Form with sein', 'Use past participles', 'Apply time expressions'], 3),
('separable_verbs', 'separable-verbs', 'de', 'verbs', 'intermediate', 'KS4', 'Separable Verbs', 'Handle verbs with separable prefixes', ARRAY['Identify separable prefixes', 'Use in main clauses', 'Use in subordinate clauses', 'Apply in perfect tense'], 4);

-- ============================================================================
-- SYNTAX TOPICS (ALL LANGUAGES)
-- ============================================================================

-- Spanish Syntax
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('word_order_es', 'word-order', 'es', 'syntax', 'beginner', 'KS3', 'Word Order', 'Learn Spanish sentence structure', ARRAY['Use Subject-Verb-Object order', 'Place adjectives correctly', 'Form questions', 'Use negation'], 1),
('questions_es', 'questions', 'es', 'syntax', 'beginner', 'KS3', 'Forming Questions', 'Ask questions in Spanish', ARRAY['Use question words', 'Form yes/no questions', 'Use correct intonation', 'Apply question structure'], 2);

-- French Syntax
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('word_order_fr', 'word-order', 'fr', 'syntax', 'beginner', 'KS3', 'Word Order', 'Learn French sentence structure', ARRAY['Use Subject-Verb-Object order', 'Place adjectives correctly', 'Form questions', 'Use negation with ne...pas'], 1),
('questions_fr', 'questions', 'fr', 'syntax', 'beginner', 'KS3', 'Forming Questions', 'Ask questions in French', ARRAY['Use est-ce que', 'Use inversion', 'Use question words', 'Apply question structure'], 2);

-- German Syntax
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('word_order_de', 'word-order', 'de', 'syntax', 'intermediate', 'KS3', 'Word Order', 'Master German sentence structure', ARRAY['Use verb-second rule', 'Handle subordinate clauses', 'Place verbs correctly', 'Apply time-manner-place'], 1),
('subordinate_clauses', 'subordinate-clauses', 'de', 'syntax', 'advanced', 'KS4', 'Subordinate Clauses', 'Form complex sentences', ARRAY['Use subordinating conjunctions', 'Apply verb-final rule', 'Form relative clauses', 'Use complex structures'], 2);

-- ============================================================================
-- PRONOUNS TOPICS
-- ============================================================================

-- Spanish Pronouns
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('subject_pronouns_es', 'subject-pronouns', 'es', 'pronouns', 'beginner', 'KS3', 'Subject Pronouns', 'Learn yo, tú, él, ella, etc.', ARRAY['Use subject pronouns', 'Understand when to omit', 'Distinguish formal/informal', 'Apply in context'], 1),
('object_pronouns_es', 'object-pronouns', 'es', 'pronouns', 'intermediate', 'KS4', 'Object Pronouns', 'Use direct and indirect object pronouns', ARRAY['Use direct object pronouns', 'Use indirect object pronouns', 'Apply correct placement', 'Combine pronouns'], 2);

-- French Pronouns
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('subject_pronouns_fr', 'subject-pronouns', 'fr', 'pronouns', 'beginner', 'KS3', 'Subject Pronouns', 'Learn je, tu, il, elle, etc.', ARRAY['Use subject pronouns', 'Apply in conjugation', 'Distinguish formal/informal', 'Use in context'], 1),
('object_pronouns_fr', 'object-pronouns', 'fr', 'pronouns', 'intermediate', 'KS4', 'Object Pronouns', 'Use direct and indirect object pronouns', ARRAY['Use direct object pronouns', 'Use indirect object pronouns', 'Apply correct placement', 'Use y and en'], 2);

-- German Pronouns
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('personal_pronouns_de', 'personal-pronouns', 'de', 'pronouns', 'beginner', 'KS3', 'Personal Pronouns', 'Learn ich, du, er, sie, es, etc.', ARRAY['Use nominative pronouns', 'Use accusative pronouns', 'Use dative pronouns', 'Apply case system'], 1);

-- ============================================================================
-- PREPOSITIONS TOPICS
-- ============================================================================

-- Spanish Prepositions
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('basic_prepositions_es', 'basic-prepositions', 'es', 'prepositions', 'beginner', 'KS3', 'Basic Prepositions', 'Learn common Spanish prepositions', ARRAY['Use en, de, a, con', 'Express location', 'Express time', 'Apply in context'], 1),
('por_vs_para', 'por-vs-para', 'es', 'prepositions', 'intermediate', 'KS4', 'Por vs Para', 'Distinguish between por and para', ARRAY['Use por for reason/cause', 'Use para for purpose/destination', 'Apply time expressions', 'Master common uses'], 2);

-- French Prepositions
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('basic_prepositions_fr', 'basic-prepositions', 'fr', 'prepositions', 'beginner', 'KS3', 'Basic Prepositions', 'Learn common French prepositions', ARRAY['Use à, de, dans, sur', 'Express location', 'Express time', 'Apply contractions'], 1);

-- German Prepositions
INSERT INTO grammar_topics (topic_name, slug, language, category, difficulty_level, curriculum_level, title, description, learning_objectives, order_position) VALUES
('accusative_prepositions', 'accusative-prepositions', 'de', 'prepositions', 'intermediate', 'KS3', 'Accusative Prepositions', 'Learn prepositions that take accusative', ARRAY['Use durch, für, gegen, ohne', 'Apply accusative case', 'Express direction/purpose', 'Use in context'], 1),
('dative_prepositions', 'dative-prepositions', 'de', 'prepositions', 'intermediate', 'KS3', 'Dative Prepositions', 'Learn prepositions that take dative', ARRAY['Use aus, bei, mit, nach', 'Apply dative case', 'Express location/time', 'Use in context'], 2),
('two_way_prepositions', 'two-way-prepositions', 'de', 'prepositions', 'advanced', 'KS4', 'Two-Way Prepositions', 'Master prepositions that take accusative or dative', ARRAY['Use an, auf, in, über', 'Choose correct case', 'Distinguish motion vs location', 'Apply rules'], 3);
