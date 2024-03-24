import { imageURLOptions } from '@configs/discord.js';
import { buttons, colors, enums } from '@constants';
import type { ContextMenuCommand } from '@interfaces';
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
  ApplicationCommandType,
  AttachmentBuilder,
  ButtonBuilder,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  inlineCode,
  quote,
  time,
  type UserContextMenuCommandInteraction,
} from 'discord.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('View User Info')
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async execute(interaction: UserContextMenuCommandInteraction) {
    const { client, guild } = interaction;

    const targetUser = await client.users.fetch(interaction.targetUser, { force: true });
    const targetMember = await guild.members.fetch({
      withPresences: true,
      user: targetUser,
    });

    const embed = new EmbedBuilder()
      .setColor(targetMember.displayHexColor === '#000000'
        ? colors.roleDefault
        : targetMember.displayHexColor)
      .setTitle(targetUser.bot
        ? targetUser.tag
        : targetUser.username)
      .setDescription(stripIndent`
        ${getMemberStatus(targetMember)}
        ${targetMember.presence.activities.length >= 1
        ? quote(getMemberActivities(targetMember).join('\n'))
        : ''}
      `)
      .setThumbnail(targetUser.displayAvatarURL(imageURLOptions))
      .addFields(
        {
          name: 'Status',
          value: targetMember.presence
            ? capitalize(targetMember.presence.status)
            : 'Offline',
          inline: true,
        },
        {
          name: 'Client',
          value: targetMember.presence
            ? capitalize(Object.keys(targetMember.presence.clientStatus).toString())
            : '\u200B',
          inline: true,
        },
        {
          name: 'Nickname',
          value: targetMember.nickname ?? 'None',
        },
        {
          name: 'Bot',
          value: targetUser.bot
            ? 'Yes'
            : 'No',
          inline: true,
        },
        {
          name: 'System',
          value: targetUser.system
            ? 'Yes'
            : 'No',
          inline: true,
        },
        {
          name: 'Badges',
          value: targetUser.flags
            .toArray()
            .map((badgeName) => enums.badges[badgeName])
            .join('') || 'None',
        },
        {
          name: 'Server Booster',
          value: targetMember.premiumSince
            ? `Since ${time(targetMember.premiumSinceTimestamp, 'D')}`
            : 'No',
        },
        {
          name: 'Roles',
          value: targetMember.roles.cache.size >= 1
            ? targetMember.roles.cache
              .filter((role) => role.id !== guild.id)
              .map((role) => role.toString())
              .join(', ')
            : 'None',
        },
        {
          name: 'Date Created',
          value: time(targetUser.createdTimestamp, 'D'),
          inline: true,
        },
        {
          name: 'Date Joined',
          value: time(targetMember.joinedTimestamp, 'D'),
          inline: true,
        },
      )
      .setFooter({ text: `ID: ${targetUser.id}` });

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.deleteMessage);

    if (!targetUser.hexAccentColor) {
      await interaction.reply({
        embeds: [embed],
        components: [buttonRow],
      });
      return;
    }

    embed.addFields({
      name: 'Banner Color',
      value: stripIndent`
        Hex: ${inlineCode(targetUser.hexAccentColor)}
        RGB: ${inlineCode(getRGB(targetUser.accentColor).join(', '))}
        Decimal: ${inlineCode(targetUser.accentColor.toString())}
      `,
    });

    if (targetUser.banner) {
      embed.setImage(targetUser.bannerURL(imageURLOptions));

      await interaction.reply({
        embeds: [embed],
        components: [buttonRow],
      });
    }
    else {
      embed.setImage('attachment://userBanner.png');

      const userBanner = new AttachmentBuilder(createColorImage(targetUser.hexAccentColor, 1_360, 480), { name: 'userBanner.png' });

      await interaction.reply({
        embeds: [embed],
        components: [buttonRow],
        files: [userBanner],
      });
    }
  },
} satisfies ContextMenuCommand;
