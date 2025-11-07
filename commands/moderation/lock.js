const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('🔒 Lock a channel (mods only)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to lock (defaults to current)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for locking')
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
          content: '❌ Can only lock text channels!',
          ephemeral: true
        });
        return;
      }

      // Lock the channel by removing send message permission from @everyone
      try {
        await targetChannel.permissionOverwrites.edit(guild.id, {
          SendMessages: false
        });
      } catch (error) {
        await interaction.reply({
          content: `❌ Failed to lock channel: ${error.message}`,
          ephemeral: true
        });
        return;
      }

      // Create lock message embed
      const lockEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('🔒 Channel Locked')
        .setDescription(`This channel has been locked by **${moderator.tag}**`)
        .addFields(
          { name: 'Reason', value: reason, inline: false },
          { name: 'Locked At', value: new Date().toLocaleString(), inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      // Send lock notification to channel
      await targetChannel.send({ embeds: [lockEmbed] });

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('🔒 Channel Locked')
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
            .setTitle('✅ Channel Locked')
            .addFields(
              { name: 'Channel', value: targetChannel.name, inline: true },
              { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

    } catch (error) {
      console.error('Error in lock command:', error);
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};