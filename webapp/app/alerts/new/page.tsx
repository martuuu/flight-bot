'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plane } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FlightSearchForm, FlightSearchData } from '@/components/ui/FlightSearchForm'
import { LoadingScreen } from '@/components/ui/Spinner'
import { PageTransition, FadeInComponent } from '@/components/ui/PageTransition'

export default function NewAlertPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Proteger ruta - solo usuarios autenticados
  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  const handleFormSubmit = async (data: FlightSearchData) => {
    if (!session?.user) {
      toast.error('Debes estar autenticado para crear alertas')
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    
    try {
      const alertPayload = {
        origin: data.origin,
        destination: data.destination,
        maxPrice: data.maxPrice,
        currency: 'USD',
        departureDate: data.departureDate,
        returnDate: data.returnDate,
        isFlexible: data.alertType === 'monthly',
        adults: data.adults,
        children: data.children,
        infants: data.infants,
        alertType: data.alertType === 'monthly' ? 'MONTHLY' : 'SPECIFIC',
      }

      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertPayload),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('¡Alerta creada exitosamente!')
        router.push('/dashboard')
      } else {
        toast.error(result.message || 'Error al crear la alerta')
      }
    } catch (error) {
      console.error('Error creating alert:', error)
      toast.error('Error al crear la alerta')
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading mientras verifica autenticación
  if (status === 'loading') {
    return <LoadingScreen />
  }

  // Redirect si no está autenticado (esto no debería ejecutarse por el useEffect)
  if (!session) {
    return null
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <FadeInComponent className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Flight Alert</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Set up a new flight price alert to monitor your desired routes.
            </p>
          </FadeInComponent>

          {/* Form Card */}
          <FadeInComponent delay={0.1}>
            <Card className="p-6">
              <FlightSearchForm 
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
              />
            </Card>
          </FadeInComponent>
        </div>
      </div>
    </PageTransition>
  )
}
