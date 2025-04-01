
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, History, Settings, MessageSquare, Copy, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Campaign, getUserCampaigns, saveCampaign, deleteCampaign } from '@/lib/auth';
import CopyGenerator from '@/components/CopyGenerator';
import CampaignChat from '@/components/CampaignChat';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showHistory, setShowHistory] = useState(true); // Show history by default
  
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

  const handleDeleteCampaign = (id: string) => {
    if (deleteCampaign(id)) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(null);
      }
      toast({
        title: "Campaign deleted",
        description: "Your campaign has been deleted successfully"
      });
    } else {
      toast({
        title: "Error deleting campaign",
        description: "Failed to delete the campaign",
        variant: "destructive"
      });
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Marketing Assistant</CardTitle>
                  <CardDescription>
                    Generate copy or chat with your AI marketing assistant
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-auto" 
                  title="Toggle History"
                  onClick={toggleHistory}
                >
                  <History className="h-5 w-5" />
                </Button>
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
            
            {/* History Feature (New) */}
            <Card className={showHistory ? "" : "hidden"}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  <div>
                    <CardTitle>Campaign History</CardTitle>
                    <CardDescription>
                      View all your past marketing campaigns
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleHistory}
                >
                  {showHistory ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              
              <CardContent>
                {campaigns.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {campaigns.map((campaign) => (
                          <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.name}</TableCell>
                            <TableCell>{formatDate(campaign.date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewCampaign(campaign)}
                                  title="View"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteCampaign(campaign.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No campaigns found</p>
                    <Button variant="link" className="mt-2" onClick={() => navigate('/generator')}>
                      Create your first campaign
                    </Button>
                  </div>
                )}
              </CardContent>
              
              {selectedCampaign && (
                <CardContent className="border-t pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{selectedCampaign.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created: {formatDate(selectedCampaign.date)}
                      </p>
                    </div>
                    <div className="rounded-md border p-4 bg-muted/50">
                      <pre className="whitespace-pre-wrap break-words text-sm">{selectedCampaign.content}</pre>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCampaign(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
            
            {/* Quick Actions and Campaigns Section */}
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
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="Edit"
                            onClick={() => handleViewCampaign(campaign)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="Delete"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                          >
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
