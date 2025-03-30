
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-purple" />
          <Link to="/" className="text-xl font-bold">
            <span className="gradient-text">CopyBloom</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Home
          </Link>
          <Link to="/templates" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Templates
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-brand-purple transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
