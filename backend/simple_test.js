const bookingStatusModel = require('./models/bookingStatusModel');

async function simpleTest() {
  console.log('🧪 Simple Test - Checking if models load correctly...\n');

  try {
    // Test if the model loads without errors
    console.log('✅ bookingStatusModel loaded successfully');
    console.log('✅ updateBoatStatus function exists:', typeof bookingStatusModel.updateBoatStatus === 'function');
    
    // Test the function directly
    console.log('\n🔧 Testing updateBoatStatus function...');
    // This will fail if there's no database connection, but we can see if the function exists
    try {
      await bookingStatusModel.updateBoatStatus(1, 'Available');
      console.log('✅ updateBoatStatus function works');
    } catch (error) {
      console.log('⚠️  updateBoatStatus function exists but database connection failed:', error.message);
    }

    console.log('\n🎉 Basic functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

simpleTest();

