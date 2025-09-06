"use client"

import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useRouter } from 'next/navigation'
import { useToast } from '../../components/ui/toaster'
import { cn } from '../../lib/cn'

export default function EventRegister({ eventId, full = false }: { eventId: string, full?: boolean }) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (full) return
    setMsg(null)
    if (!name.trim()) { setMsg('Name is required'); return }
    if (!emailValid) { setMsg('Enter a valid email'); setEmailTouched(true); return }
    try {
      setSubmitting(true)
      await api(`/events/${eventId}/register`, { method: 'POST', body: { name: name.trim(), email: email.trim() } })
      setMsg('Registered!')
      toast({ title: 'Registered', description: 'You have been added to the attendee list.', variant: 'success' })
      setName('')
      setEmail('')
      setEmailTouched(false)
      router.refresh()
    } catch (err: any) {
      const emsg = err.message || 'Registration failed'
      setMsg(emsg)
      toast({ title: 'Registration failed', description: emsg, variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="rname">Name</Label>
          <Input id="rname" value={name} onChange={e => setName(e.target.value)} required disabled={full || submitting} />
        </div>
        <div>
          <Label htmlFor="remail">Email</Label>
          <Input
            id="remail"
            type="email"
            inputMode="email"
            autoComplete="email"
            pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
            title="Enter a valid email like name@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); if (!emailTouched) setEmailTouched(true) }}
            onBlur={() => setEmailTouched(true)}
            required
            disabled={full || submitting}
            className={cn(emailTouched && !emailValid && 'border-red-500 focus:ring-red-200')}
          />
          {emailTouched && !emailValid && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address.</p>
          )}
        </div>
      </div>
      {full && <p className="text-sm text-red-600">Event is at full capacity.</p>}
      {msg && <p className="text-sm">{msg}</p>}
      <Button type="submit" disabled={full || submitting || !name.trim() || !emailValid}>{submitting ? 'Submitting…' : 'Register'}</Button>
    </form>
  )
}
