const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for kick')
        .setRequired(true))
    .setDefaultMemberPermissions(2), // Requires Kick Members

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      const moderator = interaction.user;
      const guild = interaction.guild;

      // Check if user is trying to kick themselves
      if (targetUser.id === moderator.id) {
        await interaction.reply({
          content: '❌ You cannot kick yourself!',
          ephemeral: true
        });
        return;
      }

      // Check if trying to kick bot
      if (targetUser.bot) {
        await interaction.reply({
          content: '❌ You cannot kick bots!',
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
          content: '❌ You cannot kick someone with equal or higher role!',
          ephemeral: true
        });
        return;
      }

      // Send DM before kick
      const kickEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('You have been kicked!')
        .setDescription(`You were kicked from **${guild.name}**`)
        .addFields(
          { name: 'Reason', value: reason, inline: false },
          { name: 'Moderator', value: moderator.tag, inline: true },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: true }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      try {
        await targetUser.send({ embeds: [kickEmbed] });
      } catch (error) {
        console.log(`Could not DM ${targetUser.tag}`);
      }

      // Kick user
      await targetMember.kick(reason);

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('👢 User Kicked')
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
            .setTitle('✅ User Kicked')
            .addFields(
              { name: 'User', value: targetUser.tag, inline: true },
              { name: 'Reason', value: reason, inline: true }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

    } catch (error) {
      console.error('Error in kick command:', error);
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};