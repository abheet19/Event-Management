"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '../../../lib/api'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

export default function EditEventPage() {
  const params = useParams()
  const id = String(params?.id || '')
  const router = useRouter()
  const [form, setForm] = useState({ name: '', location: '', start_time: '', end_time: '', max_capacity: 0 })
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    (async () => {
      const e = await api(`/events/${id}`)
      setForm({
        name: e.name || '',
        location: e.location || '',
        start_time: e.start_time ? new Date(e.start_time).toISOString().slice(0,16) : '',
        end_time: e.end_time ? new Date(e.end_time).toISOString().slice(0,16) : '',
        max_capacity: e.max_capacity ?? 0,
      })
      setLoaded(true)
    })()
  }, [id])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.start_time || !form.end_time) { setError('Start and end time are required'); return }
    if (new Date(form.end_time) <= new Date(form.start_time)) { setError('End time must be after start time'); return }
    if (form.max_capacity < 0) { setError('Max capacity cannot be negative'); return }
    try {
      setSubmitting(true)
      await api(`/events/${id}`, { method: 'PUT', body: { ...form, name: form.name.trim(), location: form.location.trim(), max_capacity: Number(form.max_capacity) } })
      router.push(`/events/${id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('Delete this event? This cannot be undone.')) return
    try {
      setSubmitting(true)
      await api(`/events/${id}`, { method: 'DELETE' })
      router.push('/events')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!loaded) return <p>Loading...</p>

  return (
    <main>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Edit Event</h1>
        <Button variant="outline" onClick={onDelete} disabled={submitting}>Delete</Button>
      </div>
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
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
      </form>
    </main>
  )
}
