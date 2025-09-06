// filepath: app/events/[id]/attendees-controls.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest first' },
  { value: 'created_at_asc', label: 'Oldest first' },
  { value: 'name_asc', label: 'Name A→Z' },
  { value: 'name_desc', label: 'Name Z→A' },
]

export default function AttendeesControls() {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  const q = search?.get('q') || ''
  const sort = search?.get('sort') || 'created_at_desc'

  const update = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(search?.toString() || '')
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === '') params.delete(k)
      else params.set(k, v)
    }
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm" htmlFor="attendee-q">Search</label>
        <Input
          id="attendee-q"
          placeholder="name or email"
          defaultValue={q}
          onChange={(e) => update({ q: e.target.value })}
          className="h-8 w-56"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm" htmlFor="attendee-sort">Sort</label>
        <select
          id="attendee-sort"
          className="rounded border px-2 py-1 text-sm"
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button variant="outline" onClick={() => update({ q: '', sort: 'created_at_desc' })}>Reset</Button>
      </div>
    </div>
  )
}
