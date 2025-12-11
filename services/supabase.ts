
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://blgnsemdwyolktqbigfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZ25zZW1kd3lvbGt0cWJpZ2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzY0MTQsImV4cCI6MjA4MDUxMjQxNH0.Kd0TtDzeA9M_25L01dc7rTLY2CHgtqIBih4TSqSybNU';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables. See README.md for setup instructions.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
