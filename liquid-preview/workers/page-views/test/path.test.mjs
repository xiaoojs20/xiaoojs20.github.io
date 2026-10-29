import assert from "node:assert/strict";
import test from "node:test";

const normalisePath = (value) => {
  if (!value || value.length > 512 || !value.startsWith('/')) return null;
  const path = value.replace(/\/{2,}/g, '/').replace(/[?#].*$/, '');
  if (path.includes('..') || !/^\/(?:[^/?#\s]+\/)*$/u.test(path)) return null;
  return path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
};
const articleCounterKey = (path) => /^\/(?:zh\/)?p\/[^/]+\/$/u.test(normalisePath(path) || '') ? `article:${normalisePath(path)}` : null;
const pageCounterKey = (path) => {
  const normalised = normalisePath(path);
  return normalised && !articleCounterKey(normalised) ? `page:${normalised}` : null;
};

test('normalises site paths without changing the public post route', () => {
  assert.equal(normalisePath('/p/Hello//'), '/p/Hello/');
  assert.equal(normalisePath('/zh/p/hello/?source=ga'), '/zh/p/hello/');
  assert.equal(normalisePath('/p/../admin/'), null);
});
test('only article routes receive a per-article counter key', () => {
  assert.equal(articleCounterKey('/p/a-post/'), 'article:/p/a-post/');
  assert.equal(articleCounterKey('/zh/p/a-post/'), 'article:/zh/p/a-post/');
    assert.equal(articleCounterKey('/archives/'), null);
});
test('accepts Hugo article paths with Simplified Chinese slugs', () => {
  assert.equal(normalisePath('/zh/p/如何在线足不出户办理马耳他eid/'), '/zh/p/如何在线足不出户办理马耳他eid/');
  assert.equal(articleCounterKey('/zh/p/如何在线足不出户办理马耳他eid/'), 'article:/zh/p/如何在线足不出户办理马耳他eid/');
});
test('uses distinct page counters for non-article routes', () => {
  assert.equal(pageCounterKey('/apps/'), 'page:/apps/');
  assert.equal(pageCounterKey('/p/abc-custom-keyboard/'), null);
});
