'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { botConfig } from '@/lib/bot-config'

export default function TelegramTestPage() {
  const [userId, setUserId] = useState('cmcp4ezlk00003eu32mq624oe')
  const [userRole, setUserRole] = useState('BASIC')
  const [userEmail, setUserEmail] = useState('test-fresh@telegramlink.com')
  const [isPolling, setIsPolling] = useState(false)
  const [pollResults, setPollResults] = useState<any[]>([])
  const [linkStatus, setLinkStatus] = useState<any>(null)

  const generateTelegramLink = () => {
    const authLink = botConfig.createUserAuthLink(userId, userRole, userEmail)
    return authLink
  }

  const startPolling = () => {
    setIsPolling(true)
    setPollResults([])
    
    let attempts = 0
    const maxAttempts = 30

    const interval = setInterval(async () => {
      attempts++
      console.log(`🔄 Poll attempt ${attempts}/${maxAttempts}`)
      
      try {
        const response = await fetch('/api/user/test-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
        
        const data = await response.json()
        
        setPollResults(prev => [...prev, {
          attempt: attempts,
          timestamp: new Date().toLocaleTimeString(),
          status: response.status,
          data: data
        }])
        
        if (data.success && data.user?.telegramLinked) {
          setLinkStatus(data.user)
          clearInterval(interval)
          setIsPolling(false)
          console.log('✅ Vinculación detectada!')
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          setIsPolling(false)
          console.log('⏰ Tiempo agotado')
        }
      } catch (error) {
        console.error('Error in polling:', error)
        setPollResults(prev => [...prev, {
          attempt: attempts,
          timestamp: new Date().toLocaleTimeString(),
          status: 'ERROR',
          data: { error: String(error) }
        }])
      }
    }, 1000)
  }

  const checkCurrentStatus = async () => {
    try {
      const response = await fetch('/api/user/test-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      const data = await response.json()
      setLinkStatus(data.user || data)
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }

  const telegramLink = generateTelegramLink()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Test de Vinculación de Telegram</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">User ID</label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">User Role</label>
              <Input
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="User Role"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">User Email</label>
              <Input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="User Email"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enlace de Telegram</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Enlace generado:</p>
            <p className="font-mono text-sm break-all">{telegramLink}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => window.open(telegramLink, '_blank')}
              className="flex-1"
            >
              Abrir en Telegram
            </Button>
            <Button 
              onClick={startPolling}
              disabled={isPolling}
              variant="outline"
              className="flex-1"
            >
              {isPolling ? 'Polling...' : 'Iniciar Polling'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Estado Actual</h2>
          <Button onClick={checkCurrentStatus} className="mb-4">
            Verificar Estado
          </Button>
          {linkStatus && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm">{JSON.stringify(linkStatus, null, 2)}</pre>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados del Polling</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pollResults.map((result, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Intento {result.attempt}</span>
                  <span className="text-gray-500">{result.timestamp}</span>
                </div>
                <div className="text-xs">
                  Status: {result.status} | 
                  Linked: {result.data?.user?.telegramLinked ? '✅' : '❌'} |
                  TelegramId: {result.data?.user?.telegramId || 'None'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
