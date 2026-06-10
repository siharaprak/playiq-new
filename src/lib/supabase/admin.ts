import { createClient } from '@supabase/supabase-js';

let memoizedClient: any = null;

function getClient() {
  if (!memoizedClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('[supabaseAdmin] Initializing client dynamically...');

    if (!url || !key) {
      console.error('❌ [supabaseAdmin] Error: Missing required admin environment variables!');
    }

    memoizedClient = createClient(url || '', key || '', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return memoizedClient;
}

/**
 * Supabase admin client using the service role key.
 * Bypasses RLS — initialized lazily at runtime to avoid Next.js module load race conditions.
 */
export const supabaseAdmin = new Proxy({} as any, {
  get(target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
