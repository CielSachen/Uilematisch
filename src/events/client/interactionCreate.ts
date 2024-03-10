import type { ClientEvent, Command, MessageComponent } from '@interfaces';
import { logger } from '@utils';
import {
  Collection,
  Events,
  inlineCode,
  type InteractionReplyOptions,
  InteractionType,
  time,
} from 'discord.js';
import { DateTime } from 'luxon';

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const { client } = interaction;

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const slashCommand = client.slashCommands.get(interaction.commandName);

      if (!slashCommand) {
        logger.error(`No command matching "${interaction.commandName}" was found.`, { commandName: interaction.commandName });
        return;
      }

      try {
        await slashCommand.autocomplete(interaction);
      }
      catch (error) {
        logger.error(`Failed to execute the autocomplete for "${interaction.commandName}".`, {
          commandName: interaction.commandName,
          error,
        });
      }
    }
    else if (interaction.type === InteractionType.ApplicationCommand) {
      let command: Command;

      if (interaction.isChatInputCommand()) command = client.slashCommands.get(interaction.commandName);
      else if (interaction.isContextMenuCommand()) command = client.contextMenuCommands.get(interaction.commandName);

      if (!command) {
        logger.error(`No command matching "${interaction.commandName}" was found.`, { commandName: interaction.commandName });
        return;
      }

      if (!client.cooldowns.has(command.data.name)) client.cooldowns.set(command.data.name, new Collection);

      const timestamps = client.cooldowns.get(command.data.name);
      const cooldown = (command.cooldown ?? 3) * 1_000;
      const currentTime = Date.now();

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldown;

        if (currentTime < expirationTime) {
          const expiredTimestamp = DateTime.fromMillis(expirationTime).toUnixInteger();

          await interaction.reply({
            content: `Please wait, you are on a cooldown for ${inlineCode(command.data.name)}. You can use it again ${time(expiredTimestamp, 'R')}`,
            ephemeral: true,
          });
          return;
        }
      }

      timestamps.set(interaction.user.id, currentTime);

      setTimeout(() => timestamps.delete(interaction.user.id), cooldown);

      try {
        await command.execute(interaction);
      }
      catch (error) {
        logger.error(`Failed to execute command "${interaction.commandName}".`, {
          commandName: interaction.commandName,
          error,
        });

        const errorReply = {
          content: 'There was an error while executing this command!',
          ephemeral: true,
        } satisfies InteractionReplyOptions;

        if (interaction.replied || interaction.deferred) await interaction.followUp(errorReply);
        else await interaction.reply(errorReply);
      }
    }
    else if (interaction.type === InteractionType.MessageComponent) {
      let messageComponent: MessageComponent;

      if (interaction.isButton()) messageComponent = client.buttons.get(interaction.customId);
      else if (interaction.isAnySelectMenu()) messageComponent = client.selectMenus.get(interaction.customId);

      if (!messageComponent) {
        logger.error(`No message component matching the ID "${interaction.customId}" was found.`, { customId: interaction.customId });
        return;
      }

      try {
        await messageComponent.execute(interaction);
      }
      catch (error) {
        logger.error(`Failed to execute message component "${interaction.customId}".`, {
          customId: interaction.customId,
          error,
        });
      }
    }
    else if (interaction.type === InteractionType.ModalSubmit) {
      const modal = client.modals.get(interaction.customId);

      if (!modal) {
        logger.error(`No modal matching the ID "${interaction.customId}" was found.`, { customId: interaction.customId });
        return;
      }

      try {
        await modal.execute(interaction);
      }
      catch (error) {
        logger.error(`Failed to execute modal "${interaction.customId}".`, {
          customId: interaction.customId,
          error,
        });
      }
    }
  },
} satisfies ClientEvent<Events.InteractionCreate>;
