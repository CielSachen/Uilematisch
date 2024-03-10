import { config } from '@config';
import { colors, enums } from '@constants';
import type { SlashCommand } from '@interfaces';
import {
  bold,
  codeBlock,
  EmbedBuilder,
  inlineCode,
  SlashCommandBuilder,
} from 'discord.js';
import { RepeatMode } from 'distube';

export default {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Play a track in a voice channel')
    .addSubcommand((subcommand) => subcommand
      .setName('back')
      .setDescription('Play the previous track in the queue'))
    .addSubcommand((subcommand) => subcommand
      .setName('filter')
      .setDescription('Apply a filter to the queue')
      .addStringOption((option) => option
        .setName('type')
        .setDescription('The type of filter to apply')
        .setRequired(true)
        .addChoices(
          {
            name: 'Off',
            value: 'off',
          },
          {
            name: '3D',
            value: '3d',
          },
          {
            name: 'BassBoost',
            value: 'bassboost',
          },
          {
            name: 'Echo',
            value: 'Echo',
          },
          {
            name: 'Flanger',
            value: 'flanger',
          },
          {
            name: 'Gate',
            value: 'gate',
          },
          {
            name: 'Haas',
            value: 'haas',
          },
          {
            name: 'Karaoke',
            value: 'karaoke',
          },
          {
            name: 'Nightcore',
            value: 'nightcore',
          },
          {
            name: 'Reverse',
            value: 'reverse',
          },
          {
            name: 'Vaporwave',
            value: 'vaporwave',
          },
          {
            name: 'mcompand',
            value: 'mcompand',
          },
          {
            name: 'Phaser',
            value: 'phaser',
          },
          {
            name: 'Tremolo',
            value: 'tremolo',
          },
          {
            name: 'Surround',
            value: 'surround',
          },
          {
            name: 'Earwax',
            value: 'earwax',
          },
        )))
    .addSubcommand((subcommand) => subcommand
      .setName('leave')
      .setDescription('Make the bot leave the voice channel that it\'s currently in'))
    .addSubcommand((subcommand) => subcommand
      .setName('loop')
      .setDescription('Loop the track that\'s currently playing or the entire queue')
      .addIntegerOption((option) => option
        .setName('mode')
        .setDescription('The repeat mode to apply')
        .setRequired(true)
        .addChoices(
          {
            name: 'Off',
            value: RepeatMode.DISABLED,
          },
          {
            name: 'Current Song',
            value: RepeatMode.SONG,
          },
          {
            name: 'Entire Queue',
            value: RepeatMode.QUEUE,
          },
        )))
    .addSubcommand((subcommand) => subcommand
      .setName('pause')
      .setDescription('Pause the track that\'s currently playing'))
    .addSubcommand((subcommand) => subcommand
      .setName('play')
      .setDescription('Play a track in the voice channel you\'re currently in')
      .addStringOption((option) => option
        .setName('track')
        .setDescription('The track to play, track name or URL')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('queue')
      .setDescription('Display the current queue'))
    .addSubcommand((subcommand) => subcommand
      .setName('resume')
      .setDescription('Resume the paused track'))
    .addSubcommand((subcommand) => subcommand
      .setName('skip')
      .setDescription('Play the next track in the queue'))
    .addSubcommand((subcommand) => subcommand
      .setName('stop')
      .setDescription('Stop the queue'))
    .addSubcommand((subcommand) => subcommand
      .setName('time')
      .setDescription('Display the track\'s progress'))
    .addSubcommand((subcommand) => subcommand
      .setName('volume')
      .setDescription('Adjust the queue\'s volume')
      .addIntegerOption((option) => option
        .setName('percentage')
        .setDescription('The percentage to set the volume to')
        .setMaxValue(100)
        .setMinValue(0)
        .setRequired(true)))
    .setDMPermission(false),
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const member = await guild.members.fetch(interaction.user);

    if (!member.voice.channel) {
      await interaction.reply({
        content: 'You must be in a voice channel to use this command.',
        ephemeral: true,
      });
      return;
    }

    const subcommand = options.getSubcommand();

    if (subcommand === 'leave') {
      client.distube.voices.leave(guild.id);

      await interaction.reply(`Left <#${member.voice.channel.id}>.`);
    }
    else if (subcommand === 'play') {
      const givenTrack = options.getString('track', true);

      await interaction.reply(`${interaction.user.toString()} requested to play ${givenTrack}, please wait...`);

      await client.distube.play(member.voice.channel, givenTrack, {
        member: member,
        textChannel: interaction.channel,
      });
    }

    const queue = client.distube.getQueue(guild.id);

    if (subcommand === 'back') {
      if (queue.previousSongs.length < 1) {
        await interaction.reply({
          content: 'The current track is the first track in the queue.',
          ephemeral: true,
        });
        return;
      }

      await queue.previous();

      await interaction.reply('⏮️ Playing the previous track...');
    }
    else if (subcommand === 'filter') {
      const chosenFilter = options.getString('type', true);

      if (chosenFilter === 'off') {
        queue.filters.clear();

        await interaction.reply('Removed all filters applied to the queue.');
        return;
      }
      else if (queue.filters.has(chosenFilter)) {
        queue.filters.remove(chosenFilter);

        await interaction.reply(`<Removed the ${inlineCode(chosenFilter)} filter from the queue.`);
      }
      else {
        queue.filters.add(chosenFilter);

        await interaction.reply(`Applied the ${inlineCode(chosenFilter)} filter to the queue.`);
      }

      await interaction.followUp(`Current queue filters: ${codeBlock(queue.filters.names.join('\n') || 'None')}`);
    }
    else if (subcommand === 'loop') {
      if (!queue) {
        await interaction.reply({
          content: 'There is/are no track/s in the queue to loop.',
          ephemeral: true,
        });
        return;
      }

      const chosenMode = options.getInteger('mode', true);

      queue.setRepeatMode(chosenMode);

      await interaction.reply(`Set the repeat mode to ${inlineCode(enums.repeatMode[queue.repeatMode])}.`);
    }
    else if (subcommand === 'pause') {
      if (!queue) {
        await interaction.reply({
          content: 'There is currently no track to pause.',
          ephemeral: true,
        });
        return;
      }

      queue.pause();

      await interaction.reply('⏸️ Paused the track!');
    }
    else if (subcommand === 'resume') {
      if (!queue) {
        await interaction.reply({
          content: 'There is currently no song to resume.',
          ephemeral: true,
        });
        return;
      }

      queue.resume();

      await interaction.reply('▶️ Resumed the track!');
    }
    else if (subcommand === 'skip') {
      if (queue.songs.length <= 1) {
        await interaction.reply({
          content: 'There are no more tracks left in the queue.',
          ephemeral: true,
        });
        return;
      }

      await queue.skip();

      await interaction.reply('⏭️ Playing the next track...');
    }
    else if (subcommand === 'stop') {
      if (!queue) {
        await interaction.reply({
          content: 'There is/are no track/s in the queue to stop playing.',
          ephemeral: true,
        });
        return;
      }

      await queue.stop();

      await interaction.reply('⏹️ Stopped the entire queue.');
    }
    else if (subcommand === 'volume') {
      const volume = options.getInteger('percentage', true);

      if (volume === queue.volume) {
        await interaction.reply({
          content: `The volume is already at ${inlineCode(volume.toString())}%.`,
          ephemeral: true,
        });
        return;
      }

      queue.setVolume(volume);

      await interaction.reply(`${volume > 0
        ? '🔈'
        : volume > 33
          ? '🔉'
          : volume > 66
            ? '🔊'
            : '🔇'} Adjusted the volume to ${inlineCode(queue.volume.toString())}%.`);
    }

    const embed = new EmbedBuilder().setColor(colors.distube);

    if (subcommand === 'queue') {
      if (!queue) {
        await interaction.reply({
          content: 'There is nothing in the queue right now.',
          ephemeral: true,
        });
        return;
      }

      const currentSong = queue.songs[0];
      const queueSongsList = queue.songs
        .slice(1)
        .map((song, position) => `${position}. ${inlineCode(song.name)} - ${inlineCode(song.formattedDuration)}`)
        .join('\n');

      embed.addFields(
        {
          name: 'Currently Playing',
          value: `${inlineCode(currentSong.name)} - ${inlineCode(currentSong.formattedDuration)}`,
        },
        {
          name: 'Queue',
          value: queueSongsList || 'No more songs',
        },
      );

      await interaction.reply({ embeds: [embed] });
    }
    else if (subcommand === 'time') {
      if (!queue) {
        await interaction.reply({
          content: 'There is currently no track playing.',
          ephemeral: true,
        });
        return;
      }

      const song = queue.songs[0];
      const queuePercentDuration = Math.round(queue.currentTime / (queue.duration / 100));

      embed
        .setTitle(song.name)
        .setURL(song.url)
        .setAuthor({
          name: song.member.displayName,
          iconURL: song.user.displayAvatarURL(config.discord.imageUrl),
        })
        .setDescription(bold(`${queue.formattedCurrentTime} / ${queue.formattedDuration} (${queuePercentDuration}%)`))
        .setThumbnail(song.thumbnail ?? 'https://images.emojiterra.com/twitter/v14.0/1024px/1f4bf.png');

      await interaction.reply({ embeds: [embed] });
    }
  },
} satisfies SlashCommand;
