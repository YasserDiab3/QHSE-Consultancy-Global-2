'use client'

import { useLanguage } from '@/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Send, Loader2, Briefcase } from 'lucide-react'

export default function ContactPage() {
  const { t, language } = useLanguage()
  const [selectedService, setSelectedService] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  })

  const serviceMessageTemplate = useMemo(() => {
    if (!selectedService) {
      return ''
    }

    return language === 'ar'
      ? `أرغب في طلب خدمة: ${selectedService}\n\nيرجى التواصل معي لتقديم عرض مناسب وتوضيح الخطوات التالية.`
      : `I would like to request the following service: ${selectedService}\n\nPlease contact me with a suitable proposal and the next steps.`
  }, [language, selectedService])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const service = new URLSearchParams(window.location.search).get('service')?.trim() || ''
    setSelectedService(service)
  }, [])

  useEffect(() => {
    if (!serviceMessageTemplate) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      message: prev.message.trim() ? prev.message : serviceMessageTemplate,
    }))
  }, [serviceMessageTemplate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || t('common.error'))
      }

      toast.success(t('contact.successMessage'))
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: serviceMessageTemplate,
      })
    } catch (error) {
      console.error('Failed to submit contact form:', error)
      toast.error(error instanceof Error ? error.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">{t('contact.title')}</h1>
            <p className="text-xl text-white/80">{t('contact.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {selectedService ? (
                <div className="mb-6 rounded-2xl border border-primary-100 bg-primary-50 p-5">
                  <div className="mb-2 flex items-center gap-3 text-primary-700">
                    <Briefcase className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      {language === 'ar' ? 'الخدمة المختارة' : 'Selected Service'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary-900">{selectedService}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="label-field">{t('contact.name')} *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">{t('contact.company')}</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="label-field">{t('contact.email')} *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">{t('contact.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-field">{t('contact.message')} *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full px-8 py-3 md:w-auto">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      {t('contact.sendButton')}
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="space-y-8 lg:col-span-2">
              <div>
                <h3 className="mb-6 text-xl font-bold text-gray-900">{t('contact.infoTitle')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                      <MapPin className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t('contact.address')}</p>
                      <p className="text-gray-600">Business District, City</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                      <Phone className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t('contact.phoneLabel')}</p>
                      <p className="text-gray-600">+971 XX XXX XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                      <Mail className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t('contact.emailLabel')}</p>
                      <p className="text-gray-600">info@qhsseconsultant.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">{t('contact.mapTitle')}</h3>
                <div className="flex h-48 w-full items-center justify-center rounded-xl bg-gray-200">
                  <MapPin className="h-10 w-10 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
