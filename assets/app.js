/* Increasink Bio Card. Step flow renderer, membaca global DATA dari data.js. */
(function () {
  'use strict';

  var D = window.DATA || {};
  var lang = D.lang_default || 'id';
  var step = 0;      // indeks step aktif
  var pillar = 0;    // indeks pilar GAINS di step 4
  var tier = 0;      // indeks tier di step How to Refer Me

  var PILL_ALL = ['goal', 'accomplishment', 'interest', 'network', 'skill'];
  var PILLARS = PILL_ALL.slice();

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function T(id, en) { return lang === 'id' ? id : en; }
  function L(o, base) {
    if (!o) return '';
    return o[base + '_' + lang] || o[base + '_id'] || o[base + '_en'] || o[base] || '';
  }
  function has(v) { return v != null && String(v).trim() !== ''; }
  function el(id) { return document.getElementById(id); }
  function editing() { return !!(window.BioCard && window.BioCard.editing); }
  /* Menempelkan alamat field ke elemen. Di mode baca atribut ini tidak berefek apa pun. */
  function ed(path, rich) {
    return path ? ' data-e="' + esc(path) + '"' + (rich ? ' data-rich="1"' : '') : '';
  }
  function lp(prefix, base) { return prefix + '.' + base + '_' + lang; }

  var ICON = {
    mail: '<path d="M2 5h20v14H2z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m2 6 10 7 10-7" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    phone: '<path d="M6 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/>',
    web: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    wa: '<path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2z" fill="currentColor"/>',
    share: '<circle cx="6" cy="12" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="6" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8.2 10.9 6.6-3.6M8.2 13.1l6.6 3.6" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    /* navbar */
    person: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    badge: '<circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 14.5 8 22l4-2 4 2-1-7.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    gains: '<path d="M12 3.2 14.3 9l6.2.3-4.8 3.9 1.6 6-5.3-3.4L6.7 19l1.6-6-4.8-3.9L9.7 9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    heart: '<path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    hand: '<path d="m11 17 2 2a1 1 0 1 0 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5.8 5.8 0 0 1 7.1-.9l.5.3a2 2 0 0 0 1.4.2L21 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
  };
  function svg(n, c) { return '<svg class="' + (c || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; }
  function h2(title, path) {
    return '<h2 class="h2"><span class="orn"></span><span class="h2t"' + ed(path) + '>' +
      esc(title) + '</span></h2>';
  }
  function chips(arr, path) {
    arr = arr || [];
    if (!arr.length && !editing()) return '';
    return '<div class="chips"' + (path ? ' data-arr="' + esc(path) + '" data-kind="text"' : '') + '>' +
      arr.map(function (c, i) {
        return '<span class="chip"' + ed(path ? path + '.' + i : '') + '>' + esc(c) + '</span>';
      }).join('') + '</div>';
  }

  /* ---------- step definitions ---------- */
  var STEP_DEF = {
    intro:    { dark: false, icon: 'person', tab: ['Kenalan', 'About'],     label: ['Perkenalan', 'Introduction'] },
    bni:      { dark: false, icon: 'badge',  tab: ['BNI', 'BNI'],           label: ['Keanggotaan BNI', 'BNI Membership'] },
    gains:    { dark: false, icon: 'gains',  tab: ['GAINS', 'GAINS'],       label: ['Bio GAINS', 'Bio GAINS'] },
    personal: { dark: false, icon: 'heart',  tab: ['Personal', 'Personal'], label: ['Di Luar Pekerjaan', 'Beyond Work'] },
    refer:    { dark: false, icon: 'hand',   tab: ['Referral', 'Refer'],    label: ['Cara Mereferensikan', 'How to Refer'] },
    connect:  { dark: true,  icon: 'chat',   tab: ['Kontak', 'Contact'],    label: ['Kontak', 'Contact'] }
  };
  var STEP_ALL = ['intro', 'bni', 'gains', 'personal', 'refer', 'connect'];
  var STEPS = [];

  /* Urutan tersimpan di data.order. Key yang belum tercatat di sana ikut di
     belakang, jadi menambah section baru di engine tidak memecahkan kartu lama. */
  function resolveOrder(saved, all) {
    var out = [];
    (saved || []).forEach(function (k) {
      if (all.indexOf(k) >= 0 && out.indexOf(k) < 0) out.push(k);
    });
    all.forEach(function (k) { if (out.indexOf(k) < 0) out.push(k); });
    return out;
  }
  function buildSteps() {
    var o = D.order || {}, hidden = o.hidden || [];
    STEPS = [{ key: 'cover', dark: true }];
    resolveOrder(o.steps, STEP_ALL).forEach(function (k) {
      var off = hidden.indexOf(k) >= 0;
      if (off && !editing()) return;
      var d = STEP_DEF[k];
      STEPS.push({ key: k, dark: d.dark, icon: d.icon, tab: d.tab, label: d.label, off: off });
    });
  }
  function buildPillars() {
    PILLARS = resolveOrder((D.order || {}).pillars, PILL_ALL);
  }
  var seen = { 1: true };

  var view = {};

  view.cover = function () {
    var hero = D.hero || {}, img = (D.images || {}).cover || (D.images || {}).hero;
    var inner = has(img)
      ? '<img class="ring-img" src="' + esc(img) + '" alt="' + esc(hero.name) + '">'
      : '<span class="ring-ini">' + esc(hero.initials || '') + '</span>';
    return '<div class="cover">' +
      '<div class="ring">' + inner + '</div>' +
      '<div class="cover-kicker"' + ed(lp('hero', 'connector')) + '>' + esc(L(hero, 'connector')) + '</div>' +
      '<h1 class="cover-name"' + ed('hero.name') + '>' + esc(hero.name || '') + '</h1>' +
      '<p class="cover-role"' + ed(lp('hero', 'role')) + '>' + esc(L(hero, 'role')) + '</p>' +
      (has((D.bni || {}).chapter) || editing()
        ? '<div class="cover-meta"' + ed('bni.chapter') + '>' + esc((D.bni || {}).chapter) + '</div>' : '') +
      '</div>';
  };

  view.intro = function () {
    var hero = D.hero || {}, img = (D.images || {}).hero;
    var p = has(img)
      ? '<div class="portrait" style="background-image:url(' + esc(img) + ')"></div>'
      : '<div class="portrait"><span class="portrait-ini">' + esc(hero.initials || '') + '</span></div>';
    return '<div class="step">' +
      '<div class="kicker">' + T('Perkenalan', 'Introduction') + '</div>' + p +
      '<h2 class="name"' + ed('hero.name') + '>' + esc(hero.name || '') + '</h2>' +
      '<p class="role"' + ed(lp('hero', 'role')) + '>' + esc(L(hero, 'role')) + '</p>' +
      (has(L(hero, 'tagline')) || editing()
        ? '<p class="quote"' + ed(lp('hero', 'tagline'), 1) + '>' + L(hero, 'tagline') + '</p>' : '') +
      '</div>';
  };

  view.bni = function () {
    var b = D.bni || {}, biz = D.bisnis || {}, rows = '';
    function row(k, v, path) {
      if (!has(v) && !editing()) return '';
      return '<div class="meta-row"><div class="meta-k">' + esc(k) + '</div>' +
        '<div class="meta-v"' + ed(path) + '>' + v + '</div></div>';
    }
    rows += row('Chapter', esc(b.chapter), 'bni.chapter');
    rows += row(T('Klasifikasi', 'Classification'), esc(L(b, 'klasifikasi')), lp('bni', 'klasifikasi'));
    rows += row(T('Peran', 'Role'), esc(L(b, 'peran')), lp('bni', 'peran'));
    rows += row(T('Anggota Sejak', 'Member Since'), esc(L(b, 'since')), lp('bni', 'since'));
    rows += row(T('Bisnis', 'Business'),
      '<span' + ed('bisnis.nama') + '>' + esc(biz.nama) + '</span>' +
      (has(biz.sejak) || editing()
        ? ' <span style="color:var(--dm)">est. <span' + ed('bisnis.sejak') + '>' + esc(biz.sejak) + '</span></span>' : ''),
      '');
    return '<div class="step"><div class="kicker">BNI</div>' + h2(T('Keanggotaan', 'Membership')) +
      '<div class="meta">' + rows + '</div>' + chips(b.status, 'bni.status') +
      (has(L(biz, 'layanan')) || editing()
        ? '<p class="p"' + ed(lp('bisnis', 'layanan'), 1) + '>' + L(biz, 'layanan') + '</p>' : '') +
      '</div>';
  };

  view.gains = function () {
    var key = PILLARS[pillar], g = (D.gains || {})[key] || {};
    var nav = PILLARS.map(function (k, i) {
      var letter = ((D.gains || {})[k] || {}).letter || k.charAt(0).toUpperCase();
      return '<button data-pil="' + i + '" class="' + (i === pillar ? 'on' : '') + '" aria-label="' + esc(k) + '">' + esc(letter) + '</button>';
    }).join('');
    var ipath = 'gains.' + key + '.items';
    var items = (g.items || []).map(function (it, i) {
      return '<li' + ed(ipath + '.' + i + '.' + lang, 1) + '>' + (it[lang] || it.id || it.en || '') + '</li>';
    }).join('');
    var dots = PILLARS.map(function (_, i) { return '<i class="' + (i === pillar ? 'on' : '') + '"></i>'; }).join('');
    return '<div class="step"><div class="kicker">Bio GAINS</div>' +
      '<div class="pillnav" id="pillnav" data-ord="pillars">' + nav + '</div>' +
      '<div class="pillar">' +
      '<div class="pillar-mark" aria-hidden="true">' + esc(g.letter || '') + '</div>' +
      h2(L(g, 'title'), lp('gains.' + key, 'title')) +
      (has(L(g, 'body')) || editing()
        ? '<p class="p"' + ed(lp('gains.' + key, 'body'), 1) + '>' + L(g, 'body') + '</p>' : '') +
      (items || (editing() && g.items)
        ? '<ul class="list" data-arr="' + ipath + '" data-kind="ml">' + items + '</ul>' : '') +
      chips(g.chips, 'gains.' + key + '.chips') +
      '</div><div class="dots">' + dots + '</div></div>';
  };

  view.personal = function () {
    var m = D.ministry || {}, o = D.offrecord || {};
    var facts = (o.facts || []).map(function (f, i) {
      return '<div class="fact"><div class="fact-n"' + ed('offrecord.facts.' + i + '.n') + '>' + esc(f.n) + '</div>' +
        '<div class="fact-t"' + ed('offrecord.facts.' + i + '.' + lang, 1) + '>' + (f[lang] || f.id || f.en || '') + '</div></div>';
    }).join('');
    return '<div class="step"><div class="kicker">' + T('Di Luar Pekerjaan', 'Beyond Work') + '</div>' +
      h2(L(m, 'title'), lp('ministry', 'title')) + chips(m.chips, 'ministry.chips') +
      '<div style="height:26px"></div>' + h2(L(o, 'title'), lp('offrecord', 'title')) +
      '<div class="facts" data-arr="offrecord.facts" data-kind="fact">' + facts + '</div></div>';
  };

  view.refer = function () {
    var r = D.refer || {}, t = (r.tiers || [])[tier] || {};
    var nav = (r.tiers || []).map(function (x, i) {
      return '<button data-tier="' + i + '" class="' + (i === tier ? 'on' : '') + '" style="--tc:' + esc(x.color || '#B0893C') + '">' + esc(x.name) + '</button>';
    }).join('');
    var tp = 'refer.tiers.' + tier;
    return '<div class="step"><div class="kicker">Referral</div>' + h2(L(r, 'title'), lp('refer', 'title')) +
      (has(L(r, 'intro')) || editing()
        ? '<p class="p"' + ed(lp('refer', 'intro')) + '>' + esc(L(r, 'intro')) + '</p>' : '') +
      '<div class="tiernav" id="tiernav" data-arr="refer.tiers" data-kind="fixed">' + nav + '</div>' +
      '<div class="tierview" style="--tc:' + esc(t.color || '#B0893C') + '">' +
      '<div class="tier-name"' + ed(tp + '.name') + '>' + esc(t.name || '') + '</div>' +
      '<div class="tier-lvl"' + ed(lp(tp, 'level')) + '>' + esc(L(t, 'level')) + '</div>' +
      '<p class="tier-body"' + ed(lp(tp, 'body')) + '>' + esc(L(t, 'body')) + '</p></div></div>';
  };

  view.connect = function () {
    var c = D.contact || {}, hero = D.hero || {}, rows = '';
    function link(href, icon, text, path, prefix) {
      return '<a href="' + esc(href) + '" target="_blank" rel="noopener">' + svg(icon, 'ic') +
        '<span class="tx"' + ed(path) + (prefix ? ' data-prefix="' + prefix + '"' : '') + '>' +
        esc(text) + '</span><span class="ar">&rsaquo;</span></a>';
    }
    if (has(c.email) || editing()) rows += link('mailto:' + c.email, 'mail', c.email, 'contact.email');
    if (has(c.phone_display) || editing()) rows += link('tel:' + String(c.phone_display || '').replace(/\s/g, ''), 'phone', c.phone_display, 'contact.phone_display');
    if (has(c.ig) || editing()) rows += link('https://instagram.com/' + c.ig, 'ig', '@' + c.ig, 'contact.ig', '@');
    if (has(c.web) || editing()) rows += link('https://' + String(c.web || '').replace(/^https?:\/\//, ''), 'web', c.web, 'contact.web');
    /* Nomor WhatsApp tidak tampil di kartu, tapi harus bisa diperbaiki dari editor. */
    if (editing()) rows += link('#', 'wa', c.wa || '', 'contact.wa');
    return '<div class="step"><div class="kicker" style="color:var(--gold)">' + T('Terima kasih', 'Thank you') + '</div>' +
      h2("Let's Connect") +
      '<p class="p">' + T('Senang berkenalan dengan Anda. Simpan kontak saya, atau sapa langsung lewat WhatsApp.',
        'Good to meet you. Save my details, or say hello on WhatsApp.') + '</p>' +
      '<div class="contact">' + rows + '</div>' +
      '<button class="nextlink" id="share">' + T('Bagikan kartu ini', 'Share this card') +
      '<span>' + svg('share') + '</span></button>' +
      '<p class="p" style="font-size:12.5px">' + esc(hero.name || '') + ' &middot; ' + esc((D.bisnis || {}).nama || '') + '</p>' +
      '</div>';
  };

  /* ---------- shell ---------- */
  function render() {
    var s = STEPS[step];
    var frac = s.key === 'gains' ? pillar / PILLARS.length : 0;
    var pct = Math.round(((step + frac) / (STEPS.length - 1)) * 100);
    var app = el('app');
    app.className = 'app' + (s.dark ? ' dark' : '');

    var topnav = s.key === 'cover'
      ? ''
      : '<div class="topnav">' +
        '<button class="back" id="back" aria-label="' + T('Kembali', 'Back') + '">&lsaquo;</button>' +
        '<div class="track" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>' +
        '<div class="langs"><button id="lid" class="' + (lang === 'id' ? 'on' : '') + '">ID</button>' +
        '<button id="len" class="' + (lang === 'en' ? 'on' : '') + '">EN</button></div></div>';

    var footer;
    if (s.key === 'cover') {
      footer = '<div class="foot plain"><button class="btn" id="next">' +
        T('Mari Berkenalan', "Let's connect") + '</button></div>';
    } else {
      var tabs = STEPS.map(function (x, i) {
        if (i === 0) return '';
        var cls = (i === step ? 'on' : (seen[i] ? 'done' : ''));
        return '<button data-go="' + i + '" class="' + cls + '"' +
          (i === step ? ' aria-current="page"' : '') + '>' + svg(x.icon) +
          '<b>' + esc(T(x.tab[0], x.tab[1])) + '</b></button>';
      }).join('');
      footer = '<div class="foot">' +
        '<button class="btn" id="wa">' + svg('wa') + T('Chat WhatsApp', 'Chat on WhatsApp') + '</button>' +
        '<nav class="nav" id="nav" aria-label="' + T('Bagian kartu', 'Card sections') + '">' + tabs + '</nav>' +
        '</div>';
    }

    var body = view[s.key]();
    if (s.key !== 'cover' && step < STEPS.length - 1) {
      body = body.replace(/<\/div>\s*$/, '<button class="nextlink" id="next">' +
        T('Lanjut', 'Continue') + '<span>' + esc(T(STEPS[step + 1].tab[0], STEPS[step + 1].tab[1])) +
        ' &rsaquo;</span></button></div>');
    }

    app.innerHTML = topnav + '<div class="stage" id="stage">' + body + '</div>' +
      footer + '<div class="modal" id="modal"></div>';

    bind();
    (window.BioCard.onRender || []).forEach(function (fn) {
      try { fn(); } catch (err) { /* editor gagal, kartu tetap tampil */ }
    });
  }

  function bind() {
    var s = STEPS[step];
    if (el('next')) el('next').addEventListener('click', next);
    if (el('back')) el('back').addEventListener('click', back);
    if (el('wa')) el('wa').addEventListener('click', waOpen);
    if (el('share')) el('share').addEventListener('click', share);
    var nv = el('nav');
    if (nv) nv.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      go(+b.dataset.go);
    });
    if (el('lid')) el('lid').addEventListener('click', function () { setLang('id'); });
    if (el('len')) el('len').addEventListener('click', function () { setLang('en'); });

    var pn = el('pillnav');
    if (pn) pn.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      pillar = +b.dataset.pil; render();
    });
    var tn = el('tiernav');
    if (tn) tn.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      tier = +b.dataset.tier; render();
    });

    if (s.key !== 'cover') swipe(el('stage'));
  }

  /* ---------- navigation ---------- */
  function next() {
    if (STEPS[step].key === 'gains' && pillar < PILLARS.length - 1) { pillar++; render(); return; }
    go(step + 1);
  }
  function back() {
    if (STEPS[step].key === 'gains' && pillar > 0) { pillar--; render(); return; }
    go(step - 1);
  }
  function go(i) {
    if (i < 0 || i > STEPS.length - 1) return;
    if (STEPS[i].key !== 'gains') pillar = 0;
    step = i;
    seen[i] = true;
    render();
    var st = el('stage'); if (st) st.scrollTop = 0;
  }
  function setLang(l) { if (l !== lang) { lang = l; render(); } }

  function swipe(node) {
    if (!node || editing()) return;
    var x0 = null, y0 = null;
    node.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    node.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6) { dx < 0 ? next() : back(); }
      x0 = y0 = null;
    }, { passive: true });
  }
  document.addEventListener('keydown', function (e) {
    if (editing()) return;
    if (el('modal') && el('modal').classList.contains('show')) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') back();
  });

  /* ---------- whatsapp ---------- */
  function waOpen() {
    var f = D.wa_form || {}, m = el('modal');
    var fields = (f.fields || []).map(function (fd) {
      return '<div class="fld"><label for="f_' + esc(fd.key) + '">' + esc(L(fd, 'label')) + '</label>' +
        '<input id="f_' + esc(fd.key) + '" autocomplete="' + esc(fd.autocomplete || 'off') + '"></div>';
    }).join('');
    m.innerHTML = '<div class="box" role="dialog" aria-modal="true">' +
      '<div class="box-h">' + esc(L(f, 'head')) + '</div>' +
      '<p class="box-s">' + esc(L(f, 'sub')) + '</p>' + fields +
      '<div class="err" id="waerr">' + T('Nama wajib diisi.', 'Please fill in your name.') + '</div>' +
      '<button class="btn" id="wasend" style="margin-top:20px">' + svg('wa') + T('Kirim ke WhatsApp', 'Send to WhatsApp') + '</button>' +
      '<button class="skip" id="wacancel" style="width:100%;margin-top:8px">' + T('Batal', 'Cancel') + '</button></div>';
    m.classList.add('show');
    m.onclick = function (e) { if (e.target === m) m.classList.remove('show'); };
    el('wasend').addEventListener('click', waSend);
    el('wacancel').addEventListener('click', function () { m.classList.remove('show'); });
    var first = (f.fields || [])[0];
    if (first) setTimeout(function () { var i = el('f_' + first.key); if (i) i.focus(); }, 80);
  }

  function waSend() {
    var f = D.wa_form || {}, c = D.contact || {}, vals = {}, missing = false;
    (f.fields || []).forEach(function (fd) {
      var i = el('f_' + fd.key);
      vals[fd.key] = i ? i.value.trim() : '';
      if (fd.required && !vals[fd.key]) missing = true;
    });
    if (missing) { el('waerr').classList.add('show'); return; }
    var msg = L(f, 'template').replace(/\{(\w+)\}/g, function (_, k) {
      return has(vals[k]) ? vals[k] : T('(tidak diisi)', '(not filled)');
    });
    window.open('https://wa.me/' + c.wa + '?text=' + encodeURIComponent(msg), '_blank');
    el('modal').classList.remove('show');
  }

  function share() {
    var url = location.href.split('#')[0];
    var title = ((D.hero || {}).name || '') + ' · Bio GAINS';
    if (navigator.share) navigator.share({ title: title, text: title, url: url }).catch(function () {});
    else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      var b = el('share'); var o = b.innerHTML;
      b.textContent = T('Link tersalin', 'Link copied');
      setTimeout(function () { b.innerHTML = o; }, 1500);
    }
  }

  /* ---------- pintu untuk layer editor ----------
     Diisi sebelum render pertama karena render() sudah memanggil onRender. */
  window.BioCard = {
    editing: false,
    onRender: [],
    data: function () { return D; },
    lang: function () { return lang; },
    steps: function () { return STEPS; },
    stepDef: STEP_DEF,
    stepAll: STEP_ALL,
    pillars: function () { return PILLARS; },
    pillarAll: PILL_ALL,
    at: function () { return step; },
    go: go,
    render: render,
    /* Dipakai setelah urutan atau visibilitas berubah. */
    rebuild: function () {
      buildSteps();
      buildPillars();
      if (step > STEPS.length - 1) step = STEPS.length - 1;
      if (pillar > PILLARS.length - 1) pillar = 0;
      render();
    }
  };

  buildSteps();
  buildPillars();
  render();
})();
