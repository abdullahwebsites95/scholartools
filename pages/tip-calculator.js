import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const tipPresets = [10, 15, 18, 20, 25]

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tip, setTip] = useState(15)
  const [customTip, setCustomTip] = useState('')
  const [people, setPeople] = useState('1')
  const [useCustom, setUseCustom] = useState(false)

  const billVal = parseFloat(bill) || 0
  const tipPct = useCustom ? (parseFloat(customTip) || 0) : tip
  const peopleVal = Math.max(1, parseInt(people) || 1)
  const tipAmount = (billVal * tipPct) / 100
  const total = billVal + tipAmount
  const perPerson = total / peopleVal
  const tipPerPerson = tipAmount / peopleVal

  return (
    <Layout>
      <Head>
        <title>Tip Calculator — Split Bill & Tip Calculator | ScholarTools</title>
        <meta name="description" content="Calculate tip amount and split bills easily. Free online tip calculator for restaurants, food delivery and group dining. No signup needed." />
        <link rel="canonical" href="https://scholartools.co/tip-calculator" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Tip Calculator</div>
            <h1>💰 Tip Calculator</h1>
            <p>Calculate the tip amount and split the bill evenly among friends. Instant results as you type.</p>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="field">
                <label className="label">Bill Amount</label>
                <input className="input" type="number" step="0.01" placeholder="e.g. 2500"
                  value={bill} onChange={e => setBill(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Number of People</label>
                <input className="input" type="number" min="1" placeholder="e.g. 4"
                  value={people} onChange={e => setPeople(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label className="label">Tip Percentage</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {tipPresets.map(t => (
                  <button key={t}
                    className={`btn btn-sm ${!useCustom && tip === t ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, minWidth: 55 }}
                    onClick={() => { setTip(t); setUseCustom(false) }}>
                    {t}%
                  </button>
                ))}
                <button
                  className={`btn btn-sm ${useCustom ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, minWidth: 55 }}
                  onClick={() => setUseCustom(true)}>
                  Custom
                </button>
              </div>
              {useCustom && (
                <input className="input" type="number" placeholder="Enter custom tip %"
                  value={customTip} onChange={e => setCustomTip(e.target.value)} />
              )}
            </div>

            {billVal > 0 && (
              <div style={{ marginTop: 20 }}>
                <div className="stat-grid">
                  <div className="stat-box" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
                    <div className="stat-val" style={{ color: 'var(--accent)' }}>{tipPct}%</div>
                    <div className="stat-lbl">Tip Rate</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{tipAmount.toFixed(2)}</div>
                    <div className="stat-lbl">Tip Amount</div>
                  </div>
                  <div className="stat-box" style={{ background: 'var(--green-light)', border: '1px solid var(--green)' }}>
                    <div className="stat-val" style={{ color: 'var(--green)' }}>{total.toFixed(2)}</div>
                    <div className="stat-lbl">Total Bill</div>
                  </div>
                </div>

                {peopleVal > 1 && (
                  <div style={{ marginTop: 16, background: 'var(--primary)', borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Each Person Pays</div>
                    <div style={{ fontSize: 48, fontWeight: 800, color: 'white', lineHeight: 1 }}>{perPerson.toFixed(2)}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
                      Includes {tipPerPerson.toFixed(2)} tip per person · Split {peopleVal} ways
                    </div>
                  </div>
                )}

                {peopleVal === 1 && (
                  <div style={{ marginTop: 16, background: 'var(--primary)', borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Total to Pay</div>
                    <div style={{ fontSize: 48, fontWeight: 800, color: 'white', lineHeight: 1 }}>{total.toFixed(2)}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Bill {billVal.toFixed(2)} + Tip {tipAmount.toFixed(2)}</div>
                  </div>
                )}

                <div style={{ marginTop: 16, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Quick Comparison</div>
                  {tipPresets.map(t => {
                    const ta = (billVal * t) / 100
                    const tot = billVal + ta
                    return (
                      <div key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                        <span style={{ color: 'var(--text-2)' }}>{t}% tip</span>
                        <span>Tip: <strong>{ta.toFixed(2)}</strong></span>
                        <span style={{ color: 'var(--accent)' }}>Total: <strong>{tot.toFixed(2)}</strong></span>
                        {peopleVal > 1 && <span style={{ color: 'var(--green)' }}>Each: <strong>{(tot / peopleVal).toFixed(2)}</strong></span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>How Much Should You Tip?</h2>
            <p>Tipping customs vary by country and situation. In the USA, 15–20% is standard for restaurant service. In Pakistan and most South Asian countries, tipping is appreciated but not always expected — 10–15% is considered generous for good service.</p>
            <p>For food delivery, 10–15% of the order value is a common tip range. For exceptional service you can always tip more. For poor service, tipping less or not at all is also acceptable in most cultures.</p>
            <p>When splitting a bill among friends, always calculate the tip on the full bill first, then divide the total equally. This is simpler and fairer than each person calculating their own tip separately.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
