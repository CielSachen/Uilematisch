import 'winston-daily-rotate-file';

import { env } from '@configs/env.js';
import { createLogger, format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';

const combinedTransport = new transports.DailyRotateFile({
  level: 'info',
  datePattern: 'YYYY-MM-DD',
  filename: 'combined-%DATE%.log',
  dirname: 'logs',
  maxFiles: '14d',
});
const errorTransport = new transports.DailyRotateFile({
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  filename: 'error-%DATE%.log',
  dirname: 'logs',
  maxFiles: '14d',
});

const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.splat(),
    format.timestamp(),
    format.json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [combinedTransport, errorTransport],
});

if (env.NODE_ENV !== 'production') {
  const consoleTransport = new transports.Console({
    level: env.LOG_LEVEL,
    format: format.combine(
      format.colorize({ all: true }),
      format.ms(),
      format.padLevels(),
      consoleFormat({
        showMeta: true,
        metaStrip: ['timestamp', 'service'],
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
          compact: Infinity,
        },
      }),
    ),
  });

  logger.add(consoleTransport);
}

export { logger };
