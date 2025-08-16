/**
 * AI-Assisted Vocabulary Curation Service
 * 
 * Uses GPT-5-Nano for complex linguistic analysis and vocabulary normalization.
 * Processes batches of problematic entries with human review workflow.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { VocabularyEntry, DataIssue } from './VocabularyDataAuditService';

export interface AISuggestion {
  id: string;
  originalWord: string;
  lemma: string;
  canonicalForm: string;
  isMWE: boolean;
  mweType?: 'noun_phrase' | 'phrasal_verb' | 'fixed_expression' | 'collocation' | 'contraction' | null;
  componentWords?: string[];
  partOfSpeech: string;
  confidence: number;
  reasoning: string;
  suggestedTranslation?: string;
}

export interface BatchProcessingResult {
  batchId: string;
  processedCount: number;
  suggestions: AISuggestion[];
  errors: string[];
  cost: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
  processingTime: number;
}

export interface HumanReview {
  suggestionId: string;
  decision: 'approve' | 'reject' | 'modify';
  modifications?: Partial<AISuggestion>;
  reviewerNotes: string;
  reviewedAt: Date;
  reviewerId: string;
}

export class AIVocabularyCurationService {
  private supabase: SupabaseClient;
  private openaiApiKey: string;
  private batchSize: number = 20; // Reduced for better reliability
  
  // Cost tracking
  private readonly INPUT_COST_PER_1M = 0.05;
  private readonly OUTPUT_COST_PER_1M = 0.40;

  constructor(supabase: SupabaseClient, openaiApiKey: string) {
    this.supabase = supabase;
    this.openaiApiKey = openaiApiKey;
  }

  /**
   * Process a batch of vocabulary entries using GPT-5-Nano
   */
  async processBatch(entries: VocabularyEntry[]): Promise<BatchProcessingResult> {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    console.log(`🤖 Processing batch ${batchId} with ${entries.length} entries...`);

    try {
      // Prepare the prompt
      const prompt = this.buildPrompt(entries);
      
      // Call GPT-5-Nano
      const response = await this.callGPT5Nano(prompt);
      
      // Parse response
      console.log('🔍 Raw AI response length:', response.content.length);
      const suggestions = this.parseAIResponse(response.content, entries);
      console.log('📊 Parsed suggestions count:', suggestions.length);
      
      // Calculate costs
      const cost = {
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
        totalCost: (response.usage.prompt_tokens / 1000000) * this.INPUT_COST_PER_1M + 
                   (response.usage.completion_tokens / 1000000) * this.OUTPUT_COST_PER_1M
      };

      const processingTime = Date.now() - startTime;

      console.log(`✅ Batch ${batchId} completed in ${processingTime}ms`);
      console.log(`💰 Cost: $${cost.totalCost.toFixed(4)} (${cost.inputTokens} input + ${cost.outputTokens} output tokens)`);

      return {
        batchId,
        processedCount: suggestions.length,
        suggestions,
        errors: [],
        cost,
        processingTime
      };

    } catch (error) {
      console.error(`❌ Batch ${batchId} failed:`, error);
      return {
        batchId,
        processedCount: 0,
        suggestions: [],
        errors: [error instanceof Error ? error.message : String(error)],
        cost: { inputTokens: 0, outputTokens: 0, totalCost: 0 },
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Build the prompt for GPT-5-Nano
   */
  private buildPrompt(entries: VocabularyEntry[]): string {
    const examples = `
Examples of correct analysis:
1. "prefiero" (Spanish) → lemma: "preferir", is_mwe: false, canonical_form: "preferir", part_of_speech: "verb"
2. "me gusta" (Spanish) → lemma: "me gusta", is_mwe: true, mwe_type: "fixed_expression", component_words: ["me", "gusta"]
3. "l'hôtel" (French) → lemma: "hôtel", is_mwe: true, mwe_type: "contraction", component_words: ["l'", "hôtel"], canonical_form: "l'hôtel"
4. "casas" (Spanish) → lemma: "casa", is_mwe: false, canonical_form: "casa", part_of_speech: "noun"
5. "¿Desde cuándo?" (Spanish) → lemma: "desde cuándo", is_mwe: true, mwe_type: "fixed_expression", component_words: ["desde", "cuándo"]
`;

    const instructions = `
You are a linguistic expert analyzing vocabulary entries for a language learning platform. 

For each entry, provide a JSON object with:
- lemma: The base form (infinitive for verbs, singular for nouns, base form for adjectives)
- canonical_form: The standard dictionary form (lemma for single words, full phrase for MWEs)
- is_mwe: true if multi-word expression, false if single word
- mwe_type: "noun_phrase", "phrasal_verb", "fixed_expression", "collocation", "contraction", or null
- component_words: Array of components (clean, no punctuation) for MWEs only
- part_of_speech: "verb", "noun", "adjective", "adverb", "preposition", "pronoun", "determiner", "conjunction", "interjection"
- confidence: 0.0-1.0 confidence in your analysis
- reasoning: Brief explanation of your decisions
- suggested_translation: Only if the current translation seems incorrect

Key rules:
1. For conjugated verbs: lemma should be the infinitive (preferir, not prefiero)
2. For plural nouns: lemma should be singular (casa, not casas)  
3. For French contractions (l', d', etc.): mark as MWE with contraction type
4. For German separable verbs: keep as single word unless clearly separated
5. Remove punctuation from component_words but preserve in canonical_form if meaningful
6. Be conservative with MWE classification - only mark as MWE if truly multi-word

${examples}

Analyze these entries and return a JSON array:
`;

    const entriesJson = entries.map(entry => ({
      id: entry.id,
      word: entry.word,
      translation: entry.translation,
      language: entry.language,
      current_is_mwe: entry.is_mwe,
      current_mwe_type: entry.mwe_type,
      current_component_words: entry.component_words
    }));

    return `${instructions}\n\nEntries to analyze:\n${JSON.stringify(entriesJson, null, 2)}`;
  }

  /**
   * Call GPT-5-Nano API
   */
  private async callGPT5Nano(prompt: string): Promise<{
    content: string;
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  }> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are a linguistic expert specializing in vocabulary analysis for language learning platforms. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 10000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`GPT-5-Nano API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from GPT-5-Nano');
    }

    const content = data.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from GPT-5-Nano');
    }

    return {
      content,
      usage: data.usage
    };
  }

  /**
   * Parse AI response into structured suggestions
   */
  private parseAIResponse(content: string, originalEntries: VocabularyEntry[]): AISuggestion[] {
    try {
      console.log('🔍 Raw AI response:', content.substring(0, 500) + '...');
      const parsed = JSON.parse(content);
      console.log('🔍 Parsed JSON keys:', Object.keys(parsed));
      const suggestions: AISuggestion[] = [];

      // Handle both array and object responses
      const results = Array.isArray(parsed) ? parsed : (parsed.results || parsed.suggestions || parsed.entries || [parsed]);
      console.log('🔍 Results array length:', results.length);

      for (let i = 0; i < results.length && i < originalEntries.length; i++) {
        const result = results[i];
        const originalEntry = originalEntries[i]; // Match by position since AI doesn't return ID

        console.log(`🔍 Processing result ${i}:`, {
          originalWord: originalEntry.word,
          lemma: result.lemma,
          isMWE: result.is_mwe
        });

        suggestions.push({
          id: originalEntry.id,
          originalWord: originalEntry.word,
          lemma: result.lemma || originalEntry.word,
          canonicalForm: result.canonical_form || result.lemma || originalEntry.word,
          isMWE: Boolean(result.is_mwe),
          mweType: result.mwe_type || null,
          componentWords: result.component_words || null,
          partOfSpeech: result.part_of_speech || 'unknown',
          confidence: Math.min(1.0, Math.max(0.0, result.confidence || 0.5)),
          reasoning: result.reasoning || 'No reasoning provided',
          suggestedTranslation: result.suggested_translation || undefined
        });
      }

      return suggestions;

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw content:', content);
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }

  /**
   * Process all Category B entries in batches
   */
  async processAllCategoryB(categoryBIssues: DataIssue[]): Promise<{
    totalProcessed: number;
    totalCost: number;
    suggestions: AISuggestion[];
    errors: string[];
    batchResults: BatchProcessingResult[];
  }> {
    console.log(`🚀 Processing ${categoryBIssues.length} Category B entries in batches of ${this.batchSize}...`);

    // Get unique entries (remove duplicates by ID)
    const uniqueEntries = new Map<string, VocabularyEntry>();
    
    for (const issue of categoryBIssues) {
      if (!uniqueEntries.has(issue.id)) {
        // Fetch full entry data
        const { data: entry, error } = await this.supabase
          .from('centralized_vocabulary')
          .select('*')
          .eq('id', issue.id)
          .single();

        if (!error && entry) {
          uniqueEntries.set(issue.id, entry);
        }
      }
    }

    const entries = Array.from(uniqueEntries.values());
    console.log(`📊 Processing ${entries.length} unique entries (${categoryBIssues.length - entries.length} duplicates removed)`);

    const batchResults: BatchProcessingResult[] = [];
    const allSuggestions: AISuggestion[] = [];
    const allErrors: string[] = [];
    let totalCost = 0;

    // Process in batches
    for (let i = 0; i < entries.length; i += this.batchSize) {
      const batch = entries.slice(i, i + this.batchSize);
      const batchNumber = Math.floor(i / this.batchSize) + 1;
      const totalBatches = Math.ceil(entries.length / this.batchSize);

      console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} entries)...`);

      try {
        const result = await this.processBatch(batch);
        batchResults.push(result);
        allSuggestions.push(...result.suggestions);
        allErrors.push(...result.errors);
        totalCost += result.cost.totalCost;

        // Rate limiting: wait 1 second between batches to respect 500 RPM limit
        if (i + this.batchSize < entries.length) {
          console.log('⏳ Waiting 1 second for rate limiting...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`❌ Batch ${batchNumber} failed:`, error);
        allErrors.push(`Batch ${batchNumber}: ${error}`);
      }
    }

    console.log(`\n✅ All batches completed!`);
    console.log(`📊 Total processed: ${allSuggestions.length}/${entries.length}`);
    console.log(`💰 Total cost: $${totalCost.toFixed(4)}`);

    return {
      totalProcessed: allSuggestions.length,
      totalCost,
      suggestions: allSuggestions,
      errors: allErrors,
      batchResults
    };
  }

  /**
   * Export suggestions for human review
   */
  async exportSuggestionsForReview(suggestions: AISuggestion[], filename: string = 'ai-suggestions-for-review.json') {
    const fs = await import('fs/promises');
    
    const reviewData = {
      exportedAt: new Date().toISOString(),
      totalSuggestions: suggestions.length,
      suggestions: suggestions.map(s => ({
        ...s,
        humanReview: {
          decision: null,
          modifications: null,
          reviewerNotes: '',
          reviewedAt: null,
          reviewerId: null
        }
      }))
    };

    await fs.writeFile(filename, JSON.stringify(reviewData, null, 2));
    console.log(`📄 Suggestions exported for human review: ${filename}`);
  }
}
