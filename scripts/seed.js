/**
 * Seed script for SkillGraph
 * Run: node scripts/seed.js
 * Requires .env.local with COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD
 */

require('dotenv').config({ path: '.env.local' })
const neo4j = require('neo4j-driver')

const uri      = process.env.COGNODB_URI
const user     = process.env.COGNODB_USER
const password = process.env.COGNODB_PASSWORD

if (!uri || !user || !password) {
  console.error('❌  Missing environment variables. Copy .env.example → .env.local and fill in your CognoDB credentials.')
  process.exit(1)
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  connectionAcquisitionTimeout: 30000,
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const skills = [
  // Languages
  { id: 's-python',     name: 'Python',           category: 'Language',   level: 'Core',       description: 'General-purpose programming language' },
  { id: 's-javascript', name: 'JavaScript',        category: 'Language',   level: 'Core',       description: 'Web scripting language' },
  { id: 's-typescript', name: 'TypeScript',        category: 'Language',   level: 'Core',       description: 'Typed superset of JavaScript' },
  { id: 's-java',       name: 'Java',              category: 'Language',   level: 'Core',       description: 'Enterprise programming language' },
  { id: 's-go',         name: 'Go',                category: 'Language',   level: 'Core',       description: 'Systems language by Google' },
  { id: 's-rust',       name: 'Rust',              category: 'Language',   level: 'Advanced',   description: 'Memory-safe systems language' },
  { id: 's-sql',        name: 'SQL',               category: 'Database',   level: 'Core',       description: 'Relational database query language' },
  // Frameworks
  { id: 's-react',      name: 'React',             category: 'Frontend',   level: 'Core',       description: 'UI component library' },
  { id: 's-nextjs',     name: 'Next.js',           category: 'Frontend',   level: 'Core',       description: 'React framework for production' },
  { id: 's-nodejs',     name: 'Node.js',           category: 'Backend',    level: 'Core',       description: 'JavaScript runtime for servers' },
  { id: 's-django',     name: 'Django',            category: 'Backend',    level: 'Core',       description: 'Python web framework' },
  { id: 's-fastapi',    name: 'FastAPI',           category: 'Backend',    level: 'Core',       description: 'Modern Python API framework' },
  { id: 's-springboot', name: 'Spring Boot',       category: 'Backend',    level: 'Core',       description: 'Java enterprise framework' },
  // Cloud / DevOps
  { id: 's-aws',        name: 'AWS',               category: 'Cloud',      level: 'Core',       description: 'Amazon Web Services' },
  { id: 's-gcp',        name: 'GCP',               category: 'Cloud',      level: 'Core',       description: 'Google Cloud Platform' },
  { id: 's-azure',      name: 'Azure',             category: 'Cloud',      level: 'Core',       description: 'Microsoft Azure cloud' },
  { id: 's-docker',     name: 'Docker',            category: 'DevOps',     level: 'Core',       description: 'Container platform' },
  { id: 's-k8s',        name: 'Kubernetes',        category: 'DevOps',     level: 'Advanced',   description: 'Container orchestration' },
  { id: 's-terraform',  name: 'Terraform',         category: 'DevOps',     level: 'Advanced',   description: 'Infrastructure as code' },
  { id: 's-cicd',       name: 'CI/CD',             category: 'DevOps',     level: 'Core',       description: 'Continuous integration & deployment' },
  // Data / ML
  { id: 's-ml',         name: 'Machine Learning',  category: 'AI/ML',      level: 'Advanced',   description: 'Predictive modeling' },
  { id: 's-dl',         name: 'Deep Learning',     category: 'AI/ML',      level: 'Advanced',   description: 'Neural network training' },
  { id: 's-pytorch',    name: 'PyTorch',           category: 'AI/ML',      level: 'Advanced',   description: 'ML framework by Meta' },
  { id: 's-spark',      name: 'Apache Spark',      category: 'Data',       level: 'Advanced',   description: 'Distributed data processing' },
  { id: 's-kafka',      name: 'Apache Kafka',      category: 'Data',       level: 'Advanced',   description: 'Event streaming platform' },
  // Databases
  { id: 's-postgres',   name: 'PostgreSQL',        category: 'Database',   level: 'Core',       description: 'Open-source relational DB' },
  { id: 's-mongodb',    name: 'MongoDB',           category: 'Database',   level: 'Core',       description: 'NoSQL document database' },
  { id: 's-redis',      name: 'Redis',             category: 'Database',   level: 'Core',       description: 'In-memory data store' },
  { id: 's-neo4j',      name: 'Neo4j/CognoDB',     category: 'Database',   level: 'Advanced',   description: 'Graph database' },
  // Architecture
  { id: 's-microsvcs',  name: 'Microservices',     category: 'Architecture', level: 'Advanced', description: 'Distributed service architecture' },
  { id: 's-systemdesign', name: 'System Design',   category: 'Architecture', level: 'Advanced', description: 'Scalable system architecture' },
  { id: 's-apidsgn',   name: 'API Design',         category: 'Architecture', level: 'Core',     description: 'RESTful and GraphQL API design' },
  // Soft skills
  { id: 's-leadership', name: 'Tech Leadership',   category: 'Leadership', level: 'Advanced',   description: 'Leading engineering teams' },
  { id: 's-mentoring',  name: 'Mentoring',         category: 'Leadership', level: 'Advanced',   description: 'Coaching junior engineers' },
]

const roles = [
  { id: 'r-intern',      name: 'Software Engineering Intern', level: 'Intern',    avgSalary: 45000,  description: 'Entry-level internship role' },
  { id: 'r-je',          name: 'Junior Engineer',             level: 'Junior',    avgSalary: 70000,  description: 'First full-time engineering role' },
  { id: 'r-swe',         name: 'Software Engineer',           level: 'Mid',       avgSalary: 110000, description: 'Core individual contributor' },
  { id: 'r-senior',      name: 'Senior Engineer',             level: 'Senior',    avgSalary: 150000, description: 'Technical expert & mentor' },
  { id: 'r-staff',       name: 'Staff Engineer',              level: 'Staff',     avgSalary: 185000, description: 'Cross-team technical leader' },
  { id: 'r-principal',   name: 'Principal Engineer',          level: 'Principal', avgSalary: 220000, description: 'Org-wide technical direction' },
  { id: 'r-fellow',      name: 'Distinguished Engineer',      level: 'Fellow',    avgSalary: 280000, description: 'Industry-recognized expert' },
  { id: 'r-fe',          name: 'Frontend Engineer',           level: 'Mid',       avgSalary: 105000, description: 'Specialised in UI/UX engineering' },
  { id: 'r-be',          name: 'Backend Engineer',            level: 'Mid',       avgSalary: 115000, description: 'Server-side systems engineer' },
  { id: 'r-fullstack',   name: 'Full-Stack Engineer',         level: 'Mid',       avgSalary: 112000, description: 'End-to-end web developer' },
  { id: 'r-devops',      name: 'DevOps Engineer',             level: 'Mid',       avgSalary: 120000, description: 'CI/CD and infrastructure' },
  { id: 'r-sre',         name: 'Site Reliability Engineer',   level: 'Senior',    avgSalary: 155000, description: 'Production reliability & scale' },
  { id: 'r-ml-eng',      name: 'ML Engineer',                 level: 'Mid',       avgSalary: 130000, description: 'Building ML systems' },
  { id: 'r-data-eng',    name: 'Data Engineer',               level: 'Mid',       avgSalary: 115000, description: 'Data pipelines & warehousing' },
  { id: 'r-em',          name: 'Engineering Manager',         level: 'Manager',   avgSalary: 180000, description: 'People & delivery management' },
  { id: 'r-vp',          name: 'VP of Engineering',           level: 'Executive', avgSalary: 260000, description: 'Engineering org leader' },
]

const companies = [
  { id: 'c-google',    name: 'Google',       industry: 'Technology', size: 'Enterprise', location: 'Mountain View, CA' },
  { id: 'c-meta',      name: 'Meta',         industry: 'Technology', size: 'Enterprise', location: 'Menlo Park, CA' },
  { id: 'c-stripe',    name: 'Stripe',       industry: 'Fintech',    size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-airbnb',    name: 'Airbnb',       industry: 'Travel',     size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-netflix',   name: 'Netflix',      industry: 'Streaming',  size: 'Enterprise', location: 'Los Gatos, CA' },
  { id: 'c-shopify',   name: 'Shopify',      industry: 'Ecommerce',  size: 'Scaleup',    location: 'Ottawa, Canada' },
  { id: 'c-databricks',name: 'Databricks',   industry: 'Data/AI',    size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-vercel',    name: 'Vercel',       industry: 'Developer Tools', size: 'Startup', location: 'Remote' },
  { id: 'c-openai',    name: 'OpenAI',       industry: 'AI',         size: 'Scaleup',    location: 'San Francisco, CA' },
  { id: 'c-twilio',    name: 'Twilio',       industry: 'Communication', size: 'Enterprise', location: 'San Francisco, CA' },
]

const roleSkills = [
  { role: 'r-intern',    skills: ['s-python', 's-javascript', 's-sql', 's-git'] },
  { role: 'r-je',        skills: ['s-python', 's-javascript', 's-sql', 's-react', 's-nodejs'] },
  { role: 'r-swe',       skills: ['s-python', 's-javascript', 's-typescript', 's-sql', 's-react', 's-nodejs', 's-docker', 's-postgres'] },
  { role: 'r-senior',    skills: ['s-python', 's-typescript', 's-sql', 's-react', 's-nodejs', 's-docker', 's-k8s', 's-systemdesign', 's-postgres', 's-redis'] },
  { role: 'r-staff',     skills: ['s-typescript', 's-go', 's-systemdesign', 's-microsvcs', 's-k8s', 's-terraform', 's-mentoring'] },
  { role: 'r-principal', skills: ['s-systemdesign', 's-microsvcs', 's-k8s', 's-terraform', 's-leadership', 's-mentoring'] },
  { role: 'r-fellow',    skills: ['s-systemdesign', 's-microsvcs', 's-leadership', 's-rust'] },
  { role: 'r-fe',        skills: ['s-javascript', 's-typescript', 's-react', 's-nextjs', 's-apidsgn'] },
  { role: 'r-be',        skills: ['s-python', 's-java', 's-go', 's-sql', 's-postgres', 's-redis', 's-docker', 's-apidsgn'] },
  { role: 'r-fullstack', skills: ['s-javascript', 's-typescript', 's-react', 's-nextjs', 's-nodejs', 's-sql', 's-postgres', 's-docker'] },
  { role: 'r-devops',    skills: ['s-docker', 's-k8s', 's-terraform', 's-cicd', 's-aws', 's-python'] },
  { role: 'r-sre',       skills: ['s-docker', 's-k8s', 's-terraform', 's-cicd', 's-aws', 's-python', 's-go', 's-systemdesign'] },
  { role: 'r-ml-eng',    skills: ['s-python', 's-ml', 's-dl', 's-pytorch', 's-sql', 's-docker', 's-aws'] },
  { role: 'r-data-eng',  skills: ['s-python', 's-sql', 's-spark', 's-kafka', 's-aws', 's-docker', 's-postgres'] },
  { role: 'r-em',        skills: ['s-leadership', 's-mentoring', 's-systemdesign', 's-cicd'] },
  { role: 'r-vp',        skills: ['s-leadership', 's-mentoring', 's-systemdesign'] },
]

// Career progression chains
const nextRoles = [
  ['r-intern',    'r-je'],
  ['r-je',        'r-swe'],
  ['r-je',        'r-fe'],
  ['r-je',        'r-be'],
  ['r-swe',       'r-senior'],
  ['r-swe',       'r-fullstack'],
  ['r-swe',       'r-devops'],
  ['r-swe',       'r-ml-eng'],
  ['r-swe',       'r-data-eng'],
  ['r-fe',        'r-senior'],
  ['r-fe',        'r-fullstack'],
  ['r-be',        'r-senior'],
  ['r-be',        'r-devops'],
  ['r-fullstack', 'r-senior'],
  ['r-devops',    'r-sre'],
  ['r-devops',    'r-senior'],
  ['r-ml-eng',    'r-senior'],
  ['r-data-eng',  'r-senior'],
  ['r-senior',    'r-staff'],
  ['r-senior',    'r-em'],
  ['r-staff',     'r-principal'],
  ['r-sre',       'r-staff'],
  ['r-principal', 'r-fellow'],
  ['r-principal', 'r-vp'],
  ['r-em',        'r-vp'],
]

// Related skills
const relatedSkills = [
  ['s-javascript', 's-typescript'],
  ['s-react',      's-nextjs'],
  ['s-nodejs',     's-javascript'],
  ['s-django',     's-python'],
  ['s-fastapi',    's-python'],
  ['s-springboot', 's-java'],
  ['s-docker',     's-k8s'],
  ['s-aws',        's-gcp'],
  ['s-aws',        's-azure'],
  ['s-ml',         's-dl'],
  ['s-ml',         's-pytorch'],
  ['s-spark',      's-kafka'],
  ['s-postgres',   's-sql'],
  ['s-mongodb',    's-sql'],
  ['s-microsvcs',  's-systemdesign'],
  ['s-leadership', 's-mentoring'],
  ['s-k8s',        's-terraform'],
]

// Company ↔ Role hiring
const companyHires = [
  { company: 'c-google',     roles: ['r-swe', 'r-senior', 'r-staff', 'r-principal', 'r-sre', 'r-ml-eng'] },
  { company: 'c-meta',       roles: ['r-swe', 'r-senior', 'r-staff', 'r-ml-eng', 'r-fe'] },
  { company: 'c-stripe',     roles: ['r-swe', 'r-senior', 'r-be', 'r-sre', 'r-devops'] },
  { company: 'c-airbnb',     roles: ['r-swe', 'r-senior', 'r-fe', 'r-fullstack', 'r-data-eng'] },
  { company: 'c-netflix',    roles: ['r-swe', 'r-senior', 'r-staff', 'r-sre', 'r-data-eng'] },
  { company: 'c-shopify',    roles: ['r-swe', 'r-senior', 'r-fullstack', 'r-be', 'r-devops'] },
  { company: 'c-databricks', roles: ['r-data-eng', 'r-ml-eng', 'r-swe', 'r-senior', 'r-staff'] },
  { company: 'c-vercel',     roles: ['r-fe', 'r-fullstack', 'r-swe', 'r-devops'] },
  { company: 'c-openai',     roles: ['r-ml-eng', 'r-swe', 'r-senior', 'r-staff', 'r-principal'] },
  { company: 'c-twilio',     roles: ['r-be', 'r-swe', 'r-senior', 'r-devops', 'r-sre'] },
]

// ─── Seeding ──────────────────────────────────────────────────────────────────

async function seed() {
  const session = driver.session()
  try {
    console.log('🔗  Connecting to CognoDB...')
    await driver.verifyConnectivity()
    console.log('✅  Connected!\n')

    console.log('🧹  Clearing existing data...')
    await session.run('MATCH (n) DETACH DELETE n')
    console.log('   Done.\n')

    console.log('🌱  Creating constraints...')
    await session.run('CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE')
    await session.run('CREATE CONSTRAINT role_id  IF NOT EXISTS FOR (r:Role)  REQUIRE r.id IS UNIQUE')
    await session.run('CREATE CONSTRAINT co_id    IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE')
    console.log('   Done.\n')

    console.log(`🌱  Seeding ${skills.length} skills...`)
    for (const s of skills) {
      await session.run(
        `MERGE (s:Skill {id: $id})
         SET s.name = $name, s.category = $category,
             s.level = $level, s.description = $description`,
        s
      )
    }

    console.log(`🌱  Seeding ${roles.length} roles...`)
    for (const r of roles) {
      await session.run(
        `MERGE (r:Role {id: $id})
         SET r.name = $name, r.level = $level,
             r.avgSalary = $avgSalary, r.description = $description`,
        r
      )
    }

    console.log(`🌱  Seeding ${companies.length} companies...`)
    for (const c of companies) {
      await session.run(
        `MERGE (c:Company {id: $id})
         SET c.name = $name, c.industry = $industry,
             c.size = $size, c.location = $location`,
        c
      )
    }

    console.log('🔗  Creating REQUIRES relationships...')
    for (const { role, skills: sIds } of roleSkills) {
      for (const skillId of sIds) {
        await session.run(
          `MATCH (r:Role {id: $role}), (s:Skill {id: $skillId})
           MERGE (r)-[:REQUIRES]->(s)`,
          { role, skillId }
        )
      }
    }

    console.log('🔗  Creating NEXT_ROLE relationships...')
    for (const [from, to] of nextRoles) {
      await session.run(
        `MATCH (a:Role {id: $from}), (b:Role {id: $to})
         MERGE (a)-[:NEXT_ROLE]->(b)`,
        { from, to }
      )
    }

    console.log('🔗  Creating RELATED_TO relationships...')
    for (const [a, b] of relatedSkills) {
      await session.run(
        `MATCH (s1:Skill {id: $a}), (s2:Skill {id: $b})
         MERGE (s1)-[:RELATED_TO]-(s2)`,
        { a, b }
      )
    }

    console.log('🔗  Creating HIRES_FOR relationships...')
    for (const { company, roles: rIds } of companyHires) {
      for (const roleId of rIds) {
        await session.run(
          `MATCH (c:Company {id: $company}), (r:Role {id: $roleId})
           MERGE (c)-[:HIRES_FOR]->(r)`,
          { company, roleId }
        )
      }
    }

    console.log('\n🎉  Seed complete!')
    console.log(`   Skills:        ${skills.length}`)
    console.log(`   Roles:         ${roles.length}`)
    console.log(`   Companies:     ${companies.length}`)
    console.log(`   Skill→Role:    ${roleSkills.reduce((a, r) => a + r.skills.length, 0)}`)
    console.log(`   Career hops:   ${nextRoles.length}`)
    console.log(`   Skill links:   ${relatedSkills.length}`)
    console.log(`   Hiring links:  ${companyHires.reduce((a, c) => a + c.roles.length, 0)}`)

  } catch (err) {
    console.error('❌  Seed failed:', err.message)
    process.exit(1)
  } finally {
    await session.close()
    await driver.close()
  }
}

seed()
