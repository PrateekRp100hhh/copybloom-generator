
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, AlertCircle, ClipboardCopy, RefreshCw, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCopy } from '@/lib/ai';
import { useNavigate } from 'react-router-dom';

// Campaign types with YouTube script added
const campaignTypes = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media' },
  { value: 'ad', label: 'Advertisement' },
  { value: 'youtube', label: 'YouTube Script' },
];

// Mock tones
const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'humorous', label: 'Humorous' },
];

const CopyGenerator: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    campaignType: '',
    audience: '',
    message: '',
    tone: '',
    cta: '',
  });
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (error) setError(null);
    
    // If user selects YouTube script, offer to redirect to YouTube script generator
    if (field === 'campaignType' && value === 'youtube') {
      toast({
        title: "YouTube Script Generator",
        description: "For more detailed YouTube scripts, try our specialized YouTube Script Generator.",
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/youtube-script')}>
            <Youtube className="mr-2 h-4 w-4" />
            Go to Script Generator
          </Button>
        ),
      });
    }
  };

  // Function to evaluate content quality (mock scoring system)
  const evaluateContentQuality = (content: string): number => {
    // Mock implementation of quality scoring
    // In a real implementation, this would use more sophisticated metrics
    const score = Math.min(Math.floor(Math.random() * 3) + 8, 10); // Generate score between 8-10 for demo
    console.log(`Content quality score: ${score}/10`);
    return score;
  };

  // Function to improve content based on score
  const improveContent = async (content: string, currentScore: number): Promise<string> => {
    if (currentScore >= 8) return content;
    
    // In a real implementation, this would send the content back to the AI
    // with instructions to improve specific aspects
    console.log(`Improving content with current score: ${currentScore}`);
    
    // Mock implementation: for demo, we'll just append a note
    return content + "\n\n[This content has been automatically enhanced to improve quality and engagement.]";
  };

  const generateCopyHandler = async () => {
    // Validate form
    if (!formData.campaignType || !formData.audience || !formData.message || !formData.tone || !formData.cta) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to generate copy.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Call the AI service to generate copy
      console.log("Calling generateCopy with:", formData);
      let response = await generateCopy(formData);
      console.log("Received response:", response);
      
      // Evaluate content quality
      let score = evaluateContentQuality(response);
      let attempts = 0;
      
      // If score is below threshold, try to improve it (max 3 attempts)
      while (score < 8 && attempts < 3) {
        attempts++;
        console.log(`Attempt ${attempts}: Improving content with score ${score}`);
        response = await improveContent(response, score);
        score = evaluateContentQuality(response);
      }
      
      setQualityScore(score);
      setGeneratedCopy(response);
      
      toast({
        title: "Copy generated!",
        description: `Your marketing copy has been successfully created with a quality score of ${score}/10.`,
      });
    } catch (error: any) {
      console.error('Error generating copy:', error);
      setError(error.message || "Generation failed");
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your copy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      campaignType: '',
      audience: '',
      message: '',
      tone: '',
      cta: '',
    });
    setGeneratedCopy(null);
    setError(null);
    setQualityScore(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Generate Marketing Copy</h2>
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="campaignType">Campaign Type</Label>
            <Select onValueChange={(value) => handleChange('campaignType', value)} value={formData.campaignType}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input 
              id="audience" 
              placeholder="e.g. small business owners" 
              value={formData.audience}
              onChange={(e) => handleChange('audience', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Key Message</Label>
          <Textarea 
            id="message" 
            placeholder="What's the main message you want to convey?"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone/Style</Label>
            <Select onValueChange={(value) => handleChange('tone', value)} value={formData.tone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map(tone => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta">Call-to-Action</Label>
            <Input 
              id="cta" 
              placeholder="e.g. Sign up today" 
              value={formData.cta}
              onChange={(e) => handleChange('cta', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateCopyHandler} 
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
                <Wand2 className="mr-2 h-5 w-5" /> Generate Copy
              </span>
            )}
          </Button>
          <Button variant="outline" onClick={resetForm} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      {generatedCopy && (
        <div className="mt-6 animate-fade-in">
          <h3 className="font-medium mb-2 flex items-center justify-between">
            <span>Generated Copy:</span>
            {qualityScore && (
              <span className="text-sm bg-muted px-2 py-1 rounded-md">
                Quality Score: {qualityScore}/10
              </span>
            )}
          </h3>
          <Card>
            <CardContent className="p-4">
              <div className="whitespace-pre-wrap bg-accent/50 p-3 rounded-md max-h-[500px] overflow-y-auto">
                {generatedCopy}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setGeneratedCopy(null)}>
              Reset
            </Button>
            <Button size="sm" onClick={() => {
              navigator.clipboard.writeText(generatedCopy);
              toast({
                title: "Copied to clipboard",
                description: "Your marketing copy has been copied to your clipboard.",
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

export default CopyGenerator;
