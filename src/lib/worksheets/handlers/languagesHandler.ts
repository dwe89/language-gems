// Languages Handler - Handles worksheet generation for language subjects
import { OpenAI } from 'openai';
import { WorksheetHandler } from '../core/baseHandler';
import { WorksheetRequest, WorksheetResponse, Worksheet } from '../core/types';
import { v4 as uuidv4 } from 'uuid';

export class LanguagesHandler extends WorksheetHandler {
  protected subject = 'Languages';

  constructor(openai: OpenAI) {
    super(openai);
  }

  async generateWorksheet(request: WorksheetRequest): Promise<WorksheetResponse> {
    const jobId = request.jobId;
    if (!jobId) {
      throw new Error('Job ID is required for language worksheet generation');
    }

    this.updateJobProgress(jobId, 'promptGeneration', 25, 'Building language worksheet prompt');

    // Determine the target language
    const targetLanguage = request.targetLanguage || request.subject;
    const worksheetType = request.template || 'general';

    // Build specialized prompt for language learning
    const prompt = this.buildLanguagePrompt(request, targetLanguage, worksheetType);

    this.updateJobProgress(jobId, 'aiProcessing', 40, 'Generating language worksheet with AI');

    try {
      // Stronger system + user instructions to get richer, validated JSON output
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert ${targetLanguage} language teacher and assessment designer. Produce ONLY a single JSON object which exactly matches the schema required by the user prompt. Do NOT include any commentary, explanation, or text outside of the JSON object. Use stable, short question IDs (q1, q2, ...). For multiple-choice questions provide exactly 3–4 options with one correct answer. For all questions include an estimated_time_seconds, a difficulty ('easy'|'medium'|'hard'), and a marks integer. Also return a top-level "answerKey" object mapping question_id -> { answer: <value or index>, explanation: <brief explanation>, marks: <int>, type: <question_type> }.
If the worksheet includes language text (e.g., Spanish), include an English translation where appropriate. Ensure options are plausible distractors and avoid repeating the correct answer verbatim in options. The JSON must parse with standard JSON.parse().`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 12000
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      this.updateJobProgress(jobId, 'parsing', 60, 'Parsing AI response');

      // Parse the JSON response
      let worksheetData;
      try {
        worksheetData = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            worksheetData = JSON.parse(jsonMatch[0]);
          } catch (secondParseError) {
            throw new Error('Invalid JSON response from AI');
          }
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      }

      this.updateJobProgress(jobId, 'formatting', 80, 'Converting to worksheet format');

      // Convert to our worksheet format; preserve answerKey if provided by the model
      if (worksheetData.answerKey && typeof worksheetData.answerKey === 'object') {
        // Normalize keys - ensure all question ids are strings like 'q1'
        // (leave data as-is; convertToLanguageWorksheet will copy through)
      }

      const worksheet = this.convertToLanguageWorksheet(worksheetData, request, targetLanguage);
      
      return {
        worksheet,
        markdown: this.convertToMarkdown(worksheet),
        usage: completion.usage
      };
    } catch (error) {
      console.error('Error generating language worksheet:', error);
      throw error;
    }
  }

  /**
   * Build specialized prompt for language worksheets
   */
  private buildLanguagePrompt(request: WorksheetRequest, targetLanguage: string, worksheetType: string): string {
    const difficulty = request.difficulty || 'medium';
    const gradeLevel = request.gradeLevel || 7;
    const questionCount = request.targetQuestionCount || 10;
    const questionTypes = request.questionTypes || ['multiple_choice', 'fill_in_blank'];

    let specificInstructions = '';
    
    switch (worksheetType) {
      case 'grammar':
        specificInstructions = `Focus on ${targetLanguage} grammar concepts. Include verb conjugations, sentence structure, and grammar rules.`;
        break;
      case 'vocabulary':
        specificInstructions = `Focus on ${targetLanguage} vocabulary building. Include word definitions, translations, and usage examples.`;
        break;
      case 'reading':
        specificInstructions = `Include a short reading passage in ${targetLanguage} with comprehension questions.`;
        break;
      case 'conjugation':
        specificInstructions = `Focus on verb conjugation practice in ${targetLanguage}. Include different tenses and verb forms.`;
        break;
      case 'conversation':
        specificInstructions = `Create dialogue practice and conversation scenarios in ${targetLanguage}.`;
        break;
      case 'writing':
        specificInstructions = `Include writing exercises and prompts for ${targetLanguage} composition practice.`;
        break;
      default:
        specificInstructions = `Create a general ${targetLanguage} language learning worksheet covering various skills.`;
    }

    return `Create a ${difficulty} difficulty ${targetLanguage} language worksheet for grade ${gradeLevel} students.

${specificInstructions}

Requirements:
- Include exactly ${questionCount} questions
- Use these question types: ${questionTypes.join(', ')}
- Make it appropriate for ${targetLanguage} language learners
- Include clear instructions in English
- For vocabulary questions, provide both ${targetLanguage} and English
- For grammar questions, explain the rules clearly

${request.customPrompt ? `Additional requirements: ${request.customPrompt}` : ''}

${request.customVocabulary ? `Focus on these vocabulary words: ${request.customVocabulary}` : ''}

Respond with valid JSON in this exact format:
{
  "title": "Worksheet Title",
  "instructions": "Clear instructions for students in English",
  "introduction": "Brief introduction to the topic",
  "sections": [
    {
      "title": "Section Title",
      "instructions": "Section-specific instructions",
      "questions": [
        {
          "text": "Question text",
          "type": "question_type",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "Correct answer",
          "marks": 1,
          "explanation": "Brief explanation if needed"
        }
      ]
    }
  ]
}`;
  }

  /**
   * Convert AI response to language-specific worksheet format
   */
  private convertToLanguageWorksheet(data: any, request: WorksheetRequest, targetLanguage: string): Worksheet {
    const worksheet: Worksheet = {
      id: uuidv4(),
      title: data.title || `${targetLanguage} Language Worksheet`,
      subject: request.subject,
      topic: request.topic || 'Language Learning',
      difficulty: request.difficulty || 'medium',
      instructions: data.instructions || 'Complete all questions carefully.',
      introduction: data.introduction || '',
      sections: data.sections || [],
      language: targetLanguage,
      estimatedTimeMinutes: Math.max(20, (request.targetQuestionCount || 10) * 2),
      tags: [
        request.subject.toLowerCase(),
        targetLanguage.toLowerCase(),
        'language-learning',
        request.topic?.toLowerCase()
      ].filter((tag): tag is string => Boolean(tag)),
      seo_description: `A ${request.difficulty || 'medium'} difficulty ${targetLanguage} worksheet focusing on ${request.topic || 'language learning'} for students.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        title: data.title || `${targetLanguage} Language Worksheet`,
        subject: request.subject,
        difficulty: request.difficulty,
        gradeLevel: request.gradeLevel?.toString(),
        learningObjectives: [
          `Practice ${targetLanguage} language skills`,
          `Improve understanding of ${request.topic || 'language concepts'}`
        ]
      }
    };

    // If the AI provided an explicit answerKey, attach it to the worksheet
    if (data.answerKey && typeof data.answerKey === 'object') {
      (worksheet as any).answerKey = data.answerKey;
    }

    return worksheet;
  }
}
