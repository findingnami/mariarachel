// ===== Navigation scroll shadow =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== Hamburger menu =====
const hamburger = document.getElementById('hamburger');
const navDrawer = document.getElementById('navDrawer');

hamburger.addEventListener('click', () => {
  const open = navDrawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close drawer when a link is clicked
navDrawer.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', () => {
    navDrawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close drawer on outside click
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) {
    navDrawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

// ===== Smooth scroll with nav offset =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('nav').offsetHeight;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

// Assign data-reveal and staggered delays to cards + timeline items
document.querySelectorAll('.project-card').forEach((el, i) => {
  el.setAttribute('data-reveal', '');
  el.setAttribute('data-delay', String(i % 3 + 1));
  revealObserver.observe(el);
});

document.querySelectorAll('.timeline-item, .skill-group, .edu-item').forEach(el => {
  el.setAttribute('data-reveal', '');
  revealObserver.observe(el);
});

// Stat counters in About section
function animateCount(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 35);
}

const statsObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat strong').forEach(el => {
          const raw = el.textContent.trim();
          const num = parseInt(raw);
          const suffix = raw.replace(String(num), '');
          animateCount(el, num, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== Extended scroll reveal =====
document.querySelectorAll('.section .label, .section .heading').forEach(el => {
  el.setAttribute('data-reveal', '');
  revealObserver.observe(el);
});

document.querySelectorAll('.about-body p').forEach((el, i) => {
  el.setAttribute('data-reveal', '');
  el.setAttribute('data-delay', String(i + 1));
  revealObserver.observe(el);
});

document.querySelectorAll('.edu-col-title').forEach(el => {
  el.setAttribute('data-reveal', '');
  revealObserver.observe(el);
});

const contactLeft = document.querySelector('.contact-left');
const contactRight = document.querySelector('.contact-right');
if (contactLeft) { contactLeft.setAttribute('data-reveal', ''); revealObserver.observe(contactLeft); }
if (contactRight) { contactRight.setAttribute('data-reveal', ''); contactRight.setAttribute('data-delay', '2'); revealObserver.observe(contactRight); }

// ===== Sparkles + background glow trail =====
const ORANGE = '#e07e4a';
const GREEN  = '#97a069';
const CHARS  = ['✦', '✧', '⋆', '✸', '★'];
let lastSpawn = 0, lastMX = 0, lastMY = 0;

function spawnSparkle(x, y) {
  const el = document.createElement('span');
  el.className = 'sparkle';
  el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
  el.style.color    = Math.random() < 0.5 ? ORANGE : GREEN;
  el.style.left     = (x + (Math.random() - 0.5) * 22) + 'px';
  el.style.top      = (y + (Math.random() - 0.5) * 22) + 'px';
  el.style.fontSize = (10 + Math.random() * 11) + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

const bgCanvas = document.getElementById('bgCanvas');
const bgCtx    = bgCanvas.getContext('2d');
let cW = 0, cH = 0;

function resizeBgCanvas() {
  cW = bgCanvas.width  = window.innerWidth;
  cH = bgCanvas.height = window.innerHeight;
  bgCtx.fillStyle = '#ffffff';
  bgCtx.fillRect(0, 0, cW, cH);
}
resizeBgCanvas();
window.addEventListener('resize', resizeBgCanvas, { passive: true });

let trailHue = Math.random() * 360;
let glowX = -1, glowY = -1;

// Render loop — clears canvas each frame and redraws glow only at current pointer position
(function renderGlow() {
  bgCtx.fillStyle = '#ffffff';
  bgCtx.fillRect(0, 0, cW, cH);
  if (glowX >= 0) {
    const r = 48;
    const grd = bgCtx.createRadialGradient(glowX, glowY, 0, glowX, glowY, r);
    grd.addColorStop(0,   `hsla(${trailHue}, 40%, 72%, 0.14)`);
    grd.addColorStop(0.5, `hsla(${trailHue}, 40%, 72%, 0.06)`);
    grd.addColorStop(1,   `hsla(${trailHue}, 40%, 72%, 0)`);
    bgCtx.fillStyle = grd;
    bgCtx.beginPath();
    bgCtx.arc(glowX, glowY, r, 0, Math.PI * 2);
    bgCtx.fill();
  }
  requestAnimationFrame(renderGlow);
})();

document.addEventListener('mousemove', e => {
  trailHue = (trailHue + 1.5) % 360;
  glowX = e.clientX;
  glowY = e.clientY;

  const now = Date.now();
  const dx = e.clientX - lastMX;
  const dy = e.clientY - lastMY;
  if (now - lastSpawn > 55 && dx * dx + dy * dy > 64) {
    spawnSparkle(e.clientX, e.clientY);
    lastSpawn = now;
    lastMX = e.clientX;
    lastMY = e.clientY;
  }
}, { passive: true });

// ===== Project card 3D tilt + pointer glow =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.setProperty('--gx', `${(x / r.width) * 100}%`);
    card.style.setProperty('--gy', `${(y / r.height) * 100}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== Hero photo parallax =====
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroPhoto.style.transform = `translateY(${y * 0.1}px)`;
    }
  }, { passive: true });
}
