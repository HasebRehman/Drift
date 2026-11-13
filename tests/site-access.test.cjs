const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
const { NextRequest } = require('next/server');

const password = crypto.randomBytes(24).toString('hex');
const env = { SITE_PASSWORD: password, SITE_ACCESS_SECRET: crypto.randomBytes(32).toString('hex'), NODE_ENV: 'production' };
const moduleObject = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/proxy.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: moduleObject.exports, module: moduleObject, require, process: { env }, Buffer, URL, Date, Map });
const { proxy } = moduleObject.exports;
const origin = 'https://drift.example';
const request = (path, options) => new NextRequest(origin + path, options);
function login(value, extra = {}) {
  return proxy(request('/password', {
    method: 'POST', headers: { origin, 'x-forwarded-for': '192.0.2.1', ...extra.headers },
    body: new URLSearchParams({ password: value, next: extra.next || '/products/hero-confidence' }),
  }));
}

test('site password gate', async () => {
  for (const path of ['/', '/products/hero-confidence', '/collections/men', '/assets/men.webp', '/api/example', '/?x=1']) {
    const response = await proxy(request(path));
    assert.equal(response.status, 303);
    assert.equal(new URL(response.headers.get('location')).pathname, '/password');
    assert.match(response.headers.get('cache-control'), /no-store/);
  }
  const page = await proxy(request('/password'));
  const html = await page.text();
  assert.equal(page.status, 200);
  assert.equal(page.headers.get('referrer-policy'), 'same-origin');
  assert.match(html, /type="password"/);
  assert(!html.includes(password));
  assert(!html.includes('tone-root'));

  const wrong = await login('wrong');
  assert.equal(wrong.status, 401);
  assert(!wrong.headers.has('set-cookie'));
  assert.match(await wrong.text(), /Incorrect password/);
  const crossOrigin = await login(password, { headers: { origin: 'https://other.example' } });
  assert.equal(crossOrigin.status, 403);
  const opaqueOrigin = await login(password, { headers: { origin: 'null' } });
  assert.equal(opaqueOrigin.status, 403);
  const crossSite = await login(password, { headers: { 'sec-fetch-site': 'cross-site' } });
  assert.equal(crossSite.status, 403);

  const success = await login(password);
  assert.equal(success.status, 303);
  assert.equal(success.headers.get('location'), origin + '/products/hero-confidence');
  const cookie = success.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=lax/i);
  assert(!cookie.includes(password));
  const pair = cookie.split(';')[0];
  const allowed = await proxy(request('/products/hero-confidence', { headers: { cookie: pair } }));
  assert.equal(allowed.headers.get('x-middleware-next'), '1');
  const tampered = await proxy(request('/', { headers: { cookie: pair + 'x' } }));
  assert.equal(tampered.status, 303);
  const expired = `1.${'a'.repeat(32)}`;
  const key = crypto.createHmac('sha256', env.SITE_ACCESS_SECRET).update(password).digest();
  const expiredCookie = `drift_site_access=${expired}.${crypto.createHmac('sha256', key).update(expired).digest('base64url')}`;
  assert.equal((await proxy(request('/', { headers: { cookie: expiredCookie } }))).status, 303);

  const external = await login(password, { next: '//evil.example' });
  assert.equal(external.headers.get('location'), origin + '/');
  const escaped = await proxy(request('/password?next=' + encodeURIComponent('/"><script>alert(1)</script>')));
  assert(!(await escaped.text()).includes('<script>'));

  env.SITE_PASSWORD = 'a-different-long-password';
  assert.equal((await proxy(request('/', { headers: { cookie: pair } }))).status, 303);
  env.SITE_PASSWORD = password;
  for (let i = 0; i < 5; i++) assert.equal((await login('wrong')).status, 401);
  assert.equal((await login(password)).status, 429);
  delete env.SITE_PASSWORD;
  assert.equal((await proxy(request('/password'))).status, 503);
  assert.equal((await proxy(request('/'))).status, 303);
});
