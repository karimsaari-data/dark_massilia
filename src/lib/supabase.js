import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase Error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
  return { success: true };
};
