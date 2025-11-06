const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('🚨 Delete all setup categories, channels, and roles'),
  
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const guild = interaction.guild;

      // Check admin
      if (!interaction.member.permissions.has('Administrator')) {
        await interaction.editReply('❌ Admin only!');
        return;
      }

      let deletedCats = 0;
      let deletedChans = 0;
      let deletedRoles = 0;

      // Delete categories
      const categoryNames = [
        'SUPPORT LINE', 'MODERATOR AREA', 'BOT COMMANDS', 'INTRODUCTION',
        'GTA VI UPDATES', 'SERVER INFORMATION', 'SERVER SUPPORT', 'INTERACTIONS',
        'VOICE CHANNELS', 'LOOKING FOR GROUP (LFG)', 'ACTIVITIES', 'PREMIUM AREA'
      ];

      for (const name of categoryNames) {
        const cat = guild.channels.cache.find(c => c.isCategory() && c.name === name);
        if (cat) {
          for (const [, ch] of cat.children.cache) {
            try {
              await ch.delete();
              deletedChans++;
            } catch (e) {}
          }
          try {
            await cat.delete();
            deletedCats++;
          } catch (e) {}
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
        const role = guild.roles.cache.find(r => r.name === name);
        if (role) {
          try {
            await role.delete();
            deletedRoles++;
          } catch (e) {}
        }
      }

      // Reply
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('✅ Reset Complete')
        .addFields(
          { name: 'Categories', value: `${deletedCats}`, inline: true },
          { name: 'Channels', value: `${deletedChans}`, inline: true },
          { name: 'Roles', value: `${deletedRoles}`, inline: true }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Setupreset error:', error);
      await interaction.editReply('❌ Error').catch(() => {});
    }
  }
};