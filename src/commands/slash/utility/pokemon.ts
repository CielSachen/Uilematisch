import type { SlashCommand } from '@interfaces';
import { capitalize } from '@utils';
import { EmbedBuilder, inlineCode, SlashCommandBuilder } from 'discord.js';
import Pokedex from 'pokedex-promise-v2';

export default {
  data: new SlashCommandBuilder()
    .setName('pokemon')
    .setDescription('Search the PokéAPI for a given Pokémon')
    .addStringOption((option) => option
      .setName('name')
      .setDescription('The name of Pokémon to search for')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('form')
      .setDescription('The Pokémon\'s regional form')
      .setChoices(
        {
          name: 'Alolan',
          value: '-alola',
        },
        {
          name: 'Galarian',
          value: '-galar',
        },
        {
          name: 'Hisuian',
          value: '-hisui',
        },
        {
          name: 'Paldean',
          value: '-paldea',
        },
        {
          name: 'Mega',
          value: '-mega',
        },
        {
          name: 'Mega X',
          value: '-mega-x',
        },
        {
          name: 'Mega Y',
          value: '-mega-y',
        },
        {
          name: 'Primal',
          value: '-primal',
        },
      ))
    .addBooleanOption((option) => option
      .setName('shiny')
      .setDescription('Whether to display a shiny version of the pokémon')),
  async execute(interaction) {
    const { options } = interaction;

    const givenPokemon = options.getString('name');
    const chosenForm = options.getString('form');

    const pokedex = new Pokedex();

    const pokemon = await pokedex
      .getPokemonByName(`${givenPokemon}${chosenForm ?? ''}`)
      .catch((error) => {
        if (error instanceof Error && error.message.includes('404')) return error.message;
      });
    const pokemonName = chosenForm
      ? chosenForm.includes('-x') || chosenForm.includes('-y')
        ? capitalize(`${chosenForm.substring(0, 4)} ${givenPokemon} ${chosenForm.substring(5)}`)
        : capitalize(`${chosenForm} ${givenPokemon}`)
      : capitalize(givenPokemon);

    if (typeof pokemon === 'string') {
      await interaction.reply({
        content: `There was no Pokémon with the name ${inlineCode(pokemonName)} found.`,
        ephemeral: true,
      });
      return;
    }

    const shiny = options.getBoolean('shiny');

    const embed = new EmbedBuilder()
      .setColor('#C80D29')
      .setTitle(`#${pokemon.id}${chosenForm
        ? ' (PokéAPI):'
        : ':'} ${pokemonName}`)
      .setThumbnail(shiny
        ? pokemon.sprites.front_shiny
        : pokemon.sprites.front_default)
      .addFields(
        {
          name: 'Type/s',
          value: pokemon.types
            .map((type) => capitalize(type.type.name))
            .join(', '),
        },
        {
          name: 'Height',
          value: `${pokemon.height / 10} m`,
          inline: true,
        },
        {
          name: 'Weight',
          value: `${pokemon.weight / 10} kg`,
          inline: true,
        },
        {
          name: 'Base Experience',
          value: `${pokemon.base_experience ?? 'Unknown'}`,
        },
        {
          name: 'HP',
          value: pokemon.stats[0].base_stat.toLocaleString(),
          inline: true,
        },
        {
          name: 'Attack',
          value: pokemon.stats[1].base_stat.toLocaleString(),
          inline: true,
        },
        {
          name: 'Defense',
          value: pokemon.stats[2].base_stat.toLocaleString(),
          inline: true,
        },
        {
          name: 'Special Attack',
          value: pokemon.stats[3].base_stat.toLocaleString(),
          inline: true,
        },
        {
          name: 'Special Defense',
          value: pokemon.stats[4].base_stat.toLocaleString(),
          inline: true,
        },
        {
          name: 'Speed',
          value: pokemon.stats[5].base_stat.toLocaleString(),
          inline: true,
        },
        {
          name: 'Ability/ies',
          value: pokemon.abilities
            .map((ability) => ability.is_hidden
              ? `${capitalize(ability.ability.name.replace('-', ' '))} (Hidden)`
              : capitalize(ability.ability.name.replace('-', ' ')))
            .join(', '),
        },
        {
          name: 'Games Obtainable In',
          value: pokemon.game_indices
            .map((game) => capitalize(game.version.name.replace('-', ' ')))
            .join(', ') || 'Unknown',
        },
      );

    await interaction.reply({ embeds: [embed] });
  },
} satisfies SlashCommand;
