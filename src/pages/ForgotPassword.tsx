import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthShell } from '@/components/layout/AuthShell'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await requestPasswordReset(email)
    setLoading(false)
    if (error) setError(error)
    else setSent(true)
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link de redefinição para o seu e-mail."
    >
      {sent ? (
        <p className="text-sm text-status-done">
          Se o e-mail estiver cadastrado, você receberá um link de redefinição em instantes.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="E-mail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-status-late">{error}</p>}
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Enviar link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-navy-700">
        <Link to="/entrar" className="text-accent-dim hover:underline">
          Voltar para o login
        </Link>
      </p>
    </AuthShell>
  )
}
