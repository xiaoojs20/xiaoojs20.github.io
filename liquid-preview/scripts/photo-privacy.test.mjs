import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto, createHash} from 'node:crypto';
import {mkdir, mkdtemp, readFile, rm, writeFile, copyFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {iterations, normalizeAnswer, prepare, sealPhoto} from './prepare-photo-privacy.mjs';
import {checkPrivacy} from './check-photo-privacy.mjs';

const src = '/img/travel/test/20261030-测试-人像.jpg';
const decode = value => Buffer.from(value,'base64');
const aad = value => Buffer.from(`blog-photo-privacy:v1:${value}`);
async function unlock(sealed, answer, source = src) {
  const material = await webcrypto.subtle.importKey('raw',Buffer.from(normalizeAnswer(answer)),'PBKDF2',false,['deriveKey']);
  for (const slot of sealed.slots) {
    const wrapping = await webcrypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:decode(slot.salt),iterations},material,{name:'AES-GCM',length:256},false,['decrypt']);
    try {
      const raw = await webcrypto.subtle.decrypt({name:'AES-GCM',iv:decode(slot.iv),additionalData:aad(source)},wrapping,decode(slot.key));
      const key = await webcrypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
      return Buffer.from(await webcrypto.subtle.decrypt({name:'AES-GCM',iv:decode(sealed.iv),additionalData:aad(source)},key,sealed.encrypted));
    } catch (error) { if (error.name !== 'OperationError') throw error; }
  }
  throw new Error('Incorrect answer or corrupted image');
}

test('Chinese names, aliases and Unicode normalization unlock the same file', async () => {
  const clear = Buffer.from('private image bytes');
  const sealed = sealPhoto(clear, src, ['测试姓名','Nickname', 'Nickname']);
  assert.equal(sealed.slots.length,2);
  assert.deepEqual(await unlock(sealed,'　测试姓名  '),clear);
  assert.deepEqual(await unlock(sealed,' ＮＩＣＫＮＡＭＥ '),clear);
  assert.ok(!JSON.stringify(sealed).includes('测试姓名'));
});

test('wrong names, another photo path, and tampered ciphertext cannot unlock', async () => {
  const sealed = sealPhoto(Buffer.from('secret'),src,['test-name']);
  await assert.rejects(unlock(sealed,'wrong'));
  await assert.rejects(unlock(sealed,'test-name','/img/travel/another.jpg'));
  sealed.encrypted[0] ^= 1;
  await assert.rejects(unlock(sealed,'test-name'));
});

test('photos without an answer have no unlock slot', async () => {
  const sealed = sealPhoto(Buffer.from('secret'),src,[]);
  assert.deepEqual(sealed.slots,[]);
  await assert.rejects(unlock(sealed,'anything'));
});

test('preparation strips metadata, preserves private originals, and publication guard finds leaks', async () => {
  const directory = await mkdtemp(path.join(tmpdir(),'photo-privacy-test-'));
  try {
    const site = path.join(directory,'repository/liquid-preview');
    const published = path.join(directory,'published');
    await mkdir(path.join(site,'data'),{recursive:true});
    await mkdir(published,{recursive:true});
    await writeFile(path.join(site,'data/photo_privacy.json'),JSON.stringify({version:1,iterations,photos:{}}));
    const original = path.join(directory,'original.jpg');
    const create = spawnSync('python3',['-c',"from PIL import Image; import sys; im=Image.new('RGB',(300,200),'orange'); ex=Image.Exif(); ex[270]='private metadata'; im.save(sys.argv[1],exif=ex)",original]);
    assert.equal(create.status,0);
    const before = await readFile(original);
    const config = path.join(directory,'private.json');
    await writeFile(config,JSON.stringify({photos:[{src,original,answers:['测试人物']}]}));
    assert.deepEqual(await prepare(config,site,published),{protected:1,pending:0});
    assert.deepEqual(await readFile(original),before);
    const manifest = JSON.parse(await readFile(path.join(site,'data/photo_privacy.json'),'utf8'));
    for (const page of ['travel/index.html','zh/travel/index.html','pictures/index.html','zh/pictures/index.html']) {
      const filename = path.join(published,page);
      await mkdir(path.dirname(filename),{recursive:true});
      await writeFile(filename,`<script id="photo-privacy-data" type="application/json">${JSON.stringify(manifest)}</script><script src="/js/photo-privacy.min.abcdef.js"></script>`);
    }
    assert.deepEqual(await checkPrivacy(site,published),{protected:1,pending:0});
    const entry = manifest.photos[src];
    const decrypted = await unlock({...entry,encrypted:await readFile(path.join(published,entry.file.slice(1)))},'测试人物');
    assert.ok(!decrypted.includes(Buffer.from('private metadata')));
    assert.equal(createHash('sha256').update(decrypted).digest('hex'),entry.cleartextSha256[0]);
    const publicText = JSON.stringify(manifest);
    assert.ok(!publicText.includes('测试人物'));
    assert.ok(!publicText.includes(original));
    await copyFile(original,path.join(published,'duplicate-original.jpg'));
    await assert.rejects(checkPrivacy(site,published),/clear copy/);
    await rm(path.join(published,'duplicate-original.jpg'));
    const page = path.join(published,'zh/travel/index.html');
    const built = await readFile(page);
    await writeFile(page,'<html>Stale page</html>');
    await assert.rejects(checkPrivacy(site,published),/Rebuild/);
    await writeFile(page,built);
    await copyFile(original,path.join(site,'static',src.slice(1)));
    await assert.rejects(checkPrivacy(site,published),/still clear/);
    const badConfig = path.join(site,'private.json');
    await writeFile(badConfig,JSON.stringify({photos:[]}));
    await assert.rejects(prepare(badConfig,site,published),/outside/);
  } finally { await rm(directory,{recursive:true,force:true}); }
});
