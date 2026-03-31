# InvestCalc - Calculadoras de Investimento Financeiro

Um site estático com ferramentas gratuitas para investidores planejar sua independência financeira.

## 📁 Estrutura do Projeto

```
InvestCalc-oficial/
├── index.html                 # Página inicial
├── css/
│   └── styles.css            # Estilos CSS global
├── js/
│   ├── utils.js              # Funções utilitárias
│   ├── viver-de-renda.js     # Lógica da calculadora Viver de Renda
│   ├── bola-de-neve.js       # Lógica do simulador Bola de Neve
│   ├── inflacao.js           # Lógica do conversor de Inflação
│   └── preco-medio.js        # Lógica da calculadora de Preço Médio
└── pages/
    ├── viver-de-renda.html   # Página Viver de Renda
    ├── bola-de-neve.html     # Página Bola de Neve
    ├── inflacao.html         # Página Conversor de Inflação
    └── preco-medio.html      # Página Calculadora de Preço Médio
```

## 🚀 Como Usar

1. **Abrir o site localmente**
   - Abra o arquivo `index.html` em seu navegador
   - Ou sirva a pasta com um servidor HTTP (ex: `python -m http.server`)

2. **Navegar entre calculadoras**
   - Use o menu no topo da página para acessar as diferentes ferramentas
   - Ou clique nos cards na página inicial

## 🧮 Calculadoras Disponíveis

### 1. **Viver de Renda**
Calcule quanto você precisa investir em FIIs ou ETFs para obter uma renda mensal desejada.
- Simule diferentes yields de FIIs brasileiros
- Compare com ETFs americanos (SCHD, JEPI, JEPQ, QYLD)
- Ajuste o preço do dólar

### 2. **Bola de Neve**
Visualize o poder dos juros compostos e reinvestimento de dividendos.
- Configure aporte inicial e mensal
- Escolha entre cenários pré-definidos ou personalizados
- Veja a evolução do seu patrimônio em 40 anos
- Gráfico interativo mostrando a diferença entre reinvestimento

### 3. **Conversor de Inflação**
Saiba quanto um valor de anos passados vale hoje usando o IPCA.
- Dados de inflação de 2000 até 2024
- Gráfico da evolução do valor
- Copie o resultado para compartilhar

### 4. **Preço Médio**
Calcule seu preço médio de compra para declaração de IR.
- Adicione múltiplas compras
- Inclua taxas de corretagem
- Resultado pronto para usar na IR

## 💻 Recursos Técnicos

- **HTML5** - Semântico e responsivo
- **CSS3** - Sem dependências, sistema de cores OKLCH
- **JavaScript Vanilla** - Zero frameworks, rápido e leve
- **Tema Claro/Escuro** - Suporte a preferência do SO
- **Responsivo** - Funciona em mobile, tablet e desktop
- **Offline** - Funciona completamente offline (sem conexão)

## 🎨 Personalização

### Mudar Cores
Edite as variáveis CSS em `css/styles.css`:
```css
:root {
  --primary: #332d1d;
  --primary-foreground: #fcfbf8;
  /* ... outras cores ... */
}
```

### Mudar Dados
- **IPCA**: Edite `IPCA_DATA` em `js/inflacao.js`
- **ETF Presets**: Edite `ETF_PRESETS` em `js/bola-de-neve.js`
- **FII Presets**: Edite `FII_PRESETS` em `js/viver-de-renda.js`

## 📱 Compatibilidade

- ✅ Chrome/Edge (88+)
- ✅ Firefox (78+)
- ✅ Safari (14+)
- ✅ Mobile browsers

## 🔧 Desenvolvimento

Para adicionar uma nova calculadora:

1. Crie um arquivo JavaScript em `js/nova-calculadora.js`
2. Crie um arquivo HTML em `pages/nova-calculadora.html`
3. Use as funções utilitárias de `js/utils.js`
4. Adicione o link no menu do `index.html` e na navegação

## 📄 Licença

Este projeto é de código aberto. Sinta-se livre para usar, modificar e distribuir.

## ⚠️ Aviso

As calculadoras são apenas para fins informativos e educacionais. Não constituem aconselhamento financeiro. Consulte um profissional antes de tomar decisões de investimento.

---

**Desenvolvido com ❤️ para investidores independentes**
