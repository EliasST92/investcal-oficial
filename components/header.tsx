"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const tools = [
  {
    name: "Viver de Renda",
    href: "/viver-de-renda",
    icon: DollarSign,
    description: "Calcule quanto precisa investir"
  },
  {
    name: "Bola de Neve",
    href: "/bola-de-neve",
    icon: TrendingUp,
    description: "Simule reinvestimento de dividendos"
  },
  {
    name: "Inflação",
    href: "/inflacao",
    icon: BarChart3,
    description: "Converta poder de compra"
  },
  {
    name: "Preço Médio",
    href: "/preco-medio",
    icon: Calculator,
    description: "Calcule seu preço médio de compra"
  },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">InvestCalc</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isActive = pathname === tool.href
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {tool.name}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon
              const isActive = pathname === tool.href
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div>{tool.name}</div>
                    <div className="text-xs opacity-70">{tool.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
