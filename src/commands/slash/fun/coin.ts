import type { SlashCommand } from '@interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Toss one or up to 100 coins')
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('How many coins to toss')
      .setMaxValue(100)
      .setMinValue(1)),
  async execute(interaction) {
    const { options } = interaction;

    const givenAmount = options.getInteger('amount') ?? 1;

    const tossCoin = () => {
      const coinSides = ['Heads', 'Tails'];

      return coinSides[Math.floor(Math.random() * coinSides.length)];
    };

    const embed = new EmbedBuilder()
      .setColor('#FFCC4D')
      .setThumbnail('https://images.emojiterra.com/twitter/v14.0/1024px/1fa99.png');

    if (givenAmount === 1) {
      embed
        .setDescription(`${interaction.user.toString()} tossed a coin.`)
        .addFields({
          name: 'Result',
          value: tossCoin(),
        });
    }
    else {
      const results = Array
        .from(Array(givenAmount))
        .map(() => tossCoin());

      embed
        .setDescription(`${interaction.user.toString()} tossed ${givenAmount} coins.`)
        .addFields(
          {
            name: 'Heads',
            value: results.filter((result) => result === 'Heads').length.toLocaleString(),
            inline: true,
          },
          {
            name: 'Tails',
            value: results.filter((result) => result === 'Tails').length.toLocaleString(),
            inline: true,
          },
        );
    }

    await interaction.reply({ embeds: [embed] });
  },
} satisfies SlashCommand;
