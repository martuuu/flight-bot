'use client'

import { useSession } from 'next-auth/react'
import { Plane, Bell, Eye, User, Shield, MessageCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { botConfig } from '@/lib/bot-config'
import { usePathname, useRouter } from 'next/navigation'

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  
  // Don't show header on auth pages, login pages, or homepage (landing page)
  if (pathname?.startsWith('/auth/') || pathname?.startsWith('/login') || pathname === '/') {
    return null
  }

  const isActive = (path: string) => pathname === path

  // Navigation handler with transitions
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="p-3 rounded-xl relative">
              <Plane 
                className="h-10 w-10 text-purple-600"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.4))'
                }}
              />
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Navigation - First */}
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant={isActive('/dashboard') ? 'primary' : 'outline'} 
                  size="sm" 
                  className="text-sm"
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Dashboard</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant={isActive('/alerts') ? 'primary' : 'outline'} 
                  size="sm" 
                  className="text-sm"
                  onClick={() => handleNavigation('/alerts')}
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Alerts</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant={isActive('/profile') ? 'primary' : 'outline'} 
                  size="sm" 
                  className="text-sm"
                  onClick={() => handleNavigation('/profile')}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Profile</span>
                </Button>
              </motion.div>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* App Actions - Second */}
            <div className="flex items-center space-x-2">
              {(session?.user?.role === 'SUPERADMIN' || session?.user?.role === 'SUPPORTER') && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-sm"
                    onClick={() => handleNavigation('/admin/users')}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:ml-2 sm:inline">Admin</span>
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={() => {
                    if (!session?.user) return
                    
                    const authLink = botConfig.createUserAuthLink(
                      session.user.id, 
                      session.user.role, 
                      session.user.email || ''
                    )
                    window.open(authLink, '_blank')
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Telegram</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="sm" 
                  className="text-sm"
                  onClick={() => handleNavigation('/alerts/new')}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">New Alert</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
