import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

// FBR 2025-26 Salaried Slabs (confirmed Finance Act 2025)
const SALARIED_SLABS = [
  { min: 0,        max: 600000,   base: 0,      rate: 0,    label: 'Up to Rs 600,000' },
  { min: 600001,   max: 1200000,  base: 0,      rate: 0.01, label: 'Rs 600,001 – 1,200,000' },
  { min: 1200001,  max: 2200000,  base: 6000,   rate: 0.11, label: 'Rs 1,200,001 – 2,200,000' },
  { min: 2200001,  max: 3200000,  base: 116000, rate: 0.23, label: 'Rs 2,200,001 – 3,200,000' },
  { min: 3200001,  max: 4100000,  base: 346000, rate: 0.30, label: 'Rs 3,200,001 – 4,100,000' },
  { min: 4100001,  max: Infinity, base: 616000, rate: 0.35, label: 'Above Rs 4,100,000' },
]

// FBR 2025-26 Non-Salaried / Freelancer Slabs
const NONSALARIED_SLABS = [
  { min: 0,        max: 600000,   base: 0,       rate: 0,    label: 'Up to Rs 600,000' },
  { min: 600001,   max: 1200000,  base: 0,       rate: 0.02, label: 'Rs 600,001 – 1,200,000' },
  { min: 1200001,  max: 1600000,  base: 12000,   rate: 0.10, label: 'Rs 1,200,001 – 1,600,000' },
  { min: 1600001,  max: 3200000,  base: 52000,   rate: 0.15, label: 'Rs 1,600,001 – 3,200,000' },
  { min: 3200001,  max: 5600000,  base: 292000,  rate: 0.20, label: 'Rs 3,200,001 – 5,600,000' },
  { min: 5600001,  max: 8800000,  base: 772000,  rate: 0.25, label: 'Rs 5,600,001 – 8,800,000' },
  { min: 8800001,  max: Infinity, base: 1572000, rate: 0.30, label: 'Above Rs 8,800,000' },
]

function calcTax(annual, slabs) {
  for (const slab of slabs) {
    if (annual <= slab.max) {
      const excess = Math.max(0, annual - slab.min + 1)
      return slab.base + (excess * slab.rate)
    }
  }
  return 0
}

function fmt(n) {
  return Math.round(n).toLocaleString('en-PK')
}

const SALARY_EXAMPLES = [
  { label: 'Fresh Graduate (Rs 50,000/mo)', monthly: 50000 },
  { label: 'Junior Developer (Rs 100,000/mo)', monthly: 100000 },
  { label: 'Mid-level Engineer (Rs 200,000/mo)', monthly: 200000 },
  { label: 'Senior Professional (Rs 400,000/mo)', monthly: 400000 },
]

export default function FBRTaxCalculator() {
  const [inputType, setInputType] = useState('monthly')
  const [salary, setSalary] = useState('')
  const [empType, setEmpType] = useState('salaried')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = (overrideSalary) => {
    setError('')
    setResult(null)
    const val = parseFloat(overrideSalary !== undefined ? overrideSalary : salary)
    if (isNaN(val) || val < 0) { setError('Please enter a valid salary amount.'); return }
    if (val === 0) { setError('Salary must be greater than zero.'); return }

    const annual = inputType === 'monthly' ? val * 12 : val
    const monthly = annual / 12

    const slabs = empType === 'salaried' ? SALARIED_SLABS : NONSALARIED_SLABS
    const annualTax = Math.max(0, calcTax(annual, slabs))
    const monthlyTax = annualTax / 12
    const effectiveRate = (annualTax / annual) * 100
    const takeHomeAnnual = annual - annualTax
    const takeHomeMonthly = takeHomeAnnual / 12

    // Find which slab they fall in
    const activeSlab = slabs.find(s => annual <= s.max) || slabs[slabs.length - 1]

    setResult({
      annual: fmt(annual),
      monthly: fmt(monthly),
      annualTax: fmt(annualTax),
      monthlyTax: fmt(monthlyTax),
      effectiveRate: effectiveRate.toFixed(2),
      takeHomeAnnual: fmt(takeHomeAnnual),
      takeHomeMonthly: fmt(takeHomeMonthly),
      activeSlab: activeSlab.label,
      activeRate: (activeSlab.rate * 100).toFixed(0),
      rawAnnual: annual,
      rawTax: annualTax,
    })
  }

  const reset = () => { setSalary(''); setResult(null); setError('') }

  return (
    <Layout>
      <Head>
        <title>FBR Income Tax Calculator 2025-26 — Free Pakistan Tax Tool | ScholarTools</title>
        <meta name="description" content="Calculate your FBR income tax for 2025-26 instantly. Official Pakistan tax slabs for salaried and freelancers. Monthly deduction, take-home salary and effective tax rate." />
        <link rel="canonical" href="https://scholartools.co/fbr-income-tax-calculator" />
        <meta property="og:title" content="FBR Income Tax Calculator Pakistan 2025-26 | ScholarTools" />
        <meta property="og:description" content="Free FBR income tax calculator using official 2025-26 slabs. Find your monthly tax deduction and take-home salary instantly." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / FBR Income Tax Calculator</div>
            <h1>🧾 FBR Income Tax Calculator 2025–26</h1>
            <p>Calculate your Pakistan income tax using the official FBR 2025–26 slabs. Find your monthly tax deduction, effective tax rate, and take-home salary instantly.</p>
          </div>

          {/* Tax Year Banner */}
          <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46', marginBottom: 4 }}>✅ Using FBR Finance Act 2025 — Tax Year 2025–26 (Valid until 30 June 2026)</div>
            <div style={{ fontSize: 12, color: '#047857', lineHeight: 1.5 }}>Salaried individuals received significant tax relief this year — the 600k–1.2m bracket was reduced from 5% to just 1%. These are the official current rates.</div>
          </div>

          <div className="card">
            {/* Employee Type */}
            <div className="field">
              <label className="label">Employment Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className={`btn ${empType === 'salaried' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setEmpType('salaried'); setResult(null) }}>
                  💼 Salaried Employee
                </button>
                <button className={`btn ${empType === 'freelancer' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setEmpType('freelancer'); setResult(null) }}>
                  💻 Freelancer / Self-Employed
                </button>
              </div>
              {empType === 'freelancer' && (
                <div style={{ marginTop: 8, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 12, color: '#92400E' }}>
                  ⚠️ Non-salaried individuals are taxed at higher rates. Freelancers earning in foreign currency may qualify for reduced rates — consult FBR or a tax advisor for your specific situation.
                </div>
              )}
            </div>

            {/* Input Type */}
            <div className="field">
              <label className="label">Enter Salary As</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className={`btn btn-sm ${inputType === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setInputType('monthly'); setResult(null) }}>
                  Monthly (PKR)
                </button>
                <button className={`btn btn-sm ${inputType === 'annual' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setInputType('annual'); setResult(null) }}>
                  Annual (PKR)
                </button>
              </div>
            </div>

            {/* Salary Input */}
            <div className="field">
              <label className="label">{inputType === 'monthly' ? 'Monthly' : 'Annual'} Salary (PKR)</label>
              <input className="input" type="number" min="0"
                placeholder={inputType === 'monthly' ? 'e.g. 100000' : 'e.g. 1200000'}
                value={salary} onChange={e => { setSalary(e.target.value); setResult(null) }} />
            </div>

            {/* Quick examples */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>Quick examples — click to calculate:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SALARY_EXAMPLES.map(ex => (
                  <button key={ex.label}
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const val = inputType === 'monthly' ? ex.monthly : ex.monthly * 12
                      setSalary(String(val))
                      calculate(String(inputType === 'monthly' ? ex.monthly : ex.monthly * 12))
                    }}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group">
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => calculate()}>
                Calculate My Tax →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Main result cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                  <div style={{ background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>Annual Tax</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#1D4ED8' }}>Rs {result.annualTax}</div>
                  </div>
                  <div style={{ background: '#FEF2F2', border: '2px solid #DC2626', borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>Monthly Deduction</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#DC2626' }}>Rs {result.monthlyTax}</div>
                  </div>
                  <div style={{ background: '#ECFDF5', border: '2px solid #059669', borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>Monthly Take-Home</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#059669' }}>Rs {result.takeHomeMonthly}</div>
                  </div>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>Effective Tax Rate</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>{result.effectiveRate}%</div>
                  </div>
                </div>

                {/* Full breakdown */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 12 }}>Complete Breakdown</div>
                  {[
                    { label: 'Gross Annual Salary', val: `Rs ${result.annual}`, color: 'var(--text)' },
                    { label: 'Gross Monthly Salary', val: `Rs ${result.monthly}`, color: 'var(--text)' },
                    { label: 'Annual Income Tax', val: `Rs ${result.annualTax}`, color: '#DC2626' },
                    { label: 'Monthly Tax Deduction', val: `Rs ${result.monthlyTax}`, color: '#DC2626' },
                    { label: 'Effective Tax Rate', val: `${result.effectiveRate}%`, color: '#D97706' },
                    { label: 'Annual Take-Home', val: `Rs ${result.takeHomeAnnual}`, color: '#059669' },
                    { label: 'Monthly Take-Home', val: `Rs ${result.takeHomeMonthly}`, color: '#059669' },
                    { label: 'Tax Slab', val: result.activeSlab, color: 'var(--accent)' },
                    { label: 'Marginal Tax Rate', val: `${result.activeRate}%`, color: 'var(--accent)' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13, alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-2)' }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: row.color }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                {/* Tax vs income visual */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>How Your Salary Splits</div>
                  <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${100 - parseFloat(result.effectiveRate)}%`, background: '#059669' }} title="Take Home" />
                    <div style={{ flex: 1, background: '#DC2626' }} title="Tax" />
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 8, fontSize: 12, flexWrap: 'wrap' }}>
                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#059669', borderRadius: 2, marginRight: 4 }} />Take-home ({(100 - parseFloat(result.effectiveRate)).toFixed(1)}%)</span>
                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#DC2626', borderRadius: 2, marginRight: 4 }} />Tax ({result.effectiveRate}%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tax Slabs Reference */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>FBR Tax Slabs 2025–26 — Salaried Individuals</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>These are the official rates from Finance Act 2025. Effective until 30 June 2026.</p>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Annual Income Range</th>
                    <th>Tax</th>
                    <th>Rate on Excess</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARIED_SLABS.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 13 }}>{s.label}</td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{s.base === 0 ? '—' : `Rs ${s.base.toLocaleString()}`}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: s.rate === 0 ? '#059669' : s.rate >= 0.30 ? '#DC2626' : '#D97706' }}>
                        {(s.rate * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
              Note: Tax rates apply progressively. Only the income in each slab is taxed at that rate — not your entire salary.
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>FBR Income Tax Calculator Pakistan 2025–26</h2>
            <p>This FBR income tax calculator uses the official Pakistan Federal Board of Revenue tax slabs for the fiscal year 2025–26 under the Finance Act 2025. Salaried individuals received significant tax relief this year, with the Rs 600,000–1,200,000 bracket reduced from 5% to just 1%, providing meaningful monthly savings for fresh graduates and junior professionals entering the workforce.</p>
            <p>The calculator is especially useful for students starting their first job, entering internships, or working as freelancers. Understanding your monthly tax deduction before accepting a salary offer helps you negotiate better and plan your finances accurately. Pakistan uses a progressive tax system meaning only the income in each bracket is taxed at the higher rate — not your entire salary.</p>
            <p>For freelancers earning in foreign currency through platforms like Upwork or Fiverr, special reduced rates may apply — consult an FBR-registered tax practitioner for your specific situation. Use our <a href="/emi-calculator">Loan EMI Calculator</a> to plan loan repayments on your take-home salary.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
