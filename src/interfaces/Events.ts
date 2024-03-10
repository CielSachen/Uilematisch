import type { ClientEvents } from 'discord.js';
import type { DisTubeEvents } from 'distube';

/** Describes the properties and execution of an event. */
export interface Event {
  /** The name of this event. */
  name: string;
  /** Whether to only emit this event once. */
  once?: boolean;
  /**
   * Executes the response to this event being emitted.
   * @param args The event's arguments.
   */
  execute(...args: unknown[]): void | Promise<void>;
}

/**
 * Describes the properties and execution of a `discord.js` client event.
 * @see {@link https://discordjs.guide/creating-your-bot/event-handling.html#individual-event-files discord.js guide} for a guide.
 */
export interface ClientEvent<K extends keyof ClientEvents = keyof ClientEvents> extends Event {
  /** The name of this client event. */
  name: K;
  /**
   * Executes the response to this `discord.js` event being emitted.
   * @param args The `discord.js` event's arguments.
   */
  execute(...args: ClientEvents[K]): void | Promise<void>;
}

/** Describes the properties and execution of a `distube` event. */
export interface DisTubeEvent<K extends keyof DisTubeEvents = keyof DisTubeEvents> extends Event {
  /** The name of this DisTube event. */
  name: K;
  /**
   * Executes the response to the `distube` event being emitted.
   * @param args The `distube` event's arguments.
   */
  execute(...args: DisTubeEvents[K]): void | Promise<void>;
}

/** The names of the events emitted by `mongoose`. */
export type MongooseEvents =
  | 'connecting'
  | 'connected'
  | 'open'
  | 'disconnecting'
  | 'disconnected'
  | 'close'
  | 'reconnected'
  | 'error'
;

/** Describes the properties and execution of a `mongoose` event. */
export interface MongooseEvent extends Event {
  /** The name of this mongoose event. */
  name: MongooseEvents;
  /**
   * Executes the response to this `mongoose` event being emitted.
   * @param args The `mongoose` event's arguments.
   */
  execute(...args: unknown[]): void;
}
