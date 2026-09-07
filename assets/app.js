/* Increasink Bio Card renderer. Reads the global DATA from each card's data.js. */
(function () {
  'use strict';

  var D = window.DATA || {};
  var lang = D.lang_default || 'id';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function T(id, en) { return lang === 'id' ? id : en; }
  function L(obj, base) {
    if (!obj) return '';
    return obj[base + '_' + lang] || obj[base + '_id'] || obj[base + '_en'] || obj[base] || '';
  }
  function has(v) { return v != null && String(v).trim() !== ''; }
  function el(id) { return document.getElementById(id); }

  var ICON = {
    mail: '<path d="M2 5h20v14H2z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m2 6 10 7 10-7" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    phone: '<path d="M6 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/>',
    web: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    wa: '<path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2z" fill="currentColor"/>',
    share: '<circle cx="6" cy="12" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="6" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8.2 10.9 6.6-3.6M8.2 13.1l6.6 3.6" fill="none" stroke="currentColor" stroke-width="1.6"/>'
  };
  function svg(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  function rule(cls) {
    return '<div class="rule ' + (cls || '') + '"><span class="lozenge"></span></div>';
  }
  function head(letter, kicker, title) {
    return (letter ? '<div class="sec-mark" aria-hidden="true">' + esc(letter) + '</div>' : '') +
      '<div class="sec-kicker">' + esc(kicker) + '</div>' +
      '<h2 class="sec-title">' + esc(title) + '</h2>';
  }

  /* ---------- section builders ---------- */
  var build = {};

  build.hero = function () {
    var h = D.hero || {}, img = (D.images || {}).hero;
    var photo = has(img)
      ? '<div class="hero-photo" style="background-image:url(' + esc(img) + ')"></div>'
      : '<div class="hero-photo"><span class="hero-ini">' + esc(h.initials || '') + '</span></div>';
    return '<section class="hero">' + photo +
      '<h1 class="hero-name">' + esc(h.name || '') + '</h1>' +
      '<p class="hero-role">' + esc(L(h, 'role')) + '</p>' +
      (has(L(h, 'tagline')) ? '<p class="hero-tag">' + L(h, 'tagline') + '</p>' : '') +
      '</section>';
  };

  build.bni = function () {
    var b = D.bni || {}, biz = D.bisnis || {}, rows = '';
    function row(k, v) {
      if (!has(v)) return '';
      return '<div class="meta-row"><div class="meta-k">' + esc(k) + '</div><div class="meta-v">' + v + '</div></div>';
    }
    rows += row('Chapter', esc(b.chapter));
    rows += row(T('Klasifikasi', 'Classification'), esc(L(b, 'klasifikasi')));
    rows += row(T('Peran', 'Role'), esc(L(b, 'peran')));
    rows += row(T('Anggota Sejak', 'Member Since'), esc(L(b, 'since')));
    rows += row(T('Bisnis', 'Business'), esc(biz.nama) + (has(biz.sejak) ? ' <span style="color:var(--cream-dm)">est. ' + esc(biz.sejak) + '</span>' : ''));
    if (!rows) return '';
    var badges = (b.status || []).map(function (s) {
      return '<span class="chip">' + esc(s) + '</span>';
    }).join('');
    return '<section class="sec">' + head('', 'BNI', T('Keanggotaan', 'Membership')) +
      '<div class="meta">' + rows + '</div>' +
      (badges ? '<div class="chips">' + badges + '</div>' : '') +
      (has(L(biz, 'layanan')) ? '<p class="sec-body">' + L(biz, 'layanan') + '</p>' : '') +
      '</section>';
  };

  function gainsSection(key) {
    var g = (D.gains || {})[key];
    if (!g) return '';
    var body = has(L(g, 'body')) ? '<p class="sec-body">' + L(g, 'body') + '</p>' : '';
    var items = (g.items || []).map(function (it) {
      return '<li>' + (it[lang] || it.id || it.en || '') + '</li>';
    }).join('');
    var chips = (g.chips || []).map(function (c) {
      return '<span class="chip">' + esc(c) + '</span>';
    }).join('');
    return '<section class="sec">' +
      head(g.letter, T('Bio GAINS', 'Bio GAINS'), L(g, 'title')) +
      body +
      (items ? '<ul class="list">' + items + '</ul>' : '') +
      (chips ? '<div class="chips">' + chips + '</div>' : '') +
      '</section>';
  }
  ['goal', 'accomplishment', 'interest', 'network', 'skill'].forEach(function (k) {
    build[k] = function () { return gainsSection(k); };
  });

  build.ministry = function () {
    var m = D.ministry;
    if (!m) return '';
    var chips = (m.chips || []).map(function (c) { return '<span class="chip">' + esc(c) + '</span>'; }).join('');
    return '<section class="sec">' + head('', T('Pelayanan', 'Service'), L(m, 'title')) +
      '<div class="chips">' + chips + '</div></section>';
  };

  build.refer = function () {
    var r = D.refer;
    if (!r) return '';
    var tiers = (r.tiers || []).map(function (t) {
      return '<article class="tier" style="--tier-c:' + esc(t.color || '#B0893C') + '">' +
        '<div class="tier-head"><span class="tier-name">' + esc(t.name) + '</span>' +
        '<span class="tier-lvl">' + esc(L(t, 'level')) + '</span></div>' +
        '<p class="tier-body">' + esc(L(t, 'body')) + '</p></article>';
    }).join('');
    return '<section class="sec">' + head('', T('Referral', 'Referral'), L(r, 'title')) +
      (has(L(r, 'intro')) ? '<p class="sec-body">' + esc(L(r, 'intro')) + '</p>' : '') +
      '<div class="tiers">' + tiers + '</div></section>';
  };

  build.offrecord = function () {
    var o = D.offrecord;
    if (!o) return '';
    var facts = (o.facts || []).map(function (f) {
      return '<div class="fact"><div class="fact-n">' + esc(f.n) + '</div>' +
        '<div class="fact-t">' + (f[lang] || f.id || f.en || '') + '</div></div>';
    }).join('');
    return '<section class="sec">' + head('', T('Di Luar Kartu Nama', 'Beyond the Card'), L(o, 'title')) +
      '<div class="facts">' + facts + '</div></section>';
  };

  build.contact = function () {
    var c = D.contact || {}, rows = '';
    function link(href, icon, text) {
      return '<a href="' + esc(href) + '" target="_blank" rel="noopener">' +
        svg(icon, 'ic') + '<span class="tx">' + esc(text) + '</span><span class="ar">&rsaquo;</span></a>';
    }
    if (has(c.email)) rows += link('mailto:' + c.email, 'mail', c.email);
    if (has(c.phone_display)) rows += link('tel:' + String(c.phone_display).replace(/\s/g, ''), 'phone', c.phone_display);
    if (has(c.ig)) rows += link('https://instagram.com/' + c.ig, 'ig', '@' + c.ig);
    if (has(c.web)) rows += link('https://' + String(c.web).replace(/^https?:\/\//, ''), 'web', c.web);
    return '<section class="sec">' + head('', T('Kontak', 'Contact'), T("Let's Connect", "Let's Connect")) +
      '<div class="contact">' + rows + '</div></section>';
  };

  /* ---------- page ---------- */
  function coverHTML() {
    var h = D.hero || {}, img = (D.images || {}).cover;
    return '<div class="cover" id="cover">' +
      (has(img) ? '<div class="cover-photo" style="background-image:url(' + esc(img) + ')"></div>' : '') +
      '<div class="cover-frame"></div>' +
      '<div class="cover-in">' +
      '<div class="cover-kicker">' + esc(L(h, 'connector')) + '</div>' +
      '<h1 class="cover-name">' + esc(h.name || '') + '</h1>' +
      '<p class="cover-role">' + esc(L(h, 'role')) + '</p>' +
      rule('cover-rule') +
      '<div class="cover-connect">' + esc((D.bni && D.bni.chapter) || '') + '</div>' +
      '<button class="cover-btn" id="coverbtn">' + T('Buka Kartu', 'Open Card') +
      '<span class="chev" aria-hidden="true"><i></i><i></i></span></button>' +
      '</div></div>';
  }

  function render() {
    var secs = (D.sections || []).map(function (k) {
      return build[k] ? build[k]() : '';
    }).join('');

    var h = D.hero || {};
    el('app').innerHTML =
      '<div class="card">' +
      coverHTML() +
      '<div class="top">' +
      '<div class="top-name">' + esc(h.name || '') + '</div>' +
      '<div class="langs" role="group" aria-label="Language">' +
      '<button id="lid" class="' + (lang === 'id' ? 'on' : '') + '">ID</button>' +
      '<button id="len" class="' + (lang === 'en' ? 'on' : '') + '">EN</button>' +
      '</div></div>' +
      '<div class="scroll">' + secs +
      '<footer class="foot"><div class="foot-oct">IK</div>' +
      '<div class="foot-tx">' + esc((D.bisnis && D.bisnis.nama) || '') + '</div></footer>' +
      '</div>' +
      '<div class="bar">' +
      '<button class="bar-wa" id="btnwa">' + svg('wa') + T('WhatsApp Saya', 'WhatsApp Me') + '</button>' +
      '<button class="bar-share" id="btnshare" aria-label="' + T('Bagikan', 'Share') + '">' + svg('share') + '</button>' +
      '</div>' +
      '<div class="modal" id="modal"></div>' +
      '</div>';

    el('coverbtn').addEventListener('click', openCard);
    el('lid').addEventListener('click', function () { setLang('id'); });
    el('len').addEventListener('click', function () { setLang('en'); });
    el('btnwa').addEventListener('click', waOpen);
    el('btnshare').addEventListener('click', share);
  }

  var opened = false;
  function openCard() {
    opened = true;
    el('cover').classList.add('hidden');
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l;
    render();
    if (opened) el('cover').classList.add('hidden');
  }

  /* ---------- whatsapp ---------- */
  function waOpen() {
    var f = D.wa_form || {}, m = el('modal');
    var fields = (f.fields || []).map(function (fd) {
      return '<div class="fld"><label for="f_' + esc(fd.key) + '">' + esc(L(fd, 'label')) +
        '</label><input id="f_' + esc(fd.key) + '" autocomplete="' + esc(fd.autocomplete || 'off') + '"></div>';
    }).join('');
    m.innerHTML = '<div class="box" role="dialog" aria-modal="true">' +
      '<div class="box-h">' + esc(L(f, 'head')) + '</div>' +
      '<p class="box-s">' + esc(L(f, 'sub')) + '</p>' +
      fields +
      '<div class="err" id="waerr">' + T('Nama wajib diisi.', 'Please fill in your name.') + '</div>' +
      '<button class="box-send" id="wasend">' + svg('wa') + T('Kirim ke WhatsApp', 'Send to WhatsApp') + '</button>' +
      '<button class="box-cancel" id="wacancel">' + T('Batal', 'Cancel') + '</button>' +
      '</div>';
    m.classList.add('show');
    m.onclick = function (e) { if (e.target === m) waClose(); };
    el('wasend').addEventListener('click', waSend);
    el('wacancel').addEventListener('click', waClose);
    var first = (f.fields || [])[0];
    if (first) setTimeout(function () { var i = el('f_' + first.key); if (i) i.focus(); }, 80);
  }
  function waClose() { el('modal').classList.remove('show'); }

  function waSend() {
    var f = D.wa_form || {}, c = D.contact || {};
    var vals = {}, missing = false;
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
    waClose();
  }

  /* ---------- share ---------- */
  function share() {
    var url = location.href.split('#')[0];
    var title = (D.hero && D.hero.name ? D.hero.name : '') + ' · Bio GAINS';
    if (navigator.share) {
      navigator.share({ title: title, text: title, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      var b = el('btnshare');
      b.style.color = 'var(--gold)';
      setTimeout(function () { b.style.color = ''; }, 900);
    }
  }

  render();
})();
