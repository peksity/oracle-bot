/**
 * ═══════════════════════════════════════════════════════════════
 * SETUP COMMAND - Initialize server channels, roles, and permissions
 * ═══════════════════════════════════════════════════════════════
 */

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initialize ORACLE on your server (Server Owner Only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Check if user is server owner
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: '❌ Only the server owner can use this command!',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: false });

    try {
      // Step 1: Create categories
      const infoCategory = await interaction.guild.channels.create({
        name: '📋 Server Info',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
            deny: [PermissionFlagsBits.SendMessages]
          }
        ]
      });

      const mainCategory = await interaction.guild.channels.create({
        name: '💬 Main',
        type: ChannelType.GuildCategory
      });

      const modCategory = await interaction.guild.channels.create({
        name: '🔨 Moderation',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          }
        ]
      });

      // Step 2: Create roles
      const memberRole = await interaction.guild.roles.create({
        name: 'Member',
        color: 0x0099ff,
        hoist: false
      });

      const moderatorRole = await interaction.guild.roles.create({
        name: 'Moderator',
        color: 0xff8800,
        hoist: true
      });

      const adminRole = await interaction.guild.roles.create({
        name: 'Admin',
        color: 0xff0000,
        hoist: true
      });

      const verifiedRole = await interaction.guild.roles.create({
        name: 'Verified',
        color: 0x00ff00,
        hoist: false
      });

      // Step 3: Create channels in categories

      // Info category channels
      const welcomeChannel = await interaction.guild.channels.create({
        name: 'welcome',
        type: ChannelType.GuildText,
        parent: infoCategory.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
            deny: [PermissionFlagsBits.SendMessages]
          },
          {
            id: interaction.client.user.id,
            allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages]
          }
        ]
      });

      const rulesChannel = await interaction.guild.channels.create({
        name: 'rules',
        type: ChannelType.GuildText,
        parent: infoCategory.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
            deny: [PermissionFlagsBits.SendMessages]
          }
        ]
      });

      // Main category channels
      const generalChannel = await interaction.guild.channels.create({
        name: 'general',
        type: ChannelType.GuildText,
        parent: mainCategory.id
      });

      const announcementsChannel = await interaction.guild.channels.create({
        name: 'announcements',
        type: ChannelType.GuildText,
        parent: mainCategory.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.SendMessages]
          }
        ]
      });

      // Moderation category channels
      const modLogsChannel = await interaction.guild.channels.create({
        name: 'mod-logs',
        type: ChannelType.GuildText,
        parent: modCategory.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: moderatorRole.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
          },
          {
            id: adminRole.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
          }
        ]
      });

      const ticketingChannel = await interaction.guild.channels.create({
        name: 'ticketing',
        type: ChannelType.GuildText,
        parent: modCategory.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: moderatorRole.id,
            allow: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: adminRole.id,
            allow: [PermissionFlagsBits.ViewChannel]
          }
        ]
      });

      // Step 4: Send setup complete embed
      const successEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ ORACLE Setup Complete!')
        .setDescription('Your server is now configured with ORACLE')
        .addFields(
          {
            name: '📋 Categories Created',
            value: `• Server Info\n• Main\n• Moderation`,
            inline: true
          },
          {
            name: '💬 Channels Created',
            value: `• welcome\n• rules\n• general\n• announcements\n• mod-logs\n• ticketing`,
            inline: true
          },
          {
            name: '👥 Roles Created',
            value: `• Member (Blue)\n• Moderator (Orange)\n• Admin (Red)\n• Verified (Green)`,
            inline: true
          },
          {
            name: '⚡ Next Steps',
            value: '1. Assign roles to members\n2. Configure permissions as needed\n3. Try other commands!',
            inline: false
          }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      await interaction.editReply({
        embeds: [successEmbed]
      });

      console.log(`✅ Setup completed for server: ${interaction.guild.name} (${interaction.guild.id})`);

    } catch (error) {
      console.error('❌ Setup command error:', error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('❌ Setup Failed')
        .setDescription('An error occurred during setup. Check console for details.')
        .setFooter({ text: '⚡ Powered by Peksity' });

      await interaction.editReply({
        embeds: [errorEmbed]
      });
    }
  }
};