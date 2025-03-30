
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Form state for login
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Form state for signup
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle signup form changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Mock authentication - in a real app, this would call an API
    setTimeout(() => {
      // Store user info in localStorage for persistence
      localStorage.setItem('user', JSON.stringify({ 
        email: loginData.email,
        name: loginData.email.split('@')[0],
        isLoggedIn: true
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome back to CopyBloom!",
      });
      
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  // Handle signup submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Mock signup - in a real app, this would call an API
    setTimeout(() => {
      // Store user info in localStorage for persistence
      localStorage.setItem('user', JSON.stringify({ 
        email: signupData.email,
        name: signupData.name,
        isLoggedIn: true
      }));
      
      toast({
        title: "Account created",
        description: "Welcome to CopyBloom!",
      });
      
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-4 border-b">
        <div className="container flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-purple" />
            <span className="text-xl font-bold gradient-text">CopyBloom</span>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome to CopyBloom</CardTitle>
                <CardDescription>
                  Sign in to access your AI-powered marketing tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email" 
                          name="email" 
                          type="email" 
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input 
                          id="login-password" 
                          name="password" 
                          type="password" 
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignupSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input 
                          id="signup-name" 
                          name="name" 
                          type="text" 
                          placeholder="John Doe"
                          value={signupData.name}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input 
                          id="signup-email" 
                          name="email" 
                          type="email" 
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input 
                          id="signup-password" 
                          name="password" 
                          type="password" 
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                        <Input 
                          id="signup-confirm-password" 
                          name="confirmPassword" 
                          type="password" 
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
