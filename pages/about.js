import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About — Free Student Tools | ScholarTools</title>
        <meta name="description" content="ScholarTools is a free browser-based student toolkit. No signup required. 15+ tools for students aged 14–28 worldwide. All tools run 100% in your browser." />
        <link rel="canonical" href="https://www.scholartools.co/about" />
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
              <Link href="/about" style={{ color: '#FFFFFF', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid #2563EB', paddingBottom: '2px' }}>About</Link>
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
              <li style={{ color: '#6B6860' }}>About</li>
            </ol>
          </nav>

          {/* Hero */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', fontWeight: '700', color: '#1C1917', marginBottom: '16px', lineHeight: '1.2' }}>
            Free tools built for students, by students.
          </h1>
          <p style={{ fontSize: '18px', color: '#5C5A56', lineHeight: '1.7', marginBottom: '48px', maxWidth: '620px' }}>
            ScholarTools is a growing library of free, browser-based calculators and utilities for students aged 14–28 around the world. No signup. No cost. No data collected. Just tools that work.
          </p>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '56px' }}>
            {[
              { value: '15+', label: 'Free tools' },
              { value: '100%', label: 'Browser-based' },
              { value: '0', label: 'Signup required' },
              { value: '3', label: 'Markets served' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: '#FFFFFF', border: '1px solid #E5E2DB', borderRadius: '12px', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '700', color: '#2563EB', lineHeight: '1' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: '#6B6860', marginTop: '6px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* What is ScholarTools */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#1C1917', marginBottom: '16px' }}>
              What is ScholarTools?
            </h2>
            <p style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8', marginBottom: '16px' }}>
              ScholarTools is a free browser-based student toolkit. Every tool on this site — from the GPA calculator to the citation generator to the Pomodoro timer — runs entirely in your browser. Nothing is sent to a server. Nothing is stored. Your data stays on your device.
            </p>
            <p style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8' }}>
              The idea is simple: students need fast, reliable, zero-friction tools. No registration form standing between a student and the answer they need. No subscription. No premium tier. Every single tool is free, and always will be.
            </p>
          </div>

          {/* Who it's for */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#1C1917', marginBottom: '16px' }}>
              Who is it for?
            </h2>
            <p style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8', marginBottom: '24px' }}>
              ScholarTools is built for students aged 14–28 globally. We started with Pakistan — a market with over 1.5 million FSc students, hundreds of thousands of MDCAT applicants, and a massive need for accurate, locally relevant academic tools that actually reflect Pakistani grading systems and university formulas.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                {
                  flag: '🇵🇰',
                  country: 'Pakistan',
                  desc: 'MDCAT, NUST, FAST, FSc/Matric tools. Our home market and fastest-growing audience.',
                },
                {
                  flag: '🇬🇧',
                  country: 'United Kingdom',
                  desc: 'Degree classification, UCAS points, student loan repayment, and A-level tools.',
                },
                {
                  flag: '🌍',
                  country: 'Global',
                  desc: 'International GPA converters, study tools, and resources for students worldwide.',
                },
              ].map((market) => (
                <div key={market.country} style={{ background: '#FFFFFF', border: '1px solid #E5E2DB', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{market.flag}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700', color: '#1C1917', marginBottom: '8px' }}>{market.country}</div>
                  <div style={{ fontSize: '14px', color: '#6B6860', lineHeight: '1.6' }}>{market.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#1C1917', marginBottom: '16px' }}>
              How it works
            </h2>
            <p style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8', marginBottom: '24px' }}>
              Every tool on ScholarTools is built as a standalone browser application. When you open a calculator, the calculation logic is loaded directly into your browser — no server involved. When you press calculate, your inputs are processed locally and your result appears instantly.
            </p>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '20px 24px' }}>
              <p style={{ fontSize: '15px', color: '#1E40AF', lineHeight: '1.7', margin: 0 }}>
                <strong>Why this matters:</strong> Because your marks, grades, salary figures, and financial details never leave your device. We physically cannot see what you enter. This is not a privacy promise — it is an architectural reality of how the tools are built.
              </p>
            </div>
          </div>

          {/* Our tools */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#1C1917', marginBottom: '16px' }}>
              Our tools
            </h2>
            <p style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8', marginBottom: '20px' }}>
              We currently offer tools across academic calculation, productivity, writing, and finance — with new tools added regularly. Some of what you&rsquo;ll find:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {[
                'GPA Calculator', 'Grade Needed Calculator', 'CGPA to Percentage',
                'Word Counter', 'Reading Time Estimator', 'Text Case Converter',
                'Citation Generator', 'Pomodoro Timer', 'Typing Speed Test',
                'BMI Calculator', 'Loan EMI Calculator', 'Tip Calculator',
                'Percentage Calculator', 'Deadline Countdown', 'Study Hours Planner',
              ].map((tool) => (
                <div key={tool} style={{ background: '#FFFFFF', border: '1px solid #E5E2DB', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#3D3B37', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB', flexShrink: 0 }}></span>
                  {tool}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563EB', color: '#FFFFFF', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                View all tools →
              </Link>
            </div>
          </div>

          {/* Our principles */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#1C1917', marginBottom: '20px' }}>
              Our principles
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  title: 'Always free',
                  desc: 'No freemium model, no premium tier, no ads between you and the tool. Every tool is fully free for every user.',
                },
                {
                  title: 'No signup ever',
                  desc: 'Creating an account should never be a prerequisite for using a calculator. It never will be on ScholarTools.',
                },
                {
                  title: 'Accuracy first',
                  desc: 'We use official formulas for every academic calculator. When formulas change — like NUST aggregate weightage or FBR tax slabs — we update the tools.',
                },
                {
                  title: 'Mobile first',
                  desc: 'Most students in Pakistan and globally access the internet primarily on phones. Every ScholarTools page is built for small screens first.',
                },
              ].map((principle) => (
                <div key={principle.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', flexShrink: 0, marginTop: '8px' }}></div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1C1917', fontSize: '16px', marginBottom: '4px' }}>{principle.title}</div>
                    <div style={{ fontSize: '15px', color: '#6B6860', lineHeight: '1.6' }}>{principle.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How we sustain */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E2DB', borderRadius: '12px', padding: '28px', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: '#1C1917', marginBottom: '12px' }}>
              How we keep the lights on
            </h2>
            <p style={{ fontSize: '15px', color: '#3D3B37', lineHeight: '1.8', marginBottom: '12px' }}>
              ScholarTools is supported by display advertising and affiliate links. We show ads through Ezoic on our pages, and some tool pages include contextual affiliate recommendations to products like Grammarly, Coursera, and Chegg.
            </p>
            <p style={{ fontSize: '15px', color: '#3D3B37', lineHeight: '1.8' }}>
              Affiliate links are only included where they are genuinely relevant — a citation tool page recommending Grammarly makes sense. We never recommend products we wouldn&rsquo;t actually suggest to a student. Clicking an affiliate link costs you nothing extra.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#1C1917', marginBottom: '12px' }}>
              Get in touch
            </h2>
            <p style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8' }}>
              Found a bug in a calculator? Know of a tool students need that doesn&rsquo;t exist yet? Have a formula correction? We&rsquo;d love to hear from you.
            </p>
            <p style={{ fontSize: '16px', color: '#3D3B37', lineHeight: '1.8', marginTop: '8px' }}>
              Email us at: <a href="mailto:hello@scholartools.co" style={{ color: '#2563EB' }}>hello@scholartools.co</a>
            </p>
          </div>

        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
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
