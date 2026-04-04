import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Correct bcrypt hash for "admin123"
const ADMIN_HASH = '$2a$12$iMZSj9t0rQLrrm218UHzf.lx0PcYPS01dFHt.2B/69UCT.SrYf1n.'
// Correct bcrypt hash for "client123"
const CLIENT_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdP5Y5GyYzS3S3S3'

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@qhsseconsultant.com' },
    update: { password: ADMIN_HASH },
    create: {
      name: 'Admin User',
      email: 'admin@qhsseconsultant.com',
      password: ADMIN_HASH,
      role: 'ADMIN',
      language: 'en',
    },
  })
  console.log('✓ Created admin user:', admin.email)

  // Create sample clients
  const client1 = await prisma.user.upsert({
    where: { email: 'ahmed@petrocorp.com' },
    update: { password: CLIENT_HASH },
    create: {
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@petrocorp.com',
      password: CLIENT_HASH,
      role: 'CLIENT',
      language: 'en',
      client: {
        create: {
          companyName: 'PetroCorp Industries',
          companyNameAr: 'شركة بتروكورب للصناعات',
          phone: '+971 50 123 4567',
          address: 'Industrial Area, Abu Dhabi',
        },
      },
    },
    include: { client: true },
  })
  console.log('✓ Created client:', client1.client?.companyName)

  const client2 = await prisma.user.upsert({
    where: { email: 'sarah@foodtech.com' },
    update: { password: CLIENT_HASH },
    create: {
      name: 'Sarah Johnson',
      email: 'sarah@foodtech.com',
      password: CLIENT_HASH,
      role: 'CLIENT',
      language: 'en',
      client: {
        create: {
          companyName: 'FoodTech Solutions',
          companyNameAr: 'حلول فودتك',
          phone: '+971 55 987 6543',
          address: 'Dubai Investment Park',
        },
      },
    },
    include: { client: true },
  })
  console.log('✓ Created client:', client2.client?.companyName)

  // Create sample reports for client 1
  if (client1.client) {
    await prisma.report.upsert({
      where: { id: 'report-petro-1' },
      update: {},
      create: {
        id: 'report-petro-1',
        clientId: client1.client.id,
        date: new Date('2025-03-15'),
        siteName: 'PetroCorp Main Facility',
        siteNameAr: 'منشأة بتروكورب الرئيسية',
        category: 'SAFETY',
        consultantId: admin.id,
        notes: 'Annual safety inspection conducted. Several high-risk items identified.',
        notesAr: 'تم إجراء التفتيش الأمني السنوي. تم تحديد عناصر عالية الخطورة.',
        status: 'IN_PROGRESS',
        observations: {
          create: [
            {
              title: 'Missing Safety Guards on Machinery',
              titleAr: 'عدم وجود حراسات أمان على الآلات',
              description: 'Several rotating machines without proper safety guards.',
              descriptionAr: 'عدة آلات بدون حراسات أمان مناسبة.',
              riskLevel: 'HIGH',
              status: 'OPEN',
              sortOrder: 1,
            },
            {
              title: 'Inadequate Fire Extinguishers',
              titleAr: 'طفايات حريق غير كافية',
              description: 'Fire extinguishers in warehouse past expiry date.',
              descriptionAr: 'طفايات الحريق منتهية الصلاحية.',
              riskLevel: 'MEDIUM',
              status: 'IN_PROGRESS',
              sortOrder: 2,
            },
            {
              title: 'Proper PPE Usage',
              titleAr: 'الاستخدام المناسب لمعدات الحماية',
              description: 'Workers observed wearing appropriate PPE.',
              riskLevel: 'LOW',
              status: 'CLOSED',
              sortOrder: 3,
            },
            {
              title: 'Chemical Storage Labels Missing',
              titleAr: 'ملصقات تخزين المواد الكيميائية مفقودة',
              description: 'Chemical containers lack proper hazard labels.',
              descriptionAr: 'عبوات المواد الكيميائية تفتقر إلى ملصقات المخاطر.',
              riskLevel: 'CRITICAL',
              status: 'OPEN',
              sortOrder: 4,
            },
          ],
        },
      },
    })
    console.log('✓ Created report: PetroCorp Main Facility')

    await prisma.report.upsert({
      where: { id: 'report-petro-2' },
      update: {},
      create: {
        id: 'report-petro-2',
        clientId: client1.client.id,
        date: new Date('2025-02-20'),
        siteName: 'PetroCorp Warehouse B',
        siteNameAr: 'مستودع بتروكورب ب',
        category: 'RISK_ASSESSMENT',
        consultantId: admin.id,
        notes: 'Comprehensive risk assessment completed.',
        status: 'CLOSED',
        observations: {
          create: [
            {
              title: 'Forklift Operating Procedures',
              titleAr: 'إجراءات تشغيل الرافعة الشوكية',
              description: 'Updated procedures documented and posted.',
              riskLevel: 'LOW',
              status: 'CLOSED',
              sortOrder: 1,
            },
            {
              title: 'Emergency Exit Blocked',
              titleAr: 'مخرج الطوارئ مسدود',
              description: 'Emergency exit blocked by stored materials.',
              riskLevel: 'HIGH',
              status: 'CLOSED',
              sortOrder: 2,
            },
          ],
        },
      },
    })
    console.log('✓ Created report: PetroCorp Warehouse B')
  }

  // Create sample reports for client 2
  if (client2.client) {
    await prisma.report.upsert({
      where: { id: 'report-food-1' },
      update: {},
      create: {
        id: 'report-food-1',
        clientId: client2.client.id,
        date: new Date('2025-03-10'),
        siteName: 'FoodTech Processing Plant',
        siteNameAr: 'مصنع معالجة فودتك',
        category: 'FOOD_SAFETY',
        consultantId: admin.id,
        notes: 'HACCP compliance audit. Good compliance with minor gaps.',
        status: 'OPEN',
        observations: {
          create: [
            {
              title: 'Temperature Monitoring Records',
              titleAr: 'سجلات مراقبة درجة الحرارة',
              description: 'Cold storage logs show consistent monitoring.',
              riskLevel: 'LOW',
              status: 'CLOSED',
              sortOrder: 1,
            },
            {
              title: 'Cross-Contamination Risk',
              titleAr: 'خطر التلوث المتبادل',
              description: 'Raw and cooked areas need better separation.',
              descriptionAr: 'تحتاج المناطق إلى فصل أفضل.',
              riskLevel: 'HIGH',
              status: 'OPEN',
              sortOrder: 2,
            },
            {
              title: 'Hand Washing Stations',
              titleAr: 'محطات غسل اليدين',
              description: 'Additional stations required near packaging area.',
              riskLevel: 'MEDIUM',
              status: 'IN_PROGRESS',
              sortOrder: 3,
            },
          ],
        },
      },
    })
    console.log('✓ Created report: FoodTech Processing Plant')
  }

  console.log('\n✅ Seeding completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('  Admin:  admin@qhsseconsultant.com / admin123')
  console.log('  Client: ahmed@petrocorp.com / client123')
  console.log('  Client: sarah@foodtech.com / client123')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
