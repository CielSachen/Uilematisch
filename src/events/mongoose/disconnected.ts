import type { MongooseEvent } from '@interfaces';
import { logger } from '@utils';
import mongoose from 'mongoose';

export default {
  name: 'disconnected',
  execute() {
    const { connection } = mongoose;

    logger.warn('Connection to the MongoDB server had been lost.', { databaseName: connection.db.databaseName });
  },
} satisfies MongooseEvent;
