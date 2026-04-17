# 🖤 Ecos del Alma

> *una carta de amor gótica que cobra vida en tu pantalla*

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## ¿qué es esto?

básicamente es una página web interactiva que armé como regalo para mi pareja 🥺
la idea era hacer algo mucho más personal que una simple carta o un video —
quería que fuera una experiencia completa, donde pudieras explorar, leer cartas,
ver fotos, escuchar canciones... todo con una estética gótica oscura que a ambos
nos encanta.

se inspiró mucho en cosas como crimson peak, addams family, y esas novelas
góticas románticas que dan escalofríos buenos ✨

## qué puedes encontrar adentro

- **🎀 Cartas de amor** — las puedes escribir y publicar, tienen un formato
  tipo pergamino antiguo con sellos de cera y todo
- **📷 Galería de fotos** — con marcos góticos y efecto hover bien bonito
- **🎵 Canciones** — un reproductor con estética oscura
- **🎬 Videos** — integración con youtube
- **🌙 Fase lunar** — te muestra la luna actual (en serio lol)
- **🔮 Oráculo** — como un tarot pero de amor, bastante divertido
- **🕯️ Velas interactivas** — puedes encenderlas y apagarlas
- **🌹 Jardín de rosas** — rosas que aparecen con animaciones
- **📝 Diario de sueños** — para escribir esos sueños extraños
- **🔒 Candados de amor** — como el puente de paris pero virtual
- **🕯️ Linternas de deseos** — escribes un deseo y se va volando
- **✍️ Ritual de escritura** — una guía paso a paso para escribir cartas
- **🎵 Caja de música gótica** — suena una melodía con animación de ballet
- **⏳ Reloj de arena animado** — porque el tiempo es relativo cuando amas
- **⭐ Mapa de constelaciones** — constelaciones personalizadas
- ...y como 30 cosas más que ya ni recuerdo jajaja

## la estética

todo el diseño está pensado para que se sienta como un libro antiguo:
- colores oscuros con toques de dorado y rojo sangre
- tipografías góticas (Cinzel, IM Fell English)
- partículas flotando, brasas, murciélagos
- efectos de papel antiguo y sellos de cera
- scroll suave con transiciones entre secciones
- música ambiental de fondo (opcional)
- trail de brillo que sigue el cursor 🌟

## tech stack

no me voy a hacer el experto porque la verdad aprendí mucho haciéndolo:

- **Next.js 16** con App Router — mi primera vez usándolo de verdad
- **TypeScript** — me costó al principio pero ya le agarré el ritmo
- **Tailwind CSS 4** — para los estilos, súper útil
- **Prisma + SQLite** — para guardar las cartas y fotos
- **Framer Motion** — las animaciones están hechas con esto
- **shadcn/ui** — componentes base que modifiqué bastante

## cómo correrlo localmente

```bash
# clonar el repo
git clone https://github.com/Amateus2308/ecos-del-alma.git
cd ecos-del-alma

# instalar dependencias
npm install

# configurar base de datos
npx prisma db push

# arrancar en modo desarrollo
npm run dev
```

abre `http://localhost:3000` y listo 💀

## credenciales por defecto

| rol | email | contraseña |
|-----|-------|-----------|
| admin | `admin@ecos.com` | `admin123` |
| viewer | `amor@ecos.com` | `amor123` |

el admin puede crear cartas, subir fotos, publicar contenido, etc.
los viewers solo pueden ver lo que está publicado.

## deploy

la forma más fácil es con **[Vercel](https://vercel.com)**:

1. creas una cuenta (es gratis)
2. conectas tu repo de github
3. le das a "Deploy" y ya
4. vercel te da un link como `ecos-del-alma.vercel.app`

para la base de datos en producción, vercel tiene un addon de
PostgreSQL o puedes usar [Turso](https://turso.tech) que es gratis también.

> **nota:** si lo deployas, recuerda cambiar las credenciales por defecto
> y usar variables de entorno para el JWT_SECRET

## estructura del proyecto

```
src/
├── app/
│   ├── globals.css        ← estilos góticos y animaciones
│   ├── page.tsx           ← página principal (toda la app es single-page)
│   └── api/               ← endpoints del backend
│       ├── auth/          ← login, registro
│       ├── letters/       ← CRUD cartas
│       ├── photos/        ← subida de fotos
│       ├── songs/         ← subida de canciones
│       ├── videos/        ← videos de youtube
│       ├── whispers/      ← muro de susurros
│       └── ...
├── components/
│   └── gothic/            ← +35 componentes góticos
│       ├── LoginOverlay.tsx
│       ├── LetterCard.tsx
│       ├── LetterReaderModal.tsx
│       ├── PhotoGallery.tsx
│       ├── GothicMusicBox.tsx
│       ├── WritingRitual.tsx
│       └── ... (muchos más)
├── store/
│   ├── auth.ts            ← estado de autenticación
│   └── content.ts         ← estado del contenido
├── lib/
│   ├── auth.ts            ← utilidades JWT
│   └── db.ts              ← cliente prisma
└── middleware.ts
```

## qué me costó más

- el sistema de scroll con las secciones — la verdad fue un dolor de cabeza,
  tuve que probar varias formas hasta que funcionara bien en móvil
- las animaciones de los murciélagos y las brasas flotantes — quería que se
  sintiera vivo sin ser molesto
- el modal de lectura de cartas largas — se bugueaba cuando la carta era muy
  larga y no podías hacer scroll, ya lo arreglé
- hacer que todo se viera bien en el celular — responsive design es más difícil
  de lo que parece

## licencia

este proyecto es personal, pero si te inspira para hacerle algo lindo a tu
pareja, hazlo 💕 no hace falta darme crédito.

---

*hecho con mucho amor y un poco de obscuridad* 🖤🥀
