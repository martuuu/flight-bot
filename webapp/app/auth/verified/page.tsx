'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react'

export default function AuthVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="text-center p-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Email Verificado!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todas las funciones de Flight-Bot.
          </p>
          
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full">
                Ir al Dashboard
              </Button>
            </Link>
            
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center text-blue-800 text-sm">
              <Mail className="h-4 w-4 mr-2" />
              Revisa tu email para el mensaje de bienvenida
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
