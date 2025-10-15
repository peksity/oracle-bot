/**
 * ═══════════════════════════════════════════════════════════════
 * COMMANDS HANDLER - Command Loading
 * ═══════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  console.log('📝 Loading commands...');
  
  const commandsPath = path.join(__dirname, '../commands');
  
  // Check if commands folder exists
  if (!fs.existsSync(commandsPath)) {
    console.log('⚠️  Commands folder not found - skipping command loading');
    return;
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  if (commandFiles.length === 0) {
    console.log('⚠️  No command files found - bot will work with mentions only');
    return;
  }
  
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
      } else {
        console.log(`⚠️  Command at ${file} is missing required "data" or "execute" property`);
      }
    } catch (error) {
      console.error(`❌ Error loading command ${file}:`, error.message);
    }
  }
  
  console.log(`✅ Commands loaded: ${client.commands.size}`);
};