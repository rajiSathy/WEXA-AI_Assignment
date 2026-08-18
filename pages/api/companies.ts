import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllCompanies } from '@/lib/queries'
import { mockGetAllCompanies } from '@/lib/mockData'

const isMockMode = !process.env.COGNODB_URI || process.env.COGNODB_URI.includes('YOUR_INSTANCE_ID')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (isMockMode) return res.status(200).json(mockGetAllCompanies())
    const companies = await getAllCompanies()
    return res.status(200).json(companies)
  } catch (error: any) {
    console.error('Companies API error:', error)
    res.status(503).json({ error: 'Database error: ' + error.message })
  }
}
