import sharp from 'sharp';
import { readFile } from 'fs/promises';
import { join } from 'path';

const pub = join(process.cwd(), 'public');
const svg = await readFile(join(pub, 'favicon.svg'));

await Promise.all([
  sharp(svg).resize(32, 32).png().toFile(join(pub, 'favicon-32.png')),
  sharp(svg).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png')),
  sharp(svg).resize(192, 192).png().toFile(join(pub, 'icon-192.png')),
  sharp(svg).resize(512, 512).png().toFile(join(pub, 'icon-512.png')),
]);

console.log('Wrote favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png');
