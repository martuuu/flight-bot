import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testFormData() {
  console.log('🧪 Testing alert creation form data...\n')
  
  try {
    // Simulate form data that would come from the frontend
    const testFormData = {
      origin: 'SDQ',
      destination: 'BOG',
      maxPrice: 450,
      currency: 'USD',
      departureDate: '2025-08-01',
      returnDate: '2025-08-08',
      isFlexible: false,
      adults: 1,
      children: 0,
      infants: 0,
      alertType: 'SPECIFIC'
    }
    
    console.log('📋 Form data to be sent:')
    console.log(JSON.stringify(testFormData, null, 2))
    
    // Get user for testing
    const user = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    // Test the creation logic (same as API)
    const newAlert = await prisma.alert.create({
      data: {
        userId: user.id,
        origin: testFormData.origin,
        destination: testFormData.destination,
        maxPrice: testFormData.maxPrice,
        currency: testFormData.currency || 'USD',
        departureDate: testFormData.departureDate ? new Date(testFormData.departureDate) : null,
        returnDate: testFormData.returnDate ? new Date(testFormData.returnDate) : null,
        isFlexible: testFormData.isFlexible || false,
        adults: testFormData.adults || 1,
        children: testFormData.children || 0,
        infants: testFormData.infants || 0,
        alertType: testFormData.alertType,
        isActive: true,
        isPaused: false,
      }
    })
    
    console.log('\n✅ Alert created successfully!')
    console.log('📄 Created alert details:')
    console.log(`   ID: ${newAlert.id}`)
    console.log(`   Route: ${newAlert.origin} → ${newAlert.destination}`)
    console.log(`   Price: $${newAlert.maxPrice}`)
    console.log(`   Type: ${newAlert.alertType}`)
    console.log(`   Departure: ${newAlert.departureDate?.toLocaleDateString()}`)
    console.log(`   Return: ${newAlert.returnDate?.toLocaleDateString()}`)
    console.log(`   Passengers: ${newAlert.adults}A ${newAlert.children}C ${newAlert.infants}I`)
    
    // Clean up - delete the test alert
    await prisma.alert.delete({
      where: { id: newAlert.id }
    })
    
    console.log('\n🧹 Test alert cleaned up')
    console.log('\n🎉 Form data processing works correctly!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testFormData()
