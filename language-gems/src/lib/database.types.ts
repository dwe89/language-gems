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
        }
      }
      assignments: {
        Row: {
          id: string
          title: string
          description: string | null
          teacher_id: string
          class_id: string
          game_type: string
          due_date: string | null
          created_at: string
          updated_at: string
          status: string
          points: number
          time_limit: number
          game_config: Json
          vocabulary_list_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          teacher_id: string
          class_id: string
          game_type: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
          status?: string
          points?: number
          time_limit?: number
          game_config?: Json
          vocabulary_list_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          teacher_id?: string
          class_id?: string
          game_type?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
          status?: string
          points?: number
          time_limit?: number
          game_config?: Json
          vocabulary_list_id?: string | null
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