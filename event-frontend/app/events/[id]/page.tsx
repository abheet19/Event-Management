import Link from 'next/link'
import { api } from '../../lib/api'
import EventRegister from './register'
import { Button } from '../../components/ui/button'
import PerPageSelect from '../per-page-select'
import AttendeesControls from './attendees-controls'
import CopyButton from './copy-button'

async function getEvent(id: string) {
  return api(`/events/${id}`, { next: { revalidate: 0 } })
}

async function getAttendees(id: string, page: number, perPage: number, q: string, sort: string) {
  const qp = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (q) qp.set('q', q)
  if (sort) qp.set('sort', sort)
  return api(`/events/${id}/attendees?${qp.toString()}`, { next: { revalidate: 0 } })
}

export default async function EventDetail({ params, searchParams }: any) {
  const id = params.id as string
  const page = Number(searchParams?.page || 1)
  const perPage = Number(searchParams?.per_page || 10)
  const q = String(searchParams?.q || '')
  const sort = String(searchParams?.sort || 'created_at_desc')
  const [event, attendees] = await Promise.all([getEvent(id), getAttendees(id, page, perPage, q, sort)])

  const total = attendees?.meta?.total ?? 0
  const maxCap = event?.max_capacity ?? 0
  const capLeft = maxCap > 0 ? Math.max(0, maxCap - total) : null
  const isFull = maxCap > 0 && total >= maxCap

  return (
    <main id="main" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="h1">{event.name}</h1>
        <Button asChild variant="outline"><Link href={`/events/${id}/edit`}>Edit</Link></Button>
      </div>
      <div className="space-y-1">
        <div className="muted">{event.location || '—'}</div>
        <div className="muted">{new Date(event.start_time).toLocaleString()} — {new Date(event.end_time).toLocaleString()}</div>
      </div>

      <div className="muted">
        {maxCap > 0 ? (
          <span>Capacity: {total}/{maxCap} {isFull && <strong>(Full)</strong>} {!isFull && capLeft !== null && <span>({capLeft} left)</span>}</span>
        ) : (
          <span>Capacity: Unlimited</span>
        )}
      </div>

      <section className="card">
        <h2 className="h2 mb-2">Register</h2>
        <EventRegister eventId={id} full={isFull} />
      </section>

      <section className="card space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="h2">Attendees</h2>
            <div className="muted text-sm">Page {attendees.meta.current_page} of {attendees.meta.last_page} • {attendees.meta.total} total</div>
          </div>
          <PerPageSelect value={attendees.meta.per_page} />
        </div>

        <AttendeesControls />

        {attendees.data.length === 0 ? (
          <p className="text-sm">No attendees yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500">
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1">Email</th>
                  <th className="px-2 py-1" />
                </tr>
              </thead>
              <tbody>
                {attendees.data.map((a: any) => (
                  <tr key={a.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-2 py-1">{a.name}</td>
                    <td className="px-2 py-1 font-mono">{a.email}</td>
                    <td className="px-2 py-1 text-right"><CopyButton text={a.email} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          {attendees.meta.current_page > 1 && (
            <Button asChild variant="outline"><Link href={`?page=${attendees.meta.current_page - 1}&per_page=${attendees.meta.per_page}${q ? `&q=${encodeURIComponent(q)}` : ''}${sort ? `&sort=${encodeURIComponent(sort)}` : ''}`}>Prev</Link></Button>
          )}
          {attendees.meta.current_page < attendees.meta.last_page && (
            <Button asChild variant="outline"><Link href={`?page=${attendees.meta.current_page + 1}&per_page=${attendees.meta.per_page}${q ? `&q=${encodeURIComponent(q)}` : ''}${sort ? `&sort=${encodeURIComponent(sort)}` : ''}`}>Next</Link></Button>
          )}
        </div>
      </section>
    </main>
  )
}
