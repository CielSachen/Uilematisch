import type { SlashCommand } from '@interfaces';
import { fetchUrbanDictionaryEntries } from '@services/api/urbanDictionary.js';
import { capitalize } from '@utils';
import { stripIndent } from 'common-tags';
import {
  bold,
  codeBlock,
  EmbedBuilder,
  inlineCode,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Search the Urban Dictionary definition of a given word')
    .addStringOption((option) => option
      .setName('word')
      .setDescription('The word to search the definition of')
      .setRequired(true)),
  async execute(interaction) {
    const { options } = interaction;

    const givenWord = options.getString('word', true);
    const response = await fetchUrbanDictionaryEntries(givenWord);

    if (response.list.length === 0) {
      await interaction.reply({
        content: `There was no entry found for ${inlineCode(givenWord)}.`,
        ephemeral: true,
      });
      return;
    }

    const entry = response.list[Math.floor(Math.random() * response.list.length)];

    const cleanText = (text: string) => {
      return text.replace(/\[|\]/g, '');
    };

    const embed = new EmbedBuilder()
      .setColor('#134FE6')
      .setTitle(capitalize(entry.word))
      .setURL(entry.permalink)
      .setAuthor({
        name: 'Urban Dictionary',
        iconURL: 'https://asset.brandfetch.io/idDKU5RwKB/idAtwngHxG.png',
      })
      .setDescription(stripIndent`
        ${bold('Definition')}
        ${codeBlock(cleanText(entry.definition))}
      `)
      .setFields(
        {
          name: 'Author',
          value: entry.author || 'Anonymous',
          inline: true,
        },
        {
          name: 'ID',
          value: entry.defid.toString(),
          inline: true,
        },
        {
          name: 'Rating',
          value: `👍 ${entry.thumbs_up} | 👎 ${entry.thumbs_down}`,
          inline: true,
        },
        {
          name: 'Example',
          value: cleanText(entry.example) || 'No example given.',
        },
      )
      .setTimestamp(new Date(entry.written_on));

    await interaction.reply({ embeds: [embed] });
  },
} satisfies SlashCommand;
