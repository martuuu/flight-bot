'use client'

import { useEffect, useState } from 'react'
import { getProviders } from 'next-auth/react'

export default function DebugPage() {
  const [providers, setProviders] = useState<any>(null)
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders()
        setProviders(res)
      } catch (error) {
        console.error('Error fetching providers:', error)
      }
    }
    
    // Solo variables públicas (sin secretos)
    setEnvVars({
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    })
    
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Environment Variables */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(envVars, null, 2)}
            </pre>
          </div>

          {/* Providers */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">NextAuth Providers</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {providers ? JSON.stringify(providers, null, 2) : 'Loading...'}
            </pre>
          </div>

          {/* Provider Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Provider Status</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${providers?.google ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Google Provider: {providers?.google ? 'Available' : 'Not Available'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${providers?.credentials ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Credentials Provider: {providers?.credentials ? 'Available' : 'Not Available'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href = '/auth/signin'}
                className="block w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Sign In
              </button>
              <button 
                onClick={() => window.location.href = '/auth/signup'}
                className="block w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Go to Sign Up
              </button>
              <button 
                onClick={() => window.location.href = '/api/auth/providers'}
                className="block w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Check API Providers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
