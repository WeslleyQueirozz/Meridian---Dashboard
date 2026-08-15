import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthShell } from '@/components/layout/AuthShell'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setSuccess(true)
    setTimeout(() => navigate('/entrar'), 2500)
  }

  return (
    <AuthShell title="Criar conta" subtitle="Comece a organizar suas demandas hoje mesmo.">
      {success ? (
        <p className="text-sm text-status-done">
          Conta criada! Verifique seu e-mail para confirmar o cadastro. Redirecionando…
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="fullName"
            label="Nome completo"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-status-late">{error}</p>}
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Criar conta
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-navy-700">
        Já tem conta?{' '}
        <Link to="/entrar" className="text-accent-dim hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  )
}
