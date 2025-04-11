
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pgspmcdtyiceznheajhk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnc3BtY2R0eWljZXpuaGVhamhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDU2NzgsImV4cCI6MjA1ODkyMTY3OH0.XS154jvklkOYgjoJS3ZYkaDdTW9b3CHbw03GwXnfCmk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});
