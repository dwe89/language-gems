import { SupabaseClient } from '@supabase/supabase-js';

export interface VocabularyFolder {
  id: string;
  name: string;
  description?: string;
  teacher_id: string;
  parent_folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UploadedVocabularyItem {
  type: 'word' | 'sentence' | 'phrase';
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
  context_translation?: string;
  audio_url?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
  tags?: string[];
}

export interface UploadedVocabularyList {
  name: string;
  description: string;
  language: 'spanish' | 'french' | 'german';
  theme?: string;
  topic?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  content_type: 'words' | 'sentences' | 'mixed';
  is_public: boolean;
  folder_id?: string;
  items: UploadedVocabularyItem[];
}

export interface ParsedContent {
  items: UploadedVocabularyItem[];
  errors: string[];
  warnings: string[];
  detectedFormat: 'tab' | 'comma' | 'mixed' | 'unknown';
  totalLines: number;
  validLines: number;
}

export class VocabularyUploadService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Parse copy/paste content from Word, Excel, or other sources
   */
  parseContent(
    content: string,
    contentType: 'words' | 'sentences' | 'mixed' = 'words',
    defaultDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): ParsedContent {
    const lines = content.trim().split('\n').filter(line => line.trim());
    const items: UploadedVocabularyItem[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let detectedFormat: 'tab' | 'comma' | 'mixed' | 'unknown' = 'unknown';
    
    // Detect format by analyzing first few lines
    const sampleLines = lines.slice(0, 5);
    let tabCount = 0;
    let commaCount = 0;
    
    sampleLines.forEach(line => {
      if (line.includes('\t')) tabCount++;
      if (line.includes(',')) commaCount++;
    });
    
    if (tabCount > commaCount) {
      detectedFormat = 'tab';
    } else if (commaCount > tabCount) {
      detectedFormat = 'comma';
    } else if (tabCount > 0 && commaCount > 0) {
      detectedFormat = 'mixed';
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      try {
        // Try tab separation first, then comma
        let parts: string[];
        if (line.includes('\t')) {
          parts = line.split('\t').map(p => p.trim());
        } else if (line.includes(',')) {
          // Handle CSV-style parsing with quoted strings
          parts = this.parseCSVLine(line);
        } else {
          // Single column or space-separated
          parts = line.split(/\s{2,}/).map(p => p.trim());
        }

        if (parts.length < 2) {
          errors.push(`Line ${lineNumber}: At least term and translation are required`);
          return;
        }

        const [term, translation, partOfSpeech, contextSentence, contextTranslation, notes] = parts;

        if (!term || !translation) {
          errors.push(`Line ${lineNumber}: Term and translation cannot be empty`);
          return;
        }

        // Determine item type based on content
        let itemType: 'word' | 'sentence' | 'phrase' = 'word';
        if (contentType === 'sentences' || term.split(' ').length > 5) {
          itemType = 'sentence';
        } else if (term.split(' ').length > 1) {
          itemType = 'phrase';
        }

        const item: UploadedVocabularyItem = {
          type: itemType,
          term: term.trim(),
          translation: translation.trim(),
          part_of_speech: partOfSpeech?.trim() || (itemType === 'sentence' ? 'sentence' : 'noun'),
          context_sentence: contextSentence?.trim(),
          context_translation: contextTranslation?.trim(),
          difficulty_level: defaultDifficulty,
          notes: notes?.trim(),
          tags: []
        };

        // Validate term length
        if (item.term.length > 500) {
          warnings.push(`Line ${lineNumber}: Term is very long (${item.term.length} characters)`);
        }

        if (item.translation.length > 500) {
          warnings.push(`Line ${lineNumber}: Translation is very long (${item.translation.length} characters)`);
        }

        items.push(item);

      } catch (error) {
        errors.push(`Line ${lineNumber}: Failed to parse - ${error}`);
      }
    });

    return {
      items,
      errors,
      warnings,
      detectedFormat,
      totalLines: lines.length,
      validLines: items.length
    };
  }

  /**
   * Parse CSV line handling quoted strings
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Create or get folder
   */
  async createFolder(
    name: string,
    teacherId: string,
    description?: string,
    parentFolderId?: string
  ): Promise<VocabularyFolder> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary_folders')
        .insert({
          name,
          description,
          teacher_id: teacherId,
          parent_folder_id: parentFolderId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  /**
   * Get folders for a teacher
   */
  async getFolders(teacherId: string): Promise<VocabularyFolder[]> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary_folders')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  }

  /**
   * Upload vocabulary list with audio generation
   */
  async uploadVocabularyList(
    listData: UploadedVocabularyList,
    teacherId: string,
    generateAudio: boolean = true
  ): Promise<string> {
    try {
      // First create the vocabulary list
      const { data: list, error: listError } = await this.supabase
        .from('enhanced_vocabulary_lists')
        .insert({
          name: listData.name,
          description: listData.description,
          teacher_id: teacherId,
          language: listData.language,
          theme: listData.theme,
          topic: listData.topic,
          difficulty_level: listData.difficulty_level,
          content_type: listData.content_type,
          is_public: listData.is_public,
          word_count: listData.items.length,
          folder_id: listData.folder_id
        })
        .select()
        .single();

      if (listError) throw listError;

      // Generate audio for items if requested
      let itemsWithAudio = listData.items;
      if (generateAudio) {
        itemsWithAudio = await this.generateAudioForItems(listData.items, listData.language);
      }

      // Create vocabulary items
      const itemsWithListId = itemsWithAudio.map(item => ({
        ...item,
        list_id: list.id
      }));

      const { error: itemsError } = await this.supabase
        .from('enhanced_vocabulary_items')
        .insert(itemsWithListId);

      if (itemsError) throw itemsError;

      return list.id;
    } catch (error) {
      console.error('Error uploading vocabulary list:', error);
      throw error;
    }
  }

  /**
   * Generate audio for vocabulary items using Amazon Polly
   */
  private async generateAudioForItems(
    items: UploadedVocabularyItem[],
    language: string
  ): Promise<UploadedVocabularyItem[]> {
    const itemsWithAudio = [...items];
    
    try {
      // Process items in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (item, batchIndex) => {
          const itemIndex = i + batchIndex;
          try {
            const audioUrl = await this.generateAudioForItem(item.term, language);
            if (audioUrl) {
              itemsWithAudio[itemIndex] = {
                ...item,
                audio_url: audioUrl
              };
            }
          } catch (error) {
            console.warn(`Failed to generate audio for "${item.term}":`, error);
            // Continue without audio for this item
          }
        }));

        // Small delay between batches
        if (i + batchSize < items.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    } catch (error) {
      console.error('Error generating audio for items:', error);
      // Return items without audio rather than failing completely
    }

    return itemsWithAudio;
  }

  /**
   * Public method to generate audio for a single word/phrase
   */
  async generateAudio(text: string, language: string): Promise<string | null> {
    return this.generateAudioForItem(text, language);
  }

  /**
   * Generate audio for a single item using Amazon Polly API
   */
  private async generateAudioForItem(text: string, language: string): Promise<string | null> {
    try {
      // Map language codes for Polly API
      const languageMap: Record<string, string> = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
      };

      const pollyLanguage = languageMap[language] || 'es';

      const response = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: text,
          language: pollyLanguage,
          category: 'vocabulary',
          engine: 'standard' // Use standard voice as requested
        }),
      });

      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.audioUrl || null;
    } catch (error) {
      console.error('Error generating audio:', error);
      return null;
    }
  }

  /**
   * Validate vocabulary list data
   */
  validateVocabularyList(listData: UploadedVocabularyList): string[] {
    const errors: string[] = [];

    if (!listData.name?.trim()) {
      errors.push('List name is required');
    }

    if (listData.name && listData.name.length > 255) {
      errors.push('List name must be less than 255 characters');
    }

    if (!listData.language) {
      errors.push('Language is required');
    }

    if (!listData.difficulty_level) {
      errors.push('Difficulty level is required');
    }

    if (!listData.content_type) {
      errors.push('Content type is required');
    }

    if (!listData.items || listData.items.length === 0) {
      errors.push('At least one vocabulary item is required');
    }

    if (listData.items && listData.items.length > 1000) {
      errors.push('Maximum 1000 vocabulary items allowed per list');
    }

    return errors;
  }
}
