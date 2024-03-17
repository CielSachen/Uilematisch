import 'dotenv/config';

import type { ImageURLOptions } from 'discord.js';
import { z } from 'zod';

export const configSchema = z.object({
  databaseURI: z.string().startsWith('mongodb+srv://'),
  discord: z.object({
    bot: z.object({
      id: z.string(),
      token: z.string(),
      guildId: z.string(),
      ownerId: z.string(),
    }),
    imageUrl: z.object({
      extension: z.union([
        z.literal('webp'),
        z.literal('png'),
        z.literal('jpg'),
        z.literal('jpeg'),
        z.literal('gif'),
      ]),
      size: z.union([
        z.literal(16),
        z.literal(32),
        z.literal(64),
        z.literal(128),
        z.literal(256),
        z.literal(512),
        z.literal(1024),
        z.literal(2048),
        z.literal(4096),
      ]),
    }),
  }),
  environment: z
    .union([z.literal('development'), z.literal('production')])
    .optional()
    .default('production'),
  logLevel: z
    .union([
      z.literal('error'),
      z.literal('warn'),
      z.literal('info'),
      z.literal('http'),
      z.literal('verbose'),
      z.literal('debug'),
      z.literal('silly'),
    ])
    .optional()
    .default('info'),
  tenorKey: z.string(),
});

export const config = configSchema.parse({
  databaseURI: process.env.MONGODB_URI,
  discord: {
    bot: {
      id: process.env.APPLICATION_ID,
      token: process.env.DISCORD_TOKEN,
      guildId: process.env.GUILD_ID,
      ownerId: process.env.OWNER_ID,
    },
    imageUrl: {
      extension: 'png',
      size: 1_024,
    } satisfies ImageURLOptions,
  },
  environment: process.env.NODE_ENV || 'production',
  logLevel: process.env.LOG_LEVEL || 'info',
  tenorKey: process.env.TENOR_KEY,
});
