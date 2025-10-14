const db = require('./config/db');

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Check if notifications table exists and has data
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM notifications');
    console.log('📊 Total notifications in database:', rows[0].count);
    
    // Test 2: Get notifications for user 4
    const [userNotifications] = await db.execute('SELECT * FROM notifications WHERE user_id = 4 ORDER BY created_at DESC LIMIT 5');
    console.log('👤 Notifications for user 4:', userNotifications.length);
    userNotifications.forEach(notif => {
      console.log(`  - ${notif.title}: ${notif.message.substring(0, 50)}...`);
    });
    
    // Test 3: Get unread count for user 4
    const [unreadCount] = await db.execute('SELECT COUNT(*) as count FROM notifications WHERE user_id = 4 AND is_read = 0');
    console.log('🔔 Unread notifications for user 4:', unreadCount[0].count);
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testDatabase();
