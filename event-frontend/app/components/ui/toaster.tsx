// filepath: app/components/ui/toaster.tsx
"use client"

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ToastVariant = 'success' | 'error' | 'info'
export type ToastInput = {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export type Toast = ToastInput & { id: number }

type ToastContextType = {
  toast: (t: ToastInput) => void
  remove: (id: number) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(1)

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback((t: ToastInput) => {
    const id = idRef.current++
    const duration = t.duration ?? 3500
    const next: Toast = { id, ...t }
    setToasts((prev) => [...prev, next])
    // auto-dismiss
    window.setTimeout(() => remove(id), duration)
  }, [remove])

  const value = useMemo(() => ({ toast, remove, toasts }), [toast, remove, toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return { toast: ctx.toast }
}

function ToastIcon({ variant }: { variant?: ToastVariant }) {
  if (variant === 'success') return <CheckCircle2 className="h-5 w-5 text-green-600" />
  if (variant === 'error') return <AlertCircle className="h-5 w-5 text-red-600" />
  return <Info className="h-5 w-5 text-blue-600" />
}

export function Toaster() {
  const ctx = useContext(ToastContext)
  if (!ctx) return null
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {ctx.toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-white/95 p-3 shadow-md backdrop-blur transition-all',
            t.variant === 'success' && 'border-green-200',
            t.variant === 'error' && 'border-red-200',
            t.variant === 'info' && 'border-blue-200'
          )}
        >
          <ToastIcon variant={t.variant} />
          <div className="flex-1">
            {t.title && <div className="text-sm font-medium leading-none">{t.title}</div>}
            {t.description && <div className="mt-1 text-sm text-neutral-700">{t.description}</div>}
          </div>
          <button
            onClick={() => ctx.remove(t.id)}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
