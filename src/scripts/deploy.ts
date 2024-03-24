import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { env } from '@configs/env.js';
import type { Command } from '@interfaces';
import { isCommand, logger } from '@utils';
import { REST, type RESTPostAPIApplicationCommandsJSONBody, type RESTPutAPIApplicationCommandsResult, Routes } from 'discord.js';

const commandsPath = join(import.meta.dirname, '..', 'commands');
const commandFolders = await readdir(commandsPath);
const commandData: RESTPostAPIApplicationCommandsJSONBody[] = [];

for (const folder of commandFolders) {
  const folderPath = join(commandsPath, folder);
  const folderStats = await stat(folderPath);

  if (!folderStats.isDirectory()) continue;

  const commandSubfolders = await readdir(folderPath);

  for (const subfolder of commandSubfolders) {
    const subfolderPath = join(commandsPath, folder, subfolder);
    const subfolderStats = await stat(subfolderPath);

    if (!subfolderStats.isDirectory()) continue;

    const commandFiles = await readdir(subfolderPath);

    for (const file of commandFiles) {
      if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

      const filePath = join(commandsPath, folder, subfolder, file);
      const command = (await import(filePath) as { default: Command }).default;

      if (isCommand(command)) commandData.push(command.data.toJSON());
      else logger.warn('A command is missing a required "data" or "execute" property. Skipping...', { filePath });
    }
  }
}

const rest = new REST().setToken(env.DISCORD_TOKEN);

try {
  logger.verbose(`Started registering ${commandData.length} commands.`);

  const result = await rest.put(Routes.applicationCommands(env.APPLICATION_ID), { body: commandData }) as RESTPutAPIApplicationCommandsResult;

  logger.info(`Successfully registered ${result.length} commands.`, { applicationId: env.APPLICATION_ID });
}
catch (err) {
  logger.error('Failed to register commands.', {
    applicationId: env.APPLICATION_ID,
    error: err,
  });
}
