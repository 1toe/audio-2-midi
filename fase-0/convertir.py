import csv
import sys
import wave
from pathlib import Path
from tempfile import mkdtemp
from time import perf_counter


def main():
    fase = Path(__file__).resolve().parent
    entrada = fase / "audios" / "tracks-solos"
    audios = sorted(p for p in entrada.iterdir() if p.is_file() and p.suffix.lower() == ".wav")
    if not audios:
        sys.exit("Agrega al menos un WAV PCM en fase-0/audios/tracks-solos/.")

    try:
        from basic_pitch import ICASSP_2022_MODEL_PATH
        from basic_pitch.inference import Model, predict
    except ImportError as error:
        sys.exit(f"No se pudo importar Basic Pitch. Revisa fase-0/README.md. {error}")

    modelo = Model(ICASSP_2022_MODEL_PATH)
    resultados = fase / "resultados"
    resultados.mkdir(exist_ok=True)
    corrida = Path(mkdtemp(prefix="lote-", dir=resultados))
    hubo_errores = False
    with (corrida / "mediciones.csv").open("w", encoding="utf-8-sig", newline="") as reporte:
        filas = csv.writer(reporte, delimiter=";")
        filas.writerow(["Archivo", "Duración (s)", "Tiempo de proceso (s)", "MIDI", "Estado"])
        for audio in audios:
            duracion = ""
            midi = ""
            inicio = perf_counter()
            try:
                with wave.open(str(audio), "rb") as wav:
                    duracion = f"{wav.getnframes() / wav.getframerate():.3f}"
                _, datos_midi, notas = predict(str(audio), modelo)
                if notas:
                    destino = corrida / f"{audio.name}.mid"
                    datos_midi.write(str(destino))
                    midi = destino.name
                estado = "Convertido" if notas else "Sin notas"
            except Exception as error:
                estado = "Error"
                hubo_errores = True
                print(f"{audio.name}: {error}", file=sys.stderr)
            segundos = perf_counter() - inicio
            filas.writerow([audio.name, duracion, f"{segundos:.3f}", midi, estado])
            print(f"{audio.name}: {estado} ({segundos:.2f} s)")

    print(f"Resultados: {corrida}")
    return int(hubo_errores)


if __name__ == "__main__":
    sys.exit(main())
