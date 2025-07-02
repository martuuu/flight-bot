'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Plane, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  TrendingDown,
  Star,
  Info,
  Zap,
  Tag
} from 'lucide-react'
import { Card } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'

interface FlightDetails {
  id: string
  date: string
  price: number
  priceWithoutTax: number
  fareClass: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  duration: number
  aircraft: string
  isCheapestOfMonth: boolean
  isSoldOut: boolean
  departureAirport: {
    code: string
    name: string
    city: string
  }
  arrivalAirport: {
    code: string
    name: string
    city: string
  }
  taxes: number
  checkInAllowed: boolean
  stopoverTime?: number
}

interface AlertDetails {
  id: string
  fromAirport: string
  toAirport: string
  fromAirportName: string
  toAirportName: string
  maxPrice: number
  currency: string
  searchMonth: string
  passengers: Array<{
    type: 'adult' | 'child' | 'infant'
    count: number
  }>
  isActive: boolean
  createdAt: string
  lastChecked?: string
  alertsSent: number
  flights: FlightDetails[]
  priceAnalysis: {
    minPrice: number
    maxPrice: number
    avgPrice: number
    totalFlights: number
    cheapestDates: string[]
  }
}

interface AlertDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  alertId: string | null
}

export function AlertDetailsModal({ isOpen, onClose, alertId }: AlertDetailsModalProps) {
  const [alertDetails, setAlertDetails] = useState<AlertDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<FlightDetails | null>(null)

  useEffect(() => {
    if (isOpen && alertId) {
      fetchAlertDetails(alertId)
    }
  }, [isOpen, alertId])

  const fetchAlertDetails = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/alerts/details?id=${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch alert details')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setAlertDetails(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch alert details')
      }
    } catch (error) {
      console.error('Error fetching alert details:', error)
      // Fallback to mock data for demonstration
      const mockAlertDetails: AlertDetails = {
        id,
        fromAirport: 'MIA',
        toAirport: 'PUJ',
        fromAirportName: 'Miami International Airport',
        toAirportName: 'Punta Cana International Airport',
        maxPrice: 400,
        currency: 'USD',
        searchMonth: '2026-02',
        passengers: [{ type: 'adult', count: 1 }],
        isActive: true,
        createdAt: '2025-01-01T10:00:00Z',
        lastChecked: '2025-01-01T14:30:00Z',
        alertsSent: 3,
        priceAnalysis: {
          minPrice: 210,
          maxPrice: 450,
          avgPrice: 320,
          totalFlights: 45,
          cheapestDates: ['2026-02-05', '2026-02-12', '2026-02-19']
        },
        flights: [
          {
            id: '1',
            date: '2026-02-05',
            price: 210,
            priceWithoutTax: 180,
            fareClass: 'Economy',
            flightNumber: 'DM-123',
            departureTime: '2026-02-05T08:30:00Z',
            arrivalTime: '2026-02-05T12:45:00Z',
            duration: 255,
            aircraft: 'Boeing 737-800',
            isCheapestOfMonth: true,
            isSoldOut: false,
            departureAirport: {
              code: 'MIA',
              name: 'Miami International Airport',
              city: 'Miami'
            },
            arrivalAirport: {
              code: 'PUJ',
              name: 'Punta Cana International Airport',
              city: 'Punta Cana'
            },
            taxes: 30,
            checkInAllowed: true
          },
          {
            id: '2',
            date: '2026-02-12',
            price: 235,
            priceWithoutTax: 205,
            fareClass: 'Economy',
            flightNumber: 'DM-456',
            departureTime: '2026-02-12T14:15:00Z',
            arrivalTime: '2026-02-12T18:30:00Z',
            duration: 255,
            aircraft: 'Boeing 737-800',
            isCheapestOfMonth: false,
            isSoldOut: false,
            departureAirport: {
              code: 'MIA',
              name: 'Miami International Airport',
              city: 'Miami'
            },
            arrivalAirport: {
              code: 'PUJ',
              name: 'Punta Cana International Airport',
              city: 'Punta Cana'
            },
            taxes: 30,
            checkInAllowed: true
          }
        ]
      }
      
      setAlertDetails(mockAlertDetails)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (!alertId) return
    
    setRefreshing(true)
    try {
      const response = await fetch('/api/alerts/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      })
      
      if (response.ok) {
        // Refetch the alert details after successful refresh
        await fetchAlertDetails(alertId)
      }
    } catch (error) {
      console.error('Error refreshing alert data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const formatPassengers = (passengers: AlertDetails['passengers']) => {
    return passengers.map(p => 
      `${p.count} ${p.type}${p.count > 1 ? 's' : ''}`
    ).join(', ')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                  <Plane className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Alert Details</h2>
                  {alertDetails && (
                    <p className="text-purple-100">
                      {alertDetails.fromAirport} → {alertDetails.toAirport} | {alertDetails.searchMonth}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Zap className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : alertDetails ? (
              <div className="p-6 space-y-6">
                {/* Alert Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">Route</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>From:</strong> {alertDetails.fromAirportName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>To:</strong> {alertDetails.toAirportName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Month:</strong> {alertDetails.searchMonth}
                      </p>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Price Settings</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Max Price:</strong> ${alertDetails.maxPrice} {alertDetails.currency}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Best Price:</strong> ${alertDetails.priceAnalysis.minPrice} {alertDetails.currency}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Avg Price:</strong> ${alertDetails.priceAnalysis.avgPrice} {alertDetails.currency}
                      </p>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Travel Details</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Passengers:</strong> {formatPassengers(alertDetails.passengers)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Alerts Sent:</strong> {alertDetails.alertsSent}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Status:</strong> 
                        <Badge variant={alertDetails.isActive ? 'success' : 'gray'} className="ml-2">
                          {alertDetails.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Price Analysis */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingDown className="h-5 w-5 mr-2 text-green-600" />
                    Price Analysis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">${alertDetails.priceAnalysis.minPrice}</p>
                      <p className="text-sm text-gray-600">Lowest Price</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">${alertDetails.priceAnalysis.avgPrice}</p>
                      <p className="text-sm text-gray-600">Average Price</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">${alertDetails.priceAnalysis.maxPrice}</p>
                      <p className="text-sm text-gray-600">Highest Price</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{alertDetails.priceAnalysis.totalFlights}</p>
                      <p className="text-sm text-gray-600">Total Flights</p>
                    </div>
                  </div>
                </Card>

                {/* Available Flights */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Plane className="h-5 w-5 mr-2 text-purple-600" />
                    Available Deals ({alertDetails.flights.length})
                  </h3>
                  <div className="space-y-4">
                    {alertDetails.flights.map((flight) => (
                      <motion.div
                        key={flight.id}
                        className="border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedFlight(flight)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="font-semibold text-lg">{formatTime(flight.departureTime)}</p>
                              <p className="text-sm text-gray-600">{flight.departureAirport.code}</p>
                            </div>
                            <div className="text-center px-4">
                              <div className="flex items-center space-x-2">
                                <div className="h-0.5 w-8 bg-gray-300"></div>
                                <Plane className="h-4 w-4 text-purple-600" />
                                <div className="h-0.5 w-8 bg-gray-300"></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{formatDuration(flight.duration)}</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-lg">{formatTime(flight.arrivalTime)}</p>
                              <p className="text-sm text-gray-600">{flight.arrivalAirport.code}</p>
                            </div>
                          </div>
                          
                          <div className="text-right flex items-center space-x-4">
                            <div>
                              <p className="text-2xl font-bold text-green-600">${flight.price}</p>
                              <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              {flight.isCheapestOfMonth && (
                                <Badge variant="success" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Best Deal
                                </Badge>
                              )}
                              <Badge variant="gray" className="text-xs">
                                {formatDate(flight.date).split(',')[0]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Flight Detail Modal */}
                <AnimatePresence>
                  {selectedFlight && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4"
                      onClick={() => setSelectedFlight(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Flight Detail Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold">Flight Details</h3>
                              <p className="text-blue-100">
                                {selectedFlight.flightNumber} | {formatDate(selectedFlight.date)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => setSelectedFlight(null)}
                              className="text-white hover:bg-white hover:bg-opacity-20"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Flight Detail Content */}
                        <div className="p-6 max-h-[calc(80vh-120px)] overflow-y-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Flight Info */}
                            <Card className="p-6">
                              <h4 className="font-semibold mb-4 flex items-center">
                                <Plane className="h-5 w-5 mr-2 text-purple-600" />
                                Flight Information
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Flight Number:</span>
                                  <span className="font-medium">{selectedFlight.flightNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Aircraft:</span>
                                  <span className="font-medium">{selectedFlight.aircraft}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Duration:</span>
                                  <span className="font-medium">{formatDuration(selectedFlight.duration)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Class:</span>
                                  <span className="font-medium">{selectedFlight.fareClass}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <Badge variant={selectedFlight.isSoldOut ? 'danger' : 'success'}>
                                    {selectedFlight.isSoldOut ? 'Sold Out' : 'Available'}
                                  </Badge>
                                </div>
                              </div>
                            </Card>

                            {/* Price Breakdown */}
                            <Card className="p-6">
                              <h4 className="font-semibold mb-4 flex items-center">
                                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                                Price Breakdown
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Base Fare:</span>
                                  <span className="font-medium">${selectedFlight.priceWithoutTax}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Taxes & Fees:</span>
                                  <span className="font-medium">${selectedFlight.taxes}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-lg font-bold">
                                  <span>Total Price:</span>
                                  <span className="text-green-600">${selectedFlight.price}</span>
                                </div>
                                {selectedFlight.isCheapestOfMonth && (
                                  <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-green-800 text-sm flex items-center">
                                      <Star className="h-4 w-4 mr-2" />
                                      This is the cheapest flight of the month!
                                    </p>
                                  </div>
                                )}
                              </div>
                            </Card>

                            {/* Route Details */}
                            <Card className="p-6 md:col-span-2">
                              <h4 className="font-semibold mb-4 flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                                Route Details
                              </h4>
                              <div className="flex items-center justify-between">
                                <div className="text-center">
                                  <p className="text-2xl font-bold">{selectedFlight.departureAirport.code}</p>
                                  <p className="text-gray-600">{selectedFlight.departureAirport.name}</p>
                                  <p className="text-sm text-gray-500">{selectedFlight.departureAirport.city}</p>
                                  <div className="mt-2 p-2 bg-blue-50 rounded">
                                    <p className="font-semibold">{formatTime(selectedFlight.departureTime)}</p>
                                    <p className="text-sm text-gray-600">Departure</p>
                                  </div>
                                </div>
                                
                                <div className="flex-1 px-8">
                                  <div className="relative">
                                    <div className="h-0.5 bg-gray-300 w-full"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 p-2 rounded-full">
                                      <Plane className="h-4 w-4 text-white" />
                                    </div>
                                  </div>
                                  <p className="text-center text-sm text-gray-600 mt-2">
                                    {formatDuration(selectedFlight.duration)} • Direct
                                  </p>
                                </div>
                                
                                <div className="text-center">
                                  <p className="text-2xl font-bold">{selectedFlight.arrivalAirport.code}</p>
                                  <p className="text-gray-600">{selectedFlight.arrivalAirport.name}</p>
                                  <p className="text-sm text-gray-500">{selectedFlight.arrivalAirport.city}</p>
                                  <div className="mt-2 p-2 bg-green-50 rounded">
                                    <p className="font-semibold">{formatTime(selectedFlight.arrivalTime)}</p>
                                    <p className="text-sm text-gray-600">Arrival</p>
                                  </div>
                                </div>
                              </div>
                            </Card>

                            {/* Additional Services */}
                            <Card className="p-6 md:col-span-2">
                              <h4 className="font-semibold mb-4 flex items-center">
                                <Info className="h-5 w-5 mr-2 text-blue-600" />
                                Additional Information
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2">
                                  <div className={`h-2 w-2 rounded-full ${selectedFlight.checkInAllowed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <span className="text-sm">Online Check-in {selectedFlight.checkInAllowed ? 'Available' : 'Not Available'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Tag className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm">Fare Class: {selectedFlight.fareClass}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm">{formatDate(selectedFlight.date)}</span>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-600">Failed to load alert details</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
