import { config } from '@config';
import { buttons, enums } from '@constants';
import type { SelectMenu } from '@interfaces';
import { stripIndent } from 'common-tags';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
  EmbedBuilder,
  GuildExplicitContentFilter,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
  StringSelectMenuBuilder,
  type StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
  time,
} from 'discord.js';

export default {
  data: { customId: 'infoServerMenu' },
  async execute(interaction: StringSelectMenuInteraction) {
    const { guild } = interaction;

    const selectedOption = interaction.values[0];

    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle(guild.name)
      .setDescription(guild.description ?? 'No description has been set.')
      .setThumbnail(guild.iconURL(config.discord.imageUrl))
      .setImage(guild.bannerURL(config.discord.imageUrl))
      .setFooter({ text: `ID: ${guild.id}` });

    const menuSelectMenuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(new StringSelectMenuBuilder()
      .setCustomId('infoServerMenu')
      .setPlaceholder('Choose a Page to Display!')
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('General')
          .setDescription('Information about this Discord Server.')
          .setValue('general')
          .setDefault(selectedOption === 'general'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Notifications')
          .setDescription('Information about the notification settings of this Discord Server.')
          .setValue('notifications')
          .setDefault(selectedOption === 'notifications'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Security')
          .setDescription('Information about the security settings of this Discord Server.')
          .setValue('security')
          .setDefault(selectedOption === 'security'),
      ));

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.deleteMessage);

    if (selectedOption === 'general') {
      const guildMembers = await guild.members.fetch();

      embed.addFields(
        {
          name: 'Preferred Locale',
          value: `${guild.preferredLocale} ${guild.preferredLocale.includes('-')
            ? `:flag_${guild.preferredLocale.split('-').pop().toLowerCase()}:`
            : `:flag_${guild.preferredLocale.toLowerCase()}:`}`,
        },
        {
          name: 'Verified',
          value: guild.verified
            ? 'Yes'
            : 'No',
          inline: true,
        },
        {
          name: 'Partner',
          value: guild.partnered
            ? 'Yes'
            : 'No',
          inline: true,
        },
        {
          name: 'NSFW Level',
          value: enums.guildNsfwLevel[guild.nsfwLevel],
          inline: true,
        },
        {
          name: 'Members',
          value: `${guild.memberCount.toLocaleString()} (${guildMembers.filter((member) => member.user.bot).size.toLocaleString()} Bots )`,
          inline: true,
        },
        {
          name: 'Large',
          value: guild.large
            ? 'Yes'
            : 'No',
          inline: true,
        },
        {
          name: 'Nitro',
          value: `Tier ${guild.premiumTier} (${guild.premiumSubscriptionCount} Boosts)`,
        },
        {
          name: 'Channels',
          value: guild.channels.cache.filter((channel) => {
            channel.type !== ChannelType.GuildCategory &&
            channel.type !== ChannelType.AnnouncementThread &&
            channel.type !== ChannelType.PublicThread &&
            channel.type !== ChannelType.PrivateThread;
          }).size.toLocaleString(),
        },
        {
          name: 'Roles',
          value: guild.roles.cache.size.toLocaleString(),
        },
        {
          name: 'Emojis',
          value: stripIndent`
          ${guild.emojis.cache.filter((emoji) => !emoji.animated).size} Static
          ${guild.emojis.cache.filter((emoji) => emoji.animated).size} Animated
          `,
          inline: true,
        },
        {
          name: 'Stickers',
          value: guild.stickers.cache.size.toLocaleString(),
          inline: true,
        },
        {
          name: 'Owner',
          value: `<@${guild.ownerId}> 👑`,
        },
        {
          name: 'Date Created',
          value: time(guild.createdTimestamp, 'D'),
        },
      );
    }
    else if (selectedOption === 'notifications') {
      embed.addFields(
        {
          name: 'Default Message Notifications',
          value: guild.defaultMessageNotifications
            ? 'Only @mentions'
            : 'All Messages',
        },
        {
          name: 'System Channel',
          value: guild.systemChannel
            ? guild.systemChannel.toString()
            : 'Unset',
        },
      );

      if (guild.systemChannel) {
        embed.addFields(
          {
            name: 'Send a random welcome message when someone joins the server.',
            value: guild.systemChannelFlags.has(GuildSystemChannelFlags.SuppressJoinNotifications)
              ? 'No'
              : 'Yes',
            inline: true,
          },
          {
            name: 'Prompt members to reply to welcome messages with a sticker.',
            value: guild.systemChannelFlags.has(GuildSystemChannelFlags.SuppressJoinNotificationReplies)
              ? 'No'
              : 'Yes',
            inline: true,
          },
          {
            name: 'Send a message when someone boosts this server.',
            value: guild.systemChannelFlags.has(GuildSystemChannelFlags.SuppressPremiumSubscriptions)
              ? 'No'
              : 'Yes',
            inline: true,
          },
          {
            name: 'Send a message when someone purchases or renews a subscription.',
            value: guild.systemChannelFlags.has(GuildSystemChannelFlags.SuppressRoleSubscriptionPurchaseNotifications)
              ? 'No'
              : 'Yes',
            inline: true,
          },
          {
            name: 'Prompt members to reply to subscription messages with a sticker.',
            value: guild.systemChannelFlags.has(GuildSystemChannelFlags.SuppressRoleSubscriptionPurchaseNotificationReplies)
              ? 'No'
              : 'Yes',
            inline: true,
          },
          {
            name: 'Send helpful tips for server setup',
            value: guild.systemChannelFlags.has(GuildSystemChannelFlags.SuppressGuildReminderNotifications)
              ? 'No'
              : 'Yes',
            inline: true,
          },
        );
      }
    }
    else if (selectedOption === 'security') {
      const guildExplicitContentFilter: Record<GuildExplicitContentFilter, string> = {
        [GuildExplicitContentFilter.Disabled]: '⚫ Disabled',
        [GuildExplicitContentFilter.MembersWithoutRoles]: '🟡 Members Without Roles',
        [GuildExplicitContentFilter.AllMembers]: '🔴 All Members',
      };
      const guildVerificationLevel: Record<GuildVerificationLevel, string> = {
        [GuildVerificationLevel.None]: '⚫ None',
        [GuildVerificationLevel.Low]: '🟢 Low',
        [GuildVerificationLevel.Medium]: '🟡 Medium',
        [GuildVerificationLevel.High]: '🟠 High',
        [GuildVerificationLevel.VeryHigh]: '🔴 Highest',
      };

      embed.addFields(
        {
          name: 'Explicit Content Filter',
          value: guildExplicitContentFilter[guild.explicitContentFilter],
        },
        {
          name: 'Verification Level',
          value: guildVerificationLevel[guild.verificationLevel],
        },
        {
          name: '2FA for Moderator Actions',
          value: guild.mfaLevel
            ? 'Yes'
            : 'No',
        },
      );
    }

    await interaction.update({
      embeds: [embed],
      components: [menuSelectMenuRow, buttonRow],
    });
  },
} satisfies SelectMenu;
