const fs = require('fs');
const path = require('path');
const { Routes, REST } = require('discord.js');

module.exports = async (client) => {
  console.log('\n🔧 Loading commands...\n');

  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = fs.readdirSync(commandsPath);

  client.commands = new Map();
  let totalCommands = 0;

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const stat = fs.statSync(filePath);

    // If it's a FOLDER (like /moderation), load files from inside it
    if (stat.isDirectory()) {
      console.log(`📁 Loading commands from: ${file}/`);
      
      try {
        const subFiles = fs.readdirSync(filePath).filter(f => f.endsWith('.js'));
        
        for (const subFile of subFiles) {
          const subFilePath = path.join(filePath, subFile);
          const command = require(subFilePath);

          if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            console.log(`   ✅ ${command.data.name}`);
            totalCommands++;
          } else {
            console.warn(`   ⚠️  ${subFile} missing data or execute`);
          }
        }
      } catch (error) {
        console.error(`   ❌ Error loading from ${file}: ${error.message}`);
      }
    }
    // If it's a FILE, load it normally
    else if (file.endsWith('.js')) {
      try {
        const command = require(filePath);

        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(`✅ ${command.data.name}`);
          totalCommands++;
        } else {
          console.warn(`⚠️  ${file} missing data or execute`);
        }
      } catch (error) {
        console.error(`❌ Error loading ${file}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Loaded ${totalCommands} total commands\n`);

  // Register commands with Discord
  try {
    console.log('🔄 Registering commands with Discord...\n');
    const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    
    console.log(`✅ Successfully registered ${commands.length} commands with Discord\n`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
};