'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Edit3, Trash2, Plane, Calendar, Users, MapPin, DollarSign, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
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

export default function ViewAlertPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [alert, setAlert] = useState<Alert | null>(null)

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

  const handleDeleteAlert = async () => {
    if (!alert || !confirm('¿Estás seguro de que quieres eliminar esta alerta?')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/alerts/${alert.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Alerta eliminada exitosamente')
        router.push('/alerts')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Error al eliminar la alerta')
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
      toast.error('Error al eliminar la alerta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePause = async () => {
    if (!alert) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/alerts/${alert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...alert,
          isPaused: !alert.isPaused,
          departureDate: alert.departureDate,
          returnDate: alert.returnDate
        })
      })

      if (response.ok) {
        toast.success(alert.isPaused ? 'Alerta reactivada' : 'Alerta pausada')
        fetchAlert(alert.id) // Refresh the data
      } else {
        const data = await response.json()
        toast.error(data.message || 'Error al actualizar la alerta')
      }
    } catch (error) {
      console.error('Error updating alert:', error)
      toast.error('Error al actualizar la alerta')
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener nombre del aeropuerto por código
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
    if (!alert.isActive) return 'inactive'
    if (alert.isPaused) return 'paused'
    return 'active'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'paused': return 'warning'
      case 'inactive': return 'danger'
      default: return 'default'
    }
  }

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

  const originName = getAirportName(alert.origin)
  const destinationName = getAirportName(alert.destination)
  const alertStatus = getAlertStatus(alert)

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <FadeInComponent className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/alerts" className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {originName} → {destinationName}
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(alertStatus) as any}>
                    {alertStatus}
                  </Badge>
                  <Badge variant="gray" size="sm">
                    {alert.alertType === 'MONTHLY' ? 'Monthly' : 'Specific Date'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePause}
                disabled={isLoading}
                className="p-2"
              >
                {alert.isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/alerts/edit/${alert.id}`)}
                className="p-2"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAlert}
                disabled={isLoading}
                className="p-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </FadeInComponent>

        <FadeInComponent delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
            {/* Route Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                Route Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Origin</p>
                  <p className="text-lg font-medium text-gray-900">{alert.origin}</p>
                  <p className="text-sm text-gray-600">{originName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Destination</p>
                  <p className="text-lg font-medium text-gray-900">{alert.destination}</p>
                  <p className="text-sm text-gray-600">{destinationName}</p>
                </div>
              </div>
            </Card>

            {/* Travel Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                Travel Details
              </h3>
              {alert.alertType === 'SPECIFIC' ? (
                <div className="space-y-4">
                  {alert.departureDate && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Departure Date</p>
                      <p className="text-lg font-medium text-gray-900">
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
                      <p className="text-sm text-gray-500 mb-1">Return Date</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(alert.returnDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Flexibility</p>
                    <p className="text-lg font-medium text-gray-900">
                      {alert.isFlexible ? 'Flexible dates (±3 days)' : 'Exact dates only'}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monitoring Period</p>
                  <p className="text-lg font-medium text-gray-900">
                    {alert.searchMonth ? 
                      new Date(alert.searchMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) :
                      'All available dates'
                    }
                  </p>
                </div>
              )}
            </Card>

            {/* Passengers & Price */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                Passengers & Price
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Passengers</p>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-gray-900">{alert.adults} Adult{alert.adults > 1 ? 's' : ''}</p>
                    {alert.children > 0 && (
                      <p className="text-sm text-gray-600">{alert.children} Child{alert.children > 1 ? 'ren' : ''} (2-11)</p>
                    )}
                    {alert.infants > 0 && (
                      <p className="text-sm text-gray-600">{alert.infants} Infant{alert.infants > 1 ? 's' : ''} (0-2)</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Maximum Price</p>
                  <p className="text-2xl font-bold text-purple-600 flex items-center">
                    <DollarSign className="h-6 w-6 mr-1" />
                    {alert.maxPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{alert.currency}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={getStatusColor(alertStatus) as any}>
                    {alertStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium">
                    {alert.alertType === 'MONTHLY' ? 'Monthly' : 'Specific Date'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">
                    {new Date(alert.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {alert.lastChecked && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Checked</span>
                    <span className="text-sm font-medium">
                      {new Date(alert.lastChecked).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Performance Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Triggered</span>
                  <span className="text-lg font-bold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Savings</span>
                  <span className="text-lg font-bold text-green-600">$0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Checks</span>
                  <span className="text-lg font-bold text-gray-900">-</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Performance data will be available as the alert runs.
              </p>
            </Card>
          </div>
          </div>
        </FadeInComponent>
      </div>
    </PageTransition>
  )
}
