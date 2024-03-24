import { imageURLOptions } from '@configs/discord.js';
import type { ContextMenuCommand } from '@interfaces';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, type UserContextMenuCommandInteraction } from 'discord.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Get Global Avatar')
    .setType(ApplicationCommandType.User),
  async execute(interaction: UserContextMenuCommandInteraction) {
    const { targetUser } = interaction;

    const targetUserAvatarURL = targetUser.avatarURL(imageURLOptions);

    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('Global Avatar URL')
      .setURL(targetUserAvatarURL)
      .setAuthor({ name: targetUser.displayName })
      .setImage(targetUserAvatarURL);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
} satisfies ContextMenuCommand;
