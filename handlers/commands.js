/**
 * ═══════════════════════════════════════════════════════════════
 * COMMANDS HANDLER - Loads and registers all command files
 * ═══════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { Routes } = require('discord.js');

module.exports = (client) => {
  console.log('📂 Loading commands...');
  
  const commandsPath = path.join(__dirname, '..', 'commands');
  
  // Check if commands folder exists
  if (!fs.existsSync(commandsPath)) {
    console.log('⚠️  Commands folder not found at:', commandsPath);
    return;
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  if (commandFiles.length === 0) {
    console.log('⚠️  No command files found');
    return;
  }
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    
    try {
      const command = require(filePath);
      
      // Check if it's a slash command (has data and execute)
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
      } else {
        console.log(`⚠️  Skipped ${file} - missing data or execute`);
      }
    } catch (error) {
      console.error(`❌ Error loading command ${file}:`, error.message);
    }
  }
  
  console.log(`✅ Loaded ${client.commands.size} commands`);
  
  // ═══════════════════════════════════════════════════════════════
  // REGISTER COMMANDS WITH DISCORD
  // ═══════════════════════════════════════════════════════════════
  
  client.once('ready', async () => {
    try {
      console.log('📡 Registering slash commands with Discord...');
      
      // Collect all command data
      const commands = [];
      for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
      }
      
      if (commands.length === 0) {
        console.log('⚠️  No commands to register');
        return;
      }
      
      // Register global commands (visible everywhere)
      await client.rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      
      console.log(`✅ Registered ${commands.length} slash commands with Discord!`);
      
    } catch (error) {
      console.error('❌ Failed to register slash commands:', error);
    }
  });
};