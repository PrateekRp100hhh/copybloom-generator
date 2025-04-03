
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MessageSquare, Youtube, Check } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import CopyGenerator from '@/components/CopyGenerator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-white border-b">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-5">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 w-fit">
                  AI-Powered Copywriting
                </span>
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                    Generate Marketing Copy with AI in Seconds
                  </h1>
                  <p className="text-gray-600 md:text-lg">
                    Transform your marketing campaigns with AI-powered copy that converts. Perfect for landing pages, emails, ads, and more.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link to="/generator">
                    <Button size="lg" className="group bg-blue-600 hover:bg-blue-700 rounded-md">
                      Create Copy Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50 rounded-md">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat with AI
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:pl-10">
                <div className="rounded-xl overflow-hidden shadow-md border bg-white p-6">
                  <CopyGenerator />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New YouTube Script Generator Section */}
        <section className="py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-5 items-center">
              <div className="lg:col-span-3 space-y-4">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 mb-2">
                  New Feature
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Viral YouTube Scripts</h2>
                <p className="text-gray-600">
                  Generate professional, attention-grabbing scripts for your YouTube videos in seconds. 
                  Our AI-powered script generator helps you create content that engages your audience and drives views.
                </p>
                <Link to="/youtube-script">
                  <Button className="mt-2 bg-blue-600 hover:bg-blue-700 rounded-md">
                    <Youtube className="mr-2 h-4 w-4" /> Try YouTube Script Generator
                  </Button>
                </Link>
              </div>
              <div className="lg:col-span-2">
                <div className="relative aspect-video rounded-lg overflow-hidden border shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0" 
                    alt="YouTube Script Generator" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <div className="flex items-center">
                        <Youtube className="h-6 w-6 mr-2 text-red-500" />
                        <span className="font-medium">Script Generator</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose CopyBloom?</h2>
              <p className="text-gray-600 mt-2 md:text-lg">
                Powerful AI marketing copy generation with seamless integration
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Lightning Fast</h3>
                <p className="text-gray-600">
                  Generate professional marketing copy in seconds, not hours.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Customizable</h3>
                <p className="text-gray-600">
                  Tailor your copy to specific audiences, tones, and campaign goals.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Ready to Deploy</h3>
                <p className="text-gray-600">
                  Seamlessly integrate generated copy into your marketing materials.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">CopyBloom</span>
            </div>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} CopyBloom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
