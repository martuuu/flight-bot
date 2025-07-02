'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Shield, 
  Crown,
  Star,
  User,
  Mail,
  Calendar,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { LoadingScreen } from '@/components/ui/Spinner'
import { PageTransition, FadeInComponent, StaggerContainer, StaggerItem } from '@/components/ui/PageTransition'

interface User {
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
  _count: {
    alerts: number
  }
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  
  const { data: session, status } = useSession()
  const router = useRouter()

  // Proteger ruta - solo usuarios admin
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data || [])
      } else {
        if (response.status === 403) {
          toast.error('No tienes permisos para acceder a esta página')
          router.push('/dashboard')
          return
        }
        toast.error('Error al cargar usuarios')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Usuario eliminado exitosamente')
        fetchUsers()
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegramUsername?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    
    return matchesSearch && matchesRole
  })

  if (status === 'loading' || isLoading) {
    return <LoadingScreen />
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <FadeInComponent className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage system users and permissions.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/admin/users/create">
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </Link>
            </div>
          </div>
        </FadeInComponent>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => ['SUPERADMIN', 'SUPPORTER'].includes(u.role)).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.subscriptionStatus === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.subscriptionPlan === 'PREMIUM').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="SUPPORTER">Supporter</option>
            <option value="PREMIUM">Premium</option>
            <option value="BASIC">Basic</option>
          </select>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user, index) => {
            const RoleIcon = getRoleIcon(user.role)
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover="lift" className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Role Icon */}
                      <div className={`p-2 rounded-xl ${
                        user.role === 'SUPERADMIN' ? 'bg-purple-100' :
                        user.role === 'SUPPORTER' ? 'bg-blue-100' :
                        user.role === 'PREMIUM' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <RoleIcon className={`h-5 w-5 ${
                          user.role === 'SUPERADMIN' ? 'text-purple-600' :
                          user.role === 'SUPPORTER' ? 'text-blue-600' :
                          user.role === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.name || 'Unnamed User'}
                          </h3>
                          <Badge variant={getRoleColor(user.role) as any}>
                            {user.role}
                          </Badge>
                          <Badge variant={getSubscriptionColor(user.subscriptionStatus) as any}>
                            {user.subscriptionStatus}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Plan</p>
                            <p className="font-medium">{user.subscriptionPlan}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Alerts</p>
                            <p className="font-medium">{user._count.alerts}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Joined</p>
                            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Telegram Info */}
                        {user.telegramLinked && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                              📱 Telegram: @{user.telegramUsername || 'Unknown'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit User">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>
                      {user.id !== session?.user?.id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete User" 
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterRole !== 'all' ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No users have been registered yet.'
              }
            </p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
