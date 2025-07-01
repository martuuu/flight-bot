import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER

if (!accountSid || !authToken || !whatsappNumber) {
  throw new Error('Missing Twilio configuration')
}

const client = twilio(accountSid, authToken)

export interface FlightDeal {
  origin: string
  destination: string
  originName: string
  destinationName: string
  price: number
  currency: string
  departureDate: string
  returnDate?: string
  airline?: string
  originalPrice?: number
  savings?: number
  bookingUrl?: string
}

export interface WhatsAppNotification {
  to: string
  message: string
  type: 'price_alert' | 'welcome' | 'system_update'
}

export class WhatsAppService {
  static async sendFlightAlert(phoneNumber: string, deal: FlightDeal): Promise<boolean> {
    try {
      const message = this.formatFlightAlertMessage(deal)
      
      await client.messages.create({
        from: whatsappNumber,
        to: `whatsapp:${phoneNumber}`,
        body: message,
      })
      
      return true
    } catch (error) {
      console.error('WhatsApp send error:', error)
      return false
    }
  }

  static async sendWelcomeMessage(phoneNumber: string, userName: string): Promise<boolean> {
    try {
      const message = `
🎉 Welcome to Travo, ${userName}!

Your flight alert system is now active. We'll monitor prices 24/7 and send you WhatsApp notifications when we find deals that match your criteria.

✈️ *How it works:*
• Set your budget and routes
• We check prices every 30 minutes
• Get instant alerts when prices drop
• Book directly with airlines

Ready to save on your next trip? Create your first alert in the app!

Happy travels! 🌎
      `.trim()

      await client.messages.create({
        from: whatsappNumber,
        to: `whatsapp:${phoneNumber}`,
        body: message,
      })
      
      return true
    } catch (error) {
      console.error('WhatsApp welcome error:', error)
      return false
    }
  }

  static async sendTestNotification(phoneNumber: string): Promise<boolean> {
    try {
      const message = `
🧪 *Travo Test Notification*

This is a test message to confirm your WhatsApp notifications are working correctly.

If you received this message, you're all set to receive flight price alerts!

✅ WhatsApp notifications: Active
📱 Phone: ${phoneNumber}

You can disable notifications anytime in your account settings.
      `.trim()

      await client.messages.create({
        from: whatsappNumber,
        to: `whatsapp:${phoneNumber}`,
        body: message,
      })
      
      return true
    } catch (error) {
      console.error('WhatsApp test error:', error)
      return false
    }
  }

  private static formatFlightAlertMessage(deal: FlightDeal): string {
    const savings = deal.originalPrice ? deal.originalPrice - deal.price : 0
    const savingsText = savings > 0 ? `\n💰 *You save: $${savings}!*` : ''
    
    return `
🚨 *Flight Price Alert!*

✈️ *${deal.originName} → ${deal.destinationName}*
📅 ${new Date(deal.departureDate).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })}${deal.returnDate ? ' - ' + new Date(deal.returnDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }) : ''}

💵 *$${deal.price} ${deal.currency}*${savingsText}
${deal.airline ? `🛫 ${deal.airline}` : ''}

This price matches your alert criteria! Book now before it goes up.

${deal.bookingUrl ? `🔗 Book now: ${deal.bookingUrl}` : 'Check the app for booking details.'}

Happy travels! 🌎
    `.trim()
  }

  static async sendSystemUpdate(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const formattedMessage = `
🔔 *Travo System Update*

${message}

Questions? Reply to this message or contact support in the app.
      `.trim()

      await client.messages.create({
        from: whatsappNumber,
        to: `whatsapp:${phoneNumber}`,
        body: formattedMessage,
      })
      
      return true
    } catch (error) {
      console.error('WhatsApp system update error:', error)
      return false
    }
  }

  // Validate phone number format
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // Should be 10-15 digits (international format)
    return cleaned.length >= 10 && cleaned.length <= 15
  }

  // Format phone number for WhatsApp (with country code)
  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // If doesn't start with country code, assume US (+1)
    if (cleaned.length === 10) {
      return `+1${cleaned}`
    }
    
    // If starts with 1 but no +, add +
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`
    }
    
    // If already has +, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber
    }
    
    // Otherwise add +
    return `+${cleaned}`
  }
}

export default WhatsAppService
