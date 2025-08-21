-- ============================================================================
-- COMPREHENSIVE PRACTICE AND QUIZ CONTENT POPULATION
-- ============================================================================
-- This script adds practice and quiz content for all grammar topics that currently only have lessons

-- ============================================================================
-- SPANISH PRACTICE AND QUIZ CONTENT
-- ============================================================================

-- SPANISH: Present Tense Irregular - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'present_tense_irregular';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'Present Tense Irregular Practice Drills', 'present-tense-irregular-practice',
        '{
            "exercises": [
                {
                    "category": "Stem-changing verbs (e→ie)",
                    "instructions": "Choose the correct conjugation for these stem-changing verbs",
                    "prompts": [
                        {
                            "sentence": "Yo _____ estudiar español. (querer)",
                            "options": ["quero", "quiero", "quiere", "quieres"],
                            "answer": "quiero",
                            "explanation": "Querer is e→ie stem-changing. Yo quiero (I want)"
                        },
                        {
                            "sentence": "Ellos _____ a las 8. (empezar)",
                            "options": ["empiezan", "empezan", "empezar", "empiezo"],
                            "answer": "empiezan",
                            "explanation": "Empezar is e→ie stem-changing. Ellos empiezan (They start)"
                        },
                        {
                            "sentence": "Tú _____ la puerta. (cerrar)",
                            "options": ["cerras", "cierras", "cierra", "cerramos"],
                            "answer": "cierras",
                            "explanation": "Cerrar is e→ie stem-changing. Tú cierras (You close)"
                        }
                    ]
                },
                {
                    "category": "Stem-changing verbs (o→ue)",
                    "instructions": "Complete with the correct form of these o→ue verbs",
                    "prompts": [
                        {
                            "sentence": "Nosotros _____ temprano. (dormir)",
                            "options": ["duermo", "duermes", "dormimos", "duermen"],
                            "answer": "dormimos",
                            "explanation": "Nosotros does not change the stem. Nosotros dormimos (We sleep)"
                        },
                        {
                            "sentence": "Él _____ muy bien. (poder)",
                            "options": ["podo", "puede", "puedo", "podemos"],
                            "answer": "puede",
                            "explanation": "Poder is o→ue stem-changing. Él puede (He can)"
                        },
                        {
                            "sentence": "Yo _____ en casa. (almorzar)",
                            "options": ["almuerzo", "almorzo", "almuerzas", "almorzas"],
                            "answer": "almuerzo",
                            "explanation": "Almorzar is o→ue stem-changing. Yo almuerzo (I have lunch)"
                        }
                    ]
                },
                {
                    "category": "Irregular yo forms",
                    "instructions": "Choose the correct irregular yo form",
                    "prompts": [
                        {
                            "sentence": "Yo _____ la verdad. (saber)",
                            "options": ["sabo", "sé", "sabes", "sabe"],
                            "answer": "sé",
                            "explanation": "Saber has irregular yo form: yo sé (I know)"
                        },
                        {
                            "sentence": "Yo _____ mi tarea. (hacer)",
                            "options": ["haco", "hago", "haces", "hace"],
                            "answer": "hago",
                            "explanation": "Hacer has irregular yo form: yo hago (I do/make)"
                        },
                        {
                            "sentence": "Yo _____ de la escuela. (salir)",
                            "options": ["salo", "salgo", "sales", "sale"],
                            "answer": "salgo",
                            "explanation": "Salir has irregular yo form: yo salgo (I leave)"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true,
            "difficulty_progression": true
        }',
        'intermediate', '11-14', 15, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Present Tense Irregular - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'present_tense_irregular';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'Present Tense Irregular Mastery Quiz', 'present-tense-irregular-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Complete: Yo _____ la televisión. (ver)",
                    "options": ["vo", "veo", "ves", "ve"],
                    "correct_answer": "veo",
                    "difficulty": "beginner",
                    "explanation": "Ver has irregular yo form: yo veo (I see/watch)"
                },
                {
                    "type": "multiple_choice",
                    "question": "Complete: Él _____ jugar fútbol. (preferir)",
                    "options": ["prefero", "prefiere", "prefiero", "prefieres"],
                    "correct_answer": "prefiere",
                    "difficulty": "intermediate",
                    "explanation": "Preferir is e→ie stem-changing. Él prefiere (He prefers)"
                },
                {
                    "type": "multiple_choice",
                    "question": "Complete: Nosotros _____ el coche. (conducir)",
                    "options": ["conduzco", "conduces", "conducimos", "conducen"],
                    "correct_answer": "conducimos",
                    "difficulty": "intermediate",
                    "explanation": "Conducir is regular except for yo form. Nosotros conducimos (We drive)"
                },
                {
                    "type": "fill_blank",
                    "question": "Yo _____ muchas cosas interesantes. (conocer)",
                    "correct_answer": "conozco",
                    "difficulty": "intermediate",
                    "explanation": "Conocer has irregular yo form: yo conozco (I know/am familiar with)"
                },
                {
                    "type": "multiple_choice",
                    "question": "Complete: Ellos _____ la cena. (servir)",
                    "options": ["servo", "sirven", "serven", "servimos"],
                    "correct_answer": "sirven",
                    "difficulty": "advanced",
                    "explanation": "Servir is e→i stem-changing. Ellos sirven (They serve)"
                },
                {
                    "type": "translation",
                    "question": "Translate: I can speak Spanish",
                    "correct_answer": "Yo puedo hablar español",
                    "difficulty": "intermediate",
                    "explanation": "Poder (o→ue): Yo puedo hablar español"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 600,
            "instructions": "Test your knowledge of irregular present tense verbs in Spanish",
            "passing_score": 70,
            "show_explanations": true,
            "randomize_questions": true
        }',
        'intermediate', '11-14', 20, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Adjective Position - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'adjective_position';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'Adjective Position Practice', 'adjective-position-practice',
        '{
            "exercises": [
                {
                    "category": "Adjectives after nouns",
                    "instructions": "Place the adjective in the correct position",
                    "prompts": [
                        {
                            "sentence": "Una ___ grande ___. (casa)",
                            "options": ["casa grande", "grande casa"],
                            "answer": "casa grande",
                            "explanation": "Size adjectives usually go after the noun: una casa grande"
                        },
                        {
                            "sentence": "Un ___ azul ___. (coche)",
                            "options": ["coche azul", "azul coche"],
                            "answer": "coche azul",
                            "explanation": "Color adjectives go after the noun: un coche azul"
                        }
                    ]
                },
                {
                    "category": "Adjectives before nouns",
                    "instructions": "Some adjectives go before nouns",
                    "prompts": [
                        {
                            "sentence": "Un ___ libro ___. (buen)",
                            "options": ["libro bueno", "buen libro"],
                            "answer": "buen libro",
                            "explanation": "Bueno becomes buen before masculine singular nouns"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'intermediate', '11-14', 10, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Adjective Position - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'adjective_position';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'Adjective Position Quiz', 'adjective-position-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Which is correct?",
                    "options": ["una mesa redonda", "una redonda mesa"],
                    "correct_answer": "una mesa redonda",
                    "difficulty": "beginner",
                    "explanation": "Shape adjectives go after the noun"
                },
                {
                    "type": "multiple_choice",
                    "question": "Complete: Es un ___ hombre ___. (gran)",
                    "options": ["hombre grande", "gran hombre"],
                    "correct_answer": "gran hombre",
                    "difficulty": "intermediate",
                    "explanation": "Grande becomes gran before singular nouns and means great"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 300,
            "passing_score": 70
        }',
        'intermediate', '11-14', 10, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Noun Gender - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'noun_gender';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'Spanish Noun Gender Practice', 'noun-gender-practice',
        '{
            "exercises": [
                {
                    "category": "Common endings",
                    "instructions": "Choose the correct article based on noun gender",
                    "prompts": [
                        {
                            "sentence": "_____ mesa (table)",
                            "options": ["el", "la"],
                            "answer": "la",
                            "explanation": "Mesa ends in -a and is feminine: la mesa"
                        },
                        {
                            "sentence": "_____ problema (problem)",
                            "options": ["el", "la"],
                            "answer": "el",
                            "explanation": "Problema ends in -a but is masculine: el problema"
                        },
                        {
                            "sentence": "_____ universidad (university)",
                            "options": ["el", "la"],
                            "answer": "la",
                            "explanation": "Universidad ends in -dad and is feminine: la universidad"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'beginner', '11-14', 12, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Noun Gender - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'noun_gender';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'Spanish Noun Gender Quiz', 'noun-gender-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "What is the correct article for flor (flower)?",
                    "options": ["el", "la"],
                    "correct_answer": "la",
                    "difficulty": "intermediate",
                    "explanation": "Flor is feminine despite not ending in -a: la flor"
                },
                {
                    "type": "multiple_choice",
                    "question": "What is the correct article for día (day)?",
                    "options": ["el", "la"],
                    "correct_answer": "el",
                    "difficulty": "intermediate",
                    "explanation": "Día ends in -a but is masculine: el día"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 400,
            "passing_score": 70
        }',
        'beginner', '11-14', 15, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Preterite Tense - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'preterite_tense';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'Preterite Tense Practice', 'preterite-tense-practice',
        '{
            "exercises": [
                {
                    "category": "Regular -ar verbs",
                    "instructions": "Conjugate these -ar verbs in preterite tense",
                    "prompts": [
                        {
                            "sentence": "Yo _____ español ayer. (hablar)",
                            "options": ["hablé", "hablaba", "hablo", "hablaré"],
                            "answer": "hablé",
                            "explanation": "Preterite yo form of -ar verbs ends in -é: yo hablé"
                        },
                        {
                            "sentence": "Ellos _____ en el parque. (caminar)",
                            "options": ["caminaron", "caminaban", "caminan", "caminarán"],
                            "answer": "caminaron",
                            "explanation": "Preterite ellos form of -ar verbs ends in -aron: ellos caminaron"
                        }
                    ]
                },
                {
                    "category": "Irregular verbs",
                    "instructions": "These verbs have irregular preterite forms",
                    "prompts": [
                        {
                            "sentence": "Yo _____ al cine. (ir)",
                            "options": ["fui", "iba", "voy", "iré"],
                            "answer": "fui",
                            "explanation": "Ir has irregular preterite: yo fui (I went)"
                        },
                        {
                            "sentence": "Ella _____ en casa. (estar)",
                            "options": ["estuvo", "estaba", "está", "estará"],
                            "answer": "estuvo",
                            "explanation": "Estar has irregular preterite: ella estuvo (she was)"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'intermediate', '11-14', 15, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- SPANISH: Preterite Tense - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'es' AND topic_name = 'preterite_tense';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'Preterite Tense Quiz', 'preterite-tense-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Complete: Tú _____ la tarea anoche. (hacer)",
                    "options": ["hiciste", "hacías", "haces", "harás"],
                    "correct_answer": "hiciste",
                    "difficulty": "intermediate",
                    "explanation": "Hacer has irregular preterite: tú hiciste (you did)"
                },
                {
                    "type": "fill_blank",
                    "question": "Nosotros _____ mucho ayer. (trabajar)",
                    "correct_answer": "trabajamos",
                    "difficulty": "beginner",
                    "explanation": "Regular -ar preterite: nosotros trabajamos"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 500,
            "passing_score": 70
        }',
        'intermediate', '11-14', 18, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- FRENCH PRACTICE AND QUIZ CONTENT
-- ============================================================================

-- FRENCH: Present Tense -ER verbs - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'present_tense_er';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'French -ER Verbs Practice', 'present-tense-er-practice',
        '{
            "exercises": [
                {
                    "category": "Regular -er verbs",
                    "instructions": "Conjugate these -er verbs in present tense",
                    "prompts": [
                        {
                            "sentence": "Je _____ français. (parler)",
                            "options": ["parle", "parles", "parlons", "parlez"],
                            "answer": "parle",
                            "explanation": "Je form of -er verbs ends in -e: je parle"
                        },
                        {
                            "sentence": "Vous _____ beaucoup. (travailler)",
                            "options": ["travaille", "travailles", "travaillez", "travaillent"],
                            "answer": "travaillez",
                            "explanation": "Vous form of -er verbs ends in -ez: vous travaillez"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'beginner', '11-14', 12, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Present Tense -ER verbs - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'present_tense_er';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'French -ER Verbs Quiz', 'present-tense-er-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Complete: Ils _____ au restaurant. (manger)",
                    "options": ["mange", "manges", "mangeons", "mangent"],
                    "correct_answer": "mangent",
                    "difficulty": "beginner",
                    "explanation": "Ils form of -er verbs ends in -ent: ils mangent"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 300,
            "passing_score": 70
        }',
        'beginner', '11-14', 10, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Present Tense -IR/-RE verbs - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'present_tense_ir_re';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'French -IR/-RE Verbs Practice', 'present-tense-ir-re-practice',
        '{
            "exercises": [
                {
                    "category": "-ir verbs",
                    "instructions": "Conjugate these -ir verbs",
                    "prompts": [
                        {
                            "sentence": "Tu _____ le livre. (finir)",
                            "options": ["finis", "finit", "finissons", "finissez"],
                            "answer": "finis",
                            "explanation": "Tu form of -ir verbs ends in -is: tu finis"
                        }
                    ]
                },
                {
                    "category": "-re verbs",
                    "instructions": "Conjugate these -re verbs",
                    "prompts": [
                        {
                            "sentence": "Elle _____ le bus. (attendre)",
                            "options": ["attend", "attends", "attendons", "attendent"],
                            "answer": "attend",
                            "explanation": "Elle form of -re verbs ends in -: elle attend"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'beginner', '11-14', 12, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Present Tense -IR/-RE verbs - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'present_tense_ir_re';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'French -IR/-RE Verbs Quiz', 'present-tense-ir-re-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Complete: Nous _____ nos devoirs. (finir)",
                    "options": ["finissons", "finissez", "finissent", "finis"],
                    "correct_answer": "finissons",
                    "difficulty": "beginner",
                    "explanation": "Nous form of -ir verbs: nous finissons"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 300,
            "passing_score": 70
        }',
        'beginner', '11-14', 10, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Passé Composé - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'passe_compose';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'Passé Composé Practice', 'passe-compose-practice',
        '{
            "exercises": [
                {
                    "category": "Avoir auxiliary",
                    "instructions": "Form the passé composé with avoir",
                    "prompts": [
                        {
                            "sentence": "J''_____ _____ français. (parler)",
                            "options": ["ai parlé", "suis parlé", "as parlé", "est parlé"],
                            "answer": "ai parlé",
                            "explanation": "Most verbs use avoir: j''ai parlé (I spoke)"
                        }
                    ]
                },
                {
                    "category": "Être auxiliary",
                    "instructions": "Form the passé composé with être",
                    "prompts": [
                        {
                            "sentence": "Elle _____ _____ au magasin. (aller)",
                            "options": ["est allée", "a allé", "est allé", "a allée"],
                            "answer": "est allée",
                            "explanation": "Aller uses être, feminine agrees: elle est allée"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'intermediate', '11-14', 15, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- FRENCH: Passé Composé - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'fr' AND topic_name = 'passe_compose';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'Passé Composé Quiz', 'passe-compose-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Complete: Nous _____ _____ nos amis. (voir)",
                    "options": ["avons vu", "sommes vu", "avons vus", "sommes vus"],
                    "correct_answer": "avons vu",
                    "difficulty": "intermediate",
                    "explanation": "Voir uses avoir: nous avons vu (we saw)"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 400,
            "passing_score": 70
        }',
        'intermediate', '11-14', 15, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- GERMAN PRACTICE AND QUIZ CONTENT
-- ============================================================================

-- GERMAN: Nominative Case - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'nominative_case';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'German Nominative Case Practice', 'nominative-case-practice',
        '{
            "exercises": [
                {
                    "category": "Definite articles",
                    "instructions": "Choose the correct nominative article",
                    "prompts": [
                        {
                            "sentence": "_____ Hund ist groß. (dog - masculine)",
                            "options": ["Der", "Die", "Das", "Den"],
                            "answer": "Der",
                            "explanation": "Hund is masculine, nominative: der Hund"
                        },
                        {
                            "sentence": "_____ Katze schläft. (cat - feminine)",
                            "options": ["Der", "Die", "Das", "Den"],
                            "answer": "Die",
                            "explanation": "Katze is feminine, nominative: die Katze"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'beginner', '11-14', 10, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Nominative Case - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'nominative_case';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'German Nominative Case Quiz', 'nominative-case-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Complete: _____ Kind spielt. (child - neuter)",
                    "options": ["Der", "Die", "Das", "Den"],
                    "correct_answer": "Das",
                    "difficulty": "beginner",
                    "explanation": "Kind is neuter, nominative: das Kind"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 300,
            "passing_score": 70
        }',
        'beginner', '11-14', 10, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Accusative Case - Practice
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'accusative_case';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'practice', 'German Accusative Case Practice', 'accusative-case-practice',
        '{
            "exercises": [
                {
                    "category": "Direct objects",
                    "instructions": "Choose the correct accusative article",
                    "prompts": [
                        {
                            "sentence": "Ich sehe _____ Hund. (dog - masculine)",
                            "options": ["der", "die", "das", "den"],
                            "answer": "den",
                            "explanation": "Masculine accusative changes: den Hund (direct object)"
                        },
                        {
                            "sentence": "Er kauft _____ Auto. (car - neuter)",
                            "options": ["der", "die", "das", "den"],
                            "answer": "das",
                            "explanation": "Neuter accusative stays the same: das Auto"
                        }
                    ]
                }
            ],
            "practice_type": "choice_drill",
            "hints_enabled": true,
            "explanations_enabled": true
        }',
        'intermediate', '11-14', 12, 2
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- GERMAN: Accusative Case - Quiz
DO $$
DECLARE
    topic_id_var UUID;
BEGIN
    SELECT id INTO topic_id_var FROM grammar_topics WHERE language = 'de' AND topic_name = 'accusative_case';
    INSERT INTO grammar_content (topic_id, content_type, title, slug, content_data, difficulty_level, age_group, estimated_duration, order_position) VALUES (
        topic_id_var, 'quiz', 'German Accusative Case Quiz', 'accusative-case-quiz',
        '{
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Complete: Wir haben _____ Buch gelesen. (book - neuter)",
                    "options": ["der", "die", "das", "den"],
                    "correct_answer": "das",
                    "difficulty": "intermediate",
                    "explanation": "Neuter accusative: das Buch (direct object)"
                }
            ],
            "quiz_type": "comprehensive_assessment",
            "time_limit": 400,
            "passing_score": 70
        }',
        'intermediate', '11-14', 15, 3
    ) ON CONFLICT (topic_id, slug) DO NOTHING;
END $$;

-- ============================================================================
-- ADD MORE TOPICS AS NEEDED
-- ============================================================================

COMMIT;
