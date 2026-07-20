import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState, useCallback } from 'react'

// ─── Pure calculation logic (separate from UI) ────────────────────────────────

/**
 * Calculate weighted grade from an array of assessment items.
 * Supports two modes:
 *  - 'percentage': weights must sum to 100; scores are 0–100
 *  - 'points':     weights are raw point values; scores are 0–weight
 *
 * Returns null if no valid items provided.
 */
function calcWeightedGrade(items, mode) {
  const valid = items.filter(
    (i) => i.name.trim() !== '' && i.score !== '' && i.weight !== ''
  )
  if (valid.length === 0) return null

  const parsed = valid.map((i) => ({
    name: i.name.trim(),
    score: parseFloat(i.score),
    weight: parseFloat(i.weight),
  }))

  // Validation
  for (const p of parsed) {
    if (isNaN(p.score) || isNaN(p.weight)) return { error: 'All scores and weights must be numbers.' }
    if (p.weight <= 0) return { error: 'Weights must be greater than zero.' }
    if (p.score < 0) return { error: 'Scores cannot be negative.' }
    if (mode === 'percentage' && p.score > 100) return { error: 'Percentage scores cannot exceed 100.' }
    if (mode === 'points' && p.score > p.weight) return { error: `Score for "${p.name}" cannot exceed its weight (${p.weight}).` }
  }

  const totalWeight = parsed.reduce((sum, p) => sum + p.weight, 0)

  // Per-item contribution and percentage
  const itemResults = parsed.map((p) => {
    const scorePct = mode === 'percentage' ? p.score : (p.score / p.weight) * 100
    const contribution = (scorePct * p.weight) / totalWeight
    return { ...p, scorePct: +scorePct.toFixed(2), contribution: +contribution.toFixed(4) }
  })

  const weightedAvg = itemResults.reduce((sum, i) => sum + i.contribution, 0)

  // Unused weight (percentage mode only)
  const usedWeight = totalWeight
  const unusedWeight = mode === 'percentage' ? Math.max(0, +(100 - usedWeight).toFixed(2)) : null

  return {
    weightedAvg: +weightedAvg.toFixed(2),
    totalWeight: +totalWeight.toFixed(2),
    unusedWeight,
    itemResults,
    mode,
  }
}

function letterGrade(pct) {
  if (pct >= 90) return { letter: 'A', color: '#059669' }
  if (pct >= 80) return { letter: 'B', color: '#2563EB' }
  if (pct >= 70) return { letter: 'C', color: '#D97706' }
  if (pct >= 60) return { letter: 'D', color: '#D97706' }
  return { letter: 'F', color: '#DC2626' }
}

// ─── Empty row factory ────────────────────────────────────────────────────────
let _id = 0
const newRow = () => ({ id: ++_id, name: '', score: '', weight: '' })

// ─── Component ────────────────────────────────────────────────────────────────
export default function WeightedGradeCalculator() {
  const [mode, setMode] = useState('percentage') // 'percentage' | 'points'
  const [rows, setRows] = useState([
    { id: ++_id, name: 'Midterm Exam', score: '', weight: '' },
    { id: ++_id, name: 'Final Exam', score: '', weight: '' },
    { id: ++_id, name: 'Assignments', score: '', weight: '' },
    { id: ++_id, name: '', score: '', weight: '' },
  ])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const updateRow = useCallback((id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null)
    setError('')
  }, [])

  const addRow = () => setRows((prev) => [...prev, newRow()])

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    setResult(null)
  }

  const switchMode = (m) => {
    setMode(m)
    setResult(null)
    setError('')
  }

  const calculate = () => {
    setError('')
    setResult(null)
    const res = calcWeightedGrade(rows, mode)
    if (!res) { setError('Please enter at least one assessment with a score and weight.'); return }
    if (res.error) { setError(res.error); return }
    if (mode === 'percentage' && res.totalWeight > 100.01) {
      setError(`Weights sum to ${res.totalWeight}% — they must not exceed 100%.`); return
    }
    setResult(res)
  }

  const reset = () => {
    setRows([
      { id: ++_id, name: 'Midterm Exam', score: '', weight: '' },
      { id: ++_id, name: 'Final Exam', score: '', weight: '' },
      { id: ++_id, name: 'Assignments', score: '', weight: '' },
      { id: ++_id, name: '', score: '', weight: '' },
    ])
    setResult(null)
    setError('')
  }

  const gradeInfo = result ? letterGrade(result.weightedAvg) : null
  const weightLabel = mode === 'percentage' ? 'Weight (%)' : 'Max Points'
  const scoreLabel = mode === 'percentage' ? 'Score (%)' : 'Points Earned'

  return (
    <Layout>
      <Head>
        <title>Weighted Grade Calculator — Free Weighted Average Grade Tool | ScholarTools</title>
        <meta
          name="description"
          content="Calculate your weighted grade average from multiple assessments instantly. Supports percentage weights and points mode. Free weighted grade calculator for students."
        />
        <link rel="canonical" href="https://scholartools.co/weighted-grade-calculator" />
        <meta property="og:title" content="Weighted Grade Calculator | ScholarTools" />
        <meta
          property="og:description"
          content="Free weighted grade calculator. Enter your assessment scores and weights to instantly get your weighted average grade. Supports both percentage and points modes."
        />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          {/* ── Header ── */}
          <div className="tool-header">
            <div className="tool-breadcrumb">
              <Link href="/">Home</Link> / Weighted Grade Calculator
            </div>
            <h1>📊 Weighted Grade Calculator</h1>
            <p>
              Enter each assessment, its score, and how much it counts toward your final grade.
              Get your weighted average instantly — along with a breakdown showing exactly how
              each item contributes.
            </p>
          </div>

          {/* ── Mode toggle ── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              className={`btn ${mode === 'percentage' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => switchMode('percentage')}
            >
              % Weight Mode
            </button>
            <button
              className={`btn ${mode === 'points' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => switchMode('points')}
            >
              Points Mode
            </button>
          </div>

          {/* ── Mode explanation ── */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: 13,
            color: 'var(--text-2)',
            marginBottom: 20,
            lineHeight: 1.6,
          }}>
            {mode === 'percentage'
              ? '📐 Percentage mode: enter weights that add up to 100% (e.g. Midterm 30%, Final 40%, Assignments 30%). Scores are percentages out of 100.'
              : '📐 Points mode: enter the maximum points for each assessment (e.g. Midterm /100, Quiz /20). Scores are raw points earned.'}
          </div>

          <div className="card">
            {/* ── Column headers ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr auto',
              gap: 10,
              padding: '0 4px',
              marginBottom: 8,
            }}>
              {['Assessment', scoreLabel, weightLabel, ''].map((h, i) => (
                <span key={i} style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-2)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}>
                  {h}
                </span>
              ))}
            </div>

            {/* ── Rows ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, alignItems: 'center' }}
                >
                  <input
                    className="input"
                    type="text"
                    placeholder={`Assessment ${idx + 1}`}
                    aria-label={`Assessment ${idx + 1} name`}
                    value={row.name}
                    onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                  />
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={mode === 'percentage' ? '85' : '72'}
                    aria-label={`Assessment ${idx + 1} score`}
                    value={row.score}
                    onChange={(e) => updateRow(row.id, 'score', e.target.value)}
                  />
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={mode === 'percentage' ? '30' : '100'}
                    aria-label={`Assessment ${idx + 1} weight`}
                    value={row.weight}
                    onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
                  />
                  {rows.length > 1 ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeRow(row.id)}
                      aria-label={`Remove assessment ${idx + 1}`}
                    >
                      ✕
                    </button>
                  ) : (
                    <span style={{ width: 32 }} />
                  )}
                </div>
              ))}
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 10, width: 'fit-content' }}
              onClick={addRow}
            >
              + Add Assessment
            </button>

            {/* ── Weight progress bar (percentage mode) ── */}
            {mode === 'percentage' && (
              (() => {
                const totalW = rows.reduce((s, r) => s + (parseFloat(r.weight) || 0), 0)
                const over = totalW > 100
                const pct = Math.min(totalW, 100)
                return (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: over ? '#DC2626' : 'var(--text-2)', marginBottom: 4 }}>
                      <span>Weights assigned</span>
                      <span style={{ fontWeight: 600 }}>{totalW.toFixed(1)}% / 100%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? '#DC2626' : totalW === 100 ? '#059669' : 'var(--accent)', borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                    {totalW === 100 && !over && (
                      <div style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>✅ Weights add up to 100% — ready to calculate</div>
                    )}
                  </div>
                )
              })()
            )}

            {/* ── Error ── */}
            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: 13,
                color: '#DC2626',
                marginTop: 14,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* ── Actions ── */}
            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate Weighted Grade →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {/* ── Results ── */}
            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Main grade display */}
                <div style={{
                  background: gradeInfo.color + '12',
                  border: `2px solid ${gradeInfo.color}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: 24,
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: gradeInfo.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    Your Weighted Grade Average
                  </div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: gradeInfo.color, lineHeight: 1 }}>
                    {result.weightedAvg}%
                  </div>
                  <div style={{
                    marginTop: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: gradeInfo.color,
                    color: 'white',
                    padding: '6px 20px',
                    borderRadius: 20,
                    fontSize: 16,
                    fontWeight: 700,
                  }}>
                    Letter Grade: {gradeInfo.letter}
                  </div>
                </div>

                {/* Stats row */}
                <div className="stat-grid" style={{ marginBottom: 16 }}>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: gradeInfo.color }}>{result.weightedAvg}%</div>
                    <div className="stat-lbl">Weighted Average</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{result.totalWeight}{mode === 'percentage' ? '%' : ' pts'}</div>
                    <div className="stat-lbl">Total Weight Entered</div>
                  </div>
                  {result.unusedWeight !== null && (
                    <div className="stat-box" style={{ background: result.unusedWeight > 0 ? '#FFF7ED' : undefined, border: result.unusedWeight > 0 ? '1px solid #FED7AA' : undefined }}>
                      <div className="stat-val" style={{ color: result.unusedWeight > 0 ? '#D97706' : '#059669' }}>
                        {result.unusedWeight}%
                      </div>
                      <div className="stat-lbl">Weight Remaining</div>
                    </div>
                  )}
                </div>

                {/* Unused weight warning */}
                {result.unusedWeight > 0 && (
                  <div style={{
                    background: '#FFF7ED',
                    border: '1px solid #FED7AA',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#92400E',
                    marginBottom: 16,
                    lineHeight: 1.6,
                  }}>
                    ⚠️ Your weights only sum to {result.totalWeight}%, leaving {result.unusedWeight}% unaccounted for. This average only reflects the assessments you have entered. Add your remaining assessments for a complete picture.
                  </div>
                )}

                {/* Per-item breakdown */}
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                    Score Breakdown — How Each Assessment Contributes
                  </div>
                  {result.itemResults.map((item, i) => {
                    const g = letterGrade(item.scorePct)
                    return (
                      <div
                        key={i}
                        style={{
                          padding: '12px 16px',
                          borderBottom: i < result.itemResults.length - 1 ? '1px solid var(--border)' : 'none',
                          background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                              {mode === 'percentage'
                                ? `${item.score}% score · ${item.weight}% weight`
                                : `${item.score}/${item.weight} points`}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: g.color }}>{item.scorePct}%</div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                              contributes <strong style={{ color: 'var(--accent)' }}>{item.contribution.toFixed(2)}%</strong> to final
                            </div>
                          </div>
                        </div>
                        {/* Contribution bar */}
                        <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (item.contribution / result.weightedAvg) * 100)}%`, background: g.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── How it works ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 10 }}>How the Weighted Grade Calculator Works</h2>

            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
              A weighted grade is not a simple average — it reflects the fact that some assessments count more toward your final grade than others. A final exam worth 40% has twice the impact of a midterm worth 20%, even if you scored the same on both.
            </p>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>Formula Used</div>
              <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)', lineHeight: 1.8 }}>
                Weighted Grade = Σ(Score × Weight) ÷ Σ(Weights)
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Worked Example</div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Score</th>
                    <th>Weight</th>
                    <th>Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Assignments', '88%', '30%', '(88 × 30) ÷ 100 = 26.40%'],
                    ['Midterm Exam', '74%', '30%', '(74 × 30) ÷ 100 = 22.20%'],
                    ['Final Exam', '82%', '40%', '(82 × 40) ÷ 100 = 32.80%'],
                  ].map(([name, score, weight, contrib]) => (
                    <tr key={name}>
                      <td style={{ fontSize: 13 }}>{name}</td>
                      <td style={{ fontSize: 13 }}>{score}</td>
                      <td style={{ fontSize: 13 }}>{weight}</td>
                      <td style={{ fontSize: 13, color: 'var(--accent)' }}>{contrib}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--bg)', fontWeight: 700 }}>
                    <td colSpan={3} style={{ fontSize: 13 }}>Weighted Grade Average</td>
                    <td style={{ fontSize: 13, color: '#059669' }}>81.40%</td>
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
                q: 'What is the difference between a weighted grade and a simple average?',
                a: 'A simple average treats every assessment equally. A weighted average multiplies each score by how much it counts, then divides by the total weight. If your final exam is worth 40% and a quiz is worth 10%, the final exam has four times as much impact on your grade as the quiz.',
              },
              {
                q: 'What if my weights do not add up to 100%?',
                a: 'The calculator will still give you a result, but will show a warning that some weight is unaccounted for. This is useful mid-semester when not all assessments have happened yet — your average only reflects completed work.',
              },
              {
                q: 'When should I use Points Mode instead of Percentage Mode?',
                a: 'Use Points Mode when your course uses raw point totals rather than named percentage categories. For example, if you have a quiz worth 20 points, a midterm worth 100 points, and a final worth 150 points, enter those totals as the weights and your raw scores earned as the scores.',
              },
              {
                q: 'How is this different from the Grade Needed Calculator?',
                a: 'The Weighted Grade Calculator shows your current average across assessments you have already completed. The Grade Needed Calculator answers a different question: what score do you need on a future exam to reach a target final grade? Use this tool first to see where you stand, then use the Grade Needed Calculator to plan your next steps.',
              },
              {
                q: 'Can my weighted grade be different from what my university portal shows?',
                a: 'Yes, if your university applies rounding rules, drops lowest scores, curves individual assessments, or uses different weighting periods for terms. This calculator applies the standard weighted average formula without institutional adjustments — use it as a guide alongside your official transcript.',
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
            <h2>Weighted Grade Calculator</h2>
            <p>
              This weighted grade calculator helps students calculate their current academic average when different assessments carry different percentage weights. Most university and high school courses weight assessments unequally — final exams typically carry more weight than weekly quizzes, and assignments may count separately from tests. A simple average of your scores will not give you an accurate picture of your standing; only a weighted average will.
            </p>
            <p>
              The calculator supports both percentage weight mode (where your weights should total 100%) and points mode (where you enter the maximum points available for each assessment and your raw score earned). Both modes use the same core formula: the sum of each score multiplied by its weight, divided by the total weight assigned.
            </p>
            <p>
              Once you know your current weighted average, use our{' '}
              <a href="/grade-calculator">Grade Needed Calculator</a> to find out what score you need on an upcoming exam to hit your target grade, or check our{' '}
              <a href="/gpa-calculator">GPA Calculator</a> to convert your percentage grade to a 4.0 GPA scale. You can also use the{' '}
              <a href="/percentage-calculator">Percentage Calculator</a> for quick score conversions.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
