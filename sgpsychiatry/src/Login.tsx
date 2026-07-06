export default function Login() {
  const patientPortalUrl = (() => {
    const configuredLoginUrl = import.meta.env.VITE_OPENEMR_LOGIN_URL
    if (configuredLoginUrl) return configuredLoginUrl

    const openEmrBase = import.meta.env.VITE_OPENEMR_URL || 'http://localhost/openemr-8.0.0'
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/portal` : '/portal'
    return `${openEmrBase}/portal?redirect=${encodeURIComponent(redirectTo)}`
  })()

  const staffPortalUrl = 'http://localhost/openemr-8.0.0'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Patient Portal Login</h2>
        <p className="mb-6 text-sm text-slate-600">Choose how you would like to access the portal.</p>
        <div className="space-y-3">
          <a href={patientPortalUrl} className="block w-full rounded-2xl bg-sky-700 px-4 py-3 font-semibold text-white text-center hover:bg-sky-800 transition">
            Patient Portal
          </a>
          <a href={staffPortalUrl} className="block w-full rounded-2xl bg-slate-600 px-4 py-3 font-semibold text-white text-center hover:bg-slate-700 transition">
            Staff Portal
          </a>
        </div>
      </div>
    </div>
  )
}
