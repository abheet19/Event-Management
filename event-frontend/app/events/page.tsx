import Link from 'next/link'
import { api } from '../lib/api'
import { Button, buttonVariants } from '../components/ui/button'
import { cn } from '../lib/cn'

export default async function EventsPage({ searchParams }: any) {
  const page = Number(searchParams?.page || 1)
  const perPage = Number(searchParams?.per_page || 10)
  const includePast = String(searchParams?.include_past || '0')
  const qs = `?page=${page}&per_page=${perPage}${includePast === '1' ? '&include_past=1' : ''}`
  const res = await api(`/events${qs}`, { next: { revalidate: 0 } })
  const events = res?.data || []
  const meta = res?.meta || { current_page: 1, last_page: 1, per_page: perPage }

  return (
    <main className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="h1">{includePast === '1' ? 'All Events' : 'Upcoming Events'}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/events/new`} className={cn(buttonVariants({ variant: 'default' }))}>Create Event</Link>
          <Button asChild variant="outline">
            <Link href={`/events?${includePast === '1' ? '' : 'include_past=1'}`.replace(/\?$|&$/, '')}>
              {includePast === '1' ? 'Hide past' : 'Show past'}
            </Link>
          </Button>
        </div>
      </div>
      {(!events || events.length === 0) ? (
        <div className="card">
          <p className="muted">No events to show.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {events.map((e: any) => (
            <li key={e.id} className="card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-medium">{e.name}</div>
                  <div className="muted">{e.location} • {new Date(e.start_time).toLocaleString()} - {new Date(e.end_time).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="secondary"><Link href={`/events/${e.id}`}>View</Link></Button>
                  <Button asChild variant="outline"><Link href={`/events/${e.id}/edit`}>Edit</Link></Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        {meta.current_page > 1 && (
          <Button asChild variant="outline"><Link href={`?page=${meta.current_page - 1}&per_page=${meta.per_page}${includePast === '1' ? '&include_past=1' : ''}`}>Prev</Link></Button>
        )}
        {meta.current_page < meta.last_page && (
          <Button asChild variant="outline"><Link href={`?page=${meta.current_page + 1}&per_page=${meta.per_page}${includePast === '1' ? '&include_past=1' : ''}`}>Next</Link></Button>
        )}
      </div>
    </main>
  )
}
