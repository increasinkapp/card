# Increasink Bio Card

Kartu nama digital statis. Satu engine, banyak kartu.

## Struktur

```
assets/app.css        design system (art deco, hitam emas)
assets/app.js         renderer, membaca global DATA
<nama-kartu>/
  index.html          10 baris, memuat assets + data.js
  data.js             seluruh isi kartu
  img/                foto cover dan hero
index.html            redirect ke kartu utama
build-preview.mjs     menggabungkan semuanya jadi satu file untuk preview
```

## Bikin kartu baru

1. Copy folder kartu yang sudah ada, ganti namanya.
2. Edit `data.js`. Field kosong otomatis tidak dirender.
3. Atur urutan section lewat array `sections` di bagian bawah `data.js`.
4. Commit dan push. GitHub Pages otomatis publish.

## Catatan

- Repo ini publik, jadi seluruh isi `data.js` termasuk nomor telepon bisa dibaca siapa saja.
- Data yang diisi orang di form WhatsApp tidak disimpan di mana pun, hanya dititipkan ke teks WhatsApp.
