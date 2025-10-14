const axios = require('axios');

async function testBookingNotification() {
  try {
    console.log('🧪 Testing Booking Status Change Notification...\n');
    
    // Test 1: Update a booking status to trigger notification
    console.log('1️⃣ Testing booking status update (should trigger notification)');
    try {
      const bookingId = 2; // Use an existing booking ID
      const status = 'Confirmed';
      const ownerId = 2; // Boat owner ID
      
      const response = await axios.put(`http://localhost:5000/api/booking-status/${bookingId}/status`, {
        status: status,
        ownerId: ownerId
      });
      
      console.log('✅ Booking status updated successfully:', response.data);
      console.log('📢 This should have triggered a notification to the customer and owner');
      
    } catch (error) {
      console.log('❌ Error updating booking status:', error.response?.data || error.message);
    }
    
    // Wait a moment for the notification to be processed
    console.log('\n⏳ Waiting 2 seconds for notification to be processed...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Check if notification was created
    console.log('\n2️⃣ Checking if notification was created for user 4');
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/user/4');
      console.log('✅ User notifications:', response.data);
      
      if (response.data.success && response.data.data.length > 0) {
        console.log('🎉 SUCCESS: Notifications are working!');
        console.log('📊 Total notifications:', response.data.data.length);
        
        // Show the latest notification
        const latest = response.data.data[0];
        console.log('📢 Latest notification:');
        console.log(`   Title: ${latest.title}`);
        console.log(`   Message: ${latest.message}`);
        console.log(`   Type: ${latest.type}`);
        console.log(`   Created: ${latest.created_at}`);
      } else {
        console.log('⚠️ No notifications found for user 4');
      }
    } catch (error) {
      console.log('❌ Error getting notifications:', error.response?.data || error.message);
    }
    
    // Test 3: Check unread count
    console.log('\n3️⃣ Checking unread notification count');
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/unread/4');
      console.log('✅ Unread count:', response.data);
    } catch (error) {
      console.log('❌ Error getting unread count:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBookingNotification();
