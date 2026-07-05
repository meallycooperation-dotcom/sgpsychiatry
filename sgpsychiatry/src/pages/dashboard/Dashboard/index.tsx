import { useEffect, useState } from 'react'

type DashboardSummary = {
  patient?: any
  appointments?: any[]
  providers?: any[]
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSummary() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/dashboard/summary', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setSummary(data.summary)
        } else {
          setError(data.error || 'Unable to load dashboard summary')
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-4 text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700">Patient Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Quick access to your appointments, messages, and care details.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Patient</h2>
            <p className="mt-2 text-sm text-slate-600">{summary?.patient?.name?.[0]?.text || summary?.patient?.name?.[0]?.given?.join(' ') || summary?.patient?.name?.[0]?.family || 'Patient data not available'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Upcoming Appointments</h2>
            <p className="mt-2 text-sm text-slate-600">{summary?.appointments?.length ?? 0} scheduled appointments</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Providers</h2>
            <p className="mt-2 text-sm text-slate-600">{summary?.providers?.length ?? 0} care team members</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Next Appointment</h3>
            <p className="mt-2 text-sm text-slate-600">{summary?.appointments?.[0]?.date || 'No next appointment available'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Primary Provider</h3>
            <p className="mt-2 text-sm text-slate-600">{summary?.providers?.[0]?.name || 'Provider details not available'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
