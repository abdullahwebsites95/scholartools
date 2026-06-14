import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const GRADE_SCALE = [
  { grade: 'A-1', min: 90, max: 100, gpa: '4.00', remarks: 'Outstanding' },
  { grade: 'A',   min: 80, max: 89, gpa: '3.70', remarks: 'Excellent' },
  { grade: 'B',   min: 70, max: 79, gpa: '3.30', remarks: 'Very Good' },
  { grade: 'C',   min: 60, max: 69, gpa: '2.30', remarks: 'Good' },
  { grade: 'D',   min: 50, max: 59, gpa: '1.30', remarks: 'Satisfactory' },
  { grade: 'E',   min: 33, max: 49, gpa: '1.00', remarks: 'Pass' },
  { grade: 'F',   min: 0,  max: 32, gpa: '0.00', remarks: 'Fail' },
]

const FSC_SUBJECTS = [
  { name: 'Physics', total: 85 },
  { name: 'Chemistry', total: 85 },
  { name: 'Biology / Mathematics', total: 85 },
  { name: 'English', total: 75 },
  { name: 'Urdu', total: 75 },
  { name: 'Islamiat / Ethics', total: 50 },
  { name: 'Pakistan Studies', total: 50 },
]

const MATRIC_SUBJECTS = [
  { name: 'Physics', total: 75 },
  { name: 'Chemistry', total: 75 },
  { name: 'Biology / Computer', total: 75 },
  { name: 'Mathematics', total: 75 },
  { name: 'English', total: 75 },
  { name: 'Urdu', total: 75 },
  { name: 'Islamiat', total: 50 },
  { name: 'Pakistan Studies', total: 50 },
]

function getGrade(pct) {
  return GRADE_SCALE.find(g => pct >= g.min && pct <= g.max) || GRADE_SCALE[GRADE_SCALE.length - 1]
}

function gradeColor(grade) {
  const colors = { 'A-1': '#059669', 'A': '#059669', 'B': '#2563EB', 'C': '#D97706', 'D': '#D97706', 'E': '#DC2626', 'F': '#DC2626' }
  return colors[grade] || '#6B7280'
}

export default function FScGradeConverter() {
  const [examType, setExamType] = useState('fsc')
  const [mode, setMode] = useState('total') // total or subject
  const [obtained, setObtained] = useState('')
  const [total, setTotal] = useState('1100')
  const [subjects, setSubjects] = useState(
    FSC_SUBJECTS.map(s => ({ ...s, obtained: '' }))
  )
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const switchExam = (type) => {
    setExamType(type)
    setResult(null)
    setError('')
    setObtained('')
    setTotal(type === 'fsc' ? '1100' : '1050')
    setSubjects((type === 'fsc' ? FSC_SUBJECTS : MATRIC_SUBJECTS).map(s => ({ ...s, obtained: '' })))
  }

  const updateSubject = (idx, val) => {
    const updated = [...subjects]
    updated[idx] = { ...updated[idx], obtained: val }
    setSubjects(updated)
    setResult(null)
  }

  const calculateTotal = () => {
    setError('')
    setResult(null)
    const obt = parseFloat(obtained)
    const tot = parseFloat(total)
    if (isNaN(obt) || isNaN(tot) || obtained === '') { setError('Please enter your obtained marks.'); return }
    if (obt < 0) { setError('Marks cannot be negative.'); return }
    if (obt > tot) { setError('Obtained marks cannot exceed total marks.'); return }
    if (tot <= 0) { setError('Total marks must be greater than zero.'); return }
    const pct = (obt / tot) * 100
    const grade = getGrade(pct)
    setResult({ pct: pct.toFixed(2), grade, obt, tot, mode: 'total' })
  }

  const calculateSubjects = () => {
    setError('')
    setResult(null)
    const valid = subjects.filter(s => s.obtained !== '')
    if (valid.length === 0) { setError('Please enter marks for at least one subject.'); return }
    for (const s of valid) {
      const o = parseFloat(s.obtained)
      if (isNaN(o) || o < 0) { setError(`Invalid marks for ${s.name}.`); return }
      if (o > s.total) { setError(`${s.name}: obtained marks cannot exceed total (${s.total}).`); return }
    }
    const totalObt = valid.reduce((sum, s) => sum + parseFloat(s.obtained), 0)
    const totalMax = valid.reduce((sum, s) => sum + s.total, 0)
    const pct = (totalObt / totalMax) * 100
    const grade = getGrade(pct)
    const subjectResults = valid.map(s => {
      const sPct = (parseFloat(s.obtained) / s.total) * 100
      return { ...s, pct: sPct.toFixed(1), grade: getGrade(sPct) }
    })
    setResult({ pct: pct.toFixed(2), grade, totalObt, totalMax, mode: 'subjects', subjectResults })
  }

  const reset = () => {
    setObtained('')
    setTotal(examType === 'fsc' ? '1100' : '1050')
    setSubjects((examType === 'fsc' ? FSC_SUBJECTS : MATRIC_SUBJECTS).map(s => ({ ...s, obtained: '' })))
    setResult(null)
    setError('')
  }

  return (
    <Layout>
      <Head>
        <title>FSc Percentage Calculator Pakistan — Matric Grade Converter | ScholarTools</title>
        <meta name="description" content="Calculate your FSc or Matric percentage and official board letter grade instantly. Free FSc percentage calculator for Pakistani students. A-1, A, B, C grade scale." />
        <link rel="canonical" href="https://scholartools.co/fsc-grade-converter" />
        <meta property="og:title" content="FSc Percentage Calculator Pakistan | ScholarTools" />
        <meta property="og:description" content="Free FSc and Matric percentage calculator. Get your official board letter grade A-1 through E instantly. Works for all Pakistani boards." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / FSc Grade Converter</div>
            <h1>📊 FSc & Matric Grade Converter</h1>
            <p>Enter your marks to instantly get your percentage and official Pakistan board letter grade — from A-1 down to E. Works for all boards including Punjab, Sindh, KPK, and Federal.</p>
          </div>

          {/* Exam Type Selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button className={`btn ${examType === 'fsc' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => switchExam('fsc')}>
              📗 FSc / FA / ICS
            </button>
            <button className={`btn ${examType === 'matric' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => switchExam('matric')}>
              📘 Matric (SSC)
            </button>
          </div>

          {/* Mode Selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button className={`btn btn-sm ${mode === 'total' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => { setMode('total'); setResult(null); setError('') }}>
              Enter Total Marks
            </button>
            <button className={`btn btn-sm ${mode === 'subject' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }} onClick={() => { setMode('subject'); setResult(null); setError('') }}>
              Enter Subject by Subject
            </button>
          </div>

          <div className="card">
            {mode === 'total' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="field">
                    <label className="label">Obtained Marks</label>
                    <input className="input" type="number" placeholder="e.g. 956"
                      value={obtained} onChange={e => { setObtained(e.target.value); setResult(null) }} />
                  </div>
                  <div className="field">
                    <label className="label">Total Marks</label>
                    <input className="input" type="number"
                      placeholder={examType === 'fsc' ? '1100' : '1050'}
                      value={total} onChange={e => { setTotal(e.target.value); setResult(null) }} />
                    <div className="text-muted" style={{ marginTop: 4 }}>
                      {examType === 'fsc' ? 'Standard FSc total is 1100' : 'Standard Matric total is 1050'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>
                  Enter your marks for each subject. Leave blank to skip subjects not in your program.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {subjects.map((s, i) => (
                    <div key={s.name} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ flex: 2, fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>/ {s.total}</div>
                      <input className="input" type="number" min="0" max={s.total}
                        placeholder={`Max ${s.total}`} style={{ flex: 1, maxWidth: 100 }}
                        value={s.obtained}
                        onChange={e => updateSubject(i, e.target.value)} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 14 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
                onClick={mode === 'total' ? calculateTotal : calculateSubjects}>
                Calculate Grade →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Main result */}
                <div style={{ background: gradeColor(result.grade.grade) + '12', border: `2px solid ${gradeColor(result.grade.grade)}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: gradeColor(result.grade.grade), textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    Your {examType === 'fsc' ? 'FSc' : 'Matric'} Result
                  </div>
                  <div style={{ fontSize: 64, fontWeight: 800, color: gradeColor(result.grade.grade), lineHeight: 1 }}>{result.pct}%</div>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
                    <div style={{ background: gradeColor(result.grade.grade), color: 'white', padding: '6px 20px', borderRadius: 20, fontSize: 18, fontWeight: 700 }}>
                      Grade {result.grade.grade}
                    </div>
                    <div style={{ background: 'var(--bg)', border: `1px solid ${gradeColor(result.grade.grade)}`, color: gradeColor(result.grade.grade), padding: '6px 20px', borderRadius: 20, fontSize: 15, fontWeight: 600 }}>
                      {result.grade.remarks}
                    </div>
                  </div>
                </div>

                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: gradeColor(result.grade.grade) }}>
                      {result.mode === 'total' ? result.obt : result.totalObt}
                    </div>
                    <div className="stat-lbl">Marks Obtained</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{result.mode === 'total' ? result.tot : result.totalMax}</div>
                    <div className="stat-lbl">Total Marks</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{result.grade.gpa}</div>
                    <div className="stat-lbl">GPA Equivalent</div>
                  </div>
                </div>

                {/* Subject breakdown */}
                {result.mode === 'subjects' && result.subjectResults && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>Subject Breakdown</div>
                    <div style={{ overflowX: 'auto' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Obtained</th>
                            <th>Total</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.subjectResults.map(s => (
                            <tr key={s.name}>
                              <td style={{ fontSize: 13 }}>{s.name}</td>
                              <td style={{ fontSize: 13, fontWeight: 500 }}>{s.obtained}</td>
                              <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.total}</td>
                              <td style={{ fontSize: 13 }}>{s.pct}%</td>
                              <td>
                                <span style={{ background: gradeColor(s.grade.grade) + '15', color: gradeColor(s.grade.grade), padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                                  {s.grade.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Grade Scale Reference */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Pakistan Board Official Grade Scale</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>Used by all Pakistani boards including Punjab, Sindh, KPK, Balochistan, Federal, and AJK boards.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Percentage Range</th>
                    <th>GPA</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {GRADE_SCALE.map(g => (
                    <tr key={g.grade}>
                      <td>
                        <span style={{ background: gradeColor(g.grade) + '15', color: gradeColor(g.grade), padding: '2px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
                          {g.grade}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>{g.min}% – {g.max}%</td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{g.gpa}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{g.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>FSc Percentage Calculator Pakistan</h2>
            <p>This FSc percentage calculator converts your marks into the official Pakistan board letter grade used by all intermediate and secondary education boards across the country. The grading scale runs from A-1 (90% and above, Outstanding) down to E (33–49%, Pass) and F (below 33%, Fail). These grades appear on your official mark sheet and are used for university admissions across Pakistan.</p>
            <p>Use the subject-by-subject mode to enter marks individually and see a detailed breakdown with grades per subject. The total marks mode is faster for students who already know their aggregate. Both FSc and Matric calculations use the same official grade scale set by the Inter Board Committee of Chairmen (IBCC).</p>
            <p>After calculating your FSc percentage use our <a href="/mdcat-calculator">MDCAT Aggregate Calculator</a> for medical admissions or our <a href="/ecat-calculator">ECAT Aggregate Calculator</a> for engineering university applications.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
