'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Menu, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
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
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 px-6 py-6 sm:max-w-sm"
            >
              <div className="relative h-full">
                {/* Background decorative elements for mobile menu */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-20 left-8 w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-float"></div>
                  <div className="absolute top-40 right-12 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-float" style={{ animationDelay: '-1s' }}></div>
                  <div className="absolute bottom-40 left-12 w-18 h-18 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-lg opacity-55 animate-float" style={{ animationDelay: '-2s' }}></div>
                  <div className="absolute bottom-20 right-8 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-lg opacity-45 animate-float" style={{ animationDelay: '-3s' }}></div>
                </div>

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
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-white/60 backdrop-blur-sm transition-all duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(item.name)}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="py-6 space-y-4">
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-white/60 backdrop-blur-sm transition-all duration-200"
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
