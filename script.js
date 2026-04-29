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
