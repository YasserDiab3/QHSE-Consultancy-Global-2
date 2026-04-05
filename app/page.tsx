'use client'

import { useLanguage } from '@/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import {
  Shield,
  Apple,
  Search,
  Monitor,
  BellRing,
  Building2,
  Leaf,
  SlidersHorizontal,
  FileSearch,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Clock,
  BarChart3,
} from 'lucide-react'

export default function HomePage() {
  const { t, dir, language } = useLanguage()

  const services = [
    {
      icon: Shield,
      title: t('services.qhseTitle'),
      desc: t('services.qhseDesc'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Apple,
      title: t('services.foodTitle'),
      desc: t('services.foodDesc'),
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: BarChart3,
      title: t('services.riskTitle'),
      desc: t('services.riskDesc'),
      color: 'from-rose-500 to-rose-600',
    },
    {
      icon: FileSearch,
      title: t('services.auditTitle'),
      desc: t('services.auditDesc'),
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: GraduationCap,
      title: t('services.trainingTitle'),
      desc: t('services.trainingDesc'),
      color: 'from-violet-500 to-violet-600',
    },
  ]

  const extraServiceCards =
    language === 'ar'
      ? [
          {
            icon: Monitor,
            title: 'الأنظمة البرمجية للسلامة',
            desc: 'إنشاء وتطوير أنظمة برمجية متكاملة للسلامة تتوافق مع طبيعة كل مؤسسة واحتياجاتها التشغيلية.',
            color: 'from-blue-500 to-blue-600',
          },
          {
            icon: BellRing,
            title: 'أنظمة الإنذار والحريق',
            desc: 'تقديم استشارات متكاملة لتصميم وتطوير أنظمة الإنذار والحريق وفق أحدث المعايير العالمية.',
            color: 'from-orange-500 to-orange-600',
          },
          {
            icon: Building2,
            title: 'الاعتمادات الحكومية',
            desc: 'إدارة التعامل مع الجهات الحكومية وإنشاء الملفات والأنظمة اللازمة لاعتماد الشركات.',
            color: 'from-violet-500 to-violet-600',
          },
          {
            icon: Search,
            title: 'التحقيق في الحوادث',
            desc: 'التحقيق في الحوادث والإصابات وتحليل الأسباب الجذرية ووضع الإجراءات التصحيحية الفعالة.',
            color: 'from-rose-500 to-rose-600',
          },
          {
            icon: Leaf,
            title: 'الدراسات البيئية',
            desc: 'إعداد السجلات البيئية والحصول على الموافقات وتنفيذ الدراسات والقياسات البيئية.',
            color: 'from-emerald-500 to-emerald-600',
          },
          {
            icon: SlidersHorizontal,
            title: 'المعايرات وأنظمة التحكم',
            desc: 'تنفيذ أعمال المعايرة وتطوير أنظمة التحكم لضمان دقة وكفاءة التشغيل.',
            color: 'from-cyan-500 to-cyan-600',
          },
          {
            icon: BarChart3,
            title: 'تقييم الأصول',
            desc: 'إعداد دراسات تقييم الأصول وتقديم استشارات فنية متخصصة من خبراء معتمدين.',
            color: 'from-amber-500 to-amber-600',
          },
        ]
      : [
          {
            icon: Monitor,
            title: 'Safety Software Systems',
            desc: 'Building integrated safety software systems tailored to each organization and its operational needs.',
            color: 'from-blue-500 to-blue-600',
          },
          {
            icon: BellRing,
            title: 'Fire & Alarm Systems',
            desc: 'Providing end-to-end consulting for designing and improving fire alarm systems to global standards.',
            color: 'from-orange-500 to-orange-600',
          },
          {
            icon: Building2,
            title: 'Government Approvals',
            desc: 'Managing government coordination, documentation, and system preparation required for company approvals.',
            color: 'from-violet-500 to-violet-600',
          },
          {
            icon: Search,
            title: 'Incident Investigation',
            desc: 'Investigating accidents and injuries, identifying root causes, and defining effective corrective actions.',
            color: 'from-rose-500 to-rose-600',
          },
          {
            icon: Leaf,
            title: 'Environmental Studies',
            desc: 'Preparing environmental records, securing approvals, and carrying out environmental studies and measurements.',
            color: 'from-emerald-500 to-emerald-600',
          },
          {
            icon: SlidersHorizontal,
            title: 'Calibration & Control',
            desc: 'Delivering calibration work and control-system improvements to ensure accurate, efficient operations.',
            color: 'from-cyan-500 to-cyan-600',
          },
          {
            icon: BarChart3,
            title: 'Asset Valuation',
            desc: 'Preparing asset valuation studies and delivering specialized technical consulting by certified experts.',
            color: 'from-amber-500 to-amber-600',
          },
        ]

  const allServiceCards = [...services, ...extraServiceCards]

  const whyFeatures = [
    {
      icon: Award,
      title: t('home.whyFeature1Title'),
      desc: t('home.whyFeature1Desc'),
    },
    {
      icon: CheckCircle2,
      title: t('home.whyFeature2Title'),
      desc: t('home.whyFeature2Desc'),
    },
    {
      icon: TrendingUp,
      title: t('home.whyFeature3Title'),
      desc: t('home.whyFeature3Desc'),
    },
    {
      icon: Shield,
      title: t('home.whyFeature4Title'),
      desc: t('home.whyFeature4Desc'),
    },
  ]

  const stats = [
    { value: '50+', label: t('about.stat1Label'), icon: Users },
    { value: '200+', label: t('about.stat2Label'), icon: FileSearch },
    { value: '4+', label: t('about.stat3Label'), icon: Clock },
    { value: '99%', label: t('about.stat4Label'), icon: Shield },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="container-custom relative z-10 pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              <span>{t('common.tagline')}</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80">{t('home.heroSubtitle')}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary bg-white px-8 py-4 text-lg text-primary-600 hover:bg-gray-100">
                {t('home.heroCTA')}
                <ArrowRight className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
              <Link href="/services" className="btn-secondary border-white px-8 py-4 text-lg text-white hover:bg-white/10">
                {t('home.heroCTA2')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="section-title">{t('home.servicesTitle')}</h2>
            <p className="section-subtitle">{t('home.servicesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {allServiceCards.map((service, index) => (
              <div key={index} className="card group transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} shadow-lg transition-shadow group-hover:shadow-xl`}
                >
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="leading-relaxed text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1 text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="section-title">{t('home.whyTitle')}</h2>
            <p className="section-subtitle">{t('home.whySubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyFeatures.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 transition-colors group-hover:bg-primary-100">
                  <feature.icon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-primary-900 py-20 md:py-28">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{t('home.ctaTitle')}</h2>
            <p className="mb-8 text-lg text-gray-300">{t('home.ctaSubtitle')}</p>
            <Link href="/contact" className="btn-primary bg-accent-500 px-8 py-4 text-lg hover:bg-accent-600">
              {t('home.ctaButton')}
              <ArrowRight className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
