import { useEffect, useState } from 'react'

type Claim = {
  id?: string
  status?: string
  type?: any
  total?: any
  billablePeriod?: any
  [key: string]: any
}

export default function Billing() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadBilling() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/dashboard/billing', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          const items = data.billing?.entry || data.billing || []
          setClaims(Array.isArray(items) ? items : [])
        } else {
          setError(data.error || 'Unable to load billing data')
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    loadBilling()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading billing…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Billing</h1>
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
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Billing</h1>
          <p className="mt-2 text-sm text-slate-600">View invoices, payment history, and insurance details.</p>
        </div>

        {claims.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No billing records found.</div>
        ) : (
          <div className="space-y-4">
            {claims.map((entry: any, index) => {
              const resource = entry.resource || entry
              const amount = resource.total?.[0]?.amount?.value || resource.total?.value || 'N/A'
              return (
                <div key={resource.id || index} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{resource.status || 'Claim'}</p>
                      <h2 className="mt-1 text-xl font-semibold text-slate-900">{resource.type?.coding?.[0]?.display || 'Billing item'}</h2>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{amount}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{resource.billablePeriod?.start || resource.period?.start || 'Period unavailable'}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
