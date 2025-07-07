'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plane, Bell, Zap, ArrowRight, Star, Users, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'

// Componente basado en el ejemplo de LettersPullUp que me diste
function FlipText({ text, className = '' }: { text: string; className?: string }) {
  const splittedText = text.split('')
  
  const pullupVariant = {
    initial: { y: 10, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  }
  
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  
  return (
    <div className="flex justify-center lg:justify-start">
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          ref={ref}
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? 'animate' : ''}
          custom={i}
          className={cn(
            'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter',
            className
          )}
        >
          {current === ' ' ? <span>&nbsp;</span> : current}
        </motion.div>
      ))}
    </div>
  )
}

export function HeroSection() {
  const { t } = useLanguage()
  const breakpoint = useBreakpoint()
  const [currentVariant, setCurrentVariant] = useState(0)

  // Solo mostrar el logo central en mobile/tablet, no en desktop
  const showCentralLogo = breakpoint !== 'desktop'

  const variants = [
    'hero.title.flightDeal',
    'hero.title.milesDeal',
    'hero.title.eventDeal',
    'hero.title.offer'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVariant((prev) => (prev + 1) % variants.length)
    }, 3000) // Cambia cada 3 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-32 pt-20 sm:pt-16 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Background decorative elements - Multiple smaller circles for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mobile: Multiple smaller circles */}
        <div className="sm:hidden">
          <div className="absolute top-10 left-4 w-20 h-20 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mix-blend-multiply filter blur-lg opacity-40 animate-float"></div>
          <div className="absolute top-24 right-8 w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-lg opacity-35 animate-float" style={{ animationDelay: '-1s' }}></div>
          <div className="absolute top-48 left-12 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-float" style={{ animationDelay: '-2s' }}></div>
          <div className="absolute top-72 right-4 w-18 h-18 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-lg opacity-25 animate-float" style={{ animationDelay: '-3s' }}></div>
          <div className="absolute bottom-48 left-6 w-22 h-22 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-lg opacity-35 animate-float" style={{ animationDelay: '-4s' }}></div>
          <div className="absolute bottom-32 right-12 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-float" style={{ animationDelay: '-5s' }}></div>
          <div className="absolute bottom-64 left-16 w-14 h-14 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-lg opacity-40 animate-float" style={{ animationDelay: '-6s' }}></div>
        </div>
        
        {/* Desktop: Original larger circles */}
        <div className="hidden sm:block">
          <div className="absolute top-20 left-10 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-32 right-10 w-72 h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '-2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '-4s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-56 h-56 lg:w-72 lg:h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '-6s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float" style={{ animationDelay: '-8s' }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header - Solo visible en mobile/tablet */}
        {showCentralLogo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-12 mt-8 sm:mt-0"
          >
            <div className="flex items-center justify-center space-x-3 mb-6 sm:mb-6">
              <div className="bg-gradient-purple p-3 sm:p-3 rounded-2xl sm:rounded-2xl shadow-lg">
                <Plane className="h-8 w-8 sm:h-8 sm:w-8 text-white" />
              </div>
              <span className="text-4xl sm:text-4xl font-bold text-gradient leading-tight">Flight-Bot</span>
            </div>
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 sm:px-4 py-2 sm:py-2 rounded-full border border-purple-200 shadow-sm">
              <motion.span 
                key={t('hero.badge')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm sm:text-sm text-purple-700 font-medium"
              >
                {t('hero.badge')}
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Sin badge para desktop - se muestra solo en el mockup */}

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              <motion.span 
                key={t('hero.title.never')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="block"
              >
                {t('hero.title.never')}
              </motion.span>
              
              <div className="text-gradient min-h-[1.2em] flex items-center justify-center lg:justify-start">
                <AnimatePresence mode="wait">
                  <FlipText
                    key={`${currentVariant}-${t(variants[currentVariant])}`}
                    text={t(variants[currentVariant])}
                    className="text-gradient text-5xl"
                  />
                </AnimatePresence>
              </div>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl">
              {t('hero.description')}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <span className="font-semibold text-sm sm:text-base">{t('hero.stats.users')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <span className="font-semibold text-sm sm:text-base">{t('hero.stats.savings')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <span className="font-semibold text-sm sm:text-base">{t('hero.stats.alerts')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
              <Link 
                href="/auth/signup"
                className="btn-primary group"
              >
                <span>{t('hero.cta.startFree')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/dashboard"
                className="btn-secondary"
              >
                {t('hero.cta.watchDemo')}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="text-center lg:text-left">
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{t('hero.trustIndicators.title')}</p>
              <div className="flex justify-center lg:justify-start items-center space-x-4 opacity-60">
                <span className="text-xs text-gray-400">⭐⭐⭐⭐⭐ 4.9/5 rating</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">$2M+ saved by users</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative mt-8 lg:mt-0"
          >
            {/* Phone Mockup */}
            <div className="relative max-w-xs sm:max-w-sm mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-purple rounded-[2.5rem] sm:rounded-[3rem] blur-xl opacity-20 scale-105"></div>
              
              {/* Phone */}
              <div className="relative bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl">
                <div className="bg-gray-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 min-h-[500px] sm:min-h-[600px]">
                  {/* Status bar */}
                  <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900">9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-3 sm:w-4 h-1.5 sm:h-2 bg-gray-900 rounded-sm"></div>
                      <div className="w-0.5 sm:w-1 h-1.5 sm:h-2 bg-gray-400 rounded-sm"></div>
                      <div className="w-5 sm:w-6 h-1.5 sm:h-2 bg-gray-900 rounded-sm"></div>
                    </div>
                  </div>

                  {/* App content - Usando el estilo del hero cuando es desktop */}
                  <div className="text-center mb-6 sm:mb-8">
                    {breakpoint === 'desktop' ? (
                      // Desktop: Logo con gradiente como el del hero
                      <>
                        <div className="bg-gradient-purple p-4 sm:p-5 rounded-2xl sm:rounded-3xl inline-block mb-4 shadow-xl">
                          <Plane className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-2">Flight-Bot</h3>
                        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-violet-100 px-3 py-1.5 rounded-full border border-purple-200 shadow-sm">
                          <span className="text-purple-700 font-medium text-xs">{t('hero.badge')}</span>
                        </div>
                      </>
                    ) : (
                      // Mobile/Tablet: Estilo original
                      <>
                        <div className="bg-gradient-purple p-3 sm:p-4 rounded-xl sm:rounded-2xl inline-block mb-3 sm:mb-4 shadow-lg">
                          <Plane className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Flight-Bot</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">Smart Price Alerts</p>
                      </>
                    )}
                  </div>

                  {/* Alert card */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-green-600">Price Drop Alert!</span>
                      <span className="text-xs text-gray-500">2m ago</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">NYC → Miami</p>
                      <p className="text-xs sm:text-sm text-gray-600">March 15-22</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base sm:text-lg font-bold text-purple-600">$180</span>
                        <span className="text-xs sm:text-sm text-green-600">Save $120!</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-purple-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                      <p className="text-xs text-gray-600">Active Alerts</p>
                      <p className="font-bold text-purple-600 text-sm sm:text-base">5</p>
                    </div>
                    <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                      <p className="text-xs text-gray-600">Money Saved</p>
                      <p className="font-bold text-green-600 text-sm sm:text-base">$450</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
