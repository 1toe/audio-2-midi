import type { Note } from './model'

export class Player {
  private context?: AudioContext
  private bus?: GainNode
  private samples = new Map<number, AudioBuffer>()
  private audio = new Audio()
  private timer?: number
  private offset = 0
  private started = 0
  private generation = 0
  private notes: Note[] = []
  private next = 0
  private url = ''
  duration = 0
  source: 'midi' | 'original' = 'midi'
  playing = false

  load(url: string, duration: number, notes: Note[]) {
    this.pause()
    this.duration = duration
    this.notes = notes.sort((a, b) => a.time - b.time)
    this.offset = 0
    if (url !== this.url) {
      this.url = url
      if (url) this.audio.src = url
      else this.audio.removeAttribute('src')
    }
  }

  get position() {
    if (!this.playing) return this.offset
    const time = this.source === 'original'
      ? this.audio.currentTime
      : this.offset + this.context!.currentTime - this.started
    return Math.min(this.duration, time)
  }

  pause() {
    this.generation++
    this.offset = this.position
    this.playing = false
    this.audio.pause()
    clearInterval(this.timer)
    this.bus?.disconnect()
    this.bus = undefined
  }

  async seek(time: number, source = this.source) {
    const playing = this.playing
    this.pause()
    this.offset = Math.max(0, Math.min(this.duration, time))
    this.source = source
    if (playing && this.offset < this.duration) await this.play()
  }

  async play() {
    if (this.offset >= this.duration) this.offset = 0
    const generation = ++this.generation
    if (this.source === 'original') {
      this.audio.currentTime = this.offset
      await this.audio.play()
      if (generation === this.generation) this.playing = true
      return
    }
    const context = this.context ??= new AudioContext()
    await context.resume()
    if (generation !== this.generation) return
    this.bus = context.createGain()
    this.bus.connect(context.destination)
    this.started = context.currentTime
    this.playing = true
    this.next = this.notes.findIndex(note => note.time >= this.offset)
    if (this.next === -1) this.next = this.notes.length
    for (let i = 0; i < this.next; i++) {
      const note = this.notes[i]
      if (note.time + note.duration > this.offset) this.schedule(note, this.offset)
    }
    const queue = () => {
      while (this.next < this.notes.length && this.notes[this.next].time < this.position + .18) {
        this.schedule(this.notes[this.next++], this.position)
      }
    }
    queue()
    this.timer = window.setInterval(queue, 65)
  }

  private schedule(note: Note, position: number) {
    const context = this.context!
    const length = Math.min(4, note.duration - Math.max(0, position - note.time))
    if (length <= 0) return
    const at = context.currentTime + Math.max(0, note.time - position)
    const gain = context.createGain()
    gain.gain.setValueAtTime(Math.max(.001, note.velocity * .19), at)
    gain.gain.setTargetAtTime(.0001, at + length, .035)
    gain.connect(this.bus!)
    const source = context.createBufferSource()
    source.buffer = this.sample(note.pitch)
    source.connect(gain)
    source.onended = () => gain.disconnect()
    source.start(at)
    source.stop(at + length + .12)
  }

  private sample(pitch: number) {
    const existing = this.samples.get(pitch)
    if (existing) return existing
    const rate = 22050
    const buffer = this.context!.createBuffer(1, rate * 5, rate)
    const wave = buffer.getChannelData(0)
    const frequency = 440 * 2 ** ((pitch - 69) / 12)
    for (let h = 1; h <= 5 && frequency * h < rate / 2; h++) {
      for (let i = 0; i < wave.length; i++) {
        const t = i / rate
        wave[i] += Math.sin(2 * Math.PI * frequency * h * t) * Math.exp(-t * (.85 + h)) / h ** 1.6
      }
    }
    this.samples.set(pitch, buffer)
    return buffer
  }
}
