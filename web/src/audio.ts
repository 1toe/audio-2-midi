const sampleRate = 22050

export async function decodeAudio(blob: Blob) {
  const context = new AudioContext()
  try {
    return await context.decodeAudioData(await blob.arrayBuffer())
  } finally {
    await context.close()
  }
}

export async function monoSamples(audio: AudioBuffer) {
  const length = Math.ceil(audio.duration * sampleRate)
  const context = new OfflineAudioContext(1, Math.max(1, length), sampleRate)
  const source = context.createBufferSource()
  source.buffer = audio
  source.connect(context.destination)
  source.start()
  return (await context.startRendering()).getChannelData(0)
}

export function readDuration(url: string) {
  return new Promise<number>((resolve, reject) => {
    const audio = new Audio()
    const finish = (error?: string) => {
      clearTimeout(timeout)
      const duration = audio.duration
      audio.onloadedmetadata = audio.onerror = null
      audio.removeAttribute('src')
      audio.load()
      if (error) reject(new Error(error))
      else resolve(duration)
    }
    const timeout = window.setTimeout(() => finish('No se pudo leer la duración del audio.'), 15_000)
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => finish()
    audio.onerror = () => finish('No se pudo leer el archivo. Prueba con MP3, WAV, M4A, OGG o FLAC.')
    audio.src = url
  })
}
