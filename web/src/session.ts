import { decodeAudio, monoSamples } from './audio'
import type { Settings, Track, WorkerReply, WorkerRequest } from './model'

export class PitchSession {
  private worker?: Worker
  private serial = 0
  private cached = new Set<string>()
  private reject?: (error: Error) => void

  reset() {
    this.worker?.terminate()
    this.worker = undefined
    this.cached.clear()
    const reject = this.reject
    this.reject = undefined
    reject?.(new DOMException('Cancelado', 'AbortError'))
  }

  private request(
    build: (id: number) => WorkerRequest,
    progress?: (value: number) => void,
  ) {
    const worker = this.worker ??= new Worker(new URL('./pitch.worker.ts', import.meta.url), { type: 'module' })
    const id = ++this.serial
    const data = build(id)
    return new Promise<{ id: number; tracks?: Track[]; bpm?: number }>((resolve, reject) => {
      this.reject = reject
      const clear = () => {
        this.reject = undefined
        worker.onmessage = worker.onerror = null
      }
      worker.onmessage = ({ data: reply }: MessageEvent<WorkerReply>) => {
        if (reply.id !== id) return
        if ('progress' in reply) {
          progress?.(reply.progress)
          return
        }
        clear()
        if ('error' in reply) reject(new Error(reply.error))
        else resolve(reply)
      }
      worker.onerror = () => {
        clear()
        this.reset()
        reject(new Error('Se detuvo la conversión. Prueba con un archivo más corto.'))
      }
      worker.postMessage(data, data.type === 'audio' ? [data.samples.buffer as ArrayBuffer] : [])
    })
  }

  async transcribe(key: string, source: Blob, signal: AbortSignal, progress: (value: number) => void) {
    if (this.cached.has(key)) return
    const samples = await monoSamples(await decodeAudio(source))
    signal.throwIfAborted()
    await this.request(id => ({ id, type: 'audio', key, samples }), progress)
    signal.throwIfAborted()
    this.cached.add(key)
  }

  has(key: string) {
    return this.cached.has(key)
  }

  async notes(keys: string[], settings: Settings, duration: number) {
    const { tracks, bpm } = await this.request(id => ({ id, type: 'notes', keys, settings, duration }))
    return { tracks: tracks ?? [], bpm: bpm ?? 120 }
  }
}
