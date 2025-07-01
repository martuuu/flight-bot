'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traducciones
const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.howItWorks': 'How it Works',
    'nav.pricing': 'Pricing',
    'nav.testimonials': 'Testimonials',
    'nav.login': 'Log in',
    'nav.getStarted': 'Get Started',
    
    // Hero Section
    'hero.badge': '🚀 Smart Flight Alerts',
    'hero.title.never': 'Never Miss a',
    'hero.title.flightDeal': 'Flight Deal',
    'hero.title.milesDeal': 'Miles Promo',
    'hero.title.eventDeal': 'Event',
    'hero.title.offer': 'Great Offer',
    'hero.title.again': 'Again',
    'hero.description': 'Get instant WhatsApp and Telegram notifications when flight prices drop to your dream destinations. Set your budget, relax, and let us find the best deals for you.',
    'hero.stats.users': '10,000+ Users',
    'hero.stats.savings': '$2M+ Saved',
    'hero.stats.alerts': '50K+ Alerts Sent',
    'hero.cta.startFree': 'Start Free',
    'hero.cta.watchDemo': 'Watch Demo',
    'hero.trustIndicators.title': 'Trusted by travelers worldwide',
    
    // Features Section
    'features.title': 'Why Choose Flight-Bot?',
    'features.description': 'We\'ve built the smartest flight price monitoring system to help you travel more for less.',
    'features.instantNotifications.title': 'Instant Notifications',
    'features.instantNotifications.description': 'Get Telegram or WhatsApp alerts the moment prices drop, so you never miss a deal.',
    'features.globalCoverage.title': 'Global Coverage',
    'features.globalCoverage.description': 'Monitor flights worldwide with real-time data from multiple airlines.',
    'features.mobileFirst.title': 'Mobile First',
    'features.mobileFirst.description': 'Designed for mobile with a beautiful, intuitive interface.',
    'features.privacyProtected.title': 'Privacy Protected',
    'features.privacyProtected.description': 'Your data is secure. We only send you flight deals, nothing else.',
    'features.monitoring247.title': '24/7 Monitoring',
    'features.monitoring247.description': 'Our system works around the clock, even when you\'re sleeping.',
    'features.freeForever.title': 'Free Forever',
    'features.freeForever.description': 'Core features are completely free. No hidden fees, ever.',
    'features.cta.title': 'Ready to Start Saving on Flights?',
    'features.cta.description': 'Join thousands of smart travelers who use Flight-Bot to find the best flight deals.',
    'features.cta.button': 'Get Started Free',
    
    // How It Works
    'howItWorks.title': 'How It Works',
    'howItWorks.description': 'Getting flight deals is as easy as 1-2-3. Set up your alerts in minutes and start saving.',
    'howItWorks.step1.title': 'Set Your Route',
    'howItWorks.step1.description': 'Choose your departure and destination cities, plus your budget.',
    'howItWorks.step2.title': 'Get Notified',
    'howItWorks.step2.description': 'Receive instant Telegram or WhatsApp alerts when prices drop below your budget.',
    'howItWorks.step3.title': 'Book & Save',
    'howItWorks.step3.description': 'Click the link in your notification to book directly with the airline.',
    'howItWorks.seeInAction': 'See It In Action',
    'howItWorks.exampleDescription': 'Here\'s what a typical flight alert looks like on WhatsApp:',
    'howItWorks.specificDateTitle': 'Specific Date Alert',
    'howItWorks.specificDateDesc': 'Track prices for exact travel dates and get notified when they drop:',
    'howItWorks.monthlyDealTitle': 'Monthly Deal Finder',
    'howItWorks.monthlyDealDesc': 'Get amazing monthly deals without specific dates. Perfect for flexible travelers:',
    
    // See In Action
    'seeInAction.title': 'See Flight-Bot in Action',
    'seeInAction.description': 'Real examples of the notifications you\'ll receive on Telegram and WhatsApp.',
    'seeInAction.startGettingAlerts': 'Start Getting Alerts',
    'seeInAction.joinTravelers': 'Join 10,000+ travelers saving on flights',
    
    // Pricing
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.description': 'Choose the plan that fits your travel style. Start free and upgrade when you need more alerts.',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly',
    'pricing.save': 'Save 40%',
    'pricing.free.title': 'Free',
    'pricing.free.description': 'Perfect for occasional travelers',
    'pricing.traveler.title': 'Traveler',
    'pricing.traveler.description': 'Best for regular travelers',
    'pricing.explorer.title': 'Explorer',
    'pricing.explorer.description': 'For frequent travelers & travel planners',
    'pricing.billedYearly': 'Billed ${amount} yearly',
    'pricing.saveWithYearly': 'Save ${amount} with yearly billing',
    'pricing.faq.title': 'Frequently Asked Questions',
    'pricing.faq.subtitle': 'Got questions? We\'ve got answers.',
    'pricing.startFree': 'Start Free',
    'pricing.startTrial': 'Start 7-Day Trial',
    'pricing.mostPopular': 'Most Popular',
    
    // Testimonials
    'testimonials.title': 'What Our Users Say',
    'testimonials.description': 'Join thousands of happy travelers who have saved money on their flights.',
    'testimonials.saved': 'Saved',
    'testimonials.stats.users': 'Happy Users',
    'testimonials.stats.saved': 'Total Saved',
    'testimonials.stats.deals': 'Deals Found',
    'testimonials.stats.rating': 'User Rating',
    
    // CTA Section
    'cta.title': 'Ready to Start',
    'cta.titleSecond': 'Saving on Flights?',
    'cta.description': 'Join thousands of smart travelers who never pay full price for flights. Set up your first alert in less than 2 minutes.',
    'cta.getStarted': 'Get Started Free',
    'cta.howItWorks': 'How It Works',
    'cta.freeForever': 'Free Forever',
    'cta.freeDescription': 'No hidden fees or subscription costs',
    'cta.instantAlerts': 'Instant Alerts',
    'cta.alertsDescription': 'WhatsApp notifications in real-time',
    'cta.easySetup': 'Easy Setup',
    'cta.setupDescription': 'Create alerts in under 2 minutes',
    'cta.availableDevices': 'Available on all devices',
    
    // Footer
    'footer.description': 'Smart flight price monitoring with instant WhatsApp notifications. Never miss a deal again.',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.howItWorks': 'How It Works',
    'footer.pricing': 'Pricing',
    'footer.destinations': 'Popular Destinations',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.contact': 'Contact Us',
    'footer.faq': 'FAQ',
    'footer.status': 'Service Status',
    'footer.contactTitle': 'Contact',
    'footer.email': 'support@flight-bot.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.address': '123 Travel Street, Miami, FL 33101',
    'footer.copyright': '© 2025 Flight-Bot. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',

    // Common
    'common.forever': 'forever',
    'common.month': 'month',
  },
  es: {
    // Navigation
    'nav.features': 'Características',
    'nav.howItWorks': 'Cómo Funciona',
    'nav.pricing': 'Precios',
    'nav.testimonials': 'Testimonios',
    'nav.login': 'Iniciar Sesión',
    'nav.getStarted': 'Comenzar',
    
    // Hero Section
    'hero.badge': '🚀 Alertas Inteligentes de Vuelos',
    'hero.title.never': 'Nunca Te Pierdas',
    'hero.title.flightDeal': 'Un Vuelo Barato',
    'hero.title.milesDeal': 'Una Promo de Millas',
    'hero.title.eventDeal': 'Un Evento',
    'hero.title.offer': 'Una Oferta',
    'hero.title.again': 'De Nuevo',
    'hero.description': 'Recibe notificaciones instantáneas de WhatsApp y Telegram cuando los precios de vuelos bajen a tus destinos soñados. Define tu presupuesto, relájate y déjanos encontrar las mejores ofertas para ti.',
    'hero.stats.users': '10,000+ Usuarios',
    'hero.stats.savings': '$2M+ Ahorrados',
    'hero.stats.alerts': '50K+ Alertas Enviadas',
    'hero.cta.startFree': 'Comenzar Gratis',
    'hero.cta.watchDemo': 'Ver Demo',
    'hero.trustIndicators.title': 'Confiado por viajeros en todo el mundo',
    
    // Features Section
    'features.title': '¿Por Qué Elegir Flight-Bot?',
    'features.description': 'Hemos construido el sistema de monitoreo de precios de vuelos más inteligente para ayudarte a viajar más por menos.',
    'features.instantNotifications.title': 'Notificaciones Instantáneas',
    'features.instantNotifications.description': 'Recibe alertas de Telegram o WhatsApp en el momento que los precios bajen, para que nunca te pierdas una oferta.',
    'features.globalCoverage.title': 'Cobertura Global',
    'features.globalCoverage.description': 'Monitorea vuelos en todo el mundo con datos en tiempo real de múltiples aerolíneas.',
    'features.mobileFirst.title': 'Diseño Móvil',
    'features.mobileFirst.description': 'Diseñado para móviles con una interfaz hermosa e intuitiva.',
    'features.privacyProtected.title': 'Privacidad Protegida',
    'features.privacyProtected.description': 'Tus datos están seguros. Solo te enviamos ofertas de vuelos, nada más.',
    'features.monitoring247.title': 'Monitoreo 24/7',
    'features.monitoring247.description': 'Nuestro sistema funciona las 24 horas, incluso cuando estás durmiendo.',
    'features.freeForever.title': 'Gratis Para Siempre',
    'features.freeForever.description': 'Las características principales son completamente gratuitas. Sin tarifas ocultas, nunca.',
    'features.cta.title': '¿Listo Para Comenzar a Ahorrar en Vuelos?',
    'features.cta.description': 'Únete a miles de viajeros inteligentes que usan Flight-Bot para encontrar las mejores ofertas de vuelos.',
    'features.cta.button': 'Comenzar Gratis',
    
    // How It Works
    'howItWorks.title': 'Cómo Funciona',
    'howItWorks.description': 'Conseguir ofertas de vuelos es tan fácil como 1-2-3. Configura tus alertas en minutos y comienza a ahorrar.',
    'howItWorks.step1.title': 'Define Tu Ruta',
    'howItWorks.step1.description': 'Elige tus ciudades de origen y destino, además de tu presupuesto.',
    'howItWorks.step2.title': 'Recibe Notificaciones',
    'howItWorks.step2.description': 'Recibe alertas instantáneas de Telegram o WhatsApp cuando los precios bajen debajo de tu presupuesto.',
    'howItWorks.step3.title': 'Reserva y Ahorra',
    'howItWorks.step3.description': 'Haz clic en el enlace de tu notificación para reservar directamente con la aerolínea.',
    'howItWorks.seeInAction': 'Míralo en Acción',
    'howItWorks.exampleDescription': 'Así se ve una alerta típica de vuelo en WhatsApp:',
    'howItWorks.specificDateTitle': 'Alerta de Fecha Específica',
    'howItWorks.specificDateDesc': 'Rastrea precios para fechas exactas de viaje y recibe notificaciones cuando bajen:',
    'howItWorks.monthlyDealTitle': 'Buscador de Ofertas Mensuales',
    'howItWorks.monthlyDealDesc': 'Obtén increíbles ofertas mensuales sin fechas específicas. Perfecto para viajeros flexibles:',
    
    // See In Action
    'seeInAction.title': 'Ve Flight-Bot en Acción',
    'seeInAction.description': 'Ejemplos reales de las notificaciones que recibirás en Telegram y WhatsApp.',
    'seeInAction.startGettingAlerts': 'Comenzar a Recibir Alertas',
    'seeInAction.joinTravelers': 'Únete a 10,000+ viajeros ahorrando en vuelos',
    
    // Pricing
    'pricing.title': 'Precios Simples y Transparentes',
    'pricing.description': 'Elige el plan que se adapte a tu estilo de viaje. Comienza gratis y actualiza cuando necesites más alertas.',
    'pricing.monthly': 'Mensual',
    'pricing.yearly': 'Anual',
    'pricing.save': 'Ahorra 40%',
    'pricing.free.title': 'Gratis',
    'pricing.free.description': 'Perfecto para viajeros ocasionales',
    'pricing.traveler.title': 'Viajero',
    'pricing.traveler.description': 'Mejor para viajeros regulares',
    'pricing.explorer.title': 'Explorador',
    'pricing.explorer.description': 'Para viajeros frecuentes y planificadores de viajes',
    'pricing.billedYearly': 'Facturado ${amount} anualmente',
    'pricing.saveWithYearly': 'Ahorra ${amount} con facturación anual',
    'pricing.faq.title': 'Preguntas Frecuentes',
    'pricing.faq.subtitle': '¿Tienes preguntas? Tenemos respuestas.',
    'pricing.startFree': 'Comenzar Gratis',
    'pricing.startTrial': 'Comenzar Prueba de 7 Días',
    'pricing.mostPopular': 'Más Popular',
    
    // Testimonials
    'testimonials.title': 'Lo Que Dicen Nuestros Usuarios',
    'testimonials.description': 'Únete a miles de viajeros felices que han ahorrado dinero en sus vuelos.',
    'testimonials.saved': 'Ahorró',
    'testimonials.stats.users': 'Usuarios Felices',
    'testimonials.stats.saved': 'Total Ahorrado',
    'testimonials.stats.deals': 'Ofertas Encontradas',
    'testimonials.stats.rating': 'Calificación',
    
    // CTA Section
    'cta.title': '¿Listo Para Comenzar a',
    'cta.titleSecond': 'Ahorrar en Vuelos?',
    'cta.description': 'Únete a miles de viajeros inteligentes que nunca pagan el precio completo por los vuelos. Configura tu primera alerta en menos de 2 minutos.',
    'cta.getStarted': 'Comenzar Gratis',
    'cta.howItWorks': 'Cómo Funciona',
    'cta.freeForever': 'Gratis Para Siempre',
    'cta.freeDescription': 'Sin tarifas ocultas ni costos de suscripción',
    'cta.instantAlerts': 'Alertas Instantáneas',
    'cta.alertsDescription': 'Notificaciones de WhatsApp en tiempo real',
    'cta.easySetup': 'Configuración Fácil',
    'cta.setupDescription': 'Crea alertas en menos de 2 minutos',
    'cta.availableDevices': 'Disponible en todos los dispositivos',
    
    // Footer
    'footer.description': 'Monitoreo inteligente de precios de vuelos con notificaciones instantáneas de WhatsApp. Nunca te pierdas una oferta.',
    'footer.product': 'Producto',
    'footer.features': 'Características',
    'footer.howItWorks': 'Cómo Funciona',
    'footer.pricing': 'Precios',
    'footer.destinations': 'Destinos Populares',
    'footer.support': 'Soporte',
    'footer.helpCenter': 'Centro de Ayuda',
    'footer.contact': 'Contáctanos',
    'footer.faq': 'Preguntas Frecuentes',
    'footer.status': 'Estado del Servicio',
    'footer.contactTitle': 'Contacto',
    'footer.email': 'soporte@flight-bot.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.address': '123 Travel Street, Miami, FL 33101',
    'footer.copyright': '© 2025 Flight-Bot. Todos los derechos reservados.',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.cookies': 'Política de Cookies',

    // Common
    'common.forever': 'para siempre',
    'common.month': 'mes',
  }
}

// Función para detectar idioma por ubicación
const detectLanguageByLocation = (): Language => {
  if (typeof navigator !== 'undefined') {
    const userLanguage = navigator.language || navigator.languages?.[0] || 'en'
    return userLanguage.startsWith('es') ? 'es' : 'en'
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Detectar idioma automáticamente al cargar
    const detectedLanguage = detectLanguageByLocation()
    setLanguage(detectedLanguage)
  }, [])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
