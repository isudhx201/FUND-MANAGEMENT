
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://alitgcvjskdepayvkzmz.supabase.co'
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsaXRnY3Zqc2tkZXBheXZrem16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODMzMTEsImV4cCI6MjA4Mjk1OTMxMX0.Zbzd1w774Q1iMphw6m4_C8jOqAv2IWrNsBvINiHa9-8'

export const supabase = createClient(supabaseUrl, supabaseKey)
