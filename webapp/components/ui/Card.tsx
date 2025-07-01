'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-3xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white shadow-xl shadow-purple-100/50 border border-gray-100',
        ghost: 'bg-transparent',
        outline: 'border border-gray-200 bg-white',
        gradient: 'bg-gradient-to-br from-purple-600 to-violet-600 text-white',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-1',
        scale: 'hover:scale-105',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hover: 'none',
    },
  }
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, padding, hover, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export { Card, cardVariants }
