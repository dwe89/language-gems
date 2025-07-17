export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          criteria: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          criteria: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          criteria?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
      custom_wordlists: {
        Row: {
          id: string
          name: string
          creator_id: string | null
          description: string | null
          is_public: boolean | null
          words: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          creator_id?: string | null
          description?: string | null
          is_public?: boolean | null
          words: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          creator_id?: string | null
          description?: string | null
          is_public?: boolean | null
          words?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          teacher_id: string | null
          organization_id: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
          level: string
          year_group: string | null
        }
        Insert: {
          id?: string
          name: string
          teacher_id?: string | null
          organization_id?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
          level?: string
          year_group?: string | null
        }
        Update: {
          id?: string
          name?: string
          teacher_id?: string | null
          organization_id?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
          level?: string
          year_group?: string | null
        }
      }
      assignments: {
        Row: {
          id: string
          title: string
          description: string | null
          class_id: string | null
          wordlist_id: string | null
          due_date: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
          points: number | null
          assigned_to: string | null
          type: string | null
          status: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          class_id?: string | null
          wordlist_id?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          points?: number | null
          assigned_to?: string | null
          type?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          class_id?: string | null
          wordlist_id?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          points?: number | null
          assigned_to?: string | null
          type?: string | null
          status?: string | null
        }
      }
      assignment_progress: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          started_at: string
          completed_at: string | null
          score: number
          accuracy: number
          attempts: number
          time_spent: number
          metrics: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          started_at?: string
          completed_at?: string | null
          score?: number
          accuracy?: number
          attempts?: number
          time_spent?: number
          metrics?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          started_at?: string
          completed_at?: string | null
          score?: number
          accuracy?: number
          attempts?: number
          time_spent?: number
          metrics?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: number
          user_id: string
          email: string
          role: string
          display_name: string | null
          created_at: string | null
          updated_at: string | null
          subscription_type: string | null
          custom_sets_count: number | null
          max_custom_sets: number | null
          username: string | null
          school_initials: string | null
        }
        Insert: {
          id?: number
          user_id: string
          email: string
          role: string
          display_name?: string | null
          created_at?: string | null
          updated_at?: string | null
          subscription_type?: string | null
          custom_sets_count?: number | null
          max_custom_sets?: number | null
          username?: string | null
          school_initials?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          email?: string
          role?: string
          display_name?: string | null
          created_at?: string | null
          updated_at?: string | null
          subscription_type?: string | null
          custom_sets_count?: number | null
          max_custom_sets?: number | null
          username?: string | null
          school_initials?: string | null
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          type: string
          price_monthly: number | null
          price_yearly: number | null
          features: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          price_monthly?: number | null
          price_yearly?: number | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          price_monthly?: number | null
          price_yearly?: number | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      vocabulary_lists: {
        Row: {
          id: string
          name: string
          description: string | null
          theme_id: string
          topic_id: string | null
          difficulty: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          theme_id: string
          topic_id?: string | null
          difficulty?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          theme_id?: string
          topic_id?: string | null
          difficulty?: number
          created_at?: string
          updated_at?: string
        }
      }
      vocabulary_items: {
        Row: {
          id: string
          list_id: string
          term: string
          translation: string
          image_url: string | null
          audio_url: string | null
          example_sentence: string | null
          example_translation: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          list_id: string
          term: string
          translation: string
          image_url?: string | null
          audio_url?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          term?: string
          translation?: string
          image_url?: string | null
          audio_url?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_vocabulary_progress: {
        Row: {
          id: string
          student_id: string
          vocabulary_item_id: string
          proficiency_level: number
          correct_answers: number
          incorrect_answers: number
          last_practiced: string | null
          next_review: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          vocabulary_item_id: string
          proficiency_level?: number
          correct_answers?: number
          incorrect_answers?: number
          last_practiced?: string | null
          next_review?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          vocabulary_item_id?: string
          proficiency_level?: number
          correct_answers?: number
          incorrect_answers?: number
          last_practiced?: string | null
          next_review?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      class_vocabulary_assignments: {
        Row: {
          id: string
          class_id: string
          vocabulary_list_id: string
          teacher_id: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          vocabulary_list_id: string
          teacher_id: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          vocabulary_list_id?: string
          teacher_id?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      school_codes: {
        Row: {
          id: string
          code: string
          school_name: string
          school_initials: string | null
          organization_id: string | null
          is_active: boolean | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          code: string
          school_name: string
          school_initials?: string | null
          organization_id?: string | null
          is_active?: boolean | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          school_name?: string
          school_initials?: string | null
          organization_id?: string | null
          is_active?: boolean | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      vocabulary: {
        Row: {
          id: number
          theme: string | null
          topic: string | null
          part_of_speech: string | null
          spanish: string | null
          english: string | null
          frequency_score?: number | null
          difficulty_level?: string | null
        }
        Insert: {
          id?: number
          theme?: string | null
          topic?: string | null
          part_of_speech?: string | null
          spanish?: string | null
          english?: string | null
          frequency_score?: number | null
          difficulty_level?: string | null
        }
        Update: {
          id?: number
          theme?: string | null
          topic?: string | null
          part_of_speech?: string | null
          spanish?: string | null
          english?: string | null
          frequency_score?: number | null
          difficulty_level?: string | null
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "teacher" | "student" | "visitor"
    }
  }
} 