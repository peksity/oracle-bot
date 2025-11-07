const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🔓 Unlock a channel (mods only)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to unlock (defaults to current)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unlocking')
        .setRequired(false))
    .setDefaultMemberPermissions(8), // Requires Manage Messages

  async execute(interaction) {
    try {
      const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const moderator = interaction.user;
      const guild = interaction.guild;

      // Check if channel is text-based
      if (!targetChannel.isTextBased()) {
        await interaction.reply({
          content: '❌ Can only unlock text channels!',
          ephemeral: true
        });
        return;
      }

      // Unlock the channel by restoring send message permission to @everyone
      try {
        await targetChannel.permissionOverwrites.edit(guild.id, {
          SendMessages: null // Restore to default
        });
      } catch (error) {
        await interaction.reply({
          content: `❌ Failed to unlock channel: ${error.message}`,
          ephemeral: true
        });
        return;
      }

      // Create unlock message embed
      const unlockEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🔓 Channel Unlocked')
        .setDescription(`This channel has been unlocked by **${moderator.tag}**`)
        .addFields(
          { name: 'Reason', value: reason, inline: false },
          { name: 'Unlocked At', value: new Date().toLocaleString(), inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      // Send unlock notification to channel
      await targetChannel.send({ embeds: [unlockEmbed] });

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🔓 Channel Unlocked')
        .addFields(
          { name: 'Channel', value: `${targetChannel} (${targetChannel.id})`, inline: false },
          { name: 'Moderator', value: `${moderator} (${moderator.id})`, inline: false },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Timestamp', value: new Date().toLocaleString(), inline: false }
        )
        .setThumbnail(moderator.displayAvatarURL())
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
            .setTitle('✅ Channel Unlocked')
            .addFields(
              { name: 'Channel', value: targetChannel.name, inline: true },
              { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

    } catch (error) {
      console.error('Error in unlock command:', error);
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};