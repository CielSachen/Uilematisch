import { imageURLOptions } from '@configs/discord.js';
import { colors } from '@constants';
import type { DisTubeEvent } from '@interfaces';
import { bold, EmbedBuilder } from 'discord.js';
import { Events } from 'distube';

export default {
  name: Events.ADD_SONG,
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
      .setThumbnail(song.thumbnail ?? 'https://images.emojiterra.com/twitter/v14.0/1024px/1f4bf.png');

    await queue.textChannel.send({
      content: bold('Added to queue:'),
      embeds: [embed],
    });
  },
} satisfies DisTubeEvent<Events.ADD_SONG>;
