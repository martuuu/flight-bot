'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Smartphone, Clock, Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const features = [
  {
    icon: Zap,
    titleKey: 'features.instantNotifications.title',
    descriptionKey: 'features.instantNotifications.description',
    bgGradient: 'bg-gradient-to-r from-violet-400 to-purple-400',
  },
  {
    icon: Globe,
    titleKey: 'features.globalCoverage.title',
    descriptionKey: 'features.globalCoverage.description',
    bgGradient: 'bg-gradient-to-r from-blue-400 to-indigo-400',
  },
  {
    icon: Smartphone,
    titleKey: 'features.mobileFirst.title',
    descriptionKey: 'features.mobileFirst.description',
    bgGradient: 'bg-gradient-to-r from-purple-400 to-violet-400',
  },
  {
    icon: Shield,
    titleKey: 'features.privacyProtected.title',
    descriptionKey: 'features.privacyProtected.description',
    bgGradient: 'bg-gradient-to-r from-indigo-400 to-blue-400',
  },
  {
    icon: Clock,
    titleKey: 'features.monitoring247.title',
    descriptionKey: 'features.monitoring247.description',
    bgGradient: 'bg-gradient-to-r from-violet-400 to-purple-400',
  },
  {
    icon: Heart,
    titleKey: 'features.freeForever.title',
    descriptionKey: 'features.freeForever.description',
    bgGradient: 'bg-gradient-to-r from-purple-400 to-indigo-400',
  },
]

export function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.1 }}
        className="text-center mb-16"
      >
        <motion.h2 
          key={t('features.title')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          {t('features.title')}
        </motion.h2>
        <motion.p 
          key={t('features.description')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          {t('features.description')}
        </motion.p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.titleKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.1 }}
            className="group"
          >
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
              {/* Icon */}
              <div className={`${feature.bgGradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <motion.h3 
                key={t(feature.titleKey)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-semibold text-gray-900 mb-3"
              >
                {t(feature.titleKey)}
              </motion.h3>
              <motion.p 
                key={t(feature.descriptionKey)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="text-gray-600 leading-relaxed"
              >
                {t(feature.descriptionKey)}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true, amount: 0.1 }}
        className="text-center mt-16"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
          {/* Circular pattern background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute top-12 right-8 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="absolute bottom-8 left-12 w-24 h-24 bg-white/8 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <motion.h3 
              key={t('features.cta.title')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold mb-4"
            >
              {t('features.cta.title')}
            </motion.h3>
            <motion.p 
              key={t('features.cta.description')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-purple-100 mb-6 max-w-2xl mx-auto"
            >
              {t('features.cta.description')}
            </motion.p>
            <motion.button 
              key={t('features.cta.button')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              {t('features.cta.button')}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
