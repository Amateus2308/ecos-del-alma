'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronUp, ChevronDown, Music, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import type { Song } from '@/store/content';

interface FloatingMusicPlayerProps {
  songs: Song[];
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function FloatingMusicPlayer({ songs }: FloatingMusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex] || null;

  const initAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (!currentSong) return;

    const audio = new Audio(`/upload/${currentSong.filename}`);
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (songs.length > 1) {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        setCurrentSongIndex(nextIndex);
      }
    });

    audio.addEventListener('error', () => {
      setIsPlaying(false);
    });
  }, [currentSong, currentSongIndex, songs.length, volume]);

  useEffect(() => {
    initAudio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (songs.length <= 1) return;
    const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (songs.length <= 1) return;
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40"
      >
        <div className="mx-auto max-w-2xl px-4 pb-4">
          <motion.div
            layout
            className="relative overflow-hidden border border-[#2a2a2a] rounded-lg shadow-[0_-4px_30px_rgba(0,0,0,0.5)]"
            style={{
              background: 'linear-gradient(180deg, rgba(17,17,17,0.98) 0%, rgba(10,10,10,0.99) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B0000]/60 to-transparent" />

            {/* Collapsed bar */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {/* Album art / icon */}
              <div className="relative w-10 h-10 rounded bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0 overflow-hidden">
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-4">
                    <motion.div
                      className="w-[3px] bg-[#c9a84c] rounded-full"
                      animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="w-[3px] bg-[#c9a84c] rounded-full"
                      animate={{ height: ['10px', '4px', '14px', '6px', '10px'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    />
                    <motion.div
                      className="w-[3px] bg-[#c9a84c] rounded-full"
                      animate={{ height: ['6px', '12px', '4px', '14px', '6px'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    />
                  </div>
                ) : (
                  <Music size={16} className="text-[#8a7e6b]" />
                )}
              </div>

              {/* Song info */}
              <div className="flex-1 min-w-0">
                <p className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs tracking-wider truncate">
                  {currentSong.title || currentSong.originalName}
                </p>
                <p className="font-[family-name:var(--font-fell)] text-[#8a7e6b] text-[10px] truncate">
                  {currentSong.artist || 'Sin artista'}
                  {songs.length > 1 && (
                    <span className="ml-2 text-[#5a5040]">
                      {currentSongIndex + 1}/{songs.length}
                    </span>
                  )}
                </p>
              </div>

              {/* Controls (always visible) */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {songs.length > 1 && (
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded text-[#8a7e6b] hover:text-[#c9a84c] transition-colors"
                    aria-label="Previous track"
                  >
                    <SkipBack size={14} />
                  </button>
                )}
                <button
                  onClick={handlePlayPause}
                  className="p-2 rounded-full bg-[#8B0000]/60 hover:bg-[#8B0000] text-[#d4c5b0] transition-all shadow-[0_0_10px_rgba(139,0,0,0.2)]"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                {songs.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded text-[#8a7e6b] hover:text-[#c9a84c] transition-colors"
                    aria-label="Next track"
                  >
                    <SkipForward size={14} />
                  </button>
                )}
              </div>

              {/* Expand/collapse */}
              <button
                className="p-1 rounded text-[#5a5040] hover:text-[#8a7e6b] transition-colors shrink-0"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            {/* Expanded section */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {/* Progress bar */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-[family-name:var(--font-typewriter)] text-[10px] text-[#5a5040] w-8 text-right">
                        {formatTime(currentTime)}
                      </span>
                      <div className="flex-1 relative">
                        <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#8B0000] to-[#c9a84c] rounded-full"
                            style={{ width: `${progress}%` }}
                            layout
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          step="0.1"
                          value={currentTime}
                          onChange={handleSeek}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          aria-label="Seek"
                        />
                      </div>
                      <span className="font-[family-name:var(--font-typewriter)] text-[10px] text-[#5a5040] w-8">
                        {formatTime(duration)}
                      </span>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-2 mt-2">
                      <Volume2 size={12} className="text-[#5a5040] shrink-0" />
                      <div className="flex-1 relative">
                        <div className="h-[3px] bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#8a7e6b] rounded-full transition-all"
                            style={{ width: `${volume * 100}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          aria-label="Volume"
                        />
                      </div>
                    </div>

                    {/* Playlist indicator */}
                    {songs.length > 1 && (
                      <div className="flex items-center gap-1 mt-2 overflow-x-auto max-w-full pb-1" style={{ scrollbarWidth: 'none' }}>
                        {songs.map((song, i) => (
                          <button
                            key={song.id}
                            onClick={() => {
                              setCurrentSongIndex(i);
                              setCurrentTime(0);
                              setIsPlaying(true);
                            }}
                            className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-[family-name:var(--font-fell)] transition-all ${
                              i === currentSongIndex
                                ? 'bg-[#8B0000]/30 text-[#c9a84c] border border-[#8B0000]/40'
                                : 'text-[#5a5040] hover:text-[#8a7e6b] border border-transparent'
                            }`}
                          >
                            {(song.title || song.originalName).slice(0, 12)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
