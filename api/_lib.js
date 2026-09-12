/* Helper bersama untuk endpoint editor. Semua rahasia hidup di env var Vercel,
   tidak pernah dikirim ke browser. */
import { createHmac, timingSafeEqual } from 'node:crypto';

const TTL_MS = 12 * 60 * 60 * 1000; // sesi 12 jam

function hmac(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/* Token = "<exp>.<signature>". Tidak menyimpan apa pun di server. */
export function signToken(exp, secret) {
  return exp + '.' + hmac(String(exp), secret);
}

export function newExpiry() {
  return Date.now() + TTL_MS;
}

export function verifyToken(header, secret) {
  const raw = String(header || '').replace(/^Bearer\s+/i, '').trim();
  const dot = raw.indexOf('.');
  if (dot < 1) return false;
  const exp = Number(raw.slice(0, dot));
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(raw.slice(dot + 1), hmac(String(exp), secret));
}

/* Perbandingan waktu-tetap supaya panjang jawaban tidak membocorkan password. */
export function safeEqual(a, b) {
  const x = Buffer.from(String(a), 'utf8');
  const y = Buffer.from(String(b), 'utf8');
  if (x.length !== y.length) {
    timingSafeEqual(x, x);
    return false;
  }
  return timingSafeEqual(x, y);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function requireEnv(res, names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    res.status(500).json({ error: 'Server belum dikonfigurasi: ' + missing.join(', ') });
    return false;
  }
  return true;
}
