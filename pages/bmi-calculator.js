import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

export default function BMICalculator() {
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [result, setResult] = useState(null)

  const calculate = () => {
    let w = parseFloat(weight)
    let h = unit === 'metric' ? parseFloat(height) / 100 : ((parseFloat(heightFt) * 12) + parseFloat(heightIn || 0)) * 0.0254
    let wKg = unit === 'metric' ? w : w * 0.453592
    if (!wKg || !h || isNaN(wKg) || isNaN(h)) return
    const bmi = wKg / (h * h)
    let category, color, advice
    if (bmi < 18.5) { category = 'Underweight'; color = '#3B82F6'; advice = 'You are below the healthy weight range. Consider consulting a nutritionist to develop a healthy weight gain plan.' }
    else if (bmi < 25) { category = 'Normal Weight'; color = '#059669'; advice = 'You are within the healthy weight range. Maintain your current lifestyle with regular exercise and balanced diet.' }
    else if (bmi < 30) { category = 'Overweight'; color = '#D97706'; advice = 'You are slightly above the healthy range. Regular exercise and mindful eating can help you reach a healthier weight.' }
    else { category = 'Obese'; color = '#DC2626'; advice = 'Your BMI indicates obesity. It is recommended to consult a healthcare provider for a personalised weight management plan.' }
    const idealMin = (18.5 * h * h).toFixed(1)
    const idealMax = (24.9 * h * h).toFixed(1)
    setResult({ bmi: bmi.toFixed(1), category, color, advice, idealMin, idealMax })
  }

  const reset = () => { setWeight(''); setHeight(''); setHeightFt(''); setHeightIn(''); setAge(''); setResult(null) }

  const bmiVal = result ? parseFloat(result.bmi) : 0
  const pct = Math.min(100, Math.max(0, ((bmiVal - 10) / 30) * 100))

  return (
    <Layout>
      <Head>
        <title>BMI Calculator — Free Body Mass Index Calculator | ScholarTools</title>
        <meta name="description" content="Calculate your BMI instantly with our free Body Mass Index calculator. Supports metric and imperial units. Find your healthy weight range." />
        <link rel="canonical" href="https://scholartools.co/bmi-calculator" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / BMI Calculator</div>
            <h1>⚖️ BMI Calculator</h1>
            <p>Enter your height and weight to calculate your Body Mass Index and find your healthy weight range.</p>
          </div>

          <div className="card">
            <div className="field">
              <label className="label">Unit System</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className={`btn ${unit === 'metric' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => { setUnit('metric'); setResult(null) }}>Metric (kg, cm)</button>
                <button className={`btn ${unit === 'imperial' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => { setUnit('imperial'); setResult(null) }}>Imperial (lbs, ft)</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div className="field">
                <label className="label">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
                <input className="input" type="number" placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'} value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              {unit === 'metric' ? (
                <div className="field">
                  <label className="label">Height (cm)</label>
                  <input className="input" type="number" placeholder="e.g. 175" value={height} onChange={e => setHeight(e.target.value)} />
                </div>
              ) : (
                <div className="field">
                  <label className="label">Height (ft / in)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input" type="number" placeholder="ft" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
                    <input className="input" type="number" placeholder="in" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
                  </div>
                </div>
              )}
              <div className="field">
                <label className="label">Age (optional)</label>
                <input className="input" type="number" placeholder="e.g. 22" value={age} onChange={e => setAge(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Gender (optional)</label>
                <select className="select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="btn-group" style={{ marginTop: 8 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>Calculate BMI →</button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {result && (
              <div style={{ marginTop: 24 }}>
                <div style={{ background: 'var(--bg)', border: `2px solid ${result.color}`, borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: result.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your BMI</div>
                  <div style={{ fontSize: 56, fontWeight: 800, color: result.color, lineHeight: 1 }}>{result.bmi}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: result.color, marginTop: 6 }}>{result.category}</div>
                </div>

                {/* BMI Scale */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ height: 12, borderRadius: 6, background: 'linear-gradient(to right, #3B82F6 0%, #059669 30%, #D97706 60%, #DC2626 100%)', position: 'relative', marginBottom: 6 }}>
                    <div style={{ position: 'absolute', top: -4, left: `${pct}%`, transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: result.color, border: '3px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-2)' }}>
                    <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                  </div>
                </div>

                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="stat-val" style={{ fontSize: 18 }}>{result.idealMin}–{result.idealMax} {unit === 'metric' ? 'kg' : 'lbs'}</div>
                    <div className="stat-lbl">Healthy Weight Range</div>
                  </div>
                  <div className="stat-box" style={{ background: result.color + '15', border: `1px solid ${result.color}` }}>
                    <div className="stat-val" style={{ color: result.color, fontSize: 18 }}>{result.category}</div>
                    <div className="stat-lbl">BMI Category</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: 16, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
                  💡 {result.advice}
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>What is BMI and How is it Calculated?</h2>
            <p>BMI (Body Mass Index) is a measure of body fat based on height and weight. It is calculated by dividing your weight in kilograms by the square of your height in metres: BMI = kg/m².</p>
            <p>The standard BMI categories are: Underweight (below 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (30 and above). These ranges apply to most adults aged 18 to 65.</p>
            <p>BMI is a useful screening tool but it does not directly measure body fat. Athletes may have a high BMI due to muscle mass rather than fat. Always consult a healthcare professional for a complete health assessment.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
