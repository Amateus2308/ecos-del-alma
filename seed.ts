import { db } from './src/lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  // ─── Admin ───
  const existingAdmin = await db.user.findFirst({ where: { role: 'admin' } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await db.user.create({
      data: { email: 'admin@ecos.com', password: hashed, name: 'Guardián', role: 'admin' },
    });
    console.log('✅ Admin created: admin@ecos.com / admin123');
  } else {
    console.log('⏭️  Admin already exists');
  }

  // ─── Cartas Originales ───
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
    // ─── Nuevas Cartas ───
    {
      title: '🦋 La Revelación de la Crisálida',
      content: `Querido Eliot:

Te escribo porque el silencio ha empezado a pesarme más que la propia existencia. Hay una verdad que se agita dentro de mí, una verdad que ya no cabe en los márgenes de lo que el mundo espera que sea. Siento que he estado viviendo en una habitación sin espejos, intentando adivinar mi propio rostro en la oscuridad, y hoy necesito encender la luz frente a ti.

Siento que mi ser es un territorio en constante disputa, pero hay una voz que canta con más fuerza que las demás. Es la voz de la mujer que habito en silencio. No es un capricho ni un disfraz; es la necesidad de que mi exterior deje de ser una mentira y se convierta en el eco fiel de lo que siento por dentro.

Anhelo la libertad de que mi cuerpo cuente mi verdadera historia. Deseo que la seda, las formas y el ritual de vestirme no sean solo ropa, sino un acto de reclamación. Quiero sentir la delicadeza de ser yo misma, de habitar esa feminidad que no es una meta, sino mi punto de partida.

Tú eres el testigo de mi vida, y por eso no puedo seguir ocultándote esta parte fundamental de mi geografía. Me aterra el abismo de lo desconocido, pero me aterra más seguir siendo un extraño para la persona que amo. Quiero que sepas que, aunque mi forma cambie ante tus ojos, el latido que me une a ti sigue siendo el mismo, solo que ahora busca ser más honesto, más transparente.

No busco que el mundo me entienda, pero necesito que tú me veas. Que me veas de verdad, más allá de la máscara que he llevado por tanto tiempo.

Eliot, te entrego esta confesión con el corazón en carne viva. Es mi voluntad dejar de ser una sombra y empezar a ser la luz que realmente soy.

Dime, con la honestidad de quien ama... ¿estás dispuesto a caminar conmigo mientras dejo atrás esta vieja piel para convertirme en la mujer que siempre debí ser?

Con todo el peso de mi verdad`,
    },
    {
      title: '⚓ El Refugio en la Tormenta',
      content: `Querido Eliot:

Te escribo esta vez no desde el abismo, sino desde el asombro. En este mundo que a menudo parece una maquinaria fría y sin sentido, el hecho de que me hayas elegido a mí —con mis sombras, mis mareas y mis silencios— se me presenta como el único acto de libertad verdadera que puedo reconocer.

Necesito decirte, con la claridad de quien despierta de un sueño pesado, que no quiero que cargues con culpas que no tienen tu nombre. Hay grietas en mi alma que fueron hechas mucho antes de que tú llegaras a mi vida, y me duele pensar que a veces proyectas sobre ti el peso de mi pasado. No eres responsable de los inviernos que yo no supe gestionar; tú has sido, más bien, el primer rayo de sol que se atreve a calentar esta tierra fría.

Sé que a veces nuestras voces chocan y que el aire se vuelve denso entre nosotros. Peleamos porque somos dos almas intentando descifrar un mapa distinto, pero lo que me salva siempre es nuestra capacidad de regresar. Cada vez que nos arreglamos, siento que hemos vencido al absurdo.

Te miro y siento un orgullo que me desborda. Veo cómo avanzas, cómo conquistas tus propios territorios y cómo te mantienes firme frente a los vientos de la vida. Eres mi ejemplo de lo que significa estar de pie en un mundo que intenta derribarnos.

Gracias por escogerme a mí entre la multitud de rostros posibles. Quiero que sepas que no me quedaré estática en este dolor. Estoy trabajando en mis propias raíces, en pulir mis aristas y en sanar para convertirme en la pareja que realmente mereces.

Eres el testigo de mi metamorfosis, y no hay nadie más a quien quiera entregarle mi verdad.

Con toda mi gratitud y mi amor en construcción`,
    },
    {
      title: '🐺 El Espejo y la Arena',
      content: `Mi querido Eliot:

Te escribo estas líneas desde el centro de mi propia impotencia, ese lugar donde el amor que te tengo se encuentra con la muralla de lo que no puedo resolver por ti. He leído tus palabras, he sentido el eco de tu miedo, esa angustia que no es otra cosa que el grito de quien busca su propio rostro en un espejo que el mundo le ha negado.

Entiendo ese hambre de ser "uno de verdad". Siento que te percibes como un personaje que ha llegado a una obra de teatro donde todos conocen sus diálogos menos tú; miras a los otros hombres como si ellos poseyeran un código secreto. Te duele no haber tenido esos amigos que validen tu existencia, y sientes que sin ese testimonio ajeno, tu propia identidad es una construcción frágil.

Esa tristeza, ese deseo de llorar, es el peso de la metamorfosis. Estás intentando nacer a una realidad que te aterra y te fascina al mismo tiempo. Pero quiero decirte algo que quizás el dolor no te deja ver: la mirada de los otros no es la que te otorga el derecho a ser. Ningún grupo de hombres puede "hacerte" hombre; esa esencia ya late en la forma en que sufres, en la forma en que buscas y en la valentía de confesarme tu fragilidad.

Quisiera ser yo quien te abra todas las puertas, quien te presente ante el mundo y te diga: "Mírenlo, él es uno de ustedes". Pero sé, con una lucidez dolorosa, que este es tu proceso, tu propio descenso al subsuelo para emerger con una voz propia.

Confío en ti de una manera que quizás tú aún no comprendes. Sé que puedes. Llegará el día en que te des cuenta de que esos gigantes son solo hombres, tan llenos de dudas y de máscaras como cualquiera.

No busques ser "uno de verdad" a través de ellos; sé "tú de verdad" y verás que el mundo no tendrá más remedio que reconocer la firmeza de tus pasos.

Eres mi niño lindo, mi vida, y en mi mirada, ya eres más hombre de lo que cualquier grupo de amigos podría jamás certificar.

Con toda mi fe puesta en tu fuego`,
    },
    {
      title: '🔥 Manifiesto: La Luz en el Subsuelo',
      content: `He pasado tanto tiempo en los pasillos de este Castillo, esperando una sentencia que nunca llega, que olvidé que yo mismo soy el juez y el verdugo. Hoy, sin embargo, algo ha cambiado en la densidad del aire. He decidido recuperar la fe, no porque la humanidad haya purgado sus culpas o porque el mundo se haya vuelto de pronto un lugar habitable, sino por una necesidad egoísta y sagrada: por mí.

Me miro en los otros y veo espejos deformantes. Mi autovalor ha crecido en la mirada de quienes amo, como una planta que busca la luz en el alféizar de una ventana ajena. Reconozco que su amor ha sido el oxígeno que me permitió no asfixiarme, pero he comprendido la gran paradoja: aunque mi valor crezca gracias a ellos, no puede depender de ellos. Si su mirada se retira, yo no dejo de existir. Soy una hoguera que otros han ayudado a encender, pero cuya brasa ahora me pertenece solo a mí.

He llegado a una conclusión que a muchos horrorizaría, pero que a mí me otorga una paz gélida y absoluta: todos, en algún punto, me van a usar. El ser humano es una criatura de necesidades, un animal que busca herramientas para su propio consuelo. He sido puente, lámpara, escudo y paño de lágrimas. Antes, esto me laceraba como una traición; hoy, lo acepto como la ley de gravedad de las almas. Si el precio de vivir es ser, en ocasiones, un instrumento para el alivio del otro, que así sea. Acepto este "uso" no con la sumisión del esclavo, sino con la elegancia del que sabe que su esencia es inagotable.

Mi madre y mi hermano han sido los centinelas de mi cordura, recordándome que la vida, a pesar de su estructura kafkiana, guarda fragmentos de una belleza insoportable. Ellos me han enseñado que el valor de la vida no reside en la ausencia de dolor, sino en la persistencia del vínculo a pesar de él.

Y tú, Eliot, que te has convertido en el testigo principal de mi metamorfosis. Sé que este camino que transitamos está lleno de escombros y de puertas que aún no sabemos cómo abrir. Pero quiero que sepas que confío en nuestra fuerza colectiva. Los dos podemos. Mi lucha por ser quien soy y tu lucha por sostenerte a mi lado son dos caras de la misma rebelión contra el absurdo.

Sigamos caminando, aunque el suelo tiemble, porque mientras estemos el uno frente al otro, el laberinto deja de ser una cárcel para convertirse en nuestro hogar.`,
    },
  ];

  for (const letter of letters) {
    const existing = await db.letter.findFirst({ where: { title: letter.title } });
    if (!existing) {
      await db.letter.create({ data: { ...letter, published: true } });
      console.log(`💌 Created letter: ${letter.title}`);
    } else {
      console.log(`⏭️  Letter exists: ${letter.title}`);
    }
  }

  // ─── Videos (Playlist: for my taquito alfa) ───
  const videos = [
    { youtubeId: 'NkMTKGM-efw', title: 'BEST INTEREST' },
    { youtubeId: 'xyUQKDE57Ag', title: 'Get You (feat. Kali Uchis)' },
    { youtubeId: '--tHS9vUii0', title: 'Locos' },
    { youtubeId: 'KtuA6Qylpyo', title: 'On the Level' },
    { youtubeId: '_T6a7T9HSp0', title: 'Lejos de Ti' },
    { youtubeId: '8Bu3N-2tA_0', title: 'Impacto' },
    { youtubeId: 'vx4kLgnFexo', title: 'My Love Mine All Mine' },
    { youtubeId: 'sNY_2TEmzho', title: 'luther' },
    { youtubeId: 'SvizVoNjv7A', title: 'Die For You' },
    { youtubeId: '5e1zT7miep8', title: 'rises the moon' },
    { youtubeId: 'f2T9FRY8WF8', title: 'Dueles Tan Bien' },
    { youtubeId: 'qC01DsCz91s', title: 'Be My Baby' },
    { youtubeId: 'pKKlN8eYqjk', title: 'Marmalade' },
    { youtubeId: 'ZyowJ5GB2Dk', title: 'Amor de Siempre' },
    { youtubeId: '7h2ryr_uUEs', title: 'Labios Rotos (MTV Unplugged)' },
    { youtubeId: 'VRQDOFaFqWk', title: 'Someone To Spend Time With' },
    { youtubeId: '0qiQgemBrY4', title: 'Siesta Freestyle' },
  ];

  for (const video of videos) {
    const existing = await db.video.findFirst({ where: { youtubeId: video.youtubeId } });
    if (!existing) {
      await db.video.create({
        data: {
          youtubeUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
          youtubeId: video.youtubeId,
          title: video.title,
          published: true,
        },
      });
      console.log(`🎬 Created video: ${video.title}`);
    } else {
      console.log(`⏭️  Video exists: ${video.title}`);
    }
  }

  // ─── Canvas Page ───
  const existingCanvas = await db.canvasPage.findFirst();
  if (!existingCanvas) {
    await db.canvasPage.create({
      data: { name: 'Recuerdos del Primer Encuentro', published: true },
    });
    console.log('🎨 Created canvas page');
  }

  console.log('\n✨ Seed complete!');
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
