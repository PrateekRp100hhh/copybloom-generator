
import React from 'react';
import { Campaign, deleteCampaign } from '@/lib/auth';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface CampaignHistoryProps {
  campaigns: Campaign[];
  showHistory: boolean;
  toggleHistory: () => void;
  handleViewCampaign: (campaign: Campaign) => void;
  handleDeleteCampaign: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const CampaignHistory: React.FC<CampaignHistoryProps> = ({
  campaigns,
  showHistory,
  toggleHistory,
  handleViewCampaign,
  handleDeleteCampaign,
  formatDate
}) => {
  const navigate = useNavigate();
  
  return (
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
    </Card>
  );
};

export default CampaignHistory;
