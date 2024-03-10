import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

/** Describes the definitions, properties, and execution of a command. */
export interface Command {
  /** The number of seconds the user has to wait to reuse this command. */
  cooldown?: number;
  /** The API-compatible JSON data for this command. */
  data:
    | ContextMenuCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder
  ;
  /**
   * Executes the response to this command being ran.
   * @param interaction The interaction of this command being ran.
   */
  execute(interaction: CommandInteraction): Promise<void>;
}

/**
 * Describes the definitions, properties, and execution of a context menu command.
 * @see {@link https://discordjs.guide/interactions/context-menus.html discord.js guide} for a guide.
 */
export interface ContextMenuCommand extends Command {
  /** The API-compatible JSON data for this context menu command. */
  data: ContextMenuCommandBuilder;
  /**
   * Executes the response to this context menu command being ran.
   * @param interaction The interaction of this context menu command being ran.
   */
  execute(interaction: ContextMenuCommandInteraction): Promise<void>;
}

/**
 * Describes the definitions, properties, and execution of a slash command.
 * @see {@link https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files discord.js guide} for a guide.
 */
export interface SlashCommand extends Command {
  /** The API-compatible JSON data for this slash command. */
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder;
  /**
   * Automatically completes the values of this slash command's options.
   * @param interaction The interaction of this slash command's options' values being filled.
   * @see {@link https://discordjs.guide/slash-commands/autocomplete.html discord.js Guide} for a guide.
   */
  autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
  /**
   * Executes the response to this slash command being ran.
   * @param interaction The interaction of this slash command being ran.
   */
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
