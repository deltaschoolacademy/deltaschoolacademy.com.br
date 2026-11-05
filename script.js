// ============================================
// Delta School Academy — interactions
// ============================================

// -------- Loader --------
(function(){
  const loader = document.getElementById('loader');
  const countEl = document.getElementById('loaderCount');
  if (!loader) return;

  requestAnimationFrame(() => {
    loader.classList.add('loading');
  });

  // Counter animation 00 -> 100
  if (countEl) {
    let n = 0;
    const target = 100;
    const dur = 1500;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      n = Math.round(eased * target);
      countEl.textContent = String(n).padStart(2, '0');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  setTimeout(() => {
    loader.classList.add('done');
    document.body.style.overflow = '';
  }, 1700);
  document.body.style.overflow = 'hidden';
})();

// -------- Custom cursor --------
(function(){
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Hover state
  document.querySelectorAll('[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  document.querySelectorAll('.product, button, a').forEach(el => {
    if (el.closest('.cursor')) return;
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();

// -------- Split words --------
(function(){
  document.querySelectorAll('.split-words').forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="sw-word"><span class="sw-inner">${w}</span></span>`
    ).join('');
  });
})();

// -------- Reveal on scroll --------
(function(){
  const items = document.querySelectorAll('.reveal, .split-words, .hero-photo');
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach(i => io.observe(i));
})();

// -------- Hero photos parallax on scroll --------
(function(){
  const photos = document.querySelectorAll('.hero-photo');
  const stage = document.querySelector('.hero-stage');
  if (!photos.length || !stage) return;

  function tick() {
    const rect = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / (vh + rect.height))));
    photos.forEach((p, i) => {
      const factor = [15, 25, 15][i] || 20;
      p.style.backgroundPosition = `center ${20 + progress * factor}%`;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

// -------- Counter animation --------
(function(){
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    const pad = el.textContent.length;
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(eased * target);
      el.textContent = String(val).padStart(pad, '0');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

// -------- Product subtle parallax on hover --------
(function(){
  document.querySelectorAll('.product-media').forEach(media => {
    const img = media.querySelector('.product-img');
    if (!img) return;
    media.addEventListener('mousemove', (e) => {
      const rect = media.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `scale(1.06) translate(${x * -8}px, ${y * -8}px)`;
    });
    media.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });
})();

// -------- Filter chips --------
(function(){
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
})();
