'use client'

import { motion } from 'framer-motion'
import { Search, Bell, Plane, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const steps = [
  {
    icon: Search,
    titleKey: 'howItWorks.step1.title',
    descriptionKey: 'howItWorks.step1.description',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    step: '01',
  },
  {
    icon: Bell,
    titleKey: 'howItWorks.step2.title',
    descriptionKey: 'howItWorks.step2.description',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    step: '02',
  },
  {
    icon: Plane,
    titleKey: 'howItWorks.step3.title',
    descriptionKey: 'howItWorks.step3.description',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    step: '03',
  },
]

export function HowItWorksSection() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.h2 
          key={t('howItWorks.title')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          {t('howItWorks.title')}
        </motion.h2>
        <motion.p 
          key={t('howItWorks.description')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          {t('howItWorks.description')}
        </motion.p>
      </motion.div>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, index) => (
          <motion.div
            key={step.titleKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative text-center"
          >
            {/* Connection Line (hidden on mobile) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform translate-x-4 lg:translate-x-12 z-0"></div>
            )}

            {/* Step Card */}
            <div className="relative z-10 bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  {step.step}
                </div>
              </div>

              {/* Icon */}
              <div className={`${step.bgColor} w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6`}>
                <step.icon className={`h-10 w-10 ${step.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <motion.h3 
                  key={t(step.titleKey)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-semibold text-gray-900 mb-4"
                >
                  {t(step.titleKey)}
                </motion.h3>
                <motion.p 
                  key={t(step.descriptionKey)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="text-gray-600 leading-relaxed"
                >
                  {t(step.descriptionKey)}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Example Alert Cards */}
      <div className="mt-20 grid md:grid-cols-2 gap-8">
        {/* Specific Date Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white h-full flex flex-col min-h-[480px]">
            {/* Circular pattern background - Unique pattern for first card */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-6 left-6 w-28 h-28 bg-white/12 rounded-full"></div>
              <div className="absolute top-16 right-12 w-16 h-16 bg-white/6 rounded-full"></div>
              <div className="absolute bottom-12 left-16 w-20 h-20 bg-white/9 rounded-full"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/8 rounded-full"></div>
              <div className="absolute top-1/3 left-1/4 w-36 h-36 bg-white/4 rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/7 rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center flex-1 flex flex-col">
              <motion.h3 
                key={t('howItWorks.specificDateTitle') || 'specific-date-title'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold mb-4"
              >
                {t('howItWorks.specificDateTitle') || 'Specific Date Alert'}
              </motion.h3>
              <motion.p 
                key={t('howItWorks.specificDateDesc') || 'specific-date-desc'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-purple-100 mb-8 max-w-2xl mx-auto"
              >
                {t('howItWorks.specificDateDesc') || 'Track prices for exact travel dates and get notified when they drop:'}
              </motion.p>
              
              {/* WhatsApp Message Mockup - Specific Date */}
              <div className="bg-white rounded-xl p-6 text-left w-full max-w-sm mx-auto shadow-lg mt-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Flight-Bot Alerts</div>
                    <div className="text-sm text-gray-500">Just now</div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-gray-900">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Price Alert!</span>
                  </div>
                  <p className="text-sm mb-2">
                    <strong>Miami → Punta Cana</strong><br />
                    March 15, 2025
                  </p>
                  <p className="text-lg font-bold text-green-600 mb-2">$329 USD</p>
                  <p className="text-xs text-gray-600 mb-3">
                    Down from $450 → You save $121!
                  </p>
                  <button className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Deal Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white h-full flex flex-col min-h-[480px]">
            {/* Circular pattern background - Unique pattern for second card */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-8 left-8 w-24 h-24 bg-white/8 rounded-full"></div>
              <div className="absolute top-4 right-6 w-32 h-32 bg-white/6 rounded-full"></div>
              <div className="absolute bottom-16 left-4 w-18 h-18 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-8 right-10 w-20 h-20 bg-white/9 rounded-full"></div>
              <div className="absolute top-2/3 left-2/3 w-28 h-28 bg-white/5 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-white/11 rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-22 h-22 bg-white/7 rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center flex-1 flex flex-col">
              <motion.h3 
                key={t('howItWorks.monthlyDealTitle') || 'monthly-deal-title'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold mb-4"
              >
                {t('howItWorks.monthlyDealTitle') || 'Monthly Deal Finder'}
              </motion.h3>
              <motion.p 
                key={t('howItWorks.monthlyDealDesc') || 'monthly-deal-desc'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-purple-100 mb-8 max-w-2xl mx-auto"
              >
                {t('howItWorks.monthlyDealDesc') || 'Get amazing monthly deals without specific dates. Perfect for flexible travelers:'}
              </motion.p>
              
              {/* WhatsApp Message Mockup - Monthly Alert */}
              <div className="bg-white rounded-xl p-6 text-left w-full max-w-sm mx-auto shadow-lg mt-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Flight-Bot Monthly</div>
                    <div className="text-sm text-gray-500">2 hours ago</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-gray-900">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Amazing March Deals! ✈️</span>
                  </div>
                  <p className="text-sm mb-3">
                    <strong>Top European Routes:</strong><br />
                    • NYC → Paris: $398<br />
                    • Miami → Madrid: $445<br />
                    • LA → Rome: $467
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    Flexible dates in March. Limited time offer - ends Feb 28th!
                  </p>
                  <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
                    See All Deals →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
