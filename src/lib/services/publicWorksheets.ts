import { createClient } from '@/utils/supabase/client';

export interface PublicWorksheet {
  id: string;
  title: string;
  description?: string;
  subject: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  template_id?: string;
  author: string;
  downloads: number;
  tags: string[];
  createdAt: string;
  estimatedTime: number;
  questionCount: number;
}

export interface WorksheetFilters {
  searchTerm?: string;
  subject?: string;
  level?: string;
  type?: string;
  sortBy?: 'popular' | 'newest' | 'title';
}

export class PublicWorksheetsService {
  private supabase = createClient();

  async getPublicWorksheets(filters: WorksheetFilters = {}): Promise<PublicWorksheet[]> {
    try {
      // First get the worksheets
      let query = this.supabase
        .from('worksheets')
        .select(`
          id,
          title,
          subject,
          topic,
          subtopic,
          difficulty,
          template_id,
          estimated_time_minutes,
          question_count,
          tags,
          created_at,
          user_id
        `)
        .eq('is_public', true);

      // Apply filters
      if (filters.subject && filters.subject !== 'all') {
        query = query.ilike('subject', `%${filters.subject}%`);
      }

      if (filters.level && filters.level !== 'all') {
        query = query.ilike('difficulty', `%${filters.level}%`);
      }

      if (filters.type && filters.type !== 'all') {
        query = query.ilike('template_id', `%${filters.type}%`);
      }

      if (filters.searchTerm) {
        query = query.or(`
          title.ilike.%${filters.searchTerm}%,
          subject.ilike.%${filters.searchTerm}%,
          topic.ilike.%${filters.searchTerm}%
        `);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'popular':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data: worksheets, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching public worksheets:', error);
        return [];
      }

      if (!worksheets || worksheets.length === 0) {
        return [];
      }

      // Get author information for worksheets that have user_id
      const userIds = worksheets.filter(w => w.user_id).map(w => w.user_id);
      const authors = await this.getAuthors(userIds);

      // Get download counts for each worksheet
      const worksheetIds = worksheets.map(w => w.id);
      const downloadCounts = await this.getDownloadCounts(worksheetIds);

      // Transform the data to match the expected interface
      return worksheets.map(worksheet => ({
        id: worksheet.id,
        title: worksheet.title,
        description: this.generateDescription(worksheet),
        subject: this.normalizeSubject(worksheet.subject),
        topic: worksheet.topic || '',
        subtopic: worksheet.subtopic || '',
        difficulty: this.normalizeDifficulty(worksheet.difficulty),
        template_id: worksheet.template_id || '',
        author: authors[worksheet.user_id] || 'Anonymous',
        downloads: downloadCounts[worksheet.id] || 0,
        tags: this.normalizeTags(worksheet.tags || []),
        createdAt: worksheet.created_at,
        estimatedTime: worksheet.estimated_time_minutes || 30,
        questionCount: worksheet.question_count || 10
      }));

    } catch (error) {
      console.error('Error in getPublicWorksheets:', error);
      return [];
    }
  }

  private async getDownloadCounts(worksheetIds: string[]): Promise<Record<string, number>> {
    if (worksheetIds.length === 0) return {};

    try {
      const { data, error } = await this.supabase
        .from('worksheet_downloads')
        .select('worksheet_id')
        .in('worksheet_id', worksheetIds);

      if (error) {
        console.error('Error fetching download counts:', error);
        return {};
      }

      // Count downloads per worksheet
      const counts: Record<string, number> = {};
      data?.forEach(download => {
        counts[download.worksheet_id] = (counts[download.worksheet_id] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error in getDownloadCounts:', error);
      return {};
    }
  }

  private async getAuthors(userIds: string[]): Promise<Record<string, string>> {
    if (userIds.length === 0) return {};

    try {
      // Get profiles first
      const { data: profiles, error: profilesError } = await this.supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Build author map
      const authors: Record<string, string> = {};

      // Use display names from profiles
      profiles?.forEach(profile => {
        if (profile.display_name) {
          authors[profile.user_id] = profile.display_name;
        }
      });

      // For users without display names, generate a friendly name
      userIds.forEach(userId => {
        if (!authors[userId]) {
          authors[userId] = 'Teacher ' + userId.slice(-4).toUpperCase();
        }
      });

      return authors;
    } catch (error) {
      console.error('Error in getAuthors:', error);
      return {};
    }
  }

  private normalizeSubject(subject: string): string {
    const subjectMap: Record<string, string> = {
      'Languages': 'spanish',
      'spanish': 'spanish',
      'french': 'french',
      'german': 'german',
      'english': 'english'
    };
    return subjectMap[subject] || subject.toLowerCase();
  }

  private normalizeDifficulty(difficulty?: string): string {
    if (!difficulty) return 'intermediate';
    const lower = difficulty.toLowerCase();
    if (lower.includes('easy') || lower.includes('beginner')) return 'beginner';
    if (lower.includes('hard') || lower.includes('advanced')) return 'advanced';
    return 'intermediate';
  }

  private normalizeTags(tags: string[]): string[] {
    return tags.map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, ''));
  }

  private generateDescription(worksheet: any): string {
    const templates: Record<string, string> = {
      'vocabulary_practice': `Practice ${worksheet.topic || 'vocabulary'} with interactive exercises and translations.`,
      'reading_comprehension': `Improve reading skills with ${worksheet.topic || 'engaging'} texts and comprehension questions.`,
      'sentence_builder': `Build sentences using ${worksheet.topic || 'vocabulary'} with guided practice exercises.`,
      'word_search': `Find hidden words in this fun ${worksheet.topic || 'vocabulary'} word search puzzle.`,
      'grammar_exercises': `Master grammar concepts with structured exercises and examples.`,
      'crossword': `Solve crossword clues using ${worksheet.topic || 'vocabulary'} knowledge.`
    };

    return templates[worksheet.template_id] || `Practice ${worksheet.topic || 'language skills'} with engaging exercises.`;
  }



  async getWorksheetTypes(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('worksheets')
        .select('template_id')
        .eq('is_public', true)
        .not('template_id', 'is', null);

      if (error) {
        console.error('Error fetching worksheet types:', error);
        return [];
      }

      const types = [...new Set(data?.map(w => w.template_id) || [])];
      return types.filter(Boolean);
    } catch (error) {
      console.error('Error in getWorksheetTypes:', error);
      return [];
    }
  }

  async getSubjects(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('worksheets')
        .select('subject')
        .eq('is_public', true);

      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }

      const subjects = [...new Set(data?.map(w => this.normalizeSubject(w.subject)) || [])];
      return subjects.filter(Boolean);
    } catch (error) {
      console.error('Error in getSubjects:', error);
      return [];
    }
  }
}

export const publicWorksheetsService = new PublicWorksheetsService();
