import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp';
import type {
  Button,
  ClientEvent,
  ContextMenuCommand,
  DisTubeEvent,
  Modal,
  MongooseEvent,
  SelectMenu,
  SlashCommand,
} from '@interfaces';
import { isCommand, isComponent, isEvent, logger } from '@utils';
import { Client, Collection } from 'discord.js';
import { DisTube, type DisTubeEvents } from 'distube';
import mongoose from 'mongoose';

declare module 'discord.js' {
  interface BaseInteraction {
    readonly client: ExtendedClient<true>;
  }
}

/**
 * The main hub for interacting with the Discord API and the starting point for any bot, extended to
 * include:
 * - `DisTube` instance used to play music.
 * - `Collection`s of commands, message components, and modals, along with their loaders.
 * - Listeners for events, along with a loader.
 */
export class ExtendedClient<Ready extends boolean = boolean> extends Client<Ready> {
  /**
   * The `DisTube` instance used by the bot to play music.
   * @see {@link https://distube.js.org/#/ DisTube} for greater detail.
   */
  public readonly distube = new DisTube(this, {
    plugins: [
      new SoundCloudPlugin(),
      new SpotifyPlugin({ emitEventsAfterFetching: true }),
      new YtDlpPlugin(),
    ],
    emitNewSongOnly: true,
    leaveOnFinish: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
    searchSongs: 5,
    searchCooldown: 30,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
  });

  /** The collection storing all of the bot's slash commands' cooldowns. */
  public cooldowns = new Collection<string, Collection<string, number>>();

  /** The collection storing all of the bot's context menu commands. */
  public contextMenuCommands = new Collection<string, ContextMenuCommand>();
  /** The collection storing all of the bot's slash commands. */
  public slashCommands = new Collection<string, SlashCommand>();
  /** The collection storing all of the bot's buttons. */
  public buttons = new Collection<string, Button>();
  /** The collection storing all of the bot's select menus. */
  public selectMenus = new Collection<string, SelectMenu>();
  /** The collection storing all of the bot's modals. */
  public modals = new Collection<string, Modal>();

  /** Loads the command files into their respective command collections. */
  public async loadCommands() {
    const commandsPath = join(import.meta.dirname, '..', 'commands');
    const commandFolders = await readdir(commandsPath);

    for (const folder of commandFolders) {
      const folderPath = join(commandsPath, folder);
      const folderStats = await stat(folderPath);

      if (!folderStats.isDirectory()) continue;

      const commandSubfolders = await readdir(folderPath);

      if (folder === 'contextMenu') {
        for (const subfolder of commandSubfolders) {
          const subfolderPath = join(commandsPath, folder, subfolder);
          const subfolderStats = await stat(subfolderPath);

          if (!subfolderStats.isDirectory()) continue;

          const commandFiles = await readdir(subfolderPath);

          for (const file of commandFiles) {
            if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

            const filePath = join(commandsPath, folder, subfolder, file);
            const command = (await import(filePath) as { default: ContextMenuCommand }).default;

            if (isCommand(command)) this.contextMenuCommands.set(command.data.name, command);
            else logger.warn('A context menu command is missing a required "data" or "execute" property. Skipping...', { filePath });
          }
        }
      }
      else if (folder === 'slash') {
        for (const subfolder of commandSubfolders) {
          const subfolderPath = join(commandsPath, folder, subfolder);
          const subfolderStats = await stat(subfolderPath);

          if (!subfolderStats.isDirectory()) continue;

          const commandFiles = await readdir(subfolderPath);

          for (const file of commandFiles) {
            if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

            const filePath = join(commandsPath, folder, subfolder, file);
            const command = (await import(filePath) as { default: SlashCommand }).default;

            if (isCommand(command)) this.slashCommands.set(command.data.name, command);
            else logger.warn('A slash command is missing a required "data" or "execute" property. Skipping...', { filePath });
          }
        }
      }
    }
  }
  /** Loads the component files into their respective component collections. */
  public async loadComponents() {
    const componentsPath = join(import.meta.dirname, '..', 'components');
    const componentFolders = await readdir(componentsPath);

    for (const folder of componentFolders) {
      const folderPath = join(componentsPath, folder);
      const folderStats = await stat(folderPath);

      if (!folderStats.isDirectory()) continue;

      const componentFiles = await readdir(folderPath);

      if (folder === 'buttons') {
        for (const file of componentFiles) {
          if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

          const filePath = join(componentsPath, folder, file);
          const component = (await import(filePath) as { default: Button }).default;

          if (isComponent(component)) this.buttons.set(component.data.customId, component);
          else logger.warn('A button is missing a required "data" or "execute" property. Skipping...', { filePath });
        }
      }
      else if (folder === 'modals') {
        for (const file of componentFiles) {
          if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

          const filePath = join(componentsPath, folder, file);
          const component = (await import(filePath) as { default: Modal }).default;

          if (isComponent(component)) this.modals.set(component.data.customId, component);
          else logger.warn('A modal is missing a required "data" or "execute" property. Skipping...', { filePath });
        }
      }
      else if (folder === 'selectMenus') {
        for (const file of componentFiles) {
          if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

          const filePath = join(componentsPath, folder, file);
          const component = (await import(filePath) as { default: SelectMenu }).default;

          if (isComponent(component)) this.selectMenus.set(component.data.customId, component);
          else logger.warn('A select menu is missing a required "data" or "execute" property. Skipping...', { filePath });
        }
      }
    }
  }
  /** Loads the event files into their respective event listeners. */
  public async loadEvents() {
    const eventsPath = join(import.meta.dirname, '..', 'events');
    const eventFolders = await readdir(eventsPath);

    for (const folder of eventFolders) {
      const folderPath = join(eventsPath, folder);
      const folderStats = await stat(folderPath);

      if (!folderStats.isDirectory()) continue;

      const eventFiles = await readdir(folderPath);

      if (folder === 'client') {
        for (const file of eventFiles) {
          if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

          const filePath = join(eventsPath, folder, file);
          const event = (await import(filePath) as { default: ClientEvent }).default;

          if (isEvent(event)) {
            this[event.once
              ? 'once'
              : 'on'](event.name, async (...args) => event.execute(...args));
          }
          else {
            logger.warn('An event is missing a required "name" or "execute" property. Skipping...', { filePath });
          }
        }
      }
      else if (folder === 'distube') {
        for (const file of eventFiles) {
          if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

          const filePath = join(eventsPath, folder, file);
          const event = (await import(filePath) as { default: DisTubeEvent }).default;

          if (isEvent(event)) {
            this.distube[event.once
              ? 'once'
              : 'on'](event.name, async (...args: DisTubeEvents[keyof DisTubeEvents]) => event.execute(...args));
          }
          else {
            logger.warn('An event is missing a required "name" or "execute" property. Skipping...', { filePath });
          }
        }
      }
      else if (folder === 'mongoose') {
        for (const file of eventFiles) {
          const { connection } = mongoose;

          if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

          const filePath = join(eventsPath, folder, file);
          const event = (await import(filePath) as { default: MongooseEvent }).default;

          if (isEvent(event)) {
            connection[event.once
              ? 'once'
              : 'on'](event.name, (...args: unknown[]) => { event.execute(...args); });
          }
          else {
            logger.warn('An event is missing a required "name" or "execute" property. Skipping...', { filePath });
          }
        }
      }
    }
  }
}
