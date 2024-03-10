import type { Button } from '@interfaces';

export default {
  data: { customId: 'deleteMessage' },
  async execute(interaction) {
    await interaction.message.delete();
  },
} satisfies Button;
