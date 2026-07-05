import { useEffect, useState } from 'react'

type ProfileData = {
  name?: string
  email?: string
  phone?: string
  preferred_username?: string
}

export default function Settings() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/profile', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setProfile(data.profile || {})
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
    return <div className="min-h-screen flex items-center justify-center">Loading settings…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-4 text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700">Patient Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Settings</h1>
          <p className="mt-2 text-sm text-slate-600">Update your profile, security settings, and notification preferences.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="mt-1 font-semibold text-slate-900">{profile?.name || profile?.preferred_username || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="mt-1 font-semibold text-slate-900">{profile?.email || 'Not available'}</p>
              </div>
              <div>
                <p className="text-slate-500">Phone</p>
                <p className="mt-1 font-semibold text-slate-900">{profile?.phone || 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
            <p className="mt-4 text-sm text-slate-600">You can manage notification settings and alerts for appointments, messages, and billing updates.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Appointment reminders</p>
                <p className="mt-1 text-sm text-slate-600">Enabled</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Secure messages</p>
                <p className="mt-1 text-sm text-slate-600">Enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
