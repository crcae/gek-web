import sharp from 'sharp';
import { readdir, writeFile, stat } from 'fs/promises';
import { join } from 'path';

const carpetas = [
  'public/images/zacatecas',
  'public/images/logos',
  'public/images/holding',
  'public/images/fundadores',
  'public/images/sedis',
];

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 75;
const PNG_COMPRESSION = 8;
const WEBP_QUALITY = 75;

async function optimizarCarpeta(carpeta) {
  let archivos;
  try {
    archivos = await readdir(carpeta);
  } catch {
    console.log(`⏭  Saltando ${carpeta} (no existe)`);
    return { total: 0, ahorrado: 0 };
  }

  const imagenes = archivos.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  if (imagenes.length === 0) {
    console.log(`   (vacía)`);
    return { total: 0, ahorrado: 0 };
  }

  let totalAhorrado = 0;

  for (const archivo of imagenes) {
    const ruta = join(carpeta, archivo);
    const esJpg = /\.(jpg|jpeg)$/i.test(archivo);
    const esPng = /\.png$/i.test(archivo);

    try {
      const statsBefore = await stat(ruta);
      const sizeBefore = statsBefore.size;

      const meta = await sharp(ruta).metadata();
      const anchoOriginal = meta.width ?? 0;

      let pipeline = sharp(ruta).rotate(); // auto-rotate EXIF

      if (anchoOriginal > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      if (esJpg) {
        pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
      } else if (esPng) {
        pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION });
      } else {
        pipeline = pipeline.webp({ quality: WEBP_QUALITY });
      }

      const buffer = await pipeline.toBuffer();
      await writeFile(ruta, buffer);

      const sizeAfter = buffer.length;
      const saved = sizeBefore - sizeAfter;
      const savedPct = Math.round((saved / sizeBefore) * 100);
      totalAhorrado += saved;

      const kbBefore = Math.round(sizeBefore / 1024);
      const kbAfter = Math.round(sizeAfter / 1024);
      console.log(`   ✅ ${archivo.padEnd(40)} ${kbBefore}KB → ${kbAfter}KB  (−${savedPct}%)`);
    } catch (err) {
      console.log(`   ❌ ${archivo}: ${err.message}`);
    }
  }

  return { total: imagenes.length, ahorrado: totalAhorrado };
}

async function main() {
  console.log('🗜  Optimizando imágenes del sitio GEK...\n');

  let totalArchivos = 0;
  let totalAhorrado = 0;

  for (const carpeta of carpetas) {
    console.log(`\n📁 ${carpeta}`);
    const resultado = await optimizarCarpeta(carpeta);
    totalArchivos += resultado.total;
    totalAhorrado += resultado.ahorrado;
  }

  const mbAhorrado = (totalAhorrado / 1024 / 1024).toFixed(1);
  console.log(`\n✅ Optimización completa`);
  console.log(`   ${totalArchivos} imágenes procesadas`);
  console.log(`   ${mbAhorrado} MB liberados`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
