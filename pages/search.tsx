import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { EmptyState, DatabaseError } from '@/components/ErrorStates'
import { SkillBadge, LevelBadge } from '@/components/Badges'
import { Search, BookOpen, Briefcase } from 'lucide-react'
import type { Skill, Role } from '@/lib/types'

interface SearchResults {
  skills: Skill[]
  roles: Role[]
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults(null); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 300)
    return () => clearTimeout(t)
  }, [query, doSearch])

  const total = (results?.skills.length ?? 0) + (results?.roles.length ?? 0)

  return (
    <>
      <Head><title>Search — SkillGraph</title></Head>
      <Layout>
        <div className="max-w-2xl mx-auto">
          <h1 className="section-title flex items-center gap-2">
            <Search className="h-6 w-6 text-pink-400" /> Search
          </h1>
          <p className="section-sub">Search across skills and roles simultaneously.</p>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              className="input pl-10 text-base"
              placeholder="Type to search skills and roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {loading && <LoadingSpinner text="Searching the graph..." />}

          {error && <DatabaseError />}

          {!loading && !error && results && total === 0 && query.length >= 2 && (
            <EmptyState title="No results found" body={`Nothing matched "${query}"`} />
          )}

          {!loading && !error && results && total > 0 && (
            <div className="animate-slide-up space-y-6">
              {results.skills.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Skills ({results.skills.length})
                  </h2>
                  <div className="space-y-2">
                    {results.skills.map((s) => (
                      <Link key={s.id} href={`/skills/${s.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        <SkillBadge category={s.category} name={s.category} />
                        <span className="text-white font-medium">{s.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.roles.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Roles ({results.roles.length})
                  </h2>
                  <div className="space-y-2">
                    {results.roles.map((r) => (
                      <Link key={r.id} href={`/roles/${r.id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <LevelBadge level={r.level} />
                          <span className="text-white font-medium">{r.name}</span>
                        </div>
                        <span className="text-emerald-400 text-sm">${(r.avgSalary / 1000).toFixed(0)}k</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!query && (
            <div className="text-center py-16 text-slate-600">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Start typing to search across all skills and roles</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
