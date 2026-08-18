export interface Skill {
  id: string
  name: string
  category: string
  level?: string
  description?: string
}

export interface Role {
  id: string
  name: string
  level: string
  avgSalary: number
  description?: string
}

export interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
}

export interface CareerPath {
  from: Role
  to: Role
  commonSkills: Skill[]
  newSkillsNeeded: Skill[]
  hops: number
}

export interface RoleDetail {
  role: Role
  requiredSkills: Skill[]
  relatedRoles: Role[]
  companies: Company[]
}

export interface SkillDetail {
  skill: Skill
  roles: Role[]
  relatedSkills: Skill[]
}

export interface GraphStats {
  skills: number
  roles: number
  companies: number
  relationships: number
}
