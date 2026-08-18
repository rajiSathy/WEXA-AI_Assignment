import type { NextApiRequest, NextApiResponse } from 'next'
import { findCareerPath } from '@/lib/queries'
import { mockFindCareerPath } from '@/lib/mockData'

const isMockMode = !process.env.COGNODB_URI || process.env.COGNODB_URI.includes('YOUR_INSTANCE_ID')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { from, to } = req.query
    if (!from || !to) {
      return res.status(400).json({ error: 'Both `from` and `to` role IDs are required' })
    }
    if (isMockMode) {
      const path = mockFindCareerPath(from as string, to as string)
      if (!path) return res.status(404).json({ error: 'No career path found between these roles' })
      return res.status(200).json(path)
    }
    const path = await findCareerPath(from as string, to as string)
    if (!path) return res.status(404).json({ error: 'No career path found between these roles' })
    return res.status(200).json(path)
  } catch (error: any) {
    console.error('Career path API error:', error)
    res.status(503).json({ error: 'Database error: ' + error.message })
  }
}
