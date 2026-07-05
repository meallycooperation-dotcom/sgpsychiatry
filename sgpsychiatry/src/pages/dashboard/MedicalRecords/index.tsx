import { useEffect, useState } from 'react'

type MedicalRecordsData = {
  summary?: any
  observations?: any[]
  documents?: any[]
}

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecordsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecords() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/dashboard/records', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          const summary = data.records.summary || {}
          const observations = data.records.observations?.entry || data.records.observations || []
          const documents = data.records.documents?.entry || data.records.documents || []
          setRecords({ summary, observations, documents })
        } else {
          setError(data.error || 'Unable to load medical records')
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading medical records…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Medical Records</h1>
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
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Medical Records</h1>
          <p className="mt-2 text-sm text-slate-600">Review your health summaries, medications, and treatment notes.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Patient</h2>
            <p className="mt-2 text-sm text-slate-600">{records?.summary?.name?.[0]?.text || records?.summary?.name?.[0]?.given?.join(' ') || records?.summary?.name?.[0]?.family || 'Patient data unavailable'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Gender</h2>
            <p className="mt-2 text-sm text-slate-600">{records?.summary?.gender || 'Unknown'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Date of Birth</h2>
            <p className="mt-2 text-sm text-slate-600">{records?.summary?.birthDate || 'Unknown'}</p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Recent Observations</h2>
          <div className="mt-4 space-y-4">
            {records?.observations?.length ? (
              records.observations.map((entry, index) => {
                const resource = entry.resource || entry
                return (
                  <div key={resource.id || index} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm text-slate-500">{resource.code?.text || resource.code?.coding?.[0]?.display || resource.resourceType}</p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900">{resource.valueString || resource.valueQuantity?.value || 'Observation detail'}</h3>
                    <p className="mt-2 text-sm text-slate-600">{resource.effectiveDateTime || resource.issued || 'Date unavailable'}</p>
                  </div>
                )
              })
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No observations found.</div>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Documentation</h2>
          <div className="mt-4 space-y-4">
            {records?.documents?.length ? (
              records.documents.map((entry, index) => {
                const resource = entry.resource || entry
                return (
                  <div key={resource.id || index} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm text-slate-500">{resource.type?.text || resource.type?.coding?.[0]?.display || 'Document'}</p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900">{resource.description || resource.title || `Document ${resource.id || index}`}</h3>
                    <p className="mt-2 text-sm text-slate-600">{resource.created || 'Date unavailable'}</p>
                  </div>
                )
              })
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No documents found.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
