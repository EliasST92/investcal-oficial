"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ExternalLink } from "lucide-react"

interface AffiliateLink {
  title: string
  description: string
  href: string
  buttonText?: string
}

interface AffiliateRecommendationsProps {
  links?: AffiliateLink[]
  className?: string
}

const DEFAULT_LINKS: AffiliateLink[] = [
  {
    title: "Guia Completo de Investimento",
    description: "Aprenda o metodo para construir patrimonio e viver de renda com FIIs e ETFs.",
    href: "https://go.hotmart.com/K104861465M",
    buttonText: "Acessar Guia Agora",
  },
]
export function AffiliateRecommendations({
  links = DEFAULT_LINKS,
  className = ""
}: AffiliateRecommendationsProps) {
  return (
    <Card className={`mt-8 border-border/50 bg-secondary/30 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          Recomendacoes para sua Carteira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className="mb-3">
                <h3 className="font-medium text-foreground mb-1">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer sponsored">
                  {link.buttonText || "Saiba mais"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Links patrocinados. Podemos receber uma comissao por indicacoes.
        </p>
      </CardContent>
    </Card>
  )
}
