import type { SlashCommand } from '@interfaces';
import { type ColorResolvable, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8 ball a question')
    .addStringOption((option) => option
      .setName('question')
      .setDescription('The question to ask the magic 8 ball')
      .setAutocomplete(true)
      .setRequired(true)),
  async autocomplete(interaction) {
    const { options } = interaction;

    const choices = [
      'Does my future hold anything big?',
      'Should I trust the Magic 8 Ball?',
      'Will it rain today?',
    ];
    const filteredChoices = choices.filter((choice) => choice.startsWith(options.getFocused()));

    await interaction.respond(filteredChoices.map((choice) => ({
      name: choice,
      value: choice,
    })));
  },
  async execute(interaction) {
    const { options } = interaction;

    const givenQuestion = options.getString('question', true);
    const categories = [
      'affirmative',
      'nonCommittal',
      'negative',
    ];
    const category = categories[Math.floor(Math.random() * categories.length)];

    let color: ColorResolvable, possibleAnswers: string[];

    if (category === 'affirmative') {
      color = 'Green';
      possibleAnswers = [
        'It is certain',
        'It is decidedly so',
        'Without a doubt',
        'Yes definitely',
        'You may rely on it',
        'As I see it, yes',
        'Most likely',
        'Outlook good',
        'Yes',
        'Signs point to yes',
      ];
    }
    else if (category === 'nonCommittal') {
      color = 'Yellow';
      possibleAnswers = [
        'Reply hazy, try again',
        'Ask again later',
        'Better not tell you now',
        'Cannot predict now',
        'Concentrate and ask again',
      ];
    }
    else if (category === 'negative') {
      color = 'Red';
      possibleAnswers = [
        'Don\'t count on it',
        'My reply is no',
        'My sources say no',
        'Outlook not so good',
        'Very doubtful',
      ];
    }

    const answer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(givenQuestion)
      .setAuthor({
        name: '8 Ball',
        iconURL: 'https://images.emojiterra.com/twitter/v14.0/1024px/1f3b1.png',
      })
      .setDescription(`${answer}, ${interaction.user.toString()}.`);

    await interaction.reply({ embeds: [embed] });
  },
} satisfies SlashCommand;
