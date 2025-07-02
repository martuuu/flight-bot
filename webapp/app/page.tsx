import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { SeeInActionSection } from '@/components/sections/SeeInActionSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Flight-Bot | Bot Legal de Alertas de Vuelos Baratos por WhatsApp y Telegram',
  description: 'Bot automatizado 100% legal que monitorea vuelos baratos y boletos de eventos 24/7. Recibe notificaciones instantáneas por WhatsApp y Telegram. Perfecto para uso doméstico y personal. ¡Nunca pierdas una oferta!',
  keywords: [
    'bot alertas vuelos baratos',
    'notificaciones vuelos whatsapp', 
    'telegram bot vuelos',
    'alertas precio vuelos',
    'bot legal vuelos',
    'monitoreo precios vuelos automatico',
    'ofertas vuelos baratos',
    'bot domestico vuelos',
    'alertas viajes whatsapp telegram',
    'boletos eventos baratos',
    'bot tickets conciertos',
    'alertas entradas eventos'
  ],
  openGraph: {
    title: 'Flight-Bot | Bot Legal de Alertas de Vuelos Baratos',
    description: 'Bot automatizado que monitorea vuelos baratos y eventos 24/7. Notificaciones por WhatsApp y Telegram. 100% legal para uso doméstico.',
    url: 'https://flight-bot.com',
    images: [
      {
        url: '/og-image-home.png',
        width: 1200,
        height: 630,
        alt: 'Flight-Bot - Alertas de Vuelos Baratos por WhatsApp y Telegram'
      }
    ]
  },
  twitter: {
    title: 'Flight-Bot | Alertas de Vuelos Baratos por WhatsApp y Telegram',
    description: 'Bot legal que monitorea vuelos baratos y eventos. Notificaciones automáticas 24/7 por WhatsApp y Telegram.',
    images: ['/twitter-home.png']
  },
  alternates: {
    canonical: 'https://flight-bot.com'
  }
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section with Circular Gradient Background */}
      <section className="relative overflow-hidden bg-white circular-gradient">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <HowItWorksSection />
      </section>

      {/* See In Action Section */}
      <SeeInActionSection />

      {/* Pricing Section */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <TestimonialsSection />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <CTASection />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
