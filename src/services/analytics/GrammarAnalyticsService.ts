/**
 * Grammar Analytics Service
 * 
 * Comprehensive analytics service for Grammar Gems system.
 * Processes conjugation data to generate insights about student performance
 * across tenses, pronouns, verb types, and common mistakes.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

export interface GrammarPerformanceOverview {
  studentId: string;
  language: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  attemptsThisWeek: number;
  attemptsToday: number;
  avgResponseTime: number;
  avgComplexity: number;
  lastPracticeAt: string | null;
  firstPracticeAt: string | null;
}

export interface TensePerformance {
  tense: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  avgResponseTime: number;
  lastPracticed: string | null;
}

export interface VerbTypePerformance {
  verbType: 'regular' | 'irregular' | 'stem_changing';
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  avgResponseTime: number;
  avgComplexity: number;
}

export interface ConjugationMatrixData {
  tense: string;
  person: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  lastAttempt: string | null;
  needsPractice: boolean;
}

export interface GrammarWeakness {
  areaType: 'tense' | 'verb_type';
  areaName: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  needsPractice: boolean;
}

export interface CommonMistake {
  baseVerb: string;
  tense: string;
  person: string;
  expectedAnswer: string;
  commonWrongAnswer: string;
  mistakeCount: number;
  lastMistakeAt: string;
}

export interface GrammarGemsAnalytics {
  totalGrammarGems: number;
  grammarGemsToday: number;
  grammarGemsThisWeek: number;
  totalGrammarXP: number;
  grammarXPToday: number;
  grammarXPThisWeek: number;
  avgResponseTime: number;
  avgStreak: number;
  lastGrammarGemAt: string | null;
}

export interface GrammarInsights {
  overview: GrammarPerformanceOverview;
  tensePerformance: TensePerformance[];
  verbTypePerformance: VerbTypePerformance[];
  conjugationMatrix: ConjugationMatrixData[];
  weaknesses: GrammarWeakness[];
  commonMistakes: CommonMistake[];
  gemsAnalytics: GrammarGemsAnalytics;
  recommendations: string[];
}

export class GrammarAnalyticsService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  /**
   * Get comprehensive grammar analytics for a student
   */
  async getStudentGrammarAnalytics(
    studentId: string,
    language: string = 'es'
  ): Promise<GrammarInsights> {
    try {
      const [
        overview,
        tensePerformance,
        verbTypePerformance,
        conjugationMatrix,
        weaknesses,
        commonMistakes,
        gemsAnalytics
      ] = await Promise.all([
        this.getGrammarOverview(studentId, language),
        this.getTensePerformance(studentId, language),
        this.getVerbTypePerformance(studentId, language),
        this.getConjugationMatrix(studentId, language),
        this.getGrammarWeaknesses(studentId, language),
        this.getCommonMistakes(studentId, language),
        this.getGrammarGemsAnalytics(studentId)
      ]);

      const recommendations = this.generateRecommendations(
        overview,
        weaknesses,
        commonMistakes
      );

      return {
        overview,
        tensePerformance,
        verbTypePerformance,
        conjugationMatrix,
        weaknesses,
        commonMistakes,
        gemsAnalytics,
        recommendations
      };
    } catch (error) {
      console.error('Error getting student grammar analytics:', error);
      throw error;
    }
  }

  /**
   * Get grammar performance overview
   */
  async getGrammarOverview(
    studentId: string,
    language: string
  ): Promise<GrammarPerformanceOverview> {
    const { data, error } = await this.supabase
      .from('student_grammar_analytics')
      .select('*')
      .eq('student_id', studentId)
      .eq('language', language)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found is OK
      throw error;
    }

    if (!data) {
      // Return default values if no data found
      return {
        studentId,
        language,
        totalAttempts: 0,
        correctAttempts: 0,
        accuracyPercentage: 0,
        attemptsThisWeek: 0,
        attemptsToday: 0,
        avgResponseTime: 0,
        avgComplexity: 0,
        lastPracticeAt: null,
        firstPracticeAt: null
      };
    }

    return {
      studentId: data.student_id,
      language: data.language,
      totalAttempts: data.total_attempts,
      correctAttempts: data.correct_attempts,
      accuracyPercentage: data.accuracy_percentage,
      attemptsThisWeek: data.attempts_this_week,
      attemptsToday: data.attempts_today,
      avgResponseTime: data.avg_response_time,
      avgComplexity: data.avg_complexity,
      lastPracticeAt: data.last_practice_at,
      firstPracticeAt: data.first_practice_at
    };
  }

  /**
   * Get performance breakdown by tense
   */
  async getTensePerformance(
    studentId: string,
    language: string
  ): Promise<TensePerformance[]> {
    const { data, error } = await this.supabase
      .from('conjugations')
      .select(`
        tense,
        is_correct,
        response_time_ms,
        created_at
      `)
      .eq('student_id', studentId)
      .eq('language', language)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group by tense and calculate metrics
    const tenseGroups = data.reduce((acc, attempt) => {
      const tense = attempt.tense;
      if (!acc[tense]) {
        acc[tense] = {
          attempts: [],
          responseTimes: []
        };
      }
      acc[tense].attempts.push(attempt.is_correct);
      if (attempt.response_time_ms) {
        acc[tense].responseTimes.push(attempt.response_time_ms);
      }
      return acc;
    }, {} as Record<string, { attempts: boolean[]; responseTimes: number[] }>);

    return Object.entries(tenseGroups).map(([tense, group]) => {
      const totalAttempts = group.attempts.length;
      const correctAttempts = group.attempts.filter(Boolean).length;
      const avgResponseTime = group.responseTimes.length > 0
        ? group.responseTimes.reduce((sum, time) => sum + time, 0) / group.responseTimes.length
        : 0;

      // Get last practice date for this tense
      const tenseAttempts = data.filter(a => a.tense === tense);
      const lastPracticed = tenseAttempts.length > 0
        ? tenseAttempts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
        : null;

      return {
        tense,
        totalAttempts,
        correctAttempts,
        accuracyPercentage: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
        avgResponseTime: Math.round(avgResponseTime),
        lastPracticed
      };
    }).sort((a, b) => b.totalAttempts - a.totalAttempts);
  }

  /**
   * Get performance breakdown by verb type
   */
  async getVerbTypePerformance(
    studentId: string,
    language: string
  ): Promise<VerbTypePerformance[]> {
    const { data, error } = await this.supabase
      .from('conjugations')
      .select(`
        verb_type,
        is_correct,
        response_time_ms,
        complexity_score
      `)
      .eq('student_id', studentId)
      .eq('language', language)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group by verb type
    const verbTypeGroups = data.reduce((acc, attempt) => {
      const verbType = attempt.verb_type as 'regular' | 'irregular' | 'stem_changing';
      if (!acc[verbType]) {
        acc[verbType] = {
          attempts: [],
          responseTimes: [],
          complexityScores: []
        };
      }
      acc[verbType].attempts.push(attempt.is_correct);
      if (attempt.response_time_ms) {
        acc[verbType].responseTimes.push(attempt.response_time_ms);
      }
      if (attempt.complexity_score) {
        acc[verbType].complexityScores.push(attempt.complexity_score);
      }
      return acc;
    }, {} as Record<string, { attempts: boolean[]; responseTimes: number[]; complexityScores: number[] }>);

    return Object.entries(verbTypeGroups).map(([verbType, group]) => {
      const totalAttempts = group.attempts.length;
      const correctAttempts = group.attempts.filter(Boolean).length;
      const avgResponseTime = group.responseTimes.length > 0
        ? group.responseTimes.reduce((sum, time) => sum + time, 0) / group.responseTimes.length
        : 0;
      const avgComplexity = group.complexityScores.length > 0
        ? group.complexityScores.reduce((sum, score) => sum + score, 0) / group.complexityScores.length
        : 0;

      return {
        verbType: verbType as 'regular' | 'irregular' | 'stem_changing',
        totalAttempts,
        correctAttempts,
        accuracyPercentage: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
        avgResponseTime: Math.round(avgResponseTime),
        avgComplexity: Math.round(avgComplexity * 10) / 10
      };
    }).sort((a, b) => b.totalAttempts - a.totalAttempts);
  }

  /**
   * Get conjugation matrix data (tense x person performance)
   */
  async getConjugationMatrix(
    studentId: string,
    language: string
  ): Promise<ConjugationMatrixData[]> {
    const { data, error } = await this.supabase
      .from('grammar_practice_attempts')
      .select(`
        tense,
        person,
        is_correct,
        created_at,
        grammar_verbs!inner(language)
      `)
      .eq('student_id', studentId)
      .eq('grammar_verbs.language', language)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group by tense and person combination
    const matrixGroups = data.reduce((acc, attempt) => {
      const key = `${attempt.tense}|${attempt.person}`;
      if (!acc[key]) {
        acc[key] = {
          tense: attempt.tense,
          person: attempt.person,
          attempts: [],
          lastAttempt: attempt.created_at
        };
      }
      acc[key].attempts.push(attempt.is_correct);
      // Keep the most recent attempt date
      if (new Date(attempt.created_at) > new Date(acc[key].lastAttempt)) {
        acc[key].lastAttempt = attempt.created_at;
      }
      return acc;
    }, {} as Record<string, { tense: string; person: string; attempts: boolean[]; lastAttempt: string }>);

    return Object.values(matrixGroups).map(group => {
      const totalAttempts = group.attempts.length;
      const correctAttempts = group.attempts.filter(Boolean).length;
      const accuracyPercentage = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

      return {
        tense: group.tense,
        person: group.person,
        totalAttempts,
        correctAttempts,
        accuracyPercentage,
        lastAttempt: group.lastAttempt,
        needsPractice: accuracyPercentage < 70 && totalAttempts >= 3
      };
    }).sort((a, b) => {
      // Sort by tense first, then by person
      if (a.tense !== b.tense) {
        return a.tense.localeCompare(b.tense);
      }
      return a.person.localeCompare(b.person);
    });
  }

  /**
   * Get grammar weaknesses using database function
   */
  async getGrammarWeaknesses(
    studentId: string,
    language: string,
    limit: number = 5
  ): Promise<GrammarWeakness[]> {
    const { data, error } = await this.supabase
      .rpc('get_student_grammar_weaknesses', {
        p_student_id: studentId,
        p_language: language,
        p_limit: limit
      });

    if (error) {
      console.error('Error getting grammar weaknesses:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get common mistakes using database function
   */
  async getCommonMistakes(
    studentId: string,
    language: string,
    limit: number = 10
  ): Promise<CommonMistake[]> {
    const { data, error } = await this.supabase
      .rpc('get_student_common_grammar_mistakes', {
        p_student_id: studentId,
        p_language: language,
        p_limit: limit
      });

    if (error) {
      console.error('Error getting common mistakes:', error);
      return [];
    }

    // Filter out any entries with undefined/null values
    const validMistakes = (data || []).filter((mistake: any) =>
      mistake.base_verb &&
      mistake.tense &&
      mistake.expected_answer &&
      mistake.common_wrong_answer &&
      mistake.base_verb !== 'undefined' &&
      mistake.expected_answer !== 'undefined' &&
      mistake.common_wrong_answer !== 'undefined'
    );

    return validMistakes;
  }

  /**
   * Get Grammar Gems analytics
   */
  async getGrammarGemsAnalytics(studentId: string): Promise<GrammarGemsAnalytics> {
    const { data, error } = await this.supabase
      .from('student_grammar_gems_analytics')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      return {
        totalGrammarGems: 0,
        grammarGemsToday: 0,
        grammarGemsThisWeek: 0,
        totalGrammarXP: 0,
        grammarXPToday: 0,
        grammarXPThisWeek: 0,
        avgResponseTime: 0,
        avgStreak: 0,
        lastGrammarGemAt: null
      };
    }

    return {
      totalGrammarGems: data.total_grammar_gems,
      grammarGemsToday: data.grammar_gems_today,
      grammarGemsThisWeek: data.grammar_gems_this_week,
      totalGrammarXP: data.total_grammar_xp,
      grammarXPToday: data.grammar_xp_today,
      grammarXPThisWeek: data.grammar_xp_this_week,
      avgResponseTime: data.avg_response_time,
      avgStreak: data.avg_streak,
      lastGrammarGemAt: data.last_grammar_gem_at
    };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    overview: GrammarPerformanceOverview,
    weaknesses: GrammarWeakness[],
    commonMistakes: CommonMistake[]
  ): string[] {
    const recommendations: string[] = [];

    // Overall performance recommendations
    if (overview.accuracyPercentage < 60) {
      recommendations.push("Focus on basic conjugation patterns before attempting complex tenses.");
    } else if (overview.accuracyPercentage < 80) {
      recommendations.push("Good progress! Practice more to improve consistency.");
    } else {
      recommendations.push("Excellent grammar skills! Try challenging yourself with advanced tenses.");
    }

    // Response time recommendations
    if (overview.avgResponseTime > 8000) {
      recommendations.push("Practice conjugations daily to improve your response speed.");
    }

    // Weakness-based recommendations
    weaknesses.forEach(weakness => {
      if (weakness.areaType === 'tense') {
        recommendations.push(`Focus on ${weakness.areaName} tense - practice with regular verbs first.`);
      } else if (weakness.areaType === 'verb_type') {
        recommendations.push(`Work on ${weakness.areaName} verbs - they need more attention.`);
      }
    });

    // Common mistake recommendations
    if (commonMistakes.length > 0) {
      const topMistake = commonMistakes[0];
      if (topMistake.baseVerb && topMistake.tense && topMistake.expectedAnswer && topMistake.commonWrongAnswer) {
        recommendations.push(`Review ${topMistake.baseVerb} in ${topMistake.tense} tense - you often confuse "${topMistake.expectedAnswer}" with "${topMistake.commonWrongAnswer}".`);
      }
    }

    // Practice frequency recommendations
    if (overview.attemptsThisWeek < 10) {
      recommendations.push("Try to practice conjugations at least 10 times per week for better retention.");
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }
}