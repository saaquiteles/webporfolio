// Procedural Web Audio — every sound in the range is synthesized at call
// time (oscillators + a noise burst), not loaded from an audio file, since
// no sound assets ship with this project. The AudioContext is a lazy
// module-level singleton: browsers block audio until a real user gesture,
// so it's only created/resumed from the "LOCK IN" click handler.

// The single shared AudioContext instance every sound effect plays through, created lazily the first time it's needed.
let ctx = null;

// Returns the shared AudioContext, creating it on first call (and returning null if audio isn't supported/available).
function getContext() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

// Called from the LOCK IN button's click handler — a real user gesture —
// to create/unmute the shared AudioContext ahead of any gunfire.
export function unlockAudio() {
  const c = getContext();
  if (c && c.state === "suspended") {
    c.resume().catch(() => {
      /* autoplay policy rejected the resume; sounds will simply stay muted */
    });
  }
  return c;
}

// Generates a short burst of filtered white noise (used as the crackly/percussive part of a sound effect).
function noiseBurst(c, { duration, filterFreq, filterType = "bandpass", gain = 1, when = 0 }) {
  const now = c.currentTime + when;
  const sampleCount = Math.max(1, Math.floor(c.sampleRate * duration));
  const buffer = c.createBuffer(1, sampleCount, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    // white noise with a decaying envelope baked into the buffer itself
    data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount) ** 2;
  }

  const source = c.createBufferSource();
  source.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;

  const gainNode = c.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter).connect(gainNode).connect(c.destination);
  source.start(now);
  source.stop(now + duration);
}

// Plays a single oscillator tone that slides from one pitch to another (used as the low "thump" part of a sound effect).
function thump(c, { duration, freqFrom, freqTo, type = "square", gain = 0.6, when = 0 }) {
  const now = c.currentTime + when;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freqFrom, now);
  osc.frequency.exponentialRampToValueAtTime(freqTo, now + duration);

  const gainNode = c.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gainNode).connect(c.destination);
  osc.start(now);
  osc.stop(now + duration);
}

// Gunshot: a short band-passed noise crack layered over a fast pitch-drop
// square-wave thump — the classic synthesized "shot" recipe, built entirely
// from oscillator/noise-burst primitives.
export function playGunshot() {
  const c = getContext();
  if (!c) return;
  noiseBurst(c, { duration: 0.16, filterFreq: 1400, gain: 0.9 });
  thump(c, { duration: 0.12, freqFrom: 160, freqTo: 45, gain: 0.55 });
}

// Impact ping: a bright, short sine "hit" cue for a confirmed target hit —
// distinct in timbre from the gunshot so it reads as a separate event.
export function playImpact() {
  const c = getContext();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

  const gainNode = c.createGain();
  gainNode.gain.setValueAtTime(0.5, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gainNode).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.2);

  noiseBurst(c, { duration: 0.06, filterFreq: 3200, filterType: "highpass", gain: 0.3 });
}

// UI blip: a quiet two-tone sine tick for HUD interactions (modal open/close,
// hover acquisition) so the interface has a consistent tactile audio layer.
export function playUiBlip(rising = true) {
  const c = getContext();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(rising ? 520 : 340, now);
  osc.frequency.linearRampToValueAtTime(rising ? 780 : 220, now + 0.09);

  const gainNode = c.createGain();
  gainNode.gain.setValueAtTime(0.18, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gainNode).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}
