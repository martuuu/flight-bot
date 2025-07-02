'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Plane } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useSession } from 'next-auth/react'
import { PageTransition, FadeInComponent } from '@/components/ui/PageTransition'

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
  searchMonth?: string
}

export default function EditAlertPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [alert, setAlert] = useState<Alert | null>(null)
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
    alertType: 'MONTHLY' as 'MONTHLY' | 'SPECIFIC',
    searchMonth: ''
  })

  // Proteger ruta - solo usuarios autenticados
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    if (params?.id) {
      fetchAlert(params.id as string)
    }
  }, [session, status, router, params?.id])

  const fetchAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`)
      const data = await response.json()
      
      if (response.ok) {
        setAlert(data)
        setFormData({
          origin: data.origin,
          destination: data.destination,
          maxPrice: data.maxPrice.toString(),
          currency: data.currency,
          departureDate: data.departureDate || '',
          returnDate: data.returnDate || '',
          isFlexible: data.isFlexible,
          adults: data.adults,
          children: data.children,
          infants: data.infants,
          alertType: data.alertType,
          searchMonth: data.searchMonth || ''
        })
      } else {
        toast.error('Alert not found')
        router.push('/alerts')
      }
    } catch (error) {
      console.error('Error fetching alert:', error)
      toast.error('Error loading alert')
      router.push('/alerts')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/alerts/${params?.id}`, {
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
        router.push('/alerts')
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

  // Loading states
  if (status === 'loading' || isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Alert not found</p>
          <Link href="/alerts" className="text-purple-600 hover:text-purple-700">
            Back to Alerts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <FadeInComponent className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/alerts" className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Alert</h1>
              <p className="text-gray-600">Update your flight price monitoring alert</p>
            </div>
          </div>
        </FadeInComponent>

        <FadeInComponent delay={0.2}>
          <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Route Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Route Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                    Origin Airport
                  </label>
                  <select
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

            {/* Alert Type */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Type</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="monthly"
                    name="alertType"
                    value="MONTHLY"
                    checked={formData.alertType === 'MONTHLY'}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="monthly" className="ml-3 block text-sm font-medium text-gray-700">
                    Monthly Alert - Get notified of price changes throughout the month
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="specific"
                    name="alertType"
                    value="SPECIFIC"
                    checked={formData.alertType === 'SPECIFIC'}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="specific" className="ml-3 block text-sm font-medium text-gray-700">
                    Specific Date Alert - Monitor prices for specific travel dates
                  </label>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            {formData.alertType === 'SPECIFIC' ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Travel Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Date
                    </label>
                    <Input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      required={formData.alertType === 'SPECIFIC'}
                    />
                  </div>
                  <div>
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Return Date (Optional)
                    </label>
                    <Input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Search Month</h3>
                <div>
                  <label htmlFor="searchMonth" className="block text-sm font-medium text-gray-700 mb-2">
                    Month to Monitor
                  </label>
                  <Input
                    type="month"
                    id="searchMonth"
                    name="searchMonth"
                    value={formData.searchMonth}
                    onChange={handleChange}
                    placeholder="Select month to monitor"
                  />
                </div>
              </div>
            )}

            {/* Price & Passengers */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Price & Passengers</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price
                  </label>
                  <Input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-2">
                    Adults
                  </label>
                  <Input
                    type="number"
                    id="adults"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    required
                    min="1"
                    max="9"
                  />
                </div>
                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-2">
                    Children (2-11)
                  </label>
                  <Input
                    type="number"
                    id="children"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    min="0"
                    max="9"
                  />
                </div>
                <div>
                  <label htmlFor="infants" className="block text-sm font-medium text-gray-700 mb-2">
                    Infants (0-2)
                  </label>
                  <Input
                    type="number"
                    id="infants"
                    name="infants"
                    value={formData.infants}
                    onChange={handleChange}
                    min="0"
                    max="9"
                  />
                </div>
              </div>
            </div>

            {/* Flexibility */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Flexibility</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFlexible"
                  name="isFlexible"
                  checked={formData.isFlexible}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isFlexible" className="ml-3 block text-sm text-gray-700">
                  Flexible dates (±3 days from selected dates)
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/alerts')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Updating...' : 'Update Alert'}
              </Button>
            </div>
          </form>
          </Card>
        </FadeInComponent>
      </div>
    </PageTransition>
  )
}
