'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/Spinner'

interface Alert {
  id: string
  userId: string
  origin: string
  destination: string
  maxPrice: number
  currency: string
  departureDate?: string
  returnDate?: string
  isFlexible: boolean
  adults: number
  children: number
  infants: number
  isActive: boolean
  isPaused: boolean
  alertType: 'MONTHLY' | 'SPECIFIC'
  createdAt: string
  updatedAt: string
  lastChecked?: string
}

interface EditAlertModalProps {
  isOpen: boolean
  onClose: () => void
  alertId: string | null
  onSuccess: () => void
}

const airports = [
  { code: 'SDQ', name: 'Santo Domingo' },
  { code: 'PUJ', name: 'Punta Cana' },
  { code: 'STI', name: 'Santiago' },
  { code: 'MIA', name: 'Miami' },
  { code: 'JFK', name: 'Nueva York (JFK)' },
  { code: 'LGA', name: 'Nueva York (LGA)' },
  { code: 'EWR', name: 'Newark' },
  { code: 'SFB', name: 'Orlando (Sanford)' },
  { code: 'MCO', name: 'Orlando' },
  { code: 'FLL', name: 'Fort Lauderdale' },
  { code: 'LAX', name: 'Los Ángeles' },
  { code: 'BOS', name: 'Boston' },
  { code: 'SJU', name: 'San Juan' },
  { code: 'BOG', name: 'Bogotá' },
  { code: 'CTG', name: 'Cartagena' },
  { code: 'MDE', name: 'Medellín' },
  { code: 'CLO', name: 'Cali' },
  { code: 'CUN', name: 'Cancún' },
  { code: 'MEX', name: 'Ciudad de México' },
  { code: 'GDL', name: 'Guadalajara' },
  { code: 'LIM', name: 'Lima' },
  { code: 'UIO', name: 'Quito' },
  { code: 'GYE', name: 'Guayaquil' },
  { code: 'SCL', name: 'Santiago' },
  { code: 'EZE', name: 'Buenos Aires' },
  { code: 'MAD', name: 'Madrid' },
  { code: 'BCN', name: 'Barcelona' },
]

export function EditAlertModal({ isOpen, onClose, alertId, onSuccess }: EditAlertModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    maxPrice: '',
    currency: 'USD',
    departureDate: '',
    returnDate: '',
    isFlexible: false,
    adults: 1,
    children: 0,
    infants: 0,
    alertType: 'MONTHLY' as 'MONTHLY' | 'SPECIFIC'
  })

  // Detect mobile screen size (mobile and tablet)
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Include tablets
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    if (isOpen && alertId) {
      fetchAlert()
    }
  }, [isOpen, alertId])

  const fetchAlert = async () => {
    if (!alertId) return
    
    setIsFetching(true)
    try {
      const response = await fetch(`/api/alerts/${alertId}`)
      const data = await response.json()
      
      if (response.ok) {
        setFormData({
          origin: data.origin,
          destination: data.destination,
          maxPrice: data.maxPrice.toString(),
          currency: data.currency,
          departureDate: data.departureDate ? data.departureDate.split('T')[0] : '',
          returnDate: data.returnDate ? data.returnDate.split('T')[0] : '',
          isFlexible: data.isFlexible,
          adults: data.adults,
          children: data.children,
          infants: data.infants,
          alertType: data.alertType
        })
      } else {
        toast.error('Error loading alert')
        onClose()
      }
    } catch (error) {
      console.error('Error fetching alert:', error)
      toast.error('Error loading alert')
      onClose()
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alertId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxPrice: parseFloat(formData.maxPrice),
        }),
      })

      if (response.ok) {
        toast.success('Alert updated successfully')
        onSuccess()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Error updating alert')
      }
    } catch (error) {
      console.error('Error updating alert:', error)
      toast.error('Error updating alert')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  if (!isOpen) return null

  // Mobile: Full screen with slide animation
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div 
          className="fixed inset-0 z-60 bg-white"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Edit Alert</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isFetching ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Route Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Route Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                          Origin Airport
                        </label>
                        <select
                          id="origin"
                          name="origin"
                          value={formData.origin}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                          required
                        >
                          <option value="">Select origin airport</option>
                          {airports.map((airport) => (
                            <option key={airport.code} value={airport.code}>
                              {airport.code} - {airport.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                          Destination Airport
                        </label>
                        <select
                          id="destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                          required
                        >
                          <option value="">Select destination airport</option>
                          {airports.map((airport) => (
                            <option key={airport.code} value={airport.code}>
                              {airport.code} - {airport.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Price Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Price
                        </label>
                        <Input
                          id="maxPrice"
                          name="maxPrice"
                          type="number"
                          value={formData.maxPrice}
                          onChange={handleChange}
                          placeholder="500"
                          required
                          min="1"
                        />
                      </div>
                      <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          id="currency"
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="DOP">DOP</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Alert Type */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Alert Type</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="alertType"
                          value="MONTHLY"
                          checked={formData.alertType === 'MONTHLY'}
                          onChange={handleChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Monthly monitoring</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="alertType"
                          value="SPECIFIC"
                          checked={formData.alertType === 'SPECIFIC'}
                          onChange={handleChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Specific dates</span>
                      </label>
                    </div>
                  </div>

                  {/* Specific Dates */}
                  {formData.alertType === 'SPECIFIC' && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Travel Dates</h4>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Departure Date
                          </label>
                          <Input
                            id="departureDate"
                            name="departureDate"
                            type="date"
                            value={formData.departureDate}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Return Date (Optional)
                          </label>
                          <Input
                            id="returnDate"
                            name="returnDate"
                            type="date"
                            value={formData.returnDate}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Passengers */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Passengers</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-2">
                          Adults
                        </label>
                        <select
                          id="adults"
                          name="adults"
                          value={formData.adults}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-2">
                          Children (2-11 years)
                        </label>
                        <select
                          id="children"
                          name="children"
                          value={formData.children}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="infants" className="block text-sm font-medium text-gray-700 mb-2">
                          Infants (0-2 years)
                        </label>
                        <select
                          id="infants"
                          name="infants"
                          value={formData.infants}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        >
                          {[0, 1, 2].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Updating...' : 'Update Alert'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Desktop: Modal with fade animation
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <motion.div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Alert</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {isFetching ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Route Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                        Origin Airport
                      </label>
                      <select
                        id="origin"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        required
                      >
                        <option value="">Select origin airport</option>
                        {airports.map((airport) => (
                          <option key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Airport
                      </label>
                      <select
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        required
                      >
                        <option value="">Select destination airport</option>
                        {airports.map((airport) => (
                          <option key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Price Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Price
                      </label>
                      <Input
                        id="maxPrice"
                        name="maxPrice"
                        type="number"
                        value={formData.maxPrice}
                        onChange={handleChange}
                        placeholder="500"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="DOP">DOP</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Updating...' : 'Update Alert'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default EditAlertModal
