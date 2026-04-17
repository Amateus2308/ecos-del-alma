'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface LoveTestQuestionnaireProps {
  className?: string;
}

type ResultKey = 'amorOscuro' | 'romanceEterno' | 'pasionProhibida' | 'destinoEntrelazado';

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Record<ResultKey, number>;
  }[];
}

interface Result {
  key: ResultKey;
  title: string;
  description: string;
}

// ─── Quiz Data ───
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: '\u00bfQu\u00e9 elemento define tu amor?',
    options: [
      { label: 'Fuego', scores: { amorOscuro: 3, romanceEterno: 0, pasionProhibida: 2, destinoEntrelazado: 0 } },
      { label: 'Tierra', scores: { amorOscuro: 0, romanceEterno: 3, pasionProhibida: 0, destinoEntrelazado: 2 } },
      { label: 'Aire', scores: { amorOscuro: 1, romanceEterno: 1, pasionProhibida: 1, destinoEntrelazado: 2 } },
      { label: 'Agua', scores: { amorOscuro: 2, romanceEterno: 2, pasionProhibida: 1, destinoEntrelazado: 0 } },
    ],
  },
  {
    id: 2,
    text: '\u00bfCu\u00e1l es tu mayor miedo en el amor?',
    options: [
      { label: 'Olvidar', scores: { amorOscuro: 3, romanceEterno: 2, pasionProhibida: 0, destinoEntrelazado: 1 } },
      { label: 'Ser olvidado', scores: { amorOscuro: 2, romanceEterno: 3, pasionProhibida: 1, destinoEntrelazado: 0 } },
      { label: 'No amar', scores: { amorOscuro: 0, romanceEterno: 1, pasionProhibida: 3, destinoEntrelazado: 1 } },
      { label: 'Nunca encontrar', scores: { amorOscuro: 1, romanceEterno: 0, pasionProhibida: 2, destinoEntrelazado: 3 } },
    ],
  },
  {
    id: 3,
    text: '\u00bfQu\u00e9 lugar te inspira?',
    options: [
      { label: 'Cementerio', scores: { amorOscuro: 3, romanceEterno: 1, pasionProhibida: 2, destinoEntrelazado: 0 } },
      { label: 'Biblioteca', scores: { amorOscuro: 1, romanceEterno: 3, pasionProhibida: 0, destinoEntrelazado: 2 } },
      { label: 'Catedral', scores: { amorOscuro: 0, romanceEterno: 2, pasionProhibida: 3, destinoEntrelazado: 1 } },
      { label: 'Bosque', scores: { amorOscuro: 2, romanceEterno: 0, pasionProhibida: 1, destinoEntrelazado: 3 } },
    ],
  },
  {
    id: 4,
    text: '\u00bfQu\u00e9 sonido te calma?',
    options: [
      { label: 'Lluvia', scores: { amorOscuro: 2, romanceEterno: 3, pasionProhibida: 0, destinoEntrelazado: 1 } },
      { label: 'Campanas', scores: { amorOscuro: 0, romanceEterno: 2, pasionProhibida: 3, destinoEntrelazado: 1 } },
      { label: 'Silencio', scores: { amorOscuro: 3, romanceEterno: 1, pasionProhibida: 1, destinoEntrelazado: 0 } },
      { label: 'Viento', scores: { amorOscuro: 1, romanceEterno: 0, pasionProhibida: 2, destinoEntrelazado: 3 } },
    ],
  },
  {
    id: 5,
    text: '\u00bfQu\u00e9 sentir\u00edas al ver una rosa negra?',
    options: [
      { label: 'Admiraci\u00f3n', scores: { amorOscuro: 3, romanceEterno: 0, pasionProhibida: 2, destinoEntrelazado: 1 } },
      { label: 'Melancol\u00eda', scores: { amorOscuro: 2, romanceEterno: 3, pasionProhibida: 0, destinoEntrelazado: 1 } },
      { label: 'Amor', scores: { amorOscuro: 0, romanceEterno: 2, pasionProhibida: 1, destinoEntrelazado: 3 } },
      { label: 'Poder', scores: { amorOscuro: 1, romanceEterno: 0, pasionProhibida: 3, destinoEntrelazado: 2 } },
    ],
  },
];

const RESULTS: Result[] = [
  {
    key: 'amorOscuro',
    title: 'Amor Oscuro',
    description:
      'Tu alma est\u00e1 tejida con hilos de sombra y luna. El amor que buscas no conoce la luz del d\u00eda \u2014 prospera en los rincones m\u00e1s profundos del coraz\u00f3n, donde los secretos se susurran eternamente. Eres quien ama con la intensidad de un eclipse, consumidor e infinito.',
  },
  {
    key: 'romanceEterno',
    title: 'Romance Eterno',
    description:
      'Tu coraz\u00f3n late al ritmo de los siglos. Crees en un amor que trasciende el tiempo, un v\u00ednculo escrito con tinta de estrella que ninguna muerte podr\u00e1 borrar. Tu romance es una catedral de sentimientos: majestuoso, permanente y sagrado.',
  },
  {
    key: 'pasionProhibida',
    title: 'Pasi\u00f3n Prohibida',
    description:
      'El fuego que arde en tu interior no conoce l\u00edmites ni convenciones. Tu amor es rebelde, salvaje, como una tormenta que rompe las cadenas del destino. En la prohibici\u00f3n encuentras tu mayor poder y tu m\u00e1s dulce tentaci\u00f3n.',
  },
  {
    key: 'destinoEntrelazado',
    title: 'Destino Entrelazado',
    description:
      'Tus caminos est\u00e1n unidos por hilos invisibles que atraviesan dimensiones. Cada encuentro es un retorno, cada adi\u00f3s un reencuentro prometido. El universo conspir\u00f3 para que tus almas se reconocieran entre la multitud de existencias.',
  },
];

// ─── Result SVG Icons ───
function ResultIcon({ resultKey }: { resultKey: ResultKey }) {
  const s = 72;
  const g = '#c9a84c';
  const go = 'rgba(201,168,76,0.12)';

  switch (resultKey) {
    case 'amorOscuro':
      return (
        <svg width={s} height={s} viewBox="0 0 72 72" fill="none" className="ornate-icon" aria-hidden="true">
          {/* Dark heart with eclipse */}
          <path
            d="M36 62C36 62 10 46 10 26C10 16 18 8 28 8C32 8 36 11 36 11C36 11 40 8 44 8C54 8 62 16 62 26C62 46 36 62 36 62Z"
            stroke={g}
            strokeWidth="1.2"
            fill={go}
          />
          {/* Inner cracked heart */}
          <path
            d="M36 54C36 54 18 42 18 28C18 20 24 14 31 14C34 14 36 16 36 16C36 16 38 14 41 14C48 14 54 20 54 28C54 42 36 54 36 54Z"
            stroke={g}
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          {/* Crack line */}
          <path d="M36 16L32 28L36 36L40 48" stroke={g} strokeWidth="0.6" fill="none" opacity="0.3" />
          {/* Crescent moon overlay */}
          <path
            d="M46 14C46 14 40 18 40 28C40 38 46 42 46 42C46 42 34 38 34 28C34 18 46 14 46 14Z"
            stroke={g}
            strokeWidth="0.6"
            fill="rgba(201,168,76,0.08)"
            opacity="0.5"
          />
        </svg>
      );
    case 'romanceEterno':
      return (
        <svg width={s} height={s} viewBox="0 0 72 72" fill="none" className="ornate-icon" aria-hidden="true">
          {/* Infinity heart */}
          <path
            d="M20 36C20 36 8 24 8 16C8 10 12 6 18 6C24 6 28 12 28 16C28 12 32 6 38 6C44 6 48 10 48 16C48 24 36 36 36 36"
            stroke={g}
            strokeWidth="1.2"
            fill={go}
          />
          <path
            d="M52 36C52 36 64 48 64 56C64 62 60 66 54 66C48 66 44 60 44 56C44 60 40 66 34 66C28 66 24 62 24 56C24 48 36 36 36 36"
            stroke={g}
            strokeWidth="1.2"
            fill={go}
          />
          {/* Eternity ring */}
          <ellipse cx="36" cy="36" rx="28" ry="14" stroke={g} strokeWidth="0.4" fill="none" opacity="0.2" transform="rotate(15 36 36)" />
          {/* Center spark */}
          <circle cx="36" cy="36" r="2" fill={g} opacity="0.5" />
        </svg>
      );
    case 'pasionProhibida':
      return (
        <svg width={s} height={s} viewBox="0 0 72 72" fill="none" className="ornate-icon" aria-hidden="true">
          {/* Flame heart */}
          <path
            d="M36 8C36 8 18 28 18 42C18 52 26 62 36 66C46 62 54 52 54 42C54 28 36 8 36 8Z"
            stroke={g}
            strokeWidth="1.2"
            fill={go}
          />
          {/* Inner flame */}
          <path
            d="M36 22C36 22 26 34 26 42C26 48 30 54 36 56C42 54 46 48 46 42C46 34 36 22 36 22Z"
            stroke={g}
            strokeWidth="0.6"
            fill="rgba(201,168,76,0.06)"
          />
          {/* Chain breaking symbol */}
          <line x1="28" y1="44" x2="44" y2="44" stroke={g} strokeWidth="1" opacity="0.4" />
          <path d="M28 44L22 40L24 44L22 48Z" stroke={g} strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M44 44L50 40L48 44L50 48Z" stroke={g} strokeWidth="0.5" fill="none" opacity="0.3" />
          {/* Core glow */}
          <circle cx="36" cy="40" r="3" fill="rgba(139,0,0,0.3)" stroke={g} strokeWidth="0.4" />
        </svg>
      );
    case 'destinoEntrelazado':
      return (
        <svg width={s} height={s} viewBox="0 0 72 72" fill="none" className="ornate-icon" aria-hidden="true">
          {/* DNA/fate strands */}
          <path d="M24 8C24 8 48 20 48 36C48 52 24 64 24 64" stroke={g} strokeWidth="1.2" fill="none" />
          <path d="M48 8C48 8 24 20 24 36C24 52 48 64 48 64" stroke={g} strokeWidth="1.2" fill="none" />
          {/* Connecting rungs */}
          <line x1="28" y1="16" x2="44" y2="16" stroke={g} strokeWidth="0.5" opacity="0.3" />
          <line x1="30" y1="26" x2="42" y2="26" stroke={g} strokeWidth="0.5" opacity="0.3" />
          <line x1="36" y1="36" x2="36" y2="36" stroke={g} strokeWidth="1.5" opacity="0.5" />
          <line x1="30" y1="46" x2="42" y2="46" stroke={g} strokeWidth="0.5" opacity="0.3" />
          <line x1="28" y1="56" x2="44" y2="56" stroke={g} strokeWidth="0.5" opacity="0.3" />
          {/* Center heart knot */}
          <path
            d="M36 32C36 32 30 36 30 40C30 44 36 48 36 48C36 48 42 44 42 40C42 36 36 32 36 32Z"
            stroke={g}
            strokeWidth="0.8"
            fill={go}
          />
          {/* Star at top */}
          <circle cx="36" cy="8" r="1.5" fill={g} opacity="0.4" />
          {/* Star at bottom */}
          <circle cx="36" cy="64" r="1.5" fill={g} opacity="0.4" />
        </svg>
      );
  }
}

// ─── Ornamental Divider ───
function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
      <div className="flex items-center gap-1.5">
        <span className="text-[#c9a84c]/25 text-[8px] select-none">&#9670;</span>
        <span className="text-[#c9a84c]/40 text-[10px] select-none">&#10022;</span>
        <span className="text-[#c9a84c]/25 text-[8px] select-none">&#9670;</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
    </div>
  );
}

// ─── Gold Particle Burst ───
function ParticleMaterialize({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.6,
        duration: 0.8 + Math.random() * 0.6,
        startX: (Math.random() - 0.5) * 200,
        startY: (Math.random() - 0.5) * 160,
        size: 1.5 + Math.random() * 3,
        color: Math.random() > 0.35 ? '#c9a84c' : '#8B0000',
      })),
    [],
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-20" aria-hidden="true">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}`,
              }}
              initial={{
                x: p.startX,
                y: p.startY,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Typewriter Text ───
function TypewriterText({
  text,
  onComplete,
  speed = 28,
}: {
  text: string;
  onComplete: () => void;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayed(text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setDone(true);
        onCompleteRef.current();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p
      className="font-[family-name:var(--font-fell)] italic text-[#c4b59a] text-sm sm:text-base leading-[1.9] tracking-[0.02em] relative z-10 min-h-[4rem]"
      style={{ textShadow: '0 0 1px rgba(139, 0, 0, 0.1)' }}
    >
      {displayed}
      {!done && (
        <motion.span
          className="inline-block w-[2px] h-4 bg-[#c9a84c] ml-[1px] align-text-bottom"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'steps(2)' }}
        />
      )}
    </p>
  );
}

// ─── Progress Dots ───
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={`Pregunta ${current} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          initial={false}
          animate={{
            width: i < current ? 10 : 8,
            height: i < current ? 10 : 8,
            backgroundColor: i < current ? '#c9a84c' : 'rgba(42,42,42,0.8)',
            boxShadow: i < current ? '0 0 8px rgba(201,168,76,0.4)' : 'none',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── SVG Decorative Divider ───
function GothicSvgDivider() {
  return (
    <svg width="100%" height="20" viewBox="0 0 300 20" preserveAspectRatio="xMidYMid meet" className="my-2" aria-hidden="true">
      <line x1="0" y1="10" x2="120" y2="10" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
      <line x1="180" y1="10" x2="300" y2="10" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
      <path d="M130 10L140 5L150 10L160 5L170 10" stroke="rgba(201,168,76,0.3)" strokeWidth="0.6" fill="none" />
      <circle cx="150" cy="10" r="1.5" fill="rgba(201,168,76,0.25)" />
    </svg>
  );
}

// ─── Main Component ───
export default function LoveTestQuestionnaire({ className = '' }: LoveTestQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<ResultKey, number>>({
    amorOscuro: 0,
    romanceEterno: 0,
    pasionProhibida: 0,
    destinoEntrelazado: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');

  const question = QUESTIONS[currentQuestion];

  // Calculate result from scores
  const calculateResult = useCallback(
    (finalScores: Record<ResultKey, number>): Result => {
      const sorted = (Object.entries(finalScores) as [ResultKey, number][]).sort(
        (a, b) => b[1] - a[1],
      );
      const topKey = sorted[0][0];
      return RESULTS.find((r) => r.key === topKey) ?? RESULTS[0];
    },
    [],
  );

  const handleStart = useCallback(() => {
    setPhase('quiz');
  }, []);

  const handleSelectAnswer = useCallback(
    (optionIndex: number) => {
      if (showResult || selectedOption !== null) return;
      setSelectedOption(optionIndex);
    },
    [showResult, selectedOption],
  );

  const handleNext = useCallback(() => {
    if (selectedOption === null) return;

    // Accumulate scores
    const optionScores = question.options[selectedOption].scores;
    setScores((prev) => {
      const updated = { ...prev };
      (Object.keys(optionScores) as ResultKey[]).forEach((key) => {
        updated[key] += optionScores[key];
      });
      return updated;
    });

    if (currentQuestion < QUESTIONS.length - 1) {
      setDirection(1);
      setSelectedOption(null);
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Compute and show result
      const optionScoresNow = question.options[selectedOption].scores;
      const finalScores = { ...scores };
      (Object.keys(optionScoresNow) as ResultKey[]).forEach((key) => {
        finalScores[key] += optionScoresNow[key];
      });
      const computed = calculateResult(finalScores);
      setResult(computed);
      setShowParticles(true);
      setPhase('result');
      setShowResult(true);
      setTypewriterComplete(false);

      setTimeout(() => {
        setShowParticles(false);
      }, 1400);
    }
  }, [selectedOption, question, currentQuestion, scores, calculateResult]);

  const handleRestart = useCallback(() => {
    setDirection(1);
    setCurrentQuestion(0);
    setScores({
      amorOscuro: 0,
      romanceEterno: 0,
      pasionProhibida: 0,
      destinoEntrelazado: 0,
    });
    setShowResult(false);
    setSelectedOption(null);
    setResult(null);
    setTypewriterComplete(false);
    setPhase('intro');
  }, []);

  // Question transition variants
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0 }),
  };

  return (
    <section
      className={`relative w-full max-w-lg sm:max-w-xl mx-auto my-8 sm:my-12 px-4 ${className}`}
      aria-label="Or\u00e1culo del Amor - Cuestionario"
    >
      {/* ─── Intro Screen ─── */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative paper-texture border border-[#c9a84c]/15 rounded-xl p-6 sm:p-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)]">
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-l-2 border-[#c9a84c]/25 rounded-tl-lg pointer-events-none" aria-hidden="true" />
              <div className="absolute top-0 right-0 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-r-2 border-[#c9a84c]/25 rounded-tr-lg pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-l-2 border-[#c9a84c]/25 rounded-bl-lg pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-r-2 border-[#c9a84c]/25 rounded-br-lg pointer-events-none" aria-hidden="true" />

              {/* Inner border */}
              <div className="absolute inset-[2px] rounded-[10px] border border-[#c9a84c]/5 pointer-events-none" />

              <div className="relative z-10 text-center">
                {/* Eye of providence icon */}
                <motion.div
                  className="flex justify-center mb-4"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="ornate-icon" aria-hidden="true">
                    <path d="M4 24C4 24 14 8 24 8C34 8 44 24 44 24C44 24 34 40 24 40C14 40 4 24 4 24Z" stroke="#c9a84c" strokeWidth="1" fill="none" />
                    <circle cx="24" cy="24" r="8" stroke="#c9a84c" strokeWidth="0.8" fill="rgba(201,168,76,0.06)" />
                    <circle cx="24" cy="24" r="3" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="0.5" />
                    <circle cx="24" cy="24" r="1" fill="#c9a84c" opacity="0.5" />
                  </svg>
                </motion.div>

                <h2 className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-xl sm:text-2xl tracking-[0.1em] mb-2" style={{ textShadow: '0 0 15px rgba(201,168,76,0.3)' }}>
                  Or&aacute;culo del Amor
                </h2>

                <OrnamentalDivider />

                <p className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base leading-relaxed mb-6">
                  Cinco preguntas revelar&aacute;n la verdadera naturaleza de tu amor.
                  <br />
                  Responde con el coraz&oacute;n, no con la raz&oacute;n.
                </p>

                <GothicSvgDivider />

                <button
                  onClick={handleStart}
                  className="gothic-btn font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs sm:text-sm uppercase tracking-[0.2em] border border-[#c9a84c]/20 rounded-lg px-8 py-3 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all duration-300 btn-press"
                  aria-label="Comenzar el cuestionario del or&aacute;culo"
                >
                  Consultar el Or&aacute;culo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Quiz Screen ─── */}
      <AnimatePresence mode="wait">
        {phase === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="relative paper-texture border border-[#c9a84c]/15 rounded-xl p-5 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)]">
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-l-2 border-[#c9a84c]/25 rounded-tl-lg pointer-events-none" aria-hidden="true" />
              <div className="absolute top-0 right-0 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-r-2 border-[#c9a84c]/25 rounded-tr-lg pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-l-2 border-[#c9a84c]/25 rounded-bl-lg pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-r-2 border-[#c9a84c]/25 rounded-br-lg pointer-events-none" aria-hidden="true" />

              {/* Inner border */}
              <div className="absolute inset-[2px] rounded-[10px] border border-[#c9a84c]/5 pointer-events-none" />

              <div className="relative z-10">
                {/* Progress dots */}
                <ProgressDots current={currentQuestion} total={QUESTIONS.length} />

                {/* Question */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={question.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {/* Question number */}
                    <p className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-[10px] sm:text-xs tracking-[0.3em] uppercase text-center mb-2 opacity-60">
                      Pregunta {question.id}
                    </p>

                    <h3 className="font-[family-name:var(--font-cinzel)] text-[#d4c5b0] text-base sm:text-lg text-center leading-snug mb-5 tracking-wide">
                      {question.text}
                    </h3>

                    <GothicSvgDivider />

                    {/* Answer options */}
                    <div className="grid grid-cols-2 gap-3 mt-4" role="radiogroup" aria-label={`Opciones para: ${question.text}`}>
                      {question.options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        return (
                          <motion.button
                            key={option.label}
                            onClick={() => handleSelectAnswer(idx)}
                            className={`
                              relative p-3 sm:p-4 rounded-lg border text-center cursor-pointer
                              transition-all duration-300 btn-press outline-none
                              font-[family-name:var(--font-fell)] italic text-sm sm:text-base
                              ${
                                isSelected
                                  ? 'border-[#8B0000]/60 bg-[#8B0000]/10 text-[#d4c5b0] shadow-[0_0_20px_rgba(139,0,0,0.15)]'
                                  : 'border-[#2a2a2a] bg-[#1a1611]/60 text-[#8a7e6b] hover:border-[#c9a84c]/30 hover:bg-[#c9a84c]/5 hover:text-[#d4c5b0] focus-visible:border-[#c9a84c]/50'
                              }
                            `}
                            whileHover={!isSelected ? { scale: 1.02, y: -1 } : {}}
                            whileTap={{ scale: 0.97 }}
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={option.label}
                          >
                            {/* Paper texture inner */}
                            <span className="relative z-10">{option.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Next / Continue button */}
                    <div className="mt-5 flex justify-center">
                      <motion.button
                        onClick={handleNext}
                        disabled={selectedOption === null}
                        className={`
                          gothic-btn font-[family-name:var(--font-cinzel)] text-xs sm:text-sm uppercase tracking-[0.2em]
                          rounded-lg px-6 py-2.5 border transition-all duration-300 btn-press
                          ${
                            selectedOption !== null
                              ? 'border-[#c9a84c]/30 text-[#c9a84c] hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/5 cursor-pointer'
                              : 'border-[#2a2a2a] text-[#2a2a2a]/50 cursor-not-allowed'
                          }
                        `}
                        whileHover={selectedOption !== null ? { scale: 1.03 } : {}}
                        whileTap={selectedOption !== null ? { scale: 0.97 } : {}}
                        aria-label={
                          currentQuestion < QUESTIONS.length - 1
                            ? 'Siguiente pregunta'
                            : 'Revelar resultado'
                        }
                      >
                        {currentQuestion < QUESTIONS.length - 1 ? 'Siguiente' : 'Revelar'}
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Result Screen ─── */}
      <AnimatePresence mode="wait">
        {phase === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative paper-texture border border-[#c9a84c]/20 rounded-xl p-6 sm:p-10 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
              {/* Particle materialization effect */}
              <ParticleMaterialize active={showParticles} />

              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-[#c9a84c]/30 rounded-tl-lg pointer-events-none z-10" aria-hidden="true" />
              <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-[#c9a84c]/30 rounded-tr-lg pointer-events-none z-10" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-[#c9a84c]/30 rounded-bl-lg pointer-events-none z-10" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-[#c9a84c]/30 rounded-br-lg pointer-events-none z-10" aria-hidden="true" />

              {/* Inner border */}
              <div className="absolute inset-[2px] rounded-[10px] border border-[#c9a84c]/8 pointer-events-none" />

              {/* Pulsing glow on result card */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(201,168,76,0.05), inset 0 0 30px rgba(139,0,0,0.03)',
                    '0 0 40px rgba(201,168,76,0.12), inset 0 0 50px rgba(139,0,0,0.06)',
                    '0 0 20px rgba(201,168,76,0.05), inset 0 0 30px rgba(139,0,0,0.03)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10 text-center">
                {/* Subtitle */}
                <motion.p
                  className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  El or&aacute;culo revela
                </motion.p>

                {/* Result icon */}
                <motion.div
                  className="flex justify-center mb-4"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                >
                  <ResultIcon resultKey={result.key} />
                </motion.div>

                {/* Result title */}
                <motion.h2
                  className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-xl sm:text-2xl tracking-[0.08em] mb-3"
                  style={{ textShadow: '0 0 20px rgba(201,168,76,0.35), 0 0 40px rgba(201,168,76,0.1)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {result.title}
                </motion.h2>

                <OrnamentalDivider />

                {/* Typewriter description */}
                <motion.div
                  className="mt-4 mb-6 min-h-[5rem] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  <TypewriterText
                    text={result.description}
                    onComplete={() => setTypewriterComplete(true)}
                    speed={30}
                  />
                </motion.div>

                <GothicSvgDivider />

                {/* Restart button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: typewriterComplete ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    onClick={handleRestart}
                    className="gothic-btn font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8a7e6b] hover:text-[#c9a84c] transition-colors duration-300 cursor-pointer py-2 px-4 border border-transparent hover:border-[#c9a84c]/15 rounded-lg btn-press"
                    aria-label="Repetir el or&aacute;culo"
                  >
                    Repetir el Or&aacute;culo
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
