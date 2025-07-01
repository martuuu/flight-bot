import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { SeeInActionSection } from '@/components/sections/SeeInActionSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
