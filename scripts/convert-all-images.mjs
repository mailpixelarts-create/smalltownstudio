import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';

const DIRS = ['assets/filmography', 'assets/images'];
const SIZES = [400, 800, 1200];
const QUALITY = 80;

async function convertDir(dir) {
  const files = await readdir(dir);
  const images = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  for (const file of images) {
    const inputPath = join(dir, file);
    const name = basename(file, extname(file));
    const info = await stat(inputPath);
    const sizeMB = (info.size / 1024 / 1024).toFixed(1);

    const metadata = await sharp(inputPath).metadata();
    console.log(`${file} (${sizeMB}MB, ${metadata.width}x${metadata.height})`);

    // Responsive sizes
    for (const width of SIZES) {
      if (width >= metadata.width) continue;
      const out = join(dir, `${name}-${width}w.webp`);
      await sharp(inputPath).resize(width, null, { withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
    }

    // Full-size WebP
    const fullOut = join(dir, `${name}.webp`);
    await sharp(inputPath).webp({ quality: QUALITY }).toFile(fullOut);
    const fullInfo = await stat(fullOut);
    const fullMB = (fullInfo.size / 1024 / 1024).toFixed(2);
    console.log(`  → ${fullMB}MB (${((1 - fullInfo.size / info.size) * 100).toFixed(0)}% savings)`);
  }
}

async function main() {
  for (const dir of DIRS) {
    console.log(`\n=== ${dir} ===`);
    await convertDir(dir);
  }
  console.log('\nDone!');
}

main().catch(console.error);
