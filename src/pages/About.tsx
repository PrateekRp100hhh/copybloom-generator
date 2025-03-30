
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">About CopyBloom</h1>
              <p className="text-xl text-muted-foreground">
                The future of AI-powered marketing copy generation
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg mx-auto">
                <p>
                  CopyBloom was created with a simple mission: to make professional marketing copy accessible to everyone. 
                  We believe that great marketing shouldn't be limited by writing skills or budget constraints.
                </p>
                
                <h2>Our Technology</h2>
                <p>
                  Powered by state-of-the-art AI language models, CopyBloom generates human-quality marketing copy customized 
                  to your specific needs. Our platform uses Gemini 2.0 Flash to create compelling, persuasive content in seconds.
                </p>
                
                <h2>How It Works</h2>
                <p>
                  Using CopyBloom is simple. Just tell us about your campaign, target audience, key message, desired tone, 
                  and call-to-action. Our AI will generate custom copy that you can use immediately or fine-tune to match your exact needs.
                </p>
                
                <h2>Integration</h2>
                <p>
                  CopyBloom seamlessly integrates with your marketing workflow. Generate copy for landing pages, emails, 
                  social media posts, ads, and more — then export it directly to your preferred platform or use our templates 
                  to create ready-to-deploy marketing materials.
                </p>
                
                <div className="bg-brand-purple-light p-6 rounded-lg my-8">
                  <h3 className="text-xl font-medium text-brand-purple mb-2">Ready to transform your marketing?</h3>
                  <p className="mb-4">
                    Join thousands of marketers who are saving time and increasing conversions with AI-generated copy.
                  </p>
                  <Link to="/generator">
                    <Button className="group">
                      Try CopyBloom Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                
                <h2>Our Vision</h2>
                <p>
                  We envision a future where marketers and business owners can focus on strategy and creativity, 
                  while AI handles the heavy lifting of content creation. CopyBloom is just the beginning of this journey.
                </p>
                
                <p>
                  Whether you're a solo entrepreneur, small business owner, or part of a marketing team, 
                  CopyBloom is designed to help you create more effective marketing materials in less time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold gradient-text">CopyBloom</span>
            </div>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CopyBloom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
