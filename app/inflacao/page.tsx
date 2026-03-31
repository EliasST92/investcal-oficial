"use client"

// Conversor de Poder de Compra - Inflation Calculator
import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingDown, Share2, Calendar, DollarSign } from "lucide-react"
import { PDFDownloadButton, formatCurrencyForPDF } from "@/components/pdf-download-button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

// IPCA acumulado anual (dados históricos aproximados)
const IPCA_DATA: Record<number, number> = {
  2000: 5.97,
  2001: 7.67,
  2002: 12.53,
  2003: 9.30,
  2004: 7.60,
  2005: 5.69,
  2006: 3.14,
  2007: 4.46,
  2008: 5.90,
  2009: 4.31,
  2010: 5.91,
  2011: 6.50,
  2012: 5.84,
  2013: 5.91,
  2014: 6.41,
  2015: 10.67,
  2016: 6.29,
  2017: 2.95,
  2018: 3.75,
  2019: 4.31,
  2020: 4.52,
  2021: 10.06,
  2022: 5.79,
  2023: 4.62,
  2024: 4.83,
  2025: 4.50,
  2026: 0.00,
}

const CURRENT_YEAR = 2026
const START_YEAR = 2000

function calculateInflationFactor(fromYear: number, toYear: number): number {
  if (fromYear >= toYear) return 1
  
  let factor = 1
  for (let year = fromYear; year < toYear; year++) {
    const ipca = IPCA_DATA[year] || 4.5
    factor *= 1 + ipca / 100
  }
  return factor
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".")
  return parseFloat(cleaned) || 0
}

const PRESET_VALUES = [100, 500, 1000, 5000, 10000]

export default function InflacaoPage() {
  const [value, setValue] = useState<string>("1.000")
  const [fromYear, setFromYear] = useState<string>("2010")
  const [toYear, setToYear] = useState<string>("2026")

  const originalValue = parseCurrencyInput(value)
  const from = parseInt(fromYear)
  const to = parseInt(toYear)

  const inflationFactor = useMemo(() => {
    return calculateInflationFactor(from, to)
  }, [from, to])

  const adjustedValue = originalValue * inflationFactor
  const percentageChange = ((inflationFactor - 1) * 100)
  const purchasingPowerLoss = originalValue - (originalValue / inflationFactor)

  // Chart data - what each year's R$1000 is worth today
  const chartData = useMemo(() => {
    const years = [2000, 2005, 2010, 2015, 2020, 2024]
    return years.map((year) => ({
      year: year.toString(),
      value: 1000 * calculateInflationFactor(year, CURRENT_YEAR),
      originalYear: year,
    }))
  }, [])

  const handleShare = async () => {
    const text = `${formatCurrency(originalValue)} em ${from} equivalem a ${formatCurrency(adjustedValue)} em ${to}! Isso é uma inflação de ${percentageChange.toFixed(1)}% no período.`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Calculadora de Inflação",
          text: text,
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert("Texto copiado para a área de transferência!")
    }
  }

  const pdfOptions = {
    title: "Conversor de Poder de Compra",
    subtitle: `Correcao pela inflacao (IPCA) de ${from} a ${to}`,
    sections: [
      {
        title: "Calculo Principal",
        content: [
          { label: "Valor Original", value: formatCurrencyForPDF(originalValue) },
          { label: "Ano Inicial", value: from.toString() },
          { label: "Ano Final", value: to.toString() },
          { label: "Valor Corrigido", value: formatCurrencyForPDF(adjustedValue) },
        ],
      },
      {
        title: "Analise da Inflacao",
        content: [
          { label: "Periodo", value: `${to - from} anos` },
          { label: "Inflacao Acumulada", value: `${percentageChange.toFixed(2)}%` },
          { label: "Fator de Correcao", value: inflationFactor.toFixed(4) },
          { label: "Perda de Poder de Compra", value: formatCurrencyForPDF(purchasingPowerLoss) },
        ],
      },
      {
        title: "Valores Historicos de R$ 1.000",
        content: chartData.map((d) => ({
          label: `R$ 1.000 em ${d.year}`,
          value: `= ${formatCurrencyForPDF(d.value)} hoje`,
        })),
      },
    ],
    footer: "Calculos baseados no IPCA (IBGE). Dados de 2025-2026 sao estimativas.",
  }

  const years = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Conversor de Poder de Compra
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Descubra quanto o dinheiro de ontem vale hoje (ou vice-versa)
            </p>
            <PDFDownloadButton 
              options={pdfOptions}
              className="mt-4"
              disabled={originalValue <= 0}
            />
          </div>

          {/* Main Calculator */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Calcular Inflação
              </CardTitle>
              <CardDescription>
                Baseado no IPCA (Índice de Preços ao Consumidor Amplo)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset Values */}
              <div>
                <Label className="text-sm text-muted-foreground">Valores rápidos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRESET_VALUES.map((preset) => (
                    <Button
                      key={preset}
                      variant={parseCurrencyInput(value) === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => setValue(preset.toLocaleString("pt-BR"))}
                    >
                      {formatCurrency(preset)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Calculator Row */}
              <div className="grid md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-end">
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      R$
                    </span>
                    <Input
                      id="value"
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      placeholder="1.000"
                    />
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center text-muted-foreground">
                  em
                </div>

                <div>
                  <Label htmlFor="fromYear">Ano Inicial</Label>
                  <Select value={fromYear} onValueChange={setFromYear}>
                    <SelectTrigger id="fromYear" className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <Label htmlFor="toYear">Ano Final</Label>
                  <Select value={toYear} onValueChange={setToYear}>
                    <SelectTrigger id="toYear" className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Card */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">{formatCurrency(originalValue)}</span> em {from} equivalem a:
                </p>
                <p className="text-5xl md:text-6xl font-bold text-primary">
                  {formatCurrency(adjustedValue)}
                </p>
                <p className="mt-2 text-lg text-muted-foreground">
                  em {to}
                </p>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-border pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Inflação Acumulada</p>
                    <p className="text-2xl font-bold text-destructive">
                      +{percentageChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="text-2xl font-bold text-foreground">
                      {to - from} anos
                    </p>
                  </div>
                  <div className="text-center col-span-2 md:col-span-1">
                    <p className="text-sm text-muted-foreground">Perda de Poder de Compra</p>
                    <p className="text-2xl font-bold text-chart-5">
                      {formatCurrency(purchasingPowerLoss)}
                    </p>
                  </div>
                </div>

                <Button onClick={handleShare} variant="outline" className="mt-6 gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar Resultado
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Historical Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Quanto vale R$ 1.000 de cada ano?
              </CardTitle>
              <CardDescription>
                Valor equivalente em {CURRENT_YEAR} (corrigido pelo IPCA)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis
                      tickFormatter={(v) => `R$ ${(v / 1000).toFixed(1)}k`}
                      className="text-xs"
                      width={70}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), `Equivalente em ${CURRENT_YEAR}`]}
                      labelFormatter={(label) => `R$ 1.000 em ${label}`}
                      contentStyle={{
                        backgroundColor: "oklch(0.22 0.02 240)",
                        border: "1px solid oklch(0.32 0.02 240)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`oklch(${0.5 + index * 0.05} 0.18 160)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Facts */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground">R$ 1.000 em 2000</p>
                  <p className="text-xl font-bold text-foreground">
                    = {formatCurrency(1000 * calculateInflationFactor(2000, CURRENT_YEAR))} hoje
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground">R$ 1.000 em 2010</p>
                  <p className="text-xl font-bold text-foreground">
                    = {formatCurrency(1000 * calculateInflationFactor(2010, CURRENT_YEAR))} hoje
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Sobre os dados</p>
            <p>
              Os cálculos são baseados no IPCA (Índice de Preços ao Consumidor Amplo), 
              calculado pelo IBGE. É o índice oficial de inflação do Brasil, usado como referência 
              para metas de inflação, correção de contratos e análises econômicas.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
