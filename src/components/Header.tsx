
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Menu, X } from 'lucide-react';

interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
          <Link to="/templates" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Templates
          </Link>
          <Link to="/generator" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Generator
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-brand-purple transition-colors">
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
          {user ? (
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
                onClick={() => {
                  localStorage.removeItem('user');
                  setUser(null);
                  navigate('/');
                }}
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
                to="/about" 
                className="text-sm font-medium py-2" 
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-2 border-t">
                {user ? (
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
                        localStorage.removeItem('user');
                        setUser(null);
                        navigate('/');
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
