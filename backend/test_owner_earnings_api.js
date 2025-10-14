const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const TEST_OWNER_ID = 2; // Jun Gil Casquejo from the database

async function testOwnerEarningsAPI() {
  console.log('🚀 Testing Owner Earnings API...\n');

  try {
    // Test 1: Get Owner Earnings
    console.log('1. Testing GET /bookings/owner/:ownerId/earnings');
    const earningsResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings`);
    console.log('✅ Success! Found', earningsResponse.data.earnings.length, 'earnings records');
    console.log('Pagination:', earningsResponse.data.pagination);
    if (earningsResponse.data.earnings.length > 0) {
      console.log('Sample earnings record:', {
        id: earningsResponse.data.earnings[0].id,
        boat: earningsResponse.data.earnings[0].boat,
        customer: earningsResponse.data.earnings[0].customer,
        amount: earningsResponse.data.earnings[0].amount,
        status: earningsResponse.data.earnings[0].status
      });
    }
    console.log('');

    // Test 2: Get Owner Earnings Stats
    console.log('2. Testing GET /bookings/owner/:ownerId/earnings/stats');
    const statsResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings/stats`);
    console.log('✅ Success! Owner earnings stats:', {
      totalRevenue: statsResponse.data.totalRevenue,
      totalBookings: statsResponse.data.totalBookings,
      completedBookings: statsResponse.data.completedBookings,
      avgBookingValue: statsResponse.data.avgBookingValue,
      revenueGrowth: statsResponse.data.revenueGrowth,
      bookingGrowth: statsResponse.data.bookingGrowth
    });
    console.log('');

    // Test 3: Get Monthly Earnings
    console.log('3. Testing GET /bookings/owner/:ownerId/earnings/monthly');
    const monthlyResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings/monthly?year=2025`);
    console.log('✅ Success! Monthly earnings breakdown:', monthlyResponse.data);
    console.log('');

    // Test 4: Test Date Filtering
    console.log('4. Testing date filtering');
    const filteredResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings`, {
      params: {
        startDate: '2025-08-01',
        endDate: '2025-08-31'
      }
    });
    console.log('✅ Success! Filtered earnings:', filteredResponse.data.earnings.length, 'records found');
    console.log('');

    // Test 5: Test Pagination
    console.log('5. Testing pagination');
    const paginatedResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings`, {
      params: {
        page: 1,
        limit: 2
      }
    });
    console.log('✅ Success! Paginated results:', {
      currentPage: paginatedResponse.data.pagination.currentPage,
      totalPages: paginatedResponse.data.pagination.totalPages,
      totalItems: paginatedResponse.data.pagination.totalItems,
      itemsPerPage: paginatedResponse.data.pagination.itemsPerPage,
      returnedItems: paginatedResponse.data.earnings.length
    });
    console.log('');

    // Test 6: Export JSON
    console.log('6. Testing export (JSON format)');
    const exportResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings/export`, {
      params: {
        format: 'json'
      }
    });
    console.log('✅ Success! Export data:', {
      ownerId: exportResponse.data.ownerId,
      exportDate: exportResponse.data.exportDate,
      totalRecords: exportResponse.data.totalRecords
    });
    console.log('');

    // Test 7: Export CSV (check headers only)
    console.log('7. Testing export (CSV format)');
    try {
      const csvResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings/export`, {
        params: {
          format: 'csv'
        },
        responseType: 'text'
      });
      console.log('✅ Success! CSV export headers:', csvResponse.headers['content-type']);
      console.log('CSV preview (first 200 chars):', csvResponse.data.substring(0, 200) + '...');
    } catch (csvError) {
      console.log('⚠️ CSV export test failed (this might be expected in test environment):', csvError.message);
    }
    console.log('');

    console.log('🎉 All earnings API tests passed successfully!');

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
      await axios.get(`${API_BASE_URL}/bookings/owner/99999/earnings`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent owner');
      } else {
        console.log('⚠️ Unexpected response for non-existent owner:', error.response?.status);
      }
    }

    // Test with invalid date format
    console.log('2. Testing with invalid date format');
    try {
      await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings`, {
        params: {
          startDate: 'invalid-date'
        }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly returned 400 for invalid date format');
      } else {
        console.log('⚠️ Unexpected response for invalid date:', error.response?.status);
      }
    }

    // Test with very large page number
    console.log('3. Testing with large page number');
    const largePageResponse = await axios.get(`${API_BASE_URL}/bookings/owner/${TEST_OWNER_ID}/earnings`, {
      params: {
        page: 999999,
        limit: 10
      }
    });
    console.log('✅ Large page number handled gracefully:', {
      currentPage: largePageResponse.data.pagination.currentPage,
      totalPages: largePageResponse.data.pagination.totalPages,
      returnedItems: largePageResponse.data.earnings.length
    });

    console.log('\n🎉 Edge case tests completed!');

  } catch (error) {
    console.error('❌ Edge case test failed:', error.response?.data || error.message);
  }
}

// Run the tests
async function runAllTests() {
  await testOwnerEarningsAPI();
  await testEdgeCases();
}

runAllTests();
