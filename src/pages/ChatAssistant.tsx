
import React from 'react';
import Header from '@/components/Header';
import CampaignChat from '@/components/CampaignChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ChatAssistant = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">AI Marketing Assistant</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Chat with your AI Assistant</CardTitle>
                <CardDescription>
                  Ask questions, get marketing advice, or request content edits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CampaignChat />
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

export default ChatAssistant;
