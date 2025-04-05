
import React from 'react';
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import GeminiContentTester from '@/components/GeminiContentTester';

const GeminiGenerator: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Gemini Content Generator</h1>
          <p className="text-muted-foreground mb-8">
            Generate AI-powered content using Gemini, with style matching based on training data.
          </p>
          
          <GeminiContentTester />
        </div>
      </main>
    </div>
  );
};

export default GeminiGenerator;
