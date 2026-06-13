// ============================================================
// CHAVEIRO JF 24H — FUTURISTIC INTERACTIONS
// ============================================================

// ─── PARTICLES SYSTEM ───────────────────────────────────────
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;
  let isCompact = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    isCompact = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
    particles = [];
    const area = W * H;
    const count = Math.min(isCompact ? 60 : 120, Math.max(18, Math.floor(area / (isCompact ? 25000 : 12000))));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#f5c400' : '#ff9500';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function connectParticles() {
    if (isCompact || reduceMotion) return;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#f5c400';
          ctx.globalAlpha = (1 - dist / 110) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ─── HEADER SCROLL ──────────────────────────────────────────
(function () {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

// ─── HAMBURGER MENU ─────────────────────────────────────────
(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  hamburger.addEventListener('click', () => {
    const isOpen = !nav.classList.contains('open');
    nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Ensure mobile nav is closed when switching to larger screens
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('open')) {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
})();

// ─── SMOOTH SCROLL ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── COUNTER ANIMATION ──────────────────────────────────────
(function () {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  let ran = false;

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('pt-BR');
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !ran) {
        ran = true;
        counters.forEach(el => {
          animateCounter(el, parseInt(el.dataset.count));
        });
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) observer.observe(statsEl);
})();

// ─── SCROLL REVEAL ──────────────────────────────────────────
(function () {
  const revealEls = document.querySelectorAll(
    '.service-card, .step-item, .feature-item, .area-pill, .why-image-frame, .why-content'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

// ─── STAGGER REVEAL FOR CARDS ───────────────────────────────
(function () {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  const pills = document.querySelectorAll('.area-pill');
  pills.forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 0.03}s`;
  });
})();

// ─── CURSOR GLOW EFFECT ─────────────────────────────────────
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip mobile

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,196,0,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: transform 0.1s linear;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ─── DYNAMIC GRID LINES (hero decoration) ──────────────────
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const grid = document.createElement('div');
  grid.style.cssText = `
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, transparent 0%, black 80%);
    -webkit-mask-image: radial-gradient(ellipse at center, transparent 0%, black 80%);
  `;
  hero.appendChild(grid);
})();

// ─── TILT EFFECT ON CARDS ───────────────────────────────────
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      card.style.transform = `translateY(-6px) perspective(1000px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── ACTIVE NAV LINK ON SCROLL ──────────────────────────────
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = '#f5c400';
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
})();

// ─── AI CHAT WIDGET ─────────────────────────────────────────
(function () {
  const WA_NUMBER = '5511963830204';
  const LOGO     = 'logo-jf.jpg';

  const widget   = document.getElementById('chat-widget');
  const toggle   = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close-btn');
  const messages = document.getElementById('chat-messages');
  const options  = document.getElementById('chat-options');
  const inputEl  = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send-btn');

  let step = 'start'; // states: start | category | subservice | done

  // ── Services tree ────────────────────────────────────────
  const SERVICES = {
    '🚗 Automotivo': {
      icon: '🚗',
      subs: [
        'Abertura de veículo',
        'Cópia de chave com transponder',
        'Cópia de chave canivete',
        'Codificação de controle remoto',
        'Chave de moto',
        'Outro serviço automotivo',
      ],
    },
    '🏠 Residencial': {
      icon: '🏠',
      subs: [
        'Abertura de porta',
        'Troca de fechadura',
        'Cópia de chave residencial',
        'Instalação de fechadura digital',
        'Conserto de fechadura',
        'Outro serviço residencial',
      ],
    },
    '🏢 Comercial': {
      icon: '🏢',
      subs: [
        'Abertura de porta comercial',
        'Abertura de cofre',
        'Fechadura de alta segurança',
        'Controle de acesso',
        'Fechadura magnética',
        'Outro serviço comercial',
      ],
    },
  };

  let selectedCategory = '';

  // ── Helpers ──────────────────────────────────────────────
  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function clearOptions() {
    options.innerHTML = '';
  }

  function addBotMessage(text, delay = 0) {
    return new Promise(resolve => {
      // Show typing indicator first
      const typing = document.createElement('div');
      typing.className = 'msg-bot';
      typing.innerHTML = `
        <img src="${LOGO}" class="msg-bot-avatar" alt="JF" loading="lazy" />
        <div class="typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>`;
      messages.appendChild(typing);
      scrollBottom();

      setTimeout(() => {
        typing.remove();
        const msg = document.createElement('div');
        msg.className = 'msg-bot';
        msg.innerHTML = `
          <img src="${LOGO}" class="msg-bot-avatar" alt="JF" />
          <div class="msg-bubble">${text}</div>`;
        messages.appendChild(msg);
        scrollBottom();
        resolve();
      }, delay || 900);
    });
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg-user';
    msg.innerHTML = `<div class="msg-bubble">${text}</div>`;
    messages.appendChild(msg);
    scrollBottom();
  }

  function showOptions(items, cssClass = '') {
    clearOptions();
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-btn ' + cssClass;
      btn.textContent = item;
      btn.addEventListener('click', () => handleOption(item));
      options.appendChild(btn);
    });
  }

  function openWhatsApp(service) {
    const msg = encodeURIComponent(
      `Olá, Chaveiro JF! Vi o site de vocês e preciso de ajuda com o seguinte serviço:\n\n🔑 *${service}*\n\nPoderia me atender?`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  }

  // ── Flow ────────────────────────────────────────────────
  async function startFlow() {
    messages.innerHTML = '';
    clearOptions();
    step = 'category';

    await addBotMessage('Olá! 👋 Bem-vindo ao <strong>Chaveiro JF 24 Horas</strong>!', 600);
    await addBotMessage('Sou o assistente virtual. Estou aqui para te conectar rapidamente com nossa equipe. 🔑', 1200);
    await addBotMessage('Qual tipo de serviço você precisa?', 800);

    showOptions(Object.keys(SERVICES));
  }

  async function handleOption(value) {
    addUserMessage(value);
    clearOptions();

    if (step === 'category') {
      selectedCategory = value;
      step = 'subservice';

      const cat = SERVICES[value];
      await addBotMessage(`Ótimo! Você escolheu <strong>${value}</strong>. 👍<br>Qual serviço específico você precisa?`, 900);
      showOptions([...cat.subs, '← Voltar']);

    } else if (step === 'subservice') {
      if (value === '← Voltar') {
        step = 'category';
        await addBotMessage('Tudo bem! Me diz qual categoria você prefere:', 600);
        showOptions(Object.keys(SERVICES));
        return;
      }

      step = 'done';
      const fullService = `${selectedCategory.replace(/^.+? /, '')} — ${value}`;

      await addBotMessage(`Perfeito! Vou te conectar com nossa equipe agora para:<br><strong>${value}</strong> 🚀`, 1000);
      await addBotMessage(
        `Clique no botão abaixo para abrir o <strong>WhatsApp</strong> com a sua solicitação já preenchida. Responderemos em segundos! ⚡`,
        1200
      );

      // WhatsApp button
      clearOptions();
      const waBtn = document.createElement('button');
      waBtn.className = 'chat-option-btn wa-redirect';
      waBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Abrir no WhatsApp`;
      waBtn.addEventListener('click', () => openWhatsApp(fullService));
      options.appendChild(waBtn);

      // Restart button
      const restartBtn = document.createElement('button');
      restartBtn.className = 'chat-option-btn';
      restartBtn.textContent = '🔄 Outro serviço';
      restartBtn.addEventListener('click', () => startFlow());
      options.appendChild(restartBtn);
    }
  }

  // ── Free text input ──────────────────────────────────────
  async function handleFreeText() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addUserMessage(text);
    clearOptions();

    await addBotMessage('Entendido! Vou te encaminhar para nossa equipe com essa mensagem. 💬', 900);

    const waBtn = document.createElement('button');
    waBtn.className = 'chat-option-btn wa-redirect';
    waBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      Enviar pelo WhatsApp`;
    waBtn.addEventListener('click', () => openWhatsApp(text));
    options.appendChild(waBtn);

    const restartBtn = document.createElement('button');
    restartBtn.className = 'chat-option-btn';
    restartBtn.textContent = '🔄 Recomeçar';
    restartBtn.addEventListener('click', () => startFlow());
    options.appendChild(restartBtn);
  }

  // ── Toggle open / close ──────────────────────────────────
  let initialized = false;

  function openChat() {
    widget.classList.add('open');
    if (!initialized) {
      initialized = true;
      startFlow();
    }
  }

  function closeChat() {
    widget.classList.remove('open');
  }

  // Ensure widget stays anchored to bottom-right and resets position
  function ensureWidgetPosition() {
    try {
      // force bottom-right fixed positioning and clear any inline top/left
      widget.style.bottom = '20px';
      widget.style.top = '';
      widget.style.left = '';
      widget.style.right = '20px';
      widget.style.position = 'fixed';
    } catch (e) {
      // ignore if widget not present
    }
  }

  // apply on load and whenever chat open/close
  ensureWidgetPosition();
  const origOpen = openChat;
  const origClose = closeChat;
  openChat = function() { ensureWidgetPosition(); origOpen(); };
  closeChat = function() { origClose(); ensureWidgetPosition(); };

  // also enforce on resize (some CSS or browser quirks can move fixed elements)
  window.addEventListener('resize', ensureWidgetPosition, { passive: true });

  toggle.addEventListener('click', () => {
    widget.classList.contains('open') ? closeChat() : openChat();
  });

  closeBtn.addEventListener('click', closeChat);

  // Input handlers
  sendBtn.addEventListener('click', handleFreeText);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleFreeText();
  });

  // ── Delegate clicks on service 'Solicitar' buttons to open chat and pre-select category ──
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.card-btn[data-service]');
    if (!btn) return;
    e.preventDefault();
    const serviceKey = btn.getAttribute('data-service');

    // If widget is not open, open it and start the flow; otherwise, ensure flow is started
    if (!widget.classList.contains('open')) {
      openChat();
      // startFlow may be called by openChat; call it explicitly to get the promise
      startFlow().then(() => setTimeout(() => handleOption(serviceKey), 200)).catch(() => {});
    } else {
      // If chat already open but not initialized, start flow first
      if (!initialized || step === 'start') {
        startFlow().then(() => setTimeout(() => handleOption(serviceKey), 200)).catch(() => {});
      } else {
        handleOption(serviceKey);
      }
    }
  });

  // ── Also attach direct listeners with logging as a fallback for debugging ──
  try {
    document.querySelectorAll('.card-btn[data-service]').forEach(btn => {
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        const key = this.getAttribute('data-service');
        console.log('[Chat] solicitar click ->', key);
        // same behaviour as delegation
        if (!widget.classList.contains('open')) {
          openChat();
          startFlow().then(() => setTimeout(() => handleOption(key), 200)).catch(() => {});
        } else {
          if (!initialized || step === 'start') {
            startFlow().then(() => setTimeout(() => handleOption(key), 200)).catch(() => {});
          } else {
            handleOption(key);
          }
        }
      });
    });
  } catch (err) {
    console.error('[Chat] error attaching card-btn listeners', err);
  }

})();
