'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface GothicTarotReadingProps {
  className?: string;
}

type CardPosition = 0 | 1 | 2;
type PositionLabel = 'Pasado' | 'Presente' | 'Futuro';
type CardState = 'face-down' | 'revealing' | 'revealed';

interface TarotCard {
  id: string;
  name: string;
  reading: string;
  keywords: string;
}

// ─── 15 unique tarot card archetypes ───
const TAROT_DECK: TarotCard[] = [
  {
    id: 'cupido',
    name: 'Cupido',
    reading: 'El arc\u00e1ngel del amor despierta en tu interior una flecha que fue disparada hace mucho tiempo. Su vuelo atraviesa el laberinto del destino para encontrar tu coraz\u00f3n. Lo que cre\u00edas perdido renace con fuerza inquebrantable.',
    keywords: 'Amor \u00b7 Deseo \u00b7 Conexi\u00f3n',
  },
  {
    id: 'luna',
    name: 'La Luna',
    reading: 'La luna creciente ilumina los senderos ocultos de tu alma. Sus reflejos plateados revelan verdades que el sol no puede mostrar. Conf\u00eda en las sombras, pues all\u00ed habitan los secretos m\u00e1s antiguos.',
    keywords: 'Misterio \u00b7 Intuici\u00f3n \u00b7 Sue\u00f1os',
  },
  {
    id: 'laberinto',
    name: 'El Laberinto',
    reading: 'Cada giro del laberinto te acerca m\u00e1s al centro, donde espera la verdad que buscas. No temas perderte \u2014 los caminos sin salida son lecciones disfrazadas. El hilo de oro siempre te guiar\u00e1 de regreso.',
    keywords: 'Destino \u00b7 Camino \u00b7 Superaci\u00f3n',
  },
  {
    id: 'sombras',
    name: 'Las Sombras',
    reading: 'Las sombras que te acompa\u00f1an no son enemigas, sino guardianas de recuerdos enterrados. Al abrazarlas, descubres la luz que ocultan en su interior. La oscuridad m\u00e1s profunda precede al amanecer m\u00e1s espl\u00e9ndido.',
    keywords: 'Transformaci\u00f3n \u00b7 Verdad \u00b7 Descubrimiento',
  },
  {
    id: 'corazon',
    name: 'El Coraz\u00f3n',
    reading: 'Tu coraz\u00f3n es una catedral g\u00f3tica donde resuena un eco que nunca se apaga. Cada latido es una oraci\u00f3n, cada suspiro un c\u00e1ntico ancestral. El amor que albergas es m\u00e1s antiguo que las estrellas mismas.',
    keywords: 'Amor \u00b7 Devoci\u00f3n \u00b7 Eternidad',
  },
  {
    id: 'espejo',
    name: 'El Espejo',
    reading: 'El espejo refleja no lo que eres, sino lo que ser\u00e1s cuando te atrevas a mirar sin miedo. La imagen que ves es solo el principio de un viaje hacia tu verdadero ser. Rompe el cristal si es necesario \u2014 los fragmentos muestran caras nuevas.',
    keywords: 'Reflexi\u00f3n \u00b7 Identidad \u00b7 Verdad',
  },
  {
    id: 'estrella',
    name: 'La Estrella',
    reading: 'Una estrella ca\u00edda a tus pies no es se\u00f1al de desastre, sino de regalo c\u00f3smico. Recoge su luz y gu\u00e1rdala en el pecho \u2014 te iluminar\u00e1 en las noches m\u00e1s oscuras. El universo conspira a tu favor.',
    keywords: 'Esperanza \u00b7 Gu\u00eda \u00b7 Destello',
  },
  {
    id: 'fuego',
    name: 'El Fuego',
    reading: 'Las llamas que arden en tu interior no son destrucci\u00f3n, sino purificaci\u00f3n. Lo viejo debe quemarse para que lo nuevo pueda nacer de las cenizas. Tu pasi\u00f3n es la forja donde se crea tu destino.',
    keywords: 'Pasi\u00f3n \u00b7 Transformaci\u00f3n \u00b7 Poder',
  },
  {
    id: 'tierra',
    name: 'La Tierra',
    reading: 'Las ra\u00edces que no puedes ver son las que m\u00e1s te sostienen. La tierra beneath tus pies guarda la memoria de mil generaciones. Est\u00e1s conectado a algo m\u00e1s grande que tu propia existencia.',
    keywords: 'Estabilidad \u00b7 Conexi\u00f3n \u00b7 Fundaci\u00f3n',
  },
  {
    id: 'agua',
    name: 'El Agua',
    reading: 'El agua no lucha contra los obst\u00e1culos, los rodea con paciencia infinita. As\u00ed debe ser tu esp\u00edritu: fluido, adaptable, inquebrantable. Las l\u00e1grimas que derramas fertilizan el jard\u00edn de tu futuro.',
    keywords: 'Emoci\u00f3n \u00b7 Adaptaci\u00f3n \u00b7 Sanaci\u00f3n',
  },
  {
    id: 'viento',
    name: 'El Viento',
    reading: 'El viento trae mensajes de tierras lejanas y tiempos olvidados. Escucha su susurro \u2014 lleva las palabras que necesitas o\u00edr. No intentes atraparlo: su libertad es su mayor ense\u00f1anza.',
    keywords: 'Libertad \u00b7 Mensaje \u00b7 Cambio',
  },
  {
    id: 'espiritu',
    name: 'El Esp\u00edritu',
    reading: 'M\u00e1s all\u00e1 del velo material, tu esp\u00edritu danza en un reino de luz eterna. Cada elecci\u00f3n que haces resuena en dimensiones que a\u00fan no puedes percibir. Eres infinito, eres eterno, eres sagrado.',
    keywords: 'Trascendencia \u00b7 Sabidur\u00eda \u00b7 Paz',
  },
  {
    id: 'rosa',
    name: 'La Rosa Negra',
    reading: 'La rosa m\u00e1s hermosa crece entre las ruinas de lo que fue. Sus espinas protegen un secreto que solo el amor verdadero puede desentra\u00f1ar. En cada p\u00e9talo negro se esconde una gota de roc\u00edo lunar.',
    keywords: 'Belleza \u00b7 Misterio \u00b7 Renacimiento',
  },
  {
    id: 'reloj',
    name: 'El Reloj',
    reading: 'El tiempo no es una l\u00ednea recta sino un c\u00edrculo sagrado. Lo que fue volver\u00e1, lo que ser\u00e1 ya fue. Las manecillas marcan no horas, sino oportunidades de reescribir tu historia eterna.',
    keywords: 'Ciclo \u00b7 Oportunidad \u00b7 Eternidad',
  },
  {
    id: 'cuervo',
    name: 'El Cuervo',
    reading: 'El cuervo observa desde las torres olvidadas, guardi\u00e1n de secretos ancestrales. Su canto no es presagio de muerte, sino de transformaci\u00f3n. Cuando el cuervo vuele hacia ti, abre las manos y recibe su mensaje.',
    keywords: 'Mensaje \u00b7 Vigilancia \u00b7 Magia',
  },
];

// ─── Position labels ───
const POSITION_LABELS: PositionLabel[] = ['Pasado', 'Presente', 'Futuro'];

// ─── Combined interpretations ───
function generateInterpretation(cards: TarotCard[]): string {
  const [past, present, future] = cards;
  return `El hilo del destino teje una historia entre tres mundos. En tu Pasado, ${past.name} revela que las experiencias vividas dejaron una marca indeleble \u2014 un legado de ${past.keywords.toLowerCase()} que yace en los cimientos de tu ser. En el Presente, ${present.name} domina tu horizonte con su energ\u00eda de ${present.keywords.toLowerCase()}, indicando que el momento actual es un punto de inflexi\u00f3n sagrado. Y hacia el Futuro, ${future.name} aguarda en las sombras con su promesa de ${future.keywords.toLowerCase()}, se\u00f1alando que lo que est\u00e1 por venir transformar\u00e1 todo lo que crees conocer. Las tres cartas conspiran juntas: tu pasado no te define, tu presente no te limita, y tu futuro no est\u00e1 escrito en piedra \u2014 est\u00e1 escrito en tu coraz\u00f3n.`;
}

// ─── Card Archetype SVG Icons ───
function CardArchetypeIcon({ cardId }: { cardId: string }) {
  const s = 64;
  const g = '#c9a84c';
  const go = 'rgba(201,168,76,0.15)';

  switch (cardId) {
    case 'cupido':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Bow */}
          <path d="M16 32C16 16 32 8 32 8" stroke={g} strokeWidth="1.2" fill="none" />
          <path d="M16 32C16 48 32 56 32 56" stroke={g} strokeWidth="1.2" fill="none" />
          {/* Arrow */}
          <line x1="14" y1="32" x2="52" y2="32" stroke={g} strokeWidth="0.8" opacity="0.6" />
          <polygon points="52,28 60,32 52,36" fill={g} opacity="0.6" />
          {/* Heart at center */}
          <path d="M32 48C32 48 18 38 18 28C18 22.7 22.3 18.5 27.5 18.5C30 18.5 32 20 32 20C32 20 34 18.5 36.5 18.5C41.7 18.5 46 22.7 46 28C46 38 32 48 32 48Z" stroke={g} strokeWidth="1" fill={go} />
          {/* Wings */}
          <path d="M26 24C22 18 14 16 10 18C14 20 20 24 26 24Z" stroke={g} strokeWidth="0.6" fill={go} opacity="0.5" />
          <path d="M38 24C42 18 50 16 54 18C50 20 44 24 38 24Z" stroke={g} strokeWidth="0.6" fill={go} opacity="0.5" />
        </svg>
      );
    case 'luna':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Crescent moon */}
          <path d="M40 8C40 8 28 14 28 32C28 50 40 56 40 56C40 56 16 50 16 32C16 14 40 8 40 8Z" stroke={g} strokeWidth="1.2" fill={go} />
          {/* Stars */}
          <circle cx="46" cy="16" r="1.2" fill={g} opacity="0.6" />
          <circle cx="50" cy="28" r="0.8" fill={g} opacity="0.4" />
          <circle cx="48" cy="42" r="1" fill={g} opacity="0.5" />
          <circle cx="44" cy="50" r="0.6" fill={g} opacity="0.3" />
          {/* Moon face hints */}
          <circle cx="32" cy="28" r="1.5" stroke={g} strokeWidth="0.4" fill="none" opacity="0.3" />
          <path d="M30 34C31 35 33 35 34 34" stroke={g} strokeWidth="0.4" fill="none" opacity="0.3" />
        </svg>
      );
    case 'laberinto':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Outer labyrinth circle */}
          <circle cx="32" cy="32" r="28" stroke={g} strokeWidth="0.8" fill="none" opacity="0.4" />
          <circle cx="32" cy="32" r="22" stroke={g} strokeWidth="0.6" fill="none" opacity="0.3" />
          <circle cx="32" cy="32" r="16" stroke={g} strokeWidth="0.6" fill="none" opacity="0.25" />
          <circle cx="32" cy="32" r="10" stroke={g} strokeWidth="0.6" fill="none" opacity="0.2" />
          <circle cx="32" cy="32" r="4" stroke={g} strokeWidth="0.8" fill={go} opacity="0.5" />
          {/* Walls */}
          <path d="M32 4L32 14" stroke={g} strokeWidth="1" opacity="0.5" />
          <path d="M50 32L40 32" stroke={g} strokeWidth="1" opacity="0.5" />
          <path d="M32 60L32 50" stroke={g} strokeWidth="1" opacity="0.5" />
          <path d="M14 32L24 32" stroke={g} strokeWidth="1" opacity="0.5" />
          {/* Center dot */}
          <circle cx="32" cy="32" r="1.5" fill={g} opacity="0.7" />
        </svg>
      );
    case 'sombras':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Shadow figure silhouette */}
          <ellipse cx="32" cy="58" rx="16" ry="4" fill={go} stroke={g} strokeWidth="0.4" opacity="0.3" />
          <path d="M32 12C28 12 26 16 26 20C26 22 27 24 28 25L24 50L40 50L36 25C37 24 38 22 38 20C38 16 36 12 32 12Z" stroke={g} strokeWidth="1" fill={go} opacity="0.3" />
          {/* Eyes */}
          <circle cx="29" cy="20" r="1.5" fill={g} opacity="0.6" />
          <circle cx="35" cy="20" r="1.5" fill={g} opacity="0.6" />
          {/* Wisps */}
          <path d="M24 30C18 26 14 30 16 36" stroke={g} strokeWidth="0.5" fill="none" opacity="0.25" />
          <path d="M40 30C46 26 50 30 48 36" stroke={g} strokeWidth="0.5" fill="none" opacity="0.25" />
        </svg>
      );
    case 'corazon':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Gothic heart */}
          <path d="M32 56C32 56 8 40 8 22C8 14 14 8 22 8C26 8 30 10 32 14C34 10 38 8 42 8C50 8 56 14 56 22C56 40 32 56 32 56Z" stroke={g} strokeWidth="1.2" fill="none" />
          <path d="M32 50C32 50 14 38 14 24C14 18 18 14 24 14C27 14 30 16 32 18C34 16 37 14 40 14C46 14 50 18 50 24C50 38 32 50 32 50Z" stroke={g} strokeWidth="0.4" fill={go} opacity="0.3" />
          {/* Cracks/veins */}
          <path d="M32 18L28 28L32 34L36 42" stroke={g} strokeWidth="0.3" fill="none" opacity="0.2" />
          <path d="M28 28L22 32" stroke={g} strokeWidth="0.3" fill="none" opacity="0.15" />
          <path d="M36 34L42 38" stroke={g} strokeWidth="0.3" fill="none" opacity="0.15" />
          {/* Crown of thorns on top */}
          <path d="M22 10L26 6L30 10L34 6L38 10L42 6" stroke={g} strokeWidth="0.5" fill="none" opacity="0.25" />
        </svg>
      );
    case 'espejo':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Mirror frame (oval) */}
          <ellipse cx="32" cy="28" rx="20" ry="24" stroke={g} strokeWidth="1.2" fill="none" />
          <ellipse cx="32" cy="28" rx="17" ry="21" stroke={g} strokeWidth="0.4" fill={go} opacity="0.2" />
          {/* Reflection crack */}
          <path d="M32 7L30 20L34 32L29 44L32 49" stroke={g} strokeWidth="0.4" fill="none" opacity="0.3" />
          {/* Handle */}
          <line x1="32" y1="52" x2="32" y2="62" stroke={g} strokeWidth="1" opacity="0.5" />
          <circle cx="32" cy="58" r="2" stroke={g} strokeWidth="0.6" fill="none" opacity="0.4" />
          {/* Light reflection */}
          <ellipse cx="24" cy="20" rx="4" ry="8" stroke={g} strokeWidth="0.3" fill="none" opacity="0.15" transform="rotate(-15 24 20)" />
        </svg>
      );
    case 'estrella':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* 8-pointed star */}
          <polygon points="32,4 35,24 56,16 40,32 56,48 35,40 32,60 29,40 8,48 24,32 8,16 29,24" stroke={g} strokeWidth="0.8" fill={go} opacity="0.2" />
          {/* Inner star */}
          <polygon points="32,14 34,26 46,22 38,32 46,42 34,38 32,50 30,38 18,42 26,32 18,22 30,26" stroke={g} strokeWidth="0.5" fill={go} opacity="0.15" />
          {/* Center glow */}
          <circle cx="32" cy="32" r="5" fill={go} stroke={g} strokeWidth="0.6" opacity="0.4" />
          <circle cx="32" cy="32" r="2" fill={g} opacity="0.6" />
          {/* Rays */}
          <line x1="32" y1="0" x2="32" y2="4" stroke={g} strokeWidth="0.4" opacity="0.2" />
          <line x1="32" y1="60" x2="32" y2="64" stroke={g} strokeWidth="0.4" opacity="0.2" />
          <line x1="0" y1="32" x2="4" y2="32" stroke={g} strokeWidth="0.4" opacity="0.2" />
          <line x1="60" y1="32" x2="64" y2="32" stroke={g} strokeWidth="0.4" opacity="0.2" />
        </svg>
      );
    case 'fuego':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Outer flame */}
          <path d="M32 4C32 4 16 24 16 40C16 48 20 56 32 60C44 56 48 48 48 40C48 24 32 4 32 4Z" stroke={g} strokeWidth="1.2" fill="none" />
          {/* Middle flame */}
          <path d="M32 16C32 16 22 30 22 40C22 46 25 52 32 54C39 52 42 46 42 40C42 30 32 16 32 16Z" stroke={g} strokeWidth="0.6" fill={go} opacity="0.3" />
          {/* Inner flame */}
          <path d="M32 28C32 28 27 36 27 42C27 46 29 50 32 52C35 50 37 46 37 42C37 36 32 28 32 28Z" stroke={g} strokeWidth="0.4" fill={go} opacity="0.4" />
          {/* Core */}
          <path d="M32 38C32 38 30 42 30 44C30 46 31 48 32 48C33 48 34 46 34 44C34 42 32 38 32 38Z" fill={g} opacity="0.5" />
          {/* Embers */}
          <circle cx="24" cy="56" r="0.8" fill={g} opacity="0.3" />
          <circle cx="40" cy="54" r="0.6" fill={g} opacity="0.25" />
          <circle cx="32" cy="58" r="0.7" fill={g} opacity="0.2" />
        </svg>
      );
    case 'tierra':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Mountain/earth shape */}
          <path d="M4 56L24 16L32 32L40 16L60 56Z" stroke={g} strokeWidth="1" fill={go} opacity="0.15" />
          <path d="M12 56L28 24L32 36L36 24L52 56Z" stroke={g} strokeWidth="0.4" fill={go} opacity="0.1" />
          {/* Roots at base */}
          <path d="M32 56C30 52 24 50 18 52" stroke={g} strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M32 56C34 52 40 50 46 52" stroke={g} strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M32 56C32 52 32 48 30 46" stroke={g} strokeWidth="0.4" fill="none" opacity="0.2" />
          {/* Rocks */}
          <circle cx="16" cy="56" r="3" stroke={g} strokeWidth="0.4" fill={go} opacity="0.15" />
          <circle cx="48" cy="56" r="2" stroke={g} strokeWidth="0.4" fill={go} opacity="0.15" />
          {/* Grass/leaves at top */}
          <path d="M28 18L24 12L28 14" stroke={g} strokeWidth="0.4" fill="none" opacity="0.3" />
          <path d="M36 18L40 12L36 14" stroke={g} strokeWidth="0.4" fill="none" opacity="0.3" />
        </svg>
      );
    case 'agua':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Water drops */}
          <path d="M32 8C32 8 20 28 20 38C20 44.6 25.4 50 32 50C38.6 50 44 44.6 44 38C44 28 32 8 32 8Z" stroke={g} strokeWidth="1.2" fill={go} opacity="0.2" />
          {/* Inner reflection */}
          <path d="M30 16C30 16 24 30 24 38C24 42 27 46 32 46" stroke={g} strokeWidth="0.4" fill="none" opacity="0.2" />
          {/* Ripples at bottom */}
          <ellipse cx="32" cy="56" rx="20" ry="3" stroke={g} strokeWidth="0.4" fill="none" opacity="0.2" />
          <ellipse cx="32" cy="56" rx="12" ry="2" stroke={g} strokeWidth="0.3" fill="none" opacity="0.15" />
          {/* Small drops */}
          <circle cx="14" cy="24" r="1.5" fill={go} stroke={g} strokeWidth="0.4" opacity="0.2" />
          <circle cx="50" cy="20" r="1" fill={go} stroke={g} strokeWidth="0.3" opacity="0.15" />
        </svg>
      );
    case 'viento':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Wind swirls */}
          <path d="M8 20C8 20 24 14 40 20C48 23 56 18 58 16" stroke={g} strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M6 32C6 32 20 26 36 32C44 35 52 30 60 28" stroke={g} strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M10 44C10 44 24 38 40 44C48 47 54 42 56 40" stroke={g} strokeWidth="1" fill="none" opacity="0.5" />
          {/* Floating leaves */}
          <path d="M48 14L52 18L48 16L44 18Z" stroke={g} strokeWidth="0.4" fill={go} opacity="0.3" />
          <path d="M16 42L20 46L16 44L12 46Z" stroke={g} strokeWidth="0.4" fill={go} opacity="0.25" />
          {/* Spirals */}
          <path d="M50 50C50 50 54 46 52 42" stroke={g} strokeWidth="0.4" fill="none" opacity="0.2" />
          <path d="M14 12C14 12 10 16 12 20" stroke={g} strokeWidth="0.4" fill="none" opacity="0.2" />
        </svg>
      );
    case 'espiritu':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Aura rings */}
          <circle cx="32" cy="28" r="24" stroke={g} strokeWidth="0.3" fill="none" opacity="0.15" />
          <circle cx="32" cy="28" r="18" stroke={g} strokeWidth="0.4" fill="none" opacity="0.2" />
          <circle cx="32" cy="28" r="12" stroke={g} strokeWidth="0.6" fill={go} opacity="0.1" />
          {/* Figure */}
          <circle cx="32" cy="20" r="4" stroke={g} strokeWidth="0.8" fill={go} opacity="0.3" />
          <path d="M32 24L32 40" stroke={g} strokeWidth="0.8" opacity="0.5" />
          <path d="M24 30L32 26L40 30" stroke={g} strokeWidth="0.6" fill="none" opacity="0.3" />
          <path d="M26 44L32 40L38 44" stroke={g} strokeWidth="0.6" fill="none" opacity="0.3" />
          {/* Ascending particles */}
          <circle cx="20" cy="10" r="1" fill={g} opacity="0.3" />
          <circle cx="44" cy="8" r="0.8" fill={g} opacity="0.25" />
          <circle cx="28" cy="6" r="0.6" fill={g} opacity="0.2" />
          <circle cx="36" cy="4" r="0.7" fill={g} opacity="0.2" />
          {/* Triangle (trinity) */}
          <polygon points="32,2 12,54 52,54" stroke={g} strokeWidth="0.4" fill="none" opacity="0.1" />
        </svg>
      );
    case 'rosa':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Stem */}
          <path d="M32 60L32 30" stroke={g} strokeWidth="1" opacity="0.5" />
          {/* Thorns */}
          <path d="M32 50L28 46" stroke={g} strokeWidth="0.6" opacity="0.4" />
          <path d="M32 42L36 38" stroke={g} strokeWidth="0.6" opacity="0.4" />
          {/* Petals */}
          <ellipse cx="32" cy="22" rx="8" ry="12" stroke={g} strokeWidth="0.8" fill={go} opacity="0.2" transform="rotate(0 32 22)" />
          <ellipse cx="32" cy="22" rx="8" ry="12" stroke={g} strokeWidth="0.6" fill={go} opacity="0.15" transform="rotate(60 32 22)" />
          <ellipse cx="32" cy="22" rx="8" ry="12" stroke={g} strokeWidth="0.6" fill={go} opacity="0.15" transform="rotate(120 32 22)" />
          {/* Center */}
          <circle cx="32" cy="22" r="4" stroke={g} strokeWidth="0.6" fill={go} opacity="0.3" />
          <path d="M30 20L32 24L34 20L32 16Z" stroke={g} strokeWidth="0.3" fill="none" opacity="0.2" />
          {/* Leaves */}
          <path d="M32 40C28 38 22 40 24 36C26 38 30 36 32 38" stroke={g} strokeWidth="0.5" fill={go} opacity="0.15" />
          <path d="M32 44C36 42 42 44 40 40C38 42 34 40 32 42" stroke={g} strokeWidth="0.5" fill={go} opacity="0.15" />
        </svg>
      );
    case 'reloj':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Clock face */}
          <circle cx="32" cy="32" r="26" stroke={g} strokeWidth="1.2" fill="none" />
          <circle cx="32" cy="32" r="23" stroke={g} strokeWidth="0.3" fill={go} opacity="0.1" />
          {/* Hour marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 32 + Math.sin(rad) * 21;
            const y1 = 32 - Math.cos(rad) * 21;
            const x2 = 32 + Math.sin(rad) * 24;
            const y2 = 32 - Math.cos(rad) * 24;
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={g} strokeWidth={angle % 90 === 0 ? 0.8 : 0.3} opacity={angle % 90 === 0 ? 0.6 : 0.25} />;
          })}
          {/* Roman numerals at quarters */}
          <text x="32" y="14" textAnchor="middle" fontSize="5" fill={g} opacity="0.4" fontFamily="serif">XII</text>
          <text x="54" y="34" textAnchor="middle" fontSize="5" fill={g} opacity="0.4" fontFamily="serif">III</text>
          <text x="32" y="56" textAnchor="middle" fontSize="5" fill={g} opacity="0.4" fontFamily="serif">VI</text>
          <text x="10" y="34" textAnchor="middle" fontSize="5" fill={g} opacity="0.4" fontFamily="serif">IX</text>
          {/* Hands */}
          <line x1="32" y1="32" x2="32" y2="16" stroke={g} strokeWidth="1" opacity="0.5" />
          <line x1="32" y1="32" x2="44" y2="28" stroke={g} strokeWidth="0.6" opacity="0.4" />
          {/* Center */}
          <circle cx="32" cy="32" r="1.5" fill={g} opacity="0.6" />
          {/* Infinity symbol below */}
          <path d="M20 58C20 54 24 52 28 52C32 52 32 56 32 56C32 56 32 52 36 52C40 52 44 54 44 58" stroke={g} strokeWidth="0.5" fill="none" opacity="0.25" />
        </svg>
      );
    case 'cuervo':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* Body */}
          <ellipse cx="32" cy="36" rx="14" ry="18" stroke={g} strokeWidth="1" fill={go} opacity="0.15" />
          {/* Head */}
          <circle cx="32" cy="16" r="8" stroke={g} strokeWidth="1" fill={go} opacity="0.15" />
          {/* Beak */}
          <path d="M36 16L46 14L36 18Z" stroke={g} strokeWidth="0.6" fill={go} opacity="0.2" />
          {/* Eye */}
          <circle cx="34" cy="14" r="2" stroke={g} strokeWidth="0.6" fill="none" opacity="0.5" />
          <circle cx="34" cy="14" r="0.8" fill={g} opacity="0.7" />
          {/* Wings spread */}
          <path d="M18 32C8 24 4 16 8 12C12 16 16 24 22 28" stroke={g} strokeWidth="0.8" fill={go} opacity="0.15" />
          <path d="M46 32C56 24 60 16 56 12C52 16 48 24 42 28" stroke={g} strokeWidth="0.8" fill={go} opacity="0.15" />
          {/* Tail feathers */}
          <path d="M26 52L22 60" stroke={g} strokeWidth="0.5" opacity="0.3" />
          <path d="M32 54L32 62" stroke={g} strokeWidth="0.5" opacity="0.3" />
          <path d="M38 52L42 60" stroke={g} strokeWidth="0.5" opacity="0.3" />
          {/* Legs */}
          <line x1="28" y1="52" x2="26" y2="58" stroke={g} strokeWidth="0.5" opacity="0.4" />
          <line x1="36" y1="52" x2="38" y2="58" stroke={g} strokeWidth="0.5" opacity="0.4" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="24" stroke={g} strokeWidth="1" fill="none" opacity="0.3" />
          <text x="32" y="36" textAnchor="middle" fontSize="16" fill={g} opacity="0.4">?</text>
        </svg>
      );
  }
}

// ─── Card Back Design (unique pentagram + moon motif) ───
function TarotCardBack() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* SVG border pattern */}
      <svg width="100%" height="100%" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid meet" className="absolute inset-0" aria-hidden="true">
        {/* Outer border */}
        <rect x="6" y="6" width="188" height="288" rx="6" stroke="#c9a84c" strokeWidth="0.7" fill="none" opacity="0.35" />
        {/* Inner border */}
        <rect x="12" y="12" width="176" height="276" rx="4" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.15" />
        {/* Third border */}
        <rect x="18" y="18" width="164" height="264" rx="2" stroke="#c9a84c" strokeWidth="0.2" fill="none" opacity="0.08" />

        {/* Corner flourishes */}
        <path d="M6 30C6 6 30 6 30 6" stroke="#c9a84c" strokeWidth="0.6" fill="none" opacity="0.3" />
        <path d="M194 30C194 6 170 6 170 6" stroke="#c9a84c" strokeWidth="0.6" fill="none" opacity="0.3" />
        <path d="M6 270C6 294 30 294 30 294" stroke="#c9a84c" strokeWidth="0.6" fill="none" opacity="0.3" />
        <path d="M194 270C194 294 170 294 170 294" stroke="#c9a84c" strokeWidth="0.6" fill="none" opacity="0.3" />

        {/* Top diamond */}
        <rect x="96" y="4" width="8" height="8" fill="none" stroke="#c9a84c" strokeWidth="0.4" opacity="0.3" transform="rotate(45 100 8)" />
        {/* Bottom diamond */}
        <rect x="96" y="288" width="8" height="8" fill="none" stroke="#c9a84c" strokeWidth="0.4" opacity="0.3" transform="rotate(45 100 292)" />

        {/* Side ornaments */}
        <circle cx="4" cy="150" r="1.5" fill="#c9a84c" opacity="0.2" />
        <circle cx="196" cy="150" r="1.5" fill="#c9a84c" opacity="0.2" />

        {/* Horizontal rules */}
        <line x1="30" y1="6" x2="70" y2="6" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="130" y1="6" x2="170" y2="6" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="30" y1="294" x2="70" y2="294" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="130" y1="294" x2="170" y2="294" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />

        {/* Vertical side lines */}
        <line x1="6" y1="30" x2="6" y2="70" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="6" y1="120" x2="6" y2="180" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="6" y1="230" x2="6" y2="270" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="194" y1="30" x2="194" y2="70" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="194" y1="120" x2="194" y2="180" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
        <line x1="194" y1="230" x2="194" y2="270" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
      </svg>

      {/* Central pentagram + moon design */}
      <div className="relative z-10 tarot-pentagram-glow">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          {/* Outer circle */}
          <circle cx="40" cy="40" r="38" stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.25" />
          <circle cx="40" cy="40" r="34" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.15" />
          {/* Pentagram */}
          <polygon
            points="40,6 47.6,29.4 72.4,29.4 52.4,44.6 59.8,68 40,54 20.2,68 27.6,44.6 7.6,29.4 32.4,29.4"
            stroke="#c9a84c"
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
          />
          {/* Inner pentagram (inverted) */}
          <polygon
            points="40,68 32.4,44.6 7.6,44.6 27.6,29.4 20.2,6 40,20 59.8,6 52.4,29.4 72.4,44.6 47.6,44.6"
            stroke="#c9a84c"
            strokeWidth="0.4"
            fill="none"
            opacity="0.15"
          />
          {/* Crescent moon at center */}
          <path
            d="M44 28C44 28 36 32 36 40C36 48 44 52 44 52C44 52 28 48 28 40C28 32 44 28 44 28Z"
            stroke="#c9a84c"
            strokeWidth="0.6"
            fill="rgba(201,168,76,0.1)"
            opacity="0.5"
          />
          {/* Center dot */}
          <circle cx="38" cy="40" r="1.5" fill="#c9a84c" opacity="0.5" />
        </svg>
      </div>

      {/* "TAROT" text */}
      <p className="relative z-10 font-[family-name:var(--font-cinzel)] text-[#c9a84c]/40 text-[10px] tracking-[0.4em] uppercase mt-1">
        Tarot
      </p>

      {/* Top eye of providence */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 opacity-25">
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none" aria-hidden="true">
          <path d="M0 7C0 7 5 0 12 0C19 0 24 7 24 7C24 7 19 14 12 14C5 14 0 7 0 7Z" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
          <circle cx="12" cy="7" r="3" stroke="#c9a84c" strokeWidth="0.3" fill="none" />
          <circle cx="12" cy="7" r="1" fill="#c9a84c" opacity="0.4" />
        </svg>
      </div>

      {/* Bottom decorative dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 opacity-30" aria-hidden="true">
        <span className="text-[#c9a84c] text-[6px]">&#9670;</span>
        <span className="text-[#c9a84c] text-[8px]">&#10022;</span>
        <span className="text-[#c9a84c] text-[6px]">&#9670;</span>
      </div>
    </div>
  );
}

// ─── Gold Particle Burst ───
function GoldParticleBurst({ active, color = '#c9a84c' }: { active: boolean; color?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        angle: (i / 16) * 360 + (Math.random() * 25 - 12),
        distance: 40 + Math.random() * 90,
        size: 1.5 + Math.random() * 4,
        c: Math.random() > 0.35 ? color : '#8B0000',
        duration: 0.4 + Math.random() * 0.6,
      })),
    [color]
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible z-20" aria-hidden="true">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.c,
                boxShadow: `0 0 8px ${p.c}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Typewriter Text Effect ───
function TypewriterText({
  text,
  onComplete,
  speed = 25,
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
      className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-sm sm:text-base leading-[1.9] tracking-[0.03em] whitespace-pre-wrap"
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

// ─── Ornamental Divider ───
function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
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

// ─── Gold Corner Accent ───
function GoldCornerAccent({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes: Record<string, string> = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
  };
  return (
    <div
      className={`absolute w-5 h-5 sm:w-7 sm:h-7 border-[#c9a84c]/25 pointer-events-none ${classes[position]}`}
      aria-hidden="true"
    />
  );
}

// ─── Single Tarot Card Component ───
interface SingleTarotCardProps {
  card: TarotCard;
  position: CardPosition;
  isRevealed: boolean;
  isRevealing: boolean;
  isClickable: boolean;
  isNextToClick: boolean;
  onFlip: () => void;
}

function SingleTarotCard({
  card,
  position,
  isRevealed,
  isRevealing,
  isClickable,
  isNextToClick,
  onFlip,
}: SingleTarotCardProps) {
  const [showParticles, setShowParticles] = useState(false);
  const [flipAngle, setFlipAngle] = useState(0);
  const [contentRevealed, setContentRevealed] = useState(false);
  const label = POSITION_LABELS[position];

  // Arc transform for position
  const arcTransform = useMemo(() => {
    if (isRevealed) return {};
    switch (position) {
      case 0: return { rotateZ: -8, translateY: 12 };
      case 1: return { scale: 1.08, translateY: -8 };
      case 2: return { rotateZ: 8, translateY: 12 };
    }
  }, [position, isRevealed]);

  const handleClick = useCallback(() => {
    if (!isClickable || !isNextToClick || isRevealing || isRevealed) return;

    // Start flip animation
    setShowParticles(true);
    setFlipAngle(90);

    // Switch to revealed state at midpoint
    setTimeout(() => {
      setContentRevealed(true);
      setFlipAngle(0);
      onFlip();
    }, 500);

    // Hide particles
    setTimeout(() => {
      setShowParticles(false);
    }, 1200);
  }, [isClickable, isNextToClick, isRevealing, isRevealed, onFlip]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const showFront = contentRevealed;
  const showBack = !contentRevealed;

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ perspective: 1000, width: 'clamp(140px, 28vw, 200px)' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        y: 0,
        ...arcTransform,
      }}
      transition={{
        opacity: { duration: 0.5, delay: position * 0.15 },
        y: { duration: 0.6, delay: position * 0.15, ease: 'easeOut' },
        ...((arcTransform.rotateZ !== undefined || arcTransform.scale !== undefined)
          ? { default: { duration: 0.6, delay: position * 0.15 + 0.2 } }
          : {}),
      }}
    >
      {/* Floating animation for face-down cards */}
      {!isRevealed && !isRevealing && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4 + position * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: position * 0.3,
          }}
        />
      )}

      {/* Card container with 3D flip */}
      <motion.div
        className="relative cursor-pointer select-none"
        style={{
          transformStyle: 'preserve-3d',
          aspectRatio: '2/3',
        }}
        animate={{ rotateY: flipAngle }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={
          isRevealed
            ? `Carta de ${label}: ${card.name}. ${card.reading}`
            : isNextToClick
              ? `Carta de ${label} boca abajo. Toca para revelar.`
              : `Carta de ${label} boca abajo. Revela primero ${POSITION_LABELS[(position as number) - 1] || 'Pasado'}.`
        }
      >
        {/* ─── Card Back ─── */}
        <motion.div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
          animate={{ opacity: showFront ? 0 : 1 }}
          transition={{ duration: 0.01 }}
        >
          <div className={`relative w-full h-full rounded-xl border overflow-hidden ${
            isNextToClick
              ? 'border-[#c9a84c]/40 shadow-[0_0_30px_rgba(201,168,76,0.15)]'
              : 'border-[#2a2a2a]'
          } bg-gradient-to-b from-[#121010] to-[#0d0a0a] tarot-card-glow`}>
            <TarotCardBack />

            {/* Position label hint */}
            <motion.p
              className="absolute bottom-4 left-0 right-0 text-center font-[family-name:var(--font-cinzel)] text-[#8a7e6b]/60 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase z-10"
              animate={{
                opacity: isNextToClick ? [0.4, 0.9, 0.4] : 0.3,
              }}
              transition={
                isNextToClick
                  ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
            >
              {label}
            </motion.p>

            {/* Highlight glow for next-to-click */}
            {isNextToClick && (
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl"
                animate={{
                  boxShadow: [
                    'inset 0 0 20px rgba(201,168,76,0.03)',
                    'inset 0 0 40px rgba(201,168,76,0.08)',
                    'inset 0 0 20px rgba(201,168,76,0.03)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        </motion.div>

        {/* ─── Card Front ─── */}
        <motion.div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
          animate={{ opacity: showFront ? 1 : 0 }}
          transition={{ duration: 0.01 }}
        >
          <div className="relative w-full h-full rounded-xl border border-[#2a2a2a] overflow-hidden paper-texture shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <GoldCornerAccent position="tl" />
            <GoldCornerAccent position="tr" />
            <GoldCornerAccent position="bl" />
            <GoldCornerAccent position="br" />

            {/* Inner border */}
            <div className="absolute inset-[2px] rounded-[10px] border border-[#c9a84c]/6 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center h-full p-3 sm:p-4">
              {/* Position label */}
              <motion.span
                className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[8px] sm:text-[9px] tracking-[0.3em] uppercase mb-1"
                initial={{ opacity: 0, y: -8 }}
                animate={showFront ? { opacity: 0.7, y: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {label}
              </motion.span>

              {/* Card icon */}
              <motion.div
                className="flex justify-center my-1"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={showFront ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <CardArchetypeIcon cardId={card.id} />
              </motion.div>

              {/* Card name */}
              <motion.h3
                className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-xs sm:text-sm text-center tracking-[0.1em]"
                style={{
                  textShadow: '0 0 12px rgba(201, 168, 76, 0.3), 0 0 24px rgba(201, 168, 76, 0.1)',
                }}
                initial={{ opacity: 0, y: -5 }}
                animate={showFront ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                {card.name}
              </motion.h3>

              {/* Keywords */}
              <motion.p
                className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-[7px] sm:text-[8px] tracking-wide text-center mb-1"
                initial={{ opacity: 0 }}
                animate={showFront ? { opacity: 0.6 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {card.keywords}
              </motion.p>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={showFront ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="w-full"
              >
                <OrnamentalDivider />
              </motion.div>

              {/* Reading text */}
              <motion.div
                className="flex-1 flex items-start overflow-y-auto dream-journal-scrollbar mt-1"
                initial={{ opacity: 0 }}
                animate={showFront ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <p className="font-[family-name:var(--font-fell)] italic text-[#c4b59a]/80 text-[8px] sm:text-[10px] leading-[1.7] text-center">
                  {card.reading}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Particle burst */}
      <GoldParticleBurst active={showParticles} />
    </motion.div>
  );
}

// ─── Main Component ───
export default function GothicTarotReading({ className = '' }: GothicTarotReadingProps) {
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [revealedSet, setRevealedSet] = useState<Set<CardPosition>>(new Set());
  const [isFlipping, setIsFlipping] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [interpretationComplete, setInterpretationComplete] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Generate 3 unique random cards on mount
  const generateDeck = useCallback(() => {
    const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  useEffect(() => {
    setDeck(generateDeck());
  }, [generateDeck]);

  // Derive next card to click
  const nextCard: CardPosition | null = useMemo(() => {
    if (revealedSet.size >= 3) return null;
    if (!revealedSet.has(0)) return 0;
    if (!revealedSet.has(1)) return 1;
    if (!revealedSet.has(2)) return 2;
    return null;
  }, [revealedSet]);

  // Check if all revealed
  const allRevealed = revealedSet.size === 3;

  // Show interpretation after all cards are revealed
  useEffect(() => {
    if (allRevealed && deck.length === 3) {
      const timer = setTimeout(() => {
        setShowInterpretation(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [allRevealed, deck]);

  const handleCardFlip = useCallback((pos: CardPosition) => {
    setIsFlipping(true);
    setRevealedSet((prev) => {
      const next = new Set(prev);
      next.add(pos);
      return next;
    });
    setTimeout(() => {
      setIsFlipping(false);
    }, 1200);
  }, []);

  const handleReset = useCallback(() => {
    if (isResetting) return;
    setIsResetting(true);
    setShowInterpretation(false);
    setInterpretationComplete(false);

    setTimeout(() => {
      setDeck(generateDeck());
      setRevealedSet(new Set());
      setIsResetting(false);
    }, 600);
  }, [generateDeck, isResetting]);

  const handleResetKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleReset();
      }
    },
    [handleReset]
  );

  const interpretationText = useMemo(() => {
    if (deck.length !== 3) return '';
    return generateInterpretation(deck);
  }, [deck]);

  if (deck.length !== 3) return null;

  return (
    <section className={`relative w-full max-w-3xl mx-auto my-8 sm:my-12 ${className}`} aria-label="Lectura de Tarot G\u00f3tico">
      {/* Section title */}
      <motion.div
        className="text-center mb-6 sm:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-lg sm:text-2xl tracking-[0.08em]"
          style={{ textShadow: '0 0 20px rgba(201, 168, 76, 0.2), 0 0 40px rgba(201, 168, 76, 0.08)' }}>
          Lectura del Tarot
        </h2>
        <p className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm mt-1.5 tracking-wide">
          Tres cartas revelan los ecos de tu pasado, presente y futuro
        </p>
      </motion.div>

      {/* Cards spread */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-8 px-4" style={{ perspective: 1200 }}>
        {([0, 1, 2] as CardPosition[]).map((pos) => (
          <SingleTarotCard
            key={`${deck[pos].id}-${pos}`}
            card={deck[pos]}
            position={pos}
            isRevealed={revealedSet.has(pos)}
            isRevealing={isFlipping && !revealedSet.has(pos)}
            isClickable={!isFlipping && !isResetting}
            isNextToClick={nextCard === pos}
            onFlip={() => handleCardFlip(pos)}
          />
        ))}
      </div>

      {/* Position labels below cards */}
      <div className="flex justify-center gap-3 sm:gap-6 md:gap-8 mt-4 px-4">
        {POSITION_LABELS.map((label, i) => (
          <motion.span
            key={label}
            className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[8px] sm:text-[9px] tracking-[0.25em] uppercase"
            style={{ width: 'clamp(140px, 28vw, 200px)', textAlign: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: revealedSet.has(i as CardPosition) ? 0.4 : 0.6 }}
            transition={{ duration: 0.5 }}
          >
            {label}
          </motion.span>
        ))}
      </div>

      {/* Combined interpretation */}
      <AnimatePresence>
        {showInterpretation && (
          <motion.div
            className="mt-8 sm:mt-12 mx-2 sm:mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            {/* Interpretation divider */}
            <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#8B0000]/20" />
              <span className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/50 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">
                Interpretaci\u00f3n
              </span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#8B0000]/20" />
            </div>

            {/* Interpretation card */}
            <div className="relative paper-texture rounded-xl border border-[#2a2a2a] p-5 sm:p-8">
              <GoldCornerAccent position="tl" />
              <GoldCornerAccent position="tr" />
              <GoldCornerAccent position="bl" />
              <GoldCornerAccent position="br" />
              <div className="absolute inset-[2px] rounded-[10px] border border-[#c9a84c]/5 pointer-events-none" />

              <div className="relative z-10">
                <TypewriterText
                  text={interpretationText}
                  onComplete={() => setInterpretationComplete(true)}
                  speed={20}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset button */}
      <AnimatePresence>
        {(allRevealed || isResetting) && (
          <motion.div
            className="flex justify-center mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleReset}
              onKeyDown={handleResetKeyDown}
              className="font-[family-name:var(--font-cinzel)] text-xs sm:text-sm uppercase tracking-[0.2em] text-[#8a7e6b] hover:text-[#c9a84c] transition-colors duration-300 cursor-pointer py-2 px-5 border border-[#2a2a2a] hover:border-[#c9a84c]/30 rounded-lg hover:shadow-[0_0_20px_rgba(201,168,76,0.1)] btn-press"
              aria-label="Realizar una nueva lectura de tarot"
              disabled={isResetting}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="text-[10px]">&#10022;</span>
                Nueva Lectura
                <span aria-hidden="true" className="text-[10px]">&#10022;</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
