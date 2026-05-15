import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const gradeMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 }
const gradeOptions = Object.keys(gradeMap)

const emptyRow = () => ({ id: Date.now() + Math.random(), subject: '', grade: 'A', credits: '3' })

export default function GPACalculator() {
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()])
  const [scale, setScale] = useState('4.0')

  const update = (id, field, val) => setRows(r => r.map(x => x.id === id ? { ...x, [field]: val } : x))
  const addRow = () => setRows(r => [...r, emptyRow()])
  const removeRow = (id) => setRows(r => r.filter(x => x.id !== id))

  const validRows = rows.filter(r => r.credits && !isNaN(parseFloat(r.credits)) && parseFloat(r.credits) > 0)
  const totalCredits = validRows.reduce((s, r) => s + parseFloat(r.credits), 0)
  const totalPoints = validRows.reduce((s, r) => s + (gradeMap[r.grade] || 0) * parseFloat(r.credits), 0)
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'
  const pct = totalCredits > 0 ? ((totalPoints / totalCredits) / 4.0 * 100).toFixed(1) : '0.0'

  const letterGrade = (g) => {
    const n = parseFloat(g)
    if (n >= 3.7) return 'A / Excellent'
    if (n >= 3.3) return 'B+ / Very Good'
    if (n >= 3.0) return 'B / Good'
    if (n >= 2.7) return 'B- / Above Average'
    if (n >= 2.0) return 'C / Average'
    if (n >= 1.0) return 'D / Below Average'
    return 'F / Failing'
  }

  return (
    <Layout>
      <Head>
        <title>GPA Calculator — Free Online CGPA Calculator | ScholarTools</title>
        <meta name="description" content="Free GPA calculator. Calculate your GPA on the 4.0 scale or CGPA with credit hours. Works for Pakistani, American and international grading systems." />
        <link rel="canonical" href="https://scholartools.co/gpa-calculator" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / GPA Calculator</div>
            <h1>🎓 GPA Calculator</h1>
            <p>Add your subjects, grades, and credit hours to calculate your GPA or CGPA instantly.</p>
          </div>

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Subject (optional)</th>
                    <th>Grade</th>
                    <th>Credit Hours</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td>
                        <input className="input" style={{ minWidth: 120 }} placeholder="e.g. Mathematics"
                          value={row.subject} onChange={e => update(row.id, 'subject', e.target.value)} />
                      </td>
                      <td>
                        <select className="select" style={{ minWidth: 80 }}
                          value={row.grade} onChange={e => update(row.id, 'grade', e.target.value)}>
                          {gradeOptions.map(g => <option key={g} value={g}>{g} ({gradeMap[g]})</option>)}
                        </select>
                      </td>
                      <td>
                        <input className="input" type="number" min="0" max="6" style={{ maxWidth: 80 }}
                          value={row.credits} onChange={e => update(row.id, 'credits', e.target.value)} />
                      </td>
                      <td>
                        {rows.length > 1 && (
                          <button className="btn btn-danger btn-sm" onClick={() => removeRow(row.id)}>✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={addRow}>+ Add Subject</button>
              <button className="btn btn-danger btn-sm" onClick={() => setRows([emptyRow(), emptyRow(), emptyRow()])}>Reset All</button>
            </div>

            {totalCredits > 0 && (
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <div className="result-box" style={{ textAlign: 'center' }}>
                  <div className="result-title">Your GPA</div>
                  <div className="result-val" style={{ fontSize: 40 }}>{gpa}</div>
                  <div className="result-desc">{letterGrade(gpa)}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{totalCredits}</div>
                  <div className="stat-lbl">Total Credits</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{pct}%</div>
                  <div className="stat-lbl">Percentage Equiv.</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{validRows.length}</div>
                  <div className="stat-lbl">Subjects</div>
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>How is GPA Calculated?</h2>
            <p>GPA (Grade Point Average) is calculated by multiplying each subject's grade points by its credit hours, adding all these together, then dividing by the total number of credit hours.</p>
            <p>For example: If you score an A (4.0) in a 3-credit subject and a B (3.0) in a 2-credit subject, your GPA = ((4.0×3) + (3.0×2)) / (3+2) = 18/5 = 3.6.</p>
            <p>This calculator works for the American 4.0 scale used in most universities globally, including Pakistan (CGPA), India, and the USA.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
