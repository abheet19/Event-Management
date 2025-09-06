import * as React from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-neutral-300',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
