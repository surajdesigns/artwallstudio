import { createBrowserClient } from '@supabase/ssr';

let supabaseInstance: any = null;

export function getSupabaseBrowserClient() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error("Supabase env variables missing");
    }

    supabaseInstance = createBrowserClient(url, key);
  }

  return supabaseInstance;
}