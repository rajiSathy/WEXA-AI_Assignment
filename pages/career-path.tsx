import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import LoadingSpinner, { InlineSpinner } from '@/components/LoadingSpinner'
import { DatabaseError, EmptyState } from '@/components/ErrorStates'
import { LevelBadge, SkillBadge } from '@/components/Badges'
import { GitBranch, ArrowRight, TrendingUp, BookOpen } from 'lucide-react'
import type { Role, CareerPath } from '@/lib/types'

export default function CareerPathPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [result, setResult] = useState<CareerPath | null>(null)
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [dbError, setDbError] = useState(false)
  const [rolesLoading, setRolesLoading] = useState(true)

  useEffect(() => {
    fetch('/api/roles')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setRoles(d)
      })
      .catch(() => setDbError(true))
      .finally(() => setRolesLoading(false))
  }, [])

  // Pre-fill from query param
  useEffect(() => {
    if (router.query.from) setFromId(router.query.from as string)
  }, [router.query.from])

  const handleSearch = useCallback(async () => {
    if (!fromId || !toId || fromId === toId) return
    setSearching(true)
    setResult(null)
    setNotFound(false)
    try {
      const res = await fetch(`/api/career-path?from=${fromId}&to=${toId}`)
      const data = await res.json()
      if (!res.ok || data.error) {
        setNotFound(true)
      } else {
        setResult(data)
      }
    } catch {
      setDbError(true)
    } finally {
      setSearching(false)
    }
  }, [fromId, toId])

  if (dbError) return <Layout><DatabaseError /></Layout>

  return (
    <>
      <Head><title>Career Path — SkillGraph</title></Head>
      <Layout>
        <div className="max-w-3xl mx-auto">
          <h1 className="section-title flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-orange-400" /> Career Path Finder
          </h1>
          <p className="section-sub">
            Uses a multi-hop graph traversal (up to 5 hops) to find the shortest career path
            between any two roles and the skills needed to bridge the gap.
          </p>

          {/* Selector */}
          <div className="card p-6 mb-6">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Current Role</label>
                <select
                  className="input"
                  value={fromId}
                  onChange={(e) => { setFromId(e.target.value); setResult(null); setNotFound(false) }}
                  disabled={rolesLoading}
                >
                  <option value="">Select a role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.level})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Target Role</label>
                <select
                  className="input"
                  value={toId}
                  onChange={(e) => { setToId(e.target.value); setResult(null); setNotFound(false) }}
                  disabled={rolesLoading}
                >
                  <option value="">Select a role...</option>
                  {roles.filter((r) => r.id !== fromId).map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.level})</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={handleSearch}
              disabled={!fromId || !toId || fromId === toId || searching}
            >
              {searching ? <InlineSpinner /> : <GitBranch className="h-4 w-4" />}
              {searching ? 'Traversing graph...' : 'Find Career Path'}
            </button>
          </div>

          {/* Loading */}
          {searching && <LoadingSpinner text="Traversing the career graph..." />}

          {/* Not found */}
          {notFound && !searching && (
            <EmptyState
              title="No direct path found"
              body="These roles aren't connected by a progression chain in the graph. Try a different pairing."
            />
          )}

          {/* Result */}
          {result && !searching && (
            <div className="animate-slide-up space-y-4">
              {/* Path header */}
              <div className="card p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-800 text-center flex-1 min-w-[120px]">
                    <div className="text-white font-semibold text-sm">{result.from.name}</div>
                    <LevelBadge level={result.from.level} />
                    <div className="text-emerald-400 text-xs mt-1">${(result.from.avgSalary / 1000).toFixed(0)}k</div>
                  </div>
                  <div className="flex flex-col items-center text-slate-500">
                    <ArrowRight className="h-5 w-5" />
                    <span className="text-xs mt-1">{result.hops} hop{result.hops !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-900/40 border border-brand-700 text-center flex-1 min-w-[120px]">
                    <div className="text-white font-semibold text-sm">{result.to.name}</div>
                    <LevelBadge level={result.to.level} />
                    <div className="text-emerald-400 text-xs mt-1">${(result.to.avgSalary / 1000).toFixed(0)}k</div>
                  </div>
                </div>
                {result.from.avgSalary < result.to.avgSalary && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                    <TrendingUp className="h-4 w-4" />
                    Potential salary increase: +${((result.to.avgSalary - result.from.avgSalary) / 1000).toFixed(0)}k
                  </div>
                )}
              </div>

              {/* Skills to learn */}
              {result.newSkillsNeeded.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-violet-400" />
                    Skills to Learn ({result.newSkillsNeeded.length})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.newSkillsNeeded.map((s) => (
                      <Link key={s.id} href={`/skills/${s.id}`}>
                        <SkillBadge category={s.category} name={s.name} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills you already have */}
              {result.commonSkills.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-400" />
                    Skills You Already Have ({result.commonSkills.length})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.commonSkills.map((s) => (
                      <Link key={s.id} href={`/skills/${s.id}`}>
                        <SkillBadge category={s.category} name={s.name} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Cypher query shown */}
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-3 text-sm">Cypher Query Used</h2>
                <pre className="bg-slate-950 rounded-xl p-4 text-xs text-brand-300 overflow-x-auto border border-slate-800">
{`MATCH (from:Role {id: "${result.from.id}"}), (to:Role {id: "${result.to.id}"})
MATCH path = shortestPath((from)-[:NEXT_ROLE*1..5]->(to))
WITH from, to, path, length(path) AS hops
OPTIONAL MATCH (from)-[:REQUIRES]->(s1:Skill)<-[:REQUIRES]-(to)
OPTIONAL MATCH (to)-[:REQUIRES]->(s2:Skill)
WHERE NOT (from)-[:REQUIRES]->(s2)
RETURN from, to, hops,
  collect(DISTINCT s1) AS commonSkills,
  collect(DISTINCT s2) AS newSkills`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
