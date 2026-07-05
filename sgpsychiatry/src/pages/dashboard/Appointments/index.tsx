import { useEffect, useState } from 'react'

type Appointment = {
  id?: string
  provider?: string
  date?: string
  status?: string
  [key: string]: any
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/dashboard/appointments', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setAppointments(data.appointments || [])
        } else {
          setError(data.error || 'Unable to load appointments')
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading appointments…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Appointments</h1>
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
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Appointments</h1>
          <p className="mt-2 text-sm text-slate-600">Review your upcoming and past appointments in one place.</p>
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No appointments found.</div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div key={appointment.id || index} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{appointment.status || 'Appointment'}</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">{appointment.title || appointment.provider || 'Appointment details'}</h2>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{appointment.date || appointment.start || 'Date unknown'}</span>
                </div>
                {appointment.location && <p className="mt-3 text-sm text-slate-600">Location: {appointment.location}</p>}
                {appointment.notes && <p className="mt-3 text-sm text-slate-600">Notes: {appointment.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
