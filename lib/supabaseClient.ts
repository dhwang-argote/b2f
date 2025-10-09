import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with the anon key for client-side operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Make sure we have the keys before creating the client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase client-side credentials not available');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Export a function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}