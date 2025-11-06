const fs = require('fs');
const path = require('path');
const { Routes } = require('discord.js');

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
    
    const rest = new (require('discord-api-types').REST)({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    
    console.log(`✅ Successfully registered ${commands.length} commands with Discord\n`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
};
```

5. **Save it** (Ctrl+S)

---

## 📁 STEP 2: Create Moderation Folder

1. **Right-click on the `commands` folder** in VS Code sidebar
2. **Select: "New Folder"**
3. **Type:** `moderation`
4. **Press Enter**

Now you should have: `commands/moderation/`

---

## 📄 STEP 3: Add 8 Moderation Commands

For **each of these 8 commands**, do:

1. **Right-click `moderation` folder**
2. **Select: "New File"**
3. **Type the name** (e.g., `warn.js`)
4. **Copy the code** from the files I created:
   - [warn.js](computer:///mnt/user-data/outputs/warn.js)
   - [kick.js](computer:///mnt/user-data/outputs/kick.js)
   - [ban.js](computer:///mnt/user-data/outputs/ban.js)
   - [timeout.js](computer:///mnt/user-data/outputs/timeout.js)
   - [clear.js](computer:///mnt/user-data/outputs/clear.js)
   - [lock.js](computer:///mnt/user-data/outputs/lock.js)
   - [unlock.js](computer:///mnt/user-data/outputs/unlock.js)
   - [unban.js](computer:///mnt/user-data/outputs/unban.js)

5. **Paste the entire code** into each new file
6. **Save each one** (Ctrl+S)

---

## ✅ VERIFICATION

After adding all files, your folder structure should look like:
```
commands/
├── setup.js
├── setupreset.js
├── moderation/
│   ├── warn.js
│   ├── kick.js
│   ├── ban.js
│   ├── timeout.js
│   ├── clear.js
│   ├── lock.js
│   ├── unlock.js
│   └── unban.js