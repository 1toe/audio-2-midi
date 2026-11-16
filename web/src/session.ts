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
    stage?: (value: 'model' | 'analysis') => void,
  ) {
    const worker = this.worker ??= new Worker(new URL('./pitch.worker.ts', import.meta.url), { type: 'module' })
    const id = ++this.serial
    const data = build(id)
    return new Promise<{ id: number; tracks?: Track[]; bpm?: number }>((resolve, reject) => {
      const timeoutMs = 180_000
      let timeout: number
      const stalled = () => {
        clear()
        this.reset()
        reject(new Error('La conversión dejó de reportar avance. Puedes reintentar con el mismo archivo o con un fragmento más corto.'))
      }
      const renew = () => {
        clearTimeout(timeout)
        timeout = window.setTimeout(stalled, timeoutMs)
      }
      const clear = () => {
        clearTimeout(timeout)
        this.reject = undefined
        worker.onmessage = worker.onerror = worker.onmessageerror = null
      }
      this.reject = error => { clear(); reject(error) }
      renew()
      worker.onmessage = ({ data: reply }: MessageEvent<WorkerReply>) => {
        if (reply.id !== id) return
        renew()
        if ('stage' in reply) {
          stage?.(reply.stage)
          return
        }
        if ('progress' in reply) {
          progress?.(reply.progress)
          return
        }
        clear()
        if ('error' in reply) reject(new Error(reply.error))
        else resolve(reply)
      }
      worker.onerror = worker.onmessageerror = () => {
        clear()
        this.reset()
        reject(new Error('Se detuvo la conversión. Prueba con un archivo más corto.'))
      }
      try {
        worker.postMessage(data, data.type === 'audio' ? [data.samples.buffer as ArrayBuffer] : [])
      } catch {
        clear()
        this.reset()
        reject(new Error('No se pudo enviar el audio al convertidor. Reintenta con un fragmento más corto.'))
      }
    })
  }

  async transcribe(key: string, source: Blob, signal: AbortSignal, progress: (value: number) => void, stage: (value: 'decode' | 'mix' | 'model' | 'analysis') => void) {
    if (this.cached.has(key)) return
    stage('decode')
    const decoded = await decodeAudio(source).catch(() => {
      throw new Error('No se pudo decodificar el audio. Prueba con otro archivo o conviértelo a WAV.')
    })
    signal.throwIfAborted()
    stage('mix')
    const samples = await monoSamples(decoded).catch(() => {
      throw new Error('No se pudo preparar el audio. Prueba con un fragmento más corto.')
    })
    signal.throwIfAborted()
    await this.request(id => ({ id, type: 'audio', key, samples }), progress, stage)
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
