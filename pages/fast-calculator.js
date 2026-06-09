import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const FAST_CAMPUSES = [
  { campus: 'FAST Islamabad', programs: 'CS, SE, EE, Civil, Business', lastMerit: '82.50%' },
  { campus: 'FAST Lahore', programs: 'CS, SE, EE, Civil, Business', lastMerit: '81.80%' },
  { campus: 'FAST Karachi', programs: 'CS, SE, EE, Civil, Financial Engg', lastMerit: '80.90%' },
  { campus: 'FAST Peshawar', programs: 'CS, SE, EE, Civil', lastMerit: '78.40%' },
  { campus: 'FAST Faisalabad', programs: 'CS, SE, Electrical', lastMerit: '77.60%' },
  { campus: 'FAST Chiniot-Faisalabad', programs: 'CS, SE', lastMerit: '76.20%' },
]

const FAST_PROGRAMS = [
  { program: 'Computer Science (CS)', demand: 'Very High', color: '#DC2626', tip: 'Most competitive program. Islamabad and Lahore campuses close first. Target 81%+ aggregate.' },
  { program: 'Software Engineering (SE)', demand: 'Very High', color: '#DC2626', tip: 'Almost as competitive as CS. Requires similar aggregate. Strong industry placement.' },
  { program: 'Electrical Engineering (EE)', demand: 'High', color: '#D97706', tip: 'Second tier in terms of merit. Good career prospects in telecoms and power sector.' },
  { program: 'Civil Engineering', demand: 'Medium', color: '#059669', tip: 'Lower demand than CS/EE. Good for students with slightly lower aggregates.' },
  { program: 'Business Administration', demand: 'Medium', color: '#059669', tip: 'Different admission criteria at some campuses. Check FAST website for BBA requirements.' },
  { program: 'Financial Engineering', demand: 'Low', color: '#2563EB', tip: 'Only at Karachi campus. Unique program combining finance and engineering. Less competition.' },
]

const NUET_FACTS = [
  { fact: 'NU Entry Test (NUET)', detail: 'FAST conducts its own entry test called NUET. It tests Mathematics, English, and IQ/Analytical skills.' },
  { fact: 'SAT accepted as alternative', detail: 'A strong SAT score (1100+) can be used instead of NUET for admission at most FAST campuses.' },
  { fact: 'Multiple test dates', detail: 'NUET is offered multiple times per year. Students can appear more than once and use their best score.' },
  { fact: 'Online NUET available', detail: 'FAST now offers online NUET registration and results. Check nu.edu.pk for current test schedule.' },
]

export default function FASTCalculator() {
  const [matricObtained, setMatricObtained] = useState('')
  const [matricTotal, setMatricTotal] = useState('')
  const [fscObtained, setFscObtained] = useState('')
  const [fscTotal, setFscTotal] = useState('')
  const [nuetScore, setNuetScore] = useState('')
  const [nuetTotal, setNuetTotal] = useState('100')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    setResult(null)

    const mObt = parseFloat(matricObtained)
    const mTot = parseFloat(matricTotal)
    const fObt = parseFloat(fscObtained)
    const fTot = parseFloat(fscTotal)
    const nuet = parseFloat(nuetScore)
    const nuetTot = parseFloat(nuetTotal)

    if ([mObt, mTot, fObt, fTot, nuet, nuetTot].some(isNaN) ||
      [matricObtained, matricTotal, fscObtained, fscTotal, nuetScore].some(v => v === '')) {
      setError('Please fill in all fields.'); return
    }
    if (mObt < 0 || fObt < 0 || nuet < 0) { setError('Marks cannot be negative.'); return }
    if (mObt > mTot) { setError('Matric obtained marks cannot exceed total marks.'); return }
    if (fObt > fTot) { setError('FSc obtained marks cannot exceed total marks.'); return }
    if (nuet > nuetTot) { setError('NUET score cannot exceed total NUET marks.'); return }
    if (mTot <= 0 || fTot <= 0 || nuetTot <= 0) { setError('Total marks must be greater than zero.'); return }

    const matricPct = (mObt / mTot) * 100
    const fscPct = (fObt / fTot) * 100
    const nuetPct = (nuet / nuetTot) * 100

    // FAST Formula: Matric 10% + FSc 40% + NUET 50%
    const aggregate = (matricPct * 0.10) + (fscPct * 0.40) + (nuetPct * 0.50)

    let chances, chancesColor, chancesEmoji
    if (aggregate >= 82) {
      chances = 'Excellent — CS and SE at FAST Islamabad or Lahore within strong reach'
      chancesColor = '#059669'; chancesEmoji = '🏆'
    } else if (aggregate >= 79) {
      chances = 'Very Good — Strong candidate for CS and SE at most FAST campuses'
      chancesColor = '#059669'; chancesEmoji = '✅'
    } else if (aggregate >= 76) {
      chances = 'Good — CS/SE at regional campuses accessible. EE at main campuses possible'
      chancesColor = '#D97706'; chancesEmoji = '📈'
    } else if (aggregate >= 72) {
      chances = 'Moderate — Civil or EE at Peshawar or Faisalabad campus likely'
      chancesColor = '#D97706'; chancesEmoji = '⚠️'
    } else {
      chances = 'Below typical FAST threshold — Improve NUET score or consider other universities'
      chancesColor = '#DC2626'; chancesEmoji = '🚨'
    }

    setResult({
      aggregate: aggregate.toFixed(4),
      aggregateDisplay: aggregate.toFixed(2),
      matricPct: matricPct.toFixed(2),
      fscPct: fscPct.toFixed(2),
      nuetPct: nuetPct.toFixed(2),
      matricContrib: (matricPct * 0.10).toFixed(4),
      fscContrib: (fscPct * 0.40).toFixed(4),
      nuetContrib: (nuetPct * 0.50).toFixed(4),
      chances, chancesColor, chancesEmoji,
    })
  }

  const reset = () => {
    setMatricObtained(''); setMatricTotal(''); setFscObtained('')
    setFscTotal(''); setNuetScore(''); setNuetTotal('100')
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>FAST University Aggregate Calculator 2025 — NUET Merit | ScholarTools</title>
        <meta name="description" content="Calculate your FAST University aggregate for CS, SE and engineering admissions. Official formula: Matric 10% + FSc 40% + NUET 50%. Free FAST merit calculator." />
        <link rel="canonical" href="https://scholartools.co/fast-calculator" />
        <meta property="og:title" content="FAST University Aggregate Calculator Pakistan | ScholarTools" />
        <meta property="og:description" content="Free FAST University aggregate calculator. Calculate your NUET-based merit for CS, Software Engineering and all FAST campuses instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / FAST University Aggregate Calculator</div>
            <h1>💻 FAST University Aggregate Calculator 2025</h1>
            <p>Calculate your FAST-NU admission aggregate for Computer Science, Software Engineering, and all other programs using the official NUET formula.</p>
          </div>

          {/* Formula Banner */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', marginBottom: 6 }}>Official FAST-NU Aggregate Formula</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Matric 10%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>FSc 40%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>+</span>
              <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>NUET 50%</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>=</span>
              <span style={{ background: '#1D4ED8', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Your Aggregate</span>
            </div>
            <div style={{ fontSize: 12, color: '#1E40AF', marginTop: 8 }}>
              💡 SAT score (1100+) can be used as an alternative to NUET at most FAST campuses.
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
                📗 FSc Marks <span style={{ color: '#2563EB', fontWeight: 400 }}>(contributes 40%)</span>
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

            {/* NUET */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                💻 NUET Score <span style={{ color: '#2563EB', fontWeight: 400 }}>(contributes 50%)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Your NUET Score</label>
                  <input className="input" type="number" placeholder="e.g. 82"
                    value={nuetScore} onChange={e => { setNuetScore(e.target.value); setResult(null) }} />
                </div>
                <div className="field">
                  <label className="label">Total NUET Marks</label>
                  <input className="input" type="number" placeholder="100"
                    value={nuetTotal} onChange={e => { setNuetTotal(e.target.value); setResult(null) }} />
                  <div className="text-muted" style={{ marginTop: 4 }}>Default 100 — adjust if different</div>
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your FAST Aggregate</div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{result.aggregateDisplay}%</div>
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
                      { label: 'FSc', pct: result.fscPct, contrib: result.fscContrib, weight: '40%', color: '#059669' },
                      { label: 'NUET Score', pct: result.nuetPct, contrib: result.nuetContrib, weight: '50%', color: '#2563EB' },
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
                    <div className="stat-val" style={{ color: '#2563EB', fontSize: 20 }}>{result.nuetPct}%</div>
                    <div className="stat-lbl">NUET Percentage</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Campus Merit Table */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>FAST Campus Closing Merit Reference</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>Approximate closing aggregates from recent admissions. Verify with official FAST merit lists at nu.edu.pk.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Campus</th>
                    <th>Programs Offered</th>
                    <th>Last Closing Merit</th>
                  </tr>
                </thead>
                <tbody>
                  {FAST_CAMPUSES.map(row => (
                    <tr key={row.campus}>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{row.campus}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.programs}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>{row.lastMerit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Programs */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 12 }}>Programs at FAST — Demand and Merit Guide</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {FAST_PROGRAMS.map(p => (
                <div key={p.program} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.program}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: p.color + '15', color: p.color }}>{p.demand}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{p.tip}</div>
                </div>
              ))}
            </div>
          </div>

          {/* NUET Facts */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 12 }}>NUET — Key Facts Every Applicant Should Know</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {NUET_FACTS.map(f => (
                <div key={f.fact} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#2563EB', marginBottom: 5 }}>💡 {f.fact}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{f.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>FAST University Aggregate Calculator — NUET Merit for CS and Engineering</h2>
            <p>This FAST University aggregate calculator uses the official FAST-NU formula to calculate your admission merit for Computer Science, Software Engineering, Electrical Engineering, and other programs across all six FAST campuses. The formula assigns 10% weight to Matric marks, 40% to FSc marks, and 50% to your NUET score — making the NUET the single most impactful component of your aggregate.</p>
            <p>FAST-NU is Pakistan's top computer science university and consistently produces the most hireable software engineers in the country. The Islamabad and Lahore campuses are the most competitive, with CS closing merits typically above 81%. Students can improve their aggregate by appearing in multiple NUET sittings since FAST uses the best score.</p>
            <p>Also calculate your <a href="/nust-calculator">NUST Aggregate</a> to compare your chances at both top engineering universities, or check your <a href="/ecat-calculator">ECAT Aggregate</a> for UET admissions.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
