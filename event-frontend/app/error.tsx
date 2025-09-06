// filepath: app/error.tsx
"use client"

import { Button } from './components/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="card">
        <h2 className="h2 mb-2">Something went wrong</h2>
        <p className="muted text-sm">An unexpected error occurred while rendering this page.</p>
        {error?.message && (
          <p className="mt-2 text-sm">{error.message}</p>
        )}
        <div className="mt-4 flex gap-2">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  )
}
