import { BotClient } from '@client';
import { config } from '@config';
import { logger } from '@utils';
import { connect } from 'mongoose';

const client = new BotClient();

try {
  await client.loadCommands();
  await client.loadComponents();
  await client.loadEvents();

  await connect(config.databaseURI);

  void client.login(config.discord.bot.token);
}
catch (err) {
  logger.error('Failed to login the bot.', err);
}
