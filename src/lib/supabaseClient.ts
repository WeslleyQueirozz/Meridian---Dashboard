import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // Não lançamos exceção para não quebrar o build, mas avisamos claramente no console.
  // eslint-disable-next-line no-console
  console.error(
    'Variáveis de ambiente do Supabase ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja .env.example).'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Nome do bucket no Supabase Storage onde os anexos são armazenados.
export const ATTACHMENTS_BUCKET = 'attachments'
