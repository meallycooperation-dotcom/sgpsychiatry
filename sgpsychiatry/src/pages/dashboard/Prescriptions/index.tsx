import { useEffect, useState } from 'react'

type Prescription = {
  id?: string
  medicationCodeableConcept?: any
  medicationReference?: any
  status?: string
  authoredOn?: string
  [key: string]: any
}

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPrescriptions() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/dashboard/prescriptions', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          const meds = data.prescriptions?.entry || data.prescriptions || []
          setPrescriptions(Array.isArray(meds) ? meds : [])
        } else {
          setError(data.error || 'Unable to load prescriptions')
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    loadPrescriptions()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading prescriptions…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Prescriptions</h1>
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
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Prescriptions</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your active prescriptions and refill requests.</p>
        </div>

        {prescriptions.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No prescriptions available.</div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((entry: any, index) => {
              const resource = entry.resource || entry
              const medication = resource.medicationCodeableConcept?.text || resource.medicationReference?.display || 'Medication'
              return (
                <div key={resource.id || index} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{resource.status || 'Prescription'}</p>
                      <h2 className="mt-1 text-xl font-semibold text-slate-900">{medication}</h2>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{resource.authoredOn || resource.dateWritten || 'Date unknown'}</span>
                  </div>
                  {resource.dosageInstruction?.[0]?.text && <p className="mt-3 text-sm text-slate-600">{resource.dosageInstruction[0].text}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
