'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plane, 
  Calendar, 
  DollarSign, 
  Users, 
  ArrowUpDown, 
  MapPin,
  Plus,
  Minus,
  Send,
  MessageCircle,
  ChevronDown
} from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { Badge } from './Badge'
import { botConfig } from '@/lib/bot-config'

interface FlightSearchFormProps {
  onSubmit: (data: FlightSearchData) => void
  isLoading?: boolean
}

export interface FlightSearchData {
  origin: string
  destination: string
  departureDate?: string
  returnDate?: string
  maxPrice: number
  adults: number
  children: number
  infants: number
  tripType: 'one-way' | 'round-trip' | 'multi-city'
  alertType: 'monthly' | 'specific'
  month?: string
  notificationChannel: 'telegram' | 'whatsapp' | 'both'
}

const POPULAR_ROUTES = [
  { from: 'Santo Domingo', to: 'Miami', fromCode: 'SDQ', toCode: 'MIA', avgPrice: 280 },
  { from: 'Punta Cana', to: 'Miami', fromCode: 'PUJ', toCode: 'MIA', avgPrice: 300 },
  { from: 'Santiago', to: 'San Juan', fromCode: 'STI', toCode: 'SJU', avgPrice: 180 },
  { from: 'Santo Domingo', to: 'Orlando', fromCode: 'SDQ', toCode: 'SFB', avgPrice: 320 },
]

const AIRPORTS = [
  // República Dominicana
  { code: 'SDQ', name: 'Santo Domingo - Las Américas Intl.', city: 'Santo Domingo', country: 'República Dominicana' },
  { code: 'PUJ', name: 'Punta Cana - Aeropuerto Intl.', city: 'Punta Cana', country: 'República Dominicana' },
  { code: 'STI', name: 'Santiago - Cibao Intl.', city: 'Santiago', country: 'República Dominicana' },
  
  // Estados Unidos
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'Estados Unidos' },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'Nueva York', country: 'Estados Unidos' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'Nueva York', country: 'Estados Unidos' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'Estados Unidos' },
  { code: 'SFB', name: 'Orlando Sanford Airport', city: 'Orlando', country: 'Estados Unidos' },
  { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'Estados Unidos' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood Intl.', city: 'Fort Lauderdale', country: 'Estados Unidos' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Ángeles', country: 'Estados Unidos' },
  { code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'Estados Unidos' },
  
  // Puerto Rico
  { code: 'SJU', name: 'Luis Muñoz Marín International', city: 'San Juan', country: 'Puerto Rico' },
  
  // Colombia
  { code: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia' },
  { code: 'CTG', name: 'Rafael Núñez International', city: 'Cartagena', country: 'Colombia' },
  { code: 'MDE', name: 'José María Córdova International', city: 'Medellín', country: 'Colombia' },
  { code: 'CLO', name: 'Alfonso Bonilla Aragón Intl.', city: 'Cali', country: 'Colombia' },
  
  // México
  { code: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'México' },
  { code: 'MEX', name: 'Mexico City International', city: 'Ciudad de México', country: 'México' },
  { code: 'GDL', name: 'Miguel Hidalgo y Costilla Intl.', city: 'Guadalajara', country: 'México' },
  
  // Perú
  { code: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Perú' },
  
  // Ecuador
  { code: 'UIO', name: 'Mariscal Sucre International', city: 'Quito', country: 'Ecuador' },
  { code: 'GYE', name: 'José Joaquín de Olmedo Intl.', city: 'Guayaquil', country: 'Ecuador' },
  
  // Chile
  { code: 'SCL', name: 'Arturo Merino Benítez Intl.', city: 'Santiago', country: 'Chile' },
  
  // Argentina
  { code: 'EZE', name: 'Ezeiza International Airport', city: 'Buenos Aires', country: 'Argentina' },
  
  // España
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'España' },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'España' },
]

export function FlightSearchForm({ onSubmit, isLoading }: FlightSearchFormProps) {
  const [formData, setFormData] = useState<FlightSearchData>({
    origin: '',
    destination: '',
    maxPrice: 400,
    adults: 1,
    children: 0,
    infants: 0,
    tripType: 'one-way', // Cambiar a one-way por defecto
    alertType: 'monthly',
    notificationChannel: 'telegram'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleQuickRoute = (route: typeof POPULAR_ROUTES[0]) => {
    setFormData(prev => ({
      ...prev,
      origin: route.fromCode,
      destination: route.toCode,
      maxPrice: route.avgPrice
    }))
  }

  const adjustPassengers = (type: 'adults' | 'children' | 'infants', operation: 'add' | 'subtract') => {
    setFormData(prev => ({
      ...prev,
      [type]: operation === 'add' 
        ? Math.min(prev[type] + 1, type === 'adults' ? 9 : 8)
        : Math.max(prev[type] - 1, type === 'adults' ? 1 : 0)
    }))
  }

  const swapAirports = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Flight</h1>
        <p className="text-gray-600">Find the best deals and set up price alerts</p>
      </div>

      {/* Trip Type Selector */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { key: 'one-way', label: 'One way' },
            { key: 'round-trip', label: 'Round Trip' },
            { key: 'multi-city', label: 'Multi-City' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={formData.tripType === key ? 'primary' : 'outline'}
              onClick={() => setFormData(prev => ({ ...prev, tripType: key as any }))}
              className="rounded-full"
            >
              {label}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {/* From */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={formData.origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select origin</option>
                  {AIRPORTS.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code}) - {airport.country}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Swap Button - Centrado entre los selects */}
            <div className="absolute left-1/2 top-8 transform -translate-x-1/2 z-10 hidden md:block">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={swapAirports}
                className="rounded-full w-10 h-10 p-0 bg-white shadow-lg border-2 hover:bg-gray-50"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-400" />
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select destination</option>
                  {AIRPORTS.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code}) - {airport.country}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Swap Button */}
            <div className="flex justify-center md:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={swapAirports}
                className="rounded-full w-10 h-10 p-0"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Alert Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Alert Type</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={formData.alertType === 'monthly' ? 'primary' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, alertType: 'monthly' }))}
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="font-semibold">Monthly Alert</div>
                <div className="text-sm opacity-75">Monitor all month long</div>
              </Button>
              <Button
                type="button"
                variant={formData.alertType === 'specific' ? 'primary' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, alertType: 'specific' }))}
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="font-semibold">Specific Date</div>
                <div className="text-sm opacity-75">Monitor specific dates</div>
              </Button>
            </div>
          </div>

          {/* Date Selection */}
          {formData.alertType === 'specific' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.departureDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {formData.tripType === 'round-trip' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.returnDate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Month Selection for Monthly Alerts */}
          {formData.alertType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="month"
                  value={formData.month || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  className="pl-10"
                  placeholder="Leave empty for current month"
                />
              </div>
            </div>
          )}

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (USD)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="number"
                value={formData.maxPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="pl-10"
                min="50"
                max="5000"
                step="50"
                required
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Passengers</label>
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Adult</div>
                    <div className="text-sm text-gray-500">Age 12+</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustPassengers('adults', 'subtract')}
                    disabled={formData.adults <= 1}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{formData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustPassengers('adults', 'add')}
                    disabled={formData.adults >= 9}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Child</div>
                    <div className="text-sm text-gray-500">Age 2-11</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustPassengers('children', 'subtract')}
                    disabled={formData.children <= 0}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{formData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustPassengers('children', 'add')}
                    disabled={formData.children >= 8}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Infant</div>
                    <div className="text-sm text-gray-500">Age 0-2</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustPassengers('infants', 'subtract')}
                    disabled={formData.infants <= 0}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{formData.infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustPassengers('infants', 'add')}
                    disabled={formData.infants >= 8}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Get Notified Via</label>
            <div className="grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant={formData.notificationChannel === 'telegram' ? 'primary' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, notificationChannel: 'telegram' }))}
                className="h-auto p-4 flex items-center justify-start space-x-3"
              >
                <Send className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Telegram</div>
                  <div className="text-sm opacity-75">Get instant notifications on Telegram</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Alert...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Create Alert</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Popular Routes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POPULAR_ROUTES.map((route, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleQuickRoute(route)}
              className="h-auto p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Plane className="h-4 w-4 text-gray-400" />
                <div className="text-left">
                  <div className="font-medium">{route.from} → {route.to}</div>
                  <div className="text-sm text-gray-500">{route.fromCode} - {route.toCode}</div>
                </div>
              </div>
              <Badge variant="gray">${route.avgPrice}</Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Telegram Redirect Option */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <MessageCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Prefer using Telegram?</h3>
            <p className="text-gray-600">Create alerts directly in our Telegram bot for instant setup</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Crear enlace con datos de usuario para autenticación
              const authLink = botConfig.createUserAuthLink(
                'webapp_user', // ID temporal del usuario web
                'premium', // rol del usuario
                'user@webapp.com' // email si está disponible
              )
              window.open(authLink, '_blank')
            }}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            Open Telegram Bot
          </Button>
        </div>
      </Card>
    </div>
  )
}
