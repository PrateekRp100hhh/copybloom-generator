
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CopyGenerator from '@/components/CopyGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, History, Film, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getUserCampaigns, Campaign } from '@/lib/auth';

const Generator = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    // Load user campaigns from localStorage
    const userCampaigns = getUserCampaigns();
    setCampaigns(userCampaigns);
  }, []);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">AI Copy Generator</h1>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleHistory} 
                title="Toggle History"
                className="ml-4"
              >
                <History className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="mb-6 bg-muted/30 rounded-lg p-4 border border-dashed flex items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium">New: Content Creation Suite</h3>
                    <p className="text-sm text-muted-foreground">Create professional content, reels ideas, and video concepts</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/content-creation">
                    <Button variant="secondary" size="sm" className="flex items-center">
                      <FileText className="mr-1.5 h-4 w-4" />
                      Content Generator
                    </Button>
                  </Link>
                  <Link to="/content-creation?tab=reels">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Film className="mr-1.5 h-4 w-4" />
                      Reels Ideas
                    </Button>
                  </Link>
                  <Link to="/content-creation?tab=ideas">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Sparkles className="mr-1.5 h-4 w-4" />
                      Video Ideas
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="ml-4">
                <Link to="/content-creation">
                  <Button>Try it now</Button>
                </Link>
              </div>
            </div>
            
            {showHistory && campaigns.length > 0 && (
              <div className="mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="flex items-center">
                        <History className="h-5 w-5 mr-2" />
                        Recent Campaigns
                      </CardTitle>
                      <CardDescription>
                        Your recently created campaigns
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto">
                      {campaigns.slice(0, 5).map((campaign) => (
                        <div key={campaign.id} className="border-b last:border-b-0 py-2 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{campaign.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {new Date(campaign.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Link to="/dashboard">
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-right">
                      <Link to="/dashboard">
                        <Button variant="link" size="sm">
                          View all campaigns
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generator">Generate Copy</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="generator">
                <Card>
                  <CardHeader>
                    <CardTitle>Marketing Copy Generator</CardTitle>
                    <CardDescription>
                      Fill in the form below to generate professional marketing copy for your campaign.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CopyGenerator />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="templates">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose a Template</CardTitle>
                    <CardDescription>
                      Select a template to customize with your generated copy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {/* Template Options */}
                      <TemplateCard 
                        title="Landing Page"
                        description="Classic landing page with header, features, and CTA"
                        imgSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                      />
                      <TemplateCard 
                        title="Email Campaign"
                        description="Professional email template with customizable sections"
                        imgSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                      />
                      <TemplateCard 
                        title="Social Post"
                        description="Eye-catching social media post template"
                        imgSrc="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
                      />
                      <TemplateCard 
                        title="YouTube Script"
                        description="Professional script template for viral videos"
                        imgSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                        link="/content-creation"
                      />
                      <TemplateCard 
                        title="Newsletter"
                        description="Multi-section newsletter layout"
                        imgSrc="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                      />
                      <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg p-6 text-center">
                        <div>
                          <p className="text-muted-foreground">Coming Soon</p>
                          <p className="text-sm text-muted-foreground">More templates in development</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
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

// Template Card Component
const TemplateCard = ({ 
  title, 
  description, 
  imgSrc,
  link
}: { 
  title: string; 
  description: string; 
  imgSrc: string;
  link?: string;
}) => {
  const Content = () => (
    <>
      <div className="relative h-36 overflow-hidden">
        <img 
          src={imgSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </>
  );

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {link ? (
        <Link to={link}>
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </div>
  );
};

export default Generator;
