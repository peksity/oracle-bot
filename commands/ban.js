const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🔨 Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for ban')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('deletedays')
        .setDescription('Days of messages to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7))
    .setDefaultMemberPermissions(4), // Requires Ban Members

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      const deleteDays = interaction.options.getInteger('deletedays') || 7;
      const moderator = interaction.user;
      const guild = interaction.guild;

      // Check if user is trying to ban themselves
      if (targetUser.id === moderator.id) {
        await interaction.reply({
          content: '❌ You cannot ban yourself!',
          ephemeral: true
        });
        return;
      }

      // Check if trying to ban bot
      if (targetUser.bot) {
        await interaction.reply({
          content: '❌ You cannot ban bots!',
          ephemeral: true
        });
        return;
      }

      // Get target member (if exists)
      let targetMember = null;
      try {
        targetMember = await guild.members.fetch(targetUser.id);
      } catch {
        // User might not be in server, that's okay
      }

      // Check if moderator has higher role (if member exists)
      if (targetMember) {
        if (targetMember.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) {
          await interaction.reply({
            content: '❌ You cannot ban someone with equal or higher role!',
            ephemeral: true
          });
          return;
        }
      }

      // Send DM before ban
      const banEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('You have been banned!')
        .setDescription(`You were banned from **${guild.name}**`)
        .addFields(
          { name: 'Reason', value: reason, inline: false },
          { name: 'Moderator', value: moderator.tag, inline: true },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: true }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      try {
        await targetUser.send({ embeds: [banEmbed] });
      } catch (error) {
        console.log(`Could not DM ${targetUser.tag}`);
      }

      // Ban user
      await guild.bans.create(targetUser.id, {
        reason: reason,
        deleteMessageSeconds: deleteDays * 24 * 60 * 60
      });

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🔨 User Banned')
        .addFields(
          { name: 'User', value: `${targetUser} (${targetUser.id})`, inline: false },
          { name: 'Moderator', value: `${moderator} (${moderator.id})`, inline: false },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Messages Deleted', value: `${deleteDays} days`, inline: true },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: true }
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
            .setTitle('✅ User Banned')
            .addFields(
              { name: 'User', value: targetUser.tag, inline: true },
              { name: 'Reason', value: reason, inline: true },
              { name: 'Messages Deleted', value: `${deleteDays} days`, inline: true }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

    } catch (error) {
      console.error('Error in ban command:', error);
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};