import Script from 'next/script'

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Flight-Bot",
    "description": "Bot legal y profesional para alertas de vuelos baratos y boletos de eventos por WhatsApp y Telegram",
    "url": "https://flight-bot.com",
    "logo": "https://flight-bot.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"]
    },
    "areaServed": "Worldwide",
    "serviceType": "Travel Technology",
    "foundingDate": "2024"
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Flight-Bot",
    "description": "Bot de alertas de vuelos baratos por WhatsApp y Telegram",
    "url": "https://flight-bot.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://flight-bot.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Flight-Bot",
    "description": "Bot automatizado legal para monitoreo de precios de vuelos y eventos. Notificaciones por WhatsApp y Telegram.",
    "url": "https://flight-bot.com",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Web, WhatsApp, Telegram",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Servicio gratuito de alertas de vuelos"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "features": [
      "Alertas automáticas de vuelos baratos",
      "Notificaciones por WhatsApp",
      "Notificaciones por Telegram", 
      "Monitoreo 24/7",
      "Uso doméstico y personal",
      "Bot 100% legal",
      "Alertas de boletos de eventos"
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Alertas de Vuelos Baratos por Bot",
    "description": "Servicio automatizado legal que monitorea precios de vuelos y eventos, enviando notificaciones instantáneas por WhatsApp y Telegram",
    "provider": {
      "@type": "Organization",
      "name": "Flight-Bot"
    },
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Alertas",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Alertas de Vuelos Baratos",
            "description": "Monitoreo automático de precios de vuelos con notificaciones por WhatsApp y Telegram"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Alertas de Boletos de Eventos",
            "description": "Notificaciones de disponibilidad y precios de entradas para conciertos y eventos"
          }
        }
      ]
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Es legal usar este bot para alertas de vuelos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, Flight-Bot es completamente legal. Es un servicio automatizado para uso doméstico y personal que consulta información pública de precios de vuelos y eventos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo recibo las alertas de vuelos baratos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Recibes notificaciones instantáneas por WhatsApp y Telegram cuando el bot encuentra vuelos baratos o boletos de eventos que coinciden con tus criterios de búsqueda."
        }
      },
      {
        "@type": "Question",
        "name": "¿El servicio es gratuito?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, ofrecemos un plan gratuito con alertas básicas. También tenemos planes premium con funciones avanzadas para usuarios que necesitan más alertas."
        }
      },
      {
        "@type": "Question",
        "name": "¿Funciona para boletos de conciertos y eventos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, además de vuelos, el bot también monitorea precios y disponibilidad de boletos para conciertos, eventos deportivos y espectáculos."
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
