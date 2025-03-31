// A simple auth implementation using localStorage
// In a production app, this would connect to a real authentication service

interface User {
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

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, accept any email/password
      // In production, this would validate against a real backend
      if (email && password) {
        // First check if user exists
        const existingUsers = getUsersFromStorage();
        const existingUser = existingUsers.find(u => u.email === email);
        
        if (existingUser) {
          // In a real app, we would verify the password here
          const user: User = {
            ...existingUser,
            isLoggedIn: true
          };
          
          // Store in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          // For demo, we'll create a user if they don't exist
          const user: User = {
            id: generateUserId(),
            name: email.split('@')[0],
            email: email,
            isLoggedIn: true,
            createdAt: new Date().toISOString()
          };
          
          // Save to users collection and set as current user
          const users = getUsersFromStorage();
          users.push(user);
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          resolve(user);
        }
      } else {
        reject(new Error('Email and password are required'));
      }
    }, 800);
  });
};

export const signup = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // In production, this would create a new user in a database
      if (name && email && password) {
        // Check if user already exists
        const existingUsers = getUsersFromStorage();
        if (existingUsers.some(u => u.email === email)) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        const user: User = {
          id: generateUserId(),
          name: name,
          email: email,
          isLoggedIn: true,
          createdAt: new Date().toISOString()
        };
        
        // Save to users collection and set as current user
        existingUsers.push(user);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        resolve(user);
      } else {
        reject(new Error('All fields are required'));
      }
    }, 800);
  });
};

export const logout = (): void => {
  // Remove current user but keep in users list
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('currentUser') !== null;
};

// Save campaign to localStorage
export const saveCampaign = (campaign: Omit<Campaign, 'id' | 'userId' | 'date'>): Campaign => {
  const user = getCurrentUser();
  if (!user) {
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
  const user = getCurrentUser();
  if (!user) return [];
  
  const allCampaigns = getCampaignsFromStorage();
  return allCampaigns.filter(c => c.userId === user.id);
};

// Delete a campaign by ID
export const deleteCampaign = (id: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const campaigns = getCampaignsFromStorage();
  const updatedCampaigns = campaigns.filter(c => c.id !== id);
  
  if (updatedCampaigns.length === campaigns.length) {
    return false; // No campaign was deleted
  }
  
  localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
  return true;
};

// Helper functions
const getUsersFromStorage = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

const getCampaignsFromStorage = (): Campaign[] => {
  const campaigns = localStorage.getItem('campaigns');
  return campaigns ? JSON.parse(campaigns) : [];
};

const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
