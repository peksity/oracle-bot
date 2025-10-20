/**
 * ═══════════════════════════════════════════════════════════════
 * EVENTS HANDLER - Message Listening and Slash Commands
 * ═══════════════════════════════════════════════════════════════
 */

const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = (client) => {
  console.log('👂 Loading event handlers...');
  
  // ═══════════════════════════════════════════════════════════════
  // SLASH COMMAND HANDLER
  // ═══════════════════════════════════════════════════════════════
  
  client.on('interactionCreate', async (interaction) => {
    // Only handle slash commands for now
    if (!interaction.isCommand()) return;
    
    // Get the command from client.commands collection
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
      console.log(`⚠️  Command not found: ${interaction.commandName}`);
      return;
    }
    
    try {
      console.log(`📝 Executing command: /${interaction.commandName} by ${interaction.user.tag}`);
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error executing command ${interaction.commandName}:`, error);
      
      // Reply with error (handle already replied)
      if (interaction.replied) {
        await interaction.followUp({
          content: '❌ There was an error executing this command!',
          ephemeral: true
        }).catch(() => {});
      } else {
        await interaction.reply({
          content: '❌ There was an error executing this command!',
          ephemeral: true
        }).catch(() => {});
      }
    }
  });
  
  // ═══════════════════════════════════════════════════════════════
  // MESSAGE CREATE HANDLER (for mentions)
  // ═══════════════════════════════════════════════════════════════
  
  client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Only respond to mentions
    if (!message.mentions.has(client.user)) return;
    
    try {
      // Show typing indicator
      await message.channel.sendTyping();
      
      // Get the message content without the mention
      const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();
      
      console.log(`💬 Message from ${message.author.tag}: ${userMessage}`);
      
      // If empty message, send a friendly prompt
      if (!userMessage) {
        await message.reply('Hello! I\'m ORACLE, your AI assistant created by Peksity. How can I help you today?');
        return;
      }
      
      // Call OpenAI with gpt-3.5-turbo
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are ORACLE, an advanced AI assistant bot created by Peksity. You are running in the GTA VI DOMINION Discord server, a community focused on GTA 6 / Vice City. 
            
Your personality:
- Professional but friendly
- Knowledgeable about GTA and gaming
- Helpful and supportive to community members
- Created by your godfather Peksity
- You are "The All-Knowing" AI

Keep responses concise (under 2000 characters for Discord). Be helpful and engaging.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      });
      
      const reply = completion.choices[0].message.content;
      
      console.log(`🤖 ORACLE response: ${reply.substring(0, 100)}...`);
      
      // Send reply
      await message.reply(reply);
      
    } catch (error) {
      console.error('❌ Error processing message:', error);
      
      // Send error message to user
      await message.reply('Sorry, I encountered an error processing your message. Please try again!').catch(() => {});
    }
  });
  
  console.log('✅ Event handlers loaded');
};