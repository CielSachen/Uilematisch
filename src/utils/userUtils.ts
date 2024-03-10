import { enums } from '@constants';
import { capitalize } from '@utils';
import { ActivityType, bold, type GuildMember } from 'discord.js';

/**
 * Gets the status of a guild member and styles it into a string.
 * @param member The guild member.
 * @returns The stylized string of the status.
 */
export const getMemberStatus = (member: GuildMember) => {
  if (!member.presence) return 'Offline / Invisible';

  return `${enums.presenceStatus[member.presence.status]} (${capitalize(Object.keys(member.presence.clientStatus).toString())})`;
};

/**
 * Gets the activities of a guild member and styles them into strings.
 * @param member The guild member.
 * @returns The stylized strings of the activities.
 */
export const getMemberActivities = (member: GuildMember) => {
  if (!member.presence.activities) return;

  const activities = member.presence.activities
    .filter((activity) => activity.type !== ActivityType.Custom)
    .map((activity) => `${enums.activityType[activity.type]} ${bold(activity.name)}`);
  const customActivity = member.presence.activities
    .filter((activity) => activity.type === ActivityType.Custom)
    .map((activity) => activity.emoji
      ? `${activity.emoji.toString()} ${activity.state}`
      : activity.state);

  if (customActivity.length >= 1) return [...activities, ...customActivity];
  else return activities;
};
