// Script para registrar fotos y canciones en la base de datos
// Ejecutar con: bun run seed-media.ts

import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';

const db = new PrismaClient();

async function seedMedia() {
  console.log('📦 Registrando archivos multimedia en la base de datos...\n');

  // ─── Registrar Fotos ───
  const photosDir = join(process.cwd(), 'upload', 'photos');
  const photoFiles = [
    { filename: '1.webp', caption: null },
    { filename: 'preview.webp', caption: null },
    { filename: 'preview__1_.webp', caption: null },
    { filename: 'preview__2_.webp', caption: null },
    { filename: 'preview__3_.webp', caption: null },
    { filename: 'preview__4_.webp', caption: null },
    { filename: 'preview__5_.webp', caption: null },
    { filename: 'preview__6_.webp', caption: null },
    { filename: 'preview__7_.webp', caption: null },
    { filename: 'preview__8_.webp', caption: null },
  ];

  let photosCreated = 0;
  for (const photo of photoFiles) {
    const filePath = join(photosDir, photo.filename);
    if (!existsSync(filePath)) {
      console.log(`⚠️  Foto no encontrada: ${photo.filename}`);
      continue;
    }

    const existing = await db.photo.findFirst({ where: { filename: `photos/${photo.filename}` } });
    if (!existing) {
      await db.photo.create({
        data: {
          filename: `photos/${photo.filename}`,
          originalName: photo.filename,
          caption: photo.caption,
          published: true,
        },
      });
      console.log(`✅ Foto registrada: ${photo.filename}`);
      photosCreated++;
    } else {
      console.log(`⏭️  Foto ya existe: ${photo.filename}`);
    }
  }

  // ─── Registrar Canciones ───
  const songsDir = join(process.cwd(), 'upload', 'songs');
  const songFiles = [
    // Agrega aquí las canciones cuando las tengas:
    // { filename: 'cancion1.mp3', title: 'Nombre', artist: 'Artista' },
  ];

  let songsCreated = 0;
  for (const song of songFiles) {
    const filePath = join(songsDir, song.filename);
    if (!existsSync(filePath)) {
      console.log(`⚠️  Canción no encontrada: ${song.filename}`);
      continue;
    }

    const existing = await db.song.findFirst({ where: { filename: `songs/${song.filename}` } });
    if (!existing) {
      await db.song.create({
        data: {
          filename: `songs/${song.filename}`,
          originalName: song.filename,
          title: song.title || song.filename.replace(/\.[^/.]+$/, ''),
          artist: song.artist || null,
          published: true,
        },
      });
      console.log(`🎵 Canción registrada: ${song.filename}`);
      songsCreated++;
    } else {
      console.log(`⏭️  Canción ya existe: ${song.filename}`);
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   Fotos: ${photosCreated} nuevas`);
  console.log(`   Canciones: ${songsCreated} nuevas`);
  console.log(`\n✨ Listo!`);

  await db.$disconnect();
}

seedMedia().catch(console.error);
