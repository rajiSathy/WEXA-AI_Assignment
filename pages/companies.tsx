import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DatabaseError, EmptyState } from '@/components/ErrorStates'
import { Building2, MapPin, Users } from 'lucide-react'
import type { Company } from '@/lib/types'

const INDUSTRIES = ['All', 'Technology', 'Fintech', 'AI', 'Data/AI', 'Streaming', 'Ecommerce', 'Travel', 'Developer Tools', 'Communication']
const SIZES = ['All', 'Startup', 'Scaleup', 'Enterprise']

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [industry, setIndustry] = useState('All')
  const [size, setSize] = useState('All')

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setCompanies(d)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter((c) => {
    return (industry === 'All' || c.industry === industry) &&
           (size === 'All' || c.size === size)
  })

  return (
    <>
      <Head><title>Companies — SkillGraph</title></Head>
      <Layout>
        <div className="mb-8">
          <h1 className="section-title flex items-center gap-2">
            <Building2 className="h-6 w-6 text-emerald-400" /> Companies
          </h1>
          <p className="section-sub">Top tech companies and the roles they hire for.</p>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    size === s ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <button key={ind} onClick={() => setIndustry(ind)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  industry === ind ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >{ind}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading companies..." />
        ) : error ? (
          <DatabaseError />
        ) : filtered.length === 0 ? (
          <EmptyState title="No companies found" body="Try adjusting your filters." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
            {filtered.map((company) => (
              <div key={company.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-slate-800 rounded-xl p-3 text-2xl font-bold text-white w-12 h-12 flex items-center justify-center">
                    {company.name[0]}
                  </div>
                  <span className="badge bg-slate-800 text-slate-300 border border-slate-700">{company.size}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{company.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-1">
                  <Users className="h-3.5 w-3.5" />
                  {company.industry}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  {company.location}
                </div>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </>
  )
}
