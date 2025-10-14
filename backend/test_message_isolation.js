const MessageModel = require('./models/messageModel');
const OwnerMessageModel = require('./models/ownerMessageModel');

async function testMessageIsolation() {
  console.log('🧪 Testing Message Isolation by Booking ID...\n');

  try {
    // Test 1: Send messages to different bookings
    console.log('📝 Test 1: Sending messages to different bookings');
    
    // Message for booking 6
    const message1 = await MessageModel.sendMessage(1, 2, 'Hello from booking 6!', 6);
    console.log('✅ Message sent to booking 6:', message1);
    
    // Message for booking 7 (same users, different booking)
    const message2 = await MessageModel.sendMessage(1, 2, 'Hello from booking 7!', 7);
    console.log('✅ Message sent to booking 7:', message2);
    
    // Test 2: Retrieve messages for specific booking
    console.log('\n📝 Test 2: Retrieving messages for specific bookings');
    
    const messagesBooking6 = await MessageModel.getMessages(1, 2, 6);
    console.log('📨 Messages for booking 6:', messagesBooking6.length);
    messagesBooking6.forEach(msg => {
      console.log(`  - Booking ${msg.booking_id}: "${msg.message}"`);
    });
    
    const messagesBooking7 = await MessageModel.getMessages(1, 2, 7);
    console.log('📨 Messages for booking 7:', messagesBooking7.length);
    messagesBooking7.forEach(msg => {
      console.log(`  - Booking ${msg.booking_id}: "${msg.message}"`);
    });
    
    // Test 3: Verify isolation
    console.log('\n📝 Test 3: Verifying message isolation');
    
    const booking6Only = messagesBooking6.filter(msg => msg.booking_id === 6);
    const booking7Only = messagesBooking7.filter(msg => msg.booking_id === 7);
    
    console.log(`✅ Booking 6 messages (should be 1): ${booking6Only.length}`);
    console.log(`✅ Booking 7 messages (should be 1): ${booking7Only.length}`);
    
    if (booking6Only.length === 1 && booking7Only.length === 1) {
      console.log('🎉 SUCCESS: Messages are properly isolated by booking ID!');
    } else {
      console.log('❌ FAILURE: Messages are not properly isolated!');
    }
    
    // Test 4: Test unread counts
    console.log('\n📝 Test 4: Testing unread counts per booking');
    
    const unreadBooking6 = await MessageModel.getUnreadCount(2, 6);
    const unreadBooking7 = await MessageModel.getUnreadCount(2, 7);
    
    console.log(`📊 Unread count for booking 6: ${unreadBooking6}`);
    console.log(`📊 Unread count for booking 7: ${unreadBooking7}`);
    
    // Test 5: Mark messages as read for specific booking
    console.log('\n📝 Test 5: Marking messages as read for specific booking');
    
    await MessageModel.markMessagesAsRead(1, 2, 6);
    console.log('✅ Marked booking 6 messages as read');
    
    const unreadAfterMarking = await MessageModel.getUnreadCount(2, 6);
    const unreadBooking7After = await MessageModel.getUnreadCount(2, 7);
    
    console.log(`📊 Unread count for booking 6 after marking: ${unreadAfterMarking}`);
    console.log(`📊 Unread count for booking 7 after marking: ${unreadBooking7After}`);
    
    if (unreadAfterMarking === 0 && unreadBooking7After === 1) {
      console.log('🎉 SUCCESS: Unread counts are properly isolated by booking ID!');
    } else {
      console.log('❌ FAILURE: Unread counts are not properly isolated!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMessageIsolation().then(() => {
  console.log('\n🏁 Test completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});

