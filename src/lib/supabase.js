import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Stub qui mime le query-builder Supabase (chaînable + thenable)
// utilisé quand les credentials sont absents (dev local sans .env)
function makeStubQuery(result = { data: [], error: null }) {
  const p = Promise.resolve(result);
  const handler = {
    get(_, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return p[prop].bind(p);
      }
      return () => new Proxy(p, handler);
    },
  };
  return new Proxy(p, handler);
}

const stubClient = {
  from:      () => makeStubQuery(),
  rpc:       () => makeStubQuery({ data: null, error: null }),
  functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: () => ({
      upload:    () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  channel: () => ({ on: function() { return this; }, subscribe: () => ({}) }),
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found — running in offline/stub mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : stubClient;

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
