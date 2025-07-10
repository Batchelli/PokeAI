import React, { useState, useEffect, useCallback } from 'react';
import { IconMdiPokeball } from '../components/IconMdiPokeball';
import type { BattlePokemon, MoveDetail, BattleLogEntry, PokemonSpriteStatus } from '../types';
import { generateRandomTeam, calculateDamage, sleep } from '../utils/battleUtils';
import BattleScene from '../components/battle/BattleScene';
import BattleHUD from '../components/battle/BattleHUD';
import BattleInterface from '../components/battle/BattleInterface';
import TeamSidebar from '../components/battle/TeamSidebar';

type BattlePhase = 'loading' | 'intro' | 'player_action' | 'move_selection' | 'turn_processing' | 'forced_switch' | 'game_over';

const RandomBattleArenaPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [playerTeam, setPlayerTeam] = useState<BattlePokemon[]>([]);
    const [opponentTeam, setOpponentTeam] = useState<BattlePokemon[]>([]);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [activeOpponentIndex, setActiveOpponentIndex] = useState(0);
    
    const [phase, setPhase] = useState<BattlePhase>('loading');
    const [log, setLog] = useState<BattleLogEntry[]>([]);
    const [loadingMessage, setLoadingMessage] = useState('Initializing battle...');
    const [winner, setWinner] = useState<string | null>(null);
    const [playerSpriteStatus, setPlayerSpriteStatus] = useState<PokemonSpriteStatus>('idle');
    const [opponentSpriteStatus, setOpponentSpriteStatus] = useState<PokemonSpriteStatus>('idle');


    const activePlayerPokemon = playerTeam[activePlayerIndex] || null;
    const activeOpponentPokemon = opponentTeam[activeOpponentIndex] || null;

    const addLogEntry = (message: string, typewriter: boolean = true) => {
        setLog(prevLog => [...prevLog, { message, typewriter }]);
    };
    
    const startNewTurn = useCallback(() => {
        if(activePlayerPokemon && !activePlayerPokemon.isFainted) {
            setPhase('player_action');
            addLogEntry(`What will ${activePlayerPokemon.name.toUpperCase()} do?`, false);
        }
    }, [activePlayerPokemon]);

    const initializeBattle = useCallback(async () => {
        setPhase('loading');
        setLog([]);
        setLoadingMessage('Generating teams...');
        await sleep(500);
        const pTeam = await generateRandomTeam(6, (msg) => setLoadingMessage(`Player Team: ${msg}`)).catch(() => null);
        const oTeam = await generateRandomTeam(6, (msg) => setLoadingMessage(`Opponent Team: ${msg}`)).catch(() => null);

        if (!pTeam || !oTeam || pTeam.length < 1 || oTeam.length < 1) {
            setPhase('game_over');
            addLogEntry("Failed to initialize battle. Please try again.", false);
            setWinner("Error");
            return;
        }

        setPlayerTeam(pTeam);
        setOpponentTeam(oTeam);
        setActivePlayerIndex(0);
        setActiveOpponentIndex(0);

        setLoadingMessage('Battle is starting!');
        await sleep(1000);
        
        setPhase('intro');
        addLogEntry(`A wild ${oTeam[0].name.toUpperCase()} appeared!`);
        addLogEntry(`Go, ${pTeam[0].name.toUpperCase()}!`, true);
    }, []);

    useEffect(() => {
        initializeBattle();
    }, [initializeBattle]);

    const handleIntroEnd = useCallback(() => {
        startNewTurn();
    }, [startNewTurn]);
    
    const handleOpponentFaint = useCallback(async () => {
        const nextOpponentIndex = opponentTeam.findIndex(p => !p.isFainted);
        if (nextOpponentIndex !== -1) {
            await sleep(1000);
            const newOpponent = opponentTeam[nextOpponentIndex];
            addLogEntry(`Opponent sent out ${newOpponent.name.toUpperCase()}!`);
            setActiveOpponentIndex(nextOpponentIndex);
            await sleep(1500);
            return true;
        }
        return false;
    }, [opponentTeam]);

    const handlePlayerFaint = useCallback(() => {
        const hasNext = playerTeam.some(p => !p.isFainted);
        if (hasNext) {
            setPhase('forced_switch');
            addLogEntry("Choose your next Pokémon.", false);
            return true;
        }
        return false;
    }, [playerTeam]);

    const executeMove = async (
        attacker: BattlePokemon,
        defender: BattlePokemon,
        move: MoveDetail,
        isPlayerAttacking: boolean,
        defenderIndex: number
    ) => {
        if (isPlayerAttacking) setPlayerSpriteStatus('attacking');
        else setOpponentSpriteStatus('attacking');
        
        addLogEntry(`${attacker.name.toUpperCase()} used ${move.name.replace('-', ' ')}!`);
        await sleep(500); // Animation time
        
        if (isPlayerAttacking) setPlayerSpriteStatus('idle');
        else setOpponentSpriteStatus('idle');
        await sleep(1000);
    
        const { damage, effectiveness } = calculateDamage(attacker, defender, move);
    
        let fainted = false;
        if (isPlayerAttacking) {
            const newHp = Math.max(0, defender.currentHp - damage);
            setOpponentTeam(prev => prev.map((p, i) => i === defenderIndex ? { ...p, currentHp: newHp, isFainted: newHp <= 0 } : p));
            if (newHp <= 0) fainted = true;
        } else {
            const newHp = Math.max(0, defender.currentHp - damage);
            setPlayerTeam(prev => prev.map((p, i) => i === defenderIndex ? { ...p, currentHp: newHp, isFainted: newHp <= 0 } : p));
            if (newHp <= 0) fainted = true;
        }
    
        if (effectiveness > 1) addLogEntry("It's super effective!");
        if (effectiveness < 1 && effectiveness > 0) addLogEntry("It's not very effective...");
        if (effectiveness === 0) addLogEntry("It had no effect!");
        await sleep(1500);
    
        if (fainted) {
            addLogEntry(`${defender.name.toUpperCase()} fainted!`);
            await sleep(1500);
        }
    
        return fainted;
    };
    
    const processTurn = useCallback(async (playerAction: { type: 'move', move: MoveDetail } | { type: 'switch', index: number }) => {
        if (!activePlayerPokemon || !activeOpponentPokemon) return;
        
        setPhase('turn_processing');

        if (playerAction.type === 'switch') {
            const newPokemon = playerTeam[playerAction.index];
            addLogEntry(`Come back, ${activePlayerPokemon.name.toUpperCase()}!`);
            setPlayerSpriteStatus('withdrawing');
            await sleep(500);

            setActivePlayerIndex(playerAction.index);
            addLogEntry(`Go, ${newPokemon.name.toUpperCase()}!`);
            setPlayerSpriteStatus('entering');
            await sleep(500);
            setPlayerSpriteStatus('idle');
            
            // Opponent gets an attack
            const aiMove = activeOpponentPokemon.moves[Math.floor(Math.random() * activeOpponentPokemon.moves.length)];
            const playerFainted = await executeMove(activeOpponentPokemon, newPokemon, aiMove, false, playerAction.index);

            if (playerFainted) {
                if (!handlePlayerFaint()) {
                    setWinner("Opponent");
                    addLogEntry("You have no more Pokémon that can fight!", false);
                    setPhase('game_over');
                }
            } else {
                startNewTurn();
            }
            return;
        }

        const playerMove = playerAction.move;
        const aiMove = activeOpponentPokemon.moves[Math.floor(Math.random() * activeOpponentPokemon.moves.length)];
        const playerSpeed = activePlayerPokemon.calculatedStats.speed;
        const opponentSpeed = activeOpponentPokemon.calculatedStats.speed;

        const first = playerSpeed >= opponentSpeed ? 'player' : 'opponent';
        const second = first === 'player' ? 'opponent' : 'player';

        const attackerOrder = [
            { id: first, attacker: first === 'player' ? activePlayerPokemon : activeOpponentPokemon, defender: first === 'player' ? activeOpponentPokemon : activePlayerPokemon, move: first === 'player' ? playerMove : aiMove, isPlayer: first === 'player', defenderIndex: first === 'player' ? activeOpponentIndex : activePlayerIndex },
            { id: second, attacker: second === 'player' ? activePlayerPokemon : activeOpponentPokemon, defender: second === 'player' ? activeOpponentPokemon : activePlayerPokemon, move: second === 'player' ? playerMove : aiMove, isPlayer: second === 'player', defenderIndex: second === 'player' ? activeOpponentIndex : activePlayerIndex }
        ];

        for (const turn of attackerOrder) {
            if (turn.attacker.currentHp <= 0) continue;
            
            const defenderFainted = await executeMove(turn.attacker, turn.defender, turn.move, turn.isPlayer, turn.defenderIndex);
            
            if (defenderFainted) {
                if (turn.isPlayer) { // Opponent fainted
                    const hasNext = await handleOpponentFaint();
                    if (!hasNext) {
                        setWinner("Player");
                        addLogEntry(`You won the battle!`, false);
                        setPhase('game_over');
                        return;
                    }
                } else { // Player fainted
                    const hasNext = handlePlayerFaint();
                    if (!hasNext) {
                        setWinner("Opponent");
                        addLogEntry("You have no more Pokémon that can fight!", false);
                        setPhase('game_over');
                        return;
                    }
                    return; // Stop turn processing to force switch
                }
            }
        }

        if (phase !== 'forced_switch' && phase !== 'game_over') {
            startNewTurn();
        }

    }, [activePlayerPokemon, activeOpponentPokemon, playerTeam, opponentTeam, activePlayerIndex, activeOpponentIndex, handlePlayerFaint, handleOpponentFaint, startNewTurn]);

    const handleSwitchSelect = async (index: number) => {
        if (index === activePlayerIndex || playerTeam[index].isFainted) return;
        
        if (phase === 'forced_switch') {
             const newPokemon = playerTeam[index];
             addLogEntry(`Go, ${newPokemon.name.toUpperCase()}!`);
             setPlayerSpriteStatus('entering');
             setActivePlayerIndex(index);
             await sleep(500);
             setPlayerSpriteStatus('idle');
             await sleep(500);
             startNewTurn();
        } else if (phase === 'player_action') {
             processTurn({ type: 'switch', index });
        }
    };


    if (phase === 'loading') {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-300">
                <IconMdiPokeball height="96" width="96" className="animate-spin-smooth text-white" />
                <p className="mt-4 text-2xl font-press-start text-white">{loadingMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex-grow w-full flex items-center justify-center p-2 sm:p-4">
            <div className="flex w-full h-full max-w-screen-2xl mx-auto gap-4">
                <TeamSidebar 
                    team={playerTeam} 
                    isPlayer={true} 
                    onPokemonSelect={handleSwitchSelect}
                    disabled={phase !== 'player_action' && phase !== 'forced_switch'}
                    activeIndex={activePlayerIndex}
                />
                
                <div className="flex-grow h-full min-w-0">
                    <div className="w-full h-full bg-slate-800 rounded-3xl p-2 sm:p-4 border-4 border-slate-700 shadow-2xl animate-battle-scene-enter flex flex-col gap-4">
                        <div className="relative w-full aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-inner">
                            <BattleScene playerPokemon={activePlayerPokemon} opponentPokemon={activeOpponentPokemon} playerSpriteStatus={playerSpriteStatus} opponentSpriteStatus={opponentSpriteStatus} />
                            <BattleHUD pokemon={activeOpponentPokemon} isPlayer={false} />
                            <BattleHUD pokemon={activePlayerPokemon} isPlayer={true} />
                        </div>
                        <BattleInterface
                            logEntries={log}
                            phase={phase}
                            onPhaseEnd={handleIntroEnd}
                            playerPokemon={activePlayerPokemon}
                            onMoveSelect={(move) => processTurn({ type: 'move', move })}
                            onShowMoves={() => setPhase('move_selection')}
                            onReturnToActions={startNewTurn}
                            onRun={onBack}
                            winner={winner}
                        />
                    </div>
                </div>
                
                <TeamSidebar team={opponentTeam} isPlayer={false} activeIndex={activeOpponentIndex} />
            </div>
        </div>
    );
};

export default RandomBattleArenaPage;