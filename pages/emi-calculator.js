import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [tenure, setTenure] = useState('')
  const [tenureType, setTenureType] = useState('years')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate) / 12 / 100
    const n = tenureType === 'years' ? parseFloat(tenure) * 12 : parseFloat(tenure)
    if (!p || !r || !n || isNaN(p) || isNaN(r) || isNaN(n)) return
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - p
    const schedule = []
    let balance = p
    for (let i = 1; i <= Math.min(n, 12); i++) {
      const interest = balance * r
      const principal = emi - interest
      balance -= principal
      schedule.push({ month: i, emi: emi.toFixed(0), principal: principal.toFixed(0), interest: interest.toFixed(0), balance: Math.max(0, balance).toFixed(0) })
    }
    setResult({ emi: emi.toFixed(2), totalPayment: totalPayment.toFixed(2), totalInterest: totalInterest.toFixed(2), interestPct: ((totalInterest / p) * 100).toFixed(1), schedule, months: n })
  }

  const fmt = n => Number(n).toLocaleString()

  return (
    <Layout>
      <Head>
        <title>Loan EMI Calculator — Free Monthly Installment Calculator | ScholarTools</title>
        <meta name="description" content="Calculate your loan EMI instantly. Find monthly installment, total interest, and full amortization schedule. Free loan calculator for students." />
        <link rel="canonical" href="https://scholartools.co/emi-calculator" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Loan EMI Calculator</div>
            <h1>💳 Loan EMI Calculator</h1>
            <p>Calculate your monthly loan installment, total interest payable, and see a full repayment breakdown.</p>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="field">
                <label className="label">Loan Amount</label>
                <input className="input" type="number" placeholder="e.g. 500000" value={principal}
                  onChange={e => setPrincipal(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Annual Interest Rate (%)</label>
                <input className="input" type="number" step="0.1" placeholder="e.g. 12.5" value={rate}
                  onChange={e => setRate(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Loan Tenure</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input" type="number" placeholder={tenureType === 'years' ? 'e.g. 5' : 'e.g. 60'}
                    value={tenure} onChange={e => setTenure(e.target.value)} style={{ flex: 1 }} />
                  <select className="select" style={{ width: 100 }} value={tenureType} onChange={e => setTenureType(e.target.value)}>
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }} onClick={calculate}>
              Calculate EMI →
            </button>

            {result && (
              <div style={{ marginTop: 24 }}>
                <div className="result-box" style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div className="result-title">Monthly EMI</div>
                  <div className="result-val" style={{ fontSize: 44 }}>₨ {fmt(result.emi)}</div>
                  <div className="result-desc">per month for {result.months} months</div>
                </div>

                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="stat-val" style={{ fontSize: 18 }}>₨ {fmt(principal)}</div>
                    <div className="stat-lbl">Principal Amount</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ fontSize: 18, color: 'var(--red)' }}>₨ {fmt(result.totalInterest)}</div>
                    <div className="stat-lbl">Total Interest ({result.interestPct}%)</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ fontSize: 18 }}>₨ {fmt(result.totalPayment)}</div>
                    <div className="stat-lbl">Total Payment</div>
                  </div>
                </div>

                {/* Visual breakdown */}
                <div style={{ marginTop: 16, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Payment Breakdown</div>
                  <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${100 - parseFloat(result.interestPct)}%`, background: '#2563EB' }} title="Principal" />
                    <div style={{ flex: 1, background: '#DC2626' }} title="Interest" />
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 8, fontSize: 12 }}>
                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#2563EB', borderRadius: 2, marginRight: 4 }} />Principal</span>
                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#DC2626', borderRadius: 2, marginRight: 4 }} />Interest ({result.interestPct}%)</span>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.4px' }}>First 12 Months Schedule</div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                      </thead>
                      <tbody>
                        {result.schedule.map(row => (
                          <tr key={row.month}>
                            <td>{row.month}</td>
                            <td>₨ {fmt(row.emi)}</td>
                            <td style={{ color: 'var(--accent)' }}>₨ {fmt(row.principal)}</td>
                            <td style={{ color: 'var(--red)' }}>₨ {fmt(row.interest)}</td>
                            <td>₨ {fmt(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>What is EMI and How is it Calculated?</h2>
            <p>EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay a loan. Each EMI contains two parts: the principal repayment and the interest charge. In early months, a larger portion goes toward interest. Over time, more goes toward the principal.</p>
            <p>The EMI formula is: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the number of monthly installments.</p>
            <p>Students commonly use this calculator for education loans, personal loans, and car loans to understand the true cost of borrowing before committing to a loan agreement.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
