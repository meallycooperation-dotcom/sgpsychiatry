import { useEffect, type MouseEvent } from 'react'
import {
  Brain,
  CalendarCheck2,
  Clock3,
  FileSignature,
  Link2,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  UserCircle2,
  Video,
} from 'lucide-react'
import consultingImage from './assets/doc1_converted.webp'
import heroImage from './assets/images.jpg'
import financialImage from './assets/image_converted.webp'
import processImage from './assets/proce_converted.webp'
import Login from './Login'
import Profile from './pages/dashboard/Profile/index'
import DashboardPage from './pages/dashboard/Dashboard/index'
import Appointments from './pages/dashboard/Appointments/index'
import Billing from './pages/dashboard/Billing/index'
import MedicalRecords from './pages/dashboard/MedicalRecords/index'
import MessagesPage from './pages/dashboard/Messages/index'
import Prescriptions from './pages/dashboard/Prescriptions/index'
import Settings from './pages/dashboard/Settings/index'

const medicalConditions = [
  'Anxiety disorders',
  'Depression',
  'Bipolar disorder',
  'Schizophrenia',
  'PTSD and trauma-related disorders',
  'ADHD',
  'Sleep and stress-related concerns',
]

const seoData = {
  title: 'SGPsychiatry | Adult Psychiatry & Wellness in Lakewood, WA',
  description:
    'Compassionate psychiatric care in Lakewood, WA for anxiety, depression, bipolar disorder, schizophrenia, PTSD, trauma, ADHD, and more through in-person and telepsychiatry visits.',
  keywords:
    'psychiatry Lakewood WA, anxiety treatment, depression treatment, bipolar disorder care, schizophrenia treatment, trauma therapy, telepsychiatry',
}

const services = [
  {
    title: 'Consulting',
    image: consultingImage,
    description:
      'For psychiatric services, anxiety, depression, bipolar disorder, schizophrenia and more. Telepsychiatry and telemedicine appointments are also available.',
  },
  {
    title: 'Financial',
    image: financialImage,
    description:
      'We accept most major insurance plans. We also welcome cash, credit cards, and checks. Please confirm coverage with your insurer for the latest provider information.',
  },
  {
    title: 'Process',
    image: processImage,
    description:
      'We complete an initial psychological evaluation on all clients and use effective screening tools to guide diagnosis and treatment planning.',
  },
]

const contactItems = [
  { icon: MapPin, text: '6212 75th St W, Lakewood, WA 98499' },
  { icon: PhoneCall, text: '(253) 878-9211', href: 'tel:+12538789211' },
  { icon: Mail, text: 'info@sgpsychiatry.com', href: 'mailto:info@sgpsychiatry.com' },
  { icon: Clock3, text: 'Monday - Thursday\n9:00 am to 5:00 pm' },
  { icon: Video, text: 'Telehealth available' },
]

const getLoginHref = () => {
  const configuredHref = import.meta.env.VITE_OPENEMR_LOGIN_URL
  if (configuredHref) return configuredHref
  // Preferred: use local branded login page which posts to /api/login
  return '/login'
}

const handleLoginClick = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()
  window.location.assign(getLoginHref())
}

const handleLogoutClick = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()
  const url = new URL(window.location.href)
  url.pathname = '/'
  url.search = ''
  window.history.replaceState({}, '', url)
  window.location.assign('/')
}

const handleContactLinkClick = (event: MouseEvent<HTMLAnchorElement>, href?: string) => {
  if (!href) return
  event.preventDefault()
  window.location.href = href
}

const isPortalView = typeof window !== 'undefined' && (window.location.pathname === '/portal' || new URLSearchParams(window.location.search).get('auth') === 'success')

const getPortalProfile = () => {
  if (typeof window === 'undefined') {
    return {
      name: 'Signed-in patient',
      email: '',
      phone: '',
    }
  }

  const params = new URLSearchParams(window.location.search)
  return {
    name: params.get('patient_name') || 'Signed-in patient',
    email: params.get('patient_email') || '',
    phone: params.get('patient_phone') || '',
  }
}

function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'

  useEffect(() => {
    if (typeof document === 'undefined') return

    const head = document.head
    document.title = seoData.title

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let tag = head.querySelector(`meta[${attr}="${key}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, key)
        head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    setMeta('name', 'description', seoData.description)
    setMeta('name', 'keywords', seoData.keywords)
    setMeta('name', 'robots', 'index,follow,max-image-preview:large')
    setMeta('property', 'og:title', seoData.title)
    setMeta('property', 'og:description', seoData.description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '/')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', seoData.title)
    setMeta('name', 'twitter:description', seoData.description)

    let canonical = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      head.appendChild(canonical)
    }
    canonical.href = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '/'

    let existingSchema = document.getElementById('sgpsychiatry-schema') as HTMLScriptElement | null
    if (!existingSchema) {
      existingSchema = document.createElement('script')
      existingSchema.id = 'sgpsychiatry-schema'
      existingSchema.type = 'application/ld+json'
      head.appendChild(existingSchema)
    }

    existingSchema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: 'SGPsychiatry',
      url: 'https://sgpsychiatry.com',
      telephone: '+12538789211',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '6212 75th St W',
        addressLocality: 'Lakewood',
        addressRegion: 'WA',
        postalCode: '98499',
        addressCountry: 'US',
      },
      medicalSpecialty: 'Psychiatry',
      description:
        'Adult psychiatry and wellness clinic providing treatment for anxiety, depression, bipolar disorder, schizophrenia, PTSD, trauma, ADHD, and other mental health conditions.',
      availableService: medicalConditions.map((condition) => ({
        '@type': 'MedicalTherapy',
        name: condition,
      })),
      sameAs: ['https://www.facebook.com', 'https://www.instagram.com'],
    })
  }, [pathname])

  if (pathname === '/profile') {
    return <Profile />
  }

  if (pathname === '/dashboard') {
    return <DashboardPage />
  }

  if (pathname === '/appointments') {
    return <Appointments />
  }

  if (pathname === '/messages') {
    return <MessagesPage />
  }

  if (pathname === '/records') {
    return <MedicalRecords />
  }

  if (pathname === '/prescriptions') {
    return <Prescriptions />
  }

  if (pathname === '/billing') {
    return <Billing />
  }

  if (pathname === '/settings') {
    return <Settings />
  }

  if (isPortalView) {
    const profile = getPortalProfile()

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <a href="#home" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <Brain className="h-6 w-6" />
              </span>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  SGPsychiatry
                </h1>
                <p className="text-sm text-slate-500">login Portal</p>
              </div>
            </a>
            <a href="/" onClick={handleLogoutClick} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-700">
              <LogOut className="h-4 w-4" />
              Logout
            </a>
          </div>
        </header>

        <div className="border-y border-slate-200 bg-slate-50 py-4">
          <div className="mx-auto grid max-w-7xl gap-3 px-6 lg:grid-cols-4 lg:px-8">
            <a href="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-900">Dashboard</a>
            <a href="/appointments" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-900">Appointments</a>
            <a href="/messages" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-900">Messages</a>
            <a href="/records" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-900">Medical Records</a>
            <a href="/prescriptions" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-900">Prescriptions</a>
            <a href="/billing" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-slate-900">Billing</a>
            <a href="/settings" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-900">Settings</a>
            <a href="/profile" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-900">Profile</a>
          </div>
        </div>

        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <UserCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">Welcome back, {profile.name}</h2>
                  <p className="mt-1 text-slate-600">Your portal is ready for appointments, messages, and care updates.</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Secure session active
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-sky-800">
                <CalendarCheck2 className="h-6 w-6" />
                <h3 className="text-2xl font-semibold text-slate-900">Upcoming appointments</h3>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">Telepsychiatry follow-up</p>
                      <p className="mt-1 text-sm text-slate-600">Tuesday, July 9 · 10:30 AM</p>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">Confirmed</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">Medication review</p>
                      <p className="mt-1 text-sm text-slate-600">Thursday, July 18 · 2:00 PM</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">Pending</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-sky-800">
                <MessageSquareText className="h-6 w-6" />
                <h3 className="text-2xl font-semibold text-slate-900">Secure messages</h3>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">New forms available</p>
                  <p className="mt-1 text-sm text-slate-600">Please review your intake packet before your next visit.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Appointment reminder</p>
                  <p className="mt-1 text-sm text-slate-600">A reminder was sent for your upcoming telehealth session.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-sky-800">
                <UserCircle2 className="h-6 w-6" />
                <h3 className="text-2xl font-semibold text-slate-900">Account profile</h3>
              </div>
              <dl className="mt-6 space-y-4 text-sm text-slate-700">
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-500">Name</dt>
                  <dd className="font-semibold text-slate-900">{profile.name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-500">Email</dt>
                  <dd className="font-semibold text-slate-900">{profile.email || 'Not available yet'}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-500">Phone</dt>
                  <dd className="font-semibold text-slate-900">{profile.phone || 'Not available yet'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-slate-500">Status</dt>
                  <dd className="font-semibold text-slate-900">Signed in via OpenEMR</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-sky-800">
                <FileSignature className="h-6 w-6" />
                <h3 className="text-2xl font-semibold text-slate-900">Quick actions</h3>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="#" className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 font-semibold text-white transition hover:bg-sky-800">
                  <CalendarCheck2 className="h-5 w-5" />
                  Request appointment
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-700">
                  <Mail className="h-5 w-5" />
                  Contact clinic
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }
  // Render login page when user navigates to /login
  if (typeof window !== 'undefined' && window.location.pathname === '/login') {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <Brain className="h-6 w-6" />
            </span>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                SGPsychiatry
              </h1>
              <p className="text-sm text-slate-500">Adult Psychiatry</p>
            </div>
          </a>

          <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#home" className="transition hover:text-sky-700">
              Home
            </a>
            <a href="#about" className="transition hover:text-sky-700">
              About
            </a>
            <a href="#treatment" className="transition hover:text-sky-700">
              Treatment
            </a>
            <a href="#services" className="transition hover:text-sky-700">
              Services
            </a>
            <a href="#contact" className="transition hover:text-sky-700">
              Contacts
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-100 via-slate-50 to-sky-200 py-20 lg:py-24">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Psychiatry clinic in Lakewood, Washington"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover opacity-15 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-100/25 via-sky-50/10 to-transparent" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="max-w-2xl">
              <span className="mb-5 inline-flex rounded-full border border-sky-400/40 bg-white/70 px-4 py-2 text-sm font-semibold text-sky-800 shadow-sm">
                Compassionate, evidence-based care
              </span>
              <h1 className="mb-5 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Adult Psychiatry & Wellness
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-8 text-slate-700">
                Compassionate, evidence-based mental health care for adults. We provide treatment for anxiety, depression, bipolar disorder, schizophrenia, PTSD, trauma, and related mental health concerns through in-person and telepsychiatry care.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={getLoginHref()}
                  onClick={handleLoginClick}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-700/20 transition hover:bg-sky-800"
                >
                  <LogIn className="h-5 w-5" />
                  Login Portal
                </a>
              </div>
            </div>

          </div>
        </section>

        <section id="about" className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-slate-900">About</h2>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
                Dr. Sammy Gathiru, DNP, PMHNP-BC is a Board-Certified Psychiatric Mental Health Nurse Practitioner who provides a comprehensive approach to mental health treatment by incorporating psychopharmacology, psychotherapy, and alternative treatment modalities to best address your concern. Each treatment plan is tailored to fit the individual and to help clients understand their diagnosis and options.
              </p>
            </div>

            <div id="treatment">
              <h3 className="text-3xl font-semibold text-slate-900">Treatment</h3>
              <p className="mt-3 text-lg leading-8 text-slate-700">
                Personalized care that may include therapy, medication management, and telepsychiatry.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Our team is invested in helping you achieve your mental wellness goals. We treat psychiatric disorders not limited to mood, anxiety, depression, bipolar, and trauma-related disorders. We use psychodynamic and cognitive-behavioral therapy, along with other evidence-based modalities, and are trained to treat clients of all ages.
              </p>
            </div>
          </div>
        </section>

        

        <section id="services" className="pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-slate-900">Services</h3>
              <p className="mt-3 max-w-3xl text-lg text-slate-600">
              We provide compassionate, personalized psychiatric care tailored to each individual's needs. Our services include psychiatric evaluations, diagnosis, medication management, psychotherapy, and evidence-based treatment for a wide range of mental health conditions. We offer both in-person and secure telehealth appointments, with a focus on improving emotional well-being, daily functioning, and overall quality of life through patient-centered care.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img src={service.image} alt={`${service.title} services for mental health treatment`} className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-sky-100 bg-sky-900 px-8 py-8 text-white shadow-xl lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <div className="flex items-center gap-3">
                <UserCircle2 className="h-8 w-8" />
                <div>
                  <h3 className="text-2xl font-semibold">Patient Portal</h3>
                  <p className="text-sm text-sky-100">Secure login, scheduling, forms, and messaging</p>
                </div>
              </div>
              <a
                href={getLoginHref()}
                onClick={handleLoginClick}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-sky-900 transition hover:bg-slate-100"
              >
                <LogIn className="h-5 w-5" />
                Login to Portal
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <MapPin className="h-6 w-6 text-sky-700" />
                  <h2 className="text-3xl font-semibold">Contact & Office</h2>
                </div>
                <div className="mt-8 space-y-4 text-slate-700">
                  {contactItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.text} className="flex gap-3 leading-7">
                        <Icon className="mt-1 h-5 w-5 shrink-0 text-sky-700" />
                        {item.href ? (
                          <a
                            href={item.href}
                            onClick={(event) => handleContactLinkClick(event, item.href)}
                            className="whitespace-pre-line transition hover:text-sky-700 hover:underline"
                          >
                            {item.text}
                          </a>
                        ) : (
                          <span className="whitespace-pre-line">{item.text}</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://portal.sgpsychiatry.com/portal"
                    className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 font-semibold text-white transition hover:bg-sky-800"
                  >
                    <CalendarCheck2 className="h-5 w-5" />
                    Schedule via Portal
                  </a>
                  <a
                    href="https://portal.sgpsychiatry.com/portal"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-700"
                  >
                    <FileSignature className="h-5 w-5" />
                    New Patient Forms
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <MessageSquareText className="h-6 w-6 text-sky-700" />
                  <h3 className="text-2xl font-semibold">Send a Message</h3>
                </div>
                <p className="mt-3 text-slate-600">
                  Have questions about appointments, referrals, or forms? Send us a note and we will follow up.
                </p>
                <form className="mt-8 space-y-5" action="mailto:client@sgpsychiatry.com" method="post" encType="text/plain">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      <span className="mb-2 block">Name</span>
                      <input type="text" name="name" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500" placeholder="Your full name" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      <span className="mb-2 block">Email</span>
                      <input type="email" name="email" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500" placeholder="your@email.com" />
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    <span className="mb-2 block">Phone</span>
                    <input type="tel" name="phone" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500" placeholder="(253) 555-0123" />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    <span className="mb-2 block">Message</span>
                    <textarea name="message" rows={5} required className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500" placeholder="How can we help you?" />
                  </label>
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 font-semibold text-white transition hover:bg-sky-800">
                    <Link2 className="h-5 w-5" />
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <iframe
                title="SGPsychiatry location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2711.4033807863375!2d-122.52236262310937!3d47.18911671671283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5491008ea46e7d55%3A0xdc1db00aeb24f326!2s6212%2075th%20St%20W%2C%20Lakewood%2C%20WA%2098499%2C%20USA!5e0!3m2!1sen!2ske!4v1783165937544!5m2!1sen!2ske"
                width="100%"
                height="450"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="border-0"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-900 py-10 text-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-800 text-sky-200">
                <Brain className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-white">SGPsychiatry</p>
                <p className="text-sm text-slate-300">Adult Psychiatry & Wellness</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href="https://sgpsychiatry.com" aria-label="Visit the SGPsychiatry website" className="rounded-full border border-slate-700 p-3 transition hover:border-sky-500 hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <Link2 className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="mailto:info@sgpsychiatry.com" aria-label="Email SGPsychiatry" className="rounded-full border border-slate-700 p-3 transition hover:border-sky-500 hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="tel:+12538789211" aria-label="Call SGPsychiatry" className="rounded-full border border-slate-700 p-3 transition hover:border-sky-500 hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <PhoneCall className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
            <a href="#" className="transition hover:text-sky-400">Privacy Policy</a>
            <a href="#" className="transition hover:text-sky-400">HIPAA Notice</a>
            <a href="#" className="transition hover:text-sky-400">Telehealth</a>
            <a href="#" className="transition hover:text-sky-400">Insurance & Fees</a>
          </div>
          <p className="mt-6 text-sm text-slate-300">© 2026 sgpsychiatry.com | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}

export default App
