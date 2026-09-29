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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      aparelhos: {
        Row: {
          apelido: string
          btus: number
          cliente_id: string
          created_at: string
          id: string
          ultima_limpeza: string | null
        }
        Insert: {
          apelido?: string
          btus?: number
          cliente_id: string
          created_at?: string
          id?: string
          ultima_limpeza?: string | null
        }
        Update: {
          apelido?: string
          btus?: number
          cliente_id?: string
          created_at?: string
          id?: string
          ultima_limpeza?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aparelhos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          bairro: string
          created_at: string
          data_inicio: string
          id: string
          nome: string
          status: Database["public"]["Enums"]["assinatura_status"]
          whatsapp: string
        }
        Insert: {
          bairro: string
          created_at?: string
          data_inicio?: string
          id?: string
          nome: string
          status?: Database["public"]["Enums"]["assinatura_status"]
          whatsapp: string
        }
        Update: {
          bairro?: string
          created_at?: string
          data_inicio?: string
          id?: string
          nome?: string
          status?: Database["public"]["Enums"]["assinatura_status"]
          whatsapp?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          bairro: string
          btus: string
          created_at: string
          id: string
          nome: string
          qtd_aparelhos: number
          status: Database["public"]["Enums"]["lead_status"]
          ultima_limpeza: string | null
          ultima_limpeza_desconhecida: boolean
          whatsapp: string
        }
        Insert: {
          bairro: string
          btus?: string
          created_at?: string
          id?: string
          nome: string
          qtd_aparelhos?: number
          status?: Database["public"]["Enums"]["lead_status"]
          ultima_limpeza?: string | null
          ultima_limpeza_desconhecida?: boolean
          whatsapp: string
        }
        Update: {
          bairro?: string
          btus?: string
          created_at?: string
          id?: string
          nome?: string
          qtd_aparelhos?: number
          status?: Database["public"]["Enums"]["lead_status"]
          ultima_limpeza?: string | null
          ultima_limpeza_desconhecida?: boolean
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitas: {
        Row: {
          aparelho_id: string | null
          cliente_id: string
          created_at: string
          data: string
          id: string
          observacoes: string
          status: Database["public"]["Enums"]["visita_status"]
          tecnico: string
        }
        Insert: {
          aparelho_id?: string | null
          cliente_id: string
          created_at?: string
          data: string
          id?: string
          observacoes?: string
          status?: Database["public"]["Enums"]["visita_status"]
          tecnico?: string
        }
        Update: {
          aparelho_id?: string | null
          cliente_id?: string
          created_at?: string
          data?: string
          id?: string
          observacoes?: string
          status?: Database["public"]["Enums"]["visita_status"]
          tecnico?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitas_aparelho_id_fkey"
            columns: ["aparelho_id"]
            isOneToOne: false
            referencedRelation: "aparelhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      assinatura_status: "ativa" | "cancelada"
      lead_status: "novo" | "contatado" | "fechado" | "perdido"
      visita_status: "agendada" | "feita" | "cancelada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      assinatura_status: ["ativa", "cancelada"],
      lead_status: ["novo", "contatado", "fechado", "perdido"],
      visita_status: ["agendada", "feita", "cancelada"],
    },
  },
} as const
