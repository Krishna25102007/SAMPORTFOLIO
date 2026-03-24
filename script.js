/**
 * Samiksha Pilaniya | Portfolio
 * Main Script for Interactions, Animations, and 3D Effects
 */

/* ── 3D CYBER-SPACE BACKGROUND ── */
(() => {
  const c = document.getElementById('bgCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let w, h, nodes = [], time = 0;

  const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; init(); };
  window.addEventListener('resize', resize);

  class Node {
    constructor() {
      this.x = (Math.random() - 0.5) * 3000;
      this.y = (Math.random() - 0.5) * 3000;
      this.z = Math.random() * 2000;
      this.baseX = this.x; this.baseY = this.y; this.baseZ = this.z;
    }
    update() {
      this.z -= 1.5; if (this.z < 1) this.z = 2000;
      let angle = time * 0.15;
      this.x = this.baseX * Math.cos(angle) - this.baseZ * Math.sin(angle);
    }
    project() {
      const scale = 800 / (800 + this.z);
      return { x: w / 2 + this.x * scale, y: h / 2 + this.y * scale, s: scale, z: this.z };
    }
  }

  const init = () => {
    nodes = [];
    for (let i = 0; i < 100; i++) nodes.push(new Node());
  };

  const drawGrid = () => {
    const cy = h * 0.65, cw = w * 0.5;
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
    for (let i = 0; i < 40; i++) {
      let d = (i + (time * 10 % 1)) / 40;
      let y = cy + (h * 0.4) * d * d;
      if (y > cy) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }
    for (let i = -15; i <= 15; i++) {
      let tx = cw + i * w * 0.15;
      ctx.beginPath(); ctx.moveTo(cw, cy); ctx.lineTo(tx, h); ctx.stroke();
    }
  };

  const animate = () => {
    time += 0.005;
    ctx.fillStyle = '#030305'; ctx.fillRect(0, 0, w, h);
    drawGrid();

    nodes.forEach((n, i) => {
      n.update();
      const p = n.project();
      if (p.z > 1900) return;
      ctx.fillStyle = `rgba(0, 255, 136, ${0.4 * (1 - p.z / 2000)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 4 * p.s, 0, Math.PI * 2); ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const p2 = nodes[j].project();
        const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        if (d < 120 * p.s) {
          ctx.strokeStyle = `rgba(0, 200, 255, ${(1 - p.z / 2000) * 0.15})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  };
  resize(); animate();
})();

/* ── TYPED EFFECT ── */
(() => {
  const phrases = ['Cybersecurity Enthusiast', 'Backend Developer', 'Django REST API Builder', 'Problem Solver', 'CSE Student @ LPU', 'Network Security Explorer'];
  let pi = 0, ci = 0, del = false;
  const el = document.getElementById('typed');
  if (!el) return;
  const tick = () => {
    const cur = phrases[pi];
    el.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    if (!del && ci === cur.length) { del = true; return setTimeout(tick, 1800) }
    if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length }
    setTimeout(tick, del ? 45 : 85);
  };
  tick();
})();

/* ── INTERSECTION OBSERVER (REVEAL ANIMATIONS) ── */
(() => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
      } else {
        e.target.classList.remove('vis');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rev,.rev-l,.rev-r').forEach(el => obs.observe(el));
})();

/* ── NAVIGATION & SCROLL ── */
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
});

/* ── HAMBURGER MOBILE MENU ── */
const ham = document.getElementById('ham'), mob = document.getElementById('mobNav');
if (ham && mob) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open'); mob.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ── SCROLL TOP BUTTON ── */
if (toTop) {
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 3D TILT ON PROJECT CARDS ── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 14;
    const y = ((e.clientY - r.top) / r.height - .5) * -14;
    card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

/* ── STAGGERED REVEAL DELAYS ── */
document.querySelectorAll('.skills-grid .skill-card,.certs-grid .cert-card,.projects-grid .proj-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});

/* ── MOUSE-REACTIVE 3D TILT ON HERO PHOTO ── */
(() => {
  const wrap = document.getElementById('photoWrap');
  const scene = document.getElementById('imgScene');
  if (!wrap || !scene) return;
  let raf;
  wrap.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = wrap.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 28;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
      scene.style.animation = 'none';
      scene.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
  });
  wrap.addEventListener('mouseleave', () => {
    scene.style.animation = '';
    scene.style.transform = '';
  });
})();
