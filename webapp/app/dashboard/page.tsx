'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Bell, Plane, TrendingDown, Calendar, Settings, ArrowRight, Eye, Trash2, Edit3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

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
    lastPrice: 450,
    savings: 50,
    status: 'active',
  }
]

const stats = [
  {
    label: 'Active Alerts',
    value: '1',
    icon: Bell,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    label: 'Total Savings',
    value: '$50',
    icon: TrendingDown,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    label: 'This Month',
    value: '1',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Monitor your flight price alerts</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Link href="/alerts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Alert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Your Alerts</h2>
              </div>
              <div className="p-6">
                {mockAlerts.map((alert, index) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{alert.originName} → {alert.destinationName}</h3>
                      <p className="text-sm text-gray-600">Max Price: {alert.currency} {alert.maxPrice}</p>
                    </div>
                    <Badge variant="success">{alert.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-600">
                  <p>Price drop notification sent</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
