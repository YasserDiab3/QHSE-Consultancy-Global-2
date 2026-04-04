'use client'

import { useLanguage } from '@/context'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react'
import Header from '@/components/Header'
import AdminReports from './admin-reports'
import AdminClients from './admin-clients'
import AdminActivityLog from './admin-activity-log'
import AdminContactRequests from './admin-contact-requests'

type DashboardStats = {
  totalReports: number
  openObservations: number
  closedReports: number
  highRiskItems: number
  riskBreakdown: { riskLevel: string; _count: { riskLevel: number } }[]
  statusBreakdown: { status: string; _count: { status: number } }[]
  recentReports: any[]
}

export default function AdminDashboardClient() {
  const { t, language, dir } = useLanguage()
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'clients' | 'requests' | 'activity'>('overview')

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const tabs = useMemo(
    () => [
      { id: 'overview' as const, label: t('dashboard.title'), icon: BarChart3 },
      { id: 'reports' as const, label: t('admin.reports'), icon: FileText },
      { id: 'clients' as const, label: t('admin.clients'), icon: Users },
      { id: 'requests' as const, label: language === 'ar' ? 'طلبات التواصل' : 'Contact Requests', icon: MessageSquare },
      { id: 'activity' as const, label: t('admin.activityLog'), icon: Activity },
    ],
    [language, t]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pb-12 pt-20">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{t('admin.title')}</h1>
            <p className="mt-1 text-gray-600">
              {t('dashboard.welcome')}, {session?.user?.name}
            </p>
          </div>

          <div className="mb-8 flex w-fit items-center gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && <OverviewTab stats={stats} loading={loading} t={t} dir={dir} />}
          {activeTab === 'reports' && <AdminReports />}
          {activeTab === 'clients' && <AdminClients />}
          {activeTab === 'requests' && <AdminContactRequests />}
          {activeTab === 'activity' && <AdminActivityLog />}
        </div>
      </main>
    </div>
  )
}

function OverviewTab({
  stats,
  loading,
  t,
  dir,
}: {
  stats: DashboardStats | null
  loading: boolean
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}) {
  const textAlign = dir === 'rtl' ? 'text-right' : 'text-left'

  const summaryCards = [
    {
      label: t('dashboard.totalReports'),
      value: stats?.totalReports || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: t('dashboard.openObservations'),
      value: stats?.openObservations || 0,
      icon: AlertTriangle,
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: t('dashboard.closedReports'),
      value: stats?.closedReports || 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: t('dashboard.highRiskItems'),
      value: stats?.highRiskItems || 0,
      icon: TrendingUp,
      color: 'from-red-500 to-red-600',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="card animate-pulse">
            <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
            <div className="h-8 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="card transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{card.label}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-6 text-lg font-bold text-gray-900">{t('dashboard.riskOverview')}</h3>
          <div className="space-y-4">
            {stats?.riskBreakdown?.map((item) => {
              const colors: Record<string, string> = {
                LOW: 'bg-green-500',
                MEDIUM: 'bg-yellow-500',
                HIGH: 'bg-orange-500',
                CRITICAL: 'bg-red-500',
              }
              const total = stats.riskBreakdown.reduce((sum, i) => sum + i._count.riskLevel, 0)
              const percentage = total > 0 ? (item._count.riskLevel / total) * 100 : 0

              return (
                <div key={item.riskLevel}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {t(`riskLevels.${item.riskLevel.toLowerCase()}`)}
                    </span>
                    <span className="text-sm text-gray-500">{item._count.riskLevel}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${colors[item.riskLevel] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-6 text-lg font-bold text-gray-900">{t('dashboard.statusDistribution')}</h3>
          <div className="space-y-4">
            {stats?.statusBreakdown?.map((item) => {
              const colors: Record<string, string> = {
                OPEN: 'bg-blue-500',
                CLOSED: 'bg-gray-500',
                IN_PROGRESS: 'bg-purple-500',
                RESOLVED: 'bg-emerald-500',
              }
              const total = stats.statusBreakdown.reduce((sum, i) => sum + i._count.status, 0)
              const percentage = total > 0 ? (item._count.status / total) * 100 : 0

              return (
                <div key={item.status}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {t(`statuses.${item.status.toLowerCase()}`)}
                    </span>
                    <span className="text-sm text-gray-500">{item._count.status}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${colors[item.status] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{t('dashboard.recentReports')}</h3>
          <Link href="/admin" className="text-sm font-medium text-primary-500 hover:text-primary-600">
            {t('dashboard.viewAll')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className={`${textAlign} px-4 py-3 text-sm font-medium text-gray-500`}>{t('reports.siteName')}</th>
                <th className={`${textAlign} px-4 py-3 text-sm font-medium text-gray-500`}>{t('reports.date')}</th>
                <th className={`${textAlign} px-4 py-3 text-sm font-medium text-gray-500`}>{t('reports.category')}</th>
                <th className={`${textAlign} px-4 py-3 text-sm font-medium text-gray-500`}>{t('reports.status')}</th>
                <th className={`${textAlign} px-4 py-3 text-sm font-medium text-gray-500`}>{t('reports.observations')}</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentReports?.map((report: any) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className={`${textAlign} px-4 py-3 text-sm font-medium text-gray-900`}>{report.siteName}</td>
                  <td className={`${textAlign} px-4 py-3 text-sm text-gray-600`}>
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className={`${textAlign} px-4 py-3 text-sm`}>
                    <span
                      className={`badge ${
                        String(report.category).toLowerCase().includes('safety')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t(`categories.${String(report.category).toLowerCase().replace(/\s+/g, '')}`)}
                    </span>
                  </td>
                  <td className={`${textAlign} px-4 py-3 text-sm`}>
                    <span
                      className={`badge ${
                        report.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t(`statuses.${String(report.status).toLowerCase()}`)}
                    </span>
                  </td>
                  <td className={`${textAlign} px-4 py-3 text-sm text-gray-600`}>
                    {report._count?.observations || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
