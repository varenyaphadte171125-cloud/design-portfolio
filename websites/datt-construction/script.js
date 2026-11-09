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
