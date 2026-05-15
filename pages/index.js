import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

const tools = [
  {
    category: 'Writing & Text',
    accent: '#2563EB',
    items: [
      { href: '/word-counter', icon: '📝', name: 'Word Counter', desc: 'Count words, characters, sentences, reading time and pages instantly.' },
      { href: '/reading-time', icon: '📖', name: 'Reading Time Estimator', desc: 'Paste any text and find out exactly how long it takes to read aloud or silently.' },
      { href: '/text-case-converter', icon: '🔤', name: 'Text Case Converter', desc: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.' },
    ]
  },
  {
    category: 'Study & Productivity',
    accent: '#059669',
    items: [
      { href: '/pomodoro-timer', icon: '⏱️', name: 'Pomodoro Study Timer', desc: 'Stay focused with 25-minute study sessions and built-in break reminders.' },
      { href: '/deadline-countdown', icon: '📅', name: 'Deadline Countdown', desc: 'Track multiple assignment deadlines with live countdowns all in one place.' },
      { href: '/typing-speed', icon: '⌨️', name: 'Typing Speed Test', desc: 'Test your WPM and accuracy. Challenge your friends and improve your typing.' },
    ]
  },
  {
    category: 'Grades & Calculations',
    accent: '#D97706',
    items: [
      { href: '/gpa-calculator', icon: '🎓', name: 'GPA Calculator', desc: 'Calculate your GPA on the 4.0 scale or CGPA with subject credit hours.' },
      { href: '/grade-calculator', icon: '📊', name: 'Grade Needed Calculator', desc: 'Find out exactly what score you need on your final exam to pass the course.' },
      { href: '/percentage-calculator', icon: '🔢', name: 'Percentage Calculator', desc: 'Calculate percentages, percentage change, and what percent X is of Y.' },
    ]
  },
  {
    category: 'Research & Writing',
    accent: '#0D9488',
    items: [
      { href: '/citation-generator', icon: '📚', name: 'Citation Generator', desc: 'Generate perfect APA and MLA citations for books, websites and journals. Free.' },
    ]
  },
]

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>ScholarTools — Free Tools for Students</title>
        <meta name="description" content="Free online tools for students: word counter, GPA calculator, citation generator, Pomodoro timer, grade calculator and more. No signup needed." />
        <meta property="og:title" content="ScholarTools — Free Tools for Students" />
        <meta property="og:description" content="10+ free tools for students. Word counter, GPA calculator, Pomodoro timer, citation generator and more." />
        <link rel="canonical" href="https://scholartools.co" />
      </Head>

      {/* Hero */}
      <div className="hero">
        <div className="container">
          <h1>Free Tools Built for <span>Students</span></h1>
          <p>10 essential tools that help you study smarter, write better, and stay on top of deadlines. All free, forever.</p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-val">10+</div><div className="hero-stat-lbl">Free tools</div></div>
            <div className="hero-stat"><div className="hero-stat-val">0</div><div className="hero-stat-lbl">Signup needed</div></div>
            <div className="hero-stat"><div className="hero-stat-val">100%</div><div className="hero-stat-lbl">Free forever</div></div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="tools-section">
        {tools.map(cat => (
          <div key={cat.category}>
            <div className="section-label">{cat.category}</div>
            <div className="tools-grid" style={{ marginBottom: 40 }}>
              {cat.items.map(tool => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="tool-card"
                  style={{ '--card-accent': cat.accent }}
                >
                  <span className="tool-card-icon">{tool.icon}</span>
                  <div className="tool-card-name">{tool.name}</div>
                  <div className="tool-card-desc">{tool.desc}</div>
                  <div className="tool-card-badge">Use tool →</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
