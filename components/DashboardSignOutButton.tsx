'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { useLanguage } from '@/context'

export default function DashboardSignOutButton() {
  const { language } = useLanguage()

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" />
      {language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
    </button>
  )
}
