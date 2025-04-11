
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentGenerator from '@/components/ContentGenerator';
import ReelsIdeasGenerator from '@/components/content-creation/ReelsIdeasGenerator';
import VideoIdeasGenerator from '@/components/content-creation/VideoIdeasGenerator';
import { Film, Sparkles, Youtube } from 'lucide-react';

const ContentCreation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Content Creation</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Engaging Content</CardTitle>
                <CardDescription>
                  Generate scripts, reels ideas, and video concepts for your social media channels. Each tool is optimized to help you create engaging content that resonates with your audience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="youtube" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="youtube" className="flex items-center">
                      <Youtube className="mr-2 h-4 w-4" />
                      Content Script
                    </TabsTrigger>
                    <TabsTrigger value="reels" className="flex items-center">
                      <Film className="mr-2 h-4 w-4" />
                      Reels Ideas
                    </TabsTrigger>
                    <TabsTrigger value="ideas" className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Video Ideas
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="youtube">
                    <ContentGenerator />
                  </TabsContent>
                  
                  <TabsContent value="reels">
                    <ReelsIdeasGenerator />
                  </TabsContent>
                  
                  <TabsContent value="ideas">
                    <VideoIdeasGenerator />
                  </TabsContent>
                </Tabs>
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

export default ContentCreation;
