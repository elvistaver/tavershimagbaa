import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// In Lovable, ENV variables aren't supported in the frontend.
// We read from (in order): window globals, localStorage, then import.meta.env (if present)
// This prevents runtime crashes if config isn't available yet.

declare global {
  interface Window {
    __SUPABASE_URL__?: string;
    __SUPABASE_ANON_KEY__?: string;
  }
}

const url = 'https://ybhbxhfyqlbmpuxwyndk.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliaGJ4aGZ5cWxibXB1eHd5bmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODIwMjIsImV4cCI6MjA3MTU1ODAyMn0.gKovC5xX4orihE8UdH44HNl1RfRSoyVtaLZJPKygM9Y';

function createMockClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase not configured. Add your public URL and anon key to window.__SUPABASE_URL__/__SUPABASE_ANON_KEY__ or localStorage (supabaseUrl, supabaseAnonKey).'
    );
  }
  const mock = {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      onAuthStateChange(_cb: any) {
        return { data: { subscription: { unsubscribe() {} } } } as any;
      },
      async signOut() { return { error: null } as any },
      async signInWithPassword() {
        return { data: null, error: new Error('Supabase not configured') } as any;
      },
      async signUp() {
        return { data: null, error: new Error('Supabase not configured') } as any;
      },
    },
    from() {
      throw new Error('Supabase not configured');
    },
  };
  return mock as unknown as SupabaseClient;
}

export const SUPABASE_CONFIGURED = Boolean(url && anonKey);
export const supabase: SupabaseClient = (url && anonKey)
  ? createClient(url, anonKey)
  : createMockClient();
