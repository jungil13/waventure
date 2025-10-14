const axios = require('axios');

async function testBookingStatusUpdate() {
  try {
    console.log('🧪 Testing booking status update...');
    
    // Test updating booking status to "Confirmed"
    const response = await axios.put('http://localhost:5000/api/booking-status/2/status', {
      status: 'Confirmed',
      ownerId: 2 // Jun Gil Casquejo (boat owner)
    });
    
    console.log('✅ Booking status update response:', response.data);
    
  } catch (error) {
    console.error('❌ Booking status update test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBookingStatusUpdate();
