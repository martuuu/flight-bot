'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export function CTASection() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          key={t('cta.title')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          {t('cta.title')}
          <span className="block">{t('cta.titleSecond')}</span>
        </motion.h2>
        
        <motion.p 
          key={t('cta.description')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          {t('cta.description')}
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            href="/auth/signup"
            className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2 min-w-[200px] justify-center"
          >
            <motion.span 
              key={t('cta.getStarted')}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t('cta.getStarted')}
            </motion.span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <Link 
            href="/how-it-works"
            className="border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-200 min-w-[200px]"
          >
            <motion.span 
              key={t('cta.howItWorks')}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t('cta.howItWorks')}
            </motion.span>
          </Link>
        </div>

        {/* Features List */}
        <div className="grid sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs text-green-900 font-bold">✓</span>
            </div>
            <div>
              <motion.h4 
                key={t('cta.freeForever')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-white mb-1"
              >
                {t('cta.freeForever')}
              </motion.h4>
              <motion.p 
                key={t('cta.freeDescription')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="text-purple-100 text-sm"
              >
                {t('cta.freeDescription')}
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs text-green-900 font-bold">✓</span>
            </div>
            <div>
              <motion.h4 
                key={t('cta.instantAlerts')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-white mb-1"
              >
                {t('cta.instantAlerts')}
              </motion.h4>
              <motion.p 
                key={t('cta.alertsDescription')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="text-purple-100 text-sm"
              >
                {t('cta.alertsDescription')}
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs text-green-900 font-bold">✓</span>
            </div>
            <div>
              <motion.h4 
                key={t('cta.easySetup')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-white mb-1"
              >
                {t('cta.easySetup')}
              </motion.h4>
              <motion.p 
                key={t('cta.setupDescription')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="text-purple-100 text-sm"
              >
                {t('cta.setupDescription')}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Mobile App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 relative"
        >
          <div className="flex justify-center items-center space-x-4 text-purple-100">
            <Smartphone className="h-6 w-6" />
            <motion.span 
              key={t('cta.availableDevices')}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg"
            >
              {t('cta.availableDevices')}
            </motion.span>
          </div>
          
          {/* Mock phone interface */}
          <div className="mt-8 max-w-sm mx-auto">
            <div className="bg-white rounded-3xl p-2 shadow-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl">✈️</span>
                  </div>
                  <h3 className="font-bold mb-2">Your Alert is Active!</h3>
                  <p className="text-sm text-gray-300">
                    Monitoring: Miami → Punta Cana<br />
                    Budget: Under $400
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
