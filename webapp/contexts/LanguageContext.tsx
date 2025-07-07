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
    'hero.title.never': 'The Ultimate Bot for',
    'hero.title.flightDeal': 'Cheap Flights',
    'hero.title.milesDeal': 'Miles Promos',
    'hero.title.eventDeal': 'Sports Events',
    'hero.title.offer': 'Product Stock',
    'hero.description': 'Get instant WhatsApp and Telegram notifications so you never miss that flight deal or that awaited event.',
    'hero.stats.users': '1,000+ Users',
    'hero.stats.savings': 'Instant Cross-Platform Alerts',
    'hero.stats.alerts': '4.9/5 Rating',
    'hero.cta.startFree': 'Start Free',
    'hero.cta.watchDemo': 'Watch Demo',
    'hero.trustIndicators.title': 'Trusted by travelers worldwide',
    
    // Features Section
    'features.title': 'Why Choose Flight-Bot?',
    'features.description': 'We\'ve built the smartest flight price monitoring system to help you travel more for less. You choose the filters and search parameters and we take care of notifying you.',
    'features.instantNotifications.title': 'Instant Notifications',
    'features.instantNotifications.description': 'Get Telegram or WhatsApp alerts the moment prices drop, so you never miss a deal.',
    'features.globalCoverage.title': 'Global Coverage',
    'features.globalCoverage.description': 'Monitor flights and events worldwide with real-time data from multiple airlines.',
    'features.mobileFirst.title': 'Mobile Design',
    'features.mobileFirst.description': 'We have our own App with a very intuitive interface.',
    'features.privacyProtected.title': 'Privacy Protected',
    'features.privacyProtected.description': 'Your data is secure. We only send you flight deals or events, nothing else.',
    'features.monitoring247.title': '24/7 Monitoring',
    'features.monitoring247.description': 'Our system works around the clock, even when you\'re sleeping.',
    'features.freeForever.title': 'Free Forever',
    'features.freeForever.description': 'Core features are completely free. No hidden fees, ever.',
    'features.cta.title': 'Ready to Start?',
    'features.cta.description': 'Join the community of users who use Flight-Bot to find the best flight deals and events.',
    'features.cta.button': 'Get Started Free',
    
    // How It Works
    'howItWorks.title': 'How It Works',
    'howItWorks.description': 'Getting flight deals is so easy. Set up your alerts in minutes and start saving.',
    'howItWorks.step1.title': 'Define Your Parameters',
    'howItWorks.step1.description': 'Choose your event type: alerts for deals or promotions, event tickets and more.',
    'howItWorks.step2.title': 'Get Notified',
    'howItWorks.step2.description': 'Receive instant Telegram or WhatsApp alerts when prices drop below your budget.',
    'howItWorks.step3.title': 'Book & Save',
    'howItWorks.step3.description': 'Click the link in your notification to book directly.',
    'howItWorks.seeInAction': 'See It In Action',
    'howItWorks.exampleDescription': 'Here\'s what a typical flight alert looks like on WhatsApp:',
    'howItWorks.specificDateTitle': 'Specific Date Alert',
    'howItWorks.specificDateDesc': 'Track prices for exact travel dates and get notified when they drop:',
    'howItWorks.monthlyDealTitle': 'Monthly Deal Finder',
    'howItWorks.monthlyDealDesc': 'Get amazing monthly deals without specific dates. Perfect for flexible travelers:',
    'howItWorks.milesPromoTitle': 'Miles Promo Alert',
    'howItWorks.milesPromoDesc': 'Get notified when miles promotions appear at minimum values:',
    
    // See In Action
    'seeInAction.title': 'See Flight-Bot in Action',
    'seeInAction.description': 'Real examples of the notifications you\'ll receive on Telegram and WhatsApp.',
    'seeInAction.startGettingAlerts': 'Start Getting Alerts',
    'seeInAction.joinTravelers': 'Join 1,000+ travelers saving on flights',
    
    // Pricing
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.description': 'Choose the plan that fits your travel style. Start free and upgrade when you need more alerts.',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly',
    'pricing.save': 'Save 40%',
    'pricing.free.title': 'Free',
    'pricing.free.description': 'Perfect for occasional travelers',
    'pricing.free.features.alerts': '3 active alerts per day',
    'pricing.free.features.checks': 'Price checks every 6 hours',
    'pricing.free.features.notifications': 'Telegram & WhatsApp notifications',
    'pricing.free.features.tracking': 'Basic price tracking',
    'pricing.free.features.support': 'Community support',
    'pricing.traveler.title': 'Traveler',
    'pricing.traveler.description': 'Best for regular travelers',
    'pricing.traveler.features.alerts': 'Up to 10 active alerts',
    'pricing.traveler.features.checks': 'Price checks every hour',
    'pricing.traveler.features.monthly': 'Monthly best deals search',
    'pricing.traveler.features.predictions': 'Advanced price predictions',
    'pricing.traveler.features.priority': 'Priority notifications',
    'pricing.traveler.features.support': 'Email support',
    'pricing.explorer.title': 'Explorer',
    'pricing.explorer.description': 'For frequent travelers & travel planners',
    'pricing.explorer.features.alerts': 'Up to 20 active alerts',
    'pricing.explorer.features.checks': 'Price checks every 20 minutes',
    'pricing.explorer.features.historical': '3 months of historical search',
    'pricing.explorer.features.ai': 'AI price recommendations',
    'pricing.explorer.features.miles': 'Frequent flyer mile alerts',
    'pricing.explorer.features.events': 'Event ticket alerts',
    'pricing.explorer.features.products': 'Custom product alerts',
    'pricing.explorer.features.support': 'Priority support',
    'pricing.explorer.features.early': 'Early access to new features',
    'pricing.explorer.features.more': 'And more...',
    'pricing.free.price': 'Free',
    'pricing.billed': 'Billed',
    'pricing.saveWith': 'Save',
    'pricing.withYearly': 'with yearly billing',
    'pricing.billedYearly': 'Billed ${amount} yearly',
    'pricing.saveWithYearly': 'Save ${amount} with yearly billing',
    'pricing.faq.title': 'Frequently Asked Questions',
    'pricing.faq.subtitle': 'Got questions? We\'ve got answers.',
    'pricing.faq.question1': 'How do the flight alerts work?',
    'pricing.faq.answer1': 'Our system continuously monitors flight prices across multiple airlines. When a price drops below your set threshold, you\'ll instantly receive a notification on Telegram or WhatsApp.',
    'pricing.faq.question2': 'Can I use both Telegram and WhatsApp?',
    'pricing.faq.answer2': 'Yes! You can receive notifications on both platforms. Telegram is our primary platform with more features, while WhatsApp is available through our webapp.',
    'pricing.faq.question3': 'What happens if I exceed my alert limit?',
    'pricing.faq.answer3': 'Your existing alerts will continue working, but you won\'t be able to create new ones until you upgrade or remove some existing alerts.',
    'pricing.faq.question4': 'Can I cancel anytime?',
    'pricing.faq.answer4': 'Absolutely! You can cancel your subscription at any time. Your alerts will continue working until the end of your billing period.',
    
    // Testimonials
    'testimonials.title': 'What Our Users Say',
    'testimonials.description': 'Join thousands of happy travelers who have saved money on their flights.',
    'testimonials.saved': 'Saved',
    'testimonials.stats.users': 'Happy Users',
    'testimonials.stats.saved': 'Total Saved',
    'testimonials.stats.deals': 'Deals Found',
    'testimonials.stats.rating': 'User Rating',
    
    // CTA Section
    'cta.title': 'Ready to Start?',
    'cta.description': 'Join the community of users who use Flight-Bot to find the best flight deals and events.',
    'cta.getStarted': 'Get Started Free',
    
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
    'hero.title.never': 'El Bot definitivo para',
    'hero.title.flightDeal': 'Vuelos baratos',
    'hero.title.milesDeal': 'Promos con Millas',
    'hero.title.eventDeal': 'Eventos Deportivos',
    'hero.title.offer': 'Stock de productos',
    'hero.description': 'Notificaciones instantáneas por medio de WhatsApp y Telegram para no perderte nunca ese vuelo en oferta o ese evento esperado.',
    'hero.stats.users': '1,000+ Usuarios',
    'hero.stats.savings': 'Alertas Instantáneas Multiplataforma',
    'hero.stats.alerts': '4.9/5 Calificación',
    'hero.cta.startFree': 'Comenzar Gratis',
    'hero.cta.watchDemo': 'Ver Demo',
    'hero.trustIndicators.title': 'Confiado por viajeros en todo el mundo',
    
    // Features Section
    'features.title': '¿Por Qué Elegir Flight-Bot?',
    'features.description': 'Hemos construido el sistema de monitoreo de precios de vuelos más inteligente para ayudarte a viajar más por menos. Vos elegis los filtros y parametros de tu busqueda y nosotros nos encargamos de avisarte.',
    'features.instantNotifications.title': 'Notificaciones Instantáneas',
    'features.instantNotifications.description': 'Recibe alertas de Telegram o WhatsApp en el momento que los precios bajen, para que nunca te pierdas una oferta.',
    'features.globalCoverage.title': 'Cobertura Global',
    'features.globalCoverage.description': 'Monitorea vuelos y eventos en todo el mundo con datos en tiempo real de múltiples aerolíneas.',
    'features.mobileFirst.title': 'Diseño Móvil',
    'features.mobileFirst.description': 'Tenemos nuestra propia App con una interfaz muy intuitiva.',
    'features.privacyProtected.title': 'Privacidad Protegida',
    'features.privacyProtected.description': 'Tus datos están seguros. Solo te enviamos ofertas de vuelos o eventos, nada más.',
    'features.monitoring247.title': 'Monitoreo 24/7',
    'features.monitoring247.description': 'Nuestro sistema funciona las 24 horas, incluso cuando estás durmiendo.',
    'features.freeForever.title': 'Gratis Para Siempre',
    'features.freeForever.description': 'Las características principales son completamente gratuitas. Sin tarifas ocultas, nunca.',
    'features.cta.title': '¿Listo Para Comenzar?',
    'features.cta.description': 'Unite a la comunidad de usuarios que usan Flight-Bot para encontrar las mejores ofertas de vuelos y eventos.',
    'features.cta.button': 'Comenzar Gratis',
    
    // How It Works
    'howItWorks.title': 'Cómo Funciona',
    'howItWorks.description': 'Conseguir ofertas de vuelos es tan fácil. Configura tus alertas en minutos y empeza a ahorrar.',
    'howItWorks.step1.title': 'Define Tus Parametros',
    'howItWorks.step1.description': 'Elige tu tipo de evento: alertas para ofertas o promociones, tickets de eventos y más.',
    'howItWorks.step2.title': 'Recibe Notificaciones',
    'howItWorks.step2.description': 'Recibe alertas de Telegram o WhatsApp cuando los precios bajen debajo de tu presupuesto.',
    'howItWorks.step3.title': 'Reserva y Ahorra',
    'howItWorks.step3.description': 'Haz clic en el enlace de tu notificación para reservar directamente.',
    'howItWorks.seeInAction': 'Míralo en Acción',
    'howItWorks.exampleDescription': 'Así se ve una alerta típica de vuelo en WhatsApp:',
    'howItWorks.specificDateTitle': 'Alerta de Fecha Específica',
    'howItWorks.specificDateDesc': 'Rastrea precios para fechas exactas de viaje y recibe notificaciones cuando bajen:',
    'howItWorks.monthlyDealTitle': 'Buscador de Ofertas Mensuales',
    'howItWorks.monthlyDealDesc': 'Obtene increíbles ofertas mensuales sin fechas específicas. Perfecto para viajeros flexibles:',
    'howItWorks.milesPromoTitle': 'Alerta de Promos con Millas',
    'howItWorks.milesPromoDesc': 'Recibe notificaciones cuando una promo de millas aparezca a valores mínimos:',
    
    // See In Action
    'seeInAction.title': 'Ve Flight-Bot en Acción',
    'seeInAction.description': 'Ejemplos reales de las notificaciones que recibirás en Telegram y WhatsApp.',
    'seeInAction.startGettingAlerts': 'Comenzar a Recibir Alertas',
    'seeInAction.joinTravelers': 'Únete a 1,000+ viajeros ahorrando en vuelos',
    
    // Pricing
    'pricing.title': 'Precios Simples y Transparentes',
    'pricing.description': 'Elige el plan que se adapte a tu estilo de viaje. Comienza gratis y actualiza cuando necesites más alertas.',
    'pricing.monthly': 'Mensual',
    'pricing.yearly': 'Anual',
    'pricing.save': 'Ahorra 40%',
    'pricing.free.title': 'Gratis',
    'pricing.free.description': 'Perfecto para viajeros ocasionales',
    'pricing.free.features.alerts': '3 alertas activas por día',
    'pricing.free.features.checks': 'Verificación de precios cada 6 horas',
    'pricing.free.features.notifications': 'Notificaciones de Telegram y WhatsApp',
    'pricing.free.features.tracking': 'Seguimiento básico de precios',
    'pricing.free.features.support': 'Soporte de la comunidad',
    'pricing.traveler.title': 'Viajero',
    'pricing.traveler.description': 'Mejor para viajeros regulares',
    'pricing.traveler.features.alerts': 'Hasta 10 alertas activas',
    'pricing.traveler.features.checks': 'Verificación de precios cada hora',
    'pricing.traveler.features.monthly': 'Búsqueda de mejores ofertas mensuales',
    'pricing.traveler.features.predictions': 'Predicciones avanzadas de precios',
    'pricing.traveler.features.priority': 'Notificaciones prioritarias',
    'pricing.traveler.features.support': 'Soporte por email',
    'pricing.explorer.title': 'Explorador',
    'pricing.explorer.description': 'Para viajeros frecuentes y planificadores de viajes',
    'pricing.explorer.features.alerts': 'Hasta 20 alertas activas',
    'pricing.explorer.features.checks': 'Verificación de precios cada 20 minutos',
    'pricing.explorer.features.historical': '3 meses de búsqueda histórica',
    'pricing.explorer.features.ai': 'Recomendaciones de precios con IA',
    'pricing.explorer.features.miles': 'Alertas de millas de viajero frecuente',
    'pricing.explorer.features.events': 'Alertas de boletos de eventos',
    'pricing.explorer.features.products': 'Alertas de productos personalizados',
    'pricing.explorer.features.support': 'Soporte prioritario',
    'pricing.explorer.features.early': 'Acceso anticipado a nuevas funciones',
    'pricing.explorer.features.more': 'Y mas..',
    'pricing.free.price': 'Gratis',
    'pricing.billed': 'Facturado',
    'pricing.saveWith': 'Ahorra',
    'pricing.withYearly': 'con facturación anual',
    'pricing.faq.title': 'Preguntas Frecuentes',
    'pricing.faq.subtitle': '¿Tienes preguntas? Tenemos respuestas.',
    'pricing.faq.question1': '¿Cómo funcionan las alertas de vuelos?',
    'pricing.faq.answer1': 'Nuestro sistema monitorea continuamente los precios de vuelos a través de múltiples aerolíneas. Cuando un precio baja por debajo de tu límite establecido, recibirás instantáneamente una notificación en Telegram o WhatsApp.',
    'pricing.faq.question2': '¿Puedo usar tanto Telegram como WhatsApp?',
    'pricing.faq.answer2': '¡Sí! Puedes recibir notificaciones en ambas plataformas. Telegram es nuestra plataforma principal con más funciones, mientras que WhatsApp está disponible a través de nuestra webapp.',
    'pricing.faq.question3': '¿Qué pasa si excedo mi límite de alertas?',
    'pricing.faq.answer3': 'Tus alertas existentes seguirán funcionando, pero no podrás crear nuevas hasta que actualices o elimines algunas alertas existentes. Puedes pausarlas y crear nuevas.',
    'pricing.faq.question4': '¿Puedo cancelar en cualquier momento?',
    'pricing.faq.answer4': '¡Absolutamente! Puedes cancelar tu suscripción en cualquier momento. Tus alertas seguirán funcionando hasta el final de tu período de facturación.',
    'pricing.startFree': 'Comenzar Gratis',
    'pricing.startTrial': 'Iniciar Prueba de 7 Días',
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
    'cta.title': '¿Listo Para Comenzar?',
    'cta.description': 'Unite a la comunidad de usuarios que usan Flight-Bot para encontrar las mejores ofertas de vuelos y eventos.',
    'cta.getStarted': 'Comenzar Gratis',
    
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
    const userLanguage = navigator.language || navigator.languages?.[0] || 'es'
    return userLanguage.startsWith('es') ? 'es' : 'es' // Default a español
  }
  return 'es' // Default a español
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es') // Default a español

  useEffect(() => {
    // Usar español por defecto
    setLanguage('es')
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
