import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useState } from 'react'

function countStats(text) {
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = text.trim() === '' ? 0 : (text.match(/[^.!?]+[.!?]+/g) || []).length
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0)
  const readingTime = Math.max(1, Math.ceil(words / 238))
  const speakingTime = Math.max(1, Math.ceil(words / 130))
  const pages = (words / 250).toFixed(1)
  return { words, chars, charsNoSpace, sentences, paragraphs, readingTime, speakingTime, pages }
}

export default function WordCounter() {
  const [text, setText] = useState('')
  const s = countStats(text)

  return (
    <Layout>
      <Head>
        <title>Word Counter — Free Online Word Count Tool | ScholarTools</title>
        <meta name="description" content="Free online word counter. Count words, characters, sentences, paragraphs, reading time and pages instantly. No signup needed." />
        <link rel="canonical" href="https://scholartools.co/word-counter" />
      </Head>
      <div className="tool-page">
        <div className="tool-container">
          <div className="tool-header">
            <div className="tool-breadcrumb"><Link href="/">Home</Link> / Word Counter</div>
            <h1>📝 Word Counter</h1>
            <p>Paste or type your text below. Word count, character count, reading time and more update instantly.</p>
          </div>

          <div className="card">
            <div className="field">
              <label className="label">Your Text</label>
              <textarea
                className="textarea"
                style={{ minHeight: 220 }}
                placeholder="Paste or type your essay, article, or any text here..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
            <div className="flex-between">
              <div className="text-muted">{text.length === 0 ? 'Start typing to see stats' : 'Stats updating live'}</div>
              <button className="btn btn-danger btn-sm" onClick={() => setText('')}>Clear</button>
            </div>

            <div className="stat-grid" style={{ marginTop: 20 }}>
              <div className="stat-box">
                <div className="stat-val" style={{ color: 'var(--accent)' }}>{s.words.toLocaleString()}</div>
                <div className="stat-lbl">Words</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{s.chars.toLocaleString()}</div>
                <div className="stat-lbl">Characters</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{s.charsNoSpace.toLocaleString()}</div>
                <div className="stat-lbl">No Spaces</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{s.sentences}</div>
                <div className="stat-lbl">Sentences</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{s.paragraphs}</div>
                <div className="stat-lbl">Paragraphs</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{s.readingTime} min</div>
                <div className="stat-lbl">Reading Time</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{s.speakingTime} min</div>
                <div className="stat-lbl">Speaking Time</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{s.pages}</div>
                <div className="stat-lbl">Pages (250w)</div>
              </div>
            </div>
          </div>

          <div className="tool-info">
            <h2>How to use the Word Counter</h2>
            <p>Simply paste or type your text into the box above. All statistics update in real time as you type — no need to click any button.</p>
            <p>The word counter is especially useful for students checking essay word limits set by teachers. Reading time is calculated at an average of 238 words per minute, and speaking time at 130 words per minute — useful for presentations and speeches.</p>
            <p>Pages are estimated at 250 words per page, which is the standard double-spaced academic format used in most universities.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
