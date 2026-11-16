import asyncio
import logging
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path
from time import time

STEMS = ("vocals", "bass", "other")
MODEL = "htdemucs"
logger = logging.getLogger(__name__)


@dataclass
class Job:
    id: str
    directory: Path
    expires: float
    status: str = "uploading"
    error: str | None = None
    cancelled: bool = False
    task: asyncio.Task | None = None

    def data(self, estimate: int = 0):
        response = {"id": self.id, "status": self.status}
        if estimate:
            response["estimate_seconds"] = estimate
        if self.error:
            response["error"] = self.error
        if self.status == "ready":
            response["stems"] = list(STEMS)
        return response

    def stem(self, name: str):
        return self.directory / "out" / MODEL / "input" / f"{name}.wav"


async def command(*args: str, timeout: float, capture: bool = False):
    worker = await asyncio.create_subprocess_exec(
        *args,
        stdout=asyncio.subprocess.PIPE if capture else asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL,
    )
    try:
        async with asyncio.timeout(timeout):
            stdout, _ = await worker.communicate()
    except (TimeoutError, asyncio.CancelledError):
        if worker.returncode is None:
            try:
                worker.kill()
            except ProcessLookupError:
                pass
        await worker.wait()
        raise
    if worker.returncode:
        raise ValueError("No se pudo procesar el archivo de audio.")
    return stdout.decode().strip() if capture else ""


def container_format(upload: Path):
    with upload.open("rb") as file:
        prefix = file.read(16)
    if prefix[:4] in (b"RIFF", b"RF64") and prefix[8:12] == b"WAVE":
        return "wav"
    if prefix.startswith(b"fLaC"):
        return "flac"
    if prefix.startswith(b"OggS"):
        return "ogg"
    if prefix[4:8] == b"ftyp":
        return "mov"
    if prefix.startswith(b"ID3") or (len(prefix) >= 2 and prefix[0] == 0xff and prefix[1] & 0xe0 == 0xe0):
        return "mp3"
    raise ValueError("Formato de audio no reconocido.")


async def separate(job: Job):
    upload = job.directory / "upload"
    wav = job.directory / "input.wav"
    try:
        async with asyncio.timeout(min(1800, max(1, job.expires - time()))):
            source_options = ("-protocol_whitelist", "file", "-f", container_format(upload))
            duration = float(await command(
                "ffprobe", "-v", "error", *source_options, "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1", str(upload),
                timeout=15, capture=True,
            ))
            if not 0 < duration <= 600:
                raise ValueError("El audio debe durar como máximo 10 minutos.")
            await command(
                "ffmpeg", "-v", "error", "-nostdin", *source_options, "-i", str(upload),
                "-map", "0:a:0", "-t", "600", "-ar", "44100", "-ac", "2", str(wav), timeout=90,
            )
            upload.unlink(missing_ok=True)
            await command(
                sys.executable, "-m", "demucs", "-n", MODEL, "-d", "cpu",
                "-j", "1", "-o", str(job.directory / "out"), str(wav), timeout=1650,
            )
            if not all(job.stem(stem).is_file() for stem in STEMS):
                raise ValueError("La separación no entregó todas las pistas.")
            job.stem("drums").unlink(missing_ok=True)
            job.status = "ready"
    except TimeoutError:
        job.status, job.error = "failed", "La separación superó el tiempo máximo. Prueba con un audio más corto."
    except (OSError, ValueError):
        logger.exception("Error al separar el audio (%s)", job.id)
        job.status, job.error = "failed", "No se pudo separar el audio. Comprueba que el archivo sea válido y dure hasta 10 minutos."
    finally:
        if job.status == "ready":
            wav.unlink(missing_ok=True)
        else:
            shutil.rmtree(job.directory, ignore_errors=True)
