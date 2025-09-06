// filepath: app/events/per-page-select.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function PerPageSelect({ value }: { value: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const per = Number(e.target.value)
    const params = new URLSearchParams(search?.toString() || '')
    params.set('per_page', String(per))
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span>Per page</span>
      <select className="rounded border px-2 py-1" value={value} onChange={onChange}>
        {[5,10,20,50].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </label>
  )
}
