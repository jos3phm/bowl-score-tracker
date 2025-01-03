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
      ball_usage: {
        Row: {
          ball_id: string
          created_at: string
          frame_number: number
          game_id: string
          id: string
          shot_number: number
        }
        Insert: {
          ball_id: string
          created_at?: string
          frame_number: number
          game_id: string
          id?: string
          shot_number: number
        }
        Update: {
          ball_id?: string
          created_at?: string
          frame_number?: number
          game_id?: string
          id?: string
          shot_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "ball_usage_ball_id_fkey"
            columns: ["ball_id"]
            isOneToOne: false
            referencedRelation: "bowling_balls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_usage_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      bowling_balls: {
        Row: {
          brand: string | null
          created_at: string
          hook_rating: number | null
          id: string
          is_spare_ball: boolean | null
          name: string
          notes: string | null
          total_shots: number | null
          updated_at: string
          user_id: string | null
          weight: number | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          hook_rating?: number | null
          id?: string
          is_spare_ball?: boolean | null
          name: string
          notes?: string | null
          total_shots?: number | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          hook_rating?: number | null
          id?: string
          is_spare_ball?: boolean | null
          name?: string
          notes?: string | null
          total_shots?: number | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          photo_url: string | null
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          photo_url?: string | null
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          photo_url?: string | null
          total_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birthday: string | null
          bowling_hand: string | null
          bowling_style: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          gender: string | null
          id: string
          state: string | null
          updated_at: string
        }
        Insert: {
          birthday?: string | null
          bowling_hand?: string | null
          bowling_style?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          gender?: string | null
          id: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          birthday?: string | null
          bowling_hand?: string | null
          bowling_style?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          gender?: string | null
          id?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
