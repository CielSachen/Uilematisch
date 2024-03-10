import type { ClientEvent } from '@interfaces';
import { logger } from '@utils';
import { ActivityType, Events, PresenceUpdateStatus } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setPresence({
      activities: [{
        name: 'your commands',
        type: ActivityType.Listening,
      }],
      status: PresenceUpdateStatus.Online,
    });

    logger.info(`Ready! Logged in as "${client.user.tag}".`, { clientId: client.user.id });
  },
} satisfies ClientEvent<Events.ClientReady>;
