import { useState, type FormEvent } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

export default function Profile() {
  const { user, updateProfile, updatePassword } = useAuth()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState((user?.user_metadata?.full_name as string) ?? '')
  const [savingName, setSavingName] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  async function handleNameSubmit(e: FormEvent) {
    e.preventDefault()
    setSavingName(true)
    const { error } = await updateProfile(fullName.trim())
    setSavingName(false)
    if (error) showToast('error', error)
    else showToast('success', 'Perfil atualizado.')
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) {
      showToast('error', 'A senha deve ter no mínimo 6 caracteres.')
      return
    }
    setSavingPassword(true)
    const { error } = await updatePassword(newPassword)
    setSavingPassword(false)
    if (error) showToast('error', error)
    else {
      showToast('success', 'Senha atualizada.')
      setNewPassword('')
    }
  }

  return (
    <AppLayout title="Perfil">
      <div className="flex max-w-xl flex-col gap-6">
        <Card>
          <h3 className="mb-4 font-serif text-lg text-navy-900">Informações da conta</h3>
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <Input label="E-mail" value={user?.email ?? ''} disabled />
            <Input
              id="fullName"
              label="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Button type="submit" loading={savingName} className="self-start">
              Salvar
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="mb-4 font-serif text-lg text-navy-900">Alterar senha</h3>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <Input
              id="newPassword"
              label="Nova senha"
              type="password"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit" loading={savingPassword} className="self-start">
              Atualizar senha
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
