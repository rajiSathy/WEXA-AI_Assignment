import { Skill, Role, Company, CareerPath, RoleDetail, SkillDetail, GraphStats } from './types'

export const mockSkills: Skill[] = [
  { id: 's-python',     name: 'Python',          category: 'Language',   level: 'Core',     description: 'General-purpose programming language' },
  { id: 's-javascript', name: 'JavaScript',       category: 'Language',   level: 'Core',     description: 'Web scripting language' },
  { id: 's-typescript', name: 'TypeScript',       category: 'Language',   level: 'Core',     description: 'Typed superset of JavaScript' },
  { id: 's-java',       name: 'Java',             category: 'Language',   level: 'Core',     description: 'Enterprise programming language' },
  { id: 's-go',         name: 'Go',               category: 'Language',   level: 'Core',     description: 'Systems language by Google' },
  { id: 's-rust',       name: 'Rust',             category: 'Language',   level: 'Advanced', description: 'Memory-safe systems language' },
  { id: 's-sql',        name: 'SQL',              category: 'Database',   level: 'Core',     description: 'Relational database query language' },
  { id: 's-react',      name: 'React',            category: 'Frontend',   level: 'Core',     description: 'UI component library' },
  { id: 's-nextjs',     name: 'Next.js',          category: 'Frontend',   level: 'Core',     description: 'React framework for production' },
  { id: 's-nodejs',     name: 'Node.js',          category: 'Backend',    level: 'Core',     description: 'JavaScript runtime for servers' },
  { id: 's-django',     name: 'Django',           category: 'Backend',    level: 'Core',     description: 'Python web framework' },
  { id: 's-fastapi',    name: 'FastAPI',          category: 'Backend',    level: 'Core',     description: 'Modern Python API framework' },
  { id: 's-aws',        name: 'AWS',              category: 'Cloud',      level: 'Core',     description: 'Amazon Web Services' },
  { id: 's-docker',     name: 'Docker',           category: 'DevOps',     level: 'Core',     description: 'Container platform' },
  { id: 's-k8s',        name: 'Kubernetes',       category: 'DevOps',     level: 'Advanced', description: 'Container orchestration' },
  { id: 's-terraform',  name: 'Terraform',        category: 'DevOps',     level: 'Advanced', description: 'Infrastructure as code' },
  { id: 's-cicd',       name: 'CI/CD',            category: 'DevOps',     level: 'Core',     description: 'Continuous integration & deployment' },
  { id: 's-ml',         name: 'Machine Learning', category: 'AI/ML',      level: 'Advanced', description: 'Predictive modeling' },
  { id: 's-pytorch',    name: 'PyTorch',          category: 'AI/ML',      level: 'Advanced', description: 'ML framework by Meta' },
  { id: 's-spark',      name: 'Apache Spark',     category: 'Data',       level: 'Advanced', description: 'Distributed data processing' },
  { id: 's-kafka',      name: 'Apache Kafka',     category: 'Data',       level: 'Advanced', description: 'Event streaming platform' },
  { id: 's-postgres',   name: 'PostgreSQL',       category: 'Database',   level: 'Core',     description: 'Open-source relational DB' },
  { id: 's-redis',      name: 'Redis',            category: 'Database',   level: 'Core',     description: 'In-memory data store' },
  { id: 's-neo4j',      name: 'Neo4j/CognoDB',    category: 'Database',   level: 'Advanced', description: 'Graph database' },
  { id: 's-systemdesign', name: 'System Design',  category: 'Architecture', level: 'Advanced', description: 'Scalable system architecture' },
  { id: 's-microsvcs',  name: 'Microservices',    category: 'Architecture', level: 'Advanced', description: 'Distributed service architecture' },
  { id: 's-apidsgn',    name: 'API Design',       category: 'Architecture', level: 'Core',   description: 'RESTful and GraphQL API design' },
  { id: 's-leadership', name: 'Tech Leadership',  category: 'Leadership', level: 'Advanced', description: 'Leading engineering teams' },
  { id: 's-mentoring',  name: 'Mentoring',        category: 'Leadership', level: 'Advanced', description: 'Coaching junior engineers' },
]

export const mockRoles: Role[] = [
  { id: 'r-intern',    name: 'Software Engineering Intern', level: 'Intern',    avgSalary: 45000,  description: 'Entry-level internship role' },
  { id: 'r-je',        name: 'Junior Engineer',             level: 'Junior',    avgSalary: 70000,  description: 'First full-time engineering role' },
  { id: 'r-swe',       name: 'Software Engineer',           level: 'Mid',       avgSalary: 110000, description: 'Core individual contributor' },
  { id: 'r-senior',    name: 'Senior Engineer',             level: 'Senior',    avgSalary: 150000, description: 'Technical expert & mentor' },
  { id: 'r-staff',     name: 'Staff Engineer',              level: 'Staff',     avgSalary: 185000, description: 'Cross-team technical leader' },
  { id: 'r-principal', name: 'Principal Engineer',          level: 'Principal', avgSalary: 220000, description: 'Org-wide technical direction' },
  { id: 'r-fellow',    name: 'Distinguished Engineer',      level: 'Fellow',    avgSalary: 280000, description: 'Industry-recognized expert' },
  { id: 'r-fe',        name: 'Frontend Engineer',           level: 'Mid',       avgSalary: 105000, description: 'Specialised in UI/UX engineering' },
  { id: 'r-be',        name: 'Backend Engineer',            level: 'Mid',       avgSalary: 115000, description: 'Server-side systems engineer' },
  { id: 'r-fullstack', name: 'Full-Stack Engineer',         level: 'Mid',       avgSalary: 112000, description: 'End-to-end web developer' },
  { id: 'r-devops',    name: 'DevOps Engineer',             level: 'Mid',       avgSalary: 120000, description: 'CI/CD and infrastructure' },
  { id: 'r-sre',       name: 'Site Reliability Engineer',   level: 'Senior',    avgSalary: 155000, description: 'Production reliability & scale' },
  { id: 'r-ml-eng',    name: 'ML Engineer',                 level: 'Mid',       avgSalary: 130000, description: 'Building ML systems' },
  { id: 'r-data-eng',  name: 'Data Engineer',               level: 'Mid',       avgSalary: 115000, description: 'Data pipelines & warehousing' },
  { id: 'r-em',        name: 'Engineering Manager',         level: 'Manager',   avgSalary: 180000, description: 'People & delivery management' },
  { id: 'r-vp',        name: 'VP of Engineering',           level: 'Executive', avgSalary: 260000, description: 'Engineering org leader' },
]

export const mockCompanies: Company[] = [
  { id: 'c-google',     name: 'Google',      industry: 'Technology',      size: 'Enterprise', location: 'Mountain View, CA' },
  { id: 'c-meta',       name: 'Meta',        industry: 'Technology',      size: 'Enterprise', location: 'Menlo Park, CA' },
  { id: 'c-stripe',     name: 'Stripe',      industry: 'Fintech',         size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-airbnb',     name: 'Airbnb',      industry: 'Travel',          size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-netflix',    name: 'Netflix',     industry: 'Streaming',       size: 'Enterprise', location: 'Los Gatos, CA' },
  { id: 'c-shopify',    name: 'Shopify',     industry: 'Ecommerce',       size: 'Scaleup',    location: 'Ottawa, Canada' },
  { id: 'c-databricks', name: 'Databricks',  industry: 'Data/AI',         size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-vercel',     name: 'Vercel',      industry: 'Developer Tools', size: 'Startup',    location: 'Remote' },
  { id: 'c-openai',     name: 'OpenAI',      industry: 'AI',              size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-twilio',     name: 'Twilio',      industry: 'Communication',   size: 'Enterprise', location: 'San Francisco, CA' },
]

// Role → Skills mapping
const roleSkillMap: Record<string, string[]> = {
  'r-intern':    ['s-python', 's-javascript', 's-sql'],
  'r-je':        ['s-python', 's-javascript', 's-sql', 's-react', 's-nodejs'],
  'r-swe':       ['s-python', 's-typescript', 's-sql', 's-react', 's-nodejs', 's-docker', 's-postgres'],
  'r-senior':    ['s-python', 's-typescript', 's-sql', 's-react', 's-nodejs', 's-docker', 's-k8s', 's-systemdesign', 's-redis'],
  'r-staff':     ['s-typescript', 's-go', 's-systemdesign', 's-microsvcs', 's-k8s', 's-terraform', 's-mentoring'],
  'r-principal': ['s-systemdesign', 's-microsvcs', 's-k8s', 's-terraform', 's-leadership', 's-mentoring'],
  'r-fellow':    ['s-systemdesign', 's-microsvcs', 's-leadership', 's-rust'],
  'r-fe':        ['s-javascript', 's-typescript', 's-react', 's-nextjs', 's-apidsgn'],
  'r-be':        ['s-python', 's-java', 's-go', 's-sql', 's-postgres', 's-redis', 's-docker', 's-apidsgn'],
  'r-fullstack': ['s-javascript', 's-typescript', 's-react', 's-nextjs', 's-nodejs', 's-sql', 's-postgres', 's-docker'],
  'r-devops':    ['s-docker', 's-k8s', 's-terraform', 's-cicd', 's-aws', 's-python'],
  'r-sre':       ['s-docker', 's-k8s', 's-terraform', 's-cicd', 's-aws', 's-go', 's-systemdesign'],
  'r-ml-eng':    ['s-python', 's-ml', 's-pytorch', 's-sql', 's-docker', 's-aws'],
  'r-data-eng':  ['s-python', 's-sql', 's-spark', 's-kafka', 's-aws', 's-docker', 's-postgres'],
  'r-em':        ['s-leadership', 's-mentoring', 's-systemdesign', 's-cicd'],
  'r-vp':        ['s-leadership', 's-mentoring', 's-systemdesign'],
}

// Career progression chains
const nextRoleMap: Record<string, string[]> = {
  'r-intern':    ['r-je'],
  'r-je':        ['r-swe', 'r-fe', 'r-be'],
  'r-swe':       ['r-senior', 'r-fullstack', 'r-devops', 'r-ml-eng', 'r-data-eng'],
  'r-fe':        ['r-senior', 'r-fullstack'],
  'r-be':        ['r-senior', 'r-devops'],
  'r-fullstack': ['r-senior'],
  'r-devops':    ['r-sre', 'r-senior'],
  'r-ml-eng':    ['r-senior'],
  'r-data-eng':  ['r-senior'],
  'r-sre':       ['r-staff'],
  'r-senior':    ['r-staff', 'r-em'],
  'r-staff':     ['r-principal'],
  'r-principal': ['r-fellow', 'r-vp'],
  'r-em':        ['r-vp'],
  'r-fellow':    [],
  'r-vp':        [],
}

// Company → Roles
const companyRoleMap: Record<string, string[]> = {
  'c-google':     ['r-swe', 'r-senior', 'r-staff', 'r-principal', 'r-sre', 'r-ml-eng'],
  'c-meta':       ['r-swe', 'r-senior', 'r-staff', 'r-ml-eng', 'r-fe'],
  'c-stripe':     ['r-swe', 'r-senior', 'r-be', 'r-sre', 'r-devops'],
  'c-airbnb':     ['r-swe', 'r-senior', 'r-fe', 'r-fullstack', 'r-data-eng'],
  'c-netflix':    ['r-swe', 'r-senior', 'r-staff', 'r-sre', 'r-data-eng'],
  'c-shopify':    ['r-swe', 'r-senior', 'r-fullstack', 'r-be', 'r-devops'],
  'c-databricks': ['r-data-eng', 'r-ml-eng', 'r-swe', 'r-senior', 'r-staff'],
  'c-vercel':     ['r-fe', 'r-fullstack', 'r-swe', 'r-devops'],
  'c-openai':     ['r-ml-eng', 'r-swe', 'r-senior', 'r-staff', 'r-principal'],
  'c-twilio':     ['r-be', 'r-swe', 'r-senior', 'r-devops', 'r-sre'],
}

// Related skills
const relatedSkillMap: Record<string, string[]> = {
  's-javascript': ['s-typescript', 's-nodejs'],
  's-typescript': ['s-javascript', 's-react'],
  's-react':      ['s-nextjs', 's-typescript'],
  's-nextjs':     ['s-react'],
  's-nodejs':     ['s-javascript'],
  's-python':     ['s-django', 's-fastapi', 's-ml'],
  's-docker':     ['s-k8s'],
  's-k8s':        ['s-docker', 's-terraform'],
  's-aws':        ['s-terraform'],
  's-ml':         ['s-pytorch'],
  's-spark':      ['s-kafka'],
  's-postgres':   ['s-sql'],
  's-systemdesign': ['s-microsvcs'],
  's-leadership': ['s-mentoring'],
}

function getSkillsForIds(ids: string[]): Skill[] {
  return ids.map(id => mockSkills.find(s => s.id === id)!).filter(Boolean)
}

function getRoleById(id: string): Role | undefined {
  return mockRoles.find(r => r.id === id)
}

// BFS to find shortest career path
function bfsPath(fromId: string, toId: string): string[] | null {
  if (fromId === toId) return [fromId]
  const queue: string[][] = [[fromId]]
  const visited = new Set<string>([fromId])
  while (queue.length) {
    const path = queue.shift()!
    const current = path[path.length - 1]
    for (const next of (nextRoleMap[current] || [])) {
      if (next === toId) return [...path, next]
      if (!visited.has(next)) {
        visited.add(next)
        queue.push([...path, next])
      }
    }
  }
  return null
}

// ─── Mock query functions ─────────────────────────────────────────────────────

export function mockGetAllSkills(): Skill[] {
  return [...mockSkills].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
}

export function mockGetSkillDetail(skillId: string): SkillDetail | null {
  const skill = mockSkills.find(s => s.id === skillId)
  if (!skill) return null
  const roles = mockRoles.filter(r => (roleSkillMap[r.id] || []).includes(skillId))
  const relatedIds = relatedSkillMap[skillId] || []
  const relatedSkills = getSkillsForIds(relatedIds)
  return { skill, roles, relatedSkills }
}

export function mockGetAllRoles(): Role[] {
  return mockRoles
}

export function mockGetRoleDetail(roleId: string): RoleDetail | null {
  const role = getRoleById(roleId)
  if (!role) return null
  const requiredSkills = getSkillsForIds(roleSkillMap[roleId] || [])
  const relatedRoles = (nextRoleMap[roleId] || []).map(id => getRoleById(id)!).filter(Boolean)
  const companies = mockCompanies.filter(c => (companyRoleMap[c.id] || []).includes(roleId))
  return { role, requiredSkills, relatedRoles, companies }
}

export function mockFindCareerPath(fromId: string, toId: string): CareerPath | null {
  const path = bfsPath(fromId, toId)
  if (!path) return null
  const from = getRoleById(fromId)!
  const to = getRoleById(toId)!
  const fromSkills = new Set(roleSkillMap[fromId] || [])
  const toSkills = roleSkillMap[toId] || []
  const commonSkills = getSkillsForIds(toSkills.filter(s => fromSkills.has(s)))
  const newSkillsNeeded = getSkillsForIds(toSkills.filter(s => !fromSkills.has(s)))
  return { from, to, commonSkills, newSkillsNeeded, hops: path.length - 1 }
}

export function mockSearchAll(query: string): { skills: Skill[]; roles: Role[] } {
  const q = query.toLowerCase()
  return {
    skills: mockSkills.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)),
    roles:  mockRoles.filter(r => r.name.toLowerCase().includes(q) || r.level.toLowerCase().includes(q)),
  }
}

export function mockGetAllCompanies(): Company[] {
  return [...mockCompanies].sort((a, b) => a.name.localeCompare(b.name))
}

export function mockGetGraphStats(): GraphStats {
  const totalRels =
    Object.values(roleSkillMap).reduce((a, v) => a + v.length, 0) +
    Object.values(nextRoleMap).reduce((a, v) => a + v.length, 0) +
    Object.values(relatedSkillMap).reduce((a, v) => a + v.length, 0) +
    Object.values(companyRoleMap).reduce((a, v) => a + v.length, 0)
  return {
    skills: mockSkills.length,
    roles: mockRoles.length,
    companies: mockCompanies.length,
    relationships: totalRels,
  }
}
