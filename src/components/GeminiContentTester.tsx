
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateGeminiContent } from '@/lib/ai';

const GeminiContentTester: React.FC = () => {
  const [input, setInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateContent = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate content from.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const content = await generateGeminiContent(input);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Gemini Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="user-input" className="text-sm font-medium">
            Your Input
          </label>
          <Textarea
            id="user-input"
            placeholder="Enter your content request here..."
            className="min-h-[100px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {generatedContent && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">Generated Content</h3>
            <div className="p-4 rounded-md bg-accent/30 whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateContent} 
          disabled={loading || !input.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeminiContentTester;
