/* ── Particles Background ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.5 + 0.1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${p.o})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ── Typing Effect ── */
function initTyping() {
  const el = document.getElementById('typed-output');
  if (!el) return;
  const words = ['Docente de Informática', 'Especialista en Redes', 'Creador Multimedia', 'Apasionado de la IA'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = words[wordIdx];
    el.textContent = deleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);

    if (!deleting && charIdx > current.length) {
      setTimeout(() => { deleting = true; type(); }, 2000);
      return;
    }
    if (deleting && charIdx < 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  type();
}

/* ── Navbar ── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      toggle.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('active');
      toggle.classList.remove('active');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  });
}

/* ── Reveal on Scroll ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Skill Bars Animation ── */
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar .fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));
}

/* ── Counter Animation ── */
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(interval); }
          el.textContent = current + suffix;
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => observer.observe(el));
}

/* ── Contact Form (Formspree) ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type="submit"]');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      msg.className = 'form-msg error';
      msg.textContent = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    // Disable button while sending
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        msg.className = 'form-msg success';
        msg.textContent = '¡Mensaje enviado correctamente! Te responderé lo antes posible.';
        form.reset();
      } else {
        msg.className = 'form-msg error';
        msg.textContent = 'Hubo un error al enviar. Inténtalo de nuevo o escríbeme a ivanix135@gmail.com.';
      }
    } catch (error) {
      msg.className = 'form-msg error';
      msg.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
  });
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyping();
  initNavbar();
  initReveal();
  initSkillBars();
  initCounters();
  initContactForm();
});
