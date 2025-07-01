'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-2 border-gray-200 bg-white text-gray-700 focus:border-purple-400 focus:ring-purple-100',
        search: 'border border-gray-300 bg-gray-50 text-gray-700 focus:border-purple-400 focus:bg-white',
        ghost: 'border-0 bg-transparent text-gray-700 focus:bg-gray-50',
      },
      size: {
        sm: 'h-9 px-3 py-1 text-sm rounded-lg',
        default: 'h-12 px-4 py-3 text-base rounded-2xl',
        lg: 'h-14 px-6 py-4 text-lg rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
