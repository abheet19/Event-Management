export type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: HeadersInit
  body?: any
  next?: RequestInit['next']
}

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

function detectTz() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export async function api(path: string, opts: ApiOptions = {}) {
  const tz = detectTz()
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}tz=${encodeURIComponent(tz)}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Timezone': tz,
    ...(opts.headers || {}),
  }
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    next: opts.next,
  })
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try { const j = await res.json(); msg = j.message || msg } catch {}
    throw new Error(msg)
  }
  if (res.status === 204) return null
  return res.json()
}
