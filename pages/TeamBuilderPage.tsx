import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import PokemonSelectionModal from '../components/PokemonSelectionModal';
import MoveEditorModal from '../components/MoveEditorModal';
import { getPokemon } from '../services/pokeapi';
import type { TeamMember } from '../types';
import { POKEBALL_ICON } from '../constants.tsx';

interface TeamBuilderPageProps {
    onBack: () => void;
}

const TeamBuilderPage: React.FC<TeamBuilderPageProps> = ({ onBack }) => {
    const { team, addPokemonToTeam, removePokemonFromTeam, updatePokemonMoves } = useTeam();
    const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
    const [isEditorModalOpen, setEditorModalOpen] = useState(false);
    const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
    const [loadingPokemon, setLoadingPokemon] = useState(false);

    const handleAddClick = (index: number) => {
        setEditingSlotIndex(index);
        setSelectionModalOpen(true);
    };

    const handleEditMovesClick = (index: number) => {
        setEditingSlotIndex(index);
        setEditorModalOpen(true);
    };

    const handlePokemonSelect = async (pokemonId: string) => {
        if (editingSlotIndex === null) return;
        setLoadingPokemon(true);
        setSelectionModalOpen(false);
        try {
            const pokemonData = await getPokemon(pokemonId);
            addPokemonToTeam(pokemonData, editingSlotIndex);
        } catch (error) {
            console.error("Failed to fetch pokemon for team", error);
            // Optionally show an error to the user
        } finally {
            setLoadingPokemon(false);
            setEditingSlotIndex(null);
        }
    };

    return (
        <div className="w-full">
            {isSelectionModalOpen && (
                <PokemonSelectionModal 
                    onClose={() => setSelectionModalOpen(false)}
                    onSelect={handlePokemonSelect}
                />
            )}
            {isEditorModalOpen && editingSlotIndex !== null && team[editingSlotIndex] && (
                <MoveEditorModal
                    teamMember={team[editingSlotIndex] as TeamMember}
                    onClose={() => setEditorModalOpen(false)}
                    onSave={(moves) => {
                        updatePokemonMoves(editingSlotIndex, moves);
                        setEditorModalOpen(false);
                    }}
                />
            )}

            <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-3xl font-bold text-slate-200">Team Builder</h2>
                <button onClick={onBack} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    &larr; Back to Search
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700 h-64 flex flex-col items-center justify-center">
                        {member ? (
                            <div className="text-center w-full">
                                <img src={member.pokemon.sprites.front_default} alt={member.pokemon.name} className="h-24 w-24 mx-auto" />
                                <p className="font-bold text-white capitalize mt-2">{member.pokemon.name.replace('-', ' ')}</p>
                                <p className="text-slate-400 text-sm">Level: 100</p>
                                <div className="mt-4 flex gap-2 justify-center">
                                    <button onClick={() => handleEditMovesClick(index)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-bold py-1 px-3 rounded-md transition-colors">Edit Moves</button>
                                    <button onClick={() => removePokemonFromTeam(index)} className="bg-red-800 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors">Remove</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => handleAddClick(index)} className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:bg-slate-700/50 rounded-md transition-colors">
                                {loadingPokemon && editingSlotIndex === index ? (
                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                      <div className="animate-spin text-4xl">{POKEBALL_ICON}</div>
                                      <p className="mt-2 text-sm font-bold">Loading...</p>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-5xl">+</span>
                                        <span className="font-bold mt-2">Add Pokémon</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamBuilderPage;
