
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, History, MessageSquare } from 'lucide-react';
import CopyGenerator from '@/components/CopyGenerator';
import CampaignChat from '@/components/CampaignChat';

interface MarketingAssistantProps {
  toggleHistory: () => void;
}

const MarketingAssistant: React.FC<MarketingAssistantProps> = ({ toggleHistory }) => {
  return (
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
  );
};

export default MarketingAssistant;
