/**
 * CR WEB DESIGN — KINETIC ASTERISK MOTION ENGINE & INTERACTIVE CONTROLLER
 * Powered by GSAP 3, ScrollTrigger & Precision Physics
 */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Global scroll rotation for kinetic asterisk across all sections
  let currentRotation = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    currentRotation = (scrollY * 0.28) % 360;
  }, { passive: true });

  // ==========================================================================
  // 1. PERSISTENT KINETIC FLOATING ASTERISK TIMELINE (GSAP SCROLLTRIGGER)
  // Gira continuamente com o scroll, desce, vai para os cantos e se expande
  // ==========================================================================
  const asteriskWrapper = document.getElementById('kinetic-asterisk-wrapper');
  const heroTrack = document.getElementById('hero-track');
  const heroIntro = document.getElementById('hero-intro-view');
  const blueCurtain = document.getElementById('blue-curtain');
  const curtainContent = document.getElementById('curtain-content');
  const navbar = document.getElementById('navbar');
  const floatingWhatsapp = document.querySelector('.floating-whatsapp');

  if (asteriskWrapper && heroTrack) {

    // GSAP ScrollTrigger Master Kinetic Timeline
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-track',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;

          // Fade out Hero Intro Text (0.00 to 0.15)
          if (heroIntro) {
            if (progress <= 0.15) {
              const op = Math.max(0, 1 - (progress / 0.12));
              gsap.set(heroIntro, { opacity: op, y: progress * 40 });
            } else {
              gsap.set(heroIntro, { opacity: 0 });
            }
          }

          // Scale Asterisk into full Blue Flood (0.00 to 0.60)
          if (progress <= 0.60) {
            const zoomFactor = progress / 0.60;
            const initialY = window.innerWidth <= 768 ? -115 : -135;
            const currentY = initialY * (1 - Math.min(1, zoomFactor * 1.5));
            const asteriskScale = 1 + Math.pow(zoomFactor, 2.6) * 58;
            gsap.set(asteriskWrapper, {
              scale: asteriskScale,
              x: 0,
              y: currentY,
              rotation: currentRotation + progress * 120
            });
          }

          // Blue Curtain Message Reveal (0.30 to 1.00 — Permanece 100% visível na transição)
          if (blueCurtain && curtainContent) {
            if (progress >= 0.30) {
              const curtainOpacity = Math.min(1, (progress - 0.30) / 0.20);
              blueCurtain.style.opacity = curtainOpacity;

              let msgOpacity = 0;
              let msgY = 20;
              if (progress >= 0.45) {
                msgOpacity = Math.min(1, (progress - 0.45) / 0.15);
                msgY = 20 * (1 - msgOpacity);
              }
              curtainContent.style.opacity = msgOpacity;
              curtainContent.style.transform = `translateY(${msgY}px)`;
            } else {
              blueCurtain.style.opacity = 0;
              curtainContent.style.opacity = 0;
            }
          }

          // Dynamic Navbar State
          if (navbar) {
            if (progress >= 0.65) {
              navbar.classList.remove('compact');
              navbar.classList.add('expanded');
            } else {
              navbar.classList.remove('expanded');
              navbar.classList.add('compact');
            }
          }

          // Floating WhatsApp
          if (floatingWhatsapp) {
            if (progress >= 0.70) {
              floatingWhatsapp.classList.add('is-visible');
            } else {
              floatingWhatsapp.classList.remove('is-visible');
            }
          }
        }
      }
    });

    // Kinetic Journey after Hero across Sections:
    
    // 1. Glide into Section 2: Ajuste Fine (O Detalhe Muda Tudo)
    // Símbolo permanece pequeno e acompanha a navegação no canto superior direito
    ScrollTrigger.create({
      trigger: '#ajuste-fine',
      start: 'top bottom',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const isMobile = window.innerWidth <= 768;
        gsap.to(asteriskWrapper, {
          x: isMobile ? '35vw' : '38vw',
          y: isMobile ? '-38vh' : '-32vh',
          scale: isMobile ? 0.65 : 0.75,
          rotation: currentRotation + self.progress * 360,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  }

  // ==========================================================================
  // SECTION 2: AJUSTE FINE — STAGGERED EDITORIAL REVEALS
  // ==========================================================================
  
  // 1. Reveal Header Meta & Bottom Ruler
  gsap.utils.toArray('.gsap-fine-reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 2. Monumental Headline Lines Reveal (Staggered)
  const fineLines = gsap.utils.toArray('.gsap-fine-line');
  if (fineLines.length > 0) {
    gsap.fromTo(fineLines,
      { opacity: 0, y: 45 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.fine-title-wrapper',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 3. Narrative Items Progressive Reveal
  gsap.utils.toArray('.gsap-fine-item').forEach((el, index) => {
    gsap.fromTo(el,
      { opacity: 0, x: -25 },
      {
        opacity: 1,
        x: 0,
        duration: 0.85,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 86%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 4. Quote Statement Block (Hard Shadow & Contrast Snap)
  const fineQuote = document.querySelector('.gsap-fine-quote');
  if (fineQuote) {
    gsap.fromTo(fineQuote,
      { opacity: 0, y: 35, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: fineQuote,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 5. Signature Card Reveal
  const fineSig = document.querySelector('.gsap-fine-sig');
  if (fineSig) {
    gsap.fromTo(fineSig,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: fineSig,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ==========================================================================
  // SECTION 03: SOBRE MIM — PINNED STEPPED-SCROLL PRESENTATION (3 SLIDES)
  // ==========================================================================
  const aboutSection = document.getElementById('sobre-mim');
  const slide1 = document.getElementById('about-slide-1');
  const slide2 = document.getElementById('about-slide-2');
  const slide3 = document.getElementById('about-slide-3');
  const cornerTopRight = document.querySelector('.corner-top-right');
  const cornerBottomLeft = document.querySelector('.corner-bottom-left');

  if (aboutSection && slide1 && slide2 && slide3) {
    // Initial state: slide1 visible, slide2 and slide3 hidden
    gsap.set(slide1, { opacity: 1, y: 0, pointerEvents: 'auto' });
    gsap.set(slide2, { opacity: 0, y: 45, pointerEvents: 'none' });
    gsap.set(slide3, { opacity: 0, y: 45, pointerEvents: 'none' });

    const aboutTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#sobre-mim',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Hide persistent kinetic floating asterisk while inside Section 3
          if (asteriskWrapper) {
            if (self.progress > 0.01 && self.progress < 0.99) {
              gsap.to(asteriskWrapper, { opacity: 0, duration: 0.2, overwrite: 'auto' });
            } else {
              gsap.to(asteriskWrapper, { opacity: 1, duration: 0.2, overwrite: 'auto' });
            }
          }
        }
      }
    });

    aboutTimeline
      // Step 1: Slide 1 held in view
      .to({}, { duration: 1.2 })
      // Transition Slide 1 -> Slide 2
      .to(slide1, { 
        opacity: 0, 
        y: -35, 
        duration: 0.85, 
        ease: 'power2.inOut',
        onStart: () => { slide1.style.pointerEvents = 'none'; },
        onReverseComplete: () => { slide1.style.pointerEvents = 'auto'; }
      })
      .to([cornerTopRight, cornerBottomLeft], {
        opacity: 0,
        scale: 0.88,
        duration: 0.85,
        ease: 'power2.inOut'
      }, '<')
      .fromTo(slide2, 
        { opacity: 0, y: 45 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.85, 
          ease: 'power2.out',
          onStart: () => { slide2.style.pointerEvents = 'auto'; },
          onReverseComplete: () => { slide2.style.pointerEvents = 'none'; }
        }, '<0.2'
      )
      // Step 2: Slide 2 held in view
      .to({}, { duration: 1.4 })
      // Transition Slide 2 -> Slide 3
      .to(slide2, { 
        opacity: 0, 
        y: -35, 
        duration: 0.85, 
        ease: 'power2.inOut',
        onStart: () => { slide2.style.pointerEvents = 'none'; },
        onReverseComplete: () => { slide2.style.pointerEvents = 'auto'; }
      })
      .fromTo(slide3, 
        { opacity: 0, y: 45 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.85, 
          ease: 'power2.out',
          onStart: () => { slide3.style.pointerEvents = 'auto'; },
          onReverseComplete: () => { slide3.style.pointerEvents = 'none'; }
        }, '<0.2'
      )
      // Step 3: Slide 3 held in view until completion
      .to({}, { duration: 1.2 });
  }

  // ==========================================================================
  // SECTION 04: VISUAL PLAYGROUND — GSAP SCROLLTRIGGER ANIMATIONS & REVEALS
  // ==========================================================================

  // Asterisk Movement into Section 04 (Visual Playground)
  ScrollTrigger.create({
    trigger: '#visual-playground',
    start: 'top 70%',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      const isMobile = window.innerWidth <= 768;
      gsap.to(asteriskWrapper, {
        x: isMobile ? '36vw' : '40vw',
        y: isMobile ? '-38vh' : '-30vh',
        scale: isMobile ? 0.6 : 0.72,
        rotation: currentRotation + self.progress * 360,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  // Section 04: Header Meta & Control Bars Reveal
  gsap.utils.toArray('.gsap-pg-reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Section 04: Monumental Title Lines Staggered Reveal
  const pgTitleLines = gsap.utils.toArray('.gsap-pg-title');
  if (pgTitleLines.length > 0) {
    gsap.fromTo(pgTitleLines,
      { opacity: 0, y: 45 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.playground-headline-wrap',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Section 04: Manifesto Grid Items Reveal
  gsap.utils.toArray('.gsap-pg-text').forEach((el, idx) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        delay: idx * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });



  // ==========================================================================
  // 2. STAGGERED SCROLL REVEAL ANIMATIONS (GSAP SCROLLTRIGGER)
  // Faz com que os elementos surjam suavemente ao rolar a página
  // ==========================================================================
  const scrollElements = gsap.utils.toArray('.gsap-scroll-item');
  scrollElements.forEach((el) => {
    gsap.fromTo(el, 
      {
        opacity: 0,
        y: 40,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Hero Initial Reveals
  gsap.from('.gsap-reveal', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.15,
    ease: 'power4.out',
    delay: 0.2
  });

  // ==========================================================================
  // 3. MAGNETIC BUTTON PHYSICS
  // ==========================================================================
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  if (window.matchMedia('(pointer: fine)').matches) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0)`;
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transform = 'translate3d(0px, 0px, 0px)';
      });
    });
  }

  // ==========================================================================
  // 4. AMBIENT CURSOR LIGHT (DESKTOP)
  // ==========================================================================
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(updateCursor);
    };
    updateCursor();
  }

  // ==========================================================================
  // 5. EDITORIAL PORTFOLIO INSPECT MODAL (LIGHTBOX)
  // ==========================================================================
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-project-img');
  const modalCat = document.getElementById('modal-project-cat');
  const modalTitle = document.getElementById('modal-project-title');
  const modalMetric = document.getElementById('modal-project-metric');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalWhatsappCta = document.getElementById('modal-whatsapp-cta');

  const allProjectCards = document.querySelectorAll('.pg-card, .slide-project, .portfolio-item');
  allProjectCards.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (!modal) return;
      const name = item.dataset.name || 'Projeto';
      const cat = item.dataset.cat || 'Design Digital';
      const metric = item.dataset.metric || 'Ajuste Fino';
      const desc = item.dataset.desc || '';
      const img = item.dataset.img || '';

      if (modalImg) modalImg.src = img;
      if (modalCat) modalCat.textContent = cat;
      if (modalTitle) modalTitle.textContent = name;
      if (modalMetric) modalMetric.textContent = metric;
      if (modalDesc) modalDesc.textContent = desc;

      if (modalWhatsappCta) {
        const msg = `Olá Carlos! Gostei muito do projeto "${name}" no Visual Playground e gostaria de desenvolver um projeto com esse mesmo padrão de excelência.`;
        modalWhatsappCta.href = `https://wa.me/5588999549560?text=${encodeURIComponent(msg)}`;
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeProjectModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeProjectModal();
      }
    });
  }

  // ==========================================================================
  // 6. INTERACTIVE DIAGNOSTIC SIMULATOR
  // ==========================================================================
  const diagInputs = document.querySelectorAll('.diag-input');
  const diagScore = document.getElementById('diag-score-value');
  const diagWhatsappBtn = document.getElementById('diag-whatsapp-btn');

  const updateDiagnostic = () => {
    let totalScore = 0;
    const selectedSymptoms = [];

    diagInputs.forEach(input => {
      if (input.checked) {
        totalScore += parseInt(input.dataset.weight || '0', 10);
        selectedSymptoms.push(input.dataset.symptom);
      }
    });

    if (diagScore) {
      diagScore.textContent = `+${totalScore}%`;
    }

    if (diagWhatsappBtn) {
      const msg = `Olá Carlos! Fiz o diagnóstico no site da CR web design. Identifiquei os seguintes gargalos: ${selectedSymptoms.join(', ')}. Meu potencial de ganho estimado é de +${totalScore}%. Gostaria de um Ajuste Fino!`;
      diagWhatsappBtn.href = `https://wa.me/5588999549560?text=${encodeURIComponent(msg)}`;
    }
  };

  diagInputs.forEach(input => {
    input.addEventListener('change', updateDiagnostic);
  });
  updateDiagnostic();

  // ==========================================================================
  // 7. COMPARISON TOGGLE (ANTES vs DEPOIS) & COUNTERS
  // ==========================================================================
  const btnShowAfter = document.getElementById('btn-show-after');
  const btnShowBefore = document.getElementById('btn-show-before');
  const stateAfter = document.getElementById('state-after');
  const stateBefore = document.getElementById('state-before');

  if (btnShowAfter && btnShowBefore && stateAfter && stateBefore) {
    btnShowAfter.addEventListener('click', () => {
      btnShowAfter.classList.add('active');
      btnShowBefore.classList.remove('active');
      stateAfter.classList.add('active');
      stateBefore.classList.remove('active');
    });

    btnShowBefore.addEventListener('click', () => {
      btnShowBefore.classList.add('active');
      btnShowAfter.classList.remove('active');
      stateBefore.classList.add('active');
      stateAfter.classList.remove('active');
    });
  }

  // ==========================================================================
  // 8. MOBILE MENU TOGGLE
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // 9. CARD TILT PHYSICS ON HOVER
  // ==========================================================================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateY(${(x / 20).toFixed(2)}deg) rotateX(${(-y / 20).toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

});
