import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Calculadora de Independência Financeira | Simulador de Dividendos FIIs - InvestCalc',
  description: 'Calculadora gratuita de independência financeira e simulador de dividendos de FIIs. Descubra quanto precisa investir para viver de renda passiva, simule o efeito bola de neve dos dividendos e planeje sua liberdade financeira.',
  keywords: ['calculadora independência financeira', 'simulador dividendos FIIs', 'viver de renda', 'calculadora FIIs', 'simulador investimentos', 'renda passiva', 'fundos imobiliários', 'aposentadoria', 'liberdade financeira'],
  authors: [{ name: 'InvestCalc' }],
  creator: 'InvestCalc',
  publisher: 'InvestCalc',
  generator: 'v0.app',
  metadataBase: new URL('https://v0-ferramentas-de-investimento.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://v0-ferramentas-de-investimento.vercel.app',
    siteName: 'InvestCalc',
    title: 'Calculadora de Independência Financeira | Simulador de Dividendos FIIs',
    description: 'Ferramentas gratuitas para investidores: calcule quanto precisa para viver de renda passiva, simule dividendos de FIIs e planeje sua independência financeira.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InvestCalc - Calculadora de Independência Financeira e Simulador de Dividendos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Independência Financeira | Simulador de Dividendos FIIs',
    description: 'Ferramentas gratuitas para investidores: calcule quanto precisa para viver de renda passiva e simule dividendos de FIIs.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
