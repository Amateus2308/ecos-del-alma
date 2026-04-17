// API de autenticación
// maneja login, creación de admin (seed) y creación de viewers
// el admin puede crear cuentas para otras personas desde el panel

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === 'login') {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      }
      const token = await signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });
      return NextResponse.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    }

    if (action === 'seed') {
      const existing = await db.user.findFirst({ where: { role: 'admin' } });
      if (existing) {
        return NextResponse.json({ message: 'Admin ya existe', user: { id: existing.id, email: existing.email, role: existing.role } });
      }
      const hashedPassword = await bcrypt.hash(password || 'admin123', 10);
      const user = await db.user.create({
        data: {
          email: email || 'admin@ecos.com',
          password: hashedPassword,
          name: name || 'Guardián',
          role: 'admin',
        },
      });
      return NextResponse.json({ message: 'Admin creado', user: { id: user.id, email: user.email, role: user.role } });
    }

    if (action === 'create-viewer') {
      const authHeader = getTokenFromHeader(request);
      if (!authHeader) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      const payload = await verifyToken(authHeader);
      if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

      const hashedPassword = await bcrypt.hash(password || 'viewer123', 10);
      const user = await db.user.create({
        data: {
          email: email || 'amor@ecos.com',
          password: hashedPassword,
          name: name || 'Mi Amor',
          role: 'viewer',
        },
      });
      return NextResponse.json({ message: 'Usuario creado', user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
