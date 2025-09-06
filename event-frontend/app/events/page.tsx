import Link from 'next/link'
import { api } from '../lib/api'

export default async function EventsPage() {
  const events = await api('/events', { next: { revalidate: 0 } })
  return (
    <main>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Upcoming Events</h1>
        <Link className="underline" href="/events/new">Create</Link>
      </div>
      {(!events || events.length === 0) ? (
        <p className="text-sm">No upcoming events. Create one to get started.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((e: any) => (
            <li key={e.id} className="border p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-sm">{e.location} • {new Date(e.start_time).toLocaleString()} - {new Date(e.end_time).toLocaleString()}</div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/events/${e.id}`} className="underline">View</Link>
                  <Link href={`/events/${e.id}/edit`} className="underline">Edit</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
