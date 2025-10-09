import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize OpenAI client on the server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface MarkingCriteria {
  questionType: 'photo-description' | 'short-message' | 'gap-fill' | 'translation' | 'extended-writing';
  language: 'es' | 'fr' | 'de';
  maxMarks: number;
  wordCountRequirement?: number;
  specificCriteria?: string[];
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

async function markPhotoDescription(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const sentences = response.sentences || [];
  const languageName = getLanguageName(criteria.language);

  const prompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE Foundation photo description task following the official mark scheme.

OFFICIAL AQA MARK SCHEME - Question 01 (Foundation) - Photo Description:
Maximum Marks: 10 (5 sentences x 2 marks each)
Assessment Objective: AO2 (Communication)

MARKING CRITERIA PER SENTENCE:
• 2 Marks: Clear communication, relevant to the photo, uses a conjugated verb. Can be broadly relevant or potentially true.
• 1 Mark: Ambiguity, delay in communication (e.g., infinitive use, some errors).
• 0 Marks: Irrelevant, unintelligible, inappropriate verb, single word.

KEY GUIDANCE:
- Statements must refer to the photo
- Opinions only scored if they include specific reference to the photo
- Present tense is aimed for, but other tenses are accepted
- Major errors affect communication, minor errors do not

Student's sentences:
${sentences.map((s: string, i: number) => `${i + 1}. ${s || '[No response]'}`).join('\n')}

For each sentence, assess:
1. Is it relevant to the photo?
2. Does it communicate clearly?
3. Does it use a conjugated verb appropriately?
4. Are there major errors that affect communication?

Format your response as JSON:
{
  "totalScore": number,
  "sentenceScores": [number, number, number, number, number],
  "sentenceAnalysis": ["analysis for sentence 1", "analysis for sentence 2", etc.],
  "feedback": "Overall feedback based on AQA criteria",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "grammarErrors": ["major errors that affect communication"]
}`;

  try {
    console.log('🤖 [OpenAI] Calling API for photo description...');
    console.log('   Model: gpt-4.1-nano');
    console.log('   Sentences count:', sentences.length);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 1000
    });

    console.log('✅ [OpenAI] Response received');
    console.log('   Content:', completion.choices[0].message.content?.substring(0, 200));

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    console.log('   Parsed result:', result);

    return {
      score: result.totalScore || 0,
      maxScore: criteria.maxMarks,
      percentage: Math.round(((result.totalScore || 0) / criteria.maxMarks) * 100),
      feedback: result.feedback || 'No feedback provided',
      detailedFeedback: {
        strengths: result.strengths || [],
        improvements: result.improvements || [],
        grammarErrors: result.grammarErrors || [],
        vocabularyFeedback: result.vocabularyFeedback
      }
    };
  } catch (error: any) {
    console.error('❌ [OpenAI] Error marking photo description:', error);
    console.error('   Error message:', error.message);
    console.error('   Error response:', error.response?.data);
    throw error;
  }
}

async function markTranslation(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const translations = Object.values(response).filter(t => t);
  const languageName = getLanguageName(criteria.language);

  const prompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE Higher translation task following the official mark scheme.

OFFICIAL AQA MARK SCHEME - Question 01 (Higher) - Translation:
Maximum Marks: 10 (5 marks for meaning + 5 marks for vocabulary/grammar)
Assessment Objective: AO3 (Linguistic Quality)

MARKING BREAKDOWN:
Grid One: Rendering of Original Meaning (Max 5 Marks)
- Based on 15 elements total across 5 sentences (3 elements per sentence)
- Award a tick for each communicated element (even with minor inaccuracies)
- 5 Marks: 13-15 ticks (nearly all meanings)
- 4 Marks: 10-12 ticks
- 3 Marks: 7-9 ticks
- 2 Marks: 4-6 ticks
- 1 Mark: 1-3 ticks
- 0 Marks: 0 ticks (no meanings)
- Key question: "Would a native speaker understand without reference to original English?"

Grid Two: Knowledge of Vocabulary and Grammar (Max 5 Marks)
- 5 Marks: Very good vocabulary, highly accurate grammar, few minor errors
- 4 Marks: Good vocabulary, accurate grammar, some minor errors
- 3 Marks: Adequate vocabulary, generally accurate grammar, some major/minor errors
- 2 Marks: Limited vocabulary, inaccurate grammar, frequent errors
- 1 Mark: Very limited vocabulary, highly inaccurate grammar
- 0 Marks: Language does not meet standard

KEY LINK: A 0 in Grid One automatically results in a 0 in Grid Two.

Student's translations:
${translations.map((t: any, i: number) => `${i + 1}. ${t || '[No response]'}`).join('\n')}

Assess each translation for:
1. How many meaning elements are communicated (out of 3 per sentence)
2. Vocabulary accuracy and appropriateness
3. Grammar accuracy
4. Overall comprehensibility to a native speaker

Format as JSON:
{
  "totalScore": number,
  "gridOneScore": number,
  "gridTwoScore": number,
  "meaningElementsScore": number,
  "translationAnalysis": ["analysis for each translation"],
  "feedback": "Overall feedback based on AQA criteria",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "grammarErrors": ["major errors affecting meaning"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 1200
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      score: result.totalScore || 0,
      maxScore: criteria.maxMarks,
      percentage: Math.round(((result.totalScore || 0) / criteria.maxMarks) * 100),
      feedback: result.feedback || 'No feedback provided',
      detailedFeedback: {
        strengths: result.strengths || [],
        improvements: result.improvements || [],
        grammarErrors: result.grammarErrors || [],
        vocabularyFeedback: result.vocabularyFeedback
      }
    };
  } catch (error) {
    console.error('Error marking translation:', error);
    throw error;
  }
}

async function markExtendedWriting(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const text = response.article || response.message || '';
  const wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length;
  const languageName = getLanguageName(criteria.language);
  const isAdvancedWriting = criteria.maxMarks === 25;
  const targetWords = criteria.wordCountRequirement || (isAdvancedWriting ? 150 : 90);

  const prompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE extended writing task.

${isAdvancedWriting ?
`OFFICIAL AQA MARK SCHEME - Question 03 (Higher) - Extended Writing:
Maximum Marks: 25 (15 marks AO2 + 10 marks AO3)

AO2: Communication (15 Marks)
• 13-15 Marks: A lot of information, regular successful development of ideas, clear communication with very few lapses.
• 10-12 Marks: Quite a lot of information, regular attempts at development (mostly successful), mostly clear communication.
• 7-9 Marks: Adequate information, some successful development, usually clear communication.
• 4-6 Marks: Some information, limited development, communication sometimes unclear.
• 1-3 Marks: Limited information, very limited/no development, often unclear communication.

AO3: Linguistic Quality (10 Marks)
Grid One: Range and Use of Language (5 Marks)
• 5 Marks: Very good variety of vocabulary and structures, complex language regularly attempted and often successful
• 4 Marks: Good variety, complex language attempted and sometimes successful
• 3 Marks: Some variety, occasional attempts at complex language
• 2 Marks: Little variety, often simple structures
• 1 Mark: Very little vocabulary variety

Grid Two: Accuracy (5 Marks)
• 5 Marks: Usually accurate, occasional errors, secure verbs
• 4 Marks: Generally accurate, some errors, usually secure verbs
• 3 Marks: More accurate than inaccurate, regular errors
• 2 Marks: More inaccurate than accurate, frequent errors
• 1 Mark: Mostly inaccurate` :
`OFFICIAL AQA MARK SCHEME - Extended Writing (15 marks):
AO2: Communication (10 Marks)
• 9-10 Marks: All bullet points covered, clear communication, ideas regularly developed
• 7-8 Marks: All bullet points covered, mostly clear communication
• 5-6 Marks: At least two bullet points covered, generally clear communication
• 3-4 Marks: At least two bullet points covered, communication sometimes unclear
• 1-2 Marks: At least one bullet point covered, communication often unclear

AO3: Linguistic Quality (5 Marks)
• 5 Marks: Good variety, complex language attempts, successful time frames, mainly minor errors
• 4 Marks: Variety, some complexity, at least two time frames, mainly minor errors
• 3 Marks: Some variety, occasional complexity, two time frames attempted, more accurate than inaccurate
• 2 Marks: Limited variety, simple language, two time frames (often unsuccessful), more inaccurate
• 1 Mark: Narrow vocabulary, simple sentences, no successful time frames`}

Student's writing:
"${text}"

Word count: ${wordCount} words (target: ~${targetWords} words)

Format as JSON:
{
  "totalScore": number,
  "ao2Score": number,
  "ao3Score": number,
  ${isAdvancedWriting ? '"ao3GridOneScore": number, "ao3GridTwoScore": number,' : ''}
  "bulletPointsCovered": number,
  ${!isAdvancedWriting ? '"timeFramesUsed": ["past", "present", "future"], "timeFramesSuccessful": number,' : ''}
  "feedback": "Detailed feedback based on AQA criteria",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "grammarErrors": ["major errors affecting communication"],
  "vocabularyFeedback": "Assessment of vocabulary variety and complexity"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 1500
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      score: result.totalScore || 0,
      maxScore: criteria.maxMarks,
      percentage: Math.round(((result.totalScore || 0) / criteria.maxMarks) * 100),
      feedback: result.feedback || 'No feedback provided',
      detailedFeedback: {
        strengths: result.strengths || [],
        improvements: result.improvements || [],
        grammarErrors: result.grammarErrors || [],
        vocabularyFeedback: result.vocabularyFeedback
      }
    };
  } catch (error) {
    console.error('Error marking extended writing:', error);
    throw error;
  }
}

async function markGapFill(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const answers = Object.values(response).filter(a => a);
  const languageName = getLanguageName(criteria.language);

  const prompt = `You are an experienced ${languageName} language teacher marking AQA GCSE Foundation gap-fill questions.

OFFICIAL AQA MARK SCHEME - Gap Fill Questions:
- Each question worth 1 mark
- Must be grammatically correct and appropriate in context
- Minor spelling errors may be acceptable if meaning is clear
- Major errors that affect communication score 0

Student's answers:
${answers.map((a: any, i: number) => `${i + 1}. ${a || '[No response]'}`).join('\n')}

Assess each answer for grammatical correctness and contextual appropriateness.

Format as JSON:
{
  "totalScore": number,
  "questionScores": [array of 0 or 1 for each answer],
  "feedback": "Overall feedback on grammar understanding",
  "strengths": ["areas of good grammar knowledge"],
  "improvements": ["grammar areas to review"],
  "grammarErrors": ["specific errors made"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 800
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      score: result.totalScore || 0,
      maxScore: criteria.maxMarks,
      percentage: Math.round(((result.totalScore || 0) / criteria.maxMarks) * 100),
      feedback: result.feedback || 'Gap-fill exercise completed',
      detailedFeedback: {
        strengths: result.strengths || [],
        improvements: result.improvements || [],
        grammarErrors: result.grammarErrors || []
      }
    };
  } catch (error) {
    console.error('Error marking gap-fill:', error);
    throw error;
  }
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

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [MARKING API] Request received');

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ [MARKING API] OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('📦 [MARKING API] Request body:', JSON.stringify(body, null, 2));

    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      console.error('❌ [MARKING API] Invalid request: responses is not an array');
      return NextResponse.json(
        { error: 'Invalid request: responses array is required' },
        { status: 400 }
      );
    }

    console.log(`📝 [MARKING API] Marking ${responses.length} questions`);

    const questionResults: MarkingResult[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Mark each question
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i] as QuestionResponse;
      console.log(`\n🔍 [MARKING API] Question ${i + 1}/${responses.length}`);
      console.log(`   Type: ${response.criteria.questionType}`);
      console.log(`   Question ID: ${response.questionId}`);
      console.log(`   Response data:`, JSON.stringify(response.response, null, 2));

      let result: MarkingResult;

      try {
        switch (response.criteria.questionType) {
          case 'photo-description':
            console.log(`   ✅ Marking photo description...`);
            result = await markPhotoDescription(response.response, response.criteria);
            break;
          case 'translation':
            console.log(`   ✅ Marking translation...`);
            result = await markTranslation(response.response, response.criteria);
            break;
          case 'extended-writing':
            console.log(`   ✅ Marking extended writing...`);
            result = await markExtendedWriting(response.response, response.criteria);
            break;
          case 'short-message':
            console.log(`   ✅ Marking short message...`);
            result = await markExtendedWriting(response.response, response.criteria);
            break;
          case 'gap-fill':
            console.log(`   ✅ Marking gap fill...`);
            result = await markGapFill(response.response, response.criteria);
            break;
          default:
            console.log(`   ⚠️ Unknown question type: ${response.criteria.questionType}`);
            result = getDefaultResult(response.criteria);
        }

        console.log(`   ✅ Result: ${result.score}/${result.maxScore} (${result.percentage}%)`);
        console.log(`   Feedback: ${result.feedback.substring(0, 100)}...`);
      } catch (error: any) {
        console.error(`   ❌ Error marking question ${response.questionId}:`, error);
        console.error(`   Error details:`, error.message);
        console.error(`   Stack:`, error.stack);
        result = getDefaultResult(response.criteria);
      }

      questionResults.push(result);
      totalScore += result.score;
      maxScore += result.maxScore;
    }

    const percentage = Math.round((totalScore / maxScore) * 100);

    console.log(`\n📊 [MARKING API] Final Results:`);
    console.log(`   Total Score: ${totalScore}/${maxScore} (${percentage}%)`);

    // Generate overall feedback
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

    const finalResult = {
      totalScore,
      maxScore,
      percentage,
      questionResults,
      overallFeedback
    };

    console.log(`✅ [MARKING API] Returning results`);
    console.log(`   Response:`, JSON.stringify(finalResult, null, 2));

    return NextResponse.json(finalResult);

  } catch (error: any) {
    console.error('❌ [MARKING API] Fatal error:', error);
    console.error('   Error message:', error.message);
    console.error('   Stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to mark assessment' },
      { status: 500 }
    );
  }
}

