// Bola de Neve Simulator

const ETF_PRESETS = [
  { name: "JEPI", dividendYield: 7.8, appreciation: 3.0, description: "JP Morgan Equity Premium Income" },
  { name: "SCHD", dividendYield: 3.5, appreciation: 8.0, description: "Schwab US Dividend Equity" },
  { name: "FIIs Brasil", dividendYield: 9.6, appreciation: 2.0, description: "Média dos Fundos Imobiliários" },
  { name: "Personalizado", dividendYield: 6.0, appreciation: 5.0, description: "Configure seu próprio cenário" },
];

let state = {
  initialInvestment: 10000,
  monthlyContribution: 1000,
  years: 20,
  selectedPreset: 'JEPI',
  dividendYield: 7.8,
  appreciation: 3.0,
  showComparison: true,
  data: [],
};

// Simple SVG Chart
function createChart(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.offsetWidth;
  const height = 350;
  const padding = { top: 20, right: 20, bottom: 40, left: 70 };
  
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find max value
  let maxValue = 0;
  data.forEach(d => {
    if (d.withReinvestment > maxValue) maxValue = d.withReinvestment;
    if (state.showComparison && d.withoutReinvestment > maxValue) {
      maxValue = d.withoutReinvestment;
    }
  });

  const yScale = chartHeight / maxValue;
  const xScale = chartWidth / (data.length - 1 || 1);

  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.style.cssText = 'width: 100%; height: auto;';

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', width);
  bg.setAttribute('height', height);
  bg.setAttribute('fill', 'var(--card)');
  svg.appendChild(bg);

  // Grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padding.left);
    line.setAttribute('y1', y);
    line.setAttribute('x2', width - padding.right);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'var(--border)');
    line.setAttribute('stroke-dasharray', '3,3');
    svg.appendChild(line);

    // Y axis labels
    if (i < 5) {
      const value = maxValue * (1 - i / 5);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', padding.left - 10);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('font-size', '11');
      text.setAttribute('fill', 'var(--muted-foreground)');
      text.setAttribute('dominant-baseline', 'middle');
      text.textContent = formatCurrencyShort(value);
      svg.appendChild(text);
    }
  }

  // Without reinvestment area (if shown)
  if (state.showComparison) {
    let pathData = `M ${padding.left} ${padding.top + chartHeight}`;
    data.forEach((d, i) => {
      const x = padding.left + i * xScale;
      const y = padding.top + chartHeight - (d.withoutReinvestment * yScale);
      pathData += ` L ${x} ${y}`;
    });
    pathData += ` L ${width - padding.right} ${padding.top + chartHeight} Z`;

    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', pathData);
    area.setAttribute('fill', 'rgba(107, 157, 217, 0.1)');
    area.setAttribute('stroke', 'rgba(107, 157, 217, 0.5)');
    area.setAttribute('stroke-width', '2');
    svg.appendChild(area);
  }

  // With reinvestment area
  (() => {
    let pathData = `M ${padding.left} ${padding.top + chartHeight}`;
    data.forEach((d, i) => {
      const x = padding.left + i * xScale;
      const y = padding.top + chartHeight - (d.withReinvestment * yScale);
      pathData += ` L ${x} ${y}`;
    });
    pathData += ` L ${width - padding.right} ${padding.top + chartHeight} Z`;

    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', pathData);
    area.setAttribute('fill', 'rgba(51, 45, 29, 0.1)');
    area.setAttribute('stroke', 'var(--primary)');
    area.setAttribute('stroke-width', '2');
    svg.appendChild(area);
  })();

  // X axis
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('y1', padding.top + chartHeight);
  xAxis.setAttribute('x2', width - padding.right);
  xAxis.setAttribute('y2', padding.top + chartHeight);
  xAxis.setAttribute('stroke', 'var(--border)');
  xAxis.setAttribute('stroke-width', '1');
  svg.appendChild(xAxis);

  // X axis labels
  for (let i = 0; i < data.length; i += Math.max(1, Math.floor(data.length / 5))) {
    const d = data[i];
    const x = padding.left + i * xScale;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', padding.top + chartHeight + 20);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', 'var(--muted-foreground)');
    text.textContent = `${d.year}a`;
    svg.appendChild(text);
  }

  // Legend
  const legendY = padding.top + chartHeight + 35;
  
  const reinvestRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  reinvestRect.setAttribute('x', padding.left);
  reinvestRect.setAttribute('y', legendY);
  reinvestRect.setAttribute('width', '12');
  reinvestRect.setAttribute('height', '12');
  reinvestRect.setAttribute('fill', 'var(--primary)');
  svg.appendChild(reinvestRect);

  const reinvestText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  reinvestText.setAttribute('x', padding.left + 20);
  reinvestText.setAttribute('y', legendY + 6);
  reinvestText.setAttribute('font-size', '12');
  reinvestText.setAttribute('fill', 'var(--foreground)');
  reinvestText.textContent = 'Com Reinvestimento';
  svg.appendChild(reinvestText);

  if (state.showComparison) {
    const noReinvestRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    noReinvestRect.setAttribute('x', padding.left + 200);
    noReinvestRect.setAttribute('y', legendY);
    noReinvestRect.setAttribute('width', '12');
    noReinvestRect.setAttribute('height', '12');
    noReinvestRect.setAttribute('fill', 'rgba(107, 157, 217, 0.5)');
    svg.appendChild(noReinvestRect);

    const noReinvestText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    noReinvestText.setAttribute('x', padding.left + 220);
    noReinvestText.setAttribute('y', legendY + 6);
    noReinvestText.setAttribute('font-size', '12');
    noReinvestText.setAttribute('fill', 'var(--foreground)');
    noReinvestText.textContent = 'Sem Reinvestimento';
    svg.appendChild(noReinvestText);
  }

  container.innerHTML = '';
  container.appendChild(svg);
}

// Calculate growth
function calculateGrowth(initialInvestment, monthlyContribution, dividendYield, appreciation, years) {
  const data = [];
  const monthlyDividendRate = (dividendYield / 100) / 12;
  const monthlyAppreciation = (appreciation / 100) / 12;

  let balanceWithReinvest = initialInvestment;
  let balanceWithoutReinvest = initialInvestment;
  let totalInvested = initialInvestment;
  let totalDividends = 0;

  data.push({
    year: 0,
    withReinvestment: initialInvestment,
    withoutReinvestment: initialInvestment,
    totalInvested: initialInvestment,
    dividendsReceived: 0,
  });

  for (let month = 1; month <= years * 12; month++) {
    // Monthly contribution
    totalInvested += monthlyContribution;
    balanceWithReinvest += monthlyContribution;
    balanceWithoutReinvest += monthlyContribution;

    // Appreciation
    balanceWithReinvest *= 1 + monthlyAppreciation;
    balanceWithoutReinvest *= 1 + monthlyAppreciation;

    // Dividends
    const dividendWithReinvest = balanceWithReinvest * monthlyDividendRate;
    const dividendWithoutReinvest = balanceWithoutReinvest * monthlyDividendRate;

    // Reinvest dividends
    balanceWithReinvest += dividendWithReinvest;
    totalDividends += dividendWithoutReinvest;

    // Record yearly data
    if (month % 12 === 0) {
      data.push({
        year: month / 12,
        withReinvestment: Math.round(balanceWithReinvest),
        withoutReinvestment: Math.round(balanceWithoutReinvest),
        totalInvested: Math.round(totalInvested),
        dividendsReceived: Math.round(totalDividends),
      });
    }
  }

  return data;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();

  // Input listeners
  document.getElementById('initial').addEventListener('input', (e) => {
    state.initialInvestment = parseCurrencyInput(e.target.value);
    updateCalculations();
  });

  document.getElementById('monthly').addEventListener('input', (e) => {
    state.monthlyContribution = parseCurrencyInput(e.target.value);
    updateCalculations();
  });

  // Years slider
  document.getElementById('yearsSlider').addEventListener('input', (e) => {
    state.years = parseInt(e.target.value);
    updateCalculations();
  });

  // Dividend yield slider
  document.getElementById('dividendSlider').addEventListener('input', (e) => {
    state.dividendYield = parseFloat(e.target.value);
    state.selectedPreset = 'Personalizado';
    updateCalculations();
  });

  // Appreciation slider
  document.getElementById('appreciationSlider').addEventListener('input', (e) => {
    state.appreciation = parseFloat(e.target.value);
    state.selectedPreset = 'Personalizado';
    updateCalculations();
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const name = e.target.dataset.preset;
      const preset = ETF_PRESETS.find(p => p.name === name);
      if (preset) {
        state.selectedPreset = name;
        state.dividendYield = preset.dividendYield;
        state.appreciation = preset.appreciation;
        updateCalculations();
      }
    });
  });

  // Comparison toggle
  document.getElementById('comparisonToggle').addEventListener('change', (e) => {
    state.showComparison = e.target.checked;
    updateChart();
  });

  updateCalculations();
});

function updateCalculations() {
  state.data = calculateGrowth(
    state.initialInvestment,
    state.monthlyContribution,
    state.dividendYield,
    state.appreciation,
    state.years
  );

  updateDisplay();
  updateChart();
  updatePresets();
}

function updateDisplay() {
  // Years display
  document.getElementById('yearsDisplay').textContent = state.years;
  document.getElementById('yearsSlider').value = state.years;

  // Dividend yield display
  document.getElementById('dividendDisplay').textContent = state.dividendYield.toFixed(1);
  document.getElementById('dividendSlider').value = state.dividendYield;

  // Appreciation display
  document.getElementById('appreciationDisplay').textContent = state.appreciation.toFixed(1);
  document.getElementById('appreciationSlider').value = state.appreciation;

  const final = state.data[state.data.length - 1] || {};
  const finalWithReinvest = final.withReinvestment || 0;
  const finalWithoutReinvest = final.withoutReinvestment || 0;
  const totalInvested = final.totalInvested || 0;
  const snowballEffect = finalWithReinvest - finalWithoutReinvest;
  const monthlyIncome = (finalWithReinvest * (state.dividendYield / 100)) / 12;

  // Results
  document.getElementById('finalPatrimonial').textContent = formatCurrency(finalWithReinvest);
  document.getElementById('totalInvested').textContent = formatCurrency(totalInvested);
  document.getElementById('totalGain').textContent = formatCurrency(finalWithReinvest - totalInvested);
  document.getElementById('snowballEffect').textContent = formatCurrency(snowballEffect);
  document.getElementById('monthlyIncome').textContent = formatCurrency(monthlyIncome);
  document.getElementById('annualIncome').textContent = formatCurrency(monthlyIncome * 12);
  document.getElementById('multiplier').textContent = (finalWithReinvest / totalInvested).toFixed(1);
}

function updateChart() {
  createChart(state.data, 'chart-container');
}

function updatePresets() {
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.preset === state.selectedPreset) {
      btn.classList.add('active');
    }
  });
}
