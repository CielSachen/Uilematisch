import { ExtendedClient } from '@client';
import { config } from '@config';
import { logger } from '@utils';
import { GatewayIntentBits } from 'discord.js';
import { connect } from 'mongoose';

const client = new ExtendedClient({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
] });

try {
  await client.loadCommands();
  await client.loadComponents();
  await client.loadEvents();

  await connect(config.database.uri, config.database.options);

  void client.login(config.discord.bot.token);
}
catch (err) {
  logger.error('Failed to login the bot.', err);
}
