import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      winners: {
        Row: {
          id: string;
          name: string;
          department: string;
          supervisor: string;
          tickets: number;
          draw_type: 'discovery-70' | 'discovery-80';
          draw_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          department: string;
          supervisor: string;
          tickets: number;
          draw_type: 'discovery-70' | 'discovery-80';
          draw_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department?: string;
          supervisor?: string;
          tickets?: number;
          draw_type?: 'discovery-70' | 'discovery-80';
          draw_date?: string;
          created_at?: string;
        };
      };
    };
  };
};