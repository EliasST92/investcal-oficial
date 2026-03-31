// Utility Functions

// Format currency to BRL
function formatCurrency(value, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format currency for shortened display
function formatCurrencyShort(value) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Parse currency input from user
function parseCurrencyInput(value) {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

// Convert OKLCH color to RGB hex
function oklchToRgb(l, c, h) {
  // Convert OKLCH to linear RGB
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_3 = l_ * l_ * l_;
  const m_3 = m_ * m_ * m_;
  const s_3 = s_ * s_ * s_;

  const r = +4.0767416621 * l_3 - 3.3077363322 * m_3 + 0.2309101289 * s_3;
  const g = -1.2684380046 * l_3 + 2.6097574011 * m_3 - 0.3413193761 * s_3;
  const bb = -0.0041960863 * l_3 - 0.7034186147 * m_3 + 1.7076147010 * s_3;

  const R = Math.max(0, Math.min(1, r)) * 255;
  const G = Math.max(0, Math.min(1, g)) * 255;
  const B = Math.max(0, Math.min(1, bb)) * 255;

  return `rgb(${Math.round(R)}, ${Math.round(G)}, ${Math.round(B)})`;
}

// Update active navigation
function updateActiveNav(page) {
  document.querySelectorAll('nav a').forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
    }
  });
}

// Toggle dark mode
function toggleDarkMode() {
  const html = document.documentElement;
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
}

// Initialize dark mode based on preference
function initDarkMode() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (saved === 'dark' || (saved === null && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
}

// Initialize mobile menu
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav');
  
  if (!menuBtn) return;
  
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('hidden');
  });
  
  // Close menu when clicking on a link
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.add('hidden');
    });
  });
}

// Round number to specified decimal places
function roundTo(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Calculate percentage format
function formatPercent(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatCurrency,
    formatCurrencyShort,
    parseCurrencyInput,
    oklchToRgb,
    updateActiveNav,
    toggleDarkMode,
    initDarkMode,
    initMobileMenu,
    roundTo,
    formatPercent,
  };
}
