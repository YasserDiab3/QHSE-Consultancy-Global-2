import jsPDF from 'jspdf'
import 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

type Report = {
  id: string
  date: string
  siteName: string
  siteNameAr?: string
  category: string
  status: string
  notes?: string
  notesAr?: string
  observations: Observation[]
  client: any
  consultant?: { name: string }
}

type Observation = {
  id: string
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  riskLevel: string
  status: string
  images: any[]
}

async function loadLogoDataUrl() {
  return new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const context = canvas.getContext('2d')
        if (!context) {
          throw new Error('Canvas context unavailable')
        }

        context.drawImage(image, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch (error) {
        reject(error)
      }
    }
    image.onerror = () => reject(new Error('Failed to load logo asset'))
    image.src = '/brand/qhsse-logo-mark.svg'
  })
}

export async function generateReportPDF(report: Report, t: (key: string) => string, language: string) {
  const doc = new jsPDF()
  const isArabic = language === 'ar'

  // Header
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 0, 210, 48, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.line(14, 46, 196, 46)

  try {
    const logoDataUrl = await loadLogoDataUrl()
    doc.addImage(logoDataUrl, 'PNG', 14, 8, 26, 26)
  } catch (error) {
    console.error('Failed to load logo for PDF:', error)
  }

  doc.setTextColor(139, 77, 0)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('QHSSE CONSULTANT', 46, 18)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('SINCE 2022', 46, 26)
  doc.setTextColor(30, 64, 175)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(isArabic ? 'Visit Report / تقرير زيارة' : 'Visit Report', 196, 22, { align: 'right' })

  // Report Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  let y = 56

  doc.text(isArabic && report.siteNameAr ? report.siteNameAr : report.siteName, 14, y)
  doc.setFont('helvetica', 'normal')

  y += 10
  doc.setFontSize(10)
  doc.text(`${t('reports.date')}: ${new Date(report.date).toLocaleDateString()}`, 14, y)
  y += 7
  doc.text(`${t('reports.category')}: ${report.category}`, 14, y)
  y += 7
  doc.text(`${t('reports.status')}: ${report.status}`, 14, y)
  y += 7
  if (report.consultant?.name) {
    doc.text(`${t('reports.consultant')}: ${report.consultant.name}`, 14, y)
    y += 7
  }

  // Notes
  if (report.notes || report.notesAr) {
    y += 10
    doc.setFont('helvetica', 'bold')
    doc.text(t('reports.notes'), 14, y)
    doc.setFont('helvetica', 'normal')
    y += 7
    const notes = isArabic && report.notesAr ? report.notesAr : report.notes
    const splitNotes = doc.splitTextToSize(notes || '', 180)
    doc.text(splitNotes, 14, y)
    y += splitNotes.length * 5 + 10
  }

  // Observations Table
  y += 5
  doc.setFont('helvetica', 'bold')
  doc.text(`${t('reports.observations')} (${report.observations.length})`, 14, y)
  doc.setFont('helvetica', 'normal')

  const tableData = report.observations.map((obs, index) => [
    (index + 1).toString(),
    isArabic && obs.titleAr ? obs.titleAr : obs.title,
    obs.riskLevel,
    obs.status,
  ])

  ;(doc as any).autoTable({
    startY: y + 5,
    head: [['#', t('reports.observation'), t('reports.riskLevel'), t('reports.status')]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: 14, right: 14 },
  })

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `QHSSE Consultant | Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

  // Save
  const fileName = `report-${report.siteName.replace(/\s+/g, '-').toLowerCase()}-${new Date(report.date).toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
