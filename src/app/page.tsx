'use client';

// Ecos del Alma — página principal
// todo vive aquí: hero, secciones, footer, navegación...
// es un archivo bastante grande pero preferí mantenerlo todo junto
// para que sea más fácil de entender el flujo de la app

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, Eye, EyeOff, Edit3, ImageIcon, ArrowUp, Sparkles, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';
import { useContentStore, type Letter, type Photo, type Song, type Video, type CanvasPage } from '@/store/content';
import LoginOverlay from '@/components/gothic/LoginOverlay';
import AdminPanel from '@/components/gothic/AdminPanel';
import LetterCard from '@/components/gothic/LetterCard';
import LoveLetterArchive from '@/components/gothic/LoveLetterArchive';
import PhotoGallery from '@/components/gothic/PhotoGallery';
import GothicAudioPlayer from '@/components/gothic/GothicAudioPlayer';
import GothicVideoPlayer from '@/components/gothic/GothicVideoPlayer';
import GothicDivider from '@/components/gothic/GothicDivider';
import CanvasEditor from '@/components/gothic/CanvasEditor';
import CanvasViewer from '@/components/gothic/CanvasViewer';
import FloatingMusicPlayer from '@/components/gothic/FloatingMusicPlayer';
import LetterReaderModal from '@/components/gothic/LetterReaderModal';
import WhisperWall from '@/components/gothic/WhisperWall';
import SecretMessage from '@/components/gothic/SecretMessage';
import LoveCounter from '@/components/gothic/LoveCounter';
import InteractiveCandle from '@/components/gothic/InteractiveCandle';
import MemoryTimeline from '@/components/gothic/MemoryTimeline';
import AmbientSettings from '@/components/gothic/AmbientSettings';
import LovePoemGenerator from '@/components/gothic/LovePoemGenerator';
import ScrollProgressBar from '@/components/gothic/ScrollProgressBar';
import GothicStarField from '@/components/gothic/GothicStarField';
import BackgroundAmbientSounds from '@/components/gothic/BackgroundAmbientSounds';
import DreamJournal from '@/components/gothic/DreamJournal';
import GothicMoonPhase from '@/components/gothic/GothicMoonPhase';
import OracleCard from '@/components/gothic/OracleCard';
import CursorSparkleTrail from '@/components/gothic/CursorSparkleTrail';
import LoveNotes from '@/components/gothic/LoveNotes';
import GothicRoseGarden from '@/components/gothic/GothicRoseGarden';
import BloodPactVows from '@/components/gothic/BloodPactVows';
import MemoryVault from '@/components/gothic/MemoryVault';
import GothicTarotReading from '@/components/gothic/GothicTarotReading';
import LoveLockBridge from '@/components/gothic/LoveLockBridge';
import AnimatedHourglass from '@/components/gothic/AnimatedHourglass';
import GothicGraveyardRoses from '@/components/gothic/GothicGraveyardRoses';
import GothicMusicBox from '@/components/gothic/GothicMusicBox';
import LoveTestQuestionnaire from '@/components/gothic/LoveTestQuestionnaire';
import GothicConstellationMap from '@/components/gothic/GothicConstellationMap';
import GothicWishLantern from '@/components/gothic/GothicWishLantern';
import WritingRitual from '@/components/gothic/WritingRitual';

// ─── Romantic Quotes ───
const ROMANTIC_QUOTES = [
  { text: 'Lo que no me mata, me hace cuestionar por qué sigo en pie.', author: '' },
  { text: 'En el silencio de la noche, tus ecos me encuentran.', author: '' },
  { text: 'Cada lágrima que cae es una carta que no te envié.', author: '' },
  { text: 'El laberinto del corazón no tiene salida, solo esquinas donde esperarte.', author: '' },
  { text: 'Los susurros del viento llevan lo que mis labios no se atreven a decir.', author: '' },
  { text: 'Entre las sombras y la luz, tu recuerdo es el puente que cruza mi alma.', author: '' },
  { text: 'No hay nada más gótico que amar lo que ya se ha ido.', author: '' },
  { text: 'Las estrellas escriben poemas que solo los corazones rotos pueden leer.', author: '' },
];

// ─── Section Nav Items ───
interface SectionNavItem {
  id: string;
  label: string;
}

// ─── Particle Background ───
function ParticleBackground() {
  const particles = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 5,
    }))
  )[0];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#8B0000]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Quote Rotator ───
function QuoteRotator() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-16 sm:h-20 w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        <motion.p
          key={quoteIndex}
          className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base text-center leading-relaxed px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          &ldquo;{ROMANTIC_QUOTES[quoteIndex].text}&rdquo;
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Scroll Navigation Dots ───
function ScrollNavigationDots({ sections }: { sections: SectionNavItem[] }) {
  const [activeSection, setActiveSection] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setVisible(scrollY > heroHeight * 0.6);

      // Determine active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {visible && sections.length > 0 && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-3"
          aria-label="Section navigation"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center justify-end"
              aria-label={`Navigate to ${section.label}`}
            >
              {/* Label tooltip */}
              <span
                className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap
                  font-[family-name:var(--font-cinzel)] text-[10px] tracking-widest uppercase text-[#8a7e6b]
                  bg-[#111111]/90 backdrop-blur-sm border border-[#2a2a2a] rounded px-2 py-1 pointer-events-none"
              >
                {section.label}
              </span>
              {/* Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-[#c9a84c] border-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.4)] scale-125'
                    : 'bg-transparent border-[#2a2a2a] group-hover:border-[#8a7e6b]'
                }`}
              />
            </button>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

// ─── Scroll to Top Button ───
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-30 p-2.5 rounded-full border border-[#2a2a2a] bg-[#111111]/80 backdrop-blur-sm
            text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all shadow-lg
            hover:shadow-[0_0_20px_rgba(201,168,76,0.1)] cursor-pointer gothic-card-hover"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Decorative Rose SVG ───
function OrnateRose({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`ornate-icon ${className}`}
      width="40"
      height="48"
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stem with thorns */}
      <path d="M20 26 L20 48" stroke="#8a7234" strokeWidth="1" opacity="0.6" />
      <path d="M18 32 L20 30 L22 32" stroke="#8a7234" strokeWidth="0.8" opacity="0.5" />
      <path d="M17 38 L20 36 L23 38" stroke="#8a7234" strokeWidth="0.8" opacity="0.4" />
      {/* Outer petals */}
      <path d="M20 10 C14 6, 6 8, 6 16 C6 22, 14 24, 20 20" fill="none" stroke="#8B0000" strokeWidth="0.8" opacity="0.7" />
      <path d="M20 10 C26 6, 34 8, 34 16 C34 22, 26 24, 20 20" fill="none" stroke="#8B0000" strokeWidth="0.8" opacity="0.7" />
      <path d="M20 4 C12 2, 4 6, 4 14 C4 18, 10 20, 16 18" fill="none" stroke="#a00000" strokeWidth="0.6" opacity="0.5" />
      <path d="M20 4 C28 2, 36 6, 36 14 C36 18, 30 20, 24 18" fill="none" stroke="#a00000" strokeWidth="0.6" opacity="0.5" />
      {/* Inner petals */}
      <path d="M20 8 C16 6, 12 8, 12 13 C12 17, 16 18, 20 16" fill="none" stroke="#8B0000" strokeWidth="0.7" opacity="0.8" />
      <path d="M20 8 C24 6, 28 8, 28 13 C28 17, 24 18, 20 16" fill="none" stroke="#8B0000" strokeWidth="0.7" opacity="0.8" />
      {/* Center spiral */}
      <path d="M20 12 C18 11, 17 13, 18 14 C19 15, 21 14, 20 13" fill="#8B0000" opacity="0.4" />
      {/* Small leaf */}
      <path d="M20 28 C22 26, 26 27, 24 30" fill="none" stroke="#8a7234" strokeWidth="0.6" opacity="0.4" />
      <path d="M20 28 C18 26, 14 27, 16 30" fill="none" stroke="#8a7234" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

// ─── Ornate Scroll Key SVG ───
function OrnateScrollKey() {
  return (
    <svg
      className="scroll-key"
      width="18"
      height="28"
      viewBox="0 0 18 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Key bow (top decorative circle) */}
      <circle cx="9" cy="7" r="5" stroke="#8a7e6b" strokeWidth="1" opacity="0.6" />
      <circle cx="9" cy="7" r="2.5" stroke="#8a7e6b" strokeWidth="0.6" opacity="0.4" />
      <circle cx="9" cy="7" r="0.8" fill="#8a7e6b" opacity="0.5" />
      {/* Cross in bow */}
      <line x1="9" y1="4.5" x2="9" y2="9.5" stroke="#8a7e6b" strokeWidth="0.4" opacity="0.3" />
      <line x1="6.5" y1="7" x2="11.5" y2="7" stroke="#8a7e6b" strokeWidth="0.4" opacity="0.3" />
      {/* Key shaft */}
      <line x1="9" y1="12" x2="9" y2="24" stroke="#8a7e6b" strokeWidth="1" opacity="0.6" />
      {/* Key teeth */}
      <line x1="9" y1="20" x2="12" y2="20" stroke="#8a7e6b" strokeWidth="0.8" opacity="0.5" />
      <line x1="9" y1="23" x2="11" y2="23" stroke="#8a7e6b" strokeWidth="0.8" opacity="0.4" />
      {/* Key tip */}
      <line x1="9" y1="24" x2="7" y2="26" stroke="#8a7e6b" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

// ─── Hero Section ───
function HeroSection() {
  return (
    <section id="hero" className="hero-gothic-frame relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Cinematic letterbox bars */}
      <div className="letterbox-top" aria-hidden="true" />
      <div className="letterbox-bottom" aria-hidden="true" />

      {/* Floating dust/ember particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="ember-particle" style={{ left: '12%', bottom: '-10px', width: '3px', height: '3px', background: '#c9a84c', animationDuration: '14s', animationDelay: '0s', opacity: 0.5 }} />
        <div className="ember-particle" style={{ left: '28%', bottom: '-10px', width: '2px', height: '2px', background: '#8B0000', animationDuration: '18s', animationDelay: '-3s', opacity: 0.4 }} />
        <div className="ember-particle" style={{ left: '45%', bottom: '-10px', width: '4px', height: '4px', background: '#c9a84c', animationDuration: '12s', animationDelay: '-6s', opacity: 0.3 }} />
        <div className="ember-particle" style={{ left: '62%', bottom: '-10px', width: '2px', height: '2px', background: '#a00000', animationDuration: '16s', animationDelay: '-2s', opacity: 0.4 }} />
        <div className="ember-particle" style={{ left: '78%', bottom: '-10px', width: '3px', height: '3px', background: '#c9a84c', animationDuration: '20s', animationDelay: '-8s', opacity: 0.35 }} />
        <div className="ember-particle" style={{ left: '90%', bottom: '-10px', width: '2px', height: '2px', background: '#8B0000', animationDuration: '15s', animationDelay: '-5s', opacity: 0.3 }} />
        <div className="ember-particle" style={{ left: '35%', bottom: '-10px', width: '3px', height: '3px', background: '#f0dca0', animationDuration: '22s', animationDelay: '-10s', opacity: 0.25 }} />
        <div className="ember-particle" style={{ left: '55%', bottom: '-10px', width: '2px', height: '2px', background: '#c9a84c', animationDuration: '17s', animationDelay: '-4s', opacity: 0.45 }} />
      </div>

      {/* Pentagram Background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="230" fill="none" stroke="#8B0000" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="190" fill="none" stroke="#8B0000" strokeWidth="0.5" />
        <polygon points="250,30 96,390 454,156 46,156 404,390" fill="none" stroke="#8B0000" strokeWidth="1" />
      </svg>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#8B0000] rounded-full blur-[200px] opacity-[0.04]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#2d1b3d] rounded-full blur-[180px] opacity-[0.06]" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Flying bat silhouettes */}
      <svg className="bat-fly absolute top-[20%] h-8 w-8 text-[#8B0000]" viewBox="0 0 40 20" fill="currentColor" aria-hidden="true">
        <path d="M20 0 C14 4, 4 6, 0 14 C2 12, 6 8, 12 8 C10 10, 10 14, 12 16 C14 12, 16 10, 18 10 C18 14, 19 16, 20 20 C21 16, 22 14, 22 10 C24 10, 26 12, 28 16 C30 14, 30 10, 28 8 C34 8, 38 12, 40 14 C36 6, 26 4, 20 0Z" />
      </svg>
      <svg className="bat-fly absolute top-[35%] h-6 w-6 text-[#8B0000]" viewBox="0 0 40 20" fill="currentColor" aria-hidden="true" style={{ animationDelay: '-8s', animationDuration: '25s' }}>
        <path d="M20 0 C14 4, 4 6, 0 14 C2 12, 6 8, 12 8 C10 10, 10 14, 12 16 C14 12, 16 10, 18 10 C18 14, 19 16, 20 20 C21 16, 22 14, 22 10 C24 10, 26 12, 28 16 C30 14, 30 10, 28 8 C34 8, 38 12, 40 14 C36 6, 26 4, 20 0Z" />
      </svg>

      {/* Raven silhouette */}
      <svg className="raven-soar absolute top-[45%] h-6 w-10 text-[#2a2a2a]" viewBox="0 0 48 24" fill="currentColor" aria-hidden="true">
        <path d="M4 20 C6 18, 10 12, 18 8 C20 7, 22 6, 24 6 C26 6, 28 7, 30 8 C38 12, 42 18, 44 20 C42 18, 38 14, 36 12 C38 14, 40 16, 42 16 C40 14, 36 10, 34 8 C32 7, 30 7, 28 8 C26 6, 24 6, 22 7 C20 6, 18 7, 16 8 C12 10, 8 14, 6 16 C6 14, 6 12, 8 10 C6 12, 4 16, 4 20Z" />
      </svg>

      {/* Mist layers */}
      <div className="mist-layer absolute bottom-[15%] left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none" />
      <div className="mist-layer absolute bottom-[25%] left-0 right-0 h-24 bg-gradient-to-t from-[#1a1225]/20 via-transparent to-transparent pointer-events-none" style={{ animationDelay: '-4s' }} />

      {/* Content */}
      <motion.div className="relative z-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.3 }}>
        <motion.p
          className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base tracking-wider mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Memorias del Laberinto y la Luz
        </motion.p>

        {/* Decorative Rose above title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex justify-center mb-3"
        >
          <OrnateRose className="w-7 h-9 sm:w-9 sm:h-11 opacity-70" />
        </motion.div>

        {/* Title with vignette pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="inline-block px-6 sm:px-10 py-3 vignette-pulse"
        >
          <h1
            className="font-[family-name:var(--font-cinzel-decorative)] text-3xl sm:text-5xl md:text-7xl font-bold tracking-wider text-gradient-animate"
          >
            Ecos del Alma
          </h1>
        </motion.div>

        {/* Glow Line — expanding horizontal line after title */}
        <motion.div
          className="w-full max-w-md mx-auto mt-6 mb-2 flex justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <div className="glow-line" />
        </motion.div>

        {/* Quote Rotator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="my-8"
        >
          <QuoteRotator />
        </motion.div>

        {/* Elaborate Ornamental divider — double diamond */}
        <motion.div
          className="flex items-center justify-center gap-3 sm:gap-4 mb-12"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <div className="w-16 sm:w-28 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-[#c9a84c]/60" />
          {/* Outer diamond with inner diamond */}
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-45 border border-[#c9a84c]/40" />
            <div className="absolute w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rotate-45 bg-[#c9a84c]/30" />
          </div>
          <div className="w-2 sm:w-3 h-px bg-[#c9a84c]/20" />
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-45 border border-[#c9a84c]/40" />
            <div className="absolute w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rotate-45 bg-[#c9a84c]/30" />
          </div>
          <div className="w-16 sm:w-28 h-px bg-gradient-to-l from-transparent via-[#c9a84c]/40 to-[#c9a84c]/60" />
        </motion.div>

        {/* Decorative Rose below divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="flex justify-center mb-8"
        >
          <OrnateRose className="w-5 h-6 sm:w-6 sm:h-7 opacity-40 rotate-180" />
        </motion.div>

        {/* Scroll indicator — ornate key */}
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <OrnateScrollKey />
          <motion.div
            className="w-12 h-px bg-gradient-to-r from-transparent via-[#8a7e6b]/30 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Footer Filigree SVG ───
function FiligreeOrnament() {
  return (
    <svg
      className="ornate-icon opacity-30"
      width="200"
      height="24"
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central flourish */}
      <path d="M100 12 C95 6, 88 4, 82 6 C78 7, 76 10, 78 12 C76 14, 78 17, 82 18 C88 20, 95 18, 100 12Z" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
      <path d="M100 12 C105 6, 112 4, 118 6 C122 7, 124 10, 122 12 C124 14, 122 17, 118 18 C112 20, 105 18, 100 12Z" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
      <circle cx="100" cy="12" r="2" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
      <circle cx="100" cy="12" r="0.6" fill="#c9a84c" />
      {/* Left scrollwork */}
      <path d="M82 12 C72 12, 60 10, 50 12" stroke="#c9a84c" strokeWidth="0.4" fill="none" />
      <path d="M78 8 C72 6, 65 8, 60 10" stroke="#c9a84c" strokeWidth="0.3" fill="none" />
      <path d="M78 16 C72 18, 65 16, 60 14" stroke="#c9a84c" strokeWidth="0.3" fill="none" />
      <path d="M50 12 C40 14, 30 10, 20 12" stroke="#c9a84c" strokeWidth="0.3" fill="none" />
      {/* Right scrollwork */}
      <path d="M118 12 C128 12, 140 10, 150 12" stroke="#c9a84c" strokeWidth="0.4" fill="none" />
      <path d="M122 8 C128 6, 135 8, 140 10" stroke="#c9a84c" strokeWidth="0.3" fill="none" />
      <path d="M122 16 C128 18, 135 16, 140 14" stroke="#c9a84c" strokeWidth="0.3" fill="none" />
      <path d="M150 12 C160 14, 170 10, 180 12" stroke="#c9a84c" strokeWidth="0.3" fill="none" />
      {/* Tiny end dots */}
      <circle cx="20" cy="12" r="0.8" fill="#c9a84c" opacity="0.5" />
      <circle cx="180" cy="12" r="0.8" fill="#c9a84c" opacity="0.5" />
    </svg>
  );
}

// ─── Footer Quote Rotator ───
const FOOTER_QUOTES = [
  'En el eco de cada silencio, encuentro tu voz.',
  'Lo que fue escrito en tinta de sombra, jamás se borra.',
  'Las ruinas más hermosas son las del corazón.',
  'Cada atardecer es una carta que el cielo escribe para los que aman en la oscuridad.',
  'El tiempo no cura; solo nos enseña a habitar la herida.',
];

function FooterQuoteRotator() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % FOOTER_QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-10 w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.p
          key={quoteIndex}
          className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs text-center leading-relaxed px-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          &ldquo;{FOOTER_QUOTES[quoteIndex]}&rdquo;
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer className="relative border-t border-[#2a2a2a] py-12 mt-16 pb-safe overflow-hidden">
      {/* Faint gothic diamond pattern overlay */}
      <div className="footer-pattern-overlay" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Coffin icon */}
        <div className="text-2xl mb-4 opacity-30">⚰</div>

        {/* Decorative bottom ornament — staggered fade-in symbols */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="footer-symbol-anim text-[#c9a84c] text-xs"
              style={{ animationDelay: `${i * 0.15}s` }}
              aria-hidden="true"
            >
              {i % 2 === 0 ? '✦' : '◆'}
            </span>
          ))}
        </div>

        {/* Elaborate nested top ornament: line → diamond → line → text → line → diamond → line */}
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-3 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-8 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/25" />
            <div className="absolute w-1 h-1 rotate-45 bg-[#c9a84c]/20" />
          </div>
          <div className="w-6 sm:w-10 h-px bg-[#c9a84c]/20" />
          <span className="font-[family-name:var(--font-typewriter)] text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#5a5040]">
            Finis
          </span>
          <div className="w-6 sm:w-10 h-px bg-[#c9a84c]/20" />
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/25" />
            <div className="absolute w-1 h-1 rotate-45 bg-[#c9a84c]/20" />
          </div>
          <div className="w-8 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
        </motion.div>

        {/* Filigree ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <FiligreeOrnament />
        </motion.div>

        {/* Rotating footer quote */}
        <div className="mb-6">
          <FooterQuoteRotator />
        </div>

        {/* "Made with dark devotion" text */}
        <p className="font-[family-name:var(--font-cinzel)] text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#5a5040]/60 mb-3">
          <span className="ornate-underline">Forjado con devoción oscura</span>
        </p>

        {/* Timeline Counter */}
        <p className="font-[family-name:var(--font-cinzel)] text-[8px] sm:text-[9px] tracking-wider text-[#5a5040]/40 mb-4">
          Creado el {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* Scroll back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="scroll-top-link font-[family-name:var(--font-cinzel)] text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#8a7e6b] mt-4 mb-2 cursor-pointer bg-transparent border-0"
        >
          ↑ Volver al principio ↑
        </button>

        {/* Copyright */}
        <p className="font-[family-name:var(--font-typewriter)] text-[#3a3530] text-[10px] tracking-wider">
          Ecos del Alma © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

// ─── Main App ───
// ─── Ornamental Section Transition Divider ───
function SectionTransition({ variant = 'default' }: { variant?: 'default' | 'blood' | 'moon' }) {
  return (
    <motion.div
      className="flex items-center justify-center py-6 sm:py-10"
      initial={{ opacity: 0, scaleX: 0.3 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3 sm:gap-6 w-full max-w-lg">
        {/* Left line */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/15 to-[#c9a84c]/25" />
        {/* Center ornament */}
        <div className="relative flex items-center justify-center gap-2">
          {variant === 'blood' && (
            <>
              <svg className="w-3 h-3 text-[#8B0000] opacity-40" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="2" /></svg>
              <div className="w-1.5 h-1.5 rotate-45 border border-[#8B0000]/30" />
              <svg className="w-3 h-3 text-[#8B0000] opacity-40" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0 L7.5 4.5 L12 6 L7.5 7.5 L6 12 L4.5 7.5 L0 6 L4.5 4.5Z" /></svg>
            </>
          )}
          {variant === 'moon' && (
            <>
              <span className="text-[#8a7e6b] text-[8px] opacity-40">☽</span>
              <div className="w-1 h-1 rotate-45 bg-[#c9a84c]/25" />
              <span className="text-[#c9a84c] text-[10px] opacity-50">✦</span>
              <div className="w-1 h-1 rotate-45 bg-[#c9a84c]/25" />
              <span className="text-[#8a7e6b] text-[8px] opacity-40">☾</span>
            </>
          )}
          {variant === 'default' && (
            <>
              <div className="w-px h-3 bg-[#c9a84c]/20" />
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/20" />
                <div className="absolute w-0.5 h-0.5 rotate-45 bg-[#c9a84c]/20" />
              </div>
              <div className="w-px h-3 bg-[#c9a84c]/20" />
            </>
          )}
        </div>
        {/* Right line */}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#c9a84c]/15 to-[#c9a84c]/25" />
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { user, token, isAuthenticated, isAdmin, login, logout, checkAuth } = useAuthStore();
  const { letters, photos, songs, videos, canvasPages, loading, fetchAll } = useContentStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingCanvas, setEditingCanvas] = useState<CanvasPage | null>(null);
  const [viewingCanvas, setViewingCanvas] = useState<CanvasPage | null>(null);
  const [readingLetter, setReadingLetter] = useState<Letter | null>(null);
  const [showAmbientSettings, setShowAmbientSettings] = useState(false);
  const [showAmbientSounds, setShowAmbientSounds] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setAuthChecked(true);
    };
    init();
  }, [checkAuth]);

  // Fetch content when authenticated
  useEffect(() => {
    if (token) {
      fetchAll(token);
    }
  }, [token, fetchAll]);

  const handleLogin = useCallback(async (email: string, password: string) => {
    return await login(email, password);
  }, [login]);

  const handleLogout = () => {
    logout();
    setShowAdminPanel(false);
    setEditingCanvas(null);
    setViewingCanvas(null);
  };

  // Toggle publish handlers
  const handleToggleLetterPublish = async (id: string, published: boolean) => {
    if (!token) return;
    try {
      await fetch('/api/letters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, published: !published }),
      });
      toast.success(published ? 'Carta ocultada' : 'Carta publicada');
      fetchAll(token);
    } catch { toast.error('Error'); }
  };

  const handleDeleteLetter = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/letters?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      toast.success('Carta eliminada');
      fetchAll(token);
    } catch { toast.error('Error'); }
  };

  const handleTogglePhotoPublish = async (id: string, published: boolean) => {
    if (!token) return;
    await fetch('/api/photos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, published: !published }),
    });
    fetchAll(token);
  };

  const handleToggleSongPublish = async (id: string, published: boolean) => {
    if (!token) return;
    await fetch('/api/songs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, published: !published }),
    });
    fetchAll(token);
  };

  const handleToggleVideoPublish = async (id: string, published: boolean) => {
    if (!token) return;
    await fetch('/api/videos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, published: !published }),
    });
    fetchAll(token);
  };

  // Don't render until auth is checked
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-2xl"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Ecos del Alma
        </motion.div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginOverlay onLogin={handleLogin} />
      </>
    );
  }

  const publishedLetters = letters.filter(l => l.published);
  const publishedPhotos = photos.filter(p => p.published);
  const publishedSongs = songs.filter(s => s.published);
  const publishedVideos = videos.filter(v => v.published);
  const publishedCanvasPages = canvasPages.filter(p => p.published);

  // Determine visible sections for scroll nav
  const sectionNav: SectionNavItem[] = [];
  sectionNav.push({ id: 'section-dedication', label: 'Dedicatoria' });
  sectionNav.push({ id: 'section-counter', label: 'Latidos' });
  sectionNav.push({ id: 'section-confession', label: 'Confesión' });
  if ((isAdmin ? letters : publishedLetters).length > 0) sectionNav.push({ id: 'section-letters', label: 'Cartas' });
  if ((isAdmin ? photos : publishedPhotos).length > 0) sectionNav.push({ id: 'section-photos', label: 'Fotos' });
  if ((isAdmin ? videos : publishedVideos).length > 0) sectionNav.push({ id: 'section-videos', label: 'Visiones' });
  if ((isAdmin ? songs : publishedSongs).length > 0) sectionNav.push({ id: 'section-songs', label: 'Melodías' });
  if ((isAdmin ? canvasPages : publishedCanvasPages).length > 0) sectionNav.push({ id: 'section-canvas', label: 'Lienzos' });
  sectionNav.push({ id: 'section-dreams', label: 'Sueños' });
  sectionNav.push({ id: 'section-music-box', label: 'Música' });
  sectionNav.push({ id: 'section-love-notes', label: 'Notas' });
  sectionNav.push({ id: 'section-rose-garden', label: 'Jardín' });
  sectionNav.push({ id: 'section-pact', label: 'Pacto' });
  sectionNav.push({ id: 'section-vault', label: 'Bóveda' });
  sectionNav.push({ id: 'section-lock-bridge', label: 'Candados' });
  sectionNav.push({ id: 'section-whispers', label: 'Susurros' });
  sectionNav.push({ id: 'section-moon', label: 'Lunar' });
  sectionNav.push({ id: 'section-hourglass', label: 'Reloj' });
  sectionNav.push({ id: 'section-oracle', label: 'Destino' });
  sectionNav.push({ id: 'section-tarot', label: 'Tarot' });
  sectionNav.push({ id: 'section-love-test', label: 'Test' });
  sectionNav.push({ id: 'section-timeline', label: 'Cronología' });
  sectionNav.push({ id: 'section-poem', label: 'Poesía' });
  sectionNav.push({ id: 'section-writing', label: 'Ritual' });
  sectionNav.push({ id: 'section-constellation', label: 'Estrellas' });
  sectionNav.push({ id: 'section-lanterns', label: 'Linternas' });
  sectionNav.push({ id: 'section-graveyard', label: 'Cementerio' });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4c5b0] relative">
      {/* Atmospheric overlays */}
      <div className="scanline-overlay" />
      <div className="noise-overlay" />
      <ParticleBackground />
      <GothicStarField />
      <ScrollProgressBar />

      {/* Blood drip effect */}
      <div className="blood-drip-left" />
      <div className="blood-drip-right" />

      {/* ─── Cursor Sparkle Trail ─── */}
      <CursorSparkleTrail />

      {/* ─── Background Ambient Sounds ─── */}
      <BackgroundAmbientSounds isOpen={showAmbientSounds} onClose={() => setShowAmbientSounds(false)} />

      {/* ─── Top Navigation Bar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2a2a]/50 nav-gothic-underline gothic-glass-dark">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-base sm:text-lg tracking-wider truncate">Ecos</span>
            <div className="hidden sm:block w-px h-5 bg-[#2a2a2a]" />
            <span className="hidden sm:block font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs truncate">
              Bienvenido{user?.name ? `, ${user.name}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded border border-[#2a2a2a] bg-[#111]/80 text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all text-sm font-[family-name:var(--font-cinzel)] tracking-wider uppercase cursor-pointer gothic-btn-primary"
                >
                  <Settings size={14} />
                  <span className="hidden sm:inline">Panel</span>
                </button>
                <button
                  onClick={() => setShowAmbientSettings(true)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded border border-[#2a2a2a] bg-[#111]/80 text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all text-sm cursor-pointer"
                  aria-label="Ajustes de ambiente"
                >
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">Ambiente</span>
                </button>
                <button
                  onClick={() => setShowAmbientSounds(!showAmbientSounds)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded border transition-all text-sm cursor-pointer ${
                    showAmbientSounds
                      ? 'border-[#c9a84c]/30 text-[#c9a84c] bg-[#c9a84c]/5'
                      : 'border-[#2a2a2a] bg-[#111]/80 text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30'
                  }`}
                  aria-label="Sonidos ambientales"
                >
                  <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-3 5-3 5 5 5 5 5-5 5-5 5 3 5 3"/><path d="M2 14s3-3 5-3 5 5 5 5 5-5 5-5 5 3 5 3"/></svg>
                  <span className="hidden sm:inline">Sonidos</span>
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded border border-[#2a2a2a] bg-[#111]/80 text-[#8a7e6b] hover:text-[#a00000] hover:border-[#a00000]/30 transition-all text-sm cursor-pointer gothic-btn-secondary"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Scroll Navigation Dots ─── */}
      <ScrollNavigationDots sections={sectionNav} />

      {/* ─── Scroll to Top Button ─── */}
      <ScrollToTopButton />

      {/* ─── Main Content ─── */}
      <main className="relative z-10 pt-12 sm:pt-14">
        {/* Hero */}
        <HeroSection />

        {/* Loading state — Gothic skeleton */}
        {loading && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 section-reveal">
            <div className="flex items-center gap-4">
              <div className="gothic-skeleton w-48 h-6" />
              <div className="gothic-skeleton w-2 h-2 rotate-45" />
              <div className="gothic-skeleton w-32 h-6" />
            </div>
            <div className="gothic-skeleton w-full h-48 rounded-lg" />
            <div className="flex gap-4">
              <div className="gothic-skeleton flex-1 h-32 rounded-lg" />
              <div className="gothic-skeleton flex-1 h-32 rounded-lg" />
            </div>
            <div className="gothic-skeleton w-3/4 h-24 rounded-lg" />
          </div>
        )}

        {/* ─── Dedication Section ─── */}
        <section id="section-dedication" className="max-w-2xl mx-auto px-3 sm:px-4 py-20 scroll-mt-16 section-accent-top">
          <motion.p
            className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Prólogo — Dedicatoria
          </motion.p>
          <motion.div
            className="relative paper-texture gothic-corner-frame card-border-shimmer border border-[#2a2a2a] rounded-lg p-6 sm:p-10 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Gold corner accents — top-right and bottom-left */}
            <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#c9a84c]/20 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#c9a84c]/20 rounded-bl-sm pointer-events-none" />

            {/* Heading */}
            <motion.h2
              className="font-[family-name:var(--font-cinzel-decorative)] text-2xl sm:text-3xl text-center tracking-wider text-[#c9a84c] mb-4 text-candle-flicker shimmer-text"
              data-text="Para Ti"
              style={{ textShadow: '0 0 30px rgba(201,168,76,0.15), 0 0 60px rgba(201,168,76,0.05)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Para Ti
            </motion.h2>

            {/* Decorative divider */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-[#c9a84c]/60" />
              <div className="relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rotate-45 border border-[#c9a84c]/30" />
                <div className="absolute w-1 h-1 rotate-45 bg-[#c9a84c]/25" />
              </div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent via-[#c9a84c]/40 to-[#c9a84c]/60" />
            </motion.div>

            {/* First dedication paragraph */}
            <motion.p
              className="font-[family-name:var(--font-fell)] italic text-[#d4c5b0] text-sm sm:text-base leading-relaxed text-center mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Este espacio fue creado como un refugio eterno, un lugar donde nuestros recuerdos viven para siempre, donde las palabras escritas con el corazón nunca se borran. Cada carta, cada imagen, cada nota musical que encuentres aquí fue colocada con amor, pensada para ti.
            </motion.p>

            {/* Second dedication paragraph */}
            <motion.p
              className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm leading-relaxed text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              En este laberinto de sombras y luz, tú eres la razón por la que vale la pena seguir caminando.
            </motion.p>

            {/* Signature */}
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/60 text-xs sm:text-sm tracking-widest text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              — Con amor eterno, tu Guardián
            </motion.p>
          </motion.div>
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Love Counter + Candle Section ─── */}
        <section id="section-counter" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Cronología — Latidos
            </motion.p>
            <GothicDivider text="El Tiempo de Nosotros" />
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
              Cada instante es un latido que resuena en el laberinto
            </p>
          </motion.div>
          <div className="mt-10 flex flex-col items-center gap-12">
            <LoveCounter />
            <InteractiveCandle />
          </div>
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Secret Confession Section ─── */}
        <section id="section-confession" className="max-w-2xl mx-auto px-3 sm:px-4 py-12 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Confesión Secreta
            </motion.p>
          </motion.div>
          <SecretMessage message="En el silencio más profundo del laberinto, encontré la luz que siempre busqué... eres tú, siempre has sido tú." />
        </section>

        <SectionTransition variant="default" />

        {/* ─── Letters Section ─── */}
        <section id="section-letters" className="max-w-5xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Capítulo I — Cartas
            </motion.p>
            <GothicDivider text="Cartas del Alma" />
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
              Palabras escritas con tinta de memoria y luz
            </p>
          </motion.div>
          <div className="mt-8">
            <LoveLetterArchive
              letters={(isAdmin ? letters : publishedLetters) as Letter[]}
              onRead={(id) => {
                const found = letters.find((l: Letter) => l.id === id);
                if (found) setReadingLetter(found);
              }}
            />
          </div>
        </section>

        {/* ─── Photos Section ─── */}
        {(isAdmin ? photos : publishedPhotos).length > 0 && (
          <section id="section-photos" className="max-w-6xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Capítulo II — Fragmentos
              </motion.p>
              <GothicDivider text="Fragmentos Visuales" />
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
                Ecos capturados en luz y sombra
              </p>
            </motion.div>
            <div className="mt-8">
              <PhotoGallery
                photos={(isAdmin ? photos : publishedPhotos) as Photo[]}
                isAdmin={isAdmin}
                onTogglePublish={handleTogglePhotoPublish}
              />
            </div>
          </section>
        )}

        {/* ─── Videos Section ─── */}
        {(isAdmin ? videos : publishedVideos).length > 0 && (
          <section id="section-videos" className="max-w-4xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Capítulo III — Visiones
              </motion.p>
              <GothicDivider text="Visiones" />
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
                Fantasmas en movimiento, sueños en celuloide
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {(isAdmin ? videos : publishedVideos).map((video: Video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <GothicVideoPlayer
                    video={video}
                    isAdmin={isAdmin}
                    onTogglePublish={handleToggleVideoPublish}
                    published={video.published}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Songs Section ─── */}
        {(isAdmin ? songs : publishedSongs).length > 0 && (
          <section id="section-songs" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Capítulo IV — Melodías
              </motion.p>
              <GothicDivider text="Melodías del Laberinto" />
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
                Notas que resuenan en los pasillos del recuerdo
              </p>
            </motion.div>
            <div className="space-y-4 mt-8">
              {(isAdmin ? songs : publishedSongs).map((song: Song) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <GothicAudioPlayer
                    song={song}
                    isAdmin={isAdmin}
                    onTogglePublish={handleToggleSongPublish}
                    published={song.published}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Canvas Pages Section ─── */}
        {(isAdmin ? canvasPages : publishedCanvasPages).length > 0 && (
          <section id="section-canvas" className="max-w-6xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Capítulo V — Lienzos
              </motion.p>
              <GothicDivider text="Lienzos del Recuerdo" />
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
                Páginas tejidas con hilos de nostalgia
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {(isAdmin ? canvasPages : publishedCanvasPages).map((cp: CanvasPage) => (
                <motion.div
                  key={cp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <button
                    onClick={() => isAdmin ? setEditingCanvas(cp) : setViewingCanvas(cp)}
                    className="w-full p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#8B0000]/30 transition-all duration-300 text-left card-glow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={16} className="text-[#c9a84c]" />
                        <h3 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-sm tracking-wider">
                          {cp.name}
                        </h3>
                      </div>
                      {isAdmin ? (
                        <Edit3 size={14} className="text-[#8a7e6b] group-hover:text-[#c9a84c] transition-colors" />
                      ) : (
                        <Eye size={14} className="text-[#8a7e6b] group-hover:text-[#c9a84c] transition-colors" />
                      )}
                    </div>
                    <p className="font-[family-name:var(--font-fell)] text-[#8a7e6b] text-xs">
                      {cp.elements?.length || 0} elemento{cp.elements?.length !== 1 ? 's' : ''}
                    </p>
                    {!cp.published && isAdmin && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-[#8a7e6b]">
                        <EyeOff size={10} />
                        <span className="font-[family-name:var(--font-typewriter)]">Borrador</span>
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Love Notes Section ─── */}
        <section id="section-love-notes" className="max-w-4xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <LoveNotes isAdmin={isAdmin} token={token} />
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Rose Garden Section ─── */}
        <section id="section-rose-garden" className="max-w-4xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <GothicRoseGarden />
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Blood Pact Section ─── */}
        <section id="section-pact" className="max-w-2xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <BloodPactVows />
        </section>

        <SectionTransition variant="default" />

        {/* ─── Memory Vault Section ─── */}
        <section id="section-vault" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <MemoryVault />
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Love Lock Bridge Section ─── */}
        <section id="section-lock-bridge" className="max-w-5xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <LoveLockBridge isAdmin={isAdmin} token={token} />
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Whispers Section ─── */}
        <WhisperWall isAdmin={isAdmin} token={token} />

        <SectionTransition variant="moon" />

        {/* ─── Dream Journal Section ─── */}
        <DreamJournal isAdmin={isAdmin} token={token} />

        <SectionTransition variant="moon" />

        {/* ─── Gothic Music Box Section ─── */}
        <section id="section-music-box" className="max-w-2xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <GothicMusicBox />
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Gothic Graveyard Roses Section ─── */}
        <section id="section-graveyard" className="max-w-4xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <GothicGraveyardRoses />
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Animated Hourglass Section ─── */}
        <section id="section-hourglass" className="max-w-2xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <AnimatedHourglass message="Nuestro tiempo es infinito cuando estamos juntos" />
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Moon Phase Section ─── */}
        <section id="section-moon" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Capítulo VIII — Fases
            </motion.p>
            <GothicDivider text="Fase Lunar" />
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
              La luna guarda nuestros secretos en sus sombras
            </p>
          </motion.div>
          <div className="mt-8 flex justify-center">
            <GothicMoonPhase />
          </div>
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Oracle Card Section ─── */}
        <section id="section-oracle" className="max-w-2xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Capítulo IX — Oráculo
            </motion.p>
            <GothicDivider text="Carta del Destino" />
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
              El oráculo habla a quienes se atreven a escuchar
            </p>
          </motion.div>
          <div className="mt-8 flex justify-center">
            <OracleCard />
          </div>
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Tarot Reading Section ─── */}
        <section id="section-tarot" className="max-w-4xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Capítulo X — Tarot
            </motion.p>
            <GothicDivider text="Lectura del Destino" />
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
              Las cartas revelan lo que el alma ya sabe
            </p>
          </motion.div>
          <div className="mt-8 flex justify-center">
            <GothicTarotReading />
          </div>
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Love Test Questionnaire Section ─── */}
        <section id="section-love-test" className="max-w-2xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <LoveTestQuestionnaire />
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Memory Timeline Section ─── */}
        <section id="section-timeline" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Capítulo V — Crónica
            </motion.p>
            <GothicDivider text="Momentos del Laberinto" />
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
              Cada instante compartido es una estrella en nuestra constelación
            </p>
          </motion.div>
          <div className="mt-8">
            <MemoryTimeline isAdmin={isAdmin} token={token} />
          </div>
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Love Poem Generator Section ─── */}
        <section id="section-poem" className="max-w-3xl mx-auto px-3 sm:px-4 py-12 scroll-mt-16 section-accent-top">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Capítulo VI — Versos
            </motion.p>
            <GothicDivider text="Poesía del Alma" />
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
              Versos nacidos de los ecos de nuestro laberinto
            </p>
          </motion.div>
          <LovePoemGenerator />
        </section>

        <SectionTransition variant="blood" />

        {/* ─── Writing Ritual Section ─── */}
        <section id="section-writing" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <WritingRitual />
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Gothic Constellation Map Section ─── */}
        <section id="section-constellation" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <GothicConstellationMap />
        </section>

        <SectionTransition variant="moon" />

        {/* ─── Wish Lanterns Section ─── */}
        <section id="section-lanterns" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
          <GothicWishLantern />
        </section>

        {/* ─── Empty State ─── */}
        {!loading && publishedLetters.length === 0 && publishedPhotos.length === 0 && publishedSongs.length === 0 && publishedVideos.length === 0 && publishedCanvasPages.length === 0 && (
          <section className="max-w-4xl mx-auto px-4 py-24 text-center section-reveal delay-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="text-5xl mb-6 opacity-20">🌙</div>
              <h2 className="font-[family-name:var(--font-cinzel-decorative)] text-[#8a7e6b] text-2xl mb-4 tracking-wider">
                El laberinto espera
              </h2>
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] max-w-md mx-auto">
                Aún no hay ecos en este espacio. Pronto las memorias aparecerán aquí, como susurros en la oscuridad.
              </p>
            </motion.div>
          </section>
        )}

        {/* Footer */}
        <Footer />
      </main>

      {/* ─── Floating Music Player ─── */}
      {publishedSongs.length > 0 && (
        <FloatingMusicPlayer songs={publishedSongs} />
      )}

      {/* ─── Admin Panel ─── */}
      <AnimatePresence>
        {showAdminPanel && token && (
          <AdminPanel
            token={token}
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
            onRefresh={() => fetchAll(token)}
            photos={isAdmin ? photos : []}
            songs={isAdmin ? songs : []}
            videos={isAdmin ? videos : []}
            canvasPages={isAdmin ? canvasPages : []}
          />
        )}
      </AnimatePresence>

      {/* ─── Canvas Editor (Admin) ─── */}
      <AnimatePresence>
        {editingCanvas && token && (
          <CanvasEditor
            page={editingCanvas}
            token={token}
            onSave={(updatedPage) => {
              setEditingCanvas(null);
              fetchAll(token);
            }}
            onClose={() => setEditingCanvas(null)}
            allPhotos={photos}
            allLetters={letters}
            allVideos={videos}
            allSongs={songs}
          />
        )}
      </AnimatePresence>

      {/* ─── Canvas Viewer (Viewer) ─── */}
      <AnimatePresence>
        {viewingCanvas && (
          <CanvasViewer
            page={viewingCanvas}
            allPhotos={photos}
            allLetters={letters}
            allVideos={videos}
            allSongs={songs}
          />
        )}
      </AnimatePresence>

      {/* ─── Letter Reader Modal ─── */}
      <LetterReaderModal
        letter={readingLetter}
        isOpen={readingLetter !== null}
        onClose={() => setReadingLetter(null)}
      />
    </div>
  );
}
