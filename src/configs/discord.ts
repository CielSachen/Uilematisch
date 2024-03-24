import type { ImageURLOptions } from 'discord.js';

export const imageURLOptions = Object.freeze({
  extension: 'png',
  size: 1_024,
}) satisfies ImageURLOptions;
