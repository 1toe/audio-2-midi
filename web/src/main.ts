import './style.css'
import { canSeparate, discardJob, downloadStem, separate } from './api'
import { readDuration } from './audio'
import { formatTime, message, stems, type Settings, type Stem, type Track } from './model'
import { el, ResultView, showStems } from './view'
import { PitchSession } from './session'

const fileInput = el<HTMLInputElement>('file')
const consent = el<HTMLInputElement>('consent')
const songMode = el<HTMLInputElement>('song-mode')
songMode.disabled = !canSeparate
el('song-unavailable').hidden = canSeparate
const convert = el<HTMLButtonElement>('convert')
const cancel = el<HTMLButtonElement>('cancel')
const transcribe = el<HTMLButtonElement>('transcribe')
const status = el('status')
const progress = el<HTMLProgressElement>('progress')
const progressText = el('progress-text')
const form = el<HTMLFormElement>('settings')
const selection = el('stem-list')
const view = new ResultView(error => { status.textContent = 'No se pudo reproducir: ' + message(error) })
const session = new PitchSession()

let source: { file: File; url: string; duration: number } | undefined
let jobId: string | undefined
let result: { tracks: Track[]; bpm: number; keys: string[] } | undefined
let running: AbortController | undefined
let loading = false
let fileVersion = 0
let mode = 'solo'
let guarding = false
let startedAt = 0
let timer: number | undefined

function warnBeforeReload(event: BeforeUnloadEvent) {
  event.preventDefault()
  event.returnValue = ''
}

function updateProgressText() {
  const elapsed = formatTime((performance.now() - startedAt) / 1000)
  const percent = progress.hasAttribute('value') ? ` · ${Math.floor(progress.value)} %` : ''
  progressText.textContent = `Tiempo transcurrido ${elapsed}${percent}`
}

function stage(text: string, value?: number) {
  status.textContent = text
  progress.hidden = false
  if (value === undefined) progress.removeAttribute('value')
  else progress.value = value
  updateProgressText()
}

const selected = () => Array.from(selection.querySelectorAll<HTMLInputElement>('input:checked'), input => input.value as Stem)

function controls() {
  const busy = !!running || loading
  if (busy !== guarding) {
    guarding = busy
    if (busy) window.addEventListener('beforeunload', warnBeforeReload)
    else window.removeEventListener('beforeunload', warnBeforeReload)
  }
  convert.disabled = busy || !source || (mode === 'song' && !consent.checked)
  transcribe.disabled = busy || selected().length === 0
  el<HTMLButtonElement>('regenerate').disabled = busy || !result
  el<HTMLButtonElement>('download').disabled = busy || !result
  cancel.hidden = !running
  const showConsent = mode === 'song'
  el('consent-row').hidden = !showConsent
  el('privacy').textContent = showConsent
    ? 'El audio se envía para separar las pistas. El servidor elimina el audio y las pistas dentro de una hora.'
    : 'El audio se procesa en tu equipo y no se envía.'
}

function clearResult() {
  session.reset()
  const previous = jobId
  jobId = undefined
  result = undefined
  for (const preview of selection.querySelectorAll('audio')) {
    preview.pause()
    preview.removeAttribute('src')
    preview.load()
  }
  selection.replaceChildren()
  if (previous) void discardJob(previous).catch(() => {})
  el('stems').hidden = true
  view.clear()
}

function stop() {
  running?.abort()
  running = undefined
  session.reset()
  clearInterval(timer)
  progress.hidden = true
  progressText.hidden = true
  controls()
}

async function run(operation: (signal: AbortSignal) => Promise<void>) {
  if (running) return
  const task = new AbortController()
  running = task
  controls()
  startedAt = performance.now()
  progressText.hidden = false
  stage('Preparando la conversión…')
  timer = window.setInterval(updateProgressText, 1000)
  try {
    await operation(task.signal)
  } catch (error) {
    if (!task.signal.aborted) status.textContent = `No se pudo completar el trabajo. ${message(error)}`
  } finally {
    if (running === task) {
      running = undefined
      clearInterval(timer)
      progress.hidden = true
      updateProgressText()
      controls()
    }
  }
}

async function choose(file?: File) {
  if (!file) return
  const version = ++fileVersion
  stop()
  clearResult()
  consent.checked = false
  if (source) URL.revokeObjectURL(source.url)
  source = undefined
  loading = true
  controls()
  el('file-info').textContent = ''
  status.textContent = 'Leyendo el audio…'
  let url = ''
  try {
    if (!/\.(mp3|wav|m4a|ogg|flac)$/i.test(file.name)) throw new Error('Elige un archivo MP3, WAV, M4A, OGG o FLAC.')
    if (file.size === 0) throw new Error('El archivo está vacío. Elige otro audio.')
    if (file.size > 128 * 1024 ** 2) throw new Error('El archivo supera el límite de 128 MiB.')
    url = URL.createObjectURL(file)
    const duration = await readDuration(url)
    if (version !== fileVersion) return
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('No se pudo leer la duración.')
    if (duration > 600) throw new Error('El audio supera el límite de 10 minutos.')
    source = { file, url, duration }
    url = ''
    el('file-info').textContent = `${file.name} · ${formatTime(duration)}`
    status.textContent = ''
  } catch (error) {
    if (version === fileVersion) status.textContent = message(error)
  } finally {
    if (url) URL.revokeObjectURL(url)
    if (version === fileVersion) {
      loading = false
      controls()
    }
  }
}

function settings(): Settings {
  const data = new FormData(form)
  return {
    threshold: Number(data.get('threshold')),
    minimum: Number(data.get('minimum')),
    quantize: data.has('quantize'),
    limit: data.has('limit'),
    merge: data.has('merge'),
  }
}

async function produce(keys: string[], signal: AbortSignal) {
  const input = source!
  const activeJob = jobId
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    if (session.has(key)) continue
    const track = stems[key as Stem] ?? 'Audio'
    const stages = {
      decode: 'Decodificando el archivo',
      mix: 'Preparando el audio para el modelo',
      model: 'Cargando el modelo de transcripción',
      analysis: 'Detectando notas',
    }
    if (activeJob) stage(`${track} · Descargando la pista…`)
    const audio = activeJob ? await downloadStem(activeJob, key as Stem, signal) : input.file
    signal.throwIfAborted()
    await session.transcribe(key, audio, signal, fraction => {
      progress.value = (index + fraction) / keys.length * 100
      updateProgressText()
    }, step => stage(`${track} · ${stages[step]}…`, step === 'analysis' ? index / keys.length * 100 : undefined))
  }
  stage('Organizando las notas para el MIDI…')
  const next = await session.notes(keys, settings(), input.duration)
  signal.throwIfAborted()
  const empty = next.tracks.filter(track => !track.notes.length)
  next.tracks = next.tracks.filter(track => track.notes.length > 0)
  if (!next.tracks.length) {
    status.textContent = result ? 'No se detectaron notas. Se conservó el resultado anterior.' : 'No se detectaron notas. Prueba con otro audio.'
    return
  }
  result = { ...next, keys }
  const count = view.show(input, next.tracks, next.bpm)
  status.textContent = empty.length
    ? `MIDI listo. Sin notas en ${empty.map(track => stems[track.id as Stem] ?? track.id).join(', ')}.`
    : `MIDI listo · ${count} notas${settings().quantize ? ` · tempo estimado ${next.bpm} BPM` : ''}.`
}

const fileDrop = el('drop')
fileInput.onchange = () => { void choose(fileInput.files?.[0]); fileInput.value = '' }
fileDrop.ondragover = event => { event.preventDefault(); fileDrop.classList.add('active') }
fileDrop.ondragleave = () => fileDrop.classList.remove('active')
fileDrop.ondrop = event => {
  event.preventDefault()
  fileDrop.classList.remove('active')
  void choose(event.dataTransfer?.files[0])
}

document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach(input => {
  input.onchange = () => {
    mode = input.value
    stop()
    clearResult()
    consent.checked = false
    status.textContent = ''
    controls()
  }
})
consent.onchange = controls
selection.onchange = controls
cancel.onclick = () => {
  const separating = mode === 'song' && !jobId
  stop()
  status.textContent = separating ? 'Cancelación de la separación solicitada.' : 'Conversión cancelada.'
}
convert.onclick = () => void run(async signal => {
  if (!source) return
  if (mode === 'solo') return produce(['solo'], signal)
  if (!consent.checked) return
  clearResult()
  controls()
  stage('Enviando el audio para separar las pistas…')
  const job = await separate(source.file, signal, update => {
    stage(`${update.status === 'queued' ? 'En cola' : 'Separando pistas'} · estimación: ${Math.round((update.estimate_seconds ?? 60) / 60)} min`)
  })
  signal.throwIfAborted()
  jobId = job.id
  showStems(selection, job.id, job.stems)
  el('stems').hidden = false
  status.textContent = 'Selecciona las pistas que quieras convertir.'
})
transcribe.onclick = () => void run(signal => produce(selected(), signal))
form.onsubmit = event => {
  event.preventDefault()
  if (result) void run(signal => produce(result!.keys, signal))
}

controls()
