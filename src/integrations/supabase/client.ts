// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nngtysimnssufrwoftox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZ3R5c2ltbnNzdWZyd29mdG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MDg4ODksImV4cCI6MjA1MTE4NDg4OX0.LgNpTAYJunmFh7Z9kNRdCKT9MC9R-r_4oHDRlXDmTXA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);