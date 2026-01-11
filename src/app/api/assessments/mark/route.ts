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
  // Question data for gap-fill and translation (contains correct answers)
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

// Helper to safely parse JSON from AI responses (strips markdown code fences)
function parseAIResponse(content: string | null | undefined): any {
  if (!content) return {};
  // Strip markdown code fences that AI sometimes adds
  let cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

async function markPhotoDescription(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const sentences = response.sentences || [];
  const languageName = getLanguageName(criteria.language);

  const prompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE Foundation photo description task following the OFFICIAL AQA mark scheme. BE GENEROUS with marking.

OFFICIAL AQA MARK SCHEME - Question 01 (Foundation) - Photo Description:
Maximum Marks: 10 (5 sentences x 2 marks each)
Assessment Objective: AO2 (Communication)

MARKING CRITERIA PER SENTENCE:
• 2 Marks: Sentence is relevant to the photo, communicates clearly, and uses a conjugated verb. 
  - Sentence can be BROADLY relevant or POTENTIALLY true about the photo
  - For example: "hay comida" (there is food) = 2 marks if food is in the photo
  - "El niño está feliz" = 2 marks even with simple vocabulary
  - Students do NOT need to expand sentences - a simple subject + verb is sufficient for 2 marks
  
• 1 Mark: Some ambiguity OR delay in communication, e.g.:
  - Uses infinitive instead of conjugated verb
  - Contains errors that cause momentary confusion but meaning is recoverable
  
• 0 Marks: ONLY give 0 if:
  - Completely irrelevant to the photo
  - Totally unintelligible
  - Single word only (no verb)
  - Uses inappropriate verb form that destroys meaning

CRITICAL MARKING GUIDANCE (AQA Official):
- Present tense is aimed for, but ALL tenses are accepted
- MINOR errors do NOT affect the mark - these include:
  * Missing or incorrect accents (niño vs nino = STILL 2 marks)
  * Gender errors (el mesa instead of la mesa = STILL 2 marks if communication clear)
  * Agreement errors (los niño instead of los niños = STILL 2 marks)
  * Minor spelling errors where meaning is clear
- Only MAJOR errors that DESTROY communication should reduce the mark
- Be GENEROUS - if in doubt, give the higher mark
- Short sentences are perfectly acceptable for full marks

Student's sentences:
${sentences.map((s: string, i: number) => `${i + 1}. ${s || '[No response]'}`).join('\n')}

For each sentence, award 2 marks if it:
1. Is relevant (even broadly) to what could be in a photo
2. Communicates clearly (meaning is understood)
3. Contains a conjugated verb (any tense)

Format your response as JSON:
{
  "totalScore": number,
  "sentenceScores": [number, number, number, number, number],
  "sentenceAnalysis": ["analysis for sentence 1", "analysis for sentence 2", etc.],
  "feedback": "Overall feedback - be encouraging and constructive",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "grammarErrors": ["ONLY major errors that affected communication - be lenient"]
}
IMPORTANT: Do NOT use double quotes " inside your strings unless escaped like \". Use single quotes ' instead.
`;

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

    const result = parseAIResponse(completion.choices[0].message.content);
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
  const translations = Object.values(response).filter(t => t && t.toString().trim() !== '');
  const languageName = getLanguageName(criteria.language);

  // CRITICAL: Check if all translations are empty - return 0 immediately
  if (translations.length === 0) {
    console.log('❌ [Translation] All translations empty - returning 0/10');
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

  // Check if most translations are empty (low effort)
  const expectedSentences = criteria.questionData?.sentences?.length || 5;
  if (translations.length < expectedSentences / 2) {
    console.log(`⚠️ [Translation] Only ${translations.length}/${expectedSentences} translations provided`);
    // Continue with AI marking but the low response count will be reflected in score
  }

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
}
IMPORTANT: Do NOT use double quotes " inside your strings unless escaped like \". Use single quotes ' instead.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 1200
    });

    const result = parseAIResponse(completion.choices[0].message.content);

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

// NEW: Dedicated function for Q2 Short Message (10 marks = 5 AO2 + 5 AO3)
async function markShortMessage(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const text = response.message || response.article || '';
  const wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length;
  const languageName = getLanguageName(criteria.language);
  const targetWords = criteria.wordCountRequirement || 50;
  const bulletPoints = criteria.specificCriteria || [];

  const prompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE Foundation Question 2 - Short Message task following the OFFICIAL AQA mark scheme. BE GENEROUS with marking.

OFFICIAL AQA MARK SCHEME - Question 02 (Foundation) - Short Message:
Maximum Marks: 10 (5 marks AO2 + 5 marks AO3)
Target: approximately 50 words
Bullet points to cover: ${bulletPoints.length > 0 ? bulletPoints.join(', ') : '5 bullet points'}

=== AO2: COMMUNICATION (5 Marks) ===
Level 5 (5 marks): All five bullet points are covered. Communication is clear.
Level 4 (4 marks): At least four bullet points are covered. Communication is mostly clear with occasional lapses.
Level 3 (3 marks): At least three bullet points are covered. Communication is generally clear with several lapses.
Level 2 (2 marks): At least two bullet points are covered. Communication is sometimes clear with regular lapses.
Level 1 (1 mark): At least one bullet point is covered. Communication is often not clear with many lapses.
Level 0 (0 marks): Content does not meet the standard.

CRITICAL AO2 GUIDANCE:
- There is NO requirement to use different tenses - present tense only is PERFECTLY ACCEPTABLE
- The bullet points only need to be COVERED, not extensively developed
- A simple reference to each bullet point is sufficient
- "Lapse in clarity" = use of language causing delay in communication (e.g., "Mi escola es grande")
- Judge by CONTENT COVERAGE first, then clarity

=== AO3: LINGUISTIC QUALITY (5 Marks) ===
Level 5 (5 marks): Variety of vocabulary AND grammatical structures. May have SOME errors, but these are MINOR.
Level 4 (4 marks): Some variety of vocabulary and structures. Frequent minor errors with occasional major error.
Level 3 (3 marks): Some ATTEMPT at variety. Frequent minor errors with some major errors.
Level 2 (2 marks): Limited or repetitive vocabulary. Frequent minor errors and a number of major errors.
Level 1 (1 mark): Little awareness of appropriate vocabulary. Errors in vast majority of sentences.
Level 0 (0 marks): Language does not meet standard.

CRITICAL AO3 GUIDANCE:
- MINOR errors = do NOT affect communication (wrong gender, agreement errors, missing accents, close spellings)
  Examples: "Mi colegio es pequeña" (gender), "Mis proffesores son interesante" (spelling/agreement)
- MAJOR errors = ADVERSELY affect communication (wrong verb form, wrong pronoun changing meaning)
  Examples: "Te gusta el deporte" instead of "Me gusta" (changes meaning), "Ayer como un bocadillo" (wrong tense affecting meaning)
- Missing accents are MINOR errors unless they change meaning
- A mark of 0 for AO2 = automatic 0 for AO3
- Variety shown through: different adjectives, different verb persons, varied nouns/verbs, intensifiers (muy, mucho, bastante)

EXAMPLE FULL MARKS RESPONSE (10/10):
"Me gusta el tenis y juego con mis amigos los sábados. También corro y nado. Escucho música cuando estudio en mi dormitorio. No veo mucho la tele, prefiero ver Netflix en mi ordenador. Me encanta leer, es mi actividad favorita. No voy mucho al cine porque es muy caro."
- All bullet points covered ✓
- Clear communication ✓
- Variety of vocabulary (tenis, amigos, música, dormitorio, tele, cine) ✓
- Variety of structures (me gusta, juego, corro, nado, escucho, prefiero, me encanta) ✓
- Mainly accurate ✓

Student's writing:
"${text}"

Word count: ${wordCount} words (target: ~${targetWords} words)
Bullet points to address: ${bulletPoints.length > 0 ? bulletPoints.join(', ') : 'Check the student response for coverage of required topics'}

MARKING APPROACH:
1. First count how many bullet points are covered (even briefly)
2. Assess clarity of communication
3. Then assess variety of vocabulary and structures
4. Only mark down for MAJOR errors that affect communication
5. BE GENEROUS - if in doubt, give the higher mark

Format your response as JSON:
{
  "totalScore": number (sum of ao2Score + ao3Score),
  "ao2Score": number (out of 5),
  "ao3Score": number (out of 5),
  "bulletPointsCovered": number,
  "bulletPointsAnalysis": ["what they wrote about each bullet point"],
  "feedback": "Constructive feedback - be encouraging",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1 - focus on what would help them improve"],
  "grammarErrors": ["ONLY list major errors that affected communication"],
  "vocabularyFeedback": "Positive assessment of vocabulary variety"
}
IMPORTANT: Do NOT use double quotes " inside your strings unless escaped like \". Use single quotes ' instead.
`;

  try {
    console.log('📝 [Short Message] Calling OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 1500
    });

    const rawContent = completion.choices[0].message.content;
    console.log('📝 [Short Message] Raw AI response:', rawContent?.substring(0, 500));

    const result = parseAIResponse(rawContent);
    console.log('📝 [Short Message] Parsed result:', { totalScore: result.totalScore });

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
    console.error('❌ [Short Message] Error marking:', error.message);
    console.error('❌ [Short Message] Stack:', error.stack);
    throw error;
  }
}

async function markExtendedWriting(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
  const text = response.article || response.message || '';
  const wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length;
  const languageName = getLanguageName(criteria.language);
  const isAdvancedWriting = criteria.maxMarks === 25;
  const targetWords = criteria.wordCountRequirement || (isAdvancedWriting ? 150 : 90);

  const prompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE extended writing task following the OFFICIAL AQA mark scheme. BE GENEROUS with marking.

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
      `OFFICIAL AQA MARK SCHEME - Question 05 (Foundation) / Question 02 (Higher) - Extended Writing:
Maximum Marks: 15 (10 marks AO2 + 5 marks AO3)
Task: Respond to THREE compulsory bullet points (~90 words)

=== AO2: COMMUNICATION (10 Marks) ===
Level 5 (9-10 marks): All THREE bullet points covered. Communication is clear. Ideas are REGULARLY developed with A LOT of relevant information.
Level 4 (7-8 marks): All THREE bullet points covered. Communication is mostly clear (occasional lapses). Ideas are OFTEN developed with quite a lot of relevant information.
Level 3 (5-6 marks): At least TWO bullet points covered. Communication generally clear (likely lapses). A few ideas developed, some relevant information.
Level 2 (3-4 marks): At least ONE bullet point covered. Communication sometimes clear (regular lapses). Little relevant information.
Level 1 (1-2 marks): At least ONE bullet point covered. Communication often not clear (very many lapses). Very little relevant information.
Level 0: Content does not meet standard.

CRITICAL AO2 GUIDANCE:
- "Development" = additional detail, reasoning, justification, elaboration (can be a clause or phrase)
- Example development: "Mi casa es grande y es estupenda" or "Vivo en Manchester, en el noroeste de Inglaterra"
- For 9-10 marks with ~90 words covering all 3 bullets with development = full marks is achievable
- Some imbalance in bullet coverage is acceptable for full marks
- A "lapse in clarity" = language causing delay in communication

=== AO3: LINGUISTIC QUALITY (5 Marks) ===
Level 5 (5 marks): GOOD variety of vocabulary. REGULAR attempts at complexity (structure/language). References to ALL THREE time frames (past, present, future) which are MAINLY successful. Errors mainly minor, some major in complex structures.
Level 4 (4 marks): Variety of vocabulary. SOME attempts at complexity. References to at least TWO time frames which are mainly successful. Errors mainly minor with some major.
Level 3 (3 marks): SOME variety of vocabulary. Occasional attempts at complexity. References to at least TWO time frames (may not always be successful). Some major errors, minor errors regular, but overall MORE ACCURATE than inaccurate.
Level 2 (2 marks): Limited variety. Language mainly simple (some longer sentences with linking words). May be no successful time frame references. Frequent major/minor errors, generally INACCURATE.
Level 1 (1 mark): Narrow/repetitive vocabulary. Simple/short sentences. No successful time frame references. Frequent errors, highly inaccurate.
Level 0: Language does not meet standard.

CRITICAL AO3 GUIDANCE:
- "Time frames" NOT "tenses" - present tense CAN refer to future: "I'm going to the concert next week"
- Reference to a time frame can be ONE example
- Verb need not be totally correct if message is clear
- MINOR errors (do NOT affect communication): wrong gender, agreement errors, missing accents, close spellings
  Examples: "Mi colegio es pequeña", "Mis proffesores son interesante"
- MAJOR errors (ADVERSELY affect communication): incorrect verb forms, incorrect pronouns
  Examples: "Te gusta el deporte" for "Me gusta", "Ayer como un bocadillo"
- Complexity shown through: different tenses, time markers, connectives (aunque, porque, por eso, si), subordinate clauses, infinitive constructions (para + inf, sin + inf), modal verbs, object pronouns, comparatives
- AO2 mark of 0 = automatic AO3 mark of 0
- AO2 mark does NOT limit AO3 mark otherwise (student with 2 bullets but great language can get 6+5)

EXAMPLE RESPONSE WORTH 15/15:
"Ayer hice muchas cosas. Por ejemplo, fui al cine con un grupo de amigos y lo pasé bomba. Después, fuimos a mi restaurante favorito que se llama Nandos y comí una hamburguesa de pollo. Fue muy rico. En general, tengo muchas cosas que me gusta hacer en mi tiempo libre. Me encanta leer y jugar a los videojuegos. Mi videojuego favorito se llama Death Stranding. Tiene una historia muy interesante. El fin de semana que viene voy a ir a España y espero que sea genial."

Analysis of this example:
- All 3 bullet points covered ✓ (yesterday/past, current hobbies/present, next weekend/future)
- Clear communication ✓
- Regular development of ideas ✓ (details about cinema, restaurant, videogame, Spain)
- Good variety of vocabulary ✓ (cine, amigos, restaurante, hamburguesa, videojuegos, historia)
- Regular complexity attempts ✓ (subordinate clauses with "que", time markers, "espero que + subjunctive")
- All 3 time frames successful ✓ (preterite: hice, fui, comí, fue; present: tengo, me encanta, tiene; future: voy a ir, espero)
- Minor errors only ✓ ("muchas cosas que me gusta" should be "gustan" - minor agreement error)
= AO2: 10/10, AO3: 5/5 = 15/15`}

Student's writing:
"${text}"

Word count: ${wordCount} words (target: ~${targetWords} words)

MARKING APPROACH:
1. Count bullet points covered (even brief coverage counts)
2. Assess clarity and development of ideas
3. Identify time frames used and if they're successful
4. Assess vocabulary variety and complexity attempts
5. Distinguish between minor errors (don't mark down) and major errors (affect communication)
6. BE GENEROUS - if in doubt, give the higher mark
7. Remember: ~90 words covering all bullets with development CAN achieve 15/15

Format as JSON:
{
  "totalScore": number (sum of ao2Score + ao3Score),
  "ao2Score": number (out of ${isAdvancedWriting ? '15' : '10'}),
  "ao3Score": number (out of ${isAdvancedWriting ? '10' : '5'}),
  ${isAdvancedWriting ? '"ao3GridOneScore": number, "ao3GridTwoScore": number,' : ''}
  "bulletPointsCovered": number,
  "bulletPointsAnalysis": ["analysis of coverage for each bullet point"],
  ${!isAdvancedWriting ? '"timeFramesUsed": ["past", "present", "future"], "timeFramesSuccessful": number,' : ''}
  "feedback": "Constructive and encouraging feedback",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["specific area for improvement"],
  "grammarErrors": ["ONLY major errors that affected communication - be lenient"],
  "vocabularyFeedback": "Positive assessment of vocabulary variety and complexity attempts"
}
IMPORTANT: Do NOT use double quotes " inside your strings unless escaped like \". Use single quotes ' instead.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 1500
    });

    let content = completion.choices[0].message.content || '{}';
    console.log('📝 [Extended Writing] Raw AI response:', content.substring(0, 500));

    // Strip markdown code fences if present (common AI response issue)
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const result = JSON.parse(content);
    console.log('📝 [Extended Writing] Parsed result:', {
      totalScore: result.totalScore,
      ao2Score: result.ao2Score,
      ao3Score: result.ao3Score
    });

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
    console.error('❌ [Extended Writing] Error marking:', error.message);
    console.error('❌ [Extended Writing] Stack:', error.stack);
    throw error;
  }
}

// Gap-fill marking using database correct answers (NO AI NEEDED)
function markGapFill(response: any, criteria: MarkingCriteria): MarkingResult {
  console.log('📝 [Gap-Fill] Marking with database comparison');
  console.log('   Response:', JSON.stringify(response));
  console.log('   Question Data:', JSON.stringify(criteria.questionData));

  // Get the questions from the database (contains correct answers)
  const questions = criteria.questionData?.questions || criteria.questionData?.sentences || [];

  if (questions.length === 0) {
    console.error('❌ [Gap-Fill] No questions found in question data');
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
  const questionScores: number[] = [];
  const feedback: string[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];
  const grammarErrors: string[] = [];

  // Check each question against the correct answer from the database
  questions.forEach((question: any, index: number) => {
    const studentAnswer = response[`question-${index}`] || '';
    // Support multiple key formats for correct answer
    const correctAnswer = question.correctAnswer || question.correct_answer || question.correct || '';

    console.log(`   Q${index + 1}: Student="${studentAnswer}" vs Correct="${correctAnswer}"`);

    // Normalize answers for comparison (lowercase, trim)
    const normalizedStudent = studentAnswer.toString().toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toString().toLowerCase().trim();

    if (normalizedStudent === normalizedCorrect) {
      totalScore += 1;
      questionScores.push(1);
      feedback.push(`Q${index + 1}: Correct! ✓`);
    } else if (normalizedStudent === '') {
      questionScores.push(0);
      feedback.push(`Q${index + 1}: No answer given. The correct answer was "${correctAnswer}".`);
      grammarErrors.push(`Q${index + 1}: No response`);
    } else {
      questionScores.push(0);
      feedback.push(`Q${index + 1}: Incorrect. You answered "${studentAnswer}" but the correct answer was "${correctAnswer}".`);
      grammarErrors.push(`Q${index + 1}: "${studentAnswer}" → should be "${correctAnswer}"`);
    }
  });

  // Generate overall feedback
  const percentage = Math.round((totalScore / criteria.maxMarks) * 100);

  if (totalScore === criteria.maxMarks) {
    strengths.push('Perfect score! All answers correct.');
  } else if (totalScore > 0) {
    strengths.push(`You got ${totalScore} out of ${criteria.maxMarks} correct.`);
    improvements.push('Review the incorrect answers and practice vocabulary.');
  } else {
    improvements.push('Review the vocabulary and try again.');
  }

  const overallFeedback = feedback.join(' ');

  console.log(`   ✅ Gap-Fill Result: ${totalScore}/${criteria.maxMarks} (${percentage}%)`);

  return {
    score: totalScore,
    maxScore: criteria.maxMarks,
    percentage,
    feedback: overallFeedback,
    detailedFeedback: {
      strengths,
      improvements,
      grammarErrors
    }
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
            console.log(`   ✅ Marking short message (Q2 - 10 marks)...`);
            result = await markShortMessage(response.response, response.criteria);
            break;
          case 'gap-fill':
            console.log(`   ✅ Marking gap fill (database comparison)...`);
            // Gap-fill is synchronous - no AI needed, just compare to database
            result = markGapFill(response.response, response.criteria);
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

