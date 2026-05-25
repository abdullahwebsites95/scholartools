import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service — Free Student Tools | ScholarTools</title>
        <meta name="description" content="ScholarTools terms of service. Free tools, no signup required. Tools provided as-is with no warranty. Users are responsible for how they use results." />
        <link rel="canonical" href="https://www.scholartools.co/terms" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div style={{ background: '#F8F7F4', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <header style={{ background: '#1C1917', padding: '0 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                Scholar<span style={{ color: '#2563EB' }}>Tools</span>
              </span>
            </Link>
            <nav style={{ display: 'flex', gap: '28px' }}>
              <Link href="/" style={{ color: '#D6D3CE', fontSize: '14px', textDecoration: 'none' }}>Home</Link>
              <Link href="/about" style={{ color: '#D6D3CE', fontSize: '14px', textDecoration: 'none' }}>About</Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '28px' }}>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6B6860' }}>
              <li><Link href="/" style={{ color: '#2563EB', textDecoration: 'none' }}>Home</Link></li>
              <li style={{ color: '#9CA3AF' }}>/</li>
              <li style={{ color: '#6B6860' }}>Terms of Service</li>
            </ol>
          </nav>

          {/* Page heading */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', color: '#1C1917', marginBottom: '8px', lineHeight: '1.2' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6860', marginBottom: '40px' }}>
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Intro */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '16px 20px', marginBottom: '36px' }}>
            <p style={{ fontSize: '14px', color: '#1E40AF', lineHeight: '1.7', margin: 0 }}>
              By using ScholarTools.co, you agree to these Terms of Service. Please read them carefully. If you do not agree with any part of these terms, please discontinue use of the site.
            </p>
          </div>

          {/* Content */}
          <div style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8' }}>

            <Section title="1. Acceptance of terms">
              <p>These Terms of Service govern your use of ScholarTools.co and all tools, calculators, and content available on the website. By accessing or using ScholarTools, you confirm that you are at least 14 years old and agree to be bound by these terms.</p>
            </Section>

            <Section title="2. Free tools, no account required">
              <p>All tools on ScholarTools are provided completely free of charge. No account, registration, or signup is required to use any tool on this site. You may use our tools immediately without providing any personal information. We intend to keep ScholarTools free for all users indefinitely.</p>
            </Section>

            <Section title="3. Tools provided as-is — no warranty">
              <p>All tools, calculators, and information on ScholarTools are provided <strong>&ldquo;as is&rdquo;</strong> without any warranty of any kind, express or implied. We make every reasonable effort to ensure accuracy, but we do not guarantee that:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>Results are accurate, complete, or up to date</li>
                <li style={{ marginBottom: '6px' }}>Tools are free from errors or bugs</li>
                <li style={{ marginBottom: '6px' }}>The site will be available without interruption</li>
                <li style={{ marginBottom: '6px' }}>Tools reflect the most current formulas, tax rates, or academic regulations</li>
              </ul>
              <p style={{ marginTop: '12px' }}>Formulas for tools such as university aggregate calculators, tax calculators, and loan calculators may change over time. Always verify critical results — especially those affecting university admissions, tax filings, or financial decisions — with official sources or qualified professionals.</p>
            </Section>

            <Section title="4. User responsibility">
              <p>You are solely responsible for how you use the results produced by ScholarTools tools. ScholarTools shall not be liable for any decisions made, actions taken, or outcomes resulting from the use of our tools. This includes but is not limited to:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>University or college applications based on aggregate calculations</li>
                <li style={{ marginBottom: '6px' }}>Financial decisions based on tax, loan, or EMI calculations</li>
                <li style={{ marginBottom: '6px' }}>Academic planning based on GPA, grade, or study hour calculations</li>
                <li style={{ marginBottom: '6px' }}>Citations generated using our citation tool — always verify format with your institution</li>
              </ul>
            </Section>

            <Section title="5. Limitation of liability">
              <p>To the fullest extent permitted by law, ScholarTools and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of — or inability to use — the site or its tools. This includes damages for loss of data, loss of academic standing, financial loss, or any other harm, even if we have been advised of the possibility of such damages.</p>
            </Section>

            <Section title="6. No scraping or reproduction of content">
              <p>You may not scrape, copy, reproduce, republish, or redistribute content from ScholarTools without our express written permission. This includes:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>Automated scraping or crawling of tool pages beyond standard search engine indexing</li>
                <li style={{ marginBottom: '6px' }}>Copying tool logic, source code, or page content for use on other websites</li>
                <li style={{ marginBottom: '6px' }}>Reproducing SEO content, descriptions, or UI layouts from our pages</li>
              </ul>
              <p style={{ marginTop: '12px' }}>You are welcome to share links to ScholarTools pages and to reference our tools in educational or personal contexts.</p>
            </Section>

            <Section title="7. Third-party links and affiliates">
              <p>ScholarTools contains links to third-party websites and affiliate links to products such as Grammarly, Coursera, and Chegg. We are not responsible for the content, accuracy, or practices of any third-party site. Affiliate links are included as genuine recommendations — clicking them does not affect the price you pay, but may result in ScholarTools earning a commission if you make a purchase.</p>
            </Section>

            <Section title="8. Advertising">
              <p>ScholarTools displays advertisements through Ezoic, an ad management platform. Advertisements are clearly distinguishable from tool content. We do not endorse products or services advertised through Ezoic&rsquo;s network and are not responsible for the content of third-party advertisements.</p>
            </Section>

            <Section title="9. Intellectual property">
              <p>All content on ScholarTools, including tool designs, descriptions, and code, is the intellectual property of ScholarTools unless otherwise stated. The ScholarTools name and logo may not be used without permission. Open-source components used in building ScholarTools are credited to their respective authors.</p>
            </Section>

            <Section title="10. Modifications to the site and terms">
              <p>We reserve the right to modify, suspend, or discontinue any tool or page on ScholarTools at any time without notice. We may also update these Terms of Service at any time. Continued use of the site after changes constitutes acceptance of the updated terms. The &ldquo;last updated&rdquo; date at the top of this page will always reflect the most recent revision.</p>
            </Section>

            <Section title="11. Governing law">
              <p>These terms shall be governed by and construed in accordance with applicable law. Any disputes arising from use of ScholarTools shall first be attempted to be resolved informally by contacting us at the email address below.</p>
            </Section>

            <Section title="12. Contact">
              <p>For any questions about these Terms of Service, please contact us at: <a href="mailto:hello@scholartools.co" style={{ color: '#2563EB' }}>hello@scholartools.co</a></p>
            </Section>

          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: '#1C1917', marginBottom: '12px' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#1C1917', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '24px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: '#FFFFFF' }}>
              Scholar<span style={{ color: '#2563EB' }}>Tools</span>
            </span>
            <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '8px', maxWidth: '260px', lineHeight: '1.6' }}>
              Free browser-based tools for students worldwide. No signup. No cost. Ever.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>Legal</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/privacy-policy" style={{ color: '#9CA3AF', fontSize: '13px', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link href="/terms" style={{ color: '#9CA3AF', fontSize: '13px', textDecoration: 'none' }}>Terms of Service</Link>
                <Link href="/about" style={{ color: '#9CA3AF', fontSize: '13px', textDecoration: 'none' }}>About</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2D2B27', paddingTop: '24px' }}>
          <p style={{ color: '#6B6860', fontSize: '12px', textAlign: 'center' }}>
            © {new Date().getFullYear()} ScholarTools. All rights reserved. All tools run in your browser — no data is collected or stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
