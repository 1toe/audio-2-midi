import type { Stem } from './model'

const apiBase = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '')
const api = apiBase + '/api/jobs'
export const canSeparate = import.meta.env.MODE !== 'vercel' || apiBase !== ''
const unavailable = 'El servicio de separación no está disponible. Revisa su configuración o usa Pista aislada.'

type Job = {
  id: string
  status: 'queued' | 'processing' | 'ready' | 'failed'
  estimate_seconds?: number
  error?: string
  stems?: Stem[]
}

async function checked(response: Response) {
  if (response.ok) return response
  const data = await response.json().catch(() => ({}))
  throw new Error(typeof data.detail === 'string' ? data.detail : unavailable)
}

async function readJob(url: string, options: RequestInit): Promise<Job> {
  const response = await checked(await fetch(url, options).catch(error => {
    if (options.signal?.aborted) throw error
    throw new Error(unavailable)
  }))
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error(unavailable)
  return response.json()
}

export async function discardJob(id: string) {
  await checked(await fetch(api + '/' + id, { method: 'DELETE', keepalive: true }))
}

export async function separate(file: File, signal: AbortSignal, onStatus: (job: Job) => void) {
  signal.throwIfAborted()
  if (!canSeparate) throw new Error(unavailable)
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')
  const cleanup = () => { void discardJob(id).catch(() => {}) }
  signal.addEventListener('abort', cleanup, { once: true })
  try {
    let job = await readJob(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream', 'X-Job-ID': id },
      body: file, signal,
    })
    while (job.status === 'queued' || job.status === 'processing') {
      onStatus(job)
      await new Promise(resolve => setTimeout(resolve, 1500))
      signal.throwIfAborted()
      job = await readJob(api + '/' + job.id, { signal, cache: 'no-store' })
    }
    signal.throwIfAborted()
    if (job.status === 'failed') throw new Error(job.error ?? 'No se pudo separar el audio.')
    if (job.status !== 'ready' || !job.stems?.length) throw new Error(unavailable)
    return { id: job.id, stems: job.stems }
  } catch (error) {
    if (!signal.aborted) cleanup()
    throw error
  } finally {
    signal.removeEventListener('abort', cleanup)
  }
}

export const stemUrl = (jobId: string, stem: Stem) => api + '/' + jobId + '/stems/' + stem

export async function downloadStem(jobId: string, stem: Stem, signal: AbortSignal) {
  return (await checked(await fetch(stemUrl(jobId, stem), { signal, cache: 'no-store' }))).blob()
}
