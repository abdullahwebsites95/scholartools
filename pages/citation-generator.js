import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

function genAPA(type, f) {
  const year = f.year ? `(${f.year})` : '(n.d.)'
  if (type === 'website') {
    return `${f.author || 'Unknown Author'}. ${year}. *${f.title}*. ${f.site || 'Website'}. ${f.url ? f.url : ''}`
  }
  if (type === 'book') {
    return `${f.author || 'Unknown Author'}. ${year}. *${f.title}*. ${f.publisher || 'Publisher'}.`
  }
  if (type === 'journal') {
    return `${f.author || 'Unknown Author'}. ${year}. ${f.title}. *${f.journal}*, *${f.volume}*(${f.issue}), ${f.pages}. ${f.doi ? `https://doi.org/${f.doi}` : ''}`
  }
}

function genMLA(type, f) {
  const year = f.year || 'n.d.'
  if (type === 'website') {
    return `${f.author || 'Unknown Author'}. "${f.title}." *${f.site || 'Website'}*, ${year}, ${f.url || ''}.`
  }
  if (type === 'book') {
    return `${f.author || 'Unknown Author'}. *${f.title}*. ${f.publisher || 'Publisher'}, ${year}.`
  }
  if (type === 'journal') {
    return `${f.author || 'Unknown Author'}. "${f.title}." *${f.journal}*, vol. ${f.volume}, no. ${f.issue}, ${year}, pp. ${f.pages}.`
  }
}

const sourceTypes = ['website', 'book', 'journal']
const sourceLabels = { website: '🌐 Website', book: '📕 Book', journal: '📄 Journal Article' }

export default function CitationGenerator() {
  const [type, setType] = useState('website')
  const [style, setStyle] = useState('APA')
  const [fields, setFields] = useState({})
  const [copied, setCopied] = useState(false)

  const setF = (k, v) => setFields(p => ({ ...p, [k]: v }))
  const field = (label, key, placeholder) => (
    <div className="field" key={key}>
      <label className="label">{label}</label>
      <input className="input" placeholder={placeholder} value={fields[key] || ''} onChange={e => setF(key, e.target.value)} />
    </div>
  )

  const citation = style === 'APA' ? genAPA(type, fields) : genMLA(type, fields)

  const copy = () => {
    navigator.clipboard.writeText(citation || '').then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Layout>
      <Head>
        <title>Citation Generator — Free APA & MLA Citation Tool | ScholarTools</title>
        <meta name="description" content="Free citation generator for APA and MLA format. Generate citations for websites, books, and journal articles instantly. No signup required." />
        <link rel="canonical" href="https://scholartools.co/citation-generator" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Citation Generator</div>
            <h1>📚 Citation Generator</h1>
            <p>Generate properly formatted APA or MLA citations for websites, books, and journal articles. Free, no signup.</p>
          </div>

          <div className="card">
            {/* Style Selector */}
            <div className="field">
              <label className="label">Citation Style</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['APA', 'MLA'].map(s => (
                  <button key={s} className={`btn ${style === s ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }} onClick={() => setStyle(s)}>{s} Format</button>
                ))}
              </div>
            </div>

            {/* Source Type */}
            <div className="field">
              <label className="label">Source Type</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {sourceTypes.map(t => (
                  <button key={t} className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setType(t)}>{sourceLabels[t]}</button>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* Common fields */}
            {field('Author(s)', 'author', 'e.g. Smith, J. A.')}
            {field('Title', 'title', type === 'website' ? 'Page or article title' : type === 'book' ? 'Book title' : 'Article title')}
            {field('Year', 'year', 'e.g. 2024')}
            {type === 'website' && field('Website Name', 'site', 'e.g. BBC News')}
            {type === 'website' && field('URL', 'url', 'https://')}
            {type === 'book' && field('Publisher', 'publisher', 'e.g. Oxford University Press')}
            {type === 'journal' && field('Journal Name', 'journal', 'e.g. Nature')}
            {type === 'journal' && field('Volume', 'volume', 'e.g. 12')}
            {type === 'journal' && field('Issue', 'issue', 'e.g. 3')}
            {type === 'journal' && field('Pages', 'pages', 'e.g. 45-67')}
            {type === 'journal' && field('DOI (optional)', 'doi', 'e.g. 10.1000/xyz123')}

            {citation && (
              <div style={{ marginTop: 24, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 20 }}>
                <div className="flex-between" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{style} Citation</div>
                  <button className="btn btn-success btn-sm" onClick={copy}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, lineHeight: 1.7, color: 'var(--text)' }}>{citation}</div>
              </div>
            )}
          </div>

          <div className="tool-info">
            <h2>APA vs MLA — Which Should I Use?</h2>
            <p>APA (American Psychological Association) format is used mainly in social sciences, psychology, education, and nursing. MLA (Modern Language Association) is used in humanities subjects like literature, history, and arts.</p>
            <p>If your teacher has not specified a format, check your course syllabus or ask. Using the wrong citation format can cost marks even if the content is correct.</p>
            <p>This tool generates citations based on the information you provide. Always double-check your citation against the official APA or MLA style guide before submitting.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
