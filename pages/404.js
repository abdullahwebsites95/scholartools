import Link from 'next/link'
import Layout from '../components/Layout'
import Head from 'next/head'

export default function Custom404() {
  return (
    <Layout>
      <Head><title>Page Not Found | ScholarTools</title></Head>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 36, marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 28, fontSize: 16 }}>The tool you are looking for does not exist or has moved.</p>
        <Link href="/" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>← Back to All Tools</Link>
      </div>
    </Layout>
  )
}
