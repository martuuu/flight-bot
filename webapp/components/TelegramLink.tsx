'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { botConfig } from '@/lib/bot-config'

interface TelegramLinkProps {
  onLinkUpdate?: () => void
}

export default function TelegramLink({ onLinkUpdate }: TelegramLinkProps) {
  const { data: session, update } = useSession()
  const [isLinking, setIsLinking] = useState(false)
  const [isUnlinking, setIsUnlinking] = useState(false)

  const handleTelegramLink = () => {
    if (!session?.user) return
    
    setIsLinking(true)
    const authLink = botConfig.createUserAuthLink(
      session.user.id,
      session.user.role,
      session.user.email || ''
    )
    
    // Abrir en nueva ventana
    window.open(authLink, '_blank', 'width=400,height=600')
    setIsLinking(false)
  }

  const handleTelegramUnlink = async () => {
    setIsUnlinking(true)
    try {
      const response = await fetch('/api/telegram/link', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Actualizar sesión
        await update({
          ...session,
          user: {
            ...session?.user,
            telegramLinked: false,
            telegramId: undefined,
          }
        })
        
        onLinkUpdate?.()
      } else {
        throw new Error('Error al desvincular')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al desvincular Telegram')
    } finally {
      setIsUnlinking(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return 'bg-red-100 text-red-800'
      case 'SUPPORTER': return 'bg-purple-100 text-purple-800'
      case 'PREMIUM': return 'bg-blue-100 text-blue-800'
      case 'TESTING': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return 'Super Admin'
      case 'SUPPORTER': return 'Supporter'
      case 'PREMIUM': return 'Premium'
      case 'TESTING': return 'Testing'
      default: return 'Básico'
    }
  }

  if (!session?.user) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Inicia sesión para gestionar tu cuenta</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Configuración de Cuenta</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(session.user.role)}`}>
            {getRoleLabel(session.user.role)}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{session.user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Estado de Telegram</label>
            <div className="flex items-center justify-between mt-1">
              {session.user.telegramLinked ? (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-600">
                    Vinculado {session.user.telegramId && `(ID: ${session.user.telegramId})`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">No vinculado</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          {session.user.telegramLinked ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Tu cuenta está vinculada con Telegram. Puedes usar el bot @ticketscannerbot_bot
              </p>
              <Button
                onClick={handleTelegramUnlink}
                disabled={isUnlinking}
                variant="outline"
                className="w-full"
              >
                {isUnlinking ? 'Desvinculando...' : 'Desvincular Telegram'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Vincula tu cuenta con Telegram para recibir alertas y usar el bot
              </p>
              <Button
                onClick={handleTelegramLink}
                disabled={isLinking}
                className="w-full"
              >
                {isLinking ? 'Abriendo Telegram...' : 'Vincular con Telegram'}
              </Button>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </Card>
  )
}
