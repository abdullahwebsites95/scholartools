const SITE = 'https://scholartools.co'

const pages = [
  { url: '/', priority: '1.0', freq: 'weekly' },
  { url: '/word-counter', priority: '0.9', freq: 'monthly' },
  { url: '/pomodoro-timer', priority: '0.9', freq: 'monthly' },
  { url: '/gpa-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/grade-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/percentage-calculator', priority: '0.9', freq: 'monthly' },
  { url: '/citation-generator', priority: '0.9', freq: 'monthly' },
  { url: '/deadline-countdown', priority: '0.8', freq: 'monthly' },
  { url: '/reading-time', priority: '0.8', freq: 'monthly' },
  { url: '/typing-speed', priority: '0.8', freq: 'monthly' },
  { url: '/text-case-converter', priority: '0.8', freq: 'monthly' },
]

function generateSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${SITE}${p.url}</loc>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  res.write(generateSitemap())
  res.end()
  return { props: {} }
}
