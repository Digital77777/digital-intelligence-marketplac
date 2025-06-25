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
      email_waiting_list: {
        Row: {
          email: string
          id: number
        }
        Insert: {
          email: string
          id?: never
        }
        Update: {
          email?: string
          id?: never
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_email_fkey"
            columns: ["email"]
            isOneToOne: false
            referencedRelation: "email_waiting_list"
            referencedColumns: ["email"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_email: string
          referrer_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_email: string
          referrer_email: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string
          referrer_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referral_code_fkey"
            columns: ["referral_code"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "referrals_referred_email_fkey"
            columns: ["referred_email"]
            isOneToOne: true
            referencedRelation: "email_waiting_list"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "referrals_referrer_email_fkey"
            columns: ["referrer_email"]
            isOneToOne: false
            referencedRelation: "email_waiting_list"
            referencedColumns: ["email"]
          },
        ]
      }
      rewards: {
        Row: {
          claimed: boolean
          earned_at: string
          email: string
          id: string
          referral_count: number
          tier: string
        }
        Insert: {
          claimed?: boolean
          earned_at?: string
          email: string
          id?: string
          referral_count: number
          tier: string
        }
        Update: {
          claimed?: boolean
          earned_at?: string
          email?: string
          id?: string
          referral_count?: number
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_email_fkey"
            columns: ["email"]
            isOneToOne: false
            referencedRelation: "email_waiting_list"
            referencedColumns: ["email"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      process_referral: {
        Args: { referral_code_input: string; new_email: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
