import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState, useEffect } from 'react'

function timeLeft(dateStr) {
  const diff = new Date(dateStr) - new Date()
  if (diff <= 0) return { expired: true }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  return { days, hours, mins, expired: false }
}

function urgency(dateStr) {
  const diff = new Date(dateStr) - new Date()
  if (diff <= 0) return { color: '#6B7280', bg: '#F3F4F6', label: 'Done' }
  if (diff < 86400000) return { color: '#DC2626', bg: '#FEF2F2', label: 'Due Today!' }
  if (diff < 259200000) return { color: '#D97706', bg: '#FFF7ED', label: 'Due Soon' }
  return { color: '#059669', bg: '#ECFDF5', label: 'On Track' }
}

export default function DeadlineCountdown() {
  const [assignments, setAssignments] = useState([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60000)
    return () => clearInterval(t)
  }, [])

  const add = () => {
    if (!name || !date) return
    setAssignments(a => [...a, { id: Date.now(), name, date }])
    setName(''); setDate('')
  }

  const remove = (id) => setAssignments(a => a.filter(x => x.id !== id))

  const sorted = [...assignments].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Layout>
      <Head>
        <title>Assignment Deadline Countdown — Track Due Dates | ScholarTools</title>
        <meta name="description" content="Track all your assignment deadlines in one place with live countdown timers. Free assignment due date tracker for students." />
        <link rel="canonical" href="https://scholartools.co/deadline-countdown" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Deadline Countdown</div>
            <h1>📅 Assignment Deadline Countdown</h1>
            <p>Add your assignments and deadlines below. See exactly how much time you have left for each one.</p>
          </div>

          <div className="card">
            <label className="label">Add New Assignment</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 2, minWidth: 160 }}>
                <label className="label" style={{ marginBottom: 6 }}>Assignment Name</label>
                <input className="input" placeholder="e.g. Biology Essay" value={name}
                  onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label className="label" style={{ marginBottom: 6 }}>Due Date & Time</label>
                <input className="input" type="datetime-local" value={date}
                  onChange={e => setDate(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={add}>+ Add</button>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-2)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No assignments yet</div>
              <div style={{ fontSize: 14 }}>Add your first assignment deadline above to start tracking.</div>
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              {sorted.map(a => {
                const t = timeLeft(a.date)
                const u = urgency(a.date)
                return (
                  <div key={a.id} className="card" style={{ borderLeft: `4px solid ${u.color}`, padding: '18px 20px', marginBottom: 10 }}>
                    <div className="flex-between">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{a.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Due: {new Date(a.date).toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {t.expired ? (
                          <div style={{ background: u.bg, color: u.color, borderRadius: 8, padding: '6px 14px', fontWeight: 600 }}>Expired</div>
                        ) : (
                          <div>
                            <div style={{ display: 'inline-block', background: u.bg, color: u.color, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{u.label}</div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              {t.days > 0 && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: u.color }}>{t.days}</div><div style={{ fontSize: 11, color: 'var(--text-2)' }}>days</div></div>}
                              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: u.color }}>{t.hours}</div><div style={{ fontSize: 11, color: 'var(--text-2)' }}>hrs</div></div>
                              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: u.color }}>{t.mins}</div><div style={{ fontSize: 11, color: 'var(--text-2)' }}>min</div></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="btn btn-danger btn-sm" style={{ marginTop: 10 }} onClick={() => remove(a.id)}>Remove</button>
                  </div>
                )
              })}
            </div>
          )}

          <div className="tool-info">
            <h2>Never Miss an Assignment Deadline Again</h2>
            <p>Add all your assignments for the semester at the start of term and keep this page bookmarked. The countdown timers update automatically so you always know exactly how much time you have.</p>
            <p>Assignments are sorted by due date — the most urgent ones always appear at the top. Assignments due within 24 hours are highlighted in red, and those within 3 days in orange.</p>
            <p>Use our <a href="/pomodoro-timer">Pomodoro Timer</a> to stay focused while working toward your deadlines, and our <a href="/study-hours-planner">Study Hours Planner</a> to distribute your revision time effectively.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
