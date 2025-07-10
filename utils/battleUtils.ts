import { getPokemon, getPokemonList, getMoveDetails } from '../services/pokeapi';
import type { Pokemon, BattlePokemon, Move, MoveDetail, PokemonListItem, PokemonType } from '../types';
import { TYPE_EFFECTIVENESS } from '../constants.tsx';

const POKEMON_COUNT = 1025;

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateHp = (base: number, level: number): number => {
    if (base === 1) return 1; // Shedinja case
    return Math.floor(0.01 * (2 * base) * level) + level + 10;
};

const calculateStat = (base: number, level: number): number => {
    return Math.floor(0.01 * (2 * base) * level) + 5;
};

export const generateRandomTeam = async (
    teamSize: number, 
    onProgress: (message: string) => void
): Promise<BattlePokemon[]> => {
    const team: BattlePokemon[] = [];
    
    onProgress('Fetching Pokémon list...');
    const listResponse = await getPokemonList(POKEMON_COUNT);
    // Filter out alternate forms that might not have back sprites
    const availablePokemon = listResponse.results.filter(p => !p.name.includes('-'));
    
    const selectedIndices = new Set<number>();
    while (selectedIndices.size < teamSize) {
        selectedIndices.add(Math.floor(Math.random() * availablePokemon.length));
    }

    const pokemonPromises = Array.from(selectedIndices).map(index => {
        const pokemonInfo = availablePokemon[index];
        onProgress(`Fetching data for ${pokemonInfo.name}...`);
        return getPokemon(pokemonInfo.name);
    });

    const pokemons = await Promise.all(pokemonPromises);

    for (const pokemon of pokemons) {
         // Simple check if the pokemon has a back sprite, if not, skip it.
        if (!pokemon.sprites.back_default && !pokemon.sprites.versions['generation-v']['black-white'].animated.back_default) {
             console.log(`Skipping ${pokemon.name} due to missing back sprite.`);
             // try to get another one
             const newIndex = Math.floor(Math.random() * availablePokemon.length);
             const newPokemonInfo = availablePokemon[newIndex];
             const newPokemon = await getPokemon(newPokemonInfo.name);
             pokemons.push(newPokemon); // This is a bit hacky, but for a demo it's fine
             continue;
        }

        onProgress(`Learning moves for ${pokemon.name}...`);
        const level = 50;

        const damageDealingMoves = pokemon.moves
            .map(m => m.move)
            .filter(m => !m.name.includes('-ohko'));

        const selectedMoves: Move['move'][] = [];
        const moveIndices = new Set<number>();
        if (damageDealingMoves.length > 0) {
            while (selectedMoves.length < Math.min(4, damageDealingMoves.length)) {
                const randIndex = Math.floor(Math.random() * damageDealingMoves.length);
                if (!moveIndices.has(randIndex)) {
                    selectedMoves.push(damageDealingMoves[randIndex]);
                    moveIndices.add(randIndex);
                }
            }
        }
        
        const moveDetails = await Promise.all(selectedMoves.map(m => getMoveDetails(m.url).catch(() => null)));
        const validMoveDetails = moveDetails.filter((m): m is MoveDetail => m !== null && m.power !== null && m.power > 0);

        if (validMoveDetails.length === 0) {
            console.log(`Skipping ${pokemon.name} due to no valid moves.`);
            const newIndex = Math.floor(Math.random() * availablePokemon.length);
            const newPokemonInfo = availablePokemon[newIndex];
            const newPokemon = await getPokemon(newPokemonInfo.name);
            pokemons.push(newPokemon);
            continue;
        }

        const stats = { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 };
        pokemon.stats.forEach(s => {
            const statName = s.stat.name as keyof typeof stats;
            if (statName === 'hp') {
                stats.hp = calculateHp(s.base_stat, level);
            } else {
                stats[statName] = calculateStat(s.base_stat, level);
            }
        });
        
        team.push({
            ...pokemon,
            level,
            maxHp: stats.hp,
            currentHp: stats.hp,
            moves: validMoveDetails,
            isFainted: false,
            calculatedStats: stats
        });
    }

    return team.slice(0, teamSize); // Ensure correct team size
};

export const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon, move: MoveDetail): {damage: number, effectiveness: number} => {
    if (move.power === null || move.power === 0) return {damage: 0, effectiveness: 1};

    const level = attacker.level;
    const power = move.power;
    const attack = move.damage_class.name === 'special' ? attacker.calculatedStats['special-attack'] : attacker.calculatedStats.attack;
    const defense = move.damage_class.name === 'special' ? defender.calculatedStats['special-defense'] : defender.calculatedStats.defense;

    let effectiveness = 1;
    const moveType = move.type.name;
    defender.types.forEach(typeInfo => {
        const defenderType = typeInfo.type.name;
        const multiplier = TYPE_EFFECTIVENESS[moveType]?.[defenderType];
        if (multiplier !== undefined) {
            effectiveness *= multiplier;
        }
    });

    const baseDamage = (((2 * level / 5 + 2) * power * attack / defense) / 50) + 2;
    const finalDamage = Math.floor(baseDamage * effectiveness * (Math.random() * (1 - 0.85) + 0.85));

    return { damage: finalDamage > 0 ? finalDamage : 1, effectiveness };
};