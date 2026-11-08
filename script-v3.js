// Delta v3 — institucional com split-chars, kinetic text, burger mobile

(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // SCRAMBLE TEXT
  // ========================================
  const CHARS = '!<>-_\\/[]{}—=+*^?#________';
  class Scramble {
    constructor(el) { this.el = el; this.original = el.textContent; }
    run(duration = 900) {
      if (reduceMotion) { this.el.textContent = this.original; return; }
      const text = this.original;
      let frame = 0;
      const steps = Math.ceil(duration / 16);
      const scrambleFrames = Math.floor(steps * 0.7);
      const self = this;
      function tick() {
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const revealAt = (i / text.length) * scrambleFrames;
          if (frame < revealAt) {
            out += text[i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
          } else { out += text[i]; }
        }
        self.el.textContent = out;
        frame++;
        if (frame < steps) requestAnimationFrame(tick);
        else self.el.textContent = text;
      }
      tick();
    }
  }
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const s = new Scramble(el);
    setTimeout(() => s.run(), 300);
  });

  // ========================================
  // SPLIT CHARS IN HERO TITLE
  // ========================================
  (function splitHeroTitle(){
    const title = document.querySelector('[data-split-chars]');
    if (!title) return;
    const lines = title.querySelectorAll('.htitle-line');
    lines.forEach((line, lineIdx) => {
      const text = line.textContent;
      const words = text.split(' ');
      let html = '';
      let charIdx = 0;
      words.forEach((word, wIdx) => {
        const chars = [...word].map(c => {
          const delay = 0.6 + (lineIdx * 0.15) + (charIdx * 0.025);
          charIdx++;
          return `<span class="htitle-char" style="animation-delay: ${delay}s">${c}</span>`;
        }).join('');
        html += chars;
        if (wIdx < words.length - 1) html += '<span class="htitle-space"></span>';
      });
      line.innerHTML = html;
    });
  })();

  // ========================================
  // SCROLL PROGRESS
  // ========================================
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    let ticking = false;
    function update() {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      progressBar.style.transform = `scaleX(${scrolled})`;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  // ========================================
  // HERO TIMECODE
  // ========================================
  const timecode = document.getElementById('heroTimecode');
  if (timecode) {
    function pad(n){ return String(n).padStart(2,'0'); }
    function tick() {
      const now = new Date();
      timecode.textContent = `T ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ========================================
  // HERO PARALLAX
  // ========================================
  if (!reduceMotion) {
    const hero = document.querySelector('.hero-v3');
    const photos = document.querySelectorAll('.hv-photo');
    const content = document.querySelector('.hero-v3-content');
    if (hero && photos.length) {
      let ticking = false;
      function update() {
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        photos.forEach((p, i) => {
          const factor = [40, 70, 40][i] || 50;
          p.style.transform = `translate3d(0, ${progress * factor}px, 0) scale(${1 + progress * 0.08})`;
        });
        if (content) {
          content.style.transform = `translate3d(0, ${progress * -40}px, 0)`;
          content.style.opacity = String(Math.max(0, 1 - progress * 1.4));
        }
        ticking = false;
      }
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
    }
  }

  // ========================================
  // TITLE MASK REVEAL (seções)
  // ========================================
  document.querySelectorAll('.title-mask').forEach(title => {
    const html = title.innerHTML;
    const lines = html.split(/<br\s*\/?>/i);
    title.innerHTML = lines.map(l =>
      `<span class="tm-line"><span class="tm-inner">${l.trim()}</span></span>`
    ).join('');
  });

  // ========================================
  // INTERSECTION OBSERVERS
  // ========================================
  if ('IntersectionObserver' in window) {
    // Title mask + reveal stagger
    const io1 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (entry.target.classList.contains('reveal-stagger')) {
            Array.from(entry.target.children).forEach((child, i) => {
              child.style.transitionDelay = (i * 100) + 'ms';
            });
          }
          io1.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.title-mask, .reveal-stagger').forEach(el => io1.observe(el));

    // Counters
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => io2.observe(el));

    // Kinetic text (manifesto)
    const kt = document.querySelector('[data-kinetic-text]');
    if (kt) {
      const spans = kt.querySelectorAll('span');
      const io3 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;
          const idx = Array.from(spans).indexOf(el);
          // Lit progressive based on scroll position
        });
      });
      // Use scroll-based reveal for manifesto
      function updateManifesto() {
        const rect = kt.getBoundingClientRect();
        const viewH = window.innerHeight;
        // Progress from when top of kt is at 70% of viewport to when bottom is at 30%
        const total = rect.height + viewH;
        const scrolled = viewH - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / total * 1.3));
        const count = Math.floor(progress * spans.length);
        spans.forEach((s, i) => {
          if (i < count) s.classList.add('lit');
          else s.classList.remove('lit');
        });
      }
      let ticking = false;
      function onScroll() {
        if (!ticking) {
          requestAnimationFrame(() => { updateManifesto(); ticking = false; });
          ticking = true;
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      updateManifesto();
    }
  }

  function animateCount(el) {
    if (reduceMotion) { el.textContent = el.dataset.count; return; }
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
      else liveIncrement(el, target, pad);
    }
    requestAnimationFrame(tick);
  }

  // Incremento ao vivo: após a contagem inicial, números seguem subindo
  // devagar enquanto o cliente está no site (simulando operação em andamento)
  function liveIncrement(el, baseTarget, pad) {
    if (reduceMotion) return;
    // Pulsos configurados por tipo de métrica
    // 0 continua 0 (incidentes). 100 continua 100 (certificados)
    if (baseTarget === 0 || baseTarget === 100) return;
    let current = baseTarget;
    // Intervalo sutil: aumenta a cada 4-10s valor pequeno (1-3)
    function schedule() {
      const delay = 4000 + Math.random() * 6000;
      setTimeout(() => {
        const bump = 1 + Math.floor(Math.random() * 3);
        current += bump;
        animateBumpTo(el, current, pad);
        schedule();
      }, delay);
    }
    schedule();
  }
  function animateBumpTo(el, newVal, pad) {
    const from = parseInt(el.textContent, 10) || 0;
    const dur = 900;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (newVal - from) * eased);
      el.textContent = String(val).padStart(pad, '0');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ========================================
  // MOBILE BURGER
  // ========================================
  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================
  // AURORA SHADER
  // ========================================
  (function initAurora(){
    const canvas = document.getElementById('heroAurora');
    if (!canvas || reduceMotion) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
    if (!gl) return;

    const vs = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
    const fs = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i+vec2(0,0)), hash(i+vec2(1,0)), u.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
      }
      float bayer(vec2 pos){
        pos = mod(pos, 4.0);
        int x = int(pos.x); int y = int(pos.y);
        float m[16];
        m[0]=0.0;m[1]=8.0;m[2]=2.0;m[3]=10.0;
        m[4]=12.0;m[5]=4.0;m[6]=14.0;m[7]=6.0;
        m[8]=3.0;m[9]=11.0;m[10]=1.0;m[11]=9.0;
        m[12]=15.0;m[13]=7.0;m[14]=13.0;m[15]=5.0;
        return m[y*4 + x] / 16.0 - 0.5;
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = uv * 3.2;
        float t = u_time * 0.1;
        float n = noise(p + t) * 0.6 + noise(p * 2.2 - t * 0.7) * 0.3;
        vec3 olive = vec3(0.355, 0.396, 0.263);
        vec3 neon = vec3(0.788, 1.0, 0.180);
        vec3 col = mix(vec3(0.030, 0.030, 0.025), olive, n);
        col += neon * smoothstep(0.78, 1.0, n) * 0.25;
        col += bayer(gl_FragCoord.xy) / 42.0;
        float vig = smoothstep(1.25, 0.3, length(uv - 0.5));
        col *= vig;
        gl_FragColor = vec4(col, 0.9);
      }
    `;
    function compile(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    function resize() {
      const cap = 0.55;
      const w = Math.floor(canvas.clientWidth * cap);
      const h = Math.floor(canvas.clientHeight * cap);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }
    resize();
    window.addEventListener('resize', resize);
    const start = performance.now();
    let visible = true;
    const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    io.observe(canvas);
    function render() {
      if (visible) {
        const t = (performance.now() - start) / 1000;
        gl.uniform1f(uTime, t);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestAnimationFrame(render);
    }
    render();
  })();

})();

// ========================================================================
// SERVIÇOS DESPACHANTE — tabs por categoria no mobile
// ========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.svc-tab');
  const cards = document.querySelectorAll('.svc-card');
  if (!tabs.length || !cards.length) return;

  function filter(cat) {
    cards.forEach(card => {
      const dc = card.dataset.cat || '';
      if (cat === 'todos' || dc === cat) {
        card.classList.add('visible');
      } else {
        card.classList.remove('visible');
      }
    });
  }

  // Inicializa mostrando todos
  filter('todos');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filter(tab.dataset.cat);
    });
  });
});
