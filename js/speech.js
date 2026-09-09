const PalabraSpeech = (() => {
  const MODEL = "Xenova/whisper-tiny";
  const SRC = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/+esm";
  const TARGET_RATE = 16000;
  const MAX_SECONDS = 6;
  const MAX_SAMPLES = TARGET_RATE * MAX_SECONDS;
  const FRAME = 512;
  const START_FRAMES = 2;
  const END_FRAMES = 22;
  const MIN_SPEECH = Math.round(0.16 * TARGET_RATE);
  const NO_SPEECH_MS = 8000;

  const WORKLET_SRC = `
class PalabraCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ratio = sampleRate / ${TARGET_RATE};
    this.pos = 0;
    this.prev = 0;
    this.hp = 0;
    this.oi = 0;
    this.out = new Float32Array(${FRAME});
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    const ratio = this.ratio;
    let pos = this.pos;
    while (pos < ch.length) {
      const i0 = pos | 0;
      const i1 = i0 + 1 < ch.length ? i0 + 1 : i0;
      const f = pos - i0;
      const raw = ch[i0] * (1 - f) + ch[i1] * f;
      this.hp = raw - this.prev + 0.995 * this.hp;
      this.prev = raw;
      this.out[this.oi++] = this.hp;
      if (this.oi >= this.out.length) {
        this.port.postMessage(this.out.slice());
        this.oi = 0;
      }
      pos += ratio;
    }
    this.pos = pos - ch.length;
    return true;
  }
}
registerProcessor("palabra-capture", PalabraCapture);
`;

  let worker = null;
  let workerReady = false;
  let workerInfo = { device: "wasm", dtype: "q8", model: MODEL };
  let loading = null;
  let fallbackPipe = null;
  let recState = null;
  let runId = 0;
  let aborted = false;
  let workletUrl = null;
  const fileProg = {};

  function modelBytes() {
    return 41;
  }

  function isReady() {
    return workerReady || Boolean(fallbackPipe);
  }

  function isRecording() {
    return Boolean(recState?.capturing);
  }

  function currentPct() {
    const parts = Object.values(fileProg);
    if (!parts.length) return 0;
    const loaded = parts.reduce((s, x) => s + x.loaded, 0);
    const total = parts.reduce((s, x) => s + x.total, 0);
    if (!total) return 0;
    return Math.min(99, Math.round((100 * loaded) / total));
  }

  function reportProgress(info, onProgress) {
    if (!onProgress || !info) return;
    const file = String(info.file || info.name || "").split("/").pop();
    const status = String(info.status || "");
    if (status === "initiate") {
      onProgress({ phase: "download", pct: Object.keys(fileProg).length ? currentPct() : 1, label: "Download startet" + (file ? ": " + file : "…") });
      return;
    }
    if (status === "download" || status === "progress" || (typeof info.loaded === "number" && typeof info.total === "number" && info.total > 0)) {
      fileProg[info.file || file || "file"] = { loaded: info.loaded || 0, total: info.total || 1 };
      const pct = currentPct();
      const mb = info.total ? Math.round((info.loaded || 0) / 1048576) + " / " + Math.round(info.total / 1048576) + " MB" : "";
      onProgress({ phase: "download", pct, label: "Lädt " + (file || "Whisper Tiny") + (mb ? " · " + mb : " · " + pct + "%") });
      return;
    }
    if (typeof info.progress === "number") {
      const raw = info.progress <= 1 ? info.progress * 100 : info.progress;
      const pct = Math.max(currentPct(), Math.round(raw));
      onProgress({ phase: "download", pct, label: "Lädt Whisper Tiny… " + pct + "%" });
      return;
    }
    if (status === "done") onProgress({ phase: "download", pct: Math.max(currentPct(), 90), label: "Datei im Cache gespeichert…" });
    if (status === "ready") onProgress({ phase: "ready", pct: 100, label: "Modell ist bereit." });
  }

  function workerUrl() {
    return new URL("js/speech-asr.worker.js", document.baseURI);
  }

  function attachWorker(onProgress) {
    return new Promise((resolve, reject) => {
      let settled = false;
      let sawProgress = false;
      const w = new Worker(workerUrl(), { type: "module" });
      const fail = (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(bootTimer);
        try { w.terminate(); } catch {}
        reject(err instanceof Error ? err : new Error(String(err)));
      };
      const bootTimer = setTimeout(() => {
        if (!sawProgress) fail(new Error("Worker startet nicht."));
      }, 5000);
      w.onerror = (e) => fail(e.message || "Worker fehlgeschlagen.");
      w.onmessageerror = () => fail(new Error("Worker-Nachricht unlesbar."));
      w.onmessage = (e) => {
        const msg = e.data || {};
        if (msg.type === "progress") {
          sawProgress = true;
          reportProgress(msg.info, onProgress);
        }
        if (msg.type === "ready") {
          worker = w;
          workerReady = true;
          workerInfo = { device: msg.device, dtype: msg.dtype, model: msg.model || MODEL };
          if (!settled) {
            settled = true;
            clearTimeout(bootTimer);
            resolve(w);
          }
          return;
        }
        if (msg.type === "error" && !workerReady) fail(msg.message);
        if (worker === w) handleWorkerMsg(msg);
      };
      try {
        w.postMessage({ type: "load", requestId: runId });
      } catch (err) {
        fail(err);
      }
    });
  }

  const pending = new Map();

  function handleWorkerMsg(msg) {
    if (msg.type === "result" || msg.type === "error" || msg.type === "skipped") {
      const job = pending.get(msg.id);
      if (!job) return;
      if (msg.type === "skipped") return;
      pending.delete(msg.id);
      if (msg.type === "error") job.reject(new Error(msg.message || "Erkennung fehlgeschlagen."));
      else job.resolve(msg);
    }
  }

  function decodeOpts(language, maxTokens) {
    return {
      language: language || "spanish",
      task: "transcribe",
      return_timestamps: false,
      max_new_tokens: Math.max(4, Math.min(80, maxTokens || 12)),
      num_beams: 1,
      do_sample: false,
      temperature: 0,
      top_k: 1,
      condition_on_previous_text: false,
      no_repeat_ngram_size: 3
    };
  }

  async function loadFallback(onProgress) {
    const mod = await import(SRC);
    const { pipeline, env } = mod;
    env.allowLocalModels = false;
    env.useBrowserCache = true;
    env.allowRemoteModels = true;
    if (env.backends?.onnx?.wasm) {
      env.backends.onnx.wasm.proxy = true;
      env.backends.onnx.wasm.simd = true;
      env.backends.onnx.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 2) : 1;
    }
    fallbackPipe = await pipeline("automatic-speech-recognition", MODEL, {
      dtype: "q8",
      progress_callback: (info) => reportProgress(info, onProgress)
    });
    workerInfo = { device: "wasm", dtype: "q8", model: MODEL };
    try {
      await fallbackPipe(new Float32Array(TARGET_RATE / 2), decodeOpts("spanish", 8));
    } catch {}
  }

  async function ensure(onProgress) {
    if (isReady()) {
      onProgress?.({ phase: "ready", pct: 100, label: "Modell ist bereit · " + workerInfo.device.toUpperCase() + " · " + workerInfo.dtype });
      return true;
    }
    if (loading) return loading;
    onProgress?.({ phase: "library", pct: 0, label: "Lade Whisper Tiny on-device…" });
    loading = (async () => {
      Object.keys(fileProg).forEach((k) => delete fileProg[k]);
      try {
        await attachWorker(onProgress);
      } catch {
        onProgress?.({ phase: "library", pct: 8, label: "Worker nicht verfügbar – WASM-Fallback…" });
        await loadFallback(onProgress);
      }
      onProgress?.({
        phase: "ready",
        pct: 100,
        label: "Bereit · " + workerInfo.device.toUpperCase() + " · " + workerInfo.dtype + " · ~" + modelBytes() + " MB"
      });
      return true;
    })();
    try {
      return await loading;
    } catch (err) {
      loading = null;
      workerReady = false;
      fallbackPipe = null;
      throw err;
    }
  }

  function tokenBudget(expected) {
    const words = String(expected || "").trim().split(/\s+/).filter(Boolean);
    const n = words.length;
    const chars = words.join("").length;
    if (!n) return 64;
    if (n <= 1 && chars <= 4) return 4;
    return Math.min(18, Math.max(8, n * 3 + 4));
  }

  function cleanTranscript(text, maxWords, keepSentences) {
    let t = String(text || "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    if (/thanks for watching|amara\.org|please subscribe|subtitles by|subtítulos|copyright/i.test(t)) return "";
    t = t.replace(/\b(\S+)(\s+\1){2,}/gi, "$1");
    if (!keepSentences) t = t.split(/[.!?…]/)[0].trim();
    const cap = Math.max(4, maxWords || 8);
    const words = t.split(/\s+/).filter(Boolean);
    if (words.length > cap) t = words.slice(0, cap).join(" ");
    return t;
  }

  function transcribeAudio(audio, language, partial, maxTokens) {
    const id = runId + "-" + Math.random().toString(36).slice(2, 8);
    const copy = audio.slice();
    const tokens = tokenBudgetFromMax(maxTokens);
    if (worker && workerReady) {
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        worker.postMessage({ type: "transcribe", id, audio: copy, language, partial: Boolean(partial), maxTokens: tokens });
      });
    }
    if (!fallbackPipe) return Promise.reject(new Error("Modell ist noch nicht geladen."));
    const t0 = performance.now();
    return fallbackPipe(copy, decodeOpts(language, tokens)).then((out) => ({
      text: String(out?.text || "").trim(),
      ms: Math.round(performance.now() - t0),
      partial: Boolean(partial),
      seconds: copy.length / TARGET_RATE
    }));
  }

  function tokenBudgetFromMax(maxTokens) {
    return Math.max(4, Math.min(80, maxTokens || 12));
  }

  function rms(frame) {
    let s = 0;
    for (let i = 0; i < frame.length; i++) s += frame[i] * frame[i];
    return Math.sqrt(s / frame.length);
  }

  function createVad() {
    return {
      noise: 0.004,
      started: false,
      startSample: 0,
      silence: 0,
      voice: 0,
      sample: 0
    };
  }

  function pushVad(vad, frame) {
    const e = rms(frame);
    const thresh = Math.max(0.008, vad.noise * 2.8);
    const voiced = e > thresh;
    if (!voiced) vad.noise = vad.noise * 0.95 + e * 0.05;
    vad.sample += frame.length;
    if (voiced) {
      vad.voice += 1;
      vad.silence = 0;
      if (!vad.started && vad.voice >= START_FRAMES) {
        vad.started = true;
        vad.startSample = Math.max(0, vad.sample - frame.length * START_FRAMES - Math.round(0.12 * TARGET_RATE));
      }
    } else {
      vad.voice = 0;
      if (vad.started) vad.silence += 1;
    }
    return { voiced, ended: vad.started && vad.silence >= END_FRAMES, energy: e };
  }

  function bindScriptCapture(ac, source, mute, onFrame) {
    const proc = ac.createScriptProcessor(4096, 1, 1);
    let pos = 0;
    let prev = 0;
    let hp = 0;
    const ratio = ac.sampleRate / TARGET_RATE;
    const out = new Float32Array(FRAME);
    let oi = 0;
    proc.onaudioprocess = (ev) => {
      const ch = ev.inputBuffer.getChannelData(0);
      while (pos < ch.length) {
        const i0 = pos | 0;
        const i1 = Math.min(i0 + 1, ch.length - 1);
        const f = pos - i0;
        const raw = ch[i0] * (1 - f) + ch[i1] * f;
        hp = raw - prev + 0.97 * hp;
        prev = raw;
        out[oi++] = hp;
        if (oi >= FRAME) {
          onFrame(out.slice());
          oi = 0;
        }
        pos += ratio;
      }
      pos -= ch.length;
    };
    source.connect(proc);
    proc.connect(mute);
    mute.connect(ac.destination);
    return () => {
      proc.onaudioprocess = null;
      try { proc.disconnect(); } catch {}
    };
  }

  async function bindCapture(ac, stream, onFrame) {
    const source = ac.createMediaStreamSource(stream);
    const mute = ac.createGain();
    mute.gain.value = 0.0001;
    let unbindWorklet = null;
    let unbindScript = null;
    let frames = 0;
    const wrapped = (frame) => {
      frames += 1;
      onFrame(frame);
    };

    const startScript = () => {
      if (unbindScript) return;
      if (unbindWorklet) {
        try { unbindWorklet(); } catch {}
        unbindWorklet = null;
      }
      unbindScript = bindScriptCapture(ac, source, mute, wrapped);
    };

    if (ac.audioWorklet) {
      try {
        if (!workletUrl) workletUrl = URL.createObjectURL(new Blob([WORKLET_SRC], { type: "text/javascript" }));
        await ac.audioWorklet.addModule(workletUrl);
        const node = new AudioWorkletNode(ac, "palabra-capture");
        node.port.onmessage = (e) => wrapped(e.data);
        source.connect(node);
        node.connect(mute);
        mute.connect(ac.destination);
        unbindWorklet = () => {
          try { node.port.onmessage = null; node.disconnect(); } catch {}
        };
        setTimeout(() => {
          if (frames < 2) startScript();
        }, 320);
      } catch {
        startScript();
      }
    } else {
      startScript();
    }

    return () => {
      if (unbindWorklet) try { unbindWorklet(); } catch {}
      if (unbindScript) try { unbindScript(); } catch {}
      try { source.disconnect(); mute.disconnect(); } catch {}
    };
  }

  function stopCapture(state) {
    if (!state) return;
    state.capturing = false;
    if (state.timer) clearTimeout(state.timer);
    if (state.noSpeechTimer) clearTimeout(state.noSpeechTimer);
    if (state.busyTimer) clearTimeout(state.busyTimer);
    if (state.unbind) {
      try { state.unbind(); } catch {}
      state.unbind = null;
    }
    if (state.stream) {
      state.stream.getTracks().forEach((t) => t.stop());
      state.stream = null;
    }
    if (state.ac) {
      const ac = state.ac;
      state.ac = null;
      ac.close?.().catch?.(() => {});
    }
  }

  function cancel() {
    aborted = true;
    runId += 1;
    pending.forEach((job) => job.reject(new Error("Abgebrochen.")));
    pending.clear();
    stopCapture(recState);
    recState = null;
  }

  async function finalize(state, reason) {
    if (!state || state.finalizing) return;
    state.finalizing = true;
    stopCapture(state);
    const id = state.id;
    if (aborted || id !== runId) return;
    const vad = state.vad;
    const used = Math.min(state.filled, state.maxSamples);
    let start = vad.started ? vad.startSample : 0;
    let end = used;
    if (vad.started) end = Math.max(start + MIN_SPEECH, used - FRAME * Math.min(vad.silence, END_FRAMES));
    if (end - start < MIN_SPEECH && used >= MIN_SPEECH) {
      start = 0;
      end = used;
    }
    const speechLen = Math.max(0, end - start);
    if (speechLen < MIN_SPEECH) {
      state.handlers.onError?.(new Error(reason || "Nichts gehört. Näher am Mikrofon sprechen, dann Stopp tippen."));
      recState = null;
      return;
    }
    let peak = 0;
    for (let i = start; i < start + speechLen; i += 32) {
      const v = Math.abs(state.buffer[i]);
      if (v > peak) peak = v;
    }
    if (peak < 0.012) {
      state.handlers.onError?.(new Error(reason || "Nichts gehört. Näher am Mikrofon sprechen."));
      recState = null;
      return;
    }
    state.handlers.onStatus?.("busy");
    state.handlers.onProgress?.({ phase: "transcribe", pct: 100, label: "Wertet die Aufnahme aus – bitte warten…" });
    try {
      await ensure(state.handlers.onProgress);
      if (aborted || id !== runId) return;
      const clip = state.buffer.subarray(start, start + speechLen);
      const msg = await transcribeAudio(clip, state.language, false, state.maxTokens);
      if (aborted || id !== runId) return;
      const text = cleanTranscript(msg.text, state.maxWords, state.keepSentences);
      state.handlers.onResult?.(text, { ms: msg.ms, seconds: msg.seconds, partial: false });
    } catch (err) {
      if (aborted || id !== runId) return;
      state.handlers.onError?.(err);
    } finally {
      if (recState === state) recState = null;
    }
  }

  async function start(handlers) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Kein Mikrofon-Zugriff in diesem Browser.");
    }
    aborted = false;
    const id = ++runId;
    handlers.onStatus?.("mic");
    handlers.onProgress?.({ phase: "mic", pct: 100, label: "Frage Mikrofon an…" });
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: TARGET_RATE
      }
    });
    if (aborted || id !== runId) {
      stream.getTracks().forEach((t) => t.stop());
      throw new Error("Abgebrochen.");
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) throw new Error("AudioContext fehlt in diesem Browser.");
    const ac = new Ctx({ sampleRate: TARGET_RATE });
    if (ac.state === "suspended") await ac.resume();
    const maxSec = Math.min(16, Math.max(3, handlers.maxSeconds || MAX_SECONDS));
    const maxSamples = TARGET_RATE * maxSec;
    const state = {
      id,
      handlers,
      language: handlers.language || "spanish",
      maxTokens: handlers.maxTokens || tokenBudget(handlers.expected),
      maxWords: handlers.maxWords || 8,
      keepSentences: Boolean(handlers.keepSentences),
      maxSamples,
      stream,
      ac,
      buffer: new Float32Array(maxSamples),
      filled: 0,
      vad: createVad(),
      capturing: true,
      finalizing: false,
      partialBusy: false,
      lastPartialAt: 0,
      unbind: null,
      timer: null,
      noSpeechTimer: null,
      busyTimer: null
    };
    recState = state;
    const onFrame = (frame) => {
      if (!state.capturing || state.id !== runId) return;
      const room = state.maxSamples - state.filled;
      if (room <= 0) {
        finalize(state, "Zeit vorbei.");
        return;
      }
      const n = Math.min(frame.length, room);
      state.buffer.set(n === frame.length ? frame : frame.subarray(0, n), state.filled);
      state.filled += n;
      const ev = pushVad(state.vad, n === frame.length ? frame : frame.subarray(0, n));
      if (ev.ended) {
        finalize(state);
        return;
      }
      if (state.vad.started) return;
    };
    state.unbind = await bindCapture(ac, stream, onFrame);
    if (aborted || id !== runId) {
      stopCapture(state);
      throw new Error("Abgebrochen.");
    }
    handlers.onStatus?.("recording");
    handlers.onProgress?.({ phase: "listen", pct: 100, label: "Sprich jetzt. Ich höre zu…" });
    if (!isReady()) {
      handlers.onProgress?.({ phase: "library", pct: 0, label: "Modell lädt im Hintergrund…" });
      ensure(handlers.onProgress).catch((err) => {
        if (id !== runId) return;
        handlers.onError?.(err);
      });
    }
    state.noSpeechTimer = setTimeout(() => {
      if (!state.capturing || state.vad.started) return;
      finalize(state, "Keine Sprache erkannt.");
    }, NO_SPEECH_MS);
    state.timer = setTimeout(() => {
      if (state.capturing) finalize(state);
    }, maxSec * 1000);
  }

  function stop() {
    if (recState?.capturing) finalize(recState);
  }

  async function toggle(handlers) {
    if (recState?.capturing) {
      stop();
      return;
    }
    if (recState?.finalizing) return;
    await start(handlers);
  }

  async function benchmark() {
    await ensure();
    const seconds = [0.8, 1.6, 2.4];
    const rows = [];
    for (const s of seconds) {
      const audio = new Float32Array(Math.round(s * TARGET_RATE));
      for (let i = 0; i < audio.length; i++) audio[i] = Math.sin(2 * Math.PI * 180 * i / TARGET_RATE) * 0.12;
      const msg = await transcribeAudio(audio, "spanish", false);
      const rtf = msg.ms / (s * 1000);
      rows.push({ seconds: s, ms: msg.ms, rtf: Number(rtf.toFixed(2)), text: msg.text || "" });
    }
    const ram = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null;
    return {
      model: MODEL,
      device: workerInfo.device,
      dtype: workerInfo.dtype,
      modelMB: modelBytes(),
      ramMB: ram,
      isolated: Boolean(window.crossOriginIsolated),
      rows
    };
  }

  function info() {
    return {
      model: MODEL,
      device: workerInfo.device,
      dtype: workerInfo.dtype,
      modelMB: modelBytes(),
      ready: isReady(),
      vad: true,
      sampleRate: TARGET_RATE,
      format: "pcm-f32-mono-16k",
      streaming: "utterance",
      decoding: "greedy-short"
    };
  }

  return { ensure, toggle, cancel, isRecording, isReady, stop, benchmark, info };
})();
