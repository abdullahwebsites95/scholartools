import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState, useEffect, useRef } from 'react'

const passages = [
  "The quick brown fox jumps over the lazy dog near the riverbank. Students who practice typing regularly can significantly improve their academic productivity and save hours each week on assignments and notes.",
  "Success in university requires more than just intelligence. It demands consistent effort, good time management, and the ability to focus deeply on difficult problems for extended periods of time.",
  "Reading and writing are the two most fundamental skills for any student. The more you practice both, the more confident and capable you become in all areas of academic life and beyond.",
  "Every expert was once a beginner. The difference between those who succeed and those who give up is simply persistence. Keep practicing and your skills will improve faster than you expect.",
  "Technology has transformed how students learn and study. From online research to digital note-taking, mastering these tools early in your academic career gives you a significant long-term advantage.",
]

export default function TypingSpeed() {
  const [passage] = useState(() => passages[Math.floor(Math.random() * passages.length)])
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [started, finished])

  const handleType = (val) => {
    if (finished) return
    if (!started && val.length === 1) {
      setStarted(true)
      setStartTime(Date.now())
    }
    setTyped(val)

    // Calculate accuracy
    let correct = 0
    for (let i = 0; i < val.length; i++) {
      if (val[i] === passage[i]) correct++
    }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100)

    // Check if finished
    if (val === passage) {
      clearInterval(timerRef.current)
      setFinished(true)
      const mins = (Date.now() - startTime) / 60000
      const wordCount = passage.split(' ').length
      setWpm(Math.round(wordCount / mins))
    }
  }

  const reset = () => {
    clearInterval(timerRef.current)
    setTyped(''); setStarted(false); setFinished(false)
    setStartTime(null); setElapsed(0); setWpm(0); setAccuracy(100)
    inputRef.current?.focus()
  }

  const getRating = (w) => {
    if (w >= 80) return { label: 'Excellent! 🏆', color: 'var(--green)' }
    if (w >= 60) return { label: 'Good 👍', color: 'var(--accent)' }
    if (w >= 40) return { label: 'Average 📈', color: 'var(--orange)' }
    return { label: 'Keep Practicing 💪', color: 'var(--red)' }
  }

  const rating = getRating(wpm)
  const currentWpm = started && elapsed > 0 && !finished
    ? Math.round((typed.split(' ').length / (elapsed / 60)))
    : wpm

  return (
    <Layout>
      <Head>
        <title>Typing Speed Test — Free WPM Test for Students | ScholarTools</title>
        <meta name="description" content="Test your typing speed and accuracy for free. Find your WPM score and improve your typing. Free online typing test for students." />
        <link rel="canonical" href="https://scholartools.co/typing-speed" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Typing Speed Test</div>
            <h1>⌨️ Typing Speed Test</h1>
            <p>Type the passage below as fast and accurately as you can. Your WPM and accuracy are tracked live.</p>
          </div>

          <div className="card">
            {/* Live stats */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="stat-box" style={{ flex: 1, minWidth: 90 }}>
                <div className="stat-val" style={{ color: 'var(--accent)' }}>{currentWpm || 0}</div>
                <div className="stat-lbl">WPM</div>
              </div>
              <div className="stat-box" style={{ flex: 1, minWidth: 90 }}>
                <div className="stat-val" style={{ color: accuracy >= 95 ? 'var(--green)' : accuracy >= 80 ? 'var(--orange)' : 'var(--red)' }}>{accuracy}%</div>
                <div className="stat-lbl">Accuracy</div>
              </div>
              <div className="stat-box" style={{ flex: 1, minWidth: 90 }}>
                <div className="stat-val">{elapsed}s</div>
                <div className="stat-lbl">Time</div>
              </div>
              <div className="stat-box" style={{ flex: 1, minWidth: 90 }}>
                <div className="stat-val">{typed.length}/{passage.length}</div>
                <div className="stat-lbl">Characters</div>
              </div>
            </div>

            {/* Passage display */}
            <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 14, fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.8, letterSpacing: '0.2px' }}>
              {passage.split('').map((char, i) => {
                let color = 'var(--text-3)'
                if (i < typed.length) {
                  color = typed[i] === char ? 'var(--green)' : 'var(--red)'
                }
                const underline = i === typed.length
                return (
                  <span key={i} style={{ color, textDecoration: underline ? 'underline' : 'none', textDecorationColor: 'var(--accent)' }}>{char}</span>
                )
              })}
            </div>

            <textarea
              ref={inputRef}
              className="textarea"
              style={{ minHeight: 100, fontFamily: 'Georgia, serif' }}
              placeholder={started ? '' : 'Start typing here to begin the test...'}
              value={typed}
              onChange={e => handleType(e.target.value)}
              disabled={finished}
              autoFocus
            />

            {finished && (
              <div style={{ marginTop: 20, background: 'var(--green-light)', border: '1.5px solid var(--green)', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test Complete!</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: rating.color }}>{wpm} WPM</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: rating.color, marginTop: 4 }}>{rating.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 8 }}>Accuracy: {accuracy}% · Time: {elapsed} seconds</div>
              </div>
            )}

            <button className="btn btn-secondary btn-full" style={{ marginTop: 14 }} onClick={reset}>
              ↺ Try Again with New Passage
            </button>
          </div>

          <div className="tool-info">
            <h2>What is a Good Typing Speed for Students?</h2>
            <p>The average person types at 40 WPM (words per minute). Most students type between 40–60 WPM. Anything above 60 WPM is considered good, and above 80 WPM is excellent.</p>
            <p>Improving your typing speed from 40 to 70 WPM can save you 30–45 minutes every day when writing essays, emails, and notes. That adds up to several hours per week.</p>
            <p>The best way to improve is consistent daily practice for 10–15 minutes. Share your score with friends and make it a challenge.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
