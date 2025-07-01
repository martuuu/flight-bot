'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Calendar, TrendingDown, Bell, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useState, useEffect } from 'react'

const examples = [
  {
    type: 'specific-date',
    icon: Calendar,
    time: '2 min ago',
    title: 'Specific Date Alert',
    route: 'Miami → Madrid',
    message: '✈️ Your March 15, 2025 alert: Miami → Madrid is now $487 (was $624). Perfect for your vacation!',
    price: '$487',
    originalPrice: '$624',
    savings: '$137',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    type: 'monthly-deals',
    icon: TrendingDown,
    time: '5 min ago',
    title: 'Monthly Best Deals',
    route: 'March 2025 Offers',
    message: '📅 March 2025 best deals:\n• NYC → Paris: $398\n• Miami → Barcelona: $445\n• LA → Tokyo: $567\n\nBook by March 31st!',
    price: 'From $398',
    savings: 'Up to 60% off',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    type: 'price-drop',
    icon: Bell,
    time: '10 min ago', 
    title: 'Price Drop Alert',
    route: 'Bogotá → Paris',
    message: '🚨 PRICE DROP! Your Bogotá → Paris flight just dropped to $542 (was $698). Save $156 now!',
    price: '$542',
    originalPrice: '$698',
    savings: '$156',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    type: 'monthly-alert',
    icon: Calendar,
    time: '1 hour ago',
    title: 'Monthly Alert Active',
    route: 'Any to Europe',
    message: '📊 Your monthly alert "Best Europe deals under $500" is active! We\'ll notify you of the best offers throughout March.',
    price: 'Under $500',
    savings: 'Active monitoring',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
]

export function SeeInActionSection() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const breakpoint = useBreakpoint()

  // Auto-rotate carousel every 5 seconds (only for mobile/tablet)
  useEffect(() => {
    if (breakpoint === 'mobile' || breakpoint === 'tablet') {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % examples.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [breakpoint])

  const currentExample = examples[currentIndex]
  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet'

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            key={t('seeInAction.title')}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            {t('seeInAction.title')}
          </motion.h2>
          <motion.p 
            key={t('seeInAction.description')}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('seeInAction.description')}
          </motion.p>
        </motion.div>

        {/* Responsive Content */}
        {isMobileOrTablet ? (
          /* Mobile/Tablet Carousel */
          <div className="relative max-w-sm mx-auto mb-12">
            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {examples.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Phone Container */}
            <div className="relative">
              {/* Background glow */}
              <motion.div 
                className="absolute inset-0 rounded-[2.5rem] blur-xl opacity-20 scale-105"
                style={{
                  background: `linear-gradient(135deg, ${
                    currentExample.color === 'text-green-600' ? '#10B981' :
                    currentExample.color === 'text-purple-600' ? '#8B5CF6' :
                    currentExample.color === 'text-orange-600' ? '#F97316' :
                    '#2563EB'
                  })`,
                }}
                key={currentIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1.05, opacity: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              
              {/* Phone */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-gray-100 rounded-[2rem] overflow-hidden" style={{ height: '600px' }}>
                  
                  {/* Phone Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-purple">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Flight-Bot</div>
                      <div className="text-xs text-gray-500">Online</div>
                    </div>
                  </div>

                  {/* Message Content with AnimatePresence */}
                  <div className="p-4 flex-1 bg-gray-50 h-full flex flex-col">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.25, 0.46, 0.45, 0.94] // Custom bezier for smooth effect
                        }}
                        className="flex flex-col h-full"
                      >
                        {/* User message */}
                        <motion.div 
                          className="flex justify-end mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <div className="bg-blue-500 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-[250px] text-sm">
                            {currentExample.type === 'monthly-alert' 
                              ? 'Set up monthly alert for Europe deals under $500'
                              : currentExample.type === 'monthly-deals'
                              ? 'Show me best deals for this month 📅'
                              : `Track ${currentExample.route} under ${currentExample.price}`
                            }
                          </div>
                        </motion.div>

                        {/* Bot Response */}
                        <motion.div 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        >
                          <motion.div 
                            className={`${currentExample.bgColor} p-3 rounded-full flex-shrink-0`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <currentExample.icon className={`h-4 w-4 ${currentExample.color}`} />
                          </motion.div>
                          <div className="flex-1">
                            <motion.div 
                              className={`${currentExample.bgColor} border ${currentExample.borderColor} rounded-2xl rounded-bl-md p-4`}
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className={`text-sm font-semibold ${currentExample.color}`}>
                                  {currentExample.title}
                                </span>
                                <span className="text-xs text-gray-500">{currentExample.time}</span>
                              </div>
                              
                              <div className="text-sm text-gray-800 mb-4 whitespace-pre-line leading-relaxed">
                                {currentExample.message}
                              </div>

                              <div className="flex items-center justify-between">
                                <motion.div 
                                  className="text-lg font-bold text-gray-900"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                >
                                  {currentExample.price}
                                </motion.div>
                                <motion.div 
                                  className="text-sm text-gray-600"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.8 }}
                                >
                                  {currentExample.savings}
                                </motion.div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Spacer */}
                        <div className="flex-1 min-h-[100px]"></div>

                        {/* Action Button */}
                        <motion.div
                          className="flex justify-center pt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1, duration: 0.4 }}
                        >
                          <motion.button 
                            className="bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-blue-600 transition-colors shadow-lg"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <span>
                              {currentExample.type === 'monthly-alert' ? 'Manage Alert' : 'View Details'}
                            </span>
                            <ArrowRight className="h-4 w-4" />
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Label with smooth transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center mt-8"
              >
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{currentExample.title}</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  {currentExample.type === 'monthly-alert' ? `${currentExample.route} - Active Monthly Alert` :
                   currentExample.type === 'monthly-deals' ? `${currentExample.route} - March 2025 Monthly Deals` :
                   `${currentExample.route} - ${currentExample.type === 'specific-date' ? 'Specific Date Alert' : 'Price Drop Alert'}`}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Desktop Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {examples.map((example, index) => (
              <motion.div
                key={example.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex flex-col h-full"
              >
                {/* Phone Container */}
                <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl flex flex-col max-w-[280px] mx-auto" style={{ height: '500px' }}>
                  <div className={`bg-white rounded-[1.5rem] overflow-hidden flex flex-col h-full relative`}>
                    
                    {/* Phone Header */}
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-purple">
                        <MessageCircle className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-gray-900">Flight-Bot</div>
                        <div className="text-xs text-gray-500">Online</div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="p-3 flex-1 bg-gray-50 flex flex-col justify-start pt-4">
                      {/* User message */}
                      <div className="flex justify-end mb-3">
                        <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-br-md max-w-[200px] text-xs">
                          {example.type === 'monthly-alert' 
                            ? 'Set up monthly alert for Europe deals under $500'
                            : example.type === 'monthly-deals'
                            ? 'Show me best deals for this month 📅'
                            : `Track ${example.route} under ${example.price}`
                          }
                        </div>
                      </div>

                      {/* Bot Response */}
                      <div className="flex items-start space-x-2 mb-4">
                        <div className={`${example.bgColor} p-2 rounded-full flex-shrink-0`}>
                          <example.icon className={`h-3 w-3 ${example.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`${example.bgColor} border ${example.borderColor} rounded-2xl rounded-bl-md p-3`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-semibold ${example.color}`}>
                                {example.title}
                              </span>
                              <span className="text-xs text-gray-500">{example.time}</span>
                            </div>
                            
                            <div className="text-xs text-gray-800 mb-3 whitespace-pre-line leading-relaxed">
                              {example.message}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm font-bold text-gray-900">{example.price}</div>
                              <div className="text-xs text-gray-600">{example.savings}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Spacer para separar del botón */}
                      <div className="flex-1"></div>

                      {/* Action Button - Separado del contenido */}
                      <div className="pt-2 pb-1">
                        <button className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 hover:bg-blue-600 transition-colors mx-auto">
                          <span>
                            {example.type === 'monthly-alert' ? 'Manage Alert' : 'View Details'}
                          </span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="text-center mt-8">
                  <h3 className="font-semibold text-gray-900 mb-1">{example.title}</h3>
                  <p className="text-sm text-gray-600">
                    {example.type === 'monthly-alert' ? `${example.route} - Active Monthly Alert` :
                     example.type === 'monthly-deals' ? `${example.route} - March 2025 Monthly Deals` :
                     `${example.route} - ${example.type === 'specific-date' ? 'Specific Date Alert' : 'Price Drop Alert'}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20 w-full flex flex-col items-center"
        >
          <motion.button 
            className="btn-primary inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.span 
              key={t('seeInAction.startGettingAlerts')}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t('seeInAction.startGettingAlerts')}
            </motion.span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
          <motion.p 
            key={t('seeInAction.joinTravelers')}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-sm text-gray-500 mt-4 max-w-md mx-auto text-center"
          >
            {t('seeInAction.joinTravelers')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
