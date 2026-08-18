import clsx from 'clsx'

const categoryColors: Record<string, string> = {
  Language:     'bg-violet-900/60 text-violet-300 border border-violet-700',
  Frontend:     'bg-sky-900/60 text-sky-300 border border-sky-700',
  Backend:      'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  Cloud:        'bg-orange-900/60 text-orange-300 border border-orange-700',
  DevOps:       'bg-yellow-900/60 text-yellow-300 border border-yellow-700',
  Database:     'bg-pink-900/60 text-pink-300 border border-pink-700',
  'AI/ML':      'bg-red-900/60 text-red-300 border border-red-700',
  Data:         'bg-indigo-900/60 text-indigo-300 border border-indigo-700',
  Architecture: 'bg-teal-900/60 text-teal-300 border border-teal-700',
  Leadership:   'bg-amber-900/60 text-amber-300 border border-amber-700',
}

const levelColors: Record<string, string> = {
  Intern:    'bg-slate-800 text-slate-300 border border-slate-600',
  Junior:    'bg-green-900/60 text-green-300 border border-green-700',
  Mid:       'bg-brand-900/60 text-brand-300 border border-brand-700',
  Senior:    'bg-purple-900/60 text-purple-300 border border-purple-700',
  Staff:     'bg-indigo-900/60 text-indigo-300 border border-indigo-700',
  Principal: 'bg-pink-900/60 text-pink-300 border border-pink-700',
  Fellow:    'bg-yellow-900/60 text-yellow-300 border border-yellow-700',
  Manager:   'bg-orange-900/60 text-orange-300 border border-orange-700',
  Executive: 'bg-red-900/60 text-red-300 border border-red-700',
}

export function SkillBadge({ category, name }: { category: string; name: string }) {
  return (
    <span className={clsx('badge', categoryColors[category] ?? 'bg-slate-800 text-slate-300 border border-slate-600')}>
      {name}
    </span>
  )
}

export function LevelBadge({ level }: { level: string }) {
  return (
    <span className={clsx('badge', levelColors[level] ?? 'bg-slate-800 text-slate-300 border border-slate-600')}>
      {level}
    </span>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={clsx('badge', categoryColors[category] ?? 'bg-slate-800 text-slate-300 border border-slate-600')}>
      {category}
    </span>
  )
}
