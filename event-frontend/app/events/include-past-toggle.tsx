// filepath: app/events/include-past-toggle.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../components/ui/button'

export default function IncludePastToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const includePast = (search?.get('include_past') || '0') === '1'

  const toggle = () => {
    const params = new URLSearchParams(search?.toString() || '')
    if (includePast) params.delete('include_past')
    else params.set('include_past', '1')
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Button onClick={toggle} variant="outline">{includePast ? 'Hide past' : 'Show past'}</Button>
  )
}
