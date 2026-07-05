import { useEffect, useState } from 'react'

type ProfileData = {
  name?: string
  email?: string
  phone?: string
  preferred_username?: string
}

type ApiResponse = {
  success: boolean
  profile?: ProfileData
  error?: string
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/profile', { credentials: 'include' })
        const data: ApiResponse = await res.json()
        if (data.success && data.profile) {
          setProfile(data.profile)
        } else {
          setError(data.error || 'Unable to load profile')
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-4 text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-700">Patient Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome, {profile?.name || 'patient'}</h1>
            <p className="mt-2 text-sm text-slate-600">This data is fetched from OpenEMR via your authenticated session.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{profile?.name || 'Not available'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{profile?.email || 'Not available'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Phone</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{profile?.phone || 'Not available'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Username</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{profile?.preferred_username || 'Not available'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
