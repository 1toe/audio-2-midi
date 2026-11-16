export type Stem = 'vocals' | 'bass' | 'other'
export type Note = { time: number; duration: number; pitch: number; velocity: number }
export type Track = { id: string; notes: Note[] }
export type Settings = {
  threshold: number
  minimum: number
  quantize: boolean
  limit: boolean
  merge: boolean
}
export type WorkerRequest =
  | { id: number; type: 'audio'; key: string; samples: Float32Array }
  | { id: number; type: 'notes'; keys: string[]; settings: Settings; duration: number }
export type WorkerReply =
  | { id: number; progress: number }
  | { id: number; tracks?: Track[]; bpm?: number }
  | { id: number; error: string }

export const stems: Record<Stem, string> = { vocals: 'Voz', bass: 'Bajo', other: 'Resto' }
export const message = (error: unknown) => error instanceof Error ? error.message : String(error)
export const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
