import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const UET_CAMPUSES = [
  { campus: 'UET Lahore (Main Campus)', programs: 'All Engineering disciplines', lastMerit: '83.20%' },
  { campus: 'UET Taxila', programs: 'Civil, Electrical, Mechanical, CS', lastMerit: '79.40%' },
  { campus: 'UET Peshawar', programs: 'Engineering & Technology', lastMerit: '78.80%' },
  { campus: 'UET Mardan', programs: 'Civil, Electrical, Mechanical', lastMerit: '76.50%' },
  { campus: 'UET Gujranwala Campus', programs: 'Electrical, Mechanical, Industrial', lastMerit: '78.10%' },
  { campus: 'UET Rachna College (Lahore)', programs: 'Industrial & Manufacturing', lastMerit: '77.30%' },
]

const TOP_PROGRAMS = [
  { program: 'Computer Science (CS)', demand: 'Very High', tipColor: '#DC2626', tip: 'Most competitive. Typically requires 82%+ aggregate.' },
  { program: 'Electrical Engineering', demand: 'High', tipColor: '#D97706', tip: 'Second most competitive. Strong demand from industry.' },
  { program: 'Mechanical Engineering', demand: 'High', tipColor: '#D97706', tip: 'Classic engineering choice. Consistent merit around 79–81%.' },
  { program: 'Civil Engineering', demand: 'Medium', tipColor: '#059669', tip: 'Good scope. Merit slightly lower than CS and Electrical.' },
  { program: 'Chemical Engineering', demand: 'Medium', tipColor: '#059669', tip: 'Less competitive. Good career prospects in Pakistan.' },
  { program: 'Software Engineering', demand: 'Very High', tipColor: '#DC2626', tip: 'Same demand as CS. Merit very close to Computer Science.' },
]

export default function ECATCalculator() {
  const [matricObtained, setMatricObtained] = useState('')
  const [matricTotal, setMatricTotal] = useState('')
  const [fscObtained, setFscObtained] = useState('')
  const [fscTotal, setFscTotal] = useState('')
  const [ecatScore, setEcatScore] = useState('')
  const [ecatTotal, setEcatTotal] = useState('400')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    setResult(null)

    const mObt = parseFloat(matricObtained)
    const mTot = parseFloat(matricTotal)
    const fObt = parseFloat(fscObtained)
    const fTot = parseFloat(fscTotal)
    const ecat = parseFloat(ecatScore)
    const ecatTot = parseFloat(ecatTotal)

    if ([mObt, mTot, fObt, fTot, ecat, ecatTot].some(isNaN) ||
        [matricObtained, matricTotal, fscObtained, fscTotal, ecatScore].some(v => v === '')) {
      setError('Please fill in all fields.'); return
    }
    if (mObt < 0 || fObt < 0 || ecat < 0) { setError('Marks cannot be negative.'); return }
    if (mObt > mTot) { setError('Matric obtained marks cannot exceed total marks.'); return }
    if (fObt > fTot) { setError('FSc obtained marks cannot exceed total marks.'); return }
    if (ecat > ecatTot) { setError('ECAT score cannot exceed total ECAT marks.'); return }
    if (mTot <= 0 || fTot <= 0 || ecatTot <= 0) { setError('Total marks must be greater than zero.'); return }

    const matricPct = (mObt / mTot) * 100
    const fscPct = (fObt / fTot) * 100
    const ecatPct = (ecat / ecatTot) * 100

    // UET Formula: Matric 25% + FSc 45% + ECAT 30%
    const aggregate = (matricPct * 0.25) + (fscPct * 0.45) + (ecatPct * 0.30)

    let chances, chancesColor, chancesEmoji
    if (aggregate >= 83) {
      chances = 'Excellent — UET Lahore main campus top programs within reach'
      chancesColor = '#059669'; chancesEmoji = '🏆'
    } else if (aggregate >= 80) {
      chances = 'Very Good — Strong chance at UET Lahore and all sub-campuses'
      chancesColor = '#059669'; chancesEmoji = '✅'
    } else if (aggregate >= 76) {
      chances = 'Good — UET sub-campuses and most engineering programs accessible'
      chancesColor = '#D97706'; chancesEmoji = '📈'
    } else if (aggregate >= 70) {
      chances = 'Moderate — Some UET campuses possible, consider private engineering universities'
      chancesColor = '#D97706'; chancesEmoji = '⚠️'
    } else {
      chances = 'Below typical UET threshold — Private engineering universities recommended'
      chancesColor = '#DC2626'; chancesEmoji = '🚨'
    }

    setResult({
      aggregate: aggregate.toFixed(4),
      aggregateDisplay: aggregate.toFixed(2),
      matricPct: matricPct.toFixed(2),
      fscPct: fscPct.toFixed(2),
      ecatPct: ecatPct.toFixed(2),
      matricContrib: (matricPct * 0.25).toFixed(4),
      fscContrib: (fscPct * 0.45).toFixed(4),
      ecatContrib: (ecatPct * 0.30).toFixed(4),
      chances, chancesColor, chancesEmoji,
    })
  }

  const reset = () => {
    setMatricObtained(''); setMatricTotal(''); setFscObtained('')
    setFscTotal(''); setEcatScore(''); setEcatTotal('400')
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>ECAT Aggregate Calculator 2025 — UET Merit Calculator Pakistan | ScholarTools</title>
        <meta name="description" content="Calculate your ECAT aggregate for UET engineering admissions. Official formula: Matric 25% + FSc 45% + ECAT 30%. Free UET merit calculator for all campuses." />
        <link rel="canonical" href="https://scholartools.co/ecat-calculator" />
        <meta property="og:title" content="ECAT Aggregate Calculator Pakistan | ScholarTools" />
        <meta property="og:description" content="Free ECAT aggregate calculator using official UET formula. Calculate your engineering admission aggregate for all UET campuses instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / ECAT Aggregate Calculator</div>
            <h1>⚙️ ECAT Aggregate Calculator 2025</h1>
            <p>Calculate your UET engineering admission aggregate using the official formula. Enter your Matric, FSc, and ECAT marks to see your aggregate and admission chances.</p>
          </div>

          {/* Formula Banner */}
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#C2410C', marginBottom: 6 }}>Official UET Aggregate Formula</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: '#FED7AA', color: '#9A3412', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Matric 25%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#FED7AA', color: '#9A3412', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>FSc 45%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#FED7AA', color: '#9A3412', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>ECAT 30%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>=</span>
              <span style={{ background: '#C2410C', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Your Aggregate</span>
            </div>
          </div>

          <div className="card">
            {/* Matric */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                📘 Matric Marks <span style={{ color: '#D97706', fontWeight: 400 }}>(contributes 25%)</span>
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
                📗 FSc Pre-Engineering Marks <span style={{ color: '#D97706', fontWeight: 400 }}>(contributes 45%)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Obtained Marks</label>
                  <input className="input" type="number" placeholder="e.g. 970"
                    value={fscObtained} onChange={e => { setFscObtained(e.target.value); setResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total Marks</label>
                  <input className="input" type="number" placeholder="e.g. 1100"
                    value={fscTotal} onChange={e => { setFscTotal(e.target.value); setResult(null) }} />
                </div>
              </div>
            </div>

            {/* ECAT */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                ⚙️ ECAT Score <span style={{ color: '#D97706', fontWeight: 400 }}>(contributes 30%)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Your ECAT Score</label>
                  <input className="input" type="number" placeholder="e.g. 320"
                    value={ecatScore} onChange={e => { setEcatScore(e.target.value); setResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total ECAT Marks</label>
                  <input className="input" type="number" placeholder="400"
                    value={ecatTotal} onChange={e => { setEcatTotal(e.target.value); setResult(null) }} />
                  <div className="text-muted" style={{ marginTop: 4 }}>Default 400 — change if different year</div>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group">
              <button className="btn btn-primary btn-lg" style={{ flex: 1, background: '#D97706', borderColor: '#D97706' }} onClick={calculate}>
                Calculate My Aggregate →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Main result */}
                <div style={{ background: '#FFF7ED', border: '2px solid #D97706', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your ECAT Aggregate</div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#C2410C', lineHeight: 1 }}>{result.aggregateDisplay}%</div>
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
                      { label: 'Matric', pct: result.matricPct, contrib: result.matricContrib, weight: '25%', color: '#7C3AED' },
                      { label: 'FSc Pre-Engineering', pct: result.fscPct, contrib: result.fscContrib, weight: '45%', color: '#059669' },
                      { label: 'ECAT', pct: result.ecatPct, contrib: result.ecatContrib, weight: '30%', color: '#D97706' },
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
                    <div className="stat-val" style={{ color: '#059669', fontSize: 20 }}>{result.fscPct}%</div>
                    <div className="stat-lbl">FSc Percentage</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#D97706', fontSize: 20 }}>{result.ecatPct}%</div>
                    <div className="stat-lbl">ECAT Percentage</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* UET Campus Merit Table */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>UET Campus Closing Merit Reference</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>Approximate closing aggregates from recent admissions. Actual merit varies each year. Always verify with official UET merit lists.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Campus</th>
                    <th>Programs</th>
                    <th>Last Closing Merit</th>
                  </tr>
                </thead>
                <tbody>
                  {UET_CAMPUSES.map(row => (
                    <tr key={row.campus}>
                      <td style={{ fontSize: 13 }}>{row.campus}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.programs}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: '#D97706' }}>{row.lastMerit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Programs */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 12 }}>Top Engineering Programs at UET</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {TOP_PROGRAMS.map(p => (
                <div key={p.program} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{p.program}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: p.tipColor + '15', color: p.tipColor }}>{p.demand}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{p.tip}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>ECAT Aggregate Calculator — UET Engineering Admissions Pakistan</h2>
            <p>This ECAT aggregate calculator uses the official University of Engineering and Technology (UET) formula to calculate your engineering admission merit. The UET formula gives 25% weight to Matric marks, 45% to FSc Pre-Engineering marks, and 30% to your ECAT score — making FSc performance the single most important factor in your aggregate.</p>
            <p>UET is Pakistan's most prestigious public engineering university with campuses in Lahore, Taxila, Peshawar, Mardan, and Gujranwala. Computer Science and Electrical Engineering consistently have the highest closing merits, typically requiring 80% or above to secure a seat at the Lahore main campus.</p>
            <p>Also calculate your <a href="/mdcat-calculator">MDCAT Aggregate</a> if you are applying to medical colleges, or use our <a href="/cgpa-to-percentage">CGPA to Percentage Converter</a> for other applications.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
