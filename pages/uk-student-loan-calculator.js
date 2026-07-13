import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const PLANS = {
  plan1: {
    label: 'Plan 1',
    note: 'Started before Sept 2012 (England/Wales), NI students, or pre-2021 Scottish students',
    threshold: 26065,
    rate: 0.09,
    writeOffYears: 25,
  },
  plan2: {
    label: 'Plan 2',
    note: 'Started Sept 2012 – July 2023 (England/Wales)',
    threshold: 28470,
    rate: 0.09,
    writeOffYears: 30,
  },
  plan4: {
    label: 'Plan 4 (Scotland)',
    note: 'Scottish students, any start date',
    threshold: 32745,
    rate: 0.09,
    writeOffYears: 30,
  },
  plan5: {
    label: 'Plan 5',
    note: 'Started Aug 2023 onwards (England) — first repayments from April 2026',
    threshold: 25000,
    rate: 0.09,
    writeOffYears: 40,
  },
}

// Plan 2/3 RPI+3% currently ~6.2%; Plan 1/4/5 track RPI or bank rate — shown as editable reference
const CURRENT_INTEREST_RATE = 6.2

export default function UKStudentLoanCalculator() {
  const [plan, setPlan] = useState('plan5')
  const [loanBalance, setLoanBalance] = useState('')
  const [salary, setSalary] = useState('')
  const [salaryGrowth, setSalaryGrowth] = useState('3')
  const [interestRate, setInterestRate] = useState(String(CURRENT_INTEREST_RATE))
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    setResult(null)

    const balance = parseFloat(loanBalance)
    const sal = parseFloat(salary)
    const growth = parseFloat(salaryGrowth) / 100
    const rate = parseFloat(interestRate) / 100
    const p = PLANS[plan]

    if (isNaN(balance) || loanBalance === '') { setError('Please enter your loan balance.'); return }
    if (isNaN(sal) || salary === '') { setError('Please enter your annual salary.'); return }
    if (balance <= 0) { setError('Loan balance must be greater than zero.'); return }
    if (sal < 0) { setError('Salary cannot be negative.'); return }

    // Monthly repayment based on current salary
    const annualIncomeAboveThreshold = Math.max(0, sal - p.threshold)
    const annualRepayment = annualIncomeAboveThreshold * p.rate
    const monthlyRepayment = annualRepayment / 12

    // Simulate year by year for the write-off period
    let remainingBalance = balance
    let currentSalary = sal
    let totalRepaid = 0
    let totalInterestAccrued = 0
    let yearsToRepay = null
    const yearlyData = []

    for (let year = 1; year <= p.writeOffYears; year++) {
      if (remainingBalance <= 0) {
        yearsToRepay = year - 1
        break
      }

      const interestThisYear = remainingBalance * rate
      const incomeAboveThreshold = Math.max(0, currentSalary - p.threshold)
      const repaymentThisYear = Math.min(incomeAboveThreshold * p.rate, remainingBalance + interestThisYear)

      remainingBalance = remainingBalance + interestThisYear - repaymentThisYear
      totalRepaid += repaymentThisYear
      totalInterestAccrued += interestThisYear

      if (year <= 10 || year % 5 === 0) {
        yearlyData.push({ year, balance: Math.max(0, remainingBalance).toFixed(0), salary: currentSalary.toFixed(0) })
      }

      currentSalary = currentSalary * (1 + growth)

      if (remainingBalance <= 0) {
        yearsToRepay = year
        remainingBalance = 0
      }
    }

    const writtenOff = yearsToRepay === null
    const finalBalance = Math.max(0, remainingBalance)

    setResult({
      monthlyRepayment: monthlyRepayment.toFixed(2),
      annualRepayment: annualRepayment.toFixed(2),
      writtenOff,
      yearsToRepay,
      writeOffYears: p.writeOffYears,
      totalRepaid: totalRepaid.toFixed(0),
      finalBalance: finalBalance.toFixed(0),
      yearlyData,
      threshold: p.threshold,
      planLabel: p.label,
    })
  }

  const reset = () => {
    setLoanBalance(''); setSalary(''); setSalaryGrowth('3')
    setInterestRate(String(CURRENT_INTEREST_RATE)); setResult(null); setError('')
  }

  const p = PLANS[plan]

  return (
    <Layout>
      <Head>
        <title>UK Student Loan Repayment Calculator — Plan 1, 2, 4 & 5 | ScholarTools</title>
        <meta name="description" content="Calculate your UK student loan repayments for Plan 1, 2, 4 or 5. Find your monthly repayment, years to repay, and whether your loan will be written off." />
        <link rel="canonical" href="https://scholartools.co/uk-student-loan-calculator" />
        <meta property="og:title" content="UK Student Loan Repayment Calculator | ScholarTools" />
        <meta property="og:description" content="Free UK student loan calculator covering all repayment plans including Plan 5. Find your monthly repayment and whether your loan gets written off." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / UK Student Loan Calculator</div>
            <h1>💷 UK Student Loan Repayment Calculator</h1>
            <p>Calculate your monthly repayment, years to repay, and whether your loan will be written off before you finish paying it. Covers all current repayment plans.</p>
          </div>

          <div className="card">
            {/* Plan selector */}
            <div className="field">
              <label className="label">Your Repayment Plan</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                {Object.entries(PLANS).map(([key, val]) => (
                  <button key={key}
                    className={`btn btn-sm ${plan === key ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flexDirection: 'column', height: 'auto', padding: '10px 12px' }}
                    onClick={() => { setPlan(key); setResult(null) }}>
                    <span style={{ fontWeight: 700 }}>{val.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)', background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <strong>{p.label}:</strong> {p.note} · Threshold £{p.threshold.toLocaleString()}/year · Written off after {p.writeOffYears} years
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div className="field">
                <label className="label">Total Loan Balance (£)</label>
                <input className="input" type="number" placeholder="e.g. 45000"
                  value={loanBalance} onChange={e => { setLoanBalance(e.target.value); setResult(null) }} />
              </div>
              <div className="field">
                <label className="label">Current Annual Salary (£)</label>
                <input className="input" type="number" placeholder="e.g. 32000"
                  value={salary} onChange={e => { setSalary(e.target.value); setResult(null) }} />
              </div>
              <div className="field">
                <label className="label">Expected Annual Salary Growth (%)</label>
                <input className="input" type="number" step="0.5" placeholder="3"
                  value={salaryGrowth} onChange={e => { setSalaryGrowth(e.target.value); setResult(null) }} />
              </div>
              <div className="field">
                <label className="label">Interest Rate (%)</label>
                <input className="input" type="number" step="0.1" placeholder={String(CURRENT_INTEREST_RATE)}
                  value={interestRate} onChange={e => { setInterestRate(e.target.value); setResult(null) }} />
                <div className="text-muted" style={{ marginTop: 4 }}>Rates change periodically — check gov.uk for current rate</div>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate Repayment →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                <div className="stat-grid" style={{ marginBottom: 16 }}>
                  <div className="stat-box" style={{ background: '#EFF6FF', border: '1.5px solid #2563EB' }}>
                    <div className="stat-val" style={{ color: '#1D4ED8' }}>£{result.monthlyRepayment}</div>
                    <div className="stat-lbl">Monthly Repayment (now)</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">£{result.annualRepayment}</div>
                    <div className="stat-lbl">Annual Repayment (now)</div>
                  </div>
                  <div className="stat-box" style={{ background: result.writtenOff ? '#ECFDF5' : '#FFF7ED', border: `1.5px solid ${result.writtenOff ? '#059669' : '#D97706'}` }}>
                    <div className="stat-val" style={{ color: result.writtenOff ? '#059669' : '#D97706' }}>
                      {result.writtenOff ? 'Written Off' : `${result.yearsToRepay} yrs`}
                    </div>
                    <div className="stat-lbl">{result.writtenOff ? 'Loan Outcome' : 'Estimated Repayment Time'}</div>
                  </div>
                </div>

                {/* Main verdict */}
                <div style={{
                  background: result.writtenOff ? '#ECFDF5' : '#EFF6FF',
                  border: `2px solid ${result.writtenOff ? '#059669' : '#2563EB'}`,
                  borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center', marginBottom: 16
                }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{result.writtenOff ? '📋' : '✅'}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: result.writtenOff ? '#059669' : '#1D4ED8' }}>
                    {result.writtenOff
                      ? `Your loan will likely be written off after ${result.writeOffYears} years`
                      : `You are projected to fully repay in ${result.yearsToRepay} years`
                    }
                  </div>
                  <div style={{ fontSize: 13, color: '#374151', marginTop: 8, lineHeight: 1.6 }}>
                    {result.writtenOff
                      ? `Based on your current salary and growth assumptions, you are estimated to have repaid approximately £${Number(result.totalRepaid).toLocaleString()} by the time the remaining balance is written off. This is very common on ${result.planLabel} — most graduates on this plan never fully repay before write-off.`
                      : `Total estimated repayment: £${Number(result.totalRepaid).toLocaleString()}.`
                    }
                  </div>
                </div>

                {/* Graduate tax note for Plan 2/5 */}
                {(plan === 'plan2' || plan === 'plan5') && (
                  <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                    💡 <strong>For most {result.planLabel} graduates</strong>, the loan functions more like a graduate tax than a traditional loan — you pay a percentage of income above the threshold for {result.writeOffYears} years, and full repayment before write-off is relatively rare unless you have a high salary.
                  </div>
                )}

                {/* Balance projection table */}
                {result.yearlyData.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>Balance Projection Over Time</div>
                    <div style={{ overflowX: 'auto' }}>
                      <table>
                        <thead><tr><th>Year</th><th>Projected Salary</th><th>Remaining Balance</th></tr></thead>
                        <tbody>
                          {result.yearlyData.map(row => (
                            <tr key={row.year}>
                              <td style={{ fontSize: 13 }}>Year {row.year}</td>
                              <td style={{ fontSize: 13 }}>£{Number(row.salary).toLocaleString()}</td>
                              <td style={{ fontSize: 13, fontWeight: 600, color: parseFloat(row.balance) === 0 ? '#059669' : 'var(--text)' }}>
                                £{Number(row.balance).toLocaleString()}
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

          {/* Plans reference */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>UK Student Loan Plans — Quick Reference</h2>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Plan</th><th>Who It's For</th><th>Threshold</th><th>Write-off</th></tr></thead>
                <tbody>
                  {Object.entries(PLANS).map(([key, val]) => (
                    <tr key={key} style={{ background: key === plan ? 'var(--accent-light)' : undefined }}>
                      <td style={{ fontSize: 13, fontWeight: key === plan ? 600 : 400 }}>{val.label}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{val.note}</td>
                      <td style={{ fontSize: 13 }}>£{val.threshold.toLocaleString()}/yr</td>
                      <td style={{ fontSize: 13 }}>{val.writeOffYears} years</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>UK Student Loan Repayment Calculator</h2>
            <p>This UK student loan repayment calculator covers all current repayment plans including Plan 1, Plan 2, Plan 4 (Scotland), and the newer Plan 5 introduced for students starting from August 2023 onwards. Each plan has a different income threshold above which you repay 9% of your income, and a different write-off period ranging from 25 years on Plan 1 up to 40 years on Plan 5.</p>
            <p>Many online calculators have not been updated to include Plan 5, which has a lower repayment threshold of £25,000 and a longer 40-year write-off period compared to Plan 2's £28,470 threshold (rising to £29,385 from April 2026, then frozen until 2030) and 30-year term. For most graduates on Plan 2 or Plan 5, the loan behaves more like a graduate tax than a conventional loan — monthly repayments are based purely on income, and full repayment before the write-off date is relatively uncommon.</p>
            <p>Also use our <a href="/student-rent-calculator">Student Rent Calculator UK</a> to plan your living costs, or check your <a href="/uk-degree-classification-calculator">UK Degree Classification</a> to see how your studies are progressing.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
