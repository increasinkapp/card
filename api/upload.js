/* POST /api/upload  (body: gambar mentah, header X-Card + Bearer)  ->  { url }
   Menyimpan gambar ke Vercel Blob. Browser sudah mengecilkan gambarnya dulu,
   jadi ukurannya jauh di bawah batas body 4,5 MB function Vercel.
   Jenis file ditentukan dari isi byte-nya, bukan dari header kiriman browser. */
import { randomBytes } from 'node:crypto';
import { verifyToken, requireEnv } from './_lib.js';

const SLUG = /^[a-z0-9][a-z0-9-]{0,39}$/;
const MAX_BYTES = 4 * 1024 * 1024;

function sniff(b) {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ['image/jpeg', 'jpg'];
  if (b[0] === 0x89 && b.toString('latin1', 1, 4) === 'PNG') return ['image/png', 'png'];
  if (b.toString('latin1', 0, 4) === 'GIF8') return ['image/gif', 'gif'];
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return ['image/webp', 'webp'];
  return null;
}

// Vercel sudah membaca body application/octet-stream jadi Buffer. Di luar Vercel dibaca dari stream.
async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  let n = 0;
  for await (const c of req) {
    n += c.length;
    if (n > MAX_BYTES) return null;
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireEnv(res, ['SESSION_SECRET'])) return;

  if (!verifyToken(req.headers.authorization, process.env.SESSION_SECRET)) {
    return res.status(401).json({ error: 'Sesi habis. Silakan login lagi.' });
  }

  const card = String(req.headers['x-card'] || '');
  if (!SLUG.test(card)) return res.status(400).json({ error: 'Nama kartu tidak valid.' });

  const buf = await readBody(req);
  if (!buf || buf.length > MAX_BYTES) {
    return res.status(413).json({ error: 'Gambar terlalu besar, maksimal 4 MB.' });
  }
  const kind = sniff(buf);
  if (!kind) {
    return res.status(415).json({ error: 'Format gambar tidak didukung. Pakai JPG, PNG, WebP, atau GIF.' });
  }

  if (!requireEnv(res, ['BLOB_READ_WRITE_TOKEN'])) return;

  const pathname = 'cards/' + card + '/' + Date.now().toString(36) + '-' +
    randomBytes(4).toString('hex') + '.' + kind[1];
  try {
    // diimpor di sini, supaya dev server lokal tanpa node_modules tetap bisa memuat file ini
    const { put } = await import('@vercel/blob');
    const blob = await put(pathname, buf, { access: 'public', contentType: kind[0], addRandomSuffix: false });
    res.status(200).json({ url: blob.url });
  } catch (e) {
    res.status(502).json({ error: 'Gagal menyimpan gambar (' + ((e && e.message) || 'unknown') + ').' });
  }
}
