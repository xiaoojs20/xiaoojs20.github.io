#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {readFile, readdir, lstat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';

const sha = value => createHash('sha256').update(value).digest('hex');
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const base64 = (value, length) => typeof value === 'string' && Buffer.from(value, 'base64').length === length && Buffer.from(value, 'base64').toString('base64') === value;

export async function checkPrivacy(site, published) {
  const config = JSON.parse(await readFile(path.join(site, 'data/photo_privacy.json'), 'utf8'));
  if (config.version !== 1 || config.iterations !== 600000 || !config.photos || Array.isArray(config.photos)) throw new Error('Invalid privacy manifest.');
  const entries = Object.entries(config.photos);
  if (entries.length && published) {
    for (const page of ['travel/index.html', 'zh/travel/index.html', 'pictures/index.html', 'zh/pictures/index.html']) {
      const html = await readFile(path.join(published, page), 'utf8');
      const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
        .find(match => /\bid=(?:"photo-privacy-data"|'photo-privacy-data'|photo-privacy-data)(?=\s|$)/.test(match[1]));
      if (!script || !isDeepStrictEqual(JSON.parse(script[2]), config) || !/photo-privacy\.min\.[a-f0-9]+\.js/.test(html)) throw new Error(`Rebuild the protected photo page before publishing: ${page}`);
    }
  }
  const forbidden = new Set(entries.flatMap(([, entry]) => entry.cleartextSha256 || []));
  const roots = [path.join(site, 'static'), published].filter(Boolean);
  for (const [src, entry] of entries) {
    const allowed = ['question', 'file', 'iv', 'mime', 'slots', 'previewSha256', 'encryptedSha256', 'cleartextSha256'];
    if (Object.keys(entry).some(key => !allowed.includes(key))) throw new Error(`Unexpected field (possibly private data): ${src}`);
    if (!/^\/img\/(?:travel|gallery)\/.+\.jpe?g$/i.test(src) || src.includes('..') || src.includes('%') || src.includes('\\')) throw new Error(`Invalid preview path: ${src}`);
    if (!/^\/img\/protected\/[a-f0-9]{32}\.bin$/.test(entry.file) || !base64(entry.iv,12) || entry.mime !== 'image/jpeg' || !entry.question?.zh || !entry.question?.en || !Array.isArray(entry.slots) || entry.slots.length > 20 || !digest(entry.previewSha256) || !digest(entry.encryptedSha256) || !Array.isArray(entry.cleartextSha256) || !entry.cleartextSha256.length || !entry.cleartextSha256.every(digest)) throw new Error(`Incomplete privacy entry: ${src}`);
    for (const slot of entry.slots) if (Object.keys(slot).some(key => !['salt','iv','key'].includes(key)) || !base64(slot.salt,16) || !base64(slot.iv,12) || !base64(slot.key,48)) throw new Error(`Invalid answer slot: ${src}`);
    for (const root of roots) {
      for (const [relative, expected] of [[src, entry.previewSha256], [entry.file, entry.encryptedSha256]]) {
        const filename = path.join(root, relative.slice(1));
        if ((await lstat(filename)).isSymbolicLink()) throw new Error(`Protected assets must not be symlinks: ${relative}`);
        if (sha(await readFile(filename)) !== expected) throw new Error(`Protected asset was replaced or is still clear: ${filename}`);
      }
    }
  }
  const scan = async directory => {
    for (const file of await readdir(directory, {withFileTypes: true})) {
      if (['.git', 'liquid-preview', 'node_modules', 'resources'].includes(file.name)) continue;
      const filename = path.join(directory, file.name);
      if (file.isSymbolicLink()) throw new Error(`Do not publish symlinks: ${filename}`);
      if (file.isDirectory()) await scan(filename);
      else if (/\.(?:jpe?g|png|webp|heic|avif|bin)$/i.test(file.name) && forbidden.has(sha(await readFile(filename)))) throw new Error(`A clear copy of a protected photo is still public: ${filename}`);
    }
  };
  if (entries.length) for (const root of roots) await scan(root);
  return {protected: entries.length, pending: entries.filter(([, entry]) => !entry.slots.length).length};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : null;
  const site = path.resolve(value('--site') || fileURLToPath(new URL('..', import.meta.url)));
  console.log(JSON.stringify(await checkPrivacy(site, value('--published') ? path.resolve(value('--published')) : null)));
}
