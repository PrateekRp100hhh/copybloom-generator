
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, History, Settings, MessageSquare, Copy } from 'lucide-react';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import CopyGenerator from '@/components/CopyGenerator';
import CampaignChat from '@/components/CampaignChat';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please login to access the dashboard",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    // Get user data
    setUser(getCurrentUser());
  }, [navigate]);

  const recentCampaigns = [
    { id: 1, name: "Summer Sale Email", date: "2023-06-15" },
    { id: 2, name: "Product Launch Page", date: "2023-05-28" },
    { id: 3, name: "Holiday Newsletter", date: "2023-04-10" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {user && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
              <p className="text-muted-foreground">Manage your marketing copy and campaigns</p>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Create new content or manage existing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" onClick={() => navigate('/generator')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Copy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/templates')}>
                  <Copy className="mr-2 h-4 w-4" />
                  Templates
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Marketing Assistant</CardTitle>
                <CardDescription>
                  Generate copy or chat with your AI marketing assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="generate">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Generate Copy
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="chat" className="mt-4">
                    <CampaignChat />
                  </TabsContent>
                  <TabsContent value="generate" className="mt-4">
                    <CopyGenerator />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>
                  View and edit your recent marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCampaigns.map(campaign => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">Created: {campaign.date}</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                  
                  {recentCampaigns.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recent campaigns found</p>
                      <Button variant="link" className="mt-2" onClick={() => navigate('/generator')}>
                        Create your first campaign
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container px-4 md:px-6">
          <p className="text-sm text-center text-muted-foreground">
            © {new Date().getFullYear()} CopyBloom. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
