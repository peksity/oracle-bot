const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up the complete GTA 6 Dominion server structure with categories, channels, and roles'),
  
  async execute(interaction) {
    try {
      // Defer reply immediately (this will take 2-3 minutes)
      await interaction.deferReply();
      
      const guild = interaction.guild;
      
      // ===== STEP 1: Check if already setup =====
      console.log('\n🔍 STEP 1: Checking if server already setup...');
      const setupChannel = guild.channels.cache.find(c => c.name === 'welcome');
      if (setupChannel) {
        console.log('⚠️  Server already has setup channels detected');
        await interaction.editReply({
          content: '❌ This server is already set up! Use `/setup reset` to re-run setup.',
        });
        return;
      }
      console.log('✅ Server is clean, proceeding with setup\n');

      // ===== STEP 2: Verify bot permissions =====
      console.log('🔐 STEP 2: Verifying bot permissions...');
      const botMember = guild.members.me;
      const botPermissions = botMember.permissions;
      const requiredPerms = ['ManageChannels', 'ManageRoles', 'SendMessages', 'ManageMessages'];
      const missingPerms = requiredPerms.filter(perm => !botPermissions.has(perm));
      
      if (missingPerms.length > 0) {
        console.log('❌ Bot missing permissions:', missingPerms);
        await interaction.editReply({
          content: `❌ I'm missing permissions: ${missingPerms.join(', ')}\nPlease give me Administrator role and try again.`
        });
        return;
      }
      console.log('✅ Bot has all required permissions\n');

      await interaction.editReply('⏳ Starting setup... This will take 2-3 minutes. Creating structure now...');

      // ===== STEP 3: Map existing roles by ID =====
      console.log('👥 STEP 3: Mapping existing roles...');
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

      // Verify roles exist
      let missingRoles = [];
      for (const [roleName, roleId] of Object.entries(rolesMap)) {
        const role = guild.roles.cache.get(roleId);
        if (!role) {
          missingRoles.push(`${roleName} (${roleId})`);
          console.warn(`⚠️  Role not found: ${roleName} (${roleId})`);
        }
      }
      if (missingRoles.length > 0) {
        console.log(`⚠️  ${missingRoles.length} roles missing. Permissions may not work correctly.\n`);
      } else {
        console.log('✅ All roles verified\n');
      }

      // ===== STEP 4: Create Premium Member role =====
      console.log('👑 STEP 4: Creating/finding Premium Member role...');
      let premiumRole = guild.roles.cache.find(r => r.name === 'Premium Member');
      
      if (!premiumRole) {
        try {
          premiumRole = await guild.roles.create({
            name: 'Premium Member',
            color: 0xFFD700,
            hoist: true,
            mentionable: true,
            position: 2
          });
          console.log('✅ Premium Member role created\n');
        } catch (error) {
          console.error(`❌ Failed to create Premium Member role: ${error.message}\n`);
        }
      } else {
        console.log('✅ Premium Member role already exists\n');
      }
      
      if (premiumRole) {
        rolesMap.PremiumMember = premiumRole.id;
      }

      // ===== STEP 5: Define server structure =====
      console.log('📐 STEP 5: Defining server structure...');
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
            { name: 'dyno-messages', type: 'text', modsOnly: true },
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
            { name: 'how-to-get-tag', type: 'text', public: true },
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

      const totalChannels = serverStructure.reduce((sum, cat) => sum + cat.channels.length, 0);
      console.log(`✅ Defined 12 categories with ${totalChannels} total channels\n`);

      // ===== STEP 6: Create categories and channels =====
      console.log('📁 STEP 6: Creating categories and channels...\n');
      let createdCategories = 0;
      let createdChannels = 0;

      for (const categoryData of serverStructure) {
        try {
          console.log(`📍 Creating category: ${categoryData.name}`);
          
          // Create category
          const category = await guild.channels.create({
            name: categoryData.name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: [{
              id: guild.id,
              deny: ['ViewChannel']
            }]
          });
          createdCategories++;
          console.log(`   ✅ Category created`);

          // Create channels in this category
          for (const channelData of categoryData.channels) {
            try {
              console.log(`   → Creating ${channelData.type} channel: ${channelData.name}`);
              
              // Create channel
              const channel = await guild.channels.create({
                name: channelData.name,
                type: channelData.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
                parent: category.id,
                topic: `${categoryData.name} - ${channelData.name}`
              });

              // Set permissions based on channel type
              if (channelData.modsOnly) {
                // MOD-ONLY: Hide from everyone except mods/admins
                try {
                  await channel.permissionOverwrites.create(guild.id, {
                    ViewChannel: false
                  });

                  const modsRoles = [
                    { id: rolesMap.Owner, name: 'Owner' },
                    { id: rolesMap.Admin, name: 'Admin' },
                    { id: rolesMap.SeniorModerator, name: 'Senior Moderator' },
                    { id: rolesMap.Moderator, name: 'Moderator' }
                  ];

                  for (const role of modsRoles) {
                    try {
                      await channel.permissionOverwrites.create(role.id, {
                        ViewChannel: true,
                        SendMessages: true,
                        ManageMessages: true
                      });
                    } catch (err) {
                      console.warn(`      ⚠️  Could not set ${role.name} permissions: ${err.message}`);
                    }
                  }
                } catch (err) {
                  console.error(`      ❌ Error setting mod-only permissions: ${err.message}`);
                }
              } else if (channelData.premiumOnly) {
                // PREMIUM-ONLY: Hide except premium members and mods
                try {
                  await channel.permissionOverwrites.create(guild.id, {
                    ViewChannel: false
                  });

                  const premiumRoles = [
                    { id: rolesMap.Owner, name: 'Owner' },
                    { id: rolesMap.Admin, name: 'Admin' },
                    { id: rolesMap.Moderator, name: 'Moderator' },
                    { id: rolesMap.PremiumMember, name: 'Premium Member' }
                  ];

                  for (const role of premiumRoles) {
                    try {
                      await channel.permissionOverwrites.create(role.id, {
                        ViewChannel: true,
                        SendMessages: true
                      });
                    } catch (err) {
                      console.warn(`      ⚠️  Could not set ${role.name} permissions: ${err.message}`);
                    }
                  }
                } catch (err) {
                  console.error(`      ❌ Error setting premium permissions: ${err.message}`);
                }
              } else if (channelData.public) {
                // PUBLIC: Everyone can see
                try {
                  await channel.permissionOverwrites.create(guild.id, {
                    ViewChannel: true,
                    SendMessages: true
                  });
                } catch (err) {
                  console.error(`      ❌ Error setting public permissions: ${err.message}`);
                }
              }

              // Always allow bot
              try {
                await channel.permissionOverwrites.create(guild.me.id, {
                  ViewChannel: true,
                  SendMessages: true,
                  ManageMessages: true
                });
              } catch (err) {
                console.warn(`      ⚠️  Could not set bot permissions: ${err.message}`);
              }

              createdChannels++;
              console.log(`      ✅ Channel created (${createdChannels}/${totalChannels})`);

            } catch (error) {
              console.error(`   ❌ Failed to create channel ${channelData.name}: ${error.message}`);
            }
          }

          console.log('');

        } catch (error) {
          console.error(`❌ Failed to create category ${categoryData.name}: ${error.message}\n`);
          if (error.code === 50013) {
            await interaction.editReply({
              content: '❌ I don\'t have permission to create channels. Please give me Administrator role.'
            });
            return;
          }
        }
      }

      // ===== STEP 7: Create and post embeds =====
      console.log('📝 STEP 7: Creating and posting embeds...');

      // Welcome embed
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🎉 Welcome to GTA 6 Dominion!')
        .setDescription('Hello @everyone, Make sure to checkout #rules before heading into the chatting section.')
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
          { name: '🎨 Custom Role Name and Color', value: 'Submit a ticket to request Your Custom Role Name and Specify Color', inline: false },
          { name: '😊 Custom Emojis', value: 'Access to our exclusive custom emojis', inline: false },
          { name: '✨ Custom Stickers', value: 'Access to our exclusive custom stickers', inline: false },
          { name: '🖼️ Image Perk', value: 'You will be able to send images in #chat', inline: false },
          { name: '📊 All Level Perks', value: 'Access to all the level perks without reaching certain level', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity | Thank you for boosting!' });

      // Post embeds to channels
      try {
        const welcomeChannel = guild.channels.cache.find(c => c.name === 'welcome');
        const rulesChannel = guild.channels.cache.find(c => c.name === 'rules');
        const perksChannel = guild.channels.cache.find(c => c.name === 'perks-and-rewards');

        if (welcomeChannel) {
          await welcomeChannel.send({ embeds: [welcomeEmbed] });
          console.log('   ✅ Welcome embed posted');
        }
        if (rulesChannel) {
          await rulesChannel.send({ embeds: [rulesEmbed] });
          console.log('   ✅ Rules embed posted');
        }
        if (perksChannel) {
          await perksChannel.send({ embeds: [levelRewardsEmbed] });
          await perksChannel.send({ embeds: [boostingPerksEmbed] });
          console.log('   ✅ Perks embeds posted');
        }
      } catch (error) {
        console.error(`❌ Error posting embeds: ${error.message}`);
      }

      // ===== STEP 8: Final summary and completion =====
      console.log('\n🎉 SETUP COMPLETE!\n');
      console.log(`📊 FINAL SUMMARY:`);
      console.log(`   ✅ Categories created: ${createdCategories}/12`);
      console.log(`   ✅ Channels created: ${createdChannels}/${totalChannels}`);
      console.log(`   ✅ Premium Member role: ${premiumRole ? 'Created' : 'Not created'}`);
      console.log(`   ✅ Embeds posted: 3`);
      console.log(`   ⚠️  Missing roles: ${missingRoles.length}`);
      console.log('');

      const completionEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Setup Complete!')
        .setDescription('Your GTA 6 Dominion server is now fully configured.')
        .addFields(
          { name: '📁 Categories Created', value: `${createdCategories}/12`, inline: true },
          { name: '📝 Channels Created', value: `${createdChannels}/${totalChannels}`, inline: true },
          { name: '👥 Roles', value: 'Premium Member + 14 existing roles', inline: true },
          { name: '📋 Embeds Posted', value: '3 embeds to key channels', inline: false }
        )
        .setFooter({ text: '⚡ Powered by Peksity' })
        .setTimestamp();

      await interaction.editReply({ embeds: [completionEmbed] });

    } catch (error) {
      console.error('❌ SETUP FAILED:', error);
      await interaction.editReply({
        content: `❌ An error occurred during setup: ${error.message}`
      }).catch(() => {});
    }
  }
};