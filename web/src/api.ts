import type { Stem } from './model'

const api = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '') + '/api/jobs'

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
  throw new Error(typeof data.detail === 'string' ? data.detail : 'El servicio de separación no está disponible.')
}

export async function separate(
  file: File,
  signal: AbortSignal,
  onStatus: (job: Job) => void,
) {
  const response = await checked(await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file, signal }))
  let job: Job = await response.json()
  while (job.status === 'queued' || job.status === 'processing') {
    onStatus(job)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const url = api + '/' + job.id
    job = await (await checked(await fetch(url, { signal, cache: 'no-store' }))).json()
  }
  if (job.status === 'failed') throw new Error(job.error ?? 'No se pudo separar el audio.')
  return { id: job.id, stems: job.stems ?? [] }
}

export const stemUrl = (jobId: string, stem: Stem) => api + '/' + jobId + '/stems/' + stem

export async function downloadStem(jobId: string, stem: Stem, signal: AbortSignal) {
  return (await checked(await fetch(stemUrl(jobId, stem), { signal, cache: 'no-store' }))).blob()
}
