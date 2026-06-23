const SITE = 'https://scholartools.co'

const pages = [
  // Homepage
  { url: '/', priority: '1.0', freq: 'weekly' },

  // Writing & Text Tools
  { url: '/word-counter', priority: '0.9', freq: 'monthly' },
  { url: '/reading-time', priority: '0.8', freq: 'monthly' },
  { url: '/text-case-converter', priority: '0.8', freq: 'monthly' },
  { url: '/citation-generator', priority: '0.9', freq: 'monthly' },

  // Study & Productivity Tools
  { url: '/pomodoro-timer', priority: '0.9', freq: 'monthly' },
  { url: '/deadline-countdown', priority: '0.8', freq: 'monthly' },
  { url: '/typing-speed', priority: '0.8', freq: 'monthly' },
  { url: '/study-hours-planner', priority: '0.8', freq: 'monthly' },

  // Grades & Calculations
  { url: '/gpa-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/grade-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/percentage-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/cgpa-to-percentage', priority: '0.8', freq: 'monthly' },
  { url: '/attendance-calculator', priority: '0.9', freq: 'monthly' },

  // Pakistan University Admissions
  { url: '/mdcat-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/ecat-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/nust-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/fast-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/nums-calculator', priority: '0.8', freq: 'monthly' },
  { url: '/fsc-grade-converter', priority: '0.9', freq: 'monthly' },

  // Global Student Tools
  { url: '/international-student-work-hours-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/international-gpa-converter', priority: '0.8', freq: 'monthly' },
  { url: '/exam-time-calculator', priority: '0.8', freq: 'monthly' },

  // Health & Everyday
  { url: '/bmi-calculator', priority: '0.8', freq: 'monthly' },
  { url: '/tip-calculator', priority: '0.7', freq: 'monthly' },

  // Finance & Money
  { url: '/emi-calculator', priority: '0.8', freq: 'monthly' },
  { url: '/student-rent-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/fbr-income-tax-calculator', priority: '0.8', freq: 'monthly' },

  // Legal Pages
  { url: '/about', priority: '0.6', freq: 'yearly' },
  { url: '/privacy-policy', priority: '0.5', freq: 'yearly' },
  { url: '/terms', priority: '0.5', freq: 'yearly' },
]

function generateSitemap() {
  const now = new Date().toISOString().split('T')[0]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${SITE}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(generateSitemap())
  res.end()
  return { props: {} }
}
