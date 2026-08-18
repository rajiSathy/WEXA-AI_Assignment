import type { NextApiRequest, NextApiResponse } from 'next'
import { searchAll } from '@/lib/queries'
import { mockSearchAll } from '@/lib/mockData'

const isMockMode = !process.env.COGNODB_URI || process.env.COGNODB_URI.includes('YOUR_INSTANCE_ID')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' })
    }
    if (isMockMode) {
      return res.status(200).json(mockSearchAll(q.trim()))
    }
    const results = await searchAll(q.trim())
    return res.status(200).json(results)
  } catch (error: any) {
    console.error('Search API error:', error)
    res.status(503).json({ error: 'Database error: ' + error.message })
  }
}
