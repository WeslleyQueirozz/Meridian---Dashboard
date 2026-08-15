import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'

export default function Settings() {
  const { user } = useAuth()

  return (
    <AppLayout title="Configurações">
      <div className="flex max-w-xl flex-col gap-6">
        <Card>
          <h3 className="mb-2 font-serif text-lg text-navy-900">Conta</h3>
          <p className="text-sm text-navy-600">
            Conectado como <strong>{user?.email}</strong>.
          </p>
          <p className="mt-1 text-sm text-navy-500">
            Conta criada em{' '}
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}.
          </p>
        </Card>

        <Card>
          <h3 className="mb-2 font-serif text-lg text-navy-900">Segurança e dados</h3>
          <p className="text-sm text-navy-600">
            Seus dados são armazenados no Supabase e protegidos por Row Level Security: apenas você
            pode visualizar ou modificar suas demandas, atividades e anexos.
          </p>
        </Card>

        <Card>
          <h3 className="mb-2 font-serif text-lg text-navy-900">Sobre</h3>
          <p className="text-sm text-navy-600">
            Meridian — painel pessoal de gerenciamento de demandas profissionais e rotina pessoal.
          </p>
        </Card>
      </div>
    </AppLayout>
  )
}
