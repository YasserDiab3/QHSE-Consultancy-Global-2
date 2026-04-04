'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => Promise<void>
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)
const translationCache: Partial<Record<Language, Record<string, unknown>>> = {}

function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }

    return undefined
  }, obj)

  return typeof value === 'string' ? value : path
}

async function loadTranslations(lang: Language) {
  if (translationCache[lang]) {
    return translationCache[lang]!
  }

  const response = await fetch(`/locales/${lang}.json`, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to load ${lang} translations`)
  }

  const data = (await response.json()) as Record<string, unknown>
  translationCache[lang] = data
  return data
}

function applyLanguageAttributes(lang: Language) {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [messages, setMessages] = useState<Record<string, unknown>>({})

  const setLanguage = useCallback(async (lang: Language) => {
    const data = await loadTranslations(lang).catch(() => ({}))
    setMessages(data)
    setLanguageState(lang)
    applyLanguageAttributes(lang)

    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang)
    }
  }, [])

  useEffect(() => {
    const bootLanguage = async () => {
      const savedLang =
        typeof window !== 'undefined'
          ? ((localStorage.getItem('preferred-language') || 'en') as Language)
          : 'en'

      await setLanguage(savedLang)
    }

    void bootLanguage()
  }, [setLanguage])

  const t = useCallback(
    (key: string) => getNestedTranslation(messages, key),
    [messages]
  )

  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr'

  const value = useMemo(
    () => ({ language, setLanguage, t, dir }),
    [dir, language, setLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}
