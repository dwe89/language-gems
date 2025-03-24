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