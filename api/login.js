/* POST /api/login  { password }  ->  { token, exp }
   Password dicocokkan di server. Browser tidak pernah menerima password
   maupun token GitHub, hanya tiket sesi bertanda tangan yang berumur 12 jam. */
import { signToken, newExpiry, safeEqual, sleep, requireEnv } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireEnv(res, ['EDITOR_PASSWORD', 'SESSION_SECRET'])) return;

  // Perlambat tebak-tebakan. Tidak menghentikan penyerang serius, tapi membuat
  // brute force dari browser jadi tidak praktis.
  await sleep(400 + Math.floor(Math.random() * 250));

  const password = (req.body && req.body.password) || '';
  if (!safeEqual(password, process.env.EDITOR_PASSWORD)) {
    return res.status(401).json({ error: 'Password salah.' });
  }

  const exp = newExpiry();
  res.status(200).json({ token: signToken(exp, process.env.SESSION_SECRET), exp });
}
