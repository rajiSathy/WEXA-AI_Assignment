import Link from 'next/link'
import { useRouter } from 'next/router'
import { Network, BookOpen, Briefcase, Building2, GitBranch, Search } from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/',           label: 'Overview',    icon: Network },
  { href: '/skills',     label: 'Skills',      icon: BookOpen },
  { href: '/roles',      label: 'Roles',       icon: Briefcase },
  { href: '/companies',  label: 'Companies',   icon: Building2 },
  { href: '/career-path',label: 'Career Path', icon: GitBranch },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-brand-600 rounded-lg p-1.5">
                <Network className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">SkillGraph</span>
              <span className="text-slate-500 text-sm hidden sm:block">Career Navigator</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map(({ href, label, icon: Icon }) => {
                const active = router.pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                )
              })}
            </nav>
            <Link href="/search" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-slate-800 overflow-x-auto">
          <div className="flex px-4 py-2 gap-1 min-w-max">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = router.pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                    active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-sm">
        SkillGraph · Built with CognoDB · WeXA AI Assignment
      </footer>
    </div>
  )
}
