import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables - use placeholder values in development to prevent crashes
// In production, these should be set in the deployment platform's environment variables
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-key';

// Warn if environment variables are missing (but don't crash the app)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment platform.');
  console.error('For Netlify: Site settings > Environment variables');
  console.error('For Vercel: Project settings > Environment variables');
  console.error('🔍 Debug Info:', {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseAnonKey: !!supabaseAnonKey,
    supabaseUrlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'MISSING',
    anonKeyPreview: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING',
  });
}

// Create and export the Supabase client
// Note: If env vars are missing, API calls will fail, but the app won't crash on load
export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey);

// Export auth, db (database), and storage for compatibility with Firebase migration
// These are convenience exports that match the Firebase config structure
export const auth = supabase.auth;
export const db = supabase; // Supabase client itself handles database operations
export const storage = supabase.storage;

// Default export
export default supabase;

