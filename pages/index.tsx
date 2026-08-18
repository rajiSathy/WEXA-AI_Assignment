import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DatabaseError } from '@/components/ErrorStates'
import { Network, BookOpen, Briefcase, Building2, GitBranch, TrendingUp, Zap } from 'lucide-react'
import type { GraphStats } from '@/lib/types'

interface HealthData {
  connected: boolean
  mock?: boolean
  stats?: GraphStats
  error?: string
}

export default function Home() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d))
      .catch(() => setHealth({ connected: false, error: 'Network error' }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Head>
        <title>SkillGraph — Tech Career Navigator</title>
        <meta name="description" content="Explore tech career paths powered by a graph database" />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="text-center py-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-brand-900/40 border border-brand-700 rounded-full px-4 py-1.5 text-brand-300 text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            Powered by CognoDB Graph Database
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
            Navigate Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">
              Tech Career
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            SkillGraph maps the connections between skills, roles, and companies — so you can discover
            the shortest path from where you are to where you want to be.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/career-path" className="btn-primary flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Find Career Path
            </Link>
            <Link href="/skills" className="btn-secondary flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Explore Skills
            </Link>
          </div>
        </section>

        {/* Demo mode banner */}
        {health?.mock && (
          <div className="mb-6 flex items-center gap-3 bg-amber-900/20 border border-amber-700 rounded-xl px-4 py-3 text-amber-300 text-sm animate-fade-in">
            <Zap className="h-4 w-4 flex-shrink-0" />
            <span>
              <strong>Demo Mode</strong> — Running with sample data. Add your CognoDB credentials to{' '}
              <code className="bg-amber-900/40 px-1 rounded">.env.local</code> to connect a live graph database.
            </span>
          </div>
        )}

        {/* Stats */}
        <section className="mb-12">
          {loading ? (
            <LoadingSpinner text="Connecting to graph database..." />
          ) : !health?.connected ? (
            <DatabaseError />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
              {[
                { label: 'Skills', value: health.stats?.skills ?? 0, icon: BookOpen, color: 'text-violet-400' },
                { label: 'Roles', value: health.stats?.roles ?? 0, icon: Briefcase, color: 'text-sky-400' },
                { label: 'Companies', value: health.stats?.companies ?? 0, icon: Building2, color: 'text-emerald-400' },
                { label: 'Connections', value: health.stats?.relationships ?? 0, icon: Network, color: 'text-orange-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-6 text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
                  <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feature Cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {[
            {
              href: '/skills',
              icon: BookOpen,
              color: 'bg-violet-600',
              title: 'Skill Explorer',
              desc: 'Browse all technical skills by category. See which roles require them and how they interconnect.',
            },
            {
              href: '/roles',
              icon: Briefcase,
              color: 'bg-sky-600',
              title: 'Role Directory',
              desc: 'Every engineering role from intern to Distinguished Engineer — with salaries, skills, and progression.',
            },
            {
              href: '/companies',
              icon: Building2,
              color: 'bg-emerald-600',
              title: 'Company Map',
              desc: 'Top tech companies and the roles they hire for — startups to enterprises.',
            },
            {
              href: '/career-path',
              icon: GitBranch,
              color: 'bg-orange-600',
              title: 'Career Path Finder',
              desc: 'Multi-hop graph traversal finds the shortest route between any two roles and the skills to bridge the gap.',
            },
            {
              href: '/search',
              icon: Network,
              color: 'bg-pink-600',
              title: 'Graph Search',
              desc: 'Search across skills and roles simultaneously — the graph connects them behind the scenes.',
            },
            {
              href: '/roles',
              icon: TrendingUp,
              color: 'bg-indigo-600',
              title: 'Salary Insights',
              desc: 'See average compensation at every level of the engineering ladder.',
            },
          ].map(({ href, icon: Icon, color, title, desc }) => (
            <Link key={href + title} href={href} className="card-hover p-6 group animate-slide-up">
              <div className={`${color} rounded-xl p-2.5 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </section>

        {/* Why Graph DB section */}
        <section className="card p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Network className="h-5 w-5 text-brand-400" />
            Why a Graph Database?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-400 text-sm leading-relaxed">
            <div>
              <p className="mb-3">
                Career navigation is inherently a <strong className="text-slate-200">graph problem</strong>. Skills connect to roles,
                roles connect to other roles via progression paths, and companies connect to roles via hiring. These are
                relationships first — not rows in a table.
              </p>
              <p>
                A relational schema would require multiple JOIN tables (<code className="bg-slate-800 px-1 rounded">role_skills</code>,{' '}
                <code className="bg-slate-800 px-1 rounded">role_progression</code>,{' '}
                <code className="bg-slate-800 px-1 rounded">company_roles</code>) and expensive multi-JOIN queries to answer
                "what skills do I need to become a Staff Engineer from my current role?"
              </p>
            </div>
            <div>
              <p className="mb-3">
                CognoDB handles this in a single elegant Cypher query with a <strong className="text-slate-200">multi-hop traversal</strong>:
              </p>
              <pre className="bg-slate-950 rounded-xl p-4 text-xs text-brand-300 overflow-x-auto border border-slate-800">
{`MATCH path = shortestPath(
  (from:Role {id: $from})
  -[:NEXT_ROLE*1..5]->
  (to:Role {id: $to})
)
RETURN path, length(path) AS hops`}
              </pre>
              <p className="mt-3">
                This kind of variable-length path query is what graph databases are <em>built for</em>.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
