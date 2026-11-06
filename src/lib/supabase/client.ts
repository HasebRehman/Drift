import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Browser client for client-side queries
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // Graceful fallback for initial UI development before Supabase keys are provided
    console.warn(
      'Supabase credentials not configured in environment variables. Using fallback mode.'
    );
  }

  return createClient<Database>(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');
}
