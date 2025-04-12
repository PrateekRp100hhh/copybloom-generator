
// Authentication library using Supabase
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  createdAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  content: string;
  date: string;
  userId: string;
}

export const login = async (email: string, password: string): Promise<AppUser> => {
  try {
    console.log("Login attempt for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error("Login error from Supabase:", error);
      throw new Error(error.message);
    }
    
    if (!data.user) {
      console.error("Login failed - no user returned");
      throw new Error('Login failed');
    }

    console.log("Login successful for:", email);
    // Create an AppUser object from Supabase user
    const appUser: AppUser = {
      id: data.user.id,
      name: data.user.user_metadata?.name || email.split('@')[0],
      email: data.user.email || '',
      isLoggedIn: true,
      createdAt: data.user.created_at
    };
    
    // Save user to localStorage for offline access to campaigns
    localStorage.setItem('currentUser', JSON.stringify(appUser));
    
    return appUser;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signup = async (name: string, email: string, password: string): Promise<AppUser> => {
  try {
    console.log("Signup attempt for:", email);
    // Try to sign up directly - Supabase will handle if the email already exists
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) {
      console.error("Signup error from Supabase:", error);
      // Check if the error is due to duplicate email
      if (error.message.includes('already') || error.message.includes('exists')) {
        throw new Error('An account with this email already exists');
      }
      throw new Error(error.message);
    }
    
    // Check if the user needs to confirm their email
    if (data.user && !data.session) {
      console.log("Signup successful but email confirmation required");
      throw new Error('Please check your email to confirm your account');
    }
    
    if (!data.user) {
      console.error("Signup failed - no user returned");
      throw new Error('Signup failed');
    }

    console.log("Signup successful for:", email);
    // Create an AppUser object from Supabase user
    const appUser: AppUser = {
      id: data.user.id,
      name: name,
      email: data.user.email || '',
      isLoggedIn: true,
      createdAt: data.user.created_at
    };
    
    // Save user to localStorage for offline access to campaigns
    localStorage.setItem('currentUser', JSON.stringify(appUser));
    
    return appUser;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Keep the user data in localStorage for campaign access
    // But mark as not logged in by setting a flag
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      currentUser.isLoggedIn = false;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = async (): Promise<AppUser | null> => {
  try {
    console.log("Getting current user from session");
    const { data } = await supabase.auth.getSession();
    
    if (!data.session?.user) {
      console.log("No active session found");
      return null;
    }
    
    const user = data.session.user;
    console.log("Found user in session:", user.email);
    
    // Create AppUser object
    const appUser: AppUser = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || '',
      email: user.email || '',
      isLoggedIn: true,
      createdAt: user.created_at
    };
    
    // Update localStorage with the current user data
    localStorage.setItem('currentUser', JSON.stringify(appUser));
    
    return appUser;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Campaign functions - these will need to be updated to use Supabase in a future update
// For now, we'll keep using localStorage to minimize changes

// Save campaign to localStorage
export const saveCampaign = (campaign: Omit<Campaign, 'id' | 'userId' | 'date'>): Campaign => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!user?.id) {
    throw new Error('User must be logged in to save campaigns');
  }
  
  const newCampaign: Campaign = {
    ...campaign,
    id: generateUserId(),
    userId: user.id,
    date: new Date().toISOString()
  };
  
  const campaigns = getCampaignsFromStorage();
  campaigns.push(newCampaign);
  localStorage.setItem('campaigns', JSON.stringify(campaigns));
  
  return newCampaign;
};

// Get all campaigns for current user
export const getUserCampaigns = (): Campaign[] => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!user?.id) return [];
  
  const allCampaigns = getCampaignsFromStorage();
  return allCampaigns.filter(c => c.userId === user.id);
};

// Delete a campaign by ID
export const deleteCampaign = (id: string): boolean => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!user?.id) return false;
  
  const campaigns = getCampaignsFromStorage();
  const updatedCampaigns = campaigns.filter(c => c.id !== id);
  
  if (updatedCampaigns.length === campaigns.length) {
    return false; // No campaign was deleted
  }
  
  localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
  return true;
};

// Helper functions
const getCampaignsFromStorage = (): Campaign[] => {
  const campaigns = localStorage.getItem('campaigns');
  return campaigns ? JSON.parse(campaigns) : [];
};

const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
