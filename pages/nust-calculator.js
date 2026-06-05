import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const NUST_SCHOOLS = [
  { school: 'School of Electrical Engineering & CS (SEECS)', programs: 'CS, EE, AI, Data Science', lastMerit: '87.50%' },
  { school: 'School of Mechanical & Manufacturing Engg (SMME)', programs: 'Mechanical, Manufacturing', lastMerit: '84.20%' },
  { school: 'School of Civil & Environmental Engg (SCEE)', programs: 'Civil, Environmental', lastMerit: '82.80%' },
  { school: 'School of Chemical & Materials Engg (SCME)', programs: 'Chemical, Materials', lastMerit: '81.40%' },
  { school: 'College of Electrical & Mechanical Engg (CEME)', programs: 'Electrical, Mechanical', lastMerit: '83.60%' },
  { school: 'School of Natural Sciences (SNS)', programs: 'Physics, Maths, Chemistry', lastMerit: '79.20%' },
  { school: 'NUST Business School (NBS)', programs: 'BBA, MBA', lastMerit: '78.50%' },
  { school: 'School of Art, Design & Architecture (SADA)', programs: 'Architecture, Design', lastMerit: '76.80%' },
]

const NET_TIPS = [
  { tip: 'NET-1 is held in February', detail: 'Earliest sitting. Best for students who want maximum preparation time after FSc exams.' },
  { tip: 'NET-2 is held in June', detail: 'Most popular sitting. Held right after FSc results. Largest number of applicants.' },
  { tip: 'NET-3 is held in August', detail: 'Last chance sitting. Good for students who want to improve their NET score.' },
  { tip: 'Best of all sittings counts', detail: 'NUST uses your highest NET score across all sittings. You can appear multiple times.' },
]

export default function NUSTCalculator() {
  const [matricObtained, setMatricObtained] = useState('')
  const [matricTotal, setMatricTotal] = useState('')
  const [fscObtained, setFscObtained] = useState('')
  const [fscTotal, setFscTotal] = useState('')
  const [netScore, setNetScore] = useState('')
  const [netTotal, setNetTotal] = useState('200')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    setResult(null)

    const mObt = parseFloat(matricObtained)
    const mTot = parseFloat(matricTotal)
    const fObt = parseFloat(fscObtained)
    const fTot = parseFloat(fscTotal)
    const net = parseFloat(netScore)
    const netTot = parseFloat(netTotal)

    if ([mObt, mTot, fObt, fTot, net, netTot].some(isNaN) ||
      [matricObtained, matricTotal, fscObtained, fscTotal, netScore].some(v => v === '')) {
      setError('Please fill in all fields.'); return
    }
    if (mObt < 0 || fObt < 0 || net < 0) { setError('Marks cannot be negative.'); return }
    if (mObt > mTot) { setError('Matric obtained marks cannot exceed total marks.'); return }
    if (fObt > fTot) { setError('FSc obtained marks cannot exceed total marks.'); return }
    if (net > netTot) { setError('NET score cannot exceed total NET marks.'); return }
    if (mTot <= 0 || fTot <= 0 || netTot <= 0) { setError('Total marks must be greater than zero.'); return }

    const matricPct = (mObt / mTot) * 100
    const fscPct = (fObt / fTot) * 100
    const netPct = (net / netTot) * 100

    // NUST Formula: Matric 10% + FSc 40% + NET 50%
    const aggregate = (matricPct * 0.10) + (fscPct * 0.40) + (netPct * 0.50)

    let chances, chancesColor, chancesEmoji
    if (aggregate >= 87) {
      chances = 'Excellent — SEECS (CS/EE/AI) at NUST Islamabad within reach'
      chancesColor = '#059669'; chancesEmoji = '🏆'
    } else if (aggregate >= 84) {
      chances = 'Very Good — Strong chance at most NUST schools including SMME and CEME'
      chancesColor = '#059669'; chancesEmoji = '✅'
    } else if (aggregate >= 80) {
      chances = 'Good — NUST sub-schools accessible. Strong candidate for SCEE and SCME'
      chancesColor = '#D97706'; chancesEmoji = '📈'
    } else if (aggregate >= 76) {
      chances = 'Moderate — Some NUST schools possible. Consider improving NET score'
      chancesColor = '#D97706'; chancesEmoji = '⚠️'
    } else {
      chances = 'Below typical NUST threshold — Focus on improving NET score in next sitting'
      chancesColor = '#DC2626'; chancesEmoji = '🚨'
    }

    setResult({
      aggregate: aggregate.toFixed(4),
      aggregateDisplay: aggregate.toFixed(2),
      matricPct: matricPct.toFixed(2),
      fscPct: fscPct.toFixed(2),
      netPct: netPct.toFixed(2),
      matricContrib: (matricPct * 0.10).toFixed(4),
      fscContrib: (fscPct * 0.40).toFixed(4),
      netContrib: (netPct * 0.50).toFixed(4),
      chances, chancesColor, chancesEmoji,
    })
  }

  const reset = () => {
    setMatricObtained(''); setMatricTotal(''); setFscObtained('')
    setFscTotal(''); setNetScore(''); setNetTotal('200')
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>NUST Aggregate Calculator 2025 — NET Merit Calculator Pakistan | ScholarTools</title>
        <meta name="description" content="Calculate your NUST aggregate for engineering and CS admissions. Official formula: Matric 10% + FSc 40% + NET 50%. Free NUST merit calculator for all schools." />
        <link rel="canonical" href="https://scholartools.co/nust-calculator" />
        <meta property="og:title" content="NUST NET Aggregate Calculator Pakistan | ScholarTools" />
        <meta property="og:description" content="Free NUST aggregate calculator using official NET formula. Calculate your merit for SEECS, SMME, SCEE and all NUST schools instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / NUST Aggregate Calculator</div>
            <h1>🎓 NUST Aggregate Calculator 2025</h1>
            <p>Calculate your admission aggregate for NUST — Pakistan's most prestigious university. Uses the official NET formula for all NUST schools and programs.</p>
          </div>

          {/* Formula Banner */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803D', marginBottom: 6 }}>Official NUST Aggregate Formula</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: '#BBF7D0', color: '#14532D', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Matric 10%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#BBF7D0', color: '#14532D', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>FSc 40%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#BBF7D0', color: '#14532D', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>NET Score 50%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>=</span>
              <span style={{ background: '#15803D', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Your Aggregate</span>
            </div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 8 }}>
              💡 NUST uses your <strong>best NET score</strong> across all sittings (NET-1, NET-2, NET-3). You can appear multiple times.
            </div>
          </div>

          <div className="card">
            {/* Matric */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                📘 Matric Marks <span style={{ color: '#16A34A', fontWeight: 400 }}>(contributes 10%)</span>
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
                📗 FSc Pre-Engineering Marks <span style={{ color: '#16A34A', fontWeight: 400 }}>(contributes 40%)</span>
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

            {/* NET */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                🎯 NET Score <span style={{ color: '#16A34A', fontWeight: 400 }}>(contributes 50%)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Your NET Score</label>
                  <input className="input" type="number" placeholder="e.g. 168"
                    value={netScore} onChange={e => { setNetScore(e.target.value); setResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total NET Marks</label>
                  <input className="input" type="number" placeholder="200"
                    value={netTotal} onChange={e => { setNetTotal(e.target.value); setResult(null) }} />
                  <div className="text-muted" style={{ marginTop: 4 }}>Default 200 — change if different year</div>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group">
              <button className="btn btn-primary btn-lg"
                style={{ flex: 1, background: '#15803D', borderColor: '#15803D' }}
                onClick={calculate}>
                Calculate My Aggregate →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Main result */}
                <div style={{ background: '#F0FDF4', border: '2px solid #16A34A', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your NUST Aggregate</div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#15803D', lineHeight: 1 }}>{result.aggregateDisplay}%</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>({result.aggregate}% exact)</div>
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
                      { label: 'FSc Pre-Engineering', pct: result.fscPct, contrib: result.fscContrib, weight: '40%', color: '#2563EB' },
                      { label: 'NET Score', pct: result.netPct, contrib: result.netContrib, weight: '50%', color: '#15803D' },
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
                    <div className="stat-val" style={{ color: '#7C3AED', fontSize: 20 }}>{result.matricPct}%</div>
                    <div className="stat-lbl">Matric Percentage</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#2563EB', fontSize: 20 }}>{result.fscPct}%</div>
                    <div className="stat-lbl">FSc Percentage</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#15803D', fontSize: 20 }}>{result.netPct}%</div>
                    <div className="stat-lbl">NET Percentage</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NUST Schools Merit Table */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>NUST Schools — Last Closing Merit Reference</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>Approximate closing aggregates from recent admissions. Verify with official NUST merit lists before applying.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Programs</th>
                    <th>Last Closing Merit</th>
                  </tr>
                </thead>
                <tbody>
                  {NUST_SCHOOLS.map(row => (
                    <tr key={row.school}>
                      <td style={{ fontSize: 13 }}>{row.school}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.programs}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: '#15803D' }}>{row.lastMerit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NET Tips */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 12 }}>NUST Entry Test (NET) — Key Facts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {NET_TIPS.map(t => (
                <div key={t.tip} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#15803D', marginBottom: 5 }}>📅 {t.tip}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{t.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>NUST Aggregate Calculator — How It Works</h2>
            <p>This NUST aggregate calculator uses the official National University of Sciences and Technology formula to calculate your admission merit for engineering, computer science, and other programs. The NUST NET formula assigns 10% weight to Matric marks, 40% to FSc Pre-Engineering marks, and 50% to your NUST Entry Test (NET) score — identical to the MDCAT structure but with the NET replacing the medical entrance test.</p>
            <p>NUST is consistently ranked as Pakistan's top university and among the best in Asia. The SEECS school for Computer Science and Electrical Engineering is the most competitive, typically requiring an aggregate above 87% for a guaranteed seat. Students can appear in NET-1, NET-2, and NET-3 and NUST uses the best score across all sittings.</p>
            <p>Also calculate your <a href="/mdcat-calculator">MDCAT Aggregate</a> for medical admissions or your <a href="/ecat-calculator">ECAT Aggregate</a> for UET engineering programs.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
