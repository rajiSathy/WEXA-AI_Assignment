import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllRoles, getRoleDetail } from '@/lib/queries'
import { mockGetAllRoles, mockGetRoleDetail } from '@/lib/mockData'

const isMockMode = !process.env.COGNODB_URI || process.env.COGNODB_URI.includes('YOUR_INSTANCE_ID')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (isMockMode) {
      if (id) {
        const role = mockGetRoleDetail(id as string)
        if (!role) return res.status(404).json({ error: 'Role not found' })
        return res.status(200).json(role)
      }
      return res.status(200).json(mockGetAllRoles())
    }
    if (id) {
      const role = await getRoleDetail(id as string)
      if (!role) return res.status(404).json({ error: 'Role not found' })
      return res.status(200).json(role)
    }
    const roles = await getAllRoles()
    return res.status(200).json(roles)
  } catch (error: any) {
    console.error('Roles API error:', error)
    res.status(503).json({ error: 'Database error: ' + error.message })
  }
}
