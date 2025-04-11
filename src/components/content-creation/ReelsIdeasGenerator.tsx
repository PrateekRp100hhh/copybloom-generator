
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Copy, Film, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateGeminiContent } from '@/lib/ai';

const ReelsIdeasGenerator: React.FC = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reelsIdeas, setReelsIdeas] = useState<string[]>([]);
  const { toast } = useToast();

  const generateReelsIdeas = async () => {
    if (!videoTitle.trim()) {
      setError('Please enter a video title or description');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const prompt = `
        Generate 5 creative short-form video ideas (15-60 seconds each) based on this YouTube video concept: "${videoTitle}".
        Each idea should include:
        1. A catchy hook/title
        2. A brief 15-second script outline
        3. The key message or takeaway
        
        Format each idea with emoji bullets and make them engaging for social media.
        Focus on creating viral-worthy content for Instagram Reels or TikTok that would complement the main video.
      `;
      
      const response = await generateGeminiContent(prompt);
      
      // Split the response into individual ideas
      const ideas = response
        .split(/(?=📱|🎬|✨|🔥|💡|#\d+)/)
        .filter(idea => idea.trim().length > 0);
      
      setReelsIdeas(ideas);
    } catch (error: any) {
      console.error('Error generating reels ideas:', error);
      setError(error.message || 'Failed to generate reels ideas');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The reel idea has been copied to your clipboard',
    });
  };

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(reelsIdeas.join('\n\n---\n\n'));
    toast({
      title: 'All ideas copied',
      description: 'All reel ideas have been copied to your clipboard',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-accent/30 p-4 rounded-lg">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Film className="h-5 w-5 mr-2 text-primary" />
          Reels Ideas Generator
        </h2>
        <p className="text-sm text-muted-foreground">
          Turn your YouTube video concepts into engaging short-form content ideas
          for Instagram Reels, TikTok, and YouTube Shorts.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="videoTitle">Video Title or Description</Label>
          <Input
            id="videoTitle"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Enter your YouTube video title or concept"
            className="mt-1.5"
          />
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <Button 
          onClick={generateReelsIdeas} 
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
              Generate Reels Ideas
            </span>
          )}
        </Button>
      </div>

      {reelsIdeas.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Generated Reels Ideas</h3>
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
          
          <div className="space-y-3">
            {reelsIdeas.map((idea, index) => (
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
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: idea.replace(/\n/g, '<br />') }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button
            onClick={generateReelsIdeas}
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

export default ReelsIdeasGenerator;
