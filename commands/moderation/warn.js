const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for warning')
        .setRequired(true))
    .setDefaultMemberPermissions(8), // Requires Manage Messages

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      const moderator = interaction.user;
      const guild = interaction.guild;

      // Check if user is trying to warn themselves
      if (targetUser.id === moderator.id) {
        await interaction.reply({
          content: '❌ You cannot warn yourself!',
          ephemeral: true
        });
        return;
      }

      // Check if trying to warn bot
      if (targetUser.bot) {
        await interaction.reply({
          content: '❌ You cannot warn bots!',
          ephemeral: true
        });
        return;
      }

      // Get target member
      let targetMember;
      try {
        targetMember = await guild.members.fetch(targetUser.id);
      } catch {
        await interaction.reply({
          content: '❌ User not found in this server!',
          ephemeral: true
        });
        return;
      }

      // Log warning to database
      console.log(`⚠️  Warning issued to ${targetUser.tag} by ${moderator.tag}: ${reason}`);

      // Create warning embed
      const warnEmbed = new EmbedBuilder()
        .setColor(0xFFAA00)
        .setTitle('⚠️ You have been warned!')
        .setDescription(`You received a warning in **${guild.name}**`)
        .addFields(
          { name: 'Reason', value: reason, inline: false },
          { name: 'Moderator', value: moderator.tag, inline: true },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: true }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      // Try to DM user
      try {
        await targetUser.send({ embeds: [warnEmbed] });
      } catch (error) {
        console.log(`Could not DM ${targetUser.tag}`);
      }

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0xFFAA00)
        .setTitle('⚠️ User Warned')
        .addFields(
          { name: 'User', value: `${targetUser} (${targetUser.id})`, inline: false },
          { name: 'Moderator', value: `${moderator} (${moderator.id})`, inline: false },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: false }
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .setFooter({ text: '⚡ Powered by Peksity' });

      // Log to mod-logs channel
      const modLogsChannel = guild.channels.cache.find(c => c.name === 'mod-logs' || c.name === 'moderation-logs');
      if (modLogsChannel && modLogsChannel.isTextBased()) {
        try {
          await modLogsChannel.send({ embeds: [logEmbed] });
        } catch (error) {
          console.error('Could not post to mod-logs:', error.message);
        }
      }

      // Reply to moderator
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('✅ Warning Issued')
            .addFields(
              { name: 'User', value: targetUser.tag, inline: true },
              { name: 'Reason', value: reason, inline: true }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

    } catch (error) {
      console.error('Error in warn command:', error);
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};