import { config } from '@config';
import { buttons, colors, enums } from '@constants';
import type { SlashCommand } from '@interfaces';
import { Warning } from '@models';
import {
  capitalize,
  createColorImage,
  getMemberActivities,
  getMemberStatus,
  getRGB,
} from '@utils';
import { stripIndent } from 'common-tags';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  type ButtonBuilder,
  ChannelType,
  EmbedBuilder,
  inlineCode,
  quote,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  time,
} from 'discord.js';
import { Duration } from 'luxon';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('View information')
    .addSubcommand((subcommand) => subcommand
      .setName('bot')
      .setDescription('View information about the bot'))
    .addSubcommand((subcommand) => subcommand
      .setName('role')
      .setDescription('View information about a chosen role')
      .addRoleOption((option) => option
        .setName('role')
        .setDescription('The role to obtain the info from')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('server')
      .setDescription('View information about this server'))
    .addSubcommand((subcommand) => subcommand
      .setName('user')
      .setDescription('View information about you or a chosen user')
      .addUserOption((option) => option
        .setName('user')
        .setDescription('The user to obtain the info from')))
    .addSubcommand((subcommand) => subcommand
      .setName('warning')
      .setDescription('View information about your warning')
      .addStringOption((option) => option
        .setName('id')
        .setDescription('The ID of the warning to obtain the info from')
        .setAutocomplete(true)
        .setRequired(true)))
    .setDMPermission(false),
  async autocomplete(interaction) {
    const { options } = interaction;

    const warnings = await Warning.find({ userId: interaction.user.id });
    const filteredChoices = warnings
      .map((warning) => warning._id.toString())
      .filter((choice) => choice.startsWith(options.getFocused()));

    await interaction.respond(filteredChoices.map((choice) => ({
      name: choice,
      value: choice,
    })));
  },
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const subcommand = options.getSubcommand();

    const embed = new EmbedBuilder();

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.deleteMessage);

    if (subcommand === 'bot') {
      const owner = await guild.members.fetch(config.discord.bot.ownerId);

      embed
        .setColor(colors.bot)
        .setTitle(client.user.tag)
        .setAuthor({
          name: owner.displayName,
          iconURL: owner.displayAvatarURL(config.discord.imageUrl),
        })
        .setDescription(`${interaction.user.displayName} is a discord bot I develop for myself when I'm bored!`)
        .setThumbnail(client.user.displayAvatarURL(config.discord.imageUrl))
        .addFields(
          {
            name: 'Uptime',
            value: Duration
              .fromMillis(client.uptime)
              .toFormat('h:mm:ss.ms'),
          },
          {
            name: 'Slash Commands',
            value: client.slashCommands.size.toLocaleString(),
            inline: true,
          },
          {
            name: 'Context Menu Commands',
            value: client.contextMenuCommands.size.toLocaleString(),
            inline: true,
          },
          {
            name: 'Library',
            value: '[discord.js (v14.14.1)](https://discord.js.org/docs/packages/discord.js/14.14.1)',
          },
          {
            name: 'Date Created',
            value: time(client.user.createdTimestamp, 'D'),
            inline: true,
          },
        );

      await interaction.reply({
        embeds: [embed],
        components: [buttonRow],
      });
    }
    else if (subcommand === 'role') {
      const chosenRole = await guild.roles.fetch(options.getRole('role', true).id);

      embed
        .setColor(chosenRole.color)
        .setTitle(chosenRole.unicodeEmoji
          ? `${chosenRole.unicodeEmoji} ${chosenRole.name}`
          : chosenRole.name)
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL(config.discord.imageUrl),
        })
        .addFields(
          {
            name: 'Members',
            value: chosenRole.members.size.toLocaleString(),
          },
          {
            name: 'Managed by an Integration',
            value: chosenRole.managed
              ? 'Yes'
              : 'No',
          },
          {
            name: 'Mentionable',
            value: chosenRole.mentionable
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'Viewed Separately',
            value: chosenRole.hoist
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'Position',
            value: chosenRole.rawPosition.toLocaleString(),
          },
          {
            name: 'Color',
            value: stripIndent`
              Hex: ${inlineCode(chosenRole.hexColor)}
              RGB: ${inlineCode(getRGB(chosenRole.color).join(', '))}
              Decimal: ${inlineCode(chosenRole.color.toString())}
            `,
          },
          {
            name: 'Dated Created',
            value: time(chosenRole.createdTimestamp, 'D'),
          },
        )
        .setFooter({ text: `ID: ${chosenRole.id}` });

      if (chosenRole.icon) {
        embed.setThumbnail(chosenRole.iconURL(config.discord.imageUrl));

        await interaction.reply({
          embeds: [embed],
          components: [buttonRow],
        });
      }
      else {
        const roleIcon = new AttachmentBuilder(createColorImage(chosenRole.hexColor, 1_024, 1_024), { name: 'roleIcon.png' });

        embed.setThumbnail('attachment://roleIcon.png');

        await interaction.reply({
          embeds: [embed],
          files: [roleIcon],
          components: [buttonRow],
        });
      }
    }
    else if (subcommand === 'server') {
      const guildMembers = await guild.members.fetch();

      embed
        .setColor('Blurple')
        .setTitle(guild.name)
        .setDescription(guild.description ?? 'No description has been set.')
        .setThumbnail(guild.iconURL(config.discord.imageUrl))
        .addFields(
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
            value: `${guild.memberCount.toLocaleString()} (${guildMembers.filter((member) => member.user.bot).size.toLocaleString()} Bots)`,
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
        )
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
            .setDefault(true),
          new StringSelectMenuOptionBuilder()
            .setLabel('Notifications')
            .setDescription('Information about the notification settings of this Discord Server.')
            .setValue('notifications'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Security')
            .setDescription('Information about the security settings of this Discord Server.')
            .setValue('security'),
        ));

      await interaction.reply({
        embeds: [embed],
        components: [menuSelectMenuRow, buttonRow],
      });
    }
    else if (subcommand === 'user') {
      const chosenUser = await client.users.fetch(options.getUser('user') ?? interaction.user, { force: true });
      const chosenMember = await guild.members.fetch({
        withPresences: true,
        user: chosenUser,
      });

      embed
        .setColor(chosenMember.displayHexColor === '#000000'
          ? colors.roleDefault
          : chosenMember.displayHexColor)
        .setTitle(chosenUser.bot
          ? chosenUser.tag
          : chosenUser.username)
        .setDescription(stripIndent`
          ${getMemberStatus(chosenMember)}
          ${chosenMember.presence.activities.length >= 1
          ? quote(getMemberActivities(chosenMember).join('\n'))
          : ''}
        `)
        .setThumbnail(chosenUser.displayAvatarURL(config.discord.imageUrl))
        .addFields(
          {
            name: 'Status',
            value: chosenMember.presence
              ? capitalize(chosenMember.presence.status)
              : 'Offline',
            inline: true,
          },
          {
            name: 'Client',
            value: chosenMember.presence
              ? capitalize(Object.keys(chosenMember.presence.clientStatus).toString())
              : '\u200B',
            inline: true,
          },
          {
            name: 'Nickname',
            value: chosenMember.nickname ?? 'None',
          },
          {
            name: 'Bot',
            value: chosenUser.bot
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'System',
            value: chosenUser.system
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'Badges',
            value: chosenUser.flags
              .toArray()
              .map((badgeName) => enums.badges[badgeName])
              .join('') || 'None',
          },
          {
            name: 'Server Booster',
            value: chosenMember.premiumSince
              ? `Since ${time(chosenMember.premiumSinceTimestamp, 'D')}`
              : 'No',
          },
          {
            name: 'Roles',
            value: chosenMember.roles.cache.size >= 1
              ? chosenMember.roles.cache
                .filter((role) => role.id !== guild.id)
                .map((role) => role.toString())
                .join(', ')
              : 'None',
          },
          {
            name: 'Date Created',
            value: time(chosenUser.createdTimestamp, 'D'),
            inline: true,
          },
          {
            name: 'Date Joined',
            value: time(chosenMember.joinedTimestamp, 'D'),
            inline: true,
          },
        )
        .setFooter({ text: `ID: ${chosenUser.id}` });

      if (!chosenUser.hexAccentColor) {
        await interaction.reply({
          embeds: [embed],
          components: [buttonRow],
        });
        return;
      }

      embed.addFields({
        name: 'Banner Color',
        value: stripIndent`
          Hex: ${inlineCode(chosenUser.hexAccentColor)}
          RGB: ${inlineCode(getRGB(chosenUser.accentColor).join(', '))}
          Decimal: ${inlineCode(chosenUser.accentColor.toString())}
        `,
      });

      if (chosenUser.banner) {
        embed.setImage(chosenUser.bannerURL(config.discord.imageUrl));

        await interaction.reply({
          embeds: [embed],
          components: [buttonRow],
        });
      }
      else {
        const userBanner = new AttachmentBuilder(createColorImage(chosenUser.hexAccentColor, 1_360, 480), { name: 'userBanner.png' });

        embed.setImage('attachment://userBanner.png');

        await interaction.reply({
          embeds: [embed],
          files: [userBanner],
          components: [buttonRow],
        });
      }
    }
    else if (subcommand === 'warning') {
      const givenId = options.getString('id', true);
      const warning = await Warning.findById(givenId);

      if (!warning || warning.userId !== interaction.user.id) {
        await interaction.reply({
          content: `There is no warning with the ID ${inlineCode(givenId)} that was given to you.`,
          ephemeral: true,
        });
        return;
      }

      const warningGuild = await client.guilds.fetch(warning.guildId);
      const warningEnforcer = await client.users.fetch(warning.enforcerId);

      embed
        .setColor('Yellow')
        .setTitle('Warning Info')
        .setAuthor({
          name: warningGuild.name,
          iconURL: warningGuild.iconURL(config.discord.imageUrl),
        })
        .setDescription(quote(warning.reason))
        .setThumbnail('https://images.emojiterra.com/twitter/v14.0/1024px/26a0.png')
        .addFields(
          {
            name: 'Given By',
            value: warningEnforcer.toString() || 'User does not or no longer exists.',
          },
          {
            name: 'Date Given',
            value: time(warning.givenTimestamp, 'D'),
          },
        )
        .setFooter({ text: `ID: ${warning.id}` });

      await interaction.reply({
        embeds: [embed],
        components: [buttonRow],
      });
    }
  },
} satisfies SlashCommand;
