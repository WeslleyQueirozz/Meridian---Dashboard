import { NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◇', end: true },
  { to: '/profissional', label: 'Profissional', icon: '▤' },
  { to: '/pessoal', label: 'Pessoal', icon: '◎' },
  { to: '/configuracoes', label: 'Configurações', icon: '⚙' },
  { to: '/perfil', label: 'Perfil', icon: '☺' },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut, user } = useAuth()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-navy-700/40 bg-navy-900 text-mist-100">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="text-xl text-accent-light">◆</span>
        <span className="font-serif text-lg tracking-wide text-white">Meridian</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-mist-200/80 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <span className="w-4 text-center text-accent-light">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-navy-700/40 px-4 py-4">
        <p className="truncate px-2 text-xs text-mist-300">{user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mist-200/80 hover:bg-navy-800 hover:text-white"
        >
          <span className="w-4 text-center text-accent-light">⏻</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
