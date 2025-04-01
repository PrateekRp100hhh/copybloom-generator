
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, AlertCircle, ClipboardCopy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatWithAI } from '@/lib/ai';

const YoutubeScriptGenerator: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    audience: '',
    tone: '',
    duration: '5-10',
    style: 'educational',
  });
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const generateScriptHandler = async () => {
    // Validate form
    if (!formData.topic || !formData.audience || !formData.tone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to generate a script.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create a prompt for the YouTube script
      const prompt = `Generate a viral YouTube script for a ${formData.duration} minute ${formData.style} video about "${formData.topic}". 
      Target audience: ${formData.audience}. 
      Tone: ${formData.tone}.
      Include: an attention-grabbing hook, clear sections with timestamps, engaging questions for viewers, call to action, and memorable closing.
      Format the script with sections for INTRO, MAIN CONTENT (with 3-5 key points), and OUTRO.`;
      
      // Call the AI service to generate script
      console.log("Calling AI with prompt:", prompt);
      const response = await chatWithAI({ message: prompt });
      console.log("Received response:", response);
      
      setGeneratedScript(response);
      toast({
        title: "Script generated!",
        description: "Your YouTube script has been successfully created.",
      });
    } catch (error: any) {
      console.error('Error generating script:', error);
      setError(error.message || "Generation failed");
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      topic: '',
      audience: '',
      tone: '',
      duration: '5-10',
      style: 'educational',
    });
    setGeneratedScript(null);
    setError(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Generate YouTube Script</h2>
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Video Topic/Title <span className="text-red-500">*</span></Label>
          <Input 
            id="topic" 
            placeholder="e.g., 10 AI Tools That Will Replace Your Job" 
            value={formData.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience <span className="text-red-500">*</span></Label>
          <Input 
            id="audience" 
            placeholder="e.g., Tech enthusiasts, beginners, professionals" 
            value={formData.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone/Style <span className="text-red-500">*</span></Label>
            <Select onValueChange={(value) => handleChange('tone', value)} value={formData.tone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="entertaining">Entertaining</SelectItem>
                <SelectItem value="motivational">Motivational</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Video Duration</Label>
            <Select onValueChange={(value) => handleChange('duration', value)} value={formData.duration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">Short (1-3 minutes)</SelectItem>
                <SelectItem value="5-10">Medium (5-10 minutes)</SelectItem>
                <SelectItem value="15-20">Long (15-20 minutes)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="style">Video Style</Label>
            <Select onValueChange={(value) => handleChange('style', value)} value={formData.style}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="vlog">Vlog</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="commentary">Commentary</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateScriptHandler} 
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center">
                <Wand2 className="mr-2 h-5 w-5" /> Generate Script
              </span>
            )}
          </Button>
          <Button variant="outline" onClick={resetForm} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      {generatedScript && (
        <div className="mt-6 animate-fade-in">
          <h3 className="font-medium mb-2">Generated Script:</h3>
          <Card>
            <CardContent className="p-4">
              <div className="whitespace-pre-wrap bg-accent/50 p-3 rounded-md max-h-[500px] overflow-y-auto">
                {generatedScript}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setGeneratedScript(null)}>
              Reset
            </Button>
            <Button size="sm" onClick={() => {
              navigator.clipboard.writeText(generatedScript);
              toast({
                title: "Copied to clipboard",
                description: "Your script has been copied to your clipboard.",
              });
            }}>
              <ClipboardCopy className="h-4 w-4 mr-2" /> Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YoutubeScriptGenerator;
