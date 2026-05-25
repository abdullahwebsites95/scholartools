import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Free Student Tools | ScholarTools</title>
        <meta name="description" content="ScholarTools privacy policy. All tools run in your browser. We use Google Analytics and Ezoic ads. No personal data is collected by our tools." />
        <link rel="canonical" href="https://www.scholartools.co/privacy-policy" />
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
              <li style={{ color: '#6B6860' }}>Privacy Policy</li>
            </ol>
          </nav>

          {/* Page heading */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', color: '#1C1917', marginBottom: '8px', lineHeight: '1.2' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6860', marginBottom: '40px' }}>
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Content */}
          <div style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8' }}>

            <Section title="Overview">
              <p>ScholarTools (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website scholartools.co. This Privacy Policy explains how we handle information when you use our free student tools. We are committed to protecting your privacy — our tools are designed to run entirely in your browser, which means we do not collect, store, or transmit your personal data through the tools themselves.</p>
            </Section>

            <Section title="Information we do not collect">
              <p>Our calculator and tool pages collect <strong>no personal information</strong>. Every tool on ScholarTools runs 100% in your browser. When you use our GPA calculator, word counter, citation generator, or any other tool, your inputs and results are processed locally on your device and are never sent to our servers. We have no database of user data and no user accounts.</p>
            </Section>

            <Section title="Google Analytics">
              <p>We use Google Analytics 4 to understand how visitors use our site. Google Analytics collects aggregated, anonymised traffic data including pages visited, time spent on pages, device type, browser, and approximate geographic location (country/city level). This data is used to improve our tools and understand which pages are most useful to students.</p>
              <p style={{ marginTop: '12px' }}>Google Analytics may set cookies in your browser to distinguish visitors and track sessions. You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>Google Analytics opt-out browser add-on</a>.</p>
            </Section>

            <Section title="Advertising — Ezoic">
              <p>ScholarTools displays advertisements provided by Ezoic, an ad management platform. Ezoic and its advertising partners may use cookies and similar tracking technologies to serve personalised ads based on your interests. These cookies are set by Ezoic and third-party ad networks — not by ScholarTools directly.</p>
              <p style={{ marginTop: '12px' }}>Ezoic&rsquo;s privacy practices are governed by the <a href="https://www.ezoic.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>Ezoic Privacy Policy</a>. You may manage your ad preferences or opt out of personalised advertising through your browser settings or by visiting the <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>Network Advertising Initiative opt-out page</a>.</p>
            </Section>

            <Section title="Affiliate links">
              <p>Some pages on ScholarTools contain affiliate links to third-party products and services including Grammarly, Coursera, and Chegg. If you click an affiliate link and make a purchase or sign up, we may earn a commission at no additional cost to you. These links are clearly contextual recommendations. Clicking an affiliate link does not share any personal information about you with us — the affiliate tracking is handled entirely by the respective third-party platforms.</p>
            </Section>

            <Section title="Cookies">
              <p>ScholarTools itself does not set cookies for tool functionality. Cookies may be placed on your device by:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>Google Analytics — for visitor tracking and session measurement</li>
                <li style={{ marginBottom: '6px' }}>Ezoic — for ad personalisation and frequency capping</li>
                <li style={{ marginBottom: '6px' }}>Third-party advertising networks served through Ezoic</li>
              </ul>
              <p style={{ marginTop: '12px' }}>You can control or delete cookies through your browser settings. Note that disabling cookies may affect the display of advertisements on our site.</p>
            </Section>

            <Section title="Third-party links">
              <p>Our pages may contain links to third-party websites including university websites, exam boards, and affiliate partners. We are not responsible for the privacy practices of those websites. We encourage you to read the privacy policies of any external sites you visit.</p>
            </Section>

            <Section title="Children's privacy">
              <p>ScholarTools is designed for students aged 14 and above. We do not knowingly collect any personal information from children under 13. If you believe a child under 13 has provided personal information through our site, please contact us and we will take steps to remove that information.</p>
            </Section>

            <Section title="Your rights">
              <p>Because we do not collect personal data through our tools, there is no user data for us to provide, correct, or delete. For data held by Google Analytics or Ezoic, please refer to their respective privacy policies and opt-out mechanisms linked above.</p>
            </Section>

            <Section title="Changes to this policy">
              <p>We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;last updated&rdquo; date at the top of this page. We encourage you to review this policy periodically. Continued use of ScholarTools after any changes constitutes your acceptance of the updated policy.</p>
            </Section>

            <Section title="Contact">
              <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:hello@scholartools.co" style={{ color: '#2563EB' }}>hello@scholartools.co</a></p>
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
