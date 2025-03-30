
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Sliders } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const Templates = () => {
  const templates = [
    {
      id: 1,
      title: 'Product Landing Page',
      category: 'landing-page',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      placeholders: ['headline', 'description', 'features', 'cta'],
    },
    {
      id: 2,
      title: 'Newsletter Email',
      category: 'email',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      placeholders: ['subject', 'greeting', 'main-content', 'closing'],
    },
    {
      id: 3,
      title: 'Social Media Post',
      category: 'social',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      placeholders: ['hook', 'message', 'hashtags'],
    },
    {
      id: 4,
      title: 'App Promotion',
      category: 'landing-page',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      placeholders: ['headline', 'app-description', 'features', 'download-cta'],
    },
    {
      id: 5,
      title: 'Sales Email',
      category: 'email',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      placeholders: ['subject', 'pain-point', 'solution', 'offer', 'deadline'],
    },
    {
      id: 6,
      title: 'Product Hunt Launch',
      category: 'social',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      placeholders: ['tagline', 'problem', 'solution', 'unique-value', 'cta'],
    },
    {
      id: 7,
      title: 'Webinar Invitation',
      category: 'email',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      placeholders: ['subject', 'webinar-title', 'description', 'benefits', 'date-time', 'register-link'],
    },
    {
      id: 8,
      title: 'Blog Article',
      category: 'content',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      placeholders: ['title', 'intro', 'main-points', 'conclusion'],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'landing-page', name: 'Landing Pages' },
    { id: 'email', name: 'Email Templates' },
    { id: 'social', name: 'Social Media' },
    { id: 'content', name: 'Content' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Templates</h1>
              <p className="text-muted-foreground mt-1">
                Choose a template to use with your generated copy
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search templates..." 
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]" 
                />
              </div>
              <Button variant="outline" size="icon">
                <Sliders className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            {/* Categories */}
            <div className="flex overflow-auto pb-2 -mx-4 px-4 md:px-0 md:mx-0">
              {categories.map((category) => (
                <Button 
                  key={category.id}
                  variant={category.id === 'all' ? 'default' : 'outline'} 
                  className="mr-2 whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Link key={template.id} to="/generator">
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="relative h-48">
                      <img 
                        src={template.image} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-brand-purple text-white text-xs py-1 px-2 rounded-full">
                        {template.category === 'landing-page' ? 'Landing Page' :
                          template.category === 'email' ? 'Email' :
                          template.category === 'social' ? 'Social Media' : 'Content'}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{template.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.placeholders.length} content placeholders
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.placeholders.map((placeholder, idx) => (
                          <span key={idx} className="bg-accent text-xs py-1 px-2 rounded-full">
                            {placeholder}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Coming Soon Template */}
              <Card className="overflow-hidden h-full border-dashed">
                <div className="flex items-center justify-center h-48 bg-muted/30">
                  <p className="text-muted-foreground">More coming soon</p>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">Custom Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your own custom template
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
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

export default Templates;
