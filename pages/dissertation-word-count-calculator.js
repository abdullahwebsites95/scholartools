import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState, useCallback } from 'react'

// ─── Pure calculation logic (separate from UI) ────────────────────────────────

// Common dissertation chapter structures with widely-taught default percentage
// allocations (standard academic-writing-center guidance, not a single proprietary
// source — customizable by the user regardless).
const RESEARCH_TYPES = {
  empirical: {
    label: 'Empirical / Quantitative',
    chapters: [
      { name: 'Introduction', pct: 10 },
      { name: 'Literature Review', pct: 22 },
      { name: 'Methodology', pct: 15 },
      { name: 'Results', pct: 20 },
      { name: 'Discussion', pct: 23 },
      { name: 'Conclusion', pct: 10 },
    ],
  },
  qualitative: {
    label: 'Qualitative',
    chapters: [
      { name: 'Introduction', pct: 10 },
      { name: 'Literature Review', pct: 20 },
      { name: 'Methodology', pct: 15 },
      { name: 'Findings & Discussion', pct: 35 },
      { name: 'Conclusion', pct: 10 },
      { name: 'Reflections / Limitations', pct: 10 },
    ],
  },
  literatureReview: {
    label: 'Literature-Review-Only',
    chapters: [
      { name: 'Introduction', pct: 12 },
      { name: 'Literature Review Body', pct: 60 },
      { name: 'Synthesis & Gaps', pct: 18 },
      { name: 'Conclusion', pct: 10 },
    ],
  },
  custom: {
    label: 'Start From Scratch (Custom)',
    chapters: [
      { name: 'Introduction', pct: 10 },
      { name: 'Chapter 2', pct: 20 },
      { name: 'Chapter 3', pct: 20 },
      { name: 'Chapter 4', pct: 20 },
      { name: 'Chapter 5', pct: 20 },
      { name: 'Conclusion', pct: 10 },
    ],
  },
}

const TOLERANCE_PCT = 10 // widely-used UK convention: ±10% discretionary band

/**
 * Distribute a total word count across chapters by percentage.
 * Returns null if inputs are unusable.
 */
function calcDissertationSplit(totalWords, chapters) {
  const valid = chapters.filter((c) => c.name.trim() !== '' && c.pct !== '')
  if (valid.length === 0) return null

  const total = parseFloat(totalWords)
  if (isNaN(total) || total <= 0) return { error: 'Please enter a valid total word count greater than zero.' }

  for (const c of valid) {
    const p = parseFloat(c.pct)
    if (isNaN(p)) return { error: `"${c.name}" has an invalid percentage.` }
    if (p < 0) return { error: `"${c.name}" cannot have a negative percentage.` }
  }

  const totalPct = valid.reduce((s, c) => s + parseFloat(c.pct), 0)

  const breakdown = valid.map((c) => {
    const pct = parseFloat(c.pct)
    const words = Math.round((pct / 100) * total)
    return {
      name: c.name.trim(),
      pct,
      words,
      minWords: Math.round(words * (1 - TOLERANCE_PCT / 100)),
      maxWords: Math.round(words * (1 + TOLERANCE_PCT / 100)),
    }
  })

  return {
    breakdown,
    totalPct: +totalPct.toFixed(1),
    totalWords: total,
    totalMin: Math.round(total * (1 - TOLERANCE_PCT / 100)),
    totalMax: Math.round(total * (1 + TOLERANCE_PCT / 100)),
  }
}

// ─── Row factory ───────────────────────────────────────────────────────────────
let _id = 0
const makeRows = (chapters) => chapters.map((c) => ({ id: ++_id, name: c.name, pct: String(c.pct) }))

// ─── Component ────────────────────────────────────────────────────────────────
export default function DissertationWordCountCalculator() {
  const [totalWords, setTotalWords] = useState('12000')
  const [researchType, setResearchType] = useState('empirical')
  const [rows, setRows] = useState(makeRows(RESEARCH_TYPES.empirical.chapters))
  const [progressWords, setProgressWords] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const applyTemplate = (typeKey) => {
    setResearchType(typeKey)
    setRows(makeRows(RESEARCH_TYPES[typeKey].chapters))
    setResult(null)
    setError('')
  }

  const updateRow = useCallback((id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null); setError('')
  }, [])

  const addRow = () => setRows((p) => [...p, { id: ++_id, name: '', pct: '' }])
  const removeRow = (id) => { setRows((p) => p.filter((r) => r.id !== id)); setResult(null) }

  const calculate = () => {
    setError(''); setResult(null)
    const res = calcDissertationSplit(totalWords, rows)
    if (!res) { setError('Please enter at least one chapter with a name and percentage.'); return }
    if (res.error) { setError(res.error); return }
    if (res.totalPct > 100.5) { setError(`Chapter percentages sum to ${res.totalPct}% — they should not exceed 100%.`); return }
    setResult(res)
  }

  const reset = () => {
    setTotalWords('12000')
    applyTemplate('empirical')
    setProgressWords('')
  }

  const totalRowPct = rows.reduce((s, r) => s + (parseFloat(r.pct) || 0), 0)
  const progressPct = result && progressWords
    ? Math.min(100, (parseFloat(progressWords) / result.totalWords) * 100)
    : null

  return (
    <Layout>
      <Head>
        <title>Dissertation Word Count Calculator — Free Chapter Planner | ScholarTools</title>
        <meta
          name="description"
          content="Plan your dissertation or thesis word count by chapter instantly. Enter your total word limit and get a suggested breakdown per chapter with tolerance range."
        />
        <link rel="canonical" href="https://scholartools.co/dissertation-word-count-calculator" />
        <meta property="og:title" content="Dissertation Word Count Calculator | ScholarTools" />
        <meta
          property="og:description"
          content="Free dissertation word count calculator. Enter your total word limit to get a chapter-by-chapter breakdown with tolerance range, based on common academic structures."
        />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          {/* ── Header ── */}
          <div className="tool-header">
            <div className="tool-breadcrumb">
              <Link href="/">Home</Link> / Dissertation Word Count Calculator
            </div>
            <h1>📖 Dissertation Word Count Calculator</h1>
            <p>
              Enter your total dissertation word limit and choose a research structure to get a
              suggested word count per chapter — plus a tolerance range so you know exactly how
              much flexibility you have.
            </p>
          </div>

          <div className="card">
            {/* ── Total word count ── */}
            <div className="field">
              <label className="label">Total Word Limit</label>
              <input
                className="input" type="number" min="1" step="1" placeholder="e.g. 12000"
                value={totalWords}
                onChange={(e) => { setTotalWords(e.target.value); setResult(null) }}
              />
              <div className="text-muted" style={{ marginTop: 4 }}>
                Check your handbook — undergraduate dissertations are often 8,000–12,000 words; Master's 15,000–20,000; PhD theses 60,000–100,000.
              </div>
            </div>

            {/* ── Research type template selector ── */}
            <div className="field">
              <label className="label">Starting Structure</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                {Object.entries(RESEARCH_TYPES).map(([key, val]) => (
                  <button
                    key={key}
                    className={`btn btn-sm ${researchType === key ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => applyTemplate(key)}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
              <div className="text-muted" style={{ marginTop: 6 }}>
                Picking a structure fills in typical chapter percentages — fully editable below to match your own supervisor's requirements.
              </div>
            </div>

            {/* ── Chapter rows ── */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, padding: '0 4px', marginBottom: 8 }}>
                {['Chapter', 'Allocation (%)', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((row, idx) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <input
                      className="input" type="text" placeholder={`Chapter ${idx + 1}`}
                      value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                    />
                    <input
                      className="input" type="number" min="0" max="100" step="0.5" placeholder="0"
                      value={row.pct} onChange={(e) => updateRow(row.id, 'pct', e.target.value)}
                    />
                    {rows.length > 1 ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removeRow(row.id)} aria-label={`Remove chapter ${idx + 1}`}>✕</button>
                    ) : <span style={{ width: 32 }} />}
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addRow}>
                + Add Chapter
              </button>
            </div>

            {/* ── Allocation progress bar ── */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: totalRowPct > 100 ? '#DC2626' : 'var(--text-2)', marginBottom: 4 }}>
                <span>Chapters allocated</span>
                <span style={{ fontWeight: 600 }}>{totalRowPct.toFixed(1)}% / 100%</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(totalRowPct, 100)}%`, background: totalRowPct > 100 ? '#DC2626' : totalRowPct === 100 ? '#059669' : 'var(--accent)', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* ── Error ── */}
            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)',
                padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 14,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* ── Actions ── */}
            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate Chapter Breakdown →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {/* ── Results ── */}
            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Total headline */}
                <div style={{
                  background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)',
                  padding: 24, textAlign: 'center', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    Total Target
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>
                    {result.totalWords.toLocaleString()} words
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
                    Acceptable range: {result.totalMin.toLocaleString()} – {result.totalMax.toLocaleString()} words (±{TOLERANCE_PCT}% — check your own handbook, this is a common but not universal convention)
                  </div>
                </div>

                {/* Progress tracker (optional) */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 16 }}>
                  <label className="label" style={{ marginBottom: 8, display: 'block' }}>
                    Optional: track your current progress
                  </label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      className="input" type="number" min="0" placeholder="Words written so far"
                      style={{ maxWidth: 220 }}
                      value={progressWords}
                      onChange={(e) => setProgressWords(e.target.value)}
                    />
                    {progressPct !== null && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                        {progressPct.toFixed(1)}% of target complete
                      </span>
                    )}
                  </div>
                  {progressPct !== null && (
                    <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', marginTop: 10 }}>
                      <div style={{ height: '100%', width: `${progressPct}%`, background: '#059669', borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                  )}
                </div>

                {/* Chapter breakdown */}
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                    Suggested Words Per Chapter
                  </div>
                  {result.breakdown.map((c, i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      borderBottom: i < result.breakdown.length - 1 ? '1px solid var(--border)' : 'none',
                      background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.pct}% of total</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{c.words.toLocaleString()} words</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                            range: {c.minWords.toLocaleString()}–{c.maxWords.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── How it works ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 10 }}>How the Dissertation Word Count Calculator Works</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
              Most dissertation handbooks set a total word limit but leave chapter-by-chapter allocation up to the student. Without a plan, it is easy to over-write your literature review and leave too little room for discussion. This calculator takes your total limit and a chapter structure, then distributes the word count proportionally — with a standard ±10% tolerance range, a common (though not universal) convention at many universities for discretionary flexibility before formal permission is required.
            </p>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>Formula Used</div>
              <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)', lineHeight: 1.8 }}>
                Chapter Words = Total Word Limit × Chapter Allocation %<br />
                Tolerance Range = Chapter Words × (1 ± 10%)
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Worked Example</div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Chapter</th><th>Allocation</th><th>Target Words</th><th>Range (±10%)</th></tr></thead>
                <tbody>
                  {[
                    ['Introduction', '10%', '1,200', '1,080 – 1,320'],
                    ['Literature Review', '22%', '2,640', '2,376 – 2,904'],
                    ['Methodology', '15%', '1,800', '1,620 – 1,980'],
                  ].map(([name, pct, words, range]) => (
                    <tr key={name}><td style={{ fontSize: 13 }}>{name}</td><td style={{ fontSize: 13 }}>{pct}</td><td style={{ fontSize: 13, color: 'var(--accent)' }}>{words}</td><td style={{ fontSize: 13, color: 'var(--text-2)' }}>{range}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 8 }}>
              Based on a 12,000-word total using the Empirical/Quantitative template.
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>Frequently Asked Questions</h2>
            {[
              {
                q: 'Where does the ±10% tolerance range come from?',
                a: 'Many UK universities allow a discretionary 10% variance above or below the stated word limit before formal permission is required to exceed it — this is a common convention, not a universal rule. Always check your own department handbook, as tolerance policies vary by institution and some allow no variance at all.',
              },
              {
                q: 'Does the word count include references, footnotes, and appendices?',
                a: 'This varies significantly by university and department. Some count only the main body text; others include everything except appendices; some include footnotes but not the bibliography. Check your specific handbook — this calculator only allocates whatever total figure you enter, so make sure that figure matches your institution\'s definition.',
              },
              {
                q: 'Can I use this for a Master\'s dissertation or a PhD thesis?',
                a: 'Yes — the calculator works for any total word count. Undergraduate dissertations are typically 8,000–12,000 words, Master\'s dissertations 15,000–20,000, and PhD theses 60,000–100,000 depending on field and institution. Just enter your specific limit.',
              },
              {
                q: 'What if my supervisor wants a different chapter structure?',
                a: 'Use the "Start From Scratch" template, or start from any preset and simply rename chapters and adjust percentages — the calculator recalculates instantly as you edit, so you can match your supervisor\'s exact required structure.',
              },
              {
                q: 'Is this word allocation a strict rule I must follow?',
                a: 'No — these are suggested starting points based on common academic structures, not a requirement. Some sections naturally need more space depending on your topic and methodology. Use this as a planning guide, then adjust based on your supervisor\'s feedback.',
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
            <h2>Dissertation Word Count Calculator</h2>
            <p>
              This dissertation word count calculator helps students plan how to distribute their total word limit across chapters before they start writing. Rather than discovering halfway through that the literature review has eaten half the word budget, this tool lets you set a target allocation per chapter upfront — choosing from common academic structures for empirical, qualitative, or literature-review-only research, or building a fully custom structure from scratch.
            </p>
            <p>
              Each chapter's target comes with a tolerance range based on a widely-used ±10% discretionary convention found at many UK universities, giving you realistic flexibility rather than a rigid single number. An optional progress tracker lets you enter how many words you have written so far and see your percentage completion toward the overall target.
            </p>
            <p>
              Already writing and want to check your current draft's word count? Use our{' '}
              <a href="/word-counter">Word Counter</a> to count exactly how many words you have written. Planning a shorter piece instead?{' '}
              Try the <a href="/essay-word-count-calculator">Essay Word Count Calculator</a> for essay-length assignments, or use our{' '}
              <a href="/study-hours-planner">Study Hours Planner</a> to schedule your writing time.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
