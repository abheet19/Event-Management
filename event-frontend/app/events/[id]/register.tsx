"use client"

import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useRouter } from 'next/navigation'

export default function EventRegister({ eventId, full = false }: { eventId: string, full?: boolean }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (full) return
    setMsg(null)
    if (!name.trim()) { setMsg('Name is required'); return }
    const emailOk = /.+@.+\..+/.test(email)
    if (!emailOk) { setMsg('Enter a valid email'); return }
    try {
      setSubmitting(true)
      await api(`/events/${eventId}/register`, { method: 'POST', body: { name: name.trim(), email: email.trim() } })
      setMsg('Registered!')
      setName('')
      setEmail('')
      router.refresh()
    } catch (err: any) {
      setMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <Label htmlFor="rname">Name</Label>
        <Input id="rname" value={name} onChange={e => setName(e.target.value)} required disabled={full || submitting} />
      </div>
      <div>
        <Label htmlFor="remail">Email</Label>
        <Input id="remail" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={full || submitting} />
      </div>
      {full && <p className="text-sm text-red-600">Event is at full capacity.</p>}
      {msg && <p className="text-sm">{msg}</p>}
      <Button type="submit" disabled={full || submitting}>{submitting ? 'Submitting...' : 'Register'}</Button>
    </form>
  )
}
