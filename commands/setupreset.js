const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('🚨 DELETE ALL - Remove all setup data to start fresh'),
  
  async execute(interaction) {
    try {
      await interaction.deferReply();
      
      const guild = interaction.guild;
      
      console.log('\n🚨 SETUP RESET STARTED');

      // Verify admin
      if (!interaction.member.permissions.has('Administrator')) {
        await interaction.editReply('❌ Only administrators can reset!');
        return;
      }

      console.log('✅ Admin verified\n');

      // Categories to delete
      const categoriesToDelete = [
        'SUPPORT LINE', 'MODERATOR AREA', 'BOT COMMANDS', 'INTRODUCTION',
        'GTA VI UPDATES', 'SERVER INFORMATION', 'SERVER SUPPORT', 'INTERACTIONS',
        'VOICE CHANNELS', 'LOOKING FOR GROUP (LFG)', 'ACTIVITIES', 'PREMIUM AREA'
      ];

      let deletedCategories = 0;
      let deletedChannels = 0;
      let deletedRoles = 0;

      // Delete categories and channels
      console.log('🗑️ Deleting categories and channels...');
      for (const categoryName of categoriesToDelete) {
        const category = guild.channels.cache.find(c => 
          c.type === ChannelType.GuildCategory && c.name === categoryName
        );

        if (category) {
          // Delete channels
          const channels = category.children.cache;
          for (const [, channel] of channels) {
            try {
              await channel.delete();
              deletedChannels++;
            } catch (e) {
              console.warn(`Failed to delete channel ${channel.name}`);
            }
          }
          
          // Delete category
          try {
            await category.delete();
            deletedCategories++;
          } catch (e) {
            console.warn(`Failed to delete category ${categoryName}`);
          }
        }
      }
      console.log(`✅ Deleted ${deletedCategories} categories, ${deletedChannels} channels\n`);

      // Delete roles
      console.log('🗑️ Deleting roles...');
      const rolesToDelete = [
        'Owner', 'Admin', 'Senior Moderator', 'Moderator',
        'Server Designer', 'Support Team', 'Server Booster', 'Member',
        'RP Legend', 'Overachiever', 'Speed Demon', 'Heist Mastermind',
        'Heist Master', 'Bosssman', 'Premium Member'
      ];

      for (const roleName of rolesToDelete) {
        const role = guild.roles.cache.find(r => r.name === roleName);
        if (role) {
          try {
            await role.delete();
            deletedRoles++;
          } catch (e) {
            console.warn(`Failed to delete role ${roleName}`);
          }
        }
      }
      console.log(`✅ Deleted ${deletedRoles} roles\n`);

      // Send summary
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('✅ Reset Complete!')
        .addFields(
          { name: '📁 Categories', value: `${deletedCategories}/12`, inline: true },
          { name: '📝 Channels', value: `${deletedChannels}`, inline: true },
          { name: '👥 Roles', value: `${deletedRoles}/15`, inline: true },
          { name: '🚀 Next', value: 'Run `/setup` to recreate everything!', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      await interaction.editReply({ embeds: [embed] });
      console.log('🎉 Reset complete!\n');

    } catch (error) {
      console.error('❌ Reset error:', error.message);
      await interaction.editReply({
        content: `❌ Error: ${error.message}`
      }).catch(() => {});
    }
  }
};