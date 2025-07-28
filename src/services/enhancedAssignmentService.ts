import { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { EnhancedGameService, AssignmentAnalytics } from './enhancedGameService';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface AssignmentTemplate {
  id?: string;
  teacher_id: string;
  name: string;
  description?: string;
  game_type: string;
  default_config: Record<string, any>;
  vocabulary_list_id?: string;
  estimated_duration: number;
  difficulty_level: string;
  max_attempts: number;
  usage_count: number;
  is_public: boolean;
  tags: string[];
}

export interface EnhancedAssignmentProgress {
  id?: string;
  assignment_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue' | 'submitted';
  attempts_count: number;
  max_attempts: number;
  
  // Performance metrics
  best_score: number;
  best_accuracy: number;
  total_time_spent: number;
  average_session_time: number;
  
  // Learning analytics
  words_mastered: number;
  words_struggling: number;
  improvement_rate: number;
  consistency_score: number;
  
  // Timestamps
  first_attempt_at?: Date;
  last_attempt_at?: Date;
  completed_at?: Date;
  submitted_at?: Date;
  
  // Feedback
  teacher_feedback?: string;
  auto_feedback: Record<string, any>;
  student_reflection?: string;
  
  // Metadata
  session_ids: string[];
  progress_data: Record<string, any>;
}

export interface AssignmentCreationData {
  title: string;
  description?: string;
  game_type: string;
  class_id: string;
  due_date?: string;
  vocabulary_list_id?: string;
  config: Record<string, any>;
  time_limit: number;
  max_attempts: number;
  auto_grade: boolean;
  feedback_enabled: boolean;
  hints_allowed: boolean;
  power_ups_enabled: boolean;
  curriculum_level?: 'KS3' | 'KS4';
}

export interface ClassPerformanceMetrics {
  assignment_id: string;
  total_students: number;
  completion_rate: number;
  average_score: number;
  average_accuracy: number;
  average_time_spent: number;
  difficulty_rating: number;
  engagement_score: number;
  top_performers: StudentPerformance[];
  struggling_students: StudentPerformance[];
  word_difficulty_analysis: WordDifficultyData[];
}

export interface StudentPerformance {
  student_id: string;
  student_name: string;
  score: number;
  accuracy: number;
  time_spent: number;
  attempts: number;
  status: string;
  improvement_trend: 'improving' | 'stable' | 'declining';
}

export interface WordDifficultyData {
  word: string;
  translation: string;
  error_rate: number;
  average_response_time: number;
  students_struggling: number;
  common_mistakes: string[];
}

// =====================================================
// ENHANCED ASSIGNMENT SERVICE CLASS
// =====================================================

export class EnhancedAssignmentService {
  private supabase: SupabaseClient;
  private gameService: EnhancedGameService;
  
  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    this.gameService = new EnhancedGameService(this.supabase);
  }

  // =====================================================
  // ASSIGNMENT TEMPLATE MANAGEMENT
  // =====================================================

  async createAssignmentTemplate(template: Omit<AssignmentTemplate, 'id' | 'usage_count'>): Promise<string> {
    const { data, error } = await this.supabase
      .from('assignment_templates')
      .insert({
        ...template,
        usage_count: 0
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create assignment template: ${error.message}`);
    }

    return data.id;
  }

  async getAssignmentTemplates(teacherId: string, includePublic: boolean = true): Promise<AssignmentTemplate[]> {
    let query = this.supabase
      .from('assignment_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (includePublic) {
      query = query.or(`teacher_id.eq.${teacherId},is_public.eq.true`);
    } else {
      query = query.eq('teacher_id', teacherId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get assignment templates: ${error.message}`);
    }

    return data || [];
  }

  async useTemplate(templateId: string): Promise<void> {
    const { error } = await this.supabase
      .from('assignment_templates')
      .update({ usage_count: 1 })
      .eq('id', templateId);

    if (error) {
      throw new Error(`Failed to update template usage: ${error.message}`);
    }
  }

  // =====================================================
  // ENHANCED ASSIGNMENT CREATION
  // =====================================================

  async createEnhancedAssignment(
    teacherId: string,
    assignmentData: AssignmentCreationData
  ): Promise<string> {
    let vocabularyListId = assignmentData.vocabulary_list_id;
    let vocabularySelectionType = 'custom_list';
    let vocabularyCriteria = {};
    let vocabularyCount = 10;

    // Extract vocabulary configuration from game config
    const vocabularyConfig = assignmentData.config?.vocabularyConfig;

    if (vocabularyConfig && vocabularyConfig.source && vocabularyConfig.source !== 'custom' && vocabularyConfig.source !== '') {
      // Create vocabulary list based on configuration
      try {
        const vocabularySelection = this.transformVocabularyConfig(vocabularyConfig);
        vocabularySelectionType = vocabularySelection.type;
        vocabularyCriteria = vocabularySelection;
        vocabularyCount = vocabularyConfig.wordCount || 10;

        // Create vocabulary assignment list
        const { data: newVocabList, error: vocabListError } = await this.supabase
          .from('vocabulary_assignment_lists')
          .insert([{
            name: `${assignmentData.title} - Vocabulary List`,
            description: `Auto-generated vocabulary list for ${assignmentData.title}`,
            teacher_id: teacherId,
            theme: vocabularyConfig.theme || null,
            topic: vocabularyConfig.topic || null,
            difficulty_level: vocabularyConfig.difficulty || 'intermediate',
            word_count: vocabularyCount,
            vocabulary_items: [],
            is_public: false
          }])
          .select()
          .single();

        if (vocabListError) {
          console.error('Vocabulary list creation error:', vocabListError);
        } else {
          vocabularyListId = newVocabList.id;

          // Populate vocabulary list
          await this.populateVocabularyList(vocabularyListId, vocabularySelection);
        }
      } catch (error) {
        console.error('Error creating vocabulary list:', error);
      }
    }

    // Create the assignment
    const { data: assignment, error: assignmentError } = await this.supabase
      .from('assignments')
      .insert({
        title: assignmentData.title,
        description: assignmentData.description,
        game_type: assignmentData.game_type,
        class_id: assignmentData.class_id,
        due_date: assignmentData.due_date ? new Date(assignmentData.due_date).toISOString() : null,
        vocabulary_assignment_list_id: vocabularyListId,
        vocabulary_selection_type: vocabularySelectionType,
        vocabulary_criteria: vocabularyCriteria,
        vocabulary_count: vocabularyCount,
        created_by: teacherId,
        game_config: assignmentData.config,
        max_attempts: assignmentData.max_attempts,
        auto_grade: assignmentData.auto_grade,
        feedback_enabled: assignmentData.feedback_enabled,
        hints_allowed: assignmentData.hints_allowed,
        power_ups_enabled: assignmentData.power_ups_enabled,
        time_limit: assignmentData.time_limit,
        status: 'active'
      })
      .select('id')
      .single();

    if (assignmentError) {
      throw new Error(`Failed to create assignment: ${assignmentError.message}`);
    }

    // Initialize assignment analytics
    await this.initializeAssignmentAnalytics(assignment.id);

    // Create progress entries for all students in the class
    await this.initializeStudentProgress(assignment.id, assignmentData.class_id);

    return assignment.id;
  }

  // =====================================================
  // VOCABULARY CONFIGURATION HELPERS
  // =====================================================

  private transformVocabularyConfig(vocabularyConfig: any): any {
    // Transform the vocabulary config from Smart Assignment Creator format
    // to the format expected by the assignment creation API

    console.log('Transforming vocabulary config:', vocabularyConfig);

    // Check if we have a subcategory (most common case)
    if (vocabularyConfig.subcategory && vocabularyConfig.subcategory !== '') {
      // Map subcategory to its parent category
      const category = this.mapSubcategoryToCategory(vocabularyConfig.subcategory);

      return {
        type: 'subcategory_based',
        category: category,
        subcategory: vocabularyConfig.subcategory,
        language: vocabularyConfig.language || 'es',
        wordCount: vocabularyConfig.wordCount || 10
      };
    } else if (vocabularyConfig.source === 'category' && vocabularyConfig.category && vocabularyConfig.category !== '') {
      return {
        type: 'category_based',
        category: vocabularyConfig.category,
        language: vocabularyConfig.language || 'es',
        wordCount: vocabularyConfig.wordCount || 10
      };
    } else if (vocabularyConfig.source === 'theme') {
      return {
        type: 'theme_based',
        theme: vocabularyConfig.theme,
        language: vocabularyConfig.language || 'es',
        wordCount: vocabularyConfig.wordCount || 10
      };
    } else if (vocabularyConfig.source === 'topic') {
      return {
        type: 'topic_based',
        topic: vocabularyConfig.topic,
        language: vocabularyConfig.language || 'es',
        wordCount: vocabularyConfig.wordCount || 10
      };
    }

    // Default fallback
    return {
      type: 'category_based',
      category: 'basics_core_language',
      language: vocabularyConfig.language || 'es',
      wordCount: vocabularyConfig.wordCount || 10
    };
  }

  private mapSubcategoryToCategory(subcategory: string): string {
    // Map subcategories to their parent categories
    const subcategoryMap: { [key: string]: string } = {
      // basics_core_language
      'colours': 'basics_core_language',
      'numbers_1_30': 'basics_core_language',
      'numbers_40_100': 'basics_core_language',
      'days_of_week': 'basics_core_language',
      'months': 'basics_core_language',
      'common_adverbs': 'basics_core_language',
      'pronouns': 'basics_core_language',
      'question_words': 'basics_core_language',

      // identity_personal_life
      'family_friends': 'identity_personal_life',
      'physical_description': 'identity_personal_life',
      'personality_character': 'identity_personal_life',
      'relationships': 'identity_personal_life',

      // home_local_area
      'house_rooms': 'home_local_area',
      'furniture_household': 'home_local_area',
      'places_in_town': 'home_local_area',
      'directions': 'home_local_area',

      // Add more mappings as needed...
    };

    return subcategoryMap[subcategory] || 'basics_core_language';
  }

  private async populateVocabularyList(listId: string, criteria: any): Promise<void> {
    try {
      // Use centralized_vocabulary table with modern schema
      let query = this.supabase
        .from('centralized_vocabulary')
        .select('id, word, translation, category, subcategory, part_of_speech, language');

      // Apply language filter first (most important)
      if (criteria.language) {
        query = query.eq('language', criteria.language);
      }

      // Apply filters based on criteria type
      switch (criteria.type) {
        case 'category_based':
          if (criteria.category) {
            query = query.eq('category', criteria.category);
          }
          break;
        case 'subcategory_based':
          if (criteria.category) {
            query = query.eq('category', criteria.category);
          }
          if (criteria.subcategory) {
            query = query.eq('subcategory', criteria.subcategory);
          }
          break;
        case 'theme_based':
          if (criteria.theme) {
            query = query.eq('category', criteria.theme);
          }
          break;
        case 'topic_based':
          if (criteria.topic) {
            query = query.eq('subcategory', criteria.topic);
          }
          break;
      }

      // Execute the query
      const { data: allVocabulary, error: vocabularyError } = await query;

      if (vocabularyError) {
        console.error('Vocabulary fetch error:', vocabularyError);
        return;
      }

      if (!allVocabulary || allVocabulary.length === 0) {
        console.warn('No vocabulary found for criteria:', criteria);
        return;
      }

      // Select random words up to the requested count
      const wordCount = Math.min(criteria.wordCount || 10, allVocabulary.length);
      const shuffled = allVocabulary.sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, wordCount);

      // Insert vocabulary items into the assignment list
      const vocabularyItems = selectedWords.map((word: any, index: number) => ({
        assignment_list_id: listId,
        centralized_vocabulary_id: word.id,
        order_position: index
      }));

      const { error: insertError } = await this.supabase
        .from('vocabulary_assignment_items')
        .insert(vocabularyItems);

      if (insertError) {
        console.error('Vocabulary items insertion error:', insertError);
      } else {
        console.log(`Successfully populated vocabulary list with ${selectedWords.length} items`);
      }
    } catch (error) {
      console.error('Error populating vocabulary list:', error);
    }
  }

  private async initializeAssignmentAnalytics(assignmentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('assignment_analytics')
      .insert({
        assignment_id: assignmentId,
        total_students: 0,
        students_started: 0,
        students_completed: 0,
        completion_rate: 0,
        average_score: 0,
        average_accuracy: 0,
        average_time_spent: 0,
        difficulty_rating: 0,
        words_causing_difficulty: [],
        common_mistakes: {},
        average_attempts: 0,
        dropout_rate: 0,
        help_requests: 0,
        peak_activity_hours: [],
        average_session_length: 0
      });

    if (error) {
      throw new Error(`Failed to initialize assignment analytics: ${error.message}`);
    }
  }

  private async initializeStudentProgress(assignmentId: string, classId: string): Promise<void> {
    // Get all students in the class
    const { data: students, error: studentsError } = await this.supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', classId);

    if (studentsError) {
      throw new Error(`Failed to get class students: ${studentsError.message}`);
    }

    if (!students || students.length === 0) {
      return;
    }

    // Create progress entries for all students
    const progressEntries = students.map(student => ({
      assignment_id: assignmentId,
      student_id: student.student_id,
      status: 'not_started' as const,
      attempts_count: 0,
      max_attempts: 3,
      best_score: 0,
      best_accuracy: 0,
      total_time_spent: 0,
      average_session_time: 0,
      words_mastered: 0,
      words_struggling: 0,
      improvement_rate: 0,
      consistency_score: 0,
      auto_feedback: {},
      session_ids: [],
      progress_data: {}
    }));

    const { error } = await this.supabase
      .from('enhanced_assignment_progress')
      .insert(progressEntries);

    if (error) {
      throw new Error(`Failed to initialize student progress: ${error.message}`);
    }

    // Update total students count in analytics
    await this.supabase
      .from('assignment_analytics')
      .update({ total_students: students.length })
      .eq('assignment_id', assignmentId);
  }

  // =====================================================
  // ASSIGNMENT PROGRESS TRACKING
  // =====================================================

  async updateAssignmentProgress(
    assignmentId: string,
    studentId: string,
    sessionId: string,
    sessionData: any
  ): Promise<void> {
    // Get current progress
    const { data: progress, error: progressError } = await this.supabase
      .from('enhanced_assignment_progress')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .single();

    if (progressError) {
      throw new Error(`Failed to get assignment progress: ${progressError.message}`);
    }

    // Calculate updates
    const updates: Partial<EnhancedAssignmentProgress> = {
      attempts_count: progress.attempts_count + 1,
      last_attempt_at: new Date(),
      total_time_spent: progress.total_time_spent + (sessionData.duration_seconds || 0),
      session_ids: [...progress.session_ids, sessionId]
    };

    // Update best scores if improved
    if (sessionData.final_score > progress.best_score) {
      updates.best_score = sessionData.final_score;
    }

    if (sessionData.accuracy_percentage > progress.best_accuracy) {
      updates.best_accuracy = sessionData.accuracy_percentage;
    }

    // Update status
    if (progress.status === 'not_started') {
      updates.status = 'in_progress';
      updates.first_attempt_at = new Date();
    }

    // Check if assignment is completed (based on score threshold or completion percentage)
    if (sessionData.completion_percentage >= 80 || sessionData.accuracy_percentage >= 85) {
      updates.status = 'completed';
      updates.completed_at = new Date();
    }

    // Calculate learning metrics
    updates.words_mastered = sessionData.words_correct || 0;
    updates.words_struggling = (sessionData.words_attempted || 0) - (sessionData.words_correct || 0);
    
    // Calculate improvement rate
    if (progress.attempts_count > 0) {
      const previousAccuracy = progress.best_accuracy;
      const currentAccuracy = sessionData.accuracy_percentage;
      updates.improvement_rate = ((currentAccuracy - previousAccuracy) / previousAccuracy) * 100;
    }

    // Update average session time
    updates.average_session_time = Math.round((updates.total_time_spent || 0) / (updates.attempts_count || 1));

    // Generate auto feedback
    updates.auto_feedback = this.generateAutoFeedback(sessionData, progress);

    // Update progress
    const { error: updateError } = await this.supabase
      .from('enhanced_assignment_progress')
      .update(updates)
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId);

    if (updateError) {
      throw new Error(`Failed to update assignment progress: ${updateError.message}`);
    }

    // Update assignment analytics
    await this.updateAssignmentAnalytics(assignmentId);
  }

  private generateAutoFeedback(sessionData: any, progress: any): Record<string, any> {
    const feedback: Record<string, any> = {
      performance: {},
      suggestions: [],
      strengths: [],
      areas_for_improvement: []
    };

    // Performance feedback
    if (sessionData.accuracy_percentage >= 90) {
      feedback.performance.level = 'excellent';
      feedback.strengths.push('Outstanding accuracy');
    } else if (sessionData.accuracy_percentage >= 75) {
      feedback.performance.level = 'good';
      feedback.strengths.push('Good accuracy');
    } else if (sessionData.accuracy_percentage >= 60) {
      feedback.performance.level = 'fair';
      feedback.areas_for_improvement.push('Focus on accuracy');
    } else {
      feedback.performance.level = 'needs_improvement';
      feedback.areas_for_improvement.push('Accuracy needs significant improvement');
    }

    // Speed feedback
    if (sessionData.average_response_time_ms < 3000) {
      feedback.strengths.push('Quick response time');
    } else if (sessionData.average_response_time_ms > 8000) {
      feedback.suggestions.push('Try to respond more quickly');
    }

    // Improvement feedback
    if (progress.attempts_count > 1 && sessionData.accuracy_percentage > progress.best_accuracy) {
      feedback.strengths.push('Showing improvement');
    }

    // Consistency feedback
    if (sessionData.completion_percentage >= 90) {
      feedback.strengths.push('Great persistence');
    }

    return feedback;
  }

  async updateAssignmentAnalytics(assignmentId: string): Promise<void> {
    // Get all progress records for this assignment
    const { data: progressRecords, error: progressError } = await this.supabase
      .from('enhanced_assignment_progress')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (progressError) {
      throw new Error(`Failed to get progress records: ${progressError.message}`);
    }

    if (!progressRecords || progressRecords.length === 0) {
      return;
    }

    // Calculate analytics
    const totalStudents = progressRecords.length;
    const studentsStarted = progressRecords.filter(p => p.status !== 'not_started').length;
    const studentsCompleted = progressRecords.filter(p => p.status === 'completed').length;
    const completionRate = (studentsCompleted / totalStudents) * 100;

    const completedRecords = progressRecords.filter(p => p.status === 'completed');
    const averageScore = completedRecords.length > 0
      ? completedRecords.reduce((sum, p) => sum + p.best_score, 0) / completedRecords.length
      : 0;
    const averageAccuracy = completedRecords.length > 0
      ? completedRecords.reduce((sum, p) => sum + p.best_accuracy, 0) / completedRecords.length
      : 0;
    const averageTimeSpent = completedRecords.length > 0
      ? completedRecords.reduce((sum, p) => sum + p.total_time_spent, 0) / completedRecords.length
      : 0;

    const averageAttempts = progressRecords.reduce((sum, p) => sum + p.attempts_count, 0) / totalStudents;
    const dropoutRate = progressRecords.filter(p => p.status === 'in_progress' && p.attempts_count > 0).length / totalStudents * 100;

    // Update analytics
    const { error: updateError } = await this.supabase
      .from('assignment_analytics')
      .update({
        total_students: totalStudents,
        students_started: studentsStarted,
        students_completed: studentsCompleted,
        completion_rate: Math.round(completionRate * 100) / 100,
        average_score: Math.round(averageScore * 100) / 100,
        average_accuracy: Math.round(averageAccuracy * 100) / 100,
        average_time_spent: Math.round(averageTimeSpent),
        average_attempts: Math.round(averageAttempts * 100) / 100,
        dropout_rate: Math.round(dropoutRate * 100) / 100,
        last_calculated_at: new Date()
      })
      .eq('assignment_id', assignmentId);

    if (updateError) {
      throw new Error(`Failed to update assignment analytics: ${updateError.message}`);
    }
  }

  // =====================================================
  // ANALYTICS AND REPORTING
  // =====================================================

  async getClassPerformanceMetrics(assignmentId: string): Promise<ClassPerformanceMetrics> {
    // Get assignment analytics
    const { data: analytics, error: analyticsError } = await this.supabase
      .from('assignment_analytics')
      .select('*')
      .eq('assignment_id', assignmentId)
      .single();

    if (analyticsError) {
      throw new Error(`Failed to get assignment analytics: ${analyticsError.message}`);
    }

    // Get detailed student performance
    const { data: progressRecords, error: progressError } = await this.supabase
      .from('enhanced_assignment_progress')
      .select(`
        *,
        user_profiles!inner(display_name, full_name)
      `)
      .eq('assignment_id', assignmentId);

    if (progressError) {
      throw new Error(`Failed to get student progress: ${progressError.message}`);
    }

    // Process student performance data
    const studentPerformances: StudentPerformance[] = progressRecords.map(record => ({
      student_id: record.student_id,
      student_name: record.user_profiles?.display_name || record.user_profiles?.full_name || 'Unknown',
      score: record.best_score,
      accuracy: record.best_accuracy,
      time_spent: record.total_time_spent,
      attempts: record.attempts_count,
      status: record.status,
      improvement_trend: this.calculateImprovementTrend(record)
    }));

    // Sort and get top performers and struggling students
    const sortedByScore = [...studentPerformances].sort((a, b) => b.score - a.score);
    const topPerformers = sortedByScore.slice(0, 5);
    const strugglingStudents = sortedByScore
      .filter(s => s.status !== 'not_started' && (s.accuracy < 60 || s.attempts > 2))
      .slice(-5);

    // Get word difficulty analysis
    const wordDifficultyAnalysis = await this.getWordDifficultyAnalysis(assignmentId);

    return {
      assignment_id: assignmentId,
      total_students: analytics.total_students,
      completion_rate: analytics.completion_rate,
      average_score: analytics.average_score,
      average_accuracy: analytics.average_accuracy,
      average_time_spent: analytics.average_time_spent,
      difficulty_rating: analytics.difficulty_rating,
      engagement_score: this.calculateEngagementScore(analytics),
      top_performers: topPerformers,
      struggling_students: strugglingStudents,
      word_difficulty_analysis: wordDifficultyAnalysis
    };
  }

  private calculateImprovementTrend(record: any): 'improving' | 'stable' | 'declining' {
    if (record.improvement_rate > 10) return 'improving';
    if (record.improvement_rate < -10) return 'declining';
    return 'stable';
  }

  private calculateEngagementScore(analytics: any): number {
    // Calculate engagement based on completion rate, average attempts, and dropout rate
    const completionWeight = analytics.completion_rate * 0.4;
    const attemptsWeight = Math.min(analytics.average_attempts * 20, 40); // Cap at 40
    const dropoutPenalty = analytics.dropout_rate * 0.3;

    return Math.max(0, Math.min(100, completionWeight + attemptsWeight - dropoutPenalty));
  }

  private async getWordDifficultyAnalysis(assignmentId: string): Promise<WordDifficultyData[]> {
    // Get word performance data from game sessions
    const { data: wordLogs, error } = await this.supabase
      .from('word_performance_logs')
      .select(`
        *,
        enhanced_game_sessions!inner(assignment_id)
      `)
      .eq('enhanced_game_sessions.assignment_id', assignmentId);

    if (error) {
      console.error('Failed to get word performance logs:', error);
      return [];
    }

    // Group by word and calculate metrics
    const wordGroups = wordLogs.reduce((groups: any, log: any) => {
      const key = `${log.word_text}-${log.translation_text}`;
      if (!groups[key]) {
        groups[key] = {
          word: log.word_text,
          translation: log.translation_text,
          attempts: [],
          errors: 0,
          students: new Set()
        };
      }

      groups[key].attempts.push(log.response_time_ms);
      groups[key].students.add(log.enhanced_game_sessions.student_id);
      if (!log.was_correct) {
        groups[key].errors++;
      }

      return groups;
    }, {});

    // Convert to WordDifficultyData array
    return Object.values(wordGroups).map((group: any) => ({
      word: group.word,
      translation: group.translation,
      error_rate: (group.errors / group.attempts.length) * 100,
      average_response_time: group.attempts.reduce((sum: number, time: number) => sum + time, 0) / group.attempts.length,
      students_struggling: Math.round(group.errors * 0.7), // Estimate
      common_mistakes: [] // Would need more detailed error tracking
    }));
  }
}

// Default export for convenience
export default EnhancedAssignmentService;
