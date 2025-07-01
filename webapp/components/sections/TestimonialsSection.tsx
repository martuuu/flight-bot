'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const testimonials = [
  {
    name: 'Maria Rodriguez',
    location: 'Miami, FL',
    avatar: '/avatars/maria.jpg',
    rating: 5,
    text: 'Saved $400 on my family vacation to Europe! The Telegram alerts are super convenient.',
    route: 'Miami → Madrid',
    savings: '$400',
  },
  {
    name: 'Carlos Mendez',
    location: 'Bogotá, CO',
    avatar: '/avatars/carlos.jpg',
    rating: 5,
    text: 'Found an amazing deal to Punta Cana. The app works exactly as advertised!',
    route: 'Bogotá → Punta Cana',
    savings: '$250',
  },
  {
    name: 'Ana Silva',
    location: 'São Paulo, BR',
    avatar: '/avatars/ana.jpg',
    rating: 5,
    text: 'Perfect for business travel. I get notified instantly and can book before prices go up.',
    route: 'São Paulo → New York',
    savings: '$320',
  },
]

export function TestimonialsSection() {
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
          key={t('testimonials.title')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          {t('testimonials.title')}
        </motion.h2>
        <motion.p 
          key={t('testimonials.description')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          {t('testimonials.description')}
        </motion.p>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 h-full relative">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="h-12 w-12 text-primary-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Savings Badge */}
              <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-6">
                {t('testimonials.saved')} {testimonial.savings}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                  <div className="text-xs text-primary-600 font-medium">{testimonial.route}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      >
        <div>
          <div className="text-3xl font-bold text-primary-600 mb-2">1,000+</div>
          <motion.div 
            key={t('testimonials.stats.users')}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600"
          >
            {t('testimonials.stats.users')}
          </motion.div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary-600 mb-2">$2M+</div>
          <motion.div 
            key={t('testimonials.stats.saved')}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600"
          >
            {t('testimonials.stats.saved')}
          </motion.div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary-600 mb-2">5,000+</div>
          <motion.div 
            key={t('testimonials.stats.deals')}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600"
          >
            {t('testimonials.stats.deals')}
          </motion.div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary-600 mb-2">4.9★</div>
          <motion.div 
            key={t('testimonials.stats.rating')}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600"
          >
            {t('testimonials.stats.rating')}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
