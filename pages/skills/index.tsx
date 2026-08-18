import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DatabaseError, EmptyState } from '@/components/ErrorStates'
import { SkillBadge, CategoryBadge } from '@/components/Badges'
import { BookOpen, ChevronRight } from 'lucide-react'
import type { Skill } from '@/lib/types'

const CATEGORIES = ['All', 'Language', 'Frontend', 'Backend', 'Cloud', 'DevOps', 'Database', 'AI/ML', 'Data', 'Architecture', 'Leadership']

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setSkills(d)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = skills.filter((s) => {
    const matchCat = filter === 'All' || s.category === filter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const grouped = filtered.reduce<Record<string, Skill[]>>((acc, s) => {
    acc[s.category] = acc[s.category] ? [...acc[s.category], s] : [s]
    return acc
  }, {})

  return (
    <>
      <Head><title>Skills — SkillGraph</title></Head>
      <Layout>
        <div className="mb-8">
          <h1 className="section-title flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-violet-400" /> Skills
          </h1>
          <p className="section-sub">All technical skills in the graph — click one to explore its connections.</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              className="input max-w-sm"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading skills..." />
        ) : error ? (
          <DatabaseError />
        ) : filtered.length === 0 ? (
          <EmptyState title="No skills found" body="Try adjusting your search or filter." />
        ) : (
          <div className="space-y-8 animate-slide-up">
            {Object.entries(grouped).map(([category, catSkills]) => (
              <div key={category}>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CategoryBadge category={category} />
                  <span className="text-slate-500 text-sm font-normal">{catSkills.length} skills</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catSkills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/skills/${skill.id}`}
                      className="card-hover p-4 flex items-start justify-between group"
                    >
                      <div>
                        <div className="font-medium text-white mb-1">{skill.name}</div>
                        {skill.description && (
                          <p className="text-slate-500 text-xs leading-relaxed">{skill.description}</p>
                        )}
                        {skill.level && (
                          <span className="mt-2 inline-block text-xs text-slate-400">{skill.level}</span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-brand-400 flex-shrink-0 mt-0.5 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </>
  )
}
