
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignChat from '@/components/CampaignChat';
import { toast } from '@/components/ui/use-toast';

interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [recentCampaigns] = useState([
    { id: 1, name: 'Summer Sale Email', type: 'email', date: 'May 15, 2023' },
    { id: 2, name: 'Product Launch', type: 'landing page', date: 'Jun 2, 2023' },
    { id: 3, name: 'Holiday Promotion', type: 'social media', date: 'Jul 10, 2023' },
  ]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Dashboard Main Content */}
            <div className="lg:w-2/3 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">12</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      AI Generations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">156</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Templates Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">8</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>
                    Your most recently created marketing campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCampaigns.map(campaign => (
                      <div 
                        key={campaign.id} 
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {campaign.type} • {campaign.date}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-4">
                <Button onClick={() => navigate('/generator')}>
                  Create New Campaign
                </Button>
                <Button variant="outline" onClick={() => navigate('/templates')}>
                  Browse Templates
                </Button>
              </div>
            </div>
            
            {/* AI Chat Panel */}
            <div className="lg:w-1/3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>AI Campaign Assistant</CardTitle>
                  <CardDescription>
                    Ask questions or get help with your campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[600px]">
                  <CampaignChat />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
