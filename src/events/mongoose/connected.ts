import type { MongooseEvent } from '@interfaces';
import { logger } from '@utils';
import mongoose from 'mongoose';

export default {
  name: 'connected',
  once: true,
  execute() {
    const { connection } = mongoose;

    logger.info('Successfully established a connection to the MongoDB server.', { databaseName: connection.db.databaseName });
  },
} satisfies MongooseEvent;
