'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Star, Wifi, Car, Home, ArrowUpDown } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterSettings) => void
  onReset: () => void
}

export interface FilterSettings {
  budget: {
    min: number
    max: number
  }
  hotelClass: number
  facilities: string[]
  propertyType: string[]
  sortBy: string
}

const FACILITIES = [
  { id: 'wifi', label: 'Free WiFi', icon: Wifi },
  { id: 'parking', label: 'Free Parking', icon: Car },
  { id: 'pool', label: 'Swimming Pool', icon: Home },
  { id: 'breakfast', label: 'Free Breakfast', icon: Home },
  { id: 'gym', label: 'Fitness Center', icon: Home },
  { id: 'spa', label: 'Spa', icon: Home },
]

const PROPERTY_TYPES = [
  'Hotel',
  'Resort',
  'Apartment',
  'Villa',
  'Hostel',
  'Guesthouse'
]

const SORT_OPTIONS = [
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'distance', label: 'Distance' },
  { value: 'popularity', label: 'Popularity' }
]

export function FilterModal({ isOpen, onClose, onApply, onReset }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterSettings>({
    budget: { min: 10, max: 300 },
    hotelClass: 4,
    facilities: [],
    propertyType: [],
    sortBy: 'price_low'
  })

  const handleBudgetChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [type]: value
      }
    }))
  }

  const handleStarClick = (stars: number) => {
    setFilters(prev => ({
      ...prev,
      hotelClass: stars
    }))
  }

  const toggleFacility = (facilityId: string) => {
    setFilters(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(id => id !== facilityId)
        : [...prev.facilities, facilityId]
    }))
  }

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...prev.propertyType, type]
    }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      budget: { min: 10, max: 300 },
      hotelClass: 4,
      facilities: [],
      propertyType: [],
      sortBy: 'price_low'
    })
    onReset()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card className="p-0 overflow-hidden max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Choose Your Filter</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Budget */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
              <div className="space-y-4">
                {/* Budget Display */}
                <div className="flex items-center justify-between text-lg font-medium">
                  <span>${filters.budget.min}</span>
                  <span>${filters.budget.max}</span>
                </div>

                {/* Budget Sliders */}
                <div className="relative">
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full"
                      style={{
                        left: `${(filters.budget.min / 500) * 100}%`,
                        width: `${((filters.budget.max - filters.budget.min) / 500) * 100}%`
                      }}
                    />
                    
                    {/* Min handle */}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-600 border-4 border-white rounded-full shadow-lg cursor-pointer"
                      style={{ left: `${(filters.budget.min / 500) * 100}%` }}
                    />
                    
                    {/* Max handle */}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-600 border-4 border-white rounded-full shadow-lg cursor-pointer"
                      style={{ left: `${(filters.budget.max / 500) * 100}%` }}
                    />
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.budget.min}
                    onChange={(e) => handleBudgetChange('min', Number(e.target.value))}
                    className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.budget.max}
                    onChange={(e) => handleBudgetChange('max', Number(e.target.value))}
                    className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Hotel Class */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Class</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className="p-1"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        star <= filters.hotelClass 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h3>
              <div className="space-y-3">
                {FACILITIES.map((facility) => (
                  <button
                    key={facility.id}
                    onClick={() => toggleFacility(facility.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      filters.facilities.includes(facility.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <facility.icon className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">{facility.label}</span>
                    </div>
                    {filters.facilities.includes(facility.id) && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Type</h3>
              <div className="space-y-3">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => togglePropertyType(type)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      filters.propertyType.includes(type)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Home className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">{type}</span>
                    </div>
                    {filters.propertyType.includes(type) && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
              <div className="space-y-3">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value }))}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      filters.sortBy === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ArrowUpDown className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                    {filters.sortBy === option.value && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center space-x-4 p-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            >
              Apply
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
