
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
    <header className="py-4 border-b border-gray-200 bg-white">
      <div className="container px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1">
            <Sparkles className="h-5 w-5 text-[#4338ca]" />
            <span className="text-xl font-bold text-[#1a103d]">CopyBloom</span>
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
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-[#4338ca] transition-colors">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/templates" className="text-sm font-medium text-gray-600 hover:text-[#4338ca] transition-colors">
                Templates
              </Link>
              <Link to="/generator" className="text-sm font-medium text-gray-600 hover:text-[#4338ca] transition-colors">
                Generator
              </Link>
              <Link to="/chat" className="text-sm font-medium text-gray-600 hover:text-[#4338ca] transition-colors">
                Chat
              </Link>
            </>
          )}
          <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-[#4338ca] transition-colors">
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
                className="border-gray-300 hover:bg-gray-50"
              >
                Dashboard
              </Button>
              <Button 
                size="sm"
                onClick={logout}
                className="bg-[#4338ca] hover:bg-[#3730a3]"
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
                className="border-gray-300 hover:bg-gray-50"
              >
                Login
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/auth')}
                className="bg-[#4338ca] hover:bg-[#3730a3]"
              >
                Get Started — It's Free
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 bg-white border-b shadow-lg md:hidden">
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
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="bg-[#4338ca] hover:bg-[#3730a3]"
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
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate('/auth');
                        setMenuOpen(false);
                      }}
                      className="bg-[#4338ca] hover:bg-[#3730a3]"
                    >
                      Get Started — It's Free
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
