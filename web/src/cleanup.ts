import type { Note, Settings, Track } from './model'

export function estimateTempo(tracks: Track[]) {
  const starts = tracks.flatMap(track => track.notes.map(note => note.time)).sort((a, b) => a - b)
  const intervals: number[] = []
  for (let i = 1; i < starts.length; i++) {
    let seconds = starts[i] - starts[i - 1]
    if (seconds < .12 || seconds > 2) continue
    while (seconds < .33) seconds *= 2
    while (seconds > .66) seconds /= 2
    intervals.push(seconds)
  }
  if (intervals.length < 3) return 120
  intervals.sort((a, b) => a - b)
  return Math.round(60 / intervals[Math.floor(intervals.length / 2)])
}

export function cleanNotes(notes: Note[], settings: Settings, bpm: number, duration: number) {
  const step = 60 / bpm / 4
  const output: Note[] = []
  const latest = new Map<number, Note>()
  for (const original of notes.sort((a, b) => a.time - b.time)) {
    if (settings.limit && (original.pitch < 21 || original.pitch > 108)) continue
    const note = { ...original }
    if (settings.quantize) {
      note.time = Math.round(note.time / step) * step
      note.duration = Math.max(step, Math.round(note.duration / step) * step)
    }
    note.duration = Math.min(note.duration, duration - note.time)
    if (note.duration <= 0) continue
    const previous = latest.get(note.pitch)
    const previousEnd = previous ? previous.time + previous.duration : 0
    if (settings.merge && previous && note.time - previousEnd <= .06) {
      previous.duration = Math.max(previousEnd, note.time + note.duration) - previous.time
      continue
    }
    latest.set(note.pitch, note)
    output.push(note)
  }
  return output
}
