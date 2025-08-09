-- Sample Edexcel Listening Questions for Testing

-- Get assessment IDs for inserting questions
DO $$
DECLARE
    foundation_es_id UUID;
    higher_es_id UUID;
BEGIN
    -- Get Foundation Spanish Paper 1 ID
    SELECT id INTO foundation_es_id 
    FROM edexcel_listening_assessments 
    WHERE language = 'es' AND level = 'foundation' AND identifier = 'paper-1';
    
    -- Get Higher Spanish Paper 1 ID
    SELECT id INTO higher_es_id 
    FROM edexcel_listening_assessments 
    WHERE language = 'es' AND level = 'higher' AND identifier = 'paper-1';

    -- Foundation Spanish Questions
    IF foundation_es_id IS NOT NULL THEN
        -- Q1: Multiple Choice (Foundation)
        INSERT INTO edexcel_listening_questions (
            assessment_id, question_type, section, question_number, title, instructions, marks, question_data, theme, topic
        ) VALUES (
            foundation_es_id,
            'multiple-choice',
            'A',
            1,
            'Maria is talking about her morning routine',
            'What does she say? Listen to the recording and complete the sentences by selecting the correct letter.',
            4,
            '{
                "questions": [
                    {
                        "id": "q1a",
                        "question": "Every morning to stay in shape, Maria",
                        "options": [
                            {"letter": "A", "text": "goes shopping"},
                            {"letter": "B", "text": "goes to a dance class"},
                            {"letter": "C", "text": "walks in the park"}
                        ]
                    },
                    {
                        "id": "q1b", 
                        "question": "After breakfast, she usually",
                        "options": [
                            {"letter": "A", "text": "reads the newspaper"},
                            {"letter": "B", "text": "watches television"},
                            {"letter": "C", "text": "listens to music"}
                        ]
                    }
                ]
            }',
            'Identity and culture',
            'Daily routines'
        );

        -- Q2: Multiple Response (Foundation)
        INSERT INTO edexcel_listening_questions (
            assessment_id, question_type, section, question_number, title, instructions, marks, question_data, theme, topic
        ) VALUES (
            foundation_es_id,
            'multiple-response',
            'A',
            2,
            'Listen to this advert promoting a Spanish town',
            'What is mentioned? Select the correct letters.',
            3,
            '{
                "prompt": "What facilities does the town offer?",
                "options": [
                    {"letter": "A", "text": "public transport"},
                    {"letter": "B", "text": "airport"},
                    {"letter": "C", "text": "places to eat"},
                    {"letter": "D", "text": "accommodation"},
                    {"letter": "E", "text": "shopping"},
                    {"letter": "F", "text": "the weather"}
                ]
            }',
            'Local area, holiday and travel',
            'Town and region'
        );

        -- Q3: Word Cloud (Foundation)
        INSERT INTO edexcel_listening_questions (
            assessment_id, question_type, section, question_number, title, instructions, marks, question_data, theme, topic
        ) VALUES (
            foundation_es_id,
            'word-cloud',
            'A',
            3,
            'Hugo is talking about his holidays',
            'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
            3,
            '{
                "prompt": "What does Hugo say about his holidays?",
                "wordCloud": ["playa", "montaña", "hotel", "camping", "avión", "tren", "coche", "barco", "sol", "lluvia", "calor", "frío"],
                "questions": [
                    {
                        "id": "q3a",
                        "textBefore": "When Hugo goes on holiday, he goes by",
                        "textAfter": ".",
                        "marks": 1
                    },
                    {
                        "id": "q3b", 
                        "textBefore": "He prefers to stay near the",
                        "textAfter": ".",
                        "marks": 1
                    },
                    {
                        "id": "q3c",
                        "textBefore": "The weather is usually",
                        "textAfter": ".",
                        "marks": 1
                    }
                ]
            }',
            'Local area, holiday and travel',
            'Holidays'
        );

        -- Q12: Dictation (Foundation)
        INSERT INTO edexcel_listening_questions (
            assessment_id, question_type, section, question_number, title, instructions, marks, question_data, theme, topic
        ) VALUES (
            foundation_es_id,
            'dictation',
            'B',
            12,
            'Section B: Dictation',
            'Listen to each sentence and fill in the missing words. Each sentence is heard three times.',
            10,
            '{
                "subject": "School life",
                "introduction": "You will hear sentences about school subjects and activities.",
                "sentences": [
                    {
                        "id": "s1",
                        "marks": 2,
                        "description": "Two gaps - each to be filled with one word from the vocabulary list",
                        "gaps": [
                            {
                                "id": "s1g1",
                                "textBefore": "Me gusta estudiar",
                                "textAfter": "porque es muy"
                            },
                            {
                                "id": "s1g2", 
                                "textBefore": "",
                                "textAfter": "."
                            }
                        ]
                    },
                    {
                        "id": "s2",
                        "marks": 2,
                        "description": "Two gaps - one from vocabulary list, one from outside vocabulary list",
                        "gaps": [
                            {
                                "id": "s2g1",
                                "textBefore": "En el recreo jugamos al",
                                "textAfter": "en el"
                            },
                            {
                                "id": "s2g2",
                                "textBefore": "",
                                "textAfter": "."
                            }
                        ]
                    }
                ]
            }',
            'School',
            'School subjects'
        );
    END IF;

    -- Higher Spanish Questions (with crossover)
    IF higher_es_id IS NOT NULL THEN
        -- Q1: Multiple Choice (Higher - crossover from Foundation Q7)
        INSERT INTO edexcel_listening_questions (
            assessment_id, question_type, section, question_number, title, instructions, marks, question_data, theme, topic
        ) VALUES (
            higher_es_id,
            'multiple-choice',
            'A',
            1,
            'Carlos and Ana are discussing environmental issues',
            'What do they say? Listen to the recording and complete the sentences by selecting the correct letter.',
            4,
            '{
                "questions": [
                    {
                        "id": "q1a",
                        "question": "Carlos thinks the biggest problem is",
                        "options": [
                            {"letter": "A", "text": "air pollution"},
                            {"letter": "B", "text": "water contamination"},
                            {"letter": "C", "text": "noise pollution"}
                        ]
                    },
                    {
                        "id": "q1b",
                        "question": "Ana suggests we should",
                        "options": [
                            {"letter": "A", "text": "use public transport more"},
                            {"letter": "B", "text": "recycle everything"},
                            {"letter": "C", "text": "buy less plastic"}
                        ]
                    }
                ]
            }',
            'Global issues',
            'Environment'
        );

        -- Q2: Word Cloud (Higher)
        INSERT INTO edexcel_listening_questions (
            assessment_id, question_type, section, question_number, title, instructions, marks, question_data, theme, topic
        ) VALUES (
            higher_es_id,
            'word-cloud',
            'A',
            2,
            'Sasha is talking in a podcast about his city',
            'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
            4,
            '{
                "prompt": "What does he say about his city?",
                "wordCloud": ["museo de arte", "playa", "centro comercial", "parque", "paella", "patatas fritas", "pescado", "teatro", "biblioteca", "estadio", "mercado"],
                "questions": [
                    {
                        "id": "q2a",
                        "textBefore": "Sashas favourite place is the",
                        "textAfter": ".",
                        "marks": 1
                    },
                    {
                        "id": "q2b",
                        "textBefore": "He recommends you go to the",
                        "textAfter": ".",
                        "marks": 1
                    },
                    {
                        "id": "q2c",
                        "textBefore": "You can eat",
                        "textAfter": ".",
                        "marks": 1
                    }
                ]
            }',
            'Local area, holiday and travel',
            'Town and region'
        );

        -- Q10: Dictation (Higher)
        INSERT INTO edexcel_listening_questions (
            assessment_id, question_type, section, question_number, title, instructions, marks, question_data, theme, topic
        ) VALUES (
            higher_es_id,
            'dictation',
            'B',
            10,
            'Section B: Dictation',
            'Listen to each sentence and fill in the missing words. Each sentence is heard three times.',
            10,
            '{
                "subject": "Future plans and career",
                "introduction": "You will hear sentences about future plans and career aspirations.",
                "sentences": [
                    {
                        "id": "s1",
                        "marks": 3,
                        "description": "Three gaps - two from vocabulary list, one from outside vocabulary list",
                        "gaps": [
                            {
                                "id": "s1g1",
                                "textBefore": "Después de terminar mis",
                                "textAfter": "quiero"
                            },
                            {
                                "id": "s1g2",
                                "textBefore": "",
                                "textAfter": "en la"
                            },
                            {
                                "id": "s1g3",
                                "textBefore": "",
                                "textAfter": "."
                            }
                        ]
                    },
                    {
                        "id": "s2",
                        "marks": 3,
                        "description": "Three gaps - one from vocabulary list, two from outside vocabulary list",
                        "gaps": [
                            {
                                "id": "s2g1",
                                "textBefore": "Mi",
                                "textAfter": "ideal sería trabajar como"
                            },
                            {
                                "id": "s2g2",
                                "textBefore": "",
                                "textAfter": "en una empresa"
                            },
                            {
                                "id": "s2g3",
                                "textBefore": "",
                                "textAfter": "."
                            }
                        ]
                    }
                ]
            }',
            'Future aspirations, study and work',
            'Career choices and ambitions'
        );
    END IF;
END $$;
