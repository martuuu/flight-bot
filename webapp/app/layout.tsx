import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProviders } from '../components/providers'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/ui/Header'
import { StructuredData } from '@/components/seo/StructuredData'

export { viewport } from './viewport'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter' 
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://flight-bot.com'),
  title: {
    default: 'Flight-Bot | Alertas Inteligentes de Vuelos Baratos por WhatsApp y Telegram',
    template: '%s | Flight-Bot - Alertas de Vuelos'
  },
  description: 'Bot legal y profesional que te notifica por WhatsApp y Telegram cuando encuentre vuelos baratos, boletos de eventos y ofertas de viaje. Monitoreo automático 24/7 para uso doméstico y personal.',
  keywords: [
    // Keywords principales en español
    'bot alertas vuelos baratos',
    'notificaciones vuelos whatsapp',
    'telegram bot vuelos',
    'alertas precio vuelos',
    'bot legal vuelos',
    'monitoreo precios vuelos',
    'ofertas vuelos baratos',
    'bot domestico vuelos',
    'alertas viajes whatsapp',
    'telegram alertas vuelos',
    // Keywords en inglés
    'flight price alerts bot',
    'whatsapp flight notifications',
    'telegram flight bot',
    'cheap flights alerts',
    'flight deals bot',
    'automated flight monitoring',
    'travel alerts bot',
    'flight price tracking',
    // Keywords de eventos
    'alertas boletos eventos',
    'bot tickets conciertos',
    'notificaciones eventos',
    'alertas entradas baratas',
    // Keywords técnicos
    'bot legal automatizado',
    'uso domestico personal',
    'notificaciones tiempo real',
    'monitoreo 24/7 vuelos'
  ],
  authors: [{ name: 'Flight-Bot Team', url: 'https://flight-bot.com' }],
  creator: 'Flight-Bot',
  publisher: 'Flight-Bot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
    url: 'https://flight-bot.com',
    siteName: 'Flight-Bot',
    title: 'Flight-Bot | Bot Legal de Alertas de Vuelos Baratos por WhatsApp y Telegram',
    description: 'Bot profesional y legal que monitorea vuelos baratos y boletos de eventos 24/7. Recibe notificaciones instantáneas por WhatsApp y Telegram cuando encuentre ofertas. Perfecto para uso doméstico y personal.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Flight-Bot - Alertas Inteligentes de Vuelos Baratos',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'Flight-Bot Logo',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@flightbot',
    creator: '@flightbot',
    title: 'Flight-Bot | Alertas de Vuelos Baratos por WhatsApp y Telegram',
    description: 'Bot legal que te notifica cuando encuentre vuelos baratos y boletos de eventos. Monitoreo automático 24/7 por WhatsApp y Telegram.',
    images: {
      url: '/twitter-image.png',
      alt: 'Flight-Bot - Alertas Inteligentes de Vuelos',
      width: 1200,
      height: 600,
    },
  },
  alternates: {
    canonical: 'https://flight-bot.com',
    languages: {
      'es-ES': 'https://flight-bot.com',
      'en-US': 'https://flight-bot.com/en',
    },
  },
  category: 'travel',
  classification: 'Travel & Transportation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AppProviders>
          <div className="min-h-screen bg-gray-50">
            <Header />
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <StructuredData />
        </AppProviders>
      </body>
    </html>
  )
}
