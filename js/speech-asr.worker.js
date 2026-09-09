import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/+esm";

const MODEL = "Xenova/whisper-tiny";
const SRC_RATE = 16000;

let pipe = null;
let device = "wasm";
let dtype = "q8";
let busy = false;
let loadGen = 0;
let queued = null;

function configureEnv() {
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  env.allowRemoteModels = true;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.proxy = false;
    const threads = self.crossOriginIsolated ? Math.min(4, self.navigator?.hardwareConcurrency || 2) : 1;
    env.backends.onnx.wasm.numThreads = threads;
    env.backends.onnx.wasm.simd = true;
  }
}

function report(info) {
  self.postMessage({ type: "progress", info });
}

async function load(requestId) {
  if (pipe) {
    self.postMessage({ type: "ready", requestId, device, dtype, model: MODEL, cached: true });
    return;
  }
  const my = ++loadGen;
  configureEnv();
  report({ status: "initiate", file: "transformers" });
  try {
    pipe = await pipeline("automatic-speech-recognition", MODEL, {
      device: "wasm",
      dtype: "q8",
      progress_callback: report
    });
    device = "wasm";
    dtype = "q8";
  } catch (err) {
    pipe = null;
    if (my !== loadGen) return;
    self.postMessage({ type: "error", requestId, message: err?.message || "Modell konnte nicht geladen werden." });
    return;
  }
  if (my !== loadGen) return;
  try {
    const warm = new Float32Array(SRC_RATE / 2);
    await pipe(warm, decodeOpts("spanish"));
  } catch {}
  self.postMessage({ type: "ready", requestId, device, dtype, model: MODEL, cached: false });
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

function toFloat32(audio) {
  if (audio instanceof Float32Array) return audio;
  if (audio?.buffer) return new Float32Array(audio.buffer, audio.byteOffset, audio.byteLength / 4);
  return new Float32Array(audio);
}

async function transcribe(msg) {
  const { id, language, partial } = msg;
  if (!pipe) {
    self.postMessage({ type: "error", id, message: "Modell ist noch nicht geladen." });
    return;
  }
  if (busy) {
    queued = msg;
    return;
  }
  busy = true;
  const t0 = performance.now();
  try {
    const audio = toFloat32(msg.audio);
    if (!audio.length) {
      self.postMessage({ type: "result", id, text: "", ms: 0, partial: Boolean(partial) });
      return;
    }
    const out = await pipe(audio, decodeOpts(language, msg.maxTokens));
    const text = String(out?.text || "").trim();
    self.postMessage({
      type: "result",
      id,
      text,
      ms: Math.round(performance.now() - t0),
      partial: Boolean(partial),
      seconds: audio.length / SRC_RATE
    });
  } catch (err) {
    self.postMessage({ type: "error", id, message: err?.message || "Erkennung fehlgeschlagen." });
  } finally {
    busy = false;
    if (queued) {
      const next = queued;
      queued = null;
      transcribe(next);
    }
  }
}

self.onmessage = (e) => {
  const msg = e.data || {};
  if (msg.type === "load") load(msg.requestId);
  else if (msg.type === "transcribe") transcribe(msg);
  else if (msg.type === "info") {
    self.postMessage({ type: "info", device, dtype, model: MODEL, ready: Boolean(pipe), isolated: Boolean(self.crossOriginIsolated) });
  }
};
