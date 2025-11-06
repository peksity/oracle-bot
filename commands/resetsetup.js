const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetsetup')
    .setDescription('Test'),
  async execute(interaction) {
    await interaction.reply('Works!');
  }
};