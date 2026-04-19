import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oodinddzwpmcmfgmliln.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_F0Q5bXMnylVC7n07aXiYVA_7hLLZMp7';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.info('Using Supabase fallback credentials.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
