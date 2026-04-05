'use client'

import { useLanguage } from '@/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllServiceCards, getPrimaryServiceCards } from '@/lib/service-cards'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function ServicesPage() {
  const { t, dir, language } = useLanguage()

  const allServiceCards = getAllServiceCards(t, language)
  const primaryServices = getPrimaryServiceCards(t)

  const serviceFeatures =
    language === 'ar'
      ? [
          [
            'تطبيق ISO 9001',
            'الالتزام بمتطلبات ISO 45001',
            'إدارة البيئة وفق ISO 14001',
            'أنظمة الإدارة المتكاملة',
          ],
          [
            'إعداد خطط الهاسب',
            'تطبيق ISO 22000',
            'تدقيقات سلامة الغذاء',
            'إدارة مسببات الحساسية',
          ],
          [
            'تحديد المخاطر',
            'تحليل وتقييم المخاطر',
            'استراتيجيات المعالجة والحد من التأثير',
            'خطط الاستجابة للطوارئ',
          ],
          [
            'تدقيقات الامتثال',
            'تحليل الفجوات',
            'الجولات التفتيشية',
            'خطط الإجراءات التصحيحية',
          ],
          [
            'برامج التهيئة والتوعية',
            'التدريب على الاستجابة للطوارئ',
            'الإسعافات الأولية والإنعاش',
            'التدريب على مكافحة الحريق',
          ],
        ]
      : [
          [
            'ISO 9001 Implementation',
            'ISO 45001 Compliance',
            'ISO 14001 Environmental Management',
            'Integrated Management Systems',
          ],
          [
            'HACCP Plan Development',
            'ISO 22000 Certification',
            'Food Safety Audits',
            'Allergen Management',
          ],
          [
            'Hazard Identification',
            'Risk Assessment & Analysis',
            'Mitigation Strategies',
            'Emergency Response Planning',
          ],
          [
            'Compliance Audits',
            'Gap Analysis',
            'Site Inspections',
            'Corrective Action Plans',
          ],
          [
            'Safety Induction Programs',
            'Emergency Response Training',
            'First Aid & CPR',
            'Fire Safety Training',
          ],
        ]

  const detailedServices = primaryServices.map((service, index) => ({
    ...service,
    features: serviceFeatures[index] || [],
  }))

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 to-primary-600 pb-20 pt-32">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">{t('services.title')}</h1>
            <p className="text-xl text-white/80">{t('services.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="section-title">{language === 'ar' ? 'كل خدماتنا' : 'All Services'}</h2>
            <p className="section-subtitle">
              {language === 'ar'
                ? 'اضغط على أي كرت لفتح نموذج الطلب مباشرة مع تعبئة الخدمة المختارة.'
                : 'Click any card to open the request form with the selected service prefilled.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {allServiceCards.map((service, index) => (
              <Link
                key={index}
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="card group block cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} shadow-lg transition-shadow group-hover:shadow-xl`}
                >
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="leading-relaxed text-gray-600">{service.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-600">
                  <span>{language === 'ar' ? 'اطلب هذه الخدمة' : 'Request this service'}</span>
                  <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="space-y-16">
            {detailedServices.map((service, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} shadow-lg`}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">{service.title}</h2>
                  <p className="mb-6 text-lg leading-relaxed text-gray-600">{service.desc}</p>
                  <ul className="mb-8 space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="btn-primary px-6 py-3">
                    {language === 'ar' ? 'طلب هذه الخدمة' : 'Request This Service'}
                    <ArrowRight className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </Link>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="rounded-2xl bg-gray-100 p-8 md:p-12">
                    <div className={`h-48 w-full rounded-xl bg-gradient-to-br ${service.color} opacity-20 md:h-64`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{t('services.ctaTitle')}</h2>
            <p className="mb-8 text-lg text-gray-600">{t('services.ctaSubtitle')}</p>
            <Link href="/contact" className="btn-primary px-8 py-4 text-lg">
              {t('services.ctaButton')}
              <ArrowRight className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
