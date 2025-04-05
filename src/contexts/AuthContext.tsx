
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppUser, getCurrentUser, login, signup, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Transform Supabase user to our app user format
          const appUser: AppUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            isLoggedIn: true,
            createdAt: session.user.created_at
          };
          
          // Update state
          setUser(appUser);
          
          // Save to localStorage for backward compatibility
          localStorage.setItem('currentUser', JSON.stringify(appUser));
          
        } else {
          setUser(null);
          localStorage.removeItem('currentUser');
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // For backward compatibility, update localStorage
        if (currentUser) {
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error logging in",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await signup(name, email, password);
      setUser(user);
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error logging out",
        description: "An error occurred while logging out",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
