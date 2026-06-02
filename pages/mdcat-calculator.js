import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const MBBS_MERIT = [
  { uni: 'King Edward Medical University (KEMU)', city: 'Lahore', lastMerit: '88.50%' },
  { uni: 'Allama Iqbal Medical College (AIMC)', city: 'Lahore', lastMerit: '87.20%' },
  { uni: 'Rawalpindi Medical University (RMU)', city: 'Rawalpindi', lastMerit: '86.80%' },
  { uni: 'Nishtar Medical University', city: 'Multan', lastMerit: '85.90%' },
  { uni: 'Khyber Medical College (KMC)', city: 'Peshawar', lastMerit: '85.40%' },
  { uni: 'Dow Medical College (DMC)', city: 'Karachi', lastMerit: '86.10%' },
  { uni: 'Liaquat University of Medical & Health Sciences', city: 'Jamshoro', lastMerit: '83.20%' },
  { uni: 'Services Institute of Medical Sciences (SIMS)', city: 'Lahore', lastMerit: '86.30%' },
]

export default function MDCATCalculator() {
  const [matricTotal, setMatricTotal] = useState('')
  const [matricObtained, setMatricObtained] = useState('')
  const [fscTotal, setFscTotal] = useState('')
  const [fscObtained, setFscObtained] = useState('')
  const [mdcatScore, setMdcatScore] = useState('')
  const [mdcatTotal, setMdcatTotal] = useState('210')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    setResult(null)

    const mObt = parseFloat(matricObtained)
    const mTot = parseFloat(matricTotal)
    const fObt = parseFloat(fscObtained)
    const fTot = parseFloat(fscTotal)
    const mdcat = parseFloat(mdcatScore)
    const mdcatTot = parseFloat(mdcatTotal)

    // Validation
    if ([mObt, mTot, fObt, fTot, mdcat, mdcatTot].some(isNaN) ||
        [matricObtained, matricTotal, fscObtained, fscTotal, mdcatScore].some(v => v === '')) {
      setError('Please fill in all fields.')
      return
    }
    if (mObt < 0 || fObt < 0 || mdcat < 0) { setError('Marks cannot be negative.'); return }
    if (mObt > mTot) { setError('Matric obtained marks cannot exceed total marks.'); return }
    if (fObt > fTot) { setError('FSc obtained marks cannot exceed total marks.'); return }
    if (mdcat > mdcatTot) { setError('MDCAT score cannot exceed total MDCAT marks.'); return }
    if (mTot <= 0 || fTot <= 0 || mdcatTot <= 0) { setError('Total marks must be greater than zero.'); return }

    // Calculate percentages
    const matricPct = (mObt / mTot) * 100
    const fscPct = (fObt / fTot) * 100
    const mdcatPct = (mdcat / mdcatTot) * 100

    // PMDC Formula: Matric 10% + FSc 40% + MDCAT 50%
    const aggregate = (matricPct * 0.10) + (fscPct * 0.40) + (mdcatPct * 0.50)

    // Determine chances
    let chances, chancesColor, chancesEmoji
    if (aggregate >= 88) {
      chances = 'Excellent — Top government medical colleges within reach'
      chancesColor = '#059669'
      chancesEmoji = '🏆'
    } else if (aggregate >= 85) {
      chances = 'Very Good — Strong chance at most government medical colleges'
      chancesColor = '#059669'
      chancesEmoji = '✅'
    } else if (aggregate >= 80) {
      chances = 'Good — Eligible for many government and private medical colleges'
      chancesColor = '#D97706'
      chancesEmoji = '📈'
    } else if (aggregate >= 75) {
      chances = 'Moderate — Private medical colleges are likely, some government seats possible'
      chancesColor = '#D97706'
      chancesEmoji = '⚠️'
    } else if (aggregate >= 65) {
      chances = 'Low — Private medical colleges only. Consider retaking MDCAT.'
      chancesColor = '#DC2626'
      chancesEmoji = '📚'
    } else {
      chances = 'Below typical admission threshold — Retaking MDCAT is strongly advised'
      chancesColor = '#DC2626'
      chancesEmoji = '🚨'
    }

    setResult({
      aggregate: aggregate.toFixed(4),
      aggregateDisplay: aggregate.toFixed(2),
      matricPct: matricPct.toFixed(2),
      fscPct: fscPct.toFixed(2),
      mdcatPct: mdcatPct.toFixed(2),
      matricContrib: (matricPct * 0.10).toFixed(4),
      fscContrib: (fscPct * 0.40).toFixed(4),
      mdcatContrib: (mdcatPct * 0.50).toFixed(4),
      chances, chancesColor, chancesEmoji,
    })
  }

  const reset = () => {
    setMatricTotal(''); setMatricObtained(''); setFscTotal('')
    setFscObtained(''); setMdcatScore(''); setMdcatTotal('210')
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>MDCAT Aggregate Calculator 2025 — MBBS Admission Calculator Pakistan | ScholarTools</title>
        <meta name="description" content="Calculate your MDCAT aggregate for MBBS and BDS admissions in Pakistan. Uses official PMDC formula: Matric 10% + FSc 40% + MDCAT 50%. Free and instant." />
        <link rel="canonical" href="https://scholartools.co/mdcat-calculator" />
        <meta property="og:title" content="MDCAT Aggregate Calculator Pakistan | ScholarTools" />
        <meta property="og:description" content="Free MDCAT aggregate calculator using official PMDC formula. Calculate your MBBS and BDS admission aggregate instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / MDCAT Aggregate Calculator</div>
            <h1>🩺 MDCAT Aggregate Calculator 2025</h1>
            <p>Calculate your MBBS and BDS admission aggregate using the official PMDC formula. Enter your Matric, FSc, and MDCAT marks below.</p>
          </div>

          {/* Formula Banner */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', marginBottom: 6 }}>Official PMDC Aggregate Formula</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: '#DBEAFE', color: '#1D4ED8', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Matric 10%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#DBEAFE', color: '#1D4ED8', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>FSc 40%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#DBEAFE', color: '#1D4ED8', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>MDCAT 50%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>=</span>
              <span style={{ background: '#1D4ED8', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Your Aggregate</span>
            </div>
          </div>

          <div className="card">
            {/* Matric */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                📘 Matric Marks <span style={{ color: '#2563EB', fontWeight: 400 }}>(contributes 10%)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Obtained Marks</label>
                  <input className="input" type="number" placeholder="e.g. 1050"
                    value={matricObtained} onChange={e => { setMatricObtained(e.target.value); setResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total Marks</label>
                  <input className="input" type="number" placeholder="e.g. 1100"
                    value={matricTotal} onChange={e => { setMatricTotal(e.target.value); setResult(null) }} />
                </div>
              </div>
            </div>

            {/* FSc */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                📗 FSc Pre-Medical Marks <span style={{ color: '#2563EB', fontWeight: 400 }}>(contributes 40%)</span>
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
                🏥 MDCAT Score <span style={{ color: '#2563EB', fontWeight: 400 }}>(contributes 50%)</span>
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

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group">
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate My Aggregate →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Main result */}
                <div style={{ background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your MDCAT Aggregate</div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{result.aggregateDisplay}%</div>
                  <div style={{ fontSize: 13, color: '#374151', marginTop: 8 }}>({result.aggregate}% exact)</div>
                </div>

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
                      { label: 'Matric', pct: result.matricPct, contrib: result.matricContrib, weight: '10%', color: '#7C3AED' },
                      { label: 'FSc Pre-Medical', pct: result.fscPct, contrib: result.fscContrib, weight: '40%', color: '#059669' },
                      { label: 'MDCAT', pct: result.mdcatPct, contrib: result.mdcatContrib, weight: '50%', color: '#2563EB' },
                    ].map(row => (
                      <div key={row.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                          <span style={{ fontWeight: 500, color: 'var(--text)' }}>{row.label} <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>({row.weight} weight)</span></span>
                          <span style={{ fontWeight: 600, color: row.color }}>{row.pct}% → contributes {row.contrib}%</span>
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
                    <div className="stat-val" style={{ color: '#7C3AED', fontSize: 20 }}>{result.matricPct}%</div>
                    <div className="stat-lbl">Matric Percentage</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669', fontSize: 20 }}>{result.fscPct}%</div>
                    <div className="stat-lbl">FSc Percentage</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#2563EB', fontSize: 20 }}>{result.mdcatPct}%</div>
                    <div className="stat-lbl">MDCAT Percentage</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Last Merit Reference */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Last Year Closing Merit — Government Medical Colleges</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.5 }}>Reference closing aggregates from recent admissions cycles. Actual merit varies every year based on applicant pool. Use these as a guide only.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>University</th>
                    <th>City</th>
                    <th>Last Closing Merit</th>
                  </tr>
                </thead>
                <tbody>
                  {MBBS_MERIT.map(row => (
                    <tr key={row.uni}>
                      <td style={{ fontSize: 13 }}>{row.uni}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{row.city}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>{row.lastMerit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
              Merit figures are approximate and sourced from previous admission cycles. Always verify with official university merit lists.
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>MDCAT Aggregate Calculator — How It Works</h2>
            <p>The MDCAT aggregate calculator uses the official Pakistan Medical and Dental Council (PMDC) formula to calculate your admission aggregate for MBBS and BDS programmes across Pakistani medical colleges. The formula assigns 10% weight to your Matric marks, 40% to your FSc Pre-Medical marks, and 50% to your MDCAT score — reflecting the heavy emphasis on the entrance test.</p>
            <p>Your aggregate is calculated by converting each component to a percentage and then applying its respective weight. A higher FSc percentage and a strong MDCAT score are the two most impactful factors since they carry 90% of the total aggregate weight.</p>
            <p>Also calculate your <a href="/fsc-grade-converter">FSc Percentage</a> or check your <a href="/cgpa-to-percentage">CGPA to Percentage</a> for other university applications.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
