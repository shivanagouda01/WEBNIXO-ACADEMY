import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

if (!isConfigured) {
  console.warn('Supabase credentials missing or invalid. Check your .env file or Vercel Environment Variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const checkSupabaseConnection = async () => {
  if (!isConfigured) return { success: false, error: 'Supabase URL or Key is missing' };
  try {
    const { error } = await supabase.from('registrations').select('count', { count: 'exact', head: true }).limit(1);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
