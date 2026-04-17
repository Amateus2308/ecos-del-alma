'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

interface Song {
  id: string;
  filename: string;
  title: string | null;
  artist: string | null;
  originalName: string;
}

interface GothicAudioPlayerProps {
  song: Song;
  isAdmin: boolean;
  onTogglePublish: (id: string, published: boolean) => void;
  published: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function GothicAudioPlayer({
  song,
  isAdmin,
  onTogglePublish,
  published,
}: GothicAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const displayTitle =
    song.title || song.originalName.replace(/\.[^/.]+$/, '');
  const displayArtist = song.artist || 'Desconocido';

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const bar = progressRef.current;
      if (!audio || !bar) return;

      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      audio.currentTime = percentage * duration;
    },
    [duration]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (audioRef.current) {
        audioRef.current.volume = val;
      }
      setIsMuted(val === 0);
    },
    []
  );

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className="relative group bg-[#111111] border border-[#2a2a2a] rounded-sm p-5 transition-all duration-500 hover:border-[#8B0000]/30 hover:shadow-[0_0_15px_rgba(139,0,0,0.1)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Audio element (hidden) */}
      <audio ref={audioRef} src={`/upload/${song.filename}`} preload="metadata" />

      {/* Waveform decoration (CSS only) */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div className="flex items-center justify-center h-full gap-[2px] opacity-30">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="w-[1px] bg-[#8B0000]"
              style={{
                height: `${Math.sin(i * 0.5) * 30 + 50}%`,
                opacity: isPlaying ? 0.6 + Math.sin(i * 0.3) * 0.4 : 0.2,
                transition: 'opacity 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Song info + controls */}
      <div className="flex items-start gap-4">
        {/* Play button */}
        <button
          onClick={togglePlay}
          className="shrink-0 w-12 h-12 rounded-full border-2 border-[#c9a84c]/50 bg-[#0a0a0a] flex items-center justify-center hover:border-[#c9a84c] hover:shadow-[0_0_12px_rgba(201,168,76,0.2)] transition-all duration-300 group/play cursor-pointer relative"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {/* Blood red accent ring */}
          <div className="absolute inset-0 rounded-full border border-[#8B0000]/30 group-hover/play:border-[#8B0000]/60 transition-colors duration-300 scale-110" />

          {isLoading ? (
            <div className="w-4 h-4 border-2 border-[#c9a84c]/60 border-t-[#c9a84c] rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-[#c9a84c]"
            >
              <rect x="2" y="1" width="3" height="12" rx="1" fill="currentColor" />
              <rect x="9" y="1" width="3" height="12" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
              className="text-[#c9a84c] ml-0.5"
            >
              <path d="M2 1.5L12 7L2 12.5V1.5Z" />
            </svg>
          )}
        </button>

        {/* Song details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-cinzel)] text-sm font-semibold text-[#d4c5b0] truncate">
            {displayTitle}
          </h3>
          <p className="font-[family-name:var(--font-fell)] italic text-xs text-[#8a7e6b] truncate mt-0.5">
            {displayArtist}
          </p>
        </div>

        {/* Admin publish toggle */}
        {isAdmin && (
          <button
            onClick={() => onTogglePublish(song.id, !published)}
            className="shrink-0 p-1.5 rounded-sm border border-[#2a2a2a] hover:border-[#c9a84c]/50 transition-colors duration-300 cursor-pointer"
            title={published ? 'Ocultar' : 'Publicar'}
          >
            {published ? (
              <Eye className="w-3.5 h-3.5 text-[#c9a84c]/70" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-[#8a7e6b]" />
            )}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex items-center gap-3">
        {/* Current time */}
        <span className="text-[10px] font-[family-name:var(--font-typewriter)] text-[#8a7e6b] w-8 text-right tabular-nums">
          {formatTime(currentTime)}
        </span>

        {/* Seek bar */}
        <div
          ref={progressRef}
          className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full cursor-pointer relative group/progress"
          onClick={handleSeek}
        >
          {/* Track fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#8B0000] to-[#a00000] transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
          {/* Gold accent at head */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#c9a84c] shadow-[0_0_6px_rgba(201,168,76,0.4)] opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
            style={{ left: `calc(${progress}% - 5px)` }}
          />
          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 shadow-[inset_0_0_4px_rgba(201,168,76,0.1)]" />
        </div>

        {/* Duration */}
        <span className="text-[10px] font-[family-name:var(--font-typewriter)] text-[#8a7e6b] w-8 tabular-nums">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume control */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-1 text-[#8a7e6b] hover:text-[#c9a84c] transition-colors duration-200 cursor-pointer"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 appearance-none bg-[#1a1a1a] rounded-full cursor-pointer accent-volume [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c9a84c] [&::-webkit-slider-thumb]:shadow-[0_0_4px_rgba(201,168,76,0.3)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#c9a84c] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_4px_rgba(201,168,76,0.3)] [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Animated waveform bars next to volume (decorative) */}
        <div className="flex items-end gap-[1px] h-3 ml-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[2px] bg-[#8B0000]/40 rounded-full transition-all duration-300"
              style={{
                height: isPlaying
                  ? `${4 + Math.random() * 8}px`
                  : '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom waveform decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
        <div className="flex items-center justify-center h-full gap-[1px] opacity-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-[1px] bg-[#c9a84c]"
              style={{
                height: `${Math.cos(i * 0.4) * 40 + 50}%`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
