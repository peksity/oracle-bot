const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('🚨 DELETE ALL - Remove all setup channels, categories, and Premium Member role to start fresh'),
  
  async execute(interaction) {
    try {
      // Defer reply
      await interaction.deferReply();
      
      const guild = interaction.guild;
      
      console.log('\n🚨 SETUP RESET INITIATED');
      console.log('===================================\n');

      // Step 1: Verify permissions
      console.log('🔐 Verifying admin permissions...');
      if (!interaction.member.permissions.has('Administrator')) {
        await interaction.editReply('❌ Only administrators can reset setup.');
        return;
      }
      console.log('✅ Admin verified\n');

      // Step 2: List all categories we're looking for
      const categoriesToDelete = [
        'SUPPORT LINE',
        'MODERATOR AREA',
        'BOT COMMANDS',
        'INTRODUCTION',
        'GTA VI UPDATES',
        'SERVER INFORMATION',
        'SERVER SUPPORT',
        'INTERACTIONS',
        'VOICE CHANNELS',
        'LOOKING FOR GROUP (LFG)',
        'ACTIVITIES',
        'PREMIUM AREA'
      ];

      // Step 3: Delete categories and their channels
      console.log('🗑️  STEP 1: Deleting categories and channels...\n');
      let deletedCategories = 0;
      let deletedChannels = 0;

      for (const categoryName of categoriesToDelete) {
        try {
          const category = guild.channels.cache.find(c => 
            c.type === ChannelType.GuildCategory && c.name === categoryName
          );

          if (category) {
            console.log(`📍 Found category: ${categoryName}`);
            
            // Delete all channels in this category
            const channelsInCategory = category.children.cache;
            for (const [, channel] of channelsInCategory) {
              try {
                await channel.delete();
                deletedChannels++;
                console.log(`   ✅ Deleted channel: ${channel.name}`);
              } catch (error) {
                console.error(`   ❌ Failed to delete channel ${channel.name}: ${error.message}`);
              }
            }

            // Delete the category
            await category.delete();
            deletedCategories++;
            console.log(`   ✅ Deleted category: ${categoryName}\n`);
          } else {
            console.log(`⏭️  Category not found: ${categoryName}\n`);
          }
        } catch (error) {
          console.error(`❌ Error processing category ${categoryName}: ${error.message}\n`);
        }
      }

      // Step 4: Delete all roles created by setup
      console.log('🚨 STEP 2: Deleting all setup roles...\n');
      
      const rolesToDelete = [
        'Owner',
        'Admin',
        'Senior Moderator',
        'Moderator',
        'Server Designer',
        'Support Team',
        'Server Booster',
        'Member',
        'RP Legend',
        'Overachiever',
        'Speed Demon',
        'Heist Mastermind',
        'Heist Master',
        'Bosssman',
        'Premium Member'
      ];

      let deletedRoles = 0;

      for (const roleName of rolesToDelete) {
        try {
          const role = guild.roles.cache.find(r => r.name === roleName);
          if (role) {
            await role.delete();
            console.log(`   ✅ Deleted role: ${roleName}`);
            deletedRoles++;
          }
        } catch (error) {
          console.warn(`   ⚠️  Could not delete role ${roleName}: ${error.message}`);
        }
      }

      console.log(`\n✅ Deleted ${deletedRoles}/15 roles\n`);

      // Step 5: Summary
      console.log('===================================');
      console.log('🎉 RESET COMPLETE!\n');
      console.log(`📊 SUMMARY:`);
      console.log(`   ✅ Categories deleted: ${deletedCategories}/12`);
      console.log(`   ✅ Channels deleted: ${deletedChannels}`);
      console.log(`   ✅ Roles deleted: ${deletedRoles}/15`);
      console.log(`\n⚡ You can now run /setup again to create fresh!\n`);

      // Reply to user
      const resetEmbed = {
        color: 0xFF0000,
        title: '✅ Setup Reset Complete!',
        description: 'All categories, channels, and roles have been deleted.',
        fields: [
          { name: '📁 Categories Deleted', value: `${deletedCategories}/12`, inline: true },
          { name: '📝 Channels Deleted', value: `${deletedChannels}`, inline: true },
          { name: '👥 Roles Deleted', value: `${deletedRoles}/15`, inline: true },
          { name: '🚀 Next Step', value: 'Run `/setup` to create everything fresh!', inline: false }
        ],
        footer: { text: '⚡ Powered by Peksity' },
        timestamp: new Date()
      };

      await interaction.editReply({ embeds: [resetEmbed] });

    } catch (error) {
      console.error('❌ RESET FAILED:', error);
      await interaction.editReply({
        content: `❌ Error during reset: ${error.message}`
      }).catch(() => {});
    }
  }
};