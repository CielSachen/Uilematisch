import { colors } from '@constants';
import type { SlashCommand } from '@interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s response time'),
  async execute(interaction) {
    const { client } = interaction;

    const message = await interaction.reply({
      content: 'Calculating ping...',
      fetchReply: true,
    });

    const embed = new EmbedBuilder()
      .setColor(colors.bot)
      .addFields(
        {
          name: 'API Latency',
          value: `${client.ws.ping}ms`,
        },
        {
          name: 'Bot Latency',
          value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
        },
      );

    await interaction.editReply({
      content: '🏓 Pong!',
      embeds: [embed],
    });
  },
} satisfies SlashCommand;
