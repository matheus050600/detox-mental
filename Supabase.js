import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://uetgenymwhiadqczpicc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldGdlbnltd2hpYWRxY3pwaWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTA0NDAsImV4cCI6MjA3NDc2NjQ0MH0.ekvG9CVzOfKPof7YJC-ysZGQj66cKP3yZPa4PgCltvo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
