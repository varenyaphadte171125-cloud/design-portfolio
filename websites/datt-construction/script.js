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

  // Gold sparkles in the hero
  const sparkles = document.querySelector('.sparkles');
  if (sparkles) {
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('i');
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 85 + '%';
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      const size = 3 + Math.random() * 6;
      s.style.width = s.style.height = size + 'px';
      sparkles.appendChild(s);
    }
  }

  // Animated skyline: glossy glass by day, rooms switching lights on and off at night
  const svg = document.getElementById('skylineSvg');
  if (svg) {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const ri = (a, b) => Math.floor(a + rnd() * (b - a + 1));
    const W = 1600, H = 420, ROOMS = 14;
    const bld = [], rooms = Array.from({ length: ROOMS }, () => []);
    const rect = (x, y, w, h, f) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"${f ? ` fill="${f}"` : ''}/>`;
    const layer = (minW, maxW, minH, maxH, win, fill, glass, tallCentre) => {
      let x = -20;
      while (x < W + 20) {
        const w = ri(minW, maxW);
        let h = ri(minH, maxH);
        if (tallCentre && x > 560 && x < 1040) h = Math.floor(h * 1.35);
        h = Math.min(h, H - 10);
        const y = H - h;
        bld.push(rect(x, y, w, h, fill));
        const r = rnd();
        if (r < .25) bld.push(rect(x + w * .3, y - 14, w * .4, 14, fill));
        else if (r < .4) bld.push(rect(x + w / 2 - 1.5, y - 34, 3, 34, fill));
        else if (r < .5) bld.push(`<path d="M${x} ${y}L${x + w / 2} ${y - 22}L${x + w} ${y}Z" fill="${fill}"/>`);
        const gap = 6, cols = Math.max(1, Math.floor((w - gap) / (win + gap)));
        const ox = x + (w - (cols * (win + gap) - gap)) / 2;
        for (let yy = y + gap + 4; yy < H - win - 6; yy += win * 1.3 + gap) {
          for (let c = 0; c < cols; c++) {
            if (rnd() < .82) {
              const wx = ox + c * (win + gap);
              bld.push(rect(wx, yy, win, win * 1.3, glass));
              if (rnd() < .55) rooms[ri(0, ROOMS - 1)].push(rect(wx, yy, win, win * 1.3));
            }
          }
        }
        x += w + ri(-6, 10);
      }
    };
    layer(50, 110, 140, 300, 6, 'url(#gb)', 'url(#glassB)', true);
    layer(40, 95, 60, 190, 5, 'url(#gf)', 'url(#glassF)', false);
    const warm = ['#fff4c2', '#ffe9a0', '#fffbe6', '#ffdf85']; // bright lit rooms that stand out on the gold facades
    svg.innerHTML =
      '<defs>' +
      '<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e0b6"/><stop offset="1" stop-color="#e2c27f"/></linearGradient>' +
      '<linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ac55"/><stop offset="1" stop-color="#9c6b1e"/></linearGradient>' +
      // glossy glass panes: bright upper half, sharp reflection line, deeper lower half
      '<linearGradient id="glassB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fbf0d6"/><stop offset=".5" stop-color="#e3c98f"/><stop offset="1" stop-color="#f5e6c3"/></linearGradient>' +
      '<linearGradient id="glassF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf5"/><stop offset=".45" stop-color="#f6e3b4"/><stop offset=".5" stop-color="#c99a45"/><stop offset="1" stop-color="#ecd29a"/></linearGradient>' +
      '</defs>' +
      `<g class="bld">${bld.join('')}</g>` +
      // lit rooms: the whole group fades in at dusk; each room blinks on/off at its own pace
      '<g class="lit">' + rooms.map((r, i) => {
        const dur = (12 + rnd() * 14).toFixed(1), delay = (-rnd() * 26).toFixed(1);
        const steady = i % 4 === 0 ? ' room--steady' : '';
        return `<g class="room${steady}" fill="${warm[i % warm.length]}" style="animation-duration:${dur}s;animation-delay:${delay}s">${r.join('')}</g>`;
      }).join('') + '</g>';
  }

  // Glowing night sky: stars of different sizes, sparkles and shooting stars
  const stars = document.querySelector('.stars');
  if (stars) {
    const n = window.innerWidth < 600 ? 90 : 180;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      const r = Math.random();
      const size = r < .7 ? 1 + Math.random() : r < .95 ? 2 + Math.random() : 3.5;
      s.style.width = s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.pow(Math.random(), 1.4) * 100 + '%'; // more stars higher up
      s.style.animationDuration = (2 + Math.random() * 4).toFixed(2) + 's';
      s.style.animationDelay = (-Math.random() * 5).toFixed(2) + 's';
      if (Math.random() < .06) s.className = 'sparkle';
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
