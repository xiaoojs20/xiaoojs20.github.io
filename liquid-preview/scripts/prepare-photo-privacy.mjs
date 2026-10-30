#!/usr/bin/env node
// Keep the private config (answers and original paths) outside the public repository.
import {createCipheriv, createHash, pbkdf2Sync, randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {mkdir, mkdtemp, readFile, realpath, rename, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const iterations = 600000;
export const normalizeAnswer = value => value.normalize('NFKC').trim().replace(/\s+/gu, ' ').toLowerCase();
const sha = value => createHash('sha256').update(value).digest('hex');
const b64 = value => value.toString('base64');
const inside = (parent, child) => child === parent || child.startsWith(parent + path.sep);

function encrypt(key, iv, data, aad) {
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(aad);
  return Buffer.concat([cipher.update(data), cipher.final(), cipher.getAuthTag()]);
}

export function sealPhoto(clear, src, answers = []) {
  const aad = Buffer.from(`blog-photo-privacy:v1:${src}`);
  const fileKey = randomBytes(32);
  const iv = randomBytes(12);
  const encrypted = encrypt(fileKey, iv, clear, aad);
  const slots = [...new Set(answers.map(normalizeAnswer))].map(answer => {
    if (!answer) throw new Error('An answer cannot be blank.');
    const salt = randomBytes(16);
    const wrapIV = randomBytes(12);
    const wrappingKey = pbkdf2Sync(answer, salt, iterations, 32, 'sha256');
    const key = encrypt(wrappingKey, wrapIV, fileKey, aad);
    wrappingKey.fill(0);
    return {salt: b64(salt), iv: b64(wrapIV), key: b64(key)};
  });
  fileKey.fill(0);
  return {encrypted, iv: b64(iv), slots};
}

const imageScript = String.raw`
from PIL import Image, ImageOps, ImageFilter
import sys
with Image.open(sys.argv[1]) as original:
    image = ImageOps.exif_transpose(original).convert('RGB')
    image.thumbnail((2400,2400), Image.Resampling.LANCZOS)
    # New image objects discard EXIF, GPS, XMP, embedded comments and thumbnails.
    clean = Image.new('RGB',image.size)
    clean.paste(image)
    clean.save(sys.argv[2],format='JPEG',quality=90,optimize=True)
    small = clean.copy()
    small.thumbnail((16,16),Image.Resampling.BOX)
    preview = small.resize(clean.size,Image.Resampling.BILINEAR)
    preview = preview.filter(ImageFilter.GaussianBlur(max(clean.size)/35))
    preview.save(sys.argv[3],format='JPEG',quality=82,optimize=True)
`;

export async function prepare(configPath, siteRoot, publishedRoot) {
  const repository = await realpath(path.dirname(siteRoot));
  const privateConfig = await realpath(configPath);
  if (inside(repository, privateConfig)) throw new Error('Store the private config outside the public repository.');
  const config = JSON.parse(await readFile(privateConfig, 'utf8'));
  if (!Array.isArray(config.photos) || !config.photos.length) throw new Error('Config must contain a non-empty photos array.');
  const manifestPath = path.join(siteRoot, 'data/photo_privacy.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.version !== 1 || manifest.iterations !== iterations) throw new Error('Unsupported privacy manifest.');
  const seen = new Set();
  // Preflight every entry before changing a public file.
  for (const photo of config.photos) {
    if (typeof photo.src !== 'string' || !/^\/img\/(?:travel|gallery)\/.+\.jpe?g$/i.test(photo.src) || photo.src.includes('..') || photo.src.includes('\\') || photo.src.includes('%')) throw new Error('Use an unescaped /img/travel/ or /img/gallery/ JPEG path.');
    if (seen.has(photo.src)) throw new Error(`Duplicate photo: ${photo.src}`);
    seen.add(photo.src);
    const original = await realpath(photo.original);
    if (inside(repository, original)) throw new Error(`Keep the original outside the public repository: ${photo.src}`);
    if (!Array.isArray(photo.answers) || photo.answers.length > 20 || photo.answers.some(answer => typeof answer !== 'string' || !normalizeAnswer(answer) || answer.length > 200)) throw new Error(`Invalid answers: ${photo.src}`);
    const question = photo.question || config.question || {zh: '这个人（之一）是谁，除了我？', en: 'Who is one of the people in this photo, other than me?'};
    if (typeof question.zh !== 'string' || !question.zh.trim() || typeof question.en !== 'string' || !question.en.trim()) throw new Error(`A question needs Chinese and English text: ${photo.src}`);
    photo.question = question;
    photo.original = original;
  }
  const temporary = await mkdtemp(path.join(tmpdir(), 'blog-photo-seal-'));
  try {
    const writes = [];
    for (const [index, photo] of config.photos.entries()) {
      const cleanPath = path.join(temporary, `${index}.jpg`);
      const previewPath = path.join(temporary, `${index}-blur.jpg`);
      const result = spawnSync('python3', ['-c', imageScript, photo.original, cleanPath, previewPath], {encoding: 'utf8'});
      if (result.status !== 0) throw new Error('Image preparation failed; install Pillow for python3. ' + result.stderr);
      const [clean, preview, original] = await Promise.all([readFile(cleanPath), readFile(previewPath), readFile(photo.original)]);
      const sealed = sealPhoto(clean, photo.src, photo.answers);
      const file = `/img/protected/${sha(sealed.encrypted).slice(0,32)}.bin`;
      const cleartextSha256 = [...new Set([sha(clean), sha(original), ...(manifest.photos[photo.src]?.cleartextSha256 || [])])];
      manifest.photos[photo.src] = {
        question: photo.question, file, iv: sealed.iv, mime: 'image/jpeg', slots: sealed.slots,
        previewSha256: sha(preview), encryptedSha256: sha(sealed.encrypted), cleartextSha256,
      };
      for (const root of [path.join(siteRoot, 'static'), publishedRoot].filter(Boolean)) {
        writes.push([path.join(root, photo.src.slice(1)), preview], [path.join(root, file.slice(1)), sealed.encrypted]);
      }
    }
    // Stage all output first, then atomically replace each file; publish the manifest last.
    for (const [target, contents] of writes) {
      await mkdir(path.dirname(target), {recursive: true});
      await writeFile(target + '.privacy-tmp', contents);
    }
    for (const [target] of writes) await rename(target + '.privacy-tmp', target);
    await writeFile(manifestPath + '.privacy-tmp', JSON.stringify(manifest, null, 2) + '\n');
    await rename(manifestPath + '.privacy-tmp', manifestPath);
    return {protected: config.photos.length, pending: config.photos.filter(photo => !photo.answers.length).length};
  } finally {
    await rm(temporary, {recursive: true, force: true});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : null;
  if (!value('--config')) throw new Error('Usage: node prepare-photo-privacy.mjs --config /private/portraits.json [--site /repo/liquid-preview] [--published /repo]');
  const site = path.resolve(value('--site') || fileURLToPath(new URL('..', import.meta.url)));
  const result = await prepare(path.resolve(value('--config')), site, value('--published') ? path.resolve(value('--published')) : null);
  console.log(JSON.stringify(result));
}
