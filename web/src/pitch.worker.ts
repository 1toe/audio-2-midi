import { BasicPitch, noteFramesToTime, outputToNotesPoly } from '@spotify/basic-pitch'
import * as tf from '@tensorflow/tfjs'
import { cleanNotes, estimateTempo } from './cleanup'
import { message, type Note, type Settings, type WorkerRequest } from './model'

type Block = { frames: Float32Array; onsets: Float32Array; width: number }
type Segment = { start: number; end: number; offset: number; blocks: Block[] }
const predictions = new Map<string, Segment[]>()
const rate = 22050
const chunk = rate * 15
const overlap = rate / 2
let pitch: BasicPitch | undefined

async function evaluate(samples: Float32Array, report: (value: number) => void) {
  if (!pitch) {
    await tf.setBackend('cpu')
    pitch = new BasicPitch(new URL(import.meta.env.BASE_URL + 'model/model.json', self.location.href).href)
  }
  await pitch.model
  const segments: Segment[] = []
  for (let start = 0; start < samples.length; start += chunk) {
    const offset = Math.max(0, start - overlap)
    const end = Math.min(samples.length, start + chunk)
    const limit = Math.min(samples.length, end + overlap)
    const segment: Segment = { start: start / rate, end: end / rate, offset: offset / rate, blocks: [] }
    tf.engine().startScope()
    try {
      await pitch.evaluateModel(samples.subarray(offset, limit), (frames, onsets) => {
        if (!frames.length) return
        segment.blocks.push({
          frames: Float32Array.from(frames.flat()),
          onsets: Float32Array.from(onsets.flat()),
          width: frames[0].length,
        })
      }, value => report((start + value * (end - start)) / samples.length))
    } finally {
      tf.engine().endScope()
    }
    if (segment.blocks.length) segments.push(segment)
  }
  return segments
}

function unpack(blocks: Block[], key: 'frames' | 'onsets') {
  return blocks.flatMap(({ width, [key]: data }) =>
    Array.from({ length: data.length / width }, (_, index) =>
      Array.from(data.subarray(index * width, (index + 1) * width))))
}

function notesFor(key: string, settings: Settings): Note[] {
  const segments = predictions.get(key)
  if (!segments) throw new Error('Faltan las notas de una pista.')
  const minimum = Math.max(1, Math.ceil(settings.minimum * rate / (256 * 1000)) - 1)
  return segments.flatMap(({ offset, start, end, blocks }) => {
    const frames = unpack(blocks, 'frames')
    const onsets = unpack(blocks, 'onsets')
    if (frames.length < 2) return []
    return noteFramesToTime(outputToNotesPoly(frames, onsets, settings.threshold, settings.threshold * .6, minimum))
      .map(note => ({ time: note.startTimeSeconds + offset, duration: note.durationSeconds, pitch: note.pitchMidi, velocity: note.amplitude }))
      .filter(note => note.time >= start && note.time < end)
  })
}

self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
  const { id } = data
  try {
    if (data.type === 'audio') {
      predictions.set(data.key, await evaluate(data.samples, progress => self.postMessage({ id, progress })))
      self.postMessage({ id })
      return
    }
    const tracks = data.keys.map(key => ({ id: key, notes: notesFor(key, data.settings) }))
    const bpm = data.settings.quantize ? estimateTempo(tracks) : 120
    for (const track of tracks) track.notes = cleanNotes(track.notes, data.settings, bpm, data.duration)
    self.postMessage({ id, tracks, bpm })
  } catch (error) {
    self.postMessage({ id, error: message(error) })
  }
}
