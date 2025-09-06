// filepath: app/components/timezone-badge.tsx
"use client"

import { useMemo } from 'react'

export default function TimezoneBadge() {
  const tz = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' } catch { return 'UTC' }
  }, [])
  return (
    <span title="Times shown in your local timezone" className="rounded-full border bg-white/70 px-2 py-1 text-xs text-neutral-700 shadow-sm">
      {tz}
    </span>
  )
}
