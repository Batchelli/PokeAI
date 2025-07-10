import React from 'react';
import { IconMdiPokeball } from './IconMdiPokeball';

interface HeaderProps {
    pathname: string;
    navigate: (path: string) => void;
}

const NavLink: React.FC<{ to: string; currentPath: string; navigate: (path: string) => void; children: React.ReactNode }> = ({ to, currentPath, navigate, children }) => {
    // Treat '/pokemon/id' as being under the 'Home' section for highlighting
    const isActive = currentPath === to || (to === '/' && (currentPath.startsWith('/pokemon/') || currentPath === '/list'));
    
    return (
        <a
            href={to}
            onClick={(e) => {
                e.preventDefault();
                navigate(to);
            }}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                isActive ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
        >
            {children}
        </a>
    );
};

const Header: React.FC<HeaderProps> = ({ pathname, navigate }) => {
    return (
        <header className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center justify-center gap-4 group">
                <IconMdiPokeball height="48" width="48" className="text-white group-hover:text-amber-400 transition-colors" />
                <h1 className="text-3xl font-press-start text-amber-400 group-hover:text-amber-300 transition-colors" style={{ textShadow: '2px 2px #c0392b' }}>
                    PokéAI
                </h1>
            </a>
            <nav className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700">
                 <NavLink to="/" currentPath={pathname} navigate={navigate}>Home</NavLink>
                 <NavLink to="/team-builder" currentPath={pathname} navigate={navigate}>Team Builder</NavLink>
                 <NavLink to="/battle" currentPath={pathname} navigate={navigate}>Battle</NavLink>
            </nav>
        </header>
    );
};

export default Header;
