'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Bell, Plane, TrendingDown, Calendar, Settings, ArrowRight, Eye, Trash2, Edit3, MessageCircle, Shield, Play, Pause, User, Ticket, MapPin } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { botConfig } from '@/lib/bot-config'

import { LoadingScreen, Spinner } from '@/components/ui/Spinner'
import { PageTransition, FadeInComponent, StaggerContainer, StaggerItem } from '@/components/ui/PageTransition'

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
  alertType: 'MONTHLY' | 'SPECIFIC' | 'MILES_PROMO' | 'EVENTS'
  createdAt: string
  updatedAt: string
  lastChecked?: string
  searchMonth?: string
  eventType?: string
  milesRequired?: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchAlerts()
  }, [session, status, router])

  const fetchAlerts = async () => {
    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/alerts')
      const data = await response.json()
      
      if (response.ok) {
        // Add mock alerts for testing new alert types
        const mockAlerts = [
          {
            id: 'mock-miles-1',
            userId: session.user.id,
            origin: 'JFK',
            destination: 'NRT',
            maxPrice: 0,
            currency: 'MILES',
            isFlexible: true,
            adults: 1,
            children: 0,
            infants: 0,
            isActive: true,
            isPaused: false,
            alertType: 'MILES_PROMO' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            milesRequired: 60000
          },
          {
            id: 'mock-events-1',
            userId: session.user.id,
            origin: 'MIA',
            destination: 'BCN',
            maxPrice: 800,
            currency: 'USD',
            isFlexible: true,
            adults: 2,
            children: 0,
            infants: 0,
            isActive: true,
            isPaused: false,
            alertType: 'EVENTS' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            eventType: 'Champions League Final'
          }
        ]
        
        setAlerts([...(data || []), ...mockAlerts])
      } else {
        toast.error('Failed to fetch alerts')
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Something went wrong while fetching alerts')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (!session) {
    return null
  }

  const filteredAlerts = alerts.filter(alert =>
    alert.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    {
      label: 'Active Alerts',
      value: alerts.filter(a => a.isActive && !a.isPaused).length.toString(),
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Monthly Alerts',
      value: alerts.filter(a => a.alertType === 'MONTHLY').length.toString(),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Alerts',
      value: alerts.length.toString(),
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  const getStatusBadge = (alert: Alert) => {
    if (!alert.isActive) return <Badge variant="gray">Inactive</Badge>
    if (alert.isPaused) return <Badge variant="warning">Paused</Badge>
    return <Badge variant="success">Active</Badge>
  }

  const getAlertTypeDisplay = (alert: Alert) => {
    if (alert.alertType === 'MONTHLY') {
      return alert.searchMonth ? `Monthly (${alert.searchMonth})` : 'Monthly'
    }
    if (alert.alertType === 'MILES_PROMO') {
      return `Miles Promo (${alert.milesRequired?.toLocaleString()} miles)`
    }
    if (alert.alertType === 'EVENTS') {
      return `Event: ${alert.eventType}`
    }
    return alert.departureDate ? `Specific (${alert.departureDate})` : 'Specific Date'
  }

  const getAlertIcon = (alert: Alert) => {
    switch (alert.alertType) {
      case 'MONTHLY':
        return Calendar
      case 'MILES_PROMO':
        return Ticket
      case 'EVENTS':
        return MapPin
      case 'SPECIFIC':
      default:
        return Plane
    }
  }

  const getAlertColors = (alert: Alert) => {
    switch (alert.alertType) {
      case 'MONTHLY':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600'
      case 'MILES_PROMO':
        return 'bg-gradient-to-r from-amber-600 to-orange-600'
      case 'EVENTS':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600'
      case 'SPECIFIC':
      default:
        return 'bg-gradient-to-r from-purple-600 to-violet-600'
    }
  }

  const handleViewAlert = (alertId: string) => {
    router.push(`/alerts/view/${alertId}`)
  }

  const handleEditAlert = (alertId: string) => {
    router.push(`/alerts/edit/${alertId}`)
  }

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return

    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Alert deleted successfully')
        fetchAlerts() // Refresh the alerts list
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete alert')
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
      toast.error('Something went wrong while deleting the alert')
    }
  }

  const handleTogglePause = async (alertId: string, isPaused: boolean) => {
    try {
      // Primero obtenemos los datos actuales de la alerta
      const getResponse = await fetch(`/api/alerts/${alertId}`)
      if (!getResponse.ok) {
        toast.error('Failed to fetch alert data')
        return
      }
      
      const alertData = await getResponse.json()
      
      // Actualizamos solo el campo isPaused manteniendo el resto de datos
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...alertData,
          isPaused: !isPaused
        }),
      })

      if (response.ok) {
        toast.success(`Alert ${isPaused ? 'activated' : 'paused'} successfully`)
        fetchAlerts() // Refresh the alerts list
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update alert status')
      }
    } catch (error) {
      console.error('Error updating alert:', error)
      toast.error('Something went wrong while updating the alert')
    }
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <FadeInComponent className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor your flight price alerts and track savings.
          </p>
        </FadeInComponent>
        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <StaggerItem key={stat.label}>
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search alerts by origin or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <Spinner className="mx-auto mb-4" />
              <p className="text-gray-500">Loading your alerts...</p>
            </Card>
          ) : filteredAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'No alerts match your search criteria.' : 'Create your first flight alert to get started.'}
              </p>
              <Link href="/alerts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Alert
                </Button>
              </Link>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow" hover="lift">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className={`${getAlertColors(alert)} p-2 sm:p-3 rounded-xl text-white flex-shrink-0`}>
                        {(() => {
                          const IconComponent = getAlertIcon(alert)
                          return <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                        })()}
                      </div>
                      
                      {/* Alert Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {alert.origin} → {alert.destination}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(alert)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">
                              {alert.alertType === 'MILES_PROMO' ? 'Miles Required' : 'Max Price'}
                            </p>
                            <p className="font-medium truncate">
                              {alert.alertType === 'MILES_PROMO' 
                                ? `${alert.milesRequired?.toLocaleString()} miles` 
                                : `$${alert.maxPrice} ${alert.currency}`
                              }
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">Type</p>
                            <p className="font-medium truncate">{getAlertTypeDisplay(alert)}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">Passengers</p>
                            <p className="font-medium truncate">
                              {alert.adults}A {alert.children > 0 && `${alert.children}C`} {alert.infants > 0 && `${alert.infants}I`}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">Created</p>
                            <p className="font-medium truncate">
                              {new Date(alert.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewAlert(alert.id)}
                        title="View Alert Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleTogglePause(alert.id, alert.isPaused)}
                        title={alert.isPaused ? "Activate Alert" : "Pause Alert"}
                        className={alert.isPaused ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}
                      >
                        {alert.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAlert(alert.id)}
                        title="Edit Alert"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        title="Delete Alert"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Telegram Integration CTA */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mt-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Connect with Telegram Bot</h3>
              <p className="text-gray-600">Get instant notifications and manage alerts directly from Telegram</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // Crear enlace con datos de usuario para autenticación
                const authLink = botConfig.createUserAuthLink(
                  '123456789', // ID de usuario real
                  'premium', // rol del usuario
                  'user@example.com' // email del usuario si está disponible
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
    </PageTransition>
  )
}
