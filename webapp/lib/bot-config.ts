export const botConfig = {
  telegramBotUrl: process.env.TELEGRAM_BOT_USERNAME 
    ? `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}`
    : 'https://t.me/ticketscannerbot_bot', // bot correcto
  
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  
  // Helper function to create deep links to the bot
  createTelegramDeepLink: (command?: string, params?: string[]) => {
    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'ticketscannerbot_bot'
    let url = `https://t.me/${botUsername}`
    
    if (command) {
      url += `?start=${command}`
      if (params && params.length > 0) {
        url += `_${params.join('_')}`
      }
    }
    
    return url
  },

  // Create deep link with user authentication data
  createUserAuthLink: (userId: string, userRole: string, userEmail?: string) => {
    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'ticketscannerbot_bot'
    const authData = btoa(JSON.stringify({ userId, userRole, userEmail, timestamp: Date.now() }))
    return `https://t.me/${botUsername}?start=auth_${authData}`
  },

  // Create alert command for Telegram (using unified syntax)
  createAlertCommand: (origin: string, destination: string, maxPrice?: number, date?: string) => {
    if (maxPrice && date) {
      return `/addalert ${origin} ${destination} ${maxPrice} ${date}`
    } else if (maxPrice) {
      return `/addalert ${origin} ${destination} ${maxPrice}`
    } else if (date) {
      return `/addalert ${origin} ${destination} - ${date}`
    } else {
      return `/addalert ${origin} ${destination}`
    }
  }
}

// Airport code mappings with full names for better UX
export const airportMappings = {
  'MIA': { name: 'Miami International Airport', city: 'Miami', country: 'USA' },
  'PUJ': { name: 'Punta Cana International Airport', city: 'Punta Cana', country: 'Dominican Republic' },
  'BOG': { name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia' },
  'EZE': { name: 'Ezeiza International Airport', city: 'Buenos Aires', country: 'Argentina' },
  'MAD': { name: 'Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
  'GRU': { name: 'São Paulo-Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
  'JFK': { name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  'LAS': { name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'USA' },
  'LAX': { name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  'CDG': { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
}

export function getAirportDisplayName(code: string): string {
  const airport = airportMappings[code as keyof typeof airportMappings]
  return airport ? `${airport.city} (${code})` : code
}
