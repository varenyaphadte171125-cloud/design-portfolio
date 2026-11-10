// Datt Construction & Developers — site interactions
(function () {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');

  // Sticky header style on scroll
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  // Gold sparkles in the hero: two layers that shimmer in turn (cheap to animate)
  const sparkles = document.querySelector('.sparkles');
  if (sparkles) {
    let html = '';
    for (let l = 0; l < 2; l++) {
      let dots = '';
      for (let i = 0; i < 20; i++) {
        const r = (1.5 + Math.random() * 3).toFixed(1);
        dots += `<circle cx="${(Math.random() * 100).toFixed(2)}%" cy="${(Math.random() * 85).toFixed(2)}%" r="${r}"/>`;
      }
      html += `<svg class="sparkle-layer sparkle-layer--${l}" width="100%" height="100%"><g fill="url(#sparkleDot)">${dots}</g></svg>`;
    }
    sparkles.innerHTML = '<svg width="0" height="0" style="position:absolute"><defs><radialGradient id="sparkleDot"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#e8c77a"/><stop offset="1" stop-color="#e8c77a" stop-opacity="0"/></radialGradient></defs></svg>' + html;
  }

  // Animated skyline.
  // Built as stacked layers so the lights can change without redrawing the city:
  //   1. gold buildings with glossy glass (static)
  //   2. dark night glass over every window (fades in at night)
  //   3. lit rooms (steady, no flicker)
  const sky = document.getElementById('skyline');
  if (sky) {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const ri = (a, b) => Math.floor(a + rnd() * (b - a + 1));
    const W = 1600, H = 420, ROOMS = 8;
    const bld = [], dark = [], rooms = Array.from({ length: ROOMS }, () => []);
    const R = (x, y, w, h, f) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"${f ? ` fill="${f}"` : ''}/>`;
    const layer = (minW, maxW, minH, maxH, win, fill, glass, night, tallCentre) => {
      let x = -20;
      while (x < W + 20) {
        const w = ri(minW, maxW);
        let h = ri(minH, maxH);
        if (tallCentre && x > 560 && x < 1040) h = Math.floor(h * 1.35);
        h = Math.min(h, H - 10);
        const y = H - h;
        bld.push(R(x, y, w, h, fill));
        const r = rnd();
        if (r < .25) bld.push(R(x + w * .3, y - 14, w * .4, 14, fill));
        else if (r < .4) bld.push(R(x + w / 2 - 1.5, y - 34, 3, 34, fill));
        else if (r < .5) bld.push(`<path d="M${x} ${y}L${x + w / 2} ${y - 22}L${x + w} ${y}Z" fill="${fill}"/>`);
        const gap = 6, cols = Math.max(1, Math.floor((w - gap) / (win + gap)));
        const ox = x + (w - (cols * (win + gap) - gap)) / 2;
        for (let yy = y + gap + 4; yy < H - win - 6; yy += win * 1.3 + gap) {
          for (let c = 0; c < cols; c++) {
            if (rnd() < .82) {
              const wx = ox + c * (win + gap), wh = win * 1.3;
              bld.push(R(wx, yy, win, wh, glass));
              dark.push(R(wx, yy, win, wh, night));
              if (rnd() < .5) {
                const g = rooms[ri(0, ROOMS - 1)];
                g.push(R(wx - 1.5, yy - 1.5, win + 3, wh + 3, 'rgba(255,190,80,.35)')); // soft glow
                g.push(R(wx, yy, win, wh));
              }
            }
          }
        }
        x += w + ri(-6, 10);
      }
    };
    layer(50, 110, 140, 300, 6, 'url(#gb)', 'url(#glassB)', '#8a5f26', true);
    layer(40, 95, 60, 190, 5, 'url(#gf)', 'url(#glassF)', '#4a3218', false);
    const svgOpen = (cls, extra = '') => `<svg class="${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice"${extra}>`;
    const warm = ['#ffe9a3', '#fff3c8', '#ffd77a', '#fff8e1'];
    sky.innerHTML =
      svgOpen('sk-base') +
        '<defs>' +
        '<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e0b6"/><stop offset="1" stop-color="#e2c27f"/></linearGradient>' +
        '<linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ac55"/><stop offset="1" stop-color="#9c6b1e"/></linearGradient>' +
        '<linearGradient id="glassB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fbf0d6"/><stop offset=".5" stop-color="#e3c98f"/><stop offset="1" stop-color="#f5e6c3"/></linearGradient>' +
        '<linearGradient id="glassF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf5"/><stop offset=".45" stop-color="#f6e3b4"/><stop offset=".5" stop-color="#c99a45"/><stop offset="1" stop-color="#ecd29a"/></linearGradient>' +
        '</defs>' + bld.join('') + '</svg>' +
      svgOpen('sk-dark') + dark.join('') + '</svg>' +
      // lit rooms: turn on at dusk, stay on steadily all night
      svgOpen('sk-lit') + rooms.map((r, i) => `<g fill="${warm[i % warm.length]}">${r.join('')}</g>`).join('') + '</svg>';
  }

  // Glowing night sky: stars drawn into three layers that twinkle in turn,
  // plus a few sparkle stars and shooting stars
  const stars = document.querySelector('.stars');
  if (stars) {
    const per = window.innerWidth < 600 ? 25 : 45;
    let html = '<svg width="0" height="0" style="position:absolute"><defs><radialGradient id="starGlow"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#fffaf0"/><stop offset=".5" stop-color="#e9e6ff" stop-opacity=".35"/><stop offset="1" stop-color="#e9e6ff" stop-opacity="0"/></radialGradient></defs></svg>';
    for (let l = 0; l < 3; l++) {
      let dots = '';
      for (let i = 0; i < per; i++) {
        const r = Math.random();
        const size = r < .7 ? 2 + Math.random() * 2 : r < .95 ? 4 + Math.random() * 2 : 7;
        dots += `<circle cx="${(Math.random() * 100).toFixed(2)}%" cy="${(Math.pow(Math.random(), 1.4) * 100).toFixed(2)}%" r="${size.toFixed(1)}"/>`;
      }
      html += `<svg class="star-layer star-layer--${l}" width="100%" height="100%"><g fill="url(#starGlow)">${dots}</g></svg>`;
    }
    stars.innerHTML = html;
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('i');
      s.className = 'sparkle';
      s.style.left = (5 + Math.random() * 90) + '%';
      s.style.top = (Math.random() * 80) + '%';
      s.style.animationDelay = (-Math.random() * 4).toFixed(1) + 's';
      stars.appendChild(s);
    }
    [[78, 8, 0], [55, 4, 3.2], [92, 22, 6.1]].forEach(([l, t, d]) => {
      const sh = document.createElement('span');
      sh.className = 'shooting';
      sh.style.left = l + '%'; sh.style.top = t + '%'; sh.style.animationDelay = d + 's';
      stars.appendChild(sh);
    });
  }

  // Project filters
  const filters = document.querySelectorAll('.filter');
  const pcards = document.querySelectorAll('.pcard');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    filters.forEach((b) => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    pcards.forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
  }));

  // Count-up for the experience figures
  const counters = document.querySelectorAll('[data-count]');
  const countUp = (el) => {
    const end = +el.dataset.count, start = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); }
    }), { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  } else counters.forEach((c) => (c.textContent = c.dataset.count));

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('visible'));
  }

  // Contact form -> opens the visitor's email app with the enquiry filled in
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const email = document.querySelector('[data-email]').textContent.trim();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = !f.value.trim();
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Please fill in your name and phone number.'; return; }

    const d = new FormData(form);
    const subject = `Project enquiry: ${d.get('type')}`;
    const body = `Name: ${d.get('name')}\nPhone: ${d.get('phone')}\nProject type: ${d.get('type')}\n\n${d.get('message')}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Thank you! Your email app should open to send the enquiry.';
    form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
