
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/lib/auth';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CampaignsListProps {
  campaigns: Campaign[];
  formatDate: (dateString: string) => string;
  handleViewCampaign: (campaign: Campaign) => void;
  handleDeleteCampaign: (id: string) => void;
}

const CampaignsList: React.FC<CampaignsListProps> = ({
  campaigns,
  formatDate,
  handleViewCampaign,
  handleDeleteCampaign
}) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default CampaignsList;
