import { Tenor } from '@cielsachen/tenor-v2-wrapper';
import { env } from '@configs/env.js';
import type { SlashCommand } from '@interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('meow')
    .setDescription('Reply with a random meow GIF'),
  async execute(interaction) {
    const tenor = new Tenor(env.TENOR_KEY);

    const response = await tenor.fetchGIFsByQuery('meow', {
      contentfilter: 'high',
      media_filter: 'gif',
      random: 'true',
    });
    const randomGIF = response.results[Math.floor(Math.random() * response.results.length)];

    const meowEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Nya :3')
      .setURL(randomGIF.itemurl)
      .setImage(randomGIF.media_formats.gif.url)
      .setTimestamp(randomGIF.created);

    await interaction.reply({ embeds: [meowEmbed] });
  },
} satisfies SlashCommand;
