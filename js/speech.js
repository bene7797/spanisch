const PalabraSpeech = (() => {
  const MODEL = "Xenova/whisper-small";
  const SRC = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/+esm";
  let pipe = null;
  let loading = null;
  let rec = null;
  let chunks = [];
  let stream = null;
  let timer = null;
  let busyTimer = null;
  let recording = false;
  let runId = 0;
  let aborted = false;
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
    const status = String(info.status || "");
    if (status === "initiate") {
      onProgress({
        phase: "download",
        pct: Object.keys(fileProg).length ? currentPct() : 1,
        label: "Download startet" + (file ? ": " + file : "…")
      });
      return;
    }
    if (status === "download" || status === "progress" || (typeof info.loaded === "number" && typeof info.total === "number" && info.total > 0)) {
      fileProg[info.file || file || "file"] = { loaded: info.loaded || 0, total: info.total || 1 };
      const pct = currentPct();
      const mb = info.total ? Math.round((info.loaded || 0) / 1048576) + " / " + Math.round(info.total / 1048576) + " MB" : "";
      onProgress({ phase: "download", pct, label: "Lädt " + (file || "Whisper") + (mb ? " · " + mb : " · " + pct + "%") });
      return;
    }
    if (typeof info.progress === "number") {
      const raw = info.progress <= 1 ? info.progress * 100 : info.progress;
      const pct = Math.max(currentPct(), Math.round(raw));
      onProgress({ phase: "download", pct, label: status === "done" ? "Datei gespeichert…" : "Lädt Whisper… " + pct + "%" });
      return;
    }
    if (status === "done") onProgress({ phase: "download", pct: Math.max(currentPct(), 90), label: "Datei im Cache gespeichert…" });
    if (status === "ready") onProgress({ phase: "ready", pct: 100, label: "Modell ist bereit." });
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
      onProgress?.({ phase: "ready", pct: 100, label: "Modell ist bereit." });
      return pipe;
    }
    if (loading) return loading;
    onProgress?.({ phase: "library", pct: 0, label: "Lade Whisper-Bibliothek…" });
    loading = (async () => {
      Object.keys(fileProg).forEach((k) => delete fileProg[k]);
      const mod = await import(SRC);
      const { pipeline, env } = mod;
      if (env) {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        env.allowRemoteModels = true;
        if (env.backends?.onnx?.wasm) {
          env.backends.onnx.wasm.proxy = true;
        }
      }
      onProgress?.({ phase: "download", pct: 5, label: "Frage Modelldateien an (~240 MB)…" });
      pipe = await pipeline("automatic-speech-recognition", MODEL, {
        dtype: "q8",
        progress_callback: (info) => reportProgress(info, onProgress)
      });
      onProgress?.({ phase: "ready", pct: 100, label: "Modell ist bereit." });
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

  function clearBusyTimer() {
    if (busyTimer) {
      clearTimeout(busyTimer);
      busyTimer = null;
    }
  }

  function cancel() {
    aborted = true;
    runId += 1;
    recording = false;
    clearBusyTimer();
    const current = rec;
    rec = null;
    chunks = [];
    if (current) {
      current.ondataavailable = null;
      current.onerror = null;
      current.onstop = () => stopTracks();
      try {
        if (current.state !== "inactive") current.stop();
      } catch {}
    }
    stopTracks();
  }

  async function transcribe(blob, onProgress, language, id) {
    const p = await ensure(onProgress);
    if (aborted || id !== runId) throw new Error("Abgebrochen.");
    onProgress?.({ phase: "decode", pct: 100, label: "Wandle Aufnahme um…" });
    const audio = await blobToWave(blob);
    if (aborted || id !== runId) throw new Error("Abgebrochen.");
    onProgress?.({ phase: "transcribe", pct: 100, label: "Erkenne Sprache…" });
    const out = await p(audio, {
      language: language || "spanish",
      task: "transcribe",
      return_timestamps: false
    });
    if (aborted || id !== runId) throw new Error("Abgebrochen.");
    return String(out?.text || "").trim();
  }

  async function start(handlers) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Kein Mikrofon-Zugriff in diesem Browser.");
    }
    if (!window.MediaRecorder) {
      throw new Error("Aufnahme klappt hier nicht. Chrome oder Safari aktuell nutzen.");
    }
    aborted = false;
    const id = ++runId;
    handlers.onStatus?.("loading");
    handlers.onProgress?.({ phase: "library", pct: pipe ? 100 : 0, label: pipe ? "Modell ist bereit." : "Bereite Whisper vor…" });
    await ensure(handlers.onProgress);
    if (aborted || id !== runId) throw new Error("Abgebrochen.");
    handlers.onStatus?.("mic");
    handlers.onProgress?.({ phase: "mic", pct: 100, label: "Frage Mikrofon an…" });
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
    });
    if (aborted || id !== runId) {
      stopTracks();
      throw new Error("Abgebrochen.");
    }
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
      if (aborted || id !== runId) return;
      if (!blob.size) {
        handlers.onError?.(new Error("Nichts aufgenommen."));
        return;
      }
      handlers.onStatus?.("busy");
      clearBusyTimer();
      busyTimer = setTimeout(() => {
        if (id !== runId) return;
        cancel();
        handlers.onError?.(new Error("Erkennung hängt. Abgebrochen – nochmal versuchen oder die Runde beenden."));
      }, 20000);
      try {
        const text = await transcribe(blob, handlers.onProgress, handlers.language, id);
        if (aborted || id !== runId) return;
        handlers.onResult?.(text);
      } catch (err) {
        if (aborted || id !== runId) return;
        handlers.onError?.(err);
      } finally {
        if (id === runId) clearBusyTimer();
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
