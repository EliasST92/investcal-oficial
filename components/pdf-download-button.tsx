"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFSection {
  title?: string
  content: Array<{ label: string; value: string } | string>
}

interface PDFOptions {
  title: string
  subtitle?: string
  sections: PDFSection[]
  footer?: string
}

interface PDFDownloadButtonProps {
  options: PDFOptions
  disabled?: boolean
  className?: string
}

export function PDFDownloadButton({ options, disabled, className }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = () => {
    setIsGenerating(true)
    
    // Create a new window with formatted content for printing as PDF
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      setIsGenerating(false)
      alert("Por favor, permita popups para baixar o PDF")
      return
    }

    const date = new Date().toLocaleDateString("pt-BR")
    const time = new Date().toLocaleTimeString("pt-BR")

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${options.title} - InvestCalc</title>
  <style>
    @media print {
      @page { margin: 20mm; size: A4; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo { font-size: 28px; font-weight: bold; }
    .date { font-size: 12px; opacity: 0.8; }
    .title { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #1e293b; }
    .subtitle { font-size: 14px; color: #64748b; margin-bottom: 24px; }
    .section { margin-bottom: 20px; }
    .section-title {
      background: #f1f5f9;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 12px;
      color: #334155;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    .item:last-child { border-bottom: none; }
    .item-label { color: #64748b; font-size: 13px; }
    .item-value { font-weight: 600; color: #1e293b; font-size: 13px; }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1e293b;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .print-btn:hover { background: #334155; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Salvar como PDF</button>
  
  <div class="header">
    <div class="logo">InvestCalc</div>
    <div class="date">Gerado em: ${date} as ${time}</div>
  </div>
  
  <div class="title">${options.title}</div>
  ${options.subtitle ? `<div class="subtitle">${options.subtitle}</div>` : ""}
  
  ${options.sections.map(section => `
    <div class="section">
      ${section.title ? `<div class="section-title">${section.title}</div>` : ""}
      ${section.content.map(item => {
        if (typeof item === "string") {
          return `<div class="item"><span class="item-label">${item}</span></div>`
        }
        return `<div class="item"><span class="item-label">${item.label}</span><span class="item-value">${item.value}</span></div>`
      }).join("")}
    </div>
  `).join("")}
  
  <div class="footer">
    <span>${options.footer || "InvestCalc - Ferramentas para Investidores"}</span>
    <span>investcalc.com.br</span>
  </div>
  
  <script>
    // Auto print after load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    setIsGenerating(false)
  }

  return (
    <Button 
      onClick={handleDownload}
      variant="outline"
      className={className}
      disabled={disabled || isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {isGenerating ? "Gerando..." : "Baixar PDF"}
    </Button>
  )
}

export function formatCurrencyForPDF(value: number, currency: "BRL" | "USD" = "BRL"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
