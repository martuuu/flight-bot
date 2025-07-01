'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Plane, ArrowRight, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Handle login logic here
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '-2s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-gradient-purple p-3 rounded-2xl">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Flight-Bot</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-400"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button variant="outline" className="w-full">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.009.062-.01.125-.01.189 0 1.943-.718 3.745-1.906 5.113-.063.073-.128.144-.195.214-.062.065-.126.129-.191.191-1.137.813-2.52 1.292-4.015 1.292-.847 0-1.682-.183-2.42-.515-.042-.019-.083-.038-.124-.058-.017-.008-.034-.016-.051-.025-.058-.027-.115-.056-.171-.085-.025-.013-.05-.026-.074-.04-.055-.031-.109-.063-.162-.096-.025-.015-.049-.031-.073-.047-.051-.033-.101-.067-.15-.102-.025-.018-.049-.036-.073-.055-.046-.035-.091-.071-.135-.108-.023-.019-.045-.038-.067-.058-.042-.037-.083-.075-.123-.114-.021-.02-.041-.041-.061-.062-.038-.038-.075-.077-.111-.117-.019-.021-.037-.042-.055-.064-.034-.039-.067-.079-.099-.119-.017-.021-.033-.043-.049-.065-.030-.041-.059-.082-.087-.124-.014-.021-.028-.042-.041-.064-.026-.043-.051-.087-.075-.131-.012-.022-.023-.044-.034-.067-.021-.046-.041-.092-.06-.139-.009-.022-.017-.044-.025-.067-.016-.046-.031-.093-.045-.14-.007-.023-.013-.046-.019-.069-.013-.049-.025-.098-.036-.148-.005-.024-.009-.048-.013-.072-.009-.053-.017-.106-.024-.16-.003-.025-.005-.05-.007-.075-.005-.058-.009-.116-.012-.175-.001-.027-.002-.054-.002-.081 0-.067.003-.133.008-.199.002-.027.004-.054.007-.081.007-.059.015-.117.025-.175.004-.024.008-.048.013-.072.011-.05.023-.099.036-.148.006-.023.012-.046.019-.069.014-.047.029-.094.045-.14.008-.023.016-.045.025-.067.019-.047.039-.093.06-.139.011-.023.022-.045.034-.067.024-.044.049-.088.075-.131.013-.022.027-.043.041-.064.028-.042.057-.083.087-.124.016-.022.032-.044.049-.065.032-.04.065-.08.099-.119.018-.022.036-.043.055-.064.036-.04.073-.079.111-.117.02-.021.04-.042.061-.062.04-.039.081-.077.123-.114.022-.02.044-.039.067-.058.044-.037.089-.073.135-.108.024-.019.048-.037.073-.055.049-.035.099-.069.15-.102.024-.016.048-.032.073-.047.053-.033.107-.065.162-.096.024-.014.049-.027.074-.04.056-.029.113-.058.171-.085.017-.009.034-.017.051-.025.041-.02.082-.039.124-.058.738-.332 1.573-.515 2.42-.515 1.495 0 2.878.479 4.015 1.292.065.062.129.126.191.191.067.07.132.141.195.214 1.188 1.368 1.906 3.17 1.906 5.113z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
