import { ButtonBuilder, ButtonStyle } from 'discord.js';

export const deleteMessage = new ButtonBuilder()
  .setCustomId('deleteMessage')
  .setStyle(ButtonStyle.Danger)
  .setEmoji('🗑️');
