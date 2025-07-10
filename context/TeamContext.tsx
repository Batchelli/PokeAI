import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { TeamContextType, TeamMember, Pokemon, Move } from '../types';

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [team, setTeam] = useState<(TeamMember | null)[]>(Array(6).fill(null));

    const addPokemonToTeam = (pokemon: Pokemon, slotIndex: number) => {
        const newTeamMember: TeamMember = { pokemon, moves: [] };
        const newTeam = [...team];
        newTeam[slotIndex] = newTeamMember;
        setTeam(newTeam);
    };

    const removePokemonFromTeam = (slotIndex: number) => {
        const newTeam = [...team];
        newTeam[slotIndex] = null;
        setTeam(newTeam);
    };

    const updatePokemonMoves = (slotIndex: number, moves: Move['move'][]) => {
        const newTeam = [...team];
        const member = newTeam[slotIndex];
        if (member) {
            member.moves = moves;
            setTeam(newTeam);
        }
    };

    return (
        <TeamContext.Provider value={{ team, setTeam, addPokemonToTeam, removePokemonFromTeam, updatePokemonMoves }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = (): TeamContextType => {
    const context = useContext(TeamContext);
    if (context === undefined) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};