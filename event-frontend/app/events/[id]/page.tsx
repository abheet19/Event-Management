import Link from 'next/link'
import { api } from '../../lib/api'
import EventRegister from './register'
import { Button } from '../../components/ui/button'

async function getEvent(id: string) {
  return api(`/events/${id}`, { next: { revalidate: 0 } })
}

async function getAttendees(id: string, page: number, perPage: number) {
  return api(`/events/${id}/attendees?page=${page}&per_page=${perPage}`, { next: { revalidate: 0 } })
}

export default async function EventDetail({ params, searchParams }: any) {
  const id = params.id as string
  const page = Number(searchParams?.page || 1)
  const perPage = Number(searchParams?.per_page || 10)
  const [event, attendees] = await Promise.all([getEvent(id), getAttendees(id, page, perPage)])

  const total = attendees?.meta?.total ?? 0
  const maxCap = event?.max_capacity ?? 0
  const capLeft = maxCap > 0 ? Math.max(0, maxCap - total) : null
  const isFull = maxCap > 0 && total >= maxCap

  return (
    <main className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="h1">{event.name}</h1>
        <Button asChild variant="outline"><Link href={`/events/${id}/edit`}>Edit</Link></Button>
      </div>
      <div className="muted">{event.location} • {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</div>

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

      <section className="card">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="h2">Attendees</h2>
          <div className="muted">{total} total</div>
        </div>
        {attendees.data.length === 0 ? (
          <p className="text-sm">No attendees yet.</p>
        ) : (
          <ul className="space-y-2">
            {attendees.data.map((a: any) => (
              <li key={a.id} className="text-sm">{a.name} — {a.email}</li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex gap-2">
          {attendees.meta.current_page > 1 && (
            <Button asChild variant="outline"><Link href={`?page=${attendees.meta.current_page - 1}&per_page=${attendees.meta.per_page}`}>Prev</Link></Button>
          )}
          {attendees.meta.current_page < attendees.meta.last_page && (
            <Button asChild variant="outline"><Link href={`?page=${attendees.meta.current_page + 1}&per_page=${attendees.meta.per_page}`}>Next</Link></Button>
          )}
        </div>
      </section>
    </main>
  )
}
