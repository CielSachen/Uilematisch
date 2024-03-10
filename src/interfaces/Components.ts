import type { AnySelectMenuInteraction, ButtonInteraction, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';

/** Describes the definitions and execution of a component. */
export interface Component {
  /** The data for this component. */
  data: {
    /** The set `customId` of this component. */
    customId: string;
  };
  /**
   * Executes the response to this component.
   * @param interaction The interaction of this component.
   */
  execute(interaction: MessageComponentInteraction | ModalSubmitInteraction): Promise<void>;
}

/** Describes the definitions and execution of a message component. */
export interface MessageComponent extends Component {
  /**
   * Executes the response to this message component.
   * @param interaction The interaction of this message component.
   */
  execute(interaction: MessageComponentInteraction): Promise<void>;
}

/**
 * Describes the definitions and execution of a button.
 * @see {@link https://discordjs.guide/message-components/buttons.html discord.js guide} for a guide.
 */
export interface Button extends MessageComponent {
  /**
   * Executes the response to this button being pressed.
   * @param interaction The interaction of this button being pressed.
   */
  execute(interaction: ButtonInteraction): Promise<void>;
}

/**
 * Describes the definitions and execution of a select menu.
 * @see {@link https://discordjs.guide/message-components/select-menus.html discord.js guide} for a guide.
 */
export interface SelectMenu extends MessageComponent {
  /**
   * Executes the response to this select menu option being chosen.
   * @param interaction The interaction of this select menu option being chosen.
   */
  execute(interaction: AnySelectMenuInteraction): Promise<void>;
}

/**
 * Describes the definitions and execution of a modal.
 * @see {@link https://discordjs.guide/interactions/modals.html discord.js guide} for a guide.
 */
export interface Modal extends Component {
  /**
   * Executes the response to this modal being submitted.
   * @param interaction The interaction of this modal being submitted.
   */
  execute(interaction: ModalSubmitInteraction): Promise<void>;
}

