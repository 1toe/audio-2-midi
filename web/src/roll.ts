import type { Note } from './model'

const span = 12

export function drawRoll(canvas: HTMLCanvasElement, notes: Note[], start: number, time: number, duration: number) {
  const width = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio))
  const height = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
  const ctx = canvas.getContext('2d')!
  const visible = Math.min(span, duration) || 1
  const x = (s: number) => (s - start) / visible * width
  ctx.fillStyle = '#101713'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#33443a'
  for (let s = Math.ceil(start); s < start + visible; s++) ctx.fillRect(x(s), 0, 1, height)
  for (let pitch = 24; pitch <= 108; pitch += 12) {
    ctx.fillRect(0, height * (109 - pitch) / 88, width, 1)
  }
  ctx.fillStyle = '#a9e7bf'
  for (const note of notes) {
    if (note.time >= start + visible || note.time + note.duration < start) continue
    ctx.fillRect(x(note.time), height * (108 - note.pitch) / 88, Math.max(2, note.duration / visible * width), Math.max(2, height / 88))
  }
  ctx.fillStyle = '#ffd180'
  ctx.fillRect(x(time), 0, 2, height)
}

export const rollSpan = (duration: number) => Math.min(span, duration)

export function drawFallingRoll(canvas: HTMLCanvasElement, notes: Note[], time: number) {
  const width = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio))
  const height = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
  const ctx = canvas.getContext('2d')!
  const floor = height * .89
  const span = 4
  const key = width / 88
  const dark = [1, 3, 6, 8, 10]
  const isDark = (pitch: number) => dark.includes(pitch % 12)
  ctx.fillStyle = '#101713'
  ctx.fillRect(0, 0, width, height)
  for (let pitch = 21; pitch <= 108; pitch++) {
    const x = (pitch - 21) * key
    ctx.fillStyle = isDark(pitch) ? '#17251f' : '#23342b'
    ctx.fillRect(x, 0, key - .5, floor)
    ctx.fillStyle = isDark(pitch) ? '#101713' : '#e8f2ed'
    ctx.fillRect(x, floor, key - .5, height - floor)
  }
  for (const note of notes) {
    if (note.time > time + span) break
    if (note.time + note.duration <= time || note.pitch < 21 || note.pitch > 108) continue
    const x = (note.pitch - 21) * key
    const top = Math.max(0, floor - (note.time + note.duration - time) * floor / span)
    const end = Math.min(floor, floor - (note.time - time) * floor / span)
    ctx.fillStyle = note.time <= time ? '#ffd180' : '#a9e7bf'
    ctx.fillRect(x, top, Math.max(1, key - .5), Math.max(1, end - top))
    if (note.time <= time) ctx.fillRect(x, floor, Math.max(1, key - .5), height - floor)
  }
  ctx.fillStyle = '#ffd180'
  ctx.fillRect(0, floor - 1, width, 1)
}
