
import React, { useState, useCallback, useEffect } from 'react';
import { useTeam } from '../context/TeamContext';
import PokemonSelectionModal from '../components/PokemonSelectionModal';
import MoveEditorModal from '../components/MoveEditorModal';
import SaveTeamModal from '../components/SaveTeamModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import { getPokemon } from '../services/pokeapi';
import type { Pokemon, Move, SavedTeam } from '../types';
import { TRASH_ICON } from '../constants.tsx';
import { IconMdiPokeball } from '../components/IconMdiPokeball';

interface TeamBuilderPageProps {
    onNavigateToBattle: () => void;
}

const TeamBuilderPage: React.FC<TeamBuilderPageProps> = ({ onNavigateToBattle }) => {
    const { team, setTeam, addPokemonToTeam, removePokemonFromTeam, updatePokemonMoves } = useTeam();
    
    const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
    const [isMoveEditorOpen, setMoveEditorOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    
    const [selectingSlotIndex, setSelectingSlotIndex] = useState<number | null>(null);
    const [pokemonForEditing, setPokemonForEditing] = useState<Pokemon | null>(null);
    const [initialMovesForEditor, setInitialMovesForEditor] = useState<Move['move'][]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
    const [currentlyLoadedTeamId, setCurrentlyLoadedTeamId] = useState<string | null>(null);

    const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; confirmButtonClass?: string; } | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    useEffect(() => {
        try {
            const storedTeams = localStorage.getItem('pokeai_saved_teams');
            if (storedTeams) {
                setSavedTeams(JSON.parse(storedTeams));
            }
        } catch (error) {
            console.error("Could not load saved teams:", error);
        }
    }, []);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleAddPokemonClick = (index: number) => {
        setSelectingSlotIndex(index);
        setSelectionModalOpen(true);
    };
    
    const handleEditMovesClick = (index: number) => {
        const member = team[index];
        if (member) {
            setSelectingSlotIndex(index);
            setPokemonForEditing(member.pokemon);
            setInitialMovesForEditor(member.moves);
            setMoveEditorOpen(true);
        }
    };

    const handlePokemonSelected = useCallback(async (pokemonId: string) => {
        setSelectionModalOpen(false);
        setIsLoading(true);
        try {
            const pokemonData = await getPokemon(pokemonId);
            setPokemonForEditing(pokemonData);
            setInitialMovesForEditor([]);
            setMoveEditorOpen(true);
        } catch (error) {
            console.error("Failed to fetch pokemon", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSaveMoves = (moves: Move['move'][]) => {
        if (selectingSlotIndex === null) return;
        if (!team[selectingSlotIndex] && pokemonForEditing) {
            addPokemonToTeam(pokemonForEditing, selectingSlotIndex);
        }
        updatePokemonMoves(selectingSlotIndex, moves);
        handleCloseModals();
    };

    const handleCloseModals = () => {
        setSelectionModalOpen(false);
        setMoveEditorOpen(false);
        setIsSaveModalOpen(false);
        setConfirmation(null);
        setPokemonForEditing(null);
        setSelectingSlotIndex(null);
        setInitialMovesForEditor([]);
    };
    
    const handleRemoveFromTeam = (index: number) => {
        removePokemonFromTeam(index);
    };

    const handleOpenSaveModal = () => {
        const teamIsNotEmpty = team.some(member => member !== null);
        if (teamIsNotEmpty) {
            setIsSaveModalOpen(true);
        } else {
            setToastMessage("Your team is empty! Add at least one Pokémon to save.");
        }
    };

    const handleSaveTeam = (name: string) => {
        const newSavedTeam: SavedTeam = {
            id: new Date().toISOString() + Math.random(),
            name,
            team,
        };
        const updatedTeams = [...savedTeams, newSavedTeam];
        setSavedTeams(updatedTeams);
        localStorage.setItem('pokeai_saved_teams', JSON.stringify(updatedTeams));
        setCurrentlyLoadedTeamId(newSavedTeam.id);
        setIsSaveModalOpen(false);
        setToastMessage(`Team "${name}" saved successfully!`);
    };
    
    const handleDeleteTeam = (idToDelete: string) => {
        const teamToDelete = savedTeams.find(t => t.id === idToDelete);
        if (!teamToDelete) return;

        setConfirmation({
            title: "Delete Team",
            message: `Are you sure you want to delete the team "${teamToDelete.name}"? This action cannot be undone.`,
            confirmText: "Delete",
            onConfirm: () => {
                const updatedTeams = savedTeams.filter(t => t.id !== idToDelete);
                setSavedTeams(updatedTeams);
                localStorage.setItem('pokeai_saved_teams', JSON.stringify(updatedTeams));
                if(currentlyLoadedTeamId === idToDelete) {
                    setCurrentlyLoadedTeamId(null);
                    setTeam(Array(6).fill(null));
                }
                setToastMessage("Team deleted successfully.");
                setConfirmation(null);
            }
        });
    };

    const handleLoadTeam = (teamToLoad: SavedTeam) => {
        setTeam(teamToLoad.team);
        setCurrentlyLoadedTeamId(teamToLoad.id);
    };

    const handleSaveChanges = () => {
        if (!currentlyLoadedTeamId) return;
        const updatedTeams = savedTeams.map(st => 
            st.id === currentlyLoadedTeamId ? { ...st, team } : st
        );
        setSavedTeams(updatedTeams);
        localStorage.setItem('pokeai_saved_teams', JSON.stringify(updatedTeams));
        setToastMessage("Changes saved!");
    };

    const handleNewTeamClick = () => {
        const teamIsNotEmpty = team.some(member => member !== null);
        if (!teamIsNotEmpty && !currentlyLoadedTeamId) {
            return; // Already a new, empty team
        }
        
        setConfirmation({
            title: "Start a New Team",
            message: "Are you sure? This will clear your current team builder. Any unsaved changes will be lost.",
            confirmText: "Clear Team",
            confirmButtonClass: "bg-sky-600 hover:bg-sky-500",
            onConfirm: () => {
                setTeam(Array(6).fill(null));
                setCurrentlyLoadedTeamId(null);
                setConfirmation(null);
            }
        });
    };

    return (
        <div className="w-full">
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            
            {confirmation && (
                <ConfirmationModal
                    isOpen={!!confirmation}
                    onClose={handleCloseModals}
                    onConfirm={confirmation.onConfirm}
                    title={confirmation.title}
                    message={confirmation.message}
                    confirmText={confirmation.confirmText}
                    confirmButtonClass={confirmation.confirmButtonClass}
                />
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                     <div className="flex flex-col items-center justify-center text-slate-300">
                        <IconMdiPokeball height="60" width="60" className="animate-spin-smooth text-white" />
                        <p className="mt-4 text-lg font-bold">Fetching Pokémon Data...</p>
                    </div>
                </div>
            )}

            {isSelectionModalOpen && <PokemonSelectionModal onClose={handleCloseModals} onSelect={handlePokemonSelected} />}
            {isMoveEditorOpen && pokemonForEditing && <MoveEditorModal pokemon={pokemonForEditing} initialMoves={initialMovesForEditor} onClose={handleCloseModals} onSave={handleSaveMoves}/>}
            {isSaveModalOpen && <SaveTeamModal onClose={handleCloseModals} onSave={handleSaveTeam} existingTeamNames={savedTeams.map(t => t.name)}/>}
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                {/* Left Column */}
                <div className="lg:col-span-4 xl:col-span-3 bg-slate-800/50 p-4 rounded-lg border-2 border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-200">Saved Teams</h3>
                        <button 
                            onClick={handleNewTeamClick}
                            className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors"
                        >
                            + New Team
                        </button>
                    </div>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                        {savedTeams.length > 0 ? (
                            savedTeams.map(savedTeam => (
                                <div 
                                    key={savedTeam.id} 
                                    className={`group p-3 rounded-lg transition-all border-2 ${savedTeam.id === currentlyLoadedTeamId ? 'bg-amber-900/40 border-amber-600' : 'bg-slate-800 border-transparent hover:bg-slate-700/50 cursor-pointer'}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-grow min-w-0" onClick={() => handleLoadTeam(savedTeam)}>
                                            <p className={`font-bold transition-colors truncate pr-2 ${savedTeam.id === currentlyLoadedTeamId ? 'text-amber-300' : 'text-white group-hover:text-amber-400'}`}>
                                                {savedTeam.name}
                                            </p>
                                            <div className="flex flex-nowrap items-center justify-center gap-1 mt-2">
                                                {Array.from({length: 6}).map((_, index) => {
                                                    const member = savedTeam.team[index];
                                                    return (
                                                        <div key={index} className="w-10 h-10 flex-shrink-0 flex items-center justify-center" title={member ? member.pokemon.name : 'Empty Slot'}>
                                                            {member ? (
                                                                <img src={member.pokemon.sprites.front_default} alt={member.pokemon.name || ''} className="w-full h-full object-contain"/>
                                                            ) : (
                                                                <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteTeam(savedTeam.id); }} className="text-red-600 hover:text-red-500 transition-colors flex-shrink-0 opacity-60 group-hover:opacity-100 p-1">
                                            {TRASH_ICON}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-4">No teams saved yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((member, index) => (
                            <div key={index} className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700 h-64 flex flex-col items-center justify-center">
                                {member ? (
                                    <div className="text-center w-full flex flex-col h-full">
                                        <div className="flex-grow flex flex-col justify-center items-center">
                                            <img src={member.pokemon.sprites.front_default} alt={member.pokemon.name} className="h-24 w-24 mx-auto" />
                                            <p className="font-bold text-white capitalize mt-2 text-lg">{member.pokemon.name.replace('-', ' ')}</p>
                                            <div className="text-xs text-slate-300 mt-2 space-y-1 capitalize w-full px-2">
                                                {member.moves.length > 0 ? (
                                                    member.moves.slice(0, 4).map(m => (
                                                        <p key={m.name} className="bg-slate-700/50 rounded-md py-1 px-2 truncate">
                                                            {m.name.replace(/-/g, ' ')}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p className="text-slate-500 italic py-1">No moves selected</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-2 flex-shrink-0 flex gap-2 justify-center">
                                            <button onClick={() => handleEditMovesClick(index)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-bold py-1 px-3 rounded-md transition-colors">Moves</button>
                                            <button onClick={() => handleRemoveFromTeam(index)} className="bg-red-800 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors">Remove</button>
                                        </div>
                                    </div>
                                ) : (
                                <button onClick={() => handleAddPokemonClick(index)} className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:bg-slate-700/50 rounded-md transition-colors">
                                        <span className="text-5xl font-thin">+</span>
                                        <span className="mt-2 font-bold">Add Pokémon</span>
                                </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
                         {currentlyLoadedTeamId ? (
                            <div className="flex justify-center items-center gap-4">
                                <button onClick={handleSaveChanges} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                    Save Changes
                                </button>
                                <button onClick={handleOpenSaveModal} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                    Save as New Team
                                </button>
                            </div>
                         ) : (
                            <button onClick={handleOpenSaveModal} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition-colors">
                               Save Current Team
                            </button>
                         )}
                         <button 
                            onClick={onNavigateToBattle}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
                            title="Start a battle!"
                        >
                            Battle
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamBuilderPage;
