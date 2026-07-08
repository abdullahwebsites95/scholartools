import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const QUAL_TYPES = {
  alevel: {
    label: 'A-Level',
    icon: '📘',
    grades: [
      { grade: 'A*', points: 56 },
      { grade: 'A', points: 48 },
      { grade: 'B', points: 40 },
      { grade: 'C', points: 32 },
      { grade: 'D', points: 24 },
      { grade: 'E', points: 16 },
    ]
  },
  aslevel: {
    label: 'AS-Level',
    icon: '📗',
    grades: [
      { grade: 'A', points: 28 },
      { grade: 'B', points: 20 },
      { grade: 'C', points: 16 },
      { grade: 'D', points: 10 },
      { grade: 'E', points: 6 },
    ]
  },
  ib: {
    label: 'International Baccalaureate (per subject)',
    icon: '🌐',
    grades: [
      { grade: '7', points: 130 },
      { grade: '6', points: 110 },
      { grade: '5', points: 80 },
      { grade: '4', points: 60 },
      { grade: '3', points: 40 },
      { grade: '2', points: 20 },
    ]
  },
  epq: {
    label: 'EPQ (Extended Project Qualification)',
    icon: '📝',
    grades: [
      { grade: 'A*', points: 28 },
      { grade: 'A', points: 24 },
      { grade: 'B', points: 20 },
      { grade: 'C', points: 16 },
      { grade: 'D', points: 12 },
      { grade: 'E', points: 8 },
    ]
  },
  scottishHigher: {
    label: 'Scottish Higher',
    icon: '🏴',
    grades: [
      { grade: 'A', points: 33 },
      { grade: 'B', points: 27 },
      { grade: 'C', points: 21 },
      { grade: 'D', points: 15 },
    ]
  },
  scottishAdvHigher: {
    label: 'Scottish Advanced Higher',
    icon: '🏴',
    grades: [
      { grade: 'A', points: 56 },
      { grade: 'B', points: 48 },
      { grade: 'C', points: 40 },
      { grade: 'D', points: 32 },
    ]
  },
}

const UNI_THRESHOLDS = [
  { tier: 'Russell Group (Oxbridge, Imperial, LSE)', range: '160 – 200+ points', color: '#DC2626', note: 'Typically A*A*A to AAA at A-Level' },
  { tier: 'Russell Group (Other)', range: '128 – 160 points', color: '#D97706', note: 'Typically ABB to AAB at A-Level' },
  { tier: 'Post-92 / Modern Universities', range: '96 – 128 points', color: '#2563EB', note: 'Typically BBC to BBB at A-Level' },
  { tier: 'Foundation / Access Courses', range: '64 – 96 points', color: '#059669', note: 'Typically CCD to BCC at A-Level' },
]

const emptyQual = () => ({ id: Date.now() + Math.random(), type: 'alevel', grade: '' })

export default function UCASCalculator() {
  const [qualifications, setQualifications] = useState([emptyQual(), emptyQual(), emptyQual()])
  const [result, setResult] = useState(null)

  const addQual = () => setQualifications(q => [...q, emptyQual()])
  const removeQual = id => setQualifications(q => q.filter(x => x.id !== id))
  const updateQual = (id, field, val) => {
    setQualifications(q => q.map(x => {
      if (x.id === id) {
        const updated = { ...x, [field]: val }
        if (field === 'type') updated.grade = ''
        return updated
      }
      return x
    }))
    setResult(null)
  }

  const calculate = () => {
    const valid = qualifications.filter(q => q.grade !== '')
    if (valid.length === 0) return

    const breakdown = valid.map(q => {
      const qualData = QUAL_TYPES[q.type]
      const gradeData = qualData.grades.find(g => g.grade === q.grade)
      return {
        ...q,
        typeLabel: qualData.label,
        icon: qualData.icon,
        points: gradeData ? gradeData.points : 0,
      }
    })

    const total = breakdown.reduce((sum, b) => sum + b.points, 0)
    setResult({ total, breakdown })
  }

  const reset = () => {
    setQualifications([emptyQual(), emptyQual(), emptyQual()])
    setResult(null)
  }

  return (
    <Layout>
      <Head>
        <title>UCAS Points Calculator 2026 — Free Tariff Calculator | ScholarTools</title>
        <meta name="description" content="Calculate your UCAS tariff points instantly. Supports A-Level, AS-Level, IB, EPQ and Scottish Highers. Free UCAS points calculator for university applications." />
        <link rel="canonical" href="https://scholartools.co/ucas-points-calculator" />
        <meta property="og:title" content="UCAS Points Calculator | ScholarTools" />
        <meta property="og:description" content="Free UCAS tariff points calculator. Add A-Levels, AS-Levels, IB, EPQ and Scottish qualifications to get your total UCAS points instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / UCAS Points Calculator</div>
            <h1>🎯 UCAS Points Calculator 2026</h1>
            <p>Add your qualifications and grades to calculate your total UCAS tariff points for university applications. Supports A-Level, AS-Level, IB, EPQ and Scottish qualifications.</p>
          </div>

          <div className="card">
            <label className="label">Your Qualifications</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {qualifications.map(q => {
                const qualData = QUAL_TYPES[q.type]
                return (
                  <div key={q.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <select className="select" value={q.type} onChange={e => updateQual(q.id, 'type', e.target.value)}>
                      {Object.entries(QUAL_TYPES).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {val.label}</option>
                      ))}
                    </select>
                    <select className="select" value={q.grade} onChange={e => updateQual(q.id, 'grade', e.target.value)}>
                      <option value="">Select grade</option>
                      {qualData.grades.map(g => (
                        <option key={g.grade} value={g.grade}>{g.grade} ({g.points} pts)</option>
                      ))}
                    </select>
                    {qualifications.length > 1 && (
                      <button className="btn btn-danger btn-sm" onClick={() => removeQual(q.id)}>✕</button>
                    )}
                  </div>
                )
              })}
            </div>

            <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addQual}>
              + Add Another Qualification
            </button>

            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate UCAS Points →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Running total */}
                <div style={{ background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your Total UCAS Points</div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{result.total}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>from {result.breakdown.length} qualification{result.breakdown.length > 1 ? 's' : ''}</div>
                </div>

                {/* Breakdown */}
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                    Points Breakdown
                  </div>
                  {result.breakdown.map((b, i) => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < result.breakdown.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{b.icon} {b.typeLabel}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Grade {b.grade}</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{b.points} pts</div>
                    </div>
                  ))}
                </div>

                {/* Which tier they qualify for */}
                <div style={{ marginTop: 16, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>What Your Points Mean</div>
                  {UNI_THRESHOLDS.map(t => {
                    const [min] = t.range.split(' – ').map(s => parseInt(s))
                    const qualifies = result.total >= min
                    return (
                      <div key={t.tier} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13 }}>
                        <span style={{ fontSize: 16 }}>{qualifies ? '✅' : '⬜'}</span>
                        <span style={{ color: qualifies ? t.color : 'var(--text-3)', fontWeight: qualifies ? 600 : 400 }}>{t.tier}</span>
                        <span style={{ color: 'var(--text-3)', fontSize: 12 }}>({t.range})</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* University thresholds reference */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Typical UCAS Points Requirements by University Tier</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>General guidance only — always check specific course entry requirements as they vary significantly by subject and institution.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {UNI_THRESHOLDS.map(t => (
                <div key={t.tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: `1px solid ${t.color}30` }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: t.color }}>{t.tier}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.note}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: t.color }}>{t.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BTEC note */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 8 }}>Applying with BTEC Qualifications?</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12 }}>
              BTEC qualifications use a different points structure based on qualification size (Extended Certificate, Diploma, Extended Diploma). Use our dedicated BTEC calculator for accurate BTEC to UCAS point conversion.
            </p>
            <Link href="/btec-ucas-points-calculator" className="btn btn-secondary btn-sm">
              Go to BTEC UCAS Calculator →
            </Link>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>UCAS Points Calculator — 2026 University Applications</h2>
            <p>This UCAS points calculator converts your A-Level, AS-Level, International Baccalaureate, EPQ, and Scottish qualification grades into UCAS tariff points for UK university applications. The UCAS tariff system allows universities to compare applicants across different qualification types on a single points scale, with A-Level grades ranging from A* (56 points) down to E (16 points).</p>
            <p>Most Russell Group universities require between 128 and 200 UCAS points depending on the course and competitiveness, while post-92 universities typically ask for 96 to 128 points. Always check the specific entry requirements for your chosen course, as some universities specify required grades in individual subjects rather than total tariff points alone.</p>
            <p>Also check your <a href="/uk-degree-classification-calculator">UK Degree Classification</a> once at university, or use our <a href="/student-rent-calculator">Student Rent Calculator UK</a> to plan your accommodation budget.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
