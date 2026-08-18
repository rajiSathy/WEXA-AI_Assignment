import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllSkills, getSkillDetail } from '@/lib/queries'
import { mockGetAllSkills, mockGetSkillDetail } from '@/lib/mockData'

const isMockMode = !process.env.COGNODB_URI || process.env.COGNODB_URI.includes('YOUR_INSTANCE_ID')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (isMockMode) {
      if (id) {
        const skill = mockGetSkillDetail(id as string)
        if (!skill) return res.status(404).json({ error: 'Skill not found' })
        return res.status(200).json(skill)
      }
      return res.status(200).json(mockGetAllSkills())
    }
    if (id) {
      const skill = await getSkillDetail(id as string)
      if (!skill) return res.status(404).json({ error: 'Skill not found' })
      return res.status(200).json(skill)
    }
    const skills = await getAllSkills()
    return res.status(200).json(skills)
  } catch (error: any) {
    console.error('Skills API error:', error)
    res.status(503).json({ error: 'Database error: ' + error.message })
  }
}
