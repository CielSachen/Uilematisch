import { ActivityType, GuildNSFWLevel, type PresenceStatus, type UserFlags } from 'discord.js';
import { RepeatMode } from 'distube';

export const activityType = Object.freeze<Record<ActivityType, string>>({
  [ActivityType.Playing]: 'Playing',
  [ActivityType.Streaming]: 'Streaming',
  [ActivityType.Listening]: 'Listening to',
  [ActivityType.Watching]: 'Watching',
  [ActivityType.Custom]: '',
  [ActivityType.Competing]: 'Competing in',
});

export const badges = Object.freeze<Partial<Record<keyof typeof UserFlags, string>>>({
  Staff: '<:discordstaff:1202311464711360616>',
  Partner: '<:discordpartner:1202311461439807538>',
  Hypesquad: '<:hypesquadevents:1202311477483282442>',
  BugHunterLevel1: '<:discordbughunter1:1202311446319612017>',
  HypeSquadOnlineHouse1: '<:hypesquadbravery:1202311470629523516>',
  HypeSquadOnlineHouse2: '<:hypesquadbrilliance:1202311474048155648>',
  HypeSquadOnlineHouse3: '<:hypesquadbalance:1202311468666593310>',
  PremiumEarlySupporter: '<:discordearlysupporter:1202311452107735060>',
  BugHunterLevel2: '<:discordbughunter2:1202311449851207750>',
  VerifiedDeveloper: '<:discordbotdev:1202311442163048578>',
  CertifiedModerator: '<:discordmod:1202311455941066884>',
  BotHTTPInteractions: '<:supportscommands:1202311479949533264>',
  ActiveDeveloper: '<:activedeveloper:1202311435615477842>',
});

export const guildNsfwLevel = Object.freeze<Record<GuildNSFWLevel, string>>({
  [GuildNSFWLevel.Default]: 'Default',
  [GuildNSFWLevel.Explicit]: 'Explicit',
  [GuildNSFWLevel.Safe]: 'Safe',
  [GuildNSFWLevel.AgeRestricted]: 'Age-restricted',
});

export const presenceStatus = Object.freeze<Record<PresenceStatus, string>>({
  online: '🟢 Online',
  idle: '🌙 Idle',
  dnd: '⛔ Do Not Disturb',
  invisible: 'Invisible',
  offline: 'Offline',
});

export const repeatMode = Object.freeze<Record<RepeatMode, string>>({
  [RepeatMode.DISABLED]: 'Off',
  [RepeatMode.SONG]: 'Current Song',
  [RepeatMode.QUEUE]: 'Whole Queue',
});
