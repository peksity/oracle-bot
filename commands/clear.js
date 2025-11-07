const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('🗑️ Delete messages from a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for clearing messages')
        .setRequired(false))
    .setDefaultMemberPermissions(8), // Requires Manage Messages

  async execute(interaction) {
    try {
      const amount = interaction.options.getInteger('amount');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const moderator = interaction.user;
      const guild = interaction.guild;
      const channel = interaction.channel;

      // Defer reply since this might take a moment
      await interaction.deferReply();

      // Fetch messages to delete
      const messages = await channel.messages.fetch({ limit: amount });

      // Delete messages
      const deleted = await channel.bulkDelete(messages, true);

      // Create mod log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('🗑️ Messages Cleared')
        .addFields(
          { name: 'Channel', value: `${channel} (${channel.id})`, inline: false },
          { name: 'Moderator', value: `${moderator} (${moderator.id})`, inline: false },
          { name: 'Messages Deleted', value: `${deleted.size}`, inline: true },
          { name: 'Requested Amount', value: `${amount}`, inline: true },
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
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('✅ Messages Cleared')
            .addFields(
              { name: 'Channel', value: channel.name, inline: true },
              { name: 'Deleted', value: `${deleted.size} messages`, inline: true },
              { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: '⚡ Powered by Peksity' })
        ]
      });

      // Send auto-delete confirmation message
      const confirmEmbed = new EmbedBuilder()
        .setColor(0x00AA00)
        .setDescription(`🗑️ ${deleted.size} messages were cleared by ${moderator}`)
        .setFooter({ text: '⚡ Powered by Peksity' });

      const confirmMessage = await channel.send({ embeds: [confirmEmbed] });
      
      // Delete confirmation after 5 seconds
      setTimeout(() => {
        confirmMessage.delete().catch(() => {});
      }, 5000);

    } catch (error) {
      console.error('Error in clear command:', error);
      await interaction.editReply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};