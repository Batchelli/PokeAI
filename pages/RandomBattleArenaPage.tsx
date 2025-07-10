import React, { useState, useEffect, useCallback } from 'react';
import { IconMdiPokeball } from '../components/IconMdiPokeball';
import type { BattlePokemon, MoveDetail, BattleLogEntry } from '../types';
import { generateRandomTeam, calculateDamage, sleep } from '../utils/battleUtils';
import BattleScene from '../components/battle/BattleScene';
import BattleHUD from '../components/battle/BattleHUD';
import BattleInterface from '../components/battle/BattleInterface';

type BattlePhase = 'loading' | 'intro' | 'player_action' | 'player_move' | 'turn_processing' | 'game_over';

const RandomBattleArenaPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [playerTeam, setPlayerTeam] = useState<BattlePokemon[]>([]);
    const [opponentTeam, setOpponentTeam] = useState<BattlePokemon[]>([]);
    const [activePlayerPokemon, setActivePlayerPokemon] = useState<BattlePokemon | null>(null);
    const [activeOpponentPokemon, setActiveOpponentPokemon] = useState<BattlePokemon | null>(null);
    
    const [phase, setPhase] = useState<BattlePhase>('loading');
    const [log, setLog] = useState<BattleLogEntry[]>([]);
    const [loadingMessage, setLoadingMessage] = useState('Initializing battle...');
    const [winner, setWinner] = useState<string | null>(null);

    const addLogEntry = (message: string, typewriter: boolean = true) => {
        setLog(prevLog => [...prevLog, { message, typewriter }]);
    };

    const initializeBattle = useCallback(async () => {
        setPhase('loading');
        setLoadingMessage('Generating teams...');
        await sleep(500);
        const pTeam = await generateRandomTeam(1, (msg) => setLoadingMessage(`Player Team: ${msg}`)).catch(() => null);
        const oTeam = await generateRandomTeam(1, (msg) => setLoadingMessage(`Opponent Team: ${msg}`)).catch(() => null);

        if (!pTeam || !oTeam) {
            setPhase('game_over');
            addLogEntry("Failed to initialize battle. Please try again.", false);
            setWinner("Error");
            return;
        }

        setPlayerTeam(pTeam);
        setOpponentTeam(oTeam);
        setActivePlayerPokemon(pTeam[0]);
        setActiveOpponentPokemon(oTeam[0]);

        setLoadingMessage('Battle is starting!');
        await sleep(1000);
        
        setPhase('intro');
        setLog([]);
        addLogEntry(`A wild ${oTeam[0].name.toUpperCase()} appeared!`, false);
        addLogEntry(`Go, ${pTeam[0].name.toUpperCase()}!`, true);
    }, []);

    useEffect(() => {
        initializeBattle();
    }, [initializeBattle]);

    const handleIntroEnd = () => {
        setPhase('player_action');
        addLogEntry(`What will ${activePlayerPokemon?.name.toUpperCase()} do?`);
    };
    
    const processTurn = useCallback(async (playerMove: MoveDetail) => {
        if (!activePlayerPokemon || !activeOpponentPokemon || phase !== 'player_move') return;

        setPhase('turn_processing');

        const aiMove = activeOpponentPokemon.moves[Math.floor(Math.random() * activeOpponentPokemon.moves.length)];

        const playerSpeed = activePlayerPokemon.calculatedStats.speed;
        const opponentSpeed = activeOpponentPokemon.calculatedStats.speed;

        const playerGoesFirst = playerSpeed >= opponentSpeed;

        const firstAttacker = { pokemon: playerGoesFirst ? activePlayerPokemon : activeOpponentPokemon, move: playerGoesFirst ? playerMove : aiMove, isPlayer: playerGoesFirst };
        const secondAttacker = { pokemon: !playerGoesFirst ? activePlayerPokemon : activeOpponentPokemon, move: !playerGoesFirst ? playerMove : aiMove, isPlayer: !playerGoesFirst };

        let opponentFainted = false;
        let playerFainted = false;
        
        // First Attacker's Turn
        addLogEntry(`${firstAttacker.pokemon.name.toUpperCase()} used ${firstAttacker.move.name.replace('-', ' ')}!`);
        await sleep(1500);

        const { damage: firstDamage, effectiveness: firstEffectiveness } = calculateDamage(firstAttacker.pokemon, secondAttacker.pokemon, firstAttacker.move);
        if (firstAttacker.isPlayer) {
            setActiveOpponentPokemon(p => p ? { ...p, currentHp: Math.max(0, p.currentHp - firstDamage) } : null);
        } else {
            setActivePlayerPokemon(p => p ? { ...p, currentHp: Math.max(0, p.currentHp - firstDamage) } : null);
        }
        
        if (firstEffectiveness > 1) addLogEntry("It's super effective!");
        if (firstEffectiveness < 1 && firstEffectiveness > 0) addLogEntry("It's not very effective...");
        if (firstEffectiveness === 0) addLogEntry("It had no effect!");

        await sleep(1500);

        if ((firstAttacker.isPlayer && activeOpponentPokemon.currentHp - firstDamage <= 0) || (!firstAttacker.isPlayer && activePlayerPokemon.currentHp - firstDamage <= 0)) {
            if (firstAttacker.isPlayer) opponentFainted = true; else playerFainted = true;
            addLogEntry(`${secondAttacker.pokemon.name.toUpperCase()} fainted!`);
            await sleep(1500);
        }

        // Second Attacker's Turn (if they haven't fainted)
        if (!playerFainted && !opponentFainted) {
            addLogEntry(`${secondAttacker.pokemon.name.toUpperCase()} used ${secondAttacker.move.name.replace('-', ' ')}!`);
            await sleep(1500);
            
            const { damage: secondDamage, effectiveness: secondEffectiveness } = calculateDamage(secondAttacker.pokemon, firstAttacker.pokemon, secondAttacker.move);
            if (secondAttacker.isPlayer) {
                setActiveOpponentPokemon(p => p ? { ...p, currentHp: Math.max(0, p.currentHp - secondDamage) } : null);
            } else {
                setActivePlayerPokemon(p => p ? { ...p, currentHp: Math.max(0, p.currentHp - secondDamage) } : null);
            }
            
            if (secondEffectiveness > 1) addLogEntry("It's super effective!");
            if (secondEffectiveness < 1 && secondEffectiveness > 0) addLogEntry("It's not very effective...");
            if (secondEffectiveness === 0) addLogEntry("It had no effect!");

            await sleep(1500);

            if ((secondAttacker.isPlayer && activeOpponentPokemon.currentHp - secondDamage <= 0) || (!secondAttacker.isPlayer && activePlayerPokemon.currentHp - secondDamage <= 0)) {
                if(secondAttacker.isPlayer) opponentFainted = true; else playerFainted = true;
                addLogEntry(`${firstAttacker.pokemon.name.toUpperCase()} fainted!`);
                await sleep(1500);
            }
        }
        
        if (playerFainted) {
            setWinner(opponentTeam[0].name);
            addLogEntry("You have no more Pokémon that can fight!", false);
            addLogEntry("You blacked out...", false);
            setPhase('game_over');
        } else if (opponentFainted) {
            setWinner(playerTeam[0].name);
            addLogEntry(`You defeated the wild ${opponentTeam[0].name.toUpperCase()}!`, false);
            setPhase('game_over');
        } else {
            setPhase('player_action');
            addLogEntry(`What will ${activePlayerPokemon.name.toUpperCase()} do?`);
        }

    }, [activePlayerPokemon, activeOpponentPokemon, phase]);

    const handleMoveSelect = (move: MoveDetail) => {
        if (phase === 'player_action') {
            setPhase('player_move');
            processTurn(move);
        }
    };

    if (phase === 'loading') {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-300 bg-black">
                <IconMdiPokeball height="96" width="96" className="animate-spin-smooth text-white" />
                <p className="mt-4 text-2xl font-press-start text-white">{loadingMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center bg-black w-full h-full relative font-press-start animate-battle-scene-enter overflow-hidden">
            <BattleScene playerPokemon={activePlayerPokemon} opponentPokemon={activeOpponentPokemon} />
            <BattleHUD pokemon={activeOpponentPokemon} isPlayer={false} />
            <BattleHUD pokemon={activePlayerPokemon} isPlayer={true} />
            <BattleInterface
                logEntries={log}
                phase={phase}
                onPhaseEnd={handleIntroEnd}
                playerPokemon={activePlayerPokemon}
                onMoveSelect={handleMoveSelect}
                onRun={onBack}
                winner={winner}
            />
        </div>
    );
};

export default RandomBattleArenaPage;