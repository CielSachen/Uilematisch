import { BotClient } from '@client';
import { env } from '@configs/env.js';
import { logger } from '@utils';
import { connect } from 'mongoose';

const client = new BotClient();

try {
  await client.loadCommands();
  await client.loadComponents();
  await client.loadEvents();

  await connect(env.MONGODB_URI);

  void client.login(env.TENOR_KEY);
}
catch (err) {
  logger.error('Failed to login the bot.', err);
}
