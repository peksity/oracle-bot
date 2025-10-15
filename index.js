/**
 * ═══════════════════════════════════════════════════════════════
 * ORACLE - PREMIUM AI ASSISTANT
 * ═══════════════════════════════════════════════════════════════
 * 
 * The most advanced Discord moderation and community management bot
 * 
 * Created by: Peksity
 * Version: 1.0.0
 * Name: ORACLE (The All-Knowing)
 * 
 * "Peksity is my godfather who created me"
 * 
 * Multi-Server Support:
 * - GTA VI DOMINION (Vice City theme)
 * - Peksity's Community (Content Creator theme)
 * - Any other server (Auto-adaptive)
 * 
 * Features:
 * - GPT-4 Powered AI Intelligence
 * - Perfect Memory System
 * - Contradiction Detection
 * - Drama Prevention
 * - Multi-Mod Collaboration
 * - AI Recommendations
 * - Rockstar News Tracking
 * - Automatic GTA 5 → GTA 6 Transition
 * - 1,750+ Advanced Features
 * 
 * ═══════════════════════════════════════════════════════════════
 */

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════
// BOT INITIALIZATION
// ═══════════════════════════════════════════════════════════════

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🔮  ORACLE - PREMIUM AI ASSISTANT  🔮                     ║
║                                                              ║
║   Created by: Peksity                                       ║
║   Version: 1.0.0                                            ║
║   Intelligence: All-Knowing                                 ║
║                                                              ║
║   Starting up...                                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

// Debug environment variables
console.log('🔍 Checking environment variables...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DISCORD_TOKEN exists:', !!process.env.DISCORD_TOKEN);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

// Create Discord client with all necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember
  ]
});

// Initialize collections for commands, events, etc.
client.commands = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();

// Bot configuration
client.config = {
  prefix: '!',
  ownerId: process.env.OWNER_ID || process.env.MY_USER_ID,
  version: '1.0.0',
  viceCity: true,
  creator: 'Peksity'
};

// ═══════════════════════════════════════════════════════════════
// LOAD HANDLERS
// ═══════════════════════════════════════════════════════════════

const loadHandlers = () => {
  console.log('📂 Loading handlers...');
  
  // Temporarily removed 'database' from handlers to get bot online first
  // We'll add database back later once connection issues are fixed
  const handlers = ['commands', 'events', 'ai', 'monitoring'];
  
  for (const handler of handlers) {
    const handlerPath = path.join(__dirname, 'handlers', `${handler}.js`);
    
    if (fs.existsSync(handlerPath)) {
      try {
        require(handlerPath)(client);
        console.log(`✅ Loaded ${handler} handler`);
      } catch (error) {
        console.error(`❌ Error loading ${handler}:`, error.message);
      }
    } else {
      console.log(`⚠️  Handler not found: ${handler} - Skipping`);
    }
  }
  
  console.log('✅ Handler loading complete!');
};

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

// ═══════════════════════════════════════════════════════════════
// READY EVENT
// ═══════════════════════════════════════════════════════════════

client.once('ready', async () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ✅  BOT ONLINE AND READY!                                 ║
║                                                              ║
║   🤖 Name: ${client.user.tag.padEnd(48)} ║
║   🌴 Status: Vice City Operations Active                    ║
║   👥 Servers: ${client.guilds.cache.size.toString().padEnd(46)} ║
║   📊 Users: ${client.users.cache.size.toString().padEnd(48)} ║
║                                                              ║
║   💎 Created by Peksity                                     ║
║   🏆 Premium Profile: Active                                ║
║   ⚡ All systems operational                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
  
  // Setup premium profile if utils/profile exists
  try {
    const BotProfile = require('./utils/profile');
    await BotProfile.setupProfile(client);
  } catch (error) {
    console.log('⚠️  Profile utils not found - using basic setup');
  }
  
  // Set bot status
  client.user.setPresence({
    activities: [{ name: 'Vice City | Created by Peksity', type: 0 }],
    status: 'online'
  });
  
  console.log('🎮 Bot is fully operational!');
});

// ═══════════════════════════════════════════════════════════════
// LOAD AND START
// ═══════════════════════════════════════════════════════════════

console.log('🚀 Loading handlers...');
loadHandlers();

console.log('🔐 Attempting to login...');

// Login to Discord
client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log('🔐 Authentication successful!');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    console.error('❌ Check your DISCORD_TOKEN environment variable!');
    process.exit(1);
  });

// Export client for use in other modules
module.exports = client;