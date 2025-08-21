-- ============================================================================
-- COMPREHENSIVE GRAMMAR CONTENT POPULATION SCRIPT
-- ============================================================================
-- This script populates lesson, practice, and quiz content for all major
-- grammar topics across Spanish, French, and German
-- ============================================================================

-- ============================================================================
-- SPANISH CONTENT
-- ============================================================================

-- Spanish Noun Gender Content
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'noun_gender';
    
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Noun Gender', 'noun-gender-lesson',
        '{
            "sections": [
                {
                    "id": "intro",
                    "type": "explanation",
                    "title": "Masculine and Feminine Nouns",
                    "content": "<p>In Spanish, every noun has a gender: <strong>masculine</strong> or <strong>feminine</strong>. This affects the articles and adjectives used with the noun.</p>",
                    "visual_aids": [{"type": "highlight_box", "content": "💡 <strong>Rule:</strong> Most nouns ending in -o are masculine, most ending in -a are feminine"}]
                },
                {
                    "id": "masculine_nouns",
                    "type": "explanation",
                    "title": "Masculine Nouns",
                    "content": "<p>Masculine nouns typically:</p><ul><li>End in <strong>-o</strong> (el libro, el gato)</li><li>End in consonants (el hotel, el animal)</li><li>Use the article <strong>el</strong></li></ul>",
                    "examples": [
                        {"text": "el libro", "translation": "the book", "highlight": ["el"]},
                        {"text": "el perro", "translation": "the dog", "highlight": ["el"]},
                        {"text": "el profesor", "translation": "the teacher (male)", "highlight": ["el"]}
                    ]
                },
                {
                    "id": "feminine_nouns",
                    "type": "explanation",
                    "title": "Feminine Nouns",
                    "content": "<p>Feminine nouns typically:</p><ul><li>End in <strong>-a</strong> (la casa, la mesa)</li><li>End in <strong>-ión</strong> (la nación, la lección)</li><li>Use the article <strong>la</strong></li></ul>",
                    "examples": [
                        {"text": "la casa", "translation": "the house", "highlight": ["la"]},
                        {"text": "la mesa", "translation": "the table", "highlight": ["la"]},
                        {"text": "la lección", "translation": "the lesson", "highlight": ["la"]}
                    ]
                }
            ]
        }',
        'beginner', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- Spanish Adjective Agreement Content
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'adjective_agreement';
    
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Adjective Agreement', 'adjective-agreement-lesson',
        '{
            "sections": [
                {
                    "id": "intro",
                    "type": "explanation",
                    "title": "Making Adjectives Agree",
                    "content": "<p>Spanish adjectives must <strong>agree</strong> with the nouns they describe in both <strong>gender</strong> (masculine/feminine) and <strong>number</strong> (singular/plural).</p>",
                    "visual_aids": [{"type": "highlight_box", "content": "🎯 <strong>Rule:</strong> Adjective must match the noun in gender AND number"}]
                },
                {
                    "id": "gender_agreement",
                    "type": "explanation",
                    "title": "Gender Agreement",
                    "content": "<p>Adjectives change their endings to match the gender of the noun:</p>",
                    "examples": [
                        {"text": "el chico alto", "translation": "the tall boy", "highlight": ["alto"]},
                        {"text": "la chica alta", "translation": "the tall girl", "highlight": ["alta"]},
                        {"text": "el libro rojo", "translation": "the red book", "highlight": ["rojo"]},
                        {"text": "la mesa roja", "translation": "the red table", "highlight": ["roja"]}
                    ]
                }
            ]
        }',
        'beginner', '11-14', 15, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- FRENCH CONTENT
-- ============================================================================

-- French Avoir and Être Content
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'avoir_etre';
    
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Avoir and Être - Essential French Verbs', 'avoir-etre-lesson',
        '{
            "sections": [
                {
                    "id": "intro",
                    "type": "explanation",
                    "title": "The Two Most Important French Verbs",
                    "content": "<p><strong>Avoir</strong> (to have) and <strong>être</strong> (to be) are the most important verbs in French. They are used constantly in everyday conversation and as auxiliary verbs.</p>",
                    "visual_aids": [{"type": "highlight_box", "content": "💡 <strong>Essential:</strong> These verbs are irregular - memorize them!"}]
                },
                {
                    "id": "avoir_conjugation",
                    "type": "explanation",
                    "title": "Avoir - To Have",
                    "content": "<p>Avoir is used to express possession and as an auxiliary verb for most past tenses.</p>",
                    "conjugation_table": {
                        "verb": "avoir",
                        "translation": "to have",
                        "stem": "av",
                        "conjugations": [
                            {"person": "j''", "form": "ai", "translation": "I have"},
                            {"person": "tu", "form": "as", "translation": "you have"},
                            {"person": "il/elle", "form": "a", "translation": "he/she has"},
                            {"person": "nous", "form": "avons", "translation": "we have"},
                            {"person": "vous", "form": "avez", "translation": "you have"},
                            {"person": "ils/elles", "form": "ont", "translation": "they have"}
                        ]
                    }
                },
                {
                    "id": "etre_conjugation",
                    "type": "explanation",
                    "title": "Être - To Be",
                    "content": "<p>Être is used to describe states, characteristics, and as an auxiliary verb for some past tenses.</p>",
                    "conjugation_table": {
                        "verb": "être",
                        "translation": "to be",
                        "stem": "êt",
                        "conjugations": [
                            {"person": "je", "form": "suis", "translation": "I am"},
                            {"person": "tu", "form": "es", "translation": "you are"},
                            {"person": "il/elle", "form": "est", "translation": "he/she is"},
                            {"person": "nous", "form": "sommes", "translation": "we are"},
                            {"person": "vous", "form": "êtes", "translation": "you are"},
                            {"person": "ils/elles", "form": "sont", "translation": "they are"}
                        ]
                    }
                }
            ]
        }',
        'beginner', '11-14', 20, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- GERMAN CONTENT
-- ============================================================================

-- German Accusative Case Content
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'accusative_case';
    
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Accusative Case - Direct Objects', 'accusative-case-lesson',
        '{
            "sections": [
                {
                    "id": "intro",
                    "type": "explanation",
                    "title": "What is the Accusative Case?",
                    "content": "<p>The accusative case is used for <strong>direct objects</strong> - the person or thing that receives the action of the verb.</p>",
                    "visual_aids": [{"type": "highlight_box", "content": "🎯 <strong>Key:</strong> Accusative = Direct Object = What/Who receives the action"}]
                },
                {
                    "id": "articles_change",
                    "type": "explanation",
                    "title": "How Articles Change",
                    "content": "<p>In the accusative case, only the masculine articles change:</p>",
                    "conjugation_table": {
                        "verb": "articles",
                        "translation": "accusative articles",
                        "stem": "",
                        "conjugations": [
                            {"person": "Masculine", "form": "den Mann", "translation": "the man (acc.)", "audio_url": "/audio/de/den-mann.mp3"},
                            {"person": "Feminine", "form": "die Frau", "translation": "the woman (acc.)", "audio_url": "/audio/de/die-frau-acc.mp3"},
                            {"person": "Neuter", "form": "das Kind", "translation": "the child (acc.)", "audio_url": "/audio/de/das-kind-acc.mp3"},
                            {"person": "Plural", "form": "die Kinder", "translation": "the children (acc.)", "audio_url": "/audio/de/die-kinder-acc.mp3"}
                        ]
                    }
                },
                {
                    "id": "examples",
                    "type": "explanation",
                    "title": "Accusative in Action",
                    "content": "<p>See how the accusative case works in sentences:</p>",
                    "examples": [
                        {"text": "Ich sehe den Hund.", "translation": "I see the dog.", "highlight": ["den Hund"]},
                        {"text": "Er kauft das Auto.", "translation": "He buys the car.", "highlight": ["das Auto"]},
                        {"text": "Wir besuchen die Großmutter.", "translation": "We visit the grandmother.", "highlight": ["die Großmutter"]}
                    ]
                }
            ]
        }',
        'intermediate', '11-14', 18, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- PRACTICE AND QUIZ CONTENT FOR ALL TOPICS
-- ============================================================================

DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'noun_gender';
    
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'Noun Gender Practice', 'noun-gender-practice',
        '{
            "practice_type": "article_choice",
            "instructions": "Choose the correct article (el or la) for each noun.",
            "exercises": [
                {"noun": "casa", "answer": "la", "explanation": "Casa ends in -a, so it is feminine"},
                {"noun": "libro", "answer": "el", "explanation": "Libro ends in -o, so it is masculine"},
                {"noun": "profesor", "answer": "el", "explanation": "Profesor is masculine"},
                {"noun": "mesa", "answer": "la", "explanation": "Mesa ends in -a, so it is feminine"}
            ]
        }',
        'beginner', '11-14', 10, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- PHASE 1: FOUNDATION TOPICS (SPANISH, FRENCH, GERMAN)
-- ============================================================================

-- SPANISH: Subject Pronouns
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'subject_pronouns_es';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Subject Pronouns', 'subject-pronouns-es-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Subject Pronouns?", "content": "<p>Subject pronouns replace the subject of a sentence. In Spanish, they are used to indicate who is doing the action.</p>", "visual_aids": [{"type": "highlight_box", "content": "yo, tú, él, ella, nosotros, vosotros, ellos, ellas"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Yo hablo. (I speak)</li><li>Nosotros comemos. (We eat)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Definite Articles
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'definite_articles';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Definite Articles in Spanish', 'definite-articles-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Definite Articles?", "content": "<p>Definite articles are used to refer to specific nouns. In Spanish: el, la, los, las.</p>", "visual_aids": [{"type": "highlight_box", "content": "el (masc. sing.), la (fem. sing.), los (masc. pl.), las (fem. pl.)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>El libro (the book)</li><li>Las casas (the houses)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Indefinite Articles
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'indefinite_articles';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Indefinite Articles in Spanish', 'indefinite-articles-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Indefinite Articles?", "content": "<p>Indefinite articles refer to non-specific nouns. In Spanish: un, una, unos, unas.</p>", "visual_aids": [{"type": "highlight_box", "content": "un (masc. sing.), una (fem. sing.), unos (masc. pl.), unas (fem. pl.)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Un libro (a book)</li><li>Unas casas (some houses)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Plural Formation
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'plural_formation';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Plural Formation in Spanish', 'plural-formation-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "How to Form Plurals", "content": "<p>To make nouns plural in Spanish, add -s to vowels and -es to consonants.</p>", "visual_aids": [{"type": "highlight_box", "content": "casa → casas, papel → papeles"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>La casa → Las casas</li><li>El papel → Los papeles</li></ul>"}
            ]
        }',
        'beginner', '11-14', 7, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Avoir and Être (already present, skip to next)

-- FRENCH: Noun Gender
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'noun_gender_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Noun Gender', 'noun-gender-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Masculine and Feminine Nouns", "content": "<p>French nouns are either masculine or feminine. This affects articles and adjectives.</p>", "visual_aids": [{"type": "highlight_box", "content": "Most nouns ending in -e are feminine, others are masculine."}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Le livre (the book, masc.)</li><li>La table (the table, fem.)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Articles
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'articles_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Articles', 'articles-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Definite and Indefinite Articles", "content": "<p>French uses le, la, les (definite) and un, une, des (indefinite).</p>", "visual_aids": [{"type": "highlight_box", "content": "le (masc.), la (fem.), les (pl.), un (masc.), une (fem.), des (pl.)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Le chien (the dog)</li><li>Une pomme (an apple)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Subject Pronouns
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'subject_pronouns_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Subject Pronouns', 'subject-pronouns-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Subject Pronouns?", "content": "<p>Subject pronouns replace the subject of a sentence. In French: je, tu, il, elle, nous, vous, ils, elles.</p>", "visual_aids": [{"type": "highlight_box", "content": "je, tu, il, elle, nous, vous, ils, elles"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Je parle. (I speak)</li><li>Nous mangeons. (We eat)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Noun Gender
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'noun_gender_de';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Noun Gender', 'noun-gender-de-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is Noun Gender?", "content": "<p>German nouns are masculine, feminine, or neuter. The article changes with gender.</p>", "visual_aids": [{"type": "highlight_box", "content": "der (masc.), die (fem.), das (neut.)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Der Tisch (the table, masc.)</li><li>Die Lampe (the lamp, fem.)</li><li>Das Buch (the book, neut.)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Present Tense
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'present_tense_de';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Present Tense', 'present-tense-de-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Present Tense in German", "content": "<p>The present tense is used to talk about actions happening now. Regular verbs follow a pattern.</p>", "visual_aids": [{"type": "highlight_box", "content": "spielen: ich spiele, du spielst, er spielt..."}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich spiele. (I play)</li><li>Wir lernen. (We learn)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'personal_pronouns_de';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Personal Pronouns', 'personal-pronouns-de-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Personal Pronouns?", "content": "<p>Personal pronouns replace nouns and refer to people or things. In German: ich, du, er, sie, es, wir, ihr, sie, Sie.</p>", "visual_aids": [{"type": "highlight_box", "content": "ich, du, er, sie, es, wir, ihr, sie, Sie"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich bin hier. (I am here)</li><li>Sie sind Freunde. (They are friends)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- PHASE 2: INTERMEDIATE TOPICS (SPANISH, FRENCH, GERMAN)
-- ============================================================================

-- SPANISH: Present Tense Irregular Verbs
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'present_tense_irregular';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Present Tense Irregular Verbs', 'present-tense-irregular-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Irregular Verbs in the Present Tense", "content": "<p>Some Spanish verbs do not follow the regular conjugation patterns. These are called irregular verbs.</p>", "visual_aids": [{"type": "highlight_box", "content": "ser, ir, tener, venir, decir, etc."}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Yo voy (I go)</li><li>Tú tienes (You have)</li><li>Él dice (He says)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Adjective Agreement (already present, skip to next)

-- SPANISH: Basic Prepositions
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'basic_prepositions_es';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Basic Prepositions in Spanish', 'basic-prepositions-es-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Prepositions?", "content": "<p>Prepositions show relationships between words. Common Spanish prepositions: a, de, en, con, por, para.</p>", "visual_aids": [{"type": "highlight_box", "content": "a (to), de (of), en (in), con (with), por (for), para (for)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Voy a la escuela. (I go to school)</li><li>Libro de Juan. (Juan's book)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Present Tense IR and RE Verbs
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'present_tense_ir_re';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Present Tense IR and RE Verbs', 'present-tense-ir-re-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Present Tense IR and RE Verbs", "content": "<p>French verbs ending in -ir and -re have their own conjugation patterns in the present tense.</p>", "visual_aids": [{"type": "highlight_box", "content": "finir: je finis, tu finis... vendre: je vends, tu vends..."}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Je finis (I finish)</li><li>Nous vendons (We sell)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Plural Formation
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'plural_formation_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Plural Formation', 'plural-formation-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "How to Form Plurals in French", "content": "<p>Most French nouns form the plural by adding -s. Some have irregular forms.</p>", "visual_aids": [{"type": "highlight_box", "content": "livre → livres, animal → animaux"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Le livre → Les livres</li><li>L''animal → Les animaux</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Basic Prepositions
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'basic_prepositions_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Basic Prepositions in French', 'basic-prepositions-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Prepositions?", "content": "<p>Prepositions show relationships between words. Common French prepositions: à, de, en, avec, pour, chez.</p>", "visual_aids": [{"type": "highlight_box", "content": "à (to), de (of), en (in), avec (with), pour (for), chez (at the home of)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Je vais à l''école. (I go to school)</li><li>Le livre de Marie. (Marie''s book)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Accusative Case (already present, skip to next)

-- GERMAN: Modal Verbs
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'modal_verbs';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Modal Verbs', 'modal-verbs-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Modal Verbs?", "content": "<p>Modal verbs express ability, permission, necessity, or possibility. Common German modal verbs: können, dürfen, müssen, sollen, wollen, mögen.</p>", "visual_aids": [{"type": "highlight_box", "content": "können (can), dürfen (may), müssen (must), sollen (should), wollen (want), mögen (like)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich kann schwimmen. (I can swim)</li><li>Wir müssen gehen. (We must go)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'accusative_prepositions';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Accusative Prepositions', 'accusative-prepositions-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Accusative Prepositions", "content": "<p>Certain prepositions in German always take the accusative case: durch, für, gegen, ohne, um.</p>", "visual_aids": [{"type": "highlight_box", "content": "durch (through), für (for), gegen (against), ohne (without), um (around)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich gehe durch den Park. (I walk through the park)</li><li>Das Geschenk ist für dich. (The gift is for you)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- PHASE 3: ADVANCED TOPICS (SPANISH, FRENCH, GERMAN)
-- ============================================================================

-- SPANISH: Preterite Tense
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'preterite_tense';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Preterite Tense', 'preterite-tense-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is the Preterite Tense?", "content": "<p>The preterite tense is used to talk about completed actions in the past.</p>", "visual_aids": [{"type": "highlight_box", "content": "-ar: hablé, -er: comí, -ir: viví"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Yo hablé. (I spoke)</li><li>Nosotros comimos. (We ate)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Imperfect Tense
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'imperfect_tense';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Imperfect Tense', 'imperfect-tense-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is the Imperfect Tense?", "content": "<p>The imperfect tense describes ongoing or repeated actions in the past.</p>", "visual_aids": [{"type": "highlight_box", "content": "-ar: hablaba, -er: comía, -ir: vivía"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Yo hablaba. (I was speaking)</li><li>Ellos vivían. (They were living)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Por vs Para
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'por_vs_para';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Por vs Para', 'por-vs-para-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Por vs Para", "content": "<p>Both por and para mean 'for', but are used in different contexts.</p>", "visual_aids": [{"type": "highlight_box", "content": "por: cause, para: purpose"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Trabajo por dinero. (I work for money - cause)</li><li>Estudio para aprender. (I study in order to learn - purpose)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Subjunctive Mood
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'subjunctive_mood';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Subjunctive Mood', 'subjunctive-mood-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is the Subjunctive Mood?", "content": "<p>The subjunctive is used to express wishes, doubts, or possibilities.</p>", "visual_aids": [{"type": "highlight_box", "content": "Espero que vengas. (I hope you come)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ojalá llueva. (Hopefully it rains)</li><li>Quiero que estudies. (I want you to study)</li></ul>"}
            ]
        }',
        'advanced', '11-14', 14, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Passé Composé
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'passe_compose';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Passé Composé', 'passe-compose-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is Passé Composé?", "content": "<p>Passé composé is used to talk about completed actions in the past. It uses avoir or être + past participle.</p>", "visual_aids": [{"type": "highlight_box", "content": "J'ai mangé, je suis allé(e)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>J'ai fini. (I finished)</li><li>Nous sommes allés. (We went)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Imparfait
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'imparfait';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Imparfait', 'imparfait-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is Imparfait?", "content": "<p>Imparfait is used for ongoing or repeated actions in the past.</p>", "visual_aids": [{"type": "highlight_box", "content": "je parlais, nous finissions"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Je parlais. (I was speaking)</li><li>Ils finissaient. (They were finishing)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Conditional Mood
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'conditional_mood';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Conditional Mood', 'conditional-mood-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is the Conditional Mood?", "content": "<p>The conditional is used to express what would happen under certain conditions.</p>", "visual_aids": [{"type": "highlight_box", "content": "je voudrais (I would like), il ferait (he would do)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Je voudrais un café. (I would like a coffee)</li><li>Nous irions. (We would go)</li></ul>"}
            ]
        }',
        'advanced', '11-14', 14, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Object Pronouns
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'object_pronouns_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Object Pronouns', 'object-pronouns-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Object Pronouns?", "content": "<p>Object pronouns replace the object of a verb. In French: me, te, le, la, nous, vous, les.</p>", "visual_aids": [{"type": "highlight_box", "content": "me, te, le, la, nous, vous, les"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Je le vois. (I see him/it)</li><li>Nous les avons. (We have them)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Dative Case
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'dative_case';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Dative Case', 'dative-case-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is the Dative Case?", "content": "<p>The dative case is used for indirect objects. It answers the question 'to whom?' or 'for whom?'</p>", "visual_aids": [{"type": "highlight_box", "content": "dem Mann, der Frau, dem Kind, den Kindern"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich gebe dem Mann das Buch. (I give the man the book)</li><li>Wir helfen der Frau. (We help the woman)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Genitive Case
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'genitive_case';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Genitive Case', 'genitive-case-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is the Genitive Case?", "content": "<p>The genitive case shows possession or relationship. It answers the question 'whose?'</p>", "visual_aids": [{"type": "highlight_box", "content": "des Mannes, der Frau"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Das Auto des Mannes. (The man's car)</li><li>Die Tasche der Frau. (The woman's bag)</li></ul>"}
            ]
        }',
        'advanced', '11-14', 14, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Separable Verbs
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'separable_verbs';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Separable Verbs', 'separable-verbs-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Separable Verbs?", "content": "<p>Some German verbs have prefixes that separate in certain tenses. The prefix moves to the end of the sentence.</p>", "visual_aids": [{"type": "highlight_box", "content": "aufstehen → Ich stehe auf."}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich stehe auf. (I get up)</li><li>Wir fangen an. (We begin)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Two-Way Prepositions
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'two_way_prepositions';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Two-Way Prepositions', 'two-way-prepositions-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Two-Way Prepositions?", "content": "<p>Some prepositions in German can take either the accusative or dative case depending on movement or location: an, auf, hinter, in, neben, über, unter, vor, zwischen.</p>", "visual_aids": [{"type": "highlight_box", "content": "an, auf, hinter, in, neben, über, unter, vor, zwischen"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich gehe in die Schule. (I go into the school - accusative)</li><li>Ich bin in der Schule. (I am in the school - dative)</li></ul>"}
            ]
        }',
        'advanced', '11-14', 14, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Word Order
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'word_order_de';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Word Order', 'word-order-de-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Word Order in German", "content": "<p>German word order can change depending on the sentence type. The verb is usually in the second position.</p>", "visual_aids": [{"type": "highlight_box", "content": "Ich gehe nach Hause. (I go home)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Heute gehe ich nach Hause. (Today I go home)</li><li>Geht er nach Hause? (Is he going home?)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Subordinate Clauses
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'subordinate_clauses';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Subordinate Clauses', 'subordinate-clauses-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What are Subordinate Clauses?", "content": "<p>Subordinate clauses are dependent clauses introduced by words like weil (because), dass (that), wenn (if). The verb goes to the end.</p>", "visual_aids": [{"type": "highlight_box", "content": "Ich bleibe zu Hause, weil es regnet. (I stay home because it is raining)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich weiß, dass du kommst. (I know that you are coming)</li><li>Wenn es regnet, bleibe ich zu Hause. (If it rains, I stay home)</li></ul>"}
            ]
        }',
        'advanced', '11-14', 14, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- MISSING SPANISH TOPICS
-- ============================================================================

-- SPANISH: Adjective Position
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'adjective_position';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Adjective Position', 'adjective-position-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Where Do Adjectives Go?", "content": "<p>In Spanish, most adjectives come after the noun they describe, but some come before.</p>", "visual_aids": [{"type": "highlight_box", "content": "Most adjectives: AFTER the noun"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Una casa grande (a big house)</li><li>Un buen libro (a good book)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Comparatives
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'comparatives';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Comparatives', 'comparatives-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Making Comparisons", "content": "<p>Use más... que (more than), menos... que (less than), tan... como (as... as).</p>", "visual_aids": [{"type": "highlight_box", "content": "más + adjective + que"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>María es más alta que Juan. (María is taller than Juan)</li><li>Este libro es menos interesante que ese. (This book is less interesting than that one)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Superlatives
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'superlatives';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Superlatives', 'superlatives-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "The Most/Least", "content": "<p>Use el/la/los/las más/menos + adjective to express the most or least.</p>", "visual_aids": [{"type": "highlight_box", "content": "el más + adjective"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Es la casa más grande. (It is the biggest house)</li><li>Son los estudiantes menos perezosos. (They are the least lazy students)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Object Pronouns
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'object_pronouns_es';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Object Pronouns', 'object-pronouns-es-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Direct and Indirect Object Pronouns", "content": "<p>Object pronouns replace the object of a verb. Direct: me, te, lo, la, nos, os, los, las. Indirect: me, te, le, nos, os, les.</p>", "visual_aids": [{"type": "highlight_box", "content": "Lo veo. (I see him/it)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>La veo. (I see her)</li><li>Le doy el libro. (I give him/her the book)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Word Order
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'word_order_es';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Spanish Word Order', 'word-order-es-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Basic Word Order", "content": "<p>Spanish follows Subject-Verb-Object order, but is more flexible than English.</p>", "visual_aids": [{"type": "highlight_box", "content": "María come manzanas. (María eats apples)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Juan estudia español. (Juan studies Spanish)</li><li>¿Hablas inglés? (Do you speak English?)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Forming Questions
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'questions_es';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Forming Questions in Spanish', 'questions-es-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "How to Ask Questions", "content": "<p>Use question words: ¿qué?, ¿quién?, ¿dónde?, ¿cuándo?, ¿cómo?, ¿por qué?</p>", "visual_aids": [{"type": "highlight_box", "content": "¿Qué haces? (What are you doing?)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>¿Cómo te llamas? (What is your name?)</li><li>¿Dónde vives? (Where do you live?)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- MISSING FRENCH TOPICS
-- ============================================================================

-- FRENCH: Word Order
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'word_order_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'French Word Order', 'word-order-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Basic Word Order", "content": "<p>French follows Subject-Verb-Object order like English.</p>", "visual_aids": [{"type": "highlight_box", "content": "Marie mange une pomme. (Marie eats an apple)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Paul étudie le français. (Paul studies French)</li><li>Nous aimons le chocolat. (We like chocolate)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 8, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Forming Questions
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'questions_fr';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'Forming Questions in French', 'questions-fr-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "How to Ask Questions", "content": "<p>Use question words: qui?, que?, où?, quand?, comment?, pourquoi?</p>", "visual_aids": [{"type": "highlight_box", "content": "Comment allez-vous? (How are you?)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Où habitez-vous? (Where do you live?)</li><li>Que faites-vous? (What are you doing?)</li></ul>"}
            ]
        }',
        'beginner', '11-14', 10, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- MISSING GERMAN TOPICS
-- ============================================================================

-- GERMAN: Perfect Tense
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'perfect_tense';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Perfect Tense', 'perfect-tense-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "What is the Perfect Tense?", "content": "<p>The perfect tense is used to talk about completed actions. It uses haben or sein + past participle.</p>", "visual_aids": [{"type": "highlight_box", "content": "Ich habe gespielt. (I have played/I played)"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich bin gegangen. (I have gone/I went)</li><li>Wir haben gegessen. (We have eaten/We ate)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 14, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Dative Prepositions
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'dative_prepositions';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'lesson', 'German Dative Prepositions', 'dative-prepositions-lesson',
        '{
            "sections": [
                {"id": "intro", "type": "explanation", "title": "Dative Prepositions", "content": "<p>Certain prepositions in German always take the dative case: aus, bei, mit, nach, seit, von, zu.</p>", "visual_aids": [{"type": "highlight_box", "content": "aus, bei, mit, nach, seit, von, zu"}]},
                {"id": "examples", "type": "explanation", "title": "Examples", "content": "<ul><li>Ich wohne bei meinen Eltern. (I live with my parents)</li><li>Nach der Schule gehe ich nach Hause. (After school I go home)</li></ul>"}
            ]
        }',
        'intermediate', '11-14', 12, 1
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;
