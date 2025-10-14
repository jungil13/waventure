const db = require('./config/db');

async function fixNullBookingIds() {
  try {
    console.log('🔧 Starting to fix NULL booking_id messages...');
    
    // Get all messages with NULL booking_id
    const [nullMessages] = await db.execute(`
      SELECT m.message_id, m.sender_id, m.receiver_id, m.message, m.created_at
      FROM messages m
      WHERE m.booking_id IS NULL
      ORDER BY m.created_at ASC
    `);
    
    console.log(`📊 Found ${nullMessages.length} messages with NULL booking_id`);
    
    if (nullMessages.length === 0) {
      console.log('✅ No NULL booking_id messages found. Database is clean!');
      return;
    }
    
    // For each NULL message, try to find the most recent booking between sender and receiver
    for (const message of nullMessages) {
      try {
        // Find the most recent booking between these two users
        const [bookings] = await db.execute(`
          SELECT bk.booking_id, bk.created_at
          FROM bookings bk
          JOIN boats b ON bk.boat_id = b.boat_id
          WHERE (bk.user_id = ? AND b.owner_id = ?) 
             OR (bk.user_id = ? AND b.owner_id = ?)
          ORDER BY bk.created_at DESC
          LIMIT 1
        `, [message.sender_id, message.receiver_id, message.receiver_id, message.sender_id]);
        
        if (bookings.length > 0) {
          const bookingId = bookings[0].booking_id;
          
          // Update the message with the found booking_id
          await db.execute(`
            UPDATE messages 
            SET booking_id = ? 
            WHERE message_id = ?
          `, [bookingId, message.message_id]);
          
          console.log(`✅ Updated message ${message.message_id} with booking_id ${bookingId}`);
        } else {
          console.log(`⚠️  No booking found for message ${message.message_id} between users ${message.sender_id} and ${message.receiver_id}`);
        }
      } catch (error) {
        console.error(`❌ Error processing message ${message.message_id}:`, error.message);
      }
    }
    
    console.log('🎉 Finished fixing NULL booking_id messages!');
    
  } catch (error) {
    console.error('❌ Error in fixNullBookingIds:', error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the fix
fixNullBookingIds();
