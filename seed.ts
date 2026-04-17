import { db } from './src/lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  // Ensure admin exists
  const existingAdmin = await db.user.findFirst({ where: { role: 'admin' } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await db.user.create({
      data: { email: 'admin@ecos.com', password: hashed, name: 'Guardián', role: 'admin' },
    });
    console.log('Admin created');
  } else {
    console.log('Admin already exists');
  }

  // Create letters
  const letters = [
    {
      title: 'Carta del Amanecer',
      content: `Mi amor,

En el silencio de la madrugada, cuando el mundo aún duerme y las sombras bailan con la luz menguante de la luna, pienso en ti. Cada estrella que se apaga es un suspiro tuyo que cruza el cielo nocturno.

Nuestro amor es como el laberinto: complejo, aterrador, pero al final del camino siempre estás tú, esperándome con esa sonrisa que ilumina hasta la oscuridad más profunda.

Eternamente tuyo.`,
    },
    {
      title: 'Susurros en la Oscuridad',
      content: `Hay noches en las que la nostalgia me abraza con más fuerza que cualquier realidad. Recuerdo el tacto de tus manos, la forma en que tu risa rompía el silencio como cristal contra piedra.

Este espacio es nuestro refugio, un lugar donde el tiempo no existe y solo importan los ecos de lo que fuimos y seremos.

Nunca dejes de brillar, mi estrella caída.`,
    },
    {
      title: 'El Último Balcón',
      content: `Desde este balcón de sombras, observo cómo la ciudad se envuelve en un manto de melancolía. Las farolas parpadean como latidos de un corazón cansado.

Pero luego pienso en ti, y las sombras se convierten en escenarios de nuestros sueños compartidos. Cada calleja es un recuerdo, cada esquina una promesa.

Te llevo grabada en la piel como un tatuaje invisible que arde con cada latido.`,
    },
    {
      title: 'Bajo la Luna Roja',
      content: `Bajo la luna carmesí de esta noche sin nombre, escribo palabras que nunca podré decirte en persona. No por cobardía, sino porque el lenguaje humano es insuficiente para encerrar lo que siento.

Eres la tormenta que siempre deseé y el refugio que siempre necesité. Eres la contradicción perfecta que da sentido a mi existencia caótica.

Hasta que la sangre deje de latir en mis venas.`,
    },
  ];

  for (const letter of letters) {
    const existing = await db.letter.findFirst({ where: { title: letter.title } });
    if (!existing) {
      await db.letter.create({ data: { ...letter, published: true } });
      console.log(`Created letter: ${letter.title}`);
    }
  }

  // Create videos
  const existingVideo = await db.video.findFirst();
  if (!existingVideo) {
    await db.video.create({
      data: {
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        title: 'Nuestra Canción Eterna',
        published: true,
      },
    });
    console.log('Created video');
  }

  // Create canvas page
  const existingCanvas = await db.canvasPage.findFirst();
  if (!existingCanvas) {
    await db.canvasPage.create({
      data: {
        name: 'Recuerdos del Primer Encuentro',
        published: true,
      },
    });
    console.log('Created canvas page');
  }

  console.log('Seed complete!');
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
