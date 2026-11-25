const STORAGE_KEY = 'unify_suite_final_v1';

const DEFAULT_DATA = {
  activeTab: 'Dashboard',
  hiringStages: [
    {
      title: 'New Candidates',
      people: [
        { name: 'Sophia Chen', role: 'Sr. Frontend', badge: 'S', tone: 'bg-indigo-500/30 text-indigo-200' },
        { name: 'David Kim', role: 'Growth Lead', badge: 'D', tone: 'bg-cyan-500/30 text-cyan-200' }
      ]
    },
    {
      title: 'Screening',
      people: [
        { name: 'Maya Patel', role: 'Data Analyst', badge: 'M', tone: 'bg-amber-500/30 text-amber-200' },
        { name: 'Liam Vance', role: 'Backend Eng', badge: 'L', tone: 'bg-emerald-500/30 text-emerald-200' }
      ]
    },
    {
      title: 'Interview',
      people: [
        { name: 'Elena Rostova', role: 'Design Ops', badge: 'E', tone: 'bg-purple-500/30 text-purple-200' },
        { name: 'Noah Brooks', role: 'Account Exec', badge: 'N', tone: 'bg-rose-500/30 text-rose-200' }
      ]
    },
    {
      title: 'Offer',
      people: [
        { name: 'Chloe Park', role: 'Product Mgr', badge: 'C', tone: 'bg-indigo-500/40 text-white' }
      ]
    },
    {
      title: 'Hired',
      people: [
        { name: 'Owen Miller', role: 'DevOps Lead', badge: 'O', tone: 'bg-emerald-500/40 text-white' }
      ]
    }
  ],
  crmStages: [
    { label: 'Leads', count: '148', color: 'text-white' },
    { label: 'Qualified', count: '64', color: 'text-cyan-300' },
    { label: 'Proposal', count: '29', color: 'text-indigo-300' },
    { label: 'Negotiate', count: '12', color: 'text-amber-300' },
    { label: 'Closed Won', count: '19', color: 'text-emerald-400' }
  ],
  tickets: [
    { id: '#4092', customer: 'Acme Corp', priority: 'High', status: 'Open' },
    { id: '#4091', customer: 'Nova Labs', priority: 'Medium', status: 'Pending' },
    { id: '#4089', customer: 'Vertex AI', priority: 'Low', status: 'Resolved' },
    { id: '#4085', customer: 'Kinetix', priority: 'High', status: 'Open' }
  ],
  calendarBlocks: [
    { label: 'LinkedIn Product Launch', cls: 'bg-indigo-600/35 border border-indigo-400/40 text-indigo-200' },
    { label: 'X Thread: AI Workflows', cls: 'bg-cyan-600/30 border border-cyan-400/40 text-cyan-200' },
    { label: 'Instagram Reel Batch', cls: 'bg-purple-600/35 border border-purple-400/40 text-purple-200' }
  ],
  upcomingPosts: [
    { platform: 'LinkedIn', time: '10:00 AM', color: 'text-cyan-300' },
    { platform: 'X / Twitter', time: '02:30 PM', color: 'text-indigo-300' },
    { platform: 'Instagram', time: '06:00 PM', color: 'text-purple-300' }
  ],
  orders: [
    { id: '#ORD-901', customer: 'Liam Carter', items: 'Pro Suite x1', total: '$249.00', status: 'Shipped' },
    { id: '#ORD-900', customer: 'Aria Brooks', items: 'Starter Kit x2', total: '$158.00', status: 'Processing' },
    { id: '#ORD-899', customer: 'Noah Patel', items: 'Enterprise x1', total: '$590.00', status: 'Delivered' }
  ],
  auraMessages: [
    { sender: 'You', text: 'Show pending customer escalations & pipeline risk.', isUser: true },
    { sender: 'Aura', text: '2 high-priority tickets (#4092, #4085) are active; Q3 revenue is pacing +18%.', isUser: false }
  ],
  quickActions: [
    { icon: '📅', label: 'Schedule Meeting' },
    { icon: '📊', label: 'Generate Report' },
    { icon: '📈', label: 'Analyze Pipeline' },
    { icon: '✉️', label: 'Draft Email' }
  ]
};

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();
    return { ...cloneDefaults(), ...JSON.parse(raw) };
  } catch {
    return cloneDefaults();
  }
}

let state = loadState();
const chartInstances = {};

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

function priorityColor(priority) {
  if (priority === 'High') return 'text-rose-400';
  if (priority === 'Medium') return 'text-amber-300';
  return 'text-emerald-400';
}

function ticketStatusBadge(status) {
  if (status === 'Open') return 'bg-amber-500/20 text-amber-300';
  if (status === 'Pending') return 'bg-cyan-500/20 text-cyan-300';
  return 'bg-emerald-500/20 text-emerald-300';
}

function orderStatusBadge(status) {
  if (status === 'Shipped' || status === 'Delivered') return 'bg-emerald-500/20 text-emerald-300';
  return 'bg-indigo-500/20 text-indigo-300';
}

function applyTabFocus(tabName) {
  state.activeTab = tabName;
  saveState();

  document.querySelectorAll('#topNav .nav-btn').forEach(btn => {
    const isCurrent = btn.getAttribute('data-tab') === tabName;
    btn.className = isCurrent
      ? 'nav-btn nav-btn-active px-3 py-1 rounded-md'
      : 'nav-btn px-2.5 py-1 rounded-md text-slate-400 hover:text-white';
  });

  const viewLabel = document.getElementById('activeViewLabel');
  if (viewLabel) viewLabel.textContent = `View: ${tabName}`;

  const moduleMap = {
    Hiring: 'mod-Hiring',
    CRM: 'mod-CRM',
    Support: 'mod-Support',
    Analytics: 'mod-Analytics',
    Social: 'mod-Social',
    Storefront: 'mod-Storefront'
  };

  const targetId = moduleMap[tabName] || null;
  document.querySelectorAll('.module-card').forEach(card => {
    card.classList.remove('module-focused', 'module-dimmed');
    if (targetId) {
      if (card.id === targetId) {
        card.classList.add('module-focused');
      } else {
        card.classList.add('module-dimmed');
      }
    }
  });
}

function renderHiringPipeline() {
  const container = document.getElementById('hiringStagesGrid');
  container.innerHTML = state.hiringStages.map(stage => `
    <div class="min-w-0">
      <p class="stage-heading text-slate-400 font-semibold mb-1 truncate">${stage.title}</p>
      <div class="space-y-1">
        ${stage.people.map(person => `
          <div class="sub-box rounded-lg p-1">
            <div class="flex items-center gap-1 min-w-0">
              <span class="w-3.5 h-3.5 rounded-full ${person.tone} text-[8px] font-bold flex items-center justify-center shrink-0">${person.badge}</span>
              <span class="font-semibold text-white text-[8.5px] truncate">${person.name}</span>
            </div>
            <p class="text-[8px] text-slate-400 truncate mt-0.5">${person.role}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderCrmCounters() {
  const container = document.getElementById('crmStageCounters');
  container.innerHTML = state.crmStages.map(item => `
    <div class="sub-box rounded-lg p-1 min-w-0">
      <p class="text-[8px] text-slate-400 truncate">${item.label}</p>
      <p class="text-[11px] font-bold ${item.color}">${item.count}</p>
    </div>
  `).join('');
}

function renderTickets(query = '') {
  const tbody = document.getElementById('ticketsTableBody');
  const q = query.trim().toLowerCase();

  const rows = state.tickets
    .map((t, idx) => ({ ...t, _idx: idx }))
    .filter(t =>
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q) ||
      t.priority.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    );

  tbody.innerHTML = rows.length ? rows.map(t => `
    <tr>
      <td class="py-1 pr-1 font-semibold ${priorityColor(t.priority)} whitespace-nowrap">${t.id}</td>
      <td class="py-1 pr-1 text-slate-200 truncate max-w-[72px]">${t.customer}</td>
      <td class="py-1 pr-1 whitespace-nowrap"><span class="px-1.5 py-0.5 rounded ${ticketStatusBadge(t.status)} text-[8px]">${t.status}</span></td>
      <td class="py-1 text-right whitespace-nowrap">
        <button type="button" onclick="openEditTicket(${t._idx})" class="row-action-btn bg-indigo-500/25 hover:bg-indigo-500/40 text-indigo-200 mr-0.5">Edit</button>
        <button type="button" onclick="deleteTicket(${t._idx})" class="row-action-btn bg-rose-500/25 hover:bg-rose-500/40 text-rose-300">Del</button>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="4" class="py-3 text-center text-slate-500">No tickets found</td></tr>`;
}

function renderSocialScheduler() {
  document.getElementById('calendarBlocks').innerHTML = state.calendarBlocks.map(block => `
    <div class="h-4 rounded ${block.cls} px-2 flex items-center truncate">${block.label}</div>
  `).join('');

  document.getElementById('upcomingPostsList').innerHTML = `
    <p class="text-slate-400 font-semibold">Upcoming Posts</p>
    ${state.upcomingPosts.map(post => `
      <div class="flex justify-between text-slate-200">
        <span>${post.platform}</span>
        <span class="${post.color}">${post.time}</span>
      </div>
    `).join('')}
  `;
}

function renderOrders(query = '') {
  const tbody = document.getElementById('ordersTableBody');
  const q = query.trim().toLowerCase();

  const rows = state.orders
    .map((o, idx) => ({ ...o, _idx: idx }))
    .filter(o =>
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.total.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );

  tbody.innerHTML = rows.length ? rows.map(ord => `
    <tr>
      <td class="py-1 pr-1 text-cyan-300 font-semibold whitespace-nowrap">${ord.id}</td>
      <td class="py-1 pr-1 text-white truncate max-w-[68px]">${ord.customer}</td>
      <td class="py-1 pr-1 text-slate-200 whitespace-nowrap">${ord.total}</td>
      <td class="py-1 pr-1 whitespace-nowrap"><span class="px-1.5 py-0.5 rounded ${orderStatusBadge(ord.status)} text-[8px]">${ord.status}</span></td>
      <td class="py-1 text-right whitespace-nowrap">
        <button type="button" onclick="openEditOrder(${ord._idx})" class="row-action-btn bg-indigo-500/25 hover:bg-indigo-500/40 text-indigo-200 mr-0.5">Edit</button>
        <button type="button" onclick="deleteOrder(${ord._idx})" class="row-action-btn bg-rose-500/25 hover:bg-rose-500/40 text-rose-300">Del</button>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="5" class="py-3 text-center text-slate-500">No orders found</td></tr>`;
}

function renderAuraFeed() {
  const feed = document.getElementById('auraConversation');
  feed.innerHTML = state.auraMessages.map(msg => {
    const boxCls = msg.isUser
      ? 'bg-slate-950/65 border-white/10 text-slate-200'
      : 'bg-indigo-950/75 border-indigo-300/25 text-slate-100';
    const nameCls = msg.isUser ? 'text-cyan-300' : 'text-indigo-300';
    return `
      <div class="p-2 rounded-lg border ${boxCls}">
        <span class="font-bold ${nameCls} block mb-0.5">${msg.sender}</span>
        ${msg.text}
      </div>
    `;
  }).join('');
  feed.scrollTop = feed.scrollHeight;
}

function appendAuraMessage(sender, text, isUser = false) {
  state.auraMessages.push({ sender, text, isUser });
  if (state.auraMessages.length > 20) {
    state.auraMessages = state.auraMessages.slice(-20);
  }
  saveState();
  renderAuraFeed();
}

function renderQuickActions() {
  const actionsContainer = document.getElementById('quickActionsGrid');
  actionsContainer.innerHTML = state.quickActions.map(act => `
    <button type="button" data-action="${act.label}" class="quick-act-btn p-2 rounded-lg bg-slate-950/60 hover:bg-slate-950/85 border border-white/15 text-left text-white font-semibold transition truncate">
      ${act.icon} ${act.label}
    </button>
  `).join('');

  actionsContainer.querySelectorAll('.quick-act-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const actionLabel = btn.getAttribute('data-action');
      appendAuraMessage('You', actionLabel, true);
      appendAuraMessage('Aura', `${actionLabel} completed and logged in workspace.`, false);
    });
  });
}

function openAddTicketModal() {
  document.getElementById('ticketModalTitle').textContent = 'Add Support Ticket';
  document.getElementById('ticketEditIndex').value = '-1';
  document.getElementById('ticketCustomerInput').value = '';
  document.getElementById('ticketPriorityInput').value = 'Medium';
  document.getElementById('ticketStatusInput').value = 'Open';
  document.getElementById('ticketModal').classList.remove('hidden');
}

function openEditTicket(index) {
  const t = state.tickets[index];
  if (!t) return;
  document.getElementById('ticketModalTitle').textContent = `Edit Ticket ${t.id}`;
  document.getElementById('ticketEditIndex').value = String(index);
  document.getElementById('ticketCustomerInput').value = t.customer;
  document.getElementById('ticketPriorityInput').value = t.priority;
  document.getElementById('ticketStatusInput').value = t.status;
  document.getElementById('ticketModal').classList.remove('hidden');
}

function deleteTicket(index) {
  state.tickets.splice(index, 1);
  saveState();
  renderTickets(document.getElementById('globalSearch').value);
}

function openEditOrder(index) {
  const ord = state.orders[index];
  if (!ord) return;
  document.getElementById('orderEditIndex').value = String(index);
  document.getElementById('orderCustomerInput').value = ord.customer;
  document.getElementById('orderTotalInput').value = ord.total;
  document.getElementById('orderStatusInput').value = ord.status;
  document.getElementById('orderModal').classList.remove('hidden');
}

function deleteOrder(index) {
  state.orders.splice(index, 1);
  saveState();
  renderOrders(document.getElementById('globalSearch').value);
}

function mountChart(key, canvasId, config) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (chartInstances[key]) {
    chartInstances[key].destroy();
  }
  chartInstances[key] = new Chart(canvas.getContext('2d'), config);
}

function initCharts() {
  if (typeof Chart === 'undefined') return;

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    plugins: { legend: { display: false } }
  };

  mountChart('hiringTrend', 'hiringTrendChart', {
    type: 'line',
    data: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      datasets: [{
        data: [18, 25, 22, 33, 40, 48],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      }]
    },
    options: { ...baseOpts, scales: { x: { display: false }, y: { display: false } } }
  });

  mountChart('crmGoal', 'crmGoalGauge', {
    type: 'doughnut',
    data: {
      labels: ['Achieved', 'Remaining'],
      datasets: [{
        data: [76, 24],
        backgroundColor: ['#22d3ee', '#1e293b'],
        borderWidth: 0,
        cutout: '72%'
      }]
    },
    options: baseOpts
  });

  mountChart('crmDeals', 'crmDealsBar', {
    type: 'bar',
    data: {
      labels: ['L', 'Q', 'P', 'N', 'W'],
      datasets: [{
        data: [45, 32, 24, 15, 19],
        backgroundColor: ['#6366f1', '#38bdf8', '#a855f7', '#f59e0b', '#10b981'],
        borderRadius: 4
      }]
    },
    options: {
      ...baseOpts,
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 8 } }, grid: { display: false } },
        y: { display: false }
      }
    }
  });

  mountChart('ticketsCat', 'ticketsCategoryChart', {
    type: 'doughnut',
    data: {
      labels: ['Billing', 'Tech', 'Onboarding', 'Other'],
      datasets: [{
        data: [38, 29, 21, 12],
        backgroundColor: ['#38bdf8', '#818cf8', '#10b981', '#f59e0b'],
        borderWidth: 0,
        cutout: '68%'
      }]
    },
    options: baseOpts
  });

  const waveVals = [35, 62, 82, 46, 92, 70, 52, 86, 42, 66, 95, 56, 76, 46, 88, 62, 48, 78, 52, 82, 66, 44, 72, 58, 84, 49, 68, 42];
  mountChart('voiceWave', 'voiceWaveformChart', {
    type: 'bar',
    data: {
      labels: waveVals.map((_, i) => String(i + 1)),
      datasets: [{
        data: waveVals,
        backgroundColor: waveVals.map((_, i) => (i % 2 === 0 ? '#22d3ee' : '#818cf8')),
        borderRadius: 2
      }]
    },
    options: { ...baseOpts, scales: { x: { display: false }, y: { display: false } } }
  });

  mountChart('callTrend', 'callScoreTrend', {
    type: 'line',
    data: {
      labels: ['M', 'T', 'W', 'T', 'F'],
      datasets: [{
        data: [7.8, 8.1, 8.0, 8.4, 8.5],
        borderColor: '#34d399',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35
      }]
    },
    options: { ...baseOpts, scales: { x: { display: false }, y: { display: false } } }
  });

  mountChart('socialBars', 'socialEngagementChart', {
    type: 'bar',
    data: {
      labels: ['LI', 'X', 'IG', 'YT'],
      datasets: [{
        data: [64, 82, 71, 53],
        backgroundColor: ['#38bdf8', '#818cf8', '#c084fc', '#34d399'],
        borderRadius: 4
      }]
    },
    options: {
      ...baseOpts,
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 8 } }, grid: { display: false } },
        y: { display: false }
      }
    }
  });

  mountChart('ordersLine', 'ordersRevenueChart', {
    type: 'line',
    data: {
      labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'],
      datasets: [{
        data: [120, 145, 138, 175, 162, 198, 214],
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.14)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      }]
    },
    options: { ...baseOpts, scales: { x: { display: false }, y: { display: false } } }
  });
}

function bindEvents() {
  document.querySelectorAll('#topNav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTabFocus(btn.getAttribute('data-tab'));
    });
  });

  document.getElementById('globalSearch').addEventListener('input', e => {
    const q = e.target.value;
    renderTickets(q);
    renderOrders(q);
  });

  const dataModal = document.getElementById('dataViewModal');
  document.getElementById('showDataModalBtn').addEventListener('click', () => {
    document.getElementById('dataJsonPreview').textContent = JSON.stringify({
      tickets: state.tickets,
      orders: state.orders,
      activeTab: state.activeTab
    }, null, 2);
    dataModal.classList.remove('hidden');
  });
  document.getElementById('closeDataModalBtn').addEventListener('click', () => dataModal.classList.add('hidden'));
  document.getElementById('copyJsonBtn').addEventListener('click', () => {
    navigator.clipboard?.writeText(document.getElementById('dataJsonPreview').textContent || '');
  });

  document.getElementById('resetStorageBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    state = cloneDefaults();
    saveState();
    renderTickets();
    renderOrders();
    renderAuraFeed();
    applyTabFocus(state.activeTab);
  });

  const ticketModal = document.getElementById('ticketModal');
  document.getElementById('openAddModalBtn').addEventListener('click', openAddTicketModal);
  document.getElementById('closeTicketModalBtn').addEventListener('click', () => ticketModal.classList.add('hidden'));
  document.getElementById('cancelTicketModalBtn').addEventListener('click', () => ticketModal.classList.add('hidden'));

  document.getElementById('ticketForm').addEventListener('submit', e => {
    e.preventDefault();
    const editIdx = Number(document.getElementById('ticketEditIndex').value);
    const customer = document.getElementById('ticketCustomerInput').value.trim();
    const priority = document.getElementById('ticketPriorityInput').value;
    const status = document.getElementById('ticketStatusInput').value;

    if (editIdx >= 0 && state.tickets[editIdx]) {
      state.tickets[editIdx] = { ...state.tickets[editIdx], customer, priority, status };
    } else {
      const id = '#' + Math.floor(4093 + Math.random() * 90);
      state.tickets.unshift({ id, customer, priority, status });
    }

    saveState();
    renderTickets(document.getElementById('globalSearch').value);
    ticketModal.classList.add('hidden');
  });

  const orderModal = document.getElementById('orderModal');
  document.getElementById('closeOrderModalBtn').addEventListener('click', () => orderModal.classList.add('hidden'));
  document.getElementById('cancelOrderModalBtn').addEventListener('click', () => orderModal.classList.add('hidden'));

  document.getElementById('orderForm').addEventListener('submit', e => {
    e.preventDefault();
    const idx = Number(document.getElementById('orderEditIndex').value);
    if (idx < 0 || !state.orders[idx]) return;

    state.orders[idx] = {
      ...state.orders[idx],
      customer: document.getElementById('orderCustomerInput').value.trim(),
      total: document.getElementById('orderTotalInput').value.trim(),
      status: document.getElementById('orderStatusInput').value
    };

    saveState();
    renderOrders(document.getElementById('globalSearch').value);
    orderModal.classList.add('hidden');
  });

  document.getElementById('auraForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('auraInput');
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    appendAuraMessage('You', val, true);
    appendAuraMessage('Aura', `Pipeline is at $2.4M with ${state.tickets.length} tracked tickets and ${state.orders.length} orders.`, false);
  });

  document.getElementById('auraChatTab').addEventListener('click', () => {
    document.getElementById('auraChatTab').className = 'py-1 rounded-md bg-white/15 text-white';
    document.getElementById('auraInsightsTab').className = 'py-1 rounded-md text-slate-300 hover:text-white';
  });

  document.getElementById('auraInsightsTab').addEventListener('click', () => {
    document.getElementById('auraInsightsTab').className = 'py-1 rounded-md bg-white/15 text-white';
    document.getElementById('auraChatTab').className = 'py-1 rounded-md text-slate-300 hover:text-white';
    appendAuraMessage('Aura', 'Top insight: High-priority tickets respond 28% faster when assigned before noon.', false);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderHiringPipeline();
  renderCrmCounters();
  renderTickets();
  renderSocialScheduler();
  renderOrders();
  renderAuraFeed();
  renderQuickActions();
  bindEvents();
  initCharts();
  applyTabFocus(state.activeTab || 'Dashboard');
});