'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Droplets, Zap, Wind, Flame } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface BackgroundAmbientSoundsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoundsState {
  rain: boolean;
  thunder: boolean;
  wind: boolean;
  fireplace: boolean;
}

interface PersistedState {
  sounds: SoundsState;
  volume: number;
}

interface ActiveSoundNodes {
  source: AudioBufferSourceNode | OscillatorNode;
  gain: GainNode;
  extraNodes: AudioNode[];
  intervals: ReturnType<typeof setInterval>[];
}

type SoundKey = keyof SoundsState;

/* ═══════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'ecos_sounds';
const GOLD = '#c9a84c';
const DIM = '#8a7e6b';

const DEFAULT_STATE: PersistedState = {
  sounds: { rain: false, thunder: false, wind: false, fireplace: false },
  volume: 0.5,
};

const SOUND_DEFS: {
  key: SoundKey;
  label: string;
  desc: string;
  Icon: typeof Droplets;
}[] = [
  { key: 'rain', label: 'Lluvia', desc: 'Gotas sobre los cristales', Icon: Droplets },
  { key: 'thunder', label: 'Trueno', desc: 'Retruños en la distancia', Icon: Zap },
  { key: 'wind', label: 'Viento', desc: 'Susurros entre las ruinas', Icon: Wind },
  { key: 'fireplace', label: 'Chimenea', desc: 'Crepitar del fuego ancestral', Icon: Flame },
];

/* ═══════════════════════════════════════════════════════════════
   Procedural Audio Buffer Generators
   ═══════════════════════════════════════════════════════════════ */

/** Brown noise (random walk) — base for rain & fireplace crackle */
function createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const duration = 4;
  const size = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(2, size, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < size; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * white) / 1.02;
      last = data[i];
      data[i] *= 3.5;
    }
  }
  return buffer;
}

/** White noise — base for wind */
function createWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const duration = 4;
  const size = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(2, size, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return buffer;
}

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

export default function BackgroundAmbientSounds({
  isOpen,
  onClose,
}: BackgroundAmbientSoundsProps) {
  /* ── Persisted state ──────────────────────────────────────────── */
  const [state, setState] = useState<PersistedState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as PersistedState;
    } catch {
      /* ignore corrupted data */
    }
    return DEFAULT_STATE;
  });

  /* ── Internal panel visibility ────────────────────────────────── */
  const [panelOpen, setPanelOpen] = useState(false);

  // Allow parent to force-open via `isOpen` prop (render-phase state derivation)
  if (isOpen && !panelOpen) {
    setPanelOpen(true);
  }

  /* ── Audio refs ───────────────────────────────────────────────── */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeSoundsRef = useRef<Partial<Record<SoundKey, ActiveSoundNodes>>>({});
  const brownBufferRef = useRef<AudioBuffer | null>(null);
  const whiteBufferRef = useRef<AudioBuffer | null>(null);
  const volumeRef = useRef(state.volume);

  // Keep volume ref in sync (used in lazy AudioContext init)
  useEffect(() => {
    volumeRef.current = state.volume;
  }, [state.volume]);

  /* ── Get or create AudioContext (lazy init on first interaction) ─ */
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = volumeRef.current;
      master.connect(ctx.destination);
      masterGainRef.current = master;

      brownBufferRef.current = createBrownNoiseBuffer(ctx);
      whiteBufferRef.current = createWhiteNoiseBuffer(ctx);
    }
    if (audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  /* ── Sync master volume with state ────────────────────────────── */
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        state.volume,
        audioCtxRef.current.currentTime,
      );
    }
  }, [state.volume]);

  /* ── Stop a specific sound ────────────────────────────────────── */
  const stopSound = useCallback((key: SoundKey) => {
    const nodes = activeSoundsRef.current[key];
    if (!nodes) return;
    try {
      nodes.source.stop();
    } catch {
      /* already stopped */
    }
    try {
      nodes.source.disconnect();
    } catch {
      /* ignore */
    }
    try {
      nodes.gain.disconnect();
    } catch {
      /* ignore */
    }
    nodes.extraNodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* ignore */
      }
    });
    nodes.intervals.forEach(clearInterval);
    delete activeSoundsRef.current[key];
  }, []);

  /* ── Sound starters ───────────────────────────────────────────── */

  /** Rain: brown noise → lowpass filter (400 Hz) */
  const startRain = useCallback(
    (ctx: AudioContext) => {
      const source = ctx.createBufferSource();
      source.buffer = brownBufferRef.current!;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 1;

      const gain = ctx.createGain();
      gain.gain.value = 0.6;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current!);
      source.start();

      activeSoundsRef.current.rain = {
        source,
        gain,
        extraNodes: [filter],
        intervals: [],
      };
    },
    [],
  );

  /** Thunder: low-frequency oscillator (50 Hz sine) with random volume bursts */
  const startThunder = useCallback(
    (ctx: AudioContext) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 50;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 100;

      const gain = ctx.createGain();
      gain.gain.value = 0;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current!);
      osc.start();

      // Random volume burst function
      const burst = () => {
        const now = ctx.currentTime;
        const peak = Math.random() * 0.8 + 0.2;
        const dur = Math.random() * 1.5 + 0.3;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peak, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      };

      burst(); // immediate first burst
      const interval = setInterval(() => {
        if (Math.random() > 0.4) burst();
      }, 3000 + Math.random() * 4000);

      activeSoundsRef.current.thunder = {
        source: osc,
        gain,
        extraNodes: [filter],
        intervals: [interval],
      };
    },
    [],
  );

  /** Wind: white noise → bandpass filter with slow LFO modulation */
  const startWind = useCallback(
    (ctx: AudioContext) => {
      const source = ctx.createBufferSource();
      source.buffer = whiteBufferRef.current!;
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 300;
      bandpass.Q.value = 0.5;

      const gain = ctx.createGain();
      gain.gain.value = 0.3;

      // Slow LFO modulates bandpass centre frequency
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.15; // ~6.7 s cycle

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 200; // ±200 Hz deviation

      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);
      lfo.start();

      source.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(masterGainRef.current!);
      source.start();

      activeSoundsRef.current.wind = {
        source,
        gain,
        extraNodes: [bandpass, lfo, lfoGain],
        intervals: [],
      };
    },
    [],
  );

  /** Fireplace: brown noise → bandpass with rapid random gain crackle */
  const startFireplace = useCallback(
    (ctx: AudioContext) => {
      const source = ctx.createBufferSource();
      source.buffer = brownBufferRef.current!;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.value = 0.4;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current!);
      source.start();

      // Rapid random crackle modulation (every 50 ms)
      const crackle = () => {
        const now = ctx.currentTime;
        const val = 0.2 + Math.random() * 0.8;
        const dur = 0.02 + Math.random() * 0.08;
        gain.gain.setValueAtTime(val, now);
        gain.gain.exponentialRampToValueAtTime(0.15, now + dur);
      };

      const interval = setInterval(crackle, 50);

      activeSoundsRef.current.fireplace = {
        source,
        gain,
        extraNodes: [filter],
        intervals: [interval],
      };
    },
    [],
  );

  /* ── Stable map of starter functions ──────────────────────────── */
  const startMap = useMemo<Record<SoundKey, (ctx: AudioContext) => void>>(
    () => ({
      rain: startRain,
      thunder: startThunder,
      wind: startWind,
      fireplace: startFireplace,
    }),
    [startRain, startThunder, startWind, startFireplace],
  );

  /* ── Toggle a sound on / off ──────────────────────────────────── */
  const toggleSound = useCallback(
    (key: SoundKey) => {
      const isActive = state.sounds[key];

      if (isActive) {
        stopSound(key);
      } else {
        const ctx = getAudioContext();
        startMap[key](ctx);
      }

      setState((prev) => {
        const next: PersistedState = {
          ...prev,
          sounds: { ...prev.sounds, [key]: !prev.sounds[key] },
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage full or unavailable */
        }
        return next;
      });
    },
    [state.sounds, stopSound, getAudioContext, startMap],
  );

  /* ── Master volume change ─────────────────────────────────────── */
  const handleVolumeChange = useCallback((val: number) => {
    setState((prev) => {
      const next: PersistedState = { ...prev, volume: val };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage full or unavailable */
      }
      return next;
    });
  }, []);

  /* ── Close panel + notify parent ──────────────────────────────── */
  const handleClose = useCallback(() => {
    setPanelOpen(false);
    onClose();
  }, [onClose]);

  /* ── Cleanup on unmount ───────────────────────────────────────── */
  useEffect(() => {
    return () => {
      const keys = Object.keys(activeSoundsRef.current) as SoundKey[];
      keys.forEach((k) => stopSound(k));
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [stopSound]);

  /* ── Derived ──────────────────────────────────────────────────── */
  const activeCount = Object.values(state.sounds).filter(Boolean).length;

  /* ═══════════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Floating reopen button (visible when panel is closed) ── */}
      <AnimatePresence>
        {!panelOpen && (
          <motion.button
            key="ambient-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => setPanelOpen(true)}
            className="fixed bottom-6 right-6 z-[25] w-12 h-12 rounded-full
              border border-[#2a2a2a] bg-[#0a0a0a]/90 backdrop-blur-md
              flex items-center justify-center hover:text-[#c9a84c]
              hover:border-[#c9a84c]/30 transition-all
              shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer group"
            style={{ color: activeCount > 0 ? GOLD : DIM }}
            aria-label="Abrir sonidos ambientales"
          >
            {activeCount > 0 ? (
              <>
                <Volume2 size={18} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#c9a84c] animate-pulse" />
              </>
            ) : (
              <VolumeX size={18} />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Slide-in panel ───────────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="ambient-panel"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-[30] w-[280px] rounded-xl gothic-glass
              border border-[#2a2a2a]/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Top accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#8B0000]/40 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div>
                <h3
                  className="font-[family-name:var(--font-cinzel-decorative)] text-sm tracking-wider"
                  style={{ color: GOLD }}
                >
                  Sonidos del Alma
                </h3>
                <p
                  className="font-[family-name:var(--font-fell)] italic text-[10px] mt-0.5"
                  style={{ color: DIM }}
                >
                  Atmósferas del laberinto
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded border border-[#2a2a2a] text-[#8a7e6b]
                  hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all cursor-pointer"
                aria-label="Cerrar panel de sonidos"
              >
                <X size={14} />
              </button>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
              <div className="w-1 h-1 rotate-45 border border-[#c9a84c]/20" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
            </div>

            {/* Sound toggle buttons */}
            <div className="px-3 pb-2 space-y-1.5">
              {SOUND_DEFS.map(({ key, label, desc, Icon }) => {
                const active = state.sounds[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleSound(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border
                      transition-all cursor-pointer group text-left
                      ${
                        active
                          ? 'border-[#c9a84c]/20 bg-[#c9a84c]/5'
                          : 'border-[#2a2a2a]/40 bg-[#0a0a0a]/20 hover:border-[#2a2a2a] hover:bg-[#0a0a0a]/40'
                      }`}
                    aria-label={`${label} ${active ? 'activado' : 'desactivado'}`}
                    aria-pressed={active}
                  >
                    {/* Icon box */}
                    <div
                      className={`w-8 h-8 rounded-md border flex items-center justify-center
                        shrink-0 transition-all
                        ${
                          active
                            ? 'border-[#c9a84c]/30 text-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.15)]'
                            : 'border-[#2a2a2a] text-[#5a5040] group-hover:text-[#8a7e6b]'
                        }`}
                    >
                      <Icon size={14} />
                    </div>

                    {/* Label + description */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-[family-name:var(--font-cinzel)] text-xs tracking-wider
                          uppercase transition-colors
                          ${active ? 'text-[#c9a84c]' : 'text-[#d4c5b0]'}`}
                      >
                        {label}
                      </p>
                      <p className="font-[family-name:var(--font-fell)] italic text-[9px] text-[#5a5040] truncate">
                        {desc}
                      </p>
                    </div>

                    {/* Active indicator dot */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all shrink-0
                        ${
                          active
                            ? 'bg-[#c9a84c] shadow-[0_0_6px_rgba(201,168,76,0.4)]'
                            : 'bg-[#2a2a2a] group-hover:bg-[#3a3a3a]'
                        }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Master volume slider */}
            <div className="px-4 pb-4 pt-1">
              <div className="flex items-center gap-2.5">
                <Volume2 size={12} className="text-[#5a5040] shrink-0" />
                <div className="flex-1 relative">
                  {/* Visual track */}
                  <div className="h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${state.volume * 100}%`,
                        background: `linear-gradient(to right, ${DIM}, ${GOLD})`,
                      }}
                    />
                  </div>
                  {/* Invisible native range for interaction */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={state.volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Volumen maestro"
                  />
                </div>
                {/* Percentage readout */}
                <span
                  className="font-[family-name:var(--font-typewriter)] text-[9px] text-[#5a5040] w-6 text-right"
                >
                  {Math.round(state.volume * 100)}
                </span>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/10 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
