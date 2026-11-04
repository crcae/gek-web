import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znbnfiyvbdzwlmdztfdm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: typeof window !== 'undefined',
        persistSession: typeof window !== 'undefined',
      },
    })
  : null;

export const isSupabaseConfigured = Boolean(supabaseAnonKey);
