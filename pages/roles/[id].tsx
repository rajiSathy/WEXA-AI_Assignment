import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DatabaseError } from '@/components/ErrorStates'
import { SkillBadge, LevelBadge } from '@/components/Badges'
import { ArrowLeft, Briefcase, Building2, GitBranch, DollarSign } from 'lucide-react'
import type { RoleDetail } from '@/lib/types'

export default function RoleDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState<RoleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/roles?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <>
      <Head><title>{data?.role.name ?? 'Role'} — SkillGraph</title></Head>
      <Layout>
        <Link href="/roles" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Roles
        </Link>

        {loading ? (
          <LoadingSpinner text="Loading role..." />
        ) : error || !data ? (
          <DatabaseError />
        ) : (
          <div className="animate-slide-up">
            {/* Header */}
            <div className="card p-8 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-sky-400" />
                    <LevelBadge level={data.role.level} />
                  </div>
                  <h1 className="text-3xl font-bold text-white">{data.role.name}</h1>
                  {data.role.description && (
                    <p className="text-slate-400 mt-2">{data.role.description}</p>
                  )}
                </div>
                <div className="card p-4 text-center">
                  <DollarSign className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-emerald-400">
                    ${(data.role.avgSalary / 1000).toFixed(0)}k
                  </div>
                  <div className="text-slate-500 text-xs">Avg. Salary</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Required Skills */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4">Required Skills</h2>
                {data.requiredSkills.length === 0 ? (
                  <p className="text-slate-500 text-sm">No skills listed</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data.requiredSkills.map((s) => (
                      <Link key={s.id} href={`/skills/${s.id}`}>
                        <SkillBadge category={s.category} name={s.name} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Companies */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  Hiring Companies
                </h2>
                {data.companies.length === 0 ? (
                  <p className="text-slate-500 text-sm">No companies listed</p>
                ) : (
                  <div className="space-y-2">
                    {data.companies.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800">
                        <div>
                          <div className="text-white text-sm font-medium">{c.name}</div>
                          <div className="text-slate-500 text-xs">{c.industry} · {c.location}</div>
                        </div>
                        <span className="badge bg-slate-700 text-slate-300">{c.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Next Roles */}
            {data.relatedRoles.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-orange-400" />
                  Career Progression — next roles
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.relatedRoles.map((r) => (
                    <Link
                      key={r.id}
                      href={`/roles/${r.id}`}
                      className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">{r.name}</span>
                        <LevelBadge level={r.level} />
                      </div>
                      <span className="text-emerald-400 text-sm">${(r.avgSalary / 1000).toFixed(0)}k</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <Link
                    href={`/career-path?from=${data.role.id}`}
                    className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors"
                  >
                    <GitBranch className="h-4 w-4" />
                    Find full career path from this role
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </Layout>
    </>
  )
}
