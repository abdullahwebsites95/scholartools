import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const emptySubject = () => ({ id: Date.now() + Math.random(), name: '', difficulty: 'medium', weight: '1' })

const difficultyLabels = { easy: { label: 'Easy', color: '#059669', multiplier: 0.7 }, medium: { label: 'Medium', color: '#D97706', multiplier: 1 }, hard: { label: 'Hard', color: '#DC2626', multiplier: 1.4 } }

export default function StudyHoursPlanner() {
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState('4')
  const [subjects, setSubjects] = useState([emptySubject(), emptySubject(), emptySubject()])
  const [plan, setPlan] = useState(null)

  const updateSubject = (id, field, val) => setSubjects(s => s.map(x => x.id === id ? { ...x, [field]: val } : x))
  const addSubject = () => setSubjects(s => [...s, emptySubject()])
  const removeSubject = id => setSubjects(s => s.filter(x => x.id !== id))

  const calculate = () => {
    const today = new Date()
    const exam = new Date(examDate)
    if (!examDate || exam <= today) return
    const daysLeft = Math.floor((exam - today) / 86400000)
    const totalHours = daysLeft * parseFloat(hoursPerDay)
    const validSubjects = subjects.filter(s => s.name.trim())
    if (!validSubjects.length) return

    const totalWeight = validSubjects.reduce((sum, s) => sum + (parseFloat(s.weight) || 1) * difficultyLabels[s.difficulty].multiplier, 0)
    const result = validSubjects.map(s => {
      const w = (parseFloat(s.weight) || 1) * difficultyLabels[s.difficulty].multiplier
      const hrs = (w / totalWeight) * totalHours
      return { ...s, hours: hrs.toFixed(1), perDay: (hrs / daysLeft).toFixed(1) }
    })
    setPlan({ daysLeft, totalHours: totalHours.toFixed(0), subjects: result })
  }

  return (
    <Layout>
      <Head>
        <title>Study Hours Planner — Free Exam Study Schedule | ScholarTools</title>
        <meta name="description" content="Plan your study hours for exams. Enter your subjects and exam date and get a personalised daily study schedule. Free study planner for students." />
        <link rel="canonical" href="https://scholartools.co/study-hours-planner" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Study Hours Planner</div>
            <h1>📚 Study Hours Planner</h1>
            <p>Enter your exam date, subjects, and available hours per day. Get a personalised study schedule that tells you exactly how much time to give each subject.</p>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div className="field">
                <label className="label">Exam Date</label>
                <input className="input" type="date" value={examDate} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setExamDate(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Study Hours Available Per Day</label>
                <input className="input" type="number" min="1" max="16" placeholder="e.g. 4"
                  value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} />
              </div>
            </div>

            <label className="label">Your Subjects</label>
            {subjects.map(s => (
              <div key={s.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input className="input" style={{ flex: 2, minWidth: 140 }} placeholder="Subject name e.g. Mathematics"
                  value={s.name} onChange={e => updateSubject(s.id, 'name', e.target.value)} />
                <select className="select" style={{ flex: 1, minWidth: 120 }} value={s.difficulty}
                  onChange={e => updateSubject(s.id, 'difficulty', e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 100 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>Priority</label>
                  <input className="input" type="number" min="1" max="5" style={{ width: 60 }}
                    value={s.weight} onChange={e => updateSubject(s.id, 'weight', e.target.value)} />
                </div>
                {subjects.length > 1 && (
                  <button className="btn btn-danger btn-sm" onClick={() => removeSubject(s.id)}>✕</button>
                )}
              </div>
            ))}

            <div className="btn-group" style={{ marginTop: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={addSubject}>+ Add Subject</button>
              <button className="btn btn-primary" onClick={calculate}>Generate Study Plan →</button>
            </div>

            {plan && (
              <div style={{ marginTop: 24 }}>
                <div className="stat-grid" style={{ marginBottom: 20 }}>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: plan.daysLeft <= 7 ? '#DC2626' : 'var(--accent)' }}>{plan.daysLeft}</div>
                    <div className="stat-lbl">Days Until Exam</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{plan.totalHours}</div>
                    <div className="stat-lbl">Total Study Hours</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{plan.subjects.length}</div>
                    <div className="stat-lbl">Subjects</div>
                  </div>
                </div>

                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                    Your Personalised Study Schedule
                  </div>
                  {plan.subjects.map((s, i) => {
                    const diff = difficultyLabels[s.difficulty]
                    const pct = (parseFloat(s.hours) / parseFloat(plan.totalHours) * 100).toFixed(0)
                    return (
                      <div key={s.id} style={{ padding: '14px 16px', borderBottom: i < plan.subjects.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                        <div className="flex-between" style={{ marginBottom: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: diff.color, fontWeight: 500 }}>{diff.label} difficulty</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{s.hours} hrs</div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.perDay} hrs/day</div>
                          </div>
                        </div>
                        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: diff.color, borderRadius: 3 }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{pct}% of total study time</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>How to Use the Study Hours Planner</h2>
            <p>Enter your exam date and how many hours per day you can realistically study. Then add each subject, select its difficulty level, and give it a priority score from 1 to 5. Higher priority and harder subjects automatically get more study time allocated.</p>
            <p>The planner distributes your total available hours proportionally based on difficulty and priority. A subject marked Hard with priority 5 will get significantly more time than an Easy subject with priority 1.</p>
            <p>Use this at the start of each exam period to plan your revision strategically rather than studying randomly and running out of time before covering all subjects.</p>
            <p>Track your deadlines alongside your study plan using our <a href="/deadline-countdown">Deadline Countdown</a>, stay focused with our <a href="/pomodoro-timer">Pomodoro Timer</a>, and check your academic standing with our <a href="/gpa-calculator">GPA Calculator</a>.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
