/**
 * CR WEB DESIGN — JAVASCRIPT SCROLL ZOOM TRANSITIONS & LIQUID GLASS NAVBAR
 * Concept: The Asterisk (*) as Tactical Correction & Strategic Multiplication
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const heroTrack = document.getElementById('hero-track');
  const heroIntro = document.getElementById('hero-intro-view');
  const zoomContainer = document.getElementById('zoom-asterisk-container');
  const zoomAsterisk = document.getElementById('zoom-asterisk');
  const blueCurtain = document.getElementById('blue-curtain');
  const curtainContent = document.getElementById('curtain-content');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const floatingWhatsapp = document.querySelector('.floating-whatsapp');

  // 1. DYNAMIC HERO SCROLL ZOOM ENGINE & LIQUID GLASS NAVBAR
  let ticking = false;
  let isNavExpanded = false;

  const updateScroll = () => {
    if (!heroTrack || !zoomAsterisk || !zoomContainer) return;

    const rect = heroTrack.getBoundingClientRect();
    const trackHeight = heroTrack.offsetHeight - window.innerHeight;
    const scrollY = -rect.top;
    
    // Normalized progress from 0.0 to 1.0 within the hero track
    let progress = Math.max(0, Math.min(1, scrollY / (trackHeight > 0 ? trackHeight : 1)));

    // PHASE 1: Fade out text below immediately (0.00 to 0.15)
    if (heroIntro) {
      if (progress <= 0.15) {
        const introOpacity = Math.max(0, 1 - (progress / 0.12));
        const introTranslateY = progress * 40;
        heroIntro.style.opacity = introOpacity;
        heroIntro.style.transform = `translateY(${introTranslateY}px)`;
      } else {
        heroIntro.style.opacity = 0;
      }
    }

    // PHASE 2: Exponential Scale of Vector SVG Asterisk (0.00 to 0.70)
    if (progress <= 0.70) {
      const zoomFactor = progress / 0.70;
      // Exponential zoom curve maintaining 100% vector sharpness
      const asteriskScale = 1 + Math.pow(zoomFactor, 2.5) * 55;
      zoomContainer.style.transform = `scale(${asteriskScale})`;
    } else {
      zoomContainer.style.transform = `scale(56)`;
    }

    // PHASE 3: Blue Curtain Overlay & Revealed Message (0.35 to 0.88)
    if (blueCurtain && curtainContent) {
      if (progress >= 0.35 && progress <= 0.88) {
        // Blue Curtain Opacity
        let curtainOpacity = 0;
        if (progress < 0.52) {
          curtainOpacity = (progress - 0.35) / 0.17;
        } else if (progress <= 0.78) {
          curtainOpacity = 1;
        } else {
          curtainOpacity = 1 - ((progress - 0.78) / 0.10);
        }
        blueCurtain.style.opacity = Math.max(0, Math.min(1, curtainOpacity));

        // Message Inside Blue Screen
        let msgOpacity = 0;
        let msgTranslateY = 20;
        if (progress >= 0.48 && progress <= 0.80) {
          msgOpacity = Math.min(1, (progress - 0.48) / 0.14);
          msgTranslateY = 20 * (1 - msgOpacity);
        } else if (progress > 0.80) {
          msgOpacity = Math.max(0, 1 - ((progress - 0.80) / 0.08));
          msgTranslateY = -15 * (1 - msgOpacity);
        }
        curtainContent.style.opacity = msgOpacity;
        curtainContent.style.transform = `translateY(${msgTranslateY}px)`;
      } else {
        blueCurtain.style.opacity = 0;
        curtainContent.style.opacity = 0;
      }
    }

    // 2. LIQUID GLASS FLOATING NAVBAR EXPANSION WITH HYSTERESIS & STATE CACHING
    if (navbar) {
      const shouldExpand = progress >= 0.80 || rect.bottom <= window.innerHeight * 0.6;
      
      if (shouldExpand && !isNavExpanded) {
        navbar.classList.remove('compact');
        navbar.classList.add('expanded');
        isNavExpanded = true;
      } else if (!shouldExpand && isNavExpanded) {
        navbar.classList.remove('expanded');
        navbar.classList.add('compact');
        isNavExpanded = false;
      }
    }

    // 3. FLOATING WHATSAPP BUTTON (Only appears after leaving Hero)
    if (floatingWhatsapp) {
      const isPastHero = progress >= 0.85 || rect.bottom <= window.innerHeight * 0.5;
      if (isPastHero) {
        floatingWhatsapp.classList.add('is-visible');
      } else {
        floatingWhatsapp.classList.remove('is-visible');
      }
    }
  };

  const handleHeroScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Run on scroll and initial load
  window.addEventListener('scroll', handleHeroScroll, { passive: true });
  window.addEventListener('resize', handleHeroScroll, { passive: true });
  updateScroll();

  // 3. MOBILE MENU TOGGLE
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

  // 4. INTERACTIVE COMPARISON TOGGLE (ANTES vs DEPOIS)
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

  // 5. SCROLL REVEAL OBSERVER FOR FADE-IN ELEMENTS
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    '.fade-in, .route-card, .concept-column, .service-card, .process-step, .comparison-card, .final-cta-box'
  );

  animateElements.forEach((el) => {
    if (!el.classList.contains('fade-in')) {
      el.classList.add('fade-in');
    }
    revealObserver.observe(el);
  });

  // 6. 3D CASCADING FANNED DECK PARALLAX & ACTIVE CARD CONTROLLER (Jake Sinclair Style)
  const stageWrapper = document.getElementById('deck-stage-wrapper');
  const deckFanned = document.getElementById('deck-fanned');
  const fannedCards = document.querySelectorAll('.fanned-card');

  if (stageWrapper && deckFanned) {
    const baseRotX = 12;
    const baseRotY = 16;
    const baseRotZ = -22;

    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let targetOffsetZ = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;
    let currentOffsetZ = 0;
    let isHovering = false;
    let animId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    function render3DTilt() {
      currentOffsetX = lerp(currentOffsetX, targetOffsetX, 0.08);
      currentOffsetY = lerp(currentOffsetY, targetOffsetY, 0.08);
      currentOffsetZ = lerp(currentOffsetZ, targetOffsetZ, 0.08);

      const rotX = baseRotX + currentOffsetY;
      const rotY = baseRotY + currentOffsetX;
      const rotZ = baseRotZ + currentOffsetZ;

      deckFanned.style.transform = `translateX(40px) rotateZ(${rotZ.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;

      if (Math.abs(targetOffsetX - currentOffsetX) > 0.01 || Math.abs(targetOffsetY - currentOffsetY) > 0.01 || isHovering) {
        animId = requestAnimationFrame(render3DTilt);
      } else {
        animId = null;
      }
    }

    stageWrapper.addEventListener('pointermove', (e) => {
      const rect = stageWrapper.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      targetOffsetX = normX * 18;
      targetOffsetY = -normY * 16;
      targetOffsetZ = normX * 8;
      isHovering = true;

      if (!animId) {
        animId = requestAnimationFrame(render3DTilt);
      }
    });

    stageWrapper.addEventListener('pointerleave', () => {
      targetOffsetX = 0;
      targetOffsetY = 0;
      targetOffsetZ = 0;
      isHovering = false;
      
      // Clear active card highlight on leave
      deckFanned.classList.remove('has-active');
      fannedCards.forEach(card => card.classList.remove('is-active'));

      if (!animId) {
        animId = requestAnimationFrame(render3DTilt);
      }
    });

    // Zero-Flicker Card State Management (Steps card to front)
    fannedCards.forEach(card => {
      card.addEventListener('pointerenter', () => {
        deckFanned.classList.add('has-active');
        fannedCards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });
    });
  }
});
