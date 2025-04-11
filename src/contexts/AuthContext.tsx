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
          // Save to localStorage to preserve user identity
          localStorage.setItem('currentUser', JSON.stringify(appUser));
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          // On explicit sign out
          const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (savedUser.id) {
            // Keep user reference but mark as not logged in
            savedUser.isLoggedIn = false;
            localStorage.setItem('currentUser', JSON.stringify(savedUser));
          }
          setUser(null);
          setIsLoading(false);
        } else {
          // Check for saved user data
          const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (savedUser.id && !savedUser.isLoggedIn) {
            // We have a user that was previously logged out
            // Keep null for auth state, but user data still accessible for history
            setUser(null);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else {
          // Check if we have a user in localStorage
          const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (savedUser.id && savedUser.isLoggedIn) {
            // Try to restore session if we have a user that thinks they're logged in
            const refreshed = await supabase.auth.refreshSession();
            if (refreshed.data.session) {
              const currentUser = await getCurrentUser();
              setUser(currentUser);
            } else {
              // Session couldn't be refreshed, mark user as logged out
              savedUser.isLoggedIn = false;
              localStorage.setItem('currentUser', JSON.stringify(savedUser));
              setUser(null);
            }
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
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
      // Check for existing account using OTP which is safer than 
      // attempting a signin with a dummy password
      const { data, error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });
      
      // If OTP is successful, an email exists
      if (data?.user || (otpError && otpError.message.includes('already'))) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // If we get here, proceed with signup
      const user = await signup(name, email, password);
      setUser(user);
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      navigate('/dashboard');
    } catch (error: any) {
      // Handle errors with more details
      if (error.message?.includes('already') || error.message?.includes('duplicate') || error.message?.includes('exists')) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error creating account",
          description: error.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
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
