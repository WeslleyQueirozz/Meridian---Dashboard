export function Header({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-mist-200 bg-mist-50/95 px-4 py-4 backdrop-blur sm:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="rounded-md p-2 text-navy-800 hover:bg-mist-200 lg:hidden"
      >
        <span className="block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
      </button>
      <h1 className="font-serif text-xl text-navy-900 sm:text-2xl">{title}</h1>
    </header>
  )
}
