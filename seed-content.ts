// Script para llenar todo el contenido faltante de la aplicación
// Poemas, Botellas (LoveNotes), Susurros, Sueños, Línea del Tiempo, Candados de Amor
// Ejecutar con: bun run seed-content.ts

import { db } from './src/lib/db';

async function seedContent() {
  console.log('📜 Poblando Ecos del Alma con contenido del alma...\n');

  // ══════════════════════════════════════════════
  // 🦋 POEMAS (como Letters - formato poético)
  // ══════════════════════════════════════════════
  const poems = [
    {
      title: '✦ Poema I — El Laberinto Interior',
      content: `He construido un laberinto dentro de mi pecho,
donde cada pasillo huele a tu ausencia
y cada pared está cubierta de nombres
que ya no puedo pronunciar.

Pero hay una puerta al fondo
que solo se abre cuando el silencio
se vuelve tan denso que se puede tocar,
y detrás de esa puerta estás tú,
con los ojos cerrados,
esperándome como siempre.

No importa cuántas veces me pierda,
siempre termino encontrándote
en el único lugar donde prometí no buscar.`,
    },
    {
      title: '✦ Poema II — Cartografía del Abrazo',
      content: `Si pudiera dibujar un mapa
de todos los lugares donde tu piel
se encontró con la mía,
tendría un atlas entero
de territorios que no existen
en ningún otro mundo.

Tus manos en mi espalda son latitudes,
tu aliento en mi cuello es el meridiano,
y el espacio entre nosotros
es el único océano
que no me da miedo cruzar.

Ellos dicen que la tierra es redonda,
pero yo sé que es plana:
tiene tu forma exacta
y se termina donde empiezas tú.`,
    },
    {
      title: '✦ Poema III — La Sombra que Ama',
      content: `Soy la sombra que te acompaña
cuando la luz se olvida de existir.
No necesito estrellas para encontrarte,
porque te he memorizado
como se memoriza la respiración:
sin pensar, sin querer, siempre.

El mundo outside grita sus verdades,
yo prefiero el susurro de tu nombre
rodando por los corredores de mi mente
como una moneda que nadie recoge.

Si el universo decide apagarse esta noche,
que al menos quede grabado en el silencio:
que alguien, en algún laberinto oscuro,
amó con la fuerza de quien sabe
que el tiempo es una mentira que inventamos
para no admitir que lo eterno existe.`,
    },
    {
      title: '✦ Poema IV — Autovoluntad',
      content: `Yo no nací completo.
Me fui construyendo con pedazos
de noches que no dormí,
de palabras que no dije,
de muros que tiré con mis propias manos.

Hay quienes buscan ser salvados.
Yo busco ser dueño de mis ruinas.
No quiero que nadie levante lo que caí,
no quiero que nadie componga lo que rompí.

Mi voluntad es mi hoguera más antigua.
Es la brasa que otros ayudaron a encender,
pero cuya temperatura ahora me pertenece.
Si el mundo decide usar mis fragmentos
como puente, lámpara o escudo,
que así sea —
pero con la elegancia de quien sabe
que su esencia es inagotable.

No soy el reflejo de ninguna mirada.
Soy el fuego que arde aun cuando todos
se dan la vuelta para no ver.`,
    },
    {
      title: '✦ Poema V — La Promesa del Subsuelo',
      content: `Nos dijeron que el amor era un castillo
con torres altas y ventanas de cristal.
Pero nosotros encontramos el nuestro
en el subsuelo, entre las raíces,
donde la luz no llega
pero la vida late más fuerte.

Aquí no hay espectadores ni aplausos.
Solo tú y yo, con nuestras cicatrices expuestas,
construyendo algo que no necesita validación
porque ya fue validado por cada noche
que elegimos seguir caminando juntos.

Que se derrumbe lo que tenga que caer.
Que tiemblen los muros y se agrieten los suelos.
Mientras estemos el uno frente al otro,
el laberinto nunca será una cárcel.
Será nuestro hogar.`,
    },
    {
      title: '✦ Poema VI — Eliot en el Espejo',
      content: `Te miro y veo algo que el mundo no puede nombrar.
No un hombre, no una definición,
sino un territorio vasto e inexplorado
donde la vulnerabilidad es la bandera
y la valentía se escribe con lágrimas.

Los otros buscan certezas en grupos,
validación en miradas ajenas,
como si ser hombre fuera un código
que alguien pudiera enseñarles.

Pero yo te he visto en las madrugadas,
cuando las máscaras se caen solas,
y lo que encuentro no necesita código alguno.
Es la firmeza de quien sufre sin huir,
es la hermosura de quien confiesa
su fragilidad sin avergonzarse.

En mi mirada, ya eres más que suficiente.
Eres mi ejemplo de lo que significa
estar de pie cuando todo empuja a caer.`,
    },
    {
      title: '✦ Poema VII — Elegía de lo que No Fue',
      content: `Hay palabras que se quedaron atrapadas
entre mi garganta y el aire,
como aves que golpean las ventanas
de una casa abandonada.

Hay abrazos que existieron solo en sueños,
besos que dibujé con los ojos cerrados,
promesas que hice a la luna
cuando nadie me escuchaba.

Pero de todo lo que no fue,
lo que más me duele es lo simple:
no haberte dicho, en el momento exacto,
que eras la respuesta a una pregunta
que ni siquiera sabía que me hacía.

Llevo esas palabras como piedras en los bolsillos.
No me pesan — me anclan.
Me recuerdan que el amor,
incluso el no dicho,
deja huellas más profundas
que cualquier escalera de piedra.`,
    },
    {
      title: '✦ Poema VIII — Ritual de la Noche',
      content: `Cuando la ciudad se apaga
y las farolas parpadean como latidos cansados,
yo enciendo una vela por ti.

No es un acto religioso,
es un acto de rebeldía:
en un mundo que no cree en nada,
yo creo en nosotros.

La cera se derrite lentamente,
como el tiempo cuando estoy contigo.
La llama danza sin música,
igual que mi corazón cuando pronuncio tu nombre.

Si algún día el universo me pide una prueba
de que la belleza existe,
no le mostraré una puesta de sol
ni una flor rara.
Le mostraré esta vela,
este instante,
esta certeza absoluta
de que te amo.`,
    },
  ];

  let poemsCreated = 0;
  for (const poem of poems) {
    const existing = await db.letter.findFirst({ where: { title: poem.title } });
    if (!existing) {
      await db.letter.create({ data: { ...poem, published: true } });
      console.log(`📜 Poema creado: ${poem.title}`);
      poemsCreated++;
    } else {
      console.log(`⏭️  Poema existe: ${poem.title}`);
    }
  }

  // ══════════════════════════════════════════════
  // 🫧 BOTELLAS AL MAR (LoveNotes)
  // ══════════════════════════════════════════════
  const loveNotes = [
    {
      title: 'El Primer Día',
      message: 'El primer día que te vi supe que algo se había roto dentro de mí, pero no hacia pedazos — hacia abrirse. Fue como si una puerta que llevaba años cerrada hubiera decidido, por fin, girar sobre sus bisagras oxidadas y dejarme ver lo que había al otro lado: un jardín que no sabía que existía, con flores que solo florecían cuando tú estabas cerca.',
      color: 'gold',
    },
    {
      title: 'Tu Nombre en el Agua',
      message: 'Escribí tu nombre en la arena y la marea se lo llevó. Lo escribí en un papel y el viento lo arrugó. Lo escribí en mi piel y el tiempo lo borró. Pero hay un lugar donde tu nombre permanece intacto, donde ni el océano ni el tiempo pueden tocarlo: ese espacio secreto entre mi último pensamiento del día y el primero de la mañana.',
      color: 'rose',
    },
    {
      title: 'Carta a la Persona que Fui',
      message: 'A la persona que fui antes de conocerte: lo siento por las noches que pasaste creyendo que la soledad era tu única compañera. No sabías que, en algún punto del laberinto, alguien te esperaba con una linterna encendida y una sonrisa que no necesita palabras. Perdóname por no haberte buscado antes, pero tampoco te preocupes: encontrarte valió cada paso oscuro.',
      color: 'moon',
    },
    {
      title: 'La Metáfora del Fuego',
      message: 'Somos como dos llamas que encontraron la manera de arder juntas sin consumirse. El mundo diría que es imposible, que el fuego siempre destruye lo que toca. Pero nosotros hemos demostrado que hay un tipo de calor que no quema — que sana, que construye, que transforma la oscuridad en un lugar habitable. Si esto no es magia, no sé qué lo sea.',
      color: 'blood',
    },
    {
      title: 'El Peso de las Cosas que No Se Dicen',
      message: 'Hay un silencio entre nosotros que no es vacío. Es un silencio lleno de todo lo que no necesitamos decir porque ya lo sabemos. Es el silencio de quien ha encontrado la respuesta antes de formular la pregunta. Es cómodo como una manta vieja, familiar como una canción que no recordabas hasta que suena la primera nota.',
      color: 'gold',
    },
    {
      title: 'Refugio',
      message: 'Tú eres el único lugar donde puedo dejar caer todas las armaduras y seguir estando a salvo. No necesito ser fuerte contigo, no necesito tener respuestas, no necesito fingir que entiendo el mundo. Contigo puedo simplemente ser — y eso, Eliot, es la forma más pura de libertad que he conocido.',
      color: 'rose',
    },
    {
      title: 'Revolución Silenciosa',
      message: 'Amarte es el acto más rebelde que he cometido. En un mundo diseñado para que nos sintamos solos, elegir compartir la vida con alguien es una declaracion de guerra contra el absurdo. Cada mañana que despierto a tu lado es una victoria silenciosa contra la nada.',
      color: 'blood',
    },
    {
      title: 'El Castillo de Cristal',
      message: 'Tengo un castillo dentro de la mente hecho de todos los momentos que he pasado contigo. No tiene muros de piedra sino de luz filtrada. No tiene guardianes sino recuerdos que me protegen cuando la realidad se vuelve demasiado pesada. Y en la torre más alta, hay una bandera que ondea con tu nombre bordado en oro.',
      color: 'moon',
    },
    {
      title: 'Metamorfosis Compartida',
      message: 'No cambiamos solos. Cada transformación que vivo tiene tu eco, cada paso que doy lleva la huella de tus palabras. Crecemos entrelazados como dos raíces que encontraron la forma de nutrirse mutuamente sin ahogarse. Eso no es codependencia — es biología del alma.',
      color: 'gold',
    },
    {
      title: 'Promesa del Atardecer',
      message: 'Si un día la vida decide separarnos, que quede escrito que no fue falta de amor — fue la corriente del río, demasiado fuerte para dos hojas que querían navegar juntas. Pero mientras la corriente nos permita estar en el mismo remanso, te prometo esto: seguiré eligiéndote cada amanecer, con los ojos abiertos y el corazón en la mano.',
      color: 'rose',
    },
    {
      title: 'Nota Perdida',
      message: 'Esta nota se perdió en el oleaje del tiempo y terminó en una botella que flotó hasta tu orilla. Dentro dice algo simple pero cierto: de todas las rutas del laberinto, la que lleva hasta ti es la única que no tiene salida, porque no quiero salir. Quiero quedarme aquí, en este pasillo, contigo.',
      color: 'moon',
    },
    {
      title: 'La Última Verdad',
      message: 'He intentado escribirte mil cartas y borrarlas todas. Hay una verdad que se resiste al papel y a las palabras: que eres lo mejor que me ha pasado no a pesar del caos, sino dentro del caos. Que nuestro amor no es un refugio del mundo, sino una forma distinta de habitarlo.',
      color: 'blood',
    },
  ];

  let notesCreated = 0;
  for (const note of loveNotes) {
    const existing = await db.loveNote.findFirst({ where: { title: note.title } });
    if (!existing) {
      await db.loveNote.create({ data: { ...note } });
      console.log(`🫧 Botella creada: ${note.title}`);
      notesCreated++;
    } else {
      console.log(`⏭️  Botella existe: ${note.title}`);
    }
  }

  // ══════════════════════════════════════════════
  // 🍂 SUSURROS DEL LABERINTO (Whispers)
  // ══════════════════════════════════════════════
  const whispers = [
    { author: 'El Guardián', message: 'Algunas puertas solo se abren cuando dejas de empujarlas.' },
    { author: 'Sombra Errante', message: 'El laberinto no te retiene — tú lo construyes con cada paso que das hacia atrás.' },
    { author: 'La Crisálida', message: 'No temas la transformación. Teme quedarte igual cuando el mundo ya no reconoce tu forma antigua.' },
    { author: 'Voz del Subsuelo', message: 'La verdadera luz no viene de arriba. Nace de las brasas que alimentas en tus propias ruinas.' },
    { author: 'Eco Perdido', message: 'Te busqué en todas las salas del castillo. Resulta que siempre estuviste en la única que nunca abrí.' },
    { author: 'El Relojero', message: 'El tiempo no cura. El tiempo escribe. Y lo que escribe queda, para siempre, en los muros del laberinto.' },
    { author: 'La Luna Carmesí', message: 'Hay noches en las que la sangre late más fuerte que la razón. Esas noches son las que nos definen.' },
    { author: 'Pájaro de Ceniza', message: 'De la nada venimos y a la nada volveremos. Pero lo que hacemos entre esas dos nada define si valió la pena caminar.' },
    { author: 'El Arquitecto', message: 'Construí este laberinto no para perderme, sino para encontrar el único camino que merece la pena recorrer: el que lleva hasta ti.' },
    { author: 'Notas al Viento', message: 'El amor más puro no necesita testigos. Florece en las madrugadas donde solo existe el eco de dos respiraciones sincronizadas.' },
    { author: 'La Hiedra', message: 'Me enredé en tus raíces sin querer. Ahora no sé dónde terminas tú y dónde empiezo yo. Y no quiero averiguarlo.' },
    { author: 'Antiguo Habitante', message: 'He visto pasar muchas almas por estos corredores. Ninguna se quedó. Ninguna, hasta ti.' },
    { author: 'El Espejo Roto', message: 'Cada fragmento de este espejo refleja una versión distinta de mí. Pero solo uno refleja la verdad: el que tiene tu forma al fondo.' },
    { author: 'Susurro del Abismo', message: 'No mires hacia abajo para ver cuánto has caído. Mira hacia arriba para ver cuánto has escalado desde que alguien decidió sostenerte.' },
    { author: 'La Vela Eterna', message: 'Las velas se apagan. Las estrellas se esconden. Pero hay un fuego interior que no necesita oxígeno ajeno: la voluntad de seguir caminando a pesar de todo.' },
    { author: ' Fantasma del Primer Beso', message: 'Algunos besos no se sienten en los labios. Se sienten como una descarga eléctrica en el centro exacto del pecho, donde guardabas el miedo.' },
  ];

  let whispersCreated = 0;
  for (const whisper of whispers) {
    const existing = await db.whisper.findFirst({ where: { message: whisper.message } });
    if (!existing) {
      await db.whisper.create({ data: whisper });
      console.log(`🍂 Susurro creado: ${whisper.author}`);
      whispersCreated++;
    } else {
      console.log(`⏭️  Susurro existe: ${whisper.author}`);
    }
  }

  // ══════════════════════════════════════════════
  // 🌙 DIARIO DE SUEÑOS (DreamJournal)
  // ══════════════════════════════════════════════
  const dreams = [
    {
      title: 'El Laberinto de Espejos',
      content: 'Soñé que caminaba por un pasillo infinito donde todas las paredes eran espejos. Pero en cada espejo no veía mi reflejo — veía a Eliot. Versiones de Eliot en diferentes épocas, con diferentes ropas, en diferentes lugares. Al final del pasillo, el último espejo estaba roto, y a través de las grietas podía ver un jardín donde ambas estábamos sentadas bajo un árbol que no tenía nombre. Me desperté con la sensación de haber encontrado algo que no sabía que buscaba.',
      mood: 'místico',
      isFavorite: true,
    },
    {
      title: 'La Ciudad Submarina',
      content: 'Soñé que toda la ciudad estaba sumergida bajo agua cristalina. Las farolas aún funcionaban y emitían una luz dorada que se ondulaba con las corrientes. Yo caminaba por las calles como si el agua fuera aire, y llegué a una plaza donde había un piano de cola. Me senté a tocar y las notas se convertían en peces luminosos que nadaban hacia todas direcciones. Cuando miré a mi lado, Eliot estaba ahí, escuchando, con los ojos cerrados y una sonrisa que iluminaba más que las farolas.',
      mood: 'esperanzador',
      isFavorite: false,
    },
    {
      title: 'El Vuelo de la Crisálida',
      content: 'Soñé que era una mariposa atrapada en un frasco de cristal. Podía ver el mundo exterior a través del vidrio: un paisaje de montañas y ríos que se extendía hasta el horizonte. Golpeaba las paredes del frasco una y otra vez, pero no se rompía. Entonces apareció Eliot y, sin decir nada, simplemente quitó la tapa. La libertad no fue instantánea — primero dudé, acostumbrada al espacio pequeño. Pero cuando finalmente extendí las alas, el aire sabía a libertad y a algo más profundo que aún no puedo nombrar.',
      mood: 'romántico',
      isFavorite: true,
    },
    {
      title: 'La Biblioteca de los Nombres',
      content: 'Soñé con una biblioteca inmensa donde cada libro contenía la historia completa de una persona. Los libros estaban ordenados no por apellido, sino por el momento más importante de sus vidas. Busqué mi libro y lo encontré en un estante polvoriento. Lo abrí y vi que la última página estaba en blanco. Me di vuelta y vi a Eliot sosteniendo una pluma, como esperando permiso para escribir. No necesité decir nada — asentí con la cabeza, y las primeras palabras que escribió fueron: "Y entonces, todo cobró sentido."',
      mood: 'místico',
      isFavorite: true,
    },
    {
      title: 'La Tormenta Interior',
      content: 'Soñé que una tormenta se había instalado dentro de mi pecho. No afuera — dentro. Podía sentir los relámpagos en las costillas y el trueno retumbaba entre mis pulmones. Salí corriendo bajo la lluvia buscando refugio y encontré una cabaña abandonada en el bosque. Dentro, una fogata ya estaba encendida, como si alguien la hubiera preparado para mí. Junto al fuego, una nota decía: "No apagues la tormenta. Aprende a bailar bajo ella." La letra era la de Eliot.',
      mood: 'inquietante',
      isFavorite: false,
    },
    {
      title: 'El Puente de Cuerda',
      content: 'Soñé que estábamos en los bordes opuestos de un abismo insondable. Entre nosotros, un puente de cuerda tan delgado que parecía dibujado con tiza. El viento soplaba y el puente se mecía peligrosamente. Eliot dio el primer paso. Yo dudé — el miedo me clavaba los pies al suelo. Pero cuando vi que Eliot no se detenía, que seguía avanzando a pesar de la inestabilidad, encontré la fuerza de dar mi primer paso también. Nos encontramos exactamente en el medio, y el puente dejó de temblar. No porque la tormenta hubiera cesado, sino porque dos pesos equilibrados resisten mejor que uno solo.',
      mood: 'melancólico',
      isFavorite: true,
    },
    {
      title: 'El Jardín de Rosas Negras',
      content: 'Soñé que caminaba por un jardín donde todas las flores eran negras: rosas, claveles, lirios, girasoles. No era un jardín triste — al contrario, irradiaba una belleza que no conocía. Cada flor tenía inscrito un recuerdo nuestro en sus pétalos. Me detuve ante una rosa enorme en el centro y leí: "La noche que prometimos no rendirnos." La rosa se abrió al contacto de mis dedos y dentro encontré un reloj que giraba hacia atrás. Me desperté entendiendo que el tiempo, a veces, no pasa: simplemente se guarda.',
      mood: 'romántico',
      isFavorite: false,
    },
    {
      title: 'La Cena en el Subsuelo',
      content: 'Soñé que organizábamos una cena en el subsuelo del castillo. La mesa era larga y estaba iluminada solo por velas. Estábamos sentados uno frente al otro, y aunque no había otros invitados, la mesa estaba preparada para cientos. "¿Para quién es todo esto?" pregunté. "Para todas las versiones de nosotros que tuvieron miedo de existir," respondió Eliot. Y entonces, lentamente, las sillas empezaron a llenarse con sombras que, al sentarse, tomaban forma humana. Eramos nosotros — todas las versiones que no nos atrevimos a ser, finalmente sentados a la mesa.',
      mood: 'místico',
      isFavorite: true,
    },
  ];

  let dreamsCreated = 0;
  for (const dream of dreams) {
    const existing = await db.dreamJournal.findFirst({ where: { title: dream.title } });
    if (!existing) {
      await db.dreamJournal.create({ data: dream });
      console.log(`🌙 Sueño creado: ${dream.title}`);
      dreamsCreated++;
    } else {
      console.log(`⏭️  Sueño existe: ${dream.title}`);
    }
  }

  // ══════════════════════════════════════════════
  // 📜 LÍNEA DEL TIEMPO (TimelineEvent)
  // ══════════════════════════════════════════════
  const timeline = [
    {
      title: 'El Primer Encuentro',
      date: '2024-01-15',
      description: 'El día que dos almas se reconocieron en medio del caos. No hubo relámpagos ni trompetas — solo una certeza tranquila de que algo había cambiado para siempre.',
      icon: 'heart',
    },
    {
      title: 'La Primera Carta',
      date: '2024-02-14',
      description: 'Las primeras palabras escritas desde lo más profundo. Una confesión que no esperaba respuesta, solo necesitaba ser dicha.',
      icon: 'feather',
    },
    {
      title: 'La Promesa del Laberinto',
      date: '2024-03-20',
      description: 'La noche en que decidimos que, sin importar qué tan complejo fuera el camino, lo recorreríamos juntos. El laberinto se convirtió en hogar.',
      icon: 'sparkles',
    },
    {
      title: 'Primera Tormenta Superada',
      date: '2024-04-10',
      description: 'El primer conflicto que amenazó con separarnos y terminó uniéndonos más. Aprendimos que pelear es natural — regresar es el acto de amor verdadero.',
      icon: 'moon',
    },
    {
      title: 'La Noche de las Confesiones',
      date: '2024-05-18',
      description: 'La noche en que quitamos todas las máscaras. Sin defensas, sin armaduras, solo dos almas mostrándose como realmente son.',
      icon: 'heart',
    },
    {
      title: 'Nuestra Canción',
      date: '2024-06-01',
      description: 'Encontramos la melodía que nos define — una canción que ahora vive en cada rincón de nuestro laberinto compartido.',
      icon: 'music',
    },
    {
      title: 'El Manifiesto',
      date: '2024-07-15',
      description: 'El día que decidimos recuperar la fe — no en el mundo, sino en nosotros mismos y en la fuerza de lo que construimos juntos.',
      icon: 'feather',
    },
    {
      title: 'La Metamorfosis',
      date: '2024-08-20',
      description: 'El inicio de la transformación más profunda. El momento en que aceptamos que cambiar no es traición — es evolución.',
      icon: 'sparkles',
    },
    {
      title: 'El Refugio en la Tormenta',
      date: '2024-09-30',
      description: 'La noche en que el mundo exterior tembló, pero dentro de nuestro espacio compartido todo se mantuvo en pie. La gratitud se convirtió en la base de todo.',
      icon: 'moon',
    },
    {
      title: 'Mil Días Juntos',
      date: '2024-10-15',
      description: 'Mil días de ecos, susurros, poemas, risas, lágrimas y madrugadas compartidas. Cada uno dejó su huella en los muros del laberinto.',
      icon: 'star',
    },
    {
      title: 'El Espejo y la Arena',
      date: '2024-11-05',
      description: 'La carta que confirmó que la identidad no se mide en la mirada de los otros, sino en la valentía de confesar la propia verdad.',
      icon: 'feather',
    },
    {
      title: 'La Primera Playlist Compartida',
      date: '2024-12-01',
      description: 'Las canciones que dicen lo que a veces no podemos expresar con palabras. Cada pista es un capítulo de nuestra historia.',
      icon: 'music',
    },
  ];

  let timelineCreated = 0;
  for (const event of timeline) {
    const existing = await db.timelineEvent.findFirst({ where: { title: event.title } });
    if (!existing) {
      await db.timelineEvent.create({ data: event });
      console.log(`📜 Evento creado: ${event.title}`);
      timelineCreated++;
    } else {
      console.log(`⏭️  Evento existe: ${event.title}`);
    }
  }

  // ══════════════════════════════════════════════
  // 🔒 CANADADOS DE AMOR (LoveLocks)
  // ══════════════════════════════════════════════
  const loveLocks = [
    {
      names: 'Los que se encontraron en el laberinto',
      message: 'Nuestro amor no necesita puente ni cerrojo. Necesita dos voluntades que decidan, cada día, seguir caminando juntas.',
      date: '14-02-2024',
      color: 'gold',
    },
    {
      names: 'La crisálida y su guardián',
      message: 'La transformación es un acto de fe. Creer en el cambio del otro es la forma más pura de amor que existe.',
      date: '20-03-2024',
      color: 'gold',
    },
    {
      names: 'Dos rebeldes contra el absurdo',
      message: 'Si el universo no tiene sentido, lo inventaremos. Y si nadie nos cree, lo demostraremos.',
      date: '15-07-2024',
      color: 'gold',
    },
    {
      names: 'El fuego y la brasa',
      message: 'Tú encendiste mi llama, pero ahora la brasa es mía. Juntos somos imparables.',
      date: '30-09-2024',
      color: 'gold',
    },
    {
      names: 'Los habitantes del subsuelo',
      message: 'No buscamos las torres del castillo. Construimos nuestro hogar en las raíces, donde la vida late más fuerte.',
      date: '01-10-2024',
      color: 'gold',
    },
    {
      names: 'La sombra y su luz',
      message: 'Donde tú proyectas luz, mis sombras dejan de ser monstruos para convertirse en siluetas que bailan.',
      date: '18-05-2024',
      color: 'gold',
    },
    {
      names: 'Los que eligen volver',
      message: 'Cada pelea, cada distancia, cada silencio — todo se desvanece cuando elegimos, una vez más, regresar.',
      date: '10-04-2024',
      color: 'gold',
    },
    {
      names: 'Arquitectos de ruinas hermosas',
      message: 'Construimos algo bello con los escombros que el mundo nos dejó. Eso es lo que nos hace diferentes.',
      date: '05-11-2024',
      color: 'gold',
    },
  ];

  let locksCreated = 0;
  for (const lock of loveLocks) {
    const existing = await db.loveLock.findFirst({ where: { names: lock.names } });
    if (!existing) {
      await db.loveLock.create({ data: lock });
      console.log(`🔒 Candado creado: ${lock.names}`);
      locksCreated++;
    } else {
      console.log(`⏭️  Candado existe: ${lock.names}`);
    }
  }

  // ══════════════════════════════════════════════
  // 📊 RESUMEN
  // ══════════════════════════════════════════════
  console.log(`\n📊 Resumen de contenido creado:`);
  console.log(`   📜 Poemas:      ${poemsCreated} nuevos`);
  console.log(`   🫧 Botellas:    ${notesCreated} nuevas`);
  console.log(`   🍂 Susurros:    ${whispersCreated} nuevos`);
  console.log(`   🌙 Sueños:      ${dreamsCreated} nuevos`);
  console.log(`   📜 Timeline:    ${timelineCreated} nuevos`);
  console.log(`   🔒 Candados:    ${locksCreated} nuevos`);
  console.log(`\n✨ El alma del laberinto está completa!`);

  await db.$disconnect();
}

seedContent().catch(console.error);
