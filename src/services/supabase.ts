import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { keys } from './keys.service';

export const supabase: SupabaseClient = createClient(keys.SUPABASE_URL, keys.SUPABASE_KEY);
