import { imageURLOptions } from '@configs/discord.js';
import type { SlashCommand } from '@interfaces';
import { Warning } from '@models';
import {
  codeBlock,
  EmbedBuilder,
  PermissionFlagsBits,
  quote,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a selected member')
    .addUserOption((option) => option
      .setName('member')
      .setDescription('The member to warn')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('reason')
      .setDescription('The reason for warning'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const { guild, options } = interaction;

    const chosenMember = options.getUser('member', true);

    if (chosenMember.bot) {
      await interaction.reply({
        content: 'You cannot give a warning to a bot.',
        ephemeral: true,
      });
      return;
    }

    const givenReason = options.getString('reason') ?? 'No reason given.';
    const warning = await Warning.create({
      userId: chosenMember.id,
      guildId: guild.id,
      reason: givenReason,
      enforcerId: interaction.user.id,
    });

    const embed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('Warned a Member')
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL(imageURLOptions),
      })
      .setDescription(quote(givenReason))
      .addFields(
        {
          name: 'Given By',
          value: interaction.user.toString(),
          inline: true,
        },
        {
          name: 'Given To',
          value: chosenMember.toString(),
          inline: true,
        },
      )
      .setFooter({ text: `ID: ${warning.id}` });

    await interaction.reply({ embeds: [embed] });

    await chosenMember
      .send(`You had been warned in ${guild.name} by ${interaction.user.toString()} for: ${codeBlock(givenReason)}`)
      .catch(() => interaction.followUp({
        content: `Could not send a DM alerting ${chosenMember.toString()}.`,
        ephemeral: true,
      }));
  },
} satisfies SlashCommand;
