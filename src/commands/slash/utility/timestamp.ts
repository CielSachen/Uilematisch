import type { SlashCommand } from '@interfaces';
import { stripIndent } from 'common-tags';
import { EmbedBuilder, inlineCode, SlashCommandBuilder, time } from 'discord.js';
import { DateTime } from 'luxon';

export default {
  data: new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription('Show the current timestamp or convert a given date/time into a timestamp')
    .addIntegerOption((option) => option
      .setName('year')
      .setDescription('The year to convert into a timestamp, format: "YYYY"'))
    .addIntegerOption((option) => option
      .setName('month')
      .setDescription('The month to convert into a timestamp, format: "MM"'))
    .addIntegerOption((option) => option
      .setName('day')
      .setDescription('The day to convert into a timestamp, format: "DD"'))
    .addIntegerOption((option) => option
      .setName('hours')
      .setDescription('The hours to convert into a timestamp, format: "hh"'))
    .addIntegerOption((option) => option
      .setName('minutes')
      .setDescription('The minutes to convert into a timestamp, format: "mm"'))
    .addIntegerOption((option) => option
      .setName('seconds')
      .setDescription('The seconds to convert into a timestamp, format: "ss"')),
  async execute(interaction) {
    const { options } = interaction;

    const givenYear = options.getInteger('year');
    const givenMonth = options.getInteger('month');
    const givenDay = options.getInteger('day');
    const givenHours = options.getInteger('hours');
    const givenMinutes = options.getInteger('minutes');
    const givenSeconds = options.getInteger('seconds');

    const embed = new EmbedBuilder()
      .setColor('#99AAB4')
      .setThumbnail('https://images.emojiterra.com/twitter/v14.0/1024px/1f551.png');

    if (givenYear || givenMonth || givenDay || givenHours || givenMinutes || givenSeconds) {
      const givenDate = DateTime.fromJSDate(new Date(
        givenYear ?? 1_970,
        (givenMonth ?? 1) - 1,
        givenDay ?? 1,
        givenHours ?? 0,
        givenMinutes ?? 0,
        givenSeconds ?? 0,
      ));
      const givenTimestamp = givenDate.toMillis();
      const givenUNIXTimestamp = givenDate.toUnixInteger();

      embed
        .setTitle('Timestamp')
        .setDescription(stripIndent`
          Given Date and Time: ${givenDate.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
          Milliseconds: ${givenTimestamp}
          Seconds / UNIX: ${givenUNIXTimestamp} 
        `)
        .setFields(
          {
            name: 'Date',
            value: stripIndent`
              ${inlineCode(time(givenUNIXTimestamp, 'd'))} » ${time(givenUNIXTimestamp, 'd')}
              ${inlineCode(time(givenUNIXTimestamp, 'D'))} » ${time(givenUNIXTimestamp, 'D')}
            `,
          },
          {
            name: 'Time',
            value: stripIndent`
              ${inlineCode(time(givenUNIXTimestamp, 't'))} » ${time(givenUNIXTimestamp, 't')}
              ${inlineCode(time(givenUNIXTimestamp, 'T'))} » ${time(givenUNIXTimestamp, 'T')}
            `,
          },
          {
            name: 'Date & Time',
            value: stripIndent`
              ${inlineCode(time(givenUNIXTimestamp, 'f'))} » ${time(givenUNIXTimestamp, 'f')}
              ${inlineCode(time(givenUNIXTimestamp, 'F'))} » ${time(givenUNIXTimestamp, 'F')}
            `,
          },
          {
            name: 'Relative',
            value: `${inlineCode(time(givenUNIXTimestamp, 'R'))} » ${time(givenUNIXTimestamp, 'R')}`,
          },
        );

      await interaction.reply({ embeds: [embed] });
    }
    else {
      const currentDate = DateTime.now();
      const currentTimestamp = currentDate.toMillis();
      const currentUNIXTimestamp = currentDate.toUnixInteger();

      embed
        .setTitle('Current Timestamp')
        .setDescription(stripIndent`
          Date and Time: ${currentDate.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
          Milliseconds: ${currentTimestamp}
          Seconds / UNIX: ${currentUNIXTimestamp}
        `)
        .setFields(
          {
            name: 'Date',
            value: stripIndent`
              ${inlineCode(time(currentUNIXTimestamp, 'd'))} » ${time(currentUNIXTimestamp, 'd')}
              ${inlineCode(time(currentUNIXTimestamp, 'D'))} » ${time(currentUNIXTimestamp, 'D')}
            `,
          },
          {
            name: 'Time',
            value: stripIndent`
              ${inlineCode(time(currentUNIXTimestamp, 't'))} » ${time(currentUNIXTimestamp, 't')}
              ${inlineCode(time(currentUNIXTimestamp, 'T'))} » ${time(currentUNIXTimestamp, 'T')}
            `,
          },
          {
            name: 'Date & Time',
            value: stripIndent`
              ${inlineCode(time(currentUNIXTimestamp, 'f'))} » ${time(currentUNIXTimestamp, 'f')}
              ${inlineCode(time(currentUNIXTimestamp, 'F'))} » ${time(currentUNIXTimestamp, 'F')}
            `,
          },
          {
            name: 'Relative',
            value: `${inlineCode(time(currentUNIXTimestamp, 'R'))} » ${time(currentUNIXTimestamp, 'R')}`,
          },
        );

      await interaction.reply({ embeds: [embed] });
    }
  },
} satisfies SlashCommand;
