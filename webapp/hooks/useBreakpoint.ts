'use client'

import { useState, useEffect } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < 768) {
        setBreakpoint('mobile')
      } else if (width < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    // Set initial breakpoint
    updateBreakpoint()

    // Add event listener
    window.addEventListener('resize', updateBreakpoint)

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}