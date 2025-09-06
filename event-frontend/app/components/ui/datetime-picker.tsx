// filepath: app/components/ui/datetime-picker.tsx
"use client"

import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Button } from './button'

function toLocalInput(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function parseLocal(value?: string): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function sameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export interface DatetimePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  min?: string
  label?: string
}

export default function DatetimePicker({ id, value, onChange, min, label }: DatetimePickerProps) {
  const selected = React.useMemo(() => parseLocal(value) || new Date(), [value])
  const minDate = React.useMemo(() => parseLocal(min || ''), [min])
  const [open, setOpen] = React.useState(false)

  const onDaySelect = (day?: Date) => {
    if (!day) return
    let d = new Date(selected)
    d.setFullYear(day.getFullYear(), day.getMonth(), day.getDate())
    // Enforce min if needed
    if (minDate && sameDate(d, minDate) && d < minDate) d = new Date(minDate)
    onChange(toLocalInput(d))
  }

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hh, mm] = e.target.value.split(':').map(Number)
    let d = new Date(selected)
    if (!isNaN(hh) && !isNaN(mm)) {
      d.setHours(hh, mm, 0, 0)
      if (minDate && d < minDate) d = new Date(minDate)
      onChange(toLocalInput(d))
    }
  }

  const timeValue = `${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}`
  const minTime = React.useMemo(() => {
    if (!minDate) return undefined
    return sameDate(selected, minDate) ? `${String(minDate.getHours()).padStart(2, '0')}:${String(minDate.getMinutes()).padStart(2, '0')}` : undefined
  }, [selected, minDate])

  return (
    <div className="flex items-center gap-2">
      {label && <label htmlFor={id} className="text-sm">{label}</label>}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button type="button" variant="outline" className="justify-start font-normal">
            {selected.toLocaleString()}
          </Button>
        </Popover.Trigger>
        <Popover.Content sideOffset={6} className="rounded-md border bg-white p-2 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={onDaySelect}
            disabled={minDate ? [{ before: new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) }] : undefined}
            className="mb-2"
          />
          <div className="flex items-center gap-2">
            <label htmlFor={`${id}-time`} className="text-sm">Time</label>
            <input
              id={`${id}-time`}
              type="time"
              className="rounded border px-2 py-1 text-sm"
              value={timeValue}
              min={minTime}
              onChange={onTimeChange}
            />
            <Button type="button" variant="default" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
