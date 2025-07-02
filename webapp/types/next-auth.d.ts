import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING'
      telegramId?: string
      telegramLinked: boolean
      subscriptionEnd?: string
      subscriptionActive: boolean
    } & DefaultSession['user']
  }

  interface User {
    role: 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING'
    telegramId?: string
    telegramLinked: boolean
    subscriptionEnd?: string
    subscriptionActive: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING'
    telegramId?: string
    telegramLinked: boolean
    subscriptionEnd?: string
    subscriptionActive: boolean
  }
}
