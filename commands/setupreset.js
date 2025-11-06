const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('Reset all setup'),
  
  async execute(interaction) {
    await interaction.reply('Test works');
  }
};