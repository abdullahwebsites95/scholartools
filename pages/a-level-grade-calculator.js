import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const EXAM_BOARDS = ['AQA', 'OCR', 'Edexcel / Pearson', 'WJEC', 'CCEA']

// Generic UMS boundary reference (varies by board/subject/year - shown as guidance only)
const UMS_BOUNDARIES = [
  { grade: 'A*', min: 90, max: 100, color: '#059669' },
  { grade: 'A', min: 80, max: 89, color: '#059669' },
  { grade: 'B', min: 70, max: 79, color: '#2563EB' },
  { grade: 'C', min: 60, max: 69, color: '#D97706' },
  { grade: 'D', min: 50, max: 59, color: '#D97706' },
  { grade: 'E', min: 40, max: 49, color: '#DC2626' },
  { grade: 'U', min: 0, max: 39, color: '#991B1B' },
]

const GRADE_HIERARCHY = ['A*', 'A', 'B', 'C', 'D', 'E', 'U']

function getUMSGrade(pct) {
  // Cascading check from highest to lowest — no gaps for decimal percentages
  if (pct >= 90) return UMS_BOUNDARIES[0]  // A*
  if (pct >= 80) return UMS_BOUNDARIES[1]  // A
  if (pct >= 70) return UMS_BOUNDARIES[2]  // B
  if (pct >= 60) return UMS_BOUNDARIES[3]  // C
  if (pct >= 50) return UMS_BOUNDARIES[4]  // D
  if (pct >= 40) return UMS_BOUNDARIES[5]  // E
  return UMS_BOUNDARIES[6]                  // U
}

function meetsGrade(achieved, required) {
  return GRADE_HIERARCHY.indexOf(achieved) <= GRADE_HIERARCHY.indexOf(required)
}

export default function ALevelGradeCalculator() {
  const [mode, setMode] = useState('ums')
  const [board, setBoard] = useState('AQA')

  // UMS mode
  const [umsScore, setUmsScore] = useState('')
  const [umsTotal, setUmsTotal] = useState('600')
  const [umsResult, setUmsResult] = useState(null)
  const [umsError, setUmsError] = useState('')

  // Offer checker mode
  const [predictedGrades, setPredictedGrades] = useState(['A', 'A', 'B'])
  const [requiredGrades, setRequiredGrades] = useState(['A', 'A', 'A'])
  const [offerResult, setOfferResult] = useState(null)

  const calculateUMS = () => {
    setUmsError('')
    setUmsResult(null)
    const score = parseFloat(umsScore)
    const total = parseFloat(umsTotal)
    if (isNaN(score) || umsScore === '') { setUmsError('Please enter your UMS score.'); return }
    if (score < 0) { setUmsError('UMS score cannot be negative.'); return }
    if (score > total) { setUmsError('UMS score cannot exceed the total available UMS.'); return }
    if (total <= 0) { setUmsError('Total UMS must be greater than zero.'); return }

    const pct = (score / total) * 100
    const grade = getUMSGrade(pct)
    setUmsResult({ pct: pct.toFixed(1), grade, score, total })
  }

  const updatePredicted = (i, val) => {
    const updated = [...predictedGrades]
    updated[i] = val
    setPredictedGrades(updated)
    setOfferResult(null)
  }
  const updateRequired = (i, val) => {
    const updated = [...requiredGrades]
    updated[i] = val
    setRequiredGrades(updated)
    setOfferResult(null)
  }
  const addSubject = () => {
    setPredictedGrades([...predictedGrades, 'B'])
    setRequiredGrades([...requiredGrades, 'B'])
    setOfferResult(null)
  }
  const removeSubject = (i) => {
    setPredictedGrades(predictedGrades.filter((_, idx) => idx !== i))
    setRequiredGrades(requiredGrades.filter((_, idx) => idx !== i))
    setOfferResult(null)
  }

  const checkOffer = () => {
    const comparisons = predictedGrades.map((pred, i) => {
      const req = requiredGrades[i]
      const meets = meetsGrade(pred, req)
      return { subject: i + 1, predicted: pred, required: req, meets }
    })
    const allMet = comparisons.every(c => c.meets)
    const missedCount = comparisons.filter(c => !c.meets).length

    setOfferResult({ comparisons, allMet, missedCount })
  }

  return (
    <Layout>
      <Head>
        <title>A-Level Grade Calculator — Free A Level Results Tool | ScholarTools</title>
        <meta name="description" content="Calculate your A-Level grade from UMS score, or check if you meet your university offer. Free A-Level results calculator for AQA, OCR, Edexcel and more." />
        <link rel="canonical" href="https://scholartools.co/a-level-grade-calculator" />
        <meta property="og:title" content="A-Level Grade Calculator | ScholarTools" />
        <meta property="og:description" content="Free A-Level grade calculator. Convert UMS to grade or check if your predicted grades meet your university offer requirements." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / A-Level Grade Calculator</div>
            <h1>📊 A-Level Grade Calculator</h1>
            <p>Convert your UMS score to a grade, or check whether your predicted or achieved grades meet your university offer. Built for results day.</p>
          </div>

          {/* Exam board selector */}
          <div className="field" style={{ marginBottom: 20 }}>
            <label className="label">Exam Board</label>
            <select className="select" value={board} onChange={e => setBoard(e.target.value)}>
              {EXAM_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <div className="text-muted" style={{ marginTop: 6 }}>
              ⚠️ UMS scales differ by board and subject. This tool uses generic reference boundaries — always check your official exam board grade boundaries for exact figures.
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button className={`btn ${mode === 'ums' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => setMode('ums')}>
              📈 UMS to Grade
            </button>
            <button className={`btn ${mode === 'offer' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => setMode('offer')}>
              🎯 Check My Offer
            </button>
          </div>

          {mode === 'ums' && (
            <div className="card">
              <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>UMS to Grade Converter</h2>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>Enter your total UMS score for the subject to get your approximate grade.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label className="label">Your UMS Score</label>
                  <input className="input" type="number" placeholder="e.g. 480"
                    value={umsScore} onChange={e => { setUmsScore(e.target.value); setUmsResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total UMS Available</label>
                  <input className="input" type="number" placeholder="600"
                    value={umsTotal} onChange={e => { setUmsTotal(e.target.value); setUmsResult(null) }} />
                  <div className="text-muted" style={{ marginTop: 4 }}>Standard full A-Level is usually 600 UMS</div>
                </div>
              </div>

              {umsError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 12 }}>
                  ⚠️ {umsError}
                </div>
              )}

              <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16 }} onClick={calculateUMS}>
                Calculate Grade →
              </button>

              {umsResult && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ background: umsResult.grade.color + '15', border: `2px solid ${umsResult.grade.color}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: umsResult.grade.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Approximate Grade</div>
                    <div style={{ fontSize: 64, fontWeight: 800, color: umsResult.grade.color, lineHeight: 1 }}>{umsResult.grade.grade}</div>
                    <div style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>{umsResult.score}/{umsResult.total} UMS ({umsResult.pct}%)</div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-3)', textAlign: 'center', fontStyle: 'italic' }}>
                    {board} boundaries may differ slightly. Check official grade boundaries for exact confirmation.
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'offer' && (
            <div className="card">
              <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Check If You Meet Your Offer</h2>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>Enter your predicted or achieved grades alongside what your university offer requires.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: 8, marginBottom: 6, padding: '0 4px' }}>
                <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Your Grade</span>
                <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Required Grade</span>
                <span></span>
              </div>
              {predictedGrades.map((pred, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <select className="select" value={pred} onChange={e => updatePredicted(i, e.target.value)}>
                    {GRADE_HIERARCHY.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select className="select" value={requiredGrades[i]} onChange={e => updateRequired(i, e.target.value)}>
                    {GRADE_HIERARCHY.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {predictedGrades.length > 1 && (
                    <button className="btn btn-danger btn-sm" onClick={() => removeSubject(i)}>✕</button>
                  )}
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" onClick={addSubject}>+ Add Subject</button>

              <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16 }} onClick={checkOffer}>
                Check My Offer →
              </button>

              {offerResult && (
                <div style={{ marginTop: 24 }}>
                  <div style={{
                    background: offerResult.allMet ? '#ECFDF5' : '#FEF2F2',
                    border: `2px solid ${offerResult.allMet ? '#059669' : '#DC2626'}`,
                    borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>{offerResult.allMet ? '🎉' : '⚠️'}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: offerResult.allMet ? '#059669' : '#DC2626' }}>
                      {offerResult.allMet ? 'You Meet Your Offer!' : `You Are Missing ${offerResult.missedCount} Grade${offerResult.missedCount > 1 ? 's' : ''}`}
                    </div>
                    {!offerResult.allMet && (
                      <div style={{ fontSize: 13, color: '#991B1B', marginTop: 8, lineHeight: 1.6 }}>
                        Your university may still accept you through Adjustment, or you can explore Clearing for alternative places. Contact your firm choice university directly — many have flexibility depending on the course and circumstances.
                      </div>
                    )}
                  </div>

                  <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {offerResult.comparisons.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < offerResult.comparisons.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                        <span style={{ fontSize: 13 }}>Subject {c.subject}: <strong>{c.predicted}</strong> vs required <strong>{c.required}</strong></span>
                        <span style={{ fontSize: 16 }}>{c.meets ? '✅' : '❌'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* UMS Reference table */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Generic UMS Grade Boundaries</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>These are typical reference boundaries. Your exam board's exact boundaries may vary by subject and year.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Grade</th><th>UMS Percentage</th></tr></thead>
                <tbody>
                  {UMS_BOUNDARIES.map(g => (
                    <tr key={g.grade}>
                      <td><span style={{ background: g.color + '15', color: g.color, padding: '2px 12px', borderRadius: 10, fontWeight: 700, fontSize: 13 }}>{g.grade}</span></td>
                      <td style={{ fontSize: 13 }}>{g.min}% – {g.max}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>A-Level Grade Calculator — Results Day Tool</h2>
            <p>This A-Level grade calculator helps students convert their UMS score into an approximate grade, and check whether their predicted or achieved grades meet their university offer requirements. UMS (Uniform Mark Scale) scores allow comparison across different exam sittings and papers, though exact grade boundaries vary by exam board, subject, and year — always confirm with your official exam board results.</p>
            <p>If you do not meet your firm choice offer on results day, do not panic. UCAS Adjustment allows students who exceed their offer to explore alternative courses, while Clearing offers places at universities with remaining spaces for students who missed their offer or did not receive one. Both processes open on A-Level results day in August.</p>
            <p>Also calculate your <a href="/ucas-points-calculator">UCAS Points</a> for additional applications, or check your <a href="/uk-degree-classification-calculator">UK Degree Classification</a> once you start university.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
