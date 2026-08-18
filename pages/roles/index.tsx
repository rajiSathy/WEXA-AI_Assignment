import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DatabaseError, EmptyState } from '@/components/ErrorStates'
import { LevelBadge } from '@/components/Badges'
import { Briefcase, ChevronRight, TrendingUp } from 'lucide-react'
import type { Role } from '@/lib/types'

const LEVELS = ['All', 'Intern', 'Junior', 'Mid', 'Senior', 'Staff', 'Principal', 'Fellow', 'Manager', 'Executive']

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch('/api/roles')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setRoles(d)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? roles : roles.filter((r) => r.level === filter)

  const maxSalary = Math.max(...roles.map((r) => r.avgSalary), 1)

  return (
    <>
      <Head><title>Roles — SkillGraph</title></Head>
      <Layout>
        <div className="mb-8">
          <h1 className="section-title flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-sky-400" /> Roles
          </h1>
          <p className="section-sub">Every engineering role from intern to Distinguished Engineer.</p>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === lvl
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading roles..." />
        ) : error ? (
          <DatabaseError />
        ) : filtered.length === 0 ? (
          <EmptyState title="No roles found" />
        ) : (
          <div className="space-y-3 animate-slide-up">
            {filtered.map((role) => (
              <Link
                key={role.id}
                href={`/roles/${role.id}`}
                className="card-hover p-5 flex items-center gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{role.name}</h3>
                    <LevelBadge level={role.level} />
                  </div>
                  {role.description && (
                    <p className="text-slate-500 text-sm truncate">{role.description}</p>
                  )}
                  {/* Salary bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5 max-w-xs">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${(role.avgSalary / maxSalary) * 100}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 text-sm font-semibold">
                      ${(role.avgSalary / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </Layout>
    </>
  )
}
