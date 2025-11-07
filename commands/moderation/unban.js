const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('♻️ Unban a previously banned user')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('User ID of the banned user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unbanning')
        .setRequired(true))
    .setDefaultMemberPermissions(4), // Requires Ban Members

  async execute(interaction) {
    try {
      const userId = interaction.options.getString('userid');
      const reason = interaction.options.getString('reason');
      const moderator = interaction.user;
      const guild = interaction.guild;

      // Validate user ID
      if (isNaN(userId)) {
        await interaction.reply({
          content: '❌ Invalid user ID!',
          ephemeral: true
        });
        return;
      }

      // Check if user is actually banned
      let banInfo = null;
      try {
        banInfo = await guild.bans.fetch(userId);
      } catch {
        await interaction.reply({
          content: '❌ This user is not banned!',
          ephemeral: true
        });
        return;
      }

      // Unban user
      try {
        await guild.bans.remove(userId, reason);
      } catch (error) {
        await interaction.reply({
          content: `❌ Failed to unban user: ${error.message}`,
          ephemeral: true
        });
        return;
      }

      // Try to get user info for logging
      let unbannedUser = null;
      try {
        unbannedUser = await interaction.client.users.fetch(userId);
      } catch {
        unbannedUser = { id: userId, tag: 'Unknown User' };
      }

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('♻️ User Unbanned')
        .addFields(
          { name: 'User', value: `${unbannedUser.tag || 'Unknown'} (${userId})`, inline: false },
          { name: 'Moderator', value: `${moderator} (${moderator.id})`, inline: false },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      if (unbannedUser && unbannedUser.displayAvatarURL) {
        logEmbed.setThumbnail(unbannedUser.displayAvatarURL());
      }

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
            .setTitle('✅ User Unbanned')
            .addFields(
              { name: 'User', value: `${unbannedUser.tag || 'Unknown'} (${userId})`, inline: true },
              { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

    } catch (error) {
      console.error('Error in unban command:', error);
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};