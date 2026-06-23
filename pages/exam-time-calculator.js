import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const emptySection = () => ({ id: Date.now() + Math.random(), name: '', marks: '', questions: '1' })

export default function ExamTimeAllocator() {
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [buffer, setBuffer] = useState('10')
  const [mode, setMode] = useState('sections') // sections or mcq
  const [sections, setSections] = useState([emptySection(), emptySection(), emptySection()])
  const [mcqCount, setMcqCount] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const totalMins = (parseFloat(hours) || 0) * 60 + (parseFloat(minutes) || 0)
  const bufferMins = Math.round(totalMins * (parseFloat(buffer) || 0) / 100)
  const workingMins = totalMins - bufferMins

  const addSection = () => setSections(s => [...s, emptySection()])
  const removeSection = id => setSections(s => s.filter(x => x.id !== id))
  const updateSection = (id, field, val) => setSections(s => s.map(x => x.id === id ? { ...x, [field]: val } : x))

  const calculate = () => {
    setError('')
    setResult(null)

    if (!hours && !minutes) { setError('Please enter total exam duration.'); return }
    if (totalMins <= 0) { setError('Exam duration must be greater than zero.'); return }

    if (mode === 'mcq') {
      const count = parseInt(mcqCount)
      if (!count || count <= 0) { setError('Please enter the number of MCQ questions.'); return }
      const secsPerQ = (workingMins * 60) / count
      const minsPerQ = workingMins / count
      setResult({
        mode: 'mcq',
        totalMins,
        bufferMins,
        workingMins,
        count,
        secsPerQ: secsPerQ.toFixed(0),
        minsPerQ: minsPerQ.toFixed(2),
        finishBy: workingMins,
        warning: secsPerQ < 45,
      })
      return
    }

    const valid = sections.filter(s => s.name.trim() && s.marks)
    if (valid.length === 0) { setError('Please fill in at least one section.'); return }

    const totalMarks = valid.reduce((sum, s) => sum + (parseFloat(s.marks) || 0), 0)
    if (totalMarks === 0) { setError('Total marks must be greater than zero.'); return }

    const sectionResults = valid.map(s => {
      const marks = parseFloat(s.marks) || 0
      const questions = parseInt(s.questions) || 1
      const timeAlloc = (marks / totalMarks) * workingMins
      const timePerQ = timeAlloc / questions
      const minsPerMark = timeAlloc / marks
      return {
        ...s,
        marks,
        questions,
        timeAlloc: timeAlloc.toFixed(1),
        timePerQ: timePerQ.toFixed(1),
        minsPerMark: minsPerMark.toFixed(2),
        pct: ((marks / totalMarks) * 100).toFixed(0),
        warning: timePerQ < 1,
      }
    })

    setResult({
      mode: 'sections',
      totalMins,
      bufferMins,
      workingMins,
      totalMarks,
      sections: sectionResults,
    })
  }

  const reset = () => {
    setHours(''); setMinutes(''); setBuffer('10')
    setSections([emptySection(), emptySection(), emptySection()])
    setMcqCount(''); setResult(null); setError('')
  }

  const fmtTime = (mins) => {
    const m = Math.floor(mins)
    const s = Math.round((parseFloat(mins) - m) * 60)
    if (s === 0) return `${m} min`
    return `${m} min ${s} sec`
  }

  return (
    <Layout>
      <Head>
        <title>Exam Time Calculator — Free Time Allocation Tool for Students | ScholarTools</title>
        <meta name="description" content="Calculate how much time to spend on each exam section or question. Free exam time allocator for students. Works for MCQ, essay and mixed exams." />
        <link rel="canonical" href="https://scholartools.co/exam-time-calculator" />
        <meta property="og:title" content="Exam Time Calculator | ScholarTools" />
        <meta property="og:description" content="Free exam time allocator. Enter your exam duration and section marks to get recommended minutes per question. Works for MCQ and structured exams." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Exam Time Calculator</div>
            <h1>⏰ Exam Time Calculator</h1>
            <p>Enter your exam duration and section marks to get a precise time allocation per section and per question. Never run out of time in an exam again.</p>
          </div>

          <div className="card">
            {/* Duration */}
            <div className="field">
              <label className="label">Total Exam Duration</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input className="input" type="number" min="0" max="12" placeholder="0"
                    style={{ width: 80 }} value={hours} onChange={e => { setHours(e.target.value); setResult(null) }} />
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input className="input" type="number" min="0" max="59" placeholder="0"
                    style={{ width: 80 }} value={minutes} onChange={e => { setMinutes(e.target.value); setResult(null) }} />
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>minutes</span>
                </div>
                {totalMins > 0 && (
                  <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>= {totalMins} minutes total</span>
                )}
              </div>
            </div>

            {/* Buffer */}
            <div className="field">
              <label className="label">Review Buffer</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['5', '10', '15', '20'].map(b => (
                  <button key={b}
                    className={`btn btn-sm ${buffer === b ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setBuffer(b); setResult(null) }}>
                    {b}% ({totalMins > 0 ? Math.round(totalMins * parseInt(b) / 100) : '—'} min)
                  </button>
                ))}
              </div>
              <div className="text-muted" style={{ marginTop: 6 }}>Time held back at the end for reviewing answers. 10% recommended.</div>
            </div>

            {totalMins > 0 && (
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
                Working time: <strong style={{ color: 'var(--accent)' }}>{workingMins} minutes</strong> — Buffer: <strong>{bufferMins} minutes</strong> for review
              </div>
            )}

            {/* Mode */}
            <div className="field">
              <label className="label">Exam Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className={`btn ${mode === 'sections' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setMode('sections'); setResult(null) }}>
                  📝 Sections / Essays
                </button>
                <button className={`btn ${mode === 'mcq' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setMode('mcq'); setResult(null) }}>
                  🔘 MCQ Only
                </button>
              </div>
            </div>

            {/* Sections Mode */}
            {mode === 'sections' && (
              <div>
                <label className="label">Exam Sections</label>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, padding: '0 4px' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Section Name</span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Marks</span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase' }}>Questions</span>
                  <span></span>
                </div>
                {sections.map(s => (
                  <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input className="input" placeholder="e.g. Essay Section"
                      value={s.name} onChange={e => updateSection(s.id, 'name', e.target.value)} />
                    <input className="input" type="number" min="0" placeholder="e.g. 40"
                      value={s.marks} onChange={e => updateSection(s.id, 'marks', e.target.value)} />
                    <input className="input" type="number" min="1" placeholder="1"
                      value={s.questions} onChange={e => updateSection(s.id, 'questions', e.target.value)} />
                    {sections.length > 1 && (
                      <button className="btn btn-danger btn-sm" onClick={() => removeSection(s.id)}>✕</button>
                    )}
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 4 }} onClick={addSection}>
                  + Add Section
                </button>
              </div>
            )}

            {/* MCQ Mode */}
            {mode === 'mcq' && (
              <div className="field">
                <label className="label">Number of MCQ Questions</label>
                <input className="input" type="number" min="1" placeholder="e.g. 80"
                  value={mcqCount} onChange={e => { setMcqCount(e.target.value); setResult(null) }} />
              </div>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Allocate My Time →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Summary stats */}
                <div className="stat-grid" style={{ marginBottom: 16 }}>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: 'var(--accent)' }}>{result.totalMins}</div>
                    <div className="stat-lbl">Total Minutes</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669' }}>{result.workingMins}</div>
                    <div className="stat-lbl">Working Minutes</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#D97706' }}>{result.bufferMins}</div>
                    <div className="stat-lbl">Review Buffer</div>
                  </div>
                </div>

                {result.mode === 'mcq' && (
                  <div>
                    <div style={{ background: result.warning ? '#FEF2F2' : '#ECFDF5', border: `2px solid ${result.warning ? '#DC2626' : '#059669'}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: result.warning ? '#DC2626' : '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Time Per Question</div>
                      <div style={{ fontSize: 56, fontWeight: 800, color: result.warning ? '#DC2626' : '#059669', lineHeight: 1 }}>{result.secsPerQ}s</div>
                      <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 8 }}>({result.minsPerQ} minutes per question)</div>
                      {result.warning && (
                        <div style={{ marginTop: 10, fontSize: 13, color: '#DC2626', fontWeight: 500 }}>⚠️ Less than 45 seconds per question is very tight. Consider asking your instructor about the time allocation.</div>
                      )}
                    </div>
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                      📋 <strong>Strategy:</strong> With {result.count} MCQs in {result.workingMins} minutes, aim to finish question {Math.round(result.count * 0.5)} by the {Math.round(result.workingMins * 0.5)}-minute mark and question {Math.round(result.count * 0.75)} by the {Math.round(result.workingMins * 0.75)}-minute mark. Use remaining {result.bufferMins} minutes to review flagged questions.
                    </div>
                  </div>
                )}

                {result.mode === 'sections' && (
                  <div>
                    <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                        Your Time Allocation Plan
                      </div>
                      {result.sections.map((s, i) => (
                        <div key={s.id} style={{ padding: '14px 16px', borderBottom: i < result.sections.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name || `Section ${i + 1}`}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.marks} marks · {s.questions} question{parseInt(s.questions) > 1 ? 's' : ''} · {s.pct}% of paper</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 22, fontWeight: 700, color: s.warning ? '#DC2626' : 'var(--accent)' }}>{fmtTime(s.timeAlloc)}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{fmtTime(s.timePerQ)} per question</div>
                            </div>
                          </div>
                          <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${s.pct}%`, background: s.warning ? '#DC2626' : 'var(--accent)', borderRadius: 3 }} />
                          </div>
                          {s.warning && (
                            <div style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>⚠️ Less than 1 minute per question — very tight for this section</div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 14, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                      📋 <strong>Exam strategy:</strong> Start with the section you are most confident in. Keep an eye on the time at each section boundary. If a section is taking longer than allocated, move on and return later. Use your {result.bufferMins} minute buffer at the end to revisit difficult questions.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>Exam Time Calculator — How to Manage Time in Exams</h2>
            <p>This exam time calculator helps students plan exactly how many minutes to spend on each section or question during an exam. Effective time management in exams is one of the most important skills for maximising your score — students who run out of time on final sections often lose marks they could easily have earned with better planning.</p>
            <p>The recommended approach is to hold back 10% of your exam time as a review buffer, then allocate the remaining time proportionally based on marks. A section worth 40 out of 100 marks should receive 40% of your working time. This tool automates that calculation instantly for any exam format — whether MCQ, essay, or mixed section papers.</p>
            <p>Also use our <a href="/study-hours-planner">Study Hours Planner</a> to prepare effectively before the exam, or check our <a href="/attendance-calculator">Attendance Calculator</a> to make sure you are eligible to sit.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
