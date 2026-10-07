/**
 * CR DESIGN — SISTEMA PESSOAL DE ORGANIZAÇÃO & GESTÃO
 * Engine Central: Estado Reativo, Persistência LocalStorage, Cálculos em Tempo Real,
 * Visualizações Mobile-First e CRUD Completo.
 */

class CRDesignApp {
  constructor() {
    this.storageKey = 'cr_design_system_data_v2';
    this.currentTab = 'dashboard';
    this.taskFilter = 'hoje';
    this.prodFilter = 'all';
    this.metaFilter = 'all';
    this.calMode = 'month';
    this.currentCalDate = new Date();
    this.selectedWeekDate = new Date();

    // Initial state loading
    this.state = this.loadState();

    // Initialize application
    this.init();
  }

  /* ==========================================================================
     1. INITIALIZATION & LOADING SCREEN
     ========================================================================== */
  init() {
    const currentTheme = this.state.theme || 'dark';
    this.applyTheme(currentTheme);
    document.getElementById('btn-theme-dark')?.classList.toggle('active', currentTheme === 'dark');
    document.getElementById('btn-theme-light')?.classList.toggle('active', currentTheme === 'light');
    this.setupDateHeader();
    this.renderAll();
    this.initNotifications();
    this.bindEvents();
    this.startLoadingSequence();
  }

  startLoadingSequence() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingFill = document.getElementById('loading-fill');
    
    if (!loadingScreen) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (loadingFill) loadingFill.style.width = '100%';
        
        setTimeout(() => {
          loadingScreen.classList.add('fade-out');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }, 300);
      } else {
        if (loadingFill) loadingFill.style.width = `${progress}%`;
      }
    }, 60);
  }

  /* ==========================================================================
     2. STATE MANAGEMENT & LOCALSTORAGE PERSISTENCE
     ========================================================================== */
  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.validateAndMergeState(parsed);
      } catch (e) {
        console.error('Erro ao ler estado do LocalStorage:', e);
      }
    }
    return this.getDefaultState();
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.renderBadges();
  }

  getDefaultState() {
    const todayStr = this.formatDateISO(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = this.formatDateISO(tomorrow);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextWeekStr = this.formatDateISO(nextWeek);

    return {
      theme: 'dark',
      scratchpad: '• Alinhar ajuste fino do hero com cliente\n• Verificar métricas de conversão da nova LP\n• Separar reserva para equipamento novo',
      budgetPlanning: {
        expectedIncome: 1250.00,
        categories: [
          { id: 'cat_contas', name: 'Contas Fixas', amount: 500.00, color: '#EF4444' },
          { id: 'cat_casa', name: 'Casa & Mercado', amount: 100.00, color: '#F59E0B' },
          { id: 'cat_alimentacao', name: 'Alimentação', amount: 100.00, color: '#10B981' },
          { id: 'cat_roupas', name: 'Roupas & Cuidados', amount: 100.00, color: '#A855F7' },
          { id: 'cat_lazer', name: 'Lazer & Pessoal', amount: 100.00, color: '#3B82F6' },
          { id: 'cat_reserva', name: 'Reserva Financeira', amount: 250.00, color: '#6366F1' }
        ]
      },
      transactions: [
        { id: 'tr_1', type: 'receita', amount: 850.00, date: todayStr, desc: 'Entrada Landing Page Tera Marketing', category: 'Freelances' },
        { id: 'tr_2', type: 'receita', amount: 400.00, date: todayStr, desc: 'Identidade Visual & Ajuste Fino', category: 'Clientes' },
        { id: 'tr_3', type: 'despesa', amount: 120.00, date: todayStr, desc: 'Internet Fibra Óptica', category: 'Contas Fixas' },
        { id: 'tr_4', type: 'despesa', amount: 65.00, date: todayStr, desc: 'Assinatura Ferramentas de Design', category: 'Contas Fixas' },
        { id: 'tr_5', type: 'despesa', amount: 250.00, date: todayStr, desc: 'Aporte na Reserva de Emergência', category: 'Reserva Financeira' }
      ],
      tasks: [
        { id: 'tsk_1', title: 'Entregar Ajuste Fino da LP Tera Marketing', date: todayStr, time: '14:00', priority: 'alta', category: 'CR Design', status: 'a_fazer', projectId: 'prj_1', desc: 'Revisar animações, microinterações e botões' },
        { id: 'tsk_2', title: 'Reunião de alinhamento com cliente', date: todayStr, time: '16:30', priority: 'media', category: 'Clientes', status: 'a_fazer', projectId: '', desc: 'Apresentar proposta de design cirúrgico' },
        { id: 'tsk_3', title: 'Organizar divisão do orçamento mensal', date: todayStr, time: '19:00', priority: 'baixa', category: 'Financeiro', status: 'concluida', projectId: '', desc: 'Separar contas e aporte da reserva' },
        { id: 'tsk_4', title: 'Estruturar novo componente de depoimentos', date: tomorrowStr, time: '10:00', priority: 'media', category: 'Web Design', status: 'a_fazer', projectId: 'prj_2', desc: 'Criar cards 3D interativos' },
        { id: 'tsk_5', title: 'Treino e caminhada', date: todayStr, time: '07:00', priority: 'baixa', category: 'Pessoal', status: 'concluida', projectId: '', desc: 'Saúde & rotina diária' }
      ],
      projects: [
        { id: 'prj_1', name: 'Landing Page Tera Marketing', client: 'Tera Marketing', type: 'Landing Page', start: todayStr, deadline: nextWeekStr, completionDate: '', status: 'andamento', delDone: 3, delTotal: 4, value: 850.00, notes: 'Design cirúrgico focado em conversão e velocidade extrema.' },
        { id: 'prj_2', name: 'Website Institucional Sibersigurança', client: 'Siber Seg', type: 'Website Institucional', start: todayStr, deadline: nextWeekStr, completionDate: '', status: 'revisao', delDone: 4, delTotal: 5, value: 1200.00, notes: 'Aguardando validação final das páginas de contato.' },
        { id: 'prj_3', name: 'Identidade Visual & Links Carlos', client: 'Carlos Gletison', type: 'Identidade Visual', start: todayStr, deadline: todayStr, completionDate: todayStr, status: 'concluido', delDone: 3, delTotal: 3, value: 450.00, notes: 'Finalizado com sucesso e links no ar.' }
      ],
      metas: [
        { id: 'meta_1', name: 'Montar Reserva Financeira', category: 'Financeiro', deadline: '2026-12-31', progress: 80, desc: 'Garantir 6 meses de custo fixo guardados com segurança.', status: 'ativa' },
        { id: 'meta_2', name: 'Novo Equipamento de Trabalho', category: 'CR Design', deadline: '2026-11-30', progress: 50, desc: 'MacBook Pro para edição e desenvolvimento de alta performance.', status: 'ativa' },
        { id: 'meta_3', name: 'Lançar 10 Projetos de Ajuste Fino', category: 'Profissional', deadline: '2026-12-15', progress: 60, desc: 'Atingir marco de excelência e autoridade no mercado digital.', status: 'ativa' },
        { id: 'meta_4', name: 'Rotina de Estudos & Saúde', category: 'Pessoal', deadline: '2026-10-31', progress: 90, desc: 'Manter constância diária em treinos e foco mental.', status: 'ativa' }
      ],
      personalItems: [
        { id: 'per_1', type: 'evento', title: 'Consulta Médica de Rotina', date: tomorrowStr, time: '15:00', content: 'Clínica Central - Levar exames recentes.' },
        { id: 'per_2', type: 'nota', title: 'Ideias de Microinterações', date: todayStr, time: '', content: 'Aplicar efeito glassmorphism com borda luminosa nos cards principais.' },
        { id: 'per_3', type: 'info', title: 'Paleta Oficial CR Design', date: todayStr, time: '', content: 'Preto: #000000 | Azul Elétrico: #0d5bff | Branco: #FFFFFF' }
      ]
    };
  }

  validateAndMergeState(parsed) {
    const defaults = this.getDefaultState();
    return {
      theme: parsed.theme || defaults.theme,
      scratchpad: typeof parsed.scratchpad === 'string' ? parsed.scratchpad : defaults.scratchpad,
      budgetPlanning: parsed.budgetPlanning || defaults.budgetPlanning,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : defaults.transactions,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : defaults.tasks,
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaults.projects,
      metas: Array.isArray(parsed.metas) ? parsed.metas : defaults.metas,
      personalItems: Array.isArray(parsed.personalItems) ? parsed.personalItems : defaults.personalItems
    };
  }

  resetDefaultData() {
    if (confirm('Tem certeza que deseja restaurar os dados padrão da CR Design? Suas alterações atuais serão substituídas.')) {
      this.state = this.getDefaultState();
      this.saveState();
      this.renderAll();
      this.closeModals();
      this.showToast('Dados restaurados com sucesso!', 'success');
    }
  }

  /* ==========================================================================
     3. NAVIGATION & VIEW SWITCHING
     ========================================================================== */
  navigate(tabName) {
    this.currentTab = tabName;

    // Update active nav in Sidebar
    document.querySelectorAll('.sidebar-menu .nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update active nav in Mobile Bottom Bar
    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Show active tab view
    document.querySelectorAll('.app-tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${tabName}`);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render tab specific data
    if (tabName === 'dashboard') this.renderDashboard();
    else if (tabName === 'tarefas') this.renderTasks();
    else if (tabName === 'producao') this.renderProjects();
    else if (tabName === 'financas') this.renderFinances();
    else if (tabName === 'pessoal') this.renderPersonal();
    else if (tabName === 'metas') this.renderMetas();
    else if (tabName === 'calendario') this.renderCalendar();
  }

  toggleMobileMoreSheet(forceState) {
    const sheet = document.getElementById('more-sheet-backdrop');
    if (!sheet) return;
    if (forceState !== undefined) {
      sheet.classList.toggle('active', forceState);
    } else {
      sheet.classList.toggle('active');
    }
  }

  /* ==========================================================================
     4. DATE & GREETING HELPERS
     ========================================================================== */
  setupDateHeader() {
    const now = new Date();
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dayName = days[now.getDay()];
    const dayNum = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    const formattedDate = `${dayName}, ${dayNum} de ${monthName}`;
    const headerEl = document.getElementById('header-datetime-text');
    if (headerEl) headerEl.innerText = formattedDate;

    // Dynamic greeting based on hour
    const hour = now.getHours();
    let greetingWord = 'Bom dia';
    if (hour >= 12 && hour < 18) greetingWord = 'Boa tarde';
    else if (hour >= 18 || hour < 5) greetingWord = 'Boa noite';

    const greetingTitle = document.getElementById('greeting-title');
    if (greetingTitle) {
      greetingTitle.innerHTML = `${greetingWord}, <span class="highlight-blue">Carlos <span class="cyan-asterisk">*</span></span>`;
    }

    // Month Badges in Dashboard
    const monthBadges = document.querySelectorAll('.badge-month');
    monthBadges.forEach(b => b.innerText = `${monthName}`);
  }

  formatDateISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  formatDateBR(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoString;
  }

  formatMoney(num) {
    return Number(num || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  /* ==========================================================================
     5. RENDER ALL & STATS
     ========================================================================== */
  renderAll() {
    this.renderDashboard();
    this.renderTasks();
    this.renderProjects();
    this.renderFinances();
    this.renderPersonal();
    this.renderMetas();
    this.renderCalendar();
    this.renderBadges();
    this.populateProjectSelectOptions();

    // Populate scratchpad
    const scratchpadEl = document.getElementById('quick-scratchpad');
    if (scratchpadEl) scratchpadEl.value = this.state.scratchpad || '';
  }

  renderBadges() {
    const todayStr = this.formatDateISO(new Date());
    const pendingTodayTasks = this.state.tasks.filter(t => t.date === todayStr && t.status !== 'concluida').length;
    const activeProjects = this.state.projects.filter(p => p.status === 'andamento' || p.status === 'revisao').length;
    const activeMetas = this.state.metas.filter(m => m.progress < 100).length;

    const bTasks = document.getElementById('badge-tarefas-count');
    if (bTasks) bTasks.innerText = pendingTodayTasks;

    const bMobileTasks = document.getElementById('mobile-badge-tasks');
    if (bMobileTasks) {
      bMobileTasks.innerText = pendingTodayTasks;
      bMobileTasks.style.display = pendingTodayTasks > 0 ? 'inline-block' : 'none';
    }

    const bProd = document.getElementById('badge-producao-count');
    if (bProd) bProd.innerText = activeProjects;

    const bMetas = document.getElementById('badge-metas-count');
    if (bMetas) bMetas.innerText = activeMetas;

    const topbarSummary = document.getElementById('topbar-summary-text');
    if (topbarSummary) {
      topbarSummary.innerText = `${pendingTodayTasks} tarefas hoje • ${activeProjects} em produção`;
    }
  }

  /* ==========================================================================
     6. DASHBOARD VIEW RENDERING (Centro de Comando)
     ========================================================================== */
  renderDashboard() {
    const todayStr = this.formatDateISO(new Date());

    // 1. Task Stats
    const todayTasks = this.state.tasks.filter(t => t.date === todayStr);
    const completedToday = todayTasks.filter(t => t.status === 'concluida').length;
    const pendingToday = todayTasks.length - completedToday;

    const statTasksToday = document.getElementById('dash-stat-tasks-today');
    if (statTasksToday) statTasksToday.innerText = todayTasks.length;
    const statTasksPending = document.getElementById('dash-stat-tasks-pending');
    if (statTasksPending) statTasksPending.innerText = `${pendingToday} pendentes`;

    const dashTodayPill = document.getElementById('dash-today-tasks-pill');
    if (dashTodayPill) dashTodayPill.innerText = `${completedToday}/${todayTasks.length}`;

    // Render Mini Tasks List in Dashboard
    const dashTasksList = document.getElementById('dash-today-tasks-list');
    if (dashTasksList) {
      if (todayTasks.length === 0) {
        dashTasksList.innerHTML = `
          <div class="empty-state-box">
            <i class="ri-checkbox-circle-line empty-state-icon"></i>
            <span class="empty-state-title">Nenhuma tarefa para hoje</span>
            <span class="empty-state-sub">Aproveite para planejar o dia ou criar uma nova tarefa.</span>
          </div>
        `;
      } else {
        dashTasksList.innerHTML = todayTasks.map(task => `
          <div class="task-item-row ${task.status === 'concluida' ? 'completed' : ''}">
            <button class="task-checkbox-custom" onclick="app.toggleTaskStatus('${task.id}')" title="Marcar como concluída">
              <i class="ri-check-line"></i>
            </button>
            <div class="task-main-info" onclick="app.openTaskModal('${task.id}')" style="cursor: pointer;">
              <span class="task-text-title">${this.escapeHtml(task.title)}</span>
              <div class="task-meta-tags">
                ${task.time ? `<span class="task-time-pill"><i class="ri-time-line"></i> ${task.time}</span>` : ''}
                <span class="task-tag priority-${task.priority}">${task.priority.toUpperCase()}</span>
                <span class="task-tag">${this.escapeHtml(task.category)}</span>
              </div>
            </div>
            <div class="task-actions-btn-group">
              <button class="btn-task-action" onclick="app.openTaskModal('${task.id}')" title="Editar"><i class="ri-edit-line"></i></button>
              <button class="btn-task-action delete" onclick="app.deleteTask('${task.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
            </div>
          </div>
        `).join('');
      }
    }

    // 2. Week Strip Render
    this.renderWeekStrip();

    // 3. Finance Summary & Dynamic Breakdown
    this.renderDashboardFinance();

    // 4. Production Summary
    const monthProjects = this.state.projects;
    const doneProjects = monthProjects.filter(p => p.status === 'concluido').length;
    const runningProjects = monthProjects.filter(p => p.status === 'andamento').length;
    const pendingReview = monthProjects.filter(p => p.status === 'revisao').length;

    const dashStatProdCount = document.getElementById('dash-stat-prod-count');
    if (dashStatProdCount) dashStatProdCount.innerText = monthProjects.length;
    const dashStatProdActive = document.getElementById('dash-stat-prod-active');
    if (dashStatProdActive) dashStatProdActive.innerText = `${runningProjects} em andamento`;

    const dashProdDoneNum = document.getElementById('dash-prod-done-num');
    if (dashProdDoneNum) dashProdDoneNum.innerText = doneProjects;
    const dashProdRunningNum = document.getElementById('dash-prod-running-num');
    if (dashProdRunningNum) dashProdRunningNum.innerText = runningProjects;
    const dashProdPendingNum = document.getElementById('dash-prod-pending-num');
    if (dashProdPendingNum) dashProdPendingNum.innerText = pendingReview;

    const dashProdList = document.getElementById('dash-production-list');
    if (dashProdList) {
      if (monthProjects.length === 0) {
        dashProdList.innerHTML = `<div class="empty-state-box"><span class="empty-state-title">Nenhum projeto cadastrado</span></div>`;
      } else {
        dashProdList.innerHTML = monthProjects.slice(0, 3).map(p => `
          <div class="prod-item-row" onclick="app.openProjectModal('${p.id}')" style="cursor: pointer;">
            <div class="prod-item-info">
              <span class="prod-item-name">${this.escapeHtml(p.name)}</span>
              <span class="prod-item-client">${this.escapeHtml(p.client || 'Cliente Direto')} • Entrega: ${this.formatDateBR(p.deadline)}</span>
            </div>
            <span class="prod-status-badge ${p.status}">${this.getProjectStatusLabel(p.status)}</span>
          </div>
        `).join('');
      }
    }

    // 5. Metas Mini List
    const metasActive = this.state.metas.filter(m => m.progress < 100);
    const avgProgress = this.state.metas.length > 0 
      ? Math.round(this.state.metas.reduce((acc, m) => acc + Number(m.progress || 0), 0) / this.state.metas.length) 
      : 0;

    const statMetasActive = document.getElementById('dash-stat-metas-active');
    if (statMetasActive) statMetasActive.innerText = metasActive.length;
    const statMetasAvg = document.getElementById('dash-stat-metas-avg');
    if (statMetasAvg) statMetasAvg.innerText = `${avgProgress}% média`;

    const dashMetasList = document.getElementById('dash-metas-list');
    if (dashMetasList) {
      dashMetasList.innerHTML = this.state.metas.slice(0, 3).map(m => `
        <div class="meta-mini-card" onclick="app.openMetaModal('${m.id}')" style="cursor: pointer;">
          <div class="meta-card-head">
            <span class="meta-name">${this.escapeHtml(m.name)}</span>
            <span class="meta-percent">${m.progress}%</span>
          </div>
          <div class="meta-progress-track">
            <div class="meta-progress-bar" style="width: ${m.progress}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // 6. Personal Mini List
    const dashPersonalList = document.getElementById('dash-personal-list');
    if (dashPersonalList) {
      if (this.state.personalItems.length === 0) {
        dashPersonalList.innerHTML = `<div class="empty-state-box"><span class="empty-state-title">Nenhum item pessoal</span></div>`;
      } else {
        dashPersonalList.innerHTML = this.state.personalItems.slice(0, 3).map(item => `
          <div class="personal-item-pill" onclick="app.openPersonalModal('${item.id}')" style="cursor: pointer;">
            <i class="${item.type === 'evento' ? 'ri-calendar-event-line' : item.type === 'nota' ? 'ri-sticky-note-line' : 'ri-information-line'}"></i>
            <span class="personal-item-text"><strong>${this.escapeHtml(item.title)}</strong> ${item.content ? `— ${this.escapeHtml(item.content)}` : ''}</span>
          </div>
        `).join('');
      }
    }
  }

  /* ==========================================================================
     7. WEEK STRIP LOGIC (Segunda a Domingo)
     ========================================================================== */
  renderWeekStrip() {
    const container = document.getElementById('dash-week-strip');
    const detailsContainer = document.getElementById('dash-week-day-details');
    if (!container) return;

    const curr = new Date(this.selectedWeekDate);
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    // Get Monday of current week
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - distanceToMonday);

    const weekDays = [];
    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d);
    }

    const todayISO = this.formatDateISO(new Date());
    const selectedISO = this.formatDateISO(this.selectedWeekDate);

    container.innerHTML = weekDays.map((d, index) => {
      const iso = this.formatDateISO(d);
      const isToday = iso === todayISO;
      const isSelected = iso === selectedISO;

      // Count tasks on this day
      const dayTasks = this.state.tasks.filter(t => t.date === iso);
      const dayProjects = this.state.projects.filter(p => p.deadline === iso);
      const hasItems = dayTasks.length > 0 || dayProjects.length > 0;

      return `
        <div class="week-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" onclick="app.selectWeekDay('${iso}')">
          <span class="week-day-name">${dayNames[index]}</span>
          <span class="week-day-num">${d.getDate()}</span>
          <div class="week-day-dots">
            ${dayTasks.length > 0 ? `<span class="w-dot" title="${dayTasks.length} tarefas"></span>` : ''}
            ${dayProjects.length > 0 ? `<span class="w-dot done" title="${dayProjects.length} entregas"></span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Render selected day details
    if (detailsContainer) {
      const selectedTasks = this.state.tasks.filter(t => t.date === selectedISO);
      const selectedEvents = this.state.personalItems.filter(p => p.date === selectedISO);
      const selectedDeliveries = this.state.projects.filter(p => p.deadline === selectedISO);

      if (selectedTasks.length === 0 && selectedEvents.length === 0 && selectedDeliveries.length === 0) {
        detailsContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.82rem;"><i class="ri-information-line"></i> Nenhum compromisso ou tarefa para ${this.formatDateBR(selectedISO)}.</span>`;
      } else {
        const itemsHtml = [];
        selectedDeliveries.forEach(p => itemsHtml.push(`<span class="cal-event-pill type-project"><i class="ri-flag-line"></i> Entrega: ${this.escapeHtml(p.name)}</span>`));
        selectedTasks.forEach(t => itemsHtml.push(`<span class="cal-event-pill type-task"><i class="ri-checkbox-circle-line"></i> ${this.escapeHtml(t.title)} ${t.time ? `(${t.time})` : ''}</span>`));
        selectedEvents.forEach(e => itemsHtml.push(`<span class="cal-event-pill type-personal"><i class="ri-user-smile-line"></i> ${this.escapeHtml(e.title)}</span>`));

        detailsContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            <strong style="font-size: 0.8rem; color: var(--text-heading);">${this.formatDateBR(selectedISO)}:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${itemsHtml.join('')}
            </div>
          </div>
        `;
      }
    }
  }

  selectWeekDay(isoString) {
    this.selectedWeekDate = new Date(isoString + 'T00:00:00');
    this.renderWeekStrip();
  }

  /* ==========================================================================
     8. FINANCIAL CALCULATIONS & BUDGET BAR
     ========================================================================== */
  calculateFinances() {
    const totalIncome = this.state.transactions
      .filter(t => t.type === 'receita')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const totalExpense = this.state.transactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const totalPlanned = this.state.budgetPlanning.categories
      .reduce((acc, c) => acc + Number(c.amount || 0), 0);

    const reserveCat = this.state.budgetPlanning.categories.find(c => c.id === 'cat_reserva' || c.name.toLowerCase().includes('reserva'));
    const totalReserved = reserveCat ? Number(reserveCat.amount || 0) : 0;

    // Available balance: Expected Income (or Real Income) minus planned expenses
    const baseIncome = totalIncome > 0 ? totalIncome : Number(this.state.budgetPlanning.expectedIncome || 0);
    const available = baseIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      totalPlanned,
      totalReserved,
      available,
      baseIncome
    };
  }

  renderDashboardFinance() {
    const fin = this.calculateFinances();

    const dashStatBalance = document.getElementById('dash-stat-fin-balance');
    if (dashStatBalance) dashStatBalance.innerText = this.formatMoney(fin.available);

    const dashStatIncome = document.getElementById('dash-stat-fin-income');
    if (dashStatIncome) dashStatIncome.innerText = `Receita: ${this.formatMoney(fin.totalIncome > 0 ? fin.totalIncome : fin.baseIncome)}`;

    const dashFinIncome = document.getElementById('dash-fin-income');
    if (dashFinIncome) dashFinIncome.innerText = this.formatMoney(fin.totalIncome > 0 ? fin.totalIncome : fin.baseIncome);

    const dashFinExpense = document.getElementById('dash-fin-expense');
    if (dashFinExpense) dashFinExpense.innerText = this.formatMoney(fin.totalExpense);

    const dashFinPlanned = document.getElementById('dash-fin-planned');
    if (dashFinPlanned) dashFinPlanned.innerText = this.formatMoney(fin.totalPlanned);

    const dashFinReserved = document.getElementById('dash-fin-reserved');
    if (dashFinReserved) dashFinReserved.innerText = this.formatMoney(fin.totalReserved);

    const dashFinAvailable = document.getElementById('dash-fin-available');
    if (dashFinAvailable) dashFinAvailable.innerText = this.formatMoney(fin.available);

    // Render Multi-segment Budget Bar
    const barContainer = document.getElementById('dash-budget-stacked-bar');
    const chipsContainer = document.getElementById('dash-budget-category-chips');

    if (barContainer && chipsContainer) {
      const categories = this.state.budgetPlanning.categories;
      const totalAmount = fin.totalPlanned > 0 ? fin.totalPlanned : 1;

      barContainer.innerHTML = categories.map(cat => {
        const pct = ((Number(cat.amount) / totalAmount) * 100).toFixed(1);
        return `<div class="budget-bar-segment" style="width: ${pct}%; background-color: ${cat.color};" title="${cat.name}: ${this.formatMoney(cat.amount)} (${pct}%)"></div>`;
      }).join('');

      chipsContainer.innerHTML = categories.map(cat => `
        <div class="budget-chip">
          <span class="chip-color-dot" style="background-color: ${cat.color};"></span>
          <span class="chip-name">${this.escapeHtml(cat.name)}:</span>
          <span class="chip-val">${this.formatMoney(cat.amount)}</span>
        </div>
      `).join('');
    }
  }

  renderFinances() {
    const fin = this.calculateFinances();

    const finTotalIncome = document.getElementById('fin-total-income');
    if (finTotalIncome) finTotalIncome.innerText = this.formatMoney(fin.totalIncome > 0 ? fin.totalIncome : fin.baseIncome);

    const finTotalExpense = document.getElementById('fin-total-expense');
    if (finTotalExpense) finTotalExpense.innerText = this.formatMoney(fin.totalExpense);

    const finTotalPlanned = document.getElementById('fin-total-planned');
    if (finTotalPlanned) finTotalPlanned.innerText = this.formatMoney(fin.totalPlanned);

    const finTotalReserved = document.getElementById('fin-total-reserved');
    if (finTotalReserved) finTotalReserved.innerText = this.formatMoney(fin.totalReserved);

    const finTotalAvailable = document.getElementById('fin-total-available');
    if (finTotalAvailable) finTotalAvailable.innerText = this.formatMoney(fin.available);

    // Render Budget Allocation Categories List
    const budgetList = document.getElementById('fin-budget-categories-list');
    if (budgetList) {
      budgetList.innerHTML = this.state.budgetPlanning.categories.map(cat => {
        const pct = fin.baseIncome > 0 ? ((Number(cat.amount) / fin.baseIncome) * 100).toFixed(0) : 0;
        return `
          <div class="budget-item-editor-row">
            <span class="budget-cat-name">
              <span class="chip-color-dot" style="background-color: ${cat.color};"></span>
              ${this.escapeHtml(cat.name)}
              <small style="color: var(--text-muted); font-size: 0.75rem;">(${pct}%)</small>
            </span>
            <span class="budget-cat-amount">${this.formatMoney(cat.amount)}</span>
          </div>
        `;
      }).join('');
    }

    // Render Transactions List
    const transList = document.getElementById('fin-transactions-list');
    const filterType = document.getElementById('fin-filter-type')?.value || 'all';

    let filtered = this.state.transactions;
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    const transCount = document.getElementById('fin-transactions-count');
    if (transCount) transCount.innerText = filtered.length;

    if (transList) {
      if (filtered.length === 0) {
        transList.innerHTML = `<div class="empty-state-box"><span class="empty-state-title">Nenhum lançamento registrado</span></div>`;
      } else {
        transList.innerHTML = filtered.map(t => `
          <div class="trans-item-row">
            <div class="trans-info">
              <span class="trans-desc">${this.escapeHtml(t.desc)}</span>
              <span class="trans-meta">${this.formatDateBR(t.date)} • ${this.escapeHtml(t.category)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="trans-amount ${t.type === 'receita' ? 'text-emerald' : 'text-rose'}">
                ${t.type === 'receita' ? '+' : '-'} ${this.formatMoney(t.amount)}
              </span>
              <button class="btn-task-action delete" onclick="app.deleteTransaction('${t.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  /* ==========================================================================
     9. FULL TASKS VIEW RENDERING & FILTERS
     ========================================================================== */
  setTaskFilter(filterName) {
    this.taskFilter = filterName;
    document.querySelectorAll('#task-filter-pills .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterName);
    });
    this.renderTasks();
  }

  renderTasks() {
    const container = document.getElementById('tasks-full-list');
    if (!container) return;

    const todayStr = this.formatDateISO(new Date());
    const searchVal = (document.getElementById('task-search-input')?.value || '').toLowerCase();
    const priorityVal = document.getElementById('task-filter-priority')?.value || 'all';
    const categoryVal = document.getElementById('task-filter-category')?.value || 'all';

    // Counts for pills
    const all = this.state.tasks;
    const hojeCount = all.filter(t => t.date === todayStr && t.status !== 'concluida').length;
    const proximasCount = all.filter(t => t.date > todayStr && t.status !== 'concluida').length;
    const atrasadasCount = all.filter(t => t.date < todayStr && t.status !== 'concluida').length;
    const concluidasCount = all.filter(t => t.status === 'concluida').length;
    const todasCount = all.length;

    document.getElementById('pill-count-hoje')?.replaceChildren(document.createTextNode(hojeCount));
    document.getElementById('pill-count-proximas')?.replaceChildren(document.createTextNode(proximasCount));
    document.getElementById('pill-count-atrasadas')?.replaceChildren(document.createTextNode(atrasadasCount));
    document.getElementById('pill-count-concluidas')?.replaceChildren(document.createTextNode(concluidasCount));
    document.getElementById('pill-count-todas')?.replaceChildren(document.createTextNode(todasCount));

    // Filter list
    let filtered = all.filter(task => {
      // Primary view filter
      if (this.taskFilter === 'hoje' && task.date !== todayStr) return false;
      if (this.taskFilter === 'proximas' && (task.date <= todayStr || task.status === 'concluida')) return false;
      if (this.taskFilter === 'atrasadas' && (task.date >= todayStr || task.status === 'concluida')) return false;
      if (this.taskFilter === 'concluidas' && task.status !== 'concluida') return false;

      // Secondary filters
      if (priorityVal !== 'all' && task.priority !== priorityVal) return false;
      if (categoryVal !== 'all' && task.category !== categoryVal) return false;

      // Search
      if (searchVal && !task.title.toLowerCase().includes(searchVal) && !(task.desc || '').toLowerCase().includes(searchVal)) {
        return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <i class="ri-checkbox-circle-line empty-state-icon"></i>
          <span class="empty-state-title">Nenhuma tarefa encontrada neste filtro</span>
          <span class="empty-state-sub">Clique em "+ Nova Tarefa" para cadastrar seus afazeres.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(task => `
      <div class="task-item-row ${task.status === 'concluida' ? 'completed' : ''}">
        <button class="task-checkbox-custom" onclick="app.toggleTaskStatus('${task.id}')" title="Marcar status">
          <i class="ri-check-line"></i>
        </button>
        <div class="task-main-info" onclick="app.openTaskModal('${task.id}')" style="cursor: pointer;">
          <span class="task-text-title">${this.escapeHtml(task.title)}</span>
          <div class="task-meta-tags">
            <span class="task-time-pill"><i class="ri-calendar-line"></i> ${this.formatDateBR(task.date)}</span>
            ${task.time ? `<span class="task-time-pill"><i class="ri-time-line"></i> ${task.time}</span>` : ''}
            <span class="task-tag priority-${task.priority}">${task.priority.toUpperCase()}</span>
            <span class="task-tag">${this.escapeHtml(task.category)}</span>
            ${task.projectId ? `<span class="task-tag" style="background: var(--blue-light); color: var(--blue-primary);"><i class="ri-folder-3-line"></i> ${this.getProjectName(task.projectId)}</span>` : ''}
          </div>
        </div>
        <div class="task-actions-btn-group">
          <button class="btn-task-action" onclick="app.openTaskModal('${task.id}')" title="Editar"><i class="ri-edit-line"></i></button>
          <button class="btn-task-action delete" onclick="app.deleteTask('${task.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     10. PRODUCTION VIEW & PROJECTS
     ========================================================================== */
  setProdFilter(filterName) {
    this.prodFilter = filterName;
    document.querySelectorAll('#prod-filter-pills .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterName);
    });
    this.renderProjects();
  }

  renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const all = this.state.projects;
    const searchVal = (document.getElementById('prod-search-input')?.value || '').toLowerCase();

    // Calculate metrics
    const completed = all.filter(p => p.status === 'concluido').length;
    const running = all.filter(p => p.status === 'andamento').length;
    const pending = all.filter(p => p.status === 'revisao').length;

    const metricMonth = document.getElementById('prod-metric-month-total');
    if (metricMonth) metricMonth.innerText = all.length;
    const metricComp = document.getElementById('prod-metric-completed');
    if (metricComp) metricComp.innerText = completed;
    const metricRun = document.getElementById('prod-metric-running');
    if (metricRun) metricRun.innerText = running;
    const metricPend = document.getElementById('prod-metric-pending');
    if (metricPend) metricPend.innerText = pending;

    let filtered = all.filter(p => {
      if (this.prodFilter !== 'all' && p.status !== this.prodFilter) return false;
      if (searchVal && !p.name.toLowerCase().includes(searchVal) && !(p.client || '').toLowerCase().includes(searchVal) && !(p.type || '').toLowerCase().includes(searchVal)) {
        return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <i class="ri-layout-masonry-line empty-state-icon"></i>
          <span class="empty-state-title">Nenhum projeto de produção encontrado</span>
          <span class="empty-state-sub">Cadastre novos clientes e acompanhe as entregas.</span>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const delDone = Number(p.delDone || 0);
      const delTotal = Number(p.delTotal || 1);
      const delPct = Math.min(100, Math.round((delDone / delTotal) * 100));

      return `
        <div class="project-card">
          <div class="proj-card-head">
            <div>
              <h3 class="proj-title">${this.escapeHtml(p.name)}</h3>
              <div class="proj-client-badge">${this.escapeHtml(p.client || 'Cliente')} • ${this.escapeHtml(p.type)}</div>
            </div>
            <span class="prod-status-badge ${p.status}">${this.getProjectStatusLabel(p.status)}</span>
          </div>

          <div class="proj-deliveries-progress">
            <div class="proj-del-labels">
              <span>Entregas: ${delDone} de ${delTotal}</span>
              <span class="text-blue">${delPct}%</span>
            </div>
            <div class="meta-progress-track">
              <div class="meta-progress-bar" style="width: ${delPct}%;"></div>
            </div>
          </div>

          <div class="proj-details-box">
            <div class="proj-detail-row">
              <span>Prazo de Entrega:</span>
              <strong>${this.formatDateBR(p.deadline)}</strong>
            </div>
            ${p.value ? `
            <div class="proj-detail-row">
              <span>Valor do Projeto:</span>
              <strong class="text-emerald">${this.formatMoney(p.value)}</strong>
            </div>` : ''}
            ${p.notes ? `
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
              ${this.escapeHtml(p.notes)}
            </div>` : ''}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button class="btn-card-action-subtle" onclick="app.openProjectModal('${p.id}')"><i class="ri-edit-line"></i> Editar</button>
            <button class="btn-task-action delete" onclick="app.deleteProject('${p.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ==========================================================================
     11. PERSONAL VIEW
     ========================================================================== */
  renderPersonal() {
    const eventsContainer = document.getElementById('personal-events-list');
    const notesContainer = document.getElementById('personal-notes-list');
    const infoContainer = document.getElementById('personal-info-list');

    const events = this.state.personalItems.filter(i => i.type === 'evento');
    const notes = this.state.personalItems.filter(i => i.type === 'nota');
    const infos = this.state.personalItems.filter(i => i.type === 'info');

    if (eventsContainer) {
      if (events.length === 0) {
        eventsContainer.innerHTML = `<div class="empty-state-box"><span class="empty-state-title">Nenhum evento registrado</span></div>`;
      } else {
        eventsContainer.innerHTML = events.map(e => `
          <div class="task-item-row">
            <div class="task-main-info" onclick="app.openPersonalModal('${e.id}')" style="cursor: pointer;">
              <span class="task-text-title">${this.escapeHtml(e.title)}</span>
              <div class="task-meta-tags">
                ${e.date ? `<span class="task-time-pill"><i class="ri-calendar-line"></i> ${this.formatDateBR(e.date)}</span>` : ''}
                ${e.time ? `<span class="task-time-pill"><i class="ri-time-line"></i> ${e.time}</span>` : ''}
              </div>
              ${e.content ? `<p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${this.escapeHtml(e.content)}</p>` : ''}
            </div>
            <button class="btn-task-action delete" onclick="app.deletePersonalItem('${e.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
          </div>
        `).join('');
      }
    }

    if (notesContainer) {
      if (notes.length === 0) {
        notesContainer.innerHTML = `<div class="empty-state-box"><span class="empty-state-title">Nenhuma anotação</span></div>`;
      } else {
        notesContainer.innerHTML = notes.map(n => `
          <div class="task-item-row" style="flex-direction: column; align-items: flex-start; gap: 0.35rem;">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <strong style="color: var(--text-heading); font-size: 0.9rem;">${this.escapeHtml(n.title)}</strong>
              <button class="btn-task-action delete" onclick="app.deletePersonalItem('${n.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-body); white-space: pre-wrap;">${this.escapeHtml(n.content)}</p>
          </div>
        `).join('');
      }
    }

    if (infoContainer) {
      if (infos.length === 0) {
        infoContainer.innerHTML = `<div class="empty-state-box"><span class="empty-state-title">Nenhuma informação guardada</span></div>`;
      } else {
        infoContainer.innerHTML = infos.map(info => `
          <div class="task-item-row" style="flex-direction: column; align-items: flex-start; gap: 0.35rem;">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <strong style="color: var(--emerald-primary); font-size: 0.9rem;"><i class="ri-information-fill"></i> ${this.escapeHtml(info.title)}</strong>
              <button class="btn-task-action delete" onclick="app.deletePersonalItem('${info.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-body);">${this.escapeHtml(info.content)}</p>
          </div>
        `).join('');
      }
    }
  }

  saveScratchpad() {
    const val = document.getElementById('quick-scratchpad')?.value || '';
    this.state.scratchpad = val;
    this.saveState();
  }

  /* ==========================================================================
     12. METAS VIEW
     ========================================================================== */
  setMetaFilter(filterName) {
    this.metaFilter = filterName;
    document.querySelectorAll('#metas-filter-pills .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterName);
    });
    this.renderMetas();
  }

  renderMetas() {
    const grid = document.getElementById('metas-full-grid');
    if (!grid) return;

    let filtered = this.state.metas;
    if (this.metaFilter !== 'all') {
      filtered = filtered.filter(m => m.category === this.metaFilter);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <i class="ri-flag-2-line empty-state-icon"></i>
          <span class="empty-state-title">Nenhuma meta encontrada</span>
          <span class="empty-state-sub">Cadastre seus objetivos para acompanhar a evolução.</span>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(m => {
      const daysLeft = this.calculateDaysRemaining(m.deadline);

      return `
        <div class="meta-full-card">
          <div class="meta-full-header">
            <div>
              <h3 class="meta-full-title">${this.escapeHtml(m.name)}</h3>
              <span class="meta-full-category">${this.escapeHtml(m.category)}</span>
            </div>
            <button class="btn-task-action delete" onclick="app.deleteMeta('${m.id}')" title="Excluir"><i class="ri-delete-bin-line"></i></button>
          </div>

          ${m.desc ? `<p class="meta-full-desc">${this.escapeHtml(m.desc)}</p>` : ''}

          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
              <span>Progresso</span>
              <span class="text-blue">${m.progress}%</span>
            </div>
            <div class="meta-progress-track">
              <div class="meta-progress-bar" style="width: ${m.progress}%;"></div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
            <span>Prazo: <strong>${this.formatDateBR(m.deadline)}</strong></span>
            <span class="${daysLeft < 7 ? 'text-rose' : 'text-blue'}">${daysLeft >= 0 ? `${daysLeft} dias restantes` : 'Prazo expirado'}</span>
          </div>

          <div class="meta-quick-adjust">
            <span style="font-size: 0.75rem; color: var(--text-muted);">Ajuste rápido:</span>
            <button class="btn-meta-step" onclick="app.adjustMetaProgress('${m.id}', -10)">-10%</button>
            <button class="btn-meta-step" onclick="app.adjustMetaProgress('${m.id}', +5)">+5%</button>
            <button class="btn-meta-step" onclick="app.adjustMetaProgress('${m.id}', +10)">+10%</button>
            <button class="btn-card-action-subtle" style="margin-left: auto;" onclick="app.openMetaModal('${m.id}')"><i class="ri-edit-line"></i> Editar</button>
          </div>
        </div>
      `;
    }).join('');
  }

  adjustMetaProgress(metaId, delta) {
    const meta = this.state.metas.find(m => m.id === metaId);
    if (!meta) return;
    let val = Number(meta.progress || 0) + delta;
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    meta.progress = val;
    this.saveState();
    this.renderMetas();
    this.renderDashboard();
    this.showToast(`Meta "${meta.name}" atualizada para ${val}%`, 'info');
  }

  calculateDaysRemaining(deadlineStr) {
    if (!deadlineStr) return 0;
    const deadline = new Date(deadlineStr + 'T23:59:59');
    const now = new Date();
    const diff = deadline - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /* ==========================================================================
     13. CALENDAR VIEW (Mês / Semana / Dia)
     ========================================================================== */
  setCalMode(mode) {
    this.calMode = mode;
    document.querySelectorAll('.cal-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    this.renderCalendar();
  }

  calPrev() {
    if (this.calMode === 'month') {
      this.currentCalDate.setMonth(this.currentCalDate.getMonth() - 1);
    } else if (this.calMode === 'week') {
      this.currentCalDate.setDate(this.currentCalDate.getDate() - 7);
    } else {
      this.currentCalDate.setDate(this.currentCalDate.getDate() - 1);
    }
    this.renderCalendar();
  }

  calNext() {
    if (this.calMode === 'month') {
      this.currentCalDate.setMonth(this.currentCalDate.getMonth() + 1);
    } else if (this.calMode === 'week') {
      this.currentCalDate.setDate(this.currentCalDate.getDate() + 7);
    } else {
      this.currentCalDate.setDate(this.currentCalDate.getDate() + 1);
    }
    this.renderCalendar();
  }

  calToday() {
    this.currentCalDate = new Date();
    this.renderCalendar();
  }

  renderCalendar() {
    const container = document.getElementById('calendar-display-container');
    const label = document.getElementById('cal-current-label');
    if (!container) return;

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const month = this.currentCalDate.getMonth();
    const year = this.currentCalDate.getFullYear();

    if (label) {
      label.innerText = `${months[month]} de ${year}`;
    }

    if (this.calMode === 'month') {
      this.renderMonthCalendar(container, year, month);
    } else if (this.calMode === 'week') {
      this.renderWeekCalendar(container);
    } else {
      this.renderDayCalendar(container);
    }
  }

  renderMonthCalendar(container, year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayIndex = (firstDay.getDay() + 6) % 7; // Monday 0
    const lastDayIndex = (lastDay.getDay() + 6) % 7;
    const nextDays = 7 - lastDayIndex - 1;

    const dayHeaders = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const todayISO = this.formatDateISO(new Date());

    let html = `<div class="calendar-month-grid">`;
    dayHeaders.forEach(d => {
      html += `<div class="cal-month-header-cell">${d}</div>`;
    });

    // Previous month days
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevLastDay.getDate() - x + 1;
      html += `<div class="cal-month-day-cell other-month"><span class="cal-day-number">${dayNum}</span></div>`;
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentD = new Date(year, month, i);
      const iso = this.formatDateISO(currentD);
      const isToday = iso === todayISO;

      const dayTasks = this.state.tasks.filter(t => t.date === iso);
      const dayProjects = this.state.projects.filter(p => p.deadline === iso);
      const dayEvents = this.state.personalItems.filter(p => p.date === iso);

      html += `
        <div class="cal-month-day-cell ${isToday ? 'is-today' : ''}" onclick="app.openDayDetailsModal('${iso}')" title="Clique para ver e editar os compromissos deste dia">
          <span class="cal-day-number">${i}</span>
          <div class="cal-day-events-stack">
            ${dayTasks.map(t => `<div class="cal-event-pill type-task" title="${this.escapeHtml(t.title)}">• ${this.escapeHtml(t.title)}</div>`).join('')}
            ${dayProjects.map(p => `<div class="cal-event-pill type-project" title="${this.escapeHtml(p.name)}">★ ${this.escapeHtml(p.name)}</div>`).join('')}
            ${dayEvents.map(e => `<div class="cal-event-pill type-personal" title="${this.escapeHtml(e.title)}">👤 ${this.escapeHtml(e.title)}</div>`).join('')}
          </div>
        </div>
      `;
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
      html += `<div class="cal-month-day-cell other-month"><span class="cal-day-number">${j}</span></div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  renderWeekCalendar(container) {
    const monday = new Date(this.currentCalDate);
    const dayOfWeek = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - dayOfWeek);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d);
    }

    const dayHeaders = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.75rem;">
        ${weekDays.map((d, index) => {
          const iso = this.formatDateISO(d);
          const tasks = this.state.tasks.filter(t => t.date === iso);
          const projects = this.state.projects.filter(p => p.deadline === iso);
          const events = this.state.personalItems.filter(p => p.date === iso);

          return `
            <div class="dash-card" style="padding: 0.75rem; cursor: pointer;" onclick="app.openDayDetailsModal('${iso}')" title="Clique para ver os compromissos deste dia">
              <div style="font-weight: 700; font-size: 0.85rem; color: var(--blue-primary); margin-bottom: 0.5rem; text-align: center;">
                ${dayHeaders[index]}<br>
                <span style="font-size: 1.15rem; color: var(--text-heading);">${d.getDate()}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                ${tasks.map(t => `<div class="cal-event-pill type-task">${this.escapeHtml(t.title)}</div>`).join('')}
                ${projects.map(p => `<div class="cal-event-pill type-project">Entrega: ${this.escapeHtml(p.name)}</div>`).join('')}
                ${events.map(e => `<div class="cal-event-pill type-personal">${this.escapeHtml(e.title)}</div>`).join('')}
                ${tasks.length === 0 && projects.length === 0 && events.length === 0 ? '<span style="font-size: 0.72rem; color: var(--text-muted); text-align: center; margin-top: 1rem;">Livre</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderDayCalendar(container) {
    const iso = this.formatDateISO(this.currentCalDate);
    const tasks = this.state.tasks.filter(t => t.date === iso);
    const projects = this.state.projects.filter(p => p.deadline === iso);
    const events = this.state.personalItems.filter(p => p.date === iso);

    container.innerHTML = `
      <div class="dash-card" style="padding: 1.5rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--text-heading); margin-bottom: 1rem;">
          Linha do Tempo: ${this.formatDateBR(iso)}
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${projects.map(p => `
            <div class="task-item-row" style="border-left: 3px solid var(--emerald-primary);">
              <i class="ri-flag-fill text-emerald"></i>
              <div class="task-main-info">
                <strong>Prazo de Entrega: ${this.escapeHtml(p.name)}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">Cliente: ${this.escapeHtml(p.client)}</span>
              </div>
            </div>
          `).join('')}
          ${tasks.map(t => `
            <div class="task-item-row" style="border-left: 3px solid var(--blue-primary);">
              <button class="task-checkbox-custom" onclick="app.toggleTaskStatus('${t.id}')">
                <i class="ri-check-line"></i>
              </button>
              <div class="task-main-info">
                <strong>${this.escapeHtml(t.title)}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${t.time || 'Sem horário definido'} • Prioridade ${t.priority.toUpperCase()}</span>
              </div>
            </div>
          `).join('')}
          ${events.map(e => `
            <div class="task-item-row" style="border-left: 3px solid var(--purple-primary);">
              <i class="ri-user-smile-fill text-purple"></i>
              <div class="task-main-info">
                <strong>${this.escapeHtml(e.title)}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${e.time || 'Pessoal'} • ${this.escapeHtml(e.content || '')}</span>
              </div>
            </div>
          `).join('')}
          ${tasks.length === 0 && projects.length === 0 && events.length === 0 ? '<div class="empty-state-box"><span class="empty-state-title">Nenhum compromisso para este dia</span></div>' : ''}
        </div>
      </div>
    `;
  }

  openDayDetailsModal(iso) {
    const modal = document.getElementById('modal-cal-day');
    const title = document.getElementById('modal-cal-day-title');
    const content = document.getElementById('modal-cal-day-content');
    const btnAdd = document.getElementById('btn-cal-day-add');
    if (!modal || !content) return;

    if (title) title.innerHTML = `Compromissos de <span class="highlight-blue">${this.formatDateBR(iso)} <span class="cyan-asterisk">*</span></span>`;

    if (btnAdd) {
      btnAdd.onclick = () => {
        this.closeModals();
        this.openTaskModal();
        setTimeout(() => {
          const dtInput = document.getElementById('task-input-date');
          if (dtInput) dtInput.value = iso;
        }, 50);
      };
    }

    const dayTasks = this.state.tasks.filter(t => t.date === iso);
    const dayProjects = this.state.projects.filter(p => p.deadline === iso);
    const dayEvents = this.state.personalItems.filter(p => p.date === iso);

    if (dayTasks.length === 0 && dayProjects.length === 0 && dayEvents.length === 0) {
      content.innerHTML = `
        <div class="empty-state-box">
          <i class="ri-calendar-line empty-state-icon"></i>
          <span class="empty-state-title">Nenhum compromisso ou tarefa neste dia</span>
          <span class="empty-state-sub">Clique no botão abaixo para agendar algo para esta data.</span>
        </div>
      `;
    } else {
      let html = '';
      if (dayProjects.length > 0) {
        html += `<strong style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Entregas de Projetos:</strong>`;
        dayProjects.forEach(p => {
          html += `
            <div class="task-item-row" style="border-left: 3px solid var(--emerald-primary);">
              <i class="ri-flag-fill text-emerald"></i>
              <div class="task-main-info" onclick="app.closeModals(); app.openProjectModal('${p.id}');" style="cursor:pointer;">
                <strong>${this.escapeHtml(p.name)}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${this.escapeHtml(p.client || 'Cliente')} • Status: ${this.getProjectStatusLabel(p.status)}</span>
              </div>
              <button class="btn-card-action-subtle" onclick="app.closeModals(); app.openProjectModal('${p.id}');"><i class="ri-edit-line"></i></button>
            </div>
          `;
        });
      }

      if (dayTasks.length > 0) {
        html += `<strong style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-top:0.4rem;">Tarefas:</strong>`;
        dayTasks.forEach(t => {
          html += `
            <div class="task-item-row ${t.status === 'concluida' ? 'completed' : ''}" style="border-left: 3px solid var(--blue-primary);">
              <button class="task-checkbox-custom" onclick="app.toggleTaskStatus('${t.id}'); app.openDayDetailsModal('${iso}');">
                <i class="ri-check-line"></i>
              </button>
              <div class="task-main-info" onclick="app.closeModals(); app.openTaskModal('${t.id}');" style="cursor:pointer;">
                <span class="task-text-title">${this.escapeHtml(t.title)}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${t.time ? `${t.time} • ` : ''}Prioridade ${t.priority.toUpperCase()}</span>
              </div>
              <button class="btn-card-action-subtle" onclick="app.closeModals(); app.openTaskModal('${t.id}');"><i class="ri-edit-line"></i></button>
            </div>
          `;
        });
      }

      if (dayEvents.length > 0) {
        html += `<strong style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-top:0.4rem;">Pessoal & Compromissos:</strong>`;
        dayEvents.forEach(e => {
          html += `
            <div class="task-item-row" style="border-left: 3px solid var(--purple-primary);">
              <i class="ri-user-smile-fill text-purple"></i>
              <div class="task-main-info" onclick="app.closeModals(); app.openPersonalModal('${e.type}', '${e.id}');" style="cursor:pointer;">
                <strong>${this.escapeHtml(e.title)}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${e.time || 'Pessoal'} • ${this.escapeHtml(e.content || '')}</span>
              </div>
              <button class="btn-card-action-subtle" onclick="app.closeModals(); app.openPersonalModal('${e.type}', '${e.id}');"><i class="ri-edit-line"></i></button>
            </div>
          `;
        });
      }

      content.innerHTML = html;
    }

    modal.classList.add('active');
  }

  /* ==========================================================================
     14. CRUD OPERATIONS (Tasks, Projects, Finance, Metas, Personal)
     ========================================================================== */

  // --- TASKS ---
  toggleTaskStatus(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = task.status === 'concluida' ? 'a_fazer' : 'concluida';
    this.saveState();
    this.renderTasks();
    this.renderDashboard();
    this.renderCalendar();
    this.showToast(task.status === 'concluida' ? 'Tarefa concluída! Parabéns 🚀' : 'Tarefa reaberta', 'success');
  }

  openTaskModal(taskId = null) {
    const modal = document.getElementById('modal-task');
    const form = document.getElementById('form-task');
    const titleEl = document.getElementById('modal-task-title');
    if (!modal || !form) return;

    this.populateProjectSelectOptions();

    if (taskId) {
      const task = this.state.tasks.find(t => t.id === taskId);
      if (task) {
        titleEl.innerText = 'Editar Tarefa';
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-input-title').value = task.title;
        document.getElementById('task-input-date').value = task.date;
        document.getElementById('task-input-time').value = task.time || '';
        document.getElementById('task-input-priority').value = task.priority || 'media';
        document.getElementById('task-input-status').value = task.status || 'a_fazer';
        document.getElementById('task-input-category').value = task.category || 'CR Design';
        document.getElementById('task-input-project').value = task.projectId || '';
        document.getElementById('task-input-desc').value = task.desc || '';
      }
    } else {
      titleEl.innerText = 'Nova Tarefa';
      form.reset();
      document.getElementById('task-id').value = '';
      document.getElementById('task-input-date').value = this.formatDateISO(new Date());
    }

    modal.classList.add('active');
  }

  handleSaveTask(event) {
    event.preventDefault();
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-input-title').value.trim();
    const date = document.getElementById('task-input-date').value;
    const time = document.getElementById('task-input-time').value;
    const priority = document.getElementById('task-input-priority').value;
    const status = document.getElementById('task-input-status').value;
    const category = document.getElementById('task-input-category').value;
    const projectId = document.getElementById('task-input-project').value;
    const desc = document.getElementById('task-input-desc').value.trim();

    if (!title || !date) {
      alert('Por favor, informe o título e a data da tarefa.');
      return;
    }

    if (id) {
      const existing = this.state.tasks.find(t => t.id === id);
      if (existing) {
        existing.title = title;
        existing.date = date;
        existing.time = time;
        existing.priority = priority;
        existing.status = status;
        existing.category = category;
        existing.projectId = projectId;
        existing.desc = desc;
      }
    } else {
      const newTask = {
        id: 'tsk_' + Date.now(),
        title,
        date,
        time,
        priority,
        status,
        category,
        projectId,
        desc
      };
      this.state.tasks.unshift(newTask);
    }

    this.saveState();
    this.closeModals();
    this.renderTasks();
    this.renderDashboard();
    this.renderCalendar();
    this.showToast('Tarefa salva com sucesso!', 'success');
  }

  deleteTask(taskId) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
      this.saveState();
      this.renderTasks();
      this.renderDashboard();
      this.renderCalendar();
      this.showToast('Tarefa removida.', 'info');
    }
  }

  // --- PROJECTS (PRODUÇÃO) ---
  openProjectModal(projId = null) {
    const modal = document.getElementById('modal-project');
    const form = document.getElementById('form-project');
    const titleEl = document.getElementById('modal-project-title');
    if (!modal || !form) return;

    if (projId) {
      const proj = this.state.projects.find(p => p.id === projId);
      if (proj) {
        titleEl.innerText = 'Editar Projeto';
        document.getElementById('proj-id').value = proj.id;
        document.getElementById('proj-input-name').value = proj.name;
        document.getElementById('proj-input-client').value = proj.client || '';
        document.getElementById('proj-input-type').value = proj.type || 'Landing Page';
        document.getElementById('proj-input-start').value = proj.start || '';
        document.getElementById('proj-input-deadline').value = proj.deadline;
        document.getElementById('proj-input-status').value = proj.status || 'andamento';
        document.getElementById('proj-input-del-done').value = proj.delDone || 0;
        document.getElementById('proj-input-del-total').value = proj.delTotal || 1;
        document.getElementById('proj-input-value').value = proj.value || '';
        document.getElementById('proj-input-completion-date').value = proj.completionDate || '';
        document.getElementById('proj-input-notes').value = proj.notes || '';
      }
    } else {
      titleEl.innerText = 'Novo Projeto de Produção';
      form.reset();
      document.getElementById('proj-id').value = '';
      document.getElementById('proj-input-start').value = this.formatDateISO(new Date());
      const nextW = new Date();
      nextW.setDate(nextW.getDate() + 7);
      document.getElementById('proj-input-deadline').value = this.formatDateISO(nextW);
    }

    modal.classList.add('active');
  }

  handleSaveProject(event) {
    event.preventDefault();
    const id = document.getElementById('proj-id').value;
    const name = document.getElementById('proj-input-name').value.trim();
    const client = document.getElementById('proj-input-client').value.trim();
    const type = document.getElementById('proj-input-type').value;
    const start = document.getElementById('proj-input-start').value;
    const deadline = document.getElementById('proj-input-deadline').value;
    const status = document.getElementById('proj-input-status').value;
    const delDone = Number(document.getElementById('proj-input-del-done').value || 0);
    const delTotal = Number(document.getElementById('proj-input-del-total').value || 1);
    const value = document.getElementById('proj-input-value').value ? Number(document.getElementById('proj-input-value').value) : null;
    const completionDate = document.getElementById('proj-input-completion-date').value;
    const notes = document.getElementById('proj-input-notes').value.trim();

    if (!name || !deadline) {
      alert('Por favor, informe o nome e o prazo de entrega.');
      return;
    }

    if (id) {
      const existing = this.state.projects.find(p => p.id === id);
      if (existing) {
        existing.name = name;
        existing.client = client;
        existing.type = type;
        existing.start = start;
        existing.deadline = deadline;
        existing.status = status;
        existing.delDone = delDone;
        existing.delTotal = delTotal;
        existing.value = value;
        existing.completionDate = completionDate;
        existing.notes = notes;
      }
    } else {
      const newProj = {
        id: 'prj_' + Date.now(),
        name,
        client,
        type,
        start,
        deadline,
        status,
        delDone,
        delTotal,
        value,
        completionDate,
        notes
      };
      this.state.projects.unshift(newProj);
    }

    this.saveState();
    this.closeModals();
    this.renderProjects();
    this.renderDashboard();
    this.renderCalendar();
    this.populateProjectSelectOptions();
    this.showToast('Projeto de produção salvo!', 'success');
  }

  deleteProject(projId) {
    if (confirm('Deseja realmente excluir este projeto de produção?')) {
      this.state.projects = this.state.projects.filter(p => p.id !== projId);
      this.saveState();
      this.renderProjects();
      this.renderDashboard();
      this.renderCalendar();
      this.showToast('Projeto removido.', 'info');
    }
  }

  // --- FINANCE TRANSACTIONS & BUDGET ---
  openFinanceTransactionModal() {
    const modal = document.getElementById('modal-finance-trans');
    const form = document.getElementById('form-finance-trans');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('trans-id').value = '';
    document.getElementById('trans-input-date').value = this.formatDateISO(new Date());
    document.getElementById('trans-type-despesa').checked = true;
    this.updateFinanceCategoryOptions();

    modal.classList.add('active');
  }

  updateFinanceCategoryOptions() {
    const isDespesa = document.getElementById('trans-type-despesa')?.checked;
    const catSelect = document.getElementById('trans-input-category');
    if (!catSelect) return;

    if (isDespesa) {
      catSelect.innerHTML = `
        <option value="Contas Fixas">Contas Fixas</option>
        <option value="Casa & Mercado">Casa & Mercado</option>
        <option value="Alimentação">Alimentação</option>
        <option value="Transporte">Transporte</option>
        <option value="Roupas & Cuidados">Roupas & Cuidados</option>
        <option value="Lazer & Pessoal">Lazer & Pessoal</option>
        <option value="Reserva Financeira">Reserva Financeira</option>
        <option value="Outros Gastos">Outros Gastos</option>
      `;
    } else {
      catSelect.innerHTML = `
        <option value="Salário / Fixo">Salário / Fixo</option>
        <option value="Freelances">Freelances</option>
        <option value="Clientes">Clientes CR Design</option>
        <option value="Ajuste Fino">Ajuste Fino</option>
        <option value="Extras">Extras & Outros</option>
      `;
    }
  }

  handleSaveTransaction(event) {
    event.preventDefault();
    const type = document.querySelector('input[name="trans_type"]:checked').value;
    const amount = Number(document.getElementById('trans-input-amount').value || 0);
    const date = document.getElementById('trans-input-date').value;
    const desc = document.getElementById('trans-input-desc').value.trim();
    const category = document.getElementById('trans-input-category').value;

    if (!amount || !desc || !date) {
      alert('Preencha valor, descrição e data.');
      return;
    }

    const newTrans = {
      id: 'tr_' + Date.now(),
      type,
      amount,
      date,
      desc,
      category
    };

    this.state.transactions.unshift(newTrans);
    this.saveState();
    this.closeModals();
    this.renderFinances();
    this.renderDashboard();
    this.showToast('Lançamento financeiro registrado com sucesso!', 'success');
  }

  deleteTransaction(transId) {
    if (confirm('Deseja excluir este lançamento?')) {
      this.state.transactions = this.state.transactions.filter(t => t.id !== transId);
      this.saveState();
      this.renderFinances();
      this.renderDashboard();
      this.showToast('Lançamento removido.', 'info');
    }
  }

  openBudgetPlanningModal() {
    const modal = document.getElementById('modal-budget-planning');
    const container = document.getElementById('budget-editor-categories-container');
    const incomeInput = document.getElementById('budget-input-expected-income');
    if (!modal || !container) return;

    if (incomeInput) {
      incomeInput.value = this.state.budgetPlanning.expectedIncome || 1250.00;
    }

    container.innerHTML = this.state.budgetPlanning.categories.map(cat => `
      <div class="budget-edit-row">
        <span class="chip-color-dot" style="background-color: ${cat.color};"></span>
        <span class="budget-edit-cat-name">${this.escapeHtml(cat.name)}</span>
        <input type="number" step="0.01" min="0" class="budget-edit-input" data-cat-id="${cat.id}" value="${cat.amount}" oninput="app.recalculateBudgetModalPreview()">
      </div>
    `).join('');

    this.recalculateBudgetModalPreview();
    modal.classList.add('active');
  }

  recalculateBudgetModalPreview() {
    const income = Number(document.getElementById('budget-input-expected-income')?.value || 0);
    const inputs = document.querySelectorAll('.budget-edit-input');
    let totalAllocated = 0;

    inputs.forEach(input => {
      totalAllocated += Number(input.value || 0);
    });

    const remaining = income - totalAllocated;

    const totalAllocEl = document.getElementById('modal-budget-total-allocated');
    if (totalAllocEl) totalAllocEl.innerText = this.formatMoney(totalAllocated);

    const remEl = document.getElementById('modal-budget-remaining-balance');
    if (remEl) {
      remEl.innerText = this.formatMoney(remaining);
      remEl.style.color = remaining >= 0 ? 'var(--blue-primary)' : 'var(--rose-primary)';
    }
  }

  handleSaveBudgetPlanning(event) {
    event.preventDefault();
    const income = Number(document.getElementById('budget-input-expected-income')?.value || 0);
    const inputs = document.querySelectorAll('.budget-edit-input');

    this.state.budgetPlanning.expectedIncome = income;

    inputs.forEach(input => {
      const catId = input.dataset.catId;
      const amount = Number(input.value || 0);
      const cat = this.state.budgetPlanning.categories.find(c => c.id === catId);
      if (cat) cat.amount = amount;
    });

    this.saveState();
    this.closeModals();
    this.renderFinances();
    this.renderDashboard();
    this.showToast('Planejamento de orçamento atualizado!', 'success');
  }

  // --- METAS ---
  openMetaModal(metaId = null) {
    const modal = document.getElementById('modal-meta');
    const form = document.getElementById('form-meta');
    const titleEl = document.getElementById('modal-meta-title');
    if (!modal || !form) return;

    if (metaId) {
      const meta = this.state.metas.find(m => m.id === metaId);
      if (meta) {
        titleEl.innerText = 'Editar Meta';
        document.getElementById('meta-id').value = meta.id;
        document.getElementById('meta-input-name').value = meta.name;
        document.getElementById('meta-input-category').value = meta.category;
        document.getElementById('meta-input-deadline').value = meta.deadline;
        document.getElementById('meta-input-progress').value = meta.progress;
        document.getElementById('meta-progress-label').innerText = meta.progress + '%';
        document.getElementById('meta-input-desc').value = meta.desc || '';
      }
    } else {
      titleEl.innerText = 'Nova Meta';
      form.reset();
      document.getElementById('meta-id').value = '';
      document.getElementById('meta-input-progress').value = 50;
      document.getElementById('meta-progress-label').innerText = '50%';
    }

    modal.classList.add('active');
  }

  handleSaveMeta(event) {
    event.preventDefault();
    const id = document.getElementById('meta-id').value;
    const name = document.getElementById('meta-input-name').value.trim();
    const category = document.getElementById('meta-input-category').value;
    const deadline = document.getElementById('meta-input-deadline').value;
    const progress = Number(document.getElementById('meta-input-progress').value || 0);
    const desc = document.getElementById('meta-input-desc').value.trim();

    if (!name || !deadline) {
      alert('Informe nome e prazo da meta.');
      return;
    }

    if (id) {
      const existing = this.state.metas.find(m => m.id === id);
      if (existing) {
        existing.name = name;
        existing.category = category;
        existing.deadline = deadline;
        existing.progress = progress;
        existing.desc = desc;
      }
    } else {
      const newMeta = {
        id: 'meta_' + Date.now(),
        name,
        category,
        deadline,
        progress,
        desc,
        status: 'ativa'
      };
      this.state.metas.push(newMeta);
    }

    this.saveState();
    this.closeModals();
    this.renderMetas();
    this.renderDashboard();
    this.showToast('Meta salva com sucesso!', 'success');
  }

  deleteMeta(metaId) {
    if (confirm('Deseja excluir esta meta?')) {
      this.state.metas = this.state.metas.filter(m => m.id !== metaId);
      this.saveState();
      this.renderMetas();
      this.renderDashboard();
      this.showToast('Meta removida.', 'info');
    }
  }

  // --- PERSONAL ITEMS ---
  openPersonalModal(defaultType = 'evento', itemId = null) {
    const modal = document.getElementById('modal-personal');
    const form = document.getElementById('form-personal');
    const titleEl = document.getElementById('modal-personal-title');
    if (!modal || !form) return;

    if (itemId) {
      const item = this.state.personalItems.find(i => i.id === itemId);
      if (item) {
        titleEl.innerText = 'Editar Item Pessoal';
        document.getElementById('personal-id').value = item.id;
        document.getElementById('personal-input-type').value = item.type;
        document.getElementById('personal-input-title').value = item.title;
        document.getElementById('personal-input-date').value = item.date || '';
        document.getElementById('personal-input-time').value = item.time || '';
        document.getElementById('personal-input-content').value = item.content || '';
      }
    } else {
      titleEl.innerText = 'Novo Registro Pessoal';
      form.reset();
      document.getElementById('personal-id').value = '';
      document.getElementById('personal-input-type').value = defaultType;
      document.getElementById('personal-input-date').value = this.formatDateISO(new Date());
    }

    this.updatePersonalModalFields();
    modal.classList.add('active');
  }

  updatePersonalModalFields() {
    const type = document.getElementById('personal-input-type')?.value;
    const dtFields = document.getElementById('personal-fields-datetime');
    if (dtFields) {
      dtFields.style.display = (type === 'evento') ? 'grid' : 'none';
    }
  }

  handleSavePersonalItem(event) {
    event.preventDefault();
    const id = document.getElementById('personal-id').value;
    const type = document.getElementById('personal-input-type').value;
    const title = document.getElementById('personal-input-title').value.trim();
    const date = document.getElementById('personal-input-date').value;
    const time = document.getElementById('personal-input-time').value;
    const content = document.getElementById('personal-input-content').value.trim();

    if (!title) {
      alert('Informe o título.');
      return;
    }

    if (id) {
      const existing = this.state.personalItems.find(i => i.id === id);
      if (existing) {
        existing.type = type;
        existing.title = title;
        existing.date = date;
        existing.time = time;
        existing.content = content;
      }
    } else {
      const newItem = {
        id: 'per_' + Date.now(),
        type,
        title,
        date,
        time,
        content
      };
      this.state.personalItems.unshift(newItem);
    }

    this.saveState();
    this.closeModals();
    this.renderPersonal();
    this.renderDashboard();
    this.renderCalendar();
    this.showToast('Item pessoal salvo!', 'success');
  }

  deletePersonalItem(itemId) {
    if (confirm('Deseja excluir este item pessoal?')) {
      this.state.personalItems = this.state.personalItems.filter(i => i.id !== itemId);
      this.saveState();
      this.renderPersonal();
      this.renderDashboard();
      this.renderCalendar();
      this.showToast('Item removido.', 'info');
    }
  }

  /* ==========================================================================
     15. BACKUP, RESTORE, THEME & SETTINGS
     ========================================================================== */
  openSettingsModal() {
    const modal = document.getElementById('modal-settings');
    if (modal) modal.classList.add('active');
  }

  openQuickAddModal() {
    const modal = document.getElementById('modal-quick-add');
    if (modal) modal.classList.add('active');
  }

  closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  setTheme(themeName) {
    this.state.theme = themeName;
    this.applyTheme(themeName);
    this.saveState();
    document.getElementById('btn-theme-dark')?.classList.toggle('active', themeName === 'dark');
    document.getElementById('btn-theme-light')?.classList.toggle('active', themeName === 'light');
    this.showToast(`Tema ${themeName === 'dark' ? 'Dark (CR Design)' : 'Light'} ativado!`, 'info');
  }

  applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    document.body.className = themeName === 'dark' ? 'dark-theme' : 'light-theme';
  }

  exportDataBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `cr_design_gestao_backup_${this.formatDateISO(new Date())}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    this.showToast('Backup exportado com sucesso!', 'success');
  }

  importDataBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        this.state = this.validateAndMergeState(imported);
        this.saveState();
        this.renderAll();
        this.closeModals();
        this.showToast('Backup restaurado com sucesso!', 'success');
      } catch (err) {
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  }

  /* ==========================================================================
     16. UTILITY FUNCTIONS & EVENT BINDINGS
     ========================================================================== */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'ri-checkbox-circle-fill' : type === 'error' ? 'ri-close-circle-fill' : 'ri-information-fill';
    toast.innerHTML = `<i class="${icon}"></i> <span>${this.escapeHtml(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  getProjectStatusLabel(status) {
    const map = {
      'andamento': 'Em Andamento',
      'revisao': 'Revisão',
      'concluido': 'Concluído',
      'pausado': 'Pausado'
    };
    return map[status] || status;
  }

  getProjectName(projId) {
    const p = this.state.projects.find(proj => proj.id === projId);
    return p ? p.name : 'Projeto';
  }

  populateProjectSelectOptions() {
    const select = document.getElementById('task-input-project');
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = `<option value="">Nenhum projeto</option>` + this.state.projects.map(p => `
      <option value="${p.id}">${this.escapeHtml(p.name)} (${this.escapeHtml(p.client || 'Cliente')})</option>
    `).join('');
    select.value = currentVal;
  }

  /* ==========================================================================
     14. NATIVE WEB & MOBILE NOTIFICATIONS SYSTEM
     ========================================================================== */
  initNotifications() {
    if (!('Notification' in window)) {
      this.updateNotifUI('unsupported');
      return;
    }

    const permission = Notification.permission;
    this.updateNotifUI(permission);

    // Se a permissão ainda não foi solicitada, exibir banner no dashboard
    if (permission === 'default' && !sessionStorage.getItem('cr_notif_dismissed')) {
      const banner = document.getElementById('notif-permission-banner');
      if (banner) {
        setTimeout(() => {
          banner.style.display = 'flex';
        }, 1200);
      }
    } else if (permission === 'granted') {
      // Checar se há tarefas pendentes para hoje e avisar suavemente
      setTimeout(() => {
        this.checkDailyAlertsNotification(false);
      }, 2500);
    }
  }

  updateNotifUI(status) {
    const statusPill = document.getElementById('settings-notif-status');
    const reqBtn = document.getElementById('btn-settings-request-notif');
    const notifDot = document.getElementById('notif-badge-pulse');
    const notifIcon = document.getElementById('icon-topbar-notif');

    if (!statusPill) return;

    statusPill.className = 'notif-status-pill';

    if (status === 'granted') {
      statusPill.innerText = 'Ativado';
      statusPill.classList.add('granted');
      if (reqBtn) reqBtn.style.display = 'none';
      if (notifDot) notifDot.style.display = 'block';
      if (notifIcon) {
        notifIcon.className = 'ri-notification-3-fill text-blue';
      }
    } else if (status === 'denied') {
      statusPill.innerText = 'Bloqueado no Navegador';
      statusPill.classList.add('denied');
      if (reqBtn) reqBtn.style.display = 'none';
      if (notifDot) notifDot.style.display = 'none';
      if (notifIcon) {
        notifIcon.className = 'ri-notification-off-line';
      }
    } else if (status === 'unsupported') {
      statusPill.innerText = 'Não Suportado';
      statusPill.classList.add('denied');
      if (reqBtn) reqBtn.style.display = 'none';
    } else {
      statusPill.innerText = 'Pendente / Não Solicitado';
      statusPill.classList.add('default');
      if (reqBtn) reqBtn.style.display = 'inline-flex';
      if (notifDot) notifDot.style.display = 'none';
      if (notifIcon) {
        notifIcon.className = 'ri-notification-3-line';
      }
    }
  }

  handleNotificationClick() {
    if (!('Notification' in window)) {
      this.showToast('Seu navegador não suporta a API de notificações nativas.', 'info');
      return;
    }

    if (Notification.permission === 'granted') {
      this.checkDailyAlertsNotification(true);
    } else if (Notification.permission === 'default') {
      this.requestNotificationPermission();
    } else {
      this.showToast('As notificações foram bloqueadas. Habilite nas configurações do seu navegador.', 'info');
      this.openSettingsModal();
    }
  }

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      this.showToast('Seu navegador não possui suporte a notificações.', 'info');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      this.updateNotifUI(permission);

      if (permission === 'granted') {
        this.dismissNotifBanner();
        this.showToast('Notificações ativadas com sucesso!', 'success');

        // Dispara notificação de boas-vindas oficial
        this.sendNativeNotification('CR Design * — Notificações Ativadas', {
          body: 'Você receberá alertas em tempo real sobre prazos, entregas e tarefas do dia.',
          icon: 'minha logo/5.png',
          tag: 'cr_welcome'
        });
      } else if (permission === 'denied') {
        this.showToast('Permissão de notificação recusada no navegador.', 'info');
        this.dismissNotifBanner();
      }
    } catch (e) {
      console.error('Erro ao solicitar permissão de notificações:', e);
    }
  }

  dismissNotifBanner() {
    const banner = document.getElementById('notif-permission-banner');
    if (banner) banner.style.display = 'none';
    sessionStorage.setItem('cr_notif_dismissed', 'true');
  }

  sendNativeNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const defaultOptions = {
        icon: 'minha logo/5.png',
        badge: 'minha logo/1.png',
        silent: false,
        vibrate: [200, 100, 200],
        ...options
      };

      const notification = new Notification(title, defaultOptions);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (err) {
      console.warn('Erro ao disparar notificação nativa:', err);
    }
  }

  sendTestNotification() {
    if (Notification.permission !== 'granted') {
      this.requestNotificationPermission();
      return;
    }

    this.sendNativeNotification('CR Design * — Teste de Notificação', {
      body: '🚀 Notificação funcionando perfeitamente! Lembretes e prazos sincronizados.',
      tag: 'cr_test_' + Date.now()
    });
    this.showToast('Notificação de teste disparada!', 'success');
  }

  checkDailyAlertsNotification(isManual = false) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      if (isManual) this.requestNotificationPermission();
      return;
    }

    const todayStr = this.formatDateISO(new Date());
    const pendingTodayTasks = this.state.tasks.filter(t => t.date === todayStr && !t.completed);
    const activeProjects = this.state.projects.filter(p => p.status === 'andamento' || p.status === 'revisao');

    if (pendingTodayTasks.length > 0 || activeProjects.length > 0) {
      const bodyText = `Você tem ${pendingTodayTasks.length} tarefa(s) pendente(s) hoje e ${activeProjects.length} projeto(s) em produção ativa.`;
      
      this.sendNativeNotification('CR Design * — Lembrete de Hoje', {
        body: bodyText,
        tag: 'cr_daily_' + todayStr
      });

      if (isManual) {
        this.showToast('Lembrete diário enviado para suas notificações!', 'info');
      }
    } else {
      if (isManual) {
        this.showToast('Tudo em dia! Nenhuma tarefa pendente para hoje.', 'success');
      }
    }
  }

  bindEvents() {
    // ESC key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModals();
        this.toggleMobileMoreSheet(false);
      }
    });

    // Close modal when clicking on backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeModals();
        }
      });
    });
  }
}

// Global App Instance
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new CRDesignApp();
});
