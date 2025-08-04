import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface MarkingCriteria {
  questionType: 'photo-description' | 'short-message' | 'gap-fill' | 'translation' | 'extended-writing';
  language: 'es' | 'fr' | 'de';
  maxMarks: number;
  wordCountRequirement?: number;
  specificCriteria?: string[];
}

export interface MarkingResult {
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

export interface QuestionResponse {
  questionId: string;
  questionType: string;
  response: any;
  criteria: MarkingCriteria;
}

export class AIMarkingService {
  private getLanguageName(code: string): string {
    const names = { 'es': 'Spanish', 'fr': 'French', 'de': 'German' };
    return names[code as keyof typeof names] || code;
  }

  private async markPhotoDescription(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
    const sentences = response.sentences || [];
    const languageName = this.getLanguageName(criteria.language);

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
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano-2025-04-14",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
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
      console.error('Error marking photo description:', error);
      return this.getDefaultResult(criteria);
    }
  }

  private async markTranslation(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
    const translations = Object.values(response).filter(t => t);
    const languageName = this.getLanguageName(criteria.language);

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
        model: "gpt-4.1-nano-2025-04-14",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1200
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
      return this.getDefaultResult(criteria);
    }
  }

  private async markExtendedWriting(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
    const text = response.article || response.message || '';
    const wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length;
    const languageName = this.getLanguageName(criteria.language);

    // Determine if this is Foundation Q5/Higher Q2 (15 marks) or Higher Q3 (25 marks)
    const isAdvancedWriting = criteria.maxMarks === 25;
    const targetWords = criteria.wordCountRequirement || (isAdvancedWriting ? 150 : 90);

    const prompt = `You are an experienced ${languageName} language teacher marking an AQA GCSE extended writing task following the official mark scheme.

${isAdvancedWriting ?
`OFFICIAL AQA MARK SCHEME - Question 03 (Higher) - Extended Writing:
Maximum Marks: 25 (15 marks AO2 + 10 marks AO3)
Task: Respond to two compulsory bullet points (~150 words)

AO2: Communication (15 Marks)
• 13-15 Marks: A lot of information, regular successful development of ideas, clear communication with very few lapses. (Both bullet points must be covered for 13+ marks)
• 10-12 Marks: Quite a lot of information, regular attempts at development (mostly successful), mostly clear communication with few lapses. (Max 12 marks if only one bullet point covered)
• 7-9 Marks: Adequate information, some successful development, usually clear communication with some lapses
• 4-6 Marks: Some information, limited development, communication sometimes unclear with regular lapses
• 1-3 Marks: Limited information, very limited/no development, often unclear communication with frequent lapses
• 0 Marks: Content does not meet standard

AO3: Linguistic Quality (10 Marks) - Split into two grids:
Grid One: Range and Use of Language (5 Marks)
• 5 Marks: Very good variety of vocabulary and structures, complex language regularly attempted and often successful
• 4 Marks: Good variety of vocabulary and structures, complex language attempted and sometimes successful
• 3 Marks: Some variety of vocabulary and structures, occasional attempts at complex language
• 2 Marks: Little variety, often simple structures but also regular longer sentences with linking words
• 1 Mark: Very little vocabulary variety, mainly short/simple structures
• 0 Marks: Language does not meet standard

Grid Two: Accuracy (5 Marks)
• 5 Marks: Usually accurate, occasional major/minor errors (especially in complex structures), secure verbs and tense formations
• 4 Marks: Generally accurate, some major/minor errors, usually secure verbs and tense formations
• 3 Marks: More accurate than inaccurate, regular major/minor errors, often secure verbs and tense formations
• 2 Marks: More inaccurate than accurate, frequent major/minor errors, often incorrect verb/tense formations
• 1 Mark: Mostly inaccurate, major/minor errors in all sentences, nearly always incorrect verb/tense formations
• 0 Marks: Accuracy does not meet standard` :

`OFFICIAL AQA MARK SCHEME - Question 05 (Foundation) / Question 02 (Higher) - Extended Writing:
Maximum Marks: 15 (10 marks AO2 + 5 marks AO3)
Task: Respond to three compulsory bullet points (~90 words)

AO2: Communication (10 Marks)
• 9-10 Marks: All three bullet points covered, clear communication, ideas regularly developed with a lot of relevant information
• 7-8 Marks: All three bullet points covered, mostly clear communication, ideas sometimes developed with quite a lot of relevant information
• 5-6 Marks: At least two bullet points covered, generally clear communication, some ideas developed, some relevant information
• 3-4 Marks: At least two bullet points covered, communication sometimes unclear, limited development, little relevant information
• 1-2 Marks: At least one bullet point covered, communication often unclear, very little relevant information
• 0 Marks: Content does not meet standard

AO3: Linguistic Quality (5 Marks)
• 5 Marks: Good variety of vocabulary, regular attempts at complex language/structure, successful references to all three time frames (past, present, future) mostly successful, mainly minor errors
• 4 Marks: Variety of vocabulary, some attempts at complexity, successful references to at least two different time frames mostly successful, mainly minor errors, some major
• 3 Marks: Some variety, occasional complexity attempts, references to at least two time frames (may not always be successful), some major errors, regular minor errors, but overall more accurate than inaccurate
• 2 Marks: Limited variety, simple language, references to at least two time frames (often unsuccessful), frequent major/minor errors, more inaccurate than accurate
• 1 Mark: Narrow/repetitive vocabulary, simple/short sentences, no successful references to different time frames, frequent major/minor errors, highly inaccurate
• 0 Marks: Language does not meet standard`}

KEY PRINCIPLES:
- Major Error: Adversely affects communication
- Minor Error: Does not affect communication
- A mark of 0 for AO2 automatically results in 0 for AO3
- "Best fit" approach when descriptors are not consistently demonstrated

Student's writing:
"${text}"

Word count: ${wordCount} words (target: ~${targetWords} words)

Assess the response for:
1. Coverage of bullet points and communication clarity (AO2)
2. Vocabulary variety and language complexity (AO3)
3. Grammar accuracy and verb formations
${!isAdvancedWriting ? '4. Use of different time frames (past, present, future)' : ''}

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
        model: "gpt-4.1-nano-2025-04-14",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500
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
      return this.getDefaultResult(criteria);
    }
  }

  private async markShortMessage(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
    // Short message follows similar pattern to extended writing but with different criteria
    return await this.markExtendedWriting(response, criteria);
  }

  private async markGapFill(response: any, criteria: MarkingCriteria): Promise<MarkingResult> {
    const answers = Object.values(response).filter(a => a);
    const languageName = this.getLanguageName(criteria.language);

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
        model: "gpt-4.1-nano-2025-04-14",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 800
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
      return this.getDefaultResult(criteria);
    }
  }

  private getDefaultResult(criteria: MarkingCriteria): MarkingResult {
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

  async markQuestion(response: QuestionResponse): Promise<MarkingResult> {
    const { questionType, criteria } = response;

    switch (questionType) {
      case 'photo-description':
        return await this.markPhotoDescription(response.response, criteria);
      case 'translation':
        return await this.markTranslation(response.response, criteria);
      case 'extended-writing':
        return await this.markExtendedWriting(response.response, criteria);
      case 'short-message':
        return await this.markShortMessage(response.response, criteria);
      case 'gap-fill':
        return await this.markGapFill(response.response, criteria);
      default:
        return this.getDefaultResult(criteria);
    }
  }

  async markFullAssessment(responses: QuestionResponse[]): Promise<{
    totalScore: number;
    maxScore: number;
    percentage: number;
    questionResults: MarkingResult[];
    overallFeedback: string;
  }> {
    const questionResults: MarkingResult[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Mark each question
    for (const response of responses) {
      const result = await this.markQuestion(response);
      questionResults.push(result);
      totalScore += result.score;
      maxScore += result.maxScore;
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    
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

    return {
      totalScore,
      maxScore,
      percentage,
      questionResults,
      overallFeedback
    };
  }
}
