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
