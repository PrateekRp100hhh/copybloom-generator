
import React from 'react';
import { Campaign } from '@/lib/auth';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CampaignDetailProps {
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  formatDate: (dateString: string) => string;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({
  selectedCampaign,
  setSelectedCampaign,
  formatDate
}) => {
  if (!selectedCampaign) return null;

  return (
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
  );
};

export default CampaignDetail;
