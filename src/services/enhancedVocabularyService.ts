import { SupabaseClient } from '@supabase/supabase-js';

export interface EnhancedVocabularyItem {
  id: string;
  type: 'word' | 'sentence' | 'phrase';
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
  context_translation?: string;
  audio_url?: string;
  image_url?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedVocabularyList {
  id: string;
  name: string;
  description: string;
  teacher_id: string;
  language: 'spanish' | 'french' | 'german' | 'italian';
  theme?: string;
  topic?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  content_type: 'words' | 'sentences' | 'mixed';
  is_public: boolean;
  word_count: number;
  items?: EnhancedVocabularyItem[];
  created_at: string;
  updated_at: string;
}

export interface VocabularyQuery {
  language?: string;
  content_type?: 'words' | 'sentences' | 'mixed';
  difficulty_level?: string;
  theme?: string;
  topic?: string;
  teacher_id?: string;
  is_public?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GameCompatibilityInfo {
  game_type: string;
  supports_words: boolean;
  supports_sentences: boolean;
  supports_mixed: boolean;
  preferred_content_type: 'words' | 'sentences' | 'mixed';
  max_items?: number;
  min_items?: number;
}

export class EnhancedVocabularyService {
  private supabase: SupabaseClient;

  // Game compatibility matrix
  private static GAME_COMPATIBILITY: Record<string, GameCompatibilityInfo> = {
    'noughts-and-crosses': {
      game_type: 'noughts-and-crosses',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 50,
      min_items: 1
    },
    'memory-game': {
      game_type: 'memory-game',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 20,
      min_items: 1
    },
    'hangman': {
      game_type: 'hangman',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 100,
      min_items: 1
    },
    'word-scramble': {
      game_type: 'word-scramble',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 50,
      min_items: 1
    },
    'word-guesser': {
      game_type: 'word-guesser',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 100,
      min_items: 1
    },
    'vocab-blast': {
      game_type: 'vocab-blast',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 100,
      min_items: 1
    },
    'speed-builder': {
      game_type: 'speed-builder',
      supports_words: true,
      supports_sentences: true,
      supports_mixed: true,
      preferred_content_type: 'sentences',
      max_items: 50,
      min_items: 1
    },
    'sentence-towers': {
      game_type: 'sentence-towers',
      supports_words: true,
      supports_sentences: true,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 100,
      min_items: 1
    },
    'detective-listening': {
      game_type: 'detective-listening',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 30,
      min_items: 1
    },
    'vocabulary-mining': {
      game_type: 'vocabulary-mining',
      supports_words: true,
      supports_sentences: false,
      supports_mixed: true,
      preferred_content_type: 'words',
      max_items: 200,
      min_items: 1
    }
  };

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Create a new enhanced vocabulary list
   */
  async createVocabularyList(
    listData: Omit<EnhancedVocabularyList, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<EnhancedVocabularyItem, 'id' | 'created_at' | 'updated_at'>[]
  ): Promise<EnhancedVocabularyList> {
    try {
      // Create the vocabulary list
      const { data: list, error: listError } = await this.supabase
        .from('enhanced_vocabulary_lists')
        .insert({
          ...listData,
          word_count: items.length
        })
        .select()
        .single();

      if (listError) throw listError;

      // Create vocabulary items
      const itemsWithListId = items.map(item => ({
        ...item,
        list_id: list.id
      }));

      const { data: createdItems, error: itemsError } = await this.supabase
        .from('enhanced_vocabulary_items')
        .insert(itemsWithListId)
        .select();

      if (itemsError) throw itemsError;

      return {
        ...list,
        items: createdItems
      };
    } catch (error) {
      console.error('Error creating vocabulary list:', error);
      throw error;
    }
  }

  /**
   * Update an existing vocabulary list
   */
  async updateVocabularyList(
    listId: string,
    listData: Partial<Omit<EnhancedVocabularyList, 'id' | 'created_at' | 'updated_at'>>,
    items?: Omit<EnhancedVocabularyItem, 'created_at' | 'updated_at'>[]
  ): Promise<EnhancedVocabularyList> {
    try {
      // Update the vocabulary list
      const { data: list, error: listError } = await this.supabase
        .from('enhanced_vocabulary_lists')
        .update({
          ...listData,
          word_count: items?.length || listData.word_count,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)
        .select()
        .single();

      if (listError) throw listError;

      // If items are provided, replace all items
      if (items) {
        // Delete existing items
        await this.supabase
          .from('enhanced_vocabulary_items')
          .delete()
          .eq('list_id', listId);

        // Insert new items
        const itemsWithListId = items.map(item => ({
          ...item,
          list_id: listId
        }));

        const { data: createdItems, error: itemsError } = await this.supabase
          .from('enhanced_vocabulary_items')
          .insert(itemsWithListId)
          .select();

        if (itemsError) throw itemsError;

        return {
          ...list,
          items: createdItems
        };
      }

      return list;
    } catch (error) {
      console.error('Error updating vocabulary list:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary lists with optional filtering
   */
  async getVocabularyLists(query: VocabularyQuery = {}): Promise<EnhancedVocabularyList[]> {
    try {
      let supabaseQuery = this.supabase
        .from('enhanced_vocabulary_lists')
        .select(`
          *,
          enhanced_vocabulary_items(*)
        `);

      // Apply filters
      if (query.language) {
        supabaseQuery = supabaseQuery.eq('language', query.language);
      }

      if (query.content_type) {
        supabaseQuery = supabaseQuery.eq('content_type', query.content_type);
      }

      if (query.difficulty_level) {
        supabaseQuery = supabaseQuery.eq('difficulty_level', query.difficulty_level);
      }

      if (query.theme) {
        supabaseQuery = supabaseQuery.ilike('theme', `%${query.theme}%`);
      }

      if (query.topic) {
        supabaseQuery = supabaseQuery.ilike('topic', `%${query.topic}%`);
      }

      if (query.teacher_id) {
        supabaseQuery = supabaseQuery.eq('teacher_id', query.teacher_id);
      }

      if (query.is_public !== undefined) {
        supabaseQuery = supabaseQuery.eq('is_public', query.is_public);
      }

      if (query.search) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%`);
      }

      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
      }

      if (query.offset) {
        supabaseQuery = supabaseQuery.range(query.offset, query.offset + (query.limit || 10) - 1);
      }

      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      return data?.map(list => ({
        ...list,
        items: list.enhanced_vocabulary_items || []
      })) || [];
    } catch (error) {
      console.error('Error fetching vocabulary lists:', error);
      throw error;
    }
  }

  /**
   * Get a single vocabulary list by ID
   */
  async getVocabularyList(listId: string): Promise<EnhancedVocabularyList | null> {
    try {
      const { data, error } = await this.supabase
        .from('enhanced_vocabulary_lists')
        .select(`
          *,
          enhanced_vocabulary_items(*)
        `)
        .eq('id', listId)
        .single();

      if (error) throw error;

      return data ? {
        ...data,
        items: data.enhanced_vocabulary_items || []
      } : null;
    } catch (error) {
      console.error('Error fetching vocabulary list:', error);
      throw error;
    }
  }

  /**
   * Delete a vocabulary list
   */
  async deleteVocabularyList(listId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('enhanced_vocabulary_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting vocabulary list:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary items for a specific game type
   */
  async getVocabularyForGame(
    listId: string,
    gameType: string,
    options: { limit?: number; randomize?: boolean } = {}
  ): Promise<EnhancedVocabularyItem[]> {
    try {
      const compatibility = EnhancedVocabularyService.GAME_COMPATIBILITY[gameType];
      if (!compatibility) {
        throw new Error(`Unknown game type: ${gameType}`);
      }

      const list = await this.getVocabularyList(listId);
      if (!list) {
        throw new Error(`Vocabulary list not found: ${listId}`);
      }

      // Filter items based on game compatibility
      let filteredItems = list.items || [];

      if (!compatibility.supports_mixed) {
        if (compatibility.supports_words && !compatibility.supports_sentences) {
          filteredItems = filteredItems.filter(item => item.type === 'word' || item.type === 'phrase');
        } else if (compatibility.supports_sentences && !compatibility.supports_words) {
          filteredItems = filteredItems.filter(item => item.type === 'sentence');
        }
      }

      // Randomize if requested
      if (options.randomize) {
        filteredItems = this.shuffleArray([...filteredItems]);
      }

      // Apply limit
      if (options.limit) {
        filteredItems = filteredItems.slice(0, options.limit);
      }

      // Check minimum requirements
      if (compatibility.min_items && filteredItems.length < compatibility.min_items) {
        console.warn(`Game ${gameType} requires at least ${compatibility.min_items} items, but only ${filteredItems.length} are available`);
      }

      return filteredItems;
    } catch (error) {
      console.error('Error getting vocabulary for game:', error);
      throw error;
    }
  }

  /**
   * Check if a vocabulary list is compatible with a game
   */
  isListCompatibleWithGame(list: EnhancedVocabularyList, gameType: string): {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const compatibility = EnhancedVocabularyService.GAME_COMPATIBILITY[gameType];
    if (!compatibility) {
      return {
        compatible: false,
        issues: [`Unknown game type: ${gameType}`],
        recommendations: []
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check content type compatibility
    if (list.content_type === 'sentences' && !compatibility.supports_sentences) {
      issues.push(`${gameType} does not support sentence-based content`);
      recommendations.push('Consider using word-based content instead');
    }

    if (list.content_type === 'words' && !compatibility.supports_words) {
      issues.push(`${gameType} does not support word-based content`);
      recommendations.push('Consider using sentence-based content instead');
    }

    // Check item count requirements
    const itemCount = list.word_count;
    if (compatibility.min_items && itemCount < compatibility.min_items) {
      issues.push(`${gameType} requires at least ${compatibility.min_items} items, but list has ${itemCount}`);
      recommendations.push(`Add ${compatibility.min_items - itemCount} more items`);
    }

    if (compatibility.max_items && itemCount > compatibility.max_items) {
      recommendations.push(`${gameType} works best with ${compatibility.max_items} or fewer items. Consider splitting into multiple lists.`);
    }

    // Check preferred content type
    if (list.content_type !== compatibility.preferred_content_type) {
      recommendations.push(`${gameType} works best with ${compatibility.preferred_content_type} content`);
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Get game compatibility information
   */
  static getGameCompatibility(gameType: string): GameCompatibilityInfo | null {
    return EnhancedVocabularyService.GAME_COMPATIBILITY[gameType] || null;
  }

  /**
   * Get all supported game types
   */
  static getSupportedGameTypes(): string[] {
    return Object.keys(EnhancedVocabularyService.GAME_COMPATIBILITY);
  }

  /**
   * Utility method to shuffle array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Convert legacy vocabulary to enhanced format
   */
  async convertLegacyVocabulary(legacyListId: string): Promise<EnhancedVocabularyList> {
    try {
      // Get legacy vocabulary list
      const { data: legacyList, error: listError } = await this.supabase
        .from('vocabulary_assignment_lists')
        .select(`
          *,
          vocabulary_assignment_items(
            vocabulary(*)
          )
        `)
        .eq('id', legacyListId)
        .single();

      if (listError) throw listError;

      // Convert to enhanced format
      const enhancedItems: Omit<EnhancedVocabularyItem, 'id' | 'created_at' | 'updated_at'>[] = 
        legacyList.vocabulary_assignment_items?.map((item: any) => ({
          type: 'word' as const,
          term: item.vocabulary.spanish || item.vocabulary.french || '',
          translation: item.vocabulary.english || '',
          part_of_speech: item.vocabulary.part_of_speech || 'noun',
          difficulty_level: legacyList.difficulty_level || 'intermediate'
        })) || [];

      const enhancedList: Omit<EnhancedVocabularyList, 'id' | 'created_at' | 'updated_at'> = {
        name: legacyList.name,
        description: legacyList.description || '',
        teacher_id: legacyList.teacher_id,
        language: 'spanish', // Default to Spanish for legacy content
        theme: legacyList.theme,
        topic: legacyList.topic,
        difficulty_level: legacyList.difficulty_level || 'intermediate',
        content_type: 'words',
        is_public: legacyList.is_public || false,
        word_count: enhancedItems.length
      };

      return await this.createVocabularyList(enhancedList, enhancedItems);
    } catch (error) {
      console.error('Error converting legacy vocabulary:', error);
      throw error;
    }
  }
}
