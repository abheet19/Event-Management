// filepath: app/events/[id]/copy-button.tsx
"use client"

import { useState } from 'react'
import { IconButton } from '../../components/ui/button'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }
  return (
    <IconButton aria-label="Copy email" onClick={onCopy} title={copied ? 'Copied' : 'Copy'}>
      {copied ? '✓' : '⧉'}
    </IconButton>
  )
}
