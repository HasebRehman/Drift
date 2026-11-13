import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

// Persistent signed access, bounded by the same 24-hour server expiry.
const COOKIE = 'drift_site_session';
const SESSION_SECONDS = 24 * 60 * 60;
const WINDOW_MS = 15 * 60 * 1000;
// Per-process protection. Configure hosting-level rate limits for multiple instances.
const attempts = new Map<string, { count: number; expires: number }>();

function settings() {
  const password = process.env.SITE_PASSWORD;
  const secret = process.env.SITE_ACCESS_SECRET;
  if (!password || password.length < 12 || !secret || secret.length < 32) return null;
  // Changing either variable also invalidates existing sessions.
  const key = createHmac('sha256', secret).update(password).digest();
  return { password, key };
}

function equal(a: string, b: string) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}

function signature(payload: string, key: Buffer) {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

function validSession(value: string | undefined, key: Buffer) {
  if (!value || value.length > 256) return false;
  const parts = value.split('.');
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{32}$/.test(parts[1])) return false;
  const expires = Number(parts[0]);
  const now = Math.floor(Date.now() / 1000);
  return expires > now && expires <= now + SESSION_SECONDS && equal(parts[2], signature(`${parts[0]}.${parts[1]}`, key));
}

function destination(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return '/';
  const url = new URL(value, 'https://drift.invalid');
  if (url.origin !== 'https://drift.invalid' || url.pathname === '/password') return '/';
  return url.pathname + url.search;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  return response;
}

function passwordPage(next: string, message = '', status = 200) {
  const response = new NextResponse(`<!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow"><title>DRIFT — Enter password</title>
    <style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,sans-serif}
    main{min-height:100vh;min-height:100svh;display:grid;place-items:center;padding:24px}
    form{width:100%;max-width:340px}label{display:block;font-size:16px;margin-bottom:12px}
    input{width:100%;padding:14px 16px;border:1px solid #bbb;border-radius:0;background:#fff;color:#111;font:inherit}
    input:focus-visible,button:focus-visible{outline:2px solid #111;outline-offset:3px}
    button{width:100%;margin-top:12px;padding:14px;border:1px solid #000;border-radius:0;background:#000;color:#fff;font:inherit;cursor:pointer}
    button:hover{background:#333}p{font-size:14px;line-height:1.5;color:#a32020;margin:14px 0 0}</style>
    </head><body><main><form method="post" action="/password">
    <label for="password">Enter password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required maxlength="1024" autofocus${message ? ' aria-describedby="message" aria-invalid="true"' : ''}>
    <input type="hidden" name="next" value="${escapeHtml(next)}">
    <button type="submit">Enter</button><p id="message" role="alert">${escapeHtml(message)}</p>
    </form></main></body></html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  response.headers.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Keep the Origin header on same-origin form POSTs. `no-referrer` can make
  // browsers send Origin: null, which correctly fails our CSRF check below.
  response.headers.set('Referrer-Policy', 'same-origin');
  return noStore(response);
}

export async function proxy(request: NextRequest) {
  const config = settings();
  const isPasswordPage = request.nextUrl.pathname === '/password';
  const next = destination(request.nextUrl.searchParams.get('next'));
  const authenticated = config && validSession(request.cookies.get(COOKIE)?.value, config.key);

  if (isPasswordPage) {
    if (authenticated && ['GET', 'HEAD'].includes(request.method)) {
      return noStore(NextResponse.redirect(new URL(next, request.url), 303));
    }
    if (request.method === 'GET' || request.method === 'HEAD') {
      return passwordPage(next, config ? '' : 'Access is temporarily unavailable.', config ? 200 : 503);
    }
    if (request.method !== 'POST') return new NextResponse(null, { status: 405, headers: { Allow: 'GET, HEAD, POST' } });
    if (!config) return passwordPage(next, 'Access is temporarily unavailable.', 503);
    if (request.headers.get('origin') !== request.nextUrl.origin || request.headers.get('sec-fetch-site') === 'cross-site') {
      return passwordPage(next, 'Please reload this page and try again.', 403);
    }
    if (Number(request.headers.get('content-length') || 0) > 4096) return passwordPage(next, 'Request is too large.', 413);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const id = createHmac('sha256', config.key).update(ip).digest('hex');
    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
    const entry = attempts.get(id) || { count: 0, expires: now + WINDOW_MS };
    if (entry.count >= 5 || (!attempts.has(id) && attempts.size >= 10000)) {
      const response = passwordPage(next, 'Too many attempts. Please try again in 15 minutes.', 429);
      response.headers.set('Retry-After', String(Math.max(1, Math.ceil((entry.expires - now) / 1000))));
      return response;
    }
    entry.count++;
    attempts.set(id, entry);
    let form: FormData;
    try { form = await request.formData(); } catch { return passwordPage(next, 'Please enter your password again.', 400); }
    const returnTo = destination(form.get('next'));
    const password = form.get('password');
    if (typeof password !== 'string' || password.length > 1024 || !equal(password, config.password)) {
      return passwordPage(returnTo, 'Incorrect password. Please try again.', 401);
    }
    attempts.delete(id);
    const payload = `${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${randomBytes(16).toString('hex')}`;
    const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
    response.cookies.set(COOKIE, `${payload}.${signature(payload, config.key)}`, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: SESSION_SECONDS,
    });
    return noStore(response);
  }

  if (authenticated) return noStore(NextResponse.next());
  const url = new URL('/password', request.url);
  url.searchParams.set('next', destination(request.nextUrl.pathname + request.nextUrl.search));
  return noStore(NextResponse.redirect(url, 303));
}

export const config = {
  matcher: ['/((?!_next/static/|_next/webpack-hmr).*)'],
};
