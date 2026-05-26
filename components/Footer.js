import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">Scholar<span>Tools</span></div>
      <p>Free tools for students worldwide. No signup required.</p>
      <div className="footer-links">
        <Link href="/word-counter">Word Counter</Link>
        <Link href="/gpa-calculator">GPA Calculator</Link>
        <Link href="/pomodoro-timer">Pomodoro Timer</Link>
        <Link href="/citation-generator">Citation Generator</Link>
        <Link href="/grade-calculator">Grade Calculator</Link>
        <Link href="/percentage-calculator">Percentage Calc</Link>
        <Link href="/bmi-calculator">BMI Calculator</Link>
        <Link href="/student-rent-calculator">Student Rent Calculator</Link>
        <Link href="/emi-calculator">EMI Calculator</Link>
        <Link href="/typing-speed">Typing Speed</Link>
        <Link href="/deadline-countdown">Deadline Countdown</Link>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} ScholarTools.co — Free student tools forever.</div>
    </footer>
  )
}
