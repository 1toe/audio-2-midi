import asyncio
import re
import shutil
from contextlib import asynccontextmanager
from os import getenv
from pathlib import Path
from tempfile import TemporaryDirectory
from time import time
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.requests import ClientDisconnect

from .jobs import STEMS, Job, separate

MAX_BYTES = 128 * 1024 ** 2
RETENTION = 55 * 60
MAX_JOBS = 3
HEADERS = {"Cache-Control": "no-store"}


def remove_job(jobs: dict[str, Job], job: Job):
    if jobs.get(job.id) is not job:
        return True
    shutil.rmtree(job.directory, ignore_errors=True)
    if job.directory.exists():
        return False
    jobs.pop(job.id)
    return True


@asynccontextmanager
async def lifespan(app: FastAPI):
    jobs: dict[str, Job] = {}
    wake = asyncio.Event()
    with TemporaryDirectory(prefix="audio-a-midi-") as directory:
        app.state.directory = Path(directory)
        app.state.jobs, app.state.wake = jobs, wake

        async def process():
            while True:
                await wake.wait()
                wake.clear()
                while job := next(
                    (item for item in jobs.values() if item.status == "queued" and not item.cancelled and item.expires > time()),
                    None,
                ):
                    job.status = "processing"
                    job.task = asyncio.create_task(separate(job))
                    try:
                        await asyncio.gather(job.task, return_exceptions=True)
                    finally:
                        job.task = None
                    if job.status == "processing" and not job.cancelled:
                        job.status, job.error = "failed", "No se pudo completar la separación."
                        shutil.rmtree(job.directory, ignore_errors=True)

        async def expire():
            while True:
                await asyncio.sleep(15)
                for job in list(jobs.values()):
                    if job.status != "uploading" and job.task is None:
                        if job.cancelled or job.expires <= time():
                            remove_job(jobs, job)

        tasks = [asyncio.create_task(process()), asyncio.create_task(expire())]
        try:
            yield
        finally:
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)


app = FastAPI(title="Audio a MIDI", version="0.2.0", lifespan=lifespan)
origins = [origin.strip().rstrip("/") for origin in getenv("FRONTEND_ORIGIN", "").split(",") if origin.strip()]
if origins:
    app.add_middleware(
        CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST", "DELETE"],
        allow_headers=["Content-Type", "X-Job-ID"],
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

    key = request.headers.get("x-job-id", uuid4().hex)
    if not re.fullmatch(r"[a-f0-9]{32}", key):
        raise HTTPException(400, "Identificador de trabajo inválido.")
    if key in jobs:
        raise HTTPException(409, "Ya existe un trabajo con ese identificador.")
    path = request.app.state.directory / key
    path.mkdir()
    job = jobs[key] = Job(key, path, expires=time() + RETENTION)
    size = 0
    try:
        async with asyncio.timeout(120):
            with (path / "upload").open("wb") as stream:
                async for chunk in request.stream():
                    if job.cancelled:
                        raise HTTPException(409, "La carga fue cancelada.")
                    size += len(chunk)
                    if size > MAX_BYTES:
                        raise HTTPException(413, "El archivo supera el límite de 128 MiB.")
                    stream.write(chunk)
        if job.cancelled:
            raise HTTPException(409, "La carga fue cancelada.")
        if not size:
            raise HTTPException(400, "El archivo está vacío.")
        job.status = "queued"
        request.app.state.wake.set()
        return job.data(estimate(jobs, job))
    except BaseException as error:
        job.status, job.cancelled = "failed", True
        remove_job(jobs, job)
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
    if not job or job.cancelled or job.expires <= time():
        raise HTTPException(404, "El trabajo no está disponible o ya expiró.")
    return job


@app.delete("/api/jobs/{job_id}", status_code=204)
async def cancel_job(request: Request, job_id: str):
    jobs = request.app.state.jobs
    job = jobs.get(job_id)
    if job is None:
        return Response(status_code=204)
    first_request = not job.cancelled
    job.cancelled = True
    if job.status == "uploading":
        return Response(status_code=202)
    task = job.task
    if task is not None and not task.done():
        if first_request:
            task.cancel()
        await asyncio.shield(asyncio.gather(task, return_exceptions=True))
    removed = remove_job(jobs, job)
    return Response(status_code=204 if removed else 202)


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
