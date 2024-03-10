import type { Snowflake } from 'discord.js';
import { type Model, model, Schema } from 'mongoose';

/** Describes the properties of a warning `Document`. */
export interface WarningDoc {
  /** The id of the `user` who received the warning. */
  userId: Snowflake;
  /** The id of the `guild` that the warning was given at. */
  guildId: Snowflake;
  /** The reason for receiving the warning. */
  reason: string;
  /** The id of the moderator who gave the warning. */
  enforcerId: string;
  /** The time that this user was warned. */
  givenAt: Date;
}

/** Describes the virtual properties of a warning `Document`. */
export interface WarningVirtuals {
  /** The timestamp the user was warned at. */
  givenTimestamp: number;
}

/** The model constructor compiled from the warning `Schema` definitions. */
export type WarningModel = Model<WarningDoc, object, object, WarningVirtuals>;

const warningSchema = new Schema<WarningDoc, WarningModel, object, object, WarningVirtuals, object>({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  enforcerId: {
    type: String,
    required: true,
  },
}, { timestamps: {
  createdAt: 'givenAt',
  updatedAt: false,
} });

warningSchema
  .virtual('givenTimestamp')
  .get(function givenTimestamp() {
    return this.givenAt.getTime();
  });

export const Warning = model<WarningDoc, WarningModel>('Warning', warningSchema);
