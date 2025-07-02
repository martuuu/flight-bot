import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testFiveDifferentAlerts() {
  console.log('🧪 Testing 5 different flight alerts creation...\n')
  
  try {
    // First, check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' }
    })
    
    if (!user) {
      console.log('❌ User not found. Please login first.')
      return
    }
    
    console.log(`✅ User found: ${user.email} (ID: ${user.id})`)
    
    // Clear existing alerts for clean testing
    const existingAlerts = await prisma.alert.deleteMany({
      where: { userId: user.id }
    })
    console.log(`🧹 Cleared ${existingAlerts.count} existing alerts\n`)
    
    // Define 5 different test alerts
    const testAlerts = [
      {
        origin: 'SDQ',
        destination: 'JFK',
        maxPrice: 350,
        departureDate: new Date('2025-08-15'),
        returnDate: new Date('2025-08-22'),
        adults: 1,
        children: 0,
        infants: 0,
        alertType: 'SPECIFIC',
        description: 'Santo Domingo → New York JFK'
      },
      {
        origin: 'SDQ',
        destination: 'MIA',
        maxPrice: 280,
        departureDate: new Date('2025-09-10'),
        returnDate: new Date('2025-09-17'),
        adults: 2,
        children: 1,
        infants: 0,
        alertType: 'SPECIFIC',
        description: 'Santo Domingo → Miami (Family trip)'
      },
      {
        origin: 'SDQ',
        destination: 'MAD',
        maxPrice: 650,
        departureDate: new Date('2025-10-05'),
        returnDate: new Date('2025-10-19'),
        adults: 1,
        children: 0,
        infants: 0,
        alertType: 'SPECIFIC',
        description: 'Santo Domingo → Madrid'
      },
      {
        origin: 'SDQ',
        destination: 'CCS',
        maxPrice: 200,
        departureDate: new Date('2025-07-20'),
        returnDate: new Date('2025-07-27'),
        adults: 1,
        children: 0,
        infants: 0,
        alertType: 'MONTHLY',
        description: 'Santo Domingo → Caracas (Flexible July)'
      },
      {
        origin: 'SDQ',
        destination: 'BCN',
        maxPrice: 700,
        departureDate: new Date('2025-11-12'),
        returnDate: new Date('2025-11-26'),
        adults: 2,
        children: 0,
        infants: 1,
        alertType: 'SPECIFIC',
        description: 'Santo Domingo → Barcelona (Couple + infant)'
      }
    ]
    
    console.log('Creating 5 different alerts...\n')
    
    // Create each alert
    for (let i = 0; i < testAlerts.length; i++) {
      const alertData = testAlerts[i]
      const { description, ...createData } = alertData
      
      try {
        const alert = await prisma.alert.create({
          data: {
            ...createData,
            userId: user.id,
            currency: 'USD',
            isFlexible: alertData.alertType === 'MONTHLY',
            isActive: true,
            isPaused: false
          }
        })
        
        console.log(`✅ Alert ${i + 1} created: ${description}`)
        console.log(`   - Price: $${alertData.maxPrice} ${alertData.alertType}`)
        console.log(`   - Passengers: ${alertData.adults}A ${alertData.children}C ${alertData.infants}I`)
        console.log(`   - Dates: ${alertData.departureDate.toDateString()} → ${alertData.returnDate?.toDateString()}`)
        console.log(`   - Alert ID: ${alert.id}\n`)
        
      } catch (error: any) {
        console.log(`❌ Failed to create alert ${i + 1}: ${description}`)
        console.log(`   Error: ${error.message}\n`)
      }
    }
    
    // Verify final state
    const finalAlerts = await prisma.alert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`\n📊 FINAL RESULTS:`)
    console.log(`Total alerts created: ${finalAlerts.length}/5`)
    
    if (finalAlerts.length > 0) {
      console.log('\n📋 Created alerts summary:')
      finalAlerts.forEach((alert: any, index: number) => {
        const status = alert.isActive ? (alert.isPaused ? 'PAUSED' : 'ACTIVE') : 'INACTIVE'
        console.log(`${index + 1}. ${alert.origin} → ${alert.destination} | $${alert.maxPrice} | ${alert.alertType} | ${status}`)
      })
    }
    
    console.log('\n✨ Test completed! You can now check the dashboard and alerts page.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testFiveDifferentAlerts()
