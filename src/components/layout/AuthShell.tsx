import type { ReactNode } from 'react'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-navy-900 px-12 py-14 text-mist-100 lg:flex">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-accent-light">◆</span>
          <span className="font-serif text-xl tracking-wide text-white">Meridian</span>
        </div>
        <div className="max-w-md">
          <p className="font-serif text-3xl leading-snug text-white">
            Controle de demandas, prazos e rotina — em um só lugar.
          </p>
          <p className="mt-4 text-sm text-mist-300">
            Profissional e pessoal, organizados com clareza. Acesse de qualquer dispositivo.
          </p>
        </div>
        <p className="text-xs text-mist-300/70">© {new Date().getFullYear()} Meridian</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-mist-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-2xl text-navy-900">{title}</h1>
          <p className="mt-1 text-sm text-navy-700">{subtitle}</p>
          <div className="mt-8 rounded-xl border border-mist-200 bg-white p-6 shadow-soft">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
