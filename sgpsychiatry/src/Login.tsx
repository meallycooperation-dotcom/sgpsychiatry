export default function Login() {
  const patientPortalUrl = (() => {
    const configuredLoginUrl = import.meta.env.VITE_OPENEMR_LOGIN_URL
    if (configuredLoginUrl) return configuredLoginUrl

    return 'https://portal.sgpsychiatry.com/portal'
  })()

  const staffPortalUrl = import.meta.env.VITE_STAFF_PORTAL_URL || 'https://ehr.sgpsychiatry.com'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Choose how to access the portal</h2>
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
