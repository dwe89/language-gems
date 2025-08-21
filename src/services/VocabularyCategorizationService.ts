import { createClient } from '@/utils/supabase/client';

interface VocabularyItem {
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
}

interface CategorizationResult {
  predicted_category: string;
  predicted_subcategory: string;
  category_confidence: number;
  centralized_match_id?: string;
  match_confidence?: number;
  base_word: string;
  article?: string;
  gender?: string;
  raw_input: string;
}

interface CentralizedMatch {
  id: string;
  word: string;
  category: string;
  subcategory: string;
  confidence: number;
}

export class VocabularyCategorizationService {
  private supabase = createClient();

  /**
   * Main categorization method - implements hybrid approach
   */
  async categorizeVocabulary(items: VocabularyItem[]): Promise<CategorizationResult[]> {
    console.log('🤖 [CATEGORIZATION] Starting vocabulary categorization for', items.length, 'items');
    
    const results: CategorizationResult[] = [];
    
    for (const item of items) {
      try {
        const result = await this.categorizeItem(item);
        results.push(result);
      } catch (error) {
        console.error('🚨 [CATEGORIZATION] Error categorizing item:', item.term, error);
        // Fallback result
        results.push({
          predicted_category: 'General',
          predicted_subcategory: 'Uncategorized',
          category_confidence: 0.1,
          base_word: this.extractLinguisticComponents(item.term).base_word,
          raw_input: item.term
        });
      }
    }
    
    return results;
  }

  /**
   * Categorize a single vocabulary item using hybrid approach
   */
  private async categorizeItem(item: VocabularyItem): Promise<CategorizationResult> {
    console.log('🔍 [CATEGORIZATION] Processing:', item.term);
    
    // Step 1: Extract linguistic components
    const linguistic = this.extractLinguisticComponents(item.term);
    
    // Step 2: Try to find centralized vocabulary match
    const centralizedMatch = await this.findCentralizedMatch(linguistic.base_word, item.translation, item.term);
    
    if (centralizedMatch && centralizedMatch.confidence > 0.8) {
      console.log('✅ [CATEGORIZATION] High-confidence centralized match found:', centralizedMatch);
      return {
        predicted_category: centralizedMatch.category,
        predicted_subcategory: centralizedMatch.subcategory,
        category_confidence: centralizedMatch.confidence,
        centralized_match_id: centralizedMatch.id,
        match_confidence: centralizedMatch.confidence,
        base_word: linguistic.base_word,
        article: linguistic.article,
        gender: linguistic.gender,
        raw_input: item.term
      };
    }
    
    // Step 3: Use AI categorization for unknown words
    const aiResult = await this.aiCategorizeItem(item, linguistic);
    
    return {
      ...aiResult,
      centralized_match_id: centralizedMatch?.id,
      match_confidence: centralizedMatch?.confidence,
      base_word: linguistic.base_word,
      article: linguistic.article,
      gender: linguistic.gender,
      raw_input: item.term
    };
  }

  /**
   * Extract linguistic components from Spanish vocabulary
   */
  private extractLinguisticComponents(term: string): {
    base_word: string;
    article?: string;
    gender?: string;
  } {
    const cleaned = term.trim().toLowerCase();
    
    // Extract gender markers (m), (f), (n)
    const genderMatch = cleaned.match(/\(([mfn])\)$/);
    const gender = genderMatch ? genderMatch[1] : undefined;
    
    // Remove gender markers
    let withoutGender = cleaned.replace(/\s*\([mfn]\)\s*$/, '');
    
    // Extract articles
    const articleMatch = withoutGender.match(/^(el|la|los|las|un|una|unos|unas)\s+(.+)$/);
    const article = articleMatch ? articleMatch[1] : undefined;
    const base_word = articleMatch ? articleMatch[2] : withoutGender;
    
    return {
      base_word: base_word.trim(),
      article,
      gender
    };
  }

  /**
   * Find matching vocabulary in centralized database
   */
  private async findCentralizedMatch(baseWord: string, translation: string, originalTerm?: string): Promise<CentralizedMatch | null> {
    try {
      // Try exact base word match first - prioritize entries with proper categories
      // Search for both the base word and the full original term
      const searchTerms = originalTerm
        ? `base_word.eq.${baseWord},word.eq.${baseWord},base_word.eq.${originalTerm},word.eq.${originalTerm}`
        : `base_word.eq.${baseWord},word.eq.${baseWord}`;

      let { data: exactMatches } = await this.supabase
        .from('centralized_vocabulary')
        .select('id, word, base_word, category, subcategory, translation')
        .or(searchTerms)
        .eq('language', 'es') // Filter by Spanish language
        .not('category', 'is', null) // Only get entries with categories
        .not('subcategory', 'is', null) // Only get entries with subcategories
        .order('category', { ascending: true }) // Order by category
        .limit(5);

      console.log(`🔍 [CATEGORIZATION] Exact matches query for "${baseWord}":`, exactMatches);

      // If no matches with categories, try without category filter as fallback
      if (!exactMatches || exactMatches.length === 0) {
        console.log(`🔄 [CATEGORIZATION] No categorized matches found for "${baseWord}", trying fallback`);
        const { data: fallbackMatches } = await this.supabase
          .from('centralized_vocabulary')
          .select('id, word, base_word, category, subcategory, translation')
          .or(`base_word.eq.${baseWord},word.eq.${baseWord}`)
          .eq('language', 'es')
          .limit(5);
        exactMatches = fallbackMatches;
        console.log(`🔄 [CATEGORIZATION] Fallback matches for "${baseWord}":`, fallbackMatches);
      }

      if (exactMatches && exactMatches.length > 0) {
        // Check for translation similarity
        const bestMatch = exactMatches.find(match => 
          match.translation.toLowerCase().includes(translation.toLowerCase()) ||
          translation.toLowerCase().includes(match.translation.toLowerCase())
        ) || exactMatches[0];

        return {
          id: bestMatch.id,
          word: bestMatch.word,
          category: bestMatch.category || 'General',
          subcategory: bestMatch.subcategory || 'Uncategorized',
          confidence: bestMatch.translation.toLowerCase() === translation.toLowerCase() ? 0.95 : 0.85
        };
      }

      // Try fuzzy matching on word similarity
      const { data: fuzzyMatches } = await this.supabase
        .from('centralized_vocabulary')
        .select('id, word, base_word, category, subcategory, translation')
        .textSearch('word', baseWord)
        .eq('language', 'es') // Filter by Spanish language
        .not('category', 'is', null) // Prioritize entries with categories
        .order('category', { ascending: true }) // Order by category to get non-null first
        .limit(3);

      if (fuzzyMatches && fuzzyMatches.length > 0) {
        const bestMatch = fuzzyMatches[0];
        return {
          id: bestMatch.id,
          word: bestMatch.word,
          category: bestMatch.category || 'General',
          subcategory: bestMatch.subcategory || 'Uncategorized',
          confidence: 0.6
        };
      }

      return null;
    } catch (error) {
      console.error('🚨 [CATEGORIZATION] Error finding centralized match:', error);
      return null;
    }
  }

  /**
   * Use AI to categorize vocabulary item
   */
  private async aiCategorizeItem(
    item: VocabularyItem, 
    linguistic: { base_word: string; article?: string; gender?: string }
  ): Promise<{
    predicted_category: string;
    predicted_subcategory: string;
    category_confidence: number;
  }> {
    // For now, implement rule-based categorization
    // TODO: Replace with actual AI/GPT API call
    
    const category = this.ruleBasedCategorization(item, linguistic);
    
    return {
      predicted_category: category.category,
      predicted_subcategory: category.subcategory,
      category_confidence: category.confidence
    };
  }

  /**
   * Rule-based categorization as fallback
   */
  private ruleBasedCategorization(
    item: VocabularyItem,
    linguistic: { base_word: string; article?: string; gender?: string }
  ): { category: string; subcategory: string; confidence: number } {
    const word = linguistic.base_word.toLowerCase();
    const translation = item.translation.toLowerCase();
    
    // Food and drink
    if (this.matchesKeywords(word, translation, ['comida', 'bebida', 'comer', 'beber', 'restaurante', 'food', 'drink', 'eat', 'restaurant'])) {
      return { category: 'Food and Drink', subcategory: 'General Food', confidence: 0.7 };
    }
    
    // Family
    if (this.matchesKeywords(word, translation, ['familia', 'padre', 'madre', 'hijo', 'hija', 'hermano', 'family', 'father', 'mother', 'son', 'daughter', 'brother', 'sister'])) {
      return { category: 'Family and Relationships', subcategory: 'Family Members', confidence: 0.8 };
    }
    
    // Colors
    if (this.matchesKeywords(word, translation, ['color', 'rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'red', 'blue', 'green', 'yellow', 'black', 'white'])) {
      return { category: 'Descriptions', subcategory: 'Colors', confidence: 0.9 };
    }
    
    // Numbers
    if (this.matchesKeywords(word, translation, ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'número', 'one', 'two', 'three', 'four', 'five', 'number']) || /^\d+$/.test(word)) {
      return { category: 'Numbers and Time', subcategory: 'Numbers', confidence: 0.9 };
    }
    
    // Default
    return { category: 'General', subcategory: 'Uncategorized', confidence: 0.3 };
  }

  private matchesKeywords(word: string, translation: string, keywords: string[]): boolean {
    return keywords.some(keyword => 
      word.includes(keyword) || translation.includes(keyword)
    );
  }

  /**
   * Batch update vocabulary items with categorization results
   */
  async updateVocabularyWithCategorization(
    vocabularyIds: string[],
    categorizations: CategorizationResult[]
  ): Promise<void> {
    console.log('💾 [CATEGORIZATION] Updating', vocabularyIds.length, 'vocabulary items with categorization');
    
    for (let i = 0; i < vocabularyIds.length; i++) {
      const id = vocabularyIds[i];
      const categorization = categorizations[i];
      
      try {
        await this.supabase
          .from('enhanced_vocabulary_items')
          .update({
            raw_input: categorization.raw_input,
            base_word: categorization.base_word,
            article: categorization.article,
            gender: categorization.gender,
            predicted_category: categorization.predicted_category,
            predicted_subcategory: categorization.predicted_subcategory,
            category_confidence: categorization.category_confidence,
            centralized_match_id: categorization.centralized_match_id,
            match_confidence: categorization.match_confidence,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        console.log('✅ [CATEGORIZATION] Updated vocabulary item:', id);
      } catch (error) {
        console.error('🚨 [CATEGORIZATION] Error updating vocabulary item:', id, error);
      }
    }
  }

  /**
   * Get categorization suggestions for teacher review
   */
  async getCategorySuggestions(vocabularyIds: string[]): Promise<Array<{
    id: string;
    term: string;
    translation: string;
    suggested_category: string;
    suggested_subcategory: string;
    confidence: number;
    needs_review: boolean;
  }>> {
    try {
      const { data: items } = await this.supabase
        .from('enhanced_vocabulary_items')
        .select('id, term, translation, predicted_category, predicted_subcategory, category_confidence, teacher_approved_category')
        .in('id', vocabularyIds);

      if (!items) return [];

      return items.map(item => ({
        id: item.id,
        term: item.term,
        translation: item.translation,
        suggested_category: item.predicted_category || 'General',
        suggested_subcategory: item.predicted_subcategory || 'Uncategorized',
        confidence: item.category_confidence || 0,
        needs_review: !item.teacher_approved_category || (item.category_confidence || 0) < 0.7
      }));
    } catch (error) {
      console.error('🚨 [CATEGORIZATION] Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * Teacher approves or modifies AI categorization
   */
  async approveCategorization(
    vocabularyId: string,
    approved: boolean,
    manualCategory?: string,
    manualSubcategory?: string
  ): Promise<void> {
    try {
      await this.supabase
        .from('enhanced_vocabulary_items')
        .update({
          teacher_approved_category: approved,
          manual_category: manualCategory,
          manual_subcategory: manualSubcategory,
          updated_at: new Date().toISOString()
        })
        .eq('id', vocabularyId);

      console.log('✅ [CATEGORIZATION] Teacher approval updated for:', vocabularyId);
    } catch (error) {
      console.error('🚨 [CATEGORIZATION] Error updating approval:', error);
      throw error;
    }
  }

  /**
   * Get analytics for vocabulary categorization
   */
  async getCategorizationAnalytics(teacherId: string): Promise<{
    totalItems: number;
    categorizedItems: number;
    approvedItems: number;
    averageConfidence: number;
    categoryDistribution: Array<{ category: string; count: number }>;
  }> {
    try {
      const { data: items } = await this.supabase
        .from('enhanced_vocabulary_items')
        .select('predicted_category, category_confidence, teacher_approved_category')
        .eq('list_id', teacherId); // Assuming list_id links to teacher

      if (!items) {
        return {
          totalItems: 0,
          categorizedItems: 0,
          approvedItems: 0,
          averageConfidence: 0,
          categoryDistribution: []
        };
      }

      const totalItems = items.length;
      const categorizedItems = items.filter(item => item.predicted_category).length;
      const approvedItems = items.filter(item => item.teacher_approved_category).length;
      const averageConfidence = items.reduce((sum, item) => sum + (item.category_confidence || 0), 0) / totalItems;

      // Category distribution
      const categoryMap = new Map<string, number>();
      items.forEach(item => {
        const category = item.predicted_category || 'Uncategorized';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      }));

      return {
        totalItems,
        categorizedItems,
        approvedItems,
        averageConfidence,
        categoryDistribution
      };
    } catch (error) {
      console.error('🚨 [CATEGORIZATION] Error getting analytics:', error);
      throw error;
    }
  }
}

export const vocabularyCategorizationService = new VocabularyCategorizationService();
