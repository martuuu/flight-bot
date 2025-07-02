import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://flight-bot.com/sitemap.xml',
    host: 'https://flight-bot.com',
  }
}
