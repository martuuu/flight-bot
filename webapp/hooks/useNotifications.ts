import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

interface Notification {
  id: string
  alertId: string
  type: 'price_drop' | 'price_increase' | 'route_available' | 'miles_promo'
  message: string
  price?: number
  currency?: string
  triggeredAt: string
  isRead: boolean
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  clearAll: () => Promise<void>
  syncWithBot: () => Promise<void>
}

export function useNotifications(): UseNotificationsReturn {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/bot/sync-notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  const syncWithBot = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/bot/sync-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync_notifications',
          userId: session.user.id
        })
      })

      if (response.ok) {
        await fetchNotifications()
        toast.success('Notifications synced with Telegram')
      }
    } catch (error) {
      console.error('Error syncing notifications:', error)
      toast.error('Failed to sync notifications')
    }
  }, [session?.user?.id, fetchNotifications])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const clearAll = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/clear', {
        method: 'POST'
      })

      if (response.ok) {
        setNotifications([])
        toast.success('All notifications cleared')
      }
    } catch (error) {
      console.error('Error clearing notifications:', error)
      toast.error('Failed to clear notifications')
    }
  }, [])

  // Auto-fetch notifications on component mount and session change
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Auto-sync every 30 seconds if user is active
  useEffect(() => {
    if (!session?.user?.id) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [session?.user?.id, fetchNotifications])

  const unreadCount = notifications.filter(n => !n.isRead).length

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    clearAll,
    syncWithBot
  }
}
