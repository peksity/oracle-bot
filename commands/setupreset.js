const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

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

    // Delete categories
    const catNames = ['SUPPORT LINE', 'MODERATOR AREA', 'BOT COMMANDS', 'INTRODUCTION', 'GTA VI UPDATES', 'SERVER INFORMATION', 'SERVER SUPPORT', 'INTERACTIONS', 'VOICE CHANNELS', 'LOOKING FOR GROUP (LFG)', 'ACTIVITIES', 'PREMIUM AREA'];
    
    for (const name of catNames) {
      const cat = guild.channels.cache.find(c => c.isCategory && c.name === name);
      if (cat) {
        for (const [, ch] of cat.children.cache) {
          try {
            await ch.delete();
            chans++;
          } catch (e) {}
        }
        try {
          await cat.delete();
          cats++;
        } catch (e) {}
      }
    }

    // Delete roles
    const roleNames = ['Owner', 'Admin', 'Senior Moderator', 'Moderator', 'Server Designer', 'Support Team', 'Server Booster', 'Member', 'RP Legend', 'Overachiever', 'Speed Demon', 'Heist Mastermind', 'Heist Master', 'Bosssman', 'Premium Member'];
    
    for (const name of roleNames) {
      const role = guild.roles.cache.find(r => r.name === name);
      if (role) {
        try {
          await role.delete();
          roles++;
        } catch (e) {}
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('✅ Reset Complete')
      .addFields(
        { name: 'Categories', value: String(cats), inline: true },
        { name: 'Channels', value: String(chans), inline: true },
        { name: 'Roles', value: String(roles), inline: true }
      )
      .setFooter({ text: 'Powered by Peksity' });

    await interaction.editReply({ embeds: [embed] });
  }
};