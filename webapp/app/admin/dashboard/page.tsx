'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'react-hot-toast'
import { 
  Users, 
  Crown, 
  Shield, 
  Star, 
  TestTube, 
  Mail, 
  Calendar,
  Trash2,
  Link as LinkIcon,
  Unlink,
  Search,
  Plus,
  Edit3,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { LoadingScreen } from '@/components/ui/Spinner'
import { PageTransition, FadeInComponent, StaggerContainer, StaggerItem } from '@/components/ui/PageTransition'

interface AdminUser {
  id: string
  name: string | null
  email: string
  role: 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING'
  telegramId: string | null
  telegramLinked: boolean
  subscriptionEnd: string | null
  subscriptionActive: boolean
  emailVerified: string | null
  createdAt: string
  _count: {
    alerts: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('BASIC')
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'SUPERADMIN') {
      router.push('/dashboard')
      return
    }
    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        toast.error('Error cargando usuarios')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })

      if (response.ok) {
        toast.success('Rol actualizado')
        fetchUsers()
      } else {
        toast.error('Error actualizando rol')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const extendSubscription = async (userId: string, days: number) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          extendSubscription: days 
        })
      })

      if (response.ok) {
        toast.success(`Suscripción extendida por ${days} días`)
        fetchUsers()
      } else {
        toast.error('Error extendiendo suscripción')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const unlinkTelegram = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, unlinkTelegram: true })
      })

      if (response.ok) {
        toast.success('Telegram desvinculado')
        fetchUsers()
      } else {
        toast.error('Error desvinculando Telegram')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        toast.success('Usuario eliminado')
        fetchUsers()
      } else {
        toast.error('Error eliminando usuario')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const sendInvitation = async () => {
    if (!inviteEmail) {
      toast.error('Ingresa un email')
      return
    }

    setIsInviting(true)
    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: inviteEmail,
          role: selectedRole 
        })
      })

      if (response.ok) {
        toast.success('Invitación enviada')
        setInviteEmail('')
      } else {
        toast.error('Error enviando invitación')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsInviting(false)
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return { label: 'Super Admin', color: 'bg-red-100 text-red-800', icon: Crown }
      case 'SUPPORTER':
        return { label: 'Supporter', color: 'bg-purple-100 text-purple-800', icon: Star }
      case 'PREMIUM':
        return { label: 'Premium', color: 'bg-blue-100 text-blue-800', icon: Shield }
      case 'TESTING':
        return { label: 'Testing', color: 'bg-orange-100 text-orange-800', icon: TestTube }
      default:
        return { label: 'Básico', color: 'bg-gray-100 text-gray-800', icon: Users }
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || isLoading) {
    return <LoadingScreen />
  }

  if (!session || session.user.role !== 'SUPERADMIN') {
    return null
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <FadeInComponent className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestión completa de usuarios y suscripciones del sistema.
          </p>
        </FadeInComponent>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['SUPERADMIN', 'SUPPORTER', 'PREMIUM', 'BASIC', 'TESTING'].map(role => {
            const count = users.filter(u => u.role === role).length
            const roleInfo = getRoleInfo(role)
            const RoleIcon = roleInfo.icon
            
            return (
              <Card key={role} className="p-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${roleInfo.color.replace('text-', 'text-white bg-').replace('-100', '-500')}`}>
                    <RoleIcon className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{roleInfo.label}</p>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Invite Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Invitar Nuevo Usuario</h3>
          <div className="flex space-x-4">
            <Input
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="BASIC">Básico</option>
              <option value="PREMIUM">Premium</option>
              <option value="SUPPORTER">Supporter</option>
              <option value="TESTING">Testing</option>
            </select>
            <Button onClick={sendInvitation} disabled={isInviting}>
              {isInviting ? 'Enviando...' : 'Invitar'}
            </Button>
          </div>
        </Card>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar usuarios por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
          </div>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map(user => {
            const roleInfo = getRoleInfo(user.role)
            const RoleIcon = roleInfo.icon
            
            return (
              <Card key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${roleInfo.color.replace('text-', 'text-white bg-').replace('-100', '-500')}`}>
                      <RoleIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {user.name || 'Sin nombre'}
                        </h3>
                        <Badge className={roleInfo.color}>
                          {roleInfo.label}
                        </Badge>
                        {user.emailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Alertas: {user._count.alerts}</span>
                        <span>•</span>
                        <span>Telegram: {user.telegramLinked ? `Vinculado (${user.telegramId})` : 'No vinculado'}</span>
                        <span>•</span>
                        <span>Creado: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      {user.subscriptionEnd && (
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            user.subscriptionActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            Suscripción hasta: {new Date(user.subscriptionEnd).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Change Role */}
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="BASIC">Básico</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="SUPPORTER">Supporter</option>
                      <option value="TESTING">Testing</option>
                      <option value="SUPERADMIN">Super Admin</option>
                    </select>
                    
                    {/* Extend Subscription */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => extendSubscription(user.id, 30)}
                    >
                      +30d
                    </Button>
                    
                    {/* Unlink Telegram */}
                    {user.telegramLinked && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unlinkTelegram(user.id)}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Delete User */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay usuarios</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'Aún no hay usuarios registrados'}
            </p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
