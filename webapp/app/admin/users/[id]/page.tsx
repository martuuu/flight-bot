'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  User, 
  Mail, 
  Crown, 
  Shield, 
  Star, 
  Calendar, 
  Activity,
  AlertCircle,
  Check,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface UserDetails {
  id: string
  name: string | null
  email: string
  role: string
  subscriptionStatus: string
  subscriptionPlan: string
  subscriptionExpires: string | null
  telegramLinked: boolean
  telegramUsername: string | null
  createdAt: string
  updatedAt: string
  alerts: Array<{
    id: string
    origin: string
    destination: string
    maxPrice: number
    alertType: string
    isActive: boolean
    isPaused: boolean
    createdAt: string
  }>
}

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`)
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        toast.error('Error al cargar usuario')
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Error al cargar usuario')
      router.push('/admin/users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Usuario eliminado exitosamente')
        router.push('/admin/users')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Error al eliminar usuario')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error al eliminar usuario')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return Crown
      case 'SUPPORTER': return Shield
      case 'PREMIUM': return Star
      default: return User
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return 'purple'
      case 'SUPPORTER': return 'blue'
      case 'PREMIUM': return 'yellow'
      default: return 'gray'
    }
  }

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green'
      case 'EXPIRED': return 'red'
      default: return 'gray'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Usuario no encontrado</h2>
          <Link href="/admin/users">
            <Button className="mt-4">Volver a usuarios</Button>
          </Link>
        </div>
      </div>
    )
  }

  const RoleIcon = getRoleIcon(user.role)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Link>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  user.role === 'SUPERADMIN' ? 'bg-purple-100' :
                  user.role === 'SUPPORTER' ? 'bg-blue-100' :
                  user.role === 'PREMIUM' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <RoleIcon className={`h-6 w-6 ${
                    user.role === 'SUPERADMIN' ? 'text-purple-600' :
                    user.role === 'SUPPORTER' ? 'text-blue-600' :
                    user.role === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name || 'Unnamed User'}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href={`/admin/users/${user.id}/edit`}>
                <Button variant="outline" className="flex items-center">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleDeleteUser}
                className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <Badge variant={getRoleColor(user.role) as any}>{user.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Subscription Info */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getSubscriptionColor(user.subscriptionStatus) as any}>
                    {user.subscriptionStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium">{user.subscriptionPlan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expires</p>
                  <p className="font-medium">
                    {user.subscriptionExpires 
                      ? new Date(user.subscriptionExpires).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Telegram Integration */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Telegram Integration</h3>
              {user.telegramLinked ? (
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">Telegram Linked</p>
                    <p className="text-sm text-green-600">@{user.telegramUsername || 'Unknown'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <X className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Telegram Not Linked</p>
                    <p className="text-sm text-gray-500">User has not connected their Telegram account</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Stats & Alerts */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Alerts</span>
                  <span className="text-2xl font-bold text-gray-900">{user.alerts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Alerts</span>
                  <span className="text-2xl font-bold text-green-600">
                    {user.alerts.filter(a => a.isActive && !a.isPaused).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Paused Alerts</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {user.alerts.filter(a => a.isPaused).length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Alerts */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {user.alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {alert.origin} → {alert.destination}
                      </span>
                      <Badge 
                        variant={alert.isActive && !alert.isPaused ? 'success' : alert.isPaused ? 'warning' : 'gray'}
                        size="sm"
                      >
                        {alert.isActive && !alert.isPaused ? 'Active' : alert.isPaused ? 'Paused' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Max: ${alert.maxPrice} • {alert.alertType}
                    </p>
                  </div>
                ))}
                {user.alerts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No alerts created yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
