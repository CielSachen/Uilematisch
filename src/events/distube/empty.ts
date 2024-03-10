import type { DisTubeEvent } from '@interfaces';
import { Events } from 'distube';

export default {
  name: Events.EMPTY,
  async execute(queue) {
    await queue.textChannel.send(`${queue.voiceChannel.toString()} is empty, I'm leaving the voice channel.`);
  },
} satisfies DisTubeEvent<Events.EMPTY>;
