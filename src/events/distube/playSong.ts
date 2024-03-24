import { imageURLOptions } from '@configs/discord.js';
import { colors, enums } from '@constants';
import type { DisTubeEvent } from '@interfaces';
import { bold, EmbedBuilder } from 'discord.js';
import { Events } from 'distube';

export default {
  name: Events.PLAY_SONG,
  async execute(queue, song) {
    const embed = new EmbedBuilder()
      .setColor(colors.distube)
      .setTitle(song.name)
      .setURL(song.url)
      .setAuthor({
        name: song.member.displayName,
        iconURL: song.user.displayAvatarURL(imageURLOptions),
      })
      .setDescription(`Song length: ${queue.formattedDuration}`)
      .setThumbnail(song.thumbnail ?? 'https://images.emojiterra.com/twitter/v14.0/1024px/1f4bf.png')
      .addFields(
        {
          name: 'Volume',
          value: `${queue.volume.toString()}%`,
          inline: true,
        },
        {
          name: 'Looping',
          value: enums.repeatMode[queue.repeatMode],
          inline: true,
        },
        {
          name: 'Autoplay',
          value: queue.autoplay
            ? 'On'
            : 'Off',
          inline: true,
        },
        {
          name: 'Filters',
          value: queue.filters.names.join(', ') || 'None',
        },
      );

    await queue.textChannel.send({
      content: bold('Now playing:'),
      embeds: [embed],
    });
  },
} satisfies DisTubeEvent<Events.PLAY_SONG>;
