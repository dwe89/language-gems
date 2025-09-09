// Worksheet Router - Routes worksheet generation requests to appropriate handlers
import { OpenAI } from 'openai';
import { WorksheetRequest, WorksheetResponse } from './core/types';
import { LanguagesHandler } from './handlers/languagesHandler';
import { TemplateHandler } from './handlers/templateHandler';

export class WorksheetRouter {
  private openai: OpenAI;
  private handlers: Map<string, any> = new Map();
  private templateHandler: TemplateHandler;

  constructor(openai: OpenAI) {
    this.openai = openai;
    this.templateHandler = new TemplateHandler(openai);
    this.initializeHandlers();
  }

  /**
   * Initialize all worksheet handlers
   */
  private initializeHandlers(): void {
    // Language handler for all language subjects
    const languagesHandler = new LanguagesHandler(this.openai);
    
    // Map various language subjects to the languages handler
    const languageSubjects = [
      'languages', 'spanish', 'french', 'german', 'italian', 'portuguese',
      'chinese', 'japanese', 'russian', 'arabic'
    ];
    
    languageSubjects.forEach(subject => {
      this.handlers.set(subject.toLowerCase(), languagesHandler);
    });

    // For now, we'll use the languages handler for other subjects too
    // You can add specific handlers later
    this.handlers.set('english', languagesHandler);
    this.handlers.set('mathematics', languagesHandler);
    this.handlers.set('science', languagesHandler);
    this.handlers.set('history', languagesHandler);
    this.handlers.set('geography', languagesHandler);
  }

  /**
   * Generate a worksheet using the appropriate handler
   */
  async generateWorksheet(request: WorksheetRequest): Promise<WorksheetResponse> {
    // Check if this is a template-based request
    if (request.template) {
      console.log(`[WorksheetRouter] Using template handler for template: ${request.template}`);

      try {
        const result = await this.templateHandler.generateWorksheet(request);
        console.log(`[WorksheetRouter] Successfully generated template worksheet: ${result.worksheet.title}`);
        return result;
      } catch (error) {
        console.error(`[WorksheetRouter] Error generating template worksheet:`, error);
        throw error;
      }
    }

    // Fallback to legacy subject-based routing
    const subjectKey = request.subject.toLowerCase();

    // Get the appropriate handler
    let handler = this.handlers.get(subjectKey);

    if (!handler) {
      // Fallback to languages handler for unknown subjects
      console.warn(`No specific handler found for subject: ${request.subject}. Using languages handler.`);
      handler = this.handlers.get('languages');
    }

    if (!handler) {
      throw new Error(`No handler available for subject: ${request.subject}`);
    }

    // Set job ID for progress tracking if available
    if (request.jobId) {
      handler.setJobId(request.jobId);
    }

    try {
      console.log(`[WorksheetRouter] Generating worksheet for subject: ${request.subject}`);
      const result = await handler.generateWorksheet(request);
      console.log(`[WorksheetRouter] Successfully generated worksheet: ${result.worksheet.title}`);
      return result;
    } catch (error) {
      console.error(`[WorksheetRouter] Error generating worksheet for ${request.subject}:`, error);
      throw error;
    }
  }

  /**
   * Get available subjects that have handlers
   */
  getAvailableSubjects(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Check if a subject has a handler
   */
  hasHandler(subject: string): boolean {
    return this.handlers.has(subject.toLowerCase());
  }
}
