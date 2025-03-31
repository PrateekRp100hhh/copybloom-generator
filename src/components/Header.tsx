
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="border-b py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-purple" />
          <Link to="/" className="text-xl font-bold">
            <span className="gradient-text">CopyBloom</span>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/templates" className="text-sm font-medium hover:text-brand-purple transition-colors">
                Templates
              </Link>
              <Link to="/generator" className="text-sm font-medium hover:text-brand-purple transition-colors">
                Generator
              </Link>
              <Link to="/chat" className="text-sm font-medium hover:text-brand-purple transition-colors">
                Chat
              </Link>
            </>
          )}
          <Link to="/about" className="text-sm font-medium hover:text-brand-purple transition-colors">
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background z-50 border-b md:hidden">
            <div className="container py-4 flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-sm font-medium py-2" 
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/templates" 
                    className="text-sm font-medium py-2" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Templates
                  </Link>
                  <Link 
                    to="/generator" 
                    className="text-sm font-medium py-2" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Generator
                  </Link>
                  <Link 
                    to="/chat" 
                    className="text-sm font-medium py-2" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Chat
                  </Link>
                </>
              )}
              <Link 
                to="/about" 
                className="text-sm font-medium py-2" 
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-2 border-t">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigate('/dashboard');
                        setMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigate('/auth');
                        setMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate('/auth');
                        setMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
