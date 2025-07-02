'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PageTransition, FadeInComponent } from '@/components/ui/PageTransition'

export default function CreateUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'BASIC',
    subscriptionStatus: 'ACTIVE',
    subscriptionPlan: 'BASIC',
    subscriptionExpires: '',
    telegramUsername: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Usuario creado exitosamente')
        router.push('/admin/users')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Error al crear usuario')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Error al crear usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <FadeInComponent>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                    <p className="text-gray-600">Add a new user to the system</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </FadeInComponent>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Role & Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Role & Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="BASIC">Basic User</option>
                    <option value="PREMIUM">Premium User</option>
                    <option value="SUPPORTER">Supporter</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram Username (Optional)
                  </label>
                  <Input
                    type="text"
                    id="telegramUsername"
                    name="telegramUsername"
                    value={formData.telegramUsername}
                    onChange={handleChange}
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="subscriptionStatus"
                    name="subscriptionStatus"
                    value={formData.subscriptionStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="subscriptionPlan" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan
                  </label>
                  <select
                    id="subscriptionPlan"
                    name="subscriptionPlan"
                    value={formData.subscriptionPlan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="BASIC">Basic</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="PRO">Pro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="subscriptionExpires" className="block text-sm font-medium text-gray-700 mb-2">
                    Expires (Optional)
                  </label>
                  <Input
                    type="date"
                    id="subscriptionExpires"
                    name="subscriptionExpires"
                    value={formData.subscriptionExpires}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/users')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageTransition>
  )
}
