export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      component: {
        Row: {
          id: string;
          created_at: string | null;
          email: string | null;
          title: string | null;
          figma_url: string | null;
          description: string | null;
          created_by: string | null;
          documentation: Json[];
          thumbnail_url: string | null;
          nodeId: string | null;
          design_system: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          email?: string | null;
          title?: string | null;
          figma_url?: string | null;
          description?: string | null;
          created_by?: string | null;
          documentation: Json[];
          thumbnail_url?: string | null;
          nodeId?: string | null;
          design_system?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          email?: string | null;
          title?: string | null;
          figma_url?: string | null;
          description?: string | null;
          created_by?: string | null;
          documentation?: Json[];
          thumbnail_url?: string | null;
          nodeId?: string | null;
          design_system?: number | null;
        };
      };
      design_system: {
        Row: {
          id: number;
          title: string | null;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          figma_file_key: string | null;
          theme: string | null;
          uuid: string | null;
          created_by_email: string | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          figma_file_key?: string | null;
          theme?: string | null;
          uuid?: string | null;
          created_by_email?: string | null;
        };
        Update: {
          id?: number;
          title?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          figma_file_key?: string | null;
          theme?: string | null;
          uuid?: string | null;
          created_by_email?: string | null;
        };
      };
      invites: {
        Row: {
          id: number;
          created_at: string | null;
          design_system_id: number | null;
          invited_by: string | null;
          invitee: string | null;
          designSystemDetail: Json | null;
          role: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          design_system_id?: number | null;
          invited_by?: string | null;
          invitee?: string | null;
          designSystemDetail?: Json | null;
          role?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          design_system_id?: number | null;
          invited_by?: string | null;
          invitee?: string | null;
          designSystemDetail?: Json | null;
          role?: string | null;
        };
      };
      members: {
        Row: {
          design_system_id: number | null;
          user_id: string | null;
          email: string | null;
          id: string;
          role: string | null;
          created_at: string | null;
        };
        Insert: {
          design_system_id?: number | null;
          user_id?: string | null;
          email?: string | null;
          id?: string;
          role?: string | null;
          created_at?: string | null;
        };
        Update: {
          design_system_id?: number | null;
          user_id?: string | null;
          email?: string | null;
          id?: string;
          role?: string | null;
          created_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          figma_token: string | null;
          email: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          figma_token?: string | null;
          email?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          figma_token?: string | null;
          email?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
