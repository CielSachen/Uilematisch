import type { Command, Component, Event } from '@interfaces';
import { ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js';
import { z } from 'zod';

/**
 * Checks whether a loaded structure is valid or not.
 * @param structure The loaded structure.
 * @returns Whether the loaded structure is valid or not.
 */
export type StructurePredicate<T extends object> = (structure: object) => structure is T;

/**
 * Checks whether a loaded structure is a command or not.
 * @param structure The loaded structure.
 * @returns Whether the loaded structure is a command or not.
 */
export const isCommand: StructurePredicate<Command> = (structure: object): structure is Command => {
  const commandSchema = z.object({
    cooldown: z.number().optional(),
    data: z.union([z.instanceof(SlashCommandBuilder), z.instanceof(ContextMenuCommandBuilder)]),
    execute: z.function(),
  });

  return commandSchema.safeParse(structure).success;
};

/**
 * Checks whether a loaded structure is a component or not.
 * @param structure The loaded structure.
 * @returns Whether the loaded structure is a component or not.
 */
export const isComponent: StructurePredicate<Component> = (structure: object): structure is Component => {
  const componentSchema = z.object({
    data: z.object({ customId: z.string() }),
    execute: z.function(),
  });

  return componentSchema.safeParse(structure).success;
};

/**
 * Checks whether a loaded structure is an event or not.
 * @param structure The loaded structure.
 * @returns Whether the loaded structure is an event or not.
 */
export const isEvent: StructurePredicate<Event> = (structure: object): structure is Event => {
  const eventSchema = z.object({
    name: z.string(),
    once: z.boolean().optional().default(false),
    execute: z.function(),
  });

  return eventSchema.safeParse(structure).success;
};
