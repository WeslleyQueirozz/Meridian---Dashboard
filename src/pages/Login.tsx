import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthShell } from '@/components/layout/AuthShell'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error)
    else navigate('/')
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse seu painel de demandas profissionais e pessoais."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-status-late">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Entrar
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-center text-sm text-navy-700">
        <Link to="/esqueci-senha" className="text-accent-dim hover:underline">
          Esqueci minha senha
        </Link>
        <p>
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-accent-dim hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
