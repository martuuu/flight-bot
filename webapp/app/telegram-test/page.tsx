'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export default function TelegramTestPage() {
  const { data: session, update } = useSession()
  const [telegramId, setTelegramId] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [isLinking, setIsLinking] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTestLink = async () => {
    if (!telegramId) {
      alert('Ingresa un Telegram ID')
      return
    }

    setIsLinking(true)
    try {
      const response = await fetch('/api/telegram/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId,
          telegramUsername
        })
      })

      const data = await response.json()
      setResult(data)

      if (response.ok) {
        // Actualizar sesión para reflejar el cambio
        await update({
          ...session,
          user: {
            ...session?.user,
            telegramLinked: true,
            telegramId: telegramId,
          }
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'Error de conexión' })
    } finally {
      setIsLinking(false)
    }
  }

  const handleUnlink = async () => {
    setIsLinking(true)
    try {
      const response = await fetch('/api/telegram/link', {
        method: 'DELETE'
      })

      const data = await response.json()
      setResult(data)

      if (response.ok) {
        await update({
          ...session,
          user: {
            ...session?.user,
            telegramLinked: false,
            telegramId: undefined,
          }
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'Error de conexión' })
    } finally {
      setIsLinking(false)
    }
  }

  const generateAuthLink = () => {
    if (!session?.user) return '#'
    
    const authData = btoa(JSON.stringify({ 
      userId: session.user.id, 
      userRole: session.user.role, 
      userEmail: session.user.email, 
      timestamp: Date.now() 
    }))
    
    return `https://t.me/ticketscannerbot_bot?start=auth_${authData}`
  }

  if (!session) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Telegram Link Test</h1>
        <p>Debes estar logueado para usar esta página.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Telegram Link Test</h1>
      
      {/* Estado actual */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Estado Actual</h2>
        <div className="space-y-2">
          <p><strong>Usuario:</strong> {session.user?.email}</p>
          <p><strong>ID:</strong> {session.user?.id}</p>
          <p><strong>Rol:</strong> {session.user?.role}</p>
          <p><strong>Telegram Vinculado:</strong> {session.user?.telegramLinked ? 'Sí' : 'No'}</p>
          {session.user?.telegramId && (
            <p><strong>Telegram ID:</strong> {session.user.telegramId}</p>
          )}
        </div>
      </Card>

      {/* Test manual de vinculación */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test Manual de Vinculación</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Telegram ID</label>
            <Input
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="123456789"
              className="mb-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Telegram Username (opcional)</label>
            <Input
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              placeholder="@username"
            />
          </div>

          <div className="space-x-2">
            <Button 
              onClick={handleTestLink} 
              disabled={isLinking}
              className="mr-2"
            >
              {isLinking ? 'Vinculando...' : 'Vincular Manualmente'}
            </Button>
            
            {session.user?.telegramLinked && (
              <Button 
                onClick={handleUnlink} 
                disabled={isLinking}
                variant="outline"
              >
                Desvincular
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Enlace de autorización real */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Enlace de Autorización Real</h2>
        <p className="text-sm text-gray-600 mb-4">
          Este es el enlace que se genera cuando haces clic en "Vincular con Telegram"
        </p>
        <div className="bg-gray-100 p-3 rounded text-sm break-all mb-4">
          {generateAuthLink()}
        </div>
        <Button 
          onClick={() => window.open(generateAuthLink(), '_blank')}
          variant="outline"
        >
          Abrir Enlace en Telegram
        </Button>
      </Card>

      {/* Resultado */}
      {result && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Resultado</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}

      {/* Instrucciones */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Cómo probar la vinculación real</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Haz clic en "Abrir Enlace en Telegram" arriba</li>
          <li>Telegram se abrirá con el bot @ticketscannerbot_bot</li>
          <li>El bot debería procesar automáticamente la vinculación</li>
          <li>Verifica que el estado se actualice en la webapp</li>
          <li>Si no funciona, usa el "Test Manual" con tu Telegram ID real</li>
        </ol>
        
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Para obtener tu Telegram ID:</strong> Envía cualquier mensaje al bot 
            @userinfobot en Telegram y te dirá tu ID.
          </p>
        </div>
      </Card>
    </div>
  )
}
