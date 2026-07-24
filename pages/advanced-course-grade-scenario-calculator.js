import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState, useCallback } from 'react'

// ─── Pure calculation logic (separate from UI) ────────────────────────────────

/**
 * Calculate the "locked in" contribution from completed assessments.
 * Each item: { name, score, weight } — both score and weight are percentages.
 */
function calcCompletedContribution(completedItems) {
  const valid = completedItems.filter((i) => i.name.trim() !== '' && i.score !== '' && i.weight !== '')
  for (const i of valid) {
    const s = parseFloat(i.score)
    const w = parseFloat(i.weight)
    if (isNaN(s) || isNaN(w)) return { error: `"${i.name}" has an invalid score or weight.` }
    if (w < 0 || s < 0) return { error: `"${i.name}" cannot have a negative score or weight.` }
    if (s > 100) return { error: `"${i.name}" score cannot exceed 100%.` }
  }
  const contribution = valid.reduce((sum, i) => sum + (parseFloat(i.score) * parseFloat(i.weight)) / 100, 0)
  const completedWeight = valid.reduce((sum, i) => sum + parseFloat(i.weight), 0)
  return { contribution: +contribution.toFixed(2), completedWeight: +completedWeight.toFixed(2), items: valid }
}

/**
 * For a single scenario, calculate the projected final grade.
 * remainingItems: [{ name, weight }], scenarioScores: { [itemId]: score }
 */
function calcScenario(completedContribution, remainingItems, scenarioScores) {
  let remainingContribution = 0
  let remainingWeightUsed = 0
  for (const item of remainingItems) {
    const score = parseFloat(scenarioScores[item.id])
    const weight = parseFloat(item.weight)
    if (isNaN(score) || isNaN(weight)) continue
    remainingContribution += (score * weight) / 100
    remainingWeightUsed += weight
  }
  const projected = completedContribution + remainingContribution
  return { projected: +projected.toFixed(2), remainingContribution: +remainingContribution.toFixed(2) }
}

function letterGrade(pct) {
  if (pct >= 90) return { letter: 'A', color: '#059669' }
  if (pct >= 80) return { letter: 'B', color: '#2563EB' }
  if (pct >= 70) return { letter: 'C', color: '#D97706' }
  if (pct >= 60) return { letter: 'D', color: '#D97706' }
  return { letter: 'F', color: '#DC2626' }
}

// ─── Row/scenario factories ────────────────────────────────────────────────────
let _id = 0
const newCompletedRow = (name = '') => ({ id: ++_id, name, score: '', weight: '' })
const newRemainingRow = (name = '') => ({ id: ++_id, name, weight: '' })
const newScenario = (name) => ({ id: ++_id, name, scores: {} })

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdvancedCourseGradeScenarioCalculator() {
  const [completedRows, setCompletedRows] = useState([
    newCompletedRow('Assignments'),
    newCompletedRow('Midterm Exam'),
  ])
  const [remainingRows, setRemainingRows] = useState([
    newRemainingRow('Final Exam'),
    newRemainingRow('Final Project'),
  ])
  const [scenarios, setScenarios] = useState([
    newScenario('Best Case'),
    newScenario('Realistic'),
    newScenario('Worst Case'),
  ])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const updateCompleted = useCallback((id, field, value) => {
    setCompletedRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null); setError('')
  }, [])
  const updateRemaining = useCallback((id, field, value) => {
    setRemainingRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null); setError('')
  }, [])
  const updateScenarioName = useCallback((sid, name) => {
    setScenarios((prev) => prev.map((s) => (s.id === sid ? { ...s, name } : s)))
    setResult(null)
  }, [])
  const updateScenarioScore = useCallback((sid, itemId, value) => {
    setScenarios((prev) => prev.map((s) => (s.id === sid ? { ...s, scores: { ...s.scores, [itemId]: value } } : s)))
    setResult(null)
  }, [])

  const addCompleted = () => setCompletedRows((p) => [...p, newCompletedRow()])
  const removeCompleted = (id) => { setCompletedRows((p) => p.filter((r) => r.id !== id)); setResult(null) }
  const addRemaining = () => setRemainingRows((p) => [...p, newRemainingRow()])
  const removeRemaining = (id) => {
    setRemainingRows((p) => p.filter((r) => r.id !== id))
    setScenarios((p) => p.map((s) => {
      const newScores = { ...s.scores }; delete newScores[id]; return { ...s, scores: newScores }
    }))
    setResult(null)
  }
  const addScenarioCol = () => setScenarios((p) => [...p, newScenario(`Scenario ${p.length + 1}`)])
  const removeScenarioCol = (sid) => { setScenarios((p) => p.filter((s) => s.id !== sid)); setResult(null) }

  const calculate = () => {
    setError(''); setResult(null)

    const completedRes = calcCompletedContribution(completedRows)
    if (completedRes.error) { setError(completedRes.error); return }

    const validRemaining = remainingRows.filter((r) => r.name.trim() !== '' && r.weight !== '')
    if (validRemaining.length === 0 && completedRes.items.length === 0) {
      setError('Please enter at least one completed or remaining assessment.'); return
    }
    for (const r of validRemaining) {
      const w = parseFloat(r.weight)
      if (isNaN(w) || w < 0) { setError(`"${r.name}" has an invalid weight.`); return }
    }

    const remainingWeightTotal = validRemaining.reduce((s, r) => s + parseFloat(r.weight), 0)
    const totalWeight = completedRes.completedWeight + remainingWeightTotal

    const scenarioResults = scenarios.map((sc) => {
      // validate scores entered for this scenario
      for (const item of validRemaining) {
        const sVal = sc.scores[item.id]
        if (sVal !== undefined && sVal !== '') {
          const num = parseFloat(sVal)
          if (isNaN(num) || num < 0 || num > 100) {
            return { ...sc, error: `Invalid score for "${item.name}" in "${sc.name}" (must be 0–100).` }
          }
        }
      }
      const calc = calcScenario(completedRes.contribution, validRemaining, sc.scores)
      return { ...sc, ...calc, grade: letterGrade(calc.projected) }
    })

    const scenarioError = scenarioResults.find((s) => s.error)
    if (scenarioError) { setError(scenarioError.error); return }

    setResult({
      completedContribution: completedRes.contribution,
      completedWeight: completedRes.completedWeight,
      remainingItems: validRemaining,
      remainingWeightTotal: +remainingWeightTotal.toFixed(2),
      totalWeight: +totalWeight.toFixed(2),
      scenarioResults,
    })
  }

  const reset = () => {
    setCompletedRows([newCompletedRow('Assignments'), newCompletedRow('Midterm Exam')])
    setRemainingRows([newRemainingRow('Final Exam'), newRemainingRow('Final Project')])
    setScenarios([newScenario('Best Case'), newScenario('Realistic'), newScenario('Worst Case')])
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>Advanced Course Grade Scenario Calculator — Compare What-If Outcomes | ScholarTools</title>
        <meta
          name="description"
          content="Model multiple grade scenarios side by side. Enter your completed assessments plus remaining work, then compare projected final grades across best case, realistic, and worst case scores."
        />
        <link rel="canonical" href="https://scholartools.co/advanced-course-grade-scenario-calculator" />
        <meta property="og:title" content="Advanced Course Grade Scenario Calculator | ScholarTools" />
        <meta
          property="og:description"
          content="Free grade scenario calculator. Compare multiple what-if outcomes side by side based on your completed work and hypothetical scores on remaining assessments."
        />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          {/* ── Header ── */}
          <div className="tool-header">
            <div className="tool-breadcrumb">
              <Link href="/">Home</Link> / Advanced Course Grade Scenario Calculator
            </div>
            <h1>🎯 Advanced Course Grade Scenario Calculator</h1>
            <p>
              Enter what you have already completed, list what's remaining, then build multiple
              "what-if" scenarios with different hypothetical scores — and see your projected
              final grade for each one, side by side.
            </p>
          </div>

          {/* ── How this differs banner ── */}
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            padding: '10px 14px', fontSize: 13, color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.6,
          }}>
            💡 Looking to find the single minimum score you need on one final exam? Use our simpler{' '}
            <Link href="/grade-calculator" style={{ color: 'var(--accent)' }}>Grade Needed Calculator</Link> instead.
            This tool is for comparing multiple full what-if scenarios across several remaining assessments at once.
          </div>

          <div className="card">
            {/* ── Completed assessments ── */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#059669', textTransform: 'uppercase',
                letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)',
              }}>
                ✅ Completed Assessments (locked in)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, padding: '0 4px', marginBottom: 8 }}>
                {['Assessment', 'Score (%)', 'Weight (%)', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {completedRows.map((row, idx) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <input className="input" type="text" placeholder={`Completed item ${idx + 1}`} value={row.name} onChange={(e) => updateCompleted(row.id, 'name', e.target.value)} />
                    <input className="input" type="number" min="0" max="100" placeholder="85" value={row.score} onChange={(e) => updateCompleted(row.id, 'score', e.target.value)} />
                    <input className="input" type="number" min="0" max="100" placeholder="20" value={row.weight} onChange={(e) => updateCompleted(row.id, 'weight', e.target.value)} />
                    {completedRows.length > 1 ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removeCompleted(row.id)}>✕</button>
                    ) : <span style={{ width: 32 }} />}
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addCompleted}>+ Add Completed Item</button>
            </div>

            {/* ── Remaining assessments ── */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#D97706', textTransform: 'uppercase',
                letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)',
              }}>
                🔮 Remaining Assessments (weight only — scores set per scenario below)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, padding: '0 4px', marginBottom: 8 }}>
                {['Assessment', 'Weight (%)', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {remainingRows.map((row, idx) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <input className="input" type="text" placeholder={`Remaining item ${idx + 1}`} value={row.name} onChange={(e) => updateRemaining(row.id, 'name', e.target.value)} />
                    <input className="input" type="number" min="0" max="100" placeholder="30" value={row.weight} onChange={(e) => updateRemaining(row.id, 'weight', e.target.value)} />
                    {remainingRows.length > 1 ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removeRemaining(row.id)}>✕</button>
                    ) : <span style={{ width: 32 }} />}
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addRemaining}>+ Add Remaining Item</button>
            </div>

            {/* ── Scenario builder ── */}
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#2563EB', textTransform: 'uppercase',
                letterSpacing: '0.5px', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)',
              }}>
                🧪 Scenarios — enter hypothetical scores for each remaining item
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ minWidth: 140 }}>Remaining Item</th>
                      {scenarios.map((sc) => (
                        <th key={sc.id} style={{ minWidth: 130 }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input
                              className="input" style={{ fontSize: 12, padding: '4px 8px', fontWeight: 600 }}
                              value={sc.name}
                              onChange={(e) => updateScenarioName(sc.id, e.target.value)}
                            />
                            {scenarios.length > 1 && (
                              <button className="btn btn-danger btn-sm" style={{ padding: '2px 8px' }} onClick={() => removeScenarioCol(sc.id)}>✕</button>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {remainingRows.filter((r) => r.name.trim() !== '').map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</td>
                        {scenarios.map((sc) => (
                          <td key={sc.id}>
                            <input
                              className="input" type="number" min="0" max="100" placeholder="score %"
                              style={{ fontSize: 13, padding: '6px 10px' }}
                              value={sc.scores[item.id] || ''}
                              onChange={(e) => updateScenarioScore(sc.id, item.id, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addScenarioCol}>+ Add Scenario</button>
            </div>

            {/* ── Error ── */}
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 16 }}>
                ⚠️ {error}
              </div>
            )}

            {/* ── Actions ── */}
            <div className="btn-group" style={{ marginTop: 20 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Compare Scenarios →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {/* ── Results ── */}
            {result && (
              <div style={{ marginTop: 24 }}>
                <div style={{
                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--text-2)',
                }}>
                  Locked-in contribution from completed work: <strong style={{ color: 'var(--accent)' }}>{result.completedContribution}%</strong>{' '}
                  ({result.completedWeight}% of course weight already secured)
                </div>

                {/* Scenario comparison cards */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(result.scenarioResults.length, 3)}, 1fr)`, gap: 12, marginBottom: 16 }}>
                  {result.scenarioResults.map((sc) => (
                    <div key={sc.id} style={{
                      background: sc.grade.color + '12', border: `2px solid ${sc.grade.color}`,
                      borderRadius: 'var(--radius-sm)', padding: 18, textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: sc.grade.color, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>
                        {sc.name}
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: sc.grade.color, lineHeight: 1 }}>
                        {sc.projected}%
                      </div>
                      <div style={{
                        marginTop: 8, display: 'inline-block', background: sc.grade.color, color: 'white',
                        padding: '3px 14px', borderRadius: 16, fontSize: 13, fontWeight: 700,
                      }}>
                        {sc.grade.letter}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison table */}
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Scenario</th>
                        <th>Locked-In</th>
                        <th>From Remaining</th>
                        <th>Projected Final</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.scenarioResults.map((sc) => (
                        <tr key={sc.id}>
                          <td style={{ fontSize: 13, fontWeight: 500 }}>{sc.name}</td>
                          <td style={{ fontSize: 13 }}>{result.completedContribution}%</td>
                          <td style={{ fontSize: 13 }}>{sc.remainingContribution}%</td>
                          <td style={{ fontSize: 14, fontWeight: 700, color: sc.grade.color }}>{sc.projected}%</td>
                          <td>
                            <span style={{ background: sc.grade.color + '15', color: sc.grade.color, padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                              {sc.grade.letter}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {result.totalWeight < 99.5 && (
                  <div style={{ marginTop: 14, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#92400E' }}>
                    ⚠️ Your completed and remaining weights add up to {result.totalWeight}%, not 100%. Add any missing assessments for a complete projection.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── How it works ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 10 }}>How the Scenario Calculator Works</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
              Rather than answering a single question like "what score do I need to pass," this tool lets you model several complete what-if outcomes at once. Your completed work forms a fixed, locked-in contribution. For each scenario you define, you assign hypothetical scores to your remaining assessments, and the calculator projects the resulting final grade — so you can compare "if everything goes well" against "if things go badly" side by side.
            </p>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>Formula Used</div>
              <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)', lineHeight: 1.8 }}>
                Projected Grade = Locked-In Contribution + Σ(Scenario Score × Remaining Weight) ÷ 100
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Worked Example</div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Component</th><th>Detail</th><th>Contribution</th></tr></thead>
                <tbody>
                  {[
                    ['Assignments (completed)', '85% × 20% weight', '17.00%'],
                    ['Midterm (completed)', '74% × 30% weight', '22.20%'],
                    ['Final Exam — "Best Case"', '95% × 50% weight', '47.50%'],
                  ].map(([name, detail, contrib]) => (
                    <tr key={name}><td style={{ fontSize: 13 }}>{name}</td><td style={{ fontSize: 13 }}>{detail}</td><td style={{ fontSize: 13, color: 'var(--accent)' }}>{contrib}</td></tr>
                  ))}
                  <tr style={{ background: 'var(--bg)', fontWeight: 700 }}>
                    <td colSpan={2} style={{ fontSize: 13 }}>Projected Final Grade ("Best Case" scenario)</td>
                    <td style={{ fontSize: 13, color: '#059669' }}>86.70% (B)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>Frequently Asked Questions</h2>
            {[
              {
                q: 'How is this different from the Grade Needed Calculator?',
                a: 'The Grade Needed Calculator solves backward for a single number: what score do you need on one remaining assessment to hit a target grade? This calculator works forward instead — you supply hypothetical scores for potentially several remaining assessments, and it projects your final grade for each named scenario, so you can compare multiple outcomes side by side.',
              },
              {
                q: 'Do I need to fill in a score for every scenario column?',
                a: 'No — leave any score blank and that item simply will not contribute to that scenario\'s projection. This is useful if you want to model a scenario where you are only guessing at some of your remaining assessments.',
              },
              {
                q: 'What if my completed and remaining weights do not add up to 100%?',
                a: 'The calculator will still run and show a warning. This is common if you have not yet been told the exact weight of every remaining assessment — add items as your syllabus is updated for a more complete projection.',
              },
              {
                q: 'Can I add more than three scenarios?',
                a: 'Yes — click "Add Scenario" to add as many comparison columns as you need. Each one gets its own name and independent set of hypothetical scores.',
              },
              {
                q: 'Is this the same as the Weighted Grade Calculator?',
                a: 'No. The Weighted Grade Calculator only handles assessments you have already completed and shows your current average. This tool adds a second layer — remaining assessments with scores you have not earned yet — and lets you compare multiple hypothetical outcomes rather than just seeing where you currently stand.',
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 5 }}>{q}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{a}</div>
              </div>
            ))}
          </div>

          {/* ── SEO / tool-info section ── */}
          <div className="tool-info">
            <h2>Advanced Course Grade Scenario Calculator</h2>
            <p>
              This advanced course grade scenario calculator helps students model multiple complete what-if outcomes for their final course grade, rather than solving for a single required score. You separate your assessments into two groups: completed work, which contributes a fixed, locked-in amount to your grade, and remaining work, whose scores are still unknown. For each scenario you build — such as a best case, realistic case, and worst case — you assign hypothetical scores to every remaining assessment and see the resulting projected final grade.
            </p>
            <p>
              This side-by-side comparison is especially useful late in a semester, when you know your standing on completed work but want to understand the full range of possible outcomes depending on how your final exam, project, or presentation goes. Unlike a single-answer calculator, this tool lets you compare several complete pictures at once.
            </p>
            <p>
              Need a simpler single-answer version instead? Use our{' '}
              <a href="/grade-calculator">Grade Needed Calculator</a> to find the exact score required on one final assessment. Want to see your current standing first?{' '}
              Check the <a href="/weighted-grade-calculator">Weighted Grade Calculator</a>, or convert your result with the{' '}
              <a href="/gpa-calculator">GPA Calculator</a>.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
