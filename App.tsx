import React, { useState, useEffect, useCallback } from 'react';
import SearchPage from './pages/SearchPage';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import BattlePage from './pages/BattlePage';
import RandomBattleArenaPage from './pages/RandomBattleArenaPage';
import { IconMdiPokeball } from './components/IconMdiPokeball';
import { GITHUB_ICON } from './constants.tsx';
import { TeamProvider } from './context/TeamContext';

const App: React.FC = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  }, []);

  const handleBack = useCallback(() => {
    window.history.back();
    // A simple way to trigger re-render on back navigation
    setTimeout(() => setPathname(window.location.pathname), 0);
  }, []);

  const renderContent = () => {
    if (pathname.startsWith('/pokemon/')) {
      const id = pathname.split('/')[2];
      return id ? <DetailPage pokemonId={id} onBack={handleBack} /> : null;
    }
    if (pathname === '/list') {
      return <ListPage onBack={handleBack} onNavigateToDetail={(id) => navigate(`/pokemon/${id}`)} />;
    }
    if (pathname === '/team-builder') {
        return <TeamBuilderPage onBack={handleBack} onNavigateToBattle={() => navigate('/battle')} />;
    }
    if (pathname === '/battle/random') {
        return <RandomBattleArenaPage onBack={() => navigate('/battle')} />;
    }
    if (pathname === '/battle') {
        return <BattlePage onBack={() => navigate('/team-builder')} onNavigateToRandomBattle={() => navigate('/battle/random')} />;
    }
    return <SearchPage onNavigateToList={() => navigate('/list')} onNavigateToTeamBuilder={() => navigate('/team-builder')} />;
  }
  
  const isBattlePage = pathname === '/battle/random';

  return (
    <TeamProvider>
      <div className={`min-h-screen font-roboto-mono text-white flex flex-col items-center ${isBattlePage ? 'p-0 bg-black' : 'p-4 bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800'}`}>
        {!isBattlePage && (
            <header className="w-full max-w-4xl text-center mb-6">
                <div className="flex items-center justify-center gap-4">
                    <IconMdiPokeball height="48" width="48" className="text-white" />
                    <h1 className="text-4xl md:text-5xl font-press-start text-amber-400" style={{ textShadow: '2px 2px #c0392b' }}>
                    PokéAI
                    </h1>
                </div>
                <p className="text-slate-400 mt-2">A Pokémon companion app with a stat calculator and moveset builder.</p>
            </header>
        )}
        
        <main className="w-full max-w-6xl flex-grow flex flex-col">
          {renderContent()}
        </main>

        {!isBattlePage && (
            <footer className="mt-8 text-center text-slate-500">
                <p>Powered by the <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">PokéAPI</a></p>
                <a href="https://github.com/google/genai-api" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 hover:text-amber-400 transition-colors">
                    {GITHUB_ICON}
                    <span>View on GitHub</span>
                </a>
            </footer>
        )}
      </div>
    </TeamProvider>
  );
};

export default App;