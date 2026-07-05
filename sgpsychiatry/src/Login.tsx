import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: any) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    try {
      const res = await fetch(`${apiBase}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data?.success) {
        window.location.assign('/portal')
        return
      }

      if (data?.redirect) {
        // fallback to server-initiated OAuth redirect
        window.location.assign(data.redirect)
        return
      }

      setError(data?.error || 'Login failed')
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const openEmrPortalUrl = (() => {
    const configuredLoginUrl = import.meta.env.VITE_OPENEMR_LOGIN_URL
    if (configuredLoginUrl) return configuredLoginUrl

    const openEmrBase = import.meta.env.VITE_OPENEMR_URL || 'http://localhost/openemr-8.0.0'
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/portal` : '/portal'
    return `${openEmrBase}/portal?redirect=${encodeURIComponent(redirectTo)}`
  })()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Patient Portal Login</h2>
        <p className="mb-6 text-sm text-slate-600">Sign in to access your portal — SGPsychiatry branded login.</p>
        <form onSubmit={submit}>
          <label className="block mb-3">
            <span className="block text-sm font-medium text-slate-700">Username</span>
            <input className="mt-1 w-full rounded-2xl border px-4 py-3" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-slate-700">Password</span>
            <input type="password" className="mt-1 w-full rounded-2xl border px-4 py-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-sky-700 px-4 py-3 font-semibold text-white">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-600">If you prefer, <a href={openEmrPortalUrl} className="text-sky-700">use OpenEMR login</a>.</div>
      </div>
    </div>
  )
}
