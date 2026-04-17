'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';

interface LoginOverlayProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

function PentagramSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle
        cx="250"
        cy="250"
        r="230"
        fill="none"
        stroke="#8B0000"
        strokeWidth="1"
      />
      {/* Inner circle */}
      <circle
        cx="250"
        cy="250"
        r="200"
        fill="none"
        stroke="#8B0000"
        strokeWidth="0.5"
      />
      {/* Pentagram path */}
      <polygon
        points="250,30 96,390 454,156 46,156 404,390"
        fill="none"
        stroke="#8B0000"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Center inverted pentagon */}
      <polygon
        points="155,345 96,156 250,215 404,156 345,345"
        fill="none"
        stroke="#8B0000"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* Small decorative circles at pentagram points */}
      <circle cx="250" cy="30" r="4" fill="#8B0000" />
      <circle cx="96" cy="390" r="4" fill="#8B0000" />
      <circle cx="454" cy="156" r="4" fill="#8B0000" />
      <circle cx="46" cy="156" r="4" fill="#8B0000" />
      <circle cx="404" cy="390" r="4" fill="#8B0000" />
      {/* Corner ornaments */}
      <g className="opacity-40">
        <path d="M10,10 L40,10 L40,14 L14,14 L14,40 L10,40 Z" fill="#8B0000" />
        <path d="M490,10 L460,10 L460,14 L486,14 L486,40 L490,40 Z" fill="#8B0000" />
        <path d="M10,490 L40,490 L40,486 L14,486 L14,460 L10,460 Z" fill="#8B0000" />
        <path d="M490,490 L460,490 L460,486 L486,486 L486,460 L490,460 Z" fill="#8B0000" />
      </g>
    </svg>
  );
}

// ─── Floating Rune Symbols ───
const RUNE_SYMBOLS = ['☽', '✧', '◈', '♛', '✠', '❋', '⚜', '❖', '✵', '◆', '♢', '✶'];

function FloatingRunes() {
  const runes = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      symbol: RUNE_SYMBOLS[Math.floor(Math.random() * RUNE_SYMBOLS.length)],
      left: Math.random() * 100,
      size: 10 + Math.random() * 16,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 15,
    }))
  )[0];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {runes.map((r) => (
        <span
          key={r.id}
          className="floating-rune"
          style={{
            left: `${r.left}%`,
            fontSize: `${r.size}px`,
            animationDuration: `${r.duration}s`,
            animationDelay: `-${r.delay}s`,
          }}
        >
          {r.symbol}
        </span>
      ))}
    </div>
  );
}

export default function LoginOverlay({ onLogin }: LoginOverlayProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);
  const { loginError, clearError } = useAuthStore();

  // Clear store and local error when user starts typing again
  useEffect(() => {
    if (loginError) {
      clearError();
      setError('');
    }
  }, [email, password, loginError, clearError]);

  const displayError = error || loginError;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!email.trim() || !password.trim()) {
        setError('Todos los campos son requeridos');
        return;
      }

      setIsLoading(true);
      try {
        const success = await onLogin(email, password);
        if (success) {
          setShowForm(false);
        }
        // On failure, loginError is already set by the auth store
        // Only set local error as fallback
        if (!success && !loginError) {
          setError('La llave no es correcta. Intenta de nuevo.');
        }
      } catch {
        setError('Ocurrió un error inesperado. Intenta más tarde.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, onLogin, loginError]
  );

  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Floating rune symbols */}
          <FloatingRunes />

          {/* Pentagram background with slow drift */}
          <div className="pentagram-drift">
            <PentagramSVG />
          </div>

          {/* Ambient glow effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B0000] rounded-full blur-[180px] opacity-[0.06]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2d1b3d] rounded-full blur-[150px] opacity-[0.08]" />
          </div>

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
            }}
          />

          {/* Login form container */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-4"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            {/* Card frame */}
            <div className="relative p-8 sm:p-10 bg-[#111111]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-sm shadow-2xl">
              {/* SVG corner ornaments — gothic frame */}
              <svg className="absolute top-0 left-0 w-10 h-10 opacity-20 pointer-events-none" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M0 16 L0 0 L16 0" stroke="#c9a84c" strokeWidth="1" fill="none" />
                <path d="M0 8 C8 8, 8 8, 8 0" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
                <circle cx="3" cy="3" r="1" fill="#c9a84c" opacity="0.5" />
              </svg>
              <svg className="absolute top-0 right-0 w-10 h-10 opacity-20 pointer-events-none" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M24 0 L40 0 L40 16" stroke="#c9a84c" strokeWidth="1" fill="none" />
                <path d="M40 8 C32 8, 32 8, 32 0" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
                <circle cx="37" cy="3" r="1" fill="#c9a84c" opacity="0.5" />
              </svg>
              <svg className="absolute bottom-0 left-0 w-10 h-10 opacity-20 pointer-events-none" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M0 24 L0 40 L16 40" stroke="#c9a84c" strokeWidth="1" fill="none" />
                <path d="M0 32 C8 32, 8 32, 8 40" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
                <circle cx="3" cy="37" r="1" fill="#c9a84c" opacity="0.5" />
              </svg>
              <svg className="absolute bottom-0 right-0 w-10 h-10 opacity-20 pointer-events-none" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M40 24 L40 40 L24 40" stroke="#c9a84c" strokeWidth="1" fill="none" />
                <path d="M40 32 C32 32, 32 32, 32 40" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
                <circle cx="37" cy="37" r="1" fill="#c9a84c" opacity="0.5" />
              </svg>

              {/* Flickering candle flame above title */}
              <div className="flex justify-center mb-4">
                <svg className="candle-flicker" width="18" height="32" viewBox="0 0 18 32" fill="none" aria-hidden="true">
                  {/* Candle body */}
                  <rect x="6" y="18" width="6" height="12" rx="1" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="0.5" />
                  {/* Wick */}
                  <line x1="9" y1="18" x2="9" y2="14" stroke="#8a7e6b" strokeWidth="0.8" />
                  {/* Flame outer */}
                  <ellipse cx="9" cy="10" rx="5" ry="8" fill="rgba(255,140,0,0.15)" />
                  {/* Flame mid */}
                  <ellipse cx="9" cy="10" rx="3" ry="6" fill="rgba(255,170,0,0.4)" />
                  {/* Flame inner */}
                  <ellipse cx="9" cy="11" rx="1.5" ry="3.5" fill="rgba(255,220,100,0.7)" />
                  {/* Glow */}
                  <circle cx="9" cy="10" r="10" fill="rgba(255,170,0,0.04)" />
                </svg>
              </div>

              {/* Decorative top line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

              {/* Title */}
              <motion.h1
                className="text-center text-3xl sm:text-4xl font-[family-name:var(--font-cinzel-decorative)] font-bold tracking-wider text-[#c9a84c] mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Ecos del Alma
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-center text-sm font-[family-name:var(--font-fell)] italic text-[#8a7e6b] mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Introduce la llave para entrar al laberinto
              </motion.p>

              {/* Rose and thorns ornate divider */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#2a2a2a]" />
                <svg className="w-16 h-5 opacity-40" viewBox="0 0 64 20" fill="none" aria-hidden="true">
                  {/* Left thorn stem */}
                  <path d="M4 14 L20 14" stroke="#8a7234" strokeWidth="0.6" opacity="0.6" />
                  <path d="M8 14 L6 11" stroke="#8a7234" strokeWidth="0.5" opacity="0.4" />
                  <path d="M14 14 L12 11" stroke="#8a7234" strokeWidth="0.5" opacity="0.4" />
                  {/* Rose center */}
                  <ellipse cx="32" cy="11" rx="5" ry="4" stroke="#8B0000" strokeWidth="0.7" opacity="0.6" />
                  <path d="M27 11 C29 8, 35 8, 37 11" stroke="#8B0000" strokeWidth="0.5" opacity="0.5" fill="none" />
                  <circle cx="32" cy="11" r="1.5" fill="#8B0000" opacity="0.3" />
                  {/* Right thorn stem */}
                  <path d="M44 14 L60 14" stroke="#8a7234" strokeWidth="0.6" opacity="0.6" />
                  <path d="M50 14 L52 11" stroke="#8a7234" strokeWidth="0.5" opacity="0.4" />
                  <path d="M56 14 L58 11" stroke="#8a7234" strokeWidth="0.5" opacity="0.4" />
                </svg>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#2a2a2a]" />
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-widest text-[#8a7e6b] mb-2"
                  >
                    Correo
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correoscuro.com"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#d4c5b0] font-[family-name:var(--font-fell)] text-sm placeholder:text-[#8a7e6b]/40 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-300 disabled:opacity-50"
                  />
                </motion.div>

                {/* Password field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.35 }}
                >
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-widest text-[#8a7e6b] mb-2"
                  >
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#d4c5b0] font-[family-name:var(--font-fell)] text-sm placeholder:text-[#8a7e6b]/40 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-300 disabled:opacity-50"
                  />
                </motion.div>

                {/* Error message */}
                <AnimatePresence mode="wait">
                  {displayError && (
                    <motion.div
                      key={displayError}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className={`text-sm font-[family-name:var(--font-fell)] italic text-center ${
                        loginError
                          ? 'text-[#c9a84c]'
                          : 'text-[#a00000]'
                      }`}
                    >
                      {loginError && (
                        <span className="mr-1.5" role="img" aria-label="warning">⚠</span>
                      )}
                      {displayError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="login-blood-btn relative w-full py-3.5 font-[family-name:var(--font-cinzel)] font-semibold uppercase tracking-widest text-sm text-[#c9a84c] rounded-sm overflow-hidden transition-all duration-300 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {/* Background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] group-hover:from-[#a00000] group-hover:via-[#8B0000] group-hover:to-[#a00000] transition-all duration-500" />

                    {/* Hover shimmer */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

                    {/* Loading flicker overlay */}
                    {isLoading && (
                      <span
                        className="absolute inset-0 bg-[#8B0000]/80 animate-flicker"
                      />
                    )}

                    {/* Button text */}
                    <span className="relative z-10">
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="opacity-25"
                            />
                            <path
                              d="M4 12a8 8 0 018-8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          Entrando...
                        </span>
                      ) : (
                        'Entrar'
                      )}
                    </span>
                  </button>
                </motion.div>
              </form>

              {/* Decorative bottom line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
            </div>
          </motion.div>


        </motion.div>
      )}
    </AnimatePresence>
  );
}
