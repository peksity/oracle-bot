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

    let cats = 0;
    let chans = 0;
    let roles = 0;

    try {
      // Delete ALL channels first (even ones not in categories)
      const allChannels = guild.channels.cache.filter(c => !c.isCategory());
      for (const [, ch] of allChannels) {
        try {
          await ch.delete();
          chans++;
        } catch (e) {
          console.log(`Failed to delete channel: ${e.message}`);
        }
      }

      // Delete ALL categories
      const allCategories = guild.channels.cache.filter(c => c.isCategory());
      for (const [, cat] of allCategories) {
        try {
          await cat.delete();
          cats++;
        } catch (e) {
          console.log(`Failed to delete category: ${e.message}`);
        }
      }

      // Delete ALL roles (except @everyone)
      const allRoles = guild.roles.cache.filter(r => r.name !== '@everyone');
      for (const [, role] of allRoles) {
        try {
          await role.delete();
          roles++;
        } catch (e) {
          console.log(`Failed to delete role: ${e.message}`);
        }
      }

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('✅ Reset Complete')
        .addFields(
          { name: 'Categories Deleted', value: String(cats), inline: true },
          { name: 'Channels Deleted', value: String(chans), inline: true },
          { name: 'Roles Deleted', value: String(roles), inline: true }
        )
        .setFooter({ text: 'Powered by Peksity' });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Reset error:', err);
      await interaction.editReply('❌ Reset error');
    }
  }
};