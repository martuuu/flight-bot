'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, Gift } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const plans = [
  {
    name: 'pricing.free.title',
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: 'forever',
    description: 'pricing.free.description',
    icon: Gift,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    features: [
      'pricing.free.features.alerts',
      'pricing.free.features.checks',
      'pricing.free.features.notifications',
      'pricing.free.features.tracking',
      'pricing.free.features.support',
    ],
    limitations: [],
    cta: 'pricing.startFree',
    popular: false,
  },
  {
    name: 'pricing.traveler.title',
    monthlyPrice: 4,
    yearlyPrice: 40,
    period: 'month',
    description: 'pricing.traveler.description',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    features: [
      'pricing.traveler.features.alerts',
      'pricing.traveler.features.checks',
      'pricing.traveler.features.monthly',
      'pricing.traveler.features.predictions',
      'pricing.traveler.features.priority',
      'pricing.traveler.features.support',
    ],
    limitations: [],
    cta: 'pricing.startTrial',
    popular: true,
  },
  {
    name: 'pricing.explorer.title',
    monthlyPrice: 7,
    yearlyPrice: 63,
    period: 'month',
    description: 'pricing.explorer.description',
    icon: Crown,
    color: 'text-gold-600',
    bgColor: 'bg-yellow-100',
    features: [
      'pricing.explorer.features.alerts',
      'pricing.explorer.features.checks',
      'pricing.explorer.features.historical',
      'pricing.explorer.features.ai',
      'pricing.explorer.features.miles',
      'pricing.explorer.features.events',
      'pricing.explorer.features.products',
      'pricing.explorer.features.support',
      'pricing.explorer.features.early',
      'pricing.explorer.features.more',
    ],
    limitations: [],
    cta: 'pricing.startTrial',
    popular: false,
  },
]

const faqs = [
  {
    question: 'pricing.faq.question1',
    answer: 'pricing.faq.answer1',
  },
  {
    question: 'pricing.faq.question2',
    answer: 'pricing.faq.answer2',
  },
  {
    question: 'pricing.faq.question3',
    answer: 'pricing.faq.answer3',
  },
  {
    question: 'pricing.faq.question4',
    answer: 'pricing.faq.answer4',
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true) // Inicializar con valores anuales
  const { t } = useLanguage()

  const getYearlyDiscount = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return 0
    return plan.monthlyPrice * 12 - plan.yearlyPrice
  }

  return (
    <section className="py-20 bg-white" id="pricing">
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
            key={t('pricing.title')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            {t('pricing.title')}
          </motion.h2>
          <motion.p 
            key={t('pricing.description')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('pricing.description')}
          </motion.p>
          
          {/* Yearly Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <motion.span 
              key={t('pricing.monthly')}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-sm mr-3 ${!isYearly ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
            >
              {t('pricing.monthly')}
            </motion.span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                id="yearly-toggle"
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
              />
              <label htmlFor="yearly-toggle" className="flex items-center cursor-pointer">
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${isYearly ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>
            <motion.span 
              key={t('pricing.yearly')}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-sm ml-3 ${isYearly ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
            >
              {t('pricing.yearly')}
            </motion.span>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
              {t('pricing.save')}
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-purple-200 shadow-purple-100/50' 
                  : 'border-gray-100'
              }`}
            >
                  {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <motion.span
                      key={t('pricing.mostPopular')}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {t('pricing.mostPopular')}
                    </motion.span>
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`${plan.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(plan.name)}</h3>
                  <p className="text-gray-600 mb-4">{t(plan.description)}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      {plan.monthlyPrice === 0 ? (
                        <span className="text-5xl font-bold text-gray-900">{t('pricing.free.price')}</span>
                      ) : (
                        <>
                          <motion.span 
                            key={isYearly ? 'yearly' : 'monthly'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-5xl font-bold text-gray-900"
                          >
                            ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                          </motion.span>
                          <span className="text-gray-600 ml-2 text-lg">/month</span>
                        </>
                      )}
                    </div>
                    
                    {/* Yearly pricing info */}
                    {plan.monthlyPrice > 0 && (
                      <div className="mt-2">
                        {isYearly ? (
                          <p className="text-sm text-gray-500">
                            {t('pricing.billed')} ${plan.yearlyPrice} {t('pricing.yearly').toLowerCase()}
                          </p>
                        ) : (
                          <p className="text-sm text-green-600 font-semibold">
                            {t('pricing.saveWith')} ${getYearlyDiscount(plan)} {t('pricing.withYearly')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      </div>
                      <span className="text-gray-700 text-sm">{t(feature)}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button 
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {t(plan.cta)}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <motion.h3 
              key={t('pricing.faq.title') || 'faq-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {t('pricing.faq.title') || 'Frequently Asked Questions'}
            </motion.h3>
            <motion.p 
              key={t('pricing.faq.subtitle') || 'faq-subtitle'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              {t('pricing.faq.subtitle') || 'Got questions? We\'ve got answers.'}
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.1 }}
                className="relative bg-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-violet-500/5 to-indigo-500/8 opacity-100 transition-opacity duration-300"></div>
                
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500"></div>
                
                {/* Side accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-violet-500 to-indigo-500 opacity-60"></div>
                
                <div className="relative z-10">
                  {/* Question with icon */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-700 transition-colors duration-300">
                      {t(faq.question)}
                    </h4>
                  </div>
                  
                  {/* Answer */}
                  <div className="ml-11">
                    <p className="text-gray-600 leading-relaxed">{t(faq.answer)}</p>
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full opacity-40"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
