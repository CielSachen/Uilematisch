import type { DisTubeEvent } from '@interfaces';
import { Events } from 'distube';

export default {
  name: Events.FINISH,
  async execute(queue) {
    await queue.textChannel.send('No more songs remaining in the queue.');
  },
} satisfies DisTubeEvent<Events.FINISH>;
