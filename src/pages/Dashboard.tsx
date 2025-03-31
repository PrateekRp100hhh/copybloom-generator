
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, History, Settings, MessageSquare, Copy, Trash2, Edit } from 'lucide-react';
import { Campaign, getUserCampaigns, saveCampaign } from '@/lib/auth';
import CopyGenerator from '@/components/CopyGenerator';
import CampaignChat from '@/components/CampaignChat';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  useEffect(() => {
    // Load user campaigns from localStorage
    const userCampaigns = getUserCampaigns();
    setCampaigns(userCampaigns);
  }, []);

  const handleSaveCampaign = (name: string, content: string) => {
    try {
      const newCampaign = saveCampaign({ name, content });
      setCampaigns(prev => [...prev, newCampaign]);
      toast({
        title: "Campaign saved",
        description: "Your campaign has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving campaign",
        description: "Failed to save your campaign",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
          
          <div className="grid gap-6">
            {/* Marketing Assistant (Now First) */}
            <Card>
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
                    {/* Remove the onSave prop since it's not supported by the component */}
                    <CopyGenerator />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          
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
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/chat')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat Assistant
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Campaigns</CardTitle>
                    <CardDescription>
                      View and edit your saved marketing campaigns
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/generator')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map(campaign => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="overflow-hidden">
                          <h3 className="font-medium truncate">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">Created: {formatDate(campaign.date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {campaigns.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No campaigns found</p>
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
