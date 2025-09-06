    /**
     * Enhanced Vocabulary Tracking Service with Multi-Word Expression (MWE) Support
     *
     * Implements longest-match-first parsing to properly recognize and track MWEs
     * like "me gusta", "hay que", "il y a", "es gibt" as single vocabulary units.
     */
    
    import { SupabaseClient } from '@supabase/supabase-js';
    import { LemmatizationService } from './LemmatizationService';
    
    export interface MWEVocabularyMatch {
      id: string;
      word: string;
      translation: string;
      language: string;
      is_mwe: boolean;
      mwe_type?: string;
      component_words?: string[];
      should_track_for_fsrs: boolean;
      startIndex: number;
      endIndex: number;
      matchLength: number;
      // Lemmatization info
      originalForm?: string; // The inflected form found in the sentence
      lemmatizedForm?: string; // The base form used for matching
      lemmatizationConfidence?: number;
      lemmatizationMethod?: 'dictionary' | 'rule-based' | 'fallback' | 'none';
      // Match type for reward differentiation
      matchType?: 'mwe' | 'exact' | 'base_word'; // Helps determine reward value
    }
    
    export interface SentenceParsingResult {
      originalSentence: string;
      vocabularyMatches: MWEVocabularyMatch[];
      unmatchedWords: string[];
      totalWords: number;
      matchedWords: number;
      coveragePercentage: number;
    }
    
    export class MWEVocabularyTrackingService {
      private supabase: SupabaseClient;
      private lemmatizationService: LemmatizationService;
      private vocabularyCache: Map<string, MWEVocabularyMatch[]> = new Map();
      private cacheExpiry: number = 15 * 60 * 1000; // 15 minutes (increased from 5 minutes)
      private lastCacheUpdate: number = 0;
    
      constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
        this.lemmatizationService = new LemmatizationService(supabase);
      }
    
      /**
       * Parse a sentence and identify vocabulary matches using longest-match-first algorithm
       */
      async parseSentenceForVocabulary(
        sentence: string,
        language: string = 'es'
      ): Promise<SentenceParsingResult> {
        // Add null/undefined protection at the start
        if (!sentence || typeof sentence !== 'string') {
          console.warn('parseSentenceForVocabulary received invalid sentence:', sentence);
          return {
            originalSentence: sentence || '',
            vocabularyMatches: [],
            unmatchedWords: [],
            totalWords: 0,
            matchedWords: 0,
            coveragePercentage: 0
          };
        }
    
        try {
          // Normalize sentence for parsing
          const normalizedSentence = this.normalizeSentence(sentence);
          const words = normalizedSentence.split(' ');
    
          // Get vocabulary for the language
          const vocabulary = await this.getVocabularyForLanguage(language);
    
          // Apply longest-match-first parsing
          const matches = await this.findLongestMatches(normalizedSentence, vocabulary, language);
    
          // Calculate coverage statistics
          const matchedWordCount = matches.reduce((sum, match) => sum + (match.component_words?.length || 1), 0);
          const coveragePercentage = words.length > 0 ? (matchedWordCount / words.length) * 100 : 0;
    
          // Identify unmatched words
          const unmatchedWords = this.findUnmatchedWords(normalizedSentence, matches);
    
          return {
            originalSentence: sentence,
            vocabularyMatches: matches,
            unmatchedWords,
            totalWords: words.length,
            matchedWords: matchedWordCount,
            coveragePercentage: Math.round(coveragePercentage * 100) / 100
          };
        } catch (error) {
          console.error('Error parsing sentence for vocabulary:', error);
          // Safe fallback that handles undefined/null sentence
          const safeSentence = sentence || '';
          const safeWords = safeSentence ? safeSentence.split(' ') : [];
          return {
            originalSentence: safeSentence,
            vocabularyMatches: [],
            unmatchedWords: safeWords,
            totalWords: safeWords.length,
            matchedWords: 0,
            coveragePercentage: 0
          };
        }
      }
    
      /**
       * Enhanced parsing with lemmatization support
       * This method handles inflected forms like "prefiero" -> "preferir"
       * Uses a two-phase approach: lemmatization-aware longest-match-first, then individual word lemmatization
       */
      async parseSentenceWithLemmatization(
        sentence: string,
        language: string = 'es'
      ): Promise<SentenceParsingResult> {
        // Add null/undefined protection at the start
        if (!sentence || typeof sentence !== 'string') {
          console.warn('parseSentenceWithLemmatization received invalid sentence:', sentence);
          return {
            originalSentence: sentence || '',
            vocabularyMatches: [],
            unmatchedWords: [],
            totalWords: 0,
            matchedWords: 0,
            coveragePercentage: 0
          };
        }
    
        try {
          // Normalize sentence for parsing
          const normalizedSentence = this.normalizeSentence(sentence);
          const words = normalizedSentence.split(' ');
    
          // Get vocabulary for the language
          const vocabulary = await this.getVocabularyForLanguage(language);
    
          // Phase 1: Apply lemmatization-aware longest-match-first parsing
          // This handles both MWEs and inflected forms within MWEs
          const primaryMatches = await this.findLongestMatches(
            normalizedSentence,
            vocabulary,
            language,
            true // Enable lemmatization
          );
    
          // Phase 2: For remaining unmatched words, try individual lemmatization
          const unmatchedWords = this.findUnmatchedWords(normalizedSentence, primaryMatches);
          const secondaryMatches: MWEVocabularyMatch[] = [];
    
          if (unmatchedWords.length > 0) {
            // Create a map of word positions for accurate tracking
            const wordPositions = this.getWordPositions(normalizedSentence);
            // Reduced logging: Only log when debugging base word recognition
            // console.log(`🔍 Phase 2: Processing ${unmatchedWords.length} unmatched words for base word recognition`);
    
            for (const unmatchedWord of unmatchedWords) {
              // Skip basic words that don't need explicit recognition
              // This ensures articles, common pronouns etc. don't generate base_word matches
              if (this.isBasicWord(unmatchedWord, language)) {
                // console.log(`⏭️ Skipping basic word: "${unmatchedWord}"`);
                continue;
              }
    
              // Important: Only proceed if the word itself is valid for database lookup
              // This should only filter out genuinely problematic characters, not common words
              if (!this.isValidVocabularyWord(unmatchedWord)) {
                console.log(`🚫 Filtered out problematic unmatched word for lookup: "${unmatchedWord}"`);
                continue;
              }
    
              const lemmaResult = await this.lemmatizationService.lemmatizeWord(unmatchedWord, language);
    
              // Use the lemmatized form for lookup if it's different, otherwise use the original unmatched word.
              // This ensures that "casa" (lemma of "casa") and "pequeño" (lemma of "pequeña") are looked up.
              const lemmaToLookup = lemmaResult.lemma; // Use the lemma for lookup
    
              const vocabularyMatch = await this.findVocabularyByLemma(lemmaToLookup, language);
    
              if (vocabularyMatch && !vocabularyMatch.is_mwe) { // Ensure it's a single word match, not an MWE
                // Find the correct position of this word in the sentence
                const wordPosition = wordPositions.find(pos => this.cleanWord(pos.word) === this.cleanWord(unmatchedWord));
    
                if (wordPosition) {
                  console.log(`✅ Base word match: "${unmatchedWord}" → "${lemmaToLookup}"`);
                  secondaryMatches.push({
                    ...vocabularyMatch,
                    startIndex: wordPosition.index,
                    endIndex: wordPosition.index,
                    matchLength: 1,
                    originalForm: lemmaResult.originalWord,
                    lemmatizedForm: lemmaResult.lemma,
                    lemmatizationConfidence: lemmaResult.confidence,
                    lemmatizationMethod: lemmaResult.method,
                    matchType: 'base_word' // Flag for different reward calculation
                  });
                }
              } else {
                // Reduced logging: Only log when debugging specific word matching issues
                // if (vocabularyMatch && vocabularyMatch.is_mwe) {
                //     console.log(`ℹ️ Lemma "${lemmaToLookup}" found but is an MWE, skipping for single-word match.`);
                // } else {
                //     console.log(`❌ No base word match found for: "${unmatchedWord}" (lemma: "${lemmaToLookup}")`);
                // }
              }
            }
          }
    
          // Combine all matches and sort by position
          const allMatches = [...primaryMatches, ...secondaryMatches]
            .sort((a, b) => a.startIndex - b.startIndex);
    
          // Calculate final statistics
          const matchedWordCount = allMatches.reduce((sum, match) => sum + (match.component_words?.length || 1), 0);
          const coveragePercentage = words.length > 0 ? (matchedWordCount / words.length) * 100 : 0;
    
          // Find final unmatched words
          const finalUnmatchedWords = this.findUnmatchedWords(normalizedSentence, allMatches);
    
          return {
            originalSentence: sentence,
            vocabularyMatches: allMatches,
            unmatchedWords: finalUnmatchedWords,
            totalWords: words.length,
            matchedWords: matchedWordCount,
            coveragePercentage: Math.round(coveragePercentage * 100) / 100
          };
    
        } catch (error) {
          console.error('Error in enhanced sentence parsing:', error);
          // Fallback to standard parsing
          return this.parseSentenceForVocabulary(sentence, language);
        }
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
       * Check if a word is too basic to reward (articles, pronouns, basic verbs)
       * These words are typically learned implicitly and don't need explicit recognition
       */
      private isBasicWord(word: string, language: string = 'es'): boolean {
        const basicWordsByLanguage: { [key: string]: string[] } = {
          'es': [
            // Articles
            'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
            // Basic pronouns
            'yo', 'tú', 'él', 'ella', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas',
            'mi', 'tu', 'su', 'nuestro', 'nuestra', 'vuestro', 'vuestra',
            'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'lo', 'la',
            // Basic verbs (most common forms)
            'es', 'son', 'está', 'están', 'hay', 'tiene', 'tienen',
            'ser', 'estar', 'tener', 'haber',
            // Basic conjunctions/prepositions
            'y', 'o', 'pero', 'de', 'en', 'a', 'con', 'por', 'para', 'sin',
            // Basic question words
            'qué', 'quién', 'cómo', 'cuándo', 'dónde', 'por qué'
          ],
          'fr': [
            // Articles
            'le', 'la', 'les', 'un', 'une', 'des',
            // Basic pronouns
            'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
            'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
            'me', 'te', 'se', 'nous', 'vous', 'lui', 'leur',
            // Basic verbs
            'est', 'sont', 'a', 'ont', 'être', 'avoir',
            // Basic conjunctions/prepositions
            'et', 'ou', 'mais', 'de', 'du', 'des', 'à', 'avec', 'pour', 'sans'
          ],
          'de': [
            // Articles
            'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer',
            // Basic pronouns
            'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie',
            'mein', 'meine', 'dein', 'deine', 'sein', 'seine', 'ihr', 'ihre',
            'mir', 'dir', 'ihm', 'uns', 'euch', 'ihnen',
            // Basic verbs
            'ist', 'sind', 'hat', 'haben', 'sein', 'haben',
            // Basic conjunctions/prepositions
            'und', 'oder', 'aber', 'von', 'zu', 'mit', 'für', 'ohne'
          ]
        };
    
        const dbLanguage = this.convertLanguageFormat(language);
        const basicWords = basicWordsByLanguage[dbLanguage] || [];
        return basicWords.includes(word.toLowerCase());
      }
    
      /**
       * Check if a word is valid for vocabulary lookup
       * IMPORTANT: This should only filter out truly problematic words that cause 406 errors,
       * not valid vocabulary words! Let isBasicWord handle semantic filtering instead.
       */
      private isValidVocabularyWord(word: string): boolean {
        // Filter out empty or very short words
        if (!word || word.length < 2) {
          return false;
        }
    
        // Filter out words that are too long (likely to cause issues)
        if (word.length > 50) {
          return false;
        }
    
        // Filter out pure punctuation or special characters
        const punctuationRegex = /^[^\p{L}\p{N}]+$/u;
        if (punctuationRegex.test(word)) {
          return false;
        }
    
        // Filter out words with problematic characters that cause 406 errors
        const problematicChars = /[<>{}[\]\\|`~@#$%^&*()+=]/;
        if (problematicChars.test(word)) {
          return false;
        }
    
        // Filter out words that are mostly punctuation
        const letterCount = (word.match(/\p{L}/gu) || []).length;
        if (letterCount < word.length * 0.5) {
          return false;
        }
    
        // This function should ONLY filter words that are genuinely
        // malformed or would cause query errors.
        // It should NOT filter based on semantic 'basic-ness' or commonality.
        // That is the job of isBasicWord.
    
        return true;
      }
    
      /**
       * Find vocabulary entry by lemma
       */
      private async findVocabularyByLemma(
        lemma: string,
        language: string
      ): Promise<MWEVocabularyMatch | null> {
        try {
          // Filter out problematic words that cause 406 errors
          if (!this.isValidVocabularyWord(lemma)) {
            console.warn(`🚫 Skipping problematic lemma: "${lemma}" during final lookup (failed isValidVocabularyWord check).`);
            return null;
          }
    
          // Convert language format if needed
          const dbLanguage = this.convertLanguageFormat(language);
          // Reduced logging: Only log vocabulary lookups when debugging vocabulary issues
          // console.log(`🔍 Looking up vocabulary for lemma: "${lemma}" (${language} -> ${dbLanguage})`);
    
          // Sanitize the lemma to prevent 406 errors
          const sanitizedLemma = lemma.trim().toLowerCase();
    
          // Additional validation to prevent problematic queries (redundant with isValidVocabularyWord but safe)
          if (sanitizedLemma.length > 50 || /[<>{}[\]\\|`~]/.test(sanitizedLemma)) {
            console.warn(`🚫 Skipping problematic lemma: "${lemma}" (failed final sanitation check).`);
            return null;
          }
    
          // *** FIXED: Using PostgreSQL's lower() function for case-insensitive exact matching ***
          // Instead of .ilike() which is for pattern matching, we use .eq() with .lower()
          const { data, error } = await this.supabase
            .from('centralized_vocabulary')
            .select(`
              id,
              word,
              translation,
              language,
              is_mwe,
              mwe_type,
              component_words,
              should_track_for_fsrs
            `)
            .eq('word', sanitizedLemma) // Use exact match - words should be stored in lowercase
            .eq('language', dbLanguage)
            .eq('should_track_for_fsrs', true)
            .maybeSingle(); // 🔧 FIX: Use maybeSingle() instead of limit(1) to avoid 406 errors
    
          if (error) {
            // 🔧 FIX: Handle 406 Not Acceptable errors gracefully
            if (error.code === 'PGRST116' || error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
              // Reduced logging: Only warn about significant lookup failures, not common missing words
              // console.warn(`⚠️ Vocabulary lookup failed for "${lemma}" (word not found in database) - continuing without tracking`);
            } else {
              console.warn(`🚨 Database query error for lemma "${lemma}":`, error);
            }
            return null;
          }
    
          if (!data) {
            return null;
          }

          const vocabData = data; // 🔧 FIX: maybeSingle() returns object directly, not array
    
          return {
            id: vocabData.id,
            word: vocabData.word,
            translation: vocabData.translation,
            language: vocabData.language,
            is_mwe: vocabData.is_mwe || false, // Default to false if null/undefined
            mwe_type: vocabData.mwe_type,
            component_words: vocabData.component_words || (vocabData.word ? [vocabData.word] : []),
            should_track_for_fsrs: vocabData.should_track_for_fsrs || true,
            startIndex: 0, // Will be set by caller
            endIndex: 0,   // Will be set by caller
            matchLength: 0 // Will be set by caller
          };
        } catch (error) {
          console.error('Error finding vocabulary by lemma:', error);
          return null;
        }
      }
    
      /**
       * Get trackable vocabulary matches from a sentence (for FSRS and gem tracking)
       */
      async getTrackableVocabulary(
        sentence: string,
        language: string = 'es'
      ): Promise<MWEVocabularyMatch[]> {
        // Use enhanced parsing with lemmatization for better coverage
        const parseResult = await this.parseSentenceWithLemmatization(sentence, language);
        // Filter by should_track_for_fsrs is already handled within getVocabularyForLanguage
        // and findVocabularyByLemma, so this outer filter might be redundant but harmless.
        return parseResult.vocabularyMatches.filter(match => match.should_track_for_fsrs);
      }
    
      /**
       * Find the longest vocabulary matches in a sentence using greedy algorithm
       * Now supports both direct matching and lemmatization-based matching
       */
      private async findLongestMatches(
        sentence: string,
        vocabulary: MWEVocabularyMatch[],
        language: string = 'es',
        useLemmatization: boolean = false
      ): Promise<MWEVocabularyMatch[]> {
        // Reduced logging - only log if performance debugging is needed
        // console.log(`🔍 findLongestMatches: Processing sentence "${sentence}" with ${vocabulary.length} vocab items (language: ${language}, useLemmatization: ${useLemmatization})`);
        const matches: MWEVocabularyMatch[] = [];
        const words = sentence.split(' ');
        const used = new Array(words.length).fill(false);
    
        // Sort vocabulary by number of words (longest first) for longest-match-first
        const sortedVocabulary = vocabulary.sort((a, b) => {
          const aWordCount = a.word.split(' ').length;
          const bWordCount = b.word.split(' ').length;
          if (bWordCount !== aWordCount) {
            return bWordCount - aWordCount; // More words first
          }
          return b.word.length - a.word.length; // Then by character length
        });
    
        // Removed excessive logging - only log when debugging vocabulary issues
        // console.log(`🔍 findLongestMatches: First 10 vocabulary items:`, sortedVocabulary.slice(0, 10).map(v => v.word));
    
        for (const vocabItem of sortedVocabulary) {
          const vocabWords = vocabItem.word.split(' ');
          const vocabLength = vocabWords.length;
    
          // Try to find this vocabulary item in the sentence
          for (let i = 0; i <= words.length - vocabLength; i++) {
            // Skip if any word in this range is already used
            if (used.slice(i, i + vocabLength).some(u => u)) {
              continue;
            }
    
            // Check if the words match (with optional lemmatization)
            const sentenceSlice = words.slice(i, i + vocabLength);
            const isMatch = useLemmatization
              ? await this.wordsMatchWithLemmatization(sentenceSlice, vocabWords, language)
              : this.wordsMatch(sentenceSlice, vocabWords);
    
            // Add debug logging for single-word matches only to avoid spam
            // Removed unnecessary testing logs to reduce clutter
            // if (vocabLength === 1 && sentenceSlice.length === 1) {
            //   const sentenceWord = sentenceSlice[0].toLowerCase();
            //   const vocabWord = vocabWords[0].toLowerCase();
            //   if (sentenceWord === 'mi' || sentenceWord === 'color' || sentenceWord === 'favorito' || sentenceWord === 'azul') {
            //     console.log(`🔍 Testing: "${sentenceWord}" vs vocab "${vocabWord}" (${useLemmatization ? 'with' : 'without'} lemmatization) -> ${isMatch}`);
            //   }
            // }
    
            if (isMatch) {
              // Mark words as used
              for (let j = i; j < i + vocabLength; j++) {
                used[j] = true;
              }
    
              // Add match with position information
              matches.push({
                ...vocabItem,
                startIndex: i,
                endIndex: i + vocabLength - 1,
                matchLength: vocabLength,
                matchType: vocabItem.is_mwe ? 'mwe' : 'exact' // Set matchType for primary matches
              });
    
              break; // Move to next vocabulary item
            }
          }
        }
    
        // Sort matches by position in sentence
        return matches.sort((a, b) => a.startIndex - b.startIndex);
      }
    
      /**
       * Check if two word arrays match (case-insensitive, punctuation-tolerant)
       */
      private wordsMatch(sentenceWords: string[], vocabWords: string[]): boolean {
        if (sentenceWords.length !== vocabWords.length) {
          return false;
        }
    
        return sentenceWords.every((word, index) => {
          const cleanSentenceWord = this.cleanWord(word);
          const cleanVocabWord = this.cleanWord(vocabWords[index]);
          return cleanSentenceWord === cleanVocabWord;
        });
      }
    
      /**
       * Check if two word arrays match using lemmatization for inflected forms
       * This enables matching "prefiero" against "preferir" in vocabulary
       */
      private async wordsMatchWithLemmatization(
        sentenceWords: string[],
        vocabWords: string[],
        language: string
      ): Promise<boolean> {
        if (sentenceWords.length !== vocabWords.length) {
          return false;
        }
    
        // Check each word pair with lemmatization fallback
        for (let i = 0; i < sentenceWords.length; i++) {
          const cleanSentenceWord = this.cleanWord(sentenceWords[i]);
          const cleanVocabWord = this.cleanWord(vocabWords[i]);
    
          // First try direct match (fastest)
          if (cleanSentenceWord === cleanVocabWord) {
            continue;
          }
    
          // If direct match fails, try lemmatization
          try {
            const lemmaResult = await this.lemmatizationService.lemmatizeWord(cleanSentenceWord, language);
            if (lemmaResult.lemma === cleanVocabWord) {
              continue; // Lemmatized form matches
            }
    
            // No match found for this word pair
            return false;
          } catch (error) {
            console.warn(`⚠️ Lemmatization failed for "${cleanSentenceWord}". Falling back to direct comparison. Error:`, error);
            // If lemmatization fails, fall back to direct comparison
            if (cleanSentenceWord !== cleanVocabWord) {
              return false;
            }
          }
        }
    
        return true; // All word pairs matched
      }
    
      /**
       * Clean a word by removing punctuation and converting to lowercase
       */
      private cleanWord(word: string): string {
        return word.toLowerCase().replace(/[.,!?;:"""''()]/g, '').trim();
      }
    
      /**
       * Get word positions in a sentence for accurate position tracking
       */
      private getWordPositions(sentence: string): { word: string; index: number }[] {
        const words = sentence.split(' ');
        return words.map((word, index) => ({ word, index }));
      }
    
      /**
       * Normalize sentence for consistent parsing
       */
      private normalizeSentence(sentence: string): string {
        // Add null/undefined protection
        if (!sentence || typeof sentence !== 'string') {
          console.warn('normalizeSentence received invalid input:', sentence);
          return '';
        }
    
        return sentence
          .toLowerCase()
          .replace(/[.,!?;:"""''()]/g, '') // Remove punctuation
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      }
    
      /**
       * Find words in the sentence that weren't matched by any vocabulary
       */
      private findUnmatchedWords(
        sentence: string,
        matches: MWEVocabularyMatch[]
      ): string[] {
        const words = sentence.split(' ');
        const used = new Array(words.length).fill(false);
    
        // Mark matched words as used
        matches.forEach(match => {
          for (let i = match.startIndex; i <= match.endIndex; i++) {
            used[i] = true;
          }
        });
    
        // Return unmatched words
        return words.filter((_, index) => !used[index]);
      }
    
      /**
       * Get vocabulary for a specific language with caching
       */
      private async getVocabularyForLanguage(language: string): Promise<MWEVocabularyMatch[]> {
        const now = Date.now();
    
        // Convert language format if needed
        const dbLanguage = this.convertLanguageFormat(language);
        // Reduced logging - only log when cache is empty or expired
        if (!this.vocabularyCache.has(language) || (now - this.lastCacheUpdate) >= this.cacheExpiry) {
          console.log(`🔍 Loading vocabulary for language: "${language}" -> "${dbLanguage}"`);
        }
    
        // Check cache validity (use original language as cache key)
        if (this.vocabularyCache.has(language) && (now - this.lastCacheUpdate) < this.cacheExpiry) {
          return this.vocabularyCache.get(language)!;
        }
    
        try {
          const { data, error } = await this.supabase
            .from('centralized_vocabulary')
            .select(`
              id,
              word,
              translation,
              language,
              is_mwe,
              mwe_type,
              component_words,
              should_track_for_fsrs
            `)
            .eq('language', dbLanguage)
            .eq('should_track_for_fsrs', true)
            .order('is_mwe', { ascending: false }) // MWEs first
            .order('word', { ascending: false })   // Then by word length (longer first)
            .limit(10000); // Ensure we get all vocabulary, not just default 1000
    
          if (error) {
            console.error('Error fetching vocabulary:', error);
            return [];
          }
    
          // Only log cache updates, not every vocabulary retrieval
          if ((data || []).length === 0) {
            console.warn(`⚠️ No vocabulary found for language "${dbLanguage}" with should_track_for_fsrs=true`);
          }
    
          const vocabulary: MWEVocabularyMatch[] = (data || []).map((item: any) => ({
            id: item.id,
            word: item.word,
            translation: item.translation,
            language: item.language,
            is_mwe: item.is_mwe || false,
            mwe_type: item.mwe_type,
            component_words: item.component_words || (item.word ? [item.word] : []),
            should_track_for_fsrs: item.should_track_for_fsrs || true,
            startIndex: 0,
            endIndex: 0,
            matchLength: 0,
            matchType: item.is_mwe ? 'mwe' : 'exact' // Default matchType when loading
          }));
    
          // Update cache
          this.vocabularyCache.set(language, vocabulary);
          this.lastCacheUpdate = now;

          // Only log significant cache updates
          console.log(`🔍 Cached ${vocabulary.length} vocabulary items for "${language}"`);

          return vocabulary;
        } catch (error) {
          console.error('Error loading vocabulary for language:', language, error);
          return [];
        }
      }
    
      /**
       * Clear vocabulary cache (useful for testing or when vocabulary is updated)
       */
      clearCache(): void {
        this.vocabularyCache.clear();
        this.lastCacheUpdate = 0;
      }
    
      /**
       * Get parsing statistics for debugging
       */
      async getParsingStats(
        sentences: string[],
        language: string = 'es'
      ): Promise<{
        totalSentences: number;
        averageCoverage: number;
        totalMWEsFound: number;
        mostCommonMWEs: { word: string; count: number }[];
      }> {
        const results = await Promise.all(
          sentences.map(sentence => this.parseSentenceForVocabulary(sentence, language))
        );
    
        const totalCoverage = results.reduce((sum, result) => sum + result.coveragePercentage, 0);
        const averageCoverage = results.length > 0 ? totalCoverage / results.length : 0;
    
        const mweCounter = new Map<string, number>();
        let totalMWEs = 0;
    
        results.forEach(result => {
          result.vocabularyMatches.forEach(match => {
            if (match.is_mwe) {
              totalMWEs++;
              const count = mweCounter.get(match.word) || 0;
              mweCounter.set(match.word, count + 1);
            }
          });
        });
    
        const mostCommonMWEs = Array.from(mweCounter.entries())
          .map(([word, count]) => ({ word, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
    
        return {
          totalSentences: sentences.length,
          averageCoverage: Math.round(averageCoverage * 100) / 100,
          totalMWEsFound: totalMWEs,
          mostCommonMWEs
        };
      }
    }
    