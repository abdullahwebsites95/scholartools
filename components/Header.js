import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">Scholar<span>Tools</span></Link>
        <nav className={`nav${open ? ' open' : ''}`}>
          <Link href="/word-counter" onClick={() => setOpen(false)}>Word Counter</Link>
          <Link href="/gpa-calculator" onClick={() => setOpen(false)}>GPA Calc</Link>
          <Link href="/pomodoro-timer" onClick={() => setOpen(false)}>Pomodoro</Link>
          <Link href="/student-rent-calculator" onClick={() => setOpen(false)}>Rent Calc</Link>
          <Link href="/" onClick={() => setOpen(false)}>All Tools</Link>
        </nav>
        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">☰</button>
      </div>
    </header>
  )
}
