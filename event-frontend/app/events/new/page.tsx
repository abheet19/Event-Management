"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export default function NewEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', location: '', start_time: '', end_time: '', max_capacity: 0 })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.start_time || !form.end_time) { setError('Start and end time are required'); return }
    if (new Date(form.end_time) <= new Date(form.start_time)) { setError('End time must be after start time'); return }
    if (form.max_capacity < 0) { setError('Max capacity cannot be negative'); return }
    try {
      setSubmitting(true)
      await api('/events', { method: 'POST', body: { ...form, name: form.name.trim(), location: form.location.trim(), max_capacity: Number(form.max_capacity) } })
      // Navigate to list and refresh to bust any client-side cache
      router.push('/events')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <main>
      <h1 className="text-xl font-semibold mb-4">Create Event</h1>
      <form onSubmit={onSubmit} className="space-y-3 max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required disabled={submitting} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} disabled={submitting} />
        </div>
        <div>
          <Label htmlFor="start">Start time</Label>
          <Input id="start" type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required disabled={submitting} />
        </div>
        <div>
          <Label htmlFor="end">End time</Label>
          <Input id="end" type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required disabled={submitting} />
        </div>
        <div>
          <Label htmlFor="cap">Max capacity</Label>
          <Input id="cap" type="number" min={0} value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: Number(e.target.value) })} required disabled={submitting} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</Button>
      </form>
    </main>
  )
}
