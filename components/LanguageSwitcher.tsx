'use client'

import { useLanguage } from '@/context'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const nextLanguage = language === 'en' ? 'ar' : 'en'

  return (
    <button
      onClick={() => void setLanguage(nextLanguage)}
      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'en' ? 'العربية' : 'EN'}</span>
    </button>
  )
}
