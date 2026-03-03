/* ============================================================
   VISTARA TECH GLOBAL — JAVASCRIPT
   Particles · Navbar · Scroll Reveal · Stats Counter · Form
   ============================================================ */

(function () {
  'use strict';

  /* ======================================================
     1. PARTICLE SYSTEM — Mobile-Adaptive
     ====================================================== */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  const isTouch = navigator.maxTouchPoints > 0;
  let isMobile, isTablet, COUNT, CONNECT, FPS, INTERVAL;
  let lastTS = 0;
  let animFrame;

  function getDeviceProfile() {
    const w = window.innerWidth;
    isMobile = w <= 600;
    isTablet = !isMobile && (w <= 900 || isTouch);
    COUNT = isMobile ? 18 : isTablet ? 32 : 90;
    CONNECT = !isMobile && !isTablet;   /* connection lines only on desktop */
    FPS = isMobile ? 20 : isTablet ? 30 : 60;
    INTERVAL = 1000 / FPS;
  }
  getDeviceProfile();

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const spd = isMobile ? 0.18 : 0.35;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * spd,
      vy: (Math.random() - 0.5) * spd,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() < 0.7 ? '#00e5ff' : Math.random() < 0.5 ? '#2979ff' : '#00bfa5',
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  }

  let particles = [];

  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function drawParticles(ts) {
    animFrame = requestAnimationFrame(drawParticles);
    if (ts - lastTS < INTERVAL) return;
    lastTS = ts;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const lifeFrac = p.life / p.maxLife;
      const fade = lifeFrac < 0.1 ? lifeFrac / 0.1 : lifeFrac > 0.9 ? (1 - lifeFrac) / 0.1 : 1;
      const alpha = p.opacity * fade;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(p.color, alpha);
      ctx.fill();

      /* Connection lines — desktop only */
      if (CONNECT) {
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.12 * alpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = hexToRgba('#00e5ff', lineAlpha);
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      if (p.life >= p.maxLife) particles[i] = createParticle();
    });
  }

  window.addEventListener('resize', () => {
    getDeviceProfile();
    resizeCanvas();
    cancelAnimationFrame(animFrame);
    initParticles();
    requestAnimationFrame(drawParticles);
  }, { passive: true });

  resizeCanvas();
  initParticles();
  requestAnimationFrame(drawParticles);

  /* ======================================================
     2. NAVBAR — scroll + mobile toggle
     ====================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link based on scroll position
  function updateActiveLink() {
    const sections = ['home', 'services', 'why-us', 'tech-stack', 'contact'];
    const scrollY = window.scrollY + 120;

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }

  /* ======================================================
     3. SCROLL REVEAL
     ====================================================== */
  const revealEls = document.querySelectorAll(
    '.service-card, .why-card, .tech-category, .section-header, .contact-left, .contact-right, .metrics-strip'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Live Tech cards: slide-in on scroll
  const ltCards = document.querySelectorAll('.lt-card');
  const ltObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        ltObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  ltCards.forEach(card => ltObserver.observe(card));

  /* ======================================================
     4. STAT COUNTER ANIMATION
     ====================================================== */
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  const heroSection = document.getElementById('home');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateStats();
    });
  }, { threshold: 0.3 });

  if (heroSection) statsObserver.observe(heroSection);

  // Live Tech stat counters
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const ltStatNums = document.querySelectorAll('.lt-stat-num');
  const ltStatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        ltStatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  ltStatNums.forEach(el => ltStatObserver.observe(el));

  /* ======================================================
     5. PARALLAX — hero visual (desktop only)
     ====================================================== */
  if (!isTouch) {
    const holoLogo = document.querySelector('.holo-logo');
    window.addEventListener('mousemove', (e) => {
      if (!holoLogo) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      holoLogo.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
    }, { passive: true });
  }

  /* ======================================================
     6. CONTACT FORM
     ====================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = document.getElementById('submit-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-icon">⏳</span> Transmitting... <span class="btn-glow"></span>';

      setTimeout(() => {
        btn.innerHTML = '<span class="btn-icon">✓</span> Sent Successfully! <span class="btn-glow"></span>';
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = '<span class="btn-icon">🚀</span> Launch Your Project <span class="btn-glow"></span>';
          formSuccess.style.display = 'none';
        }, 4000);
      }, 1800);
    });
  }

  /* ======================================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
     ====================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ======================================================
     8. CURSOR GLOW TRAIL (desktop only — avoid mobile perf hit)
     ====================================================== */
  if (!isTouch) {
    const cursorTrail = document.createElement('div');
    cursorTrail.style.cssText = `
      position: fixed;
      pointer-events: none;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,229,255,0.045), transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.15s ease, top 0.15s ease;
      z-index: 0;
      will-change: left, top;
    `;
    document.body.appendChild(cursorTrail);
    document.addEventListener('mousemove', (e) => {
      cursorTrail.style.left = e.clientX + 'px';
      cursorTrail.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ======================================================
     9. TECH PILLS HOVER GLOW
     ====================================================== */
  document.querySelectorAll('.tech-pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      pill.style.boxShadow = '0 0 12px rgba(0,229,255,0.2)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.boxShadow = '';
    });
  });

  /* ======================================================
     11. BUTTON RIPPLE ON CLICK
     ====================================================== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top - size / 2}px;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* Inject ripple keyframe once */
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }';
    document.head.appendChild(s);
  }

  console.log('%c⚡ VISTARA TECH GLOBAL', 'color:#00e5ff;font-size:20px;font-weight:900;font-family:monospace;');
  console.log('%cEngineering the Digital Future', 'color:#7fa3b5;font-size:12px;font-family:monospace;');

})();
