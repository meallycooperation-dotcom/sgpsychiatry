import { useEffect, useState } from 'react'

type MessageItem = {
  id?: string
  subject?: string
  body?: string
  text?: string
  date?: string
  sentAt?: string
  from?: string
  sender?: string
  status?: string
}

export default function Messages() {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMessages() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/dashboard/messages', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setMessages(data.messages || [])
        } else {
          setError(data.error || 'Unable to load messages')
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading messages…</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Messages</h1>
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
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Messages</h1>
          <p className="mt-2 text-sm text-slate-600">Send and receive secure messages from your care team.</p>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No messages available.</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={message.id || index} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{message.from || message.sender || 'Care Team'}</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">{message.subject || 'Secure message'}</h2>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{message.date || message.sentAt || 'Date unknown'}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{message.body || message.text || 'No message body available.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
