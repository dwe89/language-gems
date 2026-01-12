-- =====================================================
-- Speaking Assessment System Database Schema
-- Created: 2026-01-11
-- Auto-graded speaking exams with transcription verification
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table 1: Speaking Assessment Definitions
-- Stores the metadata for each speaking exam
-- =====================================================
CREATE TABLE IF NOT EXISTS aqa_speaking_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    language VARCHAR(10) NOT NULL CHECK (language IN ('es', 'fr', 'de')),
    level VARCHAR(20) NOT NULL CHECK (level IN ('foundation', 'higher')),
    identifier VARCHAR(50) NOT NULL, -- e.g., 'paper-1', 'mock-2024'
    version VARCHAR(20) DEFAULT '1.0',
    
    -- Exam structure
    total_sections INTEGER NOT NULL DEFAULT 4,
    total_marks INTEGER NOT NULL,
    time_limit_minutes INTEGER NOT NULL DEFAULT 12,
    prep_time_minutes INTEGER DEFAULT 15, -- Time for preparation (photocard/reading)
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    is_practice BOOLEAN DEFAULT false, -- Allow retakes in practice mode
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Unique constraint for language + level + identifier
    CONSTRAINT unique_speaking_assessment UNIQUE (language, level, identifier)
);

-- =====================================================
-- Table 2: Speaking Questions/Prompts
-- Individual questions within each section
-- =====================================================
CREATE TABLE IF NOT EXISTS aqa_speaking_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES aqa_speaking_assessments(id) ON DELETE CASCADE,
    
    -- Section information
    section_type VARCHAR(50) NOT NULL CHECK (section_type IN (
        'roleplay',
        'reading_aloud',
        'short_conversation',
        'photocard',
        'general_conversation'
    )),
    section_number INTEGER NOT NULL,
    question_number INTEGER NOT NULL,
    
    -- Question content
    title VARCHAR(255),
    prompt_text TEXT NOT NULL, -- The question or instruction shown
    prompt_audio_url TEXT, -- Optional audio for listening prompts
    context_text TEXT, -- Scenario/context for roleplay
    
    -- For reading aloud
    reading_text TEXT, -- Text to read aloud
    
    -- For photocard
    photo_urls TEXT[], -- Array of photo URLs
    theme VARCHAR(100), -- e.g., 'technology', 'environment'
    bullet_points TEXT[], -- Guidance points for discussion
    
    -- Grading
    marks INTEGER NOT NULL DEFAULT 2,
    time_limit_seconds INTEGER, -- Per-question time limit
    
    -- Rubric configuration
    rubric_type VARCHAR(50) DEFAULT 'standard',
    rubric_config JSONB, -- Custom rubric overrides
    
    -- Metadata
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ordering constraint
    CONSTRAINT unique_speaking_question UNIQUE (assessment_id, section_number, question_number)
);

-- =====================================================
-- Table 3: Speaking Exam Results (Parent)
-- Overall exam results for a student
-- =====================================================
CREATE TABLE IF NOT EXISTS aqa_speaking_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES aqa_speaking_assessments(id),
    student_id UUID NOT NULL REFERENCES auth.users(id),
    assignment_id UUID, -- Links to assignment if applicable
    school_id UUID,
    
    -- Scores
    total_score INTEGER DEFAULT 0,
    max_score INTEGER NOT NULL,
    percentage_score DECIMAL(5,2) DEFAULT 0,
    gcse_grade INTEGER, -- 1-9 grade
    
    -- Section breakdowns
    roleplay_score INTEGER DEFAULT 0,
    roleplay_max INTEGER DEFAULT 0,
    reading_aloud_score INTEGER DEFAULT 0,
    reading_aloud_max INTEGER DEFAULT 0,
    short_conversation_score INTEGER DEFAULT 0,
    short_conversation_max INTEGER DEFAULT 0,
    photocard_score INTEGER DEFAULT 0,
    photocard_max INTEGER DEFAULT 0,
    general_conversation_score INTEGER DEFAULT 0,
    general_conversation_max INTEGER DEFAULT 0,
    
    -- Time tracking
    total_time_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN (
        'in_progress',
        'pending_review',
        'completed',
        'reviewed',
        'overridden'
    )),
    
    -- Teacher review
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    teacher_notes TEXT,
    
    -- Performance analytics
    performance_metrics JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table 4: Speaking Question Responses
-- Individual question responses with audio and transcription
-- =====================================================
CREATE TABLE IF NOT EXISTS aqa_speaking_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_id UUID NOT NULL REFERENCES aqa_speaking_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES aqa_speaking_questions(id),
    student_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Audio recording
    audio_file_url TEXT, -- Stored audio file URL
    audio_duration_seconds DECIMAL(10,2),
    audio_format VARCHAR(20) DEFAULT 'webm',
    
    -- Transcription
    original_transcription TEXT, -- Raw transcription from API
    transcription_confidence DECIMAL(5,4), -- Confidence score from API
    student_edited_transcription TEXT, -- Student's corrections
    final_transcription TEXT, -- Transcription used for grading
    student_verified BOOLEAN DEFAULT false,
    transcription_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Grading
    score INTEGER DEFAULT 0,
    max_score INTEGER NOT NULL,
    is_graded BOOLEAN DEFAULT false,
    graded_at TIMESTAMP WITH TIME ZONE,
    
    -- Detailed scoring
    communication_score INTEGER,
    communication_max INTEGER,
    language_quality_score INTEGER,
    language_quality_max INTEGER,
    
    -- Criteria breakdown
    criteria_scores JSONB DEFAULT '{}',
    -- Example: {
    --   "has_verb": true,
    --   "correct_tense": true,
    --   "answers_question": true,
    --   "grammar_accurate": false
    -- }
    
    -- AI feedback
    ai_feedback TEXT,
    ai_suggestions TEXT[],
    errors_detected JSONB DEFAULT '[]',
    -- Example: [
    --   {"type": "grammar", "issue": "Missing article", "example": "..."}
    -- ]
    
    -- Teacher override
    teacher_override_score INTEGER,
    teacher_override_reason TEXT,
    overridden_by UUID REFERENCES auth.users(id),
    overridden_at TIMESTAMP WITH TIME ZONE,
    
    -- Time tracking
    time_spent_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    
    -- Retry tracking (for practice mode)
    attempt_number INTEGER DEFAULT 1,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint per question per result
    CONSTRAINT unique_speaking_response UNIQUE (result_id, question_id)
);

-- =====================================================
-- Table 5: Rubric Templates
-- Reusable rubric configurations for different sections/tiers
-- =====================================================
CREATE TABLE IF NOT EXISTS speaking_rubric_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('foundation', 'higher')),
    language VARCHAR(10), -- NULL means applies to all languages
    
    -- Rubric definition
    total_marks INTEGER NOT NULL,
    criteria JSONB NOT NULL,
    -- Example for roleplay:
    -- {
    --   "communication": {
    --     "max": 5,
    --     "levels": {
    --       "5": "All tasks completed, clear communication",
    --       "3-4": "Most tasks completed, generally clear",
    --       "1-2": "Some tasks completed, hesitant",
    --       "0": "Very limited response"
    --     }
    --   },
    --   "language_quality": {
    --     "max": 5,
    --     "levels": {...}
    --   }
    -- }
    
    -- Prompt template for AI grading
    ai_prompt_template TEXT NOT NULL,
    
    -- Requirements
    requirements JSONB DEFAULT '{}',
    -- Example: {
    --   "must_have_verb": true,
    --   "required_tense": "present",
    --   "min_response_length": 10
    -- }
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Assessment lookups
CREATE INDEX IF NOT EXISTS idx_speaking_assessments_language_level 
    ON aqa_speaking_assessments(language, level);
CREATE INDEX IF NOT EXISTS idx_speaking_assessments_active 
    ON aqa_speaking_assessments(is_active) WHERE is_active = true;

-- Question lookups
CREATE INDEX IF NOT EXISTS idx_speaking_questions_assessment 
    ON aqa_speaking_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_speaking_questions_section 
    ON aqa_speaking_questions(assessment_id, section_type, section_number);

-- Result lookups
CREATE INDEX IF NOT EXISTS idx_speaking_results_student 
    ON aqa_speaking_results(student_id);
CREATE INDEX IF NOT EXISTS idx_speaking_results_assessment 
    ON aqa_speaking_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_speaking_results_assignment 
    ON aqa_speaking_results(assignment_id) WHERE assignment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_speaking_results_status 
    ON aqa_speaking_results(status);
CREATE INDEX IF NOT EXISTS idx_speaking_results_school 
    ON aqa_speaking_results(school_id) WHERE school_id IS NOT NULL;

-- Response lookups
CREATE INDEX IF NOT EXISTS idx_speaking_responses_result 
    ON aqa_speaking_responses(result_id);
CREATE INDEX IF NOT EXISTS idx_speaking_responses_question 
    ON aqa_speaking_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_speaking_responses_student 
    ON aqa_speaking_responses(student_id);
CREATE INDEX IF NOT EXISTS idx_speaking_responses_ungraded 
    ON aqa_speaking_responses(is_graded) WHERE is_graded = false;

-- Rubric lookups
CREATE INDEX IF NOT EXISTS idx_rubric_templates_section 
    ON speaking_rubric_templates(section_type, tier);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

ALTER TABLE aqa_speaking_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_speaking_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_speaking_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_speaking_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_rubric_templates ENABLE ROW LEVEL SECURITY;

-- Assessments: Public read for active, admin write
CREATE POLICY "Public can view active speaking assessments"
    ON aqa_speaking_assessments FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Admins can manage speaking assessments"
    ON aqa_speaking_assessments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND (role = 'admin' OR role = 'teacher')
        )
    );

-- Questions: Public read for active assessments
CREATE POLICY "Public can view speaking questions"
    ON aqa_speaking_questions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM aqa_speaking_assessments 
            WHERE id = assessment_id AND is_active = true
        )
    );

-- Results: Students see own, teachers see class
CREATE POLICY "Students can view own speaking results"
    ON aqa_speaking_results FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Students can create own speaking results"
    ON aqa_speaking_results FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own in-progress results"
    ON aqa_speaking_results FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid() AND status = 'in_progress');

CREATE POLICY "Teachers can view school speaking results"
    ON aqa_speaking_results FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers can update speaking results for review"
    ON aqa_speaking_results FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND (role = 'teacher' OR role = 'admin')
        )
    );

-- Responses: Students see own
CREATE POLICY "Students can view own speaking responses"
    ON aqa_speaking_responses FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Students can create own speaking responses"
    ON aqa_speaking_responses FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own speaking responses"
    ON aqa_speaking_responses FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can view all speaking responses"
    ON aqa_speaking_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers can update speaking responses"
    ON aqa_speaking_responses FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND (role = 'teacher' OR role = 'admin')
        )
    );

-- Rubric templates: Public read, admin write
CREATE POLICY "Public can view rubric templates"
    ON speaking_rubric_templates FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Admins can manage rubric templates"
    ON speaking_rubric_templates FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- Trigger for updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_speaking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER speaking_assessments_updated_at
    BEFORE UPDATE ON aqa_speaking_assessments
    FOR EACH ROW EXECUTE FUNCTION update_speaking_updated_at();

CREATE TRIGGER speaking_questions_updated_at
    BEFORE UPDATE ON aqa_speaking_questions
    FOR EACH ROW EXECUTE FUNCTION update_speaking_updated_at();

CREATE TRIGGER speaking_results_updated_at
    BEFORE UPDATE ON aqa_speaking_results
    FOR EACH ROW EXECUTE FUNCTION update_speaking_updated_at();

CREATE TRIGGER speaking_responses_updated_at
    BEFORE UPDATE ON aqa_speaking_responses
    FOR EACH ROW EXECUTE FUNCTION update_speaking_updated_at();

-- =====================================================
-- Insert Default Rubric Templates
-- =====================================================

INSERT INTO speaking_rubric_templates (name, section_type, tier, total_marks, criteria, ai_prompt_template, requirements)
VALUES 
-- Foundation Roleplay
('Foundation Roleplay', 'roleplay', 'foundation', 10, 
'{
  "communication": {
    "max": 5,
    "levels": {
      "5": "All tasks completed, clear communication",
      "4": "Most tasks completed, clear communication",
      "3": "Some tasks completed, generally clear",
      "2": "Limited tasks completed, hesitant",
      "1": "Very limited response, unclear",
      "0": "No relevant response"
    }
  },
  "language_quality": {
    "max": 5,
    "levels": {
      "5": "Generally accurate, good range of vocabulary",
      "4": "Mostly accurate, reasonable vocabulary",
      "3": "More accurate than inaccurate, basic vocabulary",
      "2": "Limited accuracy, very basic vocabulary",
      "1": "Very limited accuracy, minimal vocabulary",
      "0": "No comprehensible language"
    }
  }
}'::jsonb,
'You are an experienced AQA examiner assessing Foundation tier speaking exams.

SECTION: Roleplay
MARKS AVAILABLE: 10 (5 Communication + 5 Language Quality)
TIER: Foundation

ASSESSMENT CRITERIA:
1. Communication (0-5 marks):
   - 5: All tasks completed, clear communication
   - 4: Most tasks completed, clear communication  
   - 3: Some tasks completed, generally clear
   - 1-2: Limited tasks, hesitant
   - 0: No relevant response

2. Language Quality (0-5 marks):
   - 5: Generally accurate, good range of vocabulary
   - 3-4: More accurate than inaccurate, reasonable vocab
   - 1-2: Limited accuracy, basic vocab
   - 0: No comprehensible language

FOUNDATION TIER REQUIREMENTS:
- Every sentence must contain a verb
- Present tense required unless past is specifically needed
- Must answer the prompt fully

QUESTION: "{question_text}"
EXPECTED CONTENT: {expected_content}

STUDENT RESPONSE: "{transcription}"

Assess and return JSON with:
{
  "communication_score": (0-5),
  "language_quality_score": (0-5),
  "total_score": (0-10),
  "criteria_met": {
    "has_verb": boolean,
    "correct_tense": boolean,
    "answers_question": boolean,
    "grammar_accurate": boolean
  },
  "errors": [{"type": "grammar|vocabulary|pronunciation", "issue": "description", "correction": "correct form"}],
  "feedback": "2-3 sentence constructive feedback",
  "suggestions": ["improvement tip 1", "improvement tip 2"]
}',
'{"must_have_verb": true, "required_tense": "present", "min_words": 5}'::jsonb),

-- Higher Roleplay
('Higher Roleplay', 'roleplay', 'higher', 10,
'{
  "communication": {
    "max": 5,
    "levels": {
      "5": "All tasks completed with excellent detail",
      "4": "All tasks completed, clear and effective",
      "3": "Most tasks completed well",
      "2": "Some tasks completed",
      "1": "Limited response",
      "0": "No relevant response"
    }
  },
  "language_quality": {
    "max": 5,
    "levels": {
      "5": "Accurate with complex structures and wide vocabulary",
      "4": "Generally accurate with good range",
      "3": "More accurate than inaccurate",
      "2": "Limited accuracy",
      "1": "Very limited",
      "0": "No comprehensible language"
    }
  }
}'::jsonb,
'You are an experienced AQA examiner assessing Higher tier speaking exams.

SECTION: Roleplay
MARKS AVAILABLE: 10 (5 Communication + 5 Language Quality)
TIER: Higher

HIGHER TIER EXPECTATIONS:
- Complex sentence structures expected
- Range of tenses (past, present, future, conditional)
- Sophisticated vocabulary
- Justifications and opinions where appropriate

QUESTION: "{question_text}"
EXPECTED CONTENT: {expected_content}

STUDENT RESPONSE: "{transcription}"

Assess and return JSON with:
{
  "communication_score": (0-5),
  "language_quality_score": (0-5),
  "total_score": (0-10),
  "criteria_met": {
    "has_verb": boolean,
    "variety_of_tenses": boolean,
    "complex_structures": boolean,
    "answers_question_fully": boolean,
    "provides_justification": boolean
  },
  "errors": [{"type": "grammar|vocabulary|pronunciation", "issue": "description", "correction": "correct form"}],
  "feedback": "2-3 sentence constructive feedback",
  "suggestions": ["improvement tip 1", "improvement tip 2"]
}',
'{"must_have_verb": true, "complex_structures_expected": true, "min_words": 10}'::jsonb),

-- Foundation Reading Aloud
('Foundation Reading Aloud', 'reading_aloud', 'foundation', 10,
'{
  "pronunciation": {
    "max": 5,
    "levels": {
      "5": "Excellent pronunciation, natural intonation",
      "4": "Good pronunciation, generally clear",
      "3": "Acceptable pronunciation, understandable",
      "2": "Some pronunciation issues",
      "1": "Significant pronunciation problems",
      "0": "Unintelligible"
    }
  },
  "fluency": {
    "max": 5,
    "levels": {
      "5": "Smooth, natural flow",
      "4": "Good pace, minor hesitations",
      "3": "Acceptable pace, some hesitations",
      "2": "Slow, frequent hesitations",
      "1": "Very halting",
      "0": "Could not complete"
    }
  }
}'::jsonb,
'You are an experienced AQA examiner assessing Foundation tier reading aloud.

SECTION: Reading Aloud
MARKS AVAILABLE: 10 (5 Pronunciation + 5 Fluency)
TIER: Foundation

ORIGINAL TEXT: "{original_text}"
STUDENT TRANSCRIPTION: "{transcription}"

Compare the transcription to the original text. Award marks for:

1. Pronunciation (0-5 marks):
   - Accuracy of sounds and accents
   - Natural intonation patterns

2. Fluency (0-5 marks):
   - Smooth delivery without excessive pauses
   - Natural pace

Calculate accuracy percentage by comparing words read correctly.

Return JSON:
{
  "pronunciation_score": (0-5),
  "fluency_score": (0-5),
  "total_score": (0-10),
  "accuracy_percentage": (0-100),
  "words_correct": number,
  "words_total": number,
  "mispronounced_words": ["word1", "word2"],
  "feedback": "constructive feedback",
  "suggestions": ["tip 1", "tip 2"]
}',
'{}'::jsonb),

-- Foundation Photocard
('Foundation Photocard', 'photocard', 'foundation', 15,
'{
  "description": {
    "max": 5,
    "levels": {
      "5": "Full description of photo with relevant detail",
      "4": "Good description covering main elements",
      "3": "Adequate description",
      "2": "Limited description",
      "1": "Very limited",
      "0": "No relevant description"
    }
  },
  "discussion": {
    "max": 5,
    "levels": {
      "5": "Excellent development of theme",
      "4": "Good discussion of theme",
      "3": "Some relevant discussion",
      "2": "Limited engagement with theme",
      "1": "Very limited",
      "0": "No relevant discussion"
    }
  },
  "language_quality": {
    "max": 5,
    "levels": {
      "5": "Accurate with good vocabulary",
      "4": "Mostly accurate",
      "3": "More accurate than inaccurate",
      "2": "Limited accuracy",
      "1": "Very limited",
      "0": "No comprehensible language"
    }
  }
}'::jsonb,
'You are an experienced AQA examiner assessing Foundation tier photocard discussion.

SECTION: Photocard
MARKS AVAILABLE: 15 (5 Description + 5 Discussion + 5 Language Quality)
TIER: Foundation

THEME: {theme}
BULLET POINTS PROVIDED: {bullet_points}

STUDENT RESPONSE: "{transcription}"

Assess:
1. Description (0-5): How well did they describe the photo?
2. Discussion (0-5): Did they address the theme and bullet points?
3. Language Quality (0-5): Grammar and vocabulary accuracy

Return JSON:
{
  "description_score": (0-5),
  "discussion_score": (0-5),
  "language_quality_score": (0-5),
  "total_score": (0-15),
  "bullet_points_addressed": [true/false for each],
  "criteria_met": {
    "described_photo": boolean,
    "addressed_theme": boolean,
    "gave_opinions": boolean
  },
  "errors": [...],
  "feedback": "constructive feedback",
  "suggestions": [...]
}',
'{"must_describe_photo": true, "must_address_theme": true}'::jsonb),

-- Foundation General Conversation
('Foundation General Conversation', 'general_conversation', 'foundation', 30,
'{
  "communication": {
    "max": 15,
    "description": "Based on information points conveyed (9 max for Foundation)"
  },
  "language_quality": {
    "max": 15,
    "description": "Range, accuracy, and complexity of language"
  }
}'::jsonb,
'You are an experienced AQA examiner assessing Foundation tier general conversation.

SECTION: General Conversation
MARKS AVAILABLE: 30 (15 Communication + 15 Language Quality)
TIER: Foundation
INFORMATION POINTS REQUIRED: 9

TOPIC: {topic}

STUDENT RESPONSE: "{transcription}"

Foundation tier assessment:
1. Communication (0-15): Count distinct information points (max 9 for Foundation)
   - 15 marks = 9 clear information points
   - Scale proportionally for fewer points
   
2. Language Quality (0-15):
   - Range of vocabulary
   - Grammatical accuracy
   - Variety of structures (tenses, connectives)

Return JSON:
{
  "communication_score": (0-15),
  "language_quality_score": (0-15),
  "total_score": (0-30),
  "information_points_count": number,
  "information_points": ["point 1", "point 2", ...],
  "tenses_used": ["present", "past", ...],
  "connectives_used": ["y", "pero", ...],
  "errors": [...],
  "feedback": "detailed constructive feedback",
  "suggestions": [...]
}',
'{"min_information_points": 3, "foundation_max_points": 9}'::jsonb),

-- Higher General Conversation  
('Higher General Conversation', 'general_conversation', 'higher', 30,
'{
  "communication": {
    "max": 15,
    "description": "Based on information points conveyed (15 max for Higher)"
  },
  "language_quality": {
    "max": 15,
    "description": "Range, accuracy, and complexity of language"
  }
}'::jsonb,
'You are an experienced AQA examiner assessing Higher tier general conversation.

SECTION: General Conversation
MARKS AVAILABLE: 30 (15 Communication + 15 Language Quality)
TIER: Higher
INFORMATION POINTS REQUIRED: 15

TOPIC: {topic}

STUDENT RESPONSE: "{transcription}"

Higher tier assessment:
1. Communication (0-15): Count distinct information points (max 15 for Higher)
   - 15 marks = 15 clear information points
   - Must include complex ideas and justifications
   
2. Language Quality (0-15):
   - Wide range of sophisticated vocabulary
   - High grammatical accuracy
   - Complex structures (subjunctive, conditional, multiple tenses)
   - Effective use of connectives and discourse markers

Return JSON:
{
  "communication_score": (0-15),
  "language_quality_score": (0-15),
  "total_score": (0-30),
  "information_points_count": number,
  "information_points": ["point 1", "point 2", ...],
  "complex_structures_used": ["subjunctive", "conditional", ...],
  "tenses_used": ["present", "preterite", "imperfect", "future", ...],
  "sophisticated_vocabulary": ["word1", "word2", ...],
  "errors": [...],
  "feedback": "detailed constructive feedback for higher tier student",
  "suggestions": [...]
}',
'{"min_information_points": 8, "higher_max_points": 15, "complex_structures_expected": true}'::jsonb);

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE aqa_speaking_assessments IS 'Speaking exam definitions with metadata and configuration';
COMMENT ON TABLE aqa_speaking_questions IS 'Individual questions/prompts within speaking exams';
COMMENT ON TABLE aqa_speaking_results IS 'Student exam results with section breakdowns';
COMMENT ON TABLE aqa_speaking_responses IS 'Individual question responses with audio, transcription, and grading';
COMMENT ON TABLE speaking_rubric_templates IS 'Reusable AI grading rubric templates';

COMMENT ON COLUMN aqa_speaking_responses.original_transcription IS 'Raw transcription from Whisper API';
COMMENT ON COLUMN aqa_speaking_responses.student_edited_transcription IS 'Student corrections to transcription';
COMMENT ON COLUMN aqa_speaking_responses.final_transcription IS 'Verified transcription used for grading';
COMMENT ON COLUMN aqa_speaking_responses.criteria_scores IS 'Detailed breakdown of criteria met/failed';
COMMENT ON COLUMN aqa_speaking_responses.errors_detected IS 'AI-detected errors with corrections';
