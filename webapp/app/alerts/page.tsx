'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Plane, Bell, Eye, Edit3, Trash2, TrendingDown, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

// Mock data
const mockAlerts = [
  {
    id: 1,
    origin: 'MIA',
    destination: 'PUJ',
    originName: 'Miami',
    destinationName: 'Punta Cana',
    maxPrice: 400,
    currency: 'USD',
    isActive: true,
    alertType: 'MONTHLY',
    createdAt: '2025-01-01',
    lastPrice: 380,
    savings: 70,
    status: 'triggered',
    lastTriggered: '2025-01-02T10:30:00Z',
  },
  {
    id: 2,
    origin: 'BOG',
    destination: 'MIA',
    originName: 'Bogotá',
    destinationName: 'Miami',
    maxPrice: 350,
    currency: 'USD',
    isActive: true,
    alertType: 'SPECIFIC',
    departureDate: '2025-03-15',
    createdAt: '2025-01-02',
    lastPrice: 380,
    savings: 0,
    status: 'watching',
  },
  {
    id: 3,
    origin: 'GRU',
    destination: 'JFK',
    originName: 'São Paulo',
    destinationName: 'New York',
    maxPrice: 600,
    currency: 'USD',
    isActive: false,
    alertType: 'MONTHLY',
    createdAt: '2024-12-28',
    lastPrice: 650,
    savings: 0,
    status: 'paused',
  },
]

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, triggered, paused

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = 
      alert.originName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.destination.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' || 
      alert.status === filterStatus ||
      (filterStatus === 'active' && alert.isActive)
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'success'
      case 'watching': return 'default'
      case 'paused': return 'gray'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'triggered': return TrendingDown
      case 'watching': return Bell
      case 'paused': return Settings
      default: return Bell
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-purple p-2 rounded-xl">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Flight-Bot</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/alerts" className="text-purple-600 font-medium">Alerts</Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Alert
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Flight Alerts</h1>
          <p className="text-gray-600">
            Manage your flight price monitoring alerts and track savings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAlerts.filter(a => a.isActive).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">$70</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Plane className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Triggered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAlerts.filter(a => a.status === 'triggered').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search routes, airports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="triggered">Triggered</option>
              <option value="paused">Paused</option>
            </select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const StatusIcon = getStatusIcon(alert.status)
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover="lift" className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Status Icon */}
                      <div className={`p-2 rounded-xl ${
                        alert.status === 'triggered' ? 'bg-green-100' :
                        alert.status === 'watching' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <StatusIcon className={`h-5 w-5 ${
                          alert.status === 'triggered' ? 'text-green-600' :
                          alert.status === 'watching' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>

                      {/* Alert Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {alert.originName} → {alert.destinationName}
                          </h3>
                          <Badge variant={getStatusColor(alert.status) as any}>
                            {alert.status}
                          </Badge>
                          <Badge variant="gray" size="sm">
                            {alert.alertType === 'MONTHLY' ? 'Monthly' : 'Specific Date'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Route</p>
                            <p className="font-medium">{alert.origin} → {alert.destination}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Max Price</p>
                            <p className="font-medium">${alert.maxPrice}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Price</p>
                            <p className="font-medium">${alert.lastPrice}</p>
                          </div>
                          {alert.savings > 0 && (
                            <div>
                              <p className="text-gray-500">Savings</p>
                              <p className="font-medium text-green-600">${alert.savings}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">{new Date(alert.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Last Triggered */}
                        {alert.status === 'triggered' && alert.lastTriggered && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                              🎉 Price dropped to ${alert.lastPrice} on{' '}
                              {new Date(alert.lastTriggered).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <Card className="p-12 text-center">
            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No alerts found' : 'No alerts yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first flight alert to start monitoring prices.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Alert
            </Button>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center">
          <Link href="/alerts/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create New Alert
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
