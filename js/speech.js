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

  async function ensure(onProgress) {
    if (pipe) return pipe;
    if (loading) return loading;
    loading = (async () => {
      const mod = await import(SRC);
      const { pipeline, env } = mod;
      if (env) {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
      }
      pipe = await pipeline("automatic-speech-recognition", MODEL, {
        dtype: "q8",
        progress_callback: (info) => {
          if (!onProgress || !info) return;
          if (typeof info.progress === "number") onProgress(Math.round(info.progress));
        }
      });
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

  return { ensure, toggle, cancel, isRecording, stop };
})();
