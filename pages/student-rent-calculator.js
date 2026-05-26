import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const cityRents = [
  { city: 'London', halls: '£220–£350', private: '£180–£280', note: 'Most expensive city. Zone 2–3 private rentals offer better value.' },
  { city: 'Manchester', halls: '£140–£200', private: '£120–£180', note: 'Great student city. Fallowfield and Rusholme are popular affordable areas.' },
  { city: 'Leeds', halls: '£130–£190', private: '£100–£160', note: 'Very student-friendly. Headingley is the top student neighbourhood.' },
  { city: 'Birmingham', halls: '£130–£185', private: '£100–£155', note: 'Affordable with great transport links. Selly Oak popular with students.' },
  { city: 'Bristol', halls: '£160–£220', private: '£140–£200', note: 'Second most expensive after London. Clifton and Stoke Bishop in demand.' },
  { city: 'Sheffield', halls: '£120–£175', private: '£90–£145', note: 'One of the most affordable student cities in the UK. Broomhill area popular.' },
]

export default function StudentRentCalculator() {
  const [loanAnnual, setLoanAnnual] = useState('')
  const [extraMonthly, setExtraMonthly] = useState('')
  const [expenses, setExpenses] = useState('')
  const [rent, setRent] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const monthlyLoan = parseFloat(loanAnnual) / 12 || 0
    const extra = parseFloat(extraMonthly) || 0
    const exp = parseFloat(expenses) || 0
    const r = parseFloat(rent) || 0

    if (!loanAnnual && !extraMonthly) return

    const totalMonthlyIncome = monthlyLoan + extra
    const recommended30 = totalMonthlyIncome * 0.30
    const recommended50 = totalMonthlyIncome * 0.50
    const leftAfterRentAndExpenses = totalMonthlyIncome - r - exp
    const deficitRentLevel = totalMonthlyIncome - exp

    let rating, ratingColor, ratingBg, ratingDesc, ratingEmoji
    const rentPct = totalMonthlyIncome > 0 ? (r / totalMonthlyIncome) * 100 : 0

    if (rentPct <= 30) {
      rating = 'Comfortable'
      ratingColor = '#059669'
      ratingBg = '#ECFDF5'
      ratingDesc = 'Your rent is within the recommended 30% of income. You have healthy breathing room for other expenses and unexpected costs.'
      ratingEmoji = '✅'
    } else if (rentPct <= 45) {
      rating = 'Tight'
      ratingColor = '#D97706'
      ratingBg = '#FFF7ED'
      ratingDesc = 'Your rent is above the ideal level but manageable. You will need to be careful with other spending and have little buffer for emergencies.'
      ratingEmoji = '⚠️'
    } else {
      rating = 'At Risk'
      ratingColor = '#DC2626'
      ratingBg = '#FEF2F2'
      ratingDesc = 'Your rent takes up too large a share of your income. You may struggle to cover basic expenses and are at risk of going into debt.'
      ratingEmoji = '🚨'
    }

    setResult({
      totalMonthlyIncome: totalMonthlyIncome.toFixed(2),
      monthlyLoan: monthlyLoan.toFixed(2),
      recommended30: recommended30.toFixed(2),
      recommended50: recommended50.toFixed(2),
      leftAfterRentAndExpenses: leftAfterRentAndExpenses.toFixed(2),
      deficitRentLevel: deficitRentLevel.toFixed(2),
      rating, ratingColor, ratingBg, ratingDesc, ratingEmoji,
      rentPct: rentPct.toFixed(0),
      hasRent: r > 0,
      exp,
    })
  }

  const reset = () => {
    setLoanAnnual(''); setExtraMonthly(''); setExpenses(''); setRent(''); setResult(null)
  }

  return (
    <Layout>
      <Head>
        <title>Student Rent Affordability Calculator UK 2026 — Free Tool | ScholarTools</title>
        <meta name="description" content="Find out if you can afford student rent in the UK. Enter your maintenance loan and income to get your maximum affordable rent instantly." />
        <link rel="canonical" href="https://scholartools.co/student-rent-calculator" />
        <meta property="og:title" content="Student Rent Affordability Calculator UK | ScholarTools" />
        <meta property="og:description" content="Can you afford student rent in the UK? Calculate your maximum affordable rent based on your maintenance loan and income." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb">
              <Link href="/">Home</Link> / Student Rent Calculator
            </div>
            <h1>🏠 Student Rent Affordability Calculator UK</h1>
            <p>Enter your maintenance loan and income to find out exactly what rent you can afford — and whether halls or private renting makes more financial sense for you.</p>
          </div>

          {/* Loan Reference Banner */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
            <strong>2025–26 Maintenance Loan:</strong> Up to <strong>£13,022</strong> (London) · Up to <strong>£10,227</strong> (outside London) · Up to <strong>£7,535</strong> (at home) · <strong>2026–27:</strong> Up to <strong>£14,135</strong> (London) · Up to <strong>£10,830</strong> (outside London) · Up to <strong>£9,118</strong> (at home). Amounts are means-tested based on household income.
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="field">
                <label className="label">Annual Maintenance Loan (£)</label>
                <input className="input" type="number" placeholder="e.g. 8877"
                  value={loanAnnual} onChange={e => setLoanAnnual(e.target.value)} />
                <div className="text-muted" style={{ marginTop: 5 }}>Your full year loan amount</div>
              </div>

              <div className="field">
                <label className="label">Extra Monthly Income (£)</label>
                <input className="input" type="number" placeholder="e.g. 400"
                  value={extraMonthly} onChange={e => setExtraMonthly(e.target.value)} />
                <div className="text-muted" style={{ marginTop: 5 }}>Part-time job, family support etc.</div>
              </div>

              <div className="field">
                <label className="label">Monthly Expenses Excluding Rent (£)</label>
                <input className="input" type="number" placeholder="e.g. 300"
                  value={expenses} onChange={e => setExpenses(e.target.value)} />
                <div className="text-muted" style={{ marginTop: 5 }}>Food, transport, phone, subscriptions</div>
              </div>

              <div className="field">
                <label className="label">Rent You Are Considering (£/month)</label>
                <input className="input" type="number" placeholder="e.g. 650"
                  value={rent} onChange={e => setRent(e.target.value)} />
                <div className="text-muted" style={{ marginTop: 5 }}>Leave blank to see recommendations only</div>
              </div>
            </div>

            <div className="btn-group" style={{ marginTop: 8 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate Affordability →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>

                {/* Income Summary */}
                <div className="stat-grid" style={{ marginBottom: 16 }}>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: 'var(--accent)' }}>£{result.monthlyLoan}</div>
                    <div className="stat-lbl">Monthly Loan</div>
                  </div>
                  <div className="stat-box" style={{ background: '#EFF6FF', border: '1.5px solid #2563EB' }}>
                    <div className="stat-val" style={{ color: '#1D4ED8' }}>£{result.totalMonthlyIncome}</div>
                    <div className="stat-lbl">Total Monthly Income</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669' }}>£{result.recommended30}</div>
                    <div className="stat-lbl">Recommended Max Rent (30%)</div>
                  </div>
                </div>

                {/* Affordability Rating */}
                {result.hasRent && (
                  <div style={{ background: result.ratingBg, border: `2px solid ${result.ratingColor}`, borderRadius: 'var(--radius-sm)', padding: 20, marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: result.ratingColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                      Affordability Rating
                    </div>
                    <div style={{ fontSize: 40, marginBottom: 4 }}>{result.ratingEmoji}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: result.ratingColor, marginBottom: 8 }}>{result.rating}</div>
                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>{result.ratingDesc}</div>

                    {/* Rent percentage bar */}
                    <div style={{ marginTop: 16, maxWidth: 400, margin: '16px auto 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280', marginBottom: 4 }}>
                        <span>0%</span>
                        <span style={{ color: '#059669', fontWeight: 600 }}>30% ideal</span>
                        <span style={{ color: '#D97706' }}>45%</span>
                        <span style={{ color: '#DC2626' }}>60%+</span>
                      </div>
                      <div style={{ height: 12, background: 'linear-gradient(to right, #059669 0%, #059669 30%, #D97706 45%, #DC2626 100%)', borderRadius: 6, position: 'relative' }}>
                        <div style={{
                          position: 'absolute', top: -4,
                          left: `${Math.min(95, parseFloat(result.rentPct))}%`,
                          transform: 'translateX(-50%)',
                          width: 20, height: 20, borderRadius: '50%',
                          background: result.ratingColor,
                          border: '3px solid white',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                        }} />
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 6, fontSize: 13, fontWeight: 600, color: result.ratingColor }}>
                        Your rent is {result.rentPct}% of your income
                      </div>
                    </div>
                  </div>
                )}

                {/* Remaining money */}
                {result.hasRent && (
                  <div style={{ marginBottom: 16 }}>
                    <div className="stat-grid">
                      <div className="stat-box" style={{
                        background: parseFloat(result.leftAfterRentAndExpenses) >= 0 ? '#ECFDF5' : '#FEF2F2',
                        border: `1.5px solid ${parseFloat(result.leftAfterRentAndExpenses) >= 0 ? '#059669' : '#DC2626'}`
                      }}>
                        <div className="stat-val" style={{ color: parseFloat(result.leftAfterRentAndExpenses) >= 0 ? '#059669' : '#DC2626', fontSize: 22 }}>
                          {parseFloat(result.leftAfterRentAndExpenses) >= 0 ? '+' : ''}£{result.leftAfterRentAndExpenses}
                        </div>
                        <div className="stat-lbl">Left per month after rent and expenses</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-val" style={{ fontSize: 22, color: '#DC2626' }}>£{result.deficitRentLevel}</div>
                        <div className="stat-lbl">Rent level where you start going into deficit</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Halls vs Private Decision */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 12 }}>
                    🏠 Halls vs Private Renting — What Makes Sense For You
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: '#EFF6FF', borderRadius: 'var(--radius-sm)', padding: 14 }}>
                      <div style={{ fontWeight: 600, color: '#1D4ED8', marginBottom: 8, fontSize: 13 }}>🏢 University Halls</div>
                      <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                        ✓ Bills usually included<br />
                        ✓ No deposit typically needed<br />
                        ✓ Guaranteed for first year<br />
                        ✓ Easy to meet people<br />
                        ✗ Often more expensive per room<br />
                        ✗ Less flexibility on contract length
                      </div>
                    </div>
                    <div style={{ background: '#F0FDF4', borderRadius: 'var(--radius-sm)', padding: 14 }}>
                      <div style={{ fontWeight: 600, color: '#065F46', marginBottom: 8, fontSize: 13 }}>🏠 Private Renting</div>
                      <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                        ✓ Often cheaper per room<br />
                        ✓ More space and privacy<br />
                        ✓ Choose your housemates<br />
                        ✓ Flexible location<br />
                        ✗ Bills added separately<br />
                        ✗ Deposit required (5 weeks rent)
                      </div>
                    </div>
                  </div>
                  {result.totalMonthlyIncome && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                      💡 <strong>Based on your income of £{result.totalMonthlyIncome}/month:</strong> Your comfortable rent ceiling is <strong style={{ color: '#059669' }}>£{result.recommended30}/month</strong>. If halls in your city cost more than this, private renting with housemates splitting bills may be the smarter financial choice.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* City Rent Data */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>Average Student Rent by UK City (2025–26)</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Weekly rent figures below — multiply by 4.33 for monthly equivalent. Prices vary significantly by area, distance from campus, and whether bills are included.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {cityRents.map(c => (
                <div key={c.city} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>{c.city}</div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 12 }}>
                      <span style={{ color: 'var(--text-2)' }}>Halls: </span>
                      <strong style={{ color: '#1D4ED8' }}>{c.halls}/week</strong>
                    </div>
                    <div style={{ fontSize: 12 }}>
                      <span style={{ color: 'var(--text-2)' }}>Private: </span>
                      <strong style={{ color: '#059669' }}>{c.private}/week</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{c.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
              Sources: Unipol, Accommodation for Students, Save the Student 2025–26 survey. Prices are weekly averages and vary by property type and distance from campus.
            </div>
          </div>

          {/* SEO Info Section */}
          <div className="tool-info">
            <h2>Student Rent Affordability Calculator UK</h2>
            <p>This student rent affordability calculator UK tool helps you work out exactly how much rent you can afford based on your maintenance loan and any additional income. The widely used 30% rule suggests spending no more than 30% of your monthly income on rent, leaving enough for food, transport, and unexpected costs.</p>
            <p>UK students living outside London receive up to £10,227 in maintenance loan for 2025–26 (rising to £10,830 for 2026–27), which works out to roughly £850 per month across a standard academic year. Comparing this against average rents in your chosen city is the smartest first step before signing any tenancy agreement.</p>
            <p>Use our <a href="/emi-calculator">Loan EMI Calculator</a> if you are planning to take out a student loan for tuition fees, or our <a href="/study-hours-planner">Study Hours Planner</a> to balance part-time work with your academic schedule.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
