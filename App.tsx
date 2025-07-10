
import React, { useState, useEffect, useCallback } from 'react';
import SearchPage from './pages/SearchPage';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import BattlePage from './pages/BattlePage';
import RandomBattleArenaPage from './pages/RandomBattleArenaPage';
import Header from './components/Header';
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
  
  const isBattlePage = pathname === '/battle/random';

  const renderContent = () => {
    if (pathname.startsWith('/pokemon/')) {
      const id = pathname.split('/')[2];
      return id ? <DetailPage pokemonId={id} onBack={handleBack} /> : null;
    }
    if (pathname === '/list') {
      return <ListPage onBack={handleBack} onNavigateToDetail={(id) => navigate(`/pokemon/${id}`)} />;
    }
    if (pathname === '/team-builder') {
        return <TeamBuilderPage onNavigateToBattle={() => navigate('/battle')} />;
    }
    if (pathname === '/battle/random') {
        return <RandomBattleArenaPage onBack={() => navigate('/battle')} />;
    }
    if (pathname === '/battle') {
        return <BattlePage onNavigateToTeamBuilder={() => navigate('/team-builder')} onNavigateToRandomBattle={() => navigate('/battle/random')} />;
    }
    return <SearchPage onNavigateToList={() => navigate('/list')} onNavigateToTeamBuilder={() => navigate('/team-builder')} onNavigateToBattle={() => navigate('/battle')} />;
  }

  return (
    <TeamProvider>
      <div className={`min-h-screen font-roboto-mono text-white flex flex-col items-center bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 ${isBattlePage ? 'p-0' : 'p-4 sm:p-6'}`}>
        {!isBattlePage && (
            <Header pathname={pathname} navigate={navigate} />
        )}
        
        <main className={`w-full flex-grow flex flex-col ${!isBattlePage ? 'max-w-6xl' : ''}`}>
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
