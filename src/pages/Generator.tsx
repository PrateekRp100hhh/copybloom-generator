
import React from 'react';
import Header from '@/components/Header';
import CopyGenerator from '@/components/CopyGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Generator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">AI Copy Generator</h1>
            
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
                        title="Product Launch"
                        description="Perfect for new product announcements"
                        imgSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
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
  imgSrc
}: { 
  title: string; 
  description: string; 
  imgSrc: string;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
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
    </div>
  );
};

export default Generator;
