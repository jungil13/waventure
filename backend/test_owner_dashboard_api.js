const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const TEST_OWNER_ID = 2; // Jun Gil Casquejo from the database

async function testOwnerDashboardAPI() {
  console.log('🚀 Testing Owner Dashboard API...\n');

  try {
    // Test 1: Get Dashboard Data
    console.log('1. Testing GET /bookings/owner/:ownerId/dashboard');
    const dashboardResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/dashboard`);
    console.log('✅ Success! Dashboard data retrieved:');
    console.log('  - Total Boats:', dashboardResponse.data.totalBoats);
    console.log('  - Total Bookings:', dashboardResponse.data.totalBookings);
    console.log('  - Average Rating:', dashboardResponse.data.avgRating);
    console.log('  - Total Reviews:', dashboardResponse.data.totalReviews);
    console.log('  - Monthly Earnings:', dashboardResponse.data.monthlyEarnings);
    console.log('  - Revenue Growth:', dashboardResponse.data.revenueGrowth + '%');
    console.log('  - Recent Bookings:', dashboardResponse.data.recentBookings.length);
    
    if (dashboardResponse.data.recentBookings.length > 0) {
      console.log('  - Sample Recent Booking:', {
        id: dashboardResponse.data.recentBookings[0].id,
        boat: dashboardResponse.data.recentBookings[0].boat,
        customer: dashboardResponse.data.recentBookings[0].customer,
        status: dashboardResponse.data.recentBookings[0].status,
        amount: dashboardResponse.data.recentBookings[0].amount
      });
    }
    console.log('');

    // Test 2: Get Performance Metrics (Month)
    console.log('2. Testing GET /bookings/owner/:ownerId/performance (month)');
    const performanceResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/performance`, {
      params: { period: 'month' }
    });
    console.log('✅ Success! Performance metrics (month):');
    console.log('  - Total Bookings:', performanceResponse.data.totalBookings);
    console.log('  - Completed Bookings:', performanceResponse.data.completedBookings);
    console.log('  - Total Revenue:', performanceResponse.data.totalRevenue);
    console.log('  - Average Booking Value:', performanceResponse.data.avgBookingValue);
    console.log('  - Unique Customers:', performanceResponse.data.uniqueCustomers);
    console.log('  - Active Boats:', performanceResponse.data.activeBoats);
    console.log('  - Completion Rate:', performanceResponse.data.completionRate + '%');
    console.log('');

    // Test 3: Get Performance Metrics (Week)
    console.log('3. Testing GET /bookings/owner/:ownerId/performance (week)');
    const weeklyPerformanceResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/performance`, {
      params: { period: 'week' }
    });
    console.log('✅ Success! Performance metrics (week):');
    console.log('  - Total Bookings:', weeklyPerformanceResponse.data.totalBookings);
    console.log('  - Completed Bookings:', weeklyPerformanceResponse.data.completedBookings);
    console.log('  - Total Revenue:', weeklyPerformanceResponse.data.totalRevenue);
    console.log('');

    // Test 4: Get Performance Metrics (Year)
    console.log('4. Testing GET /bookings/owner/:ownerId/performance (year)');
    const yearlyPerformanceResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/performance`, {
      params: { period: 'year' }
    });
    console.log('✅ Success! Performance metrics (year):');
    console.log('  - Total Bookings:', yearlyPerformanceResponse.data.totalBookings);
    console.log('  - Completed Bookings:', yearlyPerformanceResponse.data.completedBookings);
    console.log('  - Total Revenue:', yearlyPerformanceResponse.data.totalRevenue);
    console.log('');

    // Test 5: Get Activity Summary
    console.log('5. Testing GET /bookings/owner/:ownerId/activity');
    const activityResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/activity`);
    console.log('✅ Success! Activity summary:');
    console.log('  - Today\'s Bookings:', activityResponse.data.todayBookings);
    console.log('  - Week\'s Bookings:', activityResponse.data.weekBookings);
    console.log('  - Pending Bookings:', activityResponse.data.pendingBookings);
    console.log('  - Upcoming Bookings:', activityResponse.data.upcomingBookings);
    console.log('');

    console.log('🎉 All dashboard API tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the backend server is running on port 5000');
      console.log('💡 Make sure the database has the test data (owner ID 2)');
    } else if (error.response?.status === 500) {
      console.log('\n💡 Check the backend server logs for database connection issues');
    }
  }
}

// Additional test for edge cases
async function testEdgeCases() {
  console.log('\n🔍 Testing edge cases...\n');

  try {
    // Test with non-existent owner
    console.log('1. Testing with non-existent owner ID');
    try {
      await axios.get(`${API_BASE_URL}/bookings/owner/99999/dashboard`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent owner');
      } else {
        console.log('⚠️ Unexpected response for non-existent owner:', error.response?.status);
      }
    }

    // Test with invalid period
    console.log('2. Testing with invalid period');
    try {
      await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/performance`, {
        params: { period: 'invalid' }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly returned 400 for invalid period');
      } else {
        console.log('⚠️ Unexpected response for invalid period:', error.response?.status);
      }
    }

    // Test with default period (no parameter)
    console.log('3. Testing with default period (no parameter)');
    const defaultResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/performance`);
    console.log('✅ Default period handled correctly:', {
      totalBookings: defaultResponse.data.totalBookings,
      period: 'month (default)'
    });

    console.log('\n🎉 Edge case tests completed!');

  } catch (error) {
    console.error('❌ Edge case test failed:', error.response?.data || error.message);
  }
}

// Performance test
async function testPerformance() {
  console.log('\n⚡ Testing performance...\n');

  try {
    const startTime = Date.now();
    
    // Test multiple concurrent requests
    const promises = [
      axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/dashboard`),
      axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/performance`),
      axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/activity`)
    ];

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('✅ Performance test completed:');
    console.log('  - Concurrent requests:', promises.length);
    console.log('  - Total duration:', duration + 'ms');
    console.log('  - Average per request:', Math.round(duration / promises.length) + 'ms');
    console.log('  - All requests successful:', results.every(r => r.status === 200));

  } catch (error) {
    console.error('❌ Performance test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testOwnerDashboardAPI();
  await testEdgeCases();
  await testPerformance();
}

runAllTests();
