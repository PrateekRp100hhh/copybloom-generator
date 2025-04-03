
import React from 'react';
import Header from '@/components/Header';
import YoutubeScriptGenerator from '@/components/YoutubeScriptGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const YoutubeScriptGeneratorPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">YouTube Script Generator</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Viral YouTube Scripts</CardTitle>
                <CardDescription>
                  Fill in the basic details about your video, and our AI will auto-generate engaging hook, content, and outro elements using the Hook-Story-Content-Outro framework for your next viral YouTube video.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <YoutubeScriptGenerator />
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

export default YoutubeScriptGeneratorPage;
