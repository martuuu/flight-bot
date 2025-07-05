'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import TelegramLinkImproved from '@/components/TelegramLinkImproved'
import { Card } from '@/components/ui/Card'
import { PageTransition, FadeInComponent, StaggerContainer, StaggerItem } from '@/components/ui/PageTransition'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) router.push('/auth/signin')
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <FadeInComponent className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gestiona tu cuenta y configuración de usuario.
            </p>
          </FadeInComponent>

          <StaggerContainer className="space-y-6">
            {/* Información del Usuario */}
            <StaggerItem>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <p className="text-gray-900">{session.user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{session.user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ID de Usuario</label>
                    <p className="text-gray-500 text-sm font-mono">{session.user.id}</p>
                  </div>
                </div>
              </Card>
            </StaggerItem>

            {/* Gestión de Telegram */}
            <StaggerItem>
              <TelegramLinkImproved />
            </StaggerItem>

            {/* Información de Suscripción */}
            <StaggerItem>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Plan de Suscripción</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Plan Actual</p>
                      <p className="text-sm text-gray-600">
                        {session.user.role === 'SUPERADMIN' ? 'Super Administrador - Acceso total' :
                       session.user.role === 'SUPPORTER' ? 'Plan Supporter - Premium top level' :
                       session.user.role === 'PREMIUM' ? 'Plan Premium - Acceso completo' :
                       session.user.role === 'BASIC' ? 'Plan Básico - Funciones limitadas' :
                       session.user.role === 'TESTING' ? 'Plan de Pruebas - Para testing' :
                       'Plan no identificado'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.user.role === 'SUPERADMIN' ? 'bg-red-100 text-red-800' :
                      session.user.role === 'SUPPORTER' ? 'bg-purple-100 text-purple-800' :
                      session.user.role === 'PREMIUM' ? 'bg-blue-100 text-blue-800' :
                      session.user.role === 'TESTING' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.user.role === 'SUPERADMIN' ? 'Super Admin' :
                       session.user.role === 'SUPPORTER' ? 'Supporter' :
                       session.user.role === 'PREMIUM' ? 'Premium' :
                       session.user.role === 'TESTING' ? 'Testing' :
                       'Básico'}
                    </span>
                  </div>
                  
                  {(session.user.role === 'PREMIUM' || session.user.role === 'SUPPORTER') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="font-medium text-blue-900">Estado de Suscripción</h4>
                      {session.user.subscriptionEnd ? (
                        <div className="mt-2">
                          <p className="text-sm text-blue-700">
                            <span className={`font-medium ${
                              session.user.subscriptionActive ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {session.user.subscriptionActive ? '✅ Activa' : '❌ Expirada'}
                            </span>
                            {' '}hasta: {new Date(session.user.subscriptionEnd).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-blue-700 mt-1">
                          Sin información de suscripción
                        </p>
                      )}
                    </div>
                  )}
                  
                  {session.user.role === 'BASIC' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                      <h4 className="font-medium text-purple-900">Mejora a Premium</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Obtén acceso a alertas ilimitadas, notificaciones avanzadas y más funciones.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </StaggerItem>

            {/* Estadísticas de uso */}
            <StaggerItem>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Estadísticas de Uso</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">-</p>
                    <p className="text-sm text-gray-600">Alertas Activas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">-</p>
                    <p className="text-sm text-gray-600">Búsquedas Realizadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">-</p>
                    <p className="text-sm text-gray-600">Ofertas Encontradas</p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </PageTransition>
  )
}
