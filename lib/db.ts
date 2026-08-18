import neo4j, { Driver, Session } from 'neo4j-driver'

let driver: Driver | null = null

function getDriver(): Driver {
  if (driver) return driver

  const uri = process.env.COGNODB_URI
  const user = process.env.COGNODB_USER
  const password = process.env.COGNODB_PASSWORD

  if (!uri || !user || !password) {
    throw new Error(
      'Missing database environment variables: COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD'
    )
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionLifetime: 3 * 60 * 60 * 1000,
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 30000,
  })

  return driver
}

export function getSession(): Session {
  return getDriver().session({ database: 'neo4j' })
}

export async function runQuery<T = unknown>(
  cypher: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  const session = getSession()
  try {
    const result = await session.run(cypher, params)
    return result.records.map((r) => r.toObject() as T)
  } finally {
    await session.close()
  }
}

export async function verifyConnectivity(): Promise<boolean> {
  try {
    await getDriver().verifyConnectivity()
    return true
  } catch {
    return false
  }
}
