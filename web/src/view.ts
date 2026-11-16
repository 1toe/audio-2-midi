import { stemUrl } from './api'
import { downloadMidi } from './midi'
import { formatTime, stems, type Stem, type Track } from './model'
import { Player } from './player'
import { guitarTab } from './tablature'
import { drawFallingRoll, drawRoll, rollSpan } from './roll'

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
  private rollMode = el<HTMLSelectElement>('roll-mode')
  private tab = el<HTMLDetailsElement>('guitar-tab')
  private tabTrack = el<HTMLSelectElement>('tab-track')
  private tabDownload = el<HTMLButtonElement>('tab-download')
  private tabRender?: () => void
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
    const updateRollMode = () => {
      const horizontal = this.rollMode.value === 'timeline'
      el('timeline-controls').hidden = !horizontal
      this.roll.style.cursor = horizontal ? 'crosshair' : 'default'
      this.lastPaint = ''
    }
    this.rollMode.onchange = updateRollMode
    updateRollMode()
    this.tab.ontoggle = () => { if (this.tab.open) this.tabRender?.() }
    this.tabTrack.onchange = () => this.tabRender?.()
    this.roll.onclick = event => {
      if (this.rollMode.value !== 'timeline') return
      const rect = this.roll.getBoundingClientRect()
      const fraction = (event.clientX - rect.left) / rect.width
      void player.seek(this.rollStart.valueAsNumber + fraction * rollSpan(player.duration)).catch(onError)
    }
    requestAnimationFrame(this.render)
  }

  clear() {
    this.player.load('', 0, [])
    this.notes = []
    this.tabRender = undefined
    this.tabTrack.replaceChildren()
    this.tabDownload.onclick = null
    el('tab-preview').textContent = ''
    el('tab-status').textContent = ''
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
    this.tabTrack.replaceChildren(...tracks.map(track => new Option(stems[track.id as Stem] ?? 'Pista aislada', track.id)))
    this.tabRender = () => {
      const track = tracks.find(item => item.id === this.tabTrack.value)
      if (!track) return
      const { text, missing } = guitarTab(track.notes, bpm)
      el('tab-preview').textContent = text
      el('tab-status').textContent = missing ? `${missing} de ${track.notes.length} notas no caben en la digitación. Siguen incluidas en el MIDI.` : `${track.notes.length} notas incluidas.`
      this.tabDownload.onclick = () => {
        const report = el('tab-status').textContent
        const url = URL.createObjectURL(new Blob([`Guitarra · Mi estándar (E2 A2 D3 G3 B3 E4) · Segundos por columna\n${report}\n\n${text}\n`], { type: 'text/plain;charset=utf-8' }))
        const link = document.createElement('a')
        link.href = url
        link.download = input.file.name.replace(/\.[^.]+$/, '') + '-' + track.id + '.txt'
        link.click()
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      }
    }
    if (this.tab.open) this.tabRender()
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
      if (this.rollMode.value === 'timeline') drawRoll(this.roll, this.notes, start, time, player.duration)
      else drawFallingRoll(this.roll, this.notes, time)
    }
  }
}
