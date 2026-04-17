import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

const POEM_THEMES = [
  'el laberinto de sombras donde nuestros ecos se encuentran',
  'una carta nunca enviada pero sentida con cada latido',
  'la luna carmesí que ilumina nuestro refugio eterno',
  'los susurros que el viento lleva entre nuestras almas',
  'el tiempo que se detiene cuando tus ojos me encuentran',
  'una vela que arde en la oscuridad de nuestros recuerdos',
  'las estrellas que escriben nuestro nombre en el cielo nocturno',
  'el puente invisible que une nuestros corazones a través del abismo',
  'un jardín de rosas negras que florecen con nuestra pasión',
  'la melancolía dulce de amarte en silencio',
];

export async function POST(request: NextRequest) {
  try {
    const { theme, language } = await request.json();

    const randomTheme = theme || POEM_THEMES[Math.floor(Math.random() * POEM_THEMES.length)];

    const systemPrompt = `Eres un poeta gótico romántico que escribe en español. Tu estilo combina la melancolía oscura con el amor apasionado, usando metáforas de laberintos, sombras, ecos, sangre, oro antiguo, lunas, estrellas, y la eternidad.

REGLAS ESTRICTAS:
- Escribe SIEMPRE en español
- El poema debe tener entre 8 y 16 líneas
- NO incluyas un título (el poema comienza directamente)
- NO uses metáforas cliché como "rosas son rojas"
- Cada línea debe tener un ritmo poético natural
- Usa vocabulario elegante y evocador
- NO incluyas explicaciones, solo el poema
- NO uses comillas, asteriscos, ni formato markdown
- Responde ÚNICAMENTE con el texto del poema, nada más`;

    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        {
          role: 'user',
          content: `Escribe un poema corto sobre: ${randomTheme}`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const poem = completion.choices[0]?.message?.content;

    if (!poem || poem.trim().length === 0) {
      return NextResponse.json({ error: 'La musa ha callado...' }, { status: 500 });
    }

    return NextResponse.json({ poem: poem.trim() });
  } catch (error) {
    console.error('Poem generation error:', error);
    return NextResponse.json({ error: 'Error al conjurar el poema' }, { status: 500 });
  }
}
