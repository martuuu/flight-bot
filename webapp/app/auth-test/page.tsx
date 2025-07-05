'use client'

import { useSession, signIn, signOut, getProviders } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function AuthTestPage() {
  const { data: session, status, update } = useSession()
  const [providers, setProviders] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [dbStats, setDbStats] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
    fetchDebugInfo()
    fetchUsers()
    fetchDbStats()
  }, [])

  const fetchDebugInfo = async () => {
    try {
      const res = await fetch('/api/auth-debug')
      const data = await res.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error fetching debug info:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list-users' })
      })
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchDbStats = async () => {
    try {
      const res = await fetch('/api/reset-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stats' })
      })
      const data = await res.json()
      setDbStats(data.stats)
    } catch (error) {
      console.error('Error fetching DB stats:', error)
    }
  }

  const forceSessionUpdate = async () => {
    try {
      const res = await fetch('/api/debug/user', { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        // Actualizar la sesión
        await update(data.updatedUser)
        alert('Sesión actualizada exitosamente')
        
        // Refrescar datos
        fetchDebugInfo()
        fetchUsers()
        fetchDbStats()
      } else {
        alert('Error actualizando sesión: ' + data.error)
      }
    } catch (error) {
      console.error('Error forcing session update:', error)
      alert('Error actualizando sesión')
    }
  }

  const clearSessions = async () => {
    try {
      const res = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-sessions' })
      })
      const data = await res.json()
      alert(data.message)
      fetchUsers()
    } catch (error) {
      console.error('Error clearing sessions:', error)
    }
  }

  const clearUsers = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos los usuarios (excepto superadmins)?')) {
      try {
        const res = await fetch('/api/clear-cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clear-users' })
        })
        const data = await res.json()
        alert(data.message)
        fetchUsers()
        fetchDbStats()
      } catch (error) {
        console.error('Error clearing users:', error)
      }
    }
  }

  const resetDatabase = async () => {
    if (confirm('⚠️ PELIGRO: Esto eliminará TODOS los datos. ¿Estás seguro?')) {
      if (confirm('🚨 CONFIRMACIÓN FINAL: ¿Realmente quieres resetear toda la base de datos?')) {
        try {
          const res = await fetch('/api/reset-db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reset-all', confirm: 'RESET_EVERYTHING' })
          })
          const data = await res.json()
          alert(data.message)
          fetchUsers()
          fetchDbStats()
          // Recargar la página para limpiar la sesión
          window.location.reload()
        } catch (error) {
          console.error('Error resetting database:', error)
        }
      }
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Auth Test & Debug</h1>
      
      {/* Session Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Session Status</h2>
        <div className="space-y-2">
          <p><strong>Status:</strong> {status}</p>
          {session ? (
            <div>
              <p><strong>User:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
              <p><strong>Role:</strong> {(session.user as any)?.role}</p>
              <p><strong>Telegram Linked:</strong> {(session.user as any)?.telegramLinked ? 'Yes' : 'No'}</p>
              <p><strong>Telegram ID:</strong> {(session.user as any)?.telegramId || 'No vinculado'}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => signOut()}>
                  Sign Out
                </Button>
                <Button onClick={forceSessionUpdate} variant="outline">
                  🔄 Forzar Actualización
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Button onClick={() => signIn('google')}>
                Sign In with Google
              </Button>
              <Button onClick={() => signIn()} variant="outline">
                Sign In (General)
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Debug Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        {debugInfo && (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </Card>

      {/* Providers */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Available Providers</h2>
        {providers && (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(providers, null, 2)}
          </pre>
        )}
      </Card>

      {/* Database Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Database Statistics</h2>
        {dbStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{dbStats.users}</div>
              <div className="text-sm text-blue-800">Users</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{dbStats.accounts}</div>
              <div className="text-sm text-green-800">Accounts</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">{dbStats.sessions}</div>
              <div className="text-sm text-yellow-800">Sessions</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">{dbStats.verificationTokens}</div>
              <div className="text-sm text-purple-800">Tokens</div>
            </div>
          </div>
        )}
        <div className="mt-4 space-x-2">
          <Button onClick={fetchDbStats} variant="outline">Refresh Stats</Button>
        </div>
      </Card>

      {/* Users */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Users in Database</h2>
        <div className="space-y-4">
          <div className="space-x-2">
            <Button onClick={fetchUsers} variant="outline">Refresh Users</Button>
            <Button onClick={clearSessions} variant="outline">Clear Sessions</Button>
            <Button onClick={clearUsers} variant="secondary">Clear Users</Button>
          </div>
          
          {users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user, index) => (
                <div key={user.id} className="p-3 border rounded">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                  <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                  <p><strong>Accounts:</strong> {user.accounts.map((acc: any) => acc.provider).join(', ')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </Card>
    </div>
  )
}
