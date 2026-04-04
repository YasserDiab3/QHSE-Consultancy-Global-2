'use client'

import BrandLogo from '@/components/BrandLogo'
import { useLanguage } from '@/context'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'

const AUTH_SERVICE_UNAVAILABLE = 'AUTH_SERVICE_UNAVAILABLE'

function LoginForm() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

  const getAuthErrorMessage = (code?: string | null) => {
    if (code === 'CredentialsSignin') {
      return language === 'ar' ? 'بيانات تسجيل الدخول غير صحيحة' : t('auth.invalidCredentials')
    }

    if (code === AUTH_SERVICE_UNAVAILABLE) {
      return language === 'ar'
        ? 'خدمة تسجيل الدخول غير متاحة حاليا. حاول مرة أخرى بعد قليل.'
        : t('auth.serviceUnavailable')
    }

    if (!code) {
      return null
    }

    return language === 'ar'
      ? 'تعذر تسجيل الدخول. تحقق من الإعدادات ثم حاول مرة أخرى.'
      : 'Unable to sign in. Please check the configuration and try again.'
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
      router.refresh()
    }
  }, [callbackUrl, router, status])

  useEffect(() => {
    const message = getAuthErrorMessage(error)
    if (message) {
      toast.error(message)
    }
  }, [error, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        toast.error(getAuthErrorMessage(result.error) ?? t('common.error'))
        return
      }

      if (result?.url) {
        const parsedUrl = result.url.startsWith('http') ? new URL(result.url) : null
        const targetUrl = parsedUrl
          ? `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
          : result.url

        router.replace(targetUrl)
        router.refresh()
        return
      }

      router.replace(callbackUrl)
      router.refresh()
    } catch {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const portalTitle =
    language === 'ar'
      ? 'منصة احترافية لتقارير الزيارات ومتابعة العملاء'
      : 'A professional portal for visit reports and client follow-up'

  const portalDescription =
    language === 'ar'
      ? 'سجل الدخول للوصول إلى تقارير الزيارات وسجلات المتابعة وتنزيل ملفات PDF الرسمية المعتمدة بشعار المؤسسة.'
      : 'Sign in to access visit reports, follow-up records, and official PDF exports branded with the approved company logo.'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f9fc] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(151,215,0,0.12),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(139,77,0,0.08),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.85),_rgba(244,247,252,0.95))]" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,77,0,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(139,77,0,0.55) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden lg:block">
            <div className="mx-auto max-w-xl">
              <BrandLogo variant="stacked" priority className="mx-auto w-[360px]" />
              <div className="mt-8 rounded-[34px] border border-[#8B4D00]/10 bg-white/88 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#8B4D00]/75">
                  QHSSE Consultant
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-snug text-slate-900">
                  {portalTitle}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">{portalDescription}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#97D700]/20 bg-[#97D700]/8 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {language === 'ar' ? 'تقارير جاهزة للطباعة' : 'Professional PDF reports'}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {language === 'ar'
                        ? 'تصدير موحد بالشعار الرسمي والهوية البصرية نفسها.'
                        : 'Consistent exports using the official logo and the same visual identity.'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#8B4D00]/15 bg-[#8B4D00]/[0.06] p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {language === 'ar' ? 'متابعة فورية للعملاء' : 'Real-time client follow-up'}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {language === 'ar'
                        ? 'الوصول إلى الزيارات والملاحظات وإشعارات التقارير من مكان واحد.'
                        : 'Access visits, observations, and report notifications from one place.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex justify-center">
                <BrandLogo variant="stacked" priority className="w-[240px]" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/92 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="border-b border-slate-100 bg-gradient-to-r from-[#f5f8ef] via-white to-[#fbf7f1] px-8 py-8 text-center">
                <div className="mx-auto mb-6 hidden lg:block">
                  <BrandLogo variant="mark" priority className="mx-auto w-24" />
                </div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.55em] text-[#8B4D00]/70">
                  Client Portal
                </p>
                <h1 className="text-3xl font-bold text-slate-900">{t('auth.loginTitle')}</h1>
                <p className="mt-3 text-base leading-7 text-slate-600">{t('auth.loginSubtitle')}</p>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="label-field text-slate-700">{t('auth.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        placeholder="name@company.com"
                        className="input-field rounded-2xl border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-[#8B4D00]/40 focus:bg-white focus:ring-4 focus:ring-[#8B4D00]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-field text-slate-700">{t('auth.password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        placeholder="........"
                        className="input-field rounded-2xl border-slate-200 bg-slate-50 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-[#8B4D00]/40 focus:bg-white focus:ring-4 focus:ring-[#8B4D00]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || status === 'loading'}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2e49b8] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-[#2e49b8]/25 transition hover:bg-[#243fae] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading || status === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('auth.loggingIn')}
                      </>
                    ) : (
                      t('auth.loginButton')
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600">
                  <Link href="/" className="font-medium text-[#8B4D00] transition hover:text-[#6b3900]">
                    {'<-'} {t('common.back')}
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
