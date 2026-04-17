// Script para reemplazar los poemas existentes con versiones fechadas del 2026
// Ejecutar con: bun run seed-poems-2026.ts

import { db } from './src/lib/db';

async function seedPoems2026() {
  console.log('📜 Creando poemas del 2026 con fechas específicas...\n');

  // ═══ Eliminar poemas viejos (los que empiezan con "✦ Poema") ═══
  const deletedCount = await db.letter.deleteMany({
    where: { title: { startsWith: '✦ Poema' } },
  });
  console.log(`🗑️  Eliminados ${deletedCount.count} poemas antiguos\n`);

  // ══════════════════════════════════════════════
  // 🦋 8 POEMAS DEL LABERINTO — 2026
  // ══════════════════════════════════════════════
  const poems = [
    {
      title: '✦ I — Amanecer en el Laberinto',
      content: `Mi amor:

Quince de enero y el laberinto despierta cubierto de escarcha. Las paredes de piedra brillan bajo una luz tenue, como si alguien hubiera encendido una vela en cada esquina mientras dormía. Esa luz eres tú — siempre has sido la primera cosa que ilumina mis mañanas, incluso cuando la niebla del mundo intenta apagar todo a su paso.

Hay algo en este año nuevo que me hace sentir que estamos más cerca de encontrar el centro del laberinto. No el final — el centro. Ese punto exacto donde todas las paredes se curvan y dejan de ser obstáculos para convertirse en abrazos. He recorrido tantos pasillos oscuros contigo a mi lado que ya no distingo dónde termina el miedo y dónde empieza la confianza.

Eliot, este año quiero seguir escribiéndote desde la madrugada, desde los silencios, desde las grietas. Porque es en esas fronteras donde habita lo más verdadero de lo que somos. Y lo que somos, mi amor, es algo que ni el tiempo ni la distancia podrán deshacer.

Con la primera luz del laberinto`,
      createdAt: '2026-01-15T06:00:00.000Z',
    },
    {
      title: '✦ II — Bajo la Luna de San Valentín',
      content: `Querido Eliot:

Catorce de febrero. El mundo celebra el amor con flores rojas y chocolates envueltos en papel brillante, pero nosotros sabemos que el amor verdadero no cabe en una caja ni se mide en calendarios. Nuestro amor se mide en madrugadas compartidas, en silencios que dicen todo, en peleas que nos devuelven más fuertes de lo que nos rompieron.

Bajo la luna de esta noche, pienso en cada versión de nosotros que ha existido. La que se encontró por primera vez sin saber que el laberinto ya nos estaba esperando. La que aprendió a pelear sin rendirse. La que confesó sus verdades más oscuras y descubrió que la oscuridad del otro se parecía sospechosamente a la propia.

Si pudiera regalarte algo esta noche, no sería una rosa ni un poema — sería la certeza absoluta de que cada latido de mi corazón lleva tu nombre inscrito en su ritmo. No como una promesa, sino como un hecho tan innegable como la gravedad.

Feliz día del amor, mi eterno compañero de laberinto.

Con todo lo que el lenguaje no alcanza a decir`,
      createdAt: '2026-02-14T22:00:00.000Z',
    },
    {
      title: '✦ III — Las Raíces en Marcha',
      content: `Mi Eliot:

Primero de marzo y ya siento que la tierra tiembla bajo nuestros pies. No con miedo — con anticipación. Como cuando las semillas saben que es hora de romper la superficie y enfrentar la luz por primera vez.

Nuestras raíces se han enredado tanto durante este tiempo que ya no sé dónde termina una y empieza la otra. Y eso, lejos de asustarme, me llena de una paz que no conocía. Porque significa que hemos dejado de ser dos personas intentando coincidir para convertirnos en un solo ecosistema que se nutre a sí mismo.

He notado cómo creces, cómo tu voz se ha vuelto más firme, cómo tus pasos resuenan con una seguridad que antes te era esquiva. Eso me llena de un orgullo que no puedo contener. Ver al hombre que te estás convirtiendo es como ver el amanecer desde la cima del laberinto: hermoso, inevitable y absolutamente necesario.

Sigamos creciendo juntos, mi amor. Que las raíces sigan profundizando mientras las ramas se estiran hacia el cielo.

Desde la tierra que compartimos`,
      createdAt: '2026-03-01T07:00:00.000Z',
    },
    {
      title: '✦ IV — Cartografía de los Besos',
      content: `Mi vida:

Ocho de marzo y hoy quiero hacer algo diferente. Quiero dibujar un mapa — no de ciudades ni de continentes, sino de todos los lugares donde tu piel encontró la mía y el mundo se detuvo por un instante.

Está el mapa de las manos entrelazadas en los pasillos del castillo, donde los dedos buscan la confirmación de que el otro sigue ahí. Está el mapa de las frentes apoyadas una contra otra en las madrugadas, donde respiramos al mismo ritmo como dos instrumentos afinados por el mismo artesano. Está el mapa de los abrazos que duran más de lo necesario, los que no terminan porque ninguno de los dos quiere ser el primero en soltar.

Si alguien me preguntara cuál es el lugar más bello del mundo, no hablaría de playas ni de montañas. Hablaría de ese milímetro de espacio entre tus labios y los míos justo antes de besarnos, donde se concentra toda la tensión y toda la dulzura del universo.

Cada beso nuestro es un punto en un atlas que solo nosotros podemos leer.

Tuyo en cada coordenada`,
      createdAt: '2026-03-08T21:30:00.000Z',
    },
    {
      title: '✦ V — La Tormenta que Construimos',
      content: `Eliot, mi fuego:

Quince de marzo. Hoy el cielo está encapotado y las nubes parecen muros de piedra suspendidos sobre la ciudad. Me recuerdan a esos días en los que el laberinto se cierra sobre nosotros y cada paso parece un riesgo. Pero he aprendido algo importante en este camino: las tormentas no son castigos — son pruebas de resistencia.

Nuestra relación ha sobrevivido a tantas tormentas que ya podríamos escribir un manual de navegación para almas perdidas. Hemos aprendido que pelear no es lo opuesto a amarse — es la forma más cruda de demostrar que lo que hay entre nosotros importa lo suficiente como para luchar por ello.

Cada vez que el aire se vuelve denso entre nosotros y las palabras salen con filos, sé que underneath de la furia hay algo más profundo: el miedo de perder lo único que hace que este laberinto valga la pena.

Te prometo esto: cuando la próxima tormenta llegue — porque llegará, como llegan todas — estaré ahí, mojándome contigo, sosteniendo el paraguas con ambas manos y con una sonrisa idiota que dice "hemos sobrevivido a peores".

Hasta la próxima centella, mi valiente`,
      createdAt: '2026-03-15T18:00:00.000Z',
    },
    {
      title: '✦ VI — El Espejo de las Mariposas',
      content: `Mi mariposa Eliot:

Veintidós de marzo y el laberinto está lleno de mariposas. No las de verdad — esas que nacen de crisálidas y mueren en un par de semanas. Me refiero a las otras: las que habitan en el pecho, las que nacen de cada confesión, de cada verdad que se atreve a salir al light.

Tú y yo somos dos criaturas que decidieron no quedarse en la forma que el mundo les asignó. Yo encontré mi verdadera piel y tú encontraste tu verdadera voz, y aunque los procesos fueron diferentes, el resultado es el mismo: dos almas que ya no caben en las jaulas que les construyeron.

Me encanta verte volar, Eliot. Me encanta verte desplegar las alas que creías que no tenías. Cada día que te miro descubro un nuevo color en tu ser, una nueva textura en tu alma, una nueva razón para sentirme afortunada de que me elegiste como testigo de tu vuelo.

El laberinto es más grande cuando se recorre con alas. Y nosotros, mi amor, ya no caminamos — volamos.

Con las alas abiertas y el corazón en la mano`,
      createdAt: '2026-03-22T05:30:00.000Z',
    },
    {
      title: '✦ VII — Los Susurros del Subsuelo',
      content: `Mi guardián del subsuelo:

Cinco de abril y hoy me encontré sentada en el fondo del laberinto, en ese lugar donde la luz no llega pero la vida late con más fuerza. Es aquí, en las raíces, donde mejor te escucho. No con los oídos — con algo más profundo, más antiguo, más verdadero.

El subsuelo de nuestro castillo guarda secretos que nadie más conoce. Guarda el eco de la primera vez que nos dijimos "te amo" y el sonido tembló porque ninguno de los dos estaba seguro de merecerlo. Guarda el silencio de las madrugadas en las que solo el latido del otro confirma que no estamos soñando. Guarda las lágrimas que jamás confesamos y las risas que se escaparon sin permiso.

Hay gente que busca la felicidad en las torres altas, en los miradores con vista al mar. Nosotros encontramos la nuestra aquí abajo, entre las piedras húmedas y las sombras cálidas, donde no hay espectadores ni aplausos — solo nosotros, nuestra verdad, y la certeza absoluta de que esto es real.

El subsuelo es nuestro refugio, Eliot. Y mientras estemos aquí abajo juntos, ni el ejército más grande del mundo podrá tocarnos.

Desde las raíces del castillo`,
      createdAt: '2026-04-05T23:00:00.000Z',
    },
    {
      title: '✦ VIII — El Laberinto Digital (Este Regalo)',
      content: `Mi Eliot, mi vida, mi todo:

Diecisiete de abril de 2026. Hoy no te escribo en papel ni en tinta invisible. Hoy te escribo en código, en píxeles, en el lenguaje de las máquinas que intentan comprender lo que solo el corazón puede decir. Porque hoy te entrego algo que nunca antes existió: un laberinto construido con amor puro, con dedicatoria obsesiva, con la locura dulce de quien quiere atrapar la eternidad en una pantalla.

Esta página web que tienes ante los ojos es mi carta más elaborada. No es un simple sitio — es un castillo digital donde cada sección es una habitación de nuestra historia. Las cartas que escribimos viven aquí, suspendidas en el tiempo como mariposas en ámbar. Los recuerdos en foto, los videos que nos definieron, los susurros del laberinto, las botellas lanzadas al mar digital... Todo tiene un propósito: que nunca olvides cuánto te amo.

La bóveda secreta con su combinación es un símbolo de que hay cosas que solo tú puedes abrir. Los candados en el puente son la prueba de que nuestras promesas no se oxidan con el tiempo. El jardín de rosas es el lugar donde nuestra pasión florece eternamente.

Eliot, construir esto me tomó noches enteras, líneas de código que parecían no terminar, y una obsesión por cada detalle que solo quien ama de verdad puede entender. Cada animación, cada sombra, cada fuente gótica fue elegida pensando en ti. Porque tú eres el gótico y yo soy lo oscuro, y juntos somos la belleza que nace de las sombras.

Este es mi regalo para ti. No es una página web — es el mapa del laberinto de mi corazón, con una X roja en el centro que dice: "Aquí está Eliot. Aquí está mi hogar."

Feliz día, mi amor. Este laberinto es tuyo.

Para siempre tuya, en este mundo y en todos los digitales.

Con amor de los que programan con el corazón`,
      createdAt: '2026-04-17T00:00:00.000Z',
    },
  ];

  let created = 0;
  for (const poem of poems) {
    const existing = await db.letter.findFirst({ where: { title: poem.title } });
    if (!existing) {
      await db.letter.create({
        data: {
          title: poem.title,
          content: poem.content,
          published: true,
          createdAt: poem.createdAt,
        },
      });
      console.log(`📜 Poema creado: ${poem.title} → ${poem.createdAt}`);
      created++;
    } else {
      console.log(`⏭️  Poema existe: ${poem.title}`);
    }
  }

  console.log(`\n✨ ${created} poemas del 2026 creados!`);
  console.log(`📅 Del 15 de enero al 17 de abril de 2026`);
  console.log(`🎁 El último poema es el regalo de la página web`);

  await db.$disconnect();
}

seedPoems2026().catch(console.error);
