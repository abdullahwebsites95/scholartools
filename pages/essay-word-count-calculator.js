import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

// ─── Pure calculation logic (separate from UI) ────────────────────────────────

// Standard essay structure ratios (widely-taught academic writing convention —
// Introduction and Conclusion each get a smaller fixed share, remainder goes to
// the body, split evenly across however many body paragraphs the user specifies).
const DEFAULT_INTRO_PCT = 10
const DEFAULT_CONCLUSION_PCT = 10

/**
 * Calculate essay word allocation.
 * introPct + conclusionPct must not exceed 100; remainder is the body,
 * split evenly across bodyParagraphs.
 */
function calcEssaySplit(totalWords, introPct, conclusionPct, bodyParagraphs) {
  const total = parseFloat(totalWords)
  const intro = parseFloat(introPct)
  const conclusion = parseFloat(conclusionPct)
  const paragraphs = parseInt(bodyParagraphs)

  if (isNaN(total) || total <= 0) return { error: 'Please enter a valid total word count greater than zero.' }
  if (isNaN(intro) || intro < 0) return { error: 'Introduction percentage must be zero or greater.' }
  if (isNaN(conclusion) || conclusion < 0) return { error: 'Conclusion percentage must be zero or greater.' }
  if (isNaN(paragraphs) || paragraphs < 1) return { error: 'You need at least one body paragraph.' }
  if (intro + conclusion >= 100) return { error: 'Introduction and Conclusion percentages together must be less than 100%.' }

  const bodyPct = 100 - intro - conclusion
  const introWords = Math.round((intro / 100) * total)
  const conclusionWords = Math.round((conclusion / 100) * total)
  const bodyWords = Math.round((bodyPct / 100) * total)
  const perParagraphWords = Math.round(bodyWords / paragraphs)

  return {
    total,
    introPct: intro,
    conclusionPct: conclusion,
    bodyPct: +bodyPct.toFixed(1),
    introWords,
    conclusionWords,
    bodyWords,
    paragraphs,
    perParagraphWords,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EssayWordCountCalculator() {
  const [totalWords, setTotalWords] = useState('1500')
  const [introPct, setIntroPct] = useState(String(DEFAULT_INTRO_PCT))
  const [conclusionPct, setConclusionPct] = useState(String(DEFAULT_CONCLUSION_PCT))
  const [bodyParagraphs, setBodyParagraphs] = useState('4')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError(''); setResult(null)
    const res = calcEssaySplit(totalWords, introPct, conclusionPct, bodyParagraphs)
    if (res.error) { setError(res.error); return }
    setResult(res)
  }

  const reset = () => {
    setTotalWords('1500')
    setIntroPct(String(DEFAULT_INTRO_PCT))
    setConclusionPct(String(DEFAULT_CONCLUSION_PCT))
    setBodyParagraphs('4')
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>Essay Word Count Calculator — Free Section & Paragraph Planner | ScholarTools</title>
        <meta
          name="description"
          content="Plan your essay word count by section instantly. Enter your total word limit and get suggested words for introduction, each body paragraph, and conclusion."
        />
        <link rel="canonical" href="https://scholartools.co/essay-word-count-calculator" />
        <meta property="og:title" content="Essay Word Count Calculator | ScholarTools" />
        <meta
          property="og:description"
          content="Free essay word count calculator. Enter your total word limit and paragraph count to get a suggested breakdown for introduction, body paragraphs, and conclusion."
        />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          {/* ── Header ── */}
          <div className="tool-header">
            <div className="tool-breadcrumb">
              <Link href="/">Home</Link> / Essay Word Count Calculator
            </div>
            <h1>✍️ Essay Word Count Calculator</h1>
            <p>
              Enter your total word limit and how many body paragraphs you plan to write.
              Get a suggested word count for your introduction, each body paragraph, and
              your conclusion — so you never run out of words too early.
            </p>
          </div>

          <div className="card">
            {/* ── Total word count ── */}
            <div className="field">
              <label className="label">Total Word Limit</label>
              <input
                className="input" type="number" min="1" step="1" placeholder="e.g. 1500"
                value={totalWords}
                onChange={(e) => { setTotalWords(e.target.value); setResult(null) }}
              />
              <div className="text-muted" style={{ marginTop: 4 }}>
                Standard essays are often 500–2,000 words; check your assignment brief for the exact limit.
              </div>
            </div>

            {/* ── Structure percentages ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              <div className="field">
                <label className="label">Introduction (%)</label>
                <input
                  className="input" type="number" min="0" max="100" step="1"
                  value={introPct}
                  onChange={(e) => { setIntroPct(e.target.value); setResult(null) }}
                />
              </div>
              <div className="field">
                <label className="label">Conclusion (%)</label>
                <input
                  className="input" type="number" min="0" max="100" step="1"
                  value={conclusionPct}
                  onChange={(e) => { setConclusionPct(e.target.value); setResult(null) }}
                />
              </div>
              <div className="field">
                <label className="label">Number of Body Paragraphs</label>
                <input
                  className="input" type="number" min="1" step="1" placeholder="e.g. 4"
                  value={bodyParagraphs}
                  onChange={(e) => { setBodyParagraphs(e.target.value); setResult(null) }}
                />
              </div>
            </div>

            <div className="text-muted" style={{ marginTop: 8 }}>
              Default 10% / 10% is a common starting point for introduction and conclusion — adjust to match your own assignment guidance. The remaining percentage is split evenly across your body paragraphs.
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
                Calculate Section Breakdown →
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
                    Total Essay Length
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>
                    {result.total.toLocaleString()} words
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
                    {result.paragraphs} body paragraph{result.paragraphs > 1 ? 's' : ''} + introduction + conclusion
                  </div>
                </div>

                {/* Per-paragraph highlight */}
                <div style={{
                  background: '#ECFDF5', border: '1.5px solid #059669', borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px', textAlign: 'center', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                    Target Per Body Paragraph
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#059669' }}>
                    ~{result.perParagraphWords.toLocaleString()} words
                  </div>
                </div>

                {/* Section breakdown */}
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                    Full Section Breakdown
                  </div>
                  {[
                    { name: 'Introduction', pct: result.introPct, words: result.introWords },
                    { name: `Body (${result.paragraphs} paragraph${result.paragraphs > 1 ? 's' : ''})`, pct: result.bodyPct, words: result.bodyWords },
                    { name: 'Conclusion', pct: result.conclusionPct, words: result.conclusionWords },
                  ].map((s, i, arr) => (
                    <div key={s.name} style={{
                      padding: '12px 16px',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.pct}% of total</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{s.words.toLocaleString()} words</div>
                      </div>
                    </div>
                  ))}

                  {/* Individual body paragraphs listed out */}
                  {Array.from({ length: result.paragraphs }, (_, i) => (
                    <div key={`p${i}`} style={{
                      padding: '8px 16px 8px 32px',
                      borderBottom: i < result.paragraphs - 1 ? '1px solid var(--border)' : 'none',
                      background: 'var(--bg)',
                      display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)',
                    }}>
                      <span>↳ Body Paragraph {i + 1}</span>
                      <span style={{ fontWeight: 600 }}>~{result.perParagraphWords.toLocaleString()} words</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── How it works ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 10 }}>How the Essay Word Count Calculator Works</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
              A common cause of unbalanced essays is writing an introduction that is too long, leaving too few words for the body paragraphs that actually develop your argument. This calculator reserves a set percentage for your introduction and conclusion, then splits the remaining words evenly across however many body paragraphs you plan to write.
            </p>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>Formula Used</div>
              <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)', lineHeight: 1.8 }}>
                Body % = 100% − Introduction % − Conclusion %<br />
                Words Per Paragraph = (Total Words × Body %) ÷ Number of Body Paragraphs
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Worked Example</div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Section</th><th>Allocation</th><th>Words</th></tr></thead>
                <tbody>
                  {[
                    ['Introduction', '10%', '150'],
                    ['Body (4 paragraphs)', '80%', '1,200 total → 300 per paragraph'],
                    ['Conclusion', '10%', '150'],
                  ].map(([name, pct, words]) => (
                    <tr key={name}><td style={{ fontSize: 13 }}>{name}</td><td style={{ fontSize: 13 }}>{pct}</td><td style={{ fontSize: 13, color: 'var(--accent)' }}>{words}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 8 }}>
              Based on a 1,500-word essay with default 10%/10% intro/conclusion split.
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>Frequently Asked Questions</h2>
            {[
              {
                q: 'Why 10% for introduction and conclusion by default?',
                a: 'A roughly 10% introduction and 10% conclusion is a common starting convention in academic writing guidance, leaving 80% of your word count for the body where your argument is actually developed. This is a suggested starting point, not a fixed rule — adjust the percentages to match your own assignment brief or tutor\'s guidance.',
              },
              {
                q: 'What if my essay does not use a fixed number of body paragraphs?',
                a: 'Enter your best estimate of how many body paragraphs you plan to write. You can always recalculate with a different number as your outline develops — the tool is meant for planning before you write, not a rule you must strictly follow.',
              },
              {
                q: 'Does the word count include the title or reference list?',
                a: 'This varies by institution and assignment type. Some word limits include only the main body text; others include headings but exclude references. Check your assignment brief for the exact definition, then enter that same total word figure here.',
              },
              {
                q: 'Should every body paragraph be exactly the same length?',
                a: 'Not necessarily — this calculator gives you an even split as a planning baseline. In practice some paragraphs may naturally need more space than others depending on the complexity of the point being made. Use the suggested figure as a guide, not an exact requirement.',
              },
              {
                q: 'How is this different from the Dissertation Word Count Calculator?',
                a: 'The Dissertation Word Count Calculator is built for much longer academic work with multiple named chapters (Introduction, Literature Review, Methodology, Results, Discussion, Conclusion) and includes a tolerance range. This Essay Word Count Calculator is built for shorter essays using the simpler three-part introduction/body/conclusion structure, with an added breakdown per individual body paragraph.',
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
            <h2>Essay Word Count Calculator</h2>
            <p>
              This essay word count calculator helps students plan how many words to spend on each section of an essay before they start writing. Given a total word limit, it reserves a percentage for the introduction and conclusion, then splits the remaining word count evenly across however many body paragraphs you specify — giving you a clear per-paragraph target rather than guessing as you go.
            </p>
            <p>
              Balanced essays typically spend roughly 10% on the introduction, 10% on the conclusion, and the remaining 80% developing the argument across body paragraphs. These percentages are fully adjustable to match your own assignment brief or tutor's specific guidance, and the calculator instantly recalculates as you change the total word count, section percentages, or number of paragraphs.
            </p>
            <p>
              Working on a longer piece instead? Use our{' '}
              <a href="/dissertation-word-count-calculator">Dissertation Word Count Calculator</a> for multi-chapter academic writing. Already have a draft?{' '}
              Check your current length with the <a href="/word-counter">Word Counter</a>, or estimate your reading time with the{' '}
              <a href="/reading-time">Reading Time Estimator</a>.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
