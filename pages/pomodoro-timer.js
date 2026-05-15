import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState, useEffect, useRef } from 'react'

const MODES = {
  work: { label: 'Study', duration: 25 * 60, color: '#2563EB' },
  short: { label: 'Short Break', duration: 5 * 60, color: '#059669' },
  long: { label: 'Long Break', duration: 15 * 60, color: '#D97706' },
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.value = 880
    g.gain.setValueAtTime(0.3, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.5)
  } catch(e) {}
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            beep()
            if (mode === 'work') setSessions(s => s + 1)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const switchMode = (m) => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(m)
    setTimeLeft(MODES[m].duration)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setTimeLeft(MODES[mode].duration)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const total = MODES[mode].duration
  const pct = ((total - timeLeft) / total) * 100
  const col = MODES[mode].color

  return (
    <Layout>
      <Head>
        <title>Pomodoro Study Timer — Free Online Focus Timer | ScholarTools</title>
        <meta name="description" content="Free Pomodoro timer for students. 25-minute study sessions with 5-minute breaks. Stay focused and study smarter. No signup needed." />
        <link rel="canonical" href="https://scholartools.co/pomodoro-timer" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Pomodoro Timer</div>
            <h1>⏱️ Pomodoro Study Timer</h1>
            <p>Study for 25 minutes, break for 5. The most effective study method used by students worldwide.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div className="tabs" style={{ justifyContent: 'center' }}>
              {Object.entries(MODES).map(([k, v]) => (
                <button key={k} className={`tab-btn${mode === k ? ' active' : ''}`} onClick={() => switchMode(k)}
                  style={{ '--tab-color': v.color }}>
                  {v.label}
                </button>
              ))}
            </div>

            {/* Circular Progress */}
            <div style={{ position: 'relative', width: 220, height: 220, margin: '24px auto' }}>
              <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="110" cy="110" r="95" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle cx="110" cy="110" r="95" fill="none" stroke={col} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 95}`}
                  strokeDashoffset={`${2 * Math.PI * 95 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-2px', color: 'var(--primary)', fontFamily: 'monospace' }}>{mins}:{secs}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{MODES[mode].label}</div>
              </div>
            </div>

            <div className="btn-group" style={{ justifyContent: 'center' }}>
              <button
                className="btn btn-primary btn-lg"
                style={{ background: col, minWidth: 140 }}
                onClick={() => setRunning(r => !r)}
              >{running ? '⏸ Pause' : '▶ Start'}</button>
              <button className="btn btn-secondary" onClick={reset}>↺ Reset</button>
            </div>

            <div style={{ marginTop: 28, padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: col }}>{sessions}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Sessions completed today</div>
            </div>
          </div>

          <div className="tool-info">
            <h2>What is the Pomodoro Technique?</h2>
            <p>The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s. It breaks your work into 25-minute focused sessions (called "Pomodoros") separated by short 5-minute breaks. After completing four sessions, you take a longer 15-minute break.</p>
            <p>Studies show this method significantly improves concentration and reduces the impact of interruptions on focus. It is one of the most popular study methods among university students worldwide.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
