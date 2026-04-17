import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Turso mode: use @libsql/client + @prisma/adapter-libsql when DATABASE_AUTH_TOKEN is set
  // In Vercel, the env var DATABASE_AUTH_TOKEN is injected automatically by Turso integration
  if (process.env.DATABASE_AUTH_TOKEN && process.env.DATABASE_URL?.startsWith('libsql:')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSQL } = require('@prisma/adapter-libsql')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@libsql/client')

    const libsql = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    })

    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter } as never)
  }

  // Local development: regular SQLite
  return new PrismaClient({
    log: ['query'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
