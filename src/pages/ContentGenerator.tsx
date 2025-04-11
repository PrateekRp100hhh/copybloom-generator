
import React from 'react';
import Header from '@/components/Header';
import ContentGenerator from '@/components/YoutubeScriptGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ContentGeneratorPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Content Generator</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Engaging Content</CardTitle>
                <CardDescription>
                  Fill in the basic details about your content, and our AI will auto-generate an engaging script using the Hook-Content-Outro framework with advanced storytelling. Each key point will follow a 5-step storytelling structure for maximum audience engagement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentGenerator />
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

export default ContentGeneratorPage;
