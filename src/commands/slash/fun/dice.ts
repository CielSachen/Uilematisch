import type { SlashCommand } from '@interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll one or up to 100 dice')
    .addIntegerOption((option) => option
      .setName('sides')
      .setDescription('How many sides the die/dice should have')
      .setMaxValue(144)
      .setMinValue(3))
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('How many dice to roll')
      .setMaxValue(100)
      .setMinValue(1)),
  async execute(interaction) {
    const { options } = interaction;

    const givenAmount = options.getInteger('amount') ?? 1;
    const givenSideAmount = options.getInteger('sides') ?? 6;

    const rollDie = () => {
      return 1 + Math.floor(Math.random() * givenSideAmount);
    };

    const embed = new EmbedBuilder()
      .setColor('#EB596E')
      .setThumbnail('https://images.emojiterra.com/twitter/v14.0/1024px/1f3b2.png');

    if (givenAmount === 1) {
      embed
        .setDescription(`${interaction.user.toString()} rolled a die with ${givenSideAmount} sides.`)
        .addFields({
          name: 'Result',
          value: rollDie().toString(),
        });
    }
    else {
      const results = Array
        .from(Array(givenAmount))
        .map(() => rollDie());

      embed
        .setDescription(`${interaction.user.toString()} rolled ${givenAmount} dice with ${givenSideAmount} sides.`)
        .addFields(
          {
            name: 'Individual',
            value: results.join(', '),
          },
          {
            name: 'Total',
            value: results.reduce((previousValue, currentValue) => previousValue + currentValue, 0).toLocaleString(),
          },
        );
    }

    await interaction.reply({ embeds: [embed] });
  },
} satisfies SlashCommand;
