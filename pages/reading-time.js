import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

export default function ReadingTime() {
  const [text, setText] = useState('')
  const [speed, setSpeed] = useState('average')

  const wpm = { slow: 150, average: 238, fast: 350 }
  const spokenWpm = 130

  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const mins = (words / wpm[speed])
  const readMins = Math.floor(mins)
  const readSecs = Math.round((mins - readMins) * 60)
  const speakMins = Math.floor(words / spokenWpm)
  const speakSecs = Math.round(((words / spokenWpm) - speakMins) * 60)

  const fmt = (m, s) => m === 0 && s === 0 ? '0 sec' : m > 0 ? `${m} min ${s > 0 ? s + ' sec' : ''}` : `${s} sec`

  return (
    <Layout>
      <Head>
        <title>Reading Time Estimator — How Long to Read Any Text | ScholarTools</title>
        <meta name="description" content="Find out exactly how long it takes to read or present any text. Free reading time calculator for students, presenters and writers." />
        <link rel="canonical" href="https://scholartools.co/reading-time" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Reading Time Estimator</div>
            <h1>📖 Reading Time Estimator</h1>
            <p>Paste your essay, presentation script, or any text to instantly find out how long it takes to read or speak aloud.</p>
          </div>

          <div className="card">
            <div className="field">
              <label className="label">Reading Speed</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[['slow', '🐢 Slow (150 wpm)'], ['average', '👤 Average (238 wpm)'], ['fast', '⚡ Fast (350 wpm)']].map(([k, l]) => (
                  <button key={k} className={`btn btn-sm ${speed === k ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSpeed(k)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="label">Your Text</label>
              <textarea className="textarea" style={{ minHeight: 200 }}
                placeholder="Paste your essay, article, or presentation script here..."
                value={text} onChange={e => setText(e.target.value)} />
            </div>

            <div className="flex-between">
              <div className="text-muted">{words.toLocaleString()} words</div>
              <button className="btn btn-danger btn-sm" onClick={() => setText('')}>Clear</button>
            </div>

            <div className="stat-grid" style={{ marginTop: 20 }}>
              <div className="stat-box" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
                <div className="stat-val" style={{ color: 'var(--accent)' }}>{fmt(readMins, readSecs)}</div>
                <div className="stat-lbl">Silent Reading Time</div>
              </div>
              <div className="stat-box" style={{ background: 'var(--green-light)', border: '1px solid var(--green)' }}>
                <div className="stat-val" style={{ color: 'var(--green)' }}>{fmt(speakMins, speakSecs)}</div>
                <div className="stat-lbl">Speaking / Presentation Time</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{words.toLocaleString()}</div>
                <div className="stat-lbl">Total Words</div>
              </div>
            </div>
          </div>

          <div className="tool-info">
            <h2>How Reading Time is Calculated</h2>
            <p>Reading time is estimated based on your word count and a standard reading speed. The average adult reads silently at about 238 words per minute. Slow readers average around 150 wpm and fast readers around 350 wpm.</p>
            <p>Speaking time is calculated at 130 words per minute — the typical pace for a clear, comfortable public presentation. This is especially useful for students preparing presentations, speeches, or oral exams.</p>
            <p>Use the reading speed selector to match your personal pace for more accurate estimates.</p>
            <p>Use our <a href="/word-counter">Word Counter</a> to check your essay length, or plan your study sessions with our <a href="/study-hours-planner">Study Hours Planner</a> before your next assignment deadline.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
