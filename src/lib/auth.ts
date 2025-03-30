
// A simple auth implementation using localStorage
// In a production app, this would connect to a real authentication service

interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, accept any email/password
      // In production, this would validate against a real backend
      if (email && password) {
        const user: User = {
          id: generateUserId(),
          name: email.split('@')[0],
          email: email,
          isLoggedIn: true
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
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
        const user: User = {
          id: generateUserId(),
          name: name,
          email: email,
          isLoggedIn: true
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('All fields are required'));
      }
    }, 800);
  });
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('user');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('user') !== null;
};

// Helper function to generate a pseudo-random user ID
const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
