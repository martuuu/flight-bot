import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export interface Alert {
  id: string
  userId: string
  origin: string
  destination: string
  maxPrice: number
  currency: string
  departureDate?: string
  returnDate?: string
  isFlexible: boolean
  adults: number
  children: number
  infants: number
  isActive: boolean
  isPaused: boolean
  alertType: 'SPECIFIC' | 'MONTHLY'
  createdAt: string
  updatedAt: string
  lastChecked?: string
}

export interface CreateAlertData {
  origin: string
  destination: string
  maxPrice: number
  currency?: string
  departureDate?: string
  returnDate?: string
  isFlexible?: boolean
  adults?: number
  children?: number
  infants?: number
  alertType: 'SPECIFIC' | 'MONTHLY'
}

export interface UpdateAlertData extends Partial<CreateAlertData> {
  isActive?: boolean
  isPaused?: boolean
}

// Fetch alerts
export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async (): Promise<Alert[]> => {
      const response = await fetch('/api/alerts')
      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }
      return response.json()
    },
  })
}

// Create alert
export function useCreateAlert() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateAlertData): Promise<Alert> => {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create alert')
      }
      
      return response.json()
    },
    onSuccess: (data: Alert) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Alert created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Update alert
export function useUpdateAlert() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAlertData }): Promise<Alert> => {
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update alert')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Alert updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Delete alert
export function useDeleteAlert() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete alert')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Alert deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Toggle alert status
export function useToggleAlert() {
  const updateAlert = useUpdateAlert()
  
  return useMutation({
    mutationFn: async ({ id, isPaused }: { id: string; isPaused: boolean }) => {
      return updateAlert.mutateAsync({
        id,
        data: { isPaused }
      })
    },
  })
}
