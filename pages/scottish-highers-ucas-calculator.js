import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const QUAL_TYPES = {
  higher: {
    label: 'Scottish Higher',
    icon: '🏴',
    grades: [
      { grade: 'A', points: 33 },
      { grade: 'B', points: 27 },
      { grade: 'C', points: 21 },
      { grade: 'D', points: 15 },
    ]
  },
  advHigher: {
    label: 'Advanced Higher',
    icon: '🎓',
    grades: [
      { grade: 'A', points: 56 },
      { grade: 'B', points: 48 },
      { grade: 'C', points: 40 },
      { grade: 'D', points: 32 },
    ]
  },
  national5: {
    label: 'National 5',
    icon: '📘',
    grades: [
      { grade: 'A', points: 24 },
      { grade: 'B', points: 16 },
      { grade: 'C', points: 8 },
    ]
  },
}

const emptyQual = () => ({ id: Date.now() + Math.random(), type: 'higher', grade: '' })

export default function ScottishHighersCalculator() {
  const [qualifications, setQualifications] = useState([emptyQual(), emptyQual(), emptyQual(), emptyQual(), emptyQual()])
  const [result, setResult] = useState(null)

  const addQual = () => {
    if (qualifications.length >= 8) return
    setQualifications(q => [...q, emptyQual()])
  }
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
    const highersCount = breakdown.filter(b => b.type === 'higher' || b.type === 'advHigher').length

    setResult({ total, breakdown, highersCount })
  }

  const reset = () => {
    setQualifications([emptyQual(), emptyQual(), emptyQual(), emptyQual(), emptyQual()])
    setResult(null)
  }

  return (
    <Layout>
      <Head>
        <title>Scottish Highers UCAS Points Calculator — Free SQA Tool | ScholarTools</title>
        <meta name="description" content="Convert your Scottish Highers, Advanced Highers and National 5 grades to UCAS tariff points. Free calculator for Scottish students applying to UK universities." />
        <link rel="canonical" href="https://scholartools.co/scottish-highers-ucas-calculator" />
        <meta property="og:title" content="Scottish Highers UCAS Points Calculator | ScholarTools" />
        <meta property="og:description" content="Free UCAS points calculator built for Scottish qualifications. Convert Highers, Advanced Highers and National 5 grades instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Scottish Highers UCAS Points Calculator</div>
            <h1>🏴 Scottish Highers UCAS Points Calculator</h1>
            <p>Scottish students applying to universities outside Scotland use a completely different qualification system. This calculator converts Highers, Advanced Highers and National 5 grades into UCAS tariff points.</p>
          </div>

          {/* Explainer banner */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
            💡 <strong>Why this matters:</strong> Most UCAS calculators are built around A-Levels and ignore the Scottish Qualifications Authority (SQA) system entirely. If you are studying Highers or Advanced Highers, this tool gives you accurate UCAS points without forcing your grades into an A-Level shaped box.
          </div>

          <div className="card">
            <label className="label">Your Qualifications (up to 8)</label>
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

            {qualifications.length < 8 && (
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addQual}>
                + Add Another Qualification
              </button>
            )}

            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate UCAS Points →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                <div style={{ background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your Total UCAS Points</div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{result.total}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>from {result.breakdown.length} qualification{result.breakdown.length > 1 ? 's' : ''}</div>
                </div>

                {result.highersCount > 0 && result.highersCount < 4 && (
                  <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#92400E' }}>
                    ⚠️ Most universities specify a minimum number of Highers (typically 4–5) rather than UCAS points alone. Check your target course's specific entry requirements, not just the total points.
                  </div>
                )}

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
              </div>
            )}
          </div>

          {/* SQA explainer */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 10 }}>Understanding the Scottish Qualification System</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
              Scotland runs its own qualifications through the Scottish Qualifications Authority (SQA), separate from the A-Level system used in England, Wales and Northern Ireland. Students typically take <strong>National 5s</strong> around age 15-16 (roughly equivalent to GCSEs), followed by <strong>Highers</strong> in S5 (age 16-17), and optionally <strong>Advanced Highers</strong> in S6 (age 17-18).
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
              A typical Scottish university applicant presents 4-5 Highers, while students applying to universities outside Scotland (particularly competitive English universities) often take Advanced Highers as well to strengthen their application, since a single Higher carries less UCAS weight than a full A-Level.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
              Non-Scottish admissions tutors are not always familiar with this system, which is exactly why Scottish students benefit from converting their results into the universal UCAS points scale when applying to universities across the rest of the UK.
            </p>
          </div>

          {/* Reference table */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>Full Points Reference Table</h2>
            {Object.entries(QUAL_TYPES).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{val.icon} {val.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 6 }}>
                  {val.grades.map(g => (
                    <div key={g.grade} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{g.grade}</div>
                      <div style={{ fontSize: 11, color: 'var(--accent)' }}>{g.points} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 4 }}>
              Note: National 5 qualifications carry UCAS points but most universities specify Higher-level minimums rather than accepting National 5 points alone.
            </div>
          </div>

          {/* Cross links */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 16, marginBottom: 10 }}>Applying with A-Levels or BTEC Too?</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/ucas-points-calculator" className="btn btn-secondary btn-sm">A-Level UCAS Calculator →</Link>
              <Link href="/btec-ucas-points-calculator" className="btn btn-secondary btn-sm">BTEC UCAS Calculator →</Link>
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>Scottish Highers UCAS Points Calculator</h2>
            <p>This Scottish Highers UCAS points calculator converts Higher, Advanced Higher, and National 5 grades into UCAS tariff points for university applications. Scottish qualifications carry different point values to A-Levels — a Higher grade A is worth 33 UCAS points compared to an A-Level A at 48 points, reflecting the different depth and structure of each qualification.</p>
            <p>Scottish students applying to universities outside Scotland face a particular challenge: many UCAS calculators and even admissions tutors default to thinking in A-Level terms, which can undervalue the Scottish system if not converted properly. This tool is built specifically to give Scottish students an accurate UCAS points total using official SQA-aligned tariff values, whether applying to Scottish universities (which typically ask for Highers directly) or universities across the rest of the UK (which convert to UCAS points).</p>
            <p>Applying with a mix of qualifications? Use our <a href="/ucas-points-calculator">A-Level UCAS Calculator</a> or <a href="/btec-ucas-points-calculator">BTEC UCAS Calculator</a> to combine totals across different qualification types.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
