const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('⏱️ Timeout a user (prevents messaging)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Duration in minutes (max 40320 = 28 days)')
        .setMinValue(1)
        .setMaxValue(40320)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for timeout')
        .setRequired(true))
    .setDefaultMemberPermissions(8), // Requires Manage Messages

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user');
      const minutes = interaction.options.getInteger('minutes');
      const reason = interaction.options.getString('reason');
      const moderator = interaction.user;
      const guild = interaction.guild;

      // Check if user is trying to timeout themselves
      if (targetUser.id === moderator.id) {
        await interaction.reply({
          content: '❌ You cannot timeout yourself!',
          ephemeral: true
        });
        return;
      }

      // Check if trying to timeout bot
      if (targetUser.bot) {
        await interaction.reply({
          content: '❌ You cannot timeout bots!',
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

      // Check if moderator has higher role
      if (targetMember.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) {
        await interaction.reply({
          content: '❌ You cannot timeout someone with equal or higher role!',
          ephemeral: true
        });
        return;
      }

      // Convert minutes to milliseconds
      const durationMs = minutes * 60 * 1000;

      // Apply timeout
      await targetMember.timeout(durationMs, reason);

      // Convert minutes to readable format
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      let durationStr = '';
      if (hours > 0) durationStr += `${hours}h `;
      if (mins > 0) durationStr += `${mins}m`;

      // Send DM to user
      const timeoutEmbed = new EmbedBuilder()
        .setColor(0xFF9900)
        .setTitle('⏱️ You have been timed out!')
        .setDescription(`You were timed out in **${guild.name}**`)
        .addFields(
          { name: 'Duration', value: durationStr, inline: true },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Moderator', value: moderator.tag, inline: true },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: true }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      try {
        await targetUser.send({ embeds: [timeoutEmbed] });
      } catch (error) {
        console.log(`Could not DM ${targetUser.tag}`);
      }

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0xFF9900)
        .setTitle('⏱️ User Timed Out')
        .addFields(
          { name: 'User', value: `${targetUser} (${targetUser.id})`, inline: false },
          { name: 'Moderator', value: `${moderator} (${moderator.id})`, inline: false },
          { name: 'Duration', value: durationStr, inline: true },
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
            .setTitle('✅ User Timed Out')
            .addFields(
              { name: 'User', value: targetUser.tag, inline: true },
              { name: 'Duration', value: durationStr, inline: true },
              { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

    } catch (error) {
      console.error('Error in timeout command:', error);
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};