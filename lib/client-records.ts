import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'

const CLIENT_USER_KEY_COLUMNS = ['"userId"', '"user_id"', '"userid"'] as const

type RawClientRow = {
  id: string
  companyName: string
  companyNameAr: string | null
  phone: string | null
  address: string | null
  userId: string
  userName: string
  userEmail: string
  userRole: string
  reportsCount?: number | bigint | string | null
}

function escapeSqlString(value: string) {
  return value.replace(/'/g, "''")
}

function sqlValue(value?: string | null) {
  if (value == null || value === '') {
    return 'NULL'
  }

  return `'${escapeSqlString(value)}'`
}

function isMissingColumnError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return message.includes('does not exist') || message.includes('column') || message.includes('Unknown argument `userId`')
}

async function tryClientQuery<T>(createSql: (userKeyColumn: string) => string) {
  let lastError: unknown

  for (const userKeyColumn of CLIENT_USER_KEY_COLUMNS) {
    try {
      return await prisma.$queryRawUnsafe<T[]>(createSql(userKeyColumn))
    } catch (error) {
      lastError = error
      if (!isMissingColumnError(error)) {
        throw error
      }
    }
  }

  throw lastError ?? new Error('Unable to query client records')
}

async function tryClientExecute(createSql: (userKeyColumn: string) => string) {
  let lastError: unknown

  for (const userKeyColumn of CLIENT_USER_KEY_COLUMNS) {
    try {
      await prisma.$executeRawUnsafe(createSql(userKeyColumn))
      return
    } catch (error) {
      lastError = error
      if (!isMissingColumnError(error)) {
        throw error
      }
    }
  }

  throw lastError ?? new Error('Unable to write client record')
}

function mapClientRow(row: RawClientRow) {
  return {
    id: row.id,
    companyName: row.companyName,
    companyNameAr: row.companyNameAr ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    userId: row.userId,
    user: {
      id: row.userId,
      name: row.userName,
      email: row.userEmail,
      role: row.userRole,
    },
    _count: {
      reports: Number(row.reportsCount ?? 0),
    },
  }
}

export async function listClientAccounts() {
  const rows = await tryClientQuery<RawClientRow>((userKeyColumn) => `
    SELECT
      c."id",
      c."companyName",
      c."companyNameAr",
      c."phone",
      c."address",
      u."id" AS "userId",
      u."name" AS "userName",
      u."email" AS "userEmail",
      u."role" AS "userRole",
      COUNT(r."id") AS "reportsCount"
    FROM "Client" c
    INNER JOIN "User" u ON c.${userKeyColumn} = u."id"
    LEFT JOIN "Report" r ON r."clientId" = c."id"
    GROUP BY c."id", c."companyName", c."companyNameAr", c."phone", c."address", u."id", u."name", u."email", u."role"
    ORDER BY c."createdat" DESC
  `)

  return rows.map(mapClientRow)
}

export async function getClientAccountById(id: string) {
  const rows = await tryClientQuery<RawClientRow>((userKeyColumn) => `
    SELECT
      c."id",
      c."companyName",
      c."companyNameAr",
      c."phone",
      c."address",
      u."id" AS "userId",
      u."name" AS "userName",
      u."email" AS "userEmail",
      u."role" AS "userRole",
      (
        SELECT COUNT(*)
        FROM "Report" r
        WHERE r."clientId" = c."id"
      ) AS "reportsCount"
    FROM "Client" c
    INNER JOIN "User" u ON c.${userKeyColumn} = u."id"
    WHERE c."id" = ${sqlValue(id)}
    LIMIT 1
  `)

  return rows[0] ? mapClientRow(rows[0]) : null
}

export async function getClientIdByUserId(userId: string) {
  const rows = await tryClientQuery<{ id: string }>((userKeyColumn) => `
    SELECT c."id"
    FROM "Client" c
    WHERE c.${userKeyColumn} = ${sqlValue(userId)}
    LIMIT 1
  `)

  return rows[0]?.id ?? null
}

export async function createClientAccount(input: {
  userId: string
  companyName: string
  companyNameAr?: string
  phone?: string
  address?: string
}) {
  const clientId = randomUUID()

  await tryClientExecute((userKeyColumn) => `
    INSERT INTO "Client" (
      "id",
      ${userKeyColumn},
      "companyName",
      "companyNameAr",
      "phone",
      "address",
      "createdat",
      "updatedat"
    ) VALUES (
      ${sqlValue(clientId)},
      ${sqlValue(input.userId)},
      ${sqlValue(input.companyName)},
      ${sqlValue(input.companyNameAr)},
      ${sqlValue(input.phone)},
      ${sqlValue(input.address)},
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
  `)

  return clientId
}

export async function updateClientAccount(
  clientId: string,
  input: {
    companyName: string
    companyNameAr?: string
    phone?: string
    address?: string
  }
) {
  await prisma.$executeRawUnsafe(`
    UPDATE "Client"
    SET
      "companyName" = ${sqlValue(input.companyName)},
      "companyNameAr" = ${sqlValue(input.companyNameAr)},
      "phone" = ${sqlValue(input.phone)},
      "address" = ${sqlValue(input.address)},
      "updatedat" = CURRENT_TIMESTAMP
    WHERE "id" = ${sqlValue(clientId)}
  `)
}

export async function deleteClientAccount(clientId: string) {
  await prisma.$executeRawUnsafe(`
    DELETE FROM "Client"
    WHERE "id" = ${sqlValue(clientId)}
  `)
}
