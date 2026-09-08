import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xwemjbuoaoqmenlysvzq.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_lb2fIaT6gT0iu1_EqAfwSw_h5Q8CeU0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);