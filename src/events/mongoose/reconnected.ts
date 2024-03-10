import type { MongooseEvent } from '@interfaces';
import { logger } from '@utils';
import mongoose from 'mongoose';

export default {
  name: 'reconnected',
  execute() {
    const { connection } = mongoose;

    logger.info('Successfully reestablished the connection to the MongoDB server.', { databaseName: connection.db.databaseName });
  },
} satisfies MongooseEvent;
