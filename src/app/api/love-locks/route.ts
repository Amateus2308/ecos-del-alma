import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

const ALLOWED_COLORS = ['gold', 'silver', 'copper', 'blood'];

export async function GET() {
  try {
    const locks = await db.loveLock.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ locks });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const { names, message, date, color } = await request.json();
    if (!names || !message) return NextResponse.json({ error: 'Nombres y mensaje requeridos' }, { status: 400 });
    if (typeof names !== 'string' || typeof message !== 'string') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

    const trimmedNames = names.trim();
    const trimmedMessage = message.trim();
    if (trimmedNames.length < 1 || trimmedNames.length > 100) return NextResponse.json({ error: 'Nombres debe tener entre 1 y 100 caracteres' }, { status: 400 });
    if (trimmedMessage.length < 1 || trimmedMessage.length > 100) return NextResponse.json({ error: 'Mensaje debe tener entre 1 y 100 caracteres' }, { status: 400 });
    if (color && !ALLOWED_COLORS.includes(color)) return NextResponse.json({ error: 'Color no válido' }, { status: 400 });
    if (date !== undefined && date !== null && typeof date !== 'string') return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });

    const lock = await db.loveLock.create({
      data: {
        names: trimmedNames,
        message: trimmedMessage,
        date: date?.trim() || null,
        color: color || 'gold',
      },
    });
    return NextResponse.json({ lock });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await db.loveLock.delete({ where: { id } });
    return NextResponse.json({ message: 'Candado eliminado' });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
