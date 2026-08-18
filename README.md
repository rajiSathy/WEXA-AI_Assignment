# SkillGraph — Tech Career Path Navigator

> **WeXA AI Take-Home Assignment** · Built on [CognoDB](https://console.cognodb.com) graph database

A full-stack web application that maps the connections between **skills**, **roles**, and **companies** in the tech industry — powered by a graph database. Discover the shortest career path between any two roles, see what skills you'd need to learn, and explore the hiring landscape at top companies.

---

## � Running Modes

This app supports **two modes** and switches automatically based on environment variables:

| Mode | When | What you see |
|------|------|-------------|
| 🟡 **Demo Mode** | No CognoDB credentials configured | Full app with built-in sample data (29 skills, 16 roles, 10 companies). A yellow banner appears on the homepage. |
| 🟢 **Live Mode** | Real CognoDB credentials in `.env.local` | Full app connected to your live CognoDB graph instance |

> **No configuration needed to run the app.** It works out of the box with sample data.  
> Simply add your CognoDB credentials to switch to live graph mode.

---

## ⚡ Quick Start (Demo Mode — no database required)

```bash
# 1. Install dependencies
npm install

# 2. Run the app — works immediately with sample data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app runs fully with built-in mock data. You will see a **"Demo Mode"** banner on the homepage.

---

## 🔌 Live Mode — Connect to CognoDB

To run the app against a real CognoDB graph database:

### Step 1 — Create a CognoDB Instance
1. Sign up for free at [console.cognodb.com/signup](https://console.cognodb.com/signup) — no credit card required
2. Click **"Create Instance"** → choose the free `c0` tier → pick any region
3. Wait ~1 minute for provisioning
4. Copy your **connection URI** (`bolt+s://...`) and **password** — the password is shown **only once**

### Step 2 — Configure credentials
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
COGNODB_URI=bolt+s://YOUR_INSTANCE_ID.databases.cognodb.cloud
COGNODB_USER=cognodb
COGNODB_PASSWORD=your_password_here
```

### Step 3 — Seed the database
```bash
npm run seed
```
This populates your CognoDB instance with **29 skills**, **16 roles**, **10 companies** and all their graph relationships.

Expected output:
```
🔗  Connecting to CognoDB...
✅  Connected!
🌱  Seeding 29 skills...
🌱  Seeding 16 roles...
🌱  Seeding 10 companies...
🔗  Creating REQUIRES relationships...
🔗  Creating NEXT_ROLE relationships...
🔗  Creating RELATED_TO relationships...
🔗  Creating HIRES_FOR relationships...
🎉  Seed complete!
```

### Step 4 — Restart and run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) — the Demo Mode banner will be gone and all data will be served live from CognoDB.

---

## �📸 Screenshots

> _Add screenshots of the app here after running it._

---

## 🤔 Why a Graph Database?

Career navigation is inherently a **graph problem**. The interesting questions are all about **relationships**:

- *"What is the shortest path from Junior Engineer to Staff Engineer?"* — multi-hop path traversal
- *"Which skills do I already have that overlap with my target role?"* — set intersection via graph
- *"What roles are reachable from my current position in at most 3 hops?"* — variable-length traversal

A relational schema would require multiple join tables (`role_skills`, `role_progression`, `company_roles`) and expensive multi-JOIN queries. The multi-hop query in SQL would look like:

```sql
-- Find path: Junior → SWE → Senior → Staff (3 hops)
-- Requires 3 self-joins on role_progression, or a CTE recursive query
WITH RECURSIVE path AS (...)
```

In CognoDB (openCypher), the same question is a single elegant expression:

```cypher
MATCH path = shortestPath(
  (from:Role {id: $fromId})-[:NEXT_ROLE*1..5]->(to:Role {id: $toId})
)
RETURN path, length(path) AS hops
```

Graph databases **earn their place** when:
1. The data is highly connected (skills ↔ roles ↔ companies ↔ skills)
2. Variable-length path traversal is a core query
3. Relationships are first-class data, not foreign-key noise

---

## 🗃️ Data Model

```
(Skill)-[:RELATED_TO]-(Skill)
   ↑
[:REQUIRES]
   |
(Role)-[:NEXT_ROLE]->(Role)
   ↑
[:HIRES_FOR]
   |
(Company)
```

### Nodes

| Label | Key Properties |
|-------|---------------|
| `Skill` | `id`, `name`, `category`, `level`, `description` |
| `Role`  | `id`, `name`, `level`, `avgSalary`, `description` |
| `Company` | `id`, `name`, `industry`, `size`, `location` |

### Relationships

| Type | From → To | Meaning |
|------|-----------|---------|
| `REQUIRES` | `Role → Skill` | This role needs this skill |
| `NEXT_ROLE` | `Role → Role` | Career progression path |
| `RELATED_TO` | `Skill ↔ Skill` | Skills are adjacent in the graph |
| `HIRES_FOR` | `Company → Role` | Company actively hires for this role |

---

## 🔑 Key Cypher Queries

### 1. Multi-hop Career Path (≥ 2 hops)
```cypher
MATCH (from:Role {id: $fromRoleId}), (to:Role {id: $toRoleId})
MATCH path = shortestPath((from)-[:NEXT_ROLE*1..5]->(to))
WITH from, to, path, length(path) AS hops
OPTIONAL MATCH (from)-[:REQUIRES]->(s1:Skill)<-[:REQUIRES]-(to)
OPTIONAL MATCH (to)-[:REQUIRES]->(s2:Skill)
WHERE NOT (from)-[:REQUIRES]->(s2)
RETURN from, to, hops,
       collect(DISTINCT s1) AS commonSkills,
       collect(DISTINCT s2) AS newSkillsNeeded
```

**Why this is awkward in SQL:** A variable-depth path search (`*1..5`) requires recursive CTEs or application-level BFS. The graph does it natively.

### 2. Skill Neighbourhood (related skills via shared roles)
```cypher
MATCH (s:Skill {id: $skillId})<-[:REQUIRES]-(r:Role)
MATCH (r)-[:REQUIRES]->(s2:Skill)
WHERE s2 <> s
RETURN s2, count(r) AS sharedRoles
ORDER BY sharedRoles DESC
```

### 3. Company → Role → Skill (3-hop traversal)
```cypher
MATCH (c:Company)-[:HIRES_FOR]->(r:Role)-[:REQUIRES]->(s:Skill)
WHERE c.name = $company
RETURN r.name AS role, collect(s.name) AS skills
ORDER BY r.level
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- A [CognoDB Cloud](https://console.cognodb.com) account *(only needed for Live Mode — free tier, no credit card)*

### Install & Run (Demo Mode)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) — works immediately with sample data.

### Switch to Live Mode
See the **[🔌 Live Mode — Connect to CognoDB](#-live-mode--connect-to-cognodb)** section above.

---

## 📁 Project Structure

```
WeXA-SkillGraph/
├── lib/
│   ├── db.ts          # CognoDB driver (Neo4j official driver)
│   ├── queries.ts     # All Cypher queries (parameterised)
│   └── types.ts       # TypeScript interfaces
├── pages/
│   ├── index.tsx      # Overview + stats
│   ├── skills/
│   │   ├── index.tsx  # Skills browser with filtering
│   │   └── [id].tsx   # Skill detail + connections
│   ├── roles/
│   │   ├── index.tsx  # Roles list with salary bars
│   │   └── [id].tsx   # Role detail + skills + companies
│   ├── companies.tsx  # Company directory
│   ├── career-path.tsx# 🌟 Multi-hop career path finder
│   ├── search.tsx     # Live cross-entity search
│   └── api/           # Next.js API routes
│       ├── health.ts
│       ├── skills.ts
│       ├── roles.ts
│       ├── companies.ts
│       ├── career-path.ts
│       └── search.ts
├── components/
│   ├── Layout.tsx     # Nav + shell
│   ├── Badges.tsx     # Skill/level/category badges
│   ├── LoadingSpinner.tsx
│   └── ErrorStates.tsx# DB error, empty state
├── scripts/
│   └── seed.js        # Database seeding script
├── styles/
│   └── globals.css    # Tailwind CSS
├── .env.example       # Environment variable template
└── .gitignore         # .env.local excluded
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (Pages Router) |
| Language | TypeScript |
| Database | CognoDB (openCypher / Bolt 5) |
| DB Driver | `neo4j-driver` (official) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Hosting | Vercel (recommended) |

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add the following environment variables in the Vercel dashboard (**Settings → Environment Variables**):

   | Variable | Value |
   |----------|-------|
   | `COGNODB_URI` | `bolt+s://YOUR_INSTANCE_ID.databases.cognodb.cloud` |
   | `COGNODB_USER` | `cognodb` |
   | `COGNODB_PASSWORD` | your CognoDB password |

4. Deploy — the hosted app will connect to your live CognoDB automatically

> **Without env vars set on Vercel**, the hosted app will still run in Demo Mode with sample data — it will never crash or show a blank page.

---

## 📧 Submission

Email the repository URL to **hr@wexa.ai** with subject:
`CognoDB Assignment 2 – <Your Name>`
