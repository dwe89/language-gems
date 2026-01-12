import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Allow up to 30 seconds for assessment

// Use Groq for ultra-fast and cheap LLM inference
// Llama 3.1 8B Instant: ~$0.05/M input, $0.08/M output (~80% cheaper than GPT-4.1-nano)
// If quality is insufficient, upgrade to: 'openai/gpt-oss-20b' (~25% cheaper than nano)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Section type definitions
type SectionType = 'roleplay' | 'reading_aloud' | 'short_conversation' | 'photocard' | 'general_conversation';
type Tier = 'foundation' | 'higher';
type Language = 'es' | 'fr' | 'de';

// Language display names
const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
};

// Assessment request interface
interface AssessmentRequest {
  transcription: string;
  sectionType: SectionType;
  tier: Tier;
  language: Language;
  questionText: string;
  questionNumber?: number;
  expectedContent?: string;
  originalText?: string; // For reading aloud
  theme?: string; // For photocard/general conversation
  bulletPoints?: string[]; // For photocard
  topic?: string; // For general conversation
  customRubric?: any; // Custom rubric override
}

// Assessment result interfaces
interface CriteriaScore {
  score: number;
  max: number;
  feedback?: string;
}

interface ErrorDetail {
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'structure';
  issue: string;
  correction?: string;
  example?: string;
}

interface AssessmentResult {
  success: boolean;
  totalScore: number;
  maxScore: number;
  percentage: number;
  criteriaScores: Record<string, CriteriaScore>;
  criteriaMet: Record<string, boolean>;
  errors: ErrorDetail[];
  feedback: string;
  suggestions: string[];
  rawAiResponse?: string;
  processingTimeMs?: number;
}

/**
 * Build the assessment prompt based on section type
 */
function buildPrompt(request: AssessmentRequest): string {
  const languageName = LANGUAGE_NAMES[request.language];

  // Base context
  let prompt = `You are an experienced AQA examiner assessing ${request.tier === 'higher' ? 'Higher' : 'Foundation'} tier ${languageName} speaking exams.

`;

  switch (request.sectionType) {
    case 'roleplay':
      prompt += buildRoleplayPrompt(request, languageName);
      break;
    case 'reading_aloud':
      prompt += buildReadingAloudPrompt(request, languageName);
      break;
    case 'short_conversation':
      prompt += buildShortConversationPrompt(request, languageName);
      break;
    case 'photocard':
      prompt += buildPhotocardPrompt(request, languageName);
      break;
    case 'general_conversation':
      prompt += buildGeneralConversationPrompt(request, languageName);
      break;
    default:
      prompt += buildRoleplayPrompt(request, languageName);
  }

  return prompt;
}

function buildRoleplayPrompt(request: AssessmentRequest, languageName: string): string {
  const isHigher = request.tier === 'higher';

  return `SECTION: Roleplay Question ${request.questionNumber || 1}
MARKS AVAILABLE: 10 (5 Communication + 5 Language Quality)
TIER: ${request.tier === 'higher' ? 'Higher' : 'Foundation'}

ASSESSMENT CRITERIA:
1. Communication (0-5 marks):
   - 5: All tasks completed, clear communication
   - 4: Most tasks completed, clear communication
   - 3: Some tasks completed, generally clear
   - 1-2: Limited tasks completed, hesitant
   - 0: No relevant response

2. Language Quality (0-5 marks):
   - 5: ${isHigher ? 'Accurate with complex structures and wide vocabulary' : 'Generally accurate, good range of vocabulary'}
   - 3-4: ${isHigher ? 'Generally accurate with good range' : 'More accurate than inaccurate, reasonable vocabulary'}
   - 1-2: Limited accuracy, ${isHigher ? 'limited' : 'basic'} vocabulary
   - 0: No comprehensible language

${request.tier === 'foundation' ? `FOUNDATION TIER REQUIREMENTS:
- Every sentence must contain a verb
- Present tense required unless past is specifically needed
- Must answer the prompt fully
` : `HIGHER TIER EXPECTATIONS:
- Complex sentence structures expected
- Range of tenses (past, present, future, conditional)
- Sophisticated vocabulary
- Justifications and opinions where appropriate
`}
QUESTION: "${request.questionText}"
${request.expectedContent ? `EXPECTED CONTENT: ${request.expectedContent}` : ''}

STUDENT'S RESPONSE:
"${request.transcription}"

Assess this response and return ONLY a JSON object (no markdown, no explanation) with this exact structure:
{
  "communication_score": <0-5>,
  "language_quality_score": <0-5>,
  "total_score": <0-10>,
  "criteria_met": {
    "has_verb": <boolean>,
    "correct_tense": <boolean>,
    "answers_question": <boolean>,
    "grammar_accurate": <boolean>${isHigher ? `,
    "variety_of_tenses": <boolean>,
    "complex_structures": <boolean>,
    "provides_justification": <boolean>` : ''}
  },
  "errors": [
    {"type": "grammar|vocabulary|structure", "issue": "<description>", "correction": "<correct form>"}
  ],
  "feedback": "<2-3 sentence constructive feedback>",
  "suggestions": ["<improvement tip 1>", "<improvement tip 2>"]
}`;
}

function buildReadingAloudPrompt(request: AssessmentRequest, languageName: string): string {
  return `SECTION: Reading Aloud
MARKS AVAILABLE: 10 (5 Pronunciation + 5 Fluency)
TIER: ${request.tier === 'higher' ? 'Higher' : 'Foundation'}

ORIGINAL TEXT TO READ:
"${request.originalText}"

STUDENT'S TRANSCRIBED READING:
"${request.transcription}"

Compare the student's transcription to the original text. Consider:
1. How accurately they pronounced words (reflected in transcription accuracy)
2. Whether they maintained natural flow and intonation

Award marks for:
1. Pronunciation (0-5 marks):
   - 5: Excellent pronunciation, clear articulation of all words
   - 4: Good pronunciation, minor issues
   - 3: Acceptable, most words clear
   - 2: Some pronunciation issues affecting clarity
   - 1: Significant pronunciation problems
   - 0: Unintelligible

2. Fluency (0-5 marks):
   - 5: Smooth, natural reading
   - 4: Good pace, minor hesitations
   - 3: Acceptable pace, some hesitations
   - 2: Slow, frequent hesitations
   - 1: Very halting
   - 0: Could not complete

Return ONLY a JSON object:
{
  "pronunciation_score": <0-5>,
  "fluency_score": <0-5>,
  "total_score": <0-10>,
  "accuracy_percentage": <0-100>,
  "words_correct": <number>,
  "words_total": <number>,
  "mispronounced_words": ["<word1>", "<word2>"],
  "criteria_met": {
    "all_words_attempted": <boolean>,
    "natural_intonation": <boolean>,
    "appropriate_pace": <boolean>
  },
  "errors": [
    {"type": "pronunciation", "issue": "<word or phrase>", "correction": "<how it should sound>"}
  ],
  "feedback": "<2-3 sentence constructive feedback>",
  "suggestions": ["<tip 1>", "<tip 2>"]
}`;
}

function buildShortConversationPrompt(request: AssessmentRequest, languageName: string): string {
  // Similar to roleplay but with conversation context
  return buildRoleplayPrompt(request, languageName).replace('Roleplay', 'Short Conversation');
}

function buildPhotocardPrompt(request: AssessmentRequest, languageName: string): string {
  return `SECTION: Photocard Discussion
MARKS AVAILABLE: 15 (5 Description + 5 Discussion + 5 Language Quality)
TIER: ${request.tier === 'higher' ? 'Higher' : 'Foundation'}

THEME: ${request.theme || 'General'}
BULLET POINTS PROVIDED:
${request.bulletPoints?.map((bp, i) => `${i + 1}. ${bp}`).join('\n') || 'No bullet points provided'}

STUDENT'S RESPONSE:
"${request.transcription}"

Assess:
1. Description (0-5): How well did they describe the photo?
   - 5: Full, detailed description
   - 3-4: Good coverage of main elements
   - 1-2: Limited description
   - 0: No relevant description

2. Discussion (0-5): Did they address the theme and bullet points?
   - 5: All points addressed with development
   - 3-4: Most points addressed
   - 1-2: Some points touched on
   - 0: No relevant discussion

3. Language Quality (0-5): Grammar and vocabulary accuracy
   ${request.tier === 'higher' ? '- Higher tier: expect complex structures and sophisticated vocabulary' : '- Foundation: accurate use of basic structures'}

Return ONLY a JSON object:
{
  "description_score": <0-5>,
  "discussion_score": <0-5>,
  "language_quality_score": <0-5>,
  "total_score": <0-15>,
  "bullet_points_addressed": [<boolean for each bullet point>],
  "criteria_met": {
    "described_photo": <boolean>,
    "addressed_theme": <boolean>,
    "gave_opinions": <boolean>,
    "used_variety_of_structures": <boolean>
  },
  "errors": [
    {"type": "grammar|vocabulary|structure", "issue": "<description>", "correction": "<correct form>"}
  ],
  "feedback": "<2-3 sentence constructive feedback>",
  "suggestions": ["<tip 1>", "<tip 2>"]
}`;
}

function buildGeneralConversationPrompt(request: AssessmentRequest, languageName: string): string {
  const isHigher = request.tier === 'higher';
  const maxPoints = isHigher ? 15 : 9;

  return `SECTION: General Conversation
MARKS AVAILABLE: 30 (15 Communication + 15 Language Quality)
TIER: ${request.tier === 'higher' ? 'Higher' : 'Foundation'}
INFORMATION POINTS REQUIRED: ${maxPoints}

TOPIC: ${request.topic || 'General'}

STUDENT'S RESPONSE:
"${request.transcription}"

${isHigher ? `HIGHER TIER ASSESSMENT:
- Count distinct information points (max 15)
- Expect complex ideas and justifications
- Look for: subjunctive, conditional, multiple tenses
- Sophisticated vocabulary and discourse markers` : `FOUNDATION TIER ASSESSMENT:
- Count distinct information points (max 9)
- Present tense primarily, with some past/future
- Clear, accurate basic structures`}

Communication scoring:
- Award marks based on information points conveyed
- ${maxPoints} clear points = 15 marks
- Scale proportionally for fewer points

Language Quality scoring:
- Range of vocabulary
- Grammatical accuracy
- Variety of structures

Return ONLY a JSON object:
{
  "communication_score": <0-15>,
  "language_quality_score": <0-15>,
  "total_score": <0-30>,
  "information_points_count": <number>,
  "information_points": ["<point 1>", "<point 2>", ...],
  ${isHigher ? `"complex_structures_used": ["<structure 1>", ...],` : ''}
  "tenses_used": ["<tense 1>", ...],
  "connectives_used": ["<connective 1>", ...],
  "criteria_met": {
    "minimum_points_achieved": <boolean>,
    "variety_of_tenses": <boolean>,
    "accurate_grammar": <boolean>,
    "relevant_to_topic": <boolean>
  },
  "errors": [
    {"type": "grammar|vocabulary|structure", "issue": "<description>", "correction": "<correct form>"}
  ],
  "feedback": "<3-4 sentence detailed constructive feedback>",
  "suggestions": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;
}

/**
 * Parse AI response and normalize scores
 */
function parseAIResponse(response: string, sectionType: SectionType): AssessmentResult {
  try {
    // Try to extract JSON from the response
    let jsonStr = response;

    // Remove markdown code blocks if present
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    // GPT OSS 20B sometimes returns Python-style single-quoted JSON - convert to valid JSON
    jsonStr = jsonStr.trim()
      .replace(/'/g, '"')  // Convert all single quotes to double quotes
      .replace(/(\w)"(\w)/g, "$1'$2");  // Restore apostrophes within words (e.g., don't, it's)

    // Parse the JSON
    const parsed = JSON.parse(jsonStr);

    // Normalize based on section type
    const maxScores: Record<SectionType, number> = {
      roleplay: 10,
      reading_aloud: 10,
      short_conversation: 10,
      photocard: 15,
      general_conversation: 30,
    };

    const maxScore = maxScores[sectionType];
    const totalScore = Math.min(parsed.total_score || 0, maxScore);

    // Build criteria scores based on what was returned
    const criteriaScores: Record<string, CriteriaScore> = {};

    if (parsed.communication_score !== undefined) {
      criteriaScores.communication = {
        score: parsed.communication_score,
        max: sectionType === 'general_conversation' ? 15 : 5,
      };
    }
    if (parsed.language_quality_score !== undefined) {
      criteriaScores.language_quality = {
        score: parsed.language_quality_score,
        max: sectionType === 'general_conversation' ? 15 : 5,
      };
    }
    if (parsed.pronunciation_score !== undefined) {
      criteriaScores.pronunciation = {
        score: parsed.pronunciation_score,
        max: 5,
      };
    }
    if (parsed.fluency_score !== undefined) {
      criteriaScores.fluency = {
        score: parsed.fluency_score,
        max: 5,
      };
    }
    if (parsed.description_score !== undefined) {
      criteriaScores.description = {
        score: parsed.description_score,
        max: 5,
      };
    }
    if (parsed.discussion_score !== undefined) {
      criteriaScores.discussion = {
        score: parsed.discussion_score,
        max: 5,
      };
    }

    return {
      success: true,
      totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      criteriaScores,
      criteriaMet: parsed.criteria_met || {},
      errors: parsed.errors || [],
      feedback: parsed.feedback || 'Assessment completed.',
      suggestions: parsed.suggestions || [],
    };
  } catch (error) {
    console.error('[AssessResponse] Parse error:', error);
    return {
      success: false,
      totalScore: 0,
      maxScore: 10,
      percentage: 0,
      criteriaScores: {},
      criteriaMet: {},
      errors: [],
      feedback: 'Failed to parse assessment response.',
      suggestions: [],
      rawAiResponse: response,
    };
  }
}

/**
 * POST /api/speaking/assess
 * Assess a speaking response using Claude AI
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const body: AssessmentRequest = await request.json();

    // Validate required fields
    if (!body.transcription) {
      return NextResponse.json(
        { success: false, error: 'No transcription provided' },
        { status: 400 }
      );
    }

    if (!body.sectionType) {
      return NextResponse.json(
        { success: false, error: 'Section type is required' },
        { status: 400 }
      );
    }

    // Build the prompt
    const prompt = buildPrompt(body);

    console.log(`[AssessResponse] Assessing ${body.sectionType} response in ${body.language}`);

    // Call Groq API with GPT OSS 20B for professional-grade speaking assessment
    // Cost: ~$0.075/M input, $0.30/M output (25% cheaper than GPT-4.1-nano)
    // Catches subtle errors (A-Level subjunctive, German word-order) that 8B misses
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b', // Professional Teacher - catches subtle grammar errors
      max_tokens: 1024,
      temperature: 0.3, // Lower temperature for more consistent grading
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an expert GCSE language examiner. Always respond with valid JSON only, no markdown or explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the response text
    const responseText = completion.choices[0]?.message?.content || '';

    // Parse and normalize the response
    const result = parseAIResponse(responseText, body.sectionType);
    result.processingTimeMs = Date.now() - startTime;

    console.log(`[AssessResponse] Completed: ${result.totalScore}/${result.maxScore} (${result.processingTimeMs}ms)`);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[AssessResponse] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Assessment failed',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/speaking/assess
 * Get available rubric templates
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sectionType = searchParams.get('sectionType');
    const tier = searchParams.get('tier');

    let query = supabase
      .from('speaking_rubric_templates')
      .select('*')
      .eq('is_active', true);

    if (sectionType) {
      query = query.eq('section_type', sectionType);
    }

    if (tier) {
      query = query.eq('tier', tier);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[AssessResponse] Error fetching rubrics:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch rubrics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rubrics: data || [],
    });

  } catch (error: any) {
    console.error('[AssessResponse] GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
