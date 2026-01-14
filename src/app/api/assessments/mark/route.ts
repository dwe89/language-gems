import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// ============================================================================
// MASTER MARK SCHEME LOADER - Dynamic "Expert" Prompting System
// Optimized for Groq prompt caching (~$0.037/M cached rate)
// ============================================================================

type Language = 'es' | 'fr' | 'de';
type Tier = 'foundation' | 'higher';
type TaskType = 'writing' | 'translation' | 'photo-description' | 'short-message' | 'extended-writing';

interface MarkSchemeResult {
  content: string;
  source: 'file' | 'fallback';
  tier: Tier;
  language: string;
}

// Language code to full name mapping
const LANGUAGE_NAMES: Record<Language, string> = {
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German'
};

// Cache for loaded mark schemes (in-memory for serverless function lifecycle)
const markSchemeCache = new Map<string, string>();

/**
 * Fetches the master mark scheme for a given language, tier, and task type.
 * Uses file-based loading for predictable caching with Groq.
 * 
 * @param language - The target language code ('es', 'fr', 'de')
 * @param tier - The assessment tier ('foundation' or 'higher')
 * @param taskType - The type of writing task
 * @returns The full mark scheme content optimized for AI system prompts
 */
function getMasterMarkScheme(
  language: Language,
  tier: Tier,
  taskType: TaskType
): MarkSchemeResult {
  const languageName = LANGUAGE_NAMES[language] || language;
  const cacheKey = `${language}-${tier}-${taskType}`;
  
  // Check in-memory cache first
  if (markSchemeCache.has(cacheKey)) {
    console.log(`📚 [Mark Scheme] Cache hit: ${cacheKey}`);
    return {
      content: markSchemeCache.get(cacheKey)!,
      source: 'file',
      tier,
      language: languageName
    };
  }

  // Construct file path - mark schemes are stored in the assessments folder
  const fileName = `master-aqa-${languageName.toLowerCase()}-${tier}-writing.md`;
  const markSchemePath = join(
    process.cwd(),
    'src/app/assessments/gcse-writing/mark-schemes',
    fileName
  );

  try {
    if (existsSync(markSchemePath)) {
      const content = readFileSync(markSchemePath, 'utf-8');
      markSchemeCache.set(cacheKey, content);
      console.log(`📚 [Mark Scheme] Loaded: ${fileName} (${content.length} chars)`);
      return {
        content,
        source: 'file',
        tier,
        language: languageName
      };
    }
  } catch (error) {
    console.warn(`⚠️ [Mark Scheme] Failed to load ${fileName}:`, error);
  }

  // Fallback: Return empty string - the marking functions have built-in fallbacks
  console.log(`📚 [Mark Scheme] Using fallback for ${cacheKey}`);
  return {
    content: '',
    source: 'fallback',
    tier,
    language: languageName
  };
}

/**
 * Constructs an optimized system prompt for Groq caching.
 * Order matters: Fixed header → Master reference (cacheable) → Task-specific instructions
 * 
 * @param languageName - Full language name (e.g., 'Spanish')
 * @param masterScheme - The loaded master mark scheme content
 * @param taskInstructions - Task-specific grading instructions
 * @param zodInstructions - Instructions for structured output format
 */
function buildCacheOptimizedPrompt(
  languageName: string,
  masterScheme: string,
  taskInstructions: string,
  zodInstructions: string
): string {
  // PROMPT ORDER FOR GROQ CACHING:
  // 1. Fixed Header (identical across calls)
  // 2. Master Reference (large, cacheable ~10k tokens)
  // 3. Task-Specific Instructions (varies slightly)
  
  const fixedHeader = `You are an experienced ${languageName} language teacher and AQA GCSE examiner. Your role is to mark student writing assessments according to the official AQA mark scheme provided below. Be fair, consistent, and encouraging in your feedback.`;

  const parts = [fixedHeader];

  if (masterScheme) {
    parts.push(`\n\n=== OFFICIAL AQA MARK SCHEME REFERENCE ===\n${masterScheme}\n=== END OF MARK SCHEME ===`);
  }

  if (taskInstructions) {
    parts.push(`\n\n=== TASK-SPECIFIC GUIDANCE ===\n${taskInstructions}`);
  }

  if (zodInstructions) {
    parts.push(`\n\n=== OUTPUT FORMAT REQUIREMENTS ===\n${zodInstructions}`);
  }

  return parts.join('');
}

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
  sentenceScores: z.array(z.number()).describe('Score for each sentence (0, 1, or 2) - MUST provide score for each sentence'),
  sentenceAnalysis: z.array(z.string()).describe('Brief analysis explaining the mark for each sentence based on the AQA criteria - REQUIRED'),
  feedback: z.string().describe('Overall encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication')
});

const TranslationSchema = z.object({
  totalScore: z.number().describe('Total score out of 10 (Grid One + Grid Two)'),
  gridOneScore: z.number().describe('Grid One: Rendering of original meaning (out of 5) - count meaning elements communicated'),
  gridTwoScore: z.number().describe('Grid Two: Knowledge of vocabulary and grammar (out of 5)'),
  meaningElementsRendered: z.number().describe('Number of meaning elements successfully communicated out of 15'),
  translationAnalysis: z.array(z.string()).describe('Analysis for each translation sentence explaining marks awarded - REQUIRED'),
  feedback: z.string().describe('Overall feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of improvements in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Major errors affecting meaning')
});

const ShortMessageSchema = z.object({
  totalScore: z.number().describe('Total score (ao2Score + ao3Score)'),
  ao2Score: z.number().describe('AO2 Communication score out of 5'),
  ao3Score: z.number().describe('AO3 Linguistic quality score out of 5'),
  bulletPointsCovered: z.number().describe('Number of bullet points addressed (out of 5)'),
  bulletPointsAnalysis: z.array(z.string()).describe('Analysis of what was written about each bullet point - REQUIRED'),
  feedback: z.string().describe('Constructive encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication'),
  vocabularyFeedback: z.string().describe('Assessment of vocabulary variety and grammatical structures in English')
});

const ExtendedWritingFoundationSchema = z.object({
  totalScore: z.number().describe('Total score (ao2Score + ao3Score) out of 15'),
  ao2Score: z.number().describe('AO2 Communication score out of 10'),
  ao3Score: z.number().describe('AO3 Linguistic quality score out of 5'),
  bulletPointsCovered: z.number().describe('Number of bullet points addressed (out of 3)'),
  bulletPointsAnalysis: z.array(z.string()).describe('Detailed analysis of how each bullet point was covered - REQUIRED'),
  timeFramesUsed: z.array(z.string()).describe('Time frames identified (past, present, future) with examples from the text'),
  timeFramesSuccessful: z.number().describe('Number of successful time frame references (0-3)'),
  developmentAnalysis: z.string().describe('Analysis of how ideas are developed with additional details, reasoning, or elaboration'),
  feedback: z.string().describe('Constructive encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication'),
  vocabularyFeedback: z.string().describe('Assessment of vocabulary variety and complexity attempts in English')
});

const ExtendedWritingHigherSchema = z.object({
  totalScore: z.number().describe('Total score (ao2Score + ao3Score) out of 25'),
  ao2Score: z.number().describe('AO2 Communication score out of 15'),
  ao3Score: z.number().describe('AO3 Linguistic quality score out of 10 (Grid One + Grid Two)'),
  ao3GridOneScore: z.number().describe('AO3 Grid One: Range and variety of vocabulary and structures (out of 5)'),
  ao3GridTwoScore: z.number().describe('AO3 Grid Two: Accuracy - grammar and verb security (out of 5)'),
  bulletPointsAnalysis: z.array(z.string()).describe('Detailed analysis of how each bullet point was covered - REQUIRED'),
  developmentAnalysis: z.string().describe('Analysis of information conveyed, development of ideas, accounts and description'),
  complexityExamples: z.array(z.string()).describe('Examples of complex structures attempted (infinitive constructions, subordinate clauses, etc.)'),
  feedback: z.string().describe('Constructive encouraging feedback in English'),
  strengths: z.array(z.string()).describe('List of strengths in English'),
  improvements: z.array(z.string()).describe('List of areas for improvement in English'),
  grammarErrors: z.array(z.string()).nullable().describe('Only major errors that affected communication'),
  vocabularyFeedback: z.string().describe('Assessment of vocabulary variety, complexity attempts, and accuracy in English')
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
  const tier: Tier = 'foundation'; // Photo description is Foundation only

  // Load the master mark scheme
  const markScheme = getMasterMarkScheme(criteria.language, tier, 'photo-description');

  const taskInstructions = `TASK: Photo Description (Foundation Q1)
Maximum Marks: 10 (5 sentences × 2 marks each)

MARKING CRITERIA PER SENTENCE:
• 2 Marks: Relevant message clearly communicated with a conjugated verb
• 1 Mark: Relevant but ambiguous OR causes delay in communication (e.g., infinitive instead of conjugated verb)
• 0 Marks: Irrelevant, unintelligible, single word only, or inappropriate verb

KEY RULES:
- ALL tenses are accepted
- Same verb/structure may be repeated (e.g., "hay" in every sentence = acceptable)
- First/second person acceptable: "I am playing", "You are eating"
- MINOR errors (accents, gender, agreement, spelling) do NOT affect marks
- Only MAJOR errors that DESTROY communication reduce marks
- If sentence COULD be true about the photo, accept it
- Opinions about photo without content = 0 ("I like the photo")
- Opinions WITH content = 2 ("I like the photo because it is sunny")

EXAMPLES:
2 marks: "Hay una familia en el parque" (relevant, clear, conjugated)
2 marks: "Hace sol" (relevant, clear, conjugated)
1 mark: "En el parque" (no verb = ambiguity)
1 mark: "estar en una clase" (verb not conjugated)
0 marks: "perro" (single word)
0 marks: "quiero una mesa" (irrelevant)

BE GENEROUS - if in doubt, give the higher mark.`;

  const zodInstructions = `OUTPUT FORMAT:
- totalScore: Sum of all sentence scores (max 10)
- sentenceScores: Array of scores [0, 1, or 2] for each of the 5 sentences - REQUIRED
- sentenceAnalysis: For EACH sentence, explain WHY that mark was given based on the criteria - REQUIRED
- Provide ALL feedback in English only`;

  const systemPrompt = buildCacheOptimizedPrompt(
    languageName,
    markScheme.content,
    taskInstructions,
    zodInstructions
  );

  const userPrompt = `Grade these ${languageName} sentences describing a photo:

${sentences.map((s: string, i: number) => `Sentence ${i + 1}: ${s || '[No response]'}`).join('\n')}

For each sentence: Is there a conjugated verb? Is it relevant to describing a photo? Is communication clear?`;

  console.log(`🤖 [Photo Description] Using ${markScheme.source} mark scheme (${markScheme.content.length} chars)`);

  const { object, modelUsed } = await generateObjectWithFallback(
    PhotoDescriptionSchema,
    systemPrompt,
    userPrompt
  );

  console.log(`✅ [Photo Description] Response from ${modelUsed}: ${object.totalScore}/10 [${object.sentenceScores?.join(', ')}]`);

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
  
  // Determine tier based on max marks (Foundation uses different criteria)
  const tier: Tier = criteria.maxMarks >= 10 ? 'higher' : 'foundation';

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

  // Load the master mark scheme for this language and tier
  const markScheme = getMasterMarkScheme(criteria.language, tier, 'translation');
  
  // Task-specific instructions that complement the master scheme
  const taskInstructions = `TASK: Translation Marking (English → ${languageName})
Maximum Marks: ${criteria.maxMarks}

CRITICAL MARKING GUIDANCE:
1. For Grid One (Meaning): Count how many meaning elements are successfully communicated
   - Ask: "Would a native speaker understand this without seeing the English?"
   - If yes, award a tick for that element
   
2. For Grid Two (Vocabulary & Grammar):
   - MAJOR errors: Incorrect verb forms, incorrect pronouns, wrong tense - these affect communication
   - MINOR errors: Spelling close to correct, gender/agreement errors, missing accents - these do NOT affect communication
   - A 0 in Grid One = automatic 0 in Grid Two
   
3. If student leaves gaps, assume any attempt would have been highly inaccurate

BE FAIR BUT GENEROUS: Perfection is not required for full marks.`;

  const zodInstructions = `OUTPUT FORMAT:
- totalScore: Sum of gridOneScore + gridTwoScore
- gridOneScore: Meaning elements (0-5 based on elements communicated out of 15)
- gridTwoScore: Vocabulary and grammar quality (0-5)
- meaningElementsRendered: Actual count of meaning elements successfully communicated (0-15)
- translationAnalysis: For EACH sentence, explain what was communicated and any errors
- Provide ALL feedback in English only`;

  // Build cache-optimized prompt (master scheme is the large, cacheable part)
  const systemPrompt = buildCacheOptimizedPrompt(
    languageName,
    markScheme.content,
    taskInstructions,
    zodInstructions
  );

  const userPrompt = `Grade these English to ${languageName} translations:

${translations.map((t: any, i: number) => `Sentence ${i + 1}: ${t}`).join('\n')}

For each sentence, identify meaning elements communicated and assess vocabulary/grammar accuracy.`;

  console.log(`🤖 [Translation] Using ${markScheme.source} mark scheme (${markScheme.content.length} chars)`);

  const { object, modelUsed } = await generateObjectWithFallback(
    TranslationSchema,
    systemPrompt,
    userPrompt
  );

  console.log(`✅ [Translation] Response from ${modelUsed}: ${object.totalScore}/${criteria.maxMarks} (Grid1: ${object.gridOneScore}, Grid2: ${object.gridTwoScore})`);

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
  const tier: Tier = 'foundation'; // Short message is Foundation Q2
  const bulletPoints = criteria.specificCriteria || [];

  // Load the master mark scheme
  const markScheme = getMasterMarkScheme(criteria.language, tier, 'short-message');

  const taskInstructions = `TASK: Short Message (Foundation Q2, ~50 words)
Maximum Marks: 10 (AO2: 5 + AO3: 5)

AO2: COMMUNICATION (5 Marks)
- 5: All 5 bullet points covered, clear communication
- 4: At least 4 bullet points, mostly clear with occasional lapses
- 3: At least 3 bullet points, generally clear with several lapses
- 2: At least 2 bullet points, sometimes clear with regular lapses
- 1: At least 1 bullet point, often not clear with many lapses
- 0: Does not meet standard

AO3: LINGUISTIC QUALITY (5 Marks)
- 5: Variety of vocabulary and structures, mainly minor errors
- 4: Some variety, frequent minor errors with occasional major
- 3: Some attempt at variety, frequent minor + some major errors
- 2: Limited/repetitive vocabulary, frequent minor + number of major errors
- 1: Little awareness of vocabulary, errors in vast majority of sentences
- 0: Does not meet standard

KEY RULES:
- All bullet points are compulsory but no need for equal coverage
- NO requirement to use different tenses - present tense only is acceptable
- Content must be relevant to bullet points
- "Lapse in clarity" = language causing delay in communication
- A 0 for AO2 = automatic 0 for AO3
- MINOR errors (gender, agreement, accents) do NOT affect communication
- MAJOR errors adversely affect meaning

MARKING GUIDANCE:
- Accept any plausible response to bullet points
- Student's response must be relevant but doesn't need to explicitly mention context
- The ~50 word count is approximate - demonstration of descriptors matters more`;

  const zodInstructions = `OUTPUT FORMAT:
- totalScore: ao2Score + ao3Score (max 10)
- ao2Score: Communication (max 5)
- ao3Score: Linguistic quality (max 5)
- bulletPointsCovered: Number of bullet points addressed (out of 5)
- bulletPointsAnalysis: Analysis of EACH bullet point's coverage - REQUIRED
- vocabularyFeedback: Assessment of variety and structures used
- Provide ALL feedback in English only`;

  const systemPrompt = buildCacheOptimizedPrompt(
    languageName,
    markScheme.content,
    taskInstructions,
    zodInstructions
  );

  const userPrompt = `Grade this ${languageName} short message (${wordCount} words, target ~50):

---
${text}
---

${bulletPoints.length > 0 ? `Bullet points to address:\n${bulletPoints.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}` : 'Assess coverage of the task requirements.'}

Analyze each bullet point's coverage and assess vocabulary variety.`;

  console.log(`🤖 [Short Message] Using ${markScheme.source} mark scheme (${markScheme.content.length} chars)`);

  const { object, modelUsed } = await generateObjectWithFallback(
    ShortMessageSchema,
    systemPrompt,
    userPrompt
  );

  console.log(`✅ [Short Message] Response from ${modelUsed}: ${object.totalScore}/10 (AO2: ${object.ao2Score}, AO3: ${object.ao3Score}, Bullets: ${object.bulletPointsCovered})`);

  return {
    score: object.totalScore,
    maxScore: criteria.maxMarks,
    percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
    feedback: object.feedback,
    detailedFeedback: {
      strengths: object.strengths,
      improvements: object.improvements,
      grammarErrors: object.grammarErrors ?? undefined,
      vocabularyFeedback: object.vocabularyFeedback
    }
  };
}

async function markExtendedWriting(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const text = response.article || response.message || '';
  const wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length;
  const languageName = getLanguageName(criteria.language);
  const isHigherTier = criteria.maxMarks === 25;
  const tier: Tier = isHigherTier ? 'higher' : 'foundation';
  const targetWords = criteria.wordCountRequirement || (isHigherTier ? 150 : 90);
  
  // Extract bullet points from criteria - check multiple possible locations
  const bulletPoints = criteria.specificCriteria || 
                       criteria.questionData?.bulletPoints || 
                       criteria.questionData?.option1?.bulletPoints || 
                       [];

  // DEBUG: Log what bullet points we're using
  console.log(`📋 [Extended Writing] Bullet points for marking:`, bulletPoints);
  console.log(`📋 [Extended Writing] Question data keys:`, Object.keys(criteria.questionData || {}));

  // Load the master mark scheme for this language and tier
  const markScheme = getMasterMarkScheme(criteria.language, tier, 'extended-writing');

  // CRITICAL: Instructions to handle missing bullet points gracefully
  const bulletPointsSection = bulletPoints.length > 0 
    ? `
ACTUAL QUESTION BULLET POINTS (mark against THESE, not examples):
${bulletPoints.map((bp: string, i: number) => `${i + 1}. ${bp}`).join('\n')}
`
    : `
⚠️ NO SPECIFIC BULLET POINTS PROVIDED - Mark the content as written.
The student's response should be marked on its own merits:
- Is the content relevant to a plausible writing task?
- Is there development of ideas?
- Are multiple time frames used?
DO NOT penalize for not matching example bullet points in the mark scheme.
`;

  // Task-specific instructions for Higher tier (25 marks = 15 AO2 + 10 AO3)
  const higherTaskInstructions = `TASK: Extended Writing - Higher Tier (150 words)
Maximum Marks: 25 (AO2: 15 + AO3: 10)

⚠️ CRITICAL: IGNORE all example questions and bullet points in the mark scheme reference above.
Mark ONLY against the actual bullet points provided below, OR if none provided, assess the content as written.
${bulletPointsSection}
MARKING APPROACH:
1. Read through once for overall impression
2. Assess AO2 (Communication) first:
   - How much information is conveyed?
   - Is there development of ideas, accounts, and/or description?
   - Is communication clear or are there lapses?
   
3. Then assess AO3 (Linguistic Quality) with two sub-grids:
   Grid One (Range, max 5): Variety of vocabulary and structures, complexity attempts
   Grid Two (Accuracy, max 5): Grammar accuracy, verb security
   
4. A mark of 0 for AO2 = automatic 0 for AO3

KEY DEFINITIONS:
- Development: Additional detail, reasoning, justification, elaboration
- Complexity: Infinitive constructions, subordinate clauses, connectives (aunque, debido a), 
  object pronouns, range of tenses, comparative adjectives
- Lapse in clarity: Language causing delay in communication
- Major error: Affects communication (wrong verb form, wrong pronoun)
- Minor error: Does NOT affect communication (gender, agreement, accents)

BE GENEROUS: ~150 words covering the topic with development CAN achieve 25/25`;

  // Task-specific instructions for Foundation tier (15 marks = 10 AO2 + 5 AO3)
  const foundationTaskInstructions = `TASK: Extended Writing - Foundation Tier (90 words)
Maximum Marks: 15 (AO2: 10 + AO3: 5)

⚠️ CRITICAL: IGNORE all example questions and bullet points in the mark scheme reference above.
Mark ONLY against the actual bullet points provided below, OR if none provided, assess the content as written.
${bulletPointsSection}
MARKING APPROACH:
1. Check coverage of the bullet points above (or topic relevance if no bullet points)
2. Assess AO2 (Communication, max 10):
   - Level 5 (9-10): All bullets covered (or comprehensive topic coverage), clear, regularly developed
   - Level 4 (7-8): Most content clear, often developed
   - Level 3 (5-6): Generally clear with some development
   - Level 2 (3-4): Sometimes clear, little development
   - Level 1 (1-2): Often unclear, very limited
   
3. Assess AO3 (Linguistic Quality, max 5):
   - Level 5: Good variety, regular complexity, ALL 3 time frames successful, mainly minor errors
   - Level 4: Some variety, complexity attempts, 2+ time frames, some major errors
   - Level 3: Some vocabulary variety, 2 time frames, more accurate than inaccurate
   - Level 2: Limited variety, simple language, frequent errors
   - Level 1: Narrow vocabulary, simple sentences, highly inaccurate

CRITICAL TIME FRAMES:
- "Time frames" NOT "tenses" - present tense CAN refer to future
- Example: "I'm going to the concert next week" = future time frame using present tense
- For Level 5, must have references to past, present, AND future
- One example per time frame is sufficient

MINOR errors (gender, accents, agreement) do NOT affect communication
~90 words covering the topic with development CAN achieve 15/15`;

  const taskInstructions = isHigherTier ? higherTaskInstructions : foundationTaskInstructions;

  const zodInstructionsHigher = `OUTPUT FORMAT:
- totalScore: ao2Score + ao3Score (max 25)
- ao2Score: Communication (max 15)
- ao3Score: ao3GridOneScore + ao3GridTwoScore (max 10)
- ao3GridOneScore: Range and variety (max 5)
- ao3GridTwoScore: Accuracy (max 5)
- bulletPointsAnalysis: Analysis of EACH bullet point's coverage - REQUIRED
- developmentAnalysis: How ideas are developed with details, reasoning, elaboration
- complexityExamples: List specific complex structures used (subordinate clauses, infinitive constructions, etc.)
- Provide ALL feedback in English only`;

  const zodInstructionsFoundation = `OUTPUT FORMAT:
- totalScore: ao2Score + ao3Score (max 15)
- ao2Score: Communication (max 10)
- ao3Score: Linguistic quality (max 5)
- bulletPointsCovered: Number out of 3
- bulletPointsAnalysis: Analysis of EACH bullet point's coverage - REQUIRED
- timeFramesUsed: List each time frame found with example from text
- timeFramesSuccessful: Count of successful time frame references (0-3)
- developmentAnalysis: How ideas are developed
- Provide ALL feedback in English only`;

  const zodInstructions = isHigherTier ? zodInstructionsHigher : zodInstructionsFoundation;

  // Build cache-optimized prompt
  const systemPrompt = buildCacheOptimizedPrompt(
    languageName,
    markScheme.content,
    taskInstructions,
    zodInstructions
  );

  const userPrompt = bulletPoints.length > 0 
    ? `Grade this ${languageName} extended writing (${wordCount} words, target ~${targetWords}):

---
${text}
---

THE ACTUAL BULLET POINTS FOR THIS QUESTION ARE:
${bulletPoints.map((bp: string, i: number) => `${i + 1}. ${bp}`).join('\n')}

Analyze how well each bullet point is covered, identify time frames used, and assess vocabulary/complexity.`
    : `Grade this ${languageName} extended writing (${wordCount} words, target ~${targetWords}):

---
${text}
---

NO SPECIFIC BULLET POINTS WERE PROVIDED FOR THIS QUESTION.
Mark the content on its own merits - assess the topic coverage, development, time frames, and language quality.
DO NOT compare against example bullet points from the mark scheme.`;

  console.log(`🤖 [Extended Writing ${tier}] Using ${markScheme.source} mark scheme (${markScheme.content.length} chars)`);
  console.log(`📋 [Extended Writing ${tier}] Bullet points in prompt: ${bulletPoints.length > 0 ? bulletPoints.join(' | ') : 'NONE'}`);
  console.log(`📝 [Extended Writing ${tier}] Student text preview: "${text.substring(0, 100)}..."`);

  if (isHigherTier) {
    const { object, modelUsed } = await generateObjectWithFallback(
      ExtendedWritingHigherSchema,
      systemPrompt,
      userPrompt
    );

    console.log(`✅ [Extended Writing Higher] Response from ${modelUsed}: ${object.totalScore}/25 (AO2: ${object.ao2Score}, AO3: ${object.ao3Score})`);

    return {
      score: object.totalScore,
      maxScore: criteria.maxMarks,
      percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
      feedback: object.feedback,
      detailedFeedback: {
        strengths: object.strengths,
        improvements: object.improvements,
        grammarErrors: object.grammarErrors ?? undefined,
        vocabularyFeedback: object.vocabularyFeedback
      }
    };
  } else {
    const { object, modelUsed } = await generateObjectWithFallback(
      ExtendedWritingFoundationSchema,
      systemPrompt,
      userPrompt
    );

    console.log(`✅ [Extended Writing Foundation] Response from ${modelUsed}: ${object.totalScore}/15 (AO2: ${object.ao2Score}, AO3: ${object.ao3Score}, TimeFrames: ${object.timeFramesSuccessful})`);

    return {
      score: object.totalScore,
      maxScore: criteria.maxMarks,
      percentage: Math.round((object.totalScore / criteria.maxMarks) * 100),
      feedback: object.feedback,
      detailedFeedback: {
        strengths: object.strengths,
        improvements: object.improvements,
        grammarErrors: object.grammarErrors ?? undefined,
        vocabularyFeedback: object.vocabularyFeedback
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

