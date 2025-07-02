'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Plane, Bell, Eye, Edit3, Trash2, TrendingDown, Calendar, Settings, X, Play, Pause, User, MessageCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { AlertDetailsModal } from '@/components/ui/AlertDetailsModal'
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
  alertType: 'MONTHLY' | 'SPECIFIC'
  createdAt: string
  updatedAt: string
  lastChecked?: string
}

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, triggered, paused
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { data: session, status } = useSession()
  const router = useRouter()

  // Proteger ruta - solo usuarios autenticados
  useEffect(() => {
    if (status === 'loading') return
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
        setAlerts(data || [])
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

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta alerta?')) {
      return
    }

    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Alerta eliminada exitosamente')
        fetchAlerts() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.message || 'Error al eliminar la alerta')
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
      toast.error('Error al eliminar la alerta')
    }
  }

  const handleTogglePause = async (alertId: string, currentlyPaused: boolean) => {
    try {
      const alert = alerts.find(a => a.id === alertId)
      if (!alert) return

      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...alert,
          isPaused: !currentlyPaused,
          departureDate: alert.departureDate,
          returnDate: alert.returnDate
        })
      })

      if (response.ok) {
        toast.success(currentlyPaused ? 'Alerta reactivada' : 'Alerta pausada')
        fetchAlerts() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.message || 'Error al actualizar la alerta')
      }
    } catch (error) {
      console.error('Error updating alert:', error)
      toast.error('Error al actualizar la alerta')
    }
  }

  const handleViewDetails = (alertId: string) => {
    router.push(`/alerts/view/${alertId}`)
  }

  const handleEditAlert = (alertId: string) => {
    router.push(`/alerts/edit/${alertId}`)
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

  const filteredAlerts = alerts.filter(alert => {
    const originName = getAirportName(alert.origin)
    const destinationName = getAirportName(alert.destination)
    
    const matchesSearch = 
      originName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.destination.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && alert.isActive) ||
      (filterStatus === 'paused' && alert.isPaused)
    
    return matchesSearch && matchesFilter
  })

  const getAlertStatus = (alert: Alert) => {
    if (!alert.isActive) return 'paused'
    if (alert.isPaused) return 'paused'
    // Por ahora todos los activos están "watching", más adelante se puede agregar lógica para "triggered"
    return 'watching'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'success'
      case 'watching': return 'default'
      case 'paused': return 'gray'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'triggered': return TrendingDown
      case 'watching': return Bell
      case 'paused': return Settings
      default: return Bell
    }
  }

  // Mostrar loading mientras carga
  if (status === 'loading' || isLoading) {
    return <LoadingScreen />
  }

  // Redirect si no está autenticado
  if (!session) {
    return null
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <FadeInComponent className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Flight Alerts</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your flight price monitoring alerts and track savings.
          </p>
        </FadeInComponent>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-xl">
                <Bell className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Alerts</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.isActive && !a.isPaused).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 sm:p-3 rounded-xl">
                <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Saved</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">$0</p> {/* Por ahora no tenemos datos de savings */}
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-xl">
                <Plane className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Triggered</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">0</p> {/* Por ahora no tenemos datos de triggered */}
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 sm:p-3 rounded-xl">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">This Month</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {alerts.filter(a => {
                    const created = new Date(a.createdAt)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search routes, airports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2 sm:space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="triggered">Triggered</option>
              <option value="paused">Paused</option>
            </select>
            
            <Button variant="outline" className="whitespace-nowrap">
              <Filter className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
            </Button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const alertStatus = getAlertStatus(alert)
            const StatusIcon = getStatusIcon(alertStatus)
            const originName = getAirportName(alert.origin)
            const destinationName = getAirportName(alert.destination)
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover="lift" className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      {/* Status Icon */}
                      <div className={`p-2 rounded-xl flex-shrink-0 ${
                        alertStatus === 'watching' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          alertStatus === 'watching' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>

                      {/* Alert Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {originName} → {destinationName}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={getStatusColor(alertStatus) as any} className="text-xs">
                              {alertStatus}
                            </Badge>
                            <Badge variant="gray" size="sm" className="text-xs">
                              {alert.alertType === 'MONTHLY' ? 'Monthly' : 'Specific Date'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">Route</p>
                            <p className="font-medium truncate">{alert.origin} → {alert.destination}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">Max Price</p>
                            <p className="font-medium truncate">${alert.maxPrice}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">Passengers</p>
                            <p className="font-medium truncate">{alert.adults}A {alert.children > 0 && `${alert.children}C`} {alert.infants > 0 && `${alert.infants}I`}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-500 truncate">Created</p>
                            <p className="font-medium truncate">{new Date(alert.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Departure Date for Specific Alerts */}
                        {alert.alertType === 'SPECIFIC' && alert.departureDate && (
                          <div className="mt-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs sm:text-sm text-blue-800">
                              📅 Departure: {new Date(alert.departureDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDetails(alert.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Edit Alert"
                        onClick={() => handleEditAlert(alert.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Delete Alert" 
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleTogglePause(alert.id, alert.isPaused)}
                        title={alert.isPaused ? "Reactivate Alert" : "Pause Alert"}
                        className={alert.isPaused ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}
                      >
                        {alert.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <Card className="p-12 text-center">
            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No alerts found' : 'No alerts yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first flight alert to start monitoring prices.'
              }
            </p>
            <Link href="/alerts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </Link>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link href="/alerts/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create New Alert
            </Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}
