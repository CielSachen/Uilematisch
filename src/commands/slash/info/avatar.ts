import { imageURLOptions } from '@configs/discord.js';
import { colors } from '@constants';
import type { SlashCommand } from '@interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('View your or a chosen user\'s global or server avatar')
    .addStringOption((option) => option
      .setName('type')
      .setDescription('The type of avatar to view')
      .setRequired(true)
      .addChoices(
        {
          name: 'Global',
          value: 'discord',
        },
        {
          name: 'Server',
          value: 'guild',
        },
      ))
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to obtain the avatar from'))
    .setDMPermission(false),
  async execute(interaction) {
    const { guild, options } = interaction;

    const chosenType = options.getString('type', true);
    const chosenUser = options.getUser('user') ?? interaction.user;

    const embed = new EmbedBuilder();

    if (chosenType === 'discord') {
      const chosenUserAvatarURL = chosenUser.avatarURL(imageURLOptions);

      embed
        .setColor('Blurple')
        .setTitle('Global Avatar URL')
        .setURL(chosenUserAvatarURL)
        .setAuthor({ name: chosenUser.displayName })
        .setImage(chosenUserAvatarURL);
    }
    else if (chosenType === 'guild') {
      const chosenMember = await guild.members.fetch(chosenUser);
      const chosenMemberDisplayAvatarURL = chosenMember.displayAvatarURL(imageURLOptions);

      embed
        .setColor(chosenMember.displayHexColor === '#000000'
          ? colors.roleDefault
          : chosenMember.displayHexColor)
        .setTitle('Server Avatar URL')
        .setURL(chosenMemberDisplayAvatarURL)
        .setAuthor({ name: chosenMember.displayName })
        .setImage(chosenMemberDisplayAvatarURL)
        .setFooter({
          text: guild.name,
          iconURL: guild.iconURL(imageURLOptions),
        });
    }

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
} satisfies SlashCommand;
