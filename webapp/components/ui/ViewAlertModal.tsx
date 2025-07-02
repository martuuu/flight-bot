'use client'

import { useState, useEffect } from 'react'
import { X, Edit3, Trash2, Play, Pause, Calendar, Users, DollarSign, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'react-hot-toast'
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

interface ViewAlertModalProps {
  isOpen: boolean
  onClose: () => void
  alertId: string | null
  onEdit: (alertId: string) => void
  onDelete: (alertId: string) => void
  onTogglePause: (alertId: string, isPaused: boolean) => void
}

export function ViewAlertModal({ 
  isOpen, 
  onClose, 
  alertId, 
  onEdit, 
  onDelete, 
  onTogglePause 
}: ViewAlertModalProps) {
  const [alert, setAlert] = useState<Alert | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/alerts/${alertId}`)
      const data = await response.json()
      
      if (response.ok) {
        setAlert(data)
      } else {
        toast.error('Error loading alert')
        onClose()
      }
    } catch (error) {
      console.error('Error fetching alert:', error)
      toast.error('Error loading alert')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const getAirportName = (code: string) => {
    const airports = {
      'SDQ': 'Santo Domingo',
      'PUJ': 'Punta Cana', 
      'STI': 'Santiago',
      'MIA': 'Miami',
      'JFK': 'Nueva York',
      'LGA': 'Nueva York',
      'EWR': 'Newark',
      'SFB': 'Orlando',
      'MCO': 'Orlando',
      'FLL': 'Fort Lauderdale',
      'LAX': 'Los Ángeles',
      'BOS': 'Boston',
      'SJU': 'San Juan',
      'BOG': 'Bogotá',
      'CTG': 'Cartagena',
      'MDE': 'Medellín',
      'CLO': 'Cali',
      'CUN': 'Cancún',
      'MEX': 'Ciudad de México',
      'GDL': 'Guadalajara',
      'LIM': 'Lima',
      'UIO': 'Quito',
      'GYE': 'Guayaquil',
      'SCL': 'Santiago',
      'EZE': 'Buenos Aires',
      'MAD': 'Madrid',
      'BCN': 'Barcelona',
    }
    return airports[code as keyof typeof airports] || code
  }

  const getAlertStatus = (alert: Alert) => {
    if (!alert.isActive) return 'paused'
    if (alert.isPaused) return 'paused'
    return 'watching'
  }

  if (!isOpen) return null

  // Mobile: Full screen with slide animation
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Alert Details</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {alert ? (
                <div className="space-y-6">
                  {/* Alert Info */}
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {getAirportName(alert.origin)} → {getAirportName(alert.destination)}
                      </h2>
                      <Badge variant={getAlertStatus(alert) === 'watching' ? 'success' : 'gray'}>
                        {getAlertStatus(alert)}
                      </Badge>
                    </div>
                  </div>

                  {/* Mobile Alert Details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-2">Price Alert</h4>
                      <p className="text-2xl font-bold text-purple-600">${alert.maxPrice} {alert.currency}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-2">Travel Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Type: {alert.alertType === 'MONTHLY' ? 'Monthly' : 'Specific Date'}</p>
                        {alert.departureDate && <p>Departure: {new Date(alert.departureDate).toLocaleDateString()}</p>}
                        {alert.returnDate && <p>Return: {new Date(alert.returnDate).toLocaleDateString()}</p>}
                        <p>Passengers: {alert.adults + alert.children + alert.infants}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-2">Alert Info</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Created: {new Date(alert.createdAt).toLocaleDateString()}</p>
                        <p>Last Updated: {new Date(alert.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onTogglePause(alert.id, alert.isPaused)}
                      disabled={isLoading}
                      className="flex items-center justify-center"
                    >
                      {alert.isPaused ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onEdit(alert.id)}
                      className="flex items-center justify-center"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => onDelete(alert.id)}
                    disabled={isLoading}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Alert
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Desktop: Modal with fade/scale animation
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <motion.div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {alert ? `${getAirportName(alert.origin)} → ${getAirportName(alert.destination)}` : 'Loading...'}
                </h3>
                {alert && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={alert.isPaused ? 'gray' : 'default'}>
                      {getAlertStatus(alert)}
                    </Badge>
                    <Badge variant="gray">
                      {alert.alertType === 'MONTHLY' ? 'Monthly Alert' : 'Specific Date Alert'}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : alert ? (
            <div className="space-y-6">
              {/* Route Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      Route Details
                    </h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {alert.origin} → {alert.destination}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {getAirportName(alert.origin)} to {getAirportName(alert.destination)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      Price Information
                    </h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${alert.maxPrice} {alert.currency}
                      </div>
                      <div className="text-sm text-gray-600">Maximum price per person</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-purple-600" />
                      Passenger Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adults:</span>
                        <span className="font-semibold">{alert.adults}</span>
                      </div>
                      {alert.children > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Children (2-11):</span>
                          <span className="font-semibold">{alert.children}</span>
                        </div>
                      )}
                      {alert.infants > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Infants (0-2):</span>
                          <span className="font-semibold">{alert.infants}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-orange-600" />
                      Alert Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${alert.isPaused ? 'text-red-600' : 'text-green-600'}`}>
                          {alert.isPaused ? 'Paused' : 'Active'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-semibold">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flexible:</span>
                        <span className="font-semibold">
                          {alert.isFlexible ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Dates */}
              {alert.alertType === 'SPECIFIC' && (alert.departureDate || alert.returnDate) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Travel Dates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alert.departureDate && (
                      <div>
                        <p className="text-sm text-gray-600">Departure Date</p>
                        <p className="font-semibold text-blue-600">
                          {new Date(alert.departureDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {alert.returnDate && (
                      <div>
                        <p className="text-sm text-gray-600">Return Date</p>
                        <p className="font-semibold text-orange-600">
                          {new Date(alert.returnDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Monthly Alert Info */}
              {alert.alertType === 'MONTHLY' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    Monthly Monitoring
                  </h4>
                  <p className="text-green-600 font-semibold">
                    Monitoring prices throughout the month
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => onTogglePause(alert.id, alert.isPaused)}
                  >
                    {alert.isPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Reactivate
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit(alert.id)
                      onClose()
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onDelete(alert.id)
                      onClose()
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Alert not found</p>
            </div>
          )}
          </motion.div>
        </div>
      </div>
      )}
    </AnimatePresence>
  )
}

export default ViewAlertModal
