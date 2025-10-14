const db = require('./config/db');

async function testTotalSpent() {
  try {
    console.log('🧪 Testing Total Spent Calculation...\n');
    
    const userId = 4; // Honey Kate's user ID
    
    // Test 1: Check all bookings for user 4
    console.log('1️⃣ All bookings for user 4:');
    const [allBookings] = await db.execute(`
      SELECT booking_id, status, total_price, payment_status 
      FROM bookings 
      WHERE user_id = ? 
      ORDER BY booking_id
    `, [userId]);
    
    allBookings.forEach(booking => {
      console.log(`   Booking ${booking.booking_id}: ${booking.status} - ₱${booking.total_price} (Payment: ${booking.payment_status})`);
    });
    
    // Test 2: Check completed bookings only
    console.log('\n2️⃣ Completed bookings only:');
    const [completedBookings] = await db.execute(`
      SELECT booking_id, status, total_price 
      FROM bookings 
      WHERE user_id = ? AND status = 'Completed'
    `, [userId]);
    
    let totalFromCompleted = 0;
    completedBookings.forEach(booking => {
      console.log(`   Booking ${booking.booking_id}: ${booking.status} - ₱${booking.total_price}`);
      totalFromCompleted += parseFloat(booking.total_price);
    });
    console.log(`   Total from completed bookings: ₱${totalFromCompleted}`);
    
    // Test 3: Check paid bookings (old method)
    console.log('\n3️⃣ Paid bookings (old method):');
    const [paidBookings] = await db.execute(`
      SELECT booking_id, status, total_price, payment_status 
      FROM bookings 
      WHERE user_id = ? AND payment_status = 'Paid'
    `, [userId]);
    
    let totalFromPaid = 0;
    paidBookings.forEach(booking => {
      console.log(`   Booking ${booking.booking_id}: ${booking.status} - ₱${booking.total_price} (Payment: ${booking.payment_status})`);
      totalFromPaid += parseFloat(booking.total_price);
    });
    console.log(`   Total from paid bookings: ₱${totalFromPaid}`);
    
    // Test 4: Test the new dashboard query
    console.log('\n4️⃣ New dashboard query result:');
    const [totalSpentResult] = await db.execute(
      'SELECT COALESCE(SUM(total_price), 0) as total_spent FROM bookings WHERE user_id = ? AND status = "Completed"',
      [userId]
    );
    console.log(`   Total spent (completed only): ₱${totalSpentResult[0].total_spent}`);
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testTotalSpent();
