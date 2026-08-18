import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyConnectivity } from '@/lib/db'
import { getGraphStats } from '@/lib/queries'
import { mockGetGraphStats } from '@/lib/mockData'

const isMockMode = !process.env.COGNODB_URI || process.env.COGNODB_URI.includes('YOUR_INSTANCE_ID')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isMockMode) {
    return res.status(200).json({ connected: true, mock: true, stats: mockGetGraphStats() })
  }
  try {
    const [connected, stats] = await Promise.all([
      verifyConnectivity(),
      getGraphStats(),
    ])
    res.status(200).json({ connected, stats })
  } catch (error: any) {
    res.status(503).json({ connected: false, error: error.message })
  }
}
