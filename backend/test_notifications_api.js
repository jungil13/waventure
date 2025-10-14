const axios = require('axios');

async function testNotificationAPI() {
  try {
    console.log('🧪 Testing Notification API...\n');
    
    // Test 1: Get notifications for user 4
    console.log('1️⃣ Testing GET /api/notifications/user/4');
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/user/4');
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }
    
    // Test 2: Get unread count for user 4
    console.log('\n2️⃣ Testing GET /api/notifications/unread/4');
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/unread/4');
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }
    
    // Test 3: Create a test notification
    console.log('\n3️⃣ Testing POST /api/notifications (create notification)');
    try {
      const notificationData = {
        owner_id: 2,
        user_id: 4,
        boat_id: 14,
        booking_id: 2,
        type: 'booking_update',
        title: 'Test Notification 🧪',
        message: 'This is a test notification to verify the system is working!'
      };
      
      const response = await axios.post('http://localhost:5000/api/notifications', notificationData);
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }
    
    // Test 4: Get notifications again to see the new one
    console.log('\n4️⃣ Testing GET /api/notifications/user/4 (after creating notification)');
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/user/4');
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNotificationAPI();
