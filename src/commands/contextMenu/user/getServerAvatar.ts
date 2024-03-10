import { config } from '@config';
import { colors } from '@constants';
import type { ContextMenuCommand } from '@interfaces';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, type UserContextMenuCommandInteraction } from 'discord.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Get Server Avatar')
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async execute(interaction: UserContextMenuCommandInteraction) {
    const { guild, targetUser } = interaction;

    const targetMember = await guild.members.fetch(targetUser);
    const targetMemberDisplayAvatarURL = targetUser.displayAvatarURL(config.discord.imageUrl);

    const embed = new EmbedBuilder()
      .setColor(targetMember.displayHexColor === '#000000'
        ? colors.roleDefault
        : targetMember.displayHexColor)
      .setTitle('Server Avatar URL')
      .setURL(targetMemberDisplayAvatarURL)
      .setAuthor({ name: targetMember.displayName })
      .setImage(targetMemberDisplayAvatarURL)
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL(config.discord.imageUrl),
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
} satisfies ContextMenuCommand;
