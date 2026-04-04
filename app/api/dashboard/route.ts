import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getClientIdByUserId } from '@/lib/client-records'
import { listReportRecords } from '@/lib/report-records'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = session.user.role === 'CLIENT'
      ? await getClientIdByUserId(session.user.id)
      : null

    const reports = await listReportRecords({
      clientId: clientId ?? undefined,
    })
    const reportIds = reports.map((report) => report.id)

    const openObservations = await prisma.observation.count({
      where: {
        ...(reportIds.length > 0 ? { reportId: { in: reportIds } } : clientId ? { reportId: '__none__' } : {}),
        status: 'OPEN',
      },
    })

    const closedReports = reports.filter((report) => report.status === 'CLOSED').length

    const highRiskItems = await prisma.observation.count({
      where: {
        ...(reportIds.length > 0 ? { reportId: { in: reportIds } } : clientId ? { reportId: '__none__' } : {}),
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
      where: {
        ...(reportIds.length > 0 ? { reportId: { in: reportIds } } : clientId ? { reportId: '__none__' } : {}),
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
      where: reportIds.length > 0 ? { reportId: { in: reportIds } } : clientId ? { reportId: '__none__' } : undefined,
      _count: {
        status: true,
      },
    })

    const recentReports = reports.slice(0, 5).map((report) => ({
      ...report,
      _count: {
        observations: report.observations.length,
      },
    }))

    return NextResponse.json({
      totalReports: reports.length,
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
