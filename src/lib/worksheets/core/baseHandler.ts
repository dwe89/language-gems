import { OpenAI } from 'openai';
import {
  WorksheetRequest,
  Worksheet,
  WorksheetResponse,
  Question
} from './types';
import { v4 as uuidv4 } from 'uuid';
import {
  updateProgress,
  GenerationStep
} from '@/lib/progress';

// Base handler that all subject handlers will extend
export abstract class WorksheetHandler {
  protected openai: OpenAI;
  protected subject: string = '';

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  // Update progress with explicit jobId parameter (stateless)
  protected updateJobProgress(
    jobId: string,
    status: GenerationStep,
    progress: number,
    message: string,
    result?: any
  ): void {
    if (jobId) {
      updateProgress(jobId, status, progress, message);

      if (status === 'completed' && result) {
        const { markJobComplete } = require('@/lib/progress');
        markJobComplete(jobId, result);
      }
    }
  }

  // This should be implemented by each subject handler
  abstract generateWorksheet(request: WorksheetRequest): Promise<WorksheetResponse>;

  /**
   * Helper method to validate a topic or provide a generic one
   */
  protected validateTopicOrProvideGeneric(request: WorksheetRequest, validTopics: string[]): void {
    // If no topic is provided, set a generic one
    if (!request.topic || request.topic.trim() === '') {
      request.topic = `general ${this.subject.toLowerCase()} concepts`;
      return;
    }

    // Check if the topic is in the list of valid topics
    const normalizedTopic = request.topic.toLowerCase().trim().replace(/\s+/g, '_');

    if (!validTopics.some(topic =>
      topic.toLowerCase() === normalizedTopic ||
      normalizedTopic.includes(topic.toLowerCase())
    )) {
      console.warn(`Topic "${request.topic}" not in the list of recognized topics for ${this.subject}. Using generic approach.`);
      // We'll still use the provided topic but with more general instructions
    }
  }

  /**
   * Generate a basic worksheet using OpenAI
   */
  protected async generateBasicWorksheet(request: WorksheetRequest): Promise<WorksheetResponse> {
    const jobId = request.jobId;
    if (jobId) {
      this.updateJobProgress(jobId, 'aiProcessing', 30, 'Generating worksheet with AI');
    }

    const prompt = this.buildPrompt(request);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educator creating high-quality worksheets. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 8000
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response
      let worksheetData;
      try {
        worksheetData = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        throw new Error('Invalid JSON response from AI');
      }

      // Convert to our worksheet format
      const worksheet = this.convertToWorksheet(worksheetData, request);
      
      return {
        worksheet,
        markdown: this.convertToMarkdown(worksheet),
        usage: completion.usage
      };
    } catch (error) {
      console.error('Error generating worksheet:', error);
      throw error;
    }
  }

  /**
   * Build the prompt for OpenAI
   */
  protected buildPrompt(request: WorksheetRequest): string {
    return `Create a ${request.difficulty || 'medium'} difficulty ${request.subject} worksheet about "${request.topic || 'general concepts'}" for grade ${request.gradeLevel || 7} students.

Include:
- A clear title
- Brief instructions for students
- ${request.targetQuestionCount || 10} questions of types: ${(request.questionTypes || ['multiple_choice']).join(', ')}
- Each question should have appropriate marks/points

${request.customPrompt ? `Additional requirements: ${request.customPrompt}` : ''}

Respond with valid JSON in this format:
{
  "title": "Worksheet Title",
  "instructions": "Instructions for students",
  "sections": [
    {
      "title": "Section Title",
      "questions": [
        {
          "text": "Question text",
          "type": "question_type",
          "options": ["A", "B", "C", "D"],
          "answer": "A",
          "marks": 1
        }
      ]
    }
  ]
}`;
  }

  /**
   * Convert AI response to our Worksheet format
   */
  protected convertToWorksheet(data: any, request: WorksheetRequest): Worksheet {
    return {
      id: uuidv4(),
      title: data.title || `${request.subject} Worksheet`,
      subject: request.subject,
      topic: request.topic,
      difficulty: request.difficulty || 'medium',
      instructions: data.instructions || 'Complete all questions carefully.',
      introduction: data.introduction || '',
      sections: data.sections || [],
      language: request.language || 'English',
      estimatedTimeMinutes: 30,
      tags: [request.subject.toLowerCase(), request.topic?.toLowerCase()].filter((tag): tag is string => Boolean(tag)),
      seo_description: `A ${request.difficulty || 'medium'} difficulty ${request.subject} worksheet on ${request.topic || 'general concepts'}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Convert worksheet to markdown format
   */
  protected convertToMarkdown(worksheet: Worksheet): string {
    let markdown = `# ${worksheet.title}\n\n`;
    
    if (worksheet.instructions) {
      markdown += `**Instructions:** ${worksheet.instructions}\n\n`;
    }

    worksheet.sections.forEach((section, sectionIndex) => {
      markdown += `## ${section.title}\n\n`;
      
      section.questions.forEach((question, questionIndex) => {
        const questionNumber = questionIndex + 1;
        markdown += `**${questionNumber}.** ${question.text}\n`;
        
        if (question.options && question.options.length > 0) {
          question.options.forEach((option, optionIndex) => {
            const letter = String.fromCharCode(65 + optionIndex); // A, B, C, D
            markdown += `   ${letter}) ${option}\n`;
          });
        }
        
        if (question.marks) {
          markdown += `   *(${question.marks} mark${question.marks > 1 ? 's' : ''})*\n`;
        }
        
        markdown += '\n';
      });
    });

    return markdown;
  }
}
