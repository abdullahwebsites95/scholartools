import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

export default function PercentageCalculator() {
  const [tab, setTab] = useState(0)
  const [v, setV] = useState({ a: '', b: '', c: '', d: '', e: '', f: '' })
  const set = (k, val) => setV(prev => ({ ...prev, [k]: val }))

  const r0 = (!isNaN(v.a) && !isNaN(v.b) && v.a && v.b) ? ((parseFloat(v.a) / 100) * parseFloat(v.b)).toFixed(2) : null
  const r1 = (!isNaN(v.c) && !isNaN(v.d) && v.c && v.d && parseFloat(v.d) !== 0) ? ((parseFloat(v.c) / parseFloat(v.d)) * 100).toFixed(2) : null
  const r2 = (!isNaN(v.e) && !isNaN(v.f) && v.e && v.f && parseFloat(v.e) !== 0) ? (((parseFloat(v.f) - parseFloat(v.e)) / parseFloat(v.e)) * 100).toFixed(2) : null

  const tabs = ['X% of Y', 'X is what % of Y', '% Change']

  return (
    <Layout>
      <Head>
        <title>Percentage Calculator — Free Online Percent Calculator | ScholarTools</title>
        <meta name="description" content="Free percentage calculator. Calculate what percent of a number is, percentage change, and more. Perfect for students calculating exam scores." />
        <link rel="canonical" href="https://scholartools.co/percentage-calculator" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Percentage Calculator</div>
            <h1>🔢 Percentage Calculator</h1>
            <p>Three types of percentage calculations in one tool. Choose the one you need below.</p>
          </div>

          <div className="card">
            <div className="tabs">
              {tabs.map((t, i) => (
                <button key={i} className={`tab-btn${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
              ))}
            </div>

            {tab === 0 && (
              <div>
                <p style={{ marginBottom: 20, color: 'var(--text-2)' }}>What is <strong>X%</strong> of a number?</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <label className="label">Percentage (%)</label>
                    <input className="input" type="number" placeholder="e.g. 25" value={v.a} onChange={e => set('a', e.target.value)} />
                  </div>
                  <div style={{ paddingTop: 20, color: 'var(--text-2)', fontWeight: 600 }}>% of</div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <label className="label">Number</label>
                    <input className="input" type="number" placeholder="e.g. 200" value={v.b} onChange={e => set('b', e.target.value)} />
                  </div>
                </div>
                {r0 && (
                  <div className="result-box" style={{ marginTop: 20 }}>
                    <div className="result-title">{v.a}% of {v.b} =</div>
                    <div className="result-val">{r0}</div>
                  </div>
                )}
              </div>
            )}

            {tab === 1 && (
              <div>
                <p style={{ marginBottom: 20, color: 'var(--text-2)' }}>What percentage is <strong>X</strong> of <strong>Y</strong>?</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <label className="label">Value (X)</label>
                    <input className="input" type="number" placeholder="e.g. 45" value={v.c} onChange={e => set('c', e.target.value)} />
                  </div>
                  <div style={{ paddingTop: 20, color: 'var(--text-2)', fontWeight: 600 }}>out of</div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <label className="label">Total (Y)</label>
                    <input className="input" type="number" placeholder="e.g. 60" value={v.d} onChange={e => set('d', e.target.value)} />
                  </div>
                </div>
                {r1 && (
                  <div className="result-box" style={{ marginTop: 20 }}>
                    <div className="result-title">{v.c} is what % of {v.d}?</div>
                    <div className="result-val">{r1}%</div>
                    <div className="result-desc">Exam score: {v.c}/{v.d} = {r1}%</div>
                  </div>
                )}
              </div>
            )}

            {tab === 2 && (
              <div>
                <p style={{ marginBottom: 20, color: 'var(--text-2)' }}>Calculate the percentage <strong>increase or decrease</strong> between two numbers.</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <label className="label">Original Value</label>
                    <input className="input" type="number" placeholder="e.g. 80" value={v.e} onChange={e => set('e', e.target.value)} />
                  </div>
                  <div style={{ paddingTop: 20, color: 'var(--text-2)', fontWeight: 600 }}>→</div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <label className="label">New Value</label>
                    <input className="input" type="number" placeholder="e.g. 95" value={v.f} onChange={e => set('f', e.target.value)} />
                  </div>
                </div>
                {r2 && (
                  <div className="result-box" style={{ marginTop: 20, background: parseFloat(r2) >= 0 ? 'var(--green-light)' : 'var(--red-light)', borderColor: parseFloat(r2) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    <div className="result-title" style={{ color: parseFloat(r2) >= 0 ? 'var(--green)' : 'var(--red)' }}>Percentage Change</div>
                    <div className="result-val">{parseFloat(r2) >= 0 ? '+' : ''}{r2}%</div>
                    <div className="result-desc">{parseFloat(r2) >= 0 ? '📈 Increase' : '📉 Decrease'} from {v.e} to {v.f}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>How to Use the Percentage Calculator</h2>
            <p>This tool has three modes. Use "X% of Y" to find a percentage of a number (e.g. 20% of 500 = 100). Use "X is what % of Y" to find your exam percentage — just enter your marks and total marks. Use "% Change" to see how much something increased or decreased.</p>
            <p>The most common use for students is calculating exam scores: enter your marks obtained as X and total marks as Y to instantly see your percentage grade.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
