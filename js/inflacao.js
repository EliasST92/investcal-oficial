// Inflação Converter

const IPCA_DATA = {
  2000: 5.97, 2001: 7.67, 2002: 12.53, 2003: 9.30, 2004: 7.60, 2005: 5.69,
  2006: 3.14, 2007: 4.46, 2008: 5.90, 2009: 4.31, 2010: 5.91, 2011: 6.50,
  2012: 5.84, 2013: 5.91, 2014: 6.41, 2015: 10.67, 2016: 6.29, 2017: 2.95,
  2018: 3.75, 2019: 4.31, 2020: 4.52, 2021: 10.06, 2022: 5.79, 2023: 4.62,
  2024: 4.83,
};

const currentYear = new Date().getFullYear();
const years = Object.keys(IPCA_DATA).map(y => parseInt(y)).sort((a, b) => a - b);

let state = {
  amount: 1000,
  startYear: 2010,
  endYear: currentYear,
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();

  // Populate year selects
  const startYearSelect = document.getElementById('startYear');
  const endYearSelect = document.getElementById('endYear');

  years.forEach(year => {
    const opt1 = document.createElement('option');
    opt1.value = year;
    opt1.textContent = year;
    if (year === 2010) opt1.selected = true;
    startYearSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = year;
    opt2.textContent = year;
    if (year === currentYear) opt2.selected = true;
    endYearSelect.appendChild(opt2);
  });

  // Input listeners
  document.getElementById('amount').addEventListener('input', (e) => {
    state.amount = parseCurrencyInput(e.target.value);
    updateCalculations();
  });

  startYearSelect.addEventListener('change', (e) => {
    state.startYear = parseInt(e.target.value);
    updateCalculations();
  });

  endYearSelect.addEventListener('change', (e) => {
    state.endYear = parseInt(e.target.value);
    updateCalculations();
  });

  document.getElementById('copyButton').addEventListener('click', () => {
    const result = document.getElementById('finalValue').textContent;
    navigator.clipboard.writeText(result);
    const btn = document.getElementById('copyButton');
    btn.textContent = 'Copiado!';
    setTimeout(() => {
      btn.textContent = 'Copiar Resultado';
    }, 2000);
  });

  updateCalculations();
});

function calculateInflation(amount, startYear, endYear) {
  if (startYear >= endYear) {
    return { inflated: amount, inflation: 0, chart: [] };
  }

  let accumulated = 1;
  const chart = [];

  for (let year = startYear; year <= endYear; year++) {
    if (year in IPCA_DATA) {
      accumulated *= 1 + (IPCA_DATA[year] / 100);
      chart.push({
        year: year,
        value: amount * accumulated,
        inflation: ((accumulated - 1) * 100).toFixed(2),
      });
    }
  }

  return {
    inflated: amount * accumulated,
    inflation: ((accumulated - 1) * 100),
    chart: chart,
  };
}

function updateCalculations() {
  const result = calculateInflation(state.amount, state.startYear, state.endYear);

  document.getElementById('finalValue').textContent = formatCurrency(result.inflated);
  document.getElementById('inflationPercent').textContent = result.inflation.toFixed(2);
  document.getElementById('difference').textContent = formatCurrency(result.inflated - state.amount);

  // Update chart
  updateChart(result.chart);
}

function updateChart(data) {
  const container = document.getElementById('chart-container');
  if (data.length === 0) {
    container.innerHTML = '';
    return;
  }

  const width = container.offsetWidth;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 70 };
  
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find max value
  let maxValue = Math.max(...data.map(d => d.value));
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

  // Bars
  data.forEach((d, i) => {
    const x = padding.left + i * xScale;
    const barWidth = (chartWidth / data.length) * 0.8;
    const barHeight = d.value * yScale;
    const y = padding.top + chartHeight - barHeight;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - barWidth / 2);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', 'var(--primary)');
    rect.setAttribute('opacity', '0.7');
    svg.appendChild(rect);

    // X label every 2 years
    if (i % Math.max(1, Math.floor(data.length / 6)) === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', padding.top + chartHeight + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '11');
      text.setAttribute('fill', 'var(--muted-foreground)');
      text.textContent = d.year;
      svg.appendChild(text);
    }
  });

  // Y axis labels
  for (let i = 0; i <= 4; i++) {
    const value = maxValue * (i / 4);
    const y = padding.top + chartHeight - (value * yScale);
    
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

  container.innerHTML = '';
  container.appendChild(svg);
}
