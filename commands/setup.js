const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up the complete server structure'),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const guild = interaction.guild;
      
      // Check permissions
      const botPermissions = guild.members.me.permissions;
      const requiredPerms = ['ManageChannels', 'ManageRoles', 'SendMessages'];
      const missingPerms = requiredPerms.filter(perm => !botPermissions.has(perm));
      
      if (missingPerms.length > 0) {
        await interaction.editReply(`❌ Missing permissions: ${missingPerms.join(', ')}`);
        return;
      }

      await interaction.editReply('⏳ Starting setup (2-3 minutes)...');

      console.log('🔧 Starting setup...');

      // CREATE ROLES (not look for existing ones!)
      console.log('👑 Creating roles...');
      const rolesMap = {};
      const roleData = [
        { name: 'Owner', color: 0xFF0000 },
        { name: 'Admin', color: 0xFF6B00 },
        { name: 'Senior Moderator', color: 0xFFA500 },
        { name: 'Moderator', color: 0xFFD700 },
        { name: 'Server Designer', color: 0x00FF00 },
        { name: 'Support Team', color: 0x00FFFF },
        { name: 'Server Booster', color: 0xFF00FF },
        { name: 'Member', color: 0x808080 },
        { name: 'RP Legend', color: 0x4B0082 },
        { name: 'Overachiever', color: 0x9932CC },
        { name: 'Speed Demon', color: 0xFF1493 },
        { name: 'Heist Mastermind', color: 0x00CED1 },
        { name: 'Heist Master', color: 0x20B2AA },
        { name: 'Bosssman', color: 0xDC143C },
        { name: 'Premium Member', color: 0xFFD700 }
      ];

      let rolesCreated = 0;
      for (const role of roleData) {
        try {
          const newRole = await guild.roles.create({
            name: role.name,
            color: role.color,
            hoist: true,
            mentionable: true
          });
          rolesMap[role.name] = newRole.id;
          rolesCreated++;
        } catch (e) {
          console.error(`Failed to create role ${role.name}: ${e.message}`);
        }
      }
      console.log(`✅ Created ${rolesCreated} roles`);

      // SERVER STRUCTURE
      const serverStructure = [
        {
          name: 'SUPPORT LINE',
          channels: [
            { name: 'modmail-log', type: 'text', modsOnly: true }
          ]
        },
        {
          name: 'MODERATOR AREA',
          channels: [
            { name: 'moderation-logs', type: 'text', modsOnly: true },
            { name: 'unban-unmute-form', type: 'text', modsOnly: true },
            { name: 'staff-guide', type: 'text', modsOnly: true },
            { name: 'staff-chat', type: 'text', modsOnly: true },
            { name: 'executive-commands', type: 'text', modsOnly: true },
            { name: 'reports-complaints', type: 'text', modsOnly: true },
            { name: 'mod-faq', type: 'text', modsOnly: true }
          ]
        },
        {
          name: 'BOT COMMANDS',
          channels: [
            { name: 'mod-command', type: 'text', modsOnly: true },
            { name: 'ban-unban-logs', type: 'text', modsOnly: true },
            { name: 'join-logs', type: 'text', modsOnly: true },
            { name: 'leave-logs', type: 'text', modsOnly: true },
            { name: 'role-assign', type: 'text', modsOnly: true },
            { name: 'deleted-logs', type: 'text', modsOnly: true },
            { name: 'muted-unmute-log', type: 'text', modsOnly: true },
            { name: 'kicked-logs', type: 'text', modsOnly: true },
            { name: 'edit-logs', type: 'text', modsOnly: true },
            { name: 'automod-logs', type: 'text', modsOnly: true },
            { name: 'vc-logs', type: 'text', modsOnly: true },
            { name: 'name-change', type: 'text', modsOnly: true }
          ]
        },
        {
          name: 'INTRODUCTION',
          channels: [
            { name: 'welcome', type: 'text', public: true }
          ]
        },
        {
          name: 'GTA VI UPDATES',
          channels: [
            { name: 'official-news', type: 'text', public: true },
            { name: 'rockstar-updates', type: 'text', public: true },
            { name: 'leaks-and-rumors', type: 'text', public: true }
          ]
        },
        {
          name: 'SERVER INFORMATION',
          channels: [
            { name: 'rules', type: 'text', public: true },
            { name: 'announcements', type: 'text', public: true },
            { name: 'perks-and-rewards', type: 'text', public: true },
            { name: 'server-rank', type: 'text', public: true },
            { name: 'boosts', type: 'text', public: true }
          ]
        },
        {
          name: 'SERVER SUPPORT',
          channels: [
            { name: 'tickets', type: 'text', public: true },
            { name: 'tickets-transcripts', type: 'text', modsOnly: true }
          ]
        },
        {
          name: 'INTERACTIONS',
          channels: [
            { name: 'chat', type: 'text', public: true },
            { name: 'gta-online', type: 'text', public: true },
            { name: 'gta6-discussion', type: 'text', public: true },
            { name: 'gallery', type: 'text', public: true },
            { name: 'memes', type: 'text', public: true }
          ]
        },
        {
          name: 'VOICE CHANNELS',
          channels: [
            { name: 'Staff VC', type: 'voice', modsOnly: true },
            { name: 'Voice Channel 1', type: 'voice', public: true },
            { name: 'Voice Channel 2', type: 'voice', public: true },
            { name: 'Voice Channel 3', type: 'voice', public: true },
            { name: 'AFK', type: 'voice', public: true }
          ]
        },
        {
          name: 'LOOKING FOR GROUP (LFG)',
          channels: []
        },
        {
          name: 'ACTIVITIES',
          channels: []
        },
        {
          name: 'PREMIUM AREA',
          channels: [
            { name: 'premium-commands', type: 'text', premiumOnly: true },
            { name: 'premium-chat', type: 'text', premiumOnly: true },
            { name: 'premium-faq', type: 'text', premiumOnly: true }
          ]
        }
      ];

      // CREATE CATEGORIES AND CHANNELS
      console.log('📁 Creating categories and channels...');
      let createdCats = 0;
      let createdChans = 0;

      for (const catData of serverStructure) {
        try {
          const category = await guild.channels.create({
            name: catData.name,
            type: ChannelType.GuildCategory
          });
          createdCats++;

          for (const chanData of catData.channels) {
            try {
              const permissions = [];

              if (chanData.modsOnly) {
                const modRole = guild.roles.cache.find(r => r.name === 'Moderator');
                if (modRole) {
                  permissions.push({
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                  });
                  permissions.push({
                    id: modRole.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                  });
                }
              }

              await guild.channels.create({
                name: chanData.name,
                type: chanData.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: permissions
              });
              createdChans++;
            } catch (e) {
              console.error(`Failed to create channel ${chanData.name}: ${e.message}`);
            }
          }
        } catch (e) {
          console.error(`Failed to create category ${catData.name}: ${e.message}`);
        }
      }

      console.log(`✅ Created ${createdCats} categories, ${createdChans} channels`);

      // POST WELCOME EMBEDS
      const welcomeChannel = guild.channels.cache.find(c => c.name === 'welcome');
      if (welcomeChannel) {
        const welcomeEmbed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle('🎉 Welcome to the Server!')
          .setDescription('This is your brand new GTA 6 Dominion server, fully configured and ready to go!')
          .setFooter({ text: '⚡ Powered by Peksity' });

        await welcomeChannel.send({ embeds: [welcomeEmbed] });
      }

      // FINAL EMBED
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Setup Complete!')
        .setDescription('Your server is now fully configured.')
        .addFields(
          { name: '👑 Roles Created', value: String(rolesCreated), inline: true },
          { name: '📁 Categories', value: String(createdCats), inline: true },
          { name: '📝 Channels', value: String(createdChans), inline: true },
          { name: '🚀 Status', value: 'Ready to use!', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      await interaction.editReply({ embeds: [embed] });
      console.log('🎉 Setup complete!');

    } catch (error) {
      console.error('Setup error:', error);
      await interaction.editReply(`❌ Error: ${error.message}`);
    }
  }
};