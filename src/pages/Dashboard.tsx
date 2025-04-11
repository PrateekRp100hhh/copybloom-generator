
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from '@/components/ui/menubar';
import { History, PlusCircle, FileText } from 'lucide-react';
import { Campaign, getUserCampaigns, deleteCampaign, saveCampaign } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Import dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MarketingAssistant from '@/components/dashboard/MarketingAssistant';
import CampaignHistory from '@/components/dashboard/CampaignHistory';
import CampaignDetail from '@/components/dashboard/CampaignDetail';
import QuickActions from '@/components/dashboard/QuickActions';
import CampaignsList from '@/components/dashboard/CampaignsList';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

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
      
      {/* Navigation Menubar */}
      <div className="border-b bg-background">
        <div className="container px-4 md:px-6">
          <Menubar className="border-none px-0">
            <MenubarMenu>
              <MenubarTrigger className="font-medium">Create</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => navigate('/generator')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Marketing Copy
                </MenubarItem>
                <MenubarItem onClick={() => navigate('/content-generator')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Content Generator
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="font-medium">
                <History className="mr-2 h-4 w-4" />
                History
              </MenubarTrigger>
              <MenubarContent>
                {campaigns.length > 0 ? (
                  campaigns.slice(0, 5).map((campaign) => (
                    <MenubarItem key={campaign.id} onClick={() => handleViewCampaign(campaign)}>
                      {campaign.name}
                    </MenubarItem>
                  ))
                ) : (
                  <MenubarItem disabled>No history found</MenubarItem>
                )}
                <MenubarItem onClick={() => setShowHistory(!showHistory)}>
                  {showHistory ? 'Hide History' : 'Show History'}
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <DashboardHeader user={user} />
          
          <div className="grid gap-6">
            {/* Marketing Assistant (Now First) */}
            <MarketingAssistant toggleHistory={toggleHistory} />
            
            {/* History Feature */}
            <CampaignHistory 
              campaigns={campaigns}
              showHistory={showHistory}
              toggleHistory={toggleHistory}
              handleViewCampaign={handleViewCampaign}
              handleDeleteCampaign={handleDeleteCampaign}
              formatDate={formatDate}
            />
            
            {/* Selected Campaign Detail */}
            {selectedCampaign && (
              <CampaignDetail 
                selectedCampaign={selectedCampaign} 
                setSelectedCampaign={setSelectedCampaign} 
                formatDate={formatDate} 
              />
            )}
            
            {/* Quick Actions and Campaigns Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <QuickActions />
              <CampaignsList 
                campaigns={campaigns} 
                formatDate={formatDate}
                handleViewCampaign={handleViewCampaign}
                handleDeleteCampaign={handleDeleteCampaign}
              />
            </div>
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
