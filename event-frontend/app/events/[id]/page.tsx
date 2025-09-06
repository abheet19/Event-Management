import Link from 'next/link'
import { api } from '../../lib/api'
import EventRegister from './register'

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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{event.name}</h1>
        <Link className="underline" href={`/events/${id}/edit`}>Edit</Link>
      </div>
      <div className="text-sm">{event.location} • {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</div>

      <div className="text-sm">
        {maxCap > 0 ? (
          <span>Capacity: {total}/{maxCap} {isFull && <strong>(Full)</strong>} {!isFull && capLeft !== null && <span>({capLeft} left)</span>}</span>
        ) : (
          <span>Capacity: Unlimited</span>
        )}
      </div>

      <section className="border p-3 rounded-md">
        <h2 className="font-medium mb-2">Register</h2>
        <EventRegister eventId={id} full={isFull} />
      </section>

      <section className="border p-3 rounded-md">
        <h2 className="font-medium mb-2">Attendees</h2>
        {attendees.data.length === 0 ? (
          <p className="text-sm">No attendees yet.</p>
        ) : (
          <ul className="space-y-2">
            {attendees.data.map((a: any) => (
              <li key={a.id} className="text-sm">{a.name} — {a.email}</li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 mt-3">
          {attendees.meta.current_page > 1 && (
            <Link className="underline" href={`?page=${attendees.meta.current_page - 1}&per_page=${attendees.meta.per_page}`}>Prev</Link>
          )}
          {attendees.meta.current_page < attendees.meta.last_page && (
            <Link className="underline" href={`?page=${attendees.meta.current_page + 1}&per_page=${attendees.meta.per_page}`}>Next</Link>
          )}
        </div>
      </section>
    </main>
  )
}
