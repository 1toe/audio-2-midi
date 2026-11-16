import { stemUrl } from './api'
import { downloadMidi } from './midi'
import { formatTime, stems, type Stem, type Track } from './model'
import { Player } from './player'
import { drawRoll, rollSpan } from './roll'

export const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T

export function showStems(list: HTMLElement, id: string, available: Stem[]) {
  for (const stem of available) {
    const row = document.createElement('div')
    const label = document.createElement('label')
    const check = document.createElement('input')
    const preview = document.createElement('audio')
    check.type = 'checkbox'
    check.value = stem
    label.append(check, ' ' + stems[stem])
    preview.controls = true
    preview.preload = 'none'
    preview.src = stemUrl(id, stem)
    preview.setAttribute('aria-label', stems[stem])
    row.append(label, preview)
    list.append(row)
  }
}

export class ResultView {
  private player = new Player()
  private play = el<HTMLButtonElement>('play')
  private position = el<HTMLInputElement>('position')
  private rollStart = el<HTMLInputElement>('roll-start')
  private roll = el<HTMLCanvasElement>('roll')
  private source = el<HTMLSelectElement>('source')
  private link = el<HTMLAnchorElement>('download-link')
  private result = el('result')
  private notes: Track['notes'] = []
  private pinned = false
  private lastPaint = ''

  constructor(onError: (error: unknown) => void) {
    const player = this.player
    this.play.onclick = () => {
      if (player.playing) player.pause()
      else void player.play().catch(onError)
    }
    this.source.onchange = () => {
      void player.seek(player.position, this.source.value === 'original' ? 'original' : 'midi').catch(onError)
    }
    this.position.oninput = () => {
      this.pinned = false
      void player.seek(this.position.valueAsNumber).catch(onError)
    }
    this.rollStart.oninput = () => { this.pinned = true }
    this.roll.onclick = event => {
      const rect = this.roll.getBoundingClientRect()
      const fraction = (event.clientX - rect.left) / rect.width
      void player.seek(this.rollStart.valueAsNumber + fraction * rollSpan(player.duration)).catch(onError)
    }
    requestAnimationFrame(this.render)
  }

  clear() {
    this.player.load('', 0, [])
    this.notes = []
    this.result.hidden = this.link.hidden = true
    el('download').onclick = null
  }

  show(input: { file: File; url: string; duration: number }, tracks: Track[], bpm: number) {
    this.notes = tracks.flatMap(track => track.notes)
    this.player.load(input.url, input.duration, this.notes)
    this.position.max = String(input.duration)
    this.rollStart.max = String(Math.max(0, input.duration - rollSpan(input.duration)))
    this.rollStart.value = '0'
    this.pinned = false
    this.lastPaint = ''
    this.result.hidden = false
    this.link.hidden = true
    el('download').onclick = () => {
      this.link.href = downloadMidi(input.file.name, tracks, bpm, input.duration)
      this.link.download = input.file.name.replace(/\.[^.]+$/, '') + '.mid'
      this.link.hidden = false
    }
    return this.notes.length
  }

  private render = () => {
    requestAnimationFrame(this.render)
    if (this.result.hidden) return
    const player = this.player
    const time = player.position
    if (player.playing && time >= player.duration) player.pause()
    this.play.textContent = player.playing ? 'Pausar' : 'Reproducir'
    this.position.value = String(time)
    el('clock').textContent = `${formatTime(time)} / ${formatTime(player.duration)}`
    if (!this.pinned) {
      const page = rollSpan(player.duration)
      this.rollStart.value = String(Math.min(Math.floor(time / page) * page, Number(this.rollStart.max)))
    }
    const start = this.rollStart.valueAsNumber
    el('roll-clock').textContent = formatTime(start)
    const view = [time, start, this.roll.clientWidth, this.roll.clientHeight].join('/')
    if (view !== this.lastPaint) {
      this.lastPaint = view
      drawRoll(this.roll, this.notes, start, time, player.duration)
    }
  }
}
