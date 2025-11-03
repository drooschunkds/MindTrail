export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      memory_snapshots: {
        Row: {
          id: string
          project_id: string
          thoughts: string
          timestamp: string
          user_id: string
          github_metadata: Json | null
        }
        Insert: {
          id?: string
          project_id: string
          thoughts: string
          timestamp?: string
          user_id: string
          github_metadata?: Json | null
        }
        Update: {
          id?: string
          project_id?: string
          thoughts?: string
          timestamp?: string
          user_id?: string
          github_metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_snapshots_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_snapshots_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          last_worked_on: string
          progress: number
          status: string
          tags: string[] | null
          title: string
          user_id: string
          github_repo_url: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_worked_on?: string
          progress?: number
          status?: string
          tags?: string[] | null
          title: string
          user_id: string
          github_repo_url?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_worked_on?: string
          progress?: number
          status?: string
          tags?: string[] | null
          title?: string
          user_id?: string
          github_repo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          created_at: string
          id: string
          project_id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
