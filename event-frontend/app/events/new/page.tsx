"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useToast } from '../../components/ui/toaster'
import DatetimePicker from '../../components/ui/datetime-picker'

export default function NewEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', location: '', start_time: '', end_time: '', max_capacity: 0 })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const tz = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' } catch { return 'UTC' }
  }, [])

  const onStartChange = (v: string) => {
    const start = new Date(v)
    const end = new Date(form.end_time)
    // if end is before or equal start, push end by 1h
    if (!isNaN(start.getTime()) && (!form.end_time || end <= start)) {
      const newEnd = new Date(start.getTime() + 60 * 60 * 1000)
      const iso = new Date(newEnd.getTime() - newEnd.getTimezoneOffset() * 60000).toISOString().slice(0,16)
      setForm({ ...form, start_time: v, end_time: iso })
    } else {
      setForm({ ...form, start_time: v })
    }
  }

  const minIsoNow = useMemo(() => {
    const d = new Date()
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16)
    return iso
  }, [])

  useEffect(() => {
    // Prefill future times: now+1h and +2h (local tz)
    const now = new Date()
    const start = new Date(now.getTime() + 60 * 60 * 1000)
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    const fmt = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setForm((f) => ({ ...f, start_time: fmt(start), end_time: fmt(end) }))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.start_time || !form.end_time) { setError('Start and end time are required'); return }
    if (new Date(form.end_time) <= new Date(form.start_time)) { setError('End time must be after start time'); return }
    if (new Date(form.start_time) < new Date()) { setError('Start time must be in the future'); return }
    if (form.max_capacity < 0) { setError('Max capacity cannot be negative'); return }
    try {
      setSubmitting(true)
      await api('/events', { method: 'POST', body: { ...form, name: form.name.trim(), location: form.location.trim(), max_capacity: Number(form.max_capacity) } })
      toast({ title: 'Event created', description: 'Your event is now listed under upcoming events.', variant: 'success' })
      router.push('/events')
      router.refresh()
    } catch (err: any) {
      const msg = err.message || 'Failed to create event'
      setError(msg)
      toast({ title: 'Create failed', description: msg, variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <main className="space-y-4">
      <h1 className="h1">Create Event</h1>
      <form onSubmit={onSubmit} className="card space-y-3 max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required disabled={submitting} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} disabled={submitting} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="start">Start time</Label>
            <DatetimePicker id="start" label="" value={form.start_time} onChange={onStartChange} min={minIsoNow} />
            <p className="mt-1 text-xs text-neutral-500">Times shown in your timezone: {tz}</p>
          </div>
          <div>
            <Label htmlFor="end">End time</Label>
            <DatetimePicker id="end" label="" value={form.end_time} onChange={(v) => setForm({ ...form, end_time: v })} min={form.start_time || minIsoNow} />
          </div>
        </div>
        <div>
          <Label htmlFor="cap">Max capacity</Label>
          <Input id="cap" type="number" min={0} value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: Number(e.target.value) })} required disabled={submitting} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>Cancel</Button>
        </div>
      </form>
    </main>
  )
}
