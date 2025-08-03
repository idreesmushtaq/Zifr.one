import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import zifrLogo from 'figma:asset/9bd09ec4c7c9fafc521fdd681707f292658b7b6e.png';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={zifrLogo} 
              alt="Zifr.one" 
              className="w-10 h-10"
            />
            <div className="flex flex-col">
              <span className="text-xl text-foreground font-bold font-sans">Zifr.one</span>
              <span className="text-xs text-muted-foreground font-medium">Built on Zero. Driven by One.</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm transition-colors ${
                isActive('/') 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm transition-colors ${
                isActive('/about') 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              About
            </Link>
            <Link 
              to="/services" 
              className={`text-sm transition-colors ${
                isActive('/services') 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm transition-colors ${
                isActive('/contact') 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Contact
            </Link>

          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}