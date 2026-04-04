import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getClientIdByUserId } from '@/lib/client-records'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = session.user.role === 'CLIENT'
      ? await getClientIdByUserId(session.user.id)
      : null

    const reports = await prisma.report.count({
      where: clientId ? { clientId } : undefined,
    })

    const openObservations = await prisma.observation.count({
      where: clientId
        ? {
            report: {
              clientId,
            },
            status: 'OPEN',
          }
        : {
            status: 'OPEN',
          },
    })

    const closedReports = await prisma.report.count({
      where: clientId
        ? {
            clientId,
            status: 'CLOSED',
          }
        : {
            status: 'CLOSED',
          },
    })

    const highRiskItems = await prisma.observation.count({
      where: clientId
        ? {
            report: {
              clientId,
            },
            riskLevel: {
              in: ['HIGH', 'CRITICAL'],
            },
            status: {
              in: ['OPEN', 'IN_PROGRESS'],
            },
          }
        : {
            riskLevel: {
              in: ['HIGH', 'CRITICAL'],
            },
            status: {
              in: ['OPEN', 'IN_PROGRESS'],
            },
          },
    })

    const riskBreakdown = await prisma.observation.groupBy({
      by: ['riskLevel'],
      where: clientId
        ? {
            report: {
              clientId,
            },
            status: {
              in: ['OPEN', 'IN_PROGRESS'],
            },
          }
        : {
            status: {
              in: ['OPEN', 'IN_PROGRESS'],
            },
          },
      _count: {
        riskLevel: true,
      },
    })

    const statusBreakdown = await prisma.observation.groupBy({
      by: ['status'],
      where: clientId
        ? {
            report: {
              clientId,
            },
          }
        : undefined,
      _count: {
        status: true,
      },
    })

    const recentReports = await prisma.report.findMany({
      where: clientId
        ? {
            clientId,
          }
        : undefined,
      take: 5,
      orderBy: {
        date: 'desc',
      },
      include: {
        client: true,
        _count: {
          select: {
            observations: true,
          },
        },
      },
    })

    return NextResponse.json({
      totalReports: reports,
      openObservations,
      closedReports,
      highRiskItems,
      riskBreakdown,
      statusBreakdown,
      recentReports,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
