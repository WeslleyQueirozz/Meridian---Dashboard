import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthShell } from '@/components/layout/AuthShell'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setSuccess(true)
    setTimeout(() => navigate('/'), 1800)
  }

  return (
    <AuthShell title="Definir nova senha" subtitle="Escolha uma nova senha para sua conta.">
      {success ? (
        <p className="text-sm text-status-done">Senha atualizada! Redirecionando…</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="password"
            label="Nova senha"
            type="password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-status-late">{error}</p>}
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Salvar nova senha
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
