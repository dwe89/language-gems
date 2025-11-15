import { OpenAI } from 'openai';
import { WorksheetHandler } from '../core/baseHandler';
import { WorksheetRequest, WorksheetResponse, Worksheet } from '../core/types';
import { CentralizedVocabularyService } from '@/services/centralizedVocabularyService';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { 
  getContentConstraint, 
  formatContentConstraintForPrompt 
} from '../content-constraints';

export class TemplateHandler extends WorksheetHandler {
  private vocabularyService: CentralizedVocabularyService;

  constructor(openai: OpenAI) {
    super(openai);
    
    // Initialize Supabase client for vocabulary service
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.vocabularyService = new CentralizedVocabularyService(supabase);
  }

  async generateWorksheet(request: WorksheetRequest): Promise<WorksheetResponse> {
    const jobId = request.jobId;
    if (!jobId) {
      throw new Error('Job ID is required for template-based generation');
    }

    this.updateJobProgress(jobId, 'promptGeneration', 20, 'Processing template configuration');

    const templateId = request.template;
    if (!templateId) {
      throw new Error('Template ID is required for template-based generation');
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`🎯 WORKSHEET GENERATION REQUEST`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Template: ${templateId}`);
    console.log(`Subject: ${request.subject}`);
    console.log(`Original Subject: ${request.originalSubject}`);
    console.log(`Topic: ${request.topic || 'NOT PROVIDED'}`);
    console.log(`Subtopic: ${request.subtopic || 'NOT PROVIDED'}`);
    console.log(`Category: ${request.category || 'NOT PROVIDED'}`);
    console.log(`Subcategory: ${request.subcategory || 'NOT PROVIDED'}`);
    console.log(`Curriculum Level: ${request.curriculumLevel || 'NOT PROVIDED'}`);
    console.log(`Grade Level: ${request.gradeLevel || 'NOT PROVIDED'}`);
    console.log(`Difficulty: ${request.difficulty || 'NOT PROVIDED'}`);
    console.log(`Custom Vocabulary: ${request.customVocabulary ? 'YES (' + request.customVocabulary.substring(0, 50) + '...)' : 'NO'}`);
    console.log(`${'='.repeat(80)}\n`);

    // Get vocabulary if needed for language subjects (NOT for grammar_exercises)
    let vocabularyWords: any[] = [];
    console.log(`[TemplateHandler] Checking if ${request.subject} is a language subject: ${this.isLanguageSubject(request.subject)}`);
    console.log(`[TemplateHandler] Template ID: ${templateId}`);
    console.log(`[TemplateHandler] Custom vocabulary provided: ${!!request.customVocabulary}`);
    
    if (this.isLanguageSubject(request.subject) && !request.customVocabulary && templateId !== 'grammar_exercises') {
      console.log(`[TemplateHandler] Fetching vocabulary for ${request.subject} (original: ${request.originalSubject})`);
      vocabularyWords = await this.getVocabularyForTemplate(request);
      console.log(`[TemplateHandler] ✅ FINAL RESULT: Retrieved ${vocabularyWords.length} vocabulary words`);
      
      if (vocabularyWords.length === 0) {
        console.error(`\n${'!'.repeat(80)}`);
        console.error(`❌ CRITICAL: NO VOCABULARY RETRIEVED!`);
        console.error(`${'!'.repeat(80)}`);
        console.error(`This means the database query returned 0 results.`);
        console.error(`Check that category='${request.category}' and subcategory='${request.subcategory}' exist in database.`);
        console.error(`${'!'.repeat(80)}\n`);
      }
    } else {
      console.log(`[TemplateHandler] ⏭️ SKIPPING vocabulary fetch because:`);
      if (!this.isLanguageSubject(request.subject)) {
        console.log(`  - Not a language subject (subject: ${request.subject})`);
      }
      if (request.customVocabulary) {
        console.log(`  - Custom vocabulary was provided`);
      }
      if (templateId === 'grammar_exercises') {
        console.log(`  - Template is grammar_exercises`);
      }
    }

    this.updateJobProgress(jobId, 'promptGeneration', 30, 'Building template-specific prompt');

    // Generate template-specific prompt
    const prompt = this.buildTemplatePrompt(request, templateId, vocabularyWords);

    this.updateJobProgress(jobId, 'aiProcessing', 50, 'Generating worksheet with AI');

    try {
      console.log('Sending request to OpenAI with prompt length:', prompt.length);
      console.log('System prompt:', this.getSystemPrompt(templateId).substring(0, 200) + '...');

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', 
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(templateId)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 8000
      });

      console.log('OpenAI response:', {
        choices: completion.choices?.length,
        firstChoice: completion.choices[0]?.message?.content?.substring(0, 200) + '...',
        finishReason: completion.choices[0]?.finish_reason,
        usage: completion.usage
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        console.error('Empty response from OpenAI:', {
          message: completion.choices[0]?.message,
          finishReason: completion.choices[0]?.finish_reason,
          usage: completion.usage
        });
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response robustly. Models sometimes return prose + JSON or
      // include trailing commas / code fences. Try multiple heuristics before
      // failing so generation is more resilient.
      let worksheetData;
      const rawAIContent = content;
      try {
        worksheetData = JSON.parse(rawAIContent);
      } catch (initialParseError) {
        console.warn('Initial JSON.parse failed; attempting to extract JSON block from AI response.');
        console.warn('Raw AI content (truncated 1k):', rawAIContent.substring(0, 1000));

        // 1) Try to extract fenced JSON ```json ... ``` blocks
        const fencedMatch = rawAIContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        let candidate: string | null = fencedMatch && fencedMatch[1] ? fencedMatch[1].trim() : null;

        // 2) If no fenced block, try to extract the first { ... } JSON-like substring
        if (!candidate) {
          const firstBrace = rawAIContent.indexOf('{');
          const lastBrace = rawAIContent.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            candidate = rawAIContent.substring(firstBrace, lastBrace + 1);
          }
        }

        // 3) If we found a candidate, try to clean common issues (trailing commas, comments)
        if (candidate) {
          let cleaned = candidate
            // Remove single-line comments (// ...)
            .replace(/\/\/[^\n]*/g, '')
            // Remove multi-line comments (/* ... */)
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove trailing commas before } or ]
            .replace(/,\s*(?=[}\]])/g, '');
          
          try {
            worksheetData = JSON.parse(cleaned);
            console.log('Parsed AI JSON after extraction/cleanup.');
          } catch (secondParseError) {
            console.warn('Failed to parse cleaned candidate JSON:', secondParseError);
            console.warn('Candidate (truncated 1k):', candidate.substring(0, 1000));
            throw new Error('Invalid JSON response from AI');
          }
        } else {
          // No candidate JSON found, rethrow a helpful error for telemetry
          console.error('No JSON block found in AI response.');
          throw new Error('Invalid JSON response from AI');
        }
      }

      this.updateJobProgress(jobId, 'formatting', 80, 'Formatting worksheet content');

      // Convert to our worksheet format
      const worksheet = this.convertToWorksheetWithTemplate(worksheetData, request, templateId);
      
      return {
        worksheet,
        markdown: this.convertToMarkdown(worksheet),
        usage: completion.usage
      };
    } catch (error) {
      console.error('Error generating template-based worksheet:', error);
      throw error;
    }
  }

  private isLanguageSubject(subject: string): boolean {
    const languageSubjects = ['spanish', 'french', 'german', 'italian', 'languages'];
    return languageSubjects.includes(subject.toLowerCase());
  }

  private async getVocabularyForTemplate(request: WorksheetRequest): Promise<any[]> {
    try {
      const query: any = {
        language: this.getLanguageCode(request.originalSubject || request.subject),
        // DON'T limit vocabulary by question count - get ALL words from the subcategory!
        // The AI should have access to the full vocabulary list to create better content
        limit: 100 // Reasonable max to prevent overwhelming the AI
      };

      console.log(`[TemplateHandler] 🔍 Starting vocabulary fetch`);
      console.log(`[TemplateHandler] 📋 Request details:`, {
        subject: request.subject,
        originalSubject: request.originalSubject,
        category: request.category,
        subcategory: request.subcategory,
        topic: request.topic,
        subtopic: request.subtopic,
        curriculumLevel: request.curriculumLevel
      });

      // Add curriculum-specific filters
      if (request.curriculumLevel === 'KS4') {
        query.curriculumLevel = 'KS4';
        if (request.examBoard) {
          query.examBoard = request.examBoard;
        }
        if (request.tier) {
          query.tier = request.tier;
        }
      } else {
        // Default to KS3
        query.curriculumLevel = 'KS3';
        
        // Handle category-level mappings (frontend → database)
        // No category mapping needed - they match!
        if (request.category) {
          query.category = request.category;
        }
        
        if (request.subcategory) {
          // NO COMPOSITE SUBCATEGORIES NEEDED!
          // The src/utils/categories.ts file already matches the database exactly
          // Just use the subcategory as-is
          query.subcategory = request.subcategory;
        }
      }

      console.log(`[TemplateHandler] 🎯 Final vocabulary query:`, JSON.stringify(query, null, 2));

      // Execute the query - no composite subcategory handling needed!
      const vocabulary = await this.vocabularyService.getVocabulary(query);
      
      console.log(`[TemplateHandler] ✅ Retrieved ${vocabulary.length} vocabulary words`);
      if (vocabulary.length > 0) {
        console.log(`[TemplateHandler] 📝 Sample vocabulary:`, vocabulary.slice(0, 5).map(v => `${v.word} (${v.translation})`));
      } else {
        console.warn(`[TemplateHandler] ⚠️ NO VOCABULARY FOUND for query:`, query);
      }
      
      return vocabulary;
    } catch (error) {
      console.error('[TemplateHandler] ❌ Error fetching vocabulary:', error);
      return [];
    }
  }

  private getLanguageCode(subject: string): string {
    const languageMap: { [key: string]: string } = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'italian': 'it',
      'languages': 'es' // Default to Spanish for the generic "Languages" subject
    };
    return languageMap[subject.toLowerCase()] || 'es';
  }

  private getSystemPrompt(templateId: string): string {
    const basePrompt = 'You are an expert educator creating high-quality worksheets. Always respond with valid JSON only - no comments, no explanations, no markdown code blocks, just pure JSON.';
    
    const templateSpecificPrompts: { [key: string]: string } = {
      vocabulary_builder: `${basePrompt} You specialize in creating vocabulary worksheets with mixed activities including matching, fill-in-the-blank, and translation exercises.`,
  vocabulary_practice: `${basePrompt} You specialize in creating vocabulary practice worksheets with matching, fill-in-the-blank, translation, word bank, word search, and crossword exercises using specific vocabulary words.`,
  grammar_exercises: `${basePrompt} You specialize in creating engaging grammar practice packs that combine clear explanations, worked examples, and varied activity types (conjugation tables, sentence completion, transformations, error correction). Always respond with well-structured JSON that includes rich instructional content and complete answer keys.`,
      verb_conjugation: `${basePrompt} You specialize in creating verb conjugation practice worksheets with contextual sentences and blanks for students to fill in correct verb forms.`,
      sentence_builder: `${basePrompt} You specialize in creating sentence unscrambling activities where students must put jumbled words back in the correct order.`,
      reading_comprehension: `${basePrompt} You specialize in creating reading comprehension worksheets with level-appropriate texts and comprehension activities. CRITICAL: For reading comprehension templates, you MUST use a special JSON format with fields like "topic_title", "article_paragraphs_html", "true_false_questions", etc. Do NOT use the standard worksheet format with "sections".`,
      guided_reading: `${basePrompt} You specialize in creating cloze activities where key words are removed from texts for students to fill in.`,
      word_search: `${basePrompt} You specialize in creating word search puzzles from vocabulary lists with clear grids and word lists.`,
      crossword: `${basePrompt} You specialize in creating crossword puzzles with clues based on vocabulary definitions and clear numbered grids.`,
      vocabulary_crossword: `${basePrompt} You specialize in creating vocabulary-based crossword puzzles using specific vocabulary words with contextual clues.`,
      vocabulary_wordsearch: `${basePrompt} You specialize in creating vocabulary-based word search puzzles using specific vocabulary words with clear grids and instructions.`,
      revision_sheet: `${basePrompt} You specialize in creating comprehensive revision sheets that combine multiple activity types in a single worksheet.`
    };

    return templateSpecificPrompts[templateId] || basePrompt;
  }

  private getTextTypeGuidance(textType?: string): string {
    if (!textType) return '';
    
    const guidance: Record<string, string> = {
      'personal-account': 'Write in first person (Yo/I) as a personal account or personal narrative.',
      'diary-entry': 'Write in first person (Yo/I) in past tense as a diary entry or journal reflection.',
      'informational': 'Write in third person as an informational or expository text presenting facts.',
      'dialogue': 'Write as a dialogue or conversation between multiple people using mixed persons.',
      'fictional-narrative': 'Write in third person as a fictional story or narrative.'
    };
    
    return guidance[textType] || '';
  }

  private getTenseFocusGuidance(tenseFocus?: string): string {
    if (!tenseFocus || tenseFocus === 'mixed') return '';
    
    const guidance: Record<string, string> = {
      'present': 'Focus primarily on present tense verbs throughout the text.',
      'preterite': 'Focus primarily on preterite (simple past) tense verbs.',
      'imperfect': 'Focus primarily on imperfect (descriptive past) tense verbs.',
      'future': 'Focus primarily on future tense verbs and expressions.',
      'conditional': 'Focus primarily on conditional tense and hypothetical situations.',
      'subjunctive': 'Focus primarily on subjunctive mood and its uses.',
      'complex': 'Use 3 or more different tenses throughout the text in a sophisticated way.'
    };
    
    return guidance[tenseFocus] || '';
  }

  private getPersonFocusGuidance(personFocus?: string): string {
    if (!personFocus || personFocus === 'mixed') return '';
    
    const guidance: Record<string, string> = {
      'first-singular': 'Write primarily using first person singular conjugations (I / je / ich).',
      'second': 'Write primarily using second person conjugations (you / tu/vous / du/Sie).',
      'third-singular': 'Write primarily using third person singular conjugations (he/she / il/elle / er/sie).',
      'first-plural': 'Write primarily using first person plural conjugations (we / nous / wir).',
      'third-plural': 'Write primarily using third person plural conjugations (they / ils/elles / sie).'
    };
    
    return guidance[personFocus] || '';
  }

  private getYearLevelGuidance(yearLevel?: string): string {
    if (!yearLevel) return '';
    
    const guidance: Record<string, string> = {
      'Y7': `Year 7 (A1-A2 Beginner Level) - CRITICAL SIMPLICITY REQUIREMENTS:
        - Vocabulary: Use ONLY the most basic 200-300 high-frequency words (colors, numbers, family, basic verbs like 'to be', 'to have', 'to go')
        - Sentence Length: Maximum 8-10 words per sentence - keep everything SHORT and SIMPLE
        - Tenses: Use ONLY present tense (and simple past if specifically requested) - NO subjunctive, NO conditional, NO complex tenses
        - Grammar: Basic subject-verb-object sentences only - NO subordinate clauses, NO complex structures
        - Topics: Concrete, everyday topics only (my family, my hobbies, my school) - NO abstract concepts
        - Reading Level: Should be readable by a complete beginner who has studied the language for 3-6 months maximum
        - Example sentences: "Me llamo Juan." "Tengo doce años." "Mi familia es pequeña." "Me gusta el fútbol."
        - AVOID: Complex verb forms, abstract nouns, literary language, philosophical concepts, advanced vocabulary`,
      'Y8': 'Year 8 (A2): Use elementary vocabulary (500-800 words), present and simple past tenses, straightforward sentence patterns. Suitable for elementary learners.',
      'Y9': 'Year 9 (A2-B1): Use intermediate vocabulary (800-1200 words), multiple tenses including future, more complex sentences with conjunctions. Suitable for pre-intermediate learners.',
      'Y10': 'Year 10 (B1): Use intermediate vocabulary (1200-1500 words), all major tenses, subordinate clauses, idiomatic expressions. Suitable for GCSE intermediate level.',
      'Y11': 'Year 11 (B1-B2): Use advanced vocabulary (1500+ words), all tenses including subjunctive and conditional, complex grammatical structures, sophisticated expressions. Suitable for GCSE higher tier.'
    };
    
    return guidance[yearLevel] || '';
  }

  private buildTemplatePrompt(request: WorksheetRequest, templateId: string, vocabularyWords: any[]): string {
    // Get the properly capitalized language name
    const languageName = (request.originalSubject || request.subject || 'Spanish')
      .charAt(0).toUpperCase() + (request.originalSubject || request.subject || 'Spanish').slice(1);
    
    const baseInfo = `Create a ${request.difficulty || 'medium'} difficulty ${languageName} worksheet about "${request.topic || 'general concepts'}" for grade ${request.gradeLevel || 7} students.`;
    
    // Get pedagogical parameters with detailed descriptions - extract from advancedOptions
    const textTypeGuidance = this.getTextTypeGuidance((request.advancedOptions as any)?.textType);
    const tenseFocusGuidance = this.getTenseFocusGuidance((request.advancedOptions as any)?.tenseFocus);
    const personFocusGuidance = this.getPersonFocusGuidance((request.advancedOptions as any)?.personFocus);
    const yearLevelGuidance = this.getYearLevelGuidance((request.advancedOptions as any)?.yearLevel);
    
    // Log pedagogical parameters for debugging
    console.log(`[TemplateHandler] Building prompt with pedagogical parameters:`, {
      textType: (request.advancedOptions as any)?.textType,
      tenseFocus: (request.advancedOptions as any)?.tenseFocus,
      personFocus: (request.advancedOptions as any)?.personFocus,
      yearLevel: (request.advancedOptions as any)?.yearLevel,
      topic: request.topic,
      subtopic: request.subtopic,
      vocabularyCount: vocabularyWords.length
    });
    
    // Add vocabulary context if available
    let vocabularyContext = '';
    if (vocabularyWords.length > 0) {
      const vocabList = vocabularyWords.map(w => `${w.word} (${w.translation})`).join(', ');
      vocabularyContext = `\n\nUse these vocabulary words: ${vocabList}`;
    } else if (request.customVocabulary) {
      vocabularyContext = `\n\nUse these custom vocabulary words: ${request.customVocabulary}`;
    }

    const grammarExerciseSource = (() => {
      const advanced = request.advancedOptions?.grammarExerciseTypes;
      if (advanced && advanced.length > 0) {
        return advanced;
      }
      if (request.questionTypes && request.questionTypes.length > 0) {
        return request.questionTypes;
      }
      return [] as string[];
    })();

    const normalizeGrammarType = (value: string) => {
      if (!value) return value;
      const simplified = value.toLowerCase().replace(/[^a-z]/g, '');
      const map: Record<string, string> = {
        conjugation: 'conjugation',
        verbconjugation: 'conjugation',
        sentencecompletion: 'sentence-completion',
        sentencecompletionexercise: 'sentence-completion',
        transformation: 'transformation',
        sentencetransformation: 'transformation',
        errorcorrection: 'error-correction',
        proofreading: 'error-correction'
      };
      return map[simplified] || value.toLowerCase();
    };

    const grammarExerciseTypes = (() => {
      const normalized = Array.from(
        new Set(grammarExerciseSource.map(normalizeGrammarType).filter(Boolean))
      );
      if (normalized.length > 0) {
        return normalized;
      }
      return ['conjugation', 'sentence-completion', 'transformation', 'error-correction'];
    })();

    const grammarExerciseDescriptions = grammarExerciseTypes
      .map((type, index) => {
        const prefix = `${index + 1}.`;
        switch (type) {
          case 'conjugation':
            return `${prefix} **Verb Conjugation** – Include 2-3 verbs. Provide "verb", optional "tense", and a "pronouns" array (e.g. ["yo","tú","él/ella","nosotros","vosotros","ellos/ellas"]).`;
          case 'sentence-completion':
            return `${prefix} **Sentence Completion** – Contextual sentences with one blank. Each item needs "sentence" and "answer".`;
          case 'transformation':
            return `${prefix} **Sentence Transformation** – Supply "original", an "instruction", and the transformed "answer".`;
          case 'error-correction':
            return `${prefix} **Error Correction** – Provide "incorrect", the corrected sentence in "correction", plus an "explanation".`;
          default:
            return `${prefix} **${type}** – Include "instructions" and an "items" array with clear fields.`;
        }
      })
      .join('\n');

    const grammarFocusDescription = (() => {
      const focusValue = (request.advancedOptions as any)?.grammarFocus || request.subtopic || request.topic;
      if (!focusValue) return '';
      const focusArray = Array.isArray(focusValue) ? focusValue : [focusValue];
      const formatted = focusArray
        .map((entry: string) => entry)
        .filter(Boolean)
        .map((entry: string) => entry.replace(/[_-]/g, ' '))
        .map((entry: string) => entry.charAt(0).toUpperCase() + entry.slice(1));
      if (formatted.length === 0) return '';
      const focusText = formatted.join(', ');
      return `Focus specifically on ${focusText}.`;
    })();

    const templatePrompts: { [key: string]: string } = {
      vocabulary_builder: `${baseInfo}${vocabularyContext}

Create a vocabulary builder worksheet with:
- Section 1: Matching exercise (${Math.ceil((request.targetQuestionCount || 10) / 3)} items)
- Section 2: Fill in the blanks with articles/gender (${Math.ceil((request.targetQuestionCount || 10) / 3)} items)  
- Section 3: Translation exercises (${Math.floor((request.targetQuestionCount || 10) / 3)} items)

Include clear instructions for each section and provide answer keys.`,

      verb_conjugation: `${baseInfo}${vocabularyContext}

Create a verb conjugation drill worksheet with:
- ${request.targetQuestionCount || 10} practice sentences with blanks for verb conjugation
- Focus on ${request.topic || 'present tense'} 
- Include a variety of pronouns and contexts
- Provide the infinitive verb in parentheses as a hint
- Include answer key with correct conjugations`,

      sentence_builder: `${baseInfo}${vocabularyContext}

Create a sentence builder (unscrambling) worksheet with:
- ${request.targetQuestionCount || 10} jumbled sentences to unscramble
- Sentences should be appropriate for the topic and difficulty level
- Include word order hints if needed
- Provide answer key with correct sentence order`,

      reading_comprehension: `${baseInfo}

⚠️ CRITICAL LANGUAGE AND SIMPLICITY REQUIREMENTS ⚠️
TARGET LANGUAGE: ${languageName.toUpperCase()}
- **Reading Passage (article_paragraphs_html):** MUST be written 100% in ${languageName.toUpperCase()} ONLY.
- **Questions/Instructions:** MUST be written 100% in ENGLISH ONLY.
- **TENSE/PERSON:** ${tenseFocusGuidance || 'Focus primarily on present tense'}, ${personFocusGuidance || 'first person singular (Yo/I) conjugations'}.
- **SIMPLICITY:** Use ONLY the most basic 200-300 high-frequency words. Maximum 8-10 words per sentence. Use ONLY present tense (no subjunctive, conditional, or complex tenses). Use basic subject-verb-object sentences (no subordinate clauses or complex structures).
- **TEXT TYPE:** ${textTypeGuidance || 'Write in first person (Yo/I) as a personal account/narrative'} about "${request.subtopic || request.topic || 'general topic'}".
- **MAX LENGTH:** Reading passage MUST NOT exceed 1300 characters (including spaces).

⚠️ MANDATORY VOCABULARY TO INCLUDE ⚠️
You MUST use a minimum of ${Math.min(6, Math.floor(vocabularyWords.length * 0.5))} of these specific words naturally within the reading passage:
${vocabularyWords.map(w => `- ${w.word} (${w.translation})`).join('\n')}

⚠️ MANDATORY JSON STRUCTURE AND COMPONENT COUNTS ⚠️
You MUST return ONLY the exact JSON format specified below, and fulfill these exact component counts:
1.  **Reading Text (article_paragraphs_html):** 2-3 paragraphs. 100% ${languageName}. Max 1300 characters.
2.  **Multiple Choice Questions:** EXACTLY 4 questions. English questions and English options.
3.  **Word Hunt:** Maximum 9 words (English clue, ${languageName} answer from text).
4.  **True/False Questions:** 4-5 statements (English).
5.  **Vocabulary Practice (3 of each):**
    * 3 Sentence Unscramble exercises (scrambled ${languageName} words).
    * 3 Translation exercises (${languageName} sentence to English translation).
    * 3 Tense Detective exercises (instructions in English, ${languageName} answer from text).

CRITICAL: Return ONLY valid JSON. Do NOT include any explanatory text, markdown code blocks, or comments outside the JSON object.
${yearLevelGuidance ? `\nYEAR LEVEL REQUIREMENTS:\n${yearLevelGuidance}` : ''}

JSON FORMAT:
\`\`\`json
{
   - 4-5 statements WRITTEN IN ENGLISH about the text content
   - Students mark true or false based on the ${languageName} text

5. **Vocabulary Practice** (MANDATORY):
   - Include THREE sentence unscramble exercises in ${languageName}
   - Include THREE translation exercises (${languageName} → English)
   - Include THREE tense detective exercises (find specific tenses/grammar in text)

6. **Sentence Unscramble Requirements**:
   - Provide scrambled ${languageName} words that include ALL necessary words (articles, prepositions, etc.)
   - Scrambled words must be able to form a complete, grammatically correct ${languageName} sentence
   - No missing words that would make the sentence incomplete

LANGUAGE REQUIREMENTS - ⚠️ READ THIS CAREFULLY ⚠️:
- **Reading passage (article_paragraphs_html): 100% ${languageName.toUpperCase()} (NOT ENGLISH!)**
- All questions and instructions: ENGLISH ONLY
- Multiple choice questions: ENGLISH questions with ENGLISH answer options
- True/False statements: ENGLISH ONLY
- Word hunt clues: ENGLISH definitions
- Translation sentences: ${languageName} → English
- Unscramble sentences: ${languageName} words to unscramble
- Tense detective answers: ${languageName} sentences from the text

VOCABULARY INTEGRATION:
- You MUST use the provided vocabulary words in the reading text
- Vocabulary words should appear naturally in context
- Word hunt should include vocabulary from the provided list

CRITICAL: You MUST return ONLY this exact JSON format (no other fields):
{
  "topic_title": "Topic name in ${languageName}",
  "article_title": "Article title in ${languageName}",
  "article_paragraphs_html": "⚠️ CRITICAL: Full HTML with <p> tags - MUST BE WRITTEN ENTIRELY IN ${languageName.toUpperCase()} - DO NOT USE ENGLISH - MAXIMUM 1300 characters including spaces ⚠️",
  "true_false_questions": [{"id": 1, "statement": "English statement about the text", "answer": true}],
  "multiple_choice_questions": [
    {
      "id": 1,
      "question": "English question about the text",
      "options": [
        {"letter": "A", "text": "English option A"},
        {"letter": "B", "text": "English option B"},
        {"letter": "C", "text": "English option C"},
        {"letter": "D", "text": "English option D"}
      ],
      "answer": "A"
    }
  ],
  "word_hunt_words": [{"word": "English definition or clue", "answer": "${languageName} word from text (maximum 9 words)"}],
  "vocabulary_writing": [{"word": "${languageName} word", "definition": "English definition"}],
  "unscramble_sentences": [
    {"id": 1, "jumbled_sentence": "scrambled ${languageName} words with ALL necessary articles and prepositions", "answer": "complete correct ${languageName} sentence"},
    {"id": 2, "jumbled_sentence": "scrambled ${languageName} words with ALL necessary articles and prepositions", "answer": "complete correct ${languageName} sentence"},
    {"id": 3, "jumbled_sentence": "scrambled ${languageName} words with ALL necessary articles and prepositions", "answer": "complete correct ${languageName} sentence"}
  ],
  "translation_sentences": [
    {"id": 1, "sentence": "${languageName} sentence to translate", "answer": "English translation"},
    {"id": 2, "sentence": "${languageName} sentence to translate", "answer": "English translation"},
    {"id": 3, "sentence": "${languageName} sentence to translate", "answer": "English translation"}
  ],
  "tense_detective": [
    {"id": 1, "instruction": "Find a sentence in the present tense and write it here", "answer": "Example ${languageName} sentence from text"},
    {"id": 2, "instruction": "Find a sentence with a specific verb form and write it here", "answer": "Example ${languageName} sentence from text"},
    {"id": 3, "instruction": "Find a sentence with a particular grammar structure and write it here", "answer": "Example ${languageName} sentence from text"}
  ]
}

⚠️ FINAL CRITICAL REMINDERS ⚠️:
- Text MAXIMUM 1300 characters including spaces
- **THE READING PASSAGE (article_paragraphs_html) MUST BE WRITTEN IN ${languageName.toUpperCase()} - NOT IN ENGLISH**
- EXACTLY 4 multiple choice questions (in English)
- Maximum 9 word hunt words
- Include EXACTLY 3 of each: sentence unscramble, translation, tense detective
- All questions and instructions in ENGLISH
- Reading passage text in ${languageName.toUpperCase()}
${textTypeGuidance ? `- ${textTypeGuidance}` : ''}
${tenseFocusGuidance ? `- ${tenseFocusGuidance}` : ''}
${personFocusGuidance ? `- ${personFocusGuidance}` : ''}
${yearLevelGuidance ? `- ${yearLevelGuidance}` : ''}
- DO NOT include "title", "instructions", "sections", or any other fields`,

      guided_reading: `${baseInfo}${vocabularyContext}

Create a guided reading (cloze) worksheet with:
- A text (200-300 words) with ${request.targetQuestionCount || 15} key words removed
- Provide a word bank with the missing words
- Focus on vocabulary related to the topic
- Include answer key showing correct word placement`,

      word_search: `${baseInfo}${vocabularyContext}

Create a word search puzzle with:
- A 15x15 grid containing ${request.targetQuestionCount || 15} hidden words
- Words should be related to the topic
- Include the word list for students to find
- Words can be horizontal, vertical, or diagonal
- Provide answer key showing word locations`,

      crossword: `${baseInfo}${vocabularyContext}

Create a crossword puzzle with:
- ${request.targetQuestionCount || 12} clues (mix of across and down)
- Clues should be definitions or hints for vocabulary words
- Include a properly sized grid
- Provide answer key with completed crossword`,

      vocabulary_practice: this.buildVocabularyPracticePrompt(request, baseInfo, vocabularyContext),

      vocabulary_crossword: `${baseInfo}${vocabularyContext}

Create a vocabulary crossword puzzle:
- Use the provided vocabulary words as answers
- Create contextual clues in English that help students identify the Spanish words
- Design a crossword grid (10x10 or 12x12) with numbered squares
- Include both Across and Down clues
- Provide a word bank if needed
- Include clear instructions and answer key`,

      vocabulary_wordsearch: `${baseInfo}${vocabularyContext}

Create a vocabulary word search puzzle:
- Use the provided vocabulary words (Spanish words only)
- Create a 15x15 letter grid with words hidden horizontally, vertically, and diagonally
- Include a clear word bank showing all vocabulary words to find
- Words can be forwards or backwards
- Fill remaining spaces with random letters
- Include clear instructions and answer key with words circled`,

      grammar_exercises: `${baseInfo}${vocabularyContext}

${grammarFocusDescription}

Design a grammar practice worksheet that combines explanation, examples, and these activity types:
${grammarExerciseDescriptions}

Respond with EXACTLY this JSON schema (no other fields):
{
  "title": "Worksheet title",
  "instructions": "Overall student instructions",
  "grammar_topic": "Headline for the grammar focus",
  "explanation": "Detailed explanation (HTML allowed)",
  "examples": [
    {"correct": "Correct model", "incorrect": "Optional incorrect model", "explanation": "Why"}
  ],
  "exercises": [
    {
      "type": "one of ${grammarExerciseTypes.join(', ')}",
      "title": "Section title",
      "instructions": "Activity-specific instructions",
      "items": []
    }
  ],
  "answerKey": {
    "exercise1": ["Answers listed in order"]
  }
}

For each exercise, include at least ${Math.max(4, Math.ceil((request.targetQuestionCount || 12) / grammarExerciseTypes.length))} items. Use these item templates by type:
- conjugation → {"verb": "hablar", "tense": "present", "pronouns": ["yo",...], "answers": {"yo": "hablo", ...}}
- sentence-completion → {"sentence": "Yo ____ al parque.", "answer": "voy"}
- transformation → {"original": "Veo la televisión.", "instruction": "Rewrite in the preterite", "answer": "Vi la televisión."}
- error-correction → {"incorrect": "Ellos va a la escuela.", "correction": "Ellos van a la escuela.", "explanation": "Plural agreement"}

Keep wording culturally neutral, reference the target language (${request.originalSubject || request.subject}), and make the answer key align exactly with provided items.`,

      revision_sheet: `${baseInfo}${vocabularyContext}

Create a comprehensive revision sheet with multiple sections:
- Section A: Vocabulary matching (${Math.ceil((request.targetQuestionCount || 15) / 3)} items)
- Section B: Grammar/verb practice (${Math.ceil((request.targetQuestionCount || 15) / 3)} items)
- Section C: Translation sentences (${Math.floor((request.targetQuestionCount || 15) / 3)} items)
- Include clear section headers and instructions
- Provide comprehensive answer key`
    };

    const templatePrompt = templatePrompts[templateId] || baseInfo;
    
    const appendStandardSchema = !['reading_comprehension', 'vocabulary_practice', 'grammar_exercises'].includes(templateId);

    return `${templatePrompt}

${request.customPrompt ? `Additional requirements: ${request.customPrompt}` : ''}

${appendStandardSchema ? `Respond with valid JSON in this format:
{
  "title": "Worksheet Title",
  "instructions": "General instructions for students",
  "sections": [
    {
      "title": "Section Title",
      "instructions": "Section-specific instructions",
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
  ],
  "answerKey": {
    "section1": ["answer1", "answer2"],
    "section2": ["answer1", "answer2"]
  }
}` : ''}

CRITICAL: Return ONLY valid JSON. Do NOT include:
- JavaScript comments (// or /* */)
- Markdown code blocks
- Explanatory text before or after the JSON
- Any content other than pure JSON`;
  }

  protected convertToWorksheetWithTemplate(data: any, request: WorksheetRequest, templateId: string): Worksheet {
    // For reading comprehension, preserve the raw AI response structure
    if (templateId === 'reading_comprehension') {
      return {
        id: uuidv4(),
        title: data.topic_title || data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
        subject: request.subject,
        topic: request.topic,
        difficulty: request.difficulty || 'medium',
        instructions: data.instructions || 'Read the text and complete all activities.',
        introduction: data.introduction || '',
        sections: [], // Keep empty for reading comprehension
        language: request.language || 'English',
        estimatedTimeMinutes: this.getEstimatedTime(templateId),
        tags: [request.subject.toLowerCase(), templateId, request.topic?.toLowerCase()].filter(Boolean) as string[],
        seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${request.topic || 'general concepts'}`,
        seo_keywords: [request.subject, templateId.replace('_', ' '), request.topic].filter(Boolean).join(', '),
        answerKey: data.answerKey || {},
        metadata: {
          title: data.topic_title || data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
          subject: request.subject,
          difficulty: request.difficulty || 'medium',
          template: templateId,
          vocabularySource: request.customVocabulary ? 'custom' : 'centralized',
          curriculumLevel: request.curriculumLevel,
          examBoard: request.examBoard,
          tier: request.tier
        },
        // Store the raw reading comprehension data
        rawContent: data
      };
    }

    // For vocabulary practice, preserve the new structure with vocabulary_items and exercises
    if (templateId === 'vocabulary_practice') {
      return {
        id: uuidv4(),
        title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
        subject: request.subject,
        topic: request.topic,
        difficulty: request.difficulty || 'medium',
        instructions: data.instructions || 'Complete all vocabulary exercises below.',
        introduction: data.introduction || '',
        sections: [], // Keep empty for vocabulary practice - content is in rawContent
        language: request.language || 'English',
        estimatedTimeMinutes: this.getEstimatedTime(templateId),
        tags: [request.subject.toLowerCase(), templateId, request.topic?.toLowerCase()].filter(Boolean) as string[],
        seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${request.topic || 'general concepts'}`,
        seo_keywords: [request.subject, templateId.replace('_', ' '), request.topic].filter(Boolean).join(', '),
        answerKey: data.answerKey || {},
        metadata: {
          title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
          subject: request.subject,
          difficulty: request.difficulty || 'medium',
          template: templateId,
          vocabularySource: request.customVocabulary ? 'custom' : 'centralized',
          curriculumLevel: request.curriculumLevel,
          examBoard: request.examBoard,
          tier: request.tier
        },
        // Store the raw vocabulary practice data with vocabulary_items and exercises
        rawContent: data
      };
    }

    if (templateId === 'grammar_exercises') {
      const grammarFocus = (request.advancedOptions as any)?.grammarFocus || request.subtopic || request.topic;
      const targetLanguage = request.targetLanguage || request.language || request.subject;
      return {
        id: uuidv4(),
        title: data.title || `${this.getTemplateDisplayName(templateId)} - ${grammarFocus || request.subject}`,
        subject: request.subject,
        topic: request.topic,
        difficulty: request.difficulty || 'medium',
        instructions: data.instructions || request.customPrompt || 'Complete the grammar exercises below.',
        introduction: data.introduction || '',
        sections: [],
        language: targetLanguage || 'English',
        estimatedTimeMinutes: this.getEstimatedTime(templateId),
        tags: [request.subject.toLowerCase(), templateId, grammarFocus?.toString().toLowerCase()].filter(Boolean) as string[],
        seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${grammarFocus || request.topic || 'core grammar skills'}`,
        seo_keywords: [request.subject, templateId.replace('_', ' '), grammarFocus || request.topic].filter(Boolean).join(', '),
        answerKey: data.answerKey || {},
        metadata: {
          title: data.title || `${this.getTemplateDisplayName(templateId)} - ${grammarFocus || request.subject}`,
          subject: request.subject,
          difficulty: request.difficulty || 'medium',
          template: templateId,
          grammarFocus,
          targetLanguage,
          curriculumLevel: request.curriculumLevel,
          examBoard: request.examBoard,
          tier: request.tier
        },
        rawContent: data
      };
    }

    // Default format for other templates
    return {
      id: uuidv4(),
      title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
      subject: request.subject,
      topic: request.topic,
      difficulty: request.difficulty || 'medium',
      instructions: data.instructions || 'Complete all sections carefully.',
      introduction: data.introduction || '',
      sections: data.sections || [],
      language: request.language || 'English',
      estimatedTimeMinutes: this.getEstimatedTime(templateId),
      tags: [request.subject.toLowerCase(), templateId, request.topic?.toLowerCase()].filter(Boolean) as string[],
      seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${request.topic || 'general concepts'}`,
      seo_keywords: [request.subject, templateId.replace('_', ' '), request.topic].filter(Boolean).join(', '),
      answerKey: data.answerKey || {},
      metadata: {
        title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
        subject: request.subject,
        difficulty: request.difficulty || 'medium',
        template: templateId,
        vocabularySource: request.customVocabulary ? 'custom' : 'centralized',
        curriculumLevel: request.curriculumLevel,
        examBoard: request.examBoard,
        tier: request.tier
      }
    };
  }

  private getTemplateDisplayName(templateId: string): string {
    const displayNames: { [key: string]: string } = {
      vocabulary_builder: 'Vocabulary Builder',
      vocabulary_practice: 'Vocabulary Practice',
      vocabulary_crossword: 'Vocabulary Crossword',
      vocabulary_wordsearch: 'Vocabulary Word Search',
      verb_conjugation: 'Verb Conjugation Drill',
      sentence_builder: 'Sentence Builder',
      reading_comprehension: 'Reading Comprehension',
      guided_reading: 'Guided Reading',
      word_search: 'Word Search',
      crossword: 'Crossword Puzzle',
      grammar_exercises: 'Grammar Exercises',
      revision_sheet: 'Revision Sheet'
    };
    return displayNames[templateId] || 'Worksheet';
  }

  private buildVocabularyPracticePrompt(request: WorksheetRequest, baseInfo: string, vocabularyContext: string): string {
    const questionTypes = request.questionTypes || ['matching', 'fillBlanks', 'translations', 'definitions'];
    const exercisesPerType = Math.ceil((request.targetQuestionCount || 15) / questionTypes.length);
    
    // Get pedagogical guidance
    const textTypeGuidance = this.getTextTypeGuidance((request as any).textType);
    const tenseFocusGuidance = this.getTenseFocusGuidance((request as any).tenseFocus);
    const personFocusGuidance = this.getPersonFocusGuidance((request as any).personFocus);
    const yearLevelGuidance = this.getYearLevelGuidance((request as any).yearLevel);
    
    // Determine the target language name
    const targetLanguage = request.originalSubject 
      ? request.originalSubject.charAt(0).toUpperCase() + request.originalSubject.slice(1)
      : (request.topic || 'target language');

    let exerciseTemplates = '';

    if (questionTypes.includes('matching')) {
      exerciseTemplates += `
    {
      "type": "matching",
      "title": "Matching Exercise",
      "instructions": "Match the ${targetLanguage} words with their English translations.",
      "items": [
        {"word": "${targetLanguage} word", "definition": "English translation"},
        // 10 items total (will display in 2 columns: 5 left, 5 right)
      ]
    },`;
    }

    if (questionTypes.includes('fillBlanks')) {
      exerciseTemplates += `
    {
      "type": "fill-in-blank",
      "title": "Fill in the Blanks",
      "instructions": "Complete each sentence with the correct ${targetLanguage} word.",
      "items": [
        {"sentence": "Example sentence with _____ blank.", "answer": "word"},
        // MUST include MINIMUM 6 items, MAXIMUM 8 items
        // Each sentence should have ONE blank marked with _____
        // IMPORTANT: Write sentences in ${targetLanguage}, not in English
        // Use different vocabulary words to create 6-8 different sentences
      ]
    },`;
    }

    if (questionTypes.includes('translations')) {
      exerciseTemplates += `
    {
      "type": "translation",
      "title": "Translation Practice",
      "instructions": "Translate the following words from ${targetLanguage} to English.",
      "items": [
        {"word": "${targetLanguage} vocabulary word", "answer": "English translation"},
        {"word": "${targetLanguage} vocabulary word", "answer": "English translation"},
        {"word": "${targetLanguage} vocabulary word", "answer": "English translation"}
        // MUST include at least 10 vocabulary words
        // Use words from the provided vocabulary list
        // Provide ${targetLanguage} words (not sentences) and expect English translations
      ]
    },`;
    }

    // Sentence unscramble exercise
    if (questionTypes.includes('unscramble')) {
      exerciseTemplates += `
    {
      "type": "sentence-unscramble",
      "title": "Sentence Unscramble",
      "instructions": "Put the words in the correct order to form a proper ${targetLanguage} sentence.",
      "items": [
        {"jumbled_sentence": "scrambled words including ALL necessary articles and prepositions", "answer": "complete correct ${targetLanguage} sentence"},
        {"jumbled_sentence": "scrambled words including ALL necessary articles and prepositions", "answer": "complete correct ${targetLanguage} sentence"},
        {"jumbled_sentence": "scrambled words including ALL necessary articles and prepositions", "answer": "complete correct ${targetLanguage} sentence"}
        // MUST include EXACTLY 3 sentence unscramble exercises
        // Ensure scrambled sentences include ALL words needed (articles, prepositions, etc.)
      ]
    },`;
    }

    // Tense detective exercise  
    if (questionTypes.includes('tenseDetective')) {
      exerciseTemplates += `
    {
      "type": "tense-detective",
      "title": "Tense Detective",
      "instructions": "Find and write sentences that match the grammar patterns described.",
      "items": [
        {"instruction": "Write a sentence in the present tense using a vocabulary word", "answer": "Example ${targetLanguage} sentence"},
        {"instruction": "Write a sentence in the past tense using a vocabulary word", "answer": "Example ${targetLanguage} sentence"},
        {"instruction": "Write a sentence with a specific grammar structure using a vocabulary word", "answer": "Example ${targetLanguage} sentence"}
        // MUST include EXACTLY 3 tense detective exercises
        // Instructions should guide students to create or identify specific tenses/grammar
      ]
    },`;
    }

    if (questionTypes.includes('definitions')) {
      exerciseTemplates += `
    {
      "type": "definition",
      "title": "Multiple Choice",
      "instructions": "Choose the correct ${targetLanguage} word for each definition.",
      "items": [
        {"question": "What is the ${targetLanguage} word for 'example'?", "options": ["option1", "option2", "option3", "option4"], "answer": "option1"},
        // MAX 8 items (will display in 2 columns) - MUST NOT exceed 8 to fit on one page
        // IMPORTANT: Questions MUST be written in ENGLISH (e.g., "What is the French word for 'phone'?")
        // Options should be ${targetLanguage} words
      ]
    },`;
    }

    if (questionTypes.includes('unjumble')) {
      exerciseTemplates += `
    {
      "type": "unjumble",
      "title": "Word Unjumble",
      "instructions": "Unscramble the letters to form the correct ${targetLanguage} word.",
      "items": [
        {"scrambled": "ldemxbrae", "correct": "exambleword"},
        // 8 items total - scramble vocabulary words by mixing up letters
        // Use ${targetLanguage} words from the vocabulary list
      ]
    },`;
    }

    if (questionTypes.includes('wordsearch')) {
      exerciseTemplates += `
    {
      "type": "wordsearch",
      "title": "Word Search",
      "instructions": "Find all the words hidden in the grid below.",
      "grid_size": 16,
      "words": [], // Will be populated with 14 ${targetLanguage} words from vocabulary_items (remove all spaces from multi-word terms)
      "grid": [] // Will be generated automatically
    },`;
    }

    if (questionTypes.includes('crossword')) {
      exerciseTemplates += `
    {
      "type": "crossword",
      "title": "Crossword Puzzle",
  "instructions": "Complete the crossword using the words below",
      "clues": {
        "across": [
          {"number": 1, "clue": "A descriptive clue (e.g., 'A vehicle with two wheels, without a motor' for bicycle)", "answer": "${targetLanguage.toLowerCase()}_word", "position": [0, 0]}
          // Include 10-12 across clues total - use single words without spaces
          // IMPORTANT: Write descriptive, contextual clues that help students learn, NOT direct translations
          // Example good clues: "A place where students learn" (school), "An animal that says meow" (cat)
          // Avoid: "The ${targetLanguage} word for house" - instead write: "A building where a family lives"
          // Use ${targetLanguage} words as answers
        ],
        "down": [
          {"number": 2, "clue": "A descriptive clue (e.g., 'What you use to write on paper' for pen)", "answer": "${targetLanguage.toLowerCase()}_word", "position": [0, 1]}
          // Include 10-12 down clues total - use single words without spaces
          // IMPORTANT: Write descriptive, contextual clues that help students learn, NOT direct translations
          // Use ${targetLanguage} words as answers
        ]
      },
      "grid_size": 15
    },`;
    }

    // Remove trailing comma
    exerciseTemplates = exerciseTemplates.replace(/,$/, '');

    return `${baseInfo}${vocabularyContext}

PEDAGOGICAL CONSTRAINTS:
${textTypeGuidance ? `- TEXT TYPE: ${textTypeGuidance}` : ''}
${tenseFocusGuidance ? `- TENSE FOCUS: ${tenseFocusGuidance}` : ''}
${personFocusGuidance ? `- PERSON FOCUS: ${personFocusGuidance}` : ''}
${yearLevelGuidance ? `- YEAR LEVEL: ${yearLevelGuidance}` : ''}

Create a professional vocabulary practice worksheet using this EXACT JSON structure:

{
  "title": "Worksheet title here",
  "instructions": "Complete all vocabulary exercises below. Use the vocabulary list for reference.",
  "vocabulary_items": [
    {"word": "${targetLanguage} word", "translation": "English translation", "article": "el/la/los/las if applicable"},
    // Include ALL provided vocabulary words here
  ],
  "word_bank": ["word1", "word2", "word3"], // ${targetLanguage} words only for word bank exercises
  "exercises": [${exerciseTemplates}
  ]
}

CRITICAL INSTRUCTIONS:
1. Use ONLY the provided vocabulary words
2. ALL instructions, questions, and prompts MUST be written in ENGLISH
3. Only the vocabulary words, answers to blanks, and sentence content should be in ${targetLanguage}
4. For fill-in-the-blanks: Create MINIMUM 6 and MAXIMUM 8 sentences in ${targetLanguage} with blanks
5. For multiple choice: Questions MUST be in ENGLISH (e.g., "What is the French word for 'phone'?"), options in ${targetLanguage}
6. Never use "undefined" or duplicate numbering
7. Create meaningful, contextual sentences and questions
${textTypeGuidance ? `8. ${textTypeGuidance}` : ''}
${tenseFocusGuidance ? `9. ${tenseFocusGuidance}` : ''}
${personFocusGuidance ? `10. ${personFocusGuidance}` : ''}
${yearLevelGuidance ? `11. ${yearLevelGuidance}` : ''}`;
  }

  private getEstimatedTime(templateId: string): number {
    const timeEstimates: { [key: string]: number } = {
      vocabulary_builder: 25,
      vocabulary_practice: 30,
      vocabulary_crossword: 25,
      vocabulary_wordsearch: 20,
      verb_conjugation: 20,
      sentence_builder: 15,
      reading_comprehension: 30,
      guided_reading: 25,
      word_search: 20,
      crossword: 35,
      grammar_exercises: 30,
      revision_sheet: 45
    };
    return timeEstimates[templateId] || 30;
  }
}
