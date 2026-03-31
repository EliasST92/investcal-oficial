"use client"

// Simulador Bola de Neve - Compound Interest Simulator
import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { TrendingUp, Snowflake, DollarSign, Calendar, Percent } from "lucide-react"
import { PDFDownloadButton, formatCurrencyForPDF } from "@/components/pdf-download-button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts"

const ETF_PRESETS = [
  { name: "JEPI", dividendYield: 7.8, appreciation: 3.0, description: "JP Morgan Equity Premium Income" },
  { name: "SCHD", dividendYield: 3.5, appreciation: 8.0, description: "Schwab US Dividend Equity" },
  { name: "FIIs Brasil", dividendYield: 9.6, appreciation: 2.0, description: "Média dos Fundos Imobiliários" },
  { name: "Personalizado", dividendYield: 6.0, appreciation: 5.0, description: "Configure seu próprio cenário" },
]

function formatCurrency(value: number, short = false) {
  if (short && value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(2)}M`
  }
  if (short && value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".")
  return parseFloat(cleaned) || 0
}

interface DataPoint {
  year: number
  withReinvestment: number
  withoutReinvestment: number
  totalInvested: number
  dividendsReceived: number
}

function calculateGrowth(
  initialInvestment: number,
  monthlyContribution: number,
  dividendYield: number,
  appreciation: number,
  years: number,
  reinvest: boolean
): DataPoint[] {
  const data: DataPoint[] = []
  const monthlyDividendRate = dividendYield / 100 / 12
  const monthlyAppreciation = appreciation / 100 / 12

  let balanceWithReinvest = initialInvestment
  let balanceWithoutReinvest = initialInvestment
  let totalInvested = initialInvestment
  let totalDividends = 0

  data.push({
    year: 0,
    withReinvestment: initialInvestment,
    withoutReinvestment: initialInvestment,
    totalInvested: initialInvestment,
    dividendsReceived: 0,
  })

  for (let month = 1; month <= years * 12; month++) {
    // Monthly contribution
    totalInvested += monthlyContribution
    balanceWithReinvest += monthlyContribution
    balanceWithoutReinvest += monthlyContribution

    // Appreciation
    balanceWithReinvest *= 1 + monthlyAppreciation
    balanceWithoutReinvest *= 1 + monthlyAppreciation

    // Dividends
    const dividendWithReinvest = balanceWithReinvest * monthlyDividendRate
    const dividendWithoutReinvest = balanceWithoutReinvest * monthlyDividendRate

    // Reinvest dividends only for "with reinvestment" scenario
    balanceWithReinvest += dividendWithReinvest
    totalDividends += dividendWithoutReinvest

    // Record yearly data
    if (month % 12 === 0) {
      data.push({
        year: month / 12,
        withReinvestment: Math.round(balanceWithReinvest),
        withoutReinvestment: Math.round(balanceWithoutReinvest),
        totalInvested: Math.round(totalInvested),
        dividendsReceived: Math.round(totalDividends),
      })
    }
  }

  return data
}

export default function BolaDeNevePage() {
  const [initialInvestment, setInitialInvestment] = useState<string>("10.000")
  const [monthlyContribution, setMonthlyContribution] = useState<string>("1.000")
  const [years, setYears] = useState<number>(20)
  const [selectedPreset, setSelectedPreset] = useState<string>("JEPI")
  const [dividendYield, setDividendYield] = useState<number>(7.8)
  const [appreciation, setAppreciation] = useState<number>(3.0)
  const [showComparison, setShowComparison] = useState<boolean>(true)

  const initial = parseCurrencyInput(initialInvestment)
  const monthly = parseCurrencyInput(monthlyContribution)

  const data = useMemo(() => {
    return calculateGrowth(initial, monthly, dividendYield, appreciation, years, true)
  }, [initial, monthly, dividendYield, appreciation, years])

  const finalWithReinvest = data[data.length - 1]?.withReinvestment || 0
  const finalWithoutReinvest = data[data.length - 1]?.withoutReinvestment || 0
  const totalInvested = data[data.length - 1]?.totalInvested || 0
  const totalDividends = data[data.length - 1]?.dividendsReceived || 0
  const snowballEffect = finalWithReinvest - finalWithoutReinvest

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName)
    const preset = ETF_PRESETS.find((p) => p.name === presetName)
    if (preset) {
      setDividendYield(preset.dividendYield)
      setAppreciation(preset.appreciation)
    }
  }

  const monthlyIncome = (finalWithReinvest * (dividendYield / 100)) / 12
  
  const pdfOptions = {
    title: "Simulador Bola de Neve",
    subtitle: `Projecao de ${years} anos - ${selectedPreset}`,
    sections: [
      {
        title: "Parametros da Simulacao",
        content: [
          { label: "Aporte Inicial", value: formatCurrencyForPDF(initial) },
          { label: "Aporte Mensal", value: formatCurrencyForPDF(monthly) },
          { label: "Periodo", value: `${years} anos` },
          { label: "Cenario", value: selectedPreset },
          { label: "Dividend Yield Anual", value: `${dividendYield.toFixed(1)}%` },
          { label: "Valorizacao Anual", value: `${appreciation.toFixed(1)}%` },
        ],
      },
      {
        title: "Resultados Projetados",
        content: [
          { label: "Patrimonio Final (com reinv.)", value: formatCurrencyForPDF(finalWithReinvest) },
          { label: "Patrimonio Final (sem reinv.)", value: formatCurrencyForPDF(finalWithoutReinvest) },
          { label: "Total Investido", value: formatCurrencyForPDF(totalInvested) },
          { label: "Ganho Total", value: formatCurrencyForPDF(finalWithReinvest - totalInvested) },
          { label: "Efeito Bola de Neve", value: `+${formatCurrencyForPDF(snowballEffect)}` },
        ],
      },
      {
        title: "Renda Passiva Projetada",
        content: [
          { label: "Renda Mensal (ao final)", value: formatCurrencyForPDF(monthlyIncome) },
          { label: "Renda Anual (ao final)", value: formatCurrencyForPDF(monthlyIncome * 12) },
          { label: "Multiplicador", value: `${(finalWithReinvest / totalInvested).toFixed(1)}x` },
        ],
      },
      {
        title: "Evolucao Anual",
        content: data.slice(0, 11).map((d) => ({
          label: `Ano ${d.year}`,
          value: formatCurrencyForPDF(d.withReinvestment),
        })),
      },
    ],
    footer: "Simulacao baseada em taxas constantes. Resultados reais podem variar.",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Simulador Bola de Neve
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Visualize o poder dos juros compostos e do reinvestimento de dividendos
            </p>
            <PDFDownloadButton options={pdfOptions} className="mt-4" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="space-y-6">
              {/* Investment Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Investimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="initial">Aporte Inicial</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        R$
                      </span>
                      <Input
                        id="initial"
                        type="text"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(e.target.value)}
                        className="pl-10"
                        placeholder="10.000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="monthly">Aporte Mensal</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        R$
                      </span>
                      <Input
                        id="monthly"
                        type="text"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(e.target.value)}
                        className="pl-10"
                        placeholder="1.000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Period */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Período
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Horizonte de Investimento</Label>
                    <span className="text-2xl font-bold text-primary">{years} anos</span>
                  </div>
                  <Slider
                    value={[years]}
                    onValueChange={(v) => setYears(v[0])}
                    min={5}
                    max={40}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 anos</span>
                    <span>40 anos</span>
                  </div>
                </CardContent>
              </Card>

              {/* Preset Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    Cenário
                  </CardTitle>
                  <CardDescription>
                    Simule com ETFs populares ou configure manualmente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {ETF_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handlePresetChange(preset.name)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedPreset === preset.name
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:bg-secondary"
                        }`}
                      >
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className={`text-xs ${selectedPreset === preset.name ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {preset.dividendYield}% DY
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Dividend Yield Anual</Label>
                        <span className="font-semibold">{dividendYield.toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[dividendYield]}
                        onValueChange={(v) => {
                          setDividendYield(v[0])
                          setSelectedPreset("Personalizado")
                        }}
                        min={1}
                        max={15}
                        step={0.1}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Valorização Anual</Label>
                        <span className="font-semibold">{appreciation.toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[appreciation]}
                        onValueChange={(v) => {
                          setAppreciation(v[0])
                          setSelectedPreset("Personalizado")
                        }}
                        min={0}
                        max={15}
                        step={0.1}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart and Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Evolução do Patrimônio
                      </CardTitle>
                      <CardDescription>
                        Projeção de {years} anos com reinvestimento de dividendos
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="comparison" className="text-sm">
                        Comparar cenários
                      </Label>
                      <Switch
                        id="comparison"
                        checked={showComparison}
                        onCheckedChange={setShowComparison}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorWithReinvest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.65 0.18 160)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="oklch(0.65 0.18 160)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorWithoutReinvest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis
                          dataKey="year"
                          tickFormatter={(v) => `${v}a`}
                          className="text-xs"
                        />
                        <YAxis
                          tickFormatter={(v) => formatCurrency(v, true)}
                          className="text-xs"
                          width={70}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatCurrency(value),
                            name === "withReinvestment"
                              ? "Com Reinvestimento"
                              : name === "withoutReinvestment"
                              ? "Sem Reinvestimento"
                              : "Total Investido",
                          ]}
                          labelFormatter={(label) => `Ano ${label}`}
                          contentStyle={{
                            backgroundColor: "oklch(0.22 0.02 240)",
                            border: "1px solid oklch(0.32 0.02 240)",
                            borderRadius: "8px",
                          }}
                        />
                        {showComparison && (
                          <Area
                            type="monotone"
                            dataKey="withoutReinvestment"
                            stroke="oklch(0.55 0.15 240)"
                            fill="url(#colorWithoutReinvest)"
                            strokeWidth={2}
                            name="withoutReinvestment"
                          />
                        )}
                        <Area
                          type="monotone"
                          dataKey="withReinvestment"
                          stroke="oklch(0.65 0.18 160)"
                          fill="url(#colorWithReinvest)"
                          strokeWidth={2}
                          name="withReinvestment"
                        />
                        <Legend
                          formatter={(value) =>
                            value === "withReinvestment"
                              ? "Com Reinvestimento"
                              : "Sem Reinvestimento"
                          }
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Results Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/10 border-primary/30">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Patrimônio Final</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(finalWithReinvest)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Investido</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(totalInvested)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Ganho Total</p>
                    <p className="text-2xl font-bold text-chart-1">
                      {formatCurrency(finalWithReinvest - totalInvested)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-chart-1/10 border-chart-1/30">
                  <CardContent className="pt-6 text-center">
                    <Snowflake className="h-5 w-5 mx-auto mb-1 text-chart-1" />
                    <p className="text-sm text-muted-foreground mb-1">Efeito Bola de Neve</p>
                    <p className="text-2xl font-bold text-chart-1">
                      +{formatCurrency(snowballEffect)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Income Projection */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Renda Mensal Projetada (ao final)</p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {formatCurrency((finalWithReinvest * (dividendYield / 100)) / 12)}
                        <span className="text-base font-normal text-muted-foreground">/mês</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Multiplicador</p>
                      <p className="text-3xl font-bold text-chart-1">
                        {(finalWithReinvest / totalInvested).toFixed(1)}x
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
