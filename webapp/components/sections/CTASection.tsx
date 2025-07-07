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
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 
          key={t('cta.title')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          {t('cta.title')}
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
        <div className="flex justify-center items-center mb-12">
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
        </div>
      </motion.div>
    </div>
  )
}
