import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AffiliateRecommendations } from "@/components/affiliate-recommendations";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  ArrowRight,
  Target,
  PiggyBank,
  LineChart
} from "lucide-react"

const tools = [
  {
    name: "Calculadora Viver de Renda",
    description: "Descubra quanto você precisa ter investido em FIIs ou ETFs americanos para alcançar sua renda mensal desejada.",
    href: "/viver-de-renda",
    icon: DollarSign,
    highlight: "FIIs e ETFs",
    color: "bg-chart-1/10 text-chart-1"
  },
  {
    name: "Simulador Bola de Neve",
    description: "Visualize o poder dos juros compostos e do reinvestimento de dividendos ao longo do tempo.",
    href: "/bola-de-neve",
    icon: TrendingUp,
    highlight: "JEPI / SCHD",
    color: "bg-chart-2/10 text-chart-2"
  },
  {
    name: "Conversor de Inflação",
    description: "Descubra quanto R$ 1.000 de anos atrás valem hoje. Perfeito para compartilhar nas redes sociais.",
    href: "/inflacao",
    icon: BarChart3,
    highlight: "2010 → Hoje",
    color: "bg-chart-3/10 text-chart-3"
  },
  {
    name: "Calculadora de Preço Médio",
    description: "Calcule seu preço médio de compra para declaração de IR. Insira suas compras e veja o resultado na hora.",
    href: "/preco-medio",
    icon: Calculator,
    highlight: "Essencial para IR",
    color: "bg-chart-4/10 text-chart-4"
  },
]

const features = [
  {
    icon: Target,
    title: "Planeje sua Independência",
    description: "Defina metas claras e calcule exatamente quanto precisa investir."
  },
  {
    icon: PiggyBank,
    title: "Simule Cenários",
    description: "Teste diferentes estratégias antes de tomar decisões de investimento."
  },
  {
    icon: LineChart,
    title: "Visualize seu Progresso",
    description: "Gráficos interativos para acompanhar a evolução do seu patrimônio."
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Ferramentas para o Investidor Inteligente
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground text-balance">
              Calculadoras gratuitas para planejar sua independência financeira.
              Simule investimentos em FIIs, ETFs americanos e muito mais.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/viver-de-renda">
                  Começar a Calcular
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/bola-de-neve">
                  Ver Simulador
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Nossas Ferramentas</h2>
          <p className="mt-3 text-muted-foreground">
            Tudo que você precisa para tomar decisões de investimento mais inteligentes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.href} href={tool.href} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30 group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${tool.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {tool.highlight}
                      </span>
                    </div>
                    <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-primary">
                      Acessar ferramenta
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>
          As informações apresentadas são apenas para fins educacionais e não constituem recomendação de investimento.
        </p>
        <AffiliateRecommendations />
      </footer>
    </div>
  )
}
