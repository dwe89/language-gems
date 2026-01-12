import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// ============================================================================
// AI PROVIDER CONFIGURATION - Direct API calls with automatic failover
// ============================================================================

// Initialize Groq provider (primary for fast, cost-effective marking)
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize OpenAI provider (reliable fallback)
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model hierarchy for marking (in order of preference):
// 1. Primary: Groq GPT OSS 20B - Fast, accurate, cost-effective
// 2. Fallback 1: OpenAI GPT-4.1-nano - Reliable, slightly more expensive
// 3. Fallback 2: Groq GPT OSS 120B - Most capable, slowest
const MARKING_MODELS = [
  { provider: 'groq', model: groq('openai/gpt-oss-20b'), name: 'GPT OSS 20B' },
  { provider: 'openai', model: openai('gpt-4.1-nano'), name: 'GPT-4.1-nano' },
  { provider: 'groq', model: groq('openai/gpt-oss-120b'), name: 'GPT OSS 120B' },
];

// Helper to call AI with automatic fallback
async function generateObjectWithFallback<T>(
  schema: z.ZodType<T>,
  system: string,
  prompt: string
): Promise<{ object: T; modelUsed: string }> {
  let lastError: Error | null = null;

  for (const { model, name } of MARKING_MODELS) {
    try {
      console.log(`🤖 Attempting with ${name}...`);
      const { object } = await generateObject({
        model,
        schema,
        system,
        prompt,
      });
      console.log(`✅ Success with ${name}`);
      return { object, modelUsed: name };
    } catch (error: any) {
      console.warn(`⚠️ ${name} failed: ${error.message}`);
      lastError = error;
      // Continue to next model
    }
  }

  throw lastError || new Error('All AI models failed');
}

// ============================================================================
// ZOD SCHEMAS - Guarantees valid structured output from AI
// Using nullable() instead of optional() for OpenAI compatibility
// ============================================================================

const PhotoDescriptionSchema = z.object({
  totalScore: z.number().describe('Total score out of 10 (5 sentences x 2 marks each)'),
  sentenceScores: z.array(z.number()).nullable().describe('Score for each sentence (0, 1, or 2)'),
  sentenceAnalysis: z.array(z.string()).nullable().describe('Brief analysis for each sentence in English'),
  feedback: z.string().describe('Overall encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication')
});

const TranslationSchema = z.object({
  totalScore: z.number().describe('Total score out of 10'),
  gridOneScore: z.number().nullable().describe('Score for meaning (out of 5)'),
  gridTwoScore: z.number().nullable().describe('Score for vocabulary/grammar (out of 5)'),
  translationAnalysis: z.array(z.string()).nullable().describe('Analysis for each translation in English'),
  feedback: z.string().describe('Overall feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of improvements in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Major errors affecting meaning')
});

const ShortMessageSchema = z.object({
  totalScore: z.number().describe('Total score (ao2Score + ao3Score)'),
  ao2Score: z.number().nullable().describe('Communication score out of 5'),
  ao3Score: z.number().nullable().describe('Linguistic quality score out of 5'),
  bulletPointsCovered: z.number().nullable().describe('Number of bullet points addressed'),
  bulletPointsAnalysis: z.array(z.string()).nullable().describe('What was written about each bullet point'),
  feedback: z.string().describe('Constructive encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication'),
  vocabularyFeedback: z.string().nullable().describe('Assessment of vocabulary variety in English')
});

const ExtendedWritingFoundationSchema = z.object({
  totalScore: z.number().describe('Total score (ao2Score + ao3Score)'),
  ao2Score: z.number().nullable().describe('Communication score out of 10'),
  ao3Score: z.number().nullable().describe('Linguistic quality score out of 5'),
  bulletPointsCovered: z.number().nullable().describe('Number of bullet points addressed'),
  bulletPointsAnalysis: z.array(z.string()).nullable().describe('Analysis of each bullet point coverage'),
  timeFramesUsed: z.array(z.string()).nullable().describe('Time frames used (past, present, future)'),
  timeFramesSuccessful: z.number().nullable().describe('Number of successful time frame references'),
  feedback: z.string().describe('Constructive encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication'),
  vocabularyFeedback: z.string().nullable().describe('Assessment of vocabulary variety in English')
});

const ExtendedWritingHigherSchema = z.object({
  totalScore: z.number().describe('Total score (ao2Score + ao3Score)'),
  ao2Score: z.number().nullable().describe('Communication score out of 15'),
  ao3Score: z.number().nullable().describe('Linguistic quality score out of 10'),
  ao3GridOneScore: z.number().nullable().describe('Range and use of language (out of 5)'),
  ao3GridTwoScore: z.number().nullable().describe('Accuracy (out of 5)'),
  feedback: z.string().describe('Constructive encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication'),
  vocabularyFeedback: z.string().nullable().describe('Assessment of vocabulary variety in English')
});

// ============================================================================
// INTERFACES
// ============================================================================

interface MarkingCriteria {
  questionType: 'photo-description' | 'short-message' | 'gap-fill' | 'translation' | 'extended-writing';
  language: 'es' | 'fr' | 'de';
  maxMarks: number;
  wordCountRequirement?: number;
  specificCriteria?: string[];
  questionData?: any;
}

interface MarkingResult {
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  detailedFeedback: {
    strengths: string[];
    improvements: string[];
    grammarErrors?: string[];
    vocabularyFeedback?: string;
  };
}

interface QuestionResponse {
  questionId: string;
  questionType: string;
  response: any;
  criteria: MarkingCriteria;
}

function getLanguageName(code: string): string {
  const names = { 'es': 'Spanish', 'fr': 'French', 'de': 'German' };
  return names[code as keyof typeof names] || code;
}

// ============================================================================
// MARKING FUNCTIONS - Using Vercel AI SDK generateObject
// ============================================================================

async function markPhotoDescription(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const sentences = response.sentences || [];
  const languageName = getLanguageName(criteria.language);

  const systemPrompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE Foundation photo description task.

OFFICIAL AQA MARK SCHEME - Question 01 (Foundation) - Photo Description:
Maximum Marks: 10 (5 sentences x 2 marks each)

MARKING CRITERIA PER SENTENCE:
• 2 Marks: Sentence is relevant, communicates clearly, uses a conjugated verb
• 1 Mark: Some ambiguity OR delay in communication
• 0 Marks: Completely irrelevant, unintelligible, single word only, or no verb

CRITICAL GUIDANCE:
- ALL tenses are accepted
- MINOR errors (accents, gender, agreement, spelling) do NOT affect marks
- Only MAJOR errors that DESTROY communication should reduce marks
- Be GENEROUS - if in doubt, give the higher mark
- Short sentences are perfectly acceptable for full marks`;

  const userPrompt = `Grade these ${languageName} sentences describing a photo:

${sentences.map((s: string, i: number) => `${i + 1}. ${s || '[No response]'}`).join('\n')}

Award marks based on: relevance, clarity, and presence of a conjugated verb.
Provide ALL feedback in English only.`;

  console.log('🤖 [Photo Description] Calling generateObjectWithFallback...');

  const { object, modelUsed } = await generateObjectWithFallback(
    PhotoDescriptionSchema,
    systemPrompt,
    userPrompt
  );

  console.log(`✅ [Photo Description] Response from ${modelUsed}:`, object.totalScore);

  return {
    score: object.totalScore,
    maxScore: criteria.maxMarks,
    percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
    feedback: object.feedback,
    detailedFeedback: {
      strengths: object.strengths,
      improvements: object.improvements,
      grammarErrors: object.grammarErrors ?? undefined
    }
  };
}

async function markTranslation(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const translations = Object.values(response).filter(t => t && t.toString().trim() !== '');
  const languageName = getLanguageName(criteria.language);

  // Handle empty translations
  if (translations.length === 0) {
    return {
      score: 0,
      maxScore: criteria.maxMarks,
      percentage: 0,
      feedback: 'No translations were provided. You must attempt to translate each sentence to receive marks.',
      detailedFeedback: {
        strengths: [],
        improvements: ['You did not provide any translations. Try to translate each sentence, even if you are unsure.'],
        grammarErrors: ['No translations provided']
      }
    };
  }

  const systemPrompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE Higher translation task.

OFFICIAL AQA MARK SCHEME - Translation (10 marks total):
Grid One: Rendering of Original Meaning (Max 5 Marks)
- 5 Marks: 13-15 meaning elements communicated
- 4 Marks: 10-12 elements
- 3 Marks: 7-9 elements
- 2 Marks: 4-6 elements
- 1 Mark: 1-3 elements
- 0 Marks: No meaning communicated

Grid Two: Vocabulary and Grammar (Max 5 Marks)
- 5 Marks: Very good vocabulary, highly accurate grammar
- 4 Marks: Good vocabulary, accurate grammar
- 3 Marks: Adequate vocabulary, generally accurate
- 2 Marks: Limited vocabulary, inaccurate grammar
- 1 Mark: Very limited vocabulary
- 0 Marks: Does not meet standard

KEY: A 0 in Grid One = automatic 0 in Grid Two`;

  const userPrompt = `Grade these English to ${languageName} translations:

${translations.map((t: any, i: number) => `${i + 1}. ${t}`).join('\n')}

Assess meaning, vocabulary, and grammar accuracy.
Provide ALL feedback in English only.`;

  console.log('🤖 [Translation] Calling generateObjectWithFallback...');

  const { object, modelUsed } = await generateObjectWithFallback(
    TranslationSchema,
    systemPrompt,
    userPrompt
  );

  console.log(`✅ [Translation] Response from ${modelUsed}:`, object.totalScore);

  return {
    score: object.totalScore,
    maxScore: criteria.maxMarks,
    percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
    feedback: object.feedback,
    detailedFeedback: {
      strengths: object.strengths,
      improvements: object.improvements,
      grammarErrors: object.grammarErrors ?? undefined
    }
  };
}

async function markShortMessage(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const text = response.message || response.article || '';
  const wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length;
  const languageName = getLanguageName(criteria.language);
  const bulletPoints = criteria.specificCriteria || [];

  const systemPrompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE Foundation Short Message task. BE GENEROUS.

OFFICIAL AQA MARK SCHEME - Short Message (10 marks = 5 AO2 + 5 AO3):

AO2: COMMUNICATION (5 Marks)
- 5 marks: All bullet points covered, clear communication
- 4 marks: At least 4 bullet points, mostly clear
- 3 marks: At least 3 bullet points, generally clear
- 2 marks: At least 2 bullet points, sometimes clear
- 1 mark: At least 1 bullet point, often unclear
- 0 marks: Does not meet standard

AO3: LINGUISTIC QUALITY (5 Marks)
- 5 marks: Variety of vocabulary and structures, mainly minor errors
- 4 marks: Some variety, frequent minor errors, occasional major
- 3 marks: Some attempt at variety, some major errors
- 2 marks: Limited vocabulary, frequent errors
- 1 mark: Little awareness of vocabulary, errors throughout
- 0 marks: Does not meet standard

CRITICAL: 
- No requirement to use different tenses - present tense only is acceptable
- MINOR errors (gender, agreement, accents) do NOT affect communication
- MAJOR errors adversely affect meaning
- A 0 for AO2 = automatic 0 for AO3`;

  const userPrompt = `Grade this ${languageName} short message (${wordCount} words):

"${text}"

Bullet points to address: ${bulletPoints.length > 0 ? bulletPoints.join(', ') : 'Check for topic coverage'}

Provide ALL feedback in English only.`;

  console.log('🤖 [Short Message] Calling generateObjectWithFallback...');

  const { object, modelUsed } = await generateObjectWithFallback(
    ShortMessageSchema,
    systemPrompt,
    userPrompt
  );

  console.log(`✅ [Short Message] Response from ${modelUsed}:`, object.totalScore);

  return {
    score: object.totalScore,
    maxScore: criteria.maxMarks,
    percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
    feedback: object.feedback,
    detailedFeedback: {
      strengths: object.strengths,
      improvements: object.improvements,
      grammarErrors: object.grammarErrors ?? undefined,
      vocabularyFeedback: object.vocabularyFeedback ?? undefined
    }
  };
}

async function markExtendedWriting(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const text = response.article || response.message || '';
  const wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length;
  const languageName = getLanguageName(criteria.language);
  const isAdvancedWriting = criteria.maxMarks === 25;
  const targetWords = criteria.wordCountRequirement || (isAdvancedWriting ? 150 : 90);

  const systemPrompt = isAdvancedWriting
    ? `You are an experienced ${languageName} language teacher marking an AQA GCSE Higher Extended Writing task. BE GENEROUS.

OFFICIAL AQA MARK SCHEME - Question 03 (Higher) - Extended Writing (25 marks):

AO2: Communication (15 Marks)
• 13-15: A lot of information, regular development, very clear
• 10-12: Quite a lot of information, mostly clear
• 7-9: Adequate information, usually clear
• 4-6: Some information, sometimes unclear
• 1-3: Limited information, often unclear

AO3: Linguistic Quality (10 Marks)
Grid One - Range (5 marks): Vocabulary variety and complexity attempts
Grid Two - Accuracy (5 marks): Grammar accuracy and verb security

CRITICAL: Minor errors (gender, accents, spelling) do NOT reduce marks.`
    : `You are an experienced ${languageName} language teacher marking an AQA GCSE Foundation Extended Writing task. BE GENEROUS.

OFFICIAL AQA MARK SCHEME - Extended Writing (15 marks = 10 AO2 + 5 AO3):

AO2: COMMUNICATION (10 Marks)
- 9-10: All 3 bullet points, clear, regularly developed
- 7-8: All 3 bullet points, mostly clear, often developed
- 5-6: At least 2 bullet points, generally clear
- 3-4: At least 1 bullet point, sometimes clear
- 1-2: At least 1 bullet point, often unclear

AO3: LINGUISTIC QUALITY (5 Marks)
- 5: Good variety, regular complexity, all 3 time frames mainly successful, mainly minor errors
- 4: Some variety, some complexity, 2+ time frames, some major errors
- 3: Some vocabulary variety, 2 time frames, more accurate than inaccurate
- 2: Limited variety, simple language, frequent errors
- 1: Narrow vocabulary, simple sentences, highly inaccurate

CRITICAL:
- "Time frames" not "tenses" - present CAN refer to future
- MINOR errors (gender, accents) do NOT affect communication
- ~90 words covering all bullets with development CAN achieve 15/15`;

  const userPrompt = `Grade this ${languageName} extended writing (${wordCount} words, target ~${targetWords}):

"${text}"

Provide ALL feedback in English only.`;

  console.log('🤖 [Extended Writing] Calling generateObjectWithFallback...');

  if (isAdvancedWriting) {
    const { object, modelUsed } = await generateObjectWithFallback(
      ExtendedWritingHigherSchema,
      systemPrompt,
      userPrompt
    );

    console.log(`✅ [Extended Writing Higher] Response from ${modelUsed}:`, object.totalScore);

    return {
      score: object.totalScore,
      maxScore: criteria.maxMarks,
      percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
      feedback: object.feedback,
      detailedFeedback: {
        strengths: object.strengths,
        improvements: object.improvements,
        grammarErrors: object.grammarErrors ?? undefined,
        vocabularyFeedback: object.vocabularyFeedback ?? undefined
      }
    };
  } else {
    const { object, modelUsed } = await generateObjectWithFallback(
      ExtendedWritingFoundationSchema,
      systemPrompt,
      userPrompt
    );

    console.log(`✅ [Extended Writing Foundation] Response from ${modelUsed}:`, object.totalScore);

    return {
      score: object.totalScore,
      maxScore: criteria.maxMarks,
      percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
      feedback: object.feedback,
      detailedFeedback: {
        strengths: object.strengths,
        improvements: object.improvements,
        grammarErrors: object.grammarErrors ?? undefined,
        vocabularyFeedback: object.vocabularyFeedback ?? undefined
      }
    };
  }
}

// Gap-fill marking using database correct answers (NO AI NEEDED)
function markGapFill(response: any, criteria: MarkingCriteria): MarkingResult {
  console.log('📝 [Gap-Fill] Marking with database comparison');

  const questions = criteria.questionData?.questions || criteria.questionData?.sentences || [];

  if (questions.length === 0) {
    return {
      score: 0,
      maxScore: criteria.maxMarks,
      percentage: 0,
      feedback: 'No questions found to mark.',
      detailedFeedback: {
        strengths: [],
        improvements: ['Please try again'],
        grammarErrors: []
      }
    };
  }

  let totalScore = 0;
  const feedback: string[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];
  const grammarErrors: string[] = [];

  questions.forEach((question: any, index: number) => {
    const studentAnswer = response[`question-${index}`] || '';
    const correctAnswer = question.correctAnswer || question.correct_answer || question.correct || '';

    const normalizedStudent = studentAnswer.toString().toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toString().toLowerCase().trim();

    if (normalizedStudent === normalizedCorrect) {
      totalScore += 1;
      feedback.push(`Q${index + 1}: Correct! ✓`);
    } else if (normalizedStudent === '') {
      feedback.push(`Q${index + 1}: No answer given. The correct answer was "${correctAnswer}".`);
      grammarErrors.push(`Q${index + 1}: No response`);
    } else {
      feedback.push(`Q${index + 1}: Incorrect. You answered "${studentAnswer}" but the correct answer was "${correctAnswer}".`);
      grammarErrors.push(`Q${index + 1}: "${studentAnswer}" → should be "${correctAnswer}"`);
    }
  });

  const percentage = Math.round((totalScore / criteria.maxMarks) * 100);

  if (totalScore === criteria.maxMarks) {
    strengths.push('Perfect score! All answers correct.');
  } else if (totalScore > 0) {
    strengths.push(`You got ${totalScore} out of ${criteria.maxMarks} correct.`);
    improvements.push('Review the incorrect answers and practice vocabulary.');
  } else {
    improvements.push('Review the vocabulary and try again.');
  }

  return {
    score: totalScore,
    maxScore: criteria.maxMarks,
    percentage,
    feedback: feedback.join(' '),
    detailedFeedback: { strengths, improvements, grammarErrors }
  };
}

function getDefaultResult(criteria: MarkingCriteria): MarkingResult {
  return {
    score: 0,
    maxScore: criteria.maxMarks,
    percentage: 0,
    feedback: 'Unable to mark this response automatically. Please review with a teacher.',
    detailedFeedback: {
      strengths: [],
      improvements: ['Please try again or seek help from a teacher'],
      grammarErrors: []
    }
  };
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [MARKING API] Request received');

    if (!process.env.GROQ_API_KEY) {
      console.error('❌ [MARKING API] Groq API key not configured');
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Invalid request: responses array is required' },
        { status: 400 }
      );
    }

    console.log(`📝 [MARKING API] Marking ${responses.length} questions`);

    const questionResults: MarkingResult[] = [];
    let totalScore = 0;
    let maxScore = 0;

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i] as QuestionResponse;
      console.log(`\n🔍 [MARKING API] Question ${i + 1}/${responses.length}: ${response.criteria.questionType}`);

      let result: MarkingResult;

      try {
        switch (response.criteria.questionType) {
          case 'photo-description':
            result = await markPhotoDescription(response.response, response.criteria);
            break;
          case 'translation':
            result = await markTranslation(response.response, response.criteria);
            break;
          case 'extended-writing':
            result = await markExtendedWriting(response.response, response.criteria);
            break;
          case 'short-message':
            result = await markShortMessage(response.response, response.criteria);
            break;
          case 'gap-fill':
            result = markGapFill(response.response, response.criteria);
            break;
          default:
            result = getDefaultResult(response.criteria);
        }

        console.log(`   ✅ Result: ${result.score}/${result.maxScore} (${result.percentage}%)`);
      } catch (error: any) {
        console.error(`   ❌ Error marking question ${response.questionId}:`, error.message);
        result = getDefaultResult(response.criteria);
      }

      questionResults.push(result);
      totalScore += result.score;
      maxScore += result.maxScore;
    }

    const percentage = Math.round((totalScore / maxScore) * 100);

    let overallFeedback = `You scored ${totalScore} out of ${maxScore} marks (${percentage}%). `;
    if (percentage >= 80) {
      overallFeedback += "Excellent work! You demonstrate strong language skills.";
    } else if (percentage >= 60) {
      overallFeedback += "Good effort! Focus on accuracy and expanding your vocabulary.";
    } else if (percentage >= 40) {
      overallFeedback += "You're making progress. Review grammar rules and practice more writing.";
    } else {
      overallFeedback += "Keep practicing! Focus on basic grammar and vocabulary building.";
    }

    console.log(`\n📊 [MARKING API] Final: ${totalScore}/${maxScore} (${percentage}%)`);

    return NextResponse.json({
      totalScore,
      maxScore,
      percentage,
      questionResults,
      overallFeedback
    });

  } catch (error: any) {
    console.error('❌ [MARKING API] Fatal error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to mark assessment' },
      { status: 500 }
    );
  }
}

