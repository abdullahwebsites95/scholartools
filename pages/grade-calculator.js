import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

export default function GradeCalculator() {
  const [current, setCurrent] = useState('')
  const [desired, setDesired] = useState('')
  const [finalWeight, setFinalWeight] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const c = parseFloat(current)
    const d = parseFloat(desired)
    const w = parseFloat(finalWeight)
    if (isNaN(c) || isNaN(d) || isNaN(w) || w <= 0 || w > 100) return
    const currentWeight = 100 - w
    const needed = (d - (c * (currentWeight / 100))) / (w / 100)
    setResult({ needed: needed.toFixed(1), possible: needed <= 100, easy: needed <= 70 })
  }

  const statusColor = result ? (result.possible ? (result.easy ? 'var(--green)' : 'var(--orange)') : 'var(--red)') : 'var(--accent)'
  const statusBg = result ? (result.possible ? (result.easy ? 'var(--green-light)' : 'var(--orange-light)') : 'var(--red-light)') : 'var(--accent-light)'

  return (
    <Layout>
      <Head>
        <title>Grade Needed to Pass Calculator — Final Exam Score | ScholarTools</title>
        <meta name="description" content="Calculate exactly what grade you need on your final exam to pass or achieve your desired grade. Free final exam grade calculator for students." />
        <link rel="canonical" href="https://scholartools.co/grade-calculator" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Grade Needed Calculator</div>
            <h1>📊 Grade Needed to Pass</h1>
            <p>Enter your current grade, the grade you want, and how much the final exam is worth. We tell you exactly what you need.</p>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="field">
                <label className="label">Current Grade (%)</label>
                <input className="input" type="number" min="0" max="100" placeholder="e.g. 72"
                  value={current} onChange={e => setCurrent(e.target.value)} />
                <div className="text-muted" style={{ marginTop: 5 }}>Your grade before the final</div>
              </div>
              <div className="field">
                <label className="label">Desired Final Grade (%)</label>
                <input className="input" type="number" min="0" max="100" placeholder="e.g. 80"
                  value={desired} onChange={e => setDesired(e.target.value)} />
                <div className="text-muted" style={{ marginTop: 5 }}>The grade you want to achieve</div>
              </div>
              <div className="field">
                <label className="label">Final Exam Weight (%)</label>
                <input className="input" type="number" min="1" max="100" placeholder="e.g. 40"
                  value={finalWeight} onChange={e => setFinalWeight(e.target.value)} />
                <div className="text-muted" style={{ marginTop: 5 }}>How much the final is worth</div>
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }} onClick={calculate}>
              Calculate What I Need →
            </button>

            {result && (
              <div style={{ marginTop: 24, background: statusBg, border: `1.5px solid ${statusColor}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  You Need on Your Final Exam
                </div>
                <div style={{ fontSize: 56, fontWeight: 800, color: statusColor, lineHeight: 1 }}>{result.needed}%</div>
                <div style={{ marginTop: 12, fontSize: 15, color: 'var(--text-2)' }}>
                  {!result.possible
                    ? '😔 This score is above 100% — unfortunately this grade is not achievable.'
                    : result.easy
                    ? '🎉 Great news! This is very achievable. You are in a strong position.'
                    : '📚 This is challenging but possible. Study hard and you can do it!'}
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>How the Grade Calculator Works</h2>
            <p>The formula used is: Required Grade = (Desired Grade − Current Grade × Current Weight) ÷ Final Exam Weight.</p>
            <p>For example: If your current grade is 72%, you want an 80%, and the final exam is worth 40% of your grade, then your pre-final work counts for 60%. The calculation would be: (80 − 72 × 0.60) ÷ 0.40 = (80 − 43.2) ÷ 0.40 = 92%.</p>
            <p>This tool is especially useful at the end of semester when students want to plan their final exam preparation strategically.</p>
            <p>Check your overall academic standing with our <a href="/gpa-calculator">GPA Calculator</a>, or use our <a href="/percentage-calculator">Percentage Calculator</a> to convert your exam scores instantly.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
