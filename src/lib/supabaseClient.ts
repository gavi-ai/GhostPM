import { createClient } from '@supabase/supabase-js';

// Public Supabase configuration for client-side
const metaEnv = (import.meta as any).env || {};
const SUPABASE_URL =
  metaEnv.VITE_SUPABASE_URL || 'https://gmuhxphpwquthattwqom.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_GQqLQ4WM-2mIPbbuvRkdhQ_PLUjjOo-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


export async function getCurrentSupabaseUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
  } catch (err) {
    console.warn('Supabase auth getSession check failed:', err);
    return null;
  }
}

export async function signOutSupabase() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Sign out error:', err);
  }
}
