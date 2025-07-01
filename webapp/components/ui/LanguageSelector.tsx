'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-1 text-lg">
      <motion.button
        onClick={() => setLanguage('en')}
        className={`transition-all duration-300 transform hover:scale-110 ${
          language === 'en' ? 'opacity-100 filter-none' : 'opacity-50 hover:opacity-75 filter grayscale'
        }`}
        title="English"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        🇺🇸
      </motion.button>
      <span className="text-gray-400 text-sm mx-1">/</span>
      <motion.button
        onClick={() => setLanguage('es')}
        className={`transition-all duration-300 transform hover:scale-110 ${
          language === 'es' ? 'opacity-100 filter-none' : 'opacity-50 hover:opacity-75 filter grayscale'
        }`}
        title="Español"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        🇦🇷
      </motion.button>
    </div>
  )
}
