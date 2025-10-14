const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const TEST_OWNER_ID = 2; // Jun Gil Casquejo from the database
const TEST_BOOKING_ID = 2; // Existing booking from the database

async function testOwnerBookingsAPI() {
  console.log('🚀 Testing Owner Bookings API...\n');

  try {
    // Test 1: Get Owner Bookings
    console.log('1. Testing GET /bookings/owner/:ownerId');
    const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}`);
    console.log('✅ Success! Found', bookingsResponse.data.length, 'bookings');
    console.log('Sample booking:', {
      id: bookingsResponse.data[0]?.id,
      boat: bookingsResponse.data[0]?.boat,
      customer: bookingsResponse.data[0]?.customer,
      status: bookingsResponse.data[0]?.status,
      amount: bookingsResponse.data[0]?.amount
    });
    console.log('');

    // Test 2: Get Owner Stats
    console.log('2. Testing GET /bookings/owner/:ownerId/stats');
    const statsResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/stats`);
    console.log('✅ Success! Owner stats:', statsResponse.data);
    console.log('');

    // Test 3: Get Booking Details
    console.log('3. Testing GET /bookings/owner/details/:bookingId');
    const detailsResponse = await axios.get(`${API_BASE_URL}/bookings/owner/details/${TEST_BOOKING_ID}`);
    console.log('✅ Success! Booking details:', {
      id: detailsResponse.data.id,
      boat: detailsResponse.data.boat,
      customer: detailsResponse.data.customer,
      status: detailsResponse.data.status,
      islands: detailsResponse.data.island,
      addons: detailsResponse.data.addons
    });
    console.log('');

    // Test 4: Update Booking Status (if there's a pending booking)
    const pendingBooking = bookingsResponse.data.find(b => b.status === 'Pending');
    if (pendingBooking) {
      console.log('4. Testing PUT /bookings/:bookingId/status');
      const updateResponse = await axios.put(`${API_BASE_URL}/bookings/${pendingBooking.id}/status`, {
        status: 'Confirmed'
      });
      console.log('✅ Success! Status updated:', updateResponse.data);
      
      // Revert the status back
      await axios.put(`${API_BASE_URL}/bookings/${pendingBooking.id}/status`, {
        status: 'Pending'
      });
      console.log('✅ Status reverted back to Pending');
    } else {
      console.log('4. Skipping status update test - no pending bookings found');
    }
    console.log('');

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the backend server is running on port 5000');
      console.log('💡 Make sure the database has the test data (owner ID 2, booking ID 2)');
    }
  }
}

// Run the tests
testOwnerBookingsAPI();
