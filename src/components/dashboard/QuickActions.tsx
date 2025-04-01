
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Settings, Copy, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/youtube-script')}>
          <Youtube className="mr-2 h-4 w-4" />
          YouTube Script
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
  );
};

export default QuickActions;
