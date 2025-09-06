// filepath: app/events/loading.tsx
import { Skeleton } from '../components/ui/skeleton'

export default function LoadingEvents() {
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-32" />
      </div>
      <ul className="grid grid-cols-1 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="card">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-14" />
                <Skeleton className="h-9 w-14" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-16" />
      </div>
    </main>
  )
}
