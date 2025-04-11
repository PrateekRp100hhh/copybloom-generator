
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Copy, Loader2, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateGeminiContent } from '@/lib/ai';

type VideoIdea = {
  title: string;
  description: string;
  audience: string;
};

const VideoIdeasGenerator: React.FC = () => {
  const [niche, setNiche] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoIdeas, setVideoIdeas] = useState<VideoIdea[]>([]);
  const { toast } = useToast();

  const generateVideoIdeas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `
        You are Gemini, an AI content strategist.
        Generate 10 fresh and engaging YouTube video ideas ${niche !== 'general' ? `for the ${niche} niche` : 'across different niches'}.
        These ideas should be optimized for YouTube SEO and have viral potential.
        
        For each idea, provide:
        1. A catchy title that would work well for YouTube
        2. A brief description of what the video would cover (2-3 sentences)
        3. The target audience for this video
        
        Format the response in a way that can be easily parsed, with clear separations between each idea.
        Make the ideas specific, actionable, and trend-aware for 2024.
      `;
      
      const response = await generateGeminiContent(prompt);
      
      // Parse the response into structured video ideas
      // This is a simple parser that looks for numbered items and extracts the data
      const ideasText = response.split(/\d+[\.\)]\s+/).filter(text => text.trim().length > 0);
      
      const parsedIdeas: VideoIdea[] = ideasText.map(ideaText => {
        const lines = ideaText.split('\n').filter(line => line.trim());
        
        return {
          title: lines[0]?.replace(/^Title:?\s*/i, '').trim() || 'Untitled Video',
          description: lines.find(line => line.toLowerCase().includes('description') || !line.includes(':'))
            ?.replace(/^Description:?\s*/i, '')
            .trim() || '',
          audience: lines.find(line => line.toLowerCase().includes('audience') || line.toLowerCase().includes('target'))
            ?.replace(/^(Audience|Target( Audience)?):?\s*/i, '')
            .trim() || 'General audience',
        };
      });
      
      setVideoIdeas(parsedIdeas);
    } catch (error: any) {
      console.error('Error generating video ideas:', error);
      setError(error.message || 'Failed to generate video ideas');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (idea: VideoIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nAudience: ${idea.audience}`;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The video idea has been copied to your clipboard',
    });
  };

  const copyAllToClipboard = () => {
    const text = videoIdeas.map((idea, index) => 
      `${index + 1}. ${idea.title}\n${idea.description}\nAudience: ${idea.audience}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    toast({
      title: 'All ideas copied',
      description: 'All video ideas have been copied to your clipboard',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-accent/30 p-4 rounded-lg">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Gemini-Powered Video Ideas Generator
        </h2>
        <p className="text-sm text-muted-foreground">
          Get fresh video ideas optimized for YouTube SEO and audience engagement using Gemini AI.
          Filter by niche to get tailored suggestions for your channel.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="niche">Content Niche (Optional)</Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger id="niche" className="mt-1.5">
              <SelectValue placeholder="Select a niche (or leave empty for general ideas)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">All niches</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="food">Food & Cooking</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="fashion">Fashion & Beauty</SelectItem>
              <SelectItem value="tech">Tech & Reviews</SelectItem>
              <SelectItem value="finance">Finance & Money</SelectItem>
              <SelectItem value="fitness">Fitness & Health</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <Button 
          onClick={generateVideoIdeas} 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center">
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Video Ideas
            </span>
          )}
        </Button>
      </div>

      {videoIdeas.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Generated Video Ideas</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllToClipboard}
              className="flex items-center"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>
          
          <div className="grid gap-3 md:grid-cols-2">
            {videoIdeas.map((idea, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 relative">
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(idea)}
                      className="h-8 w-8"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="pr-8">
                    <h4 className="font-medium text-primary mb-1">{idea.title}</h4>
                    <p className="text-sm mb-2">{idea.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Audience:</span> {idea.audience}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button
            onClick={generateVideoIdeas}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Ideas
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoIdeasGenerator;
