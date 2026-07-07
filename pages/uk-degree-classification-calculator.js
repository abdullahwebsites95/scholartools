import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const CLASSIFICATIONS = [
  { name: 'First Class', short: '1st', min: 70, max: 100, color: '#059669', bg: '#ECFDF5', border: '#059669', desc: 'Outstanding academic achievement' },
  { name: 'Upper Second / 2:1', short: '2:1', min: 60, max: 69.99, color: '#2563EB', bg: '#EFF6FF', border: '#2563EB', desc: 'Above average academic performance' },
  { name: 'Lower Second / 2:2', short: '2:2', min: 50, max: 59.99, color: '#D97706', bg: '#FFF7ED', border: '#D97706', desc: 'Average academic performance' },
  { name: 'Third Class', short: '3rd', min: 40, max: 49.99, color: '#DC2626', bg: '#FEF2F2', border: '#DC2626', desc: 'Below average but passing grade' },
  { name: 'Ordinary / Pass', short: 'Pass', min: 35, max: 39.99, color: '#6B7280', bg: '#F9FAFB', border: '#9CA3AF', desc: 'Minimum pass — no honours classification' },
  { name: 'Fail', short: 'Fail', min: 0, max: 34.99, color: '#991B1B', bg: '#FEF2F2', border: '#DC2626', desc: 'Below pass threshold' },
]

function getClassification(avg) {
  return CLASSIFICATIONS.find(c => avg >= c.min && avg <= c.max) || CLASSIFICATIONS[CLASSIFICATIONS.length - 1]
}

const emptyModule = () => ({ id: Date.now() + Math.random(), name: '', grade: '', credits: '' })

export default function UKDegreeCalculator() {
  const [mode, setMode] = useState('simple')
  const [simpleGrade, setSimpleGrade] = useState('')
  const [modules, setModules] = useState([emptyModule(), emptyModule(), emptyModule(), emptyModule()])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const addModule = () => setModules(m => [...m, emptyModule()])
  const removeModule = id => setModules(m => m.filter(x => x.id !== id))
  const updateModule = (id, field, val) => setModules(m => m.map(x => x.id === id ? { ...x, [field]: val } : x))

  const calculateSimple = () => {
    setError('')
    setResult(null)
    const grade = parseFloat(simpleGrade)
    if (isNaN(grade) || simpleGrade === '') { setError('Please enter your overall grade percentage.'); return }
    if (grade < 0 || grade > 100) { setError('Grade must be between 0 and 100.'); return }

    const classification = getClassification(grade)
    const boundaries = CLASSIFICATIONS.filter(c => c.min !== 0 && c.min !== 35)
    const nextUp = boundaries.find(c => c.min > grade)
    const gapToNext = nextUp ? (nextUp.min - grade).toFixed(1) : null
    const atRisk = nextUp && parseFloat(gapToNext) <= 3

    setResult({ avg: grade.toFixed(1), classification, gapToNext, nextUp, atRisk, mode: 'simple' })
  }

  const calculateModules = () => {
    setError('')
    setResult(null)
    const valid = modules.filter(m => m.name.trim() && m.grade !== '' && m.credits !== '')
    if (valid.length < 1) { setError('Please enter at least one module with name, grade and credits.'); return }

    for (const m of valid) {
      const g = parseFloat(m.grade)
      const c = parseFloat(m.credits)
      if (isNaN(g) || isNaN(c)) { setError(`Invalid values for module: ${m.name}`); return }
      if (g < 0 || g > 100) { setError(`Grade for ${m.name} must be between 0 and 100.`); return }
      if (c <= 0) { setError(`Credits for ${m.name} must be greater than zero.`); return }
    }

    const totalCredits = valid.reduce((sum, m) => sum + parseFloat(m.credits), 0)
    const weightedSum = valid.reduce((sum, m) => sum + (parseFloat(m.grade) * parseFloat(m.credits)), 0)
    const avg = weightedSum / totalCredits

    const classification = getClassification(avg)
    const boundaries = CLASSIFICATIONS.filter(c => c.min !== 0 && c.min !== 35)
    const nextUp = boundaries.find(c => c.min > avg)
    const gapToNext = nextUp ? (nextUp.min - avg).toFixed(1) : null
    const atRisk = nextUp && parseFloat(gapToNext) <= 3

    const moduleResults = valid.map(m => ({
      ...m,
      grade: parseFloat(m.grade),
      credits: parseFloat(m.credits),
      classification: getClassification(parseFloat(m.grade)),
      contribution: ((parseFloat(m.grade) * parseFloat(m.credits)) / totalCredits).toFixed(2)
    }))

    setResult({ avg: avg.toFixed(2), classification, gapToNext, nextUp, atRisk, mode: 'modules', moduleResults, totalCredits })
  }

  const reset = () => {
    setSimpleGrade('')
    setModules([emptyModule(), emptyModule(), emptyModule(), emptyModule()])
    setResult(null)
    setError('')
  }

  return (
    <Layout>
      <Head>
        <title>UK Degree Classification Calculator — First, 2:1, 2:2 | ScholarTools</title>
        <meta name="description" content="Calculate your UK degree classification instantly. Enter your overall average or individual module grades with credits. Free degree classification calculator." />
        <link rel="canonical" href="https://scholartools.co/uk-degree-classification-calculator" />
        <meta property="og:title" content="UK Degree Classification Calculator | ScholarTools" />
        <meta property="og:description" content="Free UK degree classification calculator. Find out if you are on track for a First, 2:1, 2:2 or Third using your module grades and credit weighting." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / UK Degree Classification Calculator</div>
            <h1>🎓 UK Degree Classification Calculator</h1>
            <p>Find out your current degree classification and how far you are from the next boundary. Enter your overall average or add modules individually with credit weighting.</p>
          </div>

          {/* Classification reference */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 20 }}>
            {CLASSIFICATIONS.slice(0, 4).map(c => (
              <div key={c.short} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--radius-sm)', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.short}</div>
                <div style={{ fontSize: 11, color: c.color, fontWeight: 600 }}>{c.min}%{c.short !== '1st' ? `–${Math.floor(c.max)}%` : '+'}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>{c.name}</div>
              </div>
            ))}
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button className={`btn ${mode === 'simple' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => { setMode('simple'); setResult(null); setError('') }}>
              📊 Simple — Overall Average
            </button>
            <button className={`btn ${mode === 'modules' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => { setMode('modules'); setResult(null); setError('') }}>
              📚 Module Weighted Average
            </button>
          </div>

          <div className="card">
            {mode === 'simple' ? (
              <>
                <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Enter Your Overall Weighted Average</h2>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>Enter the overall percentage average shown on your university transcript or calculated by your department.</p>
                <div className="field">
                  <label className="label">Overall Weighted Average (%)</label>
                  <input className="input" type="number" step="0.01" min="0" max="100"
                    placeholder="e.g. 64.5"
                    value={simpleGrade} onChange={e => { setSimpleGrade(e.target.value); setResult(null) }} />
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Enter Your Module Grades</h2>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Add each module with its grade and credit value. The calculator weights each module by credits to give your true classification.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, padding: '0 4px', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Module Name</span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Grade %</span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Credits</span>
                  <span></span>
                </div>
                {modules.map(m => (
                  <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input className="input" placeholder="e.g. Dissertation"
                      value={m.name} onChange={e => updateModule(m.id, 'name', e.target.value)} />
                    <input className="input" type="number" step="0.1" min="0" max="100" placeholder="e.g. 68"
                      value={m.grade} onChange={e => updateModule(m.id, 'grade', e.target.value)} />
                    <input className="input" type="number" min="1" placeholder="e.g. 20"
                      value={m.credits} onChange={e => updateModule(m.id, 'credits', e.target.value)} />
                    {modules.length > 1 && (
                      <button className="btn btn-danger btn-sm" onClick={() => removeModule(m.id)}>✕</button>
                    )}
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 4 }} onClick={addModule}>
                  + Add Module
                </button>
              </>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
                onClick={mode === 'simple' ? calculateSimple : calculateModules}>
                Calculate Classification →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Main result */}
                <div style={{ background: result.classification.bg, border: `2px solid ${result.classification.border}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: result.classification.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your Degree Classification</div>
                  <div style={{ fontSize: 56, fontWeight: 800, color: result.classification.color, lineHeight: 1 }}>{result.classification.short}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: result.classification.color, marginTop: 8 }}>{result.classification.name}</div>
                  <div style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>Current average: <strong>{result.avg}%</strong></div>
                </div>

                {/* Boundary alert */}
                {result.atRisk && result.nextUp && (
                  <div style={{ background: '#FFF7ED', border: '1.5px solid #D97706', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                    ⚠️ <strong>Classification at risk:</strong> You are only <strong>{result.gapToNext}%</strong> below the {result.nextUp.name} boundary ({result.nextUp.min}%). You are within range to move up with stronger performance in remaining assessments.
                  </div>
                )}

                {result.gapToNext && !result.atRisk && (
                  <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                    📈 You need <strong>{result.gapToNext}%</strong> more to reach <strong>{result.nextUp?.name}</strong> ({result.nextUp?.min}% threshold).
                  </div>
                )}

                {!result.nextUp && (
                  <div style={{ background: '#ECFDF5', border: '1px solid #059669', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#065F46' }}>
                    🏆 You are in the top classification — First Class Honours. Excellent work.
                  </div>
                )}

                {/* Stats */}
                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: result.classification.color }}>{result.avg}%</div>
                    <div className="stat-lbl">Weighted Average</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: result.classification.color }}>{result.classification.short}</div>
                    <div className="stat-lbl">Classification</div>
                  </div>
                  {result.gapToNext && (
                    <div className="stat-box">
                      <div className="stat-val" style={{ color: parseFloat(result.gapToNext) <= 3 ? '#D97706' : 'var(--text)' }}>{result.gapToNext}%</div>
                      <div className="stat-lbl">Gap to Next Class</div>
                    </div>
                  )}
                  {result.totalCredits && (
                    <div className="stat-box">
                      <div className="stat-val">{result.totalCredits}</div>
                      <div className="stat-lbl">Total Credits</div>
                    </div>
                  )}
                </div>

                {/* Module breakdown */}
                {result.mode === 'modules' && result.moduleResults && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>Module Breakdown</div>
                    <div style={{ overflowX: 'auto' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Module</th>
                            <th>Grade</th>
                            <th>Credits</th>
                            <th>Classification</th>
                            <th>Contribution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.moduleResults.map(m => (
                            <tr key={m.id}>
                              <td style={{ fontSize: 13 }}>{m.name}</td>
                              <td style={{ fontSize: 13, fontWeight: 600, color: m.classification.color }}>{m.grade}%</td>
                              <td style={{ fontSize: 13 }}>{m.credits}</td>
                              <td>
                                <span style={{ background: m.classification.bg, color: m.classification.color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                                  {m.classification.short}
                                </span>
                              </td>
                              <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{m.contribution}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* UK Classification Guide */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>UK Degree Classification Guide</h2>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Classification</th>
                    <th>Percentage Range</th>
                    <th>Common Abbreviation</th>
                    <th>What It Means</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASSIFICATIONS.map(c => (
                    <tr key={c.short}>
                      <td>
                        <span style={{ background: c.bg, color: c.color, padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                          {c.name}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: c.color }}>
                        {c.min === 0 ? 'Below 35%' : c.short === '1st' ? '70% and above' : `${c.min}% – ${Math.floor(c.max)}%`}
                      </td>
                      <td style={{ fontSize: 13 }}>{c.short}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
              Note: Some universities use different weighting systems (e.g. final year only, or weighted 2nd/3rd year split). Always check your university's specific classification rules.
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>UK Degree Classification Calculator</h2>
            <p>This UK degree classification calculator helps students instantly find out whether they are on track for a First Class, Upper Second (2:1), Lower Second (2:2), or Third Class Honours degree. The standard UK degree classification system divides results into these four main classes based on overall weighted average percentage, with 70% and above earning a First, 60–69% earning a 2:1, 50–59% earning a 2:2, and 40–49% earning a Third.</p>
            <p>The module weighted average mode is particularly useful for students who want to see exactly how each module contributes to their overall classification based on credit value. Higher credit modules have a greater impact on your final average than lower credit ones, making this calculation essential for strategic exam preparation.</p>
            <p>Also use our <a href="/grade-calculator">Grade Needed Calculator</a> to find what score you need on your next assessment, or check our <a href="/student-rent-calculator">Student Rent Calculator UK</a> for financial planning.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
