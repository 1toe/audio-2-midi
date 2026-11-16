import { midiPpq, midiTick, type Note } from './model'

const tuning = [64, 59, 55, 50, 45, 40]
const labels = ['e', 'B', 'G', 'D', 'A', 'E']
const maxFret = 24
const reach = 4

type Finger = { string: number; fret: number; end: number }
type Shape = { fingers: Finger[]; cost: number }
type Event = { tick: number; fingers: Finger[]; omitted: number }

function stronger(candidate: Shape, previous?: Shape) {
  return !previous || candidate.fingers.length > previous.fingers.length ||
    (candidate.fingers.length === previous.fingers.length && candidate.cost < previous.cost)
}

export function guitarEvents(notes: Note[], bpm: number): Event[] {
  const groups = new Map<number, Note[]>()
  for (const note of notes) {
    const tick = midiTick(note.time, bpm)
    const group = groups.get(tick) ?? []
    group.push(note)
    groups.set(tick, group)
  }
  let held: Finger[] = []
  let position = 1
  return [...groups].sort(([a], [b]) => a - b).map(([tick, group]) => {
    held = held.filter(note => note.end > tick)
    const occupied = held.reduce((mask, finger) => mask | (1 << finger.string), 0)
    const byVelocity = [...group].sort((a, b) => b.velocity - a.velocity || a.pitch - b.pitch)
    let best: Shape = { fingers: [], cost: 0 }
    let nextPosition = position
    for (let low = 1; low <= maxFret - reach; low++) {
      if (held.some(({ fret }) => fret !== 0 && (fret < low || fret > low + reach))) continue
      let choices = new Map<number, Shape>([[occupied, { fingers: [], cost: Math.abs(low - position) * 2 }]])
      for (const note of byVelocity) {
        const next = new Map(choices)
        tuning.forEach((pitch, string) => {
          const fret = note.pitch - pitch
          if (fret !== 0 && (fret < low || fret > low + reach)) return
          const bit = 1 << string
          for (const [mask, shape] of choices) {
            if (mask & bit) continue
            const end = Math.max(tick + 1, midiTick(note.time + note.duration, bpm))
            const candidate = {
              fingers: [...shape.fingers, { string, fret, end }],
              cost: shape.cost + fret / 24 + (1 - note.velocity) * 40,
            }
            if (stronger(candidate, next.get(mask | bit))) next.set(mask | bit, candidate)
          }
        })
        choices = next
      }
      for (const choice of choices.values()) {
        if (stronger(choice, best)) {
          best = choice
          nextPosition = low
        }
      }
    }
    if (best.fingers.some(finger => finger.fret > 0)) position = nextPosition
    held.push(...best.fingers)
    return { tick, fingers: best.fingers, omitted: group.length - best.fingers.length }
  })
}

export function guitarTab(notes: Note[], bpm: number) {
  const events = guitarEvents(notes, bpm)
  const blocks: string[] = []
  let missing = 0
  for (let index = 0; index < events.length; index += 8) {
    const block = events.slice(index, index + 8)
    const times = block.map(({ tick }) => (tick * Math.round(60000000 / bpm) / (midiPpq * 1000000)).toFixed(3).padStart(8))
    const lines = labels.map((label, string) => label + '|' + block.map(({ fingers }) => {
      const finger = fingers.find(item => item.string === string)
      return (finger ? String(finger.fret) : '-').padStart(8, '-')
    }).join('') + '|')
    missing += block.reduce((sum, event) => sum + event.omitted, 0)
    blocks.push([' s' + times.join(''), ...lines].join('\n'))
  }
  return { text: blocks.join('\n\n'), missing }
}
