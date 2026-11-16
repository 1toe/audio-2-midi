import { writeMidi, type MidiEvent } from 'midi-file'
import { stems, type Stem, type Track } from './model'

export function downloadMidi(name: string, tracks: Track[], bpm: number, duration: number) {
  const ppq = 480
  const ticks = (seconds: number) => Math.round(seconds * ppq * bpm / 60)
  const tempo: MidiEvent[] = [
    { deltaTime: 0, type: 'setTempo', microsecondsPerBeat: Math.round(60000000 / bpm) },
    { deltaTime: 0, type: 'endOfTrack' },
  ]
  const parts = tracks.map((track, channel) => {
    const events = track.notes.flatMap(note => {
      const start = ticks(note.time)
      return [
        { tick: start, on: true, note },
        { tick: Math.max(start + 1, ticks(note.time + note.duration)), on: false, note },
      ]
    }).sort((a, b) => a.tick - b.tick || Number(a.on) - Number(b.on))
    let previous = 0
    const part: MidiEvent[] = [
      { deltaTime: 0, type: 'trackName', text: stems[track.id as Stem] ?? 'Piano' },
      { deltaTime: 0, type: 'programChange', channel, programNumber: 0 },
    ]
    for (const { tick, on, note } of events) {
      part.push({
        deltaTime: tick - previous, type: on ? 'noteOn' : 'noteOff', channel,
        noteNumber: note.pitch, velocity: on ? Math.max(1, Math.min(127, Math.round(note.velocity * 127))) : 0,
      })
      previous = tick
    }
    part.push({ deltaTime: Math.max(0, ticks(duration) - previous), type: 'endOfTrack' })
    return part
  })
  const data = new Uint8Array(writeMidi({ header: { format: 1, numTracks: parts.length + 1, ticksPerBeat: ppq }, tracks: [tempo, ...parts] }))
  const url = URL.createObjectURL(new Blob([data], { type: 'audio/midi' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name.replace(/\.[^.]+$/, '') + '.mid'
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  return url
}
