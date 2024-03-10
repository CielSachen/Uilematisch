import type { SlashCommand } from '@interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Choose between up to 5 given choices')
    .addStringOption((option) => option
      .setName('choice1')
      .setDescription('The 1st choice to choose from')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('choice2')
      .setDescription('The 2nd choice to choose from')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('choice3')
      .setDescription('The 3rd choice to choose from'))
    .addStringOption((option) => option
      .setName('choice4')
      .setDescription('The 4th choice to choose from'))
    .addStringOption((option) => option
      .setName('choice5')
      .setDescription('The 5th choice to choose from')),
  async execute(interaction) {
    const { options } = interaction;

    const givenChoices = [
      options.getString('choice1', true),
      options.getString('choice2', true),
      options.getString('choice3'),
      options.getString('choice4'),
      options.getString('choice5'),
    ];
    const filteredChoices = givenChoices.filter((choice) => choice);
    const chosenChoice = filteredChoices[Math.floor(Math.random() * filteredChoices.length)];

    const embed = new EmbedBuilder()
      .setColor('#FFAC32')
      .setDescription(`${interaction.user.toString()} asked to choose between ${filteredChoices.length} choices.`)
      .setThumbnail('https://images.emojiterra.com/twitter/v14.0/1024px/2696.png')
      .addFields(
        {
          name: 'Choices',
          value: filteredChoices
            .map((choice, index) => `${index + 1}. ${choice}`)
            .join('\n'),
        },
        {
          name: 'Chosen',
          value: chosenChoice,
        },
      );

    await interaction.reply({ embeds: [embed] });
  },
} satisfies SlashCommand;
