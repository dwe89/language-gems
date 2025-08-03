import { createClient } from '@supabase/supabase-js';
import { assessmentSkillTrackingService, type ReadingSkillMetrics } from './assessmentSkillTrackingService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AQATopicAssessmentDefinition {
  id: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  theme: string;
  topic: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AQATopicQuestionDefinition {
  id: string;
  assessment_id: string;
  question_number: number;
  question_type: string;
  title: string;
  instructions: string;
  reading_text?: string;
  marks: number;
  theme: string;
  topic: string;
  difficulty_rating: number;
  question_data: any;
  created_at: string;
  updated_at: string;
}

export class AQATopicAssessmentService {
  /**
   * Get all topic assessments by filters
   */
  async getAssessmentsByFilters(
    level: 'foundation' | 'higher',
    language: string,
    theme: string,
    topic: string
  ): Promise<AQATopicAssessmentDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('level', level)
        .eq('language', language)
        .eq('theme', theme)
        .eq('topic', topic)
        .eq('is_active', true)
        .order('identifier', { ascending: true });

      if (error) {
        console.error('Error fetching topic assessments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsByFilters:', error);
      return [];
    }
  }

  /**
   * Get a specific topic assessment by ID
   */
  async getAssessmentById(id: string): Promise<AQATopicAssessmentDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching topic assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessmentById:', error);
      return null;
    }
  }

  /**
   * Get questions for a specific topic assessment
   */
  async getQuestionsByAssessmentId(assessmentId: string): Promise<AQATopicQuestionDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('question_number', { ascending: true });

      if (error) {
        console.error('Error fetching topic questions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestionsByAssessmentId:', error);
      return [];
    }
  }

  /**
   * Get assessment by language, level, theme, topic, and identifier
   */
  async getAssessmentByIdentifier(
    language: string,
    level: 'foundation' | 'higher',
    theme: string,
    topic: string,
    identifier: string
  ): Promise<AQATopicAssessmentDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('language', language)
        .eq('level', level)
        .eq('theme', theme)
        .eq('topic', topic)
        .eq('identifier', identifier)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching topic assessment by identifier:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessmentByIdentifier:', error);
      return null;
    }
  }

  /**
   * Get all assessments for a specific theme
   */
  async getAssessmentsByTheme(
    level: 'foundation' | 'higher',
    language: string,
    theme: string
  ): Promise<AQATopicAssessmentDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('level', level)
        .eq('language', language)
        .eq('theme', theme)
        .eq('is_active', true)
        .order('topic', { ascending: true })
        .order('identifier', { ascending: true });

      if (error) {
        console.error('Error fetching assessments by theme:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsByTheme:', error);
      return [];
    }
  }

  /**
   * Get all available topics for a theme
   */
  async getTopicsForTheme(
    level: 'foundation' | 'higher',
    language: string,
    theme: string
  ): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('topic')
        .eq('level', level)
        .eq('language', language)
        .eq('theme', theme)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching topics for theme:', error);
        return [];
      }

      // Get unique topics
      const topics = [...new Set(data?.map(item => item.topic) || [])];
      return topics.sort();
    } catch (error) {
      console.error('Error in getTopicsForTheme:', error);
      return [];
    }
  }

  /**
   * Create a new topic assessment
   */
  async createAssessment(assessment: Omit<AQATopicAssessmentDefinition, 'id' | 'created_at' | 'updated_at'>): Promise<AQATopicAssessmentDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .insert([assessment])
        .select()
        .single();

      if (error) {
        console.error('Error creating topic assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createAssessment:', error);
      return null;
    }
  }

  /**
   * Create questions for a topic assessment
   */
  async createQuestions(questions: Omit<AQATopicQuestionDefinition, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('aqa_topic_questions')
        .insert(questions);

      if (error) {
        console.error('Error creating topic questions:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createQuestions:', error);
      return false;
    }
  }
}
