import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const SYSTEMS = {
  pakistan: {
    name: 'Pakistani Percentage',
    flag: '🇵🇰',
    unit: '%',
    placeholder: 'e.g. 78',
    min: 0, max: 100,
    convert: (val) => {
      const v = parseFloat(val)
      if (v >= 70) return 4.0
      if (v >= 65) return 3.7
      if (v >= 60) return 3.3
      if (v >= 55) return 3.0
      if (v >= 50) return 2.7
      if (v >= 45) return 2.3
      if (v >= 40) return 2.0
      return 0.0
    },
    scale: [
      { range: '70% and above', gpa: '4.0', label: 'A' },
      { range: '65% – 69%', gpa: '3.7', label: 'A-' },
      { range: '60% – 64%', gpa: '3.3', label: 'B+' },
      { range: '55% – 59%', gpa: '3.0', label: 'B' },
      { range: '50% – 54%', gpa: '2.7', label: 'B-' },
      { range: '45% – 49%', gpa: '2.3', label: 'C+' },
      { range: '40% – 44%', gpa: '2.0', label: 'C' },
      { range: 'Below 40%', gpa: '0.0', label: 'F' },
    ]
  },
  uk: {
    name: 'UK Degree Classification',
    flag: '🇬🇧',
    unit: '',
    isDropdown: true,
    options: [
      { label: 'First Class (70%+)', value: 'first', gpa: 4.0 },
      { label: 'Upper Second / 2:1 (60–69%)', value: 'upper2', gpa: 3.5 },
      { label: 'Lower Second / 2:2 (50–59%)', value: 'lower2', gpa: 2.85 },
      { label: 'Third Class (40–49%)', value: 'third', gpa: 2.0 },
    ],
    convert: (val) => {
      const opt = SYSTEMS.uk.options.find(o => o.value === val)
      return opt ? opt.gpa : 0
    },
    scale: [
      { range: 'First Class (70%+)', gpa: '4.0', label: '1st' },
      { range: 'Upper Second / 2:1 (60–69%)', gpa: '3.3 – 3.7', label: '2:1' },
      { range: 'Lower Second / 2:2 (50–59%)', gpa: '2.7 – 3.0', label: '2:2' },
      { range: 'Third Class (40–49%)', gpa: '2.0', label: '3rd' },
    ]
  },
  india: {
    name: 'Indian CGPA (10-point)',
    flag: '🇮🇳',
    unit: '/10',
    placeholder: 'e.g. 8.2',
    min: 0, max: 10,
    convert: (val) => {
      const v = parseFloat(val)
      return Math.min(4.0, v * 0.4)
    },
    scale: [
      { range: '10.0 CGPA', gpa: '4.0', label: 'Outstanding' },
      { range: '9.0 CGPA', gpa: '3.6', label: 'Excellent' },
      { range: '8.0 CGPA', gpa: '3.2', label: 'Very Good' },
      { range: '7.0 CGPA', gpa: '2.8', label: 'Good' },
      { range: '6.0 CGPA', gpa: '2.4', label: 'Above Average' },
    ]
  },
  germany: {
    name: 'German Grade (1.0–4.0)',
    flag: '🇩🇪',
    unit: '',
    placeholder: 'e.g. 1.7',
    min: 1.0, max: 5.0,
    note: 'In Germany, 1.0 is the BEST grade and 4.0 is a passing grade (5.0 is fail).',
    convert: (val) => {
      const v = parseFloat(val)
      if (v <= 1.5) return 4.0
      if (v <= 1.9) return 3.7
      if (v <= 2.5) return 3.3
      if (v <= 2.9) return 3.0
      if (v <= 3.5) return 2.7
      if (v <= 4.0) return 2.0
      return 0.0
    },
    scale: [
      { range: '1.0 – 1.5 (Sehr Gut)', gpa: '4.0', label: 'A' },
      { range: '1.6 – 1.9', gpa: '3.7', label: 'A-' },
      { range: '2.0 – 2.5 (Gut)', gpa: '3.3', label: 'B+' },
      { range: '2.6 – 2.9', gpa: '3.0', label: 'B' },
      { range: '3.0 – 3.5 (Befriedigend)', gpa: '2.7', label: 'B-' },
      { range: '3.6 – 4.0 (Ausreichend)', gpa: '2.0', label: 'C' },
    ]
  },
  australia: {
    name: 'Australian GPA (7-point)',
    flag: '🇦🇺',
    unit: '/7',
    placeholder: 'e.g. 5.5',
    min: 0, max: 7,
    convert: (val) => {
      const v = parseFloat(val)
      return Math.min(4.0, (v / 7) * 4.0)
    },
    scale: [
      { range: '7.0 (High Distinction)', gpa: '4.0', label: 'HD' },
      { range: '6.0 (Distinction)', gpa: '3.4', label: 'D' },
      { range: '5.0 (Credit)', gpa: '2.9', label: 'C' },
      { range: '4.0 (Pass)', gpa: '2.3', label: 'P' },
    ]
  },
}

export default function InternationalGPAConverter() {
  const [system, setSystem] = useState('pakistan')
  const [value, setValue] = useState('')
  const [ukValue, setUkValue] = useState('first')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const s = SYSTEMS[system]

  const switchSystem = (key) => {
    setSystem(key)
    setValue('')
    setResult(null)
    setError('')
  }

  const calculate = () => {
    setError('')
    setResult(null)

    if (s.isDropdown) {
      const gpa = s.convert(ukValue)
      const opt = s.options.find(o => o.value === ukValue)
      setResult({ gpa: gpa.toFixed(2), inputDisplay: opt.label, letter: gpaToLetter(gpa) })
      return
    }

    const v = parseFloat(value)
    if (isNaN(v) || value === '') { setError('Please enter a value.'); return }
    if (v < s.min || v > s.max) { setError(`Value must be between ${s.min} and ${s.max}.`); return }

    const gpa = s.convert(v)
    setResult({ gpa: gpa.toFixed(2), inputDisplay: `${v}${s.unit}`, letter: gpaToLetter(gpa) })
  }

  const gpaToLetter = (gpa) => {
    if (gpa >= 3.7) return 'A range'
    if (gpa >= 3.0) return 'B range'
    if (gpa >= 2.0) return 'C range'
    return 'Below typical admission range'
  }

  const reset = () => { setValue(''); setUkValue('first'); setResult(null); setError('') }

  return (
    <Layout>
      <Head>
        <title>International GPA Converter — WES GPA Calculator | ScholarTools</title>
        <meta name="description" content="Convert your grades to US 4.0 GPA scale instantly. Supports Pakistani percentage, UK degree class, Indian CGPA, German and Australian grades." />
        <link rel="canonical" href="https://scholartools.co/international-gpa-converter" />
        <meta property="og:title" content="International GPA Converter | ScholarTools" />
        <meta property="og:description" content="Free WES-style GPA converter for students applying to US and Canadian universities. Convert Pakistani, UK, Indian, German and Australian grades instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / International GPA Converter</div>
            <h1>🌐 International GPA Converter</h1>
            <p>Converting your grades for US or Canadian university applications? Get an instant 4.0 scale GPA estimate from your home country's grading system.</p>
          </div>

          {/* Disclaimer */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
            💡 This tool gives a <strong>strong estimate</strong> using common WES/HEC-style conversion standards. Official evaluators like WES, ECE, or your target university may produce slightly different results based on individual transcript evaluation. Always confirm with your university's admissions office for official requirements.
          </div>

          <div className="card">
            {/* System Selector */}
            <div className="field">
              <label className="label">Select Your Grading System</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                {Object.entries(SYSTEMS).map(([key, val]) => (
                  <button key={key}
                    className={`btn btn-sm ${system === key ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => switchSystem(key)}>
                    {val.flag} {val.name}
                  </button>
                ))}
              </div>
            </div>

            {s.note && (
              <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 12, color: '#92400E', marginBottom: 16 }}>
                ⚠️ {s.note}
              </div>
            )}

            {/* Input */}
            {s.isDropdown ? (
              <div className="field">
                <label className="label">Your Degree Classification</label>
                <select className="select" value={ukValue} onChange={e => { setUkValue(e.target.value); setResult(null) }}>
                  {s.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="field">
                <label className="label">Your Grade {s.unit && `(${s.unit.replace('/', 'out of ')})`}</label>
                <input className="input" type="number" step="0.01" min={s.min} max={s.max}
                  placeholder={s.placeholder}
                  value={value} onChange={e => { setValue(e.target.value); setResult(null) }} />
              </div>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group">
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Convert to US GPA →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                <div style={{ background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    Your {s.flag} {result.inputDisplay} converts to
                  </div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{result.gpa}</div>
                  <div style={{ fontSize: 16, color: '#374151', marginTop: 8 }}>on the US 4.0 scale</div>
                  <div style={{ marginTop: 12, display: 'inline-block', background: '#1D4ED8', color: 'white', padding: '6px 18px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
                    {result.letter}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scale Reference */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>
              {s.flag} {s.name} → US GPA Conversion Table
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>Reference scale used by this calculator for {s.name.toLowerCase()}.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>{s.name}</th>
                    <th>US GPA (4.0 scale)</th>
                    <th>Approx. Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {s.scale.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 13 }}>{row.range}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>{row.gpa}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{row.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>International GPA Converter — WES Style Calculator</h2>
            <p>This international GPA converter helps students estimate their US 4.0 scale GPA equivalent when applying to American or Canadian universities for graduate or undergraduate admission. It supports conversion from Pakistani percentage grades, UK degree classifications, Indian CGPA on a 10-point scale, German grades, and Australian 7-point GPA scales using widely accepted conversion standards similar to those used by World Education Services (WES).</p>
            <p>Graduate school applications in the US and Canada almost always require a GPA on the 4.0 scale, even though most international students come from percentage-based or differently-scaled grading systems. This tool gives you a quick, reliable estimate to use while preparing your application materials, though official credential evaluation services may produce a slightly different final number based on detailed transcript review.</p>
            <p>Also try our <a href="/cgpa-to-percentage">CGPA to Percentage Converter</a> for local conversions, or use our <a href="/gpa-calculator">GPA Calculator</a> to calculate your semester GPA from individual course grades.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
