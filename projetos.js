/**
 * CR DESIGN® — EXPOSIÇÃO DIGITAL DE PROJETOS (/projetos)
 * Engine de navegação imersiva, filtros, atalhos de teclado e URLs compartilháveis
 */

(function () {
  'use strict';

  // 1. DATA: OS 6 TRABALHOS REAIS DO PORTFÓLIO
  const PROJECTS = [
    {
      id: 'kaue-joias',
      num: '01',
      name: 'KAUÊ JOIAS',
      category: 'ecommerce',
      catLabel: 'E-COMMERCE & LUXO',
      tag: 'PROJETO EM DESTAQUE // HIGH JEWELRY',
      subtitle: 'E-commerce de Luxo · Alta Joalheria Contemporânea',
      desc: 'Concepção visual e desenvolvimento de e-commerce de alto padrão para joalheria contemporânea, priorizando catálogo imersivo, tipografia refinada e valorização artística do produto.',
      spec: 'Catálogo Editorial & Conversão · Checkout Ágil',
      badge: 'ARCHIVE // HIGH JEWELRY',
      image: 'assets/projects/project-joias.png',
      whatsappMsg: 'Olá Carlos! Vi o projeto Kauê Joias no portfólio do CR Design e gostaria de conversar sobre um projeto com esse padrão.'
    },
    {
      id: 'tera-marketing',
      num: '02',
      name: 'TERA MARKETING',
      category: 'marketing',
      catLabel: 'PERFORMANCE & GROWTH',
      tag: 'PROJETO EM DESTAQUE // GROWTH FUNNEL',
      subtitle: 'Landing Page · Agência de Performance & Growth',
      desc: 'Estrutura de landing page voltada para tração de clientes B2B, posicionamento de autoridade, clareza de proposta de valor e performance comercial acelerada.',
      spec: 'High Conversion Funnel · Captação Qualificada B2B',
      badge: 'ARCHIVE // PERFORMANCE',
      image: 'assets/projects/project-tera.png',
      whatsappMsg: 'Olá Carlos! Vi o projeto Tera Marketing no portfólio do CR Design e gostaria de uma landing page focada em conversão.'
    },
    {
      id: 'meldica-cosmeticos',
      num: '03',
      name: 'MÉLDICA COSMÉTICOS',
      category: 'ecommerce',
      catLabel: 'BEAUTY & BIOCOSMÉTICOS',
      tag: 'PROJETO EM DESTAQUE // BOTANICAL SKINCARE',
      subtitle: 'Identidade Digital · Cosméticos Botânicos & Skincare',
      desc: 'Identidade digital e vitrine online para marca de biocosméticos com foco em sustentabilidade, sofisticação e experiência de compra fluida e transparente.',
      spec: 'Minimalismo Editorial · Experiência Sensorial',
      badge: 'ARCHIVE // BOTANICAL',
      image: 'assets/projects/project-meldica.png',
      whatsappMsg: 'Olá Carlos! Vi o projeto Méldica Cosméticos no portfólio do CR Design e gostaria de um site com essa sofisticação.'
    },
    {
      id: 'via-medicamentos',
      num: '04',
      name: 'VIA MEDICAMENTOS',
      category: 'institucional',
      catLabel: 'B2B & DISTRIBUIÇÃO FARMACÊUTICA',
      tag: 'PROJETO EM DESTAQUE // CORPORATE B2B',
      subtitle: 'Plataforma Corporativa · Catálogo Técnico B2B',
      desc: 'Arquitetura de informação e desenvolvimento de plataforma corporativa e catálogo técnico para distribuição de medicamentos especiais em escala nacional.',
      spec: 'Distribuição Nacional · Catálogo Técnico B2B',
      badge: 'ARCHIVE // ESCALA NACIONAL',
      image: 'assets/projects/project-viamedicamentos.png',
      whatsappMsg: 'Olá Carlos! Vi o projeto Via Medicamentos no portfólio do CR Design e gostaria de uma plataforma corporativa robusta.'
    },
    {
      id: 'jf-mota',
      num: '05',
      name: 'JF MOTA ADVOCACIA',
      category: 'institucional',
      catLabel: 'JURÍDICO & CONSULTORIA',
      tag: 'PROJETO EM DESTAQUE // CORPORATE LAW',
      subtitle: 'Presença Digital Corporativa · Advocacia de Autoridade',
      desc: 'Landing page e presença digital corporativa para escritório de advocacia, focada em credibilidade, autoridade jurídica, clareza de serviços e captação de clientes qualificados.',
      spec: 'Autoridade & Credibilidade · Captação Qualificada',
      badge: 'ARCHIVE // JURÍDICO',
      image: 'assets/projects/project-jfmota.png',
      whatsappMsg: 'Olá Carlos! Vi o projeto JF Mota Advocacia no portfólio do CR Design e gostaria de um site com autoridade jurídica.'
    },
    {
      id: 'o-irmao',
      num: '06',
      name: 'O IRMÃO',
      category: 'marketing',
      catLabel: 'HUB COMERCIAL & ECOSSISTEMA',
      tag: 'PROJETO EM DESTAQUE // FAST FUNNEL',
      subtitle: 'Link Hub · Ecossistema Digital & Conversão',
      desc: 'Estrutura de link hub e funil ágil de conversão integrado para atendimento, catálogo rápido e redirecionamento comercial para múltiplos canais.',
      spec: 'Centralização & Contato Ágil · Fast Funnel',
      badge: 'ARCHIVE // LINK HUB',
      image: 'assets/projects/project-irmao.png',
      whatsappMsg: 'Olá Carlos! Vi o projeto O Irmão no portfólio do CR Design e gostaria de um ecossistema digital similar.'
    }
  ];

  // 2. DOM ELEMENTS
  const elIndex = document.getElementById('meta-project-index');
  const elCategory = document.getElementById('meta-project-category');
  const elCounter = document.getElementById('meta-project-counter');
  const elTag = document.getElementById('project-tag');
  const elTitle = document.getElementById('project-title');
  const elSubtitle = document.getElementById('project-subtitle');
  const elDesc = document.getElementById('project-desc');
  const elSpec = document.getElementById('project-spec');
  const elBadge = document.getElementById('project-badge');
  const elImage = document.getElementById('project-image');
  const elWhatsapp = document.getElementById('project-whatsapp-cta');
  const elCard = document.getElementById('project-card');

  const btnPrev = document.getElementById('btn-prev-project');
  const btnNext = document.getElementById('btn-next-project');
  const indicesContainer = document.getElementById('project-indices');
  const filterPills = document.querySelectorAll('.filter-pill');

  let currentFilteredList = [...PROJECTS];
  let currentIndex = 0;
  let activeFilter = 'all';

  // 3. RENDER PROJECT
  function renderProject(index, animate = true) {
    if (!currentFilteredList.length) return;
    
    if (index < 0) index = currentFilteredList.length - 1;
    if (index >= currentFilteredList.length) index = 0;
    currentIndex = index;

    const project = currentFilteredList[currentIndex];

    if (animate && elCard) {
      elCard.classList.add('fade-out');
      setTimeout(() => {
        applyData(project);
        elCard.classList.remove('fade-out');
      }, 150);
    } else {
      applyData(project);
    }

    updateIndicesUI();
    updateURL(project);
  }

  function applyData(project) {
    if (elIndex) elIndex.textContent = project.num;
    if (elCategory) elCategory.textContent = project.catLabel;
    if (elCounter) {
      const currentPos = String(currentIndex + 1).padStart(2, '0');
      const totalPos = String(currentFilteredList.length).padStart(2, '0');
      elCounter.textContent = `${currentPos} DE ${totalPos}`;
    }
    if (elTag) elTag.textContent = project.tag;
    if (elTitle) elTitle.textContent = project.name;
    if (elSubtitle) elSubtitle.textContent = project.subtitle;
    if (elDesc) elDesc.textContent = project.desc;
    if (elSpec) elSpec.textContent = project.spec;
    if (elBadge) elBadge.textContent = project.badge;
    if (elImage) {
      const prefix = window.ASSET_PREFIX || '';
      elImage.src = prefix + project.image;
      elImage.alt = project.name;
    }
    if (elWhatsapp) {
      const url = `https://wa.me/5588999549560?text=${encodeURIComponent(project.whatsappMsg)}`;
      elWhatsapp.href = url;
    }
  }

  // 4. RENDER DIRECT INDICES (DOTS/NUMBERS)
  function renderIndices() {
    if (!indicesContainer) return;
    indicesContainer.innerHTML = '';

    currentFilteredList.forEach((proj, idx) => {
      const btn = document.createElement('button');
      btn.className = `index-dot-btn ${idx === currentIndex ? 'active' : ''}`;
      btn.setAttribute('aria-label', `Ir para projeto ${proj.num}: ${proj.name}`);
      btn.textContent = proj.num;
      btn.addEventListener('click', () => {
        renderProject(idx);
      });
      indicesContainer.appendChild(btn);
    });
  }

  function updateIndicesUI() {
    if (!indicesContainer) return;
    const buttons = indicesContainer.querySelectorAll('.index-dot-btn');
    buttons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentIndex);
    });
  }

  // 5. URL MANAGEMENT & SHARING
  function updateURL(project) {
    const hash = `#${project.num}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }

  function readInitialProjectFromURL() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return 0;

    // Check by number (e.g. "01" or "1")
    const numMatch = PROJECTS.findIndex(p => p.num === hash || parseInt(p.num, 10) === parseInt(hash, 10));
    if (numMatch !== -1) return numMatch;

    // Check by ID (e.g. "kaue-joias")
    const idMatch = PROJECTS.findIndex(p => p.id === hash);
    if (idMatch !== -1) return idMatch;

    return 0;
  }

  // 6. FILTERING LOGIC
  function setFilter(category) {
    activeFilter = category;
    
    filterPills.forEach(pill => {
      const isActive = pill.dataset.filter === category;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (category === 'all') {
      currentFilteredList = [...PROJECTS];
    } else {
      currentFilteredList = PROJECTS.filter(p => p.category === category);
    }

    renderIndices();
    renderProject(0);
  }

  // 7. EVENT LISTENERS
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      renderProject(currentIndex - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      renderProject(currentIndex + 1);
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      setFilter(pill.dataset.filter);
    });
  });

  // Keyboard Navigation: Left, Right, Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      renderProject(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      renderProject(currentIndex + 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      window.location.href = 'index.html#visual-playground';
    }
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        // Swipe left -> Next
        renderProject(currentIndex + 1);
      } else {
        // Swipe right -> Prev
        renderProject(currentIndex - 1);
      }
    }
  }

  // 8. INITIALIZATION
  const initialIndex = readInitialProjectFromURL();
  renderIndices();
  renderProject(initialIndex, false);

})();
