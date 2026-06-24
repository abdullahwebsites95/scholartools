import '../styles/globals.css'
import { useRouter } from 'next/router'
import Head from 'next/head'

const SCHEMA_MAP = {
  '/word-counter': {
    name: 'Word Counter',
    description: 'Free online word counter. Count words, characters, sentences, paragraphs, reading time and pages instantly. No signup needed.',
    url: 'https://scholartools.co/word-counter',
  },
  '/reading-time': {
    name: 'Reading Time Estimator',
    description: 'Estimate how long any text takes to read. Free reading time calculator for students and writers.',
    url: 'https://scholartools.co/reading-time',
  },
  '/text-case-converter': {
    name: 'Text Case Converter',
    description: 'Convert text to uppercase, lowercase, title case, sentence case and camelCase instantly. Free online text converter.',
    url: 'https://scholartools.co/text-case-converter',
  },
  '/citation-generator': {
    name: 'Citation Generator',
    description: 'Generate free APA and MLA citations for books, websites and journals. Free citation maker for students.',
    url: 'https://scholartools.co/citation-generator',
  },
  '/pomodoro-timer': {
    name: 'Pomodoro Study Timer',
    description: 'Free Pomodoro timer for students. 25-minute study sessions with break reminders to boost focus and productivity.',
    url: 'https://scholartools.co/pomodoro-timer',
  },
  '/deadline-countdown': {
    name: 'Assignment Deadline Countdown',
    description: 'Track multiple assignment deadlines with live countdowns. Free deadline tracker for students.',
    url: 'https://scholartools.co/deadline-countdown',
  },
  '/typing-speed': {
    name: 'Typing Speed Test',
    description: 'Test your typing speed in WPM. Free online typing speed test with accuracy measurement for students.',
    url: 'https://scholartools.co/typing-speed',
  },
  '/study-hours-planner': {
    name: 'Study Hours Planner',
    description: 'Plan your study hours by subject difficulty and days left before exams. Free study planner for students.',
    url: 'https://scholartools.co/study-hours-planner',
  },
  '/gpa-calculator': {
    name: 'GPA Calculator',
    description: 'Calculate your GPA on the 4.0 scale with subject credit hours. Free GPA calculator for students.',
    url: 'https://scholartools.co/gpa-calculator',
  },
  '/grade-calculator': {
    name: 'Grade Needed Calculator',
    description: 'Find out exactly what score you need on your final exam to pass the course. Free grade needed calculator.',
    url: 'https://scholartools.co/grade-calculator',
  },
  '/percentage-calculator': {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, and what percent X is of Y. Free online percentage calculator.',
    url: 'https://scholartools.co/percentage-calculator',
  },
  '/cgpa-to-percentage': {
    name: 'CGPA to Percentage Converter',
    description: 'Convert CGPA to percentage using your university formula. Supports Pakistani and Indian universities. Free CGPA converter.',
    url: 'https://scholartools.co/cgpa-to-percentage',
  },
  '/attendance-calculator': {
    name: 'Attendance Calculator',
    description: 'Check your class attendance percentage and find out how many classes you can miss. Free attendance calculator for students.',
    url: 'https://scholartools.co/attendance-calculator',
  },
  '/bmi-calculator': {
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index instantly. Free BMI calculator with healthy weight range for metric and imperial units.',
    url: 'https://scholartools.co/bmi-calculator',
  },
  '/tip-calculator': {
    name: 'Tip Calculator',
    description: 'Calculate tip amount and split bills among friends. Free tip calculator with bill splitting.',
    url: 'https://scholartools.co/tip-calculator',
  },
  '/emi-calculator': {
    name: 'Loan EMI Calculator',
    description: 'Calculate monthly loan installments, total interest and full repayment schedule. Free EMI calculator for students.',
    url: 'https://scholartools.co/emi-calculator',
  },
  '/student-rent-calculator': {
    name: 'Student Rent Affordability Calculator UK',
    description: 'Calculate how much rent you can afford as a UK student based on your maintenance loan. Free student rent calculator.',
    url: 'https://scholartools.co/student-rent-calculator',
  },
  '/mdcat-calculator': {
    name: 'MDCAT Aggregate Calculator',
    description: 'Calculate your MBBS and BDS admission aggregate using the official PMDC formula. Free MDCAT calculator Pakistan.',
    url: 'https://scholartools.co/mdcat-calculator',
  },
  '/ecat-calculator': {
    name: 'ECAT Aggregate Calculator',
    description: 'Calculate your UET engineering admission aggregate using the official formula. Free ECAT calculator Pakistan.',
    url: 'https://scholartools.co/ecat-calculator',
  },
  '/nust-calculator': {
    name: 'NUST NET Aggregate Calculator',
    description: 'Calculate your NUST admission aggregate for all schools. Free NUST merit calculator Pakistan.',
    url: 'https://scholartools.co/nust-calculator',
  },
  '/fast-calculator': {
    name: 'FAST University Aggregate Calculator',
    description: 'Calculate your FAST-NU admission aggregate for CS, SE and engineering. Free FAST NUET merit calculator.',
    url: 'https://scholartools.co/fast-calculator',
  },
  '/nums-calculator': {
    name: 'NUMS Aggregate Calculator',
    description: 'Calculate your Army Medical College admission aggregate using the NUMS formula. Free NUMS merit calculator Pakistan.',
    url: 'https://scholartools.co/nums-calculator',
  },
  '/fsc-grade-converter': {
    name: 'FSc and Matric Grade Converter',
    description: 'Convert FSc or Matric marks to percentage and official board letter grade. Free FSc percentage calculator Pakistan.',
    url: 'https://scholartools.co/fsc-grade-converter',
  },
  '/fbr-income-tax-calculator': {
    name: 'FBR Income Tax Calculator',
    description: 'Calculate Pakistan income tax for 2025-26 using official FBR slabs. Free tax calculator for salaried and freelancers.',
    url: 'https://scholartools.co/fbr-income-tax-calculator',
  },
  '/international-student-work-hours-calculator': {
    name: 'International Student Work Hours Calculator',
    description: 'Check how many hours you can legally work on your student visa. Covers UK, Australia, Canada, USA and Ireland.',
    url: 'https://scholartools.co/international-student-work-hours-calculator',
  },
  '/international-gpa-converter': {
    name: 'International GPA Converter',
    description: 'Convert Pakistani, UK, Indian, German and Australian grades to US 4.0 GPA scale. Free WES-style GPA converter.',
    url: 'https://scholartools.co/international-gpa-converter',
  },
  '/exam-time-calculator': {
    name: 'Exam Time Calculator',
    description: 'Allocate time per section and question in any exam. Free exam time calculator for MCQ and essay papers.',
    url: 'https://scholartools.co/exam-time-calculator',
  },
}

function buildSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': data.name,
    'url': data.url,
    'description': data.description,
    'applicationCategory': 'EducationalApplication',
    'operatingSystem': 'Any',
    'browserRequirements': 'Requires JavaScript',
    'isAccessibleForFree': true,
    'inLanguage': 'en',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'creator': {
      '@type': 'Organization',
      'name': 'ScholarTools',
      'url': 'https://scholartools.co'
    }
  }
}

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'ScholarTools',
  'url': 'https://scholartools.co',
  'description': 'Free online tools for students worldwide. GPA calculator, attendance tracker, university admission calculators and more.',
  'logo': 'https://scholartools.co/logo.png',
  'sameAs': []
}

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const pathname = router.pathname
  const schemaData = SCHEMA_MAP[pathname]

  return (
    <>
      <Head>
        {/* Organization schema on all pages */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {/* Tool-specific WebApplication schema */}
        {schemaData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(schemaData)) }}
          />
        )}
      </Head>
      <Component {...pageProps} />
    </>
  )
}
