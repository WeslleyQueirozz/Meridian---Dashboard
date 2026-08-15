import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-mist-50">
        <span className="font-serif text-navy-700">Carregando…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/entrar" replace />

  return <>{children}</>
}
