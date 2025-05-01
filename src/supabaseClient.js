import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rtvkfdxqaeixwsaafjrv.supabase.co"; //sem dávám odkaz na url projektu//
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dmtmZHhxYWVpeHdzYWFmanJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODY0NzUsImV4cCI6MjA2MTY2MjQ3NX0.YawbmztSmcJI93O8ZIFiM5aEst0MA9iz69W0pbl2Smk"; //sem dávám odkaz na public API klíč//

export const supabase = createClient(supabaseUrl, supabaseKey);