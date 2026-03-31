// Preço Médio Calculator

let state = {
  purchases: [],
  nextId: 1,
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();

  // Add initial purchase
  addPurchase();

  document.getElementById('addButton').addEventListener('click', addPurchase);
  document.getElementById('resetButton').addEventListener('click', resetCalculator);
  document.getElementById('copyButton').addEventListener('click', copyResult);
});

function createPurchaseId() {
  return `purchase-${state.nextId++}`;
}

function addPurchase() {
  const id = createPurchaseId();
  const purchase = {
    id: id,
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    price: '',
    fees: '0',
  };
  
  state.purchases.push(purchase);
  renderPurchase(purchase);
  updateCalculations();
}

function renderPurchase(purchase) {
  const container = document.getElementById('purchasesContainer');
  
  const row = document.createElement('div');
  row.id = purchase.id;
  row.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 0.5rem; align-items: center; padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius);';
  
  row.innerHTML = `
    <div>
      <label class="label" style="font-size: 0.75rem; margin-bottom: 0.25rem;">Data</label>
      <input type="date" class="input" value="${purchase.date}" data-field="date" style="font-size: 0.875rem; padding: 0.5rem;">
    </div>
    <div>
      <label class="label" style="font-size: 0.75rem; margin-bottom: 0.25rem;">Quantidade</label>
      <input type="text" class="input" placeholder="100" value="${purchase.quantity}" data-field="quantity" style="font-size: 0.875rem; padding: 0.5rem;">
    </div>
    <div>
      <label class="label" style="font-size: 0.75rem; margin-bottom: 0.25rem;">Preço Unitário</label>
      <div class="input-wrapper">
        <span class="input-prefix">R$</span>
        <input type="text" class="input" placeholder="50,00" value="${purchase.price}" data-field="price" style="font-size: 0.875rem; padding: 0.5rem; padding-left: 2.5rem;">
      </div>
    </div>
    <div>
      <label class="label" style="font-size: 0.75rem; margin-bottom: 0.25rem;">Taxa/Corretagem</label>
      <div class="input-wrapper">
        <span class="input-prefix">R$</span>
        <input type="text" class="input" placeholder="0,00" value="${purchase.fees}" data-field="fees" style="font-size: 0.875rem; padding: 0.5rem; padding-left: 2.5rem;">
      </div>
    </div>
    <button class="btn" onclick="deletePurchase('${purchase.id}')" style="margin-top: auto; padding: 0.5rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  `;

  // Add event listeners to inputs
  row.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const field = e.target.dataset.field;
      const purchaseIndex = state.purchases.findIndex(p => p.id === purchase.id);
      if (purchaseIndex !== -1) {
        state.purchases[purchaseIndex][field] = e.target.value;
        updateCalculations();
      }
    });
  });

  container.appendChild(row);
}

function deletePurchase(id) {
  state.purchases = state.purchases.filter(p => p.id !== id);
  document.getElementById(id).remove();
  updateCalculations();
}

function resetCalculator() {
  state.purchases = [];
  state.nextId = 1;
  document.getElementById('purchasesContainer').innerHTML = '';
  addPurchase();
  updateCalculations();
}

function calculateAveragePrice() {
  let totalQuantity = 0;
  let totalCost = 0;

  state.purchases.forEach(purchase => {
    const quantity = parseFloat(purchase.quantity) || 0;
    const price = parseCurrencyInput(purchase.price);
    const fees = parseCurrencyInput(purchase.fees);

    const cost = (quantity * price) + fees;
    totalQuantity += quantity;
    totalCost += cost;
  });

  if (totalQuantity === 0) {
    return {
      averagePrice: 0,
      totalQuantity: 0,
      totalCost: 0,
      totalFees: 0,
    };
  }

  const totalFees = state.purchases.reduce((sum, p) => sum + parseCurrencyInput(p.fees), 0);

  return {
    averagePrice: totalCost / totalQuantity,
    totalQuantity: totalQuantity,
    totalCost: totalCost,
    totalFees: totalFees,
  };
}

function updateCalculations() {
  const result = calculateAveragePrice();

  if (result.totalQuantity === 0) {
    document.getElementById('averagePrice').textContent = 'R$ 0,00';
    document.getElementById('totalQuantity').textContent = '0';
    document.getElementById('totalCost').textContent = 'R$ 0,00';
    document.getElementById('totalFees').textContent = 'R$ 0,00';
    document.getElementById('copyButton').disabled = true;
    return;
  }

  document.getElementById('averagePrice').textContent = formatCurrency(result.averagePrice);
  document.getElementById('totalQuantity').textContent = result.totalQuantity.toFixed(2).replace('.00', '').replace('.', ',');
  document.getElementById('totalCost').textContent = formatCurrency(result.totalCost);
  document.getElementById('totalFees').textContent = formatCurrency(result.totalFees);
  document.getElementById('copyButton').disabled = false;
}

function copyResult() {
  const result = calculateAveragePrice();
  const text = `Preço Médio: ${formatCurrency(result.averagePrice)}\nQuantidade: ${result.totalQuantity}\nCusto Total: ${formatCurrency(result.totalCost)}`;
  navigator.clipboard.writeText(text);
  
  const btn = document.getElementById('copyButton');
  btn.textContent = 'Copiado!';
  setTimeout(() => {
    btn.textContent = 'Copiar Resultado';
  }, 2000);
}
