export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aqa_reading_results: {
        Row: {
          assessment_id: string
          assignment_id: string | null
          attempt_number: number
          completion_time: string | null
          created_at: string | null
          gcse_grade: number | null
          id: string
          percentage_score: number
          performance_by_question_type: Json | null
          performance_by_theme: Json | null
          performance_by_topic: Json | null
          raw_score: number
          responses: Json
          start_time: string
          status: string
          student_id: string
          submission_date: string | null
          total_possible_score: number
          total_time_seconds: number
          updated_at: string | null
        }
        Insert: {
          assessment_id: string
          assignment_id?: string | null
          attempt_number?: number
          completion_time?: string | null
          created_at?: string | null
          gcse_grade?: number | null
          id?: string
          percentage_score?: number
          performance_by_question_type?: Json | null
          performance_by_theme?: Json | null
          performance_by_topic?: Json | null
          raw_score?: number
          responses?: Json
          start_time: string
          status?: string
          student_id: string
          submission_date?: string | null
          total_possible_score?: number
          total_time_seconds: number
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string
          assignment_id?: string | null
          attempt_number?: number
          completion_time?: string | null
          created_at?: string | null
          gcse_grade?: number | null
          id?: string
          percentage_score?: number
          performance_by_question_type?: Json | null
          performance_by_theme?: Json | null
          performance_by_topic?: Json | null
          raw_score?: number
          responses?: Json
          start_time?: string
          status?: string
          student_id?: string
          submission_date?: string | null
          total_possible_score?: number
          total_time_seconds?: number
          updated_at?: string | null
        }
      }
      aqa_listening_results: {
        Row: {
          assessment_id: string
          assignment_id: string | null
          attempt_number: number
          audio_play_counts: Json | null
          completion_time: string | null
          created_at: string | null
          gcse_grade: number | null
          id: string
          percentage_score: number
          performance_by_question_type: Json | null
          performance_by_theme: Json | null
          performance_by_topic: Json | null
          raw_score: number
          responses: Json
          start_time: string
          status: string
          student_id: string
          submission_date: string | null
          total_possible_score: number
          total_time_seconds: number
          updated_at: string | null
        }
        Insert: {
          assessment_id: string
          assignment_id?: string | null
          attempt_number?: number
          audio_play_counts?: Json | null
          completion_time?: string | null
          created_at?: string | null
          gcse_grade?: number | null
          id?: string
          percentage_score?: number
          performance_by_question_type?: Json | null
          performance_by_theme?: Json | null
          performance_by_topic?: Json | null
          raw_score?: number
          responses?: Json
          start_time: string
          status?: string
          student_id: string
          submission_date?: string | null
          total_possible_score?: number
          total_time_seconds: number
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string
          assignment_id?: string | null
          attempt_number?: number
          audio_play_counts?: Json | null
          completion_time?: string | null
          created_at?: string | null
          gcse_grade?: number | null
          id?: string
          percentage_score?: number
          performance_by_question_type?: Json | null
          performance_by_theme?: Json | null
          performance_by_topic?: Json | null
          raw_score?: number
          responses?: Json
          start_time?: string
          status?: string
          student_id?: string
          submission_date?: string | null
          total_possible_score?: number
          total_time_seconds?: number
          updated_at?: string | null
        }
      }
      aqa_writing_results: {
        Row: {
          assessment_id: string
          assignment_id: string | null
          completed_at: string | null
          created_at: string | null
          gcse_grade: number | null
          id: string
          is_completed: boolean
          max_score: number
          percentage_score: number | null
          questions_completed: number
          school_id: string | null
          started_at: string | null
          student_id: string
          time_spent_seconds: number
          total_score: number
          updated_at: string | null
        }
        Insert: {
          assessment_id: string
          assignment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          gcse_grade?: number | null
          id?: string
          is_completed?: boolean
          max_score: number
          percentage_score?: number | null
          questions_completed?: number
          school_id?: string | null
          started_at?: string | null
          student_id: string
          time_spent_seconds?: number
          total_score?: number
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string
          assignment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          gcse_grade?: number | null
          id?: string
          is_completed?: boolean
          max_score?: number
          percentage_score?: number | null
          questions_completed?: number
          school_id?: string | null
          started_at?: string | null
          student_id?: string
          time_spent_seconds?: number
          total_score?: number
          updated_at?: string | null
        }
      }
    }
  }
}
