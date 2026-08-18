import { runQuery } from './db'
import { Skill, Role, Company, CareerPath, RoleDetail, SkillDetail, GraphStats } from './types'
import neo4j from 'neo4j-driver'

function toInt(val: unknown): number {
  if (neo4j.isInt(val as any)) return (val as any).toNumber()
  return Number(val) || 0
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function getAllSkills(): Promise<Skill[]> {
  const rows = await runQuery<any>(`
    MATCH (s:Skill)
    RETURN s.id AS id, s.name AS name, s.category AS category,
           s.level AS level, s.description AS description
    ORDER BY s.category, s.name
  `)
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    level: r.level,
    description: r.description,
  }))
}

export async function getSkillDetail(skillId: string): Promise<SkillDetail | null> {
  const rows = await runQuery<any>(`
    MATCH (s:Skill {id: $skillId})
    OPTIONAL MATCH (s)<-[:REQUIRES]-(r:Role)
    OPTIONAL MATCH (s)-[:RELATED_TO]-(s2:Skill)
    RETURN s,
           collect(DISTINCT {id: r.id, name: r.name, level: r.level, avgSalary: r.avgSalary}) AS roles,
           collect(DISTINCT {id: s2.id, name: s2.name, category: s2.category}) AS relatedSkills
  `, { skillId })

  if (!rows.length || !rows[0].s) return null
  const row = rows[0]
  const s = row.s.properties
  return {
    skill: { id: s.id, name: s.name, category: s.category, level: s.level, description: s.description },
    roles: (row.roles || []).filter((r: any) => r.id).map((r: any) => ({
      id: r.id, name: r.name, level: r.level, avgSalary: toInt(r.avgSalary)
    })),
    relatedSkills: (row.relatedSkills || []).filter((s: any) => s.id).map((s: any) => ({
      id: s.id, name: s.name, category: s.category
    })),
  }
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export async function getAllRoles(): Promise<Role[]> {
  const rows = await runQuery<any>(`
    MATCH (r:Role)
    RETURN r.id AS id, r.name AS name, r.level AS level,
           r.avgSalary AS avgSalary, r.description AS description
    ORDER BY r.level, r.name
  `)
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    level: r.level,
    avgSalary: toInt(r.avgSalary),
    description: r.description,
  }))
}

export async function getRoleDetail(roleId: string): Promise<RoleDetail | null> {
  const rows = await runQuery<any>(`
    MATCH (r:Role {id: $roleId})
    OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)
    OPTIONAL MATCH (r)-[:NEXT_ROLE]->(r2:Role)
    OPTIONAL MATCH (c:Company)-[:HIRES_FOR]->(r)
    RETURN r,
           collect(DISTINCT {id: s.id, name: s.name, category: s.category, level: s.level}) AS skills,
           collect(DISTINCT {id: r2.id, name: r2.name, level: r2.level, avgSalary: r2.avgSalary}) AS nextRoles,
           collect(DISTINCT {id: c.id, name: c.name, industry: c.industry, size: c.size, location: c.location}) AS companies
  `, { roleId })

  if (!rows.length || !rows[0].r) return null
  const row = rows[0]
  const r = row.r.properties
  return {
    role: { id: r.id, name: r.name, level: r.level, avgSalary: toInt(r.avgSalary), description: r.description },
    requiredSkills: (row.skills || []).filter((s: any) => s.id).map((s: any) => ({
      id: s.id, name: s.name, category: s.category, level: s.level
    })),
    relatedRoles: (row.nextRoles || []).filter((r: any) => r.id).map((r: any) => ({
      id: r.id, name: r.name, level: r.level, avgSalary: toInt(r.avgSalary)
    })),
    companies: (row.companies || []).filter((c: any) => c.id).map((c: any) => ({
      id: c.id, name: c.name, industry: c.industry, size: c.size, location: c.location
    })),
  }
}

// ─── Career Path (multi-hop traversal) ──────────────────────────────────────

export async function findCareerPath(fromRoleId: string, toRoleId: string): Promise<CareerPath | null> {
  // Multi-hop traversal up to 5 hops via NEXT_ROLE relationships
  const rows = await runQuery<any>(`
    MATCH (from:Role {id: $fromRoleId}), (to:Role {id: $toRoleId})
    MATCH path = shortestPath((from)-[:NEXT_ROLE*1..5]->(to))
    WITH from, to, path, length(path) AS hops
    OPTIONAL MATCH (from)-[:REQUIRES]->(s1:Skill)<-[:REQUIRES]-(to)
    OPTIONAL MATCH (to)-[:REQUIRES]->(s2:Skill)
    WHERE NOT (from)-[:REQUIRES]->(s2)
    RETURN from, to, hops,
           collect(DISTINCT {id: s1.id, name: s1.name, category: s1.category}) AS commonSkills,
           collect(DISTINCT {id: s2.id, name: s2.name, category: s2.category}) AS newSkills
  `, { fromRoleId, toRoleId })

  if (!rows.length) return null
  const row = rows[0]
  const from = row.from?.properties
  const to = row.to?.properties
  if (!from || !to) return null

  return {
    from: { id: from.id, name: from.name, level: from.level, avgSalary: toInt(from.avgSalary) },
    to: { id: to.id, name: to.name, level: to.level, avgSalary: toInt(to.avgSalary) },
    commonSkills: (row.commonSkills || []).filter((s: any) => s.id),
    newSkillsNeeded: (row.newSkills || []).filter((s: any) => s.id),
    hops: toInt(row.hops),
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchAll(query: string): Promise<{ skills: Skill[]; roles: Role[] }> {
  const q = `(?i).*${query}.*`
  const rows = await runQuery<any>(`
    OPTIONAL MATCH (s:Skill) WHERE s.name =~ $q
    OPTIONAL MATCH (r:Role) WHERE r.name =~ $q
    RETURN collect(DISTINCT {id: s.id, name: s.name, category: s.category}) AS skills,
           collect(DISTINCT {id: r.id, name: r.name, level: r.level, avgSalary: r.avgSalary}) AS roles
  `, { q })

  if (!rows.length) return { skills: [], roles: [] }
  const row = rows[0]
  return {
    skills: (row.skills || []).filter((s: any) => s.id).map((s: any) => ({
      id: s.id, name: s.name, category: s.category
    })),
    roles: (row.roles || []).filter((r: any) => r.id).map((r: any) => ({
      id: r.id, name: r.name, level: r.level, avgSalary: toInt(r.avgSalary)
    })),
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getGraphStats(): Promise<GraphStats> {
  const rows = await runQuery<any>(`
    MATCH (n) WITH count(n) AS totalNodes
    MATCH ()-[r]->() WITH totalNodes, count(r) AS totalRels
    OPTIONAL MATCH (s:Skill) WITH totalNodes, totalRels, count(s) AS skills
    OPTIONAL MATCH (ro:Role) WITH totalNodes, totalRels, skills, count(ro) AS roles
    OPTIONAL MATCH (c:Company) RETURN skills, roles, count(c) AS companies, totalRels AS relationships
  `)
  if (!rows.length) return { skills: 0, roles: 0, companies: 0, relationships: 0 }
  const r = rows[0]
  return {
    skills: toInt(r.skills),
    roles: toInt(r.roles),
    companies: toInt(r.companies),
    relationships: toInt(r.relationships),
  }
}

// ─── Companies ────────────────────────────────────────────────────────────────

export async function getAllCompanies(): Promise<Company[]> {
  const rows = await runQuery<any>(`
    MATCH (c:Company)
    RETURN c.id AS id, c.name AS name, c.industry AS industry,
           c.size AS size, c.location AS location
    ORDER BY c.name
  `)
  return rows.map((r) => ({
    id: r.id, name: r.name, industry: r.industry, size: r.size, location: r.location,
  }))
}
