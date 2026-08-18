import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DatabaseError, EmptyState } from '@/components/ErrorStates'
import { SkillBadge, LevelBadge } from '@/components/Badges'
import { ArrowLeft, BookOpen, Briefcase, Network } from 'lucide-react'
import type { SkillDetail } from '@/lib/types'

export default function SkillDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState<SkillDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/skills?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <>
      <Head><title>{data?.skill.name ?? 'Skill'} — SkillGraph</title></Head>
      <Layout>
        <Link href="/skills" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Skills
        </Link>

        {loading ? (
          <LoadingSpinner text="Loading skill..." />
        ) : error || !data ? (
          <DatabaseError />
        ) : (
          <div className="animate-slide-up">
            <div className="card p-8 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-violet-400" />
                    <SkillBadge category={data.skill.category} name={data.skill.category} />
                    {data.skill.level && <span className="text-slate-500 text-sm">{data.skill.level}</span>}
                  </div>
                  <h1 className="text-3xl font-bold text-white">{data.skill.name}</h1>
                  {data.skill.description && (
                    <p className="text-slate-400 mt-2">{data.skill.description}</p>
                  )}
                </div>
                <div className="flex gap-4 text-center">
                  <div className="card p-3 min-w-[80px]">
                    <div className="text-2xl font-bold text-white">{data.roles.length}</div>
                    <div className="text-slate-500 text-xs">Roles</div>
                  </div>
                  <div className="card p-3 min-w-[80px]">
                    <div className="text-2xl font-bold text-white">{data.relatedSkills.length}</div>
                    <div className="text-slate-500 text-xs">Related</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Roles requiring this skill */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-sky-400" />
                  Roles that require this skill
                </h2>
                {data.roles.length === 0 ? (
                  <EmptyState title="No roles found" />
                ) : (
                  <div className="space-y-2">
                    {data.roles.map((role) => (
                      <Link
                        key={role.id}
                        href={`/roles/${role.id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        <div>
                          <div className="text-white text-sm font-medium">{role.name}</div>
                          <LevelBadge level={role.level} />
                        </div>
                        <div className="text-emerald-400 text-sm font-semibold">
                          ${(role.avgSalary / 1000).toFixed(0)}k
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Skills */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Network className="h-4 w-4 text-brand-400" />
                  Related skills in the graph
                </h2>
                {data.relatedSkills.length === 0 ? (
                  <EmptyState title="No related skills" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data.relatedSkills.map((s) => (
                      <Link key={s.id} href={`/skills/${s.id}`}>
                        <SkillBadge category={s.category} name={s.name} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
