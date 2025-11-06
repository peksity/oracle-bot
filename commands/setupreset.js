const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('🚨 DELETE ALL - Remove all setup data'),
  
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const guild = interaction.guild;

      if (!interaction.member.permissions.has('Administrator')) {
        await interaction.editReply('❌ Admin only!');
        return;
      }

      let deletedCats = 0;
      let deletedChans = 0;
      let deletedRoles = 0;
      let errors = [];

      // Delete categories
      const categoryNames = [
        'SUPPORT LINE', 'MODERATOR AREA', 'BOT COMMANDS', 'INTRODUCTION',
        'GTA VI UPDATES', 'SERVER INFORMATION', 'SERVER SUPPORT', 'INTERACTIONS',
        'VOICE CHANNELS', 'LOOKING FOR GROUP (LFG)', 'ACTIVITIES', 'PREMIUM AREA'
      ];

      for (const name of categoryNames) {
        try {
          const cat = guild.channels.cache.find(c => c.isCategory && c.name === name);
          if (cat) {
            // Delete channels first
            const channels = Array.from(cat.children.cache.values());
            for (const ch of channels) {
              try {
                await ch.delete().catch(() => {});
                deletedChans++;
              } catch (e) {
                errors.push(`Channel ${ch.name}: ${e.message}`);
              }
            }
            
            // Then delete category
            await cat.delete().catch(() => {});
            deletedCats++;
          }
        } catch (e) {
          errors.push(`Category ${name}: ${e.message}`);
        }
      }

      // Delete roles
      const roleNames = [
        'Owner', 'Admin', 'Senior Moderator', 'Moderator',
        'Server Designer', 'Support Team', 'Server Booster', 'Member',
        'RP Legend', 'Overachiever', 'Speed Demon', 'Heist Mastermind',
        'Heist Master', 'Bosssman', 'Premium Member'
      ];

      for (const name of roleNames) {
        try {
          const role = guild.roles.cache.find(r => r.name === name);
          if (role) {
            await role.delete().catch(() => {});
            deletedRoles++;
          }
        } catch (e) {
          errors.push(`Role ${name}: ${e.message}`);
        }
      }

      // Send response
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('✅ Reset Complete')
        .addFields(
          { name: '📁 Categories', value: `${deletedCats}`, inline: true },
          { name: '📝 Channels', value: `${deletedChans}`, inline: true },
          { name: '👥 Roles', value: `${deletedRoles}`, inline: true }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Setupreset error:', error);
      try {
        await interaction.editReply('❌ Error occurred');
      } catch (e) {}
    }
  }
};