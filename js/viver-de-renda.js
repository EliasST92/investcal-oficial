// Viver de Renda Calculator

const FII_PRESETS = [
  { name: "Conservador", yield: 0.65, description: "Fundos de tijolo tradicionais" },
  { name: "Moderado", yield: 0.80, description: "Mix de tijolo e papel" },
  { name: "Agressivo", yield: 1.00, description: "Fundos de papel e high yield" },
];

const ETF_PRESETS = [
  { name: "SCHD", yield: 0.30, description: "Dividend Growth ETF" },
  { name: "JEPI", yield: 0.65, description: "JP Morgan Equity Premium" },
  { name: "JEPQ", yield: 0.75, description: "JP Morgan Nasdaq Premium" },
  { name: "QYLD", yield: 0.90, description: "Covered Call ETF" },
];

// State
let state = {
  desiredIncome: 5000,
  fiiYield: 0.80,
  etfYield: 0.65,
  usdRate: 5.00,
  activeTab: 'fii',
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();
  updateActiveNav('../index.html');
  
  // Input listeners
  document.getElementById('income').addEventListener('input', (e) => {
    state.desiredIncome = parseCurrencyInput(e.target.value);
    updateCalculations();
  });

  document.getElementById('usd').addEventListener('input', (e) => {
    state.usdRate = parseCurrencyInput(e.target.value);
    updateCalculations();
  });

  // FII Slider
  document.getElementById('fiiSlider').addEventListener('input', (e) => {
    state.fiiYield = parseFloat(e.target.value);
    updateFiiDisplay();
  });

  // ETF Slider
  document.getElementById('etfSlider').addEventListener('input', (e) => {
    state.etfYield = parseFloat(e.target.value);
    updateEtfDisplay();
  });

  // Tab buttons
  document.querySelectorAll('.tab-button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      switchTab(tab);
    });
  });

  // Preset buttons
  document.querySelectorAll('.fii-preset').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const yield_ = parseFloat(e.target.dataset.yield);
      state.fiiYield = yield_;
      updateFiiPresets();
      updateFiiDisplay();
    });
  });

  document.querySelectorAll('.etf-preset').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const yield_ = parseFloat(e.target.dataset.yield);
      state.etfYield = yield_;
      updateEtfPresets();
      updateEtfDisplay();
    });
  });

  // Initialize display
  updateCalculations();
});

function updateCalculations() {
  updateFiiDisplay();
  updateEtfDisplay();
}

function updateFiiDisplay() {
  const income = state.desiredIncome;
  const yield_ = state.fiiYield;
  const required = income > 0 && yield_ > 0 ? income / (yield_ / 100) : 0;

  document.getElementById('fiiYieldDisplay').textContent = `${state.fiiYield.toFixed(2)}%`;
  document.getElementById('fiiSlider').value = state.fiiYield;

  document.getElementById('fiiRequired').textContent = formatCurrency(required);
  document.getElementById('fiiAnnualYield').textContent = `${(yield_ * 12).toFixed(2)}%`;
  document.getElementById('fiiAnnualIncome').textContent = formatCurrency(income * 12);
  document.getElementById('fiiIncomeDisplay').textContent = formatCurrency(income);

  updateFiiPresets();
}

function updateEtfDisplay() {
  const income = state.desiredIncome;
  const yield_ = state.etfYield;
  const usd = state.usdRate;
  const incomeInUsd = income / (usd || 5);
  const required = incomeInUsd > 0 && yield_ > 0 ? incomeInUsd / (yield_ / 100) : 0;

  document.getElementById('etfYieldDisplay').textContent = `${state.etfYield.toFixed(2)}%`;
  document.getElementById('etfSlider').value = state.etfYield;

  document.getElementById('etfRequired').textContent = formatCurrency(required, 'USD');
  document.getElementById('etfRequiredBrl').textContent = formatCurrency(required * usd, 'BRL');
  document.getElementById('etfAnnualYield').textContent = `${(yield_ * 12).toFixed(2)}%`;
  document.getElementById('etfIncomeUsd').textContent = formatCurrency(incomeInUsd, 'USD');
  document.getElementById('etfAnnualIncome').textContent = formatCurrency(income * 12);
  document.getElementById('etfIncomeDisplay').textContent = formatCurrency(income);

  updateEtfPresets();
}

function updateFiiPresets() {
  document.querySelectorAll('.fii-preset').forEach((btn) => {
    btn.classList.remove('active');
    if (parseFloat(btn.dataset.yield) === state.fiiYield) {
      btn.classList.add('active');
    }
  });
}

function updateEtfPresets() {
  document.querySelectorAll('.etf-preset').forEach((btn) => {
    btn.classList.remove('active');
    if (parseFloat(btn.dataset.yield) === state.etfYield) {
      btn.classList.add('active');
    }
  });
}

function switchTab(tab) {
  state.activeTab = tab;
  
  // Update tab buttons
  document.querySelectorAll('.tab-button').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tab) {
      btn.classList.add('active');
    }
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
    if (content.id === `${tab}-tab`) {
      content.classList.add('active');
    }
  });
}

// Update navigation
function updateActiveNav(page) {
  document.querySelectorAll('nav a').forEach((link) => {
    link.classList.remove('active');
  });
  const currentLink = document.querySelector(`nav a[href*="viver"]`);
  if (currentLink) {
    currentLink.classList.add('active');
  }
}
