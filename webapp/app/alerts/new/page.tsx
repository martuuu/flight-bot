'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, DollarSign, Bell, Save, Plane } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

const popularRoutes = [
  { from: 'Miami', to: 'Punta Cana', fromCode: 'MIA', toCode: 'PUJ', price: '$300' },
  { from: 'Bogotá', to: 'Miami', fromCode: 'BOG', toCode: 'MIA', price: '$250' },
  { from: 'São Paulo', to: 'New York', fromCode: 'GRU', toCode: 'JFK', price: '$450' },
  { from: 'Madrid', to: 'Buenos Aires', fromCode: 'MAD', toCode: 'EZE', price: '$400' },
]

export default function NewAlertPage() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    maxPrice: '',
    alertType: 'monthly', // 'monthly' or 'specific'
    departureDate: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Handle alert creation logic here
    }, 2000)
  }

  const handleQuickRoute = (route: typeof popularRoutes[0]) => {
    setFormData(prev => ({
      ...prev,
      origin: `${route.from} (${route.fromCode})`,
      destination: `${route.to} (${route.toCode})`,
      maxPrice: route.price.replace('$', ''),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Title */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Create New Alert</h1>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-purple p-2 rounded-xl">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Flight-Bot</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Flight Alert</h2>
                  <p className="text-gray-600">
                    We'll monitor prices for your route and notify you when deals are available.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Route Selection */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        From
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Departure city or airport"
                          value={formData.origin}
                          onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        To
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Destination city or airport"
                          value={formData.destination}
                          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alert Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Alert Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`relative cursor-pointer rounded-2xl border-2 p-4 focus:outline-none ${
                        formData.alertType === 'monthly' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          value="monthly"
                          checked={formData.alertType === 'monthly'}
                          onChange={(e) => setFormData(prev => ({ ...prev, alertType: e.target.value }))}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">Monthly Search</p>
                            <p className="text-sm text-gray-600">Find best deals within a month</p>
                          </div>
                        </div>
                      </label>

                      <label className={`relative cursor-pointer rounded-2xl border-2 p-4 focus:outline-none ${
                        formData.alertType === 'specific' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          value="specific"
                          checked={formData.alertType === 'specific'}
                          onChange={(e) => setFormData(prev => ({ ...prev, alertType: e.target.value }))}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">Specific Date</p>
                            <p className="text-sm text-gray-600">Monitor prices for exact dates</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Specific Date (conditional) */}
                  {formData.alertType === 'specific' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Departure Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="date"
                          value={formData.departureDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Maximum Price (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="500"
                        value={formData.maxPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
                        className="pl-11"
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      You'll be notified when prices drop below this amount
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Alert...
                        </div>
                      ) : (
                        <>
                          <Bell className="h-4 w-4 mr-2" />
                          Create Alert
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" type="button">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Routes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
                <div className="space-y-3">
                  {popularRoutes.map((route, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickRoute(route)}
                      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:border-purple-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {route.from} → {route.to}
                          </p>
                          <p className="text-sm text-gray-500">
                            {route.fromCode} → {route.toCode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-600">{route.price}</p>
                          <p className="text-xs text-gray-500">avg price</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Set realistic price targets based on historical averages</p>
                  <p>• Monthly searches give you more flexibility with dates</p>
                  <p>• You can create up to 2 alerts on the free plan</p>
                  <p>• Notifications are sent via Telegram and WhatsApp</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
