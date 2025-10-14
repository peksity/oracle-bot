/**
 * ═══════════════════════════════════════════════════════════════
 * DATABASE HANDLER LOADER
 * ═══════════════════════════════════════════════════════════════
 */

const db = require('../utils/database');

module.exports = async (client) => {
  console.log('📊 Initializing database...');
  
  // Connect to database
  const connected = await db.connect();
  
  if (!connected) {
    console.error('❌ Failed to connect to database. Bot cannot start.');
    process.exit(1);
  }
  
  // Attach to client
  client.db = db;
  
  console.log('✅ Database ready');
};
