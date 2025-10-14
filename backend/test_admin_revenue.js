const db = require('./config/db');

async function testAdminRevenue() {
  try {
    console.log('🧪 Testing Admin Dashboard Revenue Calculation...\n');
    
    // Test 1: Check all bookings and their status
    console.log('1️⃣ All bookings with status and payment info:');
    const [allBookings] = await db.execute(`
      SELECT booking_id, status, payment_status, total_price, created_at
      FROM bookings 
      ORDER BY booking_id
    `);
    
    allBookings.forEach(booking => {
      console.log(`   Booking ${booking.booking_id}: ${booking.status} (Payment: ${booking.payment_status}) - ₱${booking.total_price}`);
    });
    
    // Test 2: Check completed bookings only (new method)
    console.log('\n2️⃣ Completed bookings only (new method):');
    const [completedBookings] = await db.execute(`
      SELECT booking_id, status, total_price
      FROM bookings 
      WHERE status = 'Completed'
    `);
    
    let totalFromCompleted = 0;
    completedBookings.forEach(booking => {
      console.log(`   Booking ${booking.booking_id}: ${booking.status} - ₱${booking.total_price}`);
      totalFromCompleted += parseFloat(booking.total_price);
    });
    console.log(`   Total from completed bookings: ₱${totalFromCompleted}`);
    
    // Test 3: Check paid bookings (old method)
    console.log('\n3️⃣ Paid bookings (old method):');
    const [paidBookings] = await db.execute(`
      SELECT booking_id, status, payment_status, total_price
      FROM bookings 
      WHERE payment_status = 'Paid'
    `);
    
    let totalFromPaid = 0;
    paidBookings.forEach(booking => {
      console.log(`   Booking ${booking.booking_id}: ${booking.status} (Payment: ${booking.payment_status}) - ₱${booking.total_price}`);
      totalFromPaid += parseFloat(booking.total_price);
    });
    console.log(`   Total from paid bookings: ₱${totalFromPaid}`);
    
    // Test 4: Test the new admin dashboard query
    console.log('\n4️⃣ New admin dashboard revenue query:');
    const [totalRevenueResult] = await db.execute(`
      SELECT COALESCE(SUM(total_price), 0) as total_revenue
      FROM bookings
      WHERE status = 'Completed'
    `);
    console.log(`   Total revenue (completed only): ₱${totalRevenueResult[0].total_revenue}`);
    
    // Test 5: Test last month revenue
    console.log('\n5️⃣ Last month revenue (completed only):');
    const [lastMonthRevenueResult] = await db.execute(`
      SELECT COALESCE(SUM(total_price), 0) as last_month_revenue
      FROM bookings
      WHERE status = 'Completed' 
      AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `);
    console.log(`   Last month revenue (completed only): ₱${lastMonthRevenueResult[0].last_month_revenue}`);
    
    console.log('\n✅ Test completed!');
    console.log('\n📊 Summary:');
    console.log(`   - Total bookings: ${allBookings.length}`);
    console.log(`   - Completed bookings: ${completedBookings.length}`);
    console.log(`   - Paid bookings: ${paidBookings.length}`);
    console.log(`   - Revenue from completed: ₱${totalFromCompleted}`);
    console.log(`   - Revenue from paid: ₱${totalFromPaid}`);
    console.log(`   - Difference: ₱${Math.abs(totalFromCompleted - totalFromPaid)}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testAdminRevenue();
