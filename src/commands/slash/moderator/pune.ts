import { imageURLOptions } from '@configs/discord.js';
import type { SlashCommand } from '@interfaces';
import {
  type Collection,
  EmbedBuilder,
  inlineCode,
  type Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('prune')
    .setDescription('Prune up to 99 messages')
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('How many messages to prune')
      .setMaxValue(100)
      .setMinValue(1)
      .setRequired(true))
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Only delete messages from this user'))
    .addStringOption((option) => option
      .setName('word')
      .setDescription('Only delete messages containing this word'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute(interaction) {
    const { guild, options } = interaction;

    const botMember = await guild.members.fetch(interaction.client.user);

    if (!botMember
      .permissionsIn(interaction.channel)
      .has('ManageMessages')) {
      await interaction.reply({
        content: `I need the permission ${inlineCode('Manage Messages')} to prune messages.`,
        ephemeral: true,
      });
      return;
    }

    const givenAmount = options.getInteger('amount', true);
    const messages = await interaction.channel.messages.fetch({
      limit: givenAmount,
      cache: false,
    });
    const chosenUser = options.getUser('user');
    const givenWord = options.getString('word');

    let filteredMessages: Collection<string, Message<true>>;

    filteredMessages = messages.filter((message) => !message.pinned);

    if (chosenUser) filteredMessages = filteredMessages.filter((message) => message.author === chosenUser);

    if (givenWord) filteredMessages = filteredMessages.filter((message) => message.content.includes(givenWord));

    const deletedMessages = await interaction.channel.bulkDelete(filteredMessages, true);

    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('Message/s had been Pruned Successfully')
      .setAuthor({ name: interaction.channel.name })
      .addFields(
        {
          name: 'Number of Messages to Prune',
          value: givenAmount.toLocaleString(),
        },
        {
          name: 'Number of Prunable Messages',
          value: filteredMessages.size.toLocaleString(),
        },
        {
          name: 'Number of Messages Pruned',
          value: deletedMessages.size.toLocaleString(),
        },
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL(imageURLOptions),
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
} satisfies SlashCommand;
