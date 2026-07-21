import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState, useCallback } from 'react'

// ─── Pure calculation logic (separate from UI) ────────────────────────────────

const FREQ_TO_MONTHLY = {
  weekly: (v) => v * (52 / 12),
  monthly: (v) => v,
  yearly: (v) => v / 12,
}

/**
 * Normalize a raw amount + frequency to a monthly figure.
 * For 'term' frequency, termMonths (defaulting to 4) is used.
 */
function toMonthly(amount, frequency, termMonths) {
  const v = parseFloat(amount)
  if (isNaN(v)) return 0
  if (frequency === 'term') return v / (termMonths || 4)
  return FREQ_TO_MONTHLY[frequency] ? FREQ_TO_MONTHLY[frequency](v) : v
}

/**
 * Calculate the full budget summary from income and expense line items.
 * Each item: { name, amount, frequency }
 * Returns null if there is no usable income or expense data at all.
 */
function calcBudget(incomeItems, expenseItems, termMonths) {
  const validIncome = incomeItems.filter((i) => i.name.trim() !== '' && i.amount !== '')
  const validExpenses = expenseItems.filter((i) => i.name.trim() !== '' && i.amount !== '')

  if (validIncome.length === 0 && validExpenses.length === 0) return null

  for (const i of [...validIncome, ...validExpenses]) {
    const v = parseFloat(i.amount)
    if (isNaN(v)) return { error: `"${i.name}" has an invalid amount.` }
    if (v < 0) return { error: `"${i.name}" cannot be negative.` }
  }

  const incomeBreakdown = validIncome.map((i) => ({
    name: i.name.trim(),
    monthly: +toMonthly(i.amount, i.frequency, termMonths).toFixed(2),
  }))
  const expenseBreakdown = validExpenses.map((i) => ({
    name: i.name.trim(),
    monthly: +toMonthly(i.amount, i.frequency, termMonths).toFixed(2),
  }))

  const totalIncome = +incomeBreakdown.reduce((s, i) => s + i.monthly, 0).toFixed(2)
  const totalExpenses = +expenseBreakdown.reduce((s, i) => s + i.monthly, 0).toFixed(2)
  const balance = +(totalIncome - totalExpenses).toFixed(2)

  const expenseWithShare = expenseBreakdown.map((e) => ({
    ...e,
    share: totalExpenses > 0 ? +((e.monthly / totalExpenses) * 100).toFixed(1) : 0,
  }))

  return {
    incomeBreakdown,
    expenseBreakdown: expenseWithShare,
    totalIncome,
    totalExpenses,
    balance,
    isSurplus: balance >= 0,
    termlyBalance: +(balance * (termMonths || 4)).toFixed(2),
    yearlyBalance: +(balance * 12).toFixed(2),
  }
}

// ─── Row factories ─────────────────────────────────────────────────────────────
let _id = 0
const newIncomeRow = (name = '') => ({ id: ++_id, name, amount: '', frequency: 'monthly' })
const newExpenseRow = (name = '') => ({ id: ++_id, name, amount: '', frequency: 'monthly' })

const FREQ_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'term', label: 'Per Term' },
  { value: 'yearly', label: 'Yearly' },
]

const EXPENSE_COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0D9488', '#DB2777', '#65A30D']

// ─── Component ────────────────────────────────────────────────────────────────
export default function StudentBudgetCalculator() {
  const [termMonths, setTermMonths] = useState('4')
  const [incomeRows, setIncomeRows] = useState([
    newIncomeRow('Financial Aid / Loan'),
    newIncomeRow('Part-Time Job'),
    newIncomeRow('Family Support'),
    newIncomeRow(''),
  ])
  const [expenseRows, setExpenseRows] = useState([
    newExpenseRow('Rent / Housing'),
    newExpenseRow('Food & Groceries'),
    newExpenseRow('Transport'),
    newExpenseRow('Books & Supplies'),
    newExpenseRow('Personal & Other'),
  ])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const updateIncome = useCallback((id, field, value) => {
    setIncomeRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null); setError('')
  }, [])
  const updateExpense = useCallback((id, field, value) => {
    setExpenseRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null); setError('')
  }, [])

  const addIncome = () => setIncomeRows((p) => [...p, newIncomeRow()])
  const addExpense = () => setExpenseRows((p) => [...p, newExpenseRow()])
  const removeIncome = (id) => { setIncomeRows((p) => p.filter((r) => r.id !== id)); setResult(null) }
  const removeExpense = (id) => { setExpenseRows((p) => p.filter((r) => r.id !== id)); setResult(null) }

  const calculate = () => {
    setError(''); setResult(null)
    const tm = parseInt(termMonths) || 4
    if (tm <= 0 || tm > 12) { setError('Term length must be between 1 and 12 months.'); return }
    const res = calcBudget(incomeRows, expenseRows, tm)
    if (!res) { setError('Please enter at least one income or expense item.'); return }
    if (res.error) { setError(res.error); return }
    setResult(res)
  }

  const reset = () => {
    setIncomeRows([newIncomeRow('Financial Aid / Loan'), newIncomeRow('Part-Time Job'), newIncomeRow('Family Support'), newIncomeRow('')])
    setExpenseRows([newExpenseRow('Rent / Housing'), newExpenseRow('Food & Groceries'), newExpenseRow('Transport'), newExpenseRow('Books & Supplies'), newExpenseRow('Personal & Other')])
    setTermMonths('4')
    setResult(null); setError('')
  }

  return (
    <Layout>
      <Head>
        <title>Student Budget Calculator — Free Monthly & Term Budget Tool | ScholarTools</title>
        <meta
          name="description"
          content="Calculate your student budget instantly. Enter income and expenses in any frequency — weekly, monthly, per term or yearly — and see your true monthly surplus or deficit."
        />
        <link rel="canonical" href="https://scholartools.co/student-budget-calculator" />
        <meta property="og:title" content="Student Budget Calculator | ScholarTools" />
        <meta
          property="og:description"
          content="Free student budget calculator. Enter income and expenses in any frequency to see your monthly surplus or deficit, with a full spending breakdown."
        />
      </Head>

      <div className="tool-page">
        <div className="tool-container">

          {/* ── Header ── */}
          <div className="tool-header">
            <div className="tool-breadcrumb">
              <Link href="/">Home</Link> / Student Budget Calculator
            </div>
            <h1>💰 Student Budget Calculator</h1>
            <p>
              Enter your income and expenses in whatever frequency makes sense — weekly, monthly,
              per term, or yearly. The calculator normalizes everything to a monthly figure so you
              can see your true financial picture at a glance.
            </p>
          </div>

          {/* ── Term length setting ── */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              Your term length:
            </label>
            <input
              className="input"
              type="number"
              min="1"
              max="12"
              style={{ width: 80 }}
              value={termMonths}
              onChange={(e) => { setTermMonths(e.target.value); setResult(null) }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
              months (used to convert "per term" amounts — most semesters are 4, most trimesters are 3)
            </span>
          </div>

          <div className="card">
            {/* ── Income section ── */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#059669',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)',
              }}>
                💵 Income Sources
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr auto', gap: 10, padding: '0 4px', marginBottom: 8 }}>
                {['Source', 'Amount', 'Frequency', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {incomeRows.map((row, idx) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <input
                      className="input" type="text" placeholder={`Income source ${idx + 1}`}
                      value={row.name} onChange={(e) => updateIncome(row.id, 'name', e.target.value)}
                    />
                    <input
                      className="input" type="number" min="0" step="0.01" placeholder="0"
                      value={row.amount} onChange={(e) => updateIncome(row.id, 'amount', e.target.value)}
                    />
                    <select className="select" value={row.frequency} onChange={(e) => updateIncome(row.id, 'frequency', e.target.value)}>
                      {FREQ_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    {incomeRows.length > 1 ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removeIncome(row.id)} aria-label={`Remove income ${idx + 1}`}>✕</button>
                    ) : <span style={{ width: 32 }} />}
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addIncome}>
                + Add Income Source
              </button>
            </div>

            {/* ── Expense section ── */}
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#DC2626',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)',
              }}>
                🧾 Expenses
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr auto', gap: 10, padding: '0 4px', marginBottom: 8 }}>
                {['Category', 'Amount', 'Frequency', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {expenseRows.map((row, idx) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <input
                      className="input" type="text" placeholder={`Expense ${idx + 1}`}
                      value={row.name} onChange={(e) => updateExpense(row.id, 'name', e.target.value)}
                    />
                    <input
                      className="input" type="number" min="0" step="0.01" placeholder="0"
                      value={row.amount} onChange={(e) => updateExpense(row.id, 'amount', e.target.value)}
                    />
                    <select className="select" value={row.frequency} onChange={(e) => updateExpense(row.id, 'frequency', e.target.value)}>
                      {FREQ_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    {expenseRows.length > 1 ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removeExpense(row.id)} aria-label={`Remove expense ${idx + 1}`}>✕</button>
                    ) : <span style={{ width: 32 }} />}
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addExpense}>
                + Add Expense Category
              </button>
            </div>

            {/* ── Error ── */}
            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)',
                padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 16,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* ── Actions ── */}
            <div className="btn-group" style={{ marginTop: 20 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={calculate}>
                Calculate My Budget →
              </button>
              <button className="btn btn-secondary" onClick={reset}>Reset</button>
            </div>

            {/* ── Results ── */}
            {result && (
              <div style={{ marginTop: 24 }}>
                {/* Balance headline */}
                <div style={{
                  background: result.isSurplus ? '#ECFDF5' : '#FEF2F2',
                  border: `2px solid ${result.isSurplus ? '#059669' : '#DC2626'}`,
                  borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: result.isSurplus ? '#059669' : '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    {result.isSurplus ? 'Monthly Surplus' : 'Monthly Deficit'}
                  </div>
                  <div style={{ fontSize: 56, fontWeight: 800, color: result.isSurplus ? '#059669' : '#DC2626', lineHeight: 1 }}>
                    {result.isSurplus ? '+$' : '-$'}{Math.abs(result.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
                    {result.isSurplus
                      ? 'You are spending less than you earn each month.'
                      : 'You are spending more than you earn each month — see the breakdown below.'}
                  </div>
                </div>

                {/* Stats row */}
                <div className="stat-grid" style={{ marginBottom: 16 }}>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#059669' }}>${result.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="stat-lbl">Monthly Income</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#DC2626' }}>${result.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="stat-lbl">Monthly Expenses</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: result.isSurplus ? '#059669' : '#DC2626' }}>
                      {result.termlyBalance >= 0 ? '+$' : '-$'}{Math.abs(result.termlyBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="stat-lbl">Per-Term Balance</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: result.isSurplus ? '#059669' : '#DC2626' }}>
                      {result.yearlyBalance >= 0 ? '+$' : '-$'}{Math.abs(result.yearlyBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="stat-lbl">Yearly Balance</div>
                  </div>
                </div>

                {/* Expense breakdown with visual bars */}
                {result.expenseBreakdown.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                      Where Your Money Goes
                    </div>
                    {/* Stacked bar */}
                    <div style={{ height: 24, borderRadius: 6, overflow: 'hidden', display: 'flex', marginBottom: 12 }}>
                      {result.expenseBreakdown.map((e, i) => (
                        <div
                          key={i}
                          style={{ width: `${e.share}%`, background: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }}
                          title={`${e.name}: ${e.share}%`}
                        />
                      ))}
                    </div>
                    <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      {result.expenseBreakdown.map((e, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '10px 16px', borderBottom: i < result.expenseBreakdown.length - 1 ? '1px solid var(--border)' : 'none',
                          background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: EXPENSE_COLORS[i % EXPENSE_COLORS.length], flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{e.share}%</span>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>${e.monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deficit warning with suggestion */}
                {!result.isSurplus && (
                  <div style={{
                    background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px', fontSize: 13, color: '#92400E', lineHeight: 1.6,
                  }}>
                    💡 You are short by ${Math.abs(result.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month.
                    Over a full term ({termMonths || 4} months) that adds up to ${Math.abs(result.termlyBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.
                    Consider reviewing your largest expense category above, or look into part-time work if you are not already earning income.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── How it works ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 10 }}>How the Student Budget Calculator Works</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
              Student income and expenses rarely arrive on the same schedule. A part-time job pays weekly, a loan disbursement arrives once per term, and rent is due monthly. Comparing these directly is misleading — this calculator converts every entry to a common monthly figure first, so your true financial position is accurate no matter how mismatched your original frequencies are.
            </p>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>Formula Used</div>
              <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)', lineHeight: 1.8 }}>
                Monthly Balance = Total Monthly Income − Total Monthly Expenses<br />
                (weekly × 4.33, per-term ÷ term length, yearly ÷ 12)
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Worked Example</div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Item</th><th>Amount</th><th>Frequency</th><th>Monthly Equivalent</th></tr></thead>
                <tbody>
                  {[
                    ['Loan disbursement', '$2,400', 'Per term (4 months)', '$600.00'],
                    ['Part-time job', '$120', 'Weekly', '$520.00'],
                    ['Rent', '$700', 'Monthly', '$700.00'],
                    ['Groceries', '$60', 'Weekly', '$260.00'],
                  ].map(([name, amt, freq, monthly]) => (
                    <tr key={name}><td style={{ fontSize: 13 }}>{name}</td><td style={{ fontSize: 13 }}>{amt}</td><td style={{ fontSize: 13 }}>{freq}</td><td style={{ fontSize: 13, color: 'var(--accent)' }}>{monthly}</td></tr>
                  ))}
                  <tr style={{ background: 'var(--bg)', fontWeight: 700 }}>
                    <td colSpan={3} style={{ fontSize: 13 }}>Total Monthly Income ($1,120.00) − Total Monthly Expenses ($960.00)</td>
                    <td style={{ fontSize: 13, color: '#059669' }}>+$160.00 surplus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="card" style={{ marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 18, marginBottom: 14 }}>Frequently Asked Questions</h2>
            {[
              {
                q: 'Why does the calculator ask for a term length?',
                a: 'Financial aid, scholarships, and loans are often disbursed once per academic term rather than monthly. To compare a lump-sum term payment fairly against monthly expenses like rent, the calculator needs to know how many months that payment is meant to cover — most semesters are 4 months, most trimesters are 3.',
              },
              {
                q: 'What if I only have expenses and no income entered yet?',
                a: 'The calculator will still run and show your total monthly expenses with a full breakdown. Your balance will simply show as a deficit equal to your total spending until you add income sources.',
              },
              {
                q: 'How is "per term" different from "yearly"?',
                a: 'Per term uses the term length you set at the top (defaulting to 4 months) to convert a lump sum into a monthly figure. Yearly always divides by 12, regardless of your term length setting, since it represents a full calendar year.',
              },
              {
                q: 'Can I use this for a part-year budget, like just one semester?',
                a: 'Yes. The "Per-Term Balance" stat multiplies your monthly balance by your term length automatically, giving you the total surplus or deficit for that specific term rather than a full year.',
              },
              {
                q: 'Does this calculator save my data?',
                a: 'No. All calculations happen instantly in your browser and nothing is stored or sent anywhere. Refreshing the page will clear your entries.',
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 5 }}>{q}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{a}</div>
              </div>
            ))}
          </div>

          {/* ── SEO / tool-info section ── */}
          <div className="tool-info">
            <h2>Student Budget Calculator</h2>
            <p>
              This student budget calculator helps you see your true monthly financial position by normalizing every income source and expense to a common monthly figure — regardless of whether it is paid weekly, monthly, per term, or yearly. Student finances are notoriously mismatched: a scholarship might disburse once per semester while rent is due every month, making a simple side-by-side comparison misleading without conversion.
            </p>
            <p>
              Once you enter your income sources and expense categories, the calculator shows your monthly surplus or deficit, a full visual breakdown of where your money goes by category, and projections for both your current term and a full year. If you are running a deficit, the tool highlights your largest expense category so you know exactly where to look first.
            </p>
            <p>
              After budgeting your finances, use our{' '}
              <a href="/emi-calculator">Loan EMI Calculator</a> to plan any loan repayments, or check the{' '}
              <a href="/student-rent-calculator">Student Rent Calculator UK</a> if you are deciding between housing options. You can also try our{' '}
              <a href="/weighted-grade-calculator">Weighted Grade Calculator</a> to keep your academic planning on track alongside your finances.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  )
}
