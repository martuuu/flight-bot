import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProviders } from '../components/providers'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/ui/Header'

export { viewport } from './viewport'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter' 
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://yourdomain.com'),
  title: 'Flight-Bot - Flight Price Alerts',
  description: 'Get notified when flight prices drop. Smart price monitoring for your dream destinations.',
  keywords: ['flights', 'bot', 'travel', 'price alerts', 'cheap flights', 'travel deals'],
  authors: [{ name: 'Martin Navarro' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Flight-Bot - Smart Flight Price Alerts',
    description: 'Never miss a flight deal again. Get instant WhatsApp notifications when prices drop.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flight-Bot - Flight Price Alerts',
    description: 'Smart flight price monitoring with instant notifications',
    images: ['/twitter-image.png'],
  },
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
        </AppProviders>
      </body>
    </html>
  )
}
