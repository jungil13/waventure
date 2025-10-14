const axios = require('axios');

async function testNotificationFlow() {
  try {
    console.log('🧪 Testing notification flow...');
    
    // Test 1: Check if notifications exist for user 4
    console.log('\n1. Checking notifications for user 4...');
    const response = await axios.get('http://localhost:5000/api/notifications/user/4');
    console.log('✅ API Response:', response.data);
    
    // Test 2: Create a test notification
    console.log('\n2. Creating test notification...');
    const testNotification = {
      owner_id: 2,
      user_id: 4,
      boat_id: 16,
      booking_id: 6,
      type: 'booking_update',
      title: 'Test Notification! 🧪',
      message: 'This is a test notification to verify the system is working.'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/notifications/', testNotification);
    console.log('✅ Created notification:', createResponse.data);
    
    // Test 3: Check notifications again
    console.log('\n3. Checking notifications after creation...');
    const updatedResponse = await axios.get('http://localhost:5000/api/notifications/user/4');
    console.log('✅ Updated notifications:', updatedResponse.data);
    
    console.log('\n🎉 Notification flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testNotificationFlow();
