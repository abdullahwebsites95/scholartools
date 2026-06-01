import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

export default function AttendanceCalculator() {
  const [mode, setMode] = useState('current')

  // Mode 1 state
  const [attended, setAttended] = useState('')
  const [total, setTotal] = useState('')
  const [result1, setResult1] = useState(null)
  const [error1, setError1] = useState('')

  // Mode 2 state
  const [currentPct, setCurrentPct] = useState('')
  const [totalHeld, setTotalHeld] = useState('')
  const [threshold, setThreshold] = useState('75')
  const [result2, setResult2] = useState(null)
  const [error2, setError2] = useState('')

  const calculate1 = () => {
    setError1('')
    setResult1(null)
    const a = parseFloat(attended)
    const t = parseFloat(total)

    if (isNaN(a) || isNaN(t) || attended === '' || total === '') { setError1('Please enter both values.'); return }
    if (a < 0 || t < 0) { setError1('Values cannot be negative.'); return }
    if (t === 0) { setError1('Total classes cannot be zero.'); return }
    if (a > t) { setError1('Classes attended cannot be more than total classes held.'); return }

    const pct = (a / t) * 100
    let status, color, bg, border, emoji, message

    if (pct >= 80) {
      status = 'Safe'; color = '#059669'; bg = '#ECFDF5'; border = '#059669'; emoji = '✅'
      const canMiss = Math.floor((pct - 75) / 100 * t)
      message = `You can afford to miss ${canMiss} more class${canMiss !== 1 ? 'es' : ''} and still stay above 75%.`
    } else if (pct >= 75) {
      status = 'Warning'; color = '#D97706'; bg = '#FFF7ED'; border = '#D97706'; emoji = '⚠️'
      message = `You are just above the 75% threshold. Attend all upcoming classes to stay safe.`
    } else {
      status = 'Below Threshold'; color = '#DC2626'; bg = '#FEF2F2'; border = '#DC2626'; emoji = '🚨'
      const needToAttend = Math.ceil((0.75 * t - a) / (1 - 0.75))
      message = `You need to attend ${needToAttend} consecutive class${needToAttend !== 1 ? 'es' : ''} without missing any to recover to 75%.`
    }

    setResult1({ pct: pct.toFixed(1), status, color, bg, border, emoji, message, a, t })
  }

  const calculate2 = () => {
    setError2('')
    setResult2(null)
    const pct = parseFloat(currentPct)
    const t = parseFloat(totalHeld)
    const thr = parseFloat(threshold)

    if (isNaN(pct) || isNaN(t) || isNaN(thr) || currentPct === '' || totalHeld === '' || threshold === '') { setError2('Please fill in all fields.'); return }
    if (pct < 0 || pct > 100) { setError2('Attendance percentage must be between 0 and 100.'); return }
    if (t <= 0) { setError2('Total classes held must be greater than zero.'); return }
    if (thr <= 0 || thr >= 100) { setError2('Threshold must be between 1 and 99%.'); return }

    const attended = Math.round((pct / 100) * t)
    const thrDecimal = thr / 100

    if (pct >= thr) {
      // How many can they miss
      // After missing x classes: attended / (t + x) >= thrDecimal
      // attended >= thrDecimal * (t + x)
      // attended / thrDecimal - t >= x
      const canMiss = Math.floor(attended / thrDecimal - t)
      const missable = Math.max(0, canMiss)
      const safeUntil = t + missable

      setResult2({
        mode: 'safe',
        canMiss: missable,
        attended,
        currentPct: pct.toFixed(1),
        thr,
        t,
        safeUntil,
        color: missable === 0 ? '#D97706' : '#059669',
        bg: missable === 0 ? '#FFF7ED' : '#ECFDF5',
        emoji: missable === 0 ? '⚠️' : '✅'
      })
    } else {
      // Need to recover — how many consecutive to attend
      // (attended + x) / (t + x) >= thrDecimal
      // attended + x >= thrDecimal * t + thrDecimal * x
      // x(1 - thrDecimal) >= thrDecimal * t - attended
      // x >= (thrDecimal * t - attended) / (1 - thrDecimal)
      const needed = Math.ceil((thrDecimal * t - attended) / (1 - thrDecimal))

      setResult2({
        mode: 'recover',
        needed,
        attended,
        currentPct: pct.toFixed(1),
        thr,
        t,
        afterAttending: t + needed,
        color: '#DC2626',
        bg: '#FEF2F2',
        emoji: '🚨'
      })
    }
  }

  const reset = () => {
    setAttended(''); setTotal(''); setResult1(null); setError1('')
    setCurrentPct(''); setTotalHeld(''); setThreshold('75'); setResult2(null); setError2('')
  }

  return (
    <Layout>
      <Head>
        <title>Attendance Calculator — Free Class Attendance Tracker | ScholarTools</title>
        <meta name="description" content="Free attendance calculator. Check your attendance percentage and find out how many classes you can miss before falling below the 75% threshold." />
        <link rel="canonical" href="https://scholartools.co/attendance-calculator" />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Attendance Calculator</div>
            <h1>📋 Attendance Calculator</h1>
            <p>Check your current attendance percentage or find out exactly how many classes you can miss — or need to attend to recover.</p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              className={`btn ${mode === 'current' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => { setMode('current'); reset() }}
            >
              📊 Check Attendance
            </button>
            <button
              className={`btn ${mode === 'miss' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => { setMode('miss'); reset() }}
            >
              🗓️ Classes I Can Miss
            </button>
          </div>

          {/* MODE 1 — Current Attendance */}
          {mode === 'current' && (
            <div className="card">
              <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Check Your Current Attendance</h2>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Enter your classes attended and total classes held to see your attendance percentage and status.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="field">
                  <label className="label">Classes Attended</label>
                  <input className="input" type="number" min="0" placeholder="e.g. 38"
                    value={attended} onChange={e => { setAttended(e.target.value); setResult1(null); setError1('') }} />
                </div>
                <div className="field">
                  <label className="label">Total Classes Held</label>
                  <input className="input" type="number" min="1" placeholder="e.g. 50"
                    value={total} onChange={e => { setTotal(e.target.value); setResult1(null); setError1('') }} />
                </div>
              </div>

              {error1 && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                  {error1}
                </div>
              )}

              <div className="btn-group">
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate1}>Calculate Attendance →</button>
                <button className="btn btn-secondary" onClick={reset}>Reset</button>
              </div>

              {result1 && (
                <div style={{ marginTop: 24 }}>
                  {/* Big percentage display */}
                  <div style={{ background: result1.bg, border: `2px solid ${result1.border}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: result1.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your Attendance</div>
                    <div style={{ fontSize: 64, fontWeight: 800, color: result1.color, lineHeight: 1 }}>{result1.pct}%</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: result1.color, marginTop: 8 }}>{result1.emoji} {result1.status}</div>

                    {/* Visual bar */}
                    <div style={{ margin: '16px auto 0', maxWidth: 380 }}>
                      <div style={{ height: 12, background: 'linear-gradient(to right, #DC2626 0%, #DC2626 75%, #D97706 75%, #D97706 80%, #059669 80%, #059669 100%)', borderRadius: 6, position: 'relative' }}>
                        <div style={{
                          position: 'absolute', top: -5,
                          left: `${Math.min(98, parseFloat(result1.pct))}%`,
                          transform: 'translateX(-50%)',
                          width: 22, height: 22, borderRadius: '50%',
                          background: result1.color,
                          border: '3px solid white',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-2)', marginTop: 5 }}>
                        <span>0%</span>
                        <span style={{ color: '#DC2626', fontWeight: 600 }}>75% min</span>
                        <span style={{ color: '#D97706', fontWeight: 600 }}>80%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-grid">
                    <div className="stat-box">
                      <div className="stat-val">{result1.a}</div>
                      <div className="stat-lbl">Classes Attended</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-val">{result1.t}</div>
                      <div className="stat-lbl">Total Classes</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-val">{result1.t - result1.a}</div>
                      <div className="stat-lbl">Classes Missed</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14, background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                    💡 {result1.message}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2 — Miss Mode */}
          {mode === 'miss' && (
            <div className="card">
              <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>How Many Classes Can I Miss?</h2>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Enter your current attendance and we will tell you exactly how many more classes you can skip — or how many you need to attend to recover.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                <div className="field">
                  <label className="label">Current Attendance (%)</label>
                  <input className="input" type="number" min="0" max="100" placeholder="e.g. 82"
                    value={currentPct} onChange={e => { setCurrentPct(e.target.value); setResult2(null); setError2('') }} />
                </div>
                <div className="field">
                  <label className="label">Total Classes Held So Far</label>
                  <input className="input" type="number" min="1" placeholder="e.g. 60"
                    value={totalHeld} onChange={e => { setTotalHeld(e.target.value); setResult2(null); setError2('') }} />
                </div>
                <div className="field">
                  <label className="label">Required Minimum (%)</label>
                  <input className="input" type="number" min="1" max="99" placeholder="75"
                    value={threshold} onChange={e => { setThreshold(e.target.value); setResult2(null); setError2('') }} />
                  <div className="text-muted" style={{ marginTop: 5 }}>Default is 75% — change if your institution requires different</div>
                </div>
              </div>

              {error2 && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                  {error2}
                </div>
              )}

              <div className="btn-group">
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate2}>Calculate →</button>
                <button className="btn btn-secondary" onClick={reset}>Reset</button>
              </div>

              {result2 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ background: result2.bg, border: `2px solid ${result2.color}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                    {result2.mode === 'safe' ? (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 600, color: result2.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Classes You Can Still Miss</div>
                        <div style={{ fontSize: 64, fontWeight: 800, color: result2.color, lineHeight: 1 }}>
                          {result2.canMiss}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: result2.color, marginTop: 8 }}>
                          {result2.emoji} {result2.canMiss === 0 ? 'Cannot Miss Any More' : `Class${result2.canMiss !== 1 ? 'es' : ''} Remaining`}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.6 }}>
                          {result2.canMiss === 0
                            ? `You are right at the ${result2.thr}% threshold. Do not miss another class.`
                            : `You can miss ${result2.canMiss} more class${result2.canMiss !== 1 ? 'es' : ''} and stay above ${result2.thr}%. After that your attendance drops below the required minimum.`
                          }
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 600, color: result2.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Consecutive Classes to Attend</div>
                        <div style={{ fontSize: 64, fontWeight: 800, color: result2.color, lineHeight: 1 }}>
                          {result2.needed}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: result2.color, marginTop: 8 }}>
                          {result2.emoji} Recovery Required
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.6 }}>
                          You must attend {result2.needed} consecutive classes without missing a single one to recover your attendance above {result2.thr}%.
                        </div>
                      </>
                    )}
                  </div>

                  <div className="stat-grid">
                    <div className="stat-box">
                      <div className="stat-val">{result2.currentPct}%</div>
                      <div className="stat-lbl">Current Attendance</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-val">{result2.attended}</div>
                      <div className="stat-lbl">Classes Attended</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-val">{result2.thr}%</div>
                      <div className="stat-lbl">Required Minimum</div>
                    </div>
                    {result2.mode === 'safe' && (
                      <div className="stat-box">
                        <div className="stat-val">{result2.safeUntil}</div>
                        <div className="stat-lbl">Safe up to total classes</div>
                      </div>
                    )}
                    {result2.mode === 'recover' && (
                      <div className="stat-box">
                        <div className="stat-val">{result2.afterAttending}</div>
                        <div className="stat-lbl">Total classes after recovery</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status reference card */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 16, marginBottom: 12 }}>Attendance Status Reference</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #059669', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, color: '#059669', fontSize: 16, marginBottom: 4 }}>✅ 80% and above</div>
                <div style={{ fontSize: 12, color: '#065F46', lineHeight: 1.5 }}>Safe zone. You have a comfortable buffer and can afford to miss a few classes without risking your minimum requirement.</div>
              </div>
              <div style={{ background: '#FFF7ED', border: '1px solid #D97706', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, color: '#D97706', fontSize: 16, marginBottom: 4 }}>⚠️ 75% to 79%</div>
                <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>Warning zone. You meet the minimum but have very little room. Missing even one or two classes could drop you below the threshold.</div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #DC2626', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, color: '#DC2626', fontSize: 16, marginBottom: 4 }}>🚨 Below 75%</div>
                <div style={{ fontSize: 12, color: '#991B1B', lineHeight: 1.5 }}>Danger zone. You are below the standard minimum attendance requirement. Many universities will bar you from exams at this level.</div>
              </div>
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>Attendance Calculator — Check Your Class Attendance</h2>
            <p>This free attendance calculator helps students instantly check their attendance percentage and find out how many classes they can miss before falling below the required minimum. Most universities in Pakistan, India, the UK, and globally require a minimum of 75% attendance to sit final exams. Falling below this threshold can result in being barred from examinations — regardless of academic performance.</p>
            <p>Use the Miss Mode to plan ahead. If you know you need to miss upcoming classes for travel, illness, or other reasons, enter your current attendance to see exactly how much flexibility you have left in the semester.</p>
            <p>Also try our <a href="/grade-calculator">Grade Needed Calculator</a> to find out what score you need on your final exam, or use our <a href="/study-hours-planner">Study Hours Planner</a> to make the most of the classes you do attend.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
