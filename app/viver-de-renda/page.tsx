"use client"

// Calculadora Viver de Renda - Investment Calculator
import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Building2, DollarSign, TrendingUp, Info } from "lucide-react"
import { PDFDownloadButton, formatCurrencyForPDF } from "@/components/pdf-download-button"
import { AffiliateRecommendations } from "@/components/affiliate-recommendations"

const FII_PRESETS = [
  { name: "Conservador", yield: 0.65, description: "Fundos de tijolo tradicionais" },
  { name: "Moderado", yield: 0.80, description: "Mix de tijolo e papel" },
  { name: "Agressivo", yield: 1.00, description: "Fundos de papel e high yield" },
]

const ETF_PRESETS = [
  { name: "SCHD", yield: 0.30, description: "Dividend Growth ETF" },
  { name: "JEPI", yield: 0.65, description: "JP Morgan Equity Premium" },
  { name: "JEPQ", yield: 0.75, description: "JP Morgan Nasdaq Premium" },
  { name: "QYLD", yield: 0.90, description: "Covered Call ETF" },
]

function formatCurrency(value: number, currency: "BRL" | "USD" = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".")
  return parseFloat(cleaned) || 0
}

export default function ViverDeRendaPage() {
  const [desiredIncome, setDesiredIncome] = useState<string>("5.000")
  const [fiiYield, setFiiYield] = useState<number>(0.80)
  const [etfYield, setEtfYield] = useState<number>(0.65)
  const [usdRate, setUsdRate] = useState<string>("5,00")

  const income = parseCurrencyInput(desiredIncome)
  const usd = parseCurrencyInput(usdRate)

  // FII Calculation (monthly yield)
  const fiiRequired = income > 0 && fiiYield > 0 ? income / (fiiYield / 100) : 0

  // ETF Calculation (monthly yield, converting to BRL)
  const incomeInUsd = income / (usd || 5)
  const etfRequired = incomeInUsd > 0 && etfYield > 0 ? incomeInUsd / (etfYield / 100) : 0

  const pdfOptions = {
    title: "Viver de Renda",
    subtitle: "Projecao de patrimonio necessario para independencia financeira",
    sections: [
      {
        title: "Objetivo",
        content: [
          { label: "Renda Mensal Desejada", value: formatCurrencyForPDF(income) },
          { label: "Renda Anual Desejada", value: formatCurrencyForPDF(income * 12) },
        ],
      },
      {
        title: "Cenario FIIs Brasil",
        content: [
          { label: "Yield Mensal", value: `${fiiYield.toFixed(2)}%` },
          { label: "Yield Anual", value: `${(fiiYield * 12).toFixed(2)}%` },
          { label: "Patrimonio Necessario", value: formatCurrencyForPDF(fiiRequired) },
        ],
      },
      {
        title: "Cenario ETFs EUA",
        content: [
          { label: "Cotacao do Dolar", value: formatCurrencyForPDF(usd) },
          { label: "Yield Mensal", value: `${etfYield.toFixed(2)}%` },
          { label: "Yield Anual", value: `${(etfYield * 12).toFixed(2)}%` },
          { label: "Patrimonio Necessario (USD)", value: formatCurrencyForPDF(etfRequired, "USD") },
          { label: "Patrimonio Necessario (BRL)", value: formatCurrencyForPDF(etfRequired * usd) },
        ],
      },
    ],
    footer: "Lembre-se: yields passados nao garantem rendimentos futuros.",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Calculadora Viver de Renda
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Descubra quanto você precisa investir para alcançar sua liberdade financeira
            </p>
            <PDFDownloadButton 
              options={pdfOptions}
              className="mt-4"
              disabled={income <= 0}
            />
          </div>

          {/* Input Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Quanto você quer receber por mês?
              </CardTitle>
              <CardDescription>
                Informe a renda mensal desejada em Reais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Label htmlFor="income">Renda Mensal Desejada</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="income"
                      type="text"
                      value={desiredIncome}
                      onChange={(e) => setDesiredIncome(e.target.value)}
                      className="pl-10 text-lg h-12"
                      placeholder="5.000"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Label htmlFor="usd">Cotação do Dólar</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="usd"
                      type="text"
                      value={usdRate}
                      onChange={(e) => setUsdRate(e.target.value)}
                      className="pl-10 text-lg h-12"
                      placeholder="5,00"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Tabs */}
          <Tabs defaultValue="fii" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="fii" className="text-base gap-2">
                <Building2 className="h-4 w-4" />
                FIIs Brasil
              </TabsTrigger>
              <TabsTrigger value="etf" className="text-base gap-2">
                <TrendingUp className="h-4 w-4" />
                ETFs EUA
              </TabsTrigger>
            </TabsList>

            {/* FII Tab */}
            <TabsContent value="fii" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Yield Médio Mensal dos FIIs</CardTitle>
                  <CardDescription>
                    Ajuste o rendimento médio esperado dos Fundos Imobiliários
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {FII_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setFiiYield(preset.yield)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          fiiYield === preset.yield
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:bg-secondary"
                        }`}
                      >
                        {preset.name} ({preset.yield}%)
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Yield Mensal</Label>
                      <span className="text-2xl font-bold text-primary">
                        {fiiYield.toFixed(2)}%
                      </span>
                    </div>
                    <Slider
                      value={[fiiYield]}
                      onValueChange={(v) => setFiiYield(v[0])}
                      min={0.3}
                      max={1.5}
                      step={0.05}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.30%</span>
                      <span>1.50%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FII Result */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                      Para receber <span className="font-semibold text-foreground">{formatCurrency(income)}/mês</span> você precisa de:
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-primary">
                      {formatCurrency(fiiRequired)}
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      investidos em Fundos Imobiliários com yield de {fiiYield.toFixed(2)}% a.m.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Yield Anual</p>
                      <p className="text-xl font-semibold">{(fiiYield * 12).toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Renda Anual</p>
                      <p className="text-xl font-semibold">{formatCurrency(income * 12)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ETF Tab */}
            <TabsContent value="etf" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dividend Yield Mensal dos ETFs</CardTitle>
                  <CardDescription>
                    Selecione um ETF popular ou ajuste o yield manualmente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {ETF_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setEtfYield(preset.yield)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          etfYield === preset.yield
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:bg-secondary"
                        }`}
                      >
                        {preset.name} ({preset.yield}%)
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Yield Mensal</Label>
                      <span className="text-2xl font-bold text-primary">
                        {etfYield.toFixed(2)}%
                      </span>
                    </div>
                    <Slider
                      value={[etfYield]}
                      onValueChange={(v) => setEtfYield(v[0])}
                      min={0.1}
                      max={1.2}
                      step={0.05}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.10%</span>
                      <span>1.20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ETF Result */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                      Para receber <span className="font-semibold text-foreground">{formatCurrency(income)}/mês</span> você precisa de:
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-primary">
                      {formatCurrency(etfRequired, "USD")}
                    </p>
                    <p className="mt-2 text-lg text-muted-foreground">
                      ≈ {formatCurrency(etfRequired * usd)} em Reais
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      investidos em ETFs com yield de {etfYield.toFixed(2)}% a.m.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Yield Anual</p>
                      <p className="text-xl font-semibold">{(etfYield * 12).toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Renda em USD</p>
                      <p className="text-xl font-semibold">{formatCurrency(incomeInUsd, "USD")}/mês</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Renda Anual</p>
                      <p className="text-xl font-semibold">{formatCurrency(income * 12)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Sobre os ETFs</p>
                  <p>
                    JEPI e JEPQ são ETFs de covered call que oferecem yields mais altos, 
                    mas com menor potencial de valorização. SCHD foca em crescimento de dividendos 
                    com yield menor porém mais sustentável.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Affiliate Recommendations */}
          <AffiliateRecommendations />
        </div>
      </main>
    </div>
  )
}
