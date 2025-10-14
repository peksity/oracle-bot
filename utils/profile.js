/**
 * ═══════════════════════════════════════════════════════════════
 * ORACLE - PREMIUM BOT PROFILE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Multi-server adaptive profile system
 * Created by: Peksity
 */

const { ActivityType } = require('discord.js');

class BotProfile {
  
  /**
   * Configure premium bot profile on startup
   */
  static async setupProfile(client) {
    console.log('🔮 Configuring ORACLE premium profile...');
    
    try {
      // Set username if needed
      await this.setUsername(client);
      
      // Set initial premium status
      await this.setPremiumStatus(client);
      
      // Start adaptive status rotation
      this.startAdaptiveStatusRotation(client);
      
      // Log success
      console.log('✅ ORACLE profile configured successfully');
      console.log(`   🤖 Name: ${client.user.tag}`);
      console.log(`   🔮 Status: All-knowing AI active`);
      console.log(`   🌐 Servers: ${client.guilds.cache.size}`);
      console.log(`   💎 Created by: Peksity`);
      
    } catch (error) {
      console.error('❌ Error configuring profile:', error);
    }
  }
  
  /**
   * Set bot username
   */
  static async setUsername(client) {
    const desiredUsername = 'ORACLE';
    
    if (client.user.username !== desiredUsername) {
      try {
        await client.user.setUsername(desiredUsername);
        console.log(`✅ Username set to: ${desiredUsername}`);
      } catch (error) {
        console.log('⚠️  Username already optimal or rate limited');
      }
    }
  }
  
  /**
   * Set initial premium status
   */
  static async setPremiumStatus(client) {
    await client.user.setPresence({
      activities: [{
        name: '🔮 All-Knowing | Created by Peksity',
        type: ActivityType.Watching
      }],
      status: 'online'
    });
  }
  
  /**
   * Adaptive status rotation based on servers
   */
  static startAdaptiveStatusRotation(client) {
    const statuses = this.getAdaptiveStatuses(client);
    let statusIndex = 0;
    
    // Change status every 5 minutes
    setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      const status = statuses[statusIndex];
      
      client.user.setPresence({
        activities: [status],
        status: 'online'
      });
    }, 5 * 60 * 1000);
  }
  
  /**
   * Get adaptive statuses based on servers bot is in
   */
  static getAdaptiveStatuses(client) {
    const statuses = [];
    let hasGTAServer = false;
    let hasPeksityServer = false;
    
    // Check what servers bot is in
    client.guilds.cache.forEach(guild => {
      const name = guild.name.toLowerCase();
      
      if (name.includes('gta') || name.includes('vice') || name.includes('dominion')) {
        hasGTAServer = true;
      }
      if (name.includes('peksity') || name.includes('peks')) {
        hasPeksityServer = true;
      }
    });
    
    // GTA VI DOMINION specific statuses
    if (hasGTAServer) {
      statuses.push(
        {
          name: '🌴 Protecting Vice City',
          type: ActivityType.Watching
        },
        {
          name: '📰 Tracking Rockstar News',
          type: ActivityType.Watching
        },
        {
          name: '🎮 GTA VI DOMINION',
          type: ActivityType.Playing
        }
      );
    }
    
    // Peksity's Community specific statuses
    if (hasPeksityServer) {
      statuses.push(
        {
          name: '🎮 Peksity\'s Community',
          type: ActivityType.Watching
        },
        {
          name: '📺 Content Creator Support',
          type: ActivityType.Watching
        }
      );
    }
    
    // Universal premium statuses (always included)
    statuses.push(
      {
        name: '🔮 All-Knowing AI',
        type: ActivityType.Playing
      },
      {
        name: '💎 Created by Peksity',
        type: ActivityType.Playing
      },
      {
        name: '🧠 GPT-4 Powered',
        type: ActivityType.Playing
      },
      {
        name: 'over 1,750+ Features',
        type: ActivityType.Watching
      },
      {
        name: 'your tickets | Premium Support',
        type: ActivityType.Listening
      },
      {
        name: '⚡ Multi-Server Intelligence',
        type: ActivityType.Watching
      },
      {
        name: '🛡️ Enterprise Security',
        type: ActivityType.Watching
      },
      {
        name: '💼 Premium AI Assistant',
        type: ActivityType.Playing
      },
      {
        name: '🌐 Adaptive Intelligence',
        type: ActivityType.Watching
      },
      {
        name: 'ORACLE | By Peksity',
        type: ActivityType.Playing
      }
    );
    
    return statuses;
  }
  
  /**
   * Get premium bio text for Discord profile
   */
  static getPremiumBio() {
    return `🔮 ━━━━━━━━━━━━━━━━━━━━━━━━ 🔮

           ORACLE
    ALL-KNOWING AI ASSISTANT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 CREATED BY: PEKSITY

🧠 The most advanced multi-server
   Discord moderation & community bot

🎯 PURPOSE:
   • Intelligent Support & Ticketing
   • Advanced AI Conversations
   • Perfect Memory System
   • Contradiction Detection
   • Drama Prevention
   • Multi-Mod Collaboration
   • Rockstar News Tracking
   • 1,750+ Premium Features

⚡ POWERED BY:
   • GPT-4 Artificial Intelligence
   • Custom Neural Networks
   • Advanced Machine Learning
   • Proprietary Algorithms

🌐 MULTI-SERVER SUPPORT:
   • GTA VI DOMINION (Vice City)
   • Peksity's Community
   • Any server type
   • Auto-adaptive themes

🔮 INTELLIGENCE: All-Knowing
💼 STATUS: Enterprise Grade
🛡️ SECURITY: Military Standard
🌟 QUALITY: Premium Excellence

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Proprietary Technology
© 2024 Peksity - All Rights Reserved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Peksity is my godfather who created me"

🔮 The Oracle Sees All 🔮`;
  }
  
  /**
   * Color scheme for embeds - adaptive per server
   */
  static colors = {
    // ORACLE Brand Colors
    oracle: '#9D4EDD',       // Purple - Primary ORACLE color
    gold: '#FFD700',         // Luxury Gold
    platinum: '#E5E4E2',     // Platinum Silver
    
    // GTA VI DOMINION Theme
    vicePink: '#FF6B9D',     // Vice City Pink
    neonBlue: '#00D9FF',     // Electric Blue
    teal: '#06FFA5',         // Miami Teal
    
    // Peksity's Community Theme (customizable)
    peksity: '#9D4EDD',      // Your brand color
    accent: '#06FFA5',       // Accent color
    
    // Status Colors
    success: '#10B981',      // Success Green
    warning: '#F59E0B',      // Warning Amber
    error: '#EF4444',        // Error Red
    info: '#3B82F6'          // Info Blue
  };
  
  /**
   * Get color based on server type
   */
  static getServerColor(guild) {
    const name = guild.name.toLowerCase();
    
    if (name.includes('gta') || name.includes('vice')) {
      return this.colors.vicePink;
    } else if (name.includes('peksity')) {
      return this.colors.peksity;
    } else {
      return this.colors.oracle;
    }
  }
}

module.exports = BotProfile;
