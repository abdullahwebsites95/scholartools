import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const formulas = [
  { id: 'standard', label: 'Standard (×10)', desc: 'Used by most Pakistani & Indian universities', fn: g => g * 10 },
  { id: 'vtu', label: 'VTU Formula', desc: 'VTU, India: (CGPA − 0.75) × 10', fn: g => (g - 0.75) * 10 },
  { id: 'mumbai', label: 'Mumbai University', desc: '(CGPA − 0.5) × 10', fn: g => (g - 0.5) * 10 },
  { id: 'anna', label: 'Anna University', desc: 'CGPA × 9.5', fn: g => g * 9.5 },
  { id: 'custom', label: 'Custom Multiplier', desc: 'Enter your own multiplier', fn: null },
]

export default function CGPAConverter() {
  const [cgpa, setCgpa] = useState('')
  const [formula, setFormula] = useState('standard')
  const [multiplier, setMultiplier] = useState('10')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const g = parseFloat(cgpa)
    if (!g || isNaN(g) || g < 0 || g > 10) return
    const sel = formulas.find(f => f.id === formula)
    let pct
    if (formula === 'custom') {
      const m = parseFloat(multiplier)
      if (!m || isNaN(m)) return
      pct = g * m
    } else {
      pct = sel.fn(g)
    }
    pct = Math.min(100, Math.max(0, pct))
    let grade, color
    if (pct >= 90) { grade = 'Outstanding / A+'; color = '#059669' }
    else if (pct >= 80) { grade = 'Excellent / A'; color = '#059669' }
    else if (pct >= 70) { grade = 'Very Good / B'; color = '#2563EB' }
    else if (pct >= 60) { grade = 'Good / C'; color = '#D97706' }
    else if (pct >= 50) { grade = 'Average / D'; color = '#D97706' }
    else { grade = 'Below Average / F'; color = '#DC2626' }
    setResult({ pct: pct.toFixed(2), grade, color })
  }

  return (
    <Layout>
      <Head>
        <title>CGPA to Percentage Calculator — Free Converter | ScholarTools</title>
        <meta name="description" content="Free CGPA to percentage converter. Supports Pakistani, Indian and international university formulas. Instant results, no signup needed." />
        <link rel="canonical" href="https://scholartools.co/cgpa-to-percentage" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / CGPA to Percentage</div>
            <h1>🎓 CGPA to Percentage Converter</h1>
            <p>Convert your CGPA to percentage using your university formula. Supports Pakistani, Indian and international universities.</p>
          </div>

          <div className="card">
            <div className="field">
              <label className="label">Your CGPA (out of 10 or 4)</label>
              <input className="input" type="number" step="0.01" min="0" max="10"
                placeholder="e.g. 3.75" value={cgpa} onChange={e => setCgpa(e.target.value)} />
            </div>

            <div className="field">
              <label className="label">Select University Formula</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {formulas.map(f => (
                  <button key={f.id}
                    className={`btn btn-sm ${formula === f.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: '10px 14px', gap: 2 }}
                    onClick={() => setFormula(f.id)}>
                    <span style={{ fontWeight: 600 }}>{f.label}</span>
                    <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {formula === 'custom' && (
              <div className="field">
                <label className="label">Custom Multiplier</label>
                <input className="input" type="number" placeholder="e.g. 9.5"
                  value={multiplier} onChange={e => setMultiplier(e.target.value)} />
              </div>
            )}

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }} onClick={calculate}>
              Convert to Percentage →
            </button>

            {result && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <div style={{ background: result.color + '15', border: `2px solid ${result.color}`, borderRadius: 'var(--radius-sm)', padding: 28 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: result.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Your Percentage</div>
                  <div style={{ fontSize: 60, fontWeight: 800, color: result.color, lineHeight: 1 }}>{result.pct}%</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: result.color, marginTop: 8 }}>{result.grade}</div>
                </div>

                <div className="stat-grid" style={{ marginTop: 14 }}>
                  <div className="stat-box">
                    <div className="stat-val">{cgpa}</div>
                    <div className="stat-lbl">Your CGPA</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{result.pct}%</div>
                    <div className="stat-lbl">Equivalent Percentage</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{formulas.find(f => f.id === formula)?.label}</div>
                    <div className="stat-lbl">Formula Used</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>How to Convert CGPA to Percentage</h2>
            <p>Different universities use different formulas to convert CGPA to percentage. The most common formula used by Pakistani and Indian universities is simply multiplying CGPA by 10. So a CGPA of 3.5 out of 4.0 would be 35% — but this is only if your CGPA is out of 4.</p>
            <p>If your CGPA is out of 10 (common in Pakistan and India), most universities use CGPA × 10. So 7.5 CGPA = 75%. Always check your university's official conversion policy before using this for job applications or further admissions.</p>
            <p>This conversion is commonly needed for job applications, further university admissions, government forms, and scholarship applications that require percentage instead of CGPA.</p>
            <p>Calculate your full semester GPA using our <a href="/gpa-calculator">GPA Calculator</a>, or use our <a href="/percentage-calculator">Percentage Calculator</a> to work out your exam scores and grade averages.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
