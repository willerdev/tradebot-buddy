import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kzwrefpebgvuaezlfmzn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6d3JlZnBlYmd2dWFlemxmbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMTIzNzYsImV4cCI6MjA0Nzg4ODM3Nn0.LitWuaV7ZfuxpM1dKbQ1coOpTVAFqWd-qenZWMzYQRM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});