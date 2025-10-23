import { SupabaseClient } from '@supabase/supabase-js';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface VocabularyTest {
  id: string;
  title: string;
  description?: string;
  teacher_id: string;
  language: string;
  curriculum_level: 'KS3' | 'KS4';
  test_type: 'translation_to_english' | 'translation_to_target' | 'multiple_choice' | 'spelling_audio' | 'mixed';
  vocabulary_source: 'category' | 'custom_list' | 'assignment_vocabulary';
  vocabulary_criteria: any;
  word_count: number;
  time_limit_minutes: number;
  max_attempts: number;
  randomize_questions: boolean;
  show_immediate_feedback: boolean;
  allow_hints: boolean;
  passing_score_percentage: number;
  points_per_question: number;
  time_bonus_enabled: boolean;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface VocabularyTestQuestion {
  id: string;
  test_id: string;
  vocabulary_id: string;
  question_number: number;
  question_type: 'translation_to_english' | 'translation_to_target' | 'multiple_choice' | 'spelling_audio';
  question_text: string;
  correct_answer: string;
  options?: string[];
  audio_url?: string;
  audio_speed?: 'normal' | 'slow';
  difficulty_level: string;
  theme?: string;
  topic?: string;
}

export interface VocabularyTestResult {
  id: string;
  test_id: string;
  assignment_id?: string;
  student_id: string;
  attempt_number: number;
  start_time: string;
  completion_time?: string;
  total_time_seconds: number;
  raw_score: number;
  total_possible_score: number;
  percentage_score: number;
  passed: boolean;
  questions_correct: number;
  questions_incorrect: number;
  questions_skipped: number;
  hints_used: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  responses: VocabularyTestResponse[];
  performance_by_question_type: any;
  performance_by_theme: any;
  performance_by_topic: any;
  error_analysis: any;
}

export interface VocabularyTestResponse {
  question_id: string;
  question_number: number;
  question_type: string;
  student_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points_awarded: number;
  time_spent_seconds: number;
  hint_used: boolean;
  error_type?: 'spelling' | 'translation' | 'gender' | 'accent' | 'other';
  error_details?: any;
}

export interface VocabularyTestAnalytics {
  id: string;
  test_id: string;
  assignment_id?: string;
  teacher_id: string;
  class_id?: string;
  total_students: number;
  students_completed: number;
  students_passed: number;
  average_score: number;
  average_time_seconds: number;
  problem_words: ProblemWord[];
  mastery_words: MasteryWord[];
  common_errors: any;
  score_distribution: any;
  time_distribution: any;
  remediation_suggestions: RemediationSuggestion[];
}

export interface ProblemWord {
  vocabulary_id: string;
  word: string;
  translation: string;
  success_rate: number;
  total_attempts: number;
  common_errors: string[];
  theme?: string;
  topic?: string;
}

export interface MasteryWord {
  vocabulary_id: string;
  word: string;
  translation: string;
  success_rate: number;
  total_attempts: number;
  theme?: string;
  topic?: string;
}

export interface RemediationSuggestion {
  type: 'vocabulary_practice' | 'grammar_review' | 'pronunciation_practice' | 'spelling_drill';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affected_students: number;
  vocabulary_ids?: string[];
  recommended_games?: string[];
}

export interface TestCreationData {
  title: string;
  description?: string;
  language: string;
  curriculum_level: 'KS3' | 'KS4';
  test_type: 'translation_to_english' | 'translation_to_target' | 'multiple_choice' | 'spelling_audio' | 'mixed';
  vocabulary_source: 'category' | 'custom_list' | 'assignment_vocabulary';
  vocabulary_criteria: any;
  word_count: number;
  time_limit_minutes?: number;
  max_attempts?: number;
  randomize_questions?: boolean;
  show_immediate_feedback?: boolean;
  allow_hints?: boolean;
  passing_score_percentage?: number;
  points_per_question?: number;
  time_bonus_enabled?: boolean;
}

// =====================================================
// VOCABULARY TEST SERVICE
// =====================================================

export class VocabularyTestService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  // =====================================================
  // TEST CREATION AND MANAGEMENT
  // =====================================================

  /**
   * Create a new vocabulary test
   */
  async createTest(teacherId: string, testData: TestCreationData): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary_tests')
        .insert({
          ...testData,
          teacher_id: teacherId,
          status: 'draft'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating vocabulary test:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Test data being inserted:', JSON.stringify({
          ...testData,
          teacher_id: teacherId,
          status: 'draft'
        }, null, 2));
        return null;
      }

      // Generate questions for the test
      await this.generateTestQuestions(data.id, testData);

      return data.id;
    } catch (error) {
      console.error('Error in createTest:', error);
      return null;
    }
  }

  /**
   * Generate questions for a vocabulary test
   */
  async generateTestQuestions(testId: string, testData: TestCreationData): Promise<boolean> {
    try {
      // Get vocabulary based on criteria
      const vocabulary = await this.getVocabularyForTest(testData);
      
      if (!vocabulary || vocabulary.length === 0) {
        console.error('No vocabulary found for test criteria');
        return false;
      }

      // Shuffle and limit vocabulary
      const shuffledVocab = testData.randomize_questions 
        ? vocabulary.sort(() => Math.random() - 0.5)
        : vocabulary;
      
      const selectedVocab = shuffledVocab.slice(0, testData.word_count);

      // Generate questions
      const questions: Partial<VocabularyTestQuestion>[] = [];
      
      for (let i = 0; i < selectedVocab.length; i++) {
        const vocab = selectedVocab[i];
        const questionType = this.determineQuestionType(testData.test_type, i);
        
        const question = await this.createQuestion(
          testId,
          vocab,
          i + 1,
          questionType,
          testData
        );
        
        if (question) {
          questions.push(question);
        }
      }

      // Insert questions into database
      const { error } = await this.supabase
        .from('vocabulary_test_questions')
        .insert(questions);

      if (error) {
        console.error('Error inserting test questions:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error generating test questions:', error);
      return false;
    }
  }

  /**
   * Get vocabulary for test based on criteria
   */
  private async getVocabularyForTest(testData: TestCreationData): Promise<any[]> {
    // Handle custom vocabulary (stored directly in vocabulary_criteria)
    if (testData.vocabulary_source === 'custom_list' && testData.vocabulary_criteria.custom_vocabulary) {
      console.log('Using custom vocabulary from vocabulary_criteria:', testData.vocabulary_criteria.custom_vocabulary);
      return testData.vocabulary_criteria.custom_vocabulary;
    }

    let query = this.supabase
      .from('centralized_vocabulary')
      .select('*')
      .eq('language', testData.language);

    // Apply vocabulary selection criteria
    switch (testData.vocabulary_source) {
      case 'category':
        if (testData.vocabulary_criteria.category) {
          query = query.eq('category', testData.vocabulary_criteria.category);
        }
        if (testData.vocabulary_criteria.subcategory) {
          query = query.eq('subcategory', testData.vocabulary_criteria.subcategory);
        }
        break;

      case 'custom_list':
        if (testData.vocabulary_criteria.list_id) {
          // Query custom vocabulary list from database
          const { data: listItems } = await this.supabase
            .from('vocabulary_items')
            .select('*')
            .eq('list_id', testData.vocabulary_criteria.list_id);
          return listItems || [];
        }
        break;

      case 'assignment_vocabulary':
        if (testData.vocabulary_criteria.assignment_id) {
          // Get vocabulary from existing assignment
          // This would integrate with your existing assignment vocabulary system
        }
        break;
    }

    // Apply curriculum level filter if available
    if (testData.curriculum_level === 'KS4') {
      query = query.eq('curriculum_level', 'KS4');
    }

    const { data, error } = await query.limit(testData.word_count * 2); // Get extra for randomization

    if (error) {
      console.error('Error fetching vocabulary:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Determine question type for mixed tests
   */
  private determineQuestionType(
    testType: string, 
    questionIndex: number
  ): 'translation_to_english' | 'translation_to_target' | 'multiple_choice' | 'spelling_audio' {
    if (testType !== 'mixed') {
      return testType as any;
    }

    // For mixed tests, distribute question types evenly
    const types = ['translation_to_english', 'translation_to_target', 'multiple_choice', 'spelling_audio'];
    return types[questionIndex % types.length] as any;
  }

  /**
   * Create individual question
   */
  private async createQuestion(
    testId: string,
    vocabulary: any,
    questionNumber: number,
    questionType: string,
    testData: TestCreationData
  ): Promise<Partial<VocabularyTestQuestion> | null> {
    try {
      const baseQuestion = {
        test_id: testId,
        vocabulary_id: vocabulary.id,
        question_number: questionNumber,
        question_type: questionType,
        difficulty_level: vocabulary.difficulty_level || 'intermediate',
        theme: vocabulary.theme,
        topic: vocabulary.topic
      };

      switch (questionType) {
        case 'translation_to_english':
          return {
            ...baseQuestion,
            question_text: `Translate to English: ${vocabulary.word}`,
            correct_answer: vocabulary.translation
          };

        case 'translation_to_target':
          return {
            ...baseQuestion,
            question_text: `Translate to ${testData.language}: ${vocabulary.translation}`,
            correct_answer: vocabulary.word
          };

        case 'multiple_choice':
          const options = await this.generateMultipleChoiceOptions(vocabulary, testData.language);
          return {
            ...baseQuestion,
            question_text: `What does "${vocabulary.word}" mean?`,
            correct_answer: vocabulary.translation,
            options
          };

        case 'spelling_audio':
          return {
            ...baseQuestion,
            question_text: `Listen and type what you hear:`,
            correct_answer: vocabulary.word,
            audio_url: vocabulary.audio_url,
            audio_speed: 'normal'
          };

        default:
          return null;
      }
    } catch (error) {
      console.error('Error creating question:', error);
      return null;
    }
  }

  /**
   * Generate multiple choice options
   */
  private async generateMultipleChoiceOptions(vocabulary: any, language: string): Promise<string[]> {
    // Get 3 random incorrect options from same category/theme
    const { data: distractors } = await this.supabase
      .from('centralized_vocabulary')
      .select('translation')
      .eq('language', language)
      .neq('id', vocabulary.id)
      .limit(3);

    const options = [vocabulary.translation];
    
    if (distractors && distractors.length >= 3) {
      options.push(...distractors.slice(0, 3).map(d => d.translation));
    } else {
      // Fallback options if not enough distractors
      options.push('Option B', 'Option C', 'Option D');
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  }

  // =====================================================
  // TEST RETRIEVAL
  // =====================================================

  /**
   * Get tests by teacher
   */
  async getTestsByTeacher(teacherId: string): Promise<VocabularyTest[]> {
    const { data, error } = await this.supabase
      .from('vocabulary_tests')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tests:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get test by ID with questions
   */
  async getTestWithQuestions(testId: string): Promise<{ test: VocabularyTest; questions: VocabularyTestQuestion[] } | null> {
    const [testResult, questionsResult] = await Promise.all([
      this.supabase.from('vocabulary_tests').select('*').eq('id', testId).single(),
      this.supabase.from('vocabulary_test_questions').select('*').eq('test_id', testId).order('question_number')
    ]);

    if (testResult.error || questionsResult.error) {
      console.error('Error fetching test:', testResult.error || questionsResult.error);
      return null;
    }

    return {
      test: testResult.data,
      questions: questionsResult.data || []
    };
  }

  // =====================================================
  // TEST TAKING AND RESULTS
  // =====================================================

  /**
   * Get a test by ID
   */
  async getTestById(testId: string): Promise<VocabularyTest | null> {
    try {
      console.log('🔍 VocabularyTestService: Fetching test with ID:', testId);

      const { data, error } = await this.supabase
        .from('vocabulary_tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (error) {
        console.error('❌ Error fetching test:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return null;
      }

      console.log('✅ Test fetched successfully:', data?.title || 'Unknown title');
      return data;
    } catch (error) {
      console.error('❌ Exception in getTestById:', error);
      return null;
    }
  }

  /**
   * Get student's existing attempt for a test
   */
  async getStudentAttempt(testId: string, studentId: string): Promise<any | null> {
    try {
      console.log('🔍 Getting student attempt for test:', testId, 'student:', studentId);

      const { data, error } = await this.supabase
        .from('vocabulary_test_results')
        .select(`
          id,
          test_id,
          student_id,
          responses,
          raw_score,
          percentage_score,
          total_time_seconds,
          completion_time,
          start_time,
          status,
          attempt_number
        `)
        .eq('test_id', testId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Error fetching student attempt:', error);
        return null;
      }

      // If no data found, return null (this is normal for first attempt)
      if (!data || data.length === 0) {
        console.log('✅ No existing attempt found (first attempt)');
        return null;
      }

      const attempt = data[0];
      console.log('✅ Found existing attempt:', attempt.id, 'status:', attempt.status);

      // If attempt is not completed, also get the questions
      if (!attempt.completion_time || attempt.status === 'in_progress') {
        console.log('🔍 Fetching questions for incomplete attempt');
        const { data: questions, error: questionsError } = await this.supabase
          .from('vocabulary_test_questions')
          .select('*')
          .eq('test_id', testId)
          .order('question_number');

        if (questionsError) {
          console.error('❌ Error fetching questions:', questionsError);
          return attempt;
        }

        console.log('✅ Questions fetched:', questions?.length || 0);
        return {
          ...attempt,
          questions: questions || []
        };
      }

      return attempt;
    } catch (error) {
      console.error('❌ Exception in getStudentAttempt:', error);
      return null;
    }
  }

  /**
   * Start a test for a student
   */
  async startTest(testId: string, studentId: string): Promise<any | null> {
    try {
      // Get test details
      const test = await this.getTestById(testId);
      if (!test) {
        throw new Error('Test not found');
      }

      // Check if student has remaining attempts
      const { data: existingAttempts } = await this.supabase
        .from('vocabulary_test_results')
        .select('attempt_number')
        .eq('test_id', testId)
        .eq('student_id', studentId);

      const attemptCount = existingAttempts?.length || 0;
      const maxAttempts = test.settings?.max_attempts || 999;

      if (attemptCount >= maxAttempts) {
        throw new Error('Maximum attempts exceeded');
      }

      // Get test questions
      const { data: questions, error: questionsError } = await this.supabase
        .from('vocabulary_test_questions')
        .select('*')
        .eq('test_id', testId)
        .order('question_number');

      if (questionsError) {
        throw new Error('Failed to load test questions');
      }

      // Create new attempt
      const { data: attemptData, error: attemptError } = await this.supabase
        .from('vocabulary_test_results')
        .insert({
          test_id: testId,
          student_id: studentId,
          attempt_number: attemptCount + 1,
          total_possible_score: questions?.length || 0,
          start_time: new Date().toISOString(),
          responses: [],
          status: 'in_progress'
        })
        .select()
        .single();

      if (attemptError) {
        throw new Error('Failed to create test attempt');
      }

      return {
        ...attemptData,
        questions: questions || []
      };
    } catch (error) {
      console.error('Error in startTest:', error);
      return null;
    }
  }

  /**
   * Start a test attempt for a student
   */
  async startTestAttempt(testId: string, studentId: string, assignmentId?: string): Promise<string | null> {
    try {
      // Check if student has remaining attempts
      const { data: existingAttempts } = await this.supabase
        .from('vocabulary_test_results')
        .select('attempt_number')
        .eq('test_id', testId)
        .eq('student_id', studentId)
        .order('attempt_number', { ascending: false })
        .limit(1);

      const nextAttemptNumber = existingAttempts && existingAttempts.length > 0
        ? existingAttempts[0].attempt_number + 1
        : 1;

      // Get test to check max attempts
      const { data: test } = await this.supabase
        .from('vocabulary_tests')
        .select('max_attempts, word_count, points_per_question')
        .eq('id', testId)
        .single();

      if (!test) {
        console.error('Test not found');
        return null;
      }

      if (nextAttemptNumber > test.max_attempts) {
        console.error('Maximum attempts exceeded');
        return null;
      }

      // Create test result record
      const { data, error } = await this.supabase
        .from('vocabulary_test_results')
        .insert({
          test_id: testId,
          assignment_id: assignmentId,
          student_id: studentId,
          attempt_number: nextAttemptNumber,
          start_time: new Date().toISOString(),
          total_possible_score: test.word_count * test.points_per_question,
          status: 'in_progress'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error starting test attempt:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in startTestAttempt:', error);
      return null;
    }
  }

  /**
   * Submit test results (simple version for student interface)
   */
  async submitTestResults(
    attemptId: string,
    answers: Record<string, string>,
    timeSpent: number
  ): Promise<any> {
    try {
      // Get the attempt and test details
      const { data: attempt, error: attemptError } = await this.supabase
        .from('vocabulary_test_results')
        .select(`
          *,
          vocabulary_tests (*)
        `)
        .eq('id', attemptId)
        .single();

      if (attemptError || !attempt) {
        throw new Error('Test attempt not found');
      }

      // Get test questions
      const { data: questions, error: questionsError } = await this.supabase
        .from('vocabulary_test_questions')
        .select('*')
        .eq('test_id', attempt.test_id)
        .order('question_number');

      if (questionsError || !questions) {
        throw new Error('Test questions not found');
      }

      // Calculate score
      let correctAnswers = 0;
      const totalQuestions = questions.length;

      questions.forEach(question => {
        const studentAnswer = answers[question.id]?.trim().toLowerCase() || '';
        const correctAnswer = question.correct_answer.trim().toLowerCase();

        if (studentAnswer === correctAnswer) {
          correctAnswers++;
        }
      });

      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const score = correctAnswers * 5; // 5 points per correct answer

      // Update the attempt with correct column names
      const { error: updateError } = await this.supabase
        .from('vocabulary_test_results')
        .update({
          responses: answers,
          raw_score: score,
          percentage_score: accuracy,
          questions_correct: correctAnswers,
          questions_incorrect: totalQuestions - correctAnswers,
          total_time_seconds: timeSpent,
          completion_time: new Date().toISOString(),
          status: 'completed',
          submission_date: new Date().toISOString()
        })
        .eq('id', attemptId);

      if (updateError) {
        console.error('Update error details:', updateError);
        throw new Error('Failed to update test results');
      }

      return {
        score,
        accuracy,
        questions_correct: correctAnswers,
        questions_incorrect: totalQuestions - correctAnswers,
        total_questions: totalQuestions,
        time_spent: timeSpent
      };
    } catch (error) {
      console.error('Error in submitTestResults:', error);
      throw error;
    }
  }

  /**
   * Submit test results (detailed version)
   */
  async submitDetailedTestResults(
    resultId: string,
    responses: VocabularyTestResponse[],
    totalTimeSeconds: number
  ): Promise<boolean> {
    try {
      // Calculate scores
      const questionsCorrect = responses.filter(r => r.is_correct).length;
      const questionsIncorrect = responses.filter(r => !r.is_correct).length;
      const questionsSkipped = responses.filter(r => !r.student_answer || r.student_answer.trim() === '').length;
      const hintsUsed = responses.filter(r => r.hint_used).length;
      const rawScore = responses.reduce((sum, r) => sum + r.points_awarded, 0);

      // Get test details for passing score
      const { data: result } = await this.supabase
        .from('vocabulary_test_results')
        .select('test_id, total_possible_score')
        .eq('id', resultId)
        .single();

      if (!result) {
        console.error('Test result not found');
        return false;
      }

      const { data: test } = await this.supabase
        .from('vocabulary_tests')
        .select('passing_score_percentage')
        .eq('id', result.test_id)
        .single();

      if (!test) {
        console.error('Test not found');
        return false;
      }

      const percentageScore = (rawScore / result.total_possible_score) * 100;
      const passed = percentageScore >= test.passing_score_percentage;

      // Analyze performance
      const performanceAnalysis = this.analyzeTestPerformance(responses);

      // Update test result
      const { error } = await this.supabase
        .from('vocabulary_test_results')
        .update({
          completion_time: new Date().toISOString(),
          total_time_seconds: totalTimeSeconds,
          raw_score: rawScore,
          percentage_score: percentageScore,
          passed,
          questions_correct: questionsCorrect,
          questions_incorrect: questionsIncorrect,
          questions_skipped: questionsSkipped,
          hints_used: hintsUsed,
          status: 'completed',
          responses,
          performance_by_question_type: performanceAnalysis.byQuestionType,
          performance_by_theme: performanceAnalysis.byTheme,
          performance_by_topic: performanceAnalysis.byTopic,
          error_analysis: performanceAnalysis.errorAnalysis
        })
        .eq('id', resultId);

      if (error) {
        console.error('Error submitting test results:', error);
        return false;
      }

      // Update analytics asynchronously
      this.updateTestAnalytics(result.test_id);

      return true;
    } catch (error) {
      console.error('Error in submitTestResults:', error);
      return false;
    }
  }

  /**
   * Analyze test performance
   */
  private analyzeTestPerformance(responses: VocabularyTestResponse[]): {
    byQuestionType: any;
    byTheme: any;
    byTopic: any;
    errorAnalysis: any;
  } {
    const byQuestionType: any = {};
    const byTheme: any = {};
    const byTopic: any = {};
    const errorAnalysis: any = {};

    responses.forEach(response => {
      // Performance by question type
      if (!byQuestionType[response.question_type]) {
        byQuestionType[response.question_type] = { correct: 0, total: 0 };
      }
      byQuestionType[response.question_type].total++;
      if (response.is_correct) {
        byQuestionType[response.question_type].correct++;
      }

      // Error analysis
      if (!response.is_correct && response.error_type) {
        if (!errorAnalysis[response.error_type]) {
          errorAnalysis[response.error_type] = [];
        }
        errorAnalysis[response.error_type].push({
          question_id: response.question_id,
          student_answer: response.student_answer,
          correct_answer: response.correct_answer,
          details: response.error_details
        });
      }
    });

    return { byQuestionType, byTheme, byTopic, errorAnalysis };
  }

  /**
   * Update test analytics (called after test submission)
   */
  private async updateTestAnalytics(testId: string): Promise<void> {
    try {
      // This would be implemented to aggregate all results for the test
      // and update the vocabulary_test_analytics table
      console.log('Updating analytics for test:', testId);
      // Implementation would calculate:
      // - Class averages
      // - Problem words identification
      // - Common error patterns
      // - Remediation suggestions
    } catch (error) {
      console.error('Error updating test analytics:', error);
    }
  }

  /**
   * Get student test results
   */
  async getStudentResults(testId: string, studentId: string): Promise<VocabularyTestResult[]> {
    const { data, error } = await this.supabase
      .from('vocabulary_test_results')
      .select('*')
      .eq('test_id', testId)
      .eq('student_id', studentId)
      .order('attempt_number', { ascending: false });

    if (error) {
      console.error('Error fetching student results:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get test analytics for teacher
   */
  async getTestAnalytics(testId: string): Promise<VocabularyTestAnalytics | null> {
    const { data, error } = await this.supabase
      .from('vocabulary_test_analytics')
      .select('*')
      .eq('test_id', testId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows

    if (error) {
      console.error('Error fetching test analytics:', error);
      return null;
    }

    // If no analytics exist yet, return null (not an error)
    return data;
  }

  /**
   * Get all tests by teacher
   */
  async getTestsByTeacher(teacherId: string): Promise<VocabularyTest[]> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary_tests')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tests by teacher:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching tests by teacher:', error);
      return [];
    }
  }

  // =====================================================
  // ASSIGNMENT INTEGRATION
  // =====================================================

  /**
   * Create test assignment for class
   */
  async createTestAssignment(
    testId: string,
    teacherId: string,
    classId: string,
    assignmentData: {
      due_date?: string;
      custom_instructions?: string;
      custom_time_limit?: number;
      custom_max_attempts?: number;
      custom_passing_score?: number;
    }
  ): Promise<string | null> {
    try {
      // First create the main assignment record
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .insert({
          title: `Vocabulary Test Assignment`,
          description: assignmentData.custom_instructions,
          teacher_id: teacherId,
          class_id: classId,
          game_type: 'vocabulary_test',
          due_date: assignmentData.due_date,
          status: 'active',
          game_config: {
            test_id: testId,
            custom_settings: {
              time_limit: assignmentData.custom_time_limit,
              max_attempts: assignmentData.custom_max_attempts,
              passing_score: assignmentData.custom_passing_score
            }
          }
        })
        .select('id')
        .single();

      if (assignmentError) {
        console.error('Error creating assignment:', assignmentError);
        return null;
      }

      // Create vocabulary test assignment record
      const { data, error } = await this.supabase
        .from('vocabulary_test_assignments')
        .insert({
          test_id: testId,
          assignment_id: assignment.id,
          teacher_id: teacherId,
          class_id: classId,
          due_date: assignmentData.due_date,
          custom_instructions: assignmentData.custom_instructions,
          custom_time_limit: assignmentData.custom_time_limit,
          custom_max_attempts: assignmentData.custom_max_attempts,
          custom_passing_score: assignmentData.custom_passing_score,
          status: 'assigned'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating test assignment:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in createTestAssignment:', error);
      return null;
    }
  }
}
