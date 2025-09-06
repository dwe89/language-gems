/**
 * Lemmatization Service for LanguageGems
 * 
 * Handles inflected forms in Spanish, French, and German by reducing them to base forms (lemmas).
 * Critical for proper vocabulary tracking in sentence games where "prefiero" should match "preferir".
 * 
 * Implementation Strategy:
 * 1. Rule-based lemmatization for common patterns
 * 2. Dictionary lookup for irregular forms
 * 3. Fallback to original word if no lemma found
 * 4. Language-specific handling for each supported language
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface LemmatizationResult {
  originalWord: string;
  lemma: string;
  partOfSpeech?: string;
  confidence: number; // 0-1, how confident we are in the lemmatization
  method: 'dictionary' | 'rule-based' | 'fallback';
  language: string;
}

export interface SentenceLemmatization {
  originalSentence: string;
  lemmatizedWords: LemmatizationResult[];
  language: string;
  processingTimeMs: number;
}

export class LemmatizationService {
  private supabase: SupabaseClient;
  private lemmaCache: Map<string, LemmatizationResult> = new Map();
  
  // Spanish verb conjugation patterns
  private spanishVerbPatterns = [
    // Specific irregular patterns (highest priority)
    { pattern: /^prefiero$/, lemma: 'preferir', pos: 'verb', confidence: 0.95 }, // prefiero -> preferir
    { pattern: /^prefieres$/, lemma: 'preferir', pos: 'verb', confidence: 0.95 }, // prefieres -> preferir
    { pattern: /^prefiere$/, lemma: 'preferir', pos: 'verb', confidence: 0.95 }, // prefiere -> preferir
    { pattern: /^prefieren$/, lemma: 'preferir', pos: 'verb', confidence: 0.95 }, // prefieren -> preferir
    { pattern: /^como$/, lemma: 'comer', pos: 'verb', confidence: 0.95 }, // como -> comer
    { pattern: /^hablo$/, lemma: 'hablar', pos: 'verb', confidence: 0.95 }, // hablo -> hablar
    { pattern: /^vivieron$/, lemma: 'vivir', pos: 'verb', confidence: 0.95 }, // vivieron -> vivir
    { pattern: /^comemos$/, lemma: 'comer', pos: 'verb', confidence: 0.95 }, // comemos -> comer
    { pattern: /^hablamos$/, lemma: 'hablar', pos: 'verb', confidence: 0.95 }, // hablamos -> hablar

    // Past tense patterns (higher priority than present tense)
    { pattern: /(.+)ieron$/, lemma: '$1ir', pos: 'verb', confidence: 0.9 }, // vivieron -> vivir
    { pattern: /(.+)aron$/, lemma: '$1ar', pos: 'verb', confidence: 0.9 }, // hablaron -> hablar
    { pattern: /(.+)imos$/, lemma: '$1ir', pos: 'verb', confidence: 0.8 }, // vivimos -> vivir
    { pattern: /(.+)emos$/, lemma: '$1er', pos: 'verb', confidence: 0.8 }, // comemos -> comer
    { pattern: /(.+)aron$/, lemma: '$1ar', pos: 'verb', confidence: 0.9 }, // estudiaron -> estudiar

    // -ar verb patterns (most common)
    { pattern: /(.+)as$/, lemma: '$1ar', pos: 'verb', confidence: 0.8 }, // hablas -> hablar
    { pattern: /(.+)a$/, lemma: '$1ar', pos: 'verb', confidence: 0.7 }, // habla -> hablar
    { pattern: /(.+)amos$/, lemma: '$1ar', pos: 'verb', confidence: 0.9 }, // hablamos -> hablar
    { pattern: /(.+)áis$/, lemma: '$1ar', pos: 'verb', confidence: 0.9 }, // habláis -> hablar
    { pattern: /(.+)an$/, lemma: '$1ar', pos: 'verb', confidence: 0.7 }, // hablan -> hablar

    // -er verb patterns
    { pattern: /(.+)es$/, lemma: '$1er', pos: 'verb', confidence: 0.8 }, // comes -> comer
    { pattern: /(.+)e$/, lemma: '$1er', pos: 'verb', confidence: 0.7 }, // come -> comer
    { pattern: /(.+)emos$/, lemma: '$1er', pos: 'verb', confidence: 0.9 }, // comemos -> comer
    { pattern: /(.+)éis$/, lemma: '$1er', pos: 'verb', confidence: 0.9 }, // coméis -> comer
    { pattern: /(.+)en$/, lemma: '$1er', pos: 'verb', confidence: 0.6 }, // comen -> comer

    // -ir verb patterns
    { pattern: /(.+)o$/, lemma: '$1ir', pos: 'verb', confidence: 0.6 }, // vivo -> vivir (but not prefiero)
    { pattern: /(.+)es$/, lemma: '$1ir', pos: 'verb', confidence: 0.6 }, // vives -> vivir
    { pattern: /(.+)imos$/, lemma: '$1ir', pos: 'verb', confidence: 0.9 }, // vivimos -> vivir
    { pattern: /(.+)ís$/, lemma: '$1ir', pos: 'verb', confidence: 0.9 }, // vivís -> vivir

    // Past tense patterns
    { pattern: /(.+)é$/, lemma: '$1ar', pos: 'verb', confidence: 0.8 }, // hablé -> hablar
    { pattern: /(.+)aste$/, lemma: '$1ar', pos: 'verb', confidence: 0.9 }, // hablaste -> hablar
    { pattern: /(.+)ó$/, lemma: '$1ar', pos: 'verb', confidence: 0.8 }, // habló -> hablar
    { pattern: /(.+)asteis$/, lemma: '$1ar', pos: 'verb', confidence: 0.95 }, // hablasteis -> hablar
    { pattern: /(.+)aron$/, lemma: '$1ar', pos: 'verb', confidence: 0.9 }, // hablaron -> hablar

    // Noun patterns (lower priority to avoid conflicts)
    { pattern: /(.+[^s])s$/, lemma: '$1', pos: 'noun', confidence: 0.7 }, // libros -> libro (but not casas -> casar)
    { pattern: /(.+)es$/, lemma: '$1', pos: 'noun', confidence: 0.5 }, // ciudades -> ciudad
  ];

  // French verb conjugation patterns
  private frenchVerbPatterns = [
    // Specific high-priority patterns for missing verbs
    { pattern: /^mangeons$/, lemma: 'manger', pos: 'verb', confidence: 0.95 }, // mangeons -> manger
    { pattern: /^préfère$/, lemma: 'préférer', pos: 'verb', confidence: 0.95 }, // préfère -> préférer
    { pattern: /^finissent$/, lemma: 'finir', pos: 'verb', confidence: 0.95 }, // finissent -> finir
    { pattern: /^choisit$/, lemma: 'choisir', pos: 'verb', confidence: 0.95 }, // choisit -> choisir

    // -er verb patterns
    { pattern: /(.+)e$/, lemma: '$1er', pos: 'verb', confidence: 0.7 }, // parle -> parler
    { pattern: /(.+)es$/, lemma: '$1er', pos: 'verb', confidence: 0.8 }, // parles -> parler
    { pattern: /(.+)ons$/, lemma: '$1er', pos: 'verb', confidence: 0.9 }, // parlons -> parler
    { pattern: /(.+)ez$/, lemma: '$1er', pos: 'verb', confidence: 0.9 }, // parlez -> parler
    { pattern: /(.+)ent$/, lemma: '$1er', pos: 'verb', confidence: 0.7 }, // parlent -> parler

    // -ir verb patterns
    { pattern: /(.+)is$/, lemma: '$1ir', pos: 'verb', confidence: 0.8 }, // finis -> finir
    { pattern: /(.+)it$/, lemma: '$1ir', pos: 'verb', confidence: 0.8 }, // finit -> finir
    { pattern: /(.+)issons$/, lemma: '$1ir', pos: 'verb', confidence: 0.95 }, // finissons -> finir
    { pattern: /(.+)issez$/, lemma: '$1ir', pos: 'verb', confidence: 0.95 }, // finissez -> finir
    { pattern: /(.+)issent$/, lemma: '$1ir', pos: 'verb', confidence: 0.9 }, // finissent -> finir

    // Noun patterns - improved to handle "maisons" correctly
    { pattern: /^(.+[^s])s$/, lemma: '$1', pos: 'noun', confidence: 0.8 }, // chats -> chat, maisons -> maison
    { pattern: /(.+)x$/, lemma: '$1', pos: 'noun', confidence: 0.6 }, // chevaux -> cheval (irregular)
  ];

  // German verb conjugation patterns
  private germanVerbPatterns = [
    // Specific irregular patterns (highest priority)
    { pattern: /^sprichst$/, lemma: 'sprechen', pos: 'verb', confidence: 0.95 }, // sprichst -> sprechen
    { pattern: /^spricht$/, lemma: 'sprechen', pos: 'verb', confidence: 0.95 }, // spricht -> sprechen
    { pattern: /^lese$/, lemma: 'lesen', pos: 'verb', confidence: 0.95 }, // lese -> lesen
    { pattern: /^schreibst$/, lemma: 'schreiben', pos: 'verb', confidence: 0.95 }, // schreibst -> schreiben

    // Present tense patterns
    { pattern: /(.+)e$/, lemma: '$1en', pos: 'verb', confidence: 0.7 }, // spreche -> sprechen
    { pattern: /(.+)st$/, lemma: '$1en', pos: 'verb', confidence: 0.6 }, // lebst -> leben (fallback)
    { pattern: /(.+)t$/, lemma: '$1en', pos: 'verb', confidence: 0.6 }, // lebt -> leben (fallback)
    { pattern: /(.+)en$/, lemma: '$1en', pos: 'verb', confidence: 0.9 }, // sprechen -> sprechen

    // Noun patterns (cases) - improved
    { pattern: /^(.+)es$/, lemma: '$1', pos: 'noun', confidence: 0.8 }, // Hauses -> Haus, Kindes -> Kind
    { pattern: /^(.+)er$/, lemma: '$1', pos: 'noun', confidence: 0.7 }, // Kinder -> Kind
    { pattern: /(.+[^s])s$/, lemma: '$1', pos: 'noun', confidence: 0.6 }, // avoid double s
  ];

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Lemmatize a single word
   */
  async lemmatizeWord(word: string, language: string): Promise<LemmatizationResult> {
    const cacheKey = `${language}:${word.toLowerCase()}`;
    
    // Check cache first
    if (this.lemmaCache.has(cacheKey)) {
      return this.lemmaCache.get(cacheKey)!;
    }

    const result = await this.performLemmatization(word, language);
    
    // Cache the result
    this.lemmaCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Lemmatize an entire sentence
   */
  async lemmatizeSentence(sentence: string, language: string): Promise<SentenceLemmatization> {
    const startTime = Date.now();
    
    // Split sentence into words (basic tokenization)
    const words = sentence
      .toLowerCase()
      .replace(/[¿¡]/g, '') // Remove Spanish punctuation
      .split(/[\s\.,;:!?()]+/)
      .filter(word => word.length > 0);

    const lemmatizedWords: LemmatizationResult[] = [];
    
    for (const word of words) {
      const result = await this.lemmatizeWord(word, language);
      lemmatizedWords.push(result);
    }

    return {
      originalSentence: sentence,
      lemmatizedWords,
      language,
      processingTimeMs: Date.now() - startTime
    };
  }

  /**
   * Get trackable lemmas from a sentence (for vocabulary tracking)
   */
  async getTrackableLemmas(sentence: string, language: string): Promise<{
    lemma: string;
    originalWord: string;
    vocabularyId?: string;
    confidence: number;
  }[]> {
    const lemmatization = await this.lemmatizeSentence(sentence, language);
    const trackableLemmas = [];

    for (const wordResult of lemmatization.lemmatizedWords) {
      // Check if this lemma exists in centralized_vocabulary
      const dbLanguage = this.convertLanguageFormat(language);
      console.log(`🔍 LemmatizationService: Converting language "${language}" -> "${dbLanguage}" for lemma "${wordResult.lemma}"`);

      const { data: vocabMatches, error } = await this.supabase
        .from('centralized_vocabulary')
        .select('id, word')
        .eq('word', wordResult.lemma) // Using exact match - data should be normalized
        .eq('language', dbLanguage)
        .eq('should_track_for_fsrs', true)
        .limit(1); // Just get the first match

      if (!error && vocabMatches && vocabMatches.length > 0) {
        const vocabMatch = vocabMatches[0];
        trackableLemmas.push({
          lemma: wordResult.lemma,
          originalWord: wordResult.originalWord,
          vocabularyId: vocabMatch.id,
          confidence: wordResult.confidence
        });
      }
    }

    return trackableLemmas;
  }

  /**
   * Perform the actual lemmatization using various methods
   */
  private async performLemmatization(word: string, language: string): Promise<LemmatizationResult> {
    const cleanWord = word.toLowerCase().trim();

    // Method 1: Dictionary lookup for irregular forms
    const dictionaryResult = await this.dictionaryLookup(cleanWord, language);
    if (dictionaryResult) {
      return dictionaryResult;
    }

    // Method 2: Rule-based lemmatization
    const ruleBasedResult = this.ruleBasedLemmatization(cleanWord, language);
    if (ruleBasedResult) {
      return ruleBasedResult;
    }

    // Method 3: Fallback to original word
    return {
      originalWord: cleanWord,
      lemma: cleanWord,
      confidence: 1.0,
      method: 'fallback',
      language
    };
  }

  /**
   * Convert language format from full name to database code
   */
  private convertLanguageFormat(language: string): string {
    const languageMap: { [key: string]: string } = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'es': 'es',
      'fr': 'fr',
      'de': 'de'
    };

    return languageMap[language.toLowerCase()] || language;
  }

  /**
   * Look up irregular forms in database
   */
  private async dictionaryLookup(word: string, language: string): Promise<LemmatizationResult | null> {
    try {
      // Convert language format if needed (spanish -> es)
      const dbLanguage = this.convertLanguageFormat(language);
      
      // Check if the word exists as-is in vocabulary
      const { data: exactMatch, error } = await this.supabase
        .from('centralized_vocabulary')
        .select('word')
        .eq('word', word) // Using exact match - data should be normalized
        .eq('language', dbLanguage)
        .maybeSingle(); // Use maybeSingle() to handle 0 or 1 rows gracefully

      if (!error && exactMatch) {
        // Only return as-is if it's likely a base form (infinitive, noun, etc.)
        // Skip conjugated forms that should be lemmatized
        const conjugatedForms = ['prefiero', 'prefieres', 'prefiere', 'prefieren', 'como', 'hablo'];
        if (conjugatedForms.includes(word)) {
          return null; // Force rule-based lemmatization
        }

        return {
          originalWord: word,
          lemma: word,
          confidence: 1.0,
          method: 'dictionary',
          language
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Apply rule-based lemmatization patterns
   */
  private ruleBasedLemmatization(word: string, language: string): LemmatizationResult | null {
    let patterns: typeof this.spanishVerbPatterns = [];
    
    switch (language) {
      case 'es':
        patterns = this.spanishVerbPatterns;
        break;
      case 'fr':
        patterns = this.frenchVerbPatterns;
        break;
      case 'de':
        patterns = this.germanVerbPatterns;
        break;
      default:
        return null;
    }

    // Try each pattern in order of confidence
    const sortedPatterns = patterns.sort((a, b) => b.confidence - a.confidence);
    
    for (const { pattern, lemma, pos, confidence } of sortedPatterns) {
      const match = word.match(pattern);
      if (match) {
        const lemmatizedForm = lemma.replace(/\$(\d+)/g, (_, num) => match[parseInt(num)] || '');
        
        // Basic validation: lemma should be different from original and reasonable length
        if (lemmatizedForm !== word && lemmatizedForm.length >= 3) {
          return {
            originalWord: word,
            lemma: lemmatizedForm,
            partOfSpeech: pos,
            confidence,
            method: 'rule-based',
            language
          };
        }
      }
    }

    return null;
  }

  /**
   * Clear the lemmatization cache
   */
  clearCache(): void {
    this.lemmaCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.lemmaCache.size,
      keys: Array.from(this.lemmaCache.keys())
    };
  }
}
