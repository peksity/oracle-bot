const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('🚨 Reset - Delete all setup'),
  
  async execute(interaction) {
    await interaction.reply('🚨 Resetting...');
    
    const guild = interaction.guild;
    
    if (!interaction.member.permissions.has('Administrator')) {
      await interaction.editReply('❌ Admin only');
      return;
    }

    let deleted = { cats: 0, chans: 0, roles: 0 };

    try {
      // Delete ALL channels and categories
      const channels = Array.from(guild.channels.cache.values());
      for (const ch of channels) {
        try {
          await ch.delete();
          if (ch.isCategory()) deleted.cats++;
          else deleted.chans++;
        } catch (e) {
          console.error(`Delete failed: ${e.message}`);
        }
      }

      // Delete ALL roles (except @everyone and bot roles)
      const roles = Array.from(guild.roles.cache.values()).filter(r => r.name !== '@everyone' && !r.managed);
      for (const role of roles) {
        try {
          await role.delete();
          deleted.roles++;
        } catch (e) {
          console.error(`Role delete failed: ${e.message}`);
        }
      }

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('✅ Reset Complete')
        .addFields(
          { name: 'Categories', value: String(deleted.cats), inline: true },
          { name: 'Channels', value: String(deleted.chans), inline: true },
          { name: 'Roles', value: String(deleted.roles), inline: true }
        )
        .setFooter({ text: 'Powered by Peksity' });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Reset error:', err);
      await interaction.editReply('❌ Reset error');
    }
  }
};