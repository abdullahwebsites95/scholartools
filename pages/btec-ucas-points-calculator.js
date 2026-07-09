import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

// Official UCAS Tariff points for BTEC qualifications
const BTEC_TYPES = {
  extendedDiploma: {
    label: 'BTEC Extended Diploma',
    equivalent: '3 A-Levels',
    icon: '🎓',
    grades: [
      { grade: 'D*D*D*', points: 168 },
      { grade: 'D*D*D', points: 160 },
      { grade: 'D*DD', points: 152 },
      { grade: 'DDD', points: 144 },
      { grade: 'DDM', points: 128 },
      { grade: 'DMM', points: 112 },
      { grade: 'MMM', points: 96 },
      { grade: 'MMP', points: 80 },
      { grade: 'MPP', points: 64 },
      { grade: 'PPP', points: 48 },
    ]
  },
  diploma: {
    label: 'BTEC Diploma',
    equivalent: '2 A-Levels',
    icon: '📘',
    grades: [
      { grade: 'D*D*', points: 112 },
      { grade: 'D*D', points: 104 },
      { grade: 'DD', points: 96 },
      { grade: 'DM', points: 80 },
      { grade: 'MM', points: 64 },
      { grade: 'MP', points: 48 },
      { grade: 'PP', points: 32 },
    ]
  },
  extendedCert: {
    label: 'BTEC Extended Certificate',
    equivalent: '1 A-Level',
    icon: '📗',
    grades: [
      { grade: 'D*', points: 56 },
      { grade: 'D', points: 48 },
      { grade: 'M', points: 32 },
      { grade: 'P', points: 16 },
    ]
  },
}

const ALEVEL_GRADES = [
  { grade: 'A*', points: 56 },
  { grade: 'A', points: 48 },
  { grade: 'B', points: 40 },
  { grade: 'C', points: 32 },
  { grade: 'D', points: 24 },
  { grade: 'E', points: 16 },
]

const emptyBtec = () => ({ id: Date.now() + Math.random(), type: 'extendedDiploma', grade: '' })
const emptyAlevel = () => ({ id: Date.now() + Math.random(), grade: '' })

export default function BTECCalculator() {
  const [btecs, setBtecs] = useState([emptyBtec()])
  const [includeAlevels, setIncludeAlevels] = useState(false)
  const [alevels, setAlevels] = useState([emptyAlevel()])
  const [result, setResult] = useState(null)

  const addBtec = () => setBtecs(b => [...b, emptyBtec()])
  const removeBtec = id => setBtecs(b => b.filter(x => x.id !== id))
  const updateBtec = (id, field, val) => {
    setBtecs(b => b.map(x => {
      if (x.id === id) {
        const updated = { ...x, [field]: val }
        if (field === 'type') updated.grade = ''
        return updated
      }
      return x
    }))
    setResult(null)
  }

  const addAlevel = () => setAlevels(a => [...a, emptyAlevel()])
  const removeAlevel = id => setAlevels(a => a.filter(x => x.id !== id))
  const updateAlevel = (id, val) => {
    setAlevels(a => a.map(x => x.id === id ? { ...x, grade: val } : x))
    setResult(null)
  }

  const calculate = () => {
    const validBtecs = btecs.filter(b => b.grade !== '')
    const validAlevels = includeAlevels ? alevels.filter(a => a.grade !== '') : []

    if (validBtecs.length === 0 && validAlevels.length === 0) return

    const btecBreakdown = validBtecs.map(b => {
      const typeData = BTEC_TYPES[b.type]
      const gradeData = typeData.grades.find(g => g.grade === b.grade)
      return {
        ...b,
        typeLabel: typeData.label,
        equivalent: typeData.equivalent,
        icon: typeData.icon,
        points: gradeData ? gradeData.points : 0,
      }
    })

    const alevelBreakdown = validAlevels.map(a => {
      const gradeData = ALEVEL_GRADES.find(g => g.grade === a.grade)
      return { ...a, points: gradeData ? gradeData.points : 0 }
    })

    const btecTotal = btecBreakdown.reduce((sum, b) => sum + b.points, 0)
    const alevelTotal = alevelBreakdown.reduce((sum, a) => sum + a.points, 0)
    const grandTotal = btecTotal + alevelTotal

    setResult({ btecBreakdown, alevelBreakdown, btecTotal, alevelTotal, grandTotal })
  }

  const reset = () => {
    setBtecs([emptyBtec()])
    setAlevels([emptyAlevel()])
    setResult(null)
  }

  return (
    <Layout>
      <Head>
        <title>BTEC UCAS Points Calculator — Free BTEC to UCAS Converter | ScholarTools</title>
        <meta name="description" content="Convert your BTEC grades to UCAS tariff points instantly. Supports Extended Diploma, Diploma and Extended Certificate. Mix with A-Levels for combined totals." />
        <link rel="canonical" href="https://scholartools.co/btec-ucas-points-calculator" />
        <meta property="og:title" content="BTEC UCAS Points Calculator | ScholarTools" />
        <meta property="og:description" content="Free BTEC to UCAS points converter. Calculate your tariff points from BTEC Extended Diploma, Diploma or Certificate, with option to mix with A-Levels." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / BTEC UCAS Points Calculator</div>
            <h1>📗 BTEC UCAS Points Calculator</h1>
            <p>Convert your BTEC grades into UCAS tariff points instantly. Over 700,000 BTEC students in England apply to university every year — this calculator is built specifically for you.</p>
          </div>

          <div className="card">
            <label className="label">Your BTEC Qualification(s)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {btecs.map(b => {
                const typeData = BTEC_TYPES[b.type]
                return (
                  <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <select className="select" value={b.type} onChange={e => updateBtec(b.id, 'type', e.target.value)}>
                      {Object.entries(BTEC_TYPES).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {val.label} ({val.equivalent})</option>
                      ))}
                    </select>
                    <select className="select" value={b.grade} onChange={e => updateBtec(b.id, 'grade', e.target.value)}>
                      <option value="">Select grade</option>
                      {typeData.grades.map(g => (
                        <option key={g.grade} value={g.grade}>{g.grade} ({g.points} pts)</option>
                      ))}
                    </select>
                    {btecs.length > 1 && (
                      <button className="btn btn-danger btn-sm" onClick={() => removeBtec(b.id)}>✕</button>
                    )}
                  </div>
                )
              })}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addBtec}>
              + Add Another BTEC
            </button>

            {/* A-Level mixing toggle */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: includeAlevels ? 14 : 0 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Also studying A-Levels alongside your BTEC?</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Add them here for a combined UCAS points total</div>
                </div>
                <button className={`btn btn-sm ${includeAlevels ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => { setIncludeAlevels(v => !v); setResult(null) }}>
                  {includeAlevels ? 'Remove A-Levels' : '+ Add A-Levels'}
                </button>
              </div>

              {includeAlevels && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {alevels.map(a => (
                    <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                      <select className="select" value={a.grade} onChange={e => updateAlevel(a.id, e.target.value)}>
                        <option value="">Select A-Level grade</option>
                        {ALEVEL_GRADES.map(g => (
                          <option key={g.grade} value={g.grade}>{g.grade} ({g.points} pts)</option>
                        ))}
                      </select>
                      {alevels.length > 1 && (
                        <button className="btn btn-danger btn-sm" onClick={() => removeAlevel(a.id)}>✕</button>
                      )}
                    </div>
                  ))}
                  <button className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }} onClick={addAlevel}>
                    + Add Another A-Level
                  </button>
                </div>
              )}
            </div>

            <div className="btn-group" style={{ marginTop: 20 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate UCAS Points →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Total */}
                <div style={{ background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your Total UCAS Points</div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{result.grandTotal}</div>
                  {result.alevelTotal > 0 && (
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
                      {result.btecTotal} from BTEC + {result.alevelTotal} from A-Levels
                    </div>
                  )}
                </div>

                {/* BTEC Breakdown */}
                {result.btecBreakdown.length > 0 && (
                  <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 12 }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                      BTEC Points Breakdown
                    </div>
                    {result.btecBreakdown.map((b, i) => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < result.btecBreakdown.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{b.icon} {b.typeLabel}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Grade {b.grade} · {b.equivalent}</div>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{b.points} pts</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* A-Level Breakdown */}
                {result.alevelBreakdown.length > 0 && (
                  <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ background: '#059669', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                      A-Level Points Breakdown
                    </div>
                    {result.alevelBreakdown.map((a, i) => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < result.alevelBreakdown.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>A-Level Grade {a.grade}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>{a.points} pts</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BTEC Guide */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>BTEC UCAS Points — Full Reference Table</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Official UCAS tariff values for all three BTEC sizes.</p>

            {Object.entries(BTEC_TYPES).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                  {val.icon} {val.label} <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>(equivalent to {val.equivalent})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 6 }}>
                  {val.grades.map(g => (
                    <div key={g.grade} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{g.grade}</div>
                      <div style={{ fontSize: 11, color: 'var(--accent)' }}>{g.points} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* T-Levels note */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 16, marginBottom: 8 }}>What About T-Levels and Cambridge Technicals?</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              T-Levels are a newer qualification with their own distinct UCAS points structure, ranging from 96 points (Pass) up to 168 points (Distinction*) — similar scale to BTEC Extended Diploma but with different assessment criteria. Cambridge Technicals also carry UCAS tariff points but use a different grading scale (Distinction*, Distinction, Merit, Pass at various levels). If you are studying either of these, check the official UCAS tariff tables for your specific qualification, as point values are updated periodically.
            </p>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>BTEC UCAS Points Calculator</h2>
            <p>This BTEC UCAS points calculator converts your BTEC National grades into UCAS tariff points for university applications. BTEC qualifications come in three main sizes — the Extended Diploma (equivalent to three A-Levels, worth up to 168 points for D*D*D*), the Diploma (equivalent to two A-Levels, worth up to 112 points), and the Extended Certificate (equivalent to one A-Level, worth up to 56 points).</p>
            <p>Over 700,000 BTEC students apply to UK universities every year, yet most UCAS calculators are built primarily around A-Levels and treat BTEC as an afterthought. This tool is specifically designed for BTEC students, including the ability to mix BTEC grades with A-Level results for students taking a combined qualification pathway.</p>
            <p>Also use our <a href="/ucas-points-calculator">UCAS Points Calculator</a> for A-Level, IB and Scottish qualifications, or check your <a href="/uk-degree-classification-calculator">UK Degree Classification</a> once at university.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
