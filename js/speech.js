const PalabraSpeech = (() => {
  const MODEL = "Xenova/whisper-base";
  const SRC = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/+esm";
  let pipe = null;
  let loading = null;
  let rec = null;
  let chunks = [];
  let stream = null;
  let timer = null;
  let recording = false;
  const fileProg = {};

  function pickMime() {
    const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
    if (!window.MediaRecorder) return "";
    return types.find((t) => MediaRecorder.isTypeSupported(t)) || "";
  }

  function resample(data, fromRate, toRate) {
    if (fromRate === toRate) return data;
    const ratio = fromRate / toRate;
    const out = new Float32Array(Math.round(data.length / ratio));
    for (let i = 0; i < out.length; i++) {
      const x = i * ratio;
      const i0 = Math.floor(x);
      const i1 = Math.min(i0 + 1, data.length - 1);
      const f = x - i0;
      out[i] = data[i0] * (1 - f) + data[i1] * f;
    }
    return out;
  }

  function reportProgress(info, onProgress) {
    if (!onProgress || !info) return;
    const file = String(info.file || info.name || "").split("/").pop();
    if (info.status === "initiate") {
      onProgress({ pct: Object.keys(fileProg).length ? currentPct() : 1, label: "Starte Download…" + (file ? " " + file : "") });
      return;
    }
    if (typeof info.loaded === "number" && typeof info.total === "number" && info.total > 0) {
      fileProg[info.file || file || "file"] = { loaded: info.loaded, total: info.total };
      const pct = currentPct();
      onProgress({ pct, label: (file || "Whisper") + " · " + pct + "%" });
      return;
    }
    if (typeof info.progress === "number") {
      const raw = info.progress <= 1 ? info.progress * 100 : info.progress;
      const pct = Math.max(currentPct(), Math.round(raw));
      onProgress({ pct, label: info.status === "done" ? "Datei fertig…" : "Lade Whisper… " + pct + "%" });
      return;
    }
    if (info.status === "done") onProgress({ pct: Math.max(currentPct(), 90), label: "Datei gespeichert…" });
    if (info.status === "ready") onProgress({ pct: 100, label: "Modell ist bereit." });
  }

  function currentPct() {
    const parts = Object.values(fileProg);
    if (!parts.length) return 0;
    const loaded = parts.reduce((s, x) => s + x.loaded, 0);
    const total = parts.reduce((s, x) => s + x.total, 0);
    if (!total) return 0;
    return Math.min(99, Math.round((100 * loaded) / total));
  }

  async function blobToWave(blob) {
    const buf = await blob.arrayBuffer();
    const ac = new AudioContext();
    const decoded = await ac.decodeAudioData(buf.slice(0));
    let data = decoded.getChannelData(0);
    if (decoded.numberOfChannels > 1) {
      const right = decoded.getChannelData(1);
      const mix = new Float32Array(data.length);
      for (let i = 0; i < data.length; i++) mix[i] = (data[i] + right[i]) * 0.5;
      data = mix;
    }
    data = resample(data, decoded.sampleRate, 16000);
    if (ac.close) await ac.close();
    return data;
  }

  function isReady() {
    return Boolean(pipe);
  }

  async function ensure(onProgress) {
    if (pipe) {
      onProgress?.({ pct: 100, label: "Modell ist bereit." });
      return pipe;
    }
    if (loading) return loading;
    onProgress?.({ pct: 0, label: "Lade Whisper-Bibliothek…" });
    loading = (async () => {
      const mod = await import(SRC);
      const { pipeline, env } = mod;
      if (env) {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        env.allowRemoteModels = true;
      }
      onProgress?.({ pct: 5, label: "Lade Modelldateien (~75 MB)…" });
      pipe = await pipeline("automatic-speech-recognition", MODEL, {
        dtype: "q8",
        progress_callback: (info) => reportProgress(info, onProgress)
      });
      onProgress?.({ pct: 100, label: "Modell ist bereit." });
      return pipe;
    })();
    try {
      return await loading;
    } catch (err) {
      loading = null;
      pipe = null;
      throw err;
    }
  }

  function stopTracks() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function isRecording() {
    return recording;
  }

  function cancel() {
    recording = false;
    try {
      if (rec && rec.state !== "inactive") rec.stop();
    } catch {}
    rec = null;
    chunks = [];
    stopTracks();
  }

  async function transcribe(blob, onProgress) {
    const p = await ensure(onProgress);
    const audio = await blobToWave(blob);
    const out = await p(audio, {
      language: "spanish",
      task: "transcribe",
      return_timestamps: false
    });
    return String(out?.text || "").trim();
  }

  async function start(handlers) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Kein Mikrofon-Zugriff in diesem Browser.");
    }
    if (!window.MediaRecorder) {
      throw new Error("Aufnahme klappt hier nicht. Chrome oder Safari aktuell nutzen.");
    }
    handlers.onStatus?.("loading");
    await ensure(handlers.onProgress);
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
    });
    chunks = [];
    const mime = pickMime();
    rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size) chunks.push(e.data);
    };
    rec.onerror = () => {
      recording = false;
      stopTracks();
      handlers.onError?.(new Error("Aufnahme fehlgeschlagen."));
    };
    rec.onstop = async () => {
      recording = false;
      const mimeType = rec.mimeType || mime || "audio/webm";
      rec = null;
      stopTracks();
      const blob = new Blob(chunks, { type: mimeType });
      chunks = [];
      if (!blob.size) {
        handlers.onError?.(new Error("Nichts aufgenommen."));
        return;
      }
      handlers.onStatus?.("busy");
      try {
        const text = await transcribe(blob, handlers.onProgress);
        handlers.onResult?.(text);
      } catch (err) {
        handlers.onError?.(err);
      }
    };
    recording = true;
    rec.start(250);
    handlers.onStatus?.("recording");
    timer = setTimeout(() => {
      if (recording) stop();
    }, 6000);
  }

  function stop() {
    if (!rec) return;
    try {
      if (rec.state !== "inactive") rec.stop();
    } catch {}
  }

  async function toggle(handlers) {
    if (recording) {
      stop();
      return;
    }
    await start(handlers);
  }

  return { ensure, toggle, cancel, isRecording, isReady, stop };
})();
