const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('Reset all setup'),
  
  async execute(interaction) {
    await interaction.reply('🚨 Resetting... (running in background)');
    
    const guild = interaction.guild;
    if (!interaction.member.permissions.has('Administrator')) return;

    // Delete everything in background (don't wait)
    guild.channels.cache.forEach(ch => ch.delete().catch(() => {}));
    guild.roles.cache.filter(r => r.name !== '@everyone').forEach(r => r.delete().catch(() => {}));
  }
};