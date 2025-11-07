const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up the complete GTA 6 Dominion server structure with categories, channels, and roles'),
  
  async execute(interaction) {
    // Defer reply (this will take 2-3 minutes)
    await interaction.deferReply({ ephemeral: false });

    try {
      const guild = interaction.guild;
      
      // Step 1: Check if already setup
      console.log('🔍 Checking if server already setup...');
      const setupChannel = guild.channels.cache.find(c => c.name === 'welcome');
      if (setupChannel) {
        await interaction.editReply({
          content: '❌ This server is already set up! Use `/setup reset` to re-run setup.',
          ephemeral: true
        });
        return;
      }

      // Step 2: Verify bot permissions
      const botPermissions = guild.members.me.permissions;
      const requiredPerms = ['ManageChannels', 'ManageRoles', 'SendMessages', 'ManageMessages'];
      const missingPerms = requiredPerms.filter(perm => !botPermissions.has(perm));
      
      if (missingPerms.length > 0) {
        await interaction.editReply({
          content: `❌ I'm missing permissions: ${missingPerms.join(', ')}\nPlease give me Administrator role and try again.`
        });
        return;
      }

      await interaction.editReply('⏳ Starting server setup... This will take 2-3 minutes. Please be patient!');

      // Step 3: Map existing roles by ID
      const rolesMap = {
        Owner: '1371000779732684841',
        Admin: '1371094117676875826',
        SeniorModerator: '1371094789281550357',
        Moderator: '1371094153848426577',
        ServerDesigner: '1371877712377020586',
        SupportTeam: '1371094051134373898',
        ServerBooster: '1370886448819081249',
        Member: '1371093637055643669',
        RPLegend: '1371093923887583332',
        Overachiever: '1373296746788032665',
        SpeedDemon: '1371093887963365416',
        HeistMastermind: '1371095307642736650',
        HeistMaster: '1371093811043897426',
        Bosssman: '1371093687211397222',
      };

      // Step 4: Get or create Premium Member role
      console.log('👑 Creating Premium Member role...');
      let premiumRole = guild.roles.cache.find(r => r.name === 'Premium Member');
      
      if (!premiumRole) {
        premiumRole = await guild.roles.create({
          name: 'Premium Member',
          color: 0xFFD700,
          hoist: true,
          mentionable: true,
          position: 2
        });
        console.log('✅ Premium Member role created');
      }
      rolesMap.PremiumMember = premiumRole.id;

      // Step 5: Category and channel structure
      const serverStructure = [
        {
          name: 'SUPPORT LINE',
          icon: '📧',
          channels: [
            { name: 'modmail-log', type: 'text', modsOnly: true }
          ]
        },
        {
          name: 'MODERATOR AREA',
          icon: '🛡️',
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
          icon: '🤖',
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
          icon: '👋',
          channels: [
            { name: 'welcome', type: 'text', public: true }
          ]
        },
        {
          name: 'GTA VI UPDATES',
          icon: '📰',
          channels: [
            { name: 'official-news', type: 'text', public: true },
            { name: 'rockstar-updates', type: 'text', public: true },
            { name: 'leaks-and-rumors', type: 'text', public: true }
          ]
        },
        {
          name: 'SERVER INFORMATION',
          icon: '📋',
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
          icon: '🎫',
          channels: [
            { name: 'tickets', type: 'text', public: true },
            { name: 'tickets-transcripts', type: 'text', modsOnly: true }
          ]
        },
        {
          name: 'INTERACTIONS',
          icon: '💬',
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
          icon: '🎤',
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
          icon: '🔍',
          channels: []
        },
        {
          name: 'ACTIVITIES',
          icon: '🎮',
          channels: []
        },
        {
          name: 'PREMIUM AREA',
          icon: '⭐',
          channels: [
            { name: 'premium-commands', type: 'text', premiumOnly: true },
            { name: 'premium-chat', type: 'text', premiumOnly: true },
            { name: 'premium-faq', type: 'text', premiumOnly: true }
          ]
        }
      ];

      // Step 5: Create categories and channels
      console.log('📁 Creating categories and channels...');
      let totalChannels = 0;
      let createdChannels = 0;

      // Count total for progress
      serverStructure.forEach(cat => {
        totalChannels += cat.channels.length;
      });

      for (const categoryData of serverStructure) {
        try {
          console.log(`\n📍 Starting category: ${categoryData.name}`);
          // Create category
          const category = await guild.channels.create({
            name: categoryData.name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: [{
              id: guild.id,
              deny: ['ViewChannel']
            }]
          });
          console.log(`✅ Category created: ${categoryData.name}`);

          // Create channels in category
          for (const channelData of categoryData.channels) {
            try {
              console.log(`  → Creating channel: ${channelData.name}...`);
              const channel = await guild.channels.create({
                name: `${channelData.type === 'voice' ? '🔊' : ''} ${channelData.name}`,
                type: channelData.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
                parent: category.id,
                topic: `${categoryData.name} - ${channelData.name}`
              });

              // Set permissions
              console.log(`  → Setting permissions for ${channelData.name}...`);
              if (channelData.modsOnly) {
                // Mods only - hide from everyone
                try {
                  await channel.permissionOverwrites.create(guild.id, {
                    ViewChannel: false
                  });

                  // Allow mods/admins
                  const rolesToAllow = [
                    { id: rolesMap.Admin, name: 'Admin' },
                    { id: rolesMap.Moderator, name: 'Moderator' },
                    { id: rolesMap.SeniorModerator, name: 'Senior Moderator' },
                    { id: rolesMap.Owner, name: 'Owner' }
                  ];

                  for (const role of rolesToAllow) {
                    try {
                      await channel.permissionOverwrites.create(role.id, {
                        ViewChannel: true,
                        SendMessages: true,
                        ManageMessages: true
                      });
                    } catch (error) {
                      console.warn(`    ⚠️  Could not set permissions for ${role.name} (${role.id}): ${error.message}`);
                    }
                  }
                } catch (error) {
                  console.error(`    ❌ Error setting mod-only permissions: ${error.message}`);
                }
              } else if (channelData.premiumOnly) {
                // Premium only - hide from regular members
                try {
                  await channel.permissionOverwrites.create(guild.id, {
                    ViewChannel: false
                  });

                  // Allow premium members and mods
                  const rolesToAllow = [
                    { id: rolesMap.PremiumMember, name: 'Premium Member' },
                    { id: rolesMap.Admin, name: 'Admin' },
                    { id: rolesMap.Moderator, name: 'Moderator' },
                    { id: rolesMap.Owner, name: 'Owner' }
                  ];

                  for (const role of rolesToAllow) {
                    try {
                      await channel.permissionOverwrites.create(role.id, {
                        ViewChannel: true,
                        SendMessages: true
                      });
                    } catch (error) {
                      console.warn(`    ⚠️  Could not set permissions for ${role.name} (${role.id}): ${error.message}`);
                    }
                  }
                } catch (error) {
                  console.error(`    ❌ Error setting premium-only permissions: ${error.message}`);
                }
              } else if (channelData.public) {
                // Public channels - visible to everyone
                await channel.permissionOverwrites.create(guild.id, {
                  ViewChannel: true
                });
              }

              // Allow bot to see all channels
              await channel.permissionOverwrites.create(guild.me.id, {
                ViewChannel: true,
                SendMessages: true,
                ManageMessages: true
              });

              createdChannels++;
              console.log(`  ✅ Channel created: ${channelData.name} (${createdChannels}/${totalChannels})`);

            } catch (error) {
              console.error(`  ❌ Error creating channel ${channelData.name}: ${error.message}`);
              console.error(`     Error code: ${error.code}`);
            }
          }

        } catch (error) {
          console.error(`❌ Error creating category ${categoryData.name}: ${error.message}`);
          console.error(`   Error code: ${error.code}`);
          if (error.code === 50013) {
            await interaction.followUp({
              content: '❌ I don\'t have permission to create channels. Please give me Administrator role.',
              ephemeral: true
            });
            return;
          }
        }
      }

      console.log(`\n📊 CATEGORY/CHANNEL CREATION SUMMARY:\n` +
                  `   Total channels created: ${createdChannels}/${totalChannels}\n` +
                  `   Total categories requested: 12`);

      // Step 6: Create and post embeds
      console.log('📝 Creating and posting embeds...');

      // Welcome embed
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🎉 Welcome to GTA 6 Dominion!')
        .setDescription('Hello @everyone, Make sure to checkout <#rules> before heading into the chatting section.')
        .setThumbnail('https://media.discordapp.net/attachments/1234567890/image.png') // Replace with actual image
        .setFooter({ text: '⚡ Powered by Peksity' })
        .setTimestamp();

      // Rules embed
      const rulesEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('📋 Server Rules')
        .setDescription('Read and follow these rules or face consequences')
        .addFields(
          { name: '1️⃣ Be Respectful', value: 'Treat all members with respect. No hate speech or discrimination.', inline: false },
          { name: '2️⃣ No Spam', value: 'No excessive messages, @mentions, or advertisements.', inline: false },
          { name: '3️⃣ Stay On Topic', value: 'Keep discussions relevant to GTA 6 and gaming.', inline: false },
          { name: '4️⃣ No NSFW Content', value: 'No explicit images, videos, or inappropriate content.', inline: false },
          { name: '5️⃣ Follow Discord ToS', value: 'Respect Discord\'s Terms of Service and Community Guidelines.', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' });

      // Level Rewards embed
      const levelRewardsEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🏆 LEVEL UP REWARDS')
        .setDescription('Unlock exclusive perks as you level up!')
        .addFields(
          { name: '🔥 @Bosssman - Level 10', value: 'Access to send Images/Videos in #gallery and #memes', inline: false },
          { name: '👑 @Heist Master - Level 20', value: 'Access to send GIF in Text Channels and set Voice Channels Status', inline: false },
          { name: '⚡ @Heist Mastermind - Level 35', value: 'Access to Reactions', inline: false },
          { name: '🚀 @Speed Demon - Level 70', value: 'Unique Overachiever role and access to Create Polls in #chat', inline: false },
          { name: '👸 @RP Legend - Level 100', value: 'Hoisted on the Sidebar with unique Golden Role Style', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity | Keep chatting to unlock!' });

      // Boosting Perks embed
      const boostingPerksEmbed = new EmbedBuilder()
        .setColor(0xA020F0)
        .setTitle('🎁 Server Boosting Perks')
        .setDescription('Boosting the server will unlock all the perks available to our HIGHEST-TIER members.')
        .addFields(
          { name: '🎨 Custom Role Name and Color', value: 'Submit a ticket to request Your Custom Role Name and {Specify Color}', inline: false },
          { name: '😊 Custom Emojis', value: 'Access to our exclusive custom emojis', inline: false },
          { name: '✨ Custom Stickers', value: 'Access to our exclusive custom stickers', inline: false },
          { name: '🖼️ Image Perk', value: 'You will be able to send only images in #chat', inline: false },
          { name: '📊 All Level Perks', value: 'Access to all the level perks without reaching certain level', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity | Thank you for boosting!' });

      // Post embeds to channels
      try {
        const welcomeChannel = guild.channels.cache.find(c => c.name === 'welcome');
        const rulesChannel = guild.channels.cache.find(c => c.name === 'rules');
        const perksChannel = guild.channels.cache.find(c => c.name === 'perks-and-rewards');

        if (welcomeChannel) await welcomeChannel.send({ embeds: [welcomeEmbed] });
        if (rulesChannel) await rulesChannel.send({ embeds: [rulesEmbed] });
        if (perksChannel) {
          await perksChannel.send({ embeds: [levelRewardsEmbed] });
          await perksChannel.send({ embeds: [boostingPerksEmbed] });
        }

        console.log('✅ All embeds posted');
      } catch (error) {
        console.error('❌ Error posting embeds:', error.message);
      }

      // Step 7: Final message
      const completionEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Setup Complete!')
        .setDescription('Your GTA 6 Dominion server is now fully configured.')
        .addFields(
          { name: '📁 Categories Created', value: `${serverStructure.length}`, inline: true },
          { name: '📝 Channels Created', value: `${createdChannels}`, inline: true },
          { name: '👥 Roles Configured', value: '8 + Premium Member', inline: true },
          { name: '📋 Embeds Posted', value: '3 embeds to key channels', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' })
        .setTimestamp();

      await interaction.editReply({ embeds: [completionEmbed] });

      console.log('🎉 Setup completed successfully!');

    } catch (error) {
      console.error('❌ Setup error:', error);
      await interaction.editReply({
        content: `❌ An unexpected error occurred during setup: ${error.message}`,
        ephemeral: true
      });
    }
  }
};