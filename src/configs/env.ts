import 'dotenv/config';

import { z } from 'zod';

export const envSchema = z
  .object({
    APPLICATION_ID: z.coerce.string(),
    DISCORD_TOKEN: z.string(),
    GUILD_ID: z.coerce.string(),
    LOG_LEVEL: z
      .enum([
        'error',
        'warn',
        'info',
        'http',
        'verbose',
        'debug',
        'silly',
      ])
      .optional()
      .default('info'),
    MONGODB_URI: z.string().startsWith('mongodb+srv://', { message: 'Invalid MongoDB SRV URI connection string.' }),
    NODE_ENV: z
      .enum(['development', 'production'])
      .optional()
      .default('production'),
    OWNER_ID: z.coerce.string(),
    TENOR_KEY: z.string(),
  })
  .strict()
  .catchall(z.string());

export const env = Object.freeze(envSchema.parse({
  APPLICATION_ID: process.env.APPLICATION_ID,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  GUILD_ID: process.env.GUILD_ID,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || 'production',
  OWNER_ID: process.env.OWNER_ID,
  TENOR_KEY: process.env.TENOR_KEY,
}));
