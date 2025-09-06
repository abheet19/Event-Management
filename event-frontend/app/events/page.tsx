import Link from 'next/link'
import { api } from '../lib/api'
import { Button, buttonVariants } from '../components/ui/button'
import { cn } from '../lib/cn'
import PerPageSelect from './per-page-select'
import IncludePastToggle from './include-past-toggle'

export default async function EventsPage({ searchParams }: any) {
  const page = Number(searchParams?.page || 1)
  const perPage = Number(searchParams?.per_page || 10)
  const includePast = String(searchParams?.include_past || '0')
  const qs = `?page=${page}&per_page=${perPage}${includePast === '1' ? '&include_past=1' : ''}`
  const res = await api(`/events${qs}`, { next: { revalidate: 0 } })
  const events = res?.data || []
  const meta = res?.meta || { current_page: 1, last_page: 1, per_page: perPage, total: 0 }

  return (
    <main id="main" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="h1">{includePast === '1' ? 'All Events' : 'Upcoming Events'}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/events/new`} className={cn(buttonVariants({ variant: 'default' }))}>Create Event</Link>
          <IncludePastToggle />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="muted text-sm">Page {meta.current_page} of {meta.last_page} • {meta.total} total</div>
        <PerPageSelect value={meta.per_page} />
      </div>

      {(!events || events.length === 0) ? (
        <div className="card flex items-center justify-between">
          <div>
            <p className="font-medium">No events to show.</p>
            <p className="muted text-sm">Create your first event to get started.</p>
          </div>
          <Link href="/events/new" className={cn(buttonVariants({ variant: 'default' }))}>Create Event</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {events.map((e: any) => {
            const start = new Date(e.start_time)
            const end = new Date(e.end_time)
            const durationHrs = Math.round(((+end - +start) / 36e5) * 10) / 10
            return (
              <li key={e.id} className="card transition-colors hover:bg-neutral-50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-medium">{e.name}</div>
                    <div className="muted">{start.toLocaleString()} — {end.toLocaleString()}</div>
                    <div className="text-xs text-neutral-500">{e.location || '—'} • ~{durationHrs}h</div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="secondary"><Link href={`/events/${e.id}`}>View</Link></Button>
                    <Button asChild variant="outline"><Link href={`/events/${e.id}/edit`}>Edit</Link></Button>
                  </div>
                </div>
              </li>
            )
          })}
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
