'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Menu, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { useLanguage } from '@/contexts/LanguageContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const navigation = [
  { name: 'nav.features', href: '#features' },
  { name: 'nav.howItWorks', href: '#how-it-works' },
  { name: 'nav.pricing', href: '#pricing' },
  { name: 'nav.testimonials', href: '#testimonials' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()
  const breakpoint = useBreakpoint()
  const pathname = usePathname()
  
  // Solo mostrar en la homepage/landing page
  if (pathname !== '/') {
    return null
  }

  // Solo mostrar el logo en desktop
  const showLogo = breakpoint === 'desktop'

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo - Solo visible en desktop */}
        {showLogo && (
          <Link href="/" className="flex items-center space-x-3 z-10">
            <div className="bg-gradient-purple p-2 rounded-xl">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient z-10">Flight-Bot</span>
          </Link>
        )}

        {/* Spacer for mobile/tablet when logo is hidden */}
        {!showLogo && <div></div>}

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <motion.span
                key={t(item.name)}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {t(item.name)}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <LanguageSelector />
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-gray-700 hover:text-purple-600 transition-colors"
          >
            <motion.span
              key={t('nav.login')}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t('nav.login')}
            </motion.span>
          </Link>
          <Link
            href="/auth/signup"
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center space-x-1"
          >
            <motion.span
              key={t('nav.getStarted')}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t('nav.getStarted')}
            </motion.span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm shadow-2xl"
            >
              <div className="relative h-full">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-3">
                    <div className="bg-gradient-purple p-2 rounded-xl">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gradient">Flight-Bot</span>
                  </Link>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-100 transition-all duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(item.name)}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="py-6 space-y-4">
                      <div className="flex justify-center mb-4">
                        <LanguageSelector />
                      </div>
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="btn-primary w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{t('nav.getStarted')}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
