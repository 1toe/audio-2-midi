import asyncio
import shutil
from contextlib import asynccontextmanager
from os import getenv
from pathlib import Path
from tempfile import TemporaryDirectory
from time import time
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.requests import ClientDisconnect

from .jobs import STEMS, Job, separate

MAX_BYTES = 128 * 1024 ** 2
RETENTION = 55 * 60
MAX_JOBS = 3
HEADERS = {"Cache-Control": "no-store"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    jobs: dict[str, Job] = {}
    queue: asyncio.Queue[Job] = asyncio.Queue()
    with TemporaryDirectory(prefix="audio-a-midi-") as directory:
        app.state.directory = Path(directory)
        app.state.jobs, app.state.queue = jobs, queue

        async def process():
            while True:
                job = await queue.get()
                if job.id in jobs and job.expires > time():
                    job.status = "processing"
                    await separate(job)

        async def expire():
            while True:
                await asyncio.sleep(15)
                for key, job in list(jobs.items()):
                    if job.expires <= time() and job.status != "processing":
                        jobs.pop(key)
                        shutil.rmtree(job.directory, ignore_errors=True)

        tasks = [asyncio.create_task(process()), asyncio.create_task(expire())]
        try:
            yield
        finally:
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)


app = FastAPI(title="Audio a MIDI", version="0.1.0", lifespan=lifespan)
origins = [origin.strip().rstrip("/") for origin in getenv("FRONTEND_ORIGIN", "").split(",") if origin.strip()]
if origins:
    app.add_middleware(
        CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )


@app.post("/api/jobs", status_code=202)
async def create_job(request: Request):
    if request.headers.get("content-type") != "application/octet-stream":
        raise HTTPException(415, "Envía un archivo de audio binario.")
    jobs = request.app.state.jobs
    if sum(job.status in ("uploading", "queued", "processing") for job in jobs.values()) >= MAX_JOBS:
        raise HTTPException(429, "La cola está llena. Intenta nuevamente en unos minutos.")
    declared = request.headers.get("content-length", "")
    if declared.isdigit() and int(declared) > MAX_BYTES:
        raise HTTPException(413, "El archivo supera el límite de 128 MiB.")
    if len(jobs) >= 12:
        raise HTTPException(429, "El servidor alcanzó su capacidad temporal. Intenta más tarde.")

    key = uuid4().hex
    path = request.app.state.directory / key
    path.mkdir()
    job = jobs[key] = Job(key, path, expires=time() + RETENTION)
    size = 0
    try:
        async with asyncio.timeout(120):
            with (path / "upload").open("wb") as stream:
                async for chunk in request.stream():
                    size += len(chunk)
                    if size > MAX_BYTES:
                        raise HTTPException(413, "El archivo supera el límite de 128 MiB.")
                    stream.write(chunk)
        if not size:
            raise HTTPException(400, "El archivo está vacío.")
        job.status = "queued"
        request.app.state.queue.put_nowait(job)
        return job.data(estimate(jobs, job))
    except BaseException as error:
        jobs.pop(key, None)
        shutil.rmtree(path, ignore_errors=True)
        if isinstance(error, TimeoutError):
            raise HTTPException(408, "La carga superó los dos minutos.") from error
        if isinstance(error, ClientDisconnect):
            raise HTTPException(400, "Se interrumpió la carga.") from error
        raise


def estimate(jobs: dict[str, Job], target: Job):
    if target.status == "processing":
        return 180
    if target.status == "queued":
        pending = 1
        for job in jobs.values():
            if job.id == target.id:
                break
            if job.status in ("queued", "processing"):
                pending += 1
        return pending * 180
    return 0


def find_job(request: Request, job_id: str):
    job = request.app.state.jobs.get(job_id)
    if not job or job.expires <= time():
        raise HTTPException(404, "El trabajo no está disponible o ya expiró.")
    return job


@app.get("/api/jobs/{job_id}")
async def job_status(request: Request, job_id: str):
    job = find_job(request, job_id)
    return job.data(estimate(request.app.state.jobs, job))


@app.get("/api/jobs/{job_id}/stems/{stem}")
async def download(request: Request, job_id: str, stem: str):
    job = find_job(request, job_id)
    if job.status != "ready" or stem not in STEMS:
        raise HTTPException(404, "La pista no está disponible.")
    return FileResponse(job.stem(stem), media_type="audio/wav", headers=HEADERS)


dist = Path(__file__).resolve().parents[1] / "web" / "dist"
if dist.is_dir():
    app.mount("/", StaticFiles(directory=dist, html=True), name="web")
