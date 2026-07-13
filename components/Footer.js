import Link from 'next/link'

const FOOTER_TOOLS = [
  {
    category: 'Writing & Text',
    links: [
      { href: '/word-counter', label: 'Word Counter' },
      { href: '/reading-time', label: 'Reading Time Estimator' },
      { href: '/text-case-converter', label: 'Text Case Converter' },
      { href: '/citation-generator', label: 'Citation Generator' },
    ]
  },
  {
    category: 'Study & Productivity',
    links: [
      { href: '/pomodoro-timer', label: 'Pomodoro Timer' },
      { href: '/deadline-countdown', label: 'Deadline Countdown' },
      { href: '/typing-speed', label: 'Typing Speed Test' },
      { href: '/study-hours-planner', label: 'Study Hours Planner' },
    ]
  },
  {
    category: 'Grades & Calculations',
    links: [
      { href: '/gpa-calculator', label: 'GPA Calculator' },
      { href: '/grade-calculator', label: 'Grade Needed Calculator' },
      { href: '/percentage-calculator', label: 'Percentage Calculator' },
      { href: '/cgpa-to-percentage', label: 'CGPA to Percentage' },
      { href: '/attendance-calculator', label: 'Attendance Calculator' },
    ]
  },
  {
    category: '🇵🇰 Pakistan Tools',
    links: [
      { href: '/mdcat-calculator', label: 'MDCAT Aggregate Calculator' },
      { href: '/ecat-calculator', label: 'ECAT Aggregate Calculator' },
      { href: '/nust-calculator', label: 'NUST Aggregate Calculator' },
      { href: '/fast-calculator', label: 'FAST University Calculator' },
      { href: '/nums-calculator', label: 'NUMS Aggregate Calculator' },
      { href: '/fsc-grade-converter', label: 'FSc & Matric Grade Converter' },
    ]
  },
  {
    category: '🇬🇧 UK Tools',
    links: [
      { href: '/uk-degree-classification-calculator', label: 'UK Degree Classification' },
      { href: '/ucas-points-calculator', label: 'UCAS Points Calculator' },
      { href: '/btec-ucas-points-calculator', label: 'BTEC UCAS Points' },
      { href: '/a-level-grade-calculator', label: 'A-Level Grade Calculator' },
      { href: '/uk-student-loan-calculator', label: 'Student Loan Repayment Calculator' },
      { href: '/student-rent-calculator', label: 'Student Rent Calculator UK' },
    ]
  },
  {
    category: 'Global & Everyday',
    links: [
      { href: '/international-student-work-hours-calculator', label: 'Student Work Hours' },
      { href: '/international-gpa-converter', label: 'International GPA Converter' },
      { href: '/exam-time-calculator', label: 'Exam Time Calculator' },
      { href: '/fbr-income-tax-calculator', label: 'FBR Income Tax Calculator' },
      { href: '/emi-calculator', label: 'Loan EMI Calculator' },
      { href: '/bmi-calculator', label: 'BMI Calculator' },
      { href: '/tip-calculator', label: 'Tip Calculator' },
    ]
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '32px 24px',
          marginBottom: 40,
          paddingBottom: 40,
          borderBottom: '0.5px solid var(--color-border-tertiary)'
        }}>
          {FOOTER_TOOLS.map(cat => (
            <div key={cat.category}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 12
              }}>
                {cat.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {cat.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: 13,
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      lineHeight: 1.4
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
            © {new Date().getFullYear()} ScholarTools — Free tools for students worldwide
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/about" style={{ fontSize: 13, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>About</Link>
            <Link href="/privacy-policy" style={{ fontSize: 13, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: 13, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
