import {
  Apple,
  BarChart3,
  BellRing,
  Building2,
  FileSearch,
  GraduationCap,
  Leaf,
  Monitor,
  Search,
  Shield,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'

type Language = 'ar' | 'en'

type Translator = (key: string) => string

export interface ServiceCardItem {
  icon: LucideIcon
  title: string
  desc: string
  color: string
}

export function getPrimaryServiceCards(t: Translator): ServiceCardItem[] {
  return [
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
}

export function getAdditionalServiceCards(language: Language): ServiceCardItem[] {
  if (language === 'ar') {
    return [
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
  }

  return [
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
}

export function getAllServiceCards(t: Translator, language: Language): ServiceCardItem[] {
  return [...getPrimaryServiceCards(t), ...getAdditionalServiceCards(language)]
}
