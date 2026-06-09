import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const NUMS_COLLEGES = [
  { college: 'Army Medical College (AMC)', city: 'Rawalpindi', seats: 'MBBS — 150 seats', lastMerit: '86.20%' },
  { college: 'Pak Emirates Military Hospital (PEMH)', city: 'Rawalpindi', seats: 'MBBS — 50 seats', lastMerit: '84.80%' },
  { college: 'Fauji Foundation Medical College', city: 'Rawalpindi', seats: 'MBBS — 100 seats', lastMerit: '83.50%' },
  { college: 'Fazaia Medical College', city: 'Lahore', seats: 'MBBS — 100 seats', lastMerit: '83.20%' },
  { college: 'Bahria University Medical College', city: 'Karachi', seats: 'MBBS — 100 seats', lastMerit: '82.40%' },
  { college: 'Abwa Medical College', city: 'Faisalabad', seats: 'MBBS — 100 seats', lastMerit: '81.80%' },
  { college: 'Shahida Islam Medical College', city: 'Lodhran', seats: 'MBBS — 100 seats', lastMerit: '80.60%' },
  { college: 'Aziz Fatimah Medical College', city: 'Faisalabad', seats: 'MBBS — 100 seats', lastMerit: '80.20%' },
]

const NUMS_FACTS = [
  { fact: 'Different from PMDC formula', detail: 'NUMS uses FSc 50% + MDCAT 50%. Matric marks are NOT included unlike PMDC formula which gives Matric 10%.' },
  { fact: 'MDCAT score is same', detail: 'You use the same MDCAT score as for PMDC colleges. No separate NUMS test — just your PMC MDCAT result.' },
  { fact: 'Two separate merit lists', detail: 'NUMS runs its own independent admission process. Apply separately from PMDC. Deadlines may differ.' },
  { fact: 'FSc matters more here', detail: 'Since Matric is excluded, FSc carries 50% of your aggregate. A strong FSc can significantly boost your NUMS merit.' },
]

export default function NUMSCalculator() {
  const [fscObtained, setFscObtained] = useState('')
  const [fscTotal, setFscTotal] = useState('')
  const [mdcatScore, setMdcatScore] = useState('')
  const [mdcatTotal, setMdcatTotal] = useState('210')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Optional: also show PMDC aggregate for comparison
  const [showPMDC, setShowPMDC] = useState(false)
  const [matricObtained, setMatricObtained] = useState('')
  const [matricTotal, setMatricTotal] = useState('')

  const calculate = () => {
    setError('')
    setResult(null)

    const fObt = parseFloat(fscObtained)
    const fTot = parseFloat(fscTotal)
    const mdcat = parseFloat(mdcatScore)
    const mdcatTot = parseFloat(mdcatTotal)

    if ([fObt, fTot, mdcat, mdcatTot].some(isNaN) ||
      [fscObtained, fscTotal, mdcatScore].some(v => v === '')) {
      setError('Please fill in all required fields.'); return
    }
    if (fObt < 0 || mdcat < 0) { setError('Marks cannot be negative.'); return }
    if (fObt > fTot) { setError('FSc obtained marks cannot exceed total marks.'); return }
    if (mdcat > mdcatTot) { setError('MDCAT score cannot exceed total MDCAT marks.'); return }
    if (fTot <= 0 || mdcatTot <= 0) { setError('Total marks must be greater than zero.'); return }

    const fscPct = (fObt / fTot) * 100
    const mdcatPct = (mdcat / mdcatTot) * 100

    // NUMS Formula: FSc 50% + MDCAT 50%
    const numsAggregate = (fscPct * 0.50) + (mdcatPct * 0.50)

    // Optional PMDC comparison
    let pmdc = null
    if (showPMDC && matricObtained && matricTotal) {
      const mObt = parseFloat(matricObtained)
      const mTot = parseFloat(matricTotal)
      if (!isNaN(mObt) && !isNaN(mTot) && mTot > 0 && mObt <= mTot) {
        const matricPct = (mObt / mTot) * 100
        pmdc = {
          aggregate: ((matricPct * 0.10) + (fscPct * 0.40) + (mdcatPct * 0.50)).toFixed(2),
          matricPct: matricPct.toFixed(2)
        }
      }
    }

    let chances, chancesColor, chancesEmoji
    if (numsAggregate >= 86) {
      chances = 'Excellent — Army Medical College (AMC) Rawalpindi within reach'
      chancesColor = '#059669'; chancesEmoji = '🏆'
    } else if (numsAggregate >= 83) {
      chances = 'Very Good — Strong chance at PEMH, Fauji Foundation and Fazaia Medical College'
      chancesColor = '#059669'; chancesEmoji = '✅'
    } else if (numsAggregate >= 80) {
      chances = 'Good — Most NUMS affiliated colleges accessible. Apply broadly.'
      chancesColor = '#D97706'; chancesEmoji = '📈'
    } else if (numsAggregate >= 76) {
      chances = 'Moderate — Some NUMS colleges possible. Consider improving MDCAT score.'
      chancesColor = '#D97706'; chancesEmoji = '⚠️'
    } else {
      chances = 'Below typical NUMS threshold — Retaking MDCAT is strongly advised.'
      chancesColor = '#DC2626'; chancesEmoji = '🚨'
    }

    setResult({
      numsAggregate: numsAggregate.toFixed(4),
      numsDisplay: numsAggregate.toFixed(2),
      fscPct: fscPct.toFixed(2),
      mdcatPct: mdcatPct.toFixed(2),
      fscContrib: (fscPct * 0.50).toFixed(4),
      mdcatContrib: (mdcatPct * 0.50).toFixed(4),
      chances, chancesColor, chancesEmoji,
      pmdc,
    })
  }

  const reset = () => {
    setFscObtained(''); setFscTotal(''); setMdcatScore('')
    setMdcatTotal('210'); setMatricObtained(''); setMatricTotal('')
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>NUMS Aggregate Calculator 2025 — Army Medical College Merit | ScholarTools</title>
        <meta name="description" content="Calculate your NUMS aggregate for Army Medical College and NUMS affiliated colleges. Formula: FSc 50% + MDCAT 50%. Free NUMS merit calculator Pakistan." />
        <link rel="canonical" href="https://scholartools.co/nums-calculator" />
        <meta property="og:title" content="NUMS Aggregate Calculator Pakistan | ScholarTools" />
        <meta property="og:description" content="Free NUMS aggregate calculator for Army Medical Colleges. FSc 50% + MDCAT 50% formula. Compare your NUMS and PMDC aggregates side by side." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / NUMS Aggregate Calculator</div>
            <h1>🏥 NUMS Aggregate Calculator 2025</h1>
            <p>Calculate your admission aggregate for Army Medical College and all NUMS affiliated medical colleges. The NUMS formula is different from PMDC — Matric marks are not included here.</p>
          </div>

          {/* Formula Comparison Banner */}
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#C2410C', marginBottom: 10 }}>⚠️ NUMS Formula is Different from PMDC — Important!</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid #FED7AA' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#C2410C', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>NUMS Formula</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ background: '#FED7AA', color: '#9A3412', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', width: 'fit-content' }}>FSc 50%</span>
                  <span style={{ background: '#FED7AA', color: '#9A3412', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', width: 'fit-content' }}>MDCAT 50%</span>
                  <span style={{ fontSize: 11, color: '#92400E' }}>Matric NOT included</span>
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1D4ED8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>PMDC Formula</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', width: 'fit-content' }}>Matric 10%</span>
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', width: 'fit-content' }}>FSc 40%</span>
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', width: 'fit-content' }}>MDCAT 50%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            {/* FSc */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                📗 FSc Pre-Medical Marks <span style={{ color: '#D97706', fontWeight: 400 }}>(contributes 50%)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Obtained Marks</label>
                  <input className="input" type="number" placeholder="e.g. 980"
                    value={fscObtained} onChange={e => { setFscObtained(e.target.value); setResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total Marks</label>
                  <input className="input" type="number" placeholder="e.g. 1100"
                    value={fscTotal} onChange={e => { setFscTotal(e.target.value); setResult(null) }} />
                </div>
              </div>
            </div>

            {/* MDCAT */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                🏥 MDCAT Score <span style={{ color: '#D97706', fontWeight: 400 }}>(contributes 50%)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Your MDCAT Score</label>
                  <input className="input" type="number" placeholder="e.g. 175"
                    value={mdcatScore} onChange={e => { setMdcatScore(e.target.value); setResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total MDCAT Marks</label>
                  <input className="input" type="number" placeholder="210"
                    value={mdcatTotal} onChange={e => { setMdcatTotal(e.target.value); setResult(null) }} />
                  <div className="text-muted" style={{ marginTop: 4 }}>Default 210 — change if different year</div>
                </div>
              </div>
            </div>

            {/* Optional PMDC comparison */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPMDC ? 12 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Also compare with PMDC aggregate? <span style={{ fontSize: 12, color: 'var(--text-2)' }}>(optional)</span></div>
                <button className={`btn btn-sm ${showPMDC ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowPMDC(p => !p)}>
                  {showPMDC ? 'Hide' : 'Add Matric'}
                </button>
              </div>
              {showPMDC && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                  <div className="field">
                    <label className="label">Matric Obtained</label>
                    <input className="input" type="number" placeholder="e.g. 1050"
                      value={matricObtained} onChange={e => { setMatricObtained(e.target.value); setResult(null) }} />
                  </div>
                  <div className="field">
                    <label className="label">Matric Total</label>
                    <input className="input" type="number" placeholder="e.g. 1100"
                      value={matricTotal} onChange={e => { setMatricTotal(e.target.value); setResult(null) }} />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group">
              <button className="btn btn-primary btn-lg"
                style={{ flex: 1, background: '#D97706', borderColor: '#D97706' }}
                onClick={calculate}>
                Calculate NUMS Aggregate →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Side by side if PMDC comparison available */}
                {result.pmdc ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: '#FFF7ED', border: '2px solid #D97706', borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>NUMS Aggregate</div>
                      <div style={{ fontSize: 44, fontWeight: 800, color: '#C2410C', lineHeight: 1 }}>{result.numsDisplay}%</div>
                    </div>
                    <div style={{ background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>PMDC Aggregate</div>
                      <div style={{ fontSize: 44, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{result.pmdc.aggregate}%</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#FFF7ED', border: '2px solid #D97706', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your NUMS Aggregate</div>
                    <div style={{ fontSize: 64, fontWeight: 800, color: '#C2410C', lineHeight: 1 }}>{result.numsDisplay}%</div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>({result.numsAggregate}% exact)</div>
                  </div>
                )}

                {/* Chances */}
                <div style={{ background: result.chancesColor + '15', border: `1.5px solid ${result.chancesColor}`, borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{result.chancesEmoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: result.chancesColor, lineHeight: 1.5 }}>{result.chances}</div>
                </div>

                {/* Breakdown */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 12 }}>Score Breakdown</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'FSc Pre-Medical', pct: result.fscPct, contrib: result.fscContrib, weight: '50%', color: '#059669' },
                      { label: 'MDCAT Score', pct: result.mdcatPct, contrib: result.mdcatContrib, weight: '50%', color: '#D97706' },
                    ].map(row => (
                      <div key={row.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5, flexWrap: 'wrap', gap: 4 }}>
                          <span style={{ fontWeight: 500, color: 'var(--text)' }}>{row.label} <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>({row.weight} weight)</span></span>
                          <span style={{ fontWeight: 600, color: row.color }}>{row.pct}% → {row.contrib}%</span>
                        </div>
                        <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, parseFloat(row.pct))}%`, background: row.color, borderRadius: 4 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669', fontSize: 20 }}>{result.fscPct}%</div>
                    <div className="stat-lbl">FSc Percentage</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#D97706', fontSize: 20 }}>{result.mdcatPct}%</div>
                    <div className="stat-lbl">MDCAT Percentage</div>
                  </div>
                  <div className="stat-box" style={{ background: '#FFF7ED', border: '1px solid #D97706' }}>
                    <div className="stat-val" style={{ color: '#C2410C', fontSize: 20 }}>{result.numsDisplay}%</div>
                    <div className="stat-lbl">NUMS Aggregate</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NUMS Colleges */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>NUMS Affiliated Colleges — Closing Merit Reference</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>Approximate closing aggregates from recent NUMS admission cycles. Always verify with official NUMS merit lists.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>College</th>
                    <th>City</th>
                    <th>Seats</th>
                    <th>Last Closing Merit</th>
                  </tr>
                </thead>
                <tbody>
                  {NUMS_COLLEGES.map(row => (
                    <tr key={row.college}>
                      <td style={{ fontSize: 13 }}>{row.college}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{row.city}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.seats}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: '#D97706' }}>{row.lastMerit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NUMS Key Facts */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 12 }}>NUMS Admission — Key Facts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {NUMS_FACTS.map(f => (
                <div key={f.fact} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#D97706', marginBottom: 5 }}>💡 {f.fact}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{f.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>NUMS Aggregate Calculator — Army Medical College Admissions Pakistan</h2>
            <p>This NUMS aggregate calculator helps medical students calculate their admission merit for the National University of Medical Sciences and all affiliated Army Medical Colleges in Pakistan. Unlike the standard PMDC formula which includes Matric marks, the NUMS formula only uses FSc Pre-Medical marks at 50% weight and MDCAT score at 50% weight — making both components equally important and completely excluding Matric performance from the calculation.</p>
            <p>The most prestigious NUMS college is Army Medical College in Rawalpindi which typically requires an aggregate above 86% to secure a seat. Students applying to both PMDC and NUMS colleges can use the optional PMDC comparison feature in this tool to see both aggregates side by side and understand which route gives them a stronger application.</p>
            <p>Also calculate your <a href="/mdcat-calculator">PMDC MDCAT Aggregate</a> to compare both systems, or check your <a href="/fsc-grade-converter">FSc Percentage</a> to understand your pre-medical marks.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
