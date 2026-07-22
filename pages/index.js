import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

const tools = [
  {
    category: 'Writing & Text',
    accent: '#2563EB',
    items: [
      { href: '/word-counter', icon: '📝', name: 'Word Counter', desc: 'Count words, characters, sentences, reading time and pages instantly.' },
      { href: '/dissertation-word-count-calculator', icon: '📖', name: 'Dissertation Word Count Calculator', desc: 'Plan your dissertation word count by chapter with a suggested breakdown and tolerance range.' },
      { href: '/reading-time', icon: '📖', name: 'Reading Time Estimator', desc: 'Paste any text and find out exactly how long it takes to read aloud or silently.' },
      { href: '/text-case-converter', icon: '🔤', name: 'Text Case Converter', desc: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.' },
      { href: '/citation-generator', icon: '📚', name: 'Citation Generator', desc: 'Generate perfect APA and MLA citations for books, websites and journals. Free.' },
    ]
  },
  {
    category: 'Study & Productivity',
    accent: '#059669',
    items: [
      { href: '/pomodoro-timer', icon: '⏱️', name: 'Pomodoro Study Timer', desc: 'Stay focused with 25-minute study sessions and built-in break reminders.' },
      { href: '/deadline-countdown', icon: '📅', name: 'Deadline Countdown', desc: 'Track multiple assignment deadlines with live countdowns all in one place.' },
      { href: '/typing-speed', icon: '⌨️', name: 'Typing Speed Test', desc: 'Test your WPM and accuracy. Challenge your friends and improve your typing.' },
      { href: '/study-hours-planner', icon: '📚', name: 'Study Hours Planner', desc: 'Plan your study schedule by subject difficulty and days left before your exam.' },
    ]
  },
  {
    category: 'Grades & Calculations',
    accent: '#D97706',
    items: [
      { href: '/weighted-grade-calculator', icon: '⚖️', name: 'Weighted Grade Calculator', desc: 'Calculate your weighted grade average from multiple assessments. Supports percentage and points modes.' },
      { href: '/gpa-calculator', icon: '🎓', name: 'GPA Calculator', desc: 'Calculate your GPA on the 4.0 scale or CGPA with subject credit hours.' },
      { href: '/grade-calculator', icon: '📊', name: 'Grade Needed Calculator', desc: 'Find out exactly what score you need on your final exam to pass the course.' },
      { href: '/percentage-calculator', icon: '🔢', name: 'Percentage Calculator', desc: 'Calculate percentages, percentage change, and what percent X is of Y.' },
      { href: '/cgpa-to-percentage', icon: '🔄', name: 'CGPA to Percentage', desc: 'Convert your CGPA to percentage using your university formula instantly.' },
      { href: '/attendance-calculator', icon: '📋', name: 'Attendance Calculator', desc: 'Check your attendance percentage and find out exactly how many classes you can miss.' },
    ]
  },
  {
    category: '🌍 Global Student Tools',
    accent: '#7C3AED',
    items: [
      { href: '/student-budget-calculator', icon: '💰', name: 'Student Budget Calculator', desc: 'Calculate your monthly surplus or deficit from income and expenses in any frequency — weekly, monthly, per term or yearly.' },
      { href: '/international-student-work-hours-calculator', icon: '🌍', name: 'International Student Work Hours', desc: 'Check how many hours you can work on your student visa. Covers UK, Australia, Canada, USA and Ireland.' },
      { href: '/international-gpa-converter', icon: '🌐', name: 'International GPA Converter', desc: 'Convert Pakistani, UK, Indian, German or Australian grades to the US 4.0 GPA scale instantly.' },
      { href: '/exam-time-calculator', icon: '⏰', name: 'Exam Time Calculator', desc: 'Allocate time per section and question in any exam. Works for MCQ and essay papers.' },
    ]
  },
  {
    category: '🇵🇰 Pakistan University Admissions',
    accent: '#16A34A',
    items: [
      { href: '/mdcat-calculator', icon: '🩺', name: 'MDCAT Aggregate Calculator', desc: 'Calculate your MBBS and BDS admission aggregate using the official PMDC formula.' },
      { href: '/ecat-calculator', icon: '⚙️', name: 'ECAT Aggregate Calculator', desc: 'Calculate your UET engineering admission aggregate. Matric 25% + FSc 45% + ECAT 30%.' },
      { href: '/nust-calculator', icon: '🎓', name: 'NUST Aggregate Calculator', desc: "Calculate your NUST admission aggregate for Pakistan's most prestigious university." },
      { href: '/fast-calculator', icon: '💻', name: 'FAST University Aggregate Calculator', desc: "Calculate your FAST-NU aggregate for CS, SE and engineering. Pakistan's top CS university." },
      { href: '/nums-calculator', icon: '🏥', name: 'NUMS Aggregate Calculator', desc: 'Calculate your Army Medical College aggregate. FSc 50% + MDCAT 50% formula.' },
      { href: '/fsc-grade-converter', icon: '📊', name: 'FSc & Matric Grade Converter', desc: 'Convert your FSc or Matric marks to percentage and official board letter grade A-1 to E.' },
    ]
  },
  {
    category: '🇬🇧 UK Tools',
    accent: '#DC2626',
    items: [
      { href: '/uk-degree-classification-calculator', icon: '🎓', name: 'UK Degree Classification Calculator', desc: 'Find your degree classification — First, 2:1, 2:2 or Third — using overall or module-weighted average.' },
      { href: '/ucas-points-calculator', icon: '🎯', name: 'UCAS Points Calculator', desc: 'Calculate your UCAS tariff points from A-Level, AS-Level, IB, EPQ and Scottish qualifications.' },
      { href: '/btec-ucas-points-calculator', icon: '📗', name: 'BTEC UCAS Points Calculator', desc: 'Convert your BTEC grades to UCAS tariff points. Mix with A-Levels for combined totals.' },
      { href: '/a-level-grade-calculator', icon: '📊', name: 'A-Level Grade Calculator', desc: 'Convert UMS score to grade, or check if your results meet your university offer.' },
      { href: '/uk-student-loan-calculator', icon: '💷', name: 'UK Student Loan Repayment Calculator', desc: 'Calculate your monthly repayment and find out if your loan will be written off. Plans 1, 2, 4 & 5.' },
      { href: '/scottish-highers-ucas-calculator', icon: '🏴', name: 'Scottish Highers UCAS Points Calculator', desc: 'Convert Scottish Highers, Advanced Highers and National 5 grades to UCAS tariff points.' },
      { href: '/student-rent-calculator', icon: '🏠', name: 'Student Rent Calculator UK', desc: 'Find out if you can afford student rent in the UK. Halls vs private renting decision tool.' },
    ]
  },
  {
    category: 'Health & Everyday',
    accent: '#0EA5E9',
    items: [
      { href: '/bmi-calculator', icon: '⚖️', name: 'BMI Calculator', desc: 'Calculate your Body Mass Index and find your healthy weight range instantly.' },
      { href: '/tip-calculator', icon: '💰', name: 'Tip Calculator', desc: 'Calculate tip and split bills evenly among friends. Instant results as you type.' },
    ]
  },
  {
    category: 'Finance & Money',
    accent: '#0D9488',
    items: [
      { href: '/emi-calculator', icon: '💳', name: 'Loan EMI Calculator', desc: 'Calculate monthly loan installments, total interest, and full repayment schedule.' },
      { href: '/fbr-income-tax-calculator', icon: '🧾', name: 'FBR Income Tax Calculator', desc: 'Calculate your Pakistan income tax for 2025–26. Monthly deduction and take-home salary.' },
    ]
  },
]

export default function Home() {
  const totalTools = tools.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <Layout>
      <Head>
        <title>ScholarTools — Free Online Tools for Students</title>
        <meta name="description" content="Free online tools for students: dissertation word count calculator, weighted grade calculator, student budget calculator, GPA, MDCAT, ECAT, NUST and more. No signup needed." />
        <meta property="og:title" content="ScholarTools — Free Online Tools for Students" />
        <meta property="og:description" content="36+ free tools for students. Dissertation planner, weighted grade calculator, student budget, GPA, MDCAT, ECAT, NUST, UCAS points and more. All free, no signup." />
        <link rel="canonical" href="https://scholartools.co" />
      </Head>

      <div className="hero">
        <div className="container">
          <h1>Free Tools Built for <span>Students</span></h1>
          <p>{totalTools} essential tools that help you study smarter, write better, and stay on top of deadlines. All free, forever.</p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-val">{totalTools}+</div><div className="hero-stat-lbl">Free tools</div></div>
            <div className="hero-stat"><div className="hero-stat-val">0</div><div className="hero-stat-lbl">Signup needed</div></div>
            <div className="hero-stat"><div className="hero-stat-val">100%</div><div className="hero-stat-lbl">Free forever</div></div>
          </div>
        </div>
      </div>

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
