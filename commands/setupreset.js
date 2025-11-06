const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupreset')
    .setDescription('Test'),
  
  async execute(interaction) {
    await interaction.reply('Test works');
  }
};