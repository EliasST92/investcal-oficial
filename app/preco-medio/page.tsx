"use client"

// Calculadora de Preco Medio - Average Price Calculator
import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Trash2, 
  Calculator, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Copy,
  RotateCcw
} from "lucide-react"
import { PDFDownloadButton, formatCurrencyForPDF } from "@/components/pdf-download-button"

interface Purchase {
  id: string
  date: string
  quantity: string
  price: string
  fees: string
}

function createPurchase(): Purchase {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    price: "",
    fees: "0",
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(",", ".")
  return parseFloat(cleaned) || 0
}

export default function PrecoMedioPage() {
  const [ticker, setTicker] = useState<string>("")
  const [purchases, setPurchases] = useState<Purchase[]>([createPurchase()])
  const [currentPrice, setCurrentPrice] = useState<string>("")

  const calculations = useMemo(() => {
    let totalQuantity = 0
    let totalCost = 0
    let totalFees = 0

    purchases.forEach((purchase) => {
      const qty = parseNumber(purchase.quantity)
      const price = parseNumber(purchase.price)
      const fees = parseNumber(purchase.fees)

      if (qty > 0 && price > 0) {
        totalQuantity += qty
        totalCost += qty * price + fees
        totalFees += fees
      }
    })

    const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0
    const current = parseNumber(currentPrice)
    const currentValue = totalQuantity * current
    const gainLoss = currentValue - totalCost
    const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0

    return {
      totalQuantity,
      totalCost,
      totalFees,
      averagePrice,
      currentValue,
      gainLoss,
      gainLossPercent,
    }
  }, [purchases, currentPrice])

  const addPurchase = () => {
    setPurchases([...purchases, createPurchase()])
  }

  const removePurchase = (id: string) => {
    if (purchases.length > 1) {
      setPurchases(purchases.filter((p) => p.id !== id))
    }
  }

  const updatePurchase = (id: string, field: keyof Purchase, value: string) => {
    setPurchases(
      purchases.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const resetAll = () => {
    setTicker("")
    setPurchases([createPurchase()])
    setCurrentPrice("")
  }

  const copyToClipboard = () => {
    const text = `
${ticker || "Ativo"} - Resumo de Compras
===============================
Quantidade Total: ${calculations.totalQuantity} cotas/ações
Custo Total: ${formatCurrency(calculations.totalCost)}
Preço Médio: ${formatCurrency(calculations.averagePrice)}
Taxas Totais: ${formatCurrency(calculations.totalFees)}
${currentPrice ? `
Valor Atual: ${formatCurrency(calculations.currentValue)}
Resultado: ${formatCurrency(calculations.gainLoss)} (${calculations.gainLossPercent.toFixed(2)}%)
` : ""}
    `.trim()

    navigator.clipboard.writeText(text)
    alert("Copiado para a área de transferência!")
  }

  const validPurchases = purchases.filter(p => parseNumber(p.quantity) > 0 && parseNumber(p.price) > 0)
  
  const purchaseDetails = validPurchases.map((p, i) => ({
    label: `Compra ${i + 1} (${p.date})`,
    value: `${parseNumber(p.quantity)} x ${formatCurrencyForPDF(parseNumber(p.price))} = ${formatCurrencyForPDF(parseNumber(p.quantity) * parseNumber(p.price) + parseNumber(p.fees))}`,
  }))

  const pdfSections = [
    {
      title: "Resumo do Ativo",
      content: [
        { label: "Codigo do Ativo", value: ticker || "Nao informado" },
        { label: "Quantidade Total", value: `${calculations.totalQuantity.toLocaleString("pt-BR")} cotas/acoes` },
        { label: "Custo Total", value: formatCurrencyForPDF(calculations.totalCost) },
        { label: "Preco Medio", value: formatCurrencyForPDF(calculations.averagePrice) },
        { label: "Total em Taxas", value: formatCurrencyForPDF(calculations.totalFees) },
        { label: "Numero de Compras", value: validPurchases.length.toString() },
      ],
    },
    {
      title: "Detalhamento das Compras",
      content: purchaseDetails.length > 0 ? purchaseDetails : [{ label: "Status", value: "Nenhuma compra registrada" }],
    },
  ]

  if (parseNumber(currentPrice) > 0 && calculations.totalQuantity > 0) {
    pdfSections.push({
      title: "Posicao Atual",
      content: [
        { label: "Cotacao Atual", value: formatCurrencyForPDF(parseNumber(currentPrice)) },
        { label: "Valor de Mercado", value: formatCurrencyForPDF(calculations.currentValue) },
        { label: "Resultado", value: `${calculations.gainLoss >= 0 ? "+" : ""}${formatCurrencyForPDF(calculations.gainLoss)}` },
        { label: "Variacao", value: `${calculations.gainLossPercent >= 0 ? "+" : ""}${calculations.gainLossPercent.toFixed(2)}%` },
      ],
    })
  }

  const pdfOptions = {
    title: `Preco Medio - ${ticker || "Ativo"}`,
    subtitle: "Calculo de preco medio para declaracao de IR",
    sections: pdfSections,
    footer: "Documento util para declaracao de Imposto de Renda. Guarde seus comprovantes.",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Calculadora de Preço Médio
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Calcule seu preço médio de compra para declaração de IR
            </p>
            <PDFDownloadButton 
              options={pdfOptions}
              className="mt-4"
              disabled={calculations.totalQuantity <= 0}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Purchases List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Ticker Input */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor="ticker">Código do Ativo</Label>
                      <Input
                        id="ticker"
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        placeholder="Ex: PETR4, MXRF11, IVVB11"
                        className="mt-2 uppercase"
                      />
                    </div>
                    <Button variant="outline" size="icon" onClick={resetAll}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Purchases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Suas Compras
                  </CardTitle>
                  <CardDescription>
                    Insira todas as compras realizadas do ativo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {purchases.map((purchase, index) => (
                    <div
                      key={purchase.id}
                      className="p-4 rounded-lg border border-border bg-secondary/30 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Compra #{index + 1}
                        </span>
                        {purchases.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removePurchase(purchase.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs">Data</Label>
                          <Input
                            type="date"
                            value={purchase.date}
                            onChange={(e) =>
                              updatePurchase(purchase.id, "date", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Quantidade</Label>
                          <Input
                            type="text"
                            value={purchase.quantity}
                            onChange={(e) =>
                              updatePurchase(purchase.id, "quantity", e.target.value)
                            }
                            placeholder="100"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Preço Unitário (R$)</Label>
                          <Input
                            type="text"
                            value={purchase.price}
                            onChange={(e) =>
                              updatePurchase(purchase.id, "price", e.target.value)
                            }
                            placeholder="25,50"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Taxas (R$)</Label>
                          <Input
                            type="text"
                            value={purchase.fees}
                            onChange={(e) =>
                              updatePurchase(purchase.id, "fees", e.target.value)
                            }
                            placeholder="0,00"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {parseNumber(purchase.quantity) > 0 && parseNumber(purchase.price) > 0 && (
                        <div className="text-sm text-muted-foreground pt-2 border-t border-border">
                          Total desta compra:{" "}
                          <span className="font-medium text-foreground">
                            {formatCurrency(
                              parseNumber(purchase.quantity) * parseNumber(purchase.price) +
                                parseNumber(purchase.fees)
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button onClick={addPurchase} variant="outline" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Compra
                  </Button>
                </CardContent>
              </Card>

              {/* Current Price (optional) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cotação Atual (opcional)</CardTitle>
                  <CardDescription>
                    Informe a cotação atual para ver seu resultado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      R$
                    </span>
                    <Input
                      type="text"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      placeholder="28,00"
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {/* Main Result */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Preço Médio
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(calculations.averagePrice)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    por cota/ação
                  </p>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Quantidade Total</span>
                    <span className="font-medium">
                      {calculations.totalQuantity.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Custo Total</span>
                    <span className="font-medium">
                      {formatCurrency(calculations.totalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total em Taxas</span>
                    <span className="font-medium">
                      {formatCurrency(calculations.totalFees)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">Número de Compras</span>
                    <span className="font-medium">
                      {purchases.filter(p => parseNumber(p.quantity) > 0).length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Position */}
              {parseNumber(currentPrice) > 0 && calculations.totalQuantity > 0 && (
                <Card className={calculations.gainLoss >= 0 ? "border-chart-1/30 bg-chart-1/5" : "border-destructive/30 bg-destructive/5"}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {calculations.gainLoss >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-chart-1" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      )}
                      Posição Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor de Mercado</span>
                      <span className="font-medium">
                        {formatCurrency(calculations.currentValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Resultado</span>
                      <span className={`font-bold ${calculations.gainLoss >= 0 ? "text-chart-1" : "text-destructive"}`}>
                        {calculations.gainLoss >= 0 ? "+" : ""}
                        {formatCurrency(calculations.gainLoss)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Variação</span>
                      <span className={`font-bold ${calculations.gainLoss >= 0 ? "text-chart-1" : "text-destructive"}`}>
                        {calculations.gainLossPercent >= 0 ? "+" : ""}
                        {calculations.gainLossPercent.toFixed(2)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Button onClick={copyToClipboard} variant="outline" className="w-full gap-2">
                <Copy className="h-4 w-4" />
                Copiar Resumo
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Dica para o IR</p>
            <p>
              O preço médio é essencial para calcular o ganho de capital na venda de ações e FIIs. 
              Inclua sempre as taxas de corretagem e emolumentos no custo de aquisição. 
              Guarde os dados de cada compra para facilitar sua declaração anual.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
