import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

const conversions = [
  { label: 'UPPERCASE', fn: t => t.toUpperCase(), icon: '🔠' },
  { label: 'lowercase', fn: t => t.toLowerCase(), icon: '🔡' },
  { label: 'Title Case', fn: t => t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()), icon: '📝' },
  { label: 'Sentence case', fn: t => t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()), icon: '📄' },
  { label: 'camelCase', fn: t => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()), icon: '💻' },
  { label: 'snake_case', fn: t => t.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''), icon: '🐍' },
  { label: 'kebab-case', fn: t => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), icon: '🍢' },
  { label: 'Reverse Text', fn: t => t.split('').reverse().join(''), icon: '↩️' },
]

export default function TextCaseConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeLabel, setActiveLabel] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = (conv) => {
    setOutput(conv.fn(input))
    setActiveLabel(conv.label)
    setCopied(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Layout>
      <Head>
        <title>Text Case Converter — Free Online Case Changer | ScholarTools</title>
        <meta name="description" content="Convert text to uppercase, lowercase, title case, sentence case, camelCase and more. Free online text case converter for students and developers." />
        <link rel="canonical" href="https://scholartools.co/text-case-converter" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Text Case Converter</div>
            <h1>🔤 Text Case Converter</h1>
            <p>Paste your text, choose a conversion, and get the result instantly. One click to copy.</p>
          </div>

          <div className="card">
            <div className="field">
              <label className="label">Your Text</label>
              <textarea className="textarea" style={{ minHeight: 140 }}
                placeholder="Paste or type your text here..."
                value={input} onChange={e => { setInput(e.target.value); setOutput(''); setActiveLabel('') }} />
            </div>

            <label className="label">Choose Conversion</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 20 }}>
              {conversions.map(c => (
                <button key={c.label}
                  className={`btn btn-sm ${activeLabel === c.label ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', gap: 8 }}
                  onClick={() => convert(c)}
                  disabled={!input}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {output && (
              <div>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <label className="label" style={{ margin: 0 }}>Result — {activeLabel}</label>
                  <button className="btn btn-success btn-sm" onClick={copy}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                </div>
                <div style={{ background: 'var(--accent-light)', border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: 16, fontSize: 15, lineHeight: 1.7, wordBreak: 'break-word', minHeight: 80 }}>
                  {output}
                </div>
                <div className="flex-between" style={{ marginTop: 12 }}>
                  <div className="text-muted">{output.length} characters · {output.trim() ? output.trim().split(/\s+/).length : 0} words</div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setInput(output); setOutput(''); setActiveLabel('') }}>
                    Use as new input
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>When Do Students Need Text Case Conversion?</h2>
            <p>Title Case is used for essay headings, report titles, and reference lists. Sentence case is standard for body paragraphs and most academic writing. UPPERCASE is often used for acronyms and emphasis in notes.</p>
            <p>For students learning programming or web development, camelCase and snake_case are the two most common formats for naming variables and functions in code.</p>
            <p>Use the "Use as new input" button to chain multiple conversions — for example, converting to lowercase first and then to Title Case for cleaner results.</p>
            <p>After converting your text case, use our <a href="/word-counter">Word Counter</a> to check your essay length or our <a href="/citation-generator">Citation Generator</a> to format your references correctly.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
