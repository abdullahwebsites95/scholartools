import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const COUNTRIES = {
  uk: {
    name: 'United Kingdom 🇬🇧',
    currency: '£',
    minWage: 11.44,
    minWageNote: 'National Living Wage (21+) April 2024. Rate is £8.60 for under 21.',
    termLimit: 20,
    holidayLimit: null,
    limitType: 'weekly',
    termNote: 'During term time on a Student visa (Tier 4). Full-time during official university holidays.',
    holidayNote: 'Unlimited hours during official university holiday periods.',
    warningAt: 20,
    rules: [
      'Maximum 20 hours per week during term time',
      'Full-time work allowed during official university holidays',
      'On-campus work counts toward the 20 hour limit',
      'Volunteering and work placements may have different rules',
      'Sponsored students on government-funded courses may have different limits',
    ]
  },
  australia: {
    name: 'Australia 🇦🇺',
    currency: 'A$',
    minWage: 23.23,
    minWageNote: 'National Minimum Wage per hour (2024). Casual loading adds 25% on top.',
    termLimit: 48,
    holidayLimit: null,
    limitType: 'fortnightly',
    termNote: 'Maximum 48 hours per fortnight (2 weeks) during semester.',
    holidayNote: 'Unlimited hours during official course breaks and holidays.',
    warningAt: 48,
    rules: [
      '48 hours per fortnight during semester (not per week)',
      'Unlimited hours during registered course breaks',
      'A fortnight is any 14-day period — not fixed to a calendar fortnight',
      'Partners of student visa holders have separate work rights',
      'Some healthcare and welfare courses have no work restrictions',
    ]
  },
  canada: {
    name: 'Canada 🇨🇦',
    currency: 'C$',
    minWage: 17.30,
    minWageNote: 'Federal minimum wage (April 2024). Provincial rates may be higher.',
    termLimit: 20,
    holidayLimit: null,
    limitType: 'weekly',
    termNote: 'Off-campus work limited to 20 hours per week during academic sessions.',
    holidayNote: 'Full-time during scheduled breaks (winter, summer, spring).',
    warningAt: 20,
    rules: [
      '20 hours per week off-campus during academic sessions',
      'Full-time during scheduled breaks if returning to studies',
      'On-campus work has no hour limits',
      'Co-op and internship placements are separate from this limit',
      'Must have a valid study permit with work authorization',
    ]
  },
  usa: {
    name: 'United States 🇺🇸',
    currency: '$',
    minWage: 7.25,
    minWageNote: 'Federal minimum wage. Many states have higher minimums (e.g. California $16, New York $16).',
    termLimit: 20,
    holidayLimit: null,
    limitType: 'weekly',
    termNote: 'On-campus work up to 20 hours/week. Off-campus requires separate CPT or OPT authorization.',
    holidayNote: 'Full-time on-campus work during holidays. Off-campus still requires authorization.',
    warningAt: 20,
    isComplex: true,
    rules: [
      'F-1 students may work on-campus up to 20 hours/week during term',
      'Off-campus work requires Curricular Practical Training (CPT) or Optional Practical Training (OPT)',
      'OPT allows 12 months of full-time off-campus work after graduation',
      'STEM graduates can apply for 24-month OPT extension',
      'Unauthorized off-campus work can result in visa termination',
    ]
  },
  ireland: {
    name: 'Ireland 🇮🇪',
    currency: '€',
    minWage: 12.70,
    minWageNote: 'National Minimum Wage (January 2024).',
    termLimit: 20,
    holidayLimit: 40,
    limitType: 'weekly',
    termNote: 'Maximum 20 hours per week during term time.',
    holidayNote: 'Up to 40 hours per week during holiday periods (June–September and Christmas).',
    warningAt: 20,
    rules: [
      '20 hours per week maximum during term time',
      '40 hours per week during summer (June to September) and Christmas holidays',
      'Applies to non-EEA students on valid student permission',
      'Must be enrolled in a full-time course of at least 1 year',
      'Work permit is not required — permission is part of student visa',
    ]
  },
}

export default function StudentWorkHoursCalculator() {
  const [country, setCountry] = useState('uk')
  const [period, setPeriod] = useState('term')
  const [hoursWorked, setHoursWorked] = useState('')
  const [wage, setWage] = useState('')
  const [result, setResult] = useState(null)

  const c = COUNTRIES[country]
  const isFortnightly = c.limitType === 'fortnightly'
  const limit = period === 'term' ? c.termLimit : (c.holidayLimit || 999)
  const isUnlimited = period === 'holiday' && !c.holidayLimit

  const calculate = () => {
    const hours = parseFloat(hoursWorked)
    const hourlyWage = parseFloat(wage) || c.minWage
    if (isNaN(hours) || hours < 0) return

    const periodLabel = isFortnightly ? 'fortnight' : 'week'
    const overLimit = !isUnlimited && hours > limit
    const remaining = isUnlimited ? 999 : Math.max(0, limit - hours)
    const overBy = Math.max(0, hours - limit)

    const weeklyHours = isFortnightly ? hours / 2 : hours
    const weeklyEarnings = weeklyHours * hourlyWage
    const monthlyEarnings = weeklyEarnings * 4.33
    const annualEarnings = weeklyEarnings * 52

    setResult({
      hours, limit, remaining, overBy, overLimit, isUnlimited,
      periodLabel, hourlyWage,
      weeklyEarnings: weeklyEarnings.toFixed(2),
      monthlyEarnings: monthlyEarnings.toFixed(2),
      annualEarnings: annualEarnings.toFixed(2),
      pct: isUnlimited ? 0 : Math.min(100, (hours / limit) * 100),
    })
  }

  const reset = () => { setHoursWorked(''); setWage(''); setResult(null) }

  return (
    <Layout>
      <Head>
        <title>International Student Work Hours Calculator — UK, Australia, Canada | ScholarTools</title>
        <meta name="description" content="Calculate how many hours you can work as an international student. Covers UK, Australia, Canada, USA and Ireland visa work limits. Free tool with earnings calculator." />
        <link rel="canonical" href="https://scholartools.co/international-student-work-hours-calculator" />
        <meta property="og:title" content="International Student Work Hours Calculator | ScholarTools" />
        <meta property="og:description" content="Free tool covering student visa work hour limits for UK, Australia, Canada, USA and Ireland. Calculate your earnings and check if you are within your visa limits." />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / International Student Work Hours Calculator</div>
            <h1>🌍 International Student Work Hours Calculator</h1>
            <p>Check how many hours you can legally work on your student visa and calculate your potential earnings. Covers UK, Australia, Canada, USA and Ireland.</p>
          </div>

          {/* Disclaimer */}
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
            ⚠️ <strong>Important:</strong> Visa rules change frequently. Always verify current limits with your university's international student office or the official immigration authority of your study country before working.
          </div>

          <div className="card">
            {/* Country Selector */}
            <div className="field">
              <label className="label">Study Country</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {Object.entries(COUNTRIES).map(([key, val]) => (
                  <button key={key}
                    className={`btn btn-sm ${country === key ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setCountry(key); setResult(null) }}>
                    {val.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Term/Holiday Toggle */}
            <div className="field">
              <label className="label">Current Period</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className={`btn ${period === 'term' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setPeriod('term'); setResult(null) }}>
                  📚 Term Time
                </button>
                <button className={`btn ${period === 'holiday' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }} onClick={() => { setPeriod('holiday'); setResult(null) }}>
                  🏖️ Holiday / Break
                </button>
              </div>
            </div>

            {/* Work Hours Input */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field">
                <label className="label">
                  Hours Worked This {isFortnightly ? 'Fortnight' : 'Week'}
                </label>
                <input className="input" type="number" min="0" max="168"
                  placeholder={isFortnightly ? 'e.g. 40' : 'e.g. 18'}
                  value={hoursWorked} onChange={e => { setHoursWorked(e.target.value); setResult(null) }} />
              </div>
              <div className="field">
                <label className="label">Hourly Wage ({c.currency})</label>
                <input className="input" type="number" step="0.01"
                  placeholder={`e.g. ${c.minWage}`}
                  value={wage} onChange={e => { setWage(e.target.value); setResult(null) }} />
                <div className="text-muted" style={{ marginTop: 4 }}>{c.minWageNote}</div>
              </div>
            </div>

            <div className="btn-group">
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Check My Hours →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Status */}
                {result.isUnlimited ? (
                  <div style={{ background: '#ECFDF5', border: '2px solid #059669', borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>No Hour Limit During Holidays</div>
                    <div style={{ fontSize: 13, color: '#065F46', marginTop: 8 }}>You can work full-time during this holiday period. No visa restriction applies.</div>
                  </div>
                ) : result.overLimit ? (
                  <div style={{ background: '#FEF2F2', border: '2px solid #DC2626', borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>🚨</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#DC2626' }}>Over Your Visa Limit</div>
                    <div style={{ fontSize: 13, color: '#991B1B', marginTop: 8 }}>
                      You are <strong>{result.overBy} hours over</strong> the {result.limit}-hour {result.periodLabel} limit. Working beyond your visa limit can result in serious immigration consequences.
                    </div>
                  </div>
                ) : (
                  <div style={{ background: result.pct >= 80 ? '#FFF7ED' : '#ECFDF5', border: `2px solid ${result.pct >= 80 ? '#D97706' : '#059669'}`, borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>{result.pct >= 80 ? '⚠️' : '✅'}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: result.pct >= 80 ? '#D97706' : '#059669' }}>
                      {result.remaining} Hours Remaining This {result.periodLabel}
                    </div>
                    <div style={{ fontSize: 13, color: result.pct >= 80 ? '#92400E' : '#065F46', marginTop: 8 }}>
                      {result.pct >= 80
                        ? `You have used ${result.hours} of your ${result.limit} hour limit. Be careful — you are close to the maximum.`
                        : `You have worked ${result.hours} of ${result.limit} allowed hours. You are within your visa limits.`}
                    </div>

                    {/* Progress bar */}
                    <div style={{ margin: '14px auto 0', maxWidth: 360 }}>
                      <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${result.pct}%`, background: result.pct >= 80 ? '#D97706' : '#059669', borderRadius: 5, transition: 'width 0.5s' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>
                        <span>0 hrs</span>
                        <span style={{ fontWeight: 600 }}>{result.hours} hrs used</span>
                        <span>{result.limit} hrs max</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Earnings */}
                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669', fontSize: 18 }}>{c.currency}{result.weeklyEarnings}</div>
                    <div className="stat-lbl">Weekly Earnings</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669', fontSize: 18 }}>{c.currency}{result.monthlyEarnings}</div>
                    <div className="stat-lbl">Monthly Earnings</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669', fontSize: 18 }}>{c.currency}{result.annualEarnings}</div>
                    <div className="stat-lbl">Annual Earnings</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Country Rules */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 4 }}>
              Work Rules — {c.name}
            </h2>
            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 14, fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 6 }}><strong>Term time:</strong> {c.termNote}</div>
              <div><strong>Holiday period:</strong> {c.holidayNote}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {c.rules.map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  <span style={{ color: '#2563EB', flexShrink: 0 }}>→</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
            {c.isComplex && (
              <div style={{ marginTop: 12, background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>
                🚨 The USA has the most complex student work rules. Off-campus work without proper authorization is a serious visa violation. Always consult your Designated School Official (DSO) before working off-campus.
              </div>
            )}
          </div>

          {/* Quick reference table */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>Quick Reference — All Countries</h2>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Term Limit</th>
                    <th>Holiday Limit</th>
                    <th>Min Wage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(COUNTRIES).map(([key, val]) => (
                    <tr key={key} style={{ background: key === country ? 'var(--accent-light)' : undefined }}>
                      <td style={{ fontSize: 13, fontWeight: key === country ? 600 : 400 }}>{val.name}</td>
                      <td style={{ fontSize: 13 }}>
                        {val.limitType === 'fortnightly' ? `${val.termLimit} hrs/fortnight` : `${val.termLimit} hrs/week`}
                      </td>
                      <td style={{ fontSize: 13 }}>{val.holidayLimit ? `${val.holidayLimit} hrs/week` : 'Unlimited'}</td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>{val.currency}{val.minWage}/hr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Info */}
          <div className="tool-info">
            <h2>International Student Work Hours Calculator</h2>
            <p>This international student work hours calculator helps students on study visas check exactly how many hours they can legally work and calculate their potential earnings based on local minimum wage rates. Work hour limits for international students vary significantly by country — the UK and Canada allow 20 hours per week during term time, Australia permits 48 hours per fortnight, and Ireland allows 20 hours during term rising to 40 hours during holidays.</p>
            <p>Exceeding your visa work hour limit is a serious immigration violation that can affect your visa status, future visa applications, and right to remain in your study country. Always check with your university's international student office if you are unsure about your specific situation, as rules can vary by visa type, course level, and government updates.</p>
            <p>Also use our <a href="/student-rent-calculator">Student Rent Calculator UK</a> to plan your UK living costs, or our <a href="/study-hours-planner">Study Hours Planner</a> to balance work and study time effectively.</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
