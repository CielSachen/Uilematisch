import type { MongooseEvent } from '@interfaces';
import { logger } from '@utils';

export default {
  name: 'connecting',
  once: true,
  execute() {
    logger.verbose('Started making initial connection to the MongoDB server.');
  },
} satisfies MongooseEvent;
