'use client'

import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'purple' | 'blue' | 'gray' | 'white'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12'
}

const colorClasses = {
  purple: 'border-purple-600',
  blue: 'border-blue-600',
  gray: 'border-gray-600', 
  white: 'border-white'
}

export function Spinner({ size = 'md', color = 'purple', className }: SpinnerProps) {
  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-b-2',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

interface LoadingScreenProps {
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingScreen({ size = 'md' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Spinner size={size} className="mx-auto mb-4" />
      </div>
    </div>
  )
}

export default Spinner
