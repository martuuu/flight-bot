'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { XCircle, AlertCircle, RefreshCw, Mail } from 'lucide-react'
import { toast } from 'react-hot-toast'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [showResendForm, setShowResendForm] = useState(false)

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Verification email sent! Please check your inbox.')
        setShowResendForm(false)
        setEmail('')
      } else {
        toast.error(result.message || 'Failed to send verification email')
      }
    } catch (error) {
      toast.error('Failed to send verification email')
    } finally {
      setIsResending(false)
    }
  }

  const getErrorInfo = (errorCode: string | null | undefined) => {
    switch (errorCode) {
      case 'Callback':
      case 'OAuthCallback':
      case 'OAuthAccountNotLinked':
        return {
          title: 'Google Authentication Error',
          message: 'There was an error with the Google authentication process. This could be due to an incorrect configuration or because you already have an account with a different sign-in method.',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        }
      case 'MissingToken':
        return {
          title: 'Token Missing',
          message: 'The verification link is incomplete.',
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100'
        }
      case 'InvalidToken':
        return {
          title: 'Invalid Token',
          message: 'The verification link is not valid.',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        }
      case 'ExpiredToken':
        return {
          title: 'Token Expired',
          message: 'The verification link has expired. Request a new one.',
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100'
        }
      case 'UserNotFound':
        return {
          title: 'User Not Found',
          message: 'No account found associated with this email.',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        }
      case 'VerificationFailed':
        return {
          title: 'Verification Error',
          message: 'An error occurred during verification. Please try again.',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'A problem occurred during authentication.',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        }
    }
  }

  const errorInfo = getErrorInfo(error)
  const ErrorIcon = errorInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl">
        <div className="text-center p-6">
          <div className={`mx-auto w-16 h-16 ${errorInfo.bgColor} rounded-full flex items-center justify-center mb-4`}>
            <ErrorIcon className={`h-8 w-8 ${errorInfo.color}`} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {errorInfo.message}
          </p>
          
          <div className="space-y-3">
            {/* Resend Verification Form */}
            {(error === 'ExpiredToken' || error === 'InvalidToken') && !showResendForm && (
              <Button 
                className="w-full bg-gradient-purple text-white"
                onClick={() => setShowResendForm(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Request New Verification Link
              </Button>
            )}

            {showResendForm && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isResending}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="flex-1 bg-gradient-purple text-white"
                  >
                    {isResending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      'Send Link'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResendForm(false)
                      setEmail('')
                    }}
                    disabled={isResending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
