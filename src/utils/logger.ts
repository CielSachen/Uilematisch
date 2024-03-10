import 'winston-daily-rotate-file';

import { config } from '@config';
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

if (config.environment !== 'production') {
  const consoleTransport = new transports.Console({
    level: config.logLevel,
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
