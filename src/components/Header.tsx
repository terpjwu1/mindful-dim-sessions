
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Library, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2 bg-background/80 backdrop-blur-lg border-t border-border">
      <nav className="flex justify-around items-center max-w-md mx-auto">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center p-2 rounded-full transition-all duration-300", 
            isActive('/') ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/library" 
          className={cn(
            "flex flex-col items-center p-2 rounded-full transition-all duration-300", 
            isActive('/library') ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Library size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1">Library</span>
        </Link>
        
        <Link 
          to="/session" 
          className={cn(
            "flex flex-col items-center p-2 rounded-full transition-colors",
            isActive('/session') 
              ? "text-primary-foreground bg-primary" 
              : "text-muted-foreground bg-secondary hover:bg-secondary/80"
          )}
        >
          <Moon size={24} strokeWidth={1.5} className="mt-1" />
          <span className="text-xs mt-1 mb-0.5">Meditate</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
